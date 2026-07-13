/* ============================================================================
   RUTAMO — motor del demo.
   Un solo objeto `S` de estado, dos vistas que lo leen. Lo que hace el técnico
   en el teléfono se ve en el despacho, y al revés. Sin frameworks, sin build.
   ============================================================================ */
(function () {
  "use strict";

  /* --------------------------------------------------------- constantes -- */
  var BASE = { x: 390, y: 315, n: "Bodega — Estación Central" };
  var KMPX = 0.058;     // 1 px ≈ 58 m (el mapa cubre ~46 km de este a oeste)
  var VEL = 22;         // km/h medios en Santiago, con tráfico
  var COSTO_KM = 180;   // $ por km de camioneta (combustible + desgaste + TAG)
  var COSTO_H = 9500;   // $ por hora de técnico cargada
  var INICIO = 8.5;     // 08:30 salen de la bodega
  var IVA = 0.19;

  var TEC = [
    { id: "t1", nom: "Rodrigo Fuentes", corto: "Rodrigo F.", esp: "Gasfitería y sanitarios", col: "#2a78d6", pat: "JXKV-42" },
    { id: "t2", nom: "Camila Soto", corto: "Camila S.", esp: "Climatización / HVAC", col: "#1baf7a", pat: "LSTR-08" },
    { id: "t3", nom: "Nelson Aguilar", corto: "Nelson A.", esp: "Refrigeración comercial", col: "#eda100", pat: "HDBK-71" },
    { id: "t4", nom: "Ignacio Peña", corto: "Ignacio P.", esp: "Eléctrico · SEC clase B", col: "#008300", pat: "PWZL-33" },
    { id: "t5", nom: "Marisol Vega", corto: "Marisol V.", esp: "Ascensores y elevación", col: "#4a3aa7", pat: "RKCV-19" }
  ];

  var CAT = [
    { sku: "MO", n: "Mano de obra técnica", u: "hora", p: 28000 },
    { sku: "VIS", n: "Visita y diagnóstico", u: "visita", p: 35000 },
    { sku: "TES2", n: "Válvula expansión Danfoss TES2", u: "un", p: 38500 },
    { sku: "CAP", n: "Capacitor 35+5 µF 440V", u: "un", p: 8900 },
    { sku: "LC1D18", n: "Contactor Schneider LC1D18", u: "un", p: 24700 },
    { sku: "DML", n: "Filtro deshidratador Danfoss DML 083", u: "un", p: 12400 },
    { sku: "R410A", n: "Gas refrigerante R-410A", u: "kg", p: 21000 },
    { sku: "T6360", n: "Termostato Honeywell T6360", u: "un", p: 19900 },
    { sku: "FLEX", n: "Flexible de gas 1/2\" x 40 cm", u: "un", p: 4300 },
    { sku: "SKF", n: "Rodamiento SKF 6204-2RS", u: "un", p: 9800 },
    { sku: "ALT", n: "Recargo trabajo en altura / subterráneo", u: "visita", p: 15000 }
  ];

  function V(id, n, dir, com, x, y, tipo, equipo, serie, dur, prio, hist) {
    return {
      id: id, n: n, dir: dir, com: com, x: x, y: y, tipo: tipo, equipo: equipo,
      serie: serie, dur: dur, prio: prio || "normal", hist: hist || [],
      estado: "pendiente", cot: {}, firma: false, pagado: 0, fotos: 0, revisita: null
    };
  }

  var VIS0 = [
    V("V1", "Restaurante Doña Pancha", "Merced 428, of. 2", "Santiago", 430, 250, "Correctivo",
      "Caldera mural Junkers ZW23-1AE", "JK-2018-9042", 60, "normal",
      [["12 mar 2026", "Purga de radiadores y cambio de válvula de seguridad. Se advirtió al cliente que el intercambiador está sarroso."],
       ["04 nov 2025", "Mantención anual. Presión de gas OK."]]),
    V("V2", "Condominio Los Aromos", "Walker Martínez 1890, torre B", "La Florida", 555, 470, "Mantención",
      "Ascensor Otis Gen2 Comfort 630 kg", "OT-2019-4471", 75, "normal",
      [["10 jun 2026", "Mantención mensual. Se lubricaron guías y se ajustó freno."],
       ["09 may 2026", "Mantención mensual. Cambio de rodamiento SKF 6204."]]),
    V("V3", "Hotel Ismael 312", "Ismael Valdés Vergara 312", "Santiago", 445, 285, "Correctivo",
      "Bomba de presurización Pedrollo JSWm 2CX", "PD-2022-0817", 45, "normal",
      [["27 abr 2026", "Cambio de presostato. Cliente reclama golpe de ariete en piso 4."]]),
    V("V4", "Colegio San Nicolás", "Concha y Toro 2244", "Puente Alto", 560, 580, "Correctivo",
      "Red de agua potable — 3 baños del pabellón norte", "—", 90, "normal",
      [["18 mar 2026", "Reparación de fuga en matriz del pabellón sur."]]),

    V("V5", "Edificio Costanera 4", "Nueva Costanera 3480, sala de máquinas -2", "Vitacura", 630, 155, "Mantención",
      "Chiller Carrier 30RB-060 · 60 TR", "CH-2019-4471", 120, "normal",
      [["15 abr 2026", "Mantención trimestral. Se limpiaron condensadores, se midió superheat 8K."],
       ["12 ene 2026", "Cambio de contactor del compresor 2."]]),
    V("V6", "Clínica Dental Ávila", "Av. Providencia 2134, of. 704", "Providencia", 530, 225, "Mantención",
      "Split muro Midea 12.000 BTU (×3)", "MD-2023-2210", 50, "normal",
      [["20 ene 2026", "Mantención de los 3 equipos. Filtros lavados."]]),
    V("V7", "Gimnasio Energy Vitacura", "Alonso de Córdova 5151", "Las Condes", 650, 240, "Correctivo",
      "Torre de enfriamiento Evapco LSTA", "EV-2017-3390", 90, "normal",
      [["03 feb 2026", "Se cambió correa trapezoidal A-42 y se trató el agua."]]),
    V("V8", "Oficinas Grupo Kaufmann", "Apoquindo 4900, piso 12", "Las Condes", 620, 265, "Mantención",
      "Fancoils Trane (12 unidades, piso 12)", "TR-2020-1188", 100, "normal",
      [["06 may 2026", "Mantención semestral. 2 fancoils con ruido de rodamiento."]]),

    V("V9", "Panadería San Camilo", "Av. Irarrázaval 2688", "Ñuñoa", 520, 320, "Correctivo",
      "Cámara de frío Bohn LET090BK", "BH-2021-0455", 90, "normal",
      [["22 may 2026", "Recarga de R-404A. Se detectó fuga menor en línea de succión, se recomendó reemplazo."],
       ["30 dic 2025", "Cambio de termostato."]]),
    V("V10", "Unimarc Maipú", "Av. Pajaritos 2840", "Maipú", 170, 350, "Correctivo",
      "Vitrina refrigerada Frimetal VRC-250", "FR-2020-7712", 70, "normal",
      [["11 jun 2026", "Se limpió evaporador y se reguló válvula. Quedó en 3 °C."]]),
    V("V11", "Frigorífico Vega Central", "Nueva Rengifo 1750, galpón 3", "Recoleta", 505, 165, "Mantención",
      "Compresor Bitzer 4FES-3Y", "BZ-2016-2005", 110, "normal",
      [["29 abr 2026", "Cambio de aceite y filtro deshidratador."]]),

    V("V12", "Bodega Sodimac Quilicura", "Panamericana Norte 9750", "Quilicura", 350, 105, "Correctivo",
      "Tablero general TDA-1 · falla intermitente", "TD-2015-0021", 120, "normal",
      [["17 feb 2026", "Reapriete de barras y termografía. Se declaró TE1."]]),
    V("V13", "Farmacia Cruz Verde", "Gran Avenida 8340", "La Cisterna", 405, 485, "Correctivo",
      "Iluminación de sala + tablero secundario", "—", 60, "normal", []),

    V("V14", "Edificio Panorámico", "Nueva Providencia 1881", "Providencia", 515, 245, "Mantención",
      "Ascensor Schindler 3300 · 800 kg", "SC-2021-8811", 70, "normal",
      [["11 jun 2026", "Mantención mensual. Cambio de zapata de guía."]]),
    V("V15", "Condominio Alto Macul", "Av. Macul 5900", "Macul", 455, 375, "Mantención",
      "Ascensor Otis Gen2 · 450 kg (2 torres)", "OT-2018-2277", 90, "normal",
      [["09 jun 2026", "Mantención mensual. Botonera del piso 6 con falso contacto."]])
  ];

  var SIN0 = [
    V("U1", "Lavandería Wash & Go", "Av. Pedro Aguirre Cerda 4120", "Cerrillos", 300, 360, "Correctivo",
      "Caldera de vapor Fulton 15 HP", "FU-2019-3320", 90, "normal",
      [["02 abr 2026", "Cambio de electrodo de encendido."]]),
    V("U2", "Café Colonia", "Merced 346", "Santiago", 470, 230, "Correctivo",
      "Vitrina exhibidora Frimetal 2 puertas", "FR-2022-4410", 45, "normal", []),
    V("U3", "Edificio Bellas Artes", "Monjitas 617", "Santiago", 462, 238, "Mantención",
      "Ascensor Mitsubishi Nexiez 630 kg", "MT-2020-9931", 80, "normal", [])
  ];

  var URG = V("U9", "Supermercado Santa Isabel", "Av. Irarrázaval 3560 (acceso trasero)", "Ñuñoa", 505, 340,
    "Correctivo", "Cámara de frío lácteos Bohn LET090BK", "CF-2021-118", 90, "urgente",
    [["19 feb 2026", "Recarga de gas. Se detecta fuga no localizada."],
     ["08 oct 2025", "Cambio de válvula de expansión. Misma falla."]]);

  var RUTAS0 = { t1: ["V1", "V2", "V3", "V4"], t2: ["V5", "V6", "V7", "V8"], t3: ["V9", "V10", "V11"], t4: ["V12", "V13"], t5: ["V14", "V15"] };

  /* ------------------------------------------------------------- estado -- */
  var S, kmInicial = null;

  function reset() {
    S = {
      vis: {},
      rutas: JSON.parse(JSON.stringify(RUTAS0)),
      sin: [],
      cobrado: 0,
      filtro: null,
      sel: null,
      abierta: null,          // orden de trabajo abierta en el teléfono
      tab: "trabajo",
      tecActivo: "t1",
      online: true,
      cola: [],
      urgenciaUsada: false,
      vista: "despacho"
    };
    VIS0.concat(SIN0).forEach(function (v) { S.vis[v.id] = JSON.parse(JSON.stringify(v)); });
    S.vis[URG.id] = JSON.parse(JSON.stringify(URG));
    S.sin = ["U1", "U2", "U3"];
    kmInicial = null;
  }

  /* ---------------------------------------------------------- utilidades -- */
  function $(s) { return document.querySelector(s); }
  function clp(n) { return "$" + Math.round(n).toLocaleString("es-CL"); }
  function tec(id) { for (var i = 0; i < TEC.length; i++) if (TEC[i].id === id) return TEC[i]; }
  function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y) * KMPX; }
  function hhmm(h) {
    var t = Math.round(h * 60), hh = Math.floor(t / 60), mm = t % 60;
    return (hh < 10 ? "0" : "") + hh + ":" + (mm < 10 ? "0" : "") + mm;
  }
  function largoRuta(ids) {
    var km = 0, p = BASE;
    for (var i = 0; i < ids.length; i++) { km += dist(p, S.vis[ids[i]]); p = S.vis[ids[i]]; }
    return km + dist(p, BASE);
  }
  function kmTotal() { var k = 0; for (var t in S.rutas) k += largoRuta(S.rutas[t]); return k; }

  /* ETA acumulada de una ruta: [{id, llega, sale, viaje}] */
  function agenda(ids) {
    var out = [], cur = INICIO, p = BASE;
    for (var i = 0; i < ids.length; i++) {
      var v = S.vis[ids[i]];
      var viaje = dist(p, v) / VEL;
      var llega = cur + viaje;
      var sale = llega + v.dur / 60;
      out.push({ id: v.id, viaje: viaje, llega: llega, sale: sale });
      cur = sale; p = v;
    }
    return out;
  }

  function optimizar(ids) {
    if (ids.length < 2) return ids.slice();
    // las urgencias se atienden primero, pase lo que pase
    var urg = ids.filter(function (i) { return S.vis[i].prio === "urgente"; });
    var rest = ids.filter(function (i) { return S.vis[i].prio !== "urgente"; });
    var out = [], p = urg.length ? S.vis[urg[urg.length - 1]] : BASE;
    while (rest.length) {                                  // vecino más cercano
      var bi = 0, bd = Infinity;
      for (var i = 0; i < rest.length; i++) {
        var d = dist(p, S.vis[rest[i]]);
        if (d < bd) { bd = d; bi = i; }
      }
      p = S.vis[rest[bi]]; out.push(rest.splice(bi, 1)[0]);
    }
    var full = urg.concat(out);
    var mejora = true, guard = 0;                          // 2-opt
    while (mejora && guard++ < 40) {
      mejora = false;
      for (var i2 = urg.length; i2 < full.length - 1; i2++) {
        for (var j = i2 + 1; j < full.length; j++) {
          var cand = full.slice(0, i2).concat(full.slice(i2, j + 1).reverse(), full.slice(j + 1));
          if (largoRuta(cand) < largoRuta(full) - 0.0001) { full = cand; mejora = true; }
        }
      }
    }
    return full;
  }

  /* mejor punto de inserción de una visita en la ruta de un técnico */
  function mejorInsercion(tid, vid) {
    var ruta = S.rutas[tid], v = S.vis[vid];
    var best = { pos: ruta.length, delta: Infinity };
    for (var i = 0; i <= ruta.length; i++) {
      var cand = ruta.slice(0, i).concat([vid], ruta.slice(i));
      var d = largoRuta(cand) - largoRuta(ruta);
      if (d < best.delta) best = { pos: i, delta: d };
    }
    best.min = best.delta / VEL * 60;
    best.finDia = agenda(S.rutas[tid].slice(0, best.pos).concat([vid], S.rutas[tid].slice(best.pos)));
    best.fin = best.finDia.length ? best.finDia[best.finDia.length - 1].sale + dist(S.vis[best.finDia[best.finDia.length - 1].id], BASE) / VEL : INICIO;
    return best;
  }

  function toast(html) {
    var d = document.createElement("div");
    d.className = "toast"; d.innerHTML = html;
    $("#toasts").appendChild(d);
    setTimeout(function () { d.remove(); }, 5200);
  }

  function encolar(txt) {
    if (!S.online) { S.cola.push(txt); }
  }

  /* ======================================================== RENDER MAPA == */
  function renderMapa() {
    var rutas = "", pins = "";
    TEC.forEach(function (t) {
      var ids = S.rutas[t.id];
      if (!ids.length) return;
      var pts = BASE.x + "," + BASE.y;
      ids.forEach(function (id) { pts += " " + S.vis[id].x + "," + S.vis[id].y; });
      pts += " " + BASE.x + "," + BASE.y;
      var dim = (S.filtro && S.filtro !== t.id) ? " dim" : "";
      rutas += '<polyline class="route' + dim + '" points="' + pts + '" fill="none" stroke="' + t.col +
        '" stroke-width="2.6" stroke-linejoin="round" opacity="' + (dim ? "" : ".95") + '"/>';

      ids.forEach(function (id, i) {
        var v = S.vis[id];
        var done = v.estado === "listo" || v.estado === "cobrada";
        var sel = S.sel === id;
        pins += '<g class="pin' + dim + '" data-vid="' + id + '" tabindex="0" role="button" aria-label="' + v.n + ', parada ' + (i + 1) + ' de ' + t.corto + '">' +
          (v.prio === "urgente" ? '<circle cx="' + v.x + '" cy="' + v.y + '" r="17" fill="none" stroke="#C0332E" stroke-width="2"/>' : "") +
          (sel ? '<circle cx="' + v.x + '" cy="' + v.y + '" r="16" fill="#D9F02B" stroke="#14161A" stroke-width="1.5"/>' : "") +
          '<circle cx="' + v.x + '" cy="' + v.y + '" r="11.5" fill="' + (done ? "#FBFAF6" : t.col) + '" stroke="#14161A" stroke-width="1.6"/>' +
          '<text x="' + v.x + '" y="' + (v.y + 4) + '" text-anchor="middle" font-family="\'IBM Plex Mono\',monospace" font-size="11" font-weight="600" fill="' + (done ? "#14161A" : "#fff") + '">' + (i + 1) + '</text>' +
          '</g>';
      });
    });
    // sin asignar: rombos huecos
    S.sin.forEach(function (id) {
      var v = S.vis[id];
      pins += '<g class="pin" data-vid="' + id + '" tabindex="0" role="button" aria-label="' + v.n + ', sin asignar">' +
        '<rect x="' + (v.x - 8) + '" y="' + (v.y - 8) + '" width="16" height="16" transform="rotate(45 ' + v.x + ' ' + v.y + ')" fill="#FBFAF6" stroke="' + (v.prio === "urgente" ? "#C0332E" : "#14161A") + '" stroke-width="2" stroke-dasharray="3 2"/>' +
        '</g>';
    });
    $("#routes").innerHTML = rutas;
    $("#pins").innerHTML = pins;
  }

  /* ======================================================= RENDER CHIPS == */
  function renderChips() {
    var h = '<button class="chip" data-f="" aria-pressed="' + (!S.filtro) + '">Todos</button>';
    TEC.forEach(function (t) {
      h += '<button class="chip" data-f="' + t.id + '" aria-pressed="' + (S.filtro === t.id) + '">' +
        '<i style="background:' + t.col + '"></i>' + t.corto + '</button>';
    });
    $("#chips").innerHTML = h;
  }

  /* ===================================================== RENDER BANDEJA == */
  function renderBandeja() {
    var el = $("#bandeja"), h = "";
    if (!S.sin.length) h = '<p class="src" style="border:0;padding:0">Bandeja vacía. Todo el día está despachado.</p>';
    S.sin.forEach(function (id) {
      var v = S.vis[id], abierta = S.sel === id;
      h += '<button class="ord" data-ord="' + id + '" aria-expanded="' + abierta + '">' +
        '<span class="ord__t">' + v.n + '</span>' +
        '<span class="ord__m">' + v.com + ' · ' + v.dir + '</span>' +
        '<span class="ord__m">' + v.equipo + '</span>' +
        '<span class="ord__m">' + v.dur + ' min estimados</span>' +
        (v.prio === "urgente" ? '<span class="ord__b ord__b--urg">Urgente</span> ' : "") +
        (v.revisita ? '<span class="ord__b ord__b--rev">Revisita · ' + v.revisita + '</span>' : '<span class="ord__b">' + v.tipo + '</span>') +
        '</button>';
      if (abierta) {
        var ops = TEC.map(function (t) {
          var m = mejorInsercion(t.id, id);
          return { t: t, m: m };
        }).sort(function (a, b) { return a.m.min - b.m.min; });
        h += '<div class="assign"><p>Rutamo propone (ordenado por desvío real, no por quién está libre):</p>';
        ops.forEach(function (o, i) {
          var razon = i === 0
            ? "ya pasa cerca · +" + Math.round(o.m.min) + " min de desvío"
            : "+" + Math.round(o.m.min) + " min de desvío";
          h += '<button data-asig="' + o.t.id + '|' + id + '">' +
            '<i class="tec__sw" style="background:' + o.t.col + '"></i>' +
            '<span class="who">' + o.t.corto + '<br><span class="cost">' + o.t.esp + '</span></span>' +
            '<span class="cost' + (i === 0 ? " best" : "") + '">' + razon + '<br>termina ' + hhmm(o.m.fin) + '</span>' +
            '</button>';
        });
        h += '</div>';
      }
    });
    el.innerHTML = h;
    $("#sinCount").textContent = S.sin.length;
  }

  /* ======================================================= RENDER RUTAS == */
  function renderRutas() {
    var h = "";
    TEC.forEach(function (t) {
      var ids = S.rutas[t.id], ag = agenda(ids), km = largoRuta(ids);
      var fin = ag.length ? ag[ag.length - 1].sale + dist(S.vis[ag[ag.length - 1].id], BASE) / VEL : INICIO;
      h += '<div class="tec">' +
        '<div class="tec__h"><i class="tec__sw" style="background:' + t.col + '"></i>' +
        '<span class="tec__n">' + t.corto + '</span>' +
        '<span class="tec__k">' + km.toFixed(1).replace(".", ",") + ' km · vuelve ' + hhmm(fin) + '</span></div>';
      if (!ids.length) h += '<p class="src" style="border:0;padding:8px 10px">Sin visitas asignadas.</p>';
      ids.forEach(function (id, i) {
        var v = S.vis[id], a = ag[i];
        var done = v.estado === "listo" || v.estado === "cobrada";
        h += '<div class="stop' + (done ? " stop--done" : "") + '" data-sel="' + (S.sel === id ? 1 : 0) + '" data-vid="' + id + '">' +
          '<span class="stop__i" style="background:' + (done ? "#fff" : t.col) + ';color:' + (done ? "#14161A" : "#fff") + '">' + (i + 1) + '</span>' +
          '<span><span class="stop__n">' + v.n + (v.prio === "urgente" ? ' <b style="color:#C0332E">●</b>' : "") + '</span>' +
          '<span class="stop__m">' + hhmm(a.llega) + '–' + hhmm(a.sale) + ' · ' + v.com + ' · ' + Math.round(a.viaje * 60) + ' min de viaje</span>' +
          (v.pagado ? '<span class="stop__m" style="color:#0B6E3B">✔ cobrado ' + clp(v.pagado) + '</span>' : "") + '</span>' +
          '<span class="stop__a">' +
          '<button data-up="' + t.id + '|' + i + '" ' + (i === 0 ? "disabled" : "") + ' aria-label="Subir">↑</button>' +
          '<button data-dn="' + t.id + '|' + i + '" ' + (i === ids.length - 1 ? "disabled" : "") + ' aria-label="Bajar">↓</button>' +
          '</span></div>';
      });
      h += '<div style="padding:8px 10px;border-top:1px solid var(--rule)">' +
        '<button class="btn btn--sm" data-ver="' + t.id + '">Ver como ' + t.corto.split(" ")[0] + ' →</button></div>';
      h += '</div>';
    });
    $("#rutas").innerHTML = h;
  }

  /* ======================================================= RENDER GANTT == */
  function renderGantt() {
    var H0 = 8, H1 = 19, X0 = 78, X1 = 706, Y0 = 26, ROW = 30;
    function px(h) { return X0 + (X1 - X0) * (h - H0) / (H1 - H0); }
    var g = '<defs><pattern id="hatch" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">' +
      '<rect width="6" height="6" fill="#EDE9DE"/><line x1="0" y1="0" x2="0" y2="6" stroke="#C3BBA7" stroke-width="2"/></pattern></defs>';
    for (var h = H0; h <= H1; h++) {
      g += '<line x1="' + px(h) + '" y1="' + (Y0 - 8) + '" x2="' + px(h) + '" y2="' + (Y0 + ROW * 5 + 2) + '" stroke="#E3DDCE" stroke-width="1"/>' +
        '<text x="' + px(h) + '" y="' + (Y0 - 12) + '" text-anchor="middle" font-family="\'IBM Plex Mono\',monospace" font-size="9" fill="#6E6A61">' + h + '</text>';
    }
    TEC.forEach(function (t, r) {
      var y = Y0 + r * ROW;
      g += '<text x="8" y="' + (y + 14) + '" font-family="\'IBM Plex Mono\',monospace" font-size="10" fill="#14161A">' + t.corto + '</text>';
      var ag = agenda(S.rutas[t.id]), cur = INICIO;
      ag.forEach(function (a) {
        var v = S.vis[a.id];
        g += '<rect x="' + px(cur) + '" y="' + (y + 5) + '" width="' + Math.max(1, px(a.llega) - px(cur)) + '" height="14" fill="url(#hatch)" stroke="#C3BBA7" stroke-width=".5"><title>Viaje ' + Math.round(a.viaje * 60) + ' min</title></rect>';
        g += '<rect x="' + px(a.llega) + '" y="' + (y + 2) + '" width="' + Math.max(2, px(a.sale) - px(a.llega)) + '" height="20" fill="' + t.col + '" stroke="#14161A" stroke-width="1"><title>' + v.n + ' · ' + hhmm(a.llega) + '–' + hhmm(a.sale) + '</title></rect>';
        cur = a.sale;
      });
      if (ag.length) {
        var vuelta = cur + dist(S.vis[ag[ag.length - 1].id], BASE) / VEL;
        g += '<rect x="' + px(cur) + '" y="' + (y + 5) + '" width="' + Math.max(1, px(vuelta) - px(cur)) + '" height="14" fill="url(#hatch)" stroke="#C3BBA7" stroke-width=".5"><title>Vuelta a bodega</title></rect>';
        if (vuelta > 18) {
          g += '<text x="' + (px(vuelta) + 5) + '" y="' + (y + 16) + '" font-family="\'IBM Plex Mono\',monospace" font-size="9" fill="#C0332E">sobrepasa 18:00</text>';
        }
      }
    });
    g += '<line x1="' + px(18) + '" y1="' + (Y0 - 8) + '" x2="' + px(18) + '" y2="' + (Y0 + ROW * 5 + 2) + '" stroke="#C0332E" stroke-width="1.5" stroke-dasharray="4 3"/>';
    g += '<text x="' + (px(18) - 5) + '" y="' + (Y0 + ROW * 5 + 14) + '" text-anchor="end" font-family="\'IBM Plex Mono\',monospace" font-size="9" fill="#C0332E">fin de jornada 18:00</text>';
    g += '<rect x="' + X0 + '" y="' + (Y0 + ROW * 5 + 4) + '" width="12" height="10" fill="url(#hatch)" stroke="#C3BBA7"/>' +
      '<text x="' + (X0 + 18) + '" y="' + (Y0 + ROW * 5 + 13) + '" font-family="\'IBM Plex Mono\',monospace" font-size="9" fill="#6E6A61">viaje</text>' +
      '<rect x="' + (X0 + 56) + '" y="' + (Y0 + ROW * 5 + 4) + '" width="12" height="10" fill="#2a78d6" stroke="#14161A"/>' +
      '<text x="' + (X0 + 74) + '" y="' + (Y0 + ROW * 5 + 13) + '" font-family="\'IBM Plex Mono\',monospace" font-size="9" fill="#6E6A61">trabajo (el color es del técnico)</text>';
    $("#gantt").innerHTML = g;
  }

  /* ========================================================= RENDER KPI == */
  function renderKPI() {
    var n = 0; for (var t in S.rutas) n += S.rutas[t].length;
    var km = kmTotal();
    if (kmInicial === null) kmInicial = km;
    $("#kVisitas").textContent = n;
    $("#kSin").textContent = S.sin.length;
    $("#kKm").textContent = km.toFixed(1).replace(".", ",");
    $("#kHoras").textContent = (km / VEL).toFixed(1).replace(".", ",");
    $("#kCobrado").textContent = clp(S.cobrado);
  }

  /* ====================================================== RENDER TELÉFONO */
  function fotoChip(i) {
    return '<span class="photo"><svg width="14" height="12" viewBox="0 0 14 12" aria-hidden="true">' +
      '<rect x="0.5" y="2.5" width="13" height="9" fill="none" stroke="#C9CFC4"/>' +
      '<circle cx="7" cy="7" r="2.5" fill="none" stroke="#C9CFC4"/>' +
      '<rect x="4" y="0.5" width="6" height="2" fill="none" stroke="#C9CFC4"/></svg>' +
      'IMG_04' + (21 + i) + '.jpg · 2,1 MB' + (S.online ? "" : " · en cola") + '</span>';
  }

  function totalCot(v) {
    var neto = 0;
    for (var sku in v.cot) {
      var it = CAT.filter(function (c) { return c.sku === sku; })[0];
      neto += it.p * v.cot[sku];
    }
    return { neto: neto, iva: neto * IVA, total: neto * (1 + IVA) };
  }

  function renderTelefono() {
    var t = tec(S.tecActivo);
    $("#phTec").textContent = t.corto.toUpperCase() + " · " + t.pat + " · 09:41";
    var body = $("#phoneBody");

    /* --- banner de conexión --- */
    var ob = $("#offBanner");
    if (!S.online) {
      ob.className = "offbanner on";
      ob.innerHTML = "<span>▲</span><span>Sin señal — se está guardando en el teléfono. <b>" + S.cola.length + "</b> cambio" + (S.cola.length === 1 ? "" : "s") + " en cola.</span>";
    } else if (ob.dataset.sync === "1") {
      ob.className = "offbanner on syncing";
    } else {
      ob.className = "offbanner";
    }

    /* --- lista del día --- */
    if (!S.abierta) {
      var ids = S.rutas[S.tecActivo], ag = agenda(ids);
      var pend = ids.filter(function (i) { return S.vis[i].estado !== "listo" && S.vis[i].estado !== "cobrada"; }).length;
      var h = '<div class="fld-h"><h2>Tu día</h2><p>' + ids.length + ' visitas · ' + pend + ' pendientes · ' + largoRuta(ids).toFixed(0) + ' km</p></div>';
      if (!ids.length) h += '<p style="padding:14px;color:#8E948A">Sin visitas asignadas hoy.</p>';
      ids.forEach(function (id, i) {
        var v = S.vis[id], a = ag[i];
        var next = v.estado !== "listo" && v.estado !== "cobrada" &&
          ids.slice(0, i).every(function (x) { return S.vis[x].estado === "listo" || S.vis[x].estado === "cobrada"; });
        var badge = v.pagado ? '<span class="visit__s visit__s--pay">Cobrado ' + clp(v.pagado) + '</span>'
          : v.estado === "listo" ? '<span class="visit__s visit__s--ok">Listo</span>'
            : v.estado === "pendiente" ? '<span class="visit__s">' + v.tipo + ' · ' + v.dur + ' min</span>'
              : '<span class="visit__s visit__s--ok">' + v.estado + '</span>';
        h += '<button class="visit' + (next ? " visit--next" : "") + '" data-abrir="' + id + '">' +
          '<span class="visit__t"><span class="visit__n">' + v.n + '</span><span class="visit__h">' + hhmm(a.llega) + '</span></span>' +
          '<span class="visit__d">' + v.dir + ' · ' + v.com + '</span>' +
          '<span class="visit__d" style="color:#8E948A;font-size:.85rem">' + v.equipo + '</span>' +
          badge +
          (v.prio === "urgente" ? ' <span class="visit__s" style="border-color:#E88;color:#E88">Urgente</span>' : "") +
          '</button>';
      });
      body.innerHTML = h;
      return;
    }

    /* --- orden de trabajo --- */
    if (S.rutas[S.tecActivo].indexOf(S.abierta) === -1) { S.abierta = null; renderTelefono(); return; }
    var v = S.vis[S.abierta];
    var o = '<div class="ot__top"><button class="ot__back" data-cerrar="1" aria-label="Volver a la lista">←</button>' +
      '<span><span class="ot__title">' + v.n + '</span><br><span class="ot__sub">' + v.dir + ' · ' + v.com + '</span></span></div>' +
      '<div class="tabs" role="tablist">' +
      ['trabajo', 'equipo', 'historial', 'cotizar'].map(function (k) {
        return '<button role="tab" data-tab="' + k + '" aria-selected="' + (S.tab === k) + '">' + k + '</button>';
      }).join("") + '</div><div class="tabpanel">';

    if (S.tab === "trabajo") {
      var pasos = ["pendiente", "en camino", "en sitio", "trabajando", "listo"];
      var idx = Math.max(0, pasos.indexOf(v.estado === "cobrada" ? "listo" : v.estado));
      o += '<div class="progress">' + pasos.slice(1).map(function (_, i) {
        return '<i class="' + (i < idx ? "on" : "") + '"></i>';
      }).join("") + '</div>';

      if (v.estado === "pendiente") o += '<button class="bigbtn" data-est="en camino">Voy en camino</button>';
      else if (v.estado === "en camino") o += '<button class="bigbtn" data-est="en sitio">Llegué</button>';
      else if (v.estado === "en sitio") o += '<button class="bigbtn" data-est="trabajando">Empezar el trabajo</button>';
      else if (v.estado === "trabajando") o += '<button class="bigbtn" data-est="listo">Terminé</button>';
      else o += '<button class="bigbtn" disabled>Visita cerrada</button>';

      if (v.estado === "trabajando" || v.estado === "en sitio") {
        o += '<button class="bigbtn bigbtn--ghost" data-repuesto="1">Me falta un repuesto</button>';
      }
      o += '<button class="bigbtn bigbtn--ghost" data-foto="1">Adjuntar foto</button>';
      if (v.fotos) { o += '<div style="margin-bottom:12px">'; for (var f = 0; f < v.fotos; f++) o += fotoChip(f); o += '</div>'; }

      if (v.estado === "listo" || v.estado === "cobrada") {
        o += '<button class="bigbtn" data-tab-go="cotizar">' + (v.pagado ? "Ver la boleta" : "Cotizar y cobrar") + '</button>';
      }

      var ai = S.rutas[S.tecActivo].indexOf(v.id);
      var eta = agenda(S.rutas[S.tecActivo])[ai];
      o += '<div style="margin-top:14px">' +
        '<div class="stampline"><span>Ventana comprometida</span><b>' + (eta ? hhmm(eta.llega) : "—") + '</b></div>' +
        '<div class="stampline"><span>Trabajo</span><b>' + v.tipo + ' · ' + v.dur + ' min</b></div>' +
        '<div class="stampline"><span>Contacto en sitio</span><b>+56 9 8412 7730</b></div>' +
        '<div class="stampline"><span>Estado</span><b>' + (v.pagado ? "Cobrada" : v.estado) + '</b></div>' +
        '</div>' +
        '<a class="bigbtn bigbtn--ghost" style="display:grid;place-items:center;text-decoration:none;margin-top:12px" href="tel:+56984127730">Llamar al cliente</a>';
      if (v.revisitaCreada) {
        o += '<p style="margin-top:12px;color:#D9F02B;font-family:var(--mono);font-size:.78rem">▲ Revisita creada por falta de repuesto (' + v.revisitaCreada + '). El despacho ya la tiene en la bandeja.</p>';
      }
    }

    if (S.tab === "equipo") {
      o += '<div class="spec">' +
        '<div><span>Equipo</span><span>' + v.equipo + '</span></div>' +
        '<div><span>N° de serie</span><span>' + v.serie + '</span></div>' +
        '<div><span>Ubicación</span><span>' + v.dir + '</span></div>' +
        '<div><span>Última visita</span><span>' + (v.hist.length ? v.hist[0][0] : "sin registro") + '</span></div>' +
        '<div><span>Visitas 12 meses</span><span>' + v.hist.length + '</span></div>' +
        '<div><span>Repuestos usados antes</span><span>' + (v.hist.length ? "ver historial" : "—") + '</span></div>' +
        '</div>' +
        '<p style="margin-top:14px;color:#8E948A;font-size:.85rem;font-family:var(--mono)">Resumen para el técnico, generado antes de que llegara:</p>' +
        '<div class="hist" style="margin-top:8px"><p style="color:#fff">' +
        (v.hist.length > 1
          ? "Este equipo ya falló " + v.hist.length + " veces. La visita anterior dejó anotado un problema que no se resolvió: revísalo antes de recargar gas o cambiar piezas."
          : "Equipo sin historial de fallas repetidas. Mantención de rutina.") +
        '</p></div>';
    }

    if (S.tab === "historial") {
      if (!v.hist.length) o += '<p style="color:#8E948A">Sin visitas anteriores registradas.</p>';
      v.hist.forEach(function (hh) {
        o += '<div class="hist"><b>' + hh[0] + '</b><p>' + hh[1] + '</p><small>' + tec(S.tecActivo).corto + '</small></div>';
      });
    }

    if (S.tab === "cotizar") {
      if (v.pagado) {
        o += '<div class="pay"><div class="pay__brand">Webpay Plus · Transbank</div>' +
          '<div class="pay__amt">' + clp(v.pagado) + '</div>' +
          '<p class="pay__ok">PAGADO — 14/07/2026</p>' +
          '<p style="font-family:var(--mono);font-size:.7rem;color:#6E6A61;margin-top:8px">Orden RTM-2026-0' + v.id.replace("V", "") + ' · firmada por el cliente · boleta emitida en Bsale</p></div>';
      } else if (v.firma) {
        var tt = totalCot(v);
        o += '<div class="pay"><div class="pay__brand">Link de pago enviado por WhatsApp</div>' +
          '<div class="pay__amt">' + clp(tt.total) + '</div>' +
          '<p style="font-family:var(--mono);font-size:.72rem;color:#6E6A61">Firmado por el cliente · esperando pago</p>' +
          '<button class="btn btn--hi btn--sm" data-pagar="1" style="margin-top:12px;width:100%">Simular que el cliente paga</button></div>' +
          '<p style="margin-top:10px;color:#8E948A;font-size:.8rem;font-family:var(--mono)">En producción esto es un enlace de Webpay o Mercado Pago; el técnico no toca la tarjeta.</p>';
      } else {
        o += '<div class="cat">';
        CAT.forEach(function (c) {
          var q = v.cot[c.sku] || 0;
          o += '<div class="cat__row"><div><span class="cat__n">' + c.n + '</span>' +
            '<span class="cat__p">' + clp(c.p) + ' / ' + c.u + '</span></div>' +
            '<div class="step2"><button data-q="' + c.sku + '|-1" aria-label="Quitar uno de ' + c.n + '">–</button>' +
            '<output>' + q + '</output>' +
            '<button data-q="' + c.sku + '|1" aria-label="Agregar uno de ' + c.n + '">+</button></div></div>';
        });
        o += '</div>';
        var t2 = totalCot(v);
        o += '<div class="sum">' +
          '<div><span>Neto</span><span>' + clp(t2.neto) + '</span></div>' +
          '<div><span>IVA 19%</span><span>' + clp(t2.iva) + '</span></div>' +
          '<div class="tot"><span>Total</span><span>' + clp(t2.total) + '</span></div></div>';
        if (t2.neto > 0) {
          o += '<p style="margin-top:16px;color:#8E948A;font-family:var(--mono);font-size:.75rem">Pásale el teléfono al cliente y que firme acá:</p>' +
            '<canvas id="sigPad" width="380" height="170"></canvas>' +
            '<p class="sigline">Firma de conformidad — Marcela Ibáñez</p>' +
            '<div style="display:flex;gap:8px;margin-top:10px">' +
            '<button class="bigbtn bigbtn--ghost" style="flex:1;margin:0" data-limpiar="1">Borrar firma</button>' +
            '<button class="bigbtn" style="flex:2;margin:0" data-firmar="1">Aceptar y mandar el link</button></div>';
        } else {
          o += '<p style="margin-top:16px;color:#8E948A;font-size:.9rem">Agrega al menos un ítem para poder cotizar.</p>';
        }
      }
    }

    o += "</div>";
    body.innerHTML = o;
    if (document.getElementById("sigPad")) initFirma();
  }

  /* ----------------------------------------------------------- firma ---- */
  var firmaHecha = false;
  function initFirma() {
    var c = document.getElementById("sigPad");
    var ctx = c.getContext("2d");
    var r = c.getBoundingClientRect();
    c.width = r.width; c.height = 170;
    ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.strokeStyle = "#14161A";
    var draw = false, px = 0, py = 0;
    firmaHecha = false;
    function pos(e) {
      var b = c.getBoundingClientRect();
      var p = e.touches ? e.touches[0] : e;
      return [p.clientX - b.left, p.clientY - b.top];
    }
    function start(e) { e.preventDefault(); draw = true; var p = pos(e); px = p[0]; py = p[1]; }
    function move(e) {
      if (!draw) return;
      e.preventDefault();
      var p = pos(e);
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(p[0], p[1]); ctx.stroke();
      px = p[0]; py = p[1]; firmaHecha = true;
    }
    function end() { draw = false; }
    c.addEventListener("mousedown", start); c.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    c.addEventListener("touchstart", start, { passive: false });
    c.addEventListener("touchmove", move, { passive: false });
    c.addEventListener("touchend", end);
  }

  /* ============================================================ RENDER === */
  function render() {
    if (S.vista === "despacho") {
      $("#viewDespacho").hidden = false; $("#viewTerreno").hidden = true;
      $("#btnDespacho").setAttribute("aria-pressed", "true");
      $("#btnTerreno").setAttribute("aria-pressed", "false");
      renderKPI(); renderChips(); renderMapa(); renderBandeja(); renderRutas(); renderGantt();
    } else {
      $("#viewDespacho").hidden = true; $("#viewTerreno").hidden = false;
      $("#btnDespacho").setAttribute("aria-pressed", "false");
      $("#btnTerreno").setAttribute("aria-pressed", "true");
      var ch = "";
      TEC.forEach(function (t) {
        ch += '<button class="chip" data-tec="' + t.id + '" aria-pressed="' + (S.tecActivo === t.id) + '">' +
          '<i style="background:' + t.col + '"></i>' + t.corto + '</button>';
      });
      $("#tecChips").innerHTML = ch;
      renderTelefono();
    }
  }

  /* ========================================================== ACCIONES == */
  function irA(vista) { S.vista = vista; window.scrollTo({ top: 0, behavior: "instant" }); render(); }

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-f],[data-ord],[data-asig],[data-up],[data-dn],[data-ver],[data-vid],[data-tec],[data-abrir],[data-cerrar],[data-tab],[data-tab-go],[data-est],[data-repuesto],[data-foto],[data-q],[data-firmar],[data-limpiar],[data-pagar]");
    if (!el) return;
    var d = el.dataset;

    if (el.hasAttribute("data-f")) { S.filtro = d.f || null; render(); return; }

    if (d.ord) { S.sel = (S.sel === d.ord ? null : d.ord); render(); return; }

    if (d.asig) {
      var p = d.asig.split("|"), tid = p[0], vid = p[1];
      var best = mejorInsercion(tid, vid);
      S.rutas[tid].splice(best.pos, 0, vid);
      S.sin = S.sin.filter(function (x) { return x !== vid; });
      S.sel = null;
      toast("<b>" + S.vis[vid].n + "</b> asignada a " + tec(tid).corto + " en la parada " + (best.pos + 1) +
        ". Desvío: <b>+" + Math.round(best.min) + " min</b>. Se recalcularon las ETA de las visitas siguientes.");
      render(); return;
    }

    if (d.up || d.dn) {
      var q = (d.up || d.dn).split("|"), t2 = q[0], i = +q[1], j = d.up ? i - 1 : i + 1;
      var r = S.rutas[t2], tmp = r[i]; r[i] = r[j]; r[j] = tmp;
      render(); return;
    }

    if (d.ver) { S.tecActivo = d.ver; S.abierta = null; irA("terreno"); return; }

    if (d.vid) {
      S.sel = d.vid;
      render();
      var row = document.querySelector('.stop[data-vid="' + d.vid + '"]') || document.querySelector('.ord[data-ord="' + d.vid + '"]');
      if (row) row.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }

    if (d.tec) { S.tecActivo = d.tec; S.abierta = null; S.tab = "trabajo"; render(); return; }

    if (d.abrir) { S.abierta = d.abrir; S.tab = "trabajo"; render(); return; }
    if (d.cerrar) { S.abierta = null; render(); return; }
    if (d.tab) { S.tab = d.tab; render(); return; }
    if (d.tabGo) { S.tab = d.tabGo; render(); return; }

    if (d.est) {
      var v = S.vis[S.abierta];
      v.estado = d.est;
      encolar("estado " + v.id + " → " + d.est);
      if (d.est === "listo") {
        toast("<b>" + tec(S.tecActivo).corto + "</b> cerró " + v.n + ". " + (S.online ? "El despacho lo ve ahora." : "Guardado en el teléfono — se sincroniza al recuperar señal."));
      }
      render(); return;
    }

    if (d.repuesto) {
      var v2 = S.vis[S.abierta];
      var rp = CAT[2 + Math.floor(Math.random() * 6)];
      v2.revisitaCreada = rp.n;
      var nid = "R" + v2.id;
      if (!S.vis[nid]) {
        S.vis[nid] = JSON.parse(JSON.stringify(v2));
        S.vis[nid].id = nid;
        S.vis[nid].estado = "pendiente";
        S.vis[nid].cot = {}; S.vis[nid].firma = false; S.vis[nid].pagado = 0; S.vis[nid].fotos = 0;
        S.vis[nid].revisita = rp.n;
        S.vis[nid].dur = 45;
        S.vis[nid].revisitaCreada = null;
        S.sin.push(nid);
      }
      encolar("revisita " + nid);
      toast("Falta <b>" + rp.n + "</b>. Rutamo creó la revisita, la mandó a la bandeja del despacho y reservó la pieza en bodega." +
        (S.online ? "" : " (En cola: no hay señal.)"));
      render(); return;
    }

    if (d.foto) {
      var v3 = S.vis[S.abierta]; v3.fotos++;
      encolar("foto " + v3.id);
      render(); return;
    }

    if (d.q) {
      var pq = d.q.split("|"), sku = pq[0], delta = +pq[1];
      var v4 = S.vis[S.abierta];
      v4.cot[sku] = Math.max(0, (v4.cot[sku] || 0) + delta);
      if (!v4.cot[sku]) delete v4.cot[sku];
      encolar("cotización " + v4.id);
      render(); return;
    }

    if (d.limpiar) { render(); return; }

    if (d.firmar) {
      if (!firmaHecha) { toast("Falta la firma del cliente. Que raye la pantalla con el dedo."); return; }
      var v5 = S.vis[S.abierta];
      v5.firma = true;
      encolar("firma " + v5.id);
      toast("Cotización firmada. " + (S.online
        ? "Link de pago enviado por WhatsApp a <b>+56 9 8412 7730</b>."
        : "<b>Sin señal:</b> el link se manda solo cuando vuelva la cobertura."));
      render(); return;
    }

    if (d.pagar) {
      var v6 = S.vis[S.abierta];
      var tt = totalCot(v6);
      v6.pagado = tt.total;
      v6.estado = "cobrada";
      S.cobrado += tt.total;
      toast("<b>" + clp(tt.total) + "</b> pagados con Webpay en " + v6.n + ". El KPI del despacho ya se movió.");
      render(); return;
    }
  });

  /* pines del mapa accesibles por teclado */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var g = e.target.closest && e.target.closest("g.pin");
    if (!g) return;
    e.preventDefault();
    S.sel = g.dataset.vid; render();
  });

  /* --------------------------------------------------------- botones --- */
  $("#btnDespacho").addEventListener("click", function () { irA("despacho"); });
  $("#btnTerreno").addEventListener("click", function () { irA("terreno"); });

  $("#btnOptimizar").addEventListener("click", function () {
    var antes = kmTotal();
    for (var t in S.rutas) S.rutas[t] = optimizar(S.rutas[t]);
    var despues = kmTotal();
    var ahorroKm = antes - despues;
    var min = ahorroKm / VEL * 60;
    var plata = ahorroKm * COSTO_KM + (min / 60) * COSTO_H;
    var f = $("#saveflag");
    if (ahorroKm > 0.05) {
      f.innerHTML = "<b>−" + ahorroKm.toFixed(1).replace(".", ",") + " km</b><br>−" + Math.round(min) + " min de tráfico<br><b>" + clp(plata) + "</b> que no se queman hoy";
      f.style.display = "block";
      setTimeout(function () { f.style.display = "none"; }, 6000);
      toast("Rutas optimizadas: <b>" + antes.toFixed(1).replace(".", ",") + " km → " + despues.toFixed(1).replace(".", ",") + " km</b>. " +
        Math.round(min) + " minutos menos de Vespucio, " + clp(plata) + " que no se queman.");
    } else {
      toast("Las rutas ya estaban en su mejor orden. No hay nada que ganar.");
    }
    render();
  });

  $("#btnReset").addEventListener("click", function () {
    reset(); $("#offBanner").dataset.sync = "0"; $("#sigTxt").textContent = "CON SEÑAL";
    $("#btnSig").className = "sig"; $("#btnSig").setAttribute("aria-pressed", "false");
    toast("Día reiniciado. Vuelve a estar todo desordenado, como a las 07:50.");
    render();
  });

  /* señal */
  $("#btnSig").addEventListener("click", function () {
    S.online = !S.online;
    this.setAttribute("aria-pressed", String(!S.online));
    this.className = S.online ? "sig" : "sig sig--off";
    $("#sigTxt").textContent = S.online ? "CON SEÑAL" : "SIN SEÑAL";
    var ob = $("#offBanner");
    if (S.online && S.cola.length) {
      var n = S.cola.length;
      ob.dataset.sync = "1";
      ob.className = "offbanner on syncing";
      ob.innerHTML = "<span>↻</span><span>Sincronizando <b>" + n + "</b> cambios guardados sin señal…</span>";
      setTimeout(function () {
        S.cola = [];
        ob.dataset.sync = "0";
        toast("Sincronizados <b>" + n + "</b> cambios. El despacho ya los tiene: estados, fotos, la cotización y el link de pago salieron ahora.");
        render();
      }, 1600);
    } else if (!S.online) {
      toast("Modo sin señal. Sigue trabajando: todo queda guardado en el teléfono.");
    }
    render();
  });

  /* urgencia */
  $("#btnUrgencia").addEventListener("click", function () {
    if (S.urgenciaUsada) { toast("Ya entró la urgencia de hoy. Reinicia el día para volver a probarla."); return; }
    $("#modal").classList.add("on");
    $("#parsed").classList.remove("on");
    $("#fitBox").style.display = "none";
    $("#fitResult").innerHTML = "";
    $("#btnParse").style.display = "";
    $("#modalX").focus();
  });
  $("#modalX").addEventListener("click", function () { $("#modal").classList.remove("on"); });
  $("#modal").addEventListener("click", function (e) { if (e.target === this) this.classList.remove("on"); });

  $("#btnParse").addEventListener("click", function () {
    this.style.display = "none";
    $("#parsed").classList.add("on");
    $("#fitBox").style.display = "block";
  });

  $("#btnFit").addEventListener("click", function () {
    var vid = "U9";
    var ops = TEC.map(function (t) { return { t: t, m: mejorInsercion(t.id, vid) }; });
    // sólo refrigeración/climatización pueden tomarla; el resto no tiene la especialidad
    var aptos = ops.filter(function (o) { return o.t.id === "t3" || o.t.id === "t2"; })
      .sort(function (a, b) { return a.m.min - b.m.min; });
    var elegido = aptos[0];
    var ruta = S.rutas[elegido.t.id];
    // la urgencia se mete inmediatamente después de la visita en curso (posición 1)
    var pos = Math.min(1, ruta.length);
    ruta.splice(pos, 0, vid);
    var ag = agenda(ruta);
    var ultimo = ag[ag.length - 1];
    var vuelta = ultimo.sale + dist(S.vis[ultimo.id], BASE) / VEL;
    var desplazada = null;
    if (vuelta > 18) {
      var fuera = ruta.pop();
      desplazada = S.vis[fuera];
      S.sin.push(fuera);
      S.vis[fuera].revisita = "reprogramada por urgencia";
    }
    S.urgenciaUsada = true;
    S.sel = vid;
    $("#fitResult").innerHTML =
      '<div class="card" style="border-color:var(--ink)"><p class="tag">Decisión</p>' +
      '<p style="margin-top:6px"><strong>' + elegido.t.nom + '</strong> la toma como parada ' + (pos + 1) +
      '. Es el único con especialidad en refrigeración que puede llegar antes de las 13:00 (' +
      'desvío de <strong>+' + Math.round(elegido.m.min) + ' min</strong>).</p>' +
      (desplazada
        ? '<p style="margin-top:8px;color:var(--critical)"><strong>Costo de decir que sí:</strong> «' + desplazada.n +
        '» ya no cabe en el día y volvió a la bandeja para reprogramarse. Rutamo te lo dice ahora, no a las 18:30.</p>'
        : '<p style="margin-top:8px;color:var(--good)">La jornada aguanta: nadie se pasa de las 18:00.</p>') +
      '</div>';
    toast("Urgencia encajada en la ruta de <b>" + elegido.t.corto + "</b>." +
      (desplazada ? " Se reprogramó «" + desplazada.n + "»." : ""));
    render();
    setTimeout(function () { $("#modal").classList.remove("on"); }, 2600);
  });

  /* --------------------------------------------------------------- go --- */
  reset();
  render();
})();
