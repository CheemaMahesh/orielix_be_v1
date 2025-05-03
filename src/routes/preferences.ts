import { Router } from "express";
import {
  CreateUserIntrestController,
  GetUserIntrestController,
  UpdateUserIntrestController,
} from "../controllers/Preferences";
import {
  CreateUserRolesController,
  GetUserRolesController,
  UpdateUserRoleController,
} from "../controllers/Preferences";

export const preferencesRouter = Router();

// Event Routes
preferencesRouter.post("/intrest/create", CreateUserIntrestController);
preferencesRouter.get("/intrest/get", GetUserIntrestController);
preferencesRouter.patch("/intrest/update", UpdateUserIntrestController);

// User Role Routes
preferencesRouter.post("/role/create", CreateUserRolesController);
preferencesRouter.get("/role/get", GetUserRolesController);
preferencesRouter.patch("/role/update", UpdateUserRoleController);
