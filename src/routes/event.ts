import { Router } from "express";
import { isValidToken } from "../middlewares/auth";
import { CreateEventsController } from "../controllers/Events";

export const eventRouter = Router();

// Event Routes
eventRouter.post("/create", isValidToken, CreateEventsController);
