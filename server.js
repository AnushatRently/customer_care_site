const io = require("socket.io")(5000, {
  cors: {
    origin: "*"
  }
});

const users = {}

// io.listen(5000, ()=>{
//   console.log("Application running successfully on port: ");
// });

io.on('connection', socket => {

  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
  socket.on("event-1", message => {
    socket.broadcast.emit('display_event-1', {message: message.message, name: message.user})
    console.log('Broadcasted')
  });

  socket.on("event-2", message => {
    socket.broadcast.emit('display_event-2', message)
    console.log('Broadcasted')
  });
  socket.on('triggered_handoff', () => {
    socket.broadcast.emit('handover_started')
  })
})