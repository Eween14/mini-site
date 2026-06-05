function generateRoomId() {

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";

  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }

  return id;
}

function createLobbyMode() {

  document.getElementById("roomInputContainer").innerHTML = `
    <input id="roomIdInput" value="${generateRoomId()}" maxlength="6">
  `;

  document.getElementById("rightButton").onclick = confirmCreateLobby;
}

function joinLobbyMode() {

  document.getElementById("roomInputContainer").innerHTML = `
    <input id="roomIdInput" placeholder="ROOM ID..." maxlength="6">
  `;

  document.getElementById("rightButton").onclick = confirmJoinLobby;
}

function resetMainPage() {

  document.getElementById("roomInputContainer").innerHTML = "";
  document.getElementById("rightButton").onclick = joinLobbyMode;
}

function confirmCreateLobby() {

  const roomId = document.getElementById("roomIdInput").value;
  const name = document.getElementById("nameInput").value.trim() || "Host";

  state.currentRoomId = roomId;
  state.name = name;

  socket.emit("createRoom", { roomId, name, password: null });
}

function confirmJoinLobby() {

  const roomId = document.getElementById("roomIdInput").value;
  const name = document.getElementById("nameInput").value.trim() || "Player";

  state.currentRoomId = roomId;
  state.name = name;

  socket.emit("joinRoom", { roomId, name, password: null });
}

function leaveLobby() {

  socket.emit("leaveRoom");
  showView("main");
  resetMainPage();
}

showView("main");