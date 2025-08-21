import express from "express";
import {
  addUser,
  addStore,
  dashboardStats,
  getUsers,
  getStores,
  getRatingsCount,
} from "../controllers/adminController.js";
import auth from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add-user", auth(["admin"]), addUser);
router.post("/add-store", auth(["admin"]), addStore);
router.get("/dashboard", auth(["admin"]), dashboardStats);
router.get("/users", auth(["admin"]), getUsers);
router.get("/stores", auth(["admin"]), getStores);
router.get("/ratings", auth(["admin"]), getRatingsCount);

export default router;
