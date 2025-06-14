import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

const client = new PrismaClient();

export const CreateEventsController = async (req: Request, res: Response) => {
  try {
    const {
      eventName,
      eventDescription,
      eventDate,
      eventImage,
      eventTime,
      eventLocation,
      userId,
      presenterId,
      duration,
      eventType,
    } = req.body;
    const userDetails = await client.user.findUnique({
      where: {
        id: userId,
      },
    });

    const isValidUserToUpdate =
      userDetails &&
      userDetails.isActive &&
      (userDetails.userType === "admin" ||
        userDetails.userType === "superAdmin");

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
      presenterId: z.string().optional(),
      duration: z.string().optional(),
      eventType: z.string().optional(),
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
        id: uuidv4(),
        presenterId: presenterId || null,
        duration: duration || null,
        eventType: eventType || "Orielix Officials",
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

export const GetEventsController = async (req: Request, res: Response) => {
  try {
    const eventType = req.query.eventType as string | undefined;
    const { userId } = req.body;
    if (!userId) {
      res.status(400).json({
        success: false,
        message: "Invalid Request",
      });
      return;
    }

    let eventDetails: any[] = [];
    if (eventType) {
      eventDetails = await client.event.findMany({
        where: {
          createdBy: String(userId),
          eventType: eventType,
        },
      });
    }

    // If eventType was given but no events found, or eventType not given, fetch all
    if (!eventDetails || eventDetails.length === 0) {
      eventDetails = await client.event.findMany({
        where: {
          createdBy: String(userId),
        },
      });
    }

    if (!eventDetails || eventDetails.length === 0) {
      res.status(404).json({
        success: false,
        message: "No events found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Event(s) fetched successfully",
      events: eventDetails,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Internal server error GetEventsController" });
  }
};

export const UpdateEventsController = async (req: Request, res: Response) => {
  try {
    const { eventId, userId } = req.body;
    if (!eventId || !userId) {
      res.status(400).json({
        success: false,
        message: "Invalid Request",
      });
      return;
    }

    let updateBody: Record<string, any> = {};

    if (req.body.eventName && req.body.eventName.trim() !== "") {
      updateBody.eventName = req.body.eventName;
    }

    if (req.body.eventDescription && req.body.eventDescription.trim() !== "") {
      updateBody.eventDescription = req.body.eventDescription;
    }

    if (req.body.eventDate && req.body.eventDate.trim() !== "") {
      updateBody.eventDate = req.body.eventDate;
    }

    if (req.body.eventImage && req.body.eventImage.trim() !== "") {
      updateBody.eventImage = req.body.eventImage;
    }

    if (req.body.eventTime && req.body.eventTime.trim() !== "") {
      updateBody.eventTime = req.body.eventTime;
    }

    if (req.body.eventLocation && req.body.eventLocation.trim() !== "") {
      updateBody.eventLocation = req.body.eventLocation;
    }

    if (req.body.isActive !== undefined) {
      updateBody.isActive = Boolean(req.body.isActive);
    }

    if (req.body.isDeleted !== undefined) {
      updateBody.isDeleted = Boolean(req.body.isDeleted);
    }

    if (req.body.duration && req.body.duration.trim() !== "") {
      updateBody.duration = req.body.duration;
    }

    if (req.body.eventType && req.body.eventType.trim() !== "") {
      updateBody.eventType = req.body.eventType;
    }

    if (Object.keys(updateBody).length === 0) {
      res.status(400).json({
        success: false,
        message: "No valid fields to update",
      });
      return;
    }

    updateBody.updatedAt = new Date();

    const updatedEvent = await client.event.update({
      where: { id: eventId },
      data: updateBody,
    });

    // Send response
    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
