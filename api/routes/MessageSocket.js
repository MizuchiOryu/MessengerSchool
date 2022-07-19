const socketio = require('socket.io')
const { Message } = require('../models')

module.exports = (server) => {
  const io = socketio(server);

  io.on('connect', (socket) => {
    const { conversation, user } = socket.handshake.query;

    socket.join(conversation);
    console.log(`>>> ${user} joined room ${conversation}`);

    socket.on('send-message', async (message) => {
      console.log(Message)
      await Message.create(message);
      console.log(`--- ${user} says : "${message.text}" in room ${conversation}`);
      socket.to(conversation).emit('receive-message');
    });

    socket.on('disconnect', () => console.log(`<<< ${user} left room ${conversation}`));
  });
}


