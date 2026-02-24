import { Response } from "express";
import Item from "../models/Item";

interface AuthRequest extends Request {
  user?: any;
}

// Create
export const createItem = async (req: any, res: Response) => {
  const item = new Item({
    title: req.body.title,
    description: req.body.description,
    user: req.user.id
  });

  await item.save();
  res.json(item);
};

// Read
export const getItems = async (req: any, res: Response) => {
  const items = await Item.find({ user: req.user.id });
  res.json(items);
};

// Update
export const updateItem = async (req: any, res: Response) => {
  const updated = await Item.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  );

  res.json(updated);
};

// Delete
export const deleteItem = async (req: any, res: Response) => {
  await Item.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id
  });

  res.json({ message: "Item Deleted Successfully" });
};