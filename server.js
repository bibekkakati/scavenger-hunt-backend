require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL Connection
const db = require("./db/config");
const queries = require("./db/queries");
queries.createTables();

// Importing Routes
const { authRoutes, branchRoutes, notificationRoutes } = require("./routes");

// Home Route
app.get("/", (req, res) => res.send("Welcome to Scavenger Hunt"));

// Auth Routes
app.use("/auth", authRoutes);
app.use("/branch", branchRoutes);
app.use("/notification", notificationRoutes);

// Server Listening at Specified Port
const port = process.env.PORT || 5000;
server.listen(port, () => {
	console.log(`Server is listening at http://localhost:${port}`);
});

// Handling process exit
handleExit = async (signal) => {
	console.log(`Received ${signal}. Closing the server gracefully.`);
	await db.getPool().end();
	process.exit(0);
};
process.on("SIGINT", handleExit);
process.on("SIGQUIT", handleExit);
process.on("SIGTERM", handleExit);

module.exports = server;
