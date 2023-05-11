import express from "express";
import { User, UserDocumentInterface } from "../models/user.js";
import { Product } from "../models/product.js";

export const productRouter = express.Router();

productRouter.post("/products", async (req, res) => {
  const users: UserDocumentInterface[] = [];
  for (let index = 0; index < req.body.users.length; index++) {
    const user = await User.findOne({
      username: req.body.users[index],
    });
    if (!user) {
      return res.status(404).send({
        error: `El usuario ${index} del producto introducido no existe`,
      });
    } else {
      users.push(user._id);
    }
  }
  const product = new Product({ ...req.body, users: users });

  try {
    await product.save();
    await product.populate({
      path: "users",
      select: ["username"],
    });
    return res.status(201).send(product);
  } catch (error) {
    return res.status(500).send(error);
  }
});

productRouter.get("/products", async (req, res) => {
  const filter = req.query.id ? { _id: req.query.id } : {};

  try {
    const products = await Product.find(filter).populate({
      path: "users",
      select: ["username"],
    });

    if (products.length !== 0) {
      return res.send(products);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

productRouter.patch("/products", async (req, res) => {
  if (!req.query.id) {
    return res.status(400).send({
      error: "Se debe proveer un ID",
    });
  }

  const allowedUpdates = ["name", "description", "price", "category", "users"];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(400).send({
      error: "Actualización no permitida",
    });
  }

  const users: UserDocumentInterface[] = [];
  for (let index = 0; index < req.body.users.length; index++) {
    const user = await User.findOne({
      username: req.body.users[index],
    });
    if (!user) {
      return res.status(404).send({
        error: `El usuario ${index} del producto introducido no existe`,
      });
    } else {
      users.push(user._id);
    }
  }

  try {
    const product = await Product.findByIdAndUpdate(
      req.query.id,
      { ...req.body, users: users },
      {
        new: true,
        runValidators: true,
      }
    ).populate({
      path: "users",
      select: ["username"],
    });

    if (product) {
      return res.send(product);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

productRouter.delete("/products", async (req, res) => {
  if (!req.query.id) {
    return res.status(400).send({
      error: "Se debe proveer un ID",
    });
  }

  try {
    const product = await Product.findByIdAndDelete(req.query.id).populate({
      path: "users",
      select: ["username"],
    });
    return res.send(product);
  } catch (error) {
    return res.status(500).send(error);
  }
});
