const express = require("express");
const app = express();
const server = require("http").Server(app);
app.use(express.static("public"));
app.set("view engine", "ejs");

const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");
const { socket } = require("socket.io");

const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use("/peerjs", peerServer);

app.get("/", (req, res) => {
  console.log(uuidv4());
  return res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  return res.render("application", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    setTimeout(() => {
      socket.to(roomId).broadcast.emit("user connected", userId);
    }, 1000);
  });

  socket.on("disconnected", () => {
    console.log("user disconnected");
    io.emit("user-disconnected", userId);
  });
});
server.listen(3000);
