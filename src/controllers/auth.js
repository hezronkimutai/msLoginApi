import jwt from "jsonwebtoken";
import { writeFbData, readFbData } from "../utils/fb";

const { pubKey, secretKey } = process.env;
const publicKey = `-----BEGIN CERTIFICATE-----\n${pubKey}\n-----END CERTIFICATE-----`;
let token,
  responseObject = {};
const genToken = async (data) => await jwt.sign(data, secretKey);
const responseHandler = (resObj, res) => res.status(resObj.status || 204).send(resObj);
const signInController = async (req, res, next) => {
  let msUserInDb;
  const { type, email, password } = req.body;
  const idToken = req.headers.authorization;
  const sendLoginResponse = () => {
    responseObject.message = "login successfully";
    responseObject.status = 200;
    responseObject.token = token;
    responseHandler(responseObject, res);
  };
  try {
    type === "local" &&
      (await readFbData("users", (users) => {
        Object.keys(users).map(async (key) => {
          if (users[key].email === email || users[key].preferred_username === email) token = await genToken(email);
        });
        sendLoginResponse();
      }));
    type === "microsoft" &&
      (await jwt.verify(idToken, publicKey, { algorithms: ["RS256"] }, async (err, decoded) => {
        await readFbData("users", async (users) => {
          token = await genToken({ email: decoded.preferred_username });
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
  let userInDb;
  const { name, email, password } = req.body;
  await readFbData("users", async (users) => {
    Object.keys(users).map(async (key) => {
      if (users[key].email === email) userInDb = true;
    });
    if (!userInDb) {
      writeFbData("users", { name, email, password });
    }
  });
  token = await genToken({ email });
  responseObject.message = "Signup successful";
  responseObject.status = 200;
  responseObject.token = token;
  responseHandler(responseObject, res);
};

export { signInController };
