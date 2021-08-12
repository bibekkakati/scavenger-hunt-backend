const verifySocketToken = require("./middlewares/verifySocketToken");
const server = require("./server");
const { sendNotificationCount } = require("./socketHandlers");
const SocketStore = require("./store/SocketStore");
const options = {
	cors: {
		origin: "*",
	},
};
const io = require("socket.io")(server, options);
const onConnection = (socket) => {
	if (socket.username) {
		SocketStore.add(username, socket);
		// sendNotificationCount(username);

		socket.on("disconnect", () => SocketStore.remove(username));
		socket.on("close", () => SocketStore.remove(username));
	}
};

io.use((socket, next) => {
	const token = socket.handshake.auth.token;
	const username = verifySocketToken(token);
	if (username) {
		socket.username = username;
		return next();
	}
	return next(new Error("Invalid token"));
});
io.on("connection", onConnection);
