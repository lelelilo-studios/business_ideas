/* Freatia — gráficos SVG dibujados a mano. Sin librerías.
   Los usan index.html y demo/index.html. */

(function (global) {
  "use strict";

  var COLOR = {
    agua: "#3F9BD6",
    recirc: "#2E9E70",
    perdida: "#B3762F",
    sinexpl: "#B85499",
    acum: "#7FC0E6",
    ok: "#3FC08A",
    alerta: "#E8A33D",
    critico: "#E8574E",
    linea: "#24404A",
    txt3: "#8AA3AE"
  };

  var NS = "http://www.w3.org/2000/svg";

  function el(nombre, attrs) {
    var n = document.createElementNS(NS, nombre);
    for (var k in attrs) if (attrs[k] !== undefined && attrs[k] !== null) n.setAttribute(k, attrs[k]);
    return n;
  }

  function fmt(v) {
    return new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 }).format(v);
  }

  /* ---------------------------------------------------------------------
     SANKEY del balance hídrico.
     modelo = { columnas:[{id,rotulo}], nodos:[{id,col,nombre,valor,color}],
                enlaces:[{de,a,valor,color}] }
     Las columnas SIEMPRE suman lo mismo: si no cuadra, el nodo "sin explicar"
     es el que hace cuadrar el diagrama. Esa es toda la idea del producto.
  --------------------------------------------------------------------- */
  function sankeyHidrico(svg, modelo, alClick) {
    var W = 1040, H = 610, MT = 34, MB = 14;
    var xs = [170, 500, 830];      // x de cada columna
    var bw = 12;                    // ancho de barra de nodo
    /* El aire entre nodos es por columna: la de destinos tiene nodos chicos y
       rótulos de dos líneas, y si los dejo a 10px los rótulos se pisan. Las
       barras siguen siendo proporcionales; lo único que cambia es el aire. */
    var gaps = [14, 14, 30];

    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("role", "img");
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    var total = 0;
    modelo.nodos.forEach(function (n) { if (n.col === 0) total += n.valor; });
    svg.setAttribute("aria-label",
      "Diagrama de flujo del agua de la faena. Entran " + fmt(total) +
      " litros por segundo al sistema de distribución y salen " + fmt(total) + ".");

    // Altura disponible: la columna que gasta más aire manda la escala.
    var porCol = [0, 0, 0];
    modelo.nodos.forEach(function (n) { porCol[n.col]++; });
    var maxGaps = Math.max.apply(null, porCol.map(function (c, i) { return (c - 1) * gaps[i]; }));
    var k = (H - MT - MB - maxGaps) / total;

    var mapa = {};
    [0, 1, 2].forEach(function (c) {
      var col = modelo.nodos.filter(function (n) { return n.col === c; });
      var alturas = col.reduce(function (s, n) { return s + n.valor * k; }, 0);
      var aire = (col.length - 1) * gaps[c];
      var y = MT + (H - MT - MB - alturas - aire) / 2;
      col.forEach(function (n) {
        var h = Math.max(n.valor * k, 3);
        mapa[n.id] = { x: xs[c], y: y, h: h, col: c, nodo: n, usadoIzq: 0, usadoDer: 0 };
        y += h + gaps[c];
      });
    });

    // Rótulos de columna
    modelo.columnas.forEach(function (c, i) {
      var t = el("text", { x: i === 2 ? xs[i] + bw : xs[i], y: 16, class: "sk-col" });
      if (i === 2) t.setAttribute("text-anchor", "start");
      t.textContent = c.rotulo;
      svg.appendChild(t);
    });

    // Cintas primero (van debajo de los nodos y rótulos)
    var gCintas = el("g", {});
    svg.appendChild(gCintas);

    modelo.enlaces.forEach(function (e) {
      var a = mapa[e.de], b = mapa[e.a];
      if (!a || !b) return;
      var h = Math.max(e.valor * k, 1.5);
      var y0 = a.y + a.usadoDer, y1 = b.y + b.usadoIzq;
      a.usadoDer += h; b.usadoIzq += h;
      var x0 = a.x + bw, x1 = b.x;
      var xm = (x0 + x1) / 2;
      var d = "M" + x0 + "," + y0 +
        " C" + xm + "," + y0 + " " + xm + "," + y1 + " " + x1 + "," + y1 +
        " L" + x1 + "," + (y1 + h) +
        " C" + xm + "," + (y1 + h) + " " + xm + "," + (y0 + h) + " " + x0 + "," + (y0 + h) + " Z";
      var p = el("path", {
        d: d, fill: e.color || COLOR.agua, class: "sk-cinta",
        "data-de": e.de, "data-a": e.a
      });
      var tt = el("title", {});
      tt.textContent = mapa[e.de].nodo.nombre + " → " + mapa[e.a].nodo.nombre + ": " + fmt(e.valor) + " l/s";
      p.appendChild(tt);
      gCintas.appendChild(p);
    });

    // Nodos + rótulos
    modelo.nodos.forEach(function (n) {
      var m = mapa[n.id];
      var g = el("g", { class: "sk-nodo", tabindex: "0", role: "button",
        "aria-label": n.nombre + ", " + fmt(n.valor) + " litros por segundo" });

      g.appendChild(el("rect", { x: m.x, y: m.y, width: bw, height: m.h, fill: n.color, rx: 1 }));

      var izq = n.col === 0;
      var tx = izq ? m.x - 10 : m.x + bw + 10;
      var ty = m.y + m.h / 2;
      var anchor = izq ? "end" : "start";

      var lbl = el("text", { x: tx, y: ty - 2, class: "sk-lbl sk-hal", "text-anchor": anchor });
      lbl.textContent = n.nombre;
      var val = el("text", { x: tx, y: ty + 13, class: "sk-val sk-hal", "text-anchor": anchor });
      val.textContent = fmt(n.valor) + " l/s";
      if (n.color === COLOR.sinexpl) val.setAttribute("fill", COLOR.sinexpl);
      g.appendChild(lbl);
      g.appendChild(val);

      // zona de toque ≥44px de alto
      var hh = Math.max(m.h, 44);
      g.appendChild(el("rect", {
        x: izq ? m.x - 160 : m.x - 4, y: m.y + m.h / 2 - hh / 2,
        width: izq ? 174 : 200, height: hh, class: "sk-hit"
      }));

      function activar() {
        gCintas.querySelectorAll(".sk-cinta").forEach(function (c) {
          c.classList.toggle("sel", c.getAttribute("data-de") === n.id || c.getAttribute("data-a") === n.id);
        });
        if (alClick) alClick(n);
      }
      g.addEventListener("click", activar);
      g.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); activar(); }
      });
      svg.appendChild(g);
    });
  }

  /* ---------------------------------------------------------------------
     Serie de piezómetros (líneas 2px + umbrales).
     series = [{id, nombre, color, datos:[cota,...], destacada:bool}]
     umbrales = {alerta: cota, critico: cota}
  --------------------------------------------------------------------- */
  function graficoPiezometros(svg, series, umbrales, opciones) {
    opciones = opciones || {};
    var W = 760, H = 348;
    var ML = 60, MR = 100, MT = 28, MB = 34;
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", opciones.aria || "Nivel freático de los piezómetros del muro, últimos 90 días.");
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    var visibles = series.filter(function (s) { return s.visible !== false; });
    if (!visibles.length) return;

    var vals = [];
    visibles.forEach(function (s) { vals = vals.concat(s.datos); });
    vals.push(umbrales.alerta, umbrales.critico);
    var min = Math.min.apply(null, vals) - 0.3;
    var max = Math.max.apply(null, vals) + 0.3;
    var n = visibles[0].datos.length;

    function X(i) { return ML + (i / (n - 1)) * (W - ML - MR); }
    function Y(v) { return MT + (1 - (v - min) / (max - min)) * (H - MT - MB); }

    // Rejilla y eje Y (cotas, en formato chileno: 2.446,8)
    function cota(v) { return v.toFixed(1).replace(".", ","); }
    var pasos = 5;
    for (var i = 0; i <= pasos; i++) {
      var v = min + (i / pasos) * (max - min);
      var y = Y(v);
      svg.appendChild(el("line", { x1: ML, y1: y, x2: W - MR, y2: y, class: "eje" }));
      var t = el("text", { x: ML - 8, y: y + 3.5, class: "eje-txt", "text-anchor": "end" });
      t.textContent = cota(v);
      svg.appendChild(t);
    }
    var ty = el("text", { x: 0, y: 12, class: "eje-txt" });
    ty.textContent = "cota, m s.n.m.";
    svg.appendChild(ty);

    // Eje X (días)
    [0, 30, 60, 89].forEach(function (i) {
      var t = el("text", { x: X(i), y: H - 12, class: "eje-txt", "text-anchor": "middle" });
      t.textContent = i === 89 ? "hoy" : "-" + (89 - i) + "d";
      svg.appendChild(t);
    });

    // Umbrales: color de estado + rótulo (nunca sólo color)
    [
      { v: umbrales.alerta, c: COLOR.alerta, txt: "ALERTA " + cota(umbrales.alerta) },
      { v: umbrales.critico, c: COLOR.critico, txt: "CRÍTICO " + cota(umbrales.critico) }
    ].forEach(function (u) {
      svg.appendChild(el("line", {
        x1: ML, y1: Y(u.v), x2: W - MR, y2: Y(u.v),
        stroke: u.c, "stroke-width": 1, "stroke-dasharray": "5 4", opacity: ".85"
      }));
      var t = el("text", { x: W - MR + 6, y: Y(u.v) + 3.5, class: "eje-txt" });
      t.setAttribute("fill", u.c);
      t.textContent = u.txt;
      svg.appendChild(t);
    });

    // Líneas
    visibles.forEach(function (s) {
      var d = s.datos.map(function (v, i) { return (i ? "L" : "M") + X(i).toFixed(1) + "," + Y(v).toFixed(1); }).join(" ");
      svg.appendChild(el("path", {
        d: d, fill: "none", stroke: s.color, "stroke-width": s.destacada ? 2.4 : 2,
        "stroke-linejoin": "round", "stroke-linecap": "round",
        opacity: s.destacada ? 1 : .75
      }));
      // punto final con anillo de superficie
      var xf = X(n - 1), yf = Y(s.datos[n - 1]);
      svg.appendChild(el("circle", { cx: xf, cy: yf, r: 5, fill: s.color, stroke: "#0F1A1F", "stroke-width": 2 }));
      // etiqueta directa sólo en la serie de la historia
      if (s.destacada) {
        var lt = el("text", { x: xf + 9, y: yf - 8, class: "eje-txt" });
        lt.setAttribute("fill", "#C2D2D9");
        lt.textContent = s.id;
        svg.appendChild(lt);
      }
      var tt = el("title", {});
      tt.textContent = s.nombre + ": " + s.datos[n - 1].toFixed(2) + " m s.n.m.";
      svg.appendChild(tt);
    });
  }

  global.FreatiaGraficos = {
    COLOR: COLOR,
    sankeyHidrico: sankeyHidrico,
    graficoPiezometros: graficoPiezometros,
    fmt: fmt,
    el: el
  };
})(window);
