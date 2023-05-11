import express from "express";
import "./db/mongoose.js";
import { defaultRouter } from "./routers/default.js";
import { userRouter } from "./routers/user.js";
import { productRouter } from "./routers/product.js";

const app = express();
app.use(express.json());
app.use(userRouter);
app.use(productRouter);
app.use(defaultRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
