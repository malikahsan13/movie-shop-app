const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.listen("5000", () => {
  console.log("Server listening on PORT 5000");
});
