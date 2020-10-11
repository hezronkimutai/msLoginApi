import axios from "axios";
import fs from "fs";

const { pubKeyUrl } = process.env;
const responseHandler = (resObj, res) => res.status(resObj.status || 204).send(resObj);

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
const genPublic = (pk) => `-----BEGIN CERTIFICATE-----\n${pk}\n-----END CERTIFICATE-----`;

export { responseHandler, readPublicKey, newPublicKey, genPublic };
