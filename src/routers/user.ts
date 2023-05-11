import express from "express";
import { User, UserDocumentInterface } from "../models/user.js";
import { Product } from "../models/product.js";

export const userRouter = express.Router();

userRouter.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    return res.status(201).send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
});

userRouter.get("/users", async (req, res) => {
  const filter = req.query.username
    ? { username: req.query.username.toString() }
    : {};

  try {
    const users = await User.find(filter);

    if (users.length !== 0) {
      return res.send(users);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

userRouter.patch("/users", async (req, res) => {
  if (!req.query.username) {
    return res.status(400).send({
      error: "Se debe proveer un nombre de usuario",
    });
  }

  const allowedUpdates = ["name", "email", "username", "preference"];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(400).send({
      error: "Actualización no permitida",
    });
  }

  try {
    const user = await User.findOneAndUpdate(
      {
        username: req.query.username.toString(),
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (user) {
      return res.send(user);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

userRouter.delete("/users", async (req, res) => {
  if (!req.query.username) {
    return res.status(400).send({
      error: "Se debe proveer un nombre de usuario",
    });
  }

  try {
    const user = await User.findOne({
      username: req.query.username.toString(),
    });
    if (!user) {
      return res.status(404).send();
    }
    const products = await Product.find();
    for (let i = 0; i < products.length; i++) {
      const new_users: UserDocumentInterface[] = [];

      for (let j = 0; j < products[i].users.length; j++) {
        if (!products[i].users[j].equals(user._id)) {
          new_users.push(products[i].users[j]);
        }
      }
      await Product.findByIdAndUpdate(
        products[i]._id,
        { users: new_users },
        {
          new: true,
          runValidators: true,
        }
      );
    }
    await User.findByIdAndDelete(user._id);
    return res.send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
});
