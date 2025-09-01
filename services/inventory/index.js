const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const DB_FILE = path.join(__dirname, "inventory.json");
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({}), "utf8");

const readDB = () => JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
const writeDB = (db) => fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));

// view all
app.get("/inventory", (req, res) => res.json(readDB()));

// update one
app.post("/update", (req, res) => {
  const { item_id, stock_level, ts } = req.body || {};
  if (!item_id || stock_level === undefined) {
    return res.status(400).json({ error: "item_id and stock_level required" });
  }
  const db = readDB();
  db[item_id] = { stock_level, ts: ts || new Date().toISOString() };
  writeDB(db);
  res.json({ status: "updated", item: db[item_id] });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Inventory service running on port ${PORT}`));
