import jwt from "jsonwebtoken";
import { writeFbData, readFbData } from "../utils/fb";

const { pubKey, secretKey } = process.env;
const publicKey = `-----BEGIN CERTIFICATE-----\n${pubKey}\n-----END CERTIFICATE-----`;
let responseObject = {};
const genToken = async (data) => await jwt.sign(data, secretKey);
const responseHandler = (resObj, res) => res.status(resObj.status || 204).send(resObj);
const signInController = async (req, res, next) => {
  let msUserInDb, token;

  const { type, email, password } = req.body;
  const idToken = req.headers.authorization;
  const sendLoginResponse = (message, status, tkn) => {
    responseObject.message = message || "login successfully";
    responseObject.status = status || 200;
    responseObject.token = tkn || token;
    responseHandler(responseObject, res);
  };
  try {
    type === "local" &&
      (await readFbData("users", async (users) => {
        const dbUsers = Object.keys(users).map((key) => users[key].email);
        const tkn = await genToken({ email, type });
        dbUsers.includes(email) && sendLoginResponse(null, null, tkn);
        !dbUsers.includes(email) && sendLoginResponse("Login failed", 400);
      }));

    type === "microsoft" &&
      (await jwt.verify(idToken, publicKey, { algorithms: ["RS256"] }, async (err, decoded) => {
        await readFbData("users", async (users) => {
          token = await genToken({ email: decoded.preferred_username, type });
          Object.keys(users).map(async (key) => {
            if (users[key].email === decoded.preferred_username) msUserInDb = true;
          });
          if (!msUserInDb) {
            writeFbData("users", { email: decoded.preferred_username, password: "microsoft", name: decoded.name });
          }
          sendLoginResponse();
        });
      }));
  } catch (error) {
    res.status(400).send(error);
  }
};

export const signupController = async (req, res, next) => {
  let userInDb, token;
  const { name, email, password } = req.body;
  await readFbData("users", async (users) => {
    Object.keys(users).map(async (key) => {
      if (users[key].email === email) userInDb = true;
    });
    if (!userInDb) {
      writeFbData("users", { name, email, password });
    }
  });
  token = await genToken({ email, type: "local" });
  responseObject.message = "Signup successful";
  responseObject.status = 200;
  responseObject.token = token;
  responseHandler(responseObject, res);
};

export { signInController };
