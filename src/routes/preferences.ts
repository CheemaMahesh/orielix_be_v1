import { Router } from "express";
import {
  CreateUserIntrestController,
  GetUserIntrestController,
  UpdateUserIntrestController,
} from "../controllers/Preferences";

export const preferencesRouter = Router();

// Event Routes
preferencesRouter.post("/intrest/create", CreateUserIntrestController);
preferencesRouter.get("/intrest/get", GetUserIntrestController);
preferencesRouter.patch("/intrest/update", UpdateUserIntrestController);
