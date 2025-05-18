import { Router } from "express";
import {
  CreateSessionController,
  GetSessionController,
  UpdateSessionController,
} from "../controllers/Sessions";
import { isValidToken } from "../middlewares/auth";

export const sessionRouter = Router();

// Event Routes
sessionRouter.post("/create", isValidToken, CreateSessionController);
sessionRouter.get("/get", isValidToken, GetSessionController);
sessionRouter.patch("/update", isValidToken, UpdateSessionController);
