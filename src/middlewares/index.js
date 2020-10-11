import { readFbData } from "../utils/fb";
import { responseHandler } from "../utils";
import jwt from "jsonwebtoken";
import axios from "axios";
import fs from "fs";

const { pubKeyUrl } = process.env;
// const publicKey = `-----BEGIN CERTIFICATE-----\n${pubKey}\n-----END CERTIFICATE-----`;

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
const readPublicKey = (cb) => {
  fs.readFile("pubKey.log", "utf8", function (err, data) {
    if (err) {
      console.log(err);
      cb(false);
    }
    cb(data);
  });
};
const newPublicKey = async () => {
  try {
    const rs = await axios(pubKeyUrl);
    const pbKey = rs.data["keys"][0]["x5c"];
    fs.writeFile("pubKey.log", pbKey[0], function (err) {
      if (err) console.log(err);
      console.log("Pubkey stored in log file");
    });
    return pbKey[0];
  } catch (error) {
    return false;
  }
};

const verifyMsToken = async (req, res, next) => {
  const idToken = req.headers.authorization;
  const { type } = req.body;
  type === "microsoft" &&
    readPublicKey(async (dta) => {
      await jwt.verify(
        idToken,
        `-----BEGIN CERTIFICATE-----\n${dta}\n-----END CERTIFICATE-----`,
        { algorithms: ["RS256"] },
        async (err, decoded) => {
          if (err) {
            const tkn = await newPublicKey();
            return await jwt.verify(
              idToken,
              `-----BEGIN CERTIFICATE-----\n${tkn}\n-----END CERTIFICATE-----`,
              { algorithms: ["RS256"] },
              async (err, decoded) => {
                if (err) {
                  return responseHandler({ status: 400, message: "Invalid token" }, res);
                }
                req.msUser = decoded;
                return next();
              }
            );
          }
          req.msUser = decoded;
          return next();
        }
      );
    });
  type === "local" && next();
};
export { checkConflict, verifyMsToken };
