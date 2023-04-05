const socket = io();
let name;
let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message__area");
let sandBtn = document.querySelector("#sandBtn");
do {
  name = prompt("Please enter your name: ");
} while (!name);

textarea.addEventListener("keyup", (e) => {
    let data = {
        user: name,
      };
  socket.emit("typing", data);
  //    sendMessage(e.target.value)
});

sandBtn.addEventListener("click", () => {
  sendMessage(textarea.value);
});

function sendMessage(message) {
  let msg = {
    user: name,
    message: message.trim(),
  };
  // Append
  appendMessage(msg, "outgoing");
  textarea.value = "";
  scrollToBottom();

  // Send to server
  socket.emit("message", msg);
}

function appendMessage(msg, type) {
  let mainDiv = document.createElement("div");
  let className = type;
  mainDiv.classList.add(className, "message");

  let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `;
  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
}

let timerId = null;
function debounce(func,timer) {
    if(timerId){
        clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
        func();
    }, timer);
}

let typingDiv = document.querySelector(".typing");
socket.on("typing", (data) => {
  socket.on("typing", (data) => {
    typingDiv.innerHTML = `${data.user} is typing...`;
    debounce(() => {
      typingDiv.innerHTML = "";
    }, 1000);
  });
});

// Recieve messages
socket.on("message", (msg) => {
  appendMessage(msg, "incoming");
  scrollToBottom();
});

function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}
