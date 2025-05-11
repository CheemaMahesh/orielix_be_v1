import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenObject extends JwtPayload {
  userId: string;
}

// Add userId directly to the Request interface
interface AuthRequest extends Request {
  userId?: string;
}

export const isValidToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenObject;

    // Check if decoded token has userId
    if (!decoded || !decoded.userId) {
      res.status(401).json({
        success: false,
        message: "Invalid token - missing user ID",
      });
      return;
    }

    // Initialize req.body if it doesn't exist
    if (!req.body) {
      req.body = {};
    }

    // Add userId to both places for maximum compatibility
    req.userId = decoded.userId;
    req.body.userId = decoded.userId; // Don't stringify it - keep as original type

    // Log successful authentication
    console.log(`Authenticated user: ${decoded.userId}`);

    // Proceed to the next middleware
    next();
  } catch (err) {
    // Handle different JWT errors
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: "Token has expired",
      });
      return;
    } else if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: "Invalid token signature",
      });
      return;
    } else {
      console.error("Auth error:", err);
      res.status(401).json({
        success: false,
        message: "Authentication failed",
      });
      return;
    }
  }
};
