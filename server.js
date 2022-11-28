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
  });

  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  });

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  socket.on("event-1", (message, customerID) => {
    socket.broadcast.emit('display_event-1', {message: message.message, name: message.user}, customerID)
    console.log(`Emitted from UI ${customerID}`)
  });

  socket.on("event-2", (message, customerID) => {
    socket.broadcast.emit('display_event-2', message, customerID)
  });

  socket.on('triggered_handoff', (customerID, customerEmail, history) => {
    socket.broadcast.emit('handover_started', customerID, customerEmail, history)
  });

  socket.on('cancelled_handoff', (customerID) => {
    socket.broadcast.emit('cancelled_handoff', customerID)
  })
})