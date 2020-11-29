const users = [
  { name: "kush", room: 1111 },
  { name: "h", room: 1111 },
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
const removeuser = ({ name, room }) => {
  users.filter((us) => us.name !== name && us.room !== room);
};
const getusersfromroom = ({ room }) => {
  const roomusers = users.filter((use) => use.room == room);
  if (roomusers) return roomusers;
  else {
    return { error: "no user found" };
  }
};

const getusers = () => {
  return users;
};

module.exports = { getusers, getusersfromroom, getuser, adduser, removeuser };
