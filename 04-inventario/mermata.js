/* Mermata — navegación móvil compartida. Sin dependencias. */
(function () {
  var btn = document.querySelector('[data-nav-btn]');
  var panel = document.querySelector('[data-nav-panel]');
  if (!btn || !panel) return;

  btn.addEventListener('click', function () {
    var abierto = panel.classList.toggle('abierto');
    btn.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    btn.querySelector('[data-nav-txt]').textContent = abierto ? 'Cerrar' : 'Menú';
  });

  // Al pasar a escritorio, cerrar el panel para no dejar estado colgado.
  var mq = window.matchMedia('(min-width: 62em)');
  var cerrar = function () {
    if (mq.matches) {
      panel.classList.remove('abierto');
      btn.setAttribute('aria-expanded', 'false');
      btn.querySelector('[data-nav-txt]').textContent = 'Menú';
    }
  };
  if (mq.addEventListener) mq.addEventListener('change', cerrar);
  else if (mq.addListener) mq.addListener(cerrar);
})();
