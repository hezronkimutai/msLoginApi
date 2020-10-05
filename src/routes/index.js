import { Router } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOption from "../utils/swaggerOptions";
import authRoute from "./api/authRoute";

const router = Router();
router.use("/api", authRoute);
const specs = swaggerJsdoc(swaggerOption);

router.use("/api-docs", swaggerUi.serve);
router.get("/api-docs", swaggerUi.setup(specs, { explorer: true }));

export default router;
