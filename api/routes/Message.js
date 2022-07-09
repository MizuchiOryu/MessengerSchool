const socketio = require('socket.io')
const Message = require('../models')

module.exports = (server) => {
  const io = socketio(server);

  io.on('connect', (socket) => {
    const { id } = socket.handshake.query;
    const { username } = socket.handshake.query;

    socket.join(id);
    // console.log(`>>>>>> ${username} joined ${id}`);

    socket.on('send-message', async (message) => {
      await Message.create(message);
      socket.to(id).emit('receive-message');
    });

    socket.on('disconnect', () => console.log(`${username} in ${id} left`));
  });
}


