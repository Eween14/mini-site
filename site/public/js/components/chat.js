function initChat() {

    const btn = document.getElementById("sendChatButton");
    const input = document.getElementById("chatInput");

    btn.onclick = sendChat;

    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendChat();
    });
}

function sendChat() {

    const input = document.getElementById("chatInput");
    const msg = input.value.trim();

    if (!msg) return;

    socket.emit("chat", {
        roomId: state.currentRoomId,
        name: state.name,
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