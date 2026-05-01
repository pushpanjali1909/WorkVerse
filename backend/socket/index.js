const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);

    // Join user's personal room
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    // Join project room
    socket.on('joinProject', (projectId) => {
      socket.join(`project-${projectId}`);
    });

    // Leave project room
    socket.on('leaveProject', (projectId) => {
      socket.leave(`project-${projectId}`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = setupSocket;
