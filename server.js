const express = require("express");
const db = require("./db");
const app = express();
var bodyParser = require("body-parser");
require("dotenv").config();
const passport = require("./auth");
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

// middleware function
const logRequest = (req, res, next) => {
  console.log(
    `[${new Date().toLocaleString()}] Request made to : ${req.orignalUrl}`
  );
  next();
};
app.use(logRequest);

app.use(passport.initialize());

const localAuthMiddleware = passport.authenticate("local", { session: false });

app.get("/", localAuthMiddleware, (req, res) => {
  res.send("Hello World");
});

const personRoutes = require("./routes/personRoutes");
const menuRoutes = require("./routes/menuRoutes");

app.use("/person", personRoutes);
app.use("/menu", menuRoutes);

app.listen(PORT, () => {
  console.log("Listing on port 3000");
});
