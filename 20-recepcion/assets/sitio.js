/* Fonalta — navegación móvil + la forma de onda que respira.
   Sin dependencias, sin CDN. */

(function () {
  'use strict';

  /* ---- menú móvil ---- */
  var btn = document.querySelector('.nav__btn');
  var menu = document.getElementById('nav-menu');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      var abierto = menu.getAttribute('data-abierto') === 'si';
      menu.setAttribute('data-abierto', abierto ? 'no' : 'si');
      btn.setAttribute('aria-expanded', abierto ? 'false' : 'true');
    });
  }

  /* ---- forma de onda decorativa ----
     No es un micrófono: es una función. Una suma de senos con una envolvente
     que se mueve, para que la línea parezca viva sin pretender ser audio real.
     Determinista salvo por el reloj. */
  var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function pintarOnda(cv) {
    var ctx = cv.getContext('2d');
    var barras = parseInt(cv.dataset.barras || '64', 10);
    var color = cv.dataset.color || '#F0A93F';
    var quieto = cv.dataset.quieto === 'si' || reducido;
    var w = 0, h = 0, dpr = 1;

    function medir() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      var r = cv.getBoundingClientRect();
      w = Math.max(r.width, 1);
      h = Math.max(r.height, 1);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function amplitud(i, t) {
      var x = i / barras;
      // envolvente: la voz sube y baja, no es un tono plano
      var env = 0.42
        + 0.30 * Math.sin(x * 7.1 + t * 1.30)
        + 0.20 * Math.sin(x * 17.3 - t * 2.10)
        + 0.12 * Math.sin(x * 31.7 + t * 0.70);
      // ventana: se apaga en los bordes, como una frase
      var ventana = Math.sin(Math.PI * Math.min(Math.max(x, 0), 1));
      return Math.max(0.05, Math.min(1, Math.abs(env) * (0.35 + 0.65 * ventana)));
    }

    function cuadro(ms) {
      var t = quieto ? 1.4 : ms / 1000;
      ctx.clearRect(0, 0, w, h);
      var paso = w / barras;
      var ancho = Math.max(2, paso * 0.44);
      var medio = h / 2;
      for (var i = 0; i < barras; i++) {
        var a = amplitud(i, t);
        var alto = Math.max(2, a * (h - 6));
        var x = i * paso + (paso - ancho) / 2;
        // el ámbar se enciende donde hay señal: opacidad ligada a la amplitud
        ctx.globalAlpha = 0.22 + 0.78 * a;
        ctx.fillStyle = color;
        var r = Math.min(ancho / 2, 2);
        var y = medio - alto / 2;
        if (ctx.roundRect) {
          ctx.beginPath();
          ctx.roundRect(x, y, ancho, alto, r);
          ctx.fill();
        } else {
          ctx.fillRect(x, y, ancho, alto);
        }
      }
      ctx.globalAlpha = 1;
      if (!quieto) requestAnimationFrame(cuadro);
    }

    medir();
    window.addEventListener('resize', function () { medir(); if (quieto) cuadro(0); });
    requestAnimationFrame(cuadro);
  }

  document.querySelectorAll('canvas[data-onda]').forEach(pintarOnda);
})();
