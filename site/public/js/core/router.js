function showView(view) {

  const views = ["mainPage", "roomPage", "configPage"];

  views.forEach(id => {
    document.getElementById(id).classList.remove("active");
  });

  if (view === "main") {
    document.getElementById("mainPage").classList.add("active");
  }

  if (view === "lobby") {
    document.getElementById("roomPage").classList.add("active");
  }

  if (view === "config") {
    document.getElementById("configPage").classList.add("active");
  }
}