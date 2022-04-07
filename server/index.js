const express = require("express");
const io = require("socket.io")(3002, {
  cors: {
    origin: ["http://localhost:3000"]
  }
})
const app = express();
app.use(express.json());

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on('join', ({ username, session }) => {
    console.log(username + "disconnect");
    const user = join(socket.id, username, session);
    socket.join(user.session);
    console.log(user.session, getUsers(user.session));
    io.to(user.session).emit('getUsers', {
        session: user.session,
        users: getUsers(user.session)
    });
  });

  socket.on("disconnect", () => {
    console.log("disconnect");
    const user = leave(socket.id);
    if(user) {
        console.log(user.session, getUsers(user.session));
        io.to(user.session).emit('getUsers', {
            session: user.session,
            users: getUsers(user.session)
        });
    };
  });
});
