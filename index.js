const express = require("express");
const app = express();
const server = require("http").Server(app);
app.use(express.static("public"));
const { v4: uuidv4 } = require("uuid");

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  console.log(uuidv4());
  return res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  return res.render("application", { roomId: req.params.room });
});

server.listen(3000);
