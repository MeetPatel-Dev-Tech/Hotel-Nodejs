const express = require("express");
const db = require("./db");
const app = express();
var bodyParser = require("body-parser");
require("dotenv").config();

app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

const personRoutes = require("./routes/personRoutes");
const menuRoutes = require("./routes/menuRoutes");

app.use("/person", personRoutes);
app.use("/menu", menuRoutes);

app.listen(PORT, () => {
  console.log("Listing on port 3000");
});
