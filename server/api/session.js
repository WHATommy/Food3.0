const express = require("express");
const Router = express.Router();
const Session = require("../models/session");


// Route    POST api/session
// Desc     Create a session
// Access   Public
Router.post(
    "/",
    async (req, res) => {
        try {
            const newSession = newSession();
            await newSession.save().then(session => { return res.status(200).json(session._id); });
        } catch (err) {
            console.error(err);
            return res.status(500).send("Server error");
        }
    }
);

// Route    GET api/session
// Desc     Fetch a session's information
// Access   Public
Router.get(
    "/:sessionID",
    async (req, res) => {
        const sessionID = req.params.sessionID;
        try {
            const session = await Session.findById(sessionID);
            if(!session) return res.status(404).send("Whoops! Session cannot be found.");
            return res.status(200).json(session);
        } catch (err) {
            console.error(err);
            return res.status(500).send("Server error");
        }
        
    }
)
