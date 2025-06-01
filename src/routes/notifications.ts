import { Router } from "express";
import { isValidToken } from "../middlewares/auth";
import {
  GetAllNotificationsController,
  MarkNotificationAsReadController,
} from "../controllers/Notifications";

export const notificationsRouter = Router();

// get all notifications by user id
notificationsRouter.get(
  "/getall/:userId",
  isValidToken,
  GetAllNotificationsController
);

notificationsRouter.patch(
  "/markasread/:notificationId",
  isValidToken,
  MarkNotificationAsReadController
);
