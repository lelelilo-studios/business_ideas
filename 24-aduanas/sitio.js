/* Aforqua: comportamiento compartido, menú móvil. */
(function () {
  var btn = document.querySelector("[data-nav-btn]");
  var menu = document.querySelector("[data-nav-menu]");
  if (!btn || !menu) return;
  btn.addEventListener("click", function () {
    var abierto = menu.classList.toggle("abierto");
    btn.setAttribute("aria-expanded", abierto ? "true" : "false");
  });
})();
