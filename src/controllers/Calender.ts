import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export const getAllCalenderController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    // TODO get upcoming date
  } catch (error) {
    console.error("Error in getAllCalenderController:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
