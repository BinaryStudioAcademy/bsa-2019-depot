const socketHandlers = (socket) => {
  socket.on('createRoom', (issueId) => {
    socket.join(issueId);
    console.log(`Someone connected in room ${issueId}`);
    socket.broadcast.to(issueId).emit('testEventFromServer', issueId);
  });
};

module.exports = socketHandlers;
