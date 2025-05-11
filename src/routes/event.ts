import { Router } from "express";
import { isValidToken } from "../middlewares/auth";
import {
  CreateEventsController,
  GetEventsController,
  UpdateEventsController,
} from "../controllers/Events";

export const eventRouter = Router();

// Event Routes
eventRouter.post("/create", isValidToken, CreateEventsController);
eventRouter.get("/get", isValidToken, GetEventsController);
eventRouter.patch("/update", isValidToken, UpdateEventsController);
