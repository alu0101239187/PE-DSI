import { Document, Schema, model } from "mongoose";
import { UserDocumentInterface } from "./user.js";

export interface ProductDocumentInterface extends Document {
  name: string;
  description: string;
  price: number;
  category: "Deporte" | "Videojuegos" | "Moda" | "Gastronomía";
  users: UserDocumentInterface[];
}

const ProductSchema = new Schema<ProductDocumentInterface>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
    validate: (value: number) => {
      if (value < 0) {
        throw new Error("Un producto no puede tener precio negativo");
      }
    },
  },
  category: {
    type: String,
    trim: true,
    required: true,
    default: "Deporte",
    enum: ["Deporte", "Videojuegos", "Moda", "Gastronomía"],
  },
  users: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: "User",
  },
});

export const Product = model<ProductDocumentInterface>(
  "Product",
  ProductSchema
);
