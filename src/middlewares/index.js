import { readFbData } from "../utils/fb";
import { responseHandler } from "../utils";
import jwt from "jsonwebtoken";

const { pubKey, secretKey } = process.env;
const publicKey = `-----BEGIN CERTIFICATE-----\n${pubKey}\n-----END CERTIFICATE-----`;

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
    (await jwt.verify(idToken, publicKey, { algorithms: ["RS256"] }, async (err, decoded) => {
      if (err) return responseHandler({ status: 400, message: "Invalid token" }, res);
      req.msUser = decoded;
      next();
    }));
  type === "local" && next();
};
export { checkConflict, verifyMsToken };
