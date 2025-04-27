import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const isValidToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (!decoded) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    req.body.userId = (decoded as { userId: string }).userId;

    next();
  } catch (err) {}
};
