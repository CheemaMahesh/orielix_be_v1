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
import { isValidToken } from "../middlewares/auth";

export const preferencesRouter = Router();

// Event Routes
preferencesRouter.post(
  "/intrest/create",
  isValidToken,
  CreateUserIntrestController
);
preferencesRouter.get("/intrest/get", GetUserIntrestController);
preferencesRouter.patch(
  "/intrest/update",
  isValidToken,
  UpdateUserIntrestController
);

// User Role Routes
preferencesRouter.post("/role/create", CreateUserRolesController);
preferencesRouter.get("/role/get", GetUserRolesController);
preferencesRouter.patch("/role/update", UpdateUserRoleController);
