import express from "express";
import { getStores, rateStore } from "../controllers/userController.js";
import auth from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/stores", auth(["user"]), getStores);
router.post("/rate", auth(["user"]), rateStore);

export default router;
