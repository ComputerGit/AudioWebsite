require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/database");
const { port } = require("./config/env");
const authRoutes = require("./services/auth/routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/api/auth", authRoutes); // Use only one prefix for routes

// Connect Database
connectDB();

app.get("/", (req, res) => res.send("API Running"));

app.listen(port, () => console.log(`Server started on port ${port}`));
