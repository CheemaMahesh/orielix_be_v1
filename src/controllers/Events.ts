import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const client = new PrismaClient();

export const CreateEventsController = async (req: Request, res: Response) => {
  try {
    console.log("CreateEventsController");
    const {
      eventName,
      eventDescription,
      eventDate,
      eventImage,
      eventTime,
      eventLocation,
      userId,
    } = req.body;
    const userDetails = await client.user.findUnique({
      where: {
        id: userId,
      },
    });

    console.log("userDetails", userDetails);
    console.log("req.body", req.body);
    console.log("userId", userId);

    const isValidUserToUpdate = userDetails && userDetails.isActive;
    //   &&
    //   userDetails.isVerified &&
    //   (userDetails.userType === "admin" ||
    //     userDetails.userType === "superAdmin");

    if (!isValidUserToUpdate) {
      res.status(404).json({
        success: false,
        message: "Invalid Request",
      });
      return;
    }

    const eventBody = z.object({
      eventName: z.string().min(3).max(50),
      eventDescription: z.string().min(5).max(500),
      eventDate: z.string(),
      eventImage: z.string(),
      eventTime: z.string(),
      eventLocation: z.string().optional(),
    });
    const isValidBody = eventBody.safeParse(req.body);
    if (!isValidBody.success) {
      res.status(400).json({
        success: false,
        message: "Invalid Request",
        errors: isValidBody.error.format(),
      });
      return;
    }

    const event = await client.event.create({
      data: {
        eventName,
        eventDescription,
        eventDate,
        eventImage,
        eventTime,
        eventLocation,
        createdBy: userId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
