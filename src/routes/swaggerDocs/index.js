/**
 * @swagger
 *
 * /auth/signin:
 *    post:
 *      summary: User login
 *      tags: [Signin]
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
 *         type:
 *           type: string
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
 *      summary: User Signup
 *      tags: [Signup]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Signup'
 *      responses:
 *        "200":
 *          description: 'A user schema'
 *        "400":
 *          description: 'Bad request'
 *        "500":
 *          description: 'Server Error'
 * components:
 *   schemas:
 *     Signup:
 *       type: "object"
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - 'email'
 *         - 'password'
 *
 */
