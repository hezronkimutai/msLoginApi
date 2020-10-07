require("dotenv").config();
import express from "express";
import jwt from "jsonwebtoken";
import { writeFbData, readFbData } from "../../utils/fb";

const { pubKey, secretKey } = process.env;
const publicKey = `-----BEGIN CERTIFICATE-----\n${pubKey}\n-----END CERTIFICATE-----`;

const authRouter = express.Router();
export default authRouter;

authRouter.post("/auth", async (req, res, next) => {
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
});
/**
 * @swagger
 *
 * /auth:
 *    post:
 *      summary: User login
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Signin'
 *      responses:
 *        "200":
 *          description: 'A user schema'
 *        "400":
 *          description: 'Bad request'
 *        "500":
 *          description: 'Server Error'
 * components:
 *   schemas:
 *     Signin:
 *       type: "object"
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - 'email'
 *         - 'password'
 *
 */
