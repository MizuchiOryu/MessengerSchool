const socketio = require('socket.io')
const Message = require('../models')

module.exports = (server) => {
  const io = socketio(server);

  io.on('connect', (socket) => {
    const { conversation, user } = socket.handshake.query;

    socket.join(conversation);
    console.log(`>>> ${user} joined ${conversation}`);

    socket.on('send-message', async (message) => {
      // await Message.create(message);
      console.log(`--- ${user} says : "${message.text}" in ${conversation}`);
      socket.to(conversation).emit('receive-message');
    });

    socket.on('disconnect', () => console.log(`<<< ${user} in ${conversation} left`));
  });
}


