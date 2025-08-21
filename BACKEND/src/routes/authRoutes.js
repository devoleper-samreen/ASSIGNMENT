import express from "express";
import {
  register,
  login,
  getCurrentUser,
  updatePassword,
} from "../controllers/authController.js";
import auth from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth(), getCurrentUser);
router.patch("/update-password", auth(), updatePassword);

export default router;
