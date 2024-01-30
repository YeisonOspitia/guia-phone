const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
app.use(express.static("dist"));

app.use(
  morgan((tokens, req, res) => {
    const logArray = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ];

    // Si el método es POST, incluir req.body en los registros
    if (req.method === "POST") {
      logArray.push(JSON.stringify(req.body));
    }

    return logArray.join(" ");
  })
);

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/", function (req, res) {
  res.json(persons);
});

app.get("/info", function (req, res) {
  let longitud = persons.length;
  let date = new Date();
  let respuesta = `<p>Phonebook has info for ${longitud} people</p>
                    <p>${date}</p>`;
  res.send(respuesta);
});

app.get("/api/persons", function (req, res) {
  res.json(persons);
});

app.get("/api/persons/:id", function (req, res) {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", function (req, res) {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

app.post("/api/persons/", function (req, res) {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "missing data",
    });
  }

  const existName = persons.find((person) => person.name === body.name);

  if (existName) {
    return res.status(400).json({
      error: "registered name",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);
  res.json(persons);
});

const generateId = () => {
  return Math.floor(Math.random() * 100000000);
};

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
