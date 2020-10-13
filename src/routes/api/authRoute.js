import { signInController, signupController } from "../../controllers/auth";
import { checkConflict, verifyMsToken, checkPublicKeyExistance } from "../../middlewares";
import express from "express";

const authRouter = express.Router();
export default authRouter;

authRouter.post(
  "/signin",
  (req, res, next) => {
    next();
  },
  checkPublicKeyExistance,
  verifyMsToken,
  signInController
);

authRouter.post("/signup", checkConflict, signupController);
