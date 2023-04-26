import express from "express";
import bp from "body-parser";
import { Funko } from "../classes/funko.js";
import { MongoClient } from "mongodb";

const dbURL = "mongodb://127.0.0.1:27017";
const dbName = "funko-app";
const app = express();

/*
 * Parser for the message body, without the body will be undefined
 */
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

/*
 * With POST the server adds a Funko
 */
app.post("/funkos", (req, res) => {
  console.log("Cliente conectado, operación add");
  if (!req.body.user || !req.body.funko) {
    res.status(400).send({
      error: `Se deben enviar el nombre de usuario y los datos del Funko`,
    });
  } else {
    MongoClient.connect(dbURL)
      .then((client) => {
        const db = client.db(dbName);
        return db.collection<Funko>(req.body.user as string).findOne({
          id: +(req.body.funko._id as string),
        });
      })
      .then((result) => {
        if (result === null) {
          MongoClient.connect(dbURL)
            .then((client) => {
              const db = client.db(dbName);
              const funko = Funko.funkoFromJSON(req.body.funko);
              return db.collection<Funko>(req.body.user).insertOne({
                id: funko.id,
                name: funko.name,
                description: funko.description,
                type: funko.type,
                genre: funko.genre,
                franchise: funko.franchise,
                number: funko.number,
                exclusive: funko.exclusive,
                characteristics: funko.characteristics,
                value: funko.value,
              });
            })
            .then((result) => {
              res.status(200).send({
                success: result.acknowledged,
                message: `Funko añadido a la colección de ${req.body.user}`,
              });
            })
            .catch((error) => {
              res.status(500).send({
                error: error.message,
              });
            });
        } else {
          res.status(500).send({
            success: false,
            message: `Este Funko ya existe en la colección de ${req.body.user}`,
          });
        }
      })
      .catch((error) => {
        res.status(500).send({
          error: error.message,
        });
      });
  }
});

/*
 * With PATCH the server updates a Funko
 */
app.patch("/funkos", (req, res) => {
  console.log("Cliente conectado, operación update");
  if (!req.body.user || !req.body.funko) {
    res.status(400).send({
      error: `Se deben enviar el nombre de usuario y los datos del Funko`,
    });
  } else {
    MongoClient.connect(dbURL)
      .then((client) => {
        const db = client.db(dbName);
        const funko = Funko.funkoFromJSON(req.body.funko);
        return db.collection<Funko>(req.body.user).updateOne(
          {
            id: funko.id,
          },
          {
            $set: {
              name: funko.name,
              description: funko.description,
              type: funko.type,
              genre: funko.genre,
              franchise: funko.franchise,
              number: funko.number,
              exclusive: funko.exclusive,
              characteristics: funko.characteristics,
              value: funko.value,
            },
          }
        );
      })
      .then((result) => {
        res.status(200).send({
          success: result.acknowledged,
          modifiedCount: result.modifiedCount,
        });
      })
      .catch((error) => {
        res.status(500).send({
          error: error.message,
        });
      });
  }
});

/*
 * With DELETE the server removes a Funko
 */
app.delete("/funkos", (req, res) => {
  console.log("Cliente conectado, operación delete");
  if (!req.body.user || !req.body.id) {
    res.status(400).send({
      error: `Se deben enviar el nombre de usuario y el ID del Funko`,
    });
  } else {
    MongoClient.connect(dbURL)
      .then((client) => {
        const db = client.db(dbName);

        return db.collection<Funko>(req.body.user).deleteOne({
          id: req.body.id,
        });
      })
      .then((result) => {
        res.status(200).send({
          success: result.acknowledged,
          deletedCount: result.deletedCount,
        });
      })
      .catch((error) => {
        res.status(500).send({
          error: error.message,
        });
      });
  }
});

/*
 * With GET the server reads a Funko
 */
app.get("/funkos", (req, res) => {
  if (!req.query.user) {
    res.status(400).send({
      error: `Se debe enviar el nombre de usuario`,
    });
  } else {
    if (!req.query.id) {
      console.log("Cliente conectado, operación list");
      MongoClient.connect(dbURL)
        .then((client) => {
          const db = client.db(dbName);

          return db
            .collection<Funko>(req.query.user as string)
            .find({})
            .toArray();
        })
        .then((result) => {
          res.status(200).send({
            funkos: result,
          });
        })
        .catch((error) => {
          res.status(500).send({
            error: error.message,
          });
        });
    } else {
      console.log("Cliente conectado, operación read");
      MongoClient.connect(dbURL)
        .then((client) => {
          const db = client.db(dbName);

          return db.collection<Funko>(req.query.user as string).findOne({
            id: +(req.query.id as string),
          });
        })
        .then((result) => {
          res.status(200).send({
            funkos: result,
          });
        })
        .catch((error) => {
          res.status(500).send({
            error: error.message,
          });
        });
    }
  }
});

/*
 * By default the server responds with status 404
 */
app.all("*", (req, res) => {
  res.sendStatus(404);
});

/*
 * Starts the server
 */
app.listen(3000, () => {
  console.log("Servidor iniciado en el puerto 3000");
});
