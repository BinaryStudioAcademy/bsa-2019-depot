const socketHandlers = (socket) => {
  socket.on('newIssueComment', (data) => {
    socket.broadcast.emit('newIssueComment', data);
  });
  socket.on('newCommitComment', (data) => {
    socket.broadcast.emit('newCommitComment', data);
  });
};

module.exports = socketHandlers;
