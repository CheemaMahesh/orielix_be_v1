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
        portfolioLink: user.portfolioLink,
        githubLink: user.githubLink,
        linkedinLink: user.linkedinLink,
        phone: user.phone,
        country: user.country,
        state: user.state,
        city: user.city,
        countryRank: user.countryRank,
        stateRank: user.stateRank,
        institutionRank: user.institutionRank,
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

export const JoinWithGoogleAuth = async (req: Request, res: Response) => {
  try {
    const { email, firstName, profileImage } = req.body;
    const validateUser = z.object({
      email: z.string().email(),
      firstName: z.string().min(3).max(20),
      profileImage: z.string(),
    });
    const isValidBody = validateUser.safeParse(req.body);
    if (!isValidBody.success) {
      res.status(400).json({
        success: false,
        message: "Invalid request body",
        errors: isValidBody.error.flatten(),
      });
      return;
    }
    const existingUser = await client.user.findFirst({
      where: {
        email,
      },
    });
    if (existingUser?.email) {
      const token = jwt.sign(
        { userId: existingUser.id },
        process.env.JWT_SECRET!
      );
      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
      });
      return;
    }
    const newUser = await client.user.create({
      data: {
        email,
        firstName,
        lastName: "",
        profileImage,
        address: "",
        zinPinCode: "",
        about: "",
        fieldOfStudy: "",
        fieldDescription: "",
        dob: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        userType: "Customer",
        isVerified: true,
        isActive: true,
        isDeleted: false,
        profilePercentage: 0,
        interests: [],
        auraPoints: 0,
        id: uuidv4(),
        password: "",
        isJoinedWithGoogle: true,
      },
    });
    if (!newUser.id) {
      res.status(500).json({
        success: false,
        message: "Something went wrong, please try again",
      });
      return;
    }
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET!);
    res.status(200).json({
      success: true,
      message: "Signup successful",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const UpdateSocialController = async (req: Request, res: Response) => {
  try {
    const { userId, portfolioLink, githubLink, linkedinLink } = req.body;
    const validateUser = z.object({
      userId: z.string(),
      portfolioLink: z.string().min(10).max(200),
      githubLink: z.string().min(10).max(200),
      linkedinLink: z.string().min(10).max(200),
    });
    const isValidBody = validateUser.safeParse(req.body);
    if (!isValidBody.success) {
      res.status(400).json({
        success: false,
        message: "Invalid request body",
        errors: isValidBody.error.flatten(),
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
    await client.user.update({
      where: {
        id: userId,
      },
      data: {
        portfolioLink,
        githubLink,
        linkedinLink,
      },
    });
    res.status(200).json({
      success: true,
      message: "Social links updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const UpdateAddressController = async (req: Request, res: Response) => {
  try {
    const { userId, address, zinPinCode, country, state, city } = req.body;
    const validateUser = z.object({
      userId: z.string(),
      address: z.string().optional(),
      zinPinCode: z.string().min(5).max(10),
      country: z.string().min(2).max(50),
      state: z.string().min(2).max(50),
      city: z.string().min(2).max(50),
    });
    const isValidBody = validateUser.safeParse(req.body);
    if (!isValidBody.success) {
      res.status(400).json({
        success: false,
        message: "Invalid request body",
        errors: isValidBody.error.flatten(),
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
    await client.user.update({
      where: {
        id: userId,
      },
      data: {
        address,
        zinPinCode,
        country,
        state,
        city,
      },
    });
    res.status(200).json({
      success: true,
      message: "Address updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const GetRankingsController = async (req: Request, res: Response) => {
  try {
    const country = (req.query.country as string) || "India";
    const state = (req.query.state as string) || "Rajasthan";
    const institution = (req.query.institution as string) || "---";
    const countryFirstUser = await client.user.findMany({
      where: {
        countryRank: { in: [1, 2, 3] },
        country: country || "India",
      },
      orderBy: {
        stateRank: "asc",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        // profileImage: true,
        auraPoints: true,
        countryRank: true,
        email: true,
      },
    });

    const stateFirstUser = await client.user.findMany({
      where: {
        country: country || "India",
        state: state || "Rajasthan",
        stateRank: { in: [1, 2, 3] },
      },
      orderBy: {
        stateRank: "asc",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        // profileImage: true,
        auraPoints: true,
        countryRank: true,
        stateRank: true,
        email: true,
      },
    });

    const institutionFirstUser = await client.user.findMany({
      where: {
        country: country || "India",
        state: state || "Rajasthan",
        institution: institution || "---",
        institutionRank: { in: [1, 2, 3] },
      },
      orderBy: {
        institutionRank: "asc",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        // profileImage: true,
        auraPoints: true,
        countryRank: true,
        stateRank: true,
        institutionRank: true,
        email: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Rankings  fetched successfully",
      rankings: {
        countryTopRankers: countryFirstUser?.length > 0 ? countryFirstUser : [],
        stateTopRankers: stateFirstUser?.length > 0 ? stateFirstUser : [],
        institutionTopRankers:
          institutionFirstUser?.length > 0 ? institutionFirstUser : [],
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ----------------------Dummy test users=----------------------
// import { Request, Response } from "express";
// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcrypt";
// import { v4 as uuidv4 } from "uuid";

// const client = new PrismaClient();

export const CreateTestUsersController = async (
  req: Request,
  res: Response
) => {
  try {
    const country = "India";
    const institution = "IIT Test";
    const states = ["State1", "State2", "State3"];
    const usersData = [];

    // Helper to get random auraPoints between 100 and 1000
    const getAuraPoints = () => Math.floor(Math.random() * 901) + 100;

    // 4 users in State1
    for (let i = 1; i <= 4; i++) {
      usersData.push({
        email: `testuser${i}@example.com`,
        password: await bcrypt.hash(`Password${i}!`, 8),
        username: `testuser${i}`,
        country,
        state: states[0],
        institution,
        id: uuidv4(),
        isVerified: true,
        isActive: true,
        isDeleted: false,
        auraPoints: getAuraPoints(),
        createdAt: new Date(),
        updatedAt: new Date(),
        userType: "Customer",
      });
    }
    // 4 users in State2
    for (let i = 5; i <= 8; i++) {
      usersData.push({
        email: `testuser${i}@example.com`,
        password: await bcrypt.hash(`Password${i}!`, 8),
        username: `testuser${i}`,
        country,
        state: states[1],
        institution,
        id: uuidv4(),
        isVerified: true,
        isActive: true,
        isDeleted: false,
        auraPoints: getAuraPoints(),
        createdAt: new Date(),
        updatedAt: new Date(),
        userType: "Customer",
      });
    }
    // 2 users in State3
    for (let i = 9; i <= 10; i++) {
      usersData.push({
        email: `testuser${i}@example.com`,
        password: await bcrypt.hash(`Password${i}!`, 8),
        username: `testuser${i}`,
        country,
        state: states[2],
        institution,
        id: uuidv4(),
        isVerified: true,
        isActive: true,
        isDeleted: false,
        auraPoints: getAuraPoints(),
        createdAt: new Date(),
        updatedAt: new Date(),
        userType: "Customer",
      });
    }

    const createdUsers = await client.user.createMany({
      data: usersData,
      skipDuplicates: true,
    });

    res.status(201).json({
      success: true,
      message: "10 test users created successfully",
      count: createdUsers.count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
