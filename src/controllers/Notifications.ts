import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export const GetAllNotificationsController = async (
  req: Request,
  res: Response
) => {
  const prisma = new PrismaClient();
  const userId = req.params.userId;

  try {
    const notifications = await prisma.notifications.findMany({
      where: { userId, isDeleted: false },
      orderBy: [{ isRead: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        type: true,
        description: true,
        isRead: true,
        createdAt: true,
        isDeleted: true,
        title: true,
      },
    });

    if (notifications.length === 0) {
      res.status(200).json({
        message: "No notifications found.",
        success: true,
        notifications: [],
      });
      return;
    }

    res.status(200).json({
      message: "Notifications fetched successfully.",
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error." });
  } finally {
    await prisma.$disconnect();
  }
};

export const MarkNotificationAsReadController = async (
  req: Request,
  res: Response
) => {
  const prisma = new PrismaClient();
  const notificationId = req.params.notificationId;

  try {
    await prisma.notifications.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    res.status(200).json({
      message: "Notification marked as read successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Internal server error." });
  } finally {
    await prisma.$disconnect();
  }
};
