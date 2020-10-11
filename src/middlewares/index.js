import { readFbData } from "../utils/fb";
import { responseHandler, readPublicKey, newPublicKey, genPublic } from "../utils";
import jwt from "jsonwebtoken";

const checkConflict = async (req, res, next) => {
  let userInDb;
  await readFbData("users", async (users) => {
    Object.keys(users).map(async (key) => {
      if (users[key].email === email) userInDb = true;
    });
    if (!userInDb) {
      return next();
    }
    return responseHandler({ status: 400, message: "User with the given email already exist" }, res);
  });
};

const verifyMsToken = async (req, res, next) => {
  const idToken = req.headers.authorization;
  const { type } = req.body;

  type === "microsoft" &&
    readPublicKey(async (dta) => {
      await jwt.verify(idToken, genPublic(dta), { algorithms: ["RS256"] }, async (err, decoded) => {
        if (err) {
          console.log(err);
          const tkn = await newPublicKey();
          return await jwt.verify(idToken, genPublic(tkn), { algorithms: ["RS256"] }, async (err, decoded) => {
            if (err) {
              console.log(err);
              return responseHandler({ status: 400, message: "Invalid token" }, res);
            }
            req.msUser = decoded;
            return next();
          });
        }
        req.msUser = decoded;
        return next();
      });
    });
  type === "local" && next();
};
export { checkConflict, verifyMsToken };
