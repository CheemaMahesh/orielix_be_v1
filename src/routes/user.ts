import { Router } from "express";
import {
  SignUpController,
  SigninController,
  MeController,
  UpdateUserController,
} from "../controllers/Users";
import { isValidToken } from "../middlewares/auth";

export const userRouter = Router();

// Auth routes
userRouter.post("/signup", SignUpController);
userRouter.post("/login", SigninController);

// Me Routes
userRouter.get("/me", isValidToken, MeController);

// Update Routes
userRouter.put("/update", isValidToken, UpdateUserController);
