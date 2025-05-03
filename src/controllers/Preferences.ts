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
      intrests: intrests?.map((intrest) => ({
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
      roles: roles?.map((role) => ({
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
