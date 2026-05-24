function updateSpyDescription() {

  const text = state.gameConfig.spyHasWord
    ? "Mode mot par joueur"
    : "Mode questions";

  document.getElementById("spyDescription").textContent = text;
}

function toggleSubject(subject, event) {

  if (subject === "custom") {

    state.gameConfig.subjects = ["custom"];

    document.getElementById("themesList").style.display = "none";
    document.getElementById("customThemeInput").style.display = "block";
  }

  else {

    if (state.gameConfig.subjects.includes("custom")) {
      state.gameConfig.subjects = [];
    }

    if (state.gameConfig.subjects.includes(subject)) {
      state.gameConfig.subjects =
        state.gameConfig.subjects.filter(s => s !== subject);
    } else {
      state.gameConfig.subjects.push(subject);
    }

    document.getElementById("themesList").style.display = "flex";
    document.getElementById("customThemeInput").style.display = "none";
  }

  socket.emit("updateConfig", {
    roomId: state.currentRoomId,
    key: "subjects",
    value: state.gameConfig.subjects
  });
}

function selectTheme(theme, event) {

  state.gameConfig.theme = theme;

  socket.emit("updateConfig", {
    roomId: state.currentRoomId,
    key: "theme",
    value: theme
  });
}

function toggleSpyHasWord() {

  state.gameConfig.spyHasWord =
    document.getElementById("spyHasWordToggle").checked;

  updateSpyDescription();

  socket.emit("updateConfig", {
    roomId: state.currentRoomId,
    key: "spyHasWord",
    value: state.gameConfig.spyHasWord
  });
}

function launchGame() {

  socket.emit("launchGame", {
    roomId: state.currentRoomId
  });
}

updateSpyDescription();