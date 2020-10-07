import { signInController, signupController } from "../../controllers/auth";
import express from "express";

const authRouter = express.Router();
export default authRouter;

authRouter.post("/signin", signInController);
authRouter.post("/signup", signupController);

/**
 * @swagger
 *
 * /auth/signin:
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

/**
 * @swagger
 *
 * /auth/signup:
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
