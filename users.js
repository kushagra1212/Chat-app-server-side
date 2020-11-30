let users = [
  {id:1,name:"",room:22}
];

const adduser = (id, name, room) => {
  const use = users.find((user) => user.name == name && user.room == room);
  if (use) {
    const error = { error: "someone is already here" };
    return null;
  }
  const user = { id: id, name: name, room: room };

  users.push(user);
  return user;
};

const getuser = (id) => {
  const user = users.find((use) => use.id == id);
  if (user) return user;
  else {
    return null;
  }
};
const removeuser = (socketid) => {
  users=users.filter((us) => us.id!=socketid);
  return users;
};
const getusersfromroom = ( room) => {
  const roomusers = users.filter((use) => use.room == room);
  if (roomusers) return roomusers;
  else {
    return null;
  }
};

const getusers = () => {
  return users;
};

module.exports = { getusers, getusersfromroom, getuser, adduser, removeuser };
