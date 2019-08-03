const express = require("express");
const uuid = require("uuid");

const app = express();

app.use(express.json());

const users = [
  { id: 1, nome: "Gustavo" },
  { id: 2, nome: "Letícia" },
  { id: 3, nome: "Maria" },
  { id: 4, nome: "João" }
];

function checkUserExists(req, res, next) {
  if (!req.body.user) {
    return res.status(400).json({ error: "User name is required" });
  }

  return next();
}

app.get("/users/:id", (req, res) => {
  const { id } = req.params;

  const user = users.find(user => user.id == id);

  res.json(user);
});

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", (req, res) => {
  const { nome } = req.body;

  const user = {
    id: uuid.v4(),
    nome
  };

  users.push(user);

  res.json(users);
});

app.put("/users/:id", checkUserExists, (req, res) => {
  const { nome } = req.body;
  const { id } = req.params;

  let user = users.find(user => user.id === Number(id));
  user.nome = nome;

  res.json({ user });
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  let userIndex = users.findIndex(user => user.id === Number(id));

  if (userIndex === -1) {
    return res.json({ msg: "User does not exist!", users });
  }

  users.splice(userIndex, 1);

  res.json({ msg: "User deleted with success!", users });
});

app.listen(5000, console.log("Server running on port 5000"));
