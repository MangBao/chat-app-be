const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const app = express();
const helmet = require("helmet");
const authRouter = require("./routers/authRouter");
const {
  sessionMiddleware,
  wrap,
  corsConfig,
} = require("./controllers/serverController");
const {
  authorizeUser,
  initializeUser,
  addFriend,
} = require("./controllers/socketController");
const redisClient = require("./redis");
const server = require("http").createServer(app);

const io = new Server(server, {
  cors: corsConfig,
});

app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());
app.use(sessionMiddleware);
app.use("/auth", authRouter);

io.use(wrap(sessionMiddleware));
io.use(authorizeUser);
io.on("connect", (socket) => {
  initializeUser(socket);
  
  socket.on("add_friend", (friendName, cb) => {
    addFriend(socket, friendName, cb);
  });
});

server.listen(3001, () => {
  console.log("Server listening on port 3001");
});
