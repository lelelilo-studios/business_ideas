// Menú móvil. Único comportamiento global del sitio.
(function () {
  var btn = document.querySelector('.nav-btn');
  var menu = document.getElementById('nav-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', function () {
    var abierto = menu.classList.toggle('abierto');
    btn.setAttribute('aria-expanded', abierto ? 'true' : 'false');
  });
})();
