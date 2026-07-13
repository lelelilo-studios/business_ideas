/* ===========================================================================
   ZURCIA — demo. Todo el estado vive acá, en memoria, en tu pestaña.
   No hay red, no hay backend, no hay LLM: el "agente" es un clasificador de
   intenciones de ~40 reglas. Lo que sí es real es la mecánica de negocio:
   agenda → hueco → lista de espera ordenada por calce → oferta secuencial →
   rescate, con el costo por mensaje de Meta contado en cada paso.
   =========================================================================== */
(function () {
  'use strict';

  var LENTO = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------ datos ------------------------------ */
  var HORAS = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];
  var DIAS = [
    { k:'sab', l:'Sáb 18', sub:'hoy' },
    { k:'lun', l:'Lun 20', sub:'' },
    { k:'mar', l:'Mar 21', sub:'' },
    { k:'mie', l:'Mié 22', sub:'' },
    { k:'jue', l:'Jue 23', sub:'' }
  ];
  var PROS = [ { k:'marisol', n:'Marisol' }, { k:'katherine', n:'Katherine' }, { k:'diego', n:'Diego' } ];

  var SERV = {
    corte:  { n:'Corte',          min:60,  p:18000, bloques:1 },
    barba:  { n:'Corte + barba',  min:60,  p:22000, bloques:1 },
    color:  { n:'Color + corte',  min:120, p:52000, bloques:2 },
    mechas: { n:'Mechas',         min:180, p:78000, bloques:3 },
    mani:   { n:'Manicure',       min:60,  p:15000, bloques:1 },
    brush:  { n:'Brushing',       min:60,  p:16000, bloques:1 }
  };

  var CLI = {
    camila:    { n:'Camila Reyes',       t:'+56 9 8412 5507', v:7,  ns:0, r:'acepta',     d:3 },
    fernanda:  { n:'Fernanda Soto',      t:'+56 9 7736 2214', v:4,  ns:2, r:'acepta',     d:4 },
    rodrigo:   { n:'Rodrigo Pinto',      t:'+56 9 5520 8891', v:2,  ns:0, r:'acepta',     d:4 },
    valentina: { n:'Valentina Muñoz',    t:'+56 9 3308 9912', v:5,  ns:0, r:'acepta',     d:3 },
    ignacio:   { n:'Ignacio Tapia',      t:'+56 9 8871 0043', v:1,  ns:0, r:'rechaza',    d:2 },
    constanza: { n:'Constanza Rojas',    t:'+56 9 6120 7734', v:3,  ns:1, r:'nocontesta', d:99 },
    barbara:   { n:'Bárbara Leiva',      t:'+56 9 4417 2280', v:6,  ns:0, r:'acepta',     d:5 },
    matias:    { n:'Matías Cuevas',      t:'+56 9 9903 4417', v:2,  ns:0, r:'acepta',     d:6 },
    josefa:    { n:'Josefa Ibarra',      t:'+56 9 6641 3390', v:12, ns:0 },
    antonia:   { n:'Antonia Vera',       t:'+56 9 2214 5580', v:8,  ns:0 },
    sebastian: { n:'Sebastián Aguirre',  t:'+56 9 7745 1102', v:3,  ns:0 },
    paulina:   { n:'Paulina Cárdenas',   t:'+56 9 3391 6628', v:9,  ns:0 },
    daniela:   { n:'Daniela Fuenzalida', t:'+56 9 5508 2291', v:4,  ns:0 },
    catalina:  { n:'Catalina Espinoza',  t:'+56 9 6673 4419', v:6,  ns:0 },
    jorge:     { n:'Jorge Molina',       t:'+56 9 8802 7715', v:2,  ns:0 },
    pia:       { n:'Pía Contreras',      t:'+56 9 4490 3326', v:5,  ns:0 }
  };

  /* tarifas Meta (supuesto declarado; ver stack.html) */
  var TARIFA_UTIL = 17.3;   // CLP por plantilla de utilidad  (US$0,018 × $960)
  var TARIFA_MKT  = 56.6;   // CLP por plantilla de marketing (US$0,059 × $960)

  /* ------------------------------ estado ------------------------------ */
  var S, timers = [];

  function semilla() {
    var r = [];
    var id = 0;
    function res(dia, pro, h, srv, cli, estado) {
      r.push({ id: 'r' + (++id), dia: dia, pro: pro, h: h, srv: srv, cli: cli, estado: estado || 'ok' });
    }
    // sábado (hoy) — índice de hora: 0 = 09:00 … 10 = 19:00
    res('sab','marisol',0,'corte','josefa','confirmada');
    res('sab','marisol',2,'brush','antonia','confirmada');
    res('sab','marisol',4,'color','camila','ok');          // 13:00, 2 bloques
    res('sab','marisol',7,'barba','fernanda','ok');        // 16:00 — la que se va a caer
    res('sab','marisol',8,'corte','paulina','confirmada');
    res('sab','katherine',0,'mani','daniela','confirmada');
    res('sab','katherine',2,'color','catalina','confirmada'); // 11:00, 2 bloques
    res('sab','katherine',5,'brush','pia','ok');
    res('sab','katherine',9,'corte','sebastian','ok');
    res('sab','diego',1,'barba','jorge','confirmada');
    res('sab','diego',4,'corte','antonia','ok');
    res('sab','diego',7,'barba','sebastian','confirmada');
    // resto de la semana
    res('lun','marisol',1,'color','paulina','ok');
    res('lun','marisol',5,'corte','josefa','ok');
    res('lun','katherine',3,'mechas','catalina','ok');
    res('lun','diego',2,'barba','jorge','ok');
    res('mar','marisol',7,'barba','fernanda','ok');
    res('mar','katherine',1,'mani','daniela','ok');
    res('mie','diego',4,'corte','matias','ok');
    res('jue','marisol',3,'brush','pia','ok');
    return r;
  }

  function esperaInicial() {
    return [
      { id:'e1', cli:'rodrigo',   srv:'barba',  pref:'tarde',      dias:2 },
      { id:'e2', cli:'valentina', srv:'color',  pref:'manana',     dias:5 },
      { id:'e3', cli:'ignacio',   srv:'corte',  pref:'cualquiera', dias:1 },
      { id:'e4', cli:'constanza', srv:'mechas', pref:'tarde',      dias:4 },
      { id:'e5', cli:'barbara',   srv:'mani',   pref:'cualquiera', dias:3 },
      { id:'e6', cli:'matias',    srv:'barba',  pref:'tarde',      dias:6 }
    ];
  }

  function reset() {
    timers.forEach(clearTimeout); timers = [];
    S = {
      min: 8 * 60 + 35,
      modo: 'auto', tono: 'cercano',
      rec24: true, rec3: true, preventivo: true,
      candidatos: 3, ventana: 8,
      reservas: semilla(),
      espera: esperaInicial(),
      huecos: [],
      hilos: {
        camila: [
          { l:'in',  t:'hola! tienen hora pa el sábado? necesito color y corte 🙏', h:'mar 23:11' },
          { l:'out', t:'Hola Camila 👋 Sí. Color + corte toma 2 horas. Para el sábado 18 me quedan:\n\n· 10:00 con Marisol\n· 13:00 con Marisol\n· 17:00 con Katherine\n\n¿Cuál te acomoda?', h:'mar 23:11' },
          { l:'in',  t:'la de las 13:00 está bien', h:'mar 23:12' },
          { l:'out', t:'Listo, quedaste agendada 📌\n\nSábado 18 · 13:00\nColor + corte con Marisol\n$52.000 · 2 horas\n\nTe mando un recordatorio para confirmar.', h:'mar 23:12' }
        ]
      },
      conv: {},            // estado conversacional por contacto
      activo: 'camila',
      orden: ['camila', 'fernanda'],
      noLeidos: {},
      ofertas: {},         // cli -> hueco pendiente
      kpi: { rescatado:0, perdido:0, contestados:0, iniciados:0, sinResp:0 },
      hitos: { rec: false, prev: false },
      vistaDia: 'sab',
      vistaPro: 'marisol',
      abierto: null
    };
    pintaTodo();
  }

  /* ------------------------------ helpers ------------------------------ */
  var $ = function (s) { return document.querySelector(s); };
  var CLP = function (n) { return '$' + Math.round(n).toLocaleString('es-CL'); };
  function reloj() {
    var h = Math.floor(S.min / 60), m = S.min % 60;
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
  }
  function nom(k) { return CLI[k] ? CLI[k].n : k; }
  function esc(t) { return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function luego(ms, fn) { var id = setTimeout(fn, LENTO ? 0 : ms); timers.push(id); return id; }

  function reservaDe(cli) {
    // la próxima reserva viva de esa clienta
    var vivas = S.reservas.filter(function (r) {
      return r.cli === cli && (r.estado === 'ok' || r.estado === 'confirmada' || r.estado === 'riesgo' || r.estado === 'rescatada');
    });
    return vivas[0] || null;
  }
  function ocupado(dia, pro, h) {
    return S.reservas.some(function (r) {
      if (r.dia !== dia || r.pro !== pro) return false;
      if (r.estado === 'cancelada' || r.estado === 'noshow') return false;
      var b = SERV[r.srv].bloques;
      return h >= r.h && h < r.h + b;
    });
  }
  function libres(dia, srv, cuantos) {
    var b = SERV[srv].bloques, out = [];
    for (var h = 0; h <= HORAS.length - b; h++) {
      for (var p = 0; p < PROS.length; p++) {
        var ok = true;
        for (var k = 0; k < b; k++) if (ocupado(dia, PROS[p].k, h + k)) ok = false;
        // no ofrecer horas que ya pasaron hoy
        if (dia === 'sab' && (9 + h) * 60 <= S.min) ok = false;
        if (ok) out.push({ dia: dia, pro: PROS[p].k, h: h });
        if (out.length >= (cuantos || 3)) return out;
      }
    }
    return out;
  }

  /* ------------------------------ pintado ------------------------------ */
  function pintaTodo() { pintaReloj(); pintaKpis(); pintaChat(); pintaAgenda(); pintaRescates(); pintaAjustes(); }

  function pintaReloj() {
    $('#rj-hora').textContent = reloj();
    $('#rj-dia').textContent = 'Sábado 18';
  }

  function pintaKpis() {
    var costo = S.kpi.iniciados * TARIFA_UTIL;
    var k = [
      { c:'kpi--sello',    b: CLP(S.kpi.rescatado), s:'Rescatado hoy' },
      { c:'kpi--ladrillo', b: CLP(S.kpi.perdido),   s:'Perdido: no-shows' },
      { c:'',              b: S.kpi.contestados,    s:'Msjs contestados' },
      { c:'',              b: S.kpi.iniciados + ' · ' + CLP(costo), s:'Msjs iniciados · Meta' },
      { c:'',              b: Math.round(S.kpi.contestados * 2.5) + ' min', s:'Tiempo ahorrado' }
    ];
    if (S.modo === 'pausado' || S.kpi.sinResp > 0) {
      k.push({ c:'kpi--ladrillo', b: S.kpi.sinResp, s:'Sin responder' });
    }
    $('#kpis').innerHTML = k.map(function (x) {
      return '<div class="kpi ' + x.c + '"><b>' + x.b + '</b><span>' + x.s + '</span></div>';
    }).join('');
  }

  /* ---------- chat ---------- */
  function hilo(c) { if (!S.hilos[c]) S.hilos[c] = []; return S.hilos[c]; }

  function pintaChat() {
    var c = S.activo, cl = CLI[c];
    $('#wa-nom').textContent = cl.n;
    $('#wa-tel').textContent = cl.t + (cl.ns ? ' · ' + cl.ns + ' no-shows' : '');
    $('#wa-ini').textContent = cl.n.charAt(0);
    $('#wa-modo').textContent = { auto:'Automático', copiloto:'Copiloto', pausado:'En pausa' }[S.modo];

    // contactos
    $('#wa-contactos').innerHTML = S.orden.map(function (k) {
      var n = S.noLeidos[k] || 0;
      return '<button data-c="' + k + '" aria-pressed="' + (k === c) + '">' + esc(CLI[k].n.split(' ')[0]) +
        (n ? '<span class="n">' + n + '</span>' : '') + '</button>';
    }).join('');

    // hilo
    var H = hilo(c);
    $('#wa-hilo').innerHTML = H.map(function (m) {
      if (m.l === 'sys') {
        return '<div class="msj msj--sys">' + esc(m.t) +
          (m.draft ? ' <button class="btn-mini" data-enviar="1" style="min-height:28px;padding:2px 8px;margin-left:4px;">Enviar</button>' : '') +
          '</div>';
      }
      if (m.l === 'esc') return '<div class="msj msj--out msj--escribe"><i></i><i></i><i></i></div>';
      return '<div class="msj msj--' + m.l + '">' + esc(m.t) +
        '<span class="msj__h">' + (m.h || reloj()) + (m.l === 'out' ? ' ✓✓' : '') + '</span></div>';
    }).join('');
    $('#wa-hilo').scrollTop = $('#wa-hilo').scrollHeight;

    delete S.noLeidos[c];
    var tot = Object.keys(S.noLeidos).reduce(function (a, k) { return a + S.noLeidos[k]; }, 0);
    $('#pip-chat').dataset.n = tot; $('#pip-chat').textContent = tot;

    pintaRapidas();
  }

  function pintaRapidas() {
    var c = S.activo, cv = S.conv[c] || {}, out = [];
    if (S.ofertas[c]) {
      out = [['La tomo', 'la tomo'], ['No puedo', 'no puedo']];
    } else if (cv.esperando === 'servicio') {
      out = Object.keys(SERV).map(function (k) { return [SERV[k].n, SERV[k].n]; });
    } else if (cv.esperando === 'dia') {
      out = DIAS.map(function (d) { return [d.l, d.l]; });
    } else if (cv.esperando === 'eleccion') {
      out = (cv.op || []).map(function (o, i) { return [(i + 1) + ') ' + HORAS[o.h] + ' ' + PROS.filter(function(p){return p.k===o.pro;})[0].n, String(i + 1)]; });
    } else {
      var r = reservaDe(c);
      out = [['Quiero hora', 'hola, quiero pedir hora']];
      if (r) { out.push(['Cancelar mi hora', 'no voy a poder ir, cancélame']); out.push(['Cambiar la hora', 'puedo cambiar la hora?']); out.push(['Confirmo', 'confirmo, ahí estaré']); }
      out.push(['¿Cuánto vale?', 'cuánto vale el color?']);
      out.push(['Avísame si se desocupa', 'avísame si se desocupa algo']);
    }
    $('#wa-rapidas').innerHTML = out.map(function (o) {
      return '<button data-q="' + esc(o[1]) + '">' + esc(o[0]) + '</button>';
    }).join('');
  }

  function dice(c, txt, sys) {
    hilo(c).push({ l: sys ? 'sys' : 'out', t: txt, h: reloj() });
    if (c !== S.activo) S.noLeidos[c] = (S.noLeidos[c] || 0) + 1;
    if (S.orden.indexOf(c) < 0) S.orden.push(c);
  }

  function responde(c, txt) {
    // el agente responde según el modo
    if (S.modo === 'pausado') {
      S.kpi.sinResp++;
      hilo(c).push({ l:'sys', t:'Agente en pausa · mensaje sin responder' });
      pintaChat(); pintaKpis();
      return;
    }
    hilo(c).push({ l:'esc' });
    pintaChat();
    luego(750, function () {
      var H = hilo(c);
      var i = H.map(function (m) { return m.l; }).lastIndexOf('esc');
      if (i >= 0) H.splice(i, 1);
      if (S.modo === 'copiloto') {
        H.push({ l:'sys', t:'Borrador listo para la recepción', draft: txt });
      } else {
        dice(c, txt);
        S.kpi.contestados++;
      }
      pintaChat(); pintaKpis();
    });
  }

  /* ---------- agenda ---------- */
  function pintaAgenda() {
    $('#ag-dias').innerHTML = DIAS.map(function (d) {
      return '<button data-d="' + d.k + '" aria-pressed="' + (d.k === S.vistaDia) + '">' + d.l +
        (d.sub ? '<small>' + d.sub + '</small>' : '') + '</button>';
    }).join('');
    $('#ag-pros').innerHTML = PROS.map(function (p) {
      return '<button data-p="' + p.k + '" aria-pressed="' + (p.k === S.vistaPro) + '">' + p.n + '</button>';
    }).join('');

    var anchoAncho = window.matchMedia('(min-width: 48em)').matches;
    var pros = anchoAncho ? PROS : PROS.filter(function (p) { return p.k === S.vistaPro; });

    var libresN = 0, totN = 0;
    var html = '<div class="reja">' + pros.map(function (p) {
      var col = '<div class="reja__col"><div class="reja__cab"><span>' + p.n + '</span><em id="oc-' + p.k + '"></em></div>';
      for (var h = 0; h < HORAS.length; h++) {
        totN++;
        var enHora = S.reservas.filter(function (x) {
          return x.dia === S.vistaDia && x.pro === p.k && x.h === h;
        });
        var viva = enHora.filter(function (x) { return x.estado !== 'cancelada' && x.estado !== 'noshow'; });
        var r = viva[0] || enHora[0];
        var tapado = !r && ocupado(S.vistaDia, p.k, h);
        if (tapado) continue; // el bloque lo ocupa una reserva larga de más arriba
        if (!r) {
          libresN++;
          col += '<div class="bloque" data-e="libre"><span class="bloque__h">' + HORAS[h] + '</span>' +
                 '<span class="bloque__q">Libre</span><span class="tag tag--tinta">—</span></div>';
          continue;
        }
        var s = SERV[r.srv], e = r.estado, tag = '', pasada = false;
        if (S.vistaDia === 'sab' && (9 + r.h + s.bloques) * 60 <= S.min && (e === 'ok' || e === 'confirmada' || e === 'rescatada')) {
          pasada = true;
        }
        if (e === 'confirmada')      tag = '<span class="tag tag--sello">Confirmada</span>';
        else if (e === 'rescatada')  tag = '<span class="tag tag--sello">Rescatada</span>';
        else if (e === 'cancelada')  tag = '<span class="tag tag--ladrillo">Canceló</span>';
        else if (e === 'noshow')     tag = '<span class="tag tag--ladrillo">No llegó</span>';
        else if (e === 'riesgo')     tag = '<span class="tag tag--ambar">En riesgo</span>';
        else                         tag = '<span class="tag tag--tinta">Sin confirmar</span>';
        var alto = s.bloques > 1 ? ' · ' + s.bloques + ' h' : '';
        col += '<button class="bloque" data-r="' + r.id + '" data-e="' + (pasada ? 'pasada' : e) + '" aria-expanded="' + (S.abierto === r.id) + '">' +
          '<span class="bloque__h">' + HORAS[r.h] + '</span>' +
          '<span class="bloque__q"><b>' + esc(nom(r.cli)) + '</b><small>' + s.n + alto + ' · ' + CLP(s.p) + '</small></span>' +
          tag + '</button>';
        if (S.abierto === r.id) col += acciones(r);
      }
      col += '</div>';
      return col;
    }).join('') + '</div>';

    $('#ag-reja').innerHTML = html;
    var ocupPct = Math.round((1 - libresN / totN) * 100);
    $('#ag-ocup').textContent = 'Ocupación ' + ocupPct + '%';
  }

  function acciones(r) {
    var b = [];
    if (r.estado === 'ok' || r.estado === 'riesgo') b.push('<button data-a="conf" data-r="' + r.id + '">Confirmar</button>');
    if (r.estado !== 'cancelada' && r.estado !== 'noshow') {
      b.push('<button class="peligro" data-a="cancel" data-r="' + r.id + '">Cancelar → abrir hueco</button>');
      b.push('<button class="peligro" data-a="noshow" data-r="' + r.id + '">No llegó</button>');
    }
    b.push('<button data-a="cerrar">Cerrar</button>');
    return '<div class="acciones">' + b.join('') + '</div>';
  }

  /* ---------- rescates ---------- */
  function calce(e, hueco) {
    var s = 0;
    if (e.srv === hueco.srv) s += 40;
    else if (SERV[e.srv].bloques <= SERV[hueco.srv].bloques) s += 18;
    else return 0; // no cabe
    if (SERV[e.srv].bloques <= SERV[hueco.srv].bloques) s += 20;
    var tarde = hueco.h >= 5; // desde las 14:00
    if (e.pref === 'cualquiera') s += 16;
    else if ((e.pref === 'tarde' && tarde) || (e.pref === 'manana' && !tarde)) s += 25;
    else s += 4;
    s += Math.round(Math.min(e.dias, 6) / 6 * 15);
    return Math.min(s, 99);
  }

  function abrirHueco(r) {
    var s = SERV[r.srv];
    var hueco = {
      id: 'h' + Date.now() + Math.round(Math.random() * 99),
      dia: r.dia, pro: r.pro, h: r.h, srv: r.srv, monto: s.p,
      estado: 'buscando', idx: 0, t: 0, res: r.id, log: []
    };
    hueco.cands = S.espera
      .map(function (e) { return { e: e, c: calce(e, hueco), estado: 'cola' }; })
      .filter(function (x) { return x.c > 0; })
      .sort(function (a, b) { return b.c - a.c; })
      .slice(0, S.candidatos);
    S.huecos.unshift(hueco);
    if (!hueco.cands.length) { hueco.estado = 'fallido'; hueco.log.push('Nadie en la lista de espera calza con este hueco.'); pintaRescates(); return; }
    ofrecer(hueco);
  }

  function ofrecer(hueco) {
    var c = hueco.cands[hueco.idx];
    if (!c) { hueco.estado = 'fallido'; pintaRescates(); pintaKpis(); return; }
    c.estado = 'espera'; c.t = 0;
    hueco.t = 0;
    var cl = c.e.cli, srv = SERV[hueco.srv], pro = PROS.filter(function (p) { return p.k === hueco.pro; })[0].n;
    var cuando = hueco.dia === 'sab' ? 'HOY' : DIAS.filter(function (d) { return d.k === hueco.dia; })[0].l;
    var txt = S.tono === 'formal'
      ? nom(cl).split(' ')[0] + ', se liberó una hora ' + cuando + ' a las ' + HORAS[hueco.h] + ' con ' + pro + ' (' + srv.n + ', ' + CLP(srv.p) + '). ¿Desea tomarla? La reservo por ' + S.ventana + ' minutos.'
      : nom(cl).split(' ')[0] + ', se soltó una hora ' + cuando + ' a las ' + HORAS[hueco.h] + ' con ' + pro + ' (' + srv.n + ', ' + CLP(srv.p) + '). Me pediste algo así.\n\n¿La tomas? Te la guardo ' + S.ventana + ' minutos.';
    dice(cl, txt);
    S.ofertas[cl] = hueco;
    S.kpi.iniciados++;
    hueco.log.push(HORAS[0] && reloj() + ' · oferta enviada a ' + nom(cl) + ' (calce ' + c.c + '%) — 1 plantilla, ' + CLP(TARIFA_UTIL));
    pintaChat(); pintaKpis(); pintaRescates();
    tic(hueco);
  }

  function tic(hueco) {
    if (hueco.estado !== 'buscando') return;
    luego(LENTO ? 0 : 700, function () {
      if (hueco.estado !== 'buscando') return;
      hueco.t++;
      S.min++;
      var c = hueco.cands[hueco.idx];
      var cli = c.e.cli, per = CLI[cli];
      if (per.r !== 'nocontesta' && hueco.t >= per.d) {
        if (per.r === 'acepta') return acepta(hueco, c);
        return rechaza(hueco, c);
      }
      if (hueco.t >= S.ventana) {
        c.estado = 'vencio';
        hueco.log.push(reloj() + ' · ' + nom(cli) + ' no contestó en ' + S.ventana + ' min. Pasamos al siguiente.');
        delete S.ofertas[cli];
        hueco.idx++;
        pintaRescates(); pintaReloj(); pintaChat();
        if (hueco.idx < hueco.cands.length) return ofrecer(hueco);
        hueco.estado = 'fallido';
        hueco.log.push('Se acabaron los candidatos. El hueco queda abierto.');
        pintaRescates();
        return;
      }
      pintaRescates(); pintaReloj();
      tic(hueco);
    });
  }

  function acepta(hueco, c) {
    var cli = c.e.cli;
    c.estado = 'acepto';
    hueco.estado = 'ok';
    delete S.ofertas[cli];
    hilo(cli).push({ l:'in', t:'la tomo!! 🔥', h: reloj() });
    var srv = SERV[hueco.srv], pro = PROS.filter(function (p) { return p.k === hueco.pro; })[0].n;
    dice(cli, 'Hecho ✅\n\n' + (hueco.dia === 'sab' ? 'Hoy' : DIAS.filter(function(d){return d.k===hueco.dia;})[0].l) +
      ' · ' + HORAS[hueco.h] + '\n' + srv.n + ' con ' + pro + ' · ' + CLP(srv.p) +
      '\nIrarrázaval 3410, Ñuñoa. Nos vemos.');
    S.kpi.contestados++;
    S.kpi.rescatado += srv.p;
    // reemplaza la reserva cancelada
    var r = S.reservas.filter(function (x) { return x.id === hueco.res; })[0];
    if (r) { r.cli = cli; r.estado = 'rescatada'; }
    S.espera = S.espera.filter(function (e) { return e.id !== c.e.id; });
    hueco.log.push(reloj() + ' · ' + nom(cli) + ' aceptó. Hueco zurcido en ' + hueco.t + ' min. Recuperado: ' + CLP(srv.p) + '.');
    pintaTodo();
    var pip = document.getElementById('pip-resc');
    pip.dataset.n = S.huecos.filter(function (h) { return h.estado === 'ok'; }).length;
    pip.textContent = pip.dataset.n;
  }

  function rechaza(hueco, c) {
    var cli = c.e.cli;
    c.estado = 'rechazo';
    hilo(cli).push({ l:'in', t:'uf no puedo, justo tengo pega 😖', h: reloj() });
    dice(cli, 'Sin problema. Te dejo en la lista y te aviso apenas se suelte otra.');
    S.kpi.contestados++;
    delete S.ofertas[cli];
    hueco.log.push(reloj() + ' · ' + nom(cli) + ' dijo que no. Pasamos al siguiente.');
    hueco.idx++;
    pintaChat(); pintaKpis(); pintaRescates();
    if (hueco.idx < hueco.cands.length) return ofrecer(hueco);
    hueco.estado = 'fallido';
    hueco.log.push('Se acabaron los candidatos. El hueco queda abierto.');
    pintaRescates();
  }

  function pintaRescates() {
    var cont = $('#rs-lista');
    if (!S.huecos.length) {
      cont.innerHTML = '<p style="color: var(--tinta-suave); font-size:.9rem;">No hay huecos abiertos. Cancela una hora en la Agenda y el motor se enciende solo.</p>';
    } else {
      cont.innerHTML = S.huecos.map(function (h) {
        var srv = SERV[h.srv], pro = PROS.filter(function (p) { return p.k === h.pro; })[0].n;
        var cls = h.estado === 'ok' ? 'rescate--ok' : (h.estado === 'fallido' ? 'rescate--fallido' : 'rescate--activo');
        var tag = h.estado === 'ok' ? '<span class="tag tag--sello">Zurcido</span>'
          : h.estado === 'fallido' ? '<span class="tag tag--ladrillo">Sin rescate</span>'
          : '<span class="tag tag--ambar">Ofreciendo…</span>';
        var cands = h.cands.map(function (c) {
          var pct = c.estado === 'espera' ? Math.min(100, Math.round(h.t / S.ventana * 100)) : (c.estado === 'cola' ? 0 : 100);
          var et = { cola:'En cola', espera:'Esperando respuesta · ' + h.t + '/' + S.ventana + ' min', acepto:'Aceptó', rechazo:'Dijo que no', vencio:'No contestó' }[c.estado];
          return '<div class="cand" data-s="' + c.estado + '">' +
            '<span class="cand__n">' + esc(nom(c.e.cli)) + '<small>' + SERV[c.e.srv].n + ' · espera hace ' + c.e.dias + ' d · ' + et + '</small></span>' +
            '<span class="tag ' + (c.c >= 80 ? 'tag--sello' : 'tag--tinta') + '">calce ' + c.c + '%</span>' +
            (c.estado === 'espera' ? '<span class="barra"><i style="width:' + pct + '%"></i></span>' : '') +
            '</div>';
        }).join('');
        return '<div class="rescate ' + cls + '">' +
          '<div class="rescate__cab"><span><b>' + (h.dia === 'sab' ? 'Hoy' : DIAS.filter(function(d){return d.k===h.dia;})[0].l) + ' · ' + HORAS[h.h] + '</b>' +
          '<small>' + srv.n + ' con ' + pro + ' · ' + CLP(srv.p) + ' en juego</small></span>' + tag + '</div>' +
          (cands || '<div class="cand"><span class="cand__n">Nadie calza con este hueco.</span></div>') +
          '<div style="padding:9px 12px; background: var(--papel-hondo); border-top:1px solid var(--pauta); font-family: var(--mono); font-size:.68rem; color: var(--tinta-suave); line-height:1.6;">' +
          h.log.map(esc).join('<br>') + '</div>' +
          '</div>';
      }).join('');
    }
    var ok = S.huecos.filter(function (h) { return h.estado === 'ok'; }).length;
    var cerrados = S.huecos.filter(function (h) { return h.estado !== 'buscando'; }).length;
    $('#rs-tasa').textContent = cerrados ? 'Tasa de rescate ' + Math.round(ok / cerrados * 100) + '%' : 'Sin huecos';

    // lista de espera
    $('#es-n').textContent = S.espera.length + ' esperando';
    $('#es-lista').innerHTML = S.espera.length ? S.espera.map(function (e) {
      var pref = { manana:'prefiere la mañana', tarde:'prefiere la tarde', cualquiera:'le da lo mismo' }[e.pref];
      return '<div class="espera__it"><span><b>' + esc(nom(e.cli)) + '</b>' +
        '<small>' + SERV[e.srv].n + ' · ' + pref + ' · espera hace ' + e.dias + ' d</small></span>' +
        '<span class="tag tag--tinta">' + CLP(SERV[e.srv].p) + '</span></div>';
    }).join('') : '<p style="color: var(--tinta-suave); font-size:.88rem;">La lista está vacía. Agrega a alguien abajo, o escribe "avísame si se desocupa algo" desde el WhatsApp.</p>';
  }

  /* ---------- ajustes ---------- */
  function pintaAjustes() {
    $('#aj-agente').innerHTML =
      grupo('Modo del agente', 'Copiloto: el agente redacta y tu recepción aprieta enviar. Empieza por acá las primeras dos semanas.', 'modo',
        [['auto','Automático'],['copiloto','Copiloto'],['pausado','Pausado']], S.modo) +
      grupo('Tono', 'Cercano tutea y usa emojis, como habla el barrio. Formal habla de usted. Cambia lo que escribe el agente, de verdad.', 'tono',
        [['cercano','Cercano'],['formal','Formal']], S.tono);

    $('#aj-reglas').innerHTML =
      grupo('Recordatorio 24 h antes', 'Una plantilla de utilidad por reserva. Es el costo más grande que le pagas a Meta.', 'rec24',
        [[true,'Sí'],[false,'No']], S.rec24) +
      grupo('Segundo recordatorio 3 h antes', 'Sólo a los clientes con score de no-show alto (30% de las reservas).', 'rec3',
        [[true,'Sí'],[false,'No']], S.rec3) +
      grupo('Rescate preventivo', 'Si a mediodía alguien de riesgo alto no confirmó, el agente le pregunta de frente y libera el cupo ANTES de que se caiga. Apágalo y mira lo que pasa a las 16:00.', 'preventivo',
        [[true,'Sí'],[false,'No']], S.preventivo) +
      grupo('Candidatos por hueco', 'A cuántos de la lista de espera se les ofrece, en orden de calce, uno tras otro.', 'candidatos',
        [[1,'1'],[3,'3'],[5,'5']], S.candidatos) +
      grupo('Ventana de la oferta', 'Cuántos minutos le guardas la hora antes de pasar al siguiente.', 'ventana',
        [[5,'5 min'],[8,'8 min'],[15,'15 min']], S.ventana);

    pintaCosto();
  }

  function grupo(titulo, sub, campo, ops, val) {
    return '<div class="ajuste"><span class="ajuste__txt"><b>' + titulo + '</b><small>' + sub + '</small></span>' +
      '<span class="ajuste__ctl">' + ops.map(function (o) {
        return '<button data-set="' + campo + '" data-val="' + o[0] + '" aria-pressed="' + (String(o[0]) === String(val)) + '">' + o[1] + '</button>';
      }).join('') + '</span></div>';
  }

  function pintaCosto() {
    var reservas = 420, huecos = 50, react = 60;
    var u1 = S.rec24 ? reservas : 0;
    var u2 = S.rec3 ? Math.round(reservas * 0.30) : 0;
    var u3 = huecos * S.candidatos;
    var u4 = S.preventivo ? 30 : 0;
    var util = u1 + u2 + u3 + u4;
    var costo = util * TARIFA_UTIL + react * TARIFA_MKT;
    var incluido = 1500;
    var exceso = Math.max(0, (util + react) - incluido);
    var lineas = [
      'Un local promedio: 420 reservas/mes, 50 huecos/mes.',
      '',
      'Recordatorio 24 h        ' + pad(u1) + ' msj × $17,3  = ' + pad(CLP(u1 * TARIFA_UTIL), 10),
      'Recordatorio 3 h (riesgo)' + pad(u2) + ' msj × $17,3  = ' + pad(CLP(u2 * TARIFA_UTIL), 10),
      'Ofertas de rescate       ' + pad(u3) + ' msj × $17,3  = ' + pad(CLP(u3 * TARIFA_UTIL), 10),
      'Preguntas preventivas    ' + pad(u4) + ' msj × $17,3  = ' + pad(CLP(u4 * TARIFA_UTIL), 10),
      'Reactivación (marketing) ' + pad(react) + ' msj × $56,6  = ' + pad(CLP(react * TARIFA_MKT), 10),
      '                         ─────────────────────────────',
      'COSTO META / MES         <b>' + pad(util + react) + ' msj</b>          <b>' + pad(CLP(costo), 10) + '</b>',
      'Tu plan Local incluye    ' + pad(incluido) + ' msj',
      exceso
        ? '<span class="mal">Te pasas por ' + exceso + ' msj → ' + CLP(exceso * 19) + ' extra en la boleta.</span>'
        : '<span class="bien">Dentro del plan. No pagas excedente.</span>',
      '',
      'Margen bruto del plan Local ($79.000):',
      '  − Meta            ' + pad(CLP(Math.min(costo, incluido * 19)), 10),
      '  − IA (Claude)     ' + pad(CLP(9821), 10),
      '  − infra           ' + pad(CLP(2700), 10),
      '  ────────────────────────────',
      '  <b>margen bruto      ' + pad(Math.round((79000 - Math.min(costo, incluido * 19) - 9821 - 2700) / 79000 * 100) + '%', 10) + '</b>'
    ];
    $('#aj-costo').innerHTML = lineas.join('\n');
  }
  function pad(v, n) { v = String(v); n = n || 6; while (v.length < n) v = ' ' + v; return v; }

  /* ------------------------------ el reloj ------------------------------ */
  function avanzar(mins) {
    var fin = S.min + mins;
    while (S.min < fin) {
      S.min += 5;
      eventos();
    }
    if (S.min > 20 * 60) S.min = 20 * 60;
    pintaTodo();
  }

  function eventos() {
    // 09:00 — recordatorios del día
    if (!S.hitos.rec && S.min >= 9 * 60 && S.rec24) {
      S.hitos.rec = true;
      var hoy = S.reservas.filter(function (r) { return r.dia === 'sab' && r.estado === 'ok'; });
      hoy.forEach(function (r) {
        S.kpi.iniciados++;
        var esRiesgo = (CLI[r.cli].ns || 0) >= 1;
        if (esRiesgo) {
          r.estado = 'riesgo';
          dice(r.cli, 'Hola ' + nom(r.cli).split(' ')[0] + ', te recuerdo tu hora de hoy a las ' + HORAS[r.h] + ' (' + SERV[r.srv].n + '). ¿Me confirmas? Responde SÍ o NO PUEDO.');
        } else {
          r.estado = 'confirmada';
        }
      });
    }
    // 12:00 — rescate preventivo sobre los que no confirmaron
    if (!S.hitos.prev && S.min >= 12 * 60 && S.preventivo) {
      S.hitos.prev = true;
      var riesgo = S.reservas.filter(function (r) { return r.dia === 'sab' && r.estado === 'riesgo' && (9 + r.h) * 60 > S.min; });
      riesgo.forEach(function (r) {
        S.kpi.iniciados++;
        dice(r.cli, nom(r.cli).split(' ')[0] + ', no me has confirmado la hora de las ' + HORAS[r.h] + '. Si no puedes, dime nomás y la libero sin costo — así se la doy a alguien que está esperando.');
        // el estado cambia YA: si no, el reloj podría marcarla no-show antes de que llegue la respuesta
        r.estado = 'cancelada';
        luego(900, function () {
          hilo(r.cli).push({ l:'in', t:'uf, la verdad no voy a poder 😔 perdón', h: reloj() });
          dice(r.cli, 'Tranquila, gracias por avisar. Te la cancelo sin costo.');
          S.kpi.contestados++;
          abrirHueco(r);
          pintaTodo();
        });
      });
    }
    // hora pasada sin confirmar → no-show
    S.reservas.forEach(function (r) {
      if (r.dia !== 'sab') return;
      if ((r.estado === 'ok' || r.estado === 'riesgo') && (9 + r.h) * 60 + 5 <= S.min) {
        r.estado = 'noshow';
        S.kpi.perdido += SERV[r.srv].p;
      }
    });
  }

  /* ------------------------------ el agente ------------------------------ */
  function limpia(t) {
    return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  function detectaServicio(t) {
    if (/mecha|highlight|balaya|balaia/.test(t)) return 'mechas';
    if (/color|tinte|tintura|raiz/.test(t)) return 'color';
    if (/barba|barber/.test(t)) return 'barba';
    if (/manicu|uña|una|esmalt/.test(t)) return 'mani';
    if (/brushing|secado|alisad/.test(t)) return 'brush';
    if (/corte|cortar|pelo|puntas/.test(t)) return 'corte';
    return null;
  }
  function detectaDia(t) {
    if (/hoy/.test(t)) return 'sab';
    if (/sabado|sab\b|18/.test(t)) return 'sab';
    if (/lunes|lun\b|20/.test(t)) return 'lun';
    if (/martes|mar\b|21/.test(t)) return 'mar';
    if (/miercoles|mie\b|22/.test(t)) return 'mie';
    if (/jueves|jue\b|23/.test(t)) return 'jue';
    return null;
  }

  function agente(c, raw) {
    var t = limpia(raw);
    var cv = S.conv[c] = S.conv[c] || {};
    var yo = nom(c).split(' ')[0];
    var usted = S.tono === 'formal';

    // ¿hay una oferta de rescate pendiente para esta persona?
    if (S.ofertas[c]) {
      var h = S.ofertas[c];
      var cand = h.cands[h.idx];
      if (/la tomo|si|dale|quiero|me sirve|ya|obvio|dale nomas/.test(t)) { acepta(h, cand); return; }
      if (/no|no puedo|paso|otra vez/.test(t)) { rechaza(h, cand); return; }
    }

    // confirmar
    var r = reservaDe(c);
    if (/^si$|confirmo|confirmado|ahi estare|ahi voy|dale|voy/.test(t) && r && (r.estado === 'ok' || r.estado === 'riesgo')) {
      r.estado = 'confirmada';
      responde(c, usted
        ? 'Confirmada, ' + yo + '. La esperamos el ' + (r.dia === 'sab' ? 'sábado' : DIAS.filter(function(d){return d.k===r.dia;})[0].l) + ' a las ' + HORAS[r.h] + '.'
        : 'Listo ' + yo + ', quedó confirmada ✅ Te esperamos ' + (r.dia === 'sab' ? 'hoy' : 'el ' + DIAS.filter(function(d){return d.k===r.dia;})[0].l) + ' a las ' + HORAS[r.h] + '.');
      pintaAgenda();
      return;
    }

    // cancelar
    if (/cancel|no voy a poder|no puedo ir|anular|no voy a ir|me surgio|se me complic/.test(t)) {
      if (!r) { responde(c, 'No te encuentro una hora agendada, ' + yo + '. ¿Me confirmas el día?'); return; }
      r.estado = 'cancelada';
      responde(c, usted
        ? 'Cancelada sin costo, ' + yo + '. ¿Le busco otra hora?'
        : 'Qué lata, ' + yo + '. Te la cancelo sin costo, avisaste con tiempo. ¿Te busco otra?');
      luego(1500, function () { abrirHueco(r); pintaTodo(); });
      pintaAgenda();
      return;
    }

    // reagendar
    if (/cambiar|correr|reagend|mover|otra hora|mas tarde|mas temprano/.test(t)) {
      if (!r) { responde(c, 'No te veo una hora tomada. ¿Quieres que te agende una?'); cv.esperando = 'servicio'; return; }
      var op = libres(r.dia, r.srv, 3);
      if (!op.length) { responde(c, 'Ese día ya no me queda nada, ' + yo + '. ¿Te sirve otro día?'); cv.esperando = 'dia'; cv.srv = r.srv; return; }
      cv.esperando = 'eleccion'; cv.op = op; cv.srv = r.srv; cv.reagenda = r.id;
      responde(c, 'Te muevo la hora, ' + yo + '. Me quedan:\n\n' + op.map(function (o, i) {
        return (i + 1) + ') ' + HORAS[o.h] + ' con ' + PROS.filter(function (p) { return p.k === o.pro; })[0].n;
      }).join('\n') + '\n\nRespóndeme con el número.');
      return;
    }

    // elección de hora
    if (cv.esperando === 'eleccion') {
      var m = t.match(/[1-3]/);
      if (m) {
        var o = cv.op[parseInt(m[0], 10) - 1];
        if (o) {
          if (cv.reagenda) {
            var vieja = S.reservas.filter(function (x) { return x.id === cv.reagenda; })[0];
            vieja.estado = 'cancelada';
            luego(1500, function () { abrirHueco(vieja); pintaTodo(); });
          }
          var nueva = { id: 'r' + Date.now(), dia: o.dia, pro: o.pro, h: o.h, srv: cv.srv, cli: c, estado: 'ok' };
          S.reservas.push(nueva);
          var s = SERV[cv.srv], prn = PROS.filter(function (p) { return p.k === o.pro; })[0].n;
          var dl = DIAS.filter(function (d) { return d.k === o.dia; })[0].l;
          responde(c, usted
            ? 'Agendada: ' + dl + ' a las ' + HORAS[o.h] + ', ' + s.n + ' con ' + prn + '. ' + CLP(s.p) + '. Le enviaré un recordatorio.'
            : 'Listo, quedaste agendada 📌\n\n' + dl + ' · ' + HORAS[o.h] + '\n' + s.n + ' con ' + prn + '\n' + CLP(s.p) + ' · ' + (s.min / 60) + (s.min > 60 ? ' horas' : ' hora') + '\n\nTe mando un recordatorio para confirmar. Cualquier cosa me escribes por acá.');
          S.conv[c] = {};
          pintaAgenda();
          return;
        }
      }
      responde(c, 'No te cacho el número, ' + yo + '. Respóndeme 1, 2 o 3.');
      return;
    }

    // pedir hora
    var srv = detectaServicio(t);
    var dia = detectaDia(t);
    if (srv) cv.srv = srv;
    if (dia) cv.dia = dia;

    if (/hora|reserva|agend|cupo|disponib|tienen|espacio|atienden/.test(t) || srv || (cv.esperando && cv.esperando !== 'eleccion')) {
      if (/precio|cuanto|vale|cuesta|valor/.test(t) && cv.srv) {
        responde(c, SERV[cv.srv].n + ' sale ' + CLP(SERV[cv.srv].p) + ' y toma ' + (SERV[cv.srv].min / 60) + (SERV[cv.srv].min > 60 ? ' horas' : ' hora') + '. ¿Te agendo?');
        cv.esperando = 'dia';
        return;
      }
      if (!cv.srv) {
        cv.esperando = 'servicio';
        responde(c, usted
          ? 'Con gusto. ¿Qué servicio necesita? Corte, corte + barba, color + corte, mechas, manicure o brushing.'
          : 'Dale ' + yo + ' 👋 ¿Qué te vas a hacer? Corte, corte + barba, color + corte, mechas, manicure o brushing.');
        return;
      }
      if (!cv.dia) {
        cv.esperando = 'dia';
        responde(c, SERV[cv.srv].n + ' toma ' + (SERV[cv.srv].min / 60) + (SERV[cv.srv].min > 60 ? ' horas' : ' hora') + ' y sale ' + CLP(SERV[cv.srv].p) + '. ¿Para qué día? Tengo sábado 18, lunes 20, martes 21, miércoles 22 o jueves 23.');
        return;
      }
      var ops = libres(cv.dia, cv.srv, 3);
      if (!ops.length) {
        cv.dia = null; cv.esperando = 'dia';
        responde(c, 'Ese día ya no me queda nada para ' + SERV[cv.srv].n.toLowerCase() + ', ' + yo + '. ¿Te sirve otro día? También te puedo dejar en la lista de espera y te aviso apenas se suelte algo.');
        return;
      }
      cv.esperando = 'eleccion'; cv.op = ops; delete cv.reagenda;
      responde(c, 'Para ' + DIAS.filter(function (d) { return d.k === cv.dia; })[0].l + ' me quedan:\n\n' +
        ops.map(function (o, i) { return (i + 1) + ') ' + HORAS[o.h] + ' con ' + PROS.filter(function (p) { return p.k === o.pro; })[0].n; }).join('\n') +
        '\n\nRespóndeme con el número y te la dejo tomada.');
      return;
    }

    // lista de espera
    if (/avisa|lista de espera|se desocupa|se suelta|si alguien cancela|cualquier cosa/.test(t)) {
      var sv = cv.srv || 'corte';
      if (!S.espera.some(function (e) { return e.cli === c; })) {
        S.espera.push({ id: 'e' + Date.now(), cli: c, srv: sv, pref: 'cualquiera', dias: 0 });
      }
      responde(c, 'Te dejé en la lista de espera para ' + SERV[sv].n.toLowerCase() + ', ' + yo + '. Apenas se suelte una hora te escribo yo — no tienes que estar preguntando.');
      pintaRescates();
      return;
    }

    // precio
    if (/precio|cuanto|vale|cuesta|valor|tarifa/.test(t)) {
      responde(c, 'Te dejo la lista:\n\n' + Object.keys(SERV).map(function (k) {
        return '· ' + SERV[k].n + ' — ' + CLP(SERV[k].p);
      }).join('\n') + '\n\n¿Te agendo alguno?');
      return;
    }

    // dirección / horario
    if (/donde|direcc|ubicad|llegar|estacion|metro/.test(t)) {
      responde(c, 'Estamos en Av. Irarrázaval 3410, Ñuñoa — a tres cuadras del metro Chile España. Hay estacionamiento en la calle.');
      return;
    }
    if (/horario|abren|cierran|hasta que hora|domingo/.test(t)) {
      responde(c, 'Atendemos de lunes a sábado, de 09:00 a 20:00. Domingo cerramos. ¿Te agendo algo?');
      return;
    }

    // saludo
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|holi|que tal)/.test(t)) {
      responde(c, usted
        ? 'Hola ' + yo + ', buenas. ¿En qué le puedo ayudar?'
        : 'Hola ' + yo + ' 👋 ¿Qué necesitas? Te puedo dar hora, cambiarla o cancelarla.');
      return;
    }

    // no entiendo → handoff (lo importante: no inventa)
    hilo(c).push({ l:'sys', t:'Escalado a la recepción · el agente no entendió' });
    responde(c, usted
      ? 'Prefiero no responderle algo incorrecto. Le paso el mensaje a Marisol y le contesta apenas pueda.'
      : 'Esa no la sé, ' + yo + ', y prefiero no inventarte nada. Le paso el mensaje a Marisol y te responde apenas pueda.');
  }

  /* ------------------------------ eventos DOM ------------------------------ */
  function tab(k) {
    document.querySelectorAll('#tabs button').forEach(function (b) {
      b.setAttribute('aria-selected', b.dataset.tab === k ? 'true' : 'false');
    });
    ['chat','agenda','rescates','ajustes'].forEach(function (p) {
      var el = document.getElementById('p-' + p);
      el.dataset.on = (p === k) ? 'true' : 'false';
    });
    if (k !== 'chat') window.scrollTo({ top: 0, behavior: LENTO ? 'auto' : 'smooth' });
  }

  $('#tabs').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-tab]');
    if (b) tab(b.dataset.tab);
  });

  $('#wa-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var i = $('#wa-input'), v = i.value.trim();
    if (!v) return;
    hilo(S.activo).push({ l:'in', t: v, h: reloj() });
    i.value = '';
    pintaChat();
    agente(S.activo, v);
  });

  $('#wa-rapidas').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-q]');
    if (!b) return;
    var v = b.dataset.q;
    hilo(S.activo).push({ l:'in', t: v, h: reloj() });
    pintaChat();
    agente(S.activo, v);
  });

  $('#wa-contactos').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-c]');
    if (!b) return;
    S.activo = b.dataset.c;
    pintaChat();
  });

  $('#wa-hilo').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-enviar]');
    if (!b) return;
    var H = hilo(S.activo);
    for (var i = H.length - 1; i >= 0; i--) {
      if (H[i].draft) { var txt = H[i].draft; H.splice(i, 1); dice(S.activo, txt); S.kpi.contestados++; break; }
    }
    pintaChat(); pintaKpis();
  });

  $('#ag-dias').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-d]'); if (!b) return;
    S.vistaDia = b.dataset.d; S.abierto = null; pintaAgenda();
  });
  $('#ag-pros').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-p]'); if (!b) return;
    S.vistaPro = b.dataset.p; S.abierto = null; pintaAgenda();
  });

  $('#ag-reja').addEventListener('click', function (e) {
    var a = e.target.closest('button[data-a]');
    if (a) {
      var r = S.reservas.filter(function (x) { return x.id === a.dataset.r; })[0];
      if (a.dataset.a === 'cerrar') { S.abierto = null; pintaAgenda(); return; }
      if (!r) return;
      if (a.dataset.a === 'conf') { r.estado = 'confirmada'; S.abierto = null; }
      if (a.dataset.a === 'noshow') { r.estado = 'noshow'; S.kpi.perdido += SERV[r.srv].p; S.abierto = null; }
      if (a.dataset.a === 'cancel') {
        r.estado = 'cancelada'; S.abierto = null;
        dice(r.cli, 'Hola ' + nom(r.cli).split(' ')[0] + ', tuvimos que cancelar tu hora de las ' + HORAS[r.h] + '. Te pido mil disculpas. ¿Te busco otra?');
        S.kpi.iniciados++;
        abrirHueco(r);
        tab('rescates');
      }
      pintaTodo();
      return;
    }
    var b = e.target.closest('button[data-r]');
    if (b) { S.abierto = (S.abierto === b.dataset.r) ? null : b.dataset.r; pintaAgenda(); }
  });

  $('#es-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var n = $('#es-nombre').value.trim();
    if (!n) return;
    var k = 'x' + Date.now();
    CLI[k] = { n: n, t: '+56 9 ' + (1000 + Math.floor(Math.random() * 8999)) + ' ' + (1000 + Math.floor(Math.random() * 8999)), v: 1, ns: 0, r: 'acepta', d: 3 };
    S.espera.push({ id: 'e' + Date.now(), cli: k, srv: $('#es-serv').value, pref: $('#es-pref').value, dias: 0 });
    $('#es-nombre').value = '';
    pintaRescates();
  });

  $('#p-ajustes').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-set]');
    if (!b) return;
    var v = b.dataset.val;
    if (v === 'true') v = true; else if (v === 'false') v = false;
    else if (/^\d+$/.test(v)) v = parseInt(v, 10);
    S[b.dataset.set] = v;
    pintaAjustes(); pintaChat(); pintaKpis();
  });

  $('#aj-reset').addEventListener('click', function () { reset(); tab('chat'); });
  $('#rj-30').addEventListener('click', function () { avanzar(30); });
  $('#rj-dia-btn').addEventListener('click', function correDia() {
    function paso() {
      if (S.min >= 20 * 60) return;
      avanzar(30);
      luego(LENTO ? 0 : 320, paso);
    }
    paso();
  });

  window.addEventListener('resize', function () { pintaAgenda(); });

  /* ------------------------------ arranque ------------------------------ */
  $('#es-serv').innerHTML = Object.keys(SERV).map(function (k) {
    return '<option value="' + k + '">' + SERV[k].n + '</option>';
  }).join('');
  reset();
})();
