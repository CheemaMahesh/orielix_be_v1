import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

const client = new PrismaClient();

export const CreateUserIntrestController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, name, description } = req.body;
    const validateUser = z.object({
      userId: z.string().uuid(),
      name: z.string().min(3).max(50),
      description: z.string().min(5).max(500),
    });
    const isValidBody = validateUser.safeParse(req.body);
    if (!isValidBody.success) {
      res.status(400).json({
        success: false,
        message: "Invalid Request",
        errors: isValidBody.error.format(),
      });
      return;
    }
    const intrest = await client.interest.create({
      data: {
        name,
        description,
        createdBy: String(userId),
        id: uuidv4(),
      },
    });

    res.status(200).json({
      success: true,
      intrest,
      message: "Intrest Created Successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const GetUserIntrestController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      res.status(400).json({
        success: false,
        message: "Invalid Request",
      });
      return;
    }
    const intrests = await client.interest.findMany({
      where: {
        createdBy: String(userId),
      },
    });

    res.status(200).json({
      success: true,
      intrests,
      message: "Intrest Fetched Successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const UpdateUserIntrestController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, intrestId } = req.body;
    if (!userId || !intrestId) {
      res.status(400).json({
        success: false,
        message: "Invalid Request - Missing required fields",
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
    if (req.body.isActive !== undefined) {
      updateBody.isActive = req.body.isActive;
    }

    if (req.body.isDeleted !== undefined) {
      updateBody.isDeleted = req.body.isDeleted;
    }

    if (Object.keys(updateBody).length === 0) {
      res.status(400).json({
        success: false,
        message: "No valid fields to update",
      });
      return;
    }

    updateBody.updatedAt = new Date();

    // Update the interest
    const updatedInterest = await client.interest.update({
      where: { id: intrestId },
      data: updateBody,
    });

    // Send response
    res.status(200).json({
      success: true,
      message: "Interest updated successfully",
      interest: updatedInterest,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const getallintrestsController = async (req: Request, res: Response) => {
  try {
    const intrests = await client.interest.findMany({
      where: {
        isActive: true,
        isDeleted: false,
      },
    });

    res.status(200).json({
      success: true,
      intrests: intrests?.map((intrest: any) => ({
        id: intrest.id,
        name: intrest.name,
        description: intrest.description,
      })),
      message: "Intrest Fetched Successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const CreateUserRolesController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, name, description } = req.body;
    const validateUser = z.object({
      userId: z.string().uuid(),
      name: z.string().min(1).max(25),
      description: z.string().min(5).max(500),
    });
    const isValidBody = validateUser.safeParse(req.body);
    if (!isValidBody.success) {
      res.status(400).json({
        success: false,
        message: "Invalid Request",
        errors: isValidBody.error.format(),
      });
      return;
    }
    const role = await client.role.create({
      data: {
        name,
        description,
        createdBy: String(userId),
        id: uuidv4(),
      },
    });

    res.status(200).json({
      success: true,
      role,
      message: "Intrest Created Successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const GetUserRolesController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      res.status(400).json({
        success: false,
        message: "Invalid Request",
      });
      return;
    }
    const roles = await client.role.findMany({
      where: {
        createdBy: String(userId),
      },
    });

    res.status(200).json({
      success: true,
      roles,
      message: "Intrest Fetched Successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const UpdateUserRoleController = async (req: Request, res: Response) => {
  try {
    const { userId, roleId } = req.body;
    if (!userId || !roleId) {
      res.status(400).json({
        success: false,
        message: "Invalid Request - Missing required fields",
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
    if (req.body.isActive !== undefined) {
      updateBody.isActive = req.body.isActive;
    }

    if (req.body.isDeleted !== undefined) {
      updateBody.isDeleted = req.body.isDeleted;
    }

    if (Object.keys(updateBody).length === 0) {
      res.status(400).json({
        success: false,
        message: "No valid fields to update",
      });
      return;
    }

    updateBody.updatedAt = new Date();

    // Update the interest
    const updatedRole = await client.role.update({
      where: { id: roleId },
      data: updateBody,
    });

    if (!updatedRole) {
      res.status(404).json({
        success: false,
        message: "Role not found",
      });
      return;
    }

    // Send response
    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      role: updatedRole,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const getallrolesController = async (req: Request, res: Response) => {
  try {
    const roles = await client.role.findMany({
      where: {
        isActive: true,
        isDeleted: false,
      },
    });
    if (!roles) {
      res.status(404).json({
        success: false,
        message: "No roles found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      roles: roles?.map((role: any) => ({
        id: role.id,
        name: role.name,
        description: role.description,
      })),
      message: "Roles Fetched Successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const joinInEventController = async (req: Request, res: Response) => {
  try {
    // Validate the request data
    const { userId } = req.body;
    const { eventId } = req.params;
    if (!eventId || typeof eventId !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid Request - Missing eventId",
      });
      return;
    }
    const validateJoinEvent = z.object({
      userId: z.string().uuid(),
    });

    const isValidBody = validateJoinEvent.safeParse(req.body);
    if (!isValidBody.success) {
      res.status(400).json({
        success: false,
        message: "Invalid Request",
        errors: isValidBody.error.format(),
      });
      return;
    }

    // Check if user exists
    const user = await client.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Check if event exists and is active
    const event = await client.event.findFirst({
      where: {
        id: eventId,
        isDeleted: false,
        isActive: true,
      },
    });

    if (!event) {
      res.status(404).json({
        success: false,
        message: "Event not found or inactive",
      });
      return;
    }

    // Check if user has already joined this event
    const alreadyJoined = await client.event.findFirst({
      where: {
        id: eventId,
        joinedUsers: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (alreadyJoined) {
      res.status(400).json({
        success: false,
        message: "User has already joined this event",
      });
      return;
    }

    // Add user to event's joinedUsers
    const updatedEvent = await client.event.update({
      where: {
        id: eventId,
      },
      data: {
        joinedUsers: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        presenter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Successfully joined event",
    });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
    return;
  }
};

export const leaveEventController = async (req: Request, res: Response) => {
  try {
    // Validate the request data
    const { userId } = req.body;
    const { eventId } = req.params;
    if (!eventId || typeof eventId !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid Request - Missing eventId",
      });
      return;
    }
    const validateLeaveEvent = z.object({
      userId: z.string().uuid(),
    });

    const isValidBody = validateLeaveEvent.safeParse(req.body);
    if (!isValidBody.success) {
      res.status(400).json({
        success: false,
        message: "Invalid Request",
        errors: isValidBody.error.format(),
      });
      return;
    }

    // Check if user has joined this event
    const joinedEvent = await client.event.findFirst({
      where: {
        id: eventId,
        joinedUsers: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (!joinedEvent) {
      res.status(400).json({
        success: false,
        message: "User has not joined this event",
      });
      return;
    }

    // Remove user from event's joinedUsers
    const updatedEvent = await client.event.update({
      where: {
        id: eventId,
      },
      data: {
        joinedUsers: {
          disconnect: {
            id: userId,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Successfully left event",
      event: updatedEvent,
    });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
    return;
  }
};

export const JoinInSessionController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const { sessionId } = req.params;

    if (!userId || !sessionId) {
      res.status(400).json({
        success: false,
        message: "Missing userId or sessionId",
      });
      return;
    }

    const validateJoinSession = z.object({
      userId: z.string().uuid(),
      sessionId: z.string().uuid(),
    });

    const isValidBody = validateJoinSession.safeParse({ userId, sessionId });
    if (!isValidBody.success) {
      res.status(400).json({
        success: false,
        message: "Invalid Request",
        errors: isValidBody.error.format(),
      });
      return;
    }

    // Check if session exists and is active
    const session = await client.session.findFirst({
      where: {
        id: sessionId,
        isDeleted: false,
        isActive: true,
      },
    });

    if (!session) {
      res.status(404).json({
        success: false,
        message: "Session not found or inactive",
      });
      return;
    }

    // Check if user has already joined this session
    const alreadyJoined = await client.session.findFirst({
      where: {
        id: sessionId,
        joinedUsers: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (alreadyJoined) {
      res.status(400).json({
        success: false,
        message: "User has already joined this session",
      });
      return;
    }

    // Add user to session's joinedUsers
    const updatedSession = await client.session.update({
      where: {
        id: sessionId,
      },
      data: {
        joinedUsers: {
          connect: {
            id: userId,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Successfully joined session",
      session: updatedSession,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
    return;
  }
};
export const LeaveSessionController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const { sessionId } = req.params;

    if (!userId || !sessionId) {
      res.status(400).json({
        success: false,
        message: "Missing userId or sessionId",
      });
      return;
    }

    const validateLeaveSession = z.object({
      userId: z.string().uuid(),
      sessionId: z.string().uuid(),
    });

    const isValidBody = validateLeaveSession.safeParse({ userId, sessionId });
    if (!isValidBody.success) {
      res.status(400).json({
        success: false,
        message: "Invalid Request",
        errors: isValidBody.error.format(),
      });
      return;
    }

    // Check if user has joined this session
    const joinedSession = await client.session.findFirst({
      where: {
        id: sessionId,
        joinedUsers: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (!joinedSession) {
      res.status(400).json({
        success: false,
        message: "User has not joined this session",
      });
      return;
    }

    // Remove user from session's joinedUsers
    const updatedSession = await client.session.update({
      where: {
        id: sessionId,
      },
      data: {
        joinedUsers: {
          disconnect: {
            id: userId,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Successfully left session",
      session: updatedSession,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
    return;
  }
};
