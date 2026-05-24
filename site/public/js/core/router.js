function showView(view) {

  document.getElementById("mainPage").style.display = "none";
  document.getElementById("roomPage").style.display = "none";
  document.getElementById("configPage").style.display = "none";

  if (view === "main") document.getElementById("mainPage").style.display = "flex";
  if (view === "lobby") document.getElementById("roomPage").style.display = "flex";
  if (view === "config") document.getElementById("configPage").style.display = "flex";
}