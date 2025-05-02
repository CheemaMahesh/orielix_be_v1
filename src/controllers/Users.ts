import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import z from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const client = new PrismaClient();

export const SignUpController = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, dob } = req.body;
    const validateUser = z.object({
      email: z.string().email(),
      password: z.string().min(8).max(20),
      firstName: z.string().min(3).max(20),
      lastName: z.string().min(3).max(20),
      dob: z.string().optional(),
    });

    const isValidBody = validateUser.safeParse(req.body);

    if (isValidBody.success) {
      const existingUser = await client.user.findFirst({
        where: {
          email,
        },
      });
      if (existingUser?.email) {
        res.status(400).json({
          success: false,
          messages: "User with this email already exists",
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 4);

      const newUser = await client.user.create({
        data: {
          email,
          firstName,
          lastName,
          password: hashedPassword,
          auraPoints: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          dob,
          userType: "Customer",
          isVerified: true,
          id: uuidv4(),
        },
      });

      if (!newUser.id) {
        res.json(500).json({
          success: false,
          message: "Somthing went wrong please try again",
        });
      }

      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET!);

      res.status(200).json({
        success: true,
        message: "Signup successful",
        token,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid request body",
        errors: isValidBody.error.flatten(),
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const SigninController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const validateUser = z.object({
      email: z.string().email(),
      password: z.string().min(8).max(20),
    });
    const isValidBody = validateUser.safeParse(req.body);
    if (isValidBody.success) {
      const existingUser = await client.user.findFirst({
        where: {
          email,
        },
      });
      if (!existingUser?.email) {
        res.status(400).json({
          success: false,
          messages: "Email or password is incorrect",
        });
        return;
      }

      const currentPassword = await bcrypt.compare(
        existingUser.password,
        password
      );

      if (!currentPassword) {
        if (!existingUser.email) {
          res.status(400).json({
            message: "Email or password is incorrect",
            success: false,
          });
          return;
        }
      }

      const token = jwt.sign(
        { userId: existingUser.id },
        process.env.JWT_SECRET!
      );

      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const MeController = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const user = await client.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User found",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        dob: user.dob,
        updateAt: user.updatedAt,
        createdAt: user.createdAt,
        userType: user.userType,
        isVerified: user.isVerified,
        auraPoints: user.auraPoints,
        profileImage: user.profileImage,
        profilePercentage: user.profilePercentage,
        address: user.address,
        zinPinCode: user.zinPinCode,
        about: user.about,
        institution: user.institution,
        fieldOfStudy: user.fieldOfStudy,
        fieldDescription: user.fieldDescription,
        isActice: user.isActive,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const UpdateUserController = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const {
      firstName,
      lastName,
      dob,
      address,
      zinPinCode,
      about,
      profileImage,
      institution,
      fieldOfStudy,
      fieldDescription,
    } = req.body;

    // Create update data with required fields
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (dob !== undefined) updateData.dob = dob;
    if (address !== undefined) updateData.address = address;
    if (zinPinCode !== undefined) updateData.zinPinCode = zinPinCode;
    if (about !== undefined) updateData.about = about;
    if (profileImage !== undefined) updateData.profileImage = profileImage;
    if (institution !== undefined) updateData.institution = institution;
    if (fieldOfStudy !== undefined) updateData.fieldOfStudy = fieldOfStudy;
    if (fieldDescription !== undefined)
      updateData.fieldDescription = fieldDescription;

    const updatedUser = await client.user.update({
      where: {
        id: userId,
      },
      data: updateData,
    });

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
