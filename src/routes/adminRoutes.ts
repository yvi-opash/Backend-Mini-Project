import { Router } from "express";
import auth from "../middleware/auth";
import { isAdmin } from "../middleware/roleAuth";
import { getAllUsers, deleteUser } from "../controllers/adminController";

const router = Router();

router.get("/users", auth, isAdmin, getAllUsers);
router.delete("/users/:id", auth, isAdmin, deleteUser);

export default router;
