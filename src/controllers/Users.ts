import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import z from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const client = new PrismaClient();

export const SignUpController = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;
    const validateUser = z.object({
      email: z.string().email(),
      password: z.string().min(8).max(20),
      username: z.string().min(3).max(20),
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
          password: hashedPassword,
          username,
          auraPoints: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
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
        intrests: user.interests,
        isActive: user.isActive,
        isDeleted: user.isDeleted,
        username: user.username,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllUserByAdmin = async (req: Request, res: Response) => {
  try {
    const user = await client.user.findMany({
      where: {
        isDeleted: false,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        dob: true,
        createdAt: true,
        updatedAt: true,
        userType: true,
        isVerified: true,
        profileImage: true,
        profilePercentage: true,
        address: true,
        zinPinCode: true,
        about: true,
        institution: true,
        fieldOfStudy: true,
        fieldDescription: true,
      },
    });

    if (!user || user.length === 0) {
      res.status(404).json({
        success: false,
        message: "No users found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Users found",
      user,
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

export const UpdateIntrestsController = async (req: Request, res: Response) => {
  try {
    const { userId, interests } = req.body;
    if (!userId || !Array.isArray(interests)) {
      res.status(400).json({
        success: false,
        message: "User ID and interests (array) are required",
      });
      return;
    }

    // Fetch current interests
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

    // Merge and keep only unique interests
    const mergedInterests = Array.from(
      new Set([...(user.interests || []), ...interests])
    );

    const isAuraLessThan1000 = user.auraPoints < 1000;

    const updatedUser = await client.user.update({
      where: { id: userId },
      data: {
        interests: mergedInterests,
        auraPoints: isAuraLessThan1000
          ? user.auraPoints + 250
          : user.auraPoints,
      },
    });

    res.status(200).json({
      success: true,
      message: "Interests updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const DeleteIntrestController = async (req: Request, res: Response) => {
  try {
    const { intrestId: intrest } = req.params;
    const userId = req.body.userId;
    if (!intrest || !userId) {
      res.status(400).json({
        success: false,
        message: "Interest ID and User ID are required",
      });
      return;
    }
    const user = await client.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        interests: true,
      },
    });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }
    const updatedInterests = user.interests.filter(
      (interest) => interest !== intrest
    );
    const updatedUser = await client.user.update({
      where: {
        id: userId,
      },
      data: {
        interests: updatedInterests,
      },
    });
    res.status(200).json({
      success: true,
      message: "Interest deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const UpdateNamesController = async (req: Request, res: Response) => {
  try {
    const { userId, firstName, lastName } = req.body;
    if (!userId || !firstName || !lastName) {
      res.status(400).json({
        success: false,
        message: "User ID, first name, and last name are required",
      });
      return;
    }

    if (!firstName) {
      res.status(400).json({
        success: false,
        message: "First name is required",
      });
      return;
    }

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
    const isAuraLessThan1000 = user.auraPoints < 1000;

    await client.user.update({
      where: {
        id: userId,
      },
      data: {
        firstName,
        lastName,
        auraPoints: isAuraLessThan1000
          ? user.auraPoints + 250
          : user.auraPoints,
      },
    });
    res.status(200).json({
      success: true,
      message: "Names updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const UpdateBioController = async (req: Request, res: Response) => {
  try {
    const { userId, bio } = req.body;
    if (!userId || !bio) {
      res.status(400).json({
        success: false,
        message: "User ID and bio are required",
      });
      return;
    }
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
    const isAuraLessThan1000 = user.auraPoints < 1000;

    await client.user.update({
      where: {
        id: userId,
      },
      data: {
        about: bio,
        auraPoints: isAuraLessThan1000
          ? user.auraPoints + 250
          : user.auraPoints,
      },
    });
    res.status(200).json({
      success: true,
      message: "Bio updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const GetAllEventsForCustomerController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    // First, get all events
    const events = await client.event.findMany({
      where: {
        isDeleted: false,
        isActive: true,
      },
      include: {
        presenter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            institution: true,
            about: true,
            designation: true,
          },
        },
        joinedUsers: {
          where: {
            id: userId,
          },
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            joinedUsers: true,
          },
        },
      },
    });

    if (!events || events.length === 0) {
      res.status(404).json({
        success: false,
        message: "No events found",
      });
      return;
    }

    // Get current date (today) without time component
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter for upcoming events and add isAlreadyJoined flag
    const upcomingEvents = events
      .filter((event) => {
        if (!event.eventDate) return false;

        // Parse ISO date string
        const eventDate = new Date(event.eventDate);

        // If parsing failed, skip this event
        if (isNaN(eventDate.getTime())) return false;

        // Remove time component for comparison
        eventDate.setHours(0, 0, 0, 0);

        // Keep if event date is >= today
        return eventDate >= today;
      })
      .map((event) => {
        // Add isAlreadyJoined flag based on if we found the user in joinedUsers
        return {
          ...event,
          joined: event.joinedUsers.length > 0,
          // Remove joinedUsers from response to avoid sending a list of all users
          joinedUsers: undefined,
        };
      });
    console.log("upcomingEvents", upcomingEvents);

    res.status(200).json({
      success: true,
      message: "Events found",
      events: upcomingEvents,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const getAllSessionsController = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    const sessions = await client.session.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        presenter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            institution: true,
            about: true,
            designation: true,
          },
        },
        joinedUsers: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            joinedUsers: true,
          },
        },
      },
    });

    if (!sessions || sessions.length === 0) {
      res.status(404).json({
        success: false,
        message: "No sessions found",
      });
      return;
    }

    const sessionsWithJoinedFlag = sessions.map((session) => ({
      ...session,
      joined: session.joinedUsers.some((user) => user.id === userId),
    }));

    res.status(200).json({
      success: true,
      message: "Sessions found",
      sessions: sessionsWithJoinedFlag,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
