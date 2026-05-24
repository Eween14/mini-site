function renderPlayers(room) {

  const list = document.getElementById("playersList");
  list.innerHTML = "";

  room.players.forEach(p => {

    const li = document.createElement("li");

    const isHost = room.host === p.id;
    const ready = p.ready ? " ✔" : "";

    li.textContent =
      (isHost ? "👑 " : "") +
      p.name +
      ready;

    list.appendChild(li);
  });
}