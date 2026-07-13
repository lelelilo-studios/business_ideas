/* Menú móvil. Un solo botón, un solo estado. */
(function () {
  var btn = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (!btn || !nav) return;

  function set(open) {
    nav.dataset.open = open ? 'true' : 'false';
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.querySelector('[data-label]').textContent = open ? 'Cerrar' : 'Menú';
  }
  set(false);
  btn.addEventListener('click', function () {
    set(nav.dataset.open !== 'true');
  });
  // al pasar a escritorio, el CSS lo muestra igual; limpiamos el estado
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 896) set(false);
  });
})();
