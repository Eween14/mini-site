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
    isReady = !isReady;

    socket.emit("setReady", {
        roomId: state.currentRoomId,
        ready: isReady
    });
}

socket.on("roomUpdate", (room) => {

    state.room = room;
    state.currentRoomId = room.id;

    if (room.state === "lobby") {
        showView("lobby");
    } else if (room.state === "config") {
        showView("config");
    }

    // UI lobby
    if (room.state === "lobby") {

        document.getElementById("roomCode").textContent = room.id;

        renderPlayers(room);

        const isHost = room.host === socket.id;

        const btn = document.getElementById("bottomButton");

        if (isHost) {
            btn.textContent = "JOUER";
            btn.onclick = () => socket.emit("openConfig", room.id);
        } else {
            btn.textContent = isReady ? "PRÊT ✔" : "PRÊT";
            btn.onclick = toggleReady;
        }
    }
});