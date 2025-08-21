import express from "express";
import {
  getOwnerStores,
  getStoreRatings,
} from "../controllers/ownerController.js";
import auth from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/stores", auth(["owner"]), getOwnerStores);
router.get("/ratings/:storeId", auth(["owner"]), getStoreRatings);

export default router;
