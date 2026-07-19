/* Etiquaria, JS compartido: menú móvil + widget vivo del hero.
   Sin dependencias. Los umbrales del widget viven aquí sólo para el
   ejemplo del hero; el motor completo está en demo/motor.js. */

(function () {
  "use strict";

  /* ----- Menú móvil ----- */
  var btn = document.querySelector("[data-nav-btn]");
  var menu = document.querySelector("[data-nav-menu]");
  if (btn && menu) {
    btn.addEventListener("click", function () {
      var abierto = menu.classList.toggle("abierto");
      btn.setAttribute("aria-expanded", abierto ? "true" : "false");
    });
  }

  /* ----- Widget del hero: azúcares de la mermelada ----- */
  /* Límite sólidos, azúcares totales: 10 g/100 g.
     Fuente: art. 120 bis del Reglamento Sanitario de los Alimentos
     (DS 977/96 MINSAL, incorporado por DS 13/2015), etapa final
     vigente desde junio de 2019. */
  var LIMITE_AZUCARES_SOLIDO = 10;

  var slider = document.getElementById("heroAzucar");
  if (!slider) return;

  var valorEl = document.getElementById("heroValor");
  var selloEl = document.getElementById("heroSello");
  var veredictoEl = document.getElementById("heroVeredicto");
  var distanciaEl = document.getElementById("heroDistancia");

  function pintar() {
    var v = parseFloat(slider.value);
    valorEl.textContent = v.toFixed(1).replace(".", ",");
    var lleva = v >= LIMITE_AZUCARES_SOLIDO;
    selloEl.classList.toggle("apagado", !lleva);
    selloEl.setAttribute("aria-hidden", lleva ? "false" : "true");
    if (lleva) {
      veredictoEl.textContent = "LLEVA sello ALTO EN AZÚCARES";
      veredictoEl.className = "hero-veredicto lleva";
      distanciaEl.textContent =
        v.toFixed(1).replace(".", ",") +
        " g ≥ límite de 10 g/100 g · art. 120 bis RSA (DS 13/2015)";
    } else {
      veredictoEl.textContent = "NO lleva sello de azúcares";
      veredictoEl.className = "hero-veredicto libre";
      distanciaEl.textContent =
        "a " + (LIMITE_AZUCARES_SOLIDO - v).toFixed(1).replace(".", ",") +
        " g del límite de 10 g/100 g · art. 120 bis RSA (DS 13/2015)";
    }
  }

  slider.addEventListener("input", pintar);
  pintar();
})();
