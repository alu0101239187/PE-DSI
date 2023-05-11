import { Document, Schema, model } from "mongoose";
import validator from "validator";

export interface UserDocumentInterface extends Document {
  name: string;
  email: string;
  username: string;
  preference: "Deporte" | "Videojuegos" | "Moda" | "Gastronomía";
}

const UserSchema = new Schema<UserDocumentInterface>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value: string) {
      if (!validator.default.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  preference: {
    type: String,
    trim: true,
    required: true,
    default: "Deporte",
    enum: ["Deporte", "Videojuegos", "Moda", "Gastronomía"],
  },
});

export const User = model<UserDocumentInterface>("User", UserSchema);
