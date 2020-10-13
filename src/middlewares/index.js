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

const verifyMsToken = async (req, res, next) => {
  const idToken = req.headers.authorization;
  const { type } = req.body;

  const handleMicrosoft = async () => {
    const decoded = await vrfyTkn(idToken, req.publicKey);
    if (decoded) {
      return nextMiddleware(req, next, decoded);
    }
    if (!decoded) {
      const tkn = await newPublicKey();
      const decoded = await vrfyTkn(idToken, tkn);
      if (decoded) {
        return nextMiddleware(req, next, decoded);
      }
      if (!decoded) {
        return responseHandler({ status: 400, message: "Invalid token" }, res);
      }
    }
  };
  type === "microsoft" && handleMicrosoft();
  type === "local" && next();
};
const checkPublicKeyExistance = (req, res, next) => {
  readPublicKey(async (pubKey) => {
    if (!pubKey) {
      const publicKey = await newPublicKey();
      req.publicKey = publicKey;
      return next();
    }
    req.publicKey = pubKey;
    return next();
  });
};
export { checkConflict, verifyMsToken, checkPublicKeyExistance };
