/* Fedatia — comportamiento compartido del sitio: menú móvil y botones de copiar.
   Sin dependencias, sin build. */
(function () {
  'use strict';

  // --- menú móvil ---------------------------------------------------------
  var btn = document.querySelector('[data-nav-btn]');
  var menu = document.querySelector('[data-nav-menu]');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      var abierto = menu.classList.toggle('abierto');
      btn.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    });
    // Al pasar a escritorio, el menú vuelve a ser una barra.
    var mq = window.matchMedia('(min-width: 62em)');
    var sync = function () {
      if (mq.matches) {
        menu.classList.remove('abierto');
        btn.setAttribute('aria-expanded', 'false');
      }
    };
    mq.addEventListener ? mq.addEventListener('change', sync) : mq.addListener(sync);
  }

  // --- copiar bloque de código -------------------------------------------
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-copiar]') : null;
    if (!b) return;
    var caja = b.closest('.cod');
    var pre = caja && caja.querySelector('pre:not(.oculto)');
    if (!pre) return;
    var texto = pre.innerText;
    var listo = function () {
      var antes = b.getAttribute('aria-label') || 'Copiar';
      b.setAttribute('aria-label', 'Copiado');
      b.classList.add('copiado');
      var svg = b.querySelector('svg');
      if (svg) svg.style.color = '#45c455';
      window.setTimeout(function () {
        b.setAttribute('aria-label', antes);
        b.classList.remove('copiado');
        if (svg) svg.style.color = '';
      }, 1400);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(listo, function () {});
    } else {
      var ta = document.createElement('textarea');
      ta.value = texto;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); listo(); } catch (err) {}
      document.body.removeChild(ta);
    }
  });

  // --- pestañas de lenguaje en bloques de código estáticos ----------------
  document.querySelectorAll('.cod[data-tabs]').forEach(function (caja) {
    var tabs = caja.querySelectorAll('[role="tab"]');
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        tabs.forEach(function (o) { o.setAttribute('aria-selected', 'false'); });
        t.setAttribute('aria-selected', 'true');
        caja.querySelectorAll('pre').forEach(function (p) {
          p.classList.toggle('oculto', p.dataset.lang !== t.dataset.lang);
        });
      });
    });
  });
})();
