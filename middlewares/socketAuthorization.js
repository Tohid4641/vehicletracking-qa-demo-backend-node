const jwt = require('jsonwebtoken');

const verifyToken = (socket, next) => {
  const token = socket.handshake.headers.token;

  if (!token) {
    return next(new Error("Authentication error"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error("Authentication error"));
    }
    socket.userId = decoded.userId;
    next();
  });
};

module.exports = verifyToken;
