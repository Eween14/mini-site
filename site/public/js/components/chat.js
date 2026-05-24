function sendChat() {

  const input = document.getElementById("chatInput");
  const msg = input.value.trim();
  if (!msg) return;

  const name =
    document.getElementById("nameInput").value.trim() || "Player";

  socket.emit("chat", {
    roomId: state.currentRoomId,
    name,
    msg
  });

  input.value = "";
}

socket.on("chat", ({ name, msg }) => {

  const chat = document.getElementById("chatMessages");

  const div = document.createElement("div");
  div.className = "chatMessage";
  div.textContent = `${name}: ${msg}`;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
});