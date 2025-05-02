import { Router } from "express";
// import { isValidToken } from "../middlewares/auth";
import {
  CreateEventsController,
  GetEventsController,
  UpdateEventsController,
} from "../controllers/Events";

export const eventRouter = Router();

// Event Routes
eventRouter.post("/create", CreateEventsController);
eventRouter.get("/get", GetEventsController);
eventRouter.patch("/update", UpdateEventsController);
