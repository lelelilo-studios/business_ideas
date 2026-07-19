/* Rondalba: comportamiento compartido del sitio (menú móvil). Sin dependencias, sin build. */
(function () {
  'use strict';
  var btn = document.querySelector('[data-nav-btn]');
  var menu = document.querySelector('[data-nav-menu]');
  if (!btn || !menu) return;
  btn.addEventListener('click', function () {
    var abierto = menu.classList.toggle('abierto');
    btn.setAttribute('aria-expanded', abierto ? 'true' : 'false');
  });
  var mq = window.matchMedia('(min-width: 62em)');
  var sync = function () {
    if (mq.matches) {
      menu.classList.remove('abierto');
      btn.setAttribute('aria-expanded', 'false');
    }
  };
  if (mq.addEventListener) { mq.addEventListener('change', sync); } else { mq.addListener(sync); }
})();
