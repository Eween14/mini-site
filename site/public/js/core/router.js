const VIEW_IDS = {
  main: "mainPage",
  lobby: "roomPage",
  config: "configPage"
};

function showView(view) {

  // désactive toutes les vues
  Object.values(VIEW_IDS).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("active");
  });

  // active la vue demandée
  const targetId = VIEW_IDS[view];
  if (!targetId) return;

  const target = document.getElementById(targetId);
  if (target) target.classList.add("active");
}