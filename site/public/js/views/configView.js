function updateConfigVisuals() {

  // =========================
  // HOST RIGHTS
  // =========================

  const isHost =
    state.room?.host === socket.id;

  document
    .querySelectorAll(".optionItem")
    .forEach(el => {

      el.style.pointerEvents =
        isHost ? "auto" : "none";

      el.style.opacity =
        isHost ? "1" : "0.6";
    });

  document.getElementById("spyHasWordToggle").disabled =
    !isHost;

  // =========================
  // SUBJECTS
  // =========================

  document
    .querySelectorAll("#subjectsList .optionItem")
    .forEach(el => {

      const subject =
        el.dataset.subject;

      if (state.gameConfig.subjects.includes(subject)) {
        el.classList.add("selected");
      } else {
        el.classList.remove("selected");
      }
    });

  // =========================
  // CUSTOM MODE
  // =========================

  const customEnabled =
    state.gameConfig.subjects.includes("custom");

  document.getElementById("themesList").style.display =
    customEnabled ? "none" : "flex";

  document.getElementById("themeTitle").style.display =
    customEnabled ? "none" : "block";

  document.getElementById("customThemeInput").style.display =
    customEnabled ? "block" : "none";

  // =========================
  // THEMES
  // =========================

  const themes =
    state.gameConfig.themes || ["characters"];

  document
    .querySelectorAll("#themesList .optionItem")
    .forEach(el => {

      const theme =
        el.dataset.theme;

      if (themes.includes(theme)) {
        el.classList.add("selected");
      } else {
        el.classList.remove("selected");
      }
    });

  updateSpyDescription();
}

function updateSpyDescription() {

  const text =
    state.gameConfig.spyHasWord
      ? `
        Tout le monde à un mot.
        Pendant deux tours, chaque joueur dit un mot leur évoquant leur mot secret l'un après l'autre.

        Interdit de dire leur propre mot secret (ou un mot extrêmement similaire).

        À la fin des deux tours tout le monde vote pour celui qu'il pense être l'espion.
      `
      : `
        L'espion n'a pas de mot.

        Pendant deux tours, chaque joueur pose une question à la personne de son choix, auquel elle doit répondre.

        Interdit de dire leur propre mot secret (ou un mot extrêmement similaire).

        À la fin des deux tours tout le monde vote pour celui qu'il pense être l'espion.
      `;

  document.getElementById("spyDescription").innerHTML = text;
}

function toggleSubject(subject) {

  const subjects =
    state.gameConfig.subjects;

  // =========================
  // CUSTOM
  // =========================

  if (subject === "custom") {

    state.gameConfig.subjects = ["custom"];
  }

  // =========================
  // NORMAL SUBJECTS
  // =========================

  else {

    // retire custom
    state.gameConfig.subjects =
      subjects.filter(s => s !== "custom");

    const alreadySelected =
      state.gameConfig.subjects.includes(subject);

    // minimum 1 sujet
    if (alreadySelected) {

      if (state.gameConfig.subjects.length > 1) {

        state.gameConfig.subjects =
          state.gameConfig.subjects.filter(s => s !== subject);
      }

    } else {

      state.gameConfig.subjects.push(subject);
    }
  }

  updateConfigVisuals();

  socket.emit("updateConfig", {
    roomId: state.currentRoomId,
    key: "subjects",
    value: state.gameConfig.subjects
  });
}

function selectTheme(theme) {

  if (!state.gameConfig.themes) {
    state.gameConfig.themes = ["characters"];
  }

  const themes =
    state.gameConfig.themes;

  const alreadySelected =
    themes.includes(theme);

  // minimum 1 thème
  if (alreadySelected) {

    if (themes.length > 1) {

      state.gameConfig.themes =
        themes.filter(t => t !== theme);
    }

  } else {

    themes.push(theme);
  }

  updateConfigVisuals();

  socket.emit("updateConfig", {
    roomId: state.currentRoomId,
    key: "themes",
    value: state.gameConfig.themes
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