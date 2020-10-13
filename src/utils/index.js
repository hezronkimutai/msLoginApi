import axios from "axios";
import fs from "fs";
import winston from "winston";

const { pubKeyUrl } = process.env;

const logger = winston.createLogger({
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: "devInfo.log" })],
});

const log = (level, message) =>
  logger.log({
    level,
    message,
  });
const responseHandler = (resObj, res) => res.status(resObj.status || 204).send(resObj);

const readPublicKey = (cb) => {
  return fs.readFile("pubKey.log", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return cb(false);
    }
    return cb(data);
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

const genPublic = (pk) => `-----BEGIN CERTIFICATE-----\n${pk}\n-----END CERTIFICATE-----`;

export { responseHandler, readPublicKey, newPublicKey, genPublic, log };
