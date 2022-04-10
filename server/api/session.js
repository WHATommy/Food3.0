const express = require("express");
const Router = express.Router();
const Session = require("../models/sessionModal");

// Route    POST api/session
// Desc     Create a session
// Access   Public
Router.post(
    "/create/:sessionID",
    async (req, res) => {
        try {
            const sessionID = req.params.sessionID;
            const newSession = new Session({
                sessionID: sessionID,
                users: [],
                restaurantList: []
            });
            await newSession.save().then(res => console.log(res));
            return res.status(200).send("Session created")
        } catch (err) {
            console.error(err);
            return res.status(500).send("Server error");
        }
    }
);

// Route    POST api/session
// Desc     Add a user into the session
// Access   Public
Router.put(
    "/:sessionID",
    async (req, res) => {
        const sessionID = req.params.sessionID;
        const {
            client_id,
            username
        } = req.body;
        try {
            const session = await Session.findById(sessionID);
            if(session) console.log("Session found")
            if(!session) return res.status(404).send("Whoops! Session cannot be found.");
            
            const user = {
                client_id,
                username
            };

            session.users.push(user);
            return res.status(200).json(user);

        } catch (err) {
            console.error(err);
            return res.status(500).send("Server error");
        }
    }
)

// Route    POST api/session
// Desc     Remove a user into the session
// Access   Public
Router.put(
    "/:sessionID",
    async (req, res) => {
        const sessionID = req.params.sessionID;
        const {
            client_id
        } = req.body;
        try {
            const session = await Session.findById(sessionID);
            if(!session) return res.status(404).send("Whoops! Session cannot be found.");
            session.users = session.users.filter(user => user.client_id !== client_id);
            return res.status(200).json(session.users);
        } catch (err) {
            console.error(err);
            return res.status(500).send("Server error");
        }
    }
)

// Route    DELETE api/session
// Desc     Delete a session
// Access   Public
Router.delete(
    "/:sessionID",
    async (req, res) => {
        const sessionID = req.params.sessionID;
        try {
            const session = await Session.findById(sessionID);
            if(!session) return res.status(404).send("Whoops! Session cannot be found.");
            await session.remove();
            return res.status(200).send(true);
        } catch (err) {
            console.error(err);
            return res.status(500).send("Server error");
        }
    }
)

module.exports = Router;
