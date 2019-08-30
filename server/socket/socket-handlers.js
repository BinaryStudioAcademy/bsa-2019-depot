const socketHandlers = (socket) => {
  socket.on('createRoom', (roomId) => {
    socket.join(roomId);
    // console.log(`Someone connected in room ${roomId}`);
  });
  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
    // console.log(`Someone leaves the room ${roomId}`);
  });
};

module.exports = socketHandlers;
