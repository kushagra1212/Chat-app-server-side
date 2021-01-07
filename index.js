const express=require("express");
const app = express();
const server = require("http").createServer(app);
const mongoose=require("mongoose");
require('dotenv').config();
const DB_conn=process.env.DB_CONN;
const options={
  cors:true,
  origins:[process.env.URL_CLI]
 }
 const cors=require('cors');
const io = require("socket.io")(server,options);
const mongodb=DB_conn;
const PORT = process.env.PORT ||8000;
app.use(cors());
mongoose.connect(mongodb,{ useNewUrlParser: true , useUnifiedTopology: true});
const db=mongoose.connection;
app.use(express.json())
db.on('connected',()=>{
  console.log("connected to the db");
  server.listen(PORT, () => console.log(`runnig on port ${PORT}`));
})





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
          room:us.room

        });
      socket.emit("onmyside", {
        mas: mas,
        name: us.name,
        bgcol: "rgb(" + x + "," + z + "," + y + ")",
        room:us.room
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


