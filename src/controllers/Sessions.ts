import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

const client = new PrismaClient();

export const CreateSessionController = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      date,
      image,
      time,
      userId,
      duration,
      presenterId,
      category,
      type,
      location,
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
      name: z.string().min(3).max(50),
      description: z.string().min(5).max(500),
      date: z.string(),
      image: z.string(),
      time: z.string(),
      duration: z.string(),
      presenterId: z.string().optional(),
      category: z.string().optional(),
      type: z.string().optional(),
      location: z.string().optional(),
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

    const session = await client.session.create({
      data: {
        name,
        description,
        date,
        image,
        time,
        createdBy: String(userId),
        duration,
        id: uuidv4(),
        presenterId: presenterId ? String(presenterId) : null,
        category: category ? String(category) : null,
        type: type ? String(type) : null,
        location,
      },
    });

    res.status(200).json({
      success: true,
      message: "Event created successfully",
      session,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const GetSessionController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      res.status(400).json({
        success: false,
        message: "Invalid Request",
      });
      return;
    }

    const sessions = await client.session.findMany({
      where: {
        createdBy: String(userId),
      },
    });

    if (!sessions || sessions.length === 0) {
      res.status(404).json({
        success: false,
        message: "No events found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Event fetched successfully",
      sessions,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Internal server error GetEventsController" });
  }
};

export const UpdateSessionController = async (req: Request, res: Response) => {
  try {
    const { sessionId, userId } = req.body;
    if (!sessionId || !userId) {
      res.status(400).json({
        success: false,
        message: "Invalid Request",
      });
      return;
    }

    let updateBody: Record<string, any> = {};

    if (req.body.name && req.body.name.trim() !== "") {
      updateBody.name = req.body.name;
    }
    if (req.body.description && req.body.description.trim() !== "") {
      updateBody.description = req.body.description;
    }
    if (req.body.date && req.body.date.trim() !== "") {
      updateBody.date = req.body.date;
    }
    if (req.body.image && req.body.image.trim() !== "") {
      updateBody.image = req.body.image;
    }
    if (req.body.time && req.body.time.trim() !== "") {
      updateBody.time = req.body.time;
    }
    if (req.body.location && req.body.location.trim() !== "") {
      updateBody.location = req.body.location;
    }
    if (req.body.isActive !== undefined) {
      updateBody.isActive = Boolean(req.body.isActive);
    }
    // Use presenter relation instead of presenterId
    if (req.body.presenterId && req.body.presenterId.trim() !== "") {
      updateBody.presenter = { connect: { id: req.body.presenterId } };
    }
    if (req.body.duration && req.body.duration.trim() !== "") {
      updateBody.duration = req.body.duration;
    }
    if (req.body.isDeleted !== undefined) {
      updateBody.isDeleted = Boolean(req.body.isDeleted);
    }
    // Use category if that's your schema field, otherwise use category
    if (req.body.category && req.body.category.trim() !== "") {
      updateBody.category = req.body.category;
    }
    if (req.body.type && req.body.type.trim() !== "") {
      updateBody.type = req.body.type;
    }

    if (Object.keys(updateBody).length === 0) {
      res.status(400).json({
        success: false,
        message: "No valid fields to update",
      });
      return;
    }

    updateBody.updatedAt = new Date();

    const updatedSession = await client.session.update({
      where: { id: sessionId },
      data: updateBody,
    });

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      session: updatedSession,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
