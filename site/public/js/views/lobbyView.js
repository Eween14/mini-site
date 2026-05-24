let isReady = false;

function selectGame(game) {
    const room = state.room;
    if (!room || room.host !== socket.id) return;

    socket.emit("selectGame", {
        roomId: state.currentRoomId,
        game
    });
}

function toggleReady() {
    state.isReady = !state.isReady;

    socket.emit("setReady", {
        roomId: state.currentRoomId,
        ready: state.isReady
    });
}

socket.on("roomUpdate", (room) => {

    state.room = room;
    state.currentRoomId = room.id || state.currentRoomId;

    if (room.state === "lobby") {
        showView("lobby");
    }
    else if (room.state === "config") {
        showView("config");
    }

    document.getElementById("roomCode").textContent = state.currentRoomId;

    renderPlayers(room);

    const me = room.players.find(p => p.id === socket.id);
    const isHost = room.host === socket.id;

    const btn = document.getElementById("bottomButton");

    if (isHost) {

        btn.textContent = "JOUER";
        btn.onclick = () => socket.emit("openConfig", state.currentRoomId);

        if (room.allReady) {
            btn.classList.remove("disabled");
        } else {
            btn.classList.add("disabled");
        }

    } else {

        btn.textContent = state.isReady ? "PRÊT ✔" : "PRÊT";
        btn.onclick = toggleReady;
    }
});