import express from "express";
import {
  getMe,
  getProfile,
  login,
  register,
  updateProfile,
} from "../controllers/auth";
import {
  validateLogin,
  validateRegister,
  isAuthenticated,
} from "../middleware/auth";

export const authRouter = express.Router();

authRouter.post("/register", validateRegister, register);
authRouter.post("/login", validateLogin, login);
authRouter.get("/profile", isAuthenticated, getProfile);
authRouter.put("/profile", isAuthenticated, updateProfile);
authRouter.get("/me", isAuthenticated, getMe);
