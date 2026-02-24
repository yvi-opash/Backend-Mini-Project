import { Router } from "express";
import { register, login, logout, verifyEmail } from "../controllers/authController";
import auth from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.get("/verify/:token", verifyEmail);
router.post("/login", login);
router.post("/logout", auth, logout);

export default router;