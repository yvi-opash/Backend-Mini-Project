import { Router } from "express";
import auth from "../middleware/auth";
import {
  createItem,
  getItems,
  updateItem,
  deleteItem
} from "../controllers/itemController";

const router = Router();

router.post("/", auth, createItem);
router.get("/", auth, getItems);
router.put("/:id", auth, updateItem);
router.delete("/:id", auth, deleteItem);

export default router;