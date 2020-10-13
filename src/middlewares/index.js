import { readFbData } from "../utils/fb";
import { responseHandler, log, readPublicKey, newPublicKey, genPublic } from "../utils";
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

const vrfyTkn = async (idTkn, pbKey) => {
  try {
    return await jwt.verify(idTkn, genPublic(pbKey), { algorithms: ["RS256"] });
  } catch (error) {
    return false;
  }
};

const nextMiddleware = (req, next, decoded) => {
  req.msUser = decoded;
  return next();
};

const handleMicrosoftSignin = async (req, res, next) => {
  const idToken = req.headers.authorization;
  let decoded;
  log("info", "Verify id token");

  decoded = await vrfyTkn(idToken, req.publicKey);
  if (decoded) {
    log("info", "DECODED, call next");
    return nextMiddleware(req, next, decoded);
  }
  log("info", "NOT DECODED: decode again with new public key fetched from MS");

  decoded = await vrfyTkn(idToken, await newPublicKey());
  if (decoded) {
    log("info", "DECODED, call next");

    return nextMiddleware(req, next, decoded);
  }
  log("info", "NOT DECODED: return 401 invalid token");

  return responseHandler({ status: 401, message: "UNAUTHORIZED: Invalid token" }, res);
};
const verifyMsToken = async (req, res, next) => {
  const { type } = req.body;
  type === "microsoft" && handleMicrosoftSignin(req, res, next);
  type === "local" && next();
};
const checkPublicKeyExistance = (req, res, next) => {
  log("info", "Read public key from log file");

  readPublicKey(async (pubKey) => {
    if (!pubKey) {
      log("info", "LOG FILE DON'T EXIST");
      log("info", "public key is fetched and stored in cache(log file)");
      const publicKey = await newPublicKey();
      req.publicKey = publicKey;
      return next();
    }
    log("info", "LOG FILE EXIST");
    req.publicKey = pubKey;
    return next();
  });
};
export { checkConflict, verifyMsToken, checkPublicKeyExistance };
