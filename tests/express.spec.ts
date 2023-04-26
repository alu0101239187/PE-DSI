import "mocha";
import { expect } from "chai";
import request from "request";
import { Funko } from "../src/classes/funko.js";
import { FunkoTypes } from "../src/enums/funko_types.js";
import { FunkoGenres } from "../src/enums/funko_genres.js";

const url = `http://localhost:3000/funkos`;

describe("funkos server tests", () => {
  it("Code 404 on default", (done) => {
    request({ url: `http://localhost:3000`, json: true }, (_, response) => {
      if (response) {
        expect(response.statusCode).to.be.equal(404);
      }
    });

    request(
      { url: `http://localhost:3000/hello`, json: true },
      (_, response) => {
        if (response) {
          expect(response.statusCode).to.be.equal(404);
          done();
        }
      }
    );
  });

  it("Add operation code 200", (done) => {
    request.post(
      {
        url: url,
        body: {
          user: "test",
          funko: {
            _id: 1,
            _name: "Sonic",
            _description: "El Sonic",
            _type: "Pop!",
            _genre: "Videojuegos",
            _franchise: "Sonic the Hedgehog",
            _number: 1,
            _exclusive: true,
            _characteristics: "",
            _value: 20,
          },
        },
        json: true,
      },
      (_, response) => {
        if (response) {
          expect(response.statusCode).to.be.equal(200);
          expect(response.body.success).to.be.true;
          expect(response.body.message).to.be.equal(
            "Funko añadido a la colección de test"
          );
          done();
        }
      }
    );
  });

  it("Add operation code 500", (done) => {
    request.post(
      {
        url: url,
        body: {
          user: "test",
          funko: {
            _id: 1,
            _name: "Sonic",
            _description: "El Sonic",
            _type: "Pop!",
            _genre: "Videojuegos",
            _franchise: "Sonic the Hedgehog",
            _number: 1,
            _exclusive: true,
            _characteristics: "",
            _value: 20,
          },
        },
        json: true,
      },
      (_, response) => {
        if (response) {
          expect(response.statusCode).to.be.equal(500);
        }
      }
    );

    request.post(
      {
        url: url,
        body: {
          user: "test",
          funko: {
            _id: 1,
            _genre: "Videojuegos",
            _franchise: "Sonic the Hedgehog",
            _number: 1,
            _exclusive: true,
            _characteristics: "",
            _value: 20,
          },
        },
        json: true,
      },
      (_, response) => {
        if (response) {
          expect(response.statusCode).to.be.equal(500);
          done();
        }
      }
    );
  });

  it("Add operation code 400", (done) => {
    request.post(
      {
        url: url,
        body: {
          funko: {
            _id: 1,
            _name: "Sonic",
            _description: "El Sonic",
            _type: "Pop!",
            _genre: "Videojuegos",
            _franchise: "Sonic the Hedgehog",
            _number: 1,
            _exclusive: true,
            _characteristics: "",
            _value: 20,
          },
        },
        json: true,
      },
      (_, response) => {
        if (response) {
          expect(response.statusCode).to.be.equal(400);
          expect(response.body.error).to.be.equal(
            "Se deben enviar el nombre de usuario y los datos del Funko"
          );
        }
      }
    );

    request.post(
      {
        url: url,
        body: {
          user: "test",
        },
        json: true,
      },
      (_, response) => {
        if (response) {
          expect(response.statusCode).to.be.equal(400);
          expect(response.body.error).to.be.equal(
            "Se deben enviar el nombre de usuario y los datos del Funko"
          );
          done();
        }
      }
    );
  });

  it("Update operation code 200", (done) => {
    request.patch(
      {
        url: url,
        body: {
          user: "test",
          funko: {
            _id: 1,
            _name: "Mario",
            _description: "El Mario",
            _type: "Pop!",
            _genre: "Videojuegos",
            _franchise: "Super Mario",
            _number: 1,
            _exclusive: true,
            _characteristics: "",
            _value: 40,
          },
        },
        json: true,
      },
      (_, response) => {
        if (response) {
          expect(response.statusCode).to.be.equal(200);
          expect(response.body.success).to.be.true;
          expect(response.body.modifiedCount).to.be.equal(1);
        }
      }
    );

    request.patch(
      {
        url: url,
        body: {
          user: "test",
          funko: {
            _id: 2,
            _name: "Mario",
            _description: "El Mario",
            _type: "Pop!",
            _genre: "Videojuegos",
            _franchise: "Super Mario",
            _number: 1,
            _exclusive: true,
            _characteristics: "",
            _value: 40,
          },
        },
        json: true,
      },
      (_, response) => {
        if (response) {
          expect(response.statusCode).to.be.equal(200);
          expect(response.body.success).to.be.true;
          expect(response.body.modifiedCount).to.be.equal(0);
        }
      }
    );
    request.patch(
      {
        url: url,
        body: {
          user: "test0",
          funko: {
            _id: 1,
            _name: "Mario",
            _description: "El Mario",
            _type: "Pop!",
            _genre: "Videojuegos",
            _franchise: "Super Mario",
            _number: 1,
            _exclusive: true,
            _characteristics: "",
            _value: 40,
          },
        },
        json: true,
      },
      (_, response) => {
        if (response) {
          expect(response.statusCode).to.be.equal(200);
          expect(response.body.success).to.be.true;
          expect(response.body.modifiedCount).to.be.equal(0);
          done();
        }
      }
    );
  });

  it("Update operation code 500", (done) => {
    request.patch(
      {
        url: url,
        body: {
          user: "test",
          funko: {
            _id: 1,
            _genre: "Videojuegos",
            _franchise: "Super Mario",
            _number: 1,
            _exclusive: true,
            _characteristics: "",
            _value: 40,
          },
        },
        json: true,
      },
      (_, response) => {
        if (response) {
          expect(response.statusCode).to.be.equal(500);
          done();
        }
      }
    );
  });

  it("Update operation code 400", (done) => {
    request.patch(
      {
        url: url,
        body: {
          funko: {
            _id: 2,
            _name: "Mario",
            _description: "El Mario",
            _type: "Pop!",
            _genre: "Videojuegos",
            _franchise: "Super Mario",
            _number: 1,
            _exclusive: true,
            _characteristics: "",
            _value: 40,
          },
        },
        json: true,
      },
      (_, response) => {
        if (response) {
          expect(response.statusCode).to.be.equal(400);
          expect(response.body.error).to.be.equal(
            "Se deben enviar el nombre de usuario y los datos del Funko"
          );
        }
      }
    );

    request.patch(
      {
        url: url,
        body: {
          user: "test",
        },
        json: true,
      },
      (_, response) => {
        if (response) {
          expect(response.statusCode).to.be.equal(400);
          expect(response.body.error).to.be.equal(
            "Se deben enviar el nombre de usuario y los datos del Funko"
          );
          done();
        }
      }
    );
  });

  it("Read operation code 200", (done) => {
    request(
      {
        url: url + "?user=test&id=1",
        json: true,
      },
      (_, response) => {
        if (response) {
          expect(response.statusCode).to.be.equal(200);
          console.log(response.body.funkos[0].id);
          expect(response.body.funkos[0].id).to.be.equal(1);
        }
      }
    );

    request(
      {
        url: url + "?user=test&id=2",
        json: true,
      },
      (_, response) => {
        if (response) {
          expect(response.statusCode).to.be.equal(200);
          expect(response.body.funkos).to.be.null;
          done();
        }
      }
    );
  });

  it("Read operation code 500", (done) => {
    request(
      {
        url: url + "?user=test0&id=2",
        json: true,
      },
      (_, response) => {
        if (response) {
          expect(response.statusCode).to.be.equal(500);
          done();
        }
      }
    );
  });

  it("Read operation code 400", (done) => {
    request(
      {
        url: url + "?uid=2",
        json: true,
      },
      (_, response) => {
        if (response) {
          expect(response.statusCode).to.be.equal(400);
          expect(response.body.error).to.be.equal(
            "Se debe enviar el nombre de usuario"
          );
          done();
        }
      }
    );
  });

  it("List operation code 200", (done) => {
    request.post(
      {
        url: url,
        body: {
          user: "test",
          funko: {
            _id: 2,
            _name: "Sonic",
            _description: "El Sonic",
            _type: "Pop!",
            _genre: "Videojuegos",
            _franchise: "Sonic the Hedgehog",
            _number: 1,
            _exclusive: true,
            _characteristics: "",
            _value: 20,
          },
        },
        json: true,
      },
      () => {
        request(
          {
            url: url + "?user=test",
            json: true,
          },
          (_, response) => {
            if (response) {
              expect(response.statusCode).to.be.equal(200);
              expect(Funko.funkoFromJSON(response.body.funkos[0])).to.be.eql(
                new Funko(
                  1,
                  "Mario",
                  "El Mario",
                  FunkoTypes.POP,
                  FunkoGenres.VIDEOGAMES,
                  "Super Mario",
                  1,
                  true,
                  "",
                  40
                )
              );
              expect(Funko.funkoFromJSON(response.body.funkos[1])).to.be.eql(
                new Funko(
                  2,
                  "Sonic",
                  "El Sonic",
                  FunkoTypes.POP,
                  FunkoGenres.VIDEOGAMES,
                  "Sonic the Hedgehog",
                  1,
                  true,
                  "",
                  20
                )
              );
              done();
            }
          }
        );
      }
    );
  });

  it("List operation code 500", (done) => {
    request(
      {
        url: url + "?user=test0",
        json: true,
      },
      (_, response) => {
        if (response) {
          expect(response.statusCode).to.be.equal(500);
          done();
        }
      }
    );
  });

  it("List operation code 400", (done) => {
    request(
      {
        url: url,
        json: true,
      },
      (_, response) => {
        if (response) {
          expect(response.statusCode).to.be.equal(400);
          expect(response.body.error).to.be.equal(
            "Se debe enviar el nombre de usuario"
          );
          done();
        }
      }
    );
  });

  it("Remove operation code 200", (done) => {
    request.delete(
      {
        url: url,
        body: {
          user: "test",
          id: 1,
        },
        json: true,
      },
      (_, response) => {
        if (response) {
          expect(response.statusCode).to.be.equal(200);
          expect(response.body.success).to.be.true;
          expect(response.body.message).to.be.equal(
            "Funko eliminado de la colección de test"
          );
        }
      }
    );

    request.delete(
      {
        url: url,
        body: {
          user: "test",
          id: 2,
        },
        json: true,
      },
      (_, response) => {
        if (response) {
          expect(response.statusCode).to.be.equal(200);
          expect(response.body.success).to.be.true;
          expect(response.body.message).to.be.equal(
            "Funko eliminado de la colección de test"
          );
        }
      }
    );

    request(
      {
        url: url + "?user=test&id=1",
        json: true,
      },
      (_, response) => {
        if (response) {
          expect(response.statusCode).to.be.equal(500);
          expect(response.body.error).to.be.equal(
            "No existe el Funko con ID 1 en la colección del usuario test"
          );
          done();
        }
      }
    );
  });

  it("Remove operation code 500", (done) => {
    request.delete(
      {
        url: url,
        body: {
          user: "test",
          id: 1,
        },
        json: true,
      },
      (_, response) => {
        if (response) {
          expect(response.statusCode).to.be.equal(500);
        }
      }
    );

    request.delete(
      {
        url: url,
        body: {
          user: "test0",
          id: 1,
        },
        json: true,
      },
      (_, response) => {
        if (response) {
          expect(response.statusCode).to.be.equal(500);
          done();
        }
      }
    );
  });

  it("Remove operation code 400", (done) => {
    request.delete(
      {
        url: url,
        body: {
          user: "test",
        },
        json: true,
      },
      (_, response) => {
        if (response) {
          expect(response.statusCode).to.be.equal(400);
          expect(response.body.error).to.be.equal(
            "Se deben enviar el nombre de usuario y el ID del Funko"
          );
        }
      }
    );

    request.delete(
      {
        url: url,
        body: {
          id: 1,
        },
        json: true,
      },
      (_, response) => {
        if (response) {
          expect(response.statusCode).to.be.equal(400);
          expect(response.body.error).to.be.equal(
            "Se deben enviar el nombre de usuario y el ID del Funko"
          );
          done();
        }
      }
    );
  });
});
