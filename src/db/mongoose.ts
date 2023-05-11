import { connect } from "mongoose";

connect("mongodb://127.0.0.1:27017/dsi-assessment")
  .then(() => {
    console.log("Conectado al servidor MongoDB");
  })
  .catch(() => {
    console.log("No se pudo conectar al servidor MongoDB");
  });
