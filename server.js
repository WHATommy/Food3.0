// NPM libraries
const express = require('express');
const app = express();
const server = require("http").Server(app);
const mongoose = require('mongoose');
const dev = process.env.NODE_ENV !== "production";
require("dotenv").config({ path: "./config.env" });
const connectDb = require("./server-util/connectDb");
connectDb();
app.use(express.json());
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
