const express = require("express");
const app = express();

app.use(express.json());
        
let users = [
  { id: 1, name: "Ali", age: 12 },
  { id: 2, name: "Vali", age: 15 },
];

let products = [
  { id: 1, title: "Mouse", price: 100 },
  { id: 2, title: "Keyboard", price: 200 },
];

const isNum = (v) => Number.isFinite(Number(v));

function validateUser(name, age) {
  if (!name || !String(name).trim()) return "Name required";
  if (!isNum(age)) return "Age must be number";
  if (Number(age) <= 0) return "Age must be > 0";
  return null;
}

function validateProduct(title, price) {
  if (!title || !String(title).trim()) return "Title required";
  if (!isNum(price)) return "Price must be number";
  if (Number(price) <= 0) return "Price must be > 0";
  return null;
}
app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

app.post("/users", (req, res) => {
  const { name, age } = req.body;

  const err = validateUser(name, age);
  if (err) return res.status(400).json({ message: err });

  const newId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
  const newUser = { id: newId, name: String(name).trim(), age: Number(age) };
  users.push(newUser);

  res.status(201).json(newUser);
});

app.put("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return res.status(404).json({ message: "User not found" });

  const { name, age } = req.body;

  const err = validateUser(name, age);
  if (err) return res.status(400).json({ message: err });

  users[idx] = { id, name: String(name).trim(), age: Number(age) };
  res.json(users[idx]);
});

app.delete("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return res.status(404).json({ message: "User not found" });

  const deleted = users.splice(idx, 1)[0];
  res.json(deleted);
});

app.get("/users/error", (req, res, next) => {
  next(new Error("Users error test"));
});
app.get("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((p) => p.id === id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

app.post("/products", (req, res) => {
  const { title, price } = req.body;

  const err = validateProduct(title, price);
  if (err) return res.status(400).json({ message: err });

  const newId = products.length
    ? Math.max(...products.map((p) => p.id)) + 1
    : 1;
  const newProduct = {
    id: newId,
    title: String(title).trim(),
    price: Number(price),
  };
  products.push(newProduct);

  res.status(201).json(newProduct);
});

app.put("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ message: "Product not found" });

  const { title, price } = req.body;

  const err = validateProduct(title, price);
  if (err) return res.status(400).json({ message: err });

  products[idx] = { id, title: String(title).trim(), price: Number(price) };
  res.json(products[idx]);
});

app.delete("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ message: "Product not found" });

  const deleted = products.splice(idx, 1)[0];
  res.json(deleted);
});

app.get("/products/error", (req, res, next) => {
  next(new Error("Products error test"));
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

app.listen(3000, () => console.log("http://localhost:3000"));