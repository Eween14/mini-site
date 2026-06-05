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
        btn.style.display = "block";

        const nonHostPlayers =
            room.players.filter(p => p.id !== room.host);

        const allReady =
            room.players.length > 1 &&
            nonHostPlayers.every(p => p.ready);

        btn.textContent = "JOUER";

        btn.onclick = () => {
            if (!allReady) return;
            socket.emit("openConfig", state.currentRoomId);
        };

        if (allReady) {
            btn.classList.remove("disabled");
        } else {
            btn.classList.add("disabled");
        }

    } else {
        btn.style.display = "none";
    }
});