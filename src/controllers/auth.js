import jwt from "jsonwebtoken";
import { writeFbData, readFbData } from "../utils/fb";

const { pubKey, secretKey } = process.env;
const publicKey = `-----BEGIN CERTIFICATE-----\n${pubKey}\n-----END CERTIFICATE-----`;

const signInController = async (req, res, next) => {
  let msUserInDb;
  const { type, email, password } = req.body;
  const idToken = req.headers.authorization;
  let token,
    responseObject = {};
  const genToken = async (data) => await jwt.sign(data, secretKey);
  const responseHandler = (resObj) => res.status(resObj.status || 204).send(resObj);
  try {
    type === "local" &&
      (await readFbData("users", (users) => {
        Object.keys(users).map(async (key) => {
          if (users[key].email === email || users[key].preferred_username === email) token = await genToken(email);
        });
        responseObject.message = "login successfully";
        responseObject.status = 200;
        responseObject.token = token;
        responseHandler(responseObject);
      }));
    type === "microsoft" &&
      (await jwt.verify(idToken, publicKey, { algorithms: ["RS256"] }, async (err, decoded) => {
        await readFbData("users", async (users) => {
          token = await genToken({ email: decoded.preferred_username });
          Object.keys(users).map(async (key) => {
            if (users[key].preferred_username === decoded.preferred_username) msUserInDb = true;
          });
          if (!msUserInDb) writeFbData("users", decoded);
          responseObject.message = "login successfully";
          responseObject.status = 200;
          responseObject.token = token;
          responseHandler(responseObject);
        });
      }));
  } catch (error) {
    res.status(400).send(error);
  }
};

export const signupController = async (req, res, next) => {
  console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXX", req.body);
  const { name, email, password } = req.body;
  writeFbData("users", { name, email, password });
};

export { signInController };
