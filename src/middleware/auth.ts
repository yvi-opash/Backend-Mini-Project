import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import TokenBlacklist from "../models/TokenBlacklist";

interface AuthRequest extends Request {
  user?: any;
}

export default async function (req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "Access Denied" });
  }

  const token = authHeader.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ message: "No Token Provided" });
  }

  try {
    const blacklisted = await TokenBlacklist.findOne({ token });
    if (blacklisted) {
      return res.status(401).json({ message: "Token has been invalidated" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET as string);

    req.user = verified;
    next();
  } catch {
    res.status(400).json({ message: "Invalid Token" });
  }
}
