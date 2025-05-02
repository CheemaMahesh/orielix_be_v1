import { Router } from "express";
import {
  CreateSessionController,
  GetSessionController,
  UpdateSessionController,
} from "../controllers/Sessions";

export const sessionRouter = Router();

// Event Routes
sessionRouter.post("/create", CreateSessionController);
sessionRouter.get("/get", GetSessionController);
sessionRouter.patch("/update", UpdateSessionController);
