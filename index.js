const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 8000;
const cors = require("cors");
const router = require("./routes/route");

const {
  getusers,
  getusersfromroom,
  getuser,
  adduser,
  removeuser,
} = require("./users");
app.use(cors());

let x = Math.floor(Math.random() * 250);
let y = Math.floor(Math.random() * 250);
let z = Math.floor(Math.random() * 250);

app.use(router);

io.on("connection", (socket) => {
  console.log("someone has joined the chat");
  socket.on("join", ({ name, room }) => {
    socket.emit("welcomerrormessage", `someone is already there`);
    x = Math.floor(Math.random() * 250);
    z = Math.floor(Math.random() * 250);
    y = Math.floor(Math.random() * 250);
    const us = adduser(socket.id, name, room);
    if (!us) {
      return;
    } else {
      socket.emit("welcomemessage", {
        mass: `welcome to the chat ${us.name}`,
        rom: us.room,
      });
      socket
        .to(us.room)
        .broadcast.emit("messagebroadcast", `${us.name} has joined the chat`);

      socket.join(us.room);
    }
  });
  socket.on("sendmessage", (mas) => {
    const us = getuser(socket.id);
    if (us) {
      socket
        .to(us.room)
        .broadcast.emit("onotherside", {
          mas: mas,
          name: us.name,
          bgcol: "rgb(" + x + "," + y + "," + z + ")",
        });
      socket.emit("onmyside", {
        mas: mas,
        name: us.name,
        bgcol: "rgb(" + x + "," + z + "," + y + ")",
      });
    } else {
      console.log(us);
      console.log("erorsaaa");
    }
  });
  socket.on("disconnect", async () => {
    const us = await getuser(socket.id);
    removeuser({ name: us.name, room: us.room });
    if (us) {
      socket
        .to(us.room)
        .broadcast.emit(
          "disconnectedfromallusers",
          `${us.name} has left the chat`
        );
    }
  });
});

server.listen(PORT, () => console.log("runnig on port"));
