import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import TokenBlacklist from "../models/TokenBlacklist";
import { generateVerificationToken, sendVerificationEmail } from "../utils/email";

// Register
export const register = async (req: Request, res: Response) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const verificationToken = generateVerificationToken();

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role || "user",
      verificationToken
    });

    await user.save();
    await sendVerificationEmail(user.email, verificationToken);

    res.json({ message: "User Registered Successfully. Please check your email to verify your account." });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// Verify Email
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    
    if (!user) {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: "Email verified successfully. You can now login." });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    if (!user.isVerified)
      return res.status(400).json({ message: "Please verify your email before logging in" });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );  

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// Logout
export const logout = async (req: any, res: Response) => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader?.split(" ")[1];

    if (token) {
      const decoded: any = jwt.decode(token);
      const expiresAt = new Date(decoded.exp * 1000);

      await TokenBlacklist.create({ token, expiresAt });
    }

    res.json({ message: "Logged out successfully" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};