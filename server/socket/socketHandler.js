const jwt = require('jsonwebtoken');
const User = require('../models/User');

const onlineUsers = new Map();

function setupSocket(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        return next(new Error('User not found'));
      }
      socket.userId = user._id.toString();
      socket.userRole = user.role;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(new Error('Session expired, please login again'));
      }
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    onlineUsers.set(userId, socket.id);
    socket.join(userId);

    io.emit('online-users', onlineUsers.size);

    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      io.emit('online-users', onlineUsers.size);
    });
  });
}

module.exports = { setupSocket, onlineUsers };
