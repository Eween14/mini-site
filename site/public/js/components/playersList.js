function renderPlayers(room) {

    const list = document.getElementById("playersList");
    list.innerHTML = "";

    room.players.forEach(player => {

        const li = document.createElement("li");

        const isHost = room.host === player.id;
        const ready = player.ready ? " ✔" : "";

        li.textContent =
            (isHost ? "👑 " : "") +
            player.name +
            ready;

        list.appendChild(li);
    });
}

window.renderPlayers = renderPlayers;