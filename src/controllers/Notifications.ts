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
      where: { userId, isRead: false, isDeleted: false },
      orderBy: { createdAt: "desc" },
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
        isSuccess: true,
        notifications: [],
      });
    }

    res.status(200).json({
      message: "Notifications fetched successfully.",
      isSuccess: true,
      notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error." });
  } finally {
    await prisma.$disconnect();
  }
};
