const socketio = require('socket.io')
const { Message } = require('../models')

const { BlackList } = require("../schemas");

module.exports = (server) => {
  const io = socketio(server);

  io.on('connect', (socket) => {
    const { conversation, user } = socket.handshake.query;

    socket.join(conversation);
    // console.log(`>>> ${user} joined room ${conversation}`);

    socket.on('send-message', (message) => {
      BlackList.find().then(blackLists => {
        const _message = { ...message }
        const blackListWords = blackLists[0].words
        _message.text = _message.text.replace(/\b\w+\b/g, word => blackListWords.indexOf(word) !== -1 ? '🤡' : word);

        Message.create(_message).then(() => {
          socket.to(conversation).emit('receive-message');
          // console.log(`--- ${user} says : "${message.text}" in room ${conversation}`);
        })
      })
      // console.log(Message)
    });

    socket.on('disconnect', () => console.log(`<<< ${user} left room ${conversation}`));
  });
}


