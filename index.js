const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const authRouter = require("./routers/authRouter");

const app = express();
const server = require("http").createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: "true",
  },
});

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.use("/auth", authRouter);

io.on("connect", (socket) => {});

server.listen(3001, () => {
  console.log("Server listening on port 3001");
});
