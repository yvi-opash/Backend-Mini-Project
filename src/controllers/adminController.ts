import { Response } from "express";
import User from "../models/User";

// Get All Users (Admin Only)
export const getAllUsers = async (req: any, res: Response) => {
  try {
    const users = await User.find().select("-password -verificationToken");
    res.json(users);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// Delete User (Admin Only)
export const deleteUser = async (req: any, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
