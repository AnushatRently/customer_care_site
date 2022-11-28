const socket = io('http://3.234.144.111:5000/')
// const messageContainer = document.getElementById('message-container')
// const messageForm = document.getElementById('send-container')
// const messageInput = document.getElementById('message-input')
// const send_button=document.getElementById('send_button')

// send_button.style.visibility = 'hidden';

//const name = prompt('What is your name?')
// appendMessage('You joined')
// socket.emit('new-user', name)

// socket.on('connect', () => {
//   console.log(`connect:${socket.id}`);
// });

// socket.on('chat-message', data => {
//   appendMessage(`${data.name}: ${data.message}`)
// })

socket.on('display_event-1', (data, customerID) => {
  appendMessage(data.message, data.name, customerID)
})

socket.on('handover_started', (customerID, customerEmail, history) => {
  const confirmation = confirm(`User ${customerEmail} wants to connect !!!`)
  if (confirmation) {
    createNewTab(customerID, customerEmail);
    handleHistory(history, customerID, customerEmail);
  } else {
    socket.emit('cancelled_handoff', customerID)
  }
})

function createNewTab(customerID, customerEmail) {
  tabElement = document.getElementById('tab_id');
  newTab = document.createElement('div');
  newTab.className = "chat__conversation-board__message__bubble_tab";
  newTab.setAttribute('id', `tab_${customerID}`)
  span_tag = document.createElement("SPAN");
  span_tag.setAttribute('data-tab-value', customerID);
  title = document.createTextNode(`${customerEmail}`);
  span_tag.appendChild(title)
  span_tag.style.fontSize = '15px'
  newTab.appendChild(span_tag)

  // tabElement = document.getElementById('tab_id');
  // newTab = document.createElement('SPAN');
  // newTab.setAttribute('data-tab-value', customerID);
  // title = document.createTextNode(`User ${customerID}`);
  // newTab.appendChild(title);
  tabElement.appendChild(newTab);
  
  createNewTabContent(customerID)
  eventListinerForTab(customerID)
  eventListnerForButton(customerID)
}

function createNewTabContent(customerID) {
  tabContent = document.getElementById('tab_content_id');
  tabContentElement = document.createElement('div');
  tabContentElement.className = 'tabs__tab';
  window.tabs = document.querySelectorAll('[data-tab-info=""]')
  console.log(document.querySelectorAll('[data-tab-info=""]').length === 0)
  if (document.querySelectorAll('[data-tab-info=""]').length === 0) tabContentElement.classList.add('active');
  //tabContentElement.classList.add('active');
  tabContentElement.setAttribute('data-tab-info', '');
  tabContentElement.setAttribute('id', `customer_${customerID}`);
  screen = createScreen(customerID);
  tabContentElement.appendChild(screen);
  tabContent.appendChild(tabContentElement);
}

function createScreen(customerID) {
    screen = document.createElement('div');
    screen.className = "--dark-theme";
    screen.setAttribute('id', 'chat');
    content_display = document.createElement('div');
    content_display.className = 'chat__conversation-board';
    content_display.setAttribute('id', 'content_display_id')
    screen.appendChild(content_display)

    panel = document.createElement('div');
    panel.className = 'chat__conversation-panel';
    panel_container = document.createElement('div');
    panel_container.className = 'chat__conversation-panel__container'

    inputBox = document.createElement('input');
    inputBox.className = 'chat__conversation-panel__input panel-item';
    inputBox.setAttribute('id', 'content_box_id')
    inputBox.setAttribute('placeholder', 'Type a message...')
    panel_container.appendChild(inputBox)

    button = document.createElement('BUTTON');
    button.className = 'chat__conversation-panel__button panel-item btn-icon send-message-button'
    button.setAttribute('id', 'send_button');

    img = document.createElement('img');
    img.setAttribute('width', '24');
    img.setAttribute('height', '24');
    img.setAttribute('src', './arrow.png');
    button.appendChild(img);
    panel_container.appendChild(button);

    panel.appendChild(panel_container);
    screen.appendChild(panel)
    
    return screen
}

function eventListinerForTab(customerID) {
  const tab = document.getElementById(`tab_${customerID}`)
  tab.addEventListener('click', () => {
    const tabInfos = document.querySelectorAll('[data-tab-info=""]')
    const tabInfo = document.getElementById(`customer_${customerID}`)

    tabInfos.forEach(tabInfo => {
        tabInfo.classList.remove('active')
    })
    
    tabInfo.classList.add('active');
  })
}

function eventListnerForButton(customerID) {
  const tab_info = document.getElementById(`customer_${customerID}`)
  window.tab = tab_info
  const sendButton = tab_info.querySelector('#send_button')
  const inputBox = tab_info.querySelector('#content_box_id')
  sendButton.addEventListener('click', e => {
      e.preventDefault()
      board = tab_info.querySelector('#content_display_id')
      message = tab_info.querySelector('#content_box_id')
      content = botMessage({text: message.value}, 'agent')
      board.append(content)
      socket.emit('event-2', message.value, customerID)
      message.value = ''
      window.board
      board.scrollTop = board.scrollHeight
    })

    inputBox.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        e.preventDefault()
        board = tab_info.querySelector('#content_display_id')
        message = tab_info.querySelector('#content_box_id')
        content = botMessage({text: message.value}, 'agent')
        board.append(content)
        socket.emit('event-2', message.value, customerID)
        message.value = ''
        board.scrollTop = board.scrollHeight
      }
    })  
}

function handleHistory(data, customerID, customerEmail) {
  tab_content = document.getElementById(`customer_${customerID}`)
  board = tab_content.querySelector('#content_display_id')
  line1 = document.createElement('p');
  content1 = document.createTextNode(`Conversation between ${customerEmail} and bot`);
  line1.appendChild(content1)
  line1.style.textAlign = 'center'
  line1.style.color = 'white'
  line1.style.fontSize = '20px'
  board.appendChild(line1)
  Object.keys(data).map((key) => {
    if (data[key].user === 'user') {
      message = `${data[key].text} (${data[key].intent}) --> ${data[key].timestamp}`
      appendMessage(message, 'user', customerID)
    } else {
      message = {text: data[key].text, quick_replies: data[key].buttons}
      appendMessage(message, 'Bot', customerID)
    }
  })
}

// socket.on('user-connected', name => {
//   appendMessage(`${name} connected`)
// })

// socket.on('user-disconnected', name => {
//   appendMessage(`${name} disconnected`)
// })
// const sendButton = document.getElementById('send_button')
// sendButton.addEventListener('click', e => {
//   e.preventDefault()
//   board = document.getElementById('content_display_id')
//   message = document.getElementById('content_box_id')
//   content = botMessage({text: message.value}, 'agent')
//   board.append(content)
//   socket.emit('event-2', message.value)
//   message.value = ''
// })
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

function appendMessage(message, sender, customerID) {
  tab_content = document.getElementById(`customer_${customerID}`)
  board = tab_content.querySelector('#content_display_id')
  //board = document.getElementById('content_display_id')
  if (sender === 'Bot') {
    new_content = botMessage(message, 'bot')
    board.append(new_content)
  } else {
    new_content = userMessage(message)
    board.append(new_content)
  }
  board.scrollTop = board.scrollHeight
}