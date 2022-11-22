const socket = io('http://localhost:5000')
// const messageContainer = document.getElementById('message-container')
// const messageForm = document.getElementById('send-container')
// const messageInput = document.getElementById('message-input')
const send_button=document.getElementById('send_button')

send_button.style.visibility = 'hidden';

//const name = prompt('What is your name?')
// appendMessage('You joined')
// socket.emit('new-user', name)

// socket.on('connect', () => {
//   console.log(`connect:${socket.id}`);
// });

// socket.on('chat-message', data => {
//   appendMessage(`${data.name}: ${data.message}`)
// })

socket.on('display_event-1', data => {
  appendMessage(data.message, data.name)
})

socket.on('handover_started', () => {
  var accepted = confirmation()
  allowOperator(accepted)
})

function confirmation() {
  return confirm('Operator Requested. Can you join in chat please?');
}

function allowOperator(accepted) {
  if(accepted) {
    send_button.style.visibility = 'visible'
  }else {
    message = 'Currently agent is not available'
    appendMessage(message, 'Bot')
    socket.emit('event-2', message)
  };
}

// socket.on('user-connected', name => {
//   appendMessage(`${name} connected`)
// })

// socket.on('user-disconnected', name => {
//   appendMessage(`${name} disconnected`)
// })
const sendButton = document.getElementById('send_button')
sendButton.addEventListener('click', e => {
  e.preventDefault()
  board = document.getElementById('content_display_id')
  message = document.getElementById('content_box_id')
  content = botMessage({text: message.value}, 'agent')
  board.append(content)
  socket.emit('event-2', message.value)
  message.value = ''
})
// messageForm.addEventListener('submit', e => {
//   e.preventDefault()
//   // const message = messageInput.value
//   // appendMessage(`Agent: ${message}`)
//   // socket.emit('event-2', message)
//   console.log("Cool")
//   // messageInput.value = ''
// })

// function appendMessage(message) {
//   const messageElement = document.createElement('div')
//   messageElement.innerText = message
//   messageContainer.append(messageElement)
// }

function userMessage(message) {
  new_row = document.createElement('div');
  new_row.className = "chat__conversation-board__message-container";
  new_row2 = document.createElement('div');
  new_row2.className = "chat__conversation-board__message__person";
  new_row3 = document.createElement('div');
  new_row3.className = "chat__conversation-board__message__person__avatar";
  img = document.createElement("img");
  img.src = "./customer.png";
  new_row3.appendChild(img)
  new_row4 = document.createElement('div');
  new_row4.className = "chat__conversation-board__message__context";
  content =  document.createElement('div');
  content.className = "chat__conversation-board__message__bubble";
  span_tag = document.createElement("SPAN");
  content1 = document.createTextNode(message);
  span_tag.appendChild(content1)
  content.appendChild(span_tag)
  new_row4.appendChild(content);
  new_row2.appendChild(new_row3)
  new_row.appendChild(new_row2)
  new_row.appendChild(new_row4)
  return new_row
}

function botMessage(message, from) {
  new_row = document.createElement('div');
  new_row.className = "chat__conversation-board__message-container reversed";
  new_row2 = document.createElement('div');
  new_row2.className = "chat__conversation-board__message__person";
  new_row3 = document.createElement('div');
  new_row3.className = "chat__conversation-board__message__person__avatar";
  img = document.createElement("img");
  if (from==='bot') {
    img.src = "./bot.png";
  } else {
    img.src = "./agent.png";
  }
  new_row3.appendChild(img)
  new_row4 = document.createElement('div');
  new_row4.className = "chat__conversation-board__message__context";
  content =  document.createElement('div');
  content.className = "chat__conversation-board__message__bubble";
  span_tag = document.createElement("SPAN");
  content1 = document.createTextNode(message.text);
  span_tag.appendChild(content1)
  if(message.quick_replies) {
    list = message.quick_replies
    list.forEach(element => {
      sub_content =  document.createElement('div');
      sub_content.className = "chat__conversation-board__message__bubble__2";
      //sub_span_tag = document.createElement("SPAN");
      sub_content1 = document.createTextNode(`>>> ${element.title}`);
      //sub_span_tag.appendChild(sub_content1)
      sub_content.appendChild(sub_content1)
      span_tag.appendChild(sub_content)
    });
  }
  content.appendChild(span_tag)
  new_row4.appendChild(content);
  new_row2.appendChild(new_row3)
  new_row.appendChild(new_row2)
  new_row.appendChild(new_row4)
  return new_row
}

function appendMessage(message, sender) {
  board = document.getElementById('content_display_id')
  if (sender === 'Bot') {
    board = document.getElementById('content_display_id')
    new_content = botMessage(message, 'bot')
    board.append(new_content)
  } else {
    board = document.getElementById('content_display_id')
    new_content = userMessage(message)
    board.append(new_content)
  }
}