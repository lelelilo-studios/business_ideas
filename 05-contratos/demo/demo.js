/* ============================================================================
   ANTEFIRMA — Lógica del demo.
   Todo control hace algo. El .ics se descarga de verdad, el portapapeles
   funciona de verdad, el simulador recalcula de verdad. Lo único falseado es
   la inferencia: el análisis está precomputado (ver stack.html, "Qué está
   falseado"). No fingimos leer tu PDF: te lo decimos.
   ========================================================================== */
(function () {
  "use strict";

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var HOY = new Date(); HOY.setHours(0, 0, 0, 0);

  var estado = {
    contrato: null,
    tab: "resumen",
    soloRiesgos: true,          // en móvil arranca filtrado: 9 cláusulas, no 24
    niveles: { critico: true, revisar: true, estandar: true },
    activa: null,               // n° de cláusula abierta
    alertas: {},                // id obligación -> bool
    enCartera: false,
    tono: "colaborativo",
    ventasUF: 1100
  };

  /* ------------------------------------------------------------ formato -- */
  function clp(n) {
    return "$" + Math.round(n).toLocaleString("es-CL", { maximumFractionDigits: 0 });
  }
  function uf(n) {
    return n.toLocaleString("es-CL", { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + " UF";
  }
  var MESES = ["enero","febrero","marzo","abril","mayo","junio","julio",
               "agosto","septiembre","octubre","noviembre","diciembre"];
  function parseFecha(s) {
    var p = s.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function fechaLarga(s) {
    var d = parseFecha(s);
    return d.getDate() + " de " + MESES[d.getMonth()] + " de " + d.getFullYear();
  }
  function dias(s) {
    return Math.round((parseFecha(s) - HOY) / 86400000);
  }
  function textoCuenta(d) {
    if (d < 0)   return { txt: "Venció hace " + Math.abs(d) + " día" + (Math.abs(d) === 1 ? "" : "s"), cls: "ya" };
    if (d === 0) return { txt: "ES HOY", cls: "ya" };
    if (d <= 30) return { txt: "Faltan " + d + " día" + (d === 1 ? "" : "s"), cls: "ya" };
    if (d <= 120) return { txt: "Faltan " + d + " días", cls: "pronto" };
    return { txt: "Faltan " + d.toLocaleString("es-CL") + " días", cls: "lejos" };
  }

  /* -------------------------------------------------------------- iconos -- */
  var IC = {
    critico:  '<svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 1.2 11 10.5H1z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M6 4.8v2.3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="6" cy="8.9" r=".7" fill="currentColor"/></svg>',
    revisar:  '<svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="4.9" stroke="currentColor" stroke-width="1.3"/><path d="M6 3.4v3.1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="6" cy="8.5" r=".7" fill="currentColor"/></svg>',
    estandar: '<svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="4.9" stroke="currentColor" stroke-width="1.3"/><path d="M3.9 6.1 5.4 7.7 8.2 4.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    flecha:   '<svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    izq:      '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 3 5 8l5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    der:      '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    cerrar:   '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    copiar:   '<svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true"><rect x="4.7" y="1.7" width="7.6" height="9" stroke="currentColor" stroke-width="1.2"/><path d="M9.6 12.3H1.7v-9h2" stroke="currentColor" stroke-width="1.2"/></svg>',
    ok:       '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2.5 7.3 5.6 10.3 11.5 3.9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    cal:      '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2" y="3.4" width="12" height="10.6" stroke="currentColor" stroke-width="1.3"/><path d="M2 6.6h12M5.4 1.8v2.6M10.6 1.8v2.6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
    doc:      '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.4 1.7h6L13 5.3v9H3.4z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M9.4 1.7v3.6H13" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>',
    lupa:     '<svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="14" cy="14" r="8.6" stroke="currentColor" stroke-width="1.6"/><path d="M20.4 20.4 28 28" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M10.4 13.2h7M10.4 16h5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
    aviso:    '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.2"/><path d="M7 4v3.4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="7" cy="9.6" r=".75" fill="currentColor"/></svg>'
  };
  function insignia(nivel) {
    var t = { critico: "Crítico", revisar: "Revisar", estandar: "Estándar" }[nivel];
    return '<span class="insignia insignia--' + nivel + '">' + IC[nivel] + t + "</span>";
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ------------------------------------------------------------- pantallas */
  function ver(id) {
    ["pantalla-subir", "pantalla-analisis", "pantalla-informe"].forEach(function (p) {
      $("#" + p).hidden = p !== id;
    });
  }

  /* ----------------------------------------------------- 1. SUBIR / ELEGIR */
  function initSubir() {
    $$("[data-ejemplo]").forEach(function (b) {
      b.addEventListener("click", function () { analizar(b.getAttribute("data-ejemplo")); });
    });

    var zona = $("#zona");
    ["dragenter", "dragover"].forEach(function (e) {
      zona.addEventListener(e, function (ev) { ev.preventDefault(); zona.classList.add("encima"); });
    });
    ["dragleave", "drop"].forEach(function (e) {
      zona.addEventListener(e, function (ev) { ev.preventDefault(); zona.classList.remove("encima"); });
    });
    // Honestidad: el demo NO lee tu PDF. Decirlo es mejor que fingirlo.
    function rechazar() {
      var m = $("#zona-msg");
      m.hidden = false;
      m.focus();
    }
    zona.addEventListener("drop", rechazar);
    $("#zona-input").addEventListener("change", rechazar);
  }

  /* ----------------------------------------------------------- 2. ANÁLISIS */
  var ETAPAS = [
    ["Extrayendo el texto del PDF", "OCR / pdfplumber"],
    ["Segmentando cláusulas y numerales", "Haiku 4.5"],
    ["Evaluando riesgo cláusula por cláusula", "Sonnet 5"],
    ["Cruzando plazos contra el calendario", "Sonnet 5 + API UF"],
    ["Redactando las modificaciones sugeridas", "Opus 4.8"],
    ["Segunda pasada: buscando lo que se nos escapó", "Sonnet 5 (adversarial)"]
  ];

  function analizar(id) {
    estado.contrato = CONTRATOS[id];
    estado.activa = null;
    estado.enCartera = false;
    estado.alertas = {};
    estado.ventasUF = 1100;
    // Las críticas quedan con alerta activa por defecto: son las que muerden.
    estado.contrato.obligaciones.forEach(function (o) {
      estado.alertas[o.id] = o.nivel === "critico";
    });

    ver("pantalla-analisis");
    $("#analisis-doc").textContent = estado.contrato.archivo;
    var ul = $("#etapas");
    ul.innerHTML = ETAPAS.map(function (e, i) {
      return '<li class="etapa" data-i="' + i + '"><span class="etapa__marca"></span>' +
             '<span>' + e[0] + '</span><span class="etapa__modelo">' + e[1] + "</span></li>";
    }).join("");

    var i = 0;
    var reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var paso = reducido ? 60 : 430;

    function avanzar() {
      if (i > 0) {
        var ant = $('.etapa[data-i="' + (i - 1) + '"]', ul);
        if (ant) { ant.classList.remove("activa"); ant.classList.add("lista");
                   $(".etapa__marca", ant).innerHTML = "✓"; }
      }
      if (i >= ETAPAS.length) { informe(); return; }
      var el = $('.etapa[data-i="' + i + '"]', ul);
      if (el) el.classList.add("activa");
      $("#barra").style.right = (100 - ((i + 1) / ETAPAS.length) * 100) + "%";
      i++;
      timer = setTimeout(avanzar, paso);
    }
    var timer = setTimeout(avanzar, 120);

    $("#saltar").onclick = function () { clearTimeout(timer); informe(); };
  }

  /* ------------------------------------------------------------ 3. INFORME */
  function informe() {
    ver("pantalla-informe");
    var c = estado.contrato;
    // En pantalla ancha mostramos el documento completo. En teléfono arrancamos en
    // "sólo riesgos" y además dejamos fuera las cláusulas estándar: en 390px lo que
    // se quiere leer son las que muerden, no las que están bien.
    var ancha = window.matchMedia("(min-width: 75em)").matches;
    estado.soloRiesgos = !ancha;
    estado.niveles = { critico: true, revisar: true, estandar: ancha };

    $("#doc-nombre").textContent = c.archivo;
    $("#doc-meta").textContent = c.paginas + " págs · " + c.palabras.toLocaleString("es-CL") + " palabras";

    var r = cuenta();
    $("#tab-doc-n").textContent = r.critico + r.revisar;

    pintarResumen();
    pintarDocumento();
    pintarFechas();
    pintarRedlines();
    tab("resumen");
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function cuenta() {
    var n = { critico: 0, revisar: 0, estandar: 0 };
    estado.contrato.clausulas.forEach(function (cl) {
      if (cl.riesgo) n[cl.riesgo.nivel]++;
    });
    return n;
  }
  function riesgosVisibles() {
    return estado.contrato.clausulas.filter(function (cl) {
      return cl.riesgo && estado.niveles[cl.riesgo.nivel];
    });
  }

  /* --------------------------------------------------------------- RESUMEN */
  function pintarResumen() {
    var c = estado.contrato, n = cuenta();

    $("#veredicto").innerHTML =
      '<div class="veredicto__sello"><span class="sello">No lo firmes así</span></div>' +
      '<div><h2 class="veredicto__t">Encontramos ' + (n.critico + n.revisar) +
        " cláusulas que te van a doler. " + n.critico + " son graves.</h2>" +
      '<p class="veredicto__p">' + esc(c.titulo) + " con <b>" + esc(c.contraparte) +
        "</b> (RUT " + c.contraparteRut + "). Firma prevista: " + fechaLarga(c.firmaPrevista) +
        ". Abajo está cada una, en castellano, con lo que cuesta.</p></div>";

    $("#marcadores").innerHTML = [
      ["critico", n.critico, "Críticas"],
      ["revisar", n.revisar, "A revisar"],
      ["estandar", n.estandar, "Estándar"]
    ].map(function (m) {
      return '<button class="marcador marcador--' + m[0] + '" data-nivel="' + m[0] + '">' +
        '<div class="marcador__n">' + m[1] + "</div>" +
        '<div class="marcador__e">' + IC[m[0]] + m[2] + "</div></button>";
    }).join("");
    $$("#marcadores [data-nivel]").forEach(function (b) {
      b.addEventListener("click", function () {
        var nv = b.getAttribute("data-nivel");
        estado.niveles = { critico: false, revisar: false, estandar: false };
        estado.niveles[nv] = true;
        estado.soloRiesgos = true;
        tab("documento");
        pintarDocumento();
      });
    });

    // Simulador de renta efectiva (sólo aplica al arriendo).
    var sim = $("#simulador");
    if (c.economia) { sim.hidden = false; pintarSimulador(); }
    else { sim.hidden = true; }

    var lista = c.clausulas.filter(function (cl) { return cl.riesgo && cl.riesgo.nivel !== "estandar"; });
    $("#riesgos-lista").innerHTML = lista.map(function (cl) {
      return '<button class="riesgo-item riesgo-item--' + cl.riesgo.nivel + '" data-ir="' + cl.n + '">' +
        '<span class="riesgo-item__n">Cl. ' + cl.n + "</span>" +
        '<span class="riesgo-item__c">' +
          '<span class="riesgo-item__t">' + esc(cl.riesgo.titulo) + "</span>" +
          '<span class="riesgo-item__p">' + esc(cl.riesgo.plata) + "</span>" +
        "</span>" +
        '<span class="riesgo-item__ir">' + IC.flecha + "</span></button>";
    }).join("");
    $$("#riesgos-lista [data-ir]").forEach(function (b) {
      b.addEventListener("click", function () {
        estado.niveles = { critico: true, revisar: true, estandar: true };
        estado.soloRiesgos = true;
        tab("documento");
        pintarDocumento();
        abrir(+b.getAttribute("data-ir"));
      });
    });
  }

  function pintarSimulador() {
    var e = estado.contrato.economia;
    var v = estado.ventasUF;
    var variable = Math.max(0, v - e.umbralVentasUF) * e.tasaVariable;
    var promo    = v * e.tasaFondoPromo;
    var efectiva = e.rentaBasePromedioUF + variable + promo;
    var alza     = (efectiva / e.rentaBaseUF - 1) * 100;

    $("#sim-titular").innerHTML =
      "El contrato dice <b>" + e.rentaBaseUF + " UF</b>. Vas a pagar el equivalente a <b>" +
      efectiva.toFixed(1) + " UF</b>.";
    $("#sim-sub").textContent =
      "Un " + Math.round(alza) + "% más que la renta que negociaste — y ninguna de esas UF " +
      "aparece en la cláusula del precio.";
    $("#sim-out").textContent = v.toLocaleString("es-CL") + " UF (" + clp(v * UF_CLP) + ")";

    $("#desglose").innerHTML =
      fila("Renta base (promedio con el 3% anual, cl. 3)", uf(e.rentaBasePromedioUF), false) +
      fila("Renta variable — 8% sobre lo que exceda 900 UF (cl. 4)",
           variable > 0 ? uf(variable) : "0 UF · bajo el umbral", variable === 0) +
      fila("Fondo de promoción — 3% de TODAS tus ventas (cl. 5)", uf(promo), false) +
      '<li><span>Renta efectiva mensual</span><b>' + uf(efectiva) + " · " + clp(efectiva * UF_CLP) + "</b></li>";

    function fila(t, v2, nulo) {
      return "<li><span>" + t + '</span><b class="' + (nulo ? "nulo" : "") + '">' + v2 + "</b></li>";
    }
  }

  /* ------------------------------------------------------------- DOCUMENTO */
  function pintarDocumento() {
    var c = estado.contrato;

    $("#f-solo").setAttribute("aria-pressed", String(estado.soloRiesgos));
    $("#f-solo span:last-child").textContent = estado.soloRiesgos
      ? "Sólo riesgos (" + riesgosVisibles().length + ")"
      : "Todo (" + c.clausulas.length + " cláusulas)";
    ["critico", "revisar", "estandar"].forEach(function (nv) {
      $("#f-" + nv).setAttribute("aria-pressed", String(estado.niveles[nv]));
    });

    var visibles = c.clausulas.filter(function (cl) {
      if (!estado.soloRiesgos) return true;
      return cl.riesgo && estado.niveles[cl.riesgo.nivel];
    });

    $("#encabezado-doc").hidden = estado.soloRiesgos;
    $("#encabezado-doc").innerHTML = esc(c.encabezado)
      .replace(/(“el Arrendador”|“el Arrendatario”|“el Comprador”|“el Proveedor”)/g, "<strong>$1</strong>");

    if (!visibles.length) {
      $("#clausulas").innerHTML =
        '<p class="gris" style="padding:var(--sp-l) 0">No hay cláusulas con los filtros activos. ' +
        "Activa algún nivel de riesgo o cambia a “Todo”.</p>";
      pintarNav();
      return;
    }

    $("#clausulas").innerHTML = visibles.map(function (cl) {
      var nv = cl.riesgo ? cl.riesgo.nivel : null;
      var largo = cl.texto.length > 420;
      return '<article class="clausula' + (nv ? " clausula--riesgo clausula--" + nv : "") +
              '" id="cl-' + cl.n + '" data-n="' + cl.n + '">' +
        (nv === "critico" ? '<span class="marca-corr">' + circulo(cl.n) + "</span>" : "") +
        '<div class="clausula__cab">' +
          '<span class="clausula__n">' + cl.n + ".</span>" +
          '<h3 class="clausula__t"><span class="clausula__ord">' + cl.ord + "</span>" + esc(cl.titulo) + "</h3>" +
        "</div>" +
        (nv ? '<div style="margin-left:0;margin-bottom:10px">' + insignia(nv) +
              ' <span class="mono" style="font-size:.7rem;color:var(--tinta-3)">· ' +
              esc(cl.riesgo.categoria) + "</span></div>" : "") +
        '<p class="clausula__txt' + (largo ? " recortado" : "") + '">' + esc(cl.texto) + "</p>" +
        (largo ? '<button class="clausula__ver" data-ver="' + cl.n + '">Ver el texto completo de la cláusula</button>' : "") +
        (nv ? '<button class="clausula__abrir" data-abrir="' + cl.n + '">' +
              "Qué significa y cuánto te cuesta" +
              '<span class="clausula__abrir-i">' + IC.flecha + "</span></button>" : "") +
      "</article>";
    }).join("");

    $$("#clausulas [data-abrir]").forEach(function (b) {
      b.addEventListener("click", function () { abrir(+b.getAttribute("data-abrir")); });
    });
    $$("#clausulas [data-ver]").forEach(function (b) {
      b.addEventListener("click", function () {
        var p = $("#cl-" + b.getAttribute("data-ver") + " .clausula__txt");
        var r = p.classList.toggle("recortado");
        b.textContent = r ? "Ver el texto completo de la cláusula" : "Ocultar el texto legal";
      });
    });
    pintarNav();
  }

  // El círculo del corrector, dibujado a mano (no es un círculo perfecto: no debe serlo).
  function circulo(n) {
    return '<svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">' +
      '<path d="M13 2.6c6 0 10.6 4 10.4 9.9-.2 6.2-4.4 10.7-10.8 10.6C6.6 23 2.3 18.6 2.6 12.4 2.9 6.6 7.4 2.4 13.4 2.6" ' +
      'stroke="#A81E12" stroke-width="1.5" stroke-linecap="round"/>' +
      '<text x="13" y="17" text-anchor="middle" fill="#A81E12" ' +
      'font-family="IBM Plex Mono, monospace" font-size="10" font-weight="600">' + n + "</text></svg>";
  }

  function anotacionHTML(cl) {
    var r = cl.riesgo;
    var h =
      '<div class="anotacion__cab">' +
        '<span class="anotacion__ref">Cláusula ' + cl.n + " · " + esc(cl.ord) + "</span>" +
        insignia(r.nivel) +
      "</div>" +
      '<h3 class="anotacion__t">' + esc(r.titulo) + "</h3>" +

      '<div class="anotacion__bloque"><div class="anotacion__rot">' + IC.doc +
        "Qué dice, en castellano</div><p>" + esc(r.llano) + "</p></div>" +

      '<div class="anotacion__bloque"><div class="anotacion__rot">' + IC.aviso +
        "Por qué te va a doler</div><p>" + esc(r.duele) + "</p></div>" +

      '<div class="plata"><div class="plata__n">' + esc(r.plata) + "</div>" +
        '<div class="plata__d">' + esc(r.plataDetalle) + "</div></div>";

    if (r.redline) {
      h += '<div class="redline">' +
        '<div class="redline__cab"><span>Lo que pedirías cambiar</span>' +
          '<button class="btn btn--chico" data-copiar-rl="' + cl.n + '" ' +
          'style="background:var(--papel);color:var(--tinta);border-color:var(--papel);min-height:44px;padding:8px 11px">' +
          IC.copiar + "Copiar</button></div>" +
        '<div class="redline__cuerpo">' +
          "<del>" + esc(r.redline.original) + "</del>" +
          "<ins>" + esc(r.redline.propuesto) + "</ins>" +
        "</div>" +
        '<div class="redline__por"><b>Por qué:</b> ' + esc(r.redline.justificacion) + "</div>" +
      "</div>";
    } else {
      h += '<p class="gris" style="font-size:.82rem">No proponemos cambios: esta cláusula está ' +
           "dentro de lo habitual del mercado. La marcamos para que sepas que existe.</p>";
    }
    return h;
  }

  function abrir(n) {
    var cl = estado.contrato.clausulas.filter(function (x) { return x.n === n; })[0];
    if (!cl || !cl.riesgo) return;
    estado.activa = n;

    var html = anotacionHTML(cl);
    $("#margen").innerHTML = '<div class="hoja" style="padding:var(--sp-m)"><div class="anotacion">' + html + "</div></div>";
    $("#hoja-cuerpo").innerHTML = '<div class="anotacion">' + html + "</div>";

    $$("[data-copiar-rl]").forEach(function (b) {
      b.addEventListener("click", function () {
        copiar(cl.riesgo.redline.propuesto, "Texto de la cláusula copiado");
      });
    });

    $$(".clausula").forEach(function (a) {
      a.classList.toggle("activa", +a.getAttribute("data-n") === n);
    });

    var art = $("#cl-" + n);
    if (art) art.scrollIntoView({ behavior: "smooth", block: "start" });

    if (!window.matchMedia("(min-width: 75em)").matches) {
      $("#hoja-inf").classList.add("abierta");
      $("#velo").classList.add("visible");
      $("#hoja-cuerpo").scrollTop = 0;
    }
    pintarNav();
  }

  function cerrarHoja() {
    $("#hoja-inf").classList.remove("abierta");
    $("#velo").classList.remove("visible");
    pintarNav();   // al cerrar el panel vuelve el navegador flotante
  }

  /* Navegador de riesgos: recorrer el peligro con el pulgar.
     Hay DOS: el flotante (panel cerrado) y el del panel (panel abierto). Con el
     panel abierto el flotante queda bajo el velo, así que sería inalcanzable. */
  var NIVEL = { critico: "Crítico", revisar: "Revisar", estandar: "Estándar" };

  function pintarNav() {
    var nav = $("#navriesgo");
    var lista = riesgosVisibles();
    var abierta = $("#hoja-inf").classList.contains("abierta");

    if (estado.tab !== "documento" || !lista.length) {
      nav.hidden = true;
      $("#nav2-txt").textContent = "";
      return;
    }
    nav.hidden = abierta;   // con el panel abierto manda el navegador del panel

    var idx = lista.findIndex(function (cl) { return cl.n === estado.activa; });
    var pos = idx < 0 ? 0 : idx;
    var actual = lista[pos];

    var html = "<b>Riesgo " + (pos + 1) + " de " + lista.length + "</b>" +
               "<small>Cláusula " + actual.n + " · " + NIVEL[actual.riesgo.nivel] + "</small>";
    var irPrev = function () { if (pos > 0) abrir(lista[pos - 1].n); };
    var irNext = function () {
      if (idx < 0) { abrir(lista[0].n); return; }
      if (pos < lista.length - 1) abrir(lista[pos + 1].n);
    };

    [["#nav-txt", "#nav-prev", "#nav-next"], ["#nav2-txt", "#nav2-prev", "#nav2-next"]]
      .forEach(function (ids) {
        $(ids[0]).innerHTML = html;
        var prev = $(ids[1]), next = $(ids[2]);
        prev.disabled = pos === 0;
        next.disabled = idx >= 0 && pos === lista.length - 1;
        prev.onclick = irPrev;
        next.onclick = irNext;
      });
  }

  /* ---------------------------------------------------------------- FECHAS */
  function pintarFechas() {
    var c = estado.contrato;
    var ordenadas = c.obligaciones.slice().sort(function (a, b) {
      return parseFecha(a.fecha) - parseFecha(b.fecha);
    });
    var urgentes = ordenadas.filter(function (o) { return dias(o.fecha) <= 30 && dias(o.fecha) >= -30; });

    $("#fechas-intro").innerHTML =
      '<div class="hoja" style="padding:var(--sp-m)">' +
        '<div class="rotulo">El calendario que el contrato no te da</div>' +
        "<p>Sacamos <b>" + ordenadas.length + " fechas</b> del texto y las pusimos donde las vas a ver. " +
        (urgentes.length
          ? '<b class="rojo">' + urgentes.length + " requiere" + (urgentes.length === 1 ? "" : "n") +
            " acción este mes.</b>"
          : "Ninguna es urgente esta semana — pero la que muerde llega en años, y por eso existe esta pestaña.") +
        "</p>" +
        '<div style="display:flex;gap:var(--sp-2xs);flex-wrap:wrap;margin-top:var(--sp-s)">' +
          '<button class="btn btn--chico" id="ics">' + IC.cal + "Descargar al calendario (.ics)</button>" +
          '<button class="btn btn--chico btn--fantasma" id="todas-alertas">Activar todas las alertas</button>' +
        "</div></div>";

    $("#linea").innerHTML = ordenadas.map(function (o) {
      var d = dias(o.fecha), c2 = textoCuenta(d);
      return '<li class="hito hito--' + o.nivel + '">' +
        '<span class="hito__punto"></span>' +
        '<div class="hito__fecha"><span>' + fechaLarga(o.fecha) + "</span>" +
          '<span class="cuenta cuenta--' + c2.cls + '">' + c2.txt + "</span>" +
          (o.recurrencia ? "<span>· " + esc(o.recurrencia) + "</span>" : "") +
        "</div>" +
        '<h3 class="hito__t">' + esc(o.titulo) + "</h3>" +
        '<p class="hito__d">' + esc(o.detalle) + "</p>" +
        '<p class="hito__accion"><b>Qué hacer:</b> ' + esc(o.accion) + "</p>" +
        '<div class="hito__pie">' +
          '<button class="alerta-sw" data-alerta="' + o.id + '" aria-pressed="' +
            (estado.alertas[o.id] ? "true" : "false") + '">' +
            '<span class="alerta-sw__pista"></span><span data-t>' +
            (estado.alertas[o.id] ? "Te avisaremos" : "Avisarme") + "</span></button>" +
          '<span class="mono" style="font-size:.7rem;color:var(--tinta-3)">Cláusula ' + o.clausula +
            " · " + esc(o.responsable) + "</span>" +
        "</div></li>";
    }).join("");

    $$("[data-alerta]").forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-alerta");
        estado.alertas[id] = !estado.alertas[id];
        b.setAttribute("aria-pressed", String(estado.alertas[id]));
        $("[data-t]", b).textContent = estado.alertas[id] ? "Te avisaremos" : "Avisarme";
        aviso(estado.alertas[id]
          ? "Alerta activada. En producción llega por correo y WhatsApp, 30 y 7 días antes."
          : "Alerta desactivada.");
      });
    });

    $("#ics").addEventListener("click", descargarICS);
    $("#todas-alertas").addEventListener("click", function () {
      estado.contrato.obligaciones.forEach(function (o) { estado.alertas[o.id] = true; });
      pintarFechas();
      aviso("Alertas activadas para las " + estado.contrato.obligaciones.length + " fechas.");
    });

    pintarCartera();
  }

  function pintarCartera() {
    var el = $("#cartera");
    if (estado.enCartera) {
      el.className = "cartera activa";
      el.innerHTML = IC.ok + "<div><b>Contrato en vigilancia.</b> Antefirma revisa estas fechas todos los días " +
        "y te avisa antes de que se te pasen. Aunque falten tres años.</div>";
    } else {
      el.className = "cartera";
      el.innerHTML = IC.aviso +
        "<div style=\"flex:1\"><b>Este contrato todavía no está vigilado.</b> El análisis lo lees hoy; " +
        "la fecha que te muerde llega en " + dias(fechaMasLejana()) + " días. Alguien tiene que acordarse.</div>" +
        '<button class="btn btn--chico" id="add-cartera">Vigilar este contrato</button>';
      $("#add-cartera").addEventListener("click", function () {
        estado.enCartera = true;
        pintarCartera();
        aviso("Contrato agregado a tu cartera. Ahora las fechas son problema nuestro.");
      });
    }
  }
  function fechaMasLejana() {
    return estado.contrato.obligaciones.reduce(function (a, o) {
      return parseFecha(o.fecha) > parseFecha(a) ? o.fecha : a;
    }, estado.contrato.obligaciones[0].fecha);
  }

  /* --- .ics REAL: se genera en el navegador y se descarga. Nada falseado. -- */
  function descargarICS() {
    var c = estado.contrato;
    var activas = c.obligaciones.filter(function (o) { return estado.alertas[o.id]; });
    if (!activas.length) { aviso("Activa al menos una alerta antes de exportar."); return; }

    function pad(n) { return (n < 10 ? "0" : "") + n; }
    function fmt(d) {
      return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate());
    }
    function escICS(s) {
      return String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;")
                      .replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
    }
    var sello = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    var L = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Antefirma//Obligaciones//ES",
      "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
      "X-WR-CALNAME:Antefirma — " + escICS(c.etiqueta)
    ];

    activas.forEach(function (o) {
      var d = parseFecha(o.fecha);
      var fin = new Date(d); fin.setDate(fin.getDate() + 1);
      L.push(
        "BEGIN:VEVENT",
        "UID:" + o.id + "-" + c.id + "@antefirma.com",
        "DTSTAMP:" + sello,
        "DTSTART;VALUE=DATE:" + fmt(d),
        "DTEND;VALUE=DATE:" + fmt(fin),
        "SUMMARY:" + escICS((o.nivel === "critico" ? "[CRÍTICO] " : "") + o.titulo),
        "DESCRIPTION:" + escICS(
          o.detalle + "\n\nQué hacer: " + o.accion +
          "\n\nCláusula " + o.clausula + " del " + c.titulo +
          "\nContraparte: " + c.contraparte + " (RUT " + c.contraparteRut + ")" +
          "\nResponsable: " + o.responsable +
          "\n\n— Extraído por Antefirma. No constituye asesoría legal."),
        "CATEGORIES:" + escICS(o.nivel.toUpperCase()),
        "TRANSP:TRANSPARENT"
      );
      // Dos recordatorios: 30 días antes y 7 días antes.
      [30, 7].forEach(function (dd) {
        L.push("BEGIN:VALARM", "ACTION:DISPLAY",
               "DESCRIPTION:" + escICS("Faltan " + dd + " días: " + o.titulo),
               "TRIGGER:-P" + dd + "D", "END:VALARM");
      });
      L.push("END:VEVENT");
    });
    L.push("END:VCALENDAR");

    var blob = new Blob([L.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "antefirma-" + c.id + ".ics";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    aviso(activas.length + " fecha" + (activas.length === 1 ? "" : "s") + " descargada" +
          (activas.length === 1 ? "" : "s") + " con recordatorios a 30 y 7 días.");
  }

  /* -------------------------------------------------------------- REDLINES */
  function pintarRedlines() {
    var lista = estado.contrato.clausulas.filter(function (cl) {
      return cl.riesgo && cl.riesgo.redline;
    });

    $("#redlines-lista").innerHTML = lista.map(function (cl) {
      return '<div style="margin-bottom:var(--sp-m)">' +
        '<div style="display:flex;align-items:center;gap:10px;margin-bottom:9px;flex-wrap:wrap">' +
          '<span class="mono" style="font-size:.72rem;font-weight:600">Cláusula ' + cl.n + "</span>" +
          insignia(cl.riesgo.nivel) +
          '<span style="font-weight:600;flex:1;min-width:12rem">' + esc(cl.titulo) + "</span>" +
        "</div>" +
        '<div class="redline">' +
          '<div class="redline__cab"><span>Texto propuesto</span>' +
            '<button class="btn btn--chico" data-rl="' + cl.n + '" ' +
            'style="background:var(--papel);color:var(--tinta);border-color:var(--papel);min-height:44px;padding:8px 11px">' +
            IC.copiar + "Copiar</button></div>" +
          '<div class="redline__cuerpo"><del>' + esc(cl.riesgo.redline.original) + "</del>" +
            "<ins>" + esc(cl.riesgo.redline.propuesto) + "</ins></div>" +
          '<div class="redline__por"><b>Por qué:</b> ' + esc(cl.riesgo.redline.justificacion) + "</div>" +
        "</div></div>";
    }).join("");

    $$("[data-rl]").forEach(function (b) {
      b.addEventListener("click", function () {
        var n = +b.getAttribute("data-rl");
        var cl = lista.filter(function (x) { return x.n === n; })[0];
        copiar(cl.riesgo.redline.propuesto, "Texto de la cláusula " + n + " copiado");
      });
    });

    pintarCorreo();
  }

  function pintarCorreo() {
    var c = estado.contrato;
    var lista = c.clausulas.filter(function (cl) { return cl.riesgo && cl.riesgo.redline; });
    var esArriendo = c.id === "arriendo";
    var firmante = esArriendo ? "Paulina Órdenes Riquelme" : "Ignacio Mellado Sanhueza";
    var cargo = esArriendo ? "Comercial Pan de Nos Ltda." : "Alimentos Trapananda SpA";
    var trato = esArriendo ? "Estimado Rodrigo" : "Estimada Carolina";

    var apertura, cierre;
    if (estado.tono === "colaborativo") {
      apertura =
        trato + ":\n\n" +
        "Junto con saludar, y antes de avanzar a la firma, revisamos el borrador con detención. " +
        "Nos interesa mucho cerrar este acuerdo, y justamente por eso quisiéramos dejar bien resueltos " +
        "algunos puntos que hoy nos generan una exposición que no podemos asumir. Ninguno de ellos " +
        "afecta lo que a ustedes les importa; son ajustes de proporcionalidad.\n\n" +
        "Les propongo los siguientes cambios:";
      cierre =
        "\n\nEntiendo que varias de estas cláusulas son parte de su formato habitual. Aun así, creo que " +
        "estos ajustes son razonables y estoy disponible para conversarlos uno a uno cuando les acomode. " +
        "Si hay alguno que les resulte especialmente difícil, díganmelo y buscamos una alternativa.\n\n" +
        "Quedo atento.\n\nSaludos cordiales,\n" + firmante + "\n" + cargo;
    } else {
      apertura =
        trato + ":\n\n" +
        "Revisamos el borrador de contrato. Tal como está redactado, hay cláusulas que nos imponen una " +
        "exposición desproporcionada y que no estamos en condiciones de aceptar. Requerimos las siguientes " +
        "modificaciones para poder avanzar a la firma:";
      cierre =
        "\n\nEstas modificaciones son condición para la firma. Quedamos a la espera de una versión revisada " +
        "del borrador que las incorpore, o de sus contrapropuestas fundadas, dentro de los próximos 5 días hábiles.\n\n" +
        "Atentamente,\n" + firmante + "\n" + cargo;
    }

    var cuerpo = lista.map(function (cl, i) {
      var r = cl.riesgo;
      return "\n\n" + (i + 1) + ". CLÁUSULA " + cl.n + " — " + cl.ord + " (" + cl.titulo + ")\n\n" +
        "   Texto actual:\n   «" + r.redline.original + "»\n\n" +
        "   Texto que proponemos:\n   «" + r.redline.propuesto + "»\n\n" +
        "   Motivo: " + primeraFrase(r.redline.justificacion);
    }).join("");

    var asunto = (estado.tono === "firme" ? "Observaciones al borrador de " : "Comentarios al borrador de ") +
      (esArriendo ? "contrato de arriendo — Local 14-B Portal Quilín" : "contrato marco de suministro");

    $("#correo-asunto").innerHTML = "Para: <b>" + esc(c.contraparte) + "</b><br>Asunto: <b>" + esc(asunto) + "</b>";
    $("#correo-cuerpo").textContent = apertura + cuerpo + cierre;
  }
  function primeraFrase(s) {
    var t = s.split(/(?<=\.)\s/)[0];
    return t.length > 240 ? t.slice(0, 237) + "…" : t;
  }

  /* --------------------------------------------------------------- comunes */
  function copiar(txt, msg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(function () { aviso(msg); },
                                              function () { fallback(txt, msg); });
    } else { fallback(txt, msg); }
  }
  function fallback(txt, msg) {
    var ta = document.createElement("textarea");
    ta.value = txt; ta.setAttribute("readonly", "");
    ta.style.position = "fixed"; ta.style.left = "-9999px";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); aviso(msg); }
    catch (e) { aviso("No pudimos copiar. Selecciona el texto a mano."); }
    document.body.removeChild(ta);
  }

  var avisoT;
  function aviso(msg) {
    var el = $("#copiado");
    el.innerHTML = IC.ok + "<span>" + esc(msg) + "</span>";
    el.classList.add("visible");
    clearTimeout(avisoT);
    avisoT = setTimeout(function () { el.classList.remove("visible"); }, 3400);
  }

  function tab(t) {
    estado.tab = t;
    $$(".pestana").forEach(function (b) {
      b.setAttribute("aria-selected", String(b.getAttribute("data-tab") === t));
    });
    $$(".panel").forEach(function (p) { p.hidden = p.getAttribute("data-panel") !== t; });
    if (t !== "documento") cerrarHoja();
    pintarNav();
  }

  /* ------------------------------------------------------------------ init */
  function init() {
    initSubir();

    $$(".pestana").forEach(function (b) {
      b.addEventListener("click", function () { tab(b.getAttribute("data-tab")); });
    });

    $("#f-solo").addEventListener("click", function () {
      estado.soloRiesgos = !estado.soloRiesgos;
      pintarDocumento();
    });
    ["critico", "revisar", "estandar"].forEach(function (nv) {
      $("#f-" + nv).addEventListener("click", function () {
        estado.niveles[nv] = !estado.niveles[nv];
        pintarDocumento();
      });
    });

    // El tono del correo y la copia son controles estáticos: se enganchan una vez.
    $$("[data-tono]").forEach(function (b) {
      b.addEventListener("click", function () {
        estado.tono = b.getAttribute("data-tono");
        $$("[data-tono]").forEach(function (x) {
          x.setAttribute("aria-pressed", String(x.getAttribute("data-tono") === estado.tono));
        });
        pintarCorreo();
      });
    });
    $("#copiar-correo").addEventListener("click", function () {
      copiar($("#correo-cuerpo").textContent, "Correo copiado. Pégalo y envíalo.");
    });

    $("#velo").addEventListener("click", cerrarHoja);
    $("#hoja-cerrar").addEventListener("click", cerrarHoja);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") cerrarHoja();
    });

    // Arrastrar el panel hacia abajo para cerrarlo.
    var tirador = $("#hoja-tirador"), y0 = null;
    tirador.addEventListener("pointerdown", function (e) {
      y0 = e.clientY; tirador.setPointerCapture(e.pointerId);
    });
    tirador.addEventListener("pointermove", function (e) {
      if (y0 === null) return;
      var dy = Math.max(0, e.clientY - y0);
      $("#hoja-inf").style.transform = "translateY(" + dy + "px)";
    });
    tirador.addEventListener("pointerup", function (e) {
      if (y0 === null) return;
      var dy = e.clientY - y0;
      $("#hoja-inf").style.transform = "";
      if (dy > 70) cerrarHoja();
      y0 = null;
    });

    $("#otro").addEventListener("click", function () {
      ver("pantalla-subir");
      $("#zona-msg").hidden = true;
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    $("#sim-rango").addEventListener("input", function (e) {
      estado.ventasUF = +e.target.value;
      pintarSimulador();
    });

    $("#simular-btn").addEventListener("click", function () {
      tab("documento");
      estado.soloRiesgos = true;
      estado.niveles = { critico: true, revisar: true, estandar: true };
      pintarDocumento();
      abrir(11); // la multa de salida: la cláusula que define el contrato
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
