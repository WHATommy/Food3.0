const express = require("express")();
const cors = require("cors");
const http = require("http").createServer(express);
const io = require("socket.io")(3002, {
    cors: {
      origin: ["http://localhost:3000"]
    }
  });
require("dotenv").config({ path: "./config.env" });
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env["MONGO_URI"]);
const yelp = require('yelp-fusion');
express.use(cors());
var collection;
io.on("connection", (socket) => {
    socket.on("join", async ({ sessionID, username }) => {
        try {
            // Find the collection that has the same ID as the session ID
            let collectionDB = await collection.findOne({ "_id": sessionID});
            // If collection is not found, create one and insert into the database
            if (!collectionDB) {
                collectionDB = await collection.insertOne({ "_id": sessionID, users: [], restaurants: [] });
            }

            // Add user into the collection's users array
            await collection.updateOne({ "_id": sessionID }, {
                "$push": {
                    "users": {
                        id: socket.id,
                        username: username
                    }
                }
            })
            collectionDB = await collection.findOne({ "_id": sessionID});
            console.log("connected");
            // Have user join the session
            socket.join(sessionID);
            io.to(sessionID).emit("joined", {userID: socket.id, users: collectionDB.users});
            socket.activeSession = sessionID;
        } catch (err) {
            console.error(err);
        }
    });
    socket.on("disconnect", async () => {
        try {
            console.log("Disconnected...");
            await collection.updateOne({ "_id": socket.activeSession }, {
                "$pull": {
                    "users": {
                        id: socket.id
                    }
                }
            }, {multi: true});
            console.log(socket.activeSession)
            let collectionDB = await collection.findOne({ "_id": socket.activeSession});
            if(collectionDB.users.length !== 0) {
                io.to(socket.activeSession).emit("disconnected", collectionDB.users);
            } else {
                try {
                    await collection.deleteOne({ "_id": socket.activeSession });
                    console.log(`Session ${socket.activeSession} ended...`)
                } catch (err) {
                    console.error(err);
                }
            }
        } catch (err) {
            console.error(err);
        }
    });
    socket.on("select", async ({ sessionID, restaurant }) => {
        try {
            await collection.updateOne({ "_id": sessionID }, {
                "$push": {
                    "_id": restaurant.id,
                    "restaurants": restaurant
                }        
            });
            io.to(sessionID).emit("selected");
        } catch (err) {
            console.error(err);
        }
    });
    socket.on("remove", async ({ restaurantID }) => {
        try {
            await collection.updateOne({ "_id": socket.activeSession }, {
                "$pull": {
                    "restaurants": restaurantID
                }        
            });
            io.to(socket.activeSession).emit("removed");
        } catch (err) {
            console.error(err);
        }
    });
    socket.on("yelp", async ({sessionID, query}) => {
        if(!socket.activeSession) {
            socket.join(sessionID)
            socket.activeSession = sessionID
        }
        try {
            const client = yelp.client(process.env["YELP_API_KEY"]);
            client.search(query)
            .then(async restaurants => {
                restaurants = JSON.parse(restaurants.body).businesses
                await collection.updateOne({ "_id": socket.activeSession }, { 
                    "$push": {
                        "restaurants": restaurants
                    }      
                });
                io.to(socket.activeSession).emit("getRestaurants", restaurants)
            })
            .catch((err) => {
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
    });
});

http.listen(3003, async () => {
    try {
        await client.connect();
        collection = client.db("sessions").collection("session");
        console.log("Listening on port %s...", http.address().port);
    } catch (e) {
        console.error(e);
    }
});