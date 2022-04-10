const express = require("express");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./config.env" });
const io = require("socket.io")(3002, {
  cors: {
    origin: ["http://localhost:3000"]
  }
});

const app = express();
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI)

const axios = require("axios")
const baseUrl = require("./server-util/baseUrl");

const yelp = require("./api/yelp");
app.use("/yelp", yelp);
const session = require("./api/session");
app.use("/session", session);

let collection;
const port = process.env.PORT || 5000;
app.listen(port, async () => {
  try {
    await mongoose.connect();
    collection = mongoose.db("query-project").collection("sessions");
    console.log(`Server listening on port ${port}`);
  } catch (err) {
    console.error(err);
  }
});

io.on("connection", async (socket) => {
  console.log(socket.id)
  socket.on('join', ({ username, sessionID }) => {
    const user = axios.post(`${baseUrl}/session/${sessionID}`, { client_id: socket.id, username });
    socket.join(user)
    io.to(sessionID).emit('getUsers', {
      users: axios.get(`${baseUrl}/session/${sessionID}`)
    });
  });

  socket.on('stageOne', async ({ query, sessionID }) => {
    console.log(query)
    const res = await axios.post(`${baseUrl}/yelp/`, query)
    io.to(sessionID).emit('loadStageOne', {
      restaurantList: res.data
    });
  });

  socket.on("disconnect", () => {
    console.log("disconnect");
    axios.post(`${baseUrl}/session/${sessionID}`, {client_id: socket.id, username, sessionID});
    if(user) {
        io.to(user.sessionID).emit('getUsers', {
            sessionID: user.sessionID,
            users: axios.get(`${baseUrl}/session/${sessionID}`)
        });
    };
  });
});
