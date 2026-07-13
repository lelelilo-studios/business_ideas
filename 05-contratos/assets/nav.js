/* Antefirma — navegación. Idéntica en las cinco páginas.
   En móvil colapsa a un menú; en escritorio es una fila. */
(function () {
  "use strict";

  var PAGINAS = [
    { href: "index.html", texto: "Producto" },
    { href: "demo/index.html", texto: "Demo" },
    { href: "negocio.html", texto: "Negocio" },
    { href: "roadmap.html", texto: "Roadmap" },
    { href: "stack.html", texto: "Arquitectura" }
  ];

  var LOGO =
    '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">' +
    '<path d="M4 2.5h8.5L16 6v11.5H4z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>' +
    '<path d="M12 2.5V6h4" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>' +
    '<path d="M6.5 9.5h7M6.5 12.5h7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>' +
    '<path d="M5.6 14.6c1.6 1.4 7.2 1.4 8.8 0" stroke="#A81E12" stroke-width="1.5" stroke-linecap="round"/>' +
    "</svg>";

  function montar() {
    var host = document.querySelector("[data-nav]");
    if (!host) return;

    // Profundidad: las páginas en demo/ necesitan subir un nivel.
    var raiz = host.getAttribute("data-raiz") || "";
    var actual = host.getAttribute("data-actual") || "";

    var items = PAGINAS.map(function (p) {
      var activo = p.href === actual;
      return (
        '<li><a href="' + raiz + p.href + '"' +
        (activo ? ' aria-current="page"' : "") +
        ">" + p.texto + "</a></li>"
      );
    }).join("");

    host.innerHTML =
      '<div class="container">' +
        '<div class="nav__fila">' +
          '<a class="marca" href="' + raiz + 'index.html">' + LOGO +
            'Antefirma<span class="marca__punto">.</span>' +
          "</a>" +
          '<button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-menu">' +
            '<svg width="14" height="12" viewBox="0 0 14 12" aria-hidden="true">' +
              '<path d="M1 1h12M1 6h12M1 11h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
            "</svg>Menú</button>" +
        "</div>" +
        '<ul class="nav__menu" id="nav-menu" role="list">' +
          '<li><a href="' + raiz + '../index.html">&larr; Ideas</a></li>' +
          items +
        "</ul>" +
      "</div>";

    var boton = host.querySelector(".nav__toggle");
    var menu = host.querySelector(".nav__menu");
    boton.addEventListener("click", function () {
      var abierto = menu.classList.toggle("abierto");
      boton.setAttribute("aria-expanded", String(abierto));
    });
    // Al pasar a escritorio, el menú siempre se muestra: limpiamos el estado.
    var mq = window.matchMedia("(min-width: 62em)");
    var sync = function () {
      if (mq.matches) {
        menu.classList.remove("abierto");
        boton.setAttribute("aria-expanded", "false");
      }
    };
    mq.addEventListener ? mq.addEventListener("change", sync) : mq.addListener(sync);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", montar);
  } else {
    montar();
  }
})();
