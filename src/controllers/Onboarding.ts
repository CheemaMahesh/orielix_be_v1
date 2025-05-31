import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import z from "zod";
import { v4 as uuidv4 } from "uuid";

const client = new PrismaClient();

export const OnboardingStepOneController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, firstName, lastName, dob, phone } = req.body;
    const schema = z.object({
      userId: z.string().uuid(),
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      dob: z.string().min(6),
      phone: z.string().min(1),
    });

    const isValidUser = schema.safeParse(req.body);
    if (!isValidUser.success) {
      res.status(400).json({
        error: "Invalid input",
        details: isValidUser.error.format(),
      });
      return;
    }

    const user = await client.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const updatedUser = await client.user.update({
      where: {
        id: userId,
      },
      data: {
        firstName,
        lastName,
        dob,
        phone,
        updatedAt: new Date(),
      },
    });
    if (!updatedUser) {
      res.status(500).json({ error: "Failed to update user" });
      return;
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const OnboardingStepTwoController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, about, profileImage } = req.body;
    const schema = z.object({
      userId: z.string().uuid(),
      about: z.string().min(1).max(200),
      profileImage: z.string().optional(),
    });
    const isValidUser = schema.safeParse(req.body);
    if (!isValidUser.success) {
      res.status(400).json({
        error: "Invalid input",
        details: isValidUser.error.format(),
      });
      return;
    }

    const updatedUser = await client.user.update({
      where: {
        id: userId,
      },
      data: {
        about,
        profileImage,
        updatedAt: new Date(),
      },
    });
    if (!updatedUser) {
      res.status(500).json({ error: "Failed to update user" });
      return;
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const OnboardingStepThreeController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, institution, fieldOfStudy, fieldDescription } = req.body;
    const schema = z.object({
      userId: z.string().uuid(),
      institution: z.string().min(1),
      fieldOfStudy: z.string().min(1).optional(),
      fieldDescription: z.string().min(1).optional(),
    });
    const isValidUser = schema.safeParse(req.body);
    if (!isValidUser.success) {
      res.status(400).json({
        error: "Invalid input",
        details: isValidUser.error.format(),
      });
      return;
    }

    const updatedUser = await client.user.update({
      where: {
        id: userId,
      },
      data: {
        institution,
        fieldOfStudy,
        fieldDescription,
        updatedAt: new Date(),
      },
    });
    if (!updatedUser) {
      res.status(500).json({ error: "Failed to update user" });
      return;
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.$disconnect();
  }
};

export const OnboardingStepFourController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, intestIds } = req.body;
    const schema = z.object({
      userId: z.string().uuid(),
      intestIds: z.array(z.string().uuid()),
    });
    const isValidUser = schema.safeParse(req.body);
    if (!isValidUser.success) {
      res.status(400).json({
        error: "Invalid input",
        details: isValidUser.error.format(),
      });
      return;
    }
    const updatedUser = await client.user.update({
      where: {
        id: userId,
      },
      data: {
        interests: intestIds,
        updatedAt: new Date(),
      },
    });
    if (!updatedUser) {
      res.status(500).json({ error: "Failed to update user" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
