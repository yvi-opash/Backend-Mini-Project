import mongoose, { Document, Schema, Types  } from "mongoose";

export interface IItem extends Document {
  title: string;
  description: string;
  user: Types.ObjectId;
}

const ItemSchema = new Schema<IItem>({
  title: { type: String, required: true },
  description: { type: String },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true }
});

export default mongoose.model<IItem>("Item", ItemSchema);