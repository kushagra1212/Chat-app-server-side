const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 8000;
const cors = require("cors");
app.use(cors());
const router = require("./routes/route");

const {
  getusers,
  getusersfromroom,
  getuser,
  adduser,
  removeuser,
} = require("./users");


let x = Math.floor(Math.random() * 250);
let y = Math.floor(Math.random() * 250);
let z = Math.floor(Math.random() * 250);

app.use(router);

io.on("connection", (socket) => {
  
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
        name:us.name
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
  socket.on('getusers',(room)=>{
    const us=getusersfromroom(room);
console.log(us);
    if(us) socket.emit('hereareusers',us);
    else console.log("nothing hp")
    
  })
  socket.on("disconnect", async () => {
    const us = await getuser(socket.id);
    let afterremoveduser;
    if(us)  afterremoveduser=removeuser(socket.id);
    console.log(afterremoveduser)
    if (us) {
      socket
        .to(us.room)
        .broadcast.emit(
          "disconnectedfromallusers",
          {msg:`${us.name} has left the chat`,afterremoveduser:afterremoveduser}
        );
    }
  });
});

server.listen(PORT, () => console.log(`runnig on port ${PORT}`));
