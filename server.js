require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL Connection
const db = require("./db/config");
const queries = require("./db/queries");
queries.createTables();

// Importing Routes
const { authRoutes } = require("./routes");

// Home Route
app.get("/", (req, res) => res.send("Welcome to Scavenger Hunt"));

// Auth Routes
app.use("/auth", authRoutes);

// Server Listening at Specified Port
const port = process.env.PORT || 5000;
app.listen(port, () => {
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
