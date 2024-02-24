const redisClient = require("../redis");

module.exports.authorizeUser = (socket, next) => {
  if (!socket.request.session || socket.request.session.user1) {
    console.log("Bad request: ");
    next(new Error("Not authorized"));
  } else {
    socket.user = { ...socket.request.session.user };
    redisClient.hset(
      `userid: ${socket.user.username}`,
      "useri",
      socket.user.userid
    );
    next();
  }
};
