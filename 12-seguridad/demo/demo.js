/* CUASIO · demo — estado en el cliente, cero backend.
   El flujo completo de negocio: capturar en terreno sin señal → sincronizar →
   triage → patrón cruzado → investigación → reporte. Todo lo que se toca, responde. */

(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ───────────────────────── DATOS MOCK ───────────────────────── */

  var LUGARES = [
    { n: 'Rampa 7', tag: 'tu turno' },
    { n: 'Ruta acarreo R-2', tag: 'tu turno' },
    { n: 'Botadero Norte', tag: 'tu turno' },
    { n: 'Frente carguío 4', tag: '' },
    { n: 'Chancado primario', tag: '' },
    { n: 'Taller de mantención', tag: '' },
    { n: 'Polvorín', tag: '' },
    { n: 'Otro lugar', tag: '' }
  ];

  // Los 7 de la Rampa 7 — coordenadas del scatter (viewBox 400×300)
  var RAMPA7 = [
    { x: 46,    y: 211.1, f: '18 abr · 19:52', q: 'M. Ibáñez · Op. CAEX',        t: 'Salí del cruce y venía una camioneta subiendo pegada al talud. No la vi. Alcancé a frenar.' },
    { x: 91.4,  y: 213.1, f: '29 abr · 20:05', q: 'R. Peñailillo · Mantenedor',  t: 'Iba bajando en la camioneta y me encontré un CAEX cargado en la curva. No se veía nada por el polvo.' },
    { x: 124.4, y: 210.2, f: '7 may · 19:47',  q: 'J. Colil · Op. CAEX',         t: 'Casi me llevo una camioneta detenida sin baliza en la berma. El regador no había pasado.' },
    { x: 182.1, y: 214.0, f: '21 may · 20:11', q: 'C. Vergara · Supervisora',    t: 'Subiendo al relevo tuve que meterme a la cuneta para que pasara el CAEX. Polvo total, cero visibilidad.' },
    { x: 235.7, y: 212.0, f: '3 jun · 19:58',  q: 'M. Ibáñez · Op. CAEX',        t: 'Otra vez lo mismo del cruce. Ya van dos veces que reporto y sigue igual.' },
    { x: 301.7, y: 215.1, f: '19 jun · 20:18', q: 'N. Quilodrán · Op. W. Dozer', t: 'Una camioneta se me cruzó por el lado ciego. Íbamos los dos al relevo, nadie mira.' },
    { x: 355.3, y: 209.3, f: '2 jul · 19:41',  q: 'F. Painemal · Op. CAEX',      t: 'Freno de emergencia. Camioneta de supervisión adelantando por la derecha. No la vi hasta encima.' }
  ];

  var NUM = { 7: 'Siete', 8: 'Ocho', 9: 'Nueve', 10: 'Diez' };

  // Pasadas del regador por hora (06:00 → 23:00)
  var REGADOR = [1.6, 1.5, 1.6, 1.5, 1.6, 1.4, 0.9, 1.5, 1.6, 1.5, 1.5, 1.4, 1.3, 0.6, 0.2, 1.2, 1.5, 1.4];

  var BANDEJA = [
    { folio: 'R-2026-0847', hora: '2 jul · 19:41', lugar: 'Rampa 7', tipo: 'Casi-accidente', pot: 'Podía matar', quien: 'F. Painemal · Op. CAEX',
      txt: 'Freno de emergencia. Camioneta de supervisión adelantando por la derecha. No la vi hasta encima.',
      energia: 'Vehículo en movimiento', cc: 'Segregación equipo liviano / pesado', cruce: 6 },
    { folio: 'R-2026-0846', hora: '1 jul · 14:22', lugar: 'Chancado primario', tipo: 'Condición insegura', pot: 'Podía lesionar grave', quien: 'R. Peñailillo · Mantenedor',
      txt: 'El resguardo de la correa CV-02 está suelto, se ve el rodillo girando.',
      energia: 'Mecánica / atrapamiento', cc: 'Resguardo de partes móviles', cruce: 3 },
    { folio: 'R-2026-0845', hora: '30 jun · 08:05', lugar: 'Taller de mantención', tipo: 'Acto inseguro', pot: 'Podía matar', quien: 'C. Vergara · Supervisora',
      txt: 'Un mecánico se metió abajo del camión sin el bloqueo puesto. Lo saqué yo.',
      energia: 'Energía almacenada / LOTO', cc: 'Bloqueo y tarjeteo', cruce: 2 },
    { folio: 'R-2026-0844', hora: '29 jun · 21:40', lugar: 'Botadero Norte', tipo: 'Casi-accidente', pot: 'Podía matar', quien: 'Reporte anónimo',
      txt: 'La berma del botadero está más baja que la rueda. De noche no se ve dónde termina.',
      energia: 'Gravedad / caída de altura', cc: 'Berma perimetral', cruce: 1 },
    { folio: 'R-2026-0843', hora: '28 jun · 11:12', lugar: 'Ruta acarreo R-2', tipo: 'Condición insegura', pot: 'Sin potencial grave', quien: 'J. Colil · Op. CAEX',
      txt: 'Hay un bache grande a la salida de la curva, salta la carga.',
      energia: 'Mecánica', cc: '—', cruce: 0 },
    { folio: 'R-2026-0842', hora: '25 jun · 16:30', lugar: 'Frente carguío 4', tipo: 'Casi-accidente', pot: 'Podía lesionar grave', quien: 'Reporte anónimo',
      txt: 'Se soltó una piedra del banco justo al lado de la pala. No le pegó a nadie de milagro.',
      energia: 'Gravedad / caída de rocas', cc: 'Control de talud', cruce: 1 },
    { folio: 'R-2026-0841', hora: '23 jun · 07:45', lugar: 'Polvorín', tipo: 'Condición insegura', pot: 'Podía matar', quien: 'M. Ibáñez · Op. CAEX',
      txt: 'La puerta del polvorín quedó sin candado el fin de semana.',
      energia: 'Explosivos', cc: 'Custodia de explosivos', cruce: 0 },
    { folio: 'R-2026-0839', hora: '21 jun · 13:05', lugar: 'Taller de mantención', tipo: 'Casi-accidente', pot: 'Podía lesionar grave', quien: 'R. Peñailillo · Mantenedor',
      txt: 'Se cayó una llave de tres kilos desde la pasarela. Abajo pasaba gente.',
      energia: 'Gravedad / caída de objetos', cc: 'Objetos en altura', cruce: 2 },
    { folio: 'R-2026-0838', hora: '19 jun · 20:18', lugar: 'Rampa 7', tipo: 'Casi-accidente', pot: 'Podía matar', quien: 'N. Quilodrán · Op. W. Dozer',
      txt: 'Una camioneta se me cruzó por el lado ciego. Íbamos los dos al relevo, nadie mira.',
      energia: 'Vehículo en movimiento', cc: 'Segregación equipo liviano / pesado', cruce: 6 }
  ];

  var CC = [
    { n: 'Segregación de equipo liviano y pesado en ruta de acarreo', resp: 'Jefe de turno', frec: 'Por turno', ult: 'hace 34 días', pct: 12, est: 'vencido',
      det: 'Baliza encendida, radio en canal 3 y distancia mínima de 50 m entre camioneta y CAEX. Es el control que impide la colisión que mata. La verificación se dejó de hacer y nadie la exigió.' },
    { n: 'Berma perimetral en botadero y borde de banco', resp: 'Supervisor de operaciones', frec: 'Diaria', ult: 'hoy 06:10', pct: 96, est: 'operativo',
      det: 'Altura mínima de la berma: media rueda del equipo mayor que circula. Impide la caída del equipo por el borde.' },
    { n: 'Bloqueo y tarjeteo (LOTO) antes de intervenir equipo', resp: 'Mantenedor a cargo', frec: 'Por tarea', ult: 'hoy 09:20', pct: 88, est: 'operativo',
      det: 'Nadie se mete abajo de un equipo sin bloqueo puesto y tarjeta con su nombre. Tres reportes recientes lo mencionan: vigilar.' },
    { n: 'Control de polvo en ruta (regado vigente < 40 min)', resp: 'Jefe de turno', frec: 'Por turno', ult: 'hoy 18:40', pct: 91, est: 'parcial',
      det: 'Cumple 91% del día. Entre las 19:00 y las 21:00 cae a 12%: el regador entra a relevo a la misma hora que operaciones. Ése es el agujero.' },
    { n: 'Check pre-uso del equipo firmado antes de operar', resp: 'Operador', frec: 'Por turno', ult: 'hoy 20:05', pct: 97, est: 'operativo',
      det: 'Frenos, dirección, luces, baliza, extintor. Firmado en la app antes de mover el equipo.' },
    { n: 'Custodia y transporte de explosivos', resp: 'Jefe de tronadura', frec: 'Por evento', ult: '11 jul', pct: 100, est: 'operativo',
      det: 'Polvorín cerrado, registro de entrada y salida, transporte con escolta. Un reporte abierto sobre el candado.' },
    { n: 'Resguardo de partes móviles en chancado', resp: 'Supervisor de planta', frec: 'Semanal', ult: 'hace 9 días', pct: 64, est: 'caido',
      det: 'El resguardo de la correa CV-02 está reportado suelto cuatro veces en seis semanas y sigue suelto. Control caído, no vencido: se sabe que está malo.' },
    { n: 'Estándar de tránsito y velocidad en rutas internas', resp: 'Supervisor de operaciones', frec: 'Mensual', ult: '2 jul', pct: 79, est: 'operativo',
      det: 'Velocidad máxima, preferencia del equipo pesado, puntos de detención obligatoria.' }
  ];

  var CC_TURNO = [
    { n: 'Segregación de equipo liviano y pesado', d: 'Baliza encendida · canal 3 · 50 m de distancia' },
    { n: 'Berma perimetral a media rueda', d: 'En el botadero y en el borde de banco' },
    { n: 'Regado de la ruta vigente', d: 'Menos de 40 minutos desde la última pasada' },
    { n: 'Bloqueo y tarjeteo puesto', d: 'Antes de intervenir cualquier equipo' },
    { n: 'Check pre-uso del CAEX firmado', d: 'Frenos, dirección, luces, baliza, extintor' }
  ];

  var PORQUES = [
    ['¿Por qué casi chocan un CAEX y una camioneta en la Rampa 7?', 'Porque circulan por el mismo tramo, en sentidos opuestos, sin segregación efectiva.'],
    ['¿Por qué no hay segregación efectiva?', 'Porque el control existe en el estándar, pero su verificación está vencida hace 34 días y nadie la exigió.'],
    ['¿Por qué está vencida la verificación?', 'Porque el jefe de turno la llena en papel al final del turno, y en el cambio de turno no alcanza a hacerlo.'],
    ['¿Por qué siempre en el cambio de turno?', 'Porque en esa media hora coinciden las camionetas del turno entrante con los CAEX cargados del saliente — y el regador también está en relevo, así que la ruta lleva dos ciclos sin regar.'],
    ['¿Por qué nadie lo vio antes?', 'Porque los siete reportes existían, pero vivían en siete formularios distintos y nadie los cruzó. No falló la gente: falló el sistema de información.']
  ];

  var ACCIONES = [
    { t: 'Desfasar el relevo del camión regador 20 minutos: que riegue la R-2 entre 19:20 y 19:50, antes del relevo de operaciones.', r: 'Jorge Manríquez · Jefe de turno', p: '7 días', v: 'Se verifica con el dato de despacho, no con una firma.' },
    { t: 'Ventana de exclusión de equipo liviano en Rampa 7 entre 19:30 y 20:30, salvo autorización por radio canal 3.', r: 'Camila Vergara · Supervisora de operaciones', p: '3 días', v: 'Se verifica con el registro de tránsito.' },
    { t: 'Reactivar el control crítico de segregación con verificación obligatoria por turno en la app.', r: 'Paulina Toro · Prevención', p: '24 horas', v: 'Se verifica solo: si no se marca, se ve caído.' },
    { t: 'Iluminación y demarcación del cruce de Rampa 7: dos balizas fijas y línea reflectante.', r: 'Rodrigo Peñailillo · Mantención', p: '30 días', v: 'Se verifica en terreno con foto.' }
  ];

  /* ───────────────────────── ESTADO ───────────────────────── */

  var S = {
    rol: 'terreno',
    pantalla: 'home',
    online: false,
    cola: [
      { id: 'LOC-014', lugar: 'Botadero Norte', tipo: 'Condición insegura', pot: 'Podía lesionar grave', hora: 'hoy 14:02',
        txt: 'Falta señalética en el acceso al botadero. Los camiones entran a ciegas cuando hay polvo.',
        energia: 'Vehículo en movimiento', cc: 'Estándar de tránsito', quien: 'M. Ibáñez · Op. CAEX' },
      { id: 'LOC-013', lugar: 'Ruta acarreo R-2', tipo: 'Casi-accidente', pot: 'Podía matar', hora: 'hoy 09:40',
        txt: 'Un camión de terceros se metió a la ruta de acarreo sin baliza ni radio. Iba en contra.',
        energia: 'Vehículo en movimiento', cc: 'Segregación equipo liviano / pesado', quien: 'M. Ibáñez · Op. CAEX' }
    ],
    mios: [
      { id: 'LOC-014', lugar: 'Botadero Norte', tipo: 'Condición insegura', estado: 'cola', hora: 'hoy 14:02' },
      { id: 'LOC-013', lugar: 'Ruta acarreo R-2', tipo: 'Casi-accidente', estado: 'cola', hora: 'hoy 09:40' },
      { id: 'R-2026-0841', lugar: 'Polvorín', tipo: 'Condición insegura', estado: 'ok', hora: '23 jun' }
    ],
    bandeja: BANDEJA.slice(),
    rampa: RAMPA7.slice(),
    filtro: 'todos',
    borrador: { tipo: '', lugar: '', pot: '', txt: '', foto: false, anon: false },
    t0: 0, tick: null,
    folio: 848,
    patronVivo: true,
    ccTurno: {},
    accAceptadas: false
  };

  /* ───────────────────────── UTILES ───────────────────────── */

  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.hidden = true; }, 2600);
  }

  function svgIco(tipo) {
    if (tipo === 'critico') return '<svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true"><circle cx="5" cy="5" r="4" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="4.2" y="2.4" width="1.6" height="3.2" fill="currentColor"/><rect x="4.2" y="6.4" width="1.6" height="1.4" fill="currentColor"/></svg>';
    if (tipo === 'alto') return '<svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true"><path d="M5 1 L9 9 H1 Z" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';
    if (tipo === 'operativo') return '<svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true"><path d="M1.5 5.2 L4 7.6 L8.5 2.4" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
    if (tipo === 'ia') return '<svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true"><rect x="1.2" y="1.2" width="7.6" height="7.6" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M3.4 5h3.2M5 3.4v3.2" stroke="currentColor" stroke-width="1.2"/></svg>';
    return '<svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true"><circle cx="5" cy="5" r="3.4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
  }

  function chipPot(pot) {
    if (pot === 'Podía matar')          return '<span class="chip chip--critico">' + svgIco('critico') + ' Potencial fatal</span>';
    if (pot === 'Podía lesionar grave') return '<span class="chip chip--alto">' + svgIco('alto') + ' Potencial grave</span>';
    return '<span class="chip chip--pendiente">' + svgIco('') + ' Sin potencial grave</span>';
  }

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  /* ───────────────────────── NAV / ROLES ───────────────────────── */

  var nt = $('#navToggle'), nm = $('#navMenu');
  nt.addEventListener('click', function () {
    var a = nm.classList.toggle('abierto');
    nt.setAttribute('aria-expanded', a ? 'true' : 'false');
  });

  function setRol(r) {
    S.rol = r;
    $('#rolTerreno').setAttribute('aria-selected', r === 'terreno' ? 'true' : 'false');
    $('#rolOficina').setAttribute('aria-selected', r === 'oficina' ? 'true' : 'false');
    $('#vistaTerreno').hidden = r !== 'terreno';
    $('#vistaOficina').hidden = r !== 'oficina';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  $('#rolTerreno').addEventListener('click', function () { setRol('terreno'); });
  $('#rolOficina').addEventListener('click', function () { setRol('oficina'); });
  $('#btnReset').addEventListener('click', function () { location.reload(); });

  /* ───────────────────────── TERRENO ───────────────────────── */

  function ir(p) {
    S.pantalla = p;
    $$('.pantalla').forEach(function (el) { el.classList.toggle('activa', el.dataset.p === p); });
    if (p === 'tipo' && !S.tick) arrancarReloj();
    if (p === 'home') pararReloj();
    if (p === 'controles') pintarCCTurno();
  }

  function arrancarReloj() {
    S.t0 = Date.now();
    $('#reloj').hidden = false;
    S.tick = setInterval(function () {
      var s = Math.floor((Date.now() - S.t0) / 1000);
      $('#reloj').textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
    }, 250);
  }
  function pararReloj() {
    if (S.tick) { clearInterval(S.tick); S.tick = null; }
    $('#reloj').hidden = true;
  }
  function transcurrido() {
    var s = Math.max(1, Math.floor((Date.now() - S.t0) / 1000));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }

  $$('[data-ir]').forEach(function (b) {
    b.addEventListener('click', function () { ir(b.dataset.ir); });
  });

  // Señal
  $('#btnSenal').addEventListener('click', function () {
    S.online = !S.online;
    var b = $('#btnSenal');
    b.dataset.on = S.online ? '1' : '0';
    b.setAttribute('aria-pressed', S.online ? 'true' : 'false');
    $('#txtSenal').textContent = S.online ? 'Con señal' : 'Sin señal';
    var tacha = $('#tacha');
    if (tacha) tacha.style.display = S.online ? 'none' : '';
    if (S.online && S.cola.length) sincronizar();
  });

  function sincronizar() {
    var n = S.cola.length;
    toast('Sincronizando ' + n + ' reporte' + (n > 1 ? 's' : '') + '…');
    setTimeout(function () {
      var sumoRampa = false;
      S.cola.forEach(function (r) {
        var folio = 'R-2026-0' + (S.folio++);
        var mio = S.mios.filter(function (m) { return m.id === r.id; })[0];
        if (mio) { mio.id = folio; mio.estado = 'ok'; }
        S.bandeja.unshift({
          folio: folio, hora: r.hora, lugar: r.lugar, tipo: r.tipo, pot: r.pot,
          quien: r.anon ? 'Reporte anónimo' : (r.quien || 'M. Ibáñez · Op. CAEX'),
          txt: r.txt, energia: r.energia || 'Vehículo en movimiento',
          cc: r.cc || 'Segregación equipo liviano / pesado',
          cruce: r.lugar === 'Rampa 7' ? 7 : 1, nuevo: true
        });
        if (r.lugar === 'Rampa 7' && r.tipo === 'Casi-accidente') sumoRampa = true;
      });
      S.cola = [];
      if (sumoRampa) sumarAlPatron();
      pintarMios(); pintarCola(); pintarBandeja();
      toast(n + ' reporte' + (n > 1 ? 's' : '') + ' sincronizado' + (n > 1 ? 's' : '') + ' · Prevención ya los ve');
      if (S.pantalla === 'acuse') {
        $('#acuseCaja').classList.remove('acuse--cola');
        $('#acuseEstado').textContent = 'Sincronizado. Paulina Toro (Prevención) lo tiene en pantalla.';
      }
    }, 1200);
  }

  function sumarAlPatron() {
    S.rampa.push({ x: 378, y: 211.5, f: 'hoy · 19:55', q: 'M. Ibáñez · Op. CAEX', t: S.borrador.txt || 'Reporte nuevo en Rampa 7.', nuevo: true });
    pintarScatter();
    var n = S.rampa.length;
    $('#patronN').textContent = NUM[n] || n;
    $('#legN').textContent = n;
    $('#notaPatron').textContent = 'Tu reporte de recién entró al patrón. Ahora son ' + n + '. La confianza subió.';
    toast('Tu reporte entró al patrón de Rampa 7');
  }

  function pintarCola() {
    $('#colaN').textContent = S.cola.length;
  }

  function pintarMios() {
    $('#misReportes').innerHTML = S.mios.map(function (m) {
      var chip = m.estado === 'cola'
        ? '<span class="chip chip--alto">' + svgIco('alto') + ' En cola</span>'
        : '<span class="chip chip--operativo">' + svgIco('operativo') + ' Enviado</span>';
      return '<div class="mini"><div><b>' + esc(m.lugar) + '</b><small>' + esc(m.id) + ' · ' + esc(m.tipo) + ' · ' + esc(m.hora) + '</small></div>' + chip + '</div>';
    }).join('');
  }

  // Lugares
  $('#lugares').innerHTML = LUGARES.map(function (l) {
    return '<button class="btn-lugar" data-lugar="' + esc(l.n) + '" aria-pressed="false">' +
      (l.tag ? '<em>' + l.tag + '</em>' : '') + esc(l.n) + '</button>';
  }).join('');

  $$('[data-tipo]').forEach(function (b) {
    b.addEventListener('click', function () {
      S.borrador.tipo = b.dataset.tipo;
      $$('[data-tipo]').forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
      ir('lugar');
    });
  });
  $$('[data-lugar]').forEach(function (b) {
    b.addEventListener('click', function () {
      S.borrador.lugar = b.dataset.lugar;
      $$('[data-lugar]').forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
      ir('potencial');
    });
  });
  $$('[data-pot]').forEach(function (b) {
    b.addEventListener('click', function () {
      S.borrador.pot = b.dataset.pot;
      $$('[data-pot]').forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
      ir('relato');
    });
  });

  // Grabación simulada
  var escribiendo = null;
  $('#btnGrabar').addEventListener('click', function () {
    var b = $('#btnGrabar');
    if (b.dataset.grabando === '1') return;
    b.dataset.grabando = '1';
    $('#grabarTit').textContent = 'Grabando…';
    $('#grabarSub').textContent = 'Suelta cuando termines';
    setTimeout(function () {
      b.dataset.grabando = '0';
      $('#grabarTit').textContent = 'Grabar de nuevo';
      $('#grabarSub').textContent = 'Transcrito automáticamente';
      transcribir();
    }, 2200);
  });

  function transcribir() {
    var txt = S.borrador.lugar === 'Rampa 7'
      ? 'Venía bajando cargado y en el cruce se me apareció una camioneta subiendo pegada al talud. No la vi por el polvo, el regador no había pasado. Alcancé a frenar y quedé a dos metros. Esto pasa siempre a esta hora.'
      : 'Estaba terminando el ciclo cuando vi la condición. No alcanzó a pasar nada, pero pudo pasar. Aviso ahora para que alguien lo revise antes del próximo turno.';
    var ta = $('#relato');
    ta.value = '';
    ta.classList.add('escribiendo');
    var i = 0;
    clearInterval(escribiendo);
    escribiendo = setInterval(function () {
      ta.value = txt.slice(0, ++i);
      S.borrador.txt = ta.value;
      $('#btnEnviar').disabled = ta.value.trim().length < 3;
      if (i >= txt.length) { clearInterval(escribiendo); ta.classList.remove('escribiendo'); }
    }, 16);
  }

  $('#relato').addEventListener('input', function (e) {
    S.borrador.txt = e.target.value;
    $('#btnEnviar').disabled = e.target.value.trim().length < 3;
  });

  $('#optFoto').addEventListener('click', function () {
    S.borrador.foto = !S.borrador.foto;
    this.setAttribute('aria-pressed', S.borrador.foto ? 'true' : 'false');
    $('#fotoNota').textContent = S.borrador.foto ? 'IMG_2841.jpg · 2,1 MB' : '';
  });
  $('#optAnon').addEventListener('click', function () {
    S.borrador.anon = !S.borrador.anon;
    this.setAttribute('aria-pressed', S.borrador.anon ? 'true' : 'false');
  });

  $('#btnEnviar').addEventListener('click', function () {
    var b = S.borrador;
    pararReloj();
    var t = transcurrido();
    var hora = 'hoy · 19:55';
    var reg = {
      id: 'LOC-015', lugar: b.lugar, tipo: b.tipo, pot: b.pot, hora: hora, txt: b.txt,
      anon: b.anon, quien: b.anon ? 'Reporte anónimo' : 'M. Ibáñez · Op. CAEX',
      energia: b.lugar === 'Rampa 7' ? 'Vehículo en movimiento' : 'Por clasificar',
      cc: b.lugar === 'Rampa 7' ? 'Segregación equipo liviano / pesado' : 'Por clasificar'
    };

    $('#acuseTiempo').textContent = t;
    $('#acuseTexto').textContent = 'Eso es lo que demoró el reporte completo.';

    if (S.online) {
      var folio = 'R-2026-0' + (S.folio++);
      $('#acuseFolio').textContent = folio;
      $('#acuseCaja').classList.remove('acuse--cola');
      $('#acuseEstado').textContent = 'Enviado. Paulina Toro (Prevención) lo tiene en pantalla.';
      S.mios.unshift({ id: folio, lugar: b.lugar, tipo: b.tipo, estado: 'ok', hora: hora });
      S.bandeja.unshift({
        folio: folio, hora: hora, lugar: b.lugar, tipo: b.tipo, pot: b.pot, quien: reg.quien,
        txt: b.txt, energia: reg.energia, cc: reg.cc, cruce: b.lugar === 'Rampa 7' ? 7 : 0, nuevo: true
      });
      if (b.lugar === 'Rampa 7' && b.tipo === 'Casi-accidente') sumarAlPatron();
      pintarBandeja();
    } else {
      $('#acuseFolio').textContent = 'LOC-015 · sin folio hasta sincronizar';
      $('#acuseCaja').classList.add('acuse--cola');
      $('#acuseEstado').textContent = 'Guardado en el teléfono. Sube solo cuando pases por señal. Tú sigue trabajando.';
      S.cola.push(reg);
      S.mios.unshift({ id: 'LOC-015', lugar: b.lugar, tipo: b.tipo, estado: 'cola', hora: hora });
    }

    pintarMios(); pintarCola();
    ir('acuse');
  });

  $('#irOficina').addEventListener('click', function () {
    setRol('oficina');
    tab('patrones');
  });

  // Controles críticos del turno
  function pintarCCTurno() {
    var hechos = 0;
    $('#ccTurno').innerHTML = CC_TURNO.map(function (c, i) {
      var v = S.ccTurno[i];
      if (v) hechos++;
      var estado = v === 'si'
        ? '<span class="chip chip--operativo">' + svgIco('operativo') + ' Verificado</span>'
        : v === 'no'
          ? '<span class="chip chip--critico">' + svgIco('critico') + ' Caído</span>'
          : '';
      return '<div class="mini" style="grid-template-columns:1fr">' +
        '<div><b>' + esc(c.n) + '</b><small>' + esc(c.d) + '</small></div>' +
        (estado ? '<div style="margin-top:4px">' + estado + '</div>'
          : '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px">' +
            '<button class="btn-atras" style="border-color:var(--operativo);color:var(--operativo)" data-cc="' + i + '" data-v="si">Está</button>' +
            '<button class="btn-atras" style="border-color:var(--critico);color:var(--critico)" data-cc="' + i + '" data-v="no">No está</button>' +
            '</div>') +
        '</div>';
    }).join('');
    $('#ccPend').textContent = (CC_TURNO.length - hechos) + ' pendientes de este turno · vence a las 20:00';
    $$('[data-cc]', $('#ccTurno')).forEach(function (b) {
      b.addEventListener('click', function () {
        var i = +b.dataset.cc;
        S.ccTurno[i] = b.dataset.v;
        if (b.dataset.v === 'no') {
          $('#caidoNombre').textContent = CC_TURNO[i].n;
          ir('caido');
        } else {
          pintarCCTurno();
          toast('Verificado. Queda con tu nombre y la hora.');
        }
      });
    });
  }

  $('#btnDetener').addEventListener('click', function () {
    toast('Tarea detenida. Aviso enviado a jefe de turno y a Prevención.');
    ir('controles');
  });

  /* ───────────────────────── OFICINA ───────────────────────── */

  function tab(t) {
    $$('.tab').forEach(function (b) { b.setAttribute('aria-selected', b.dataset.t === t ? 'true' : 'false'); });
    $$('.panel').forEach(function (p) { p.hidden = p.dataset.panel !== t; });
  }
  $$('.tab').forEach(function (b) {
    b.addEventListener('click', function () { tab(b.dataset.t); });
  });

  // Bandeja
  function pintarBandeja() {
    var f = S.filtro;
    var lista = S.bandeja.filter(function (r) {
      if (f === 'todos') return true;
      if (f === 'alto') return r.pot === 'Podía matar';
      if (f === 'Casi-accidente') return r.tipo === 'Casi-accidente';
      return r.lugar === f;
    });

    $('#bandejaN').textContent = '(' + S.bandeja.length + ')';
    // 43 reportes en los últimos 30 días (los 9 de la bandeja son sólo los más recientes).
    // Cada reporte nuevo que sincroniza suma uno.
    $('#kpiReportes').textContent = 43 + S.bandeja.length - BANDEJA.length;

    $('#listaReportes').innerHTML = lista.map(function (r) {
      var idx = S.bandeja.indexOf(r);
      return '<div class="rep' + (r.nuevo ? ' rep--nuevo' : '') + '">' +
        '<button class="rep__cab" data-rep="' + idx + '" aria-expanded="false">' +
          '<span class="rep__fila1">' +
            '<span class="rep__folio">' + esc(r.folio) + '</span>' +
            '<span class="rep__lugar">' + esc(r.lugar) + '</span>' +
            (r.nuevo ? '<span class="chip chip--ia">' + svgIco('ia') + ' Nuevo</span>' : '') +
            '<span class="rep__hora">' + esc(r.hora) + '</span>' +
          '</span>' +
          '<span class="rep__txt">“' + esc(r.txt) + '”</span>' +
          '<span class="rep__chips">' +
            '<span class="chip chip--pendiente">' + svgIco('') + ' ' + esc(r.tipo) + '</span>' +
            chipPot(r.pot) +
            (r.cruce >= 3 ? '<span class="chip chip--ia">' + svgIco('ia') + ' ' + r.cruce + ' similares</span>' : '') +
          '</span>' +
        '</button>' +
        '<div class="rep__det" hidden></div>' +
        '</div>';
    }).join('') || '<p class="txt-tenue txt-chico">Ningún reporte con ese filtro.</p>';

    $$('[data-rep]').forEach(function (b) {
      b.addEventListener('click', function () {
        var r = S.bandeja[+b.dataset.rep];
        var det = b.parentNode.querySelector('.rep__det');
        var ab = b.getAttribute('aria-expanded') === 'true';
        b.setAttribute('aria-expanded', ab ? 'false' : 'true');
        det.hidden = ab;
        if (!ab && !det.innerHTML) {
          det.innerHTML =
            '<div class="ia-nota">' + svgIco('ia') +
            '<span><strong>Triage automático.</strong> Lo propone el modelo en dos segundos. Corrígelo si está mal — la corrección queda como ejemplo, y firma una persona.</span></div>' +
            '<div class="campos campos--2">' +
              '<div class="campo"><label>Energía involucrada</label>' + selectHTML(['Vehículo en movimiento', 'Gravedad / caída de altura', 'Gravedad / caída de objetos', 'Gravedad / caída de rocas', 'Mecánica / atrapamiento', 'Energía almacenada / LOTO', 'Explosivos', 'Eléctrica', 'Mecánica', 'Por clasificar'], r.energia) + '</div>' +
              '<div class="campo"><label>Control crítico asociado</label>' + selectHTML(['Segregación equipo liviano / pesado', 'Berma perimetral', 'Bloqueo y tarjeteo', 'Resguardo de partes móviles', 'Control de talud', 'Custodia de explosivos', 'Objetos en altura', 'Estándar de tránsito', 'Por clasificar', '—'], r.cc) + '</div>' +
              '<div class="campo"><label>Potencial de severidad</label>' + selectHTML(['Podía matar', 'Podía lesionar grave', 'Sin potencial grave'], r.pot) + '</div>' +
              '<div class="campo"><label>Reportado por</label><input type="text" value="' + esc(r.quien) + '" readonly></div>' +
            '</div>' +
            (r.cruce >= 3 ? '<div class="ia-nota" style="border-style:solid">' + svgIco('critico') +
              '<span><strong>Este reporte no está solo.</strong> El modelo encontró ' + r.cruce + ' reportes parecidos en el mismo lugar. Está en la pestaña <strong>Patrones</strong>.</span></div>' : '') +
            '<div class="rep__botones">' +
              '<button class="btn-atras" data-acc="descartar">Marcar sin acción</button>' +
              '<button class="btn-enviar" data-acc="aceptar">Aceptar clasificación</button>' +
            '</div>';
          $$('[data-acc]', det).forEach(function (x) {
            x.addEventListener('click', function () {
              toast(x.dataset.acc === 'aceptar'
                ? 'Clasificación aceptada y firmada por P. Toro'
                : 'Reporte cerrado sin acción. Queda en el histórico.');
            });
          });
          $$('select', det).forEach(function (s) {
            s.addEventListener('change', function () {
              toast('Corrección guardada. El modelo la usa como ejemplo.');
            });
          });
        }
      });
    });
  }

  function selectHTML(ops, val) {
    return '<select>' + ops.map(function (o) {
      return '<option' + (o === val ? ' selected' : '') + '>' + esc(o) + '</option>';
    }).join('') + '</select>';
  }

  $$('.filtro[data-f]').forEach(function (b) {
    b.addEventListener('click', function () {
      S.filtro = b.dataset.f;
      $$('.filtro[data-f]').forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
      pintarBandeja();
    });
  });

  // Scatter del demo
  function pintarScatter() {
    var g = $('#gRampaDemo');
    g.innerHTML = S.rampa.map(function (p, i) {
      var halo = p.nuevo ? '<circle cx="' + p.x + '" cy="' + p.y + '" r="11" fill="none" stroke="#FFD100" stroke-opacity="0.45" stroke-width="1.5"/>' : '';
      return halo + '<circle cx="' + p.x + '" cy="' + p.y + '" r="6" fill="#FFD100" stroke="#0B1A2B" stroke-width="2" tabindex="0" role="button" data-i="' + i + '"><title>' + esc(p.f) + ' — ' + esc(p.q) + '</title></circle>';
    }).join('');

    $$('circle[data-i]', g).forEach(function (c) {
      function ver() {
        var p = S.rampa[+c.dataset.i];
        $('#ttdF').textContent = p.f;
        $('#ttdQ').textContent = p.q;
        $('#ttdT').textContent = '“' + p.t + '”';
        $('#ttDemo').hidden = false;
        $$('circle[data-i]', g).forEach(function (o) { o.setAttribute('r', o === c ? '8' : '6'); });
      }
      c.addEventListener('click', ver);
      c.addEventListener('mouseenter', ver);
      c.addEventListener('focus', ver);
    });
  }

  // Barras del regador
  function pintarBarras() {
    var g = $('#barras');
    var x0 = 34, x1 = 392, y0 = 170, alto = 150, max = 2.0;
    var slot = (x1 - x0) / REGADOR.length;
    var w = Math.min(14, slot - 6);
    var out = '';
    REGADOR.forEach(function (v, i) {
      var h = (v / max) * alto;
      var x = x0 + i * slot + (slot - w) / 2;
      var y = y0 - h;
      var r = Math.min(4, h);
      out += '<path d="M' + x + ' ' + y0 + ' L' + x + ' ' + (y + r) +
        ' Q' + x + ' ' + y + ' ' + (x + r) + ' ' + y +
        ' L' + (x + w - r) + ' ' + y + ' Q' + (x + w) + ' ' + y + ' ' + (x + w) + ' ' + (y + r) +
        ' L' + (x + w) + ' ' + y0 + ' Z" fill="#FFD100"><title>' + (i + 6) + ':00 — ' +
        String(v).replace('.', ',') + ' pasadas/h</title></path>';
      if ([0, 3, 6, 9, 12, 15, 17].indexOf(i) >= 0) {
        out += '<text class="g-eje-txt" x="' + (x + w / 2) + '" y="182" text-anchor="middle">' + (i + 6) + '</text>';
      }
    });
    // anotación sobre la hora 20 (índice 14)
    var xc = x0 + 14 * slot + slot / 2;
    var yv = y0 - (REGADOR[14] / max) * alto;
    out += '<text class="g-etq" x="' + xc + '" y="' + (yv - 8) + '" text-anchor="middle" fill="#FFD100">0,2</text>';
    out += '<line x1="' + xc + '" y1="196" x2="' + xc + '" y2="188" stroke="#FFD100" stroke-width="1"/>';
    out += '<text class="g-eje-txt" x="' + xc + '" y="208" text-anchor="middle" fill="#FFD100">cambio de turno</text>';
    out += '<text class="g-eje-txt" x="' + x0 + '" y="208" text-anchor="start">hora del día</text>';
    g.innerHTML = out;
  }

  // Patrón
  $('#btnDescartar').addEventListener('click', function () {
    S.patronVivo = false;
    $('#notaPatron').textContent = 'Patrón descartado por Paulina Toro el 12-07-2026. Queda registrado quién lo descartó y cuándo — si mañana pasa algo en la Rampa 7, esa decisión tiene nombre.';
    toast('Patrón descartado. Queda con tu nombre.');
  });
  $('#btnInvestigar').addEventListener('click', function () {
    tab('inv');
    toast('Investigación INV-2026-014 abierta');
  });

  // Controles críticos (oficina)
  function pintarCC() {
    var mapa = { operativo: ['operativo', 'Operativo'], vencido: ['critico', 'Verificación vencida'], caido: ['critico', 'Control caído'], parcial: ['alto', 'Parcial'] };
    $('#listaCC').innerHTML = CC.map(function (c, i) {
      var m = mapa[c.est];
      return '<div class="cc">' +
        '<button class="cc__btn" data-ccx="' + i + '" aria-expanded="false">' +
          '<span class="cc__cab"><span class="cc__nom">' + esc(c.n) + '</span>' +
            '<span class="chip chip--' + m[0] + '">' + svgIco(m[0]) + ' ' + m[1] + '</span></span>' +
          '<span class="cc__meta"><span>Responsable: <b>' + esc(c.resp) + '</b></span><span>Frecuencia: <b>' + esc(c.frec) + '</b></span><span>Última verificación: <b>' + esc(c.ult) + '</b></span></span>' +
          '<span class="medidor"><i style="width:' + c.pct + '%"' + (c.pct < 70 ? ' data-bajo="1"' : '') + '></i></span>' +
          '<span class="txt-mini txt-tenue">Verificaciones cumplidas: ' + c.pct + '%</span>' +
        '</button>' +
        '<div class="rep__det" hidden></div>' +
        '</div>';
    }).join('');

    $('#kpiCC').textContent = CC.filter(function (c) { return c.est === 'operativo'; }).length + ' / ' + CC.length;

    $$('[data-ccx]').forEach(function (b) {
      b.addEventListener('click', function () {
        var c = CC[+b.dataset.ccx];
        var det = b.parentNode.querySelector('.rep__det');
        var ab = b.getAttribute('aria-expanded') === 'true';
        b.setAttribute('aria-expanded', ab ? 'false' : 'true');
        det.hidden = ab;
        if (!ab && !det.innerHTML) {
          det.innerHTML = '<div class="rep__txt">' + esc(c.det) + '</div>' +
            '<div class="rep__botones">' +
            '<button class="btn-atras" data-x="hist">Ver historial</button>' +
            '<button class="btn-enviar" data-x="exigir">Exigir verificación ahora</button></div>';
          $$('[data-x]', det).forEach(function (x) {
            x.addEventListener('click', function () {
              toast(x.dataset.x === 'exigir'
                ? 'Enviado al teléfono de 4 jefes de turno. Vence en 2 horas.'
                : '31 verificaciones en 90 días. 4 marcadas “no está”.');
            });
          });
        }
      });
    });
  }

  // Investigación
  $('#btnBorrador').addEventListener('click', function () {
    var b = $('#btnBorrador');
    b.disabled = true;
    b.textContent = 'Redactando… (Sonnet 5 · 6 s)';
    setTimeout(function () {
      b.textContent = 'Borrador generado · volver a generar';
      b.disabled = false;
      $('#borrador').hidden = false;
      pintarInvestigacion();
      $('#borrador').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 1400);
  });

  function pintarInvestigacion() {
    var hechos = 'Entre el 18 de abril y el 2 de julio de 2026 se registraron ' + S.rampa.length +
      ' eventos de alto potencial en la Rampa 7 de la Faena Cerro Quemado, todos con la misma mecánica: interacción no controlada entre equipo liviano (camionetas) y equipo pesado (CAEX cargados) en la ruta de acarreo R-2, con visibilidad reducida por material particulado. Los ' + S.rampa.length +
      ' eventos ocurrieron dentro de la ventana de cambio de turno (19:30–20:30). Ninguno tuvo consecuencia. Todos tuvieron potencial de fatalidad.';
    var e = $('#txtHechos');
    e.textContent = '';
    e.classList.add('escribiendo');
    var i = 0;
    var t = setInterval(function () {
      e.textContent = hechos.slice(0, i += 3);
      if (i >= hechos.length) { clearInterval(t); e.classList.remove('escribiendo'); }
    }, 12);

    $('#tbLinea').innerHTML = S.rampa.map(function (p) {
      var pt = p.f.split(' · ');
      return '<tr><td class="num">' + esc(pt[0]) + '</td><td class="num">' + esc(pt[1]) + '</td><td>' + esc(p.q) + '</td><td>' + esc(p.t) + '</td></tr>';
    }).join('');

    $('#porques').innerHTML = PORQUES.map(function (p, i) {
      return '<span class="campo"><label>' + (i + 1) + '. ' + esc(p[0]) + '</label><textarea rows="2">' + esc(p[1]) + '</textarea></span>';
    }).join('');

    $('#acciones').innerHTML = ACCIONES.map(function (a, i) {
      return '<div class="acc__item"><b>' + (i + 1) + '. ' + esc(a.t) + '</b>' +
        '<div class="acc__meta"><span>Responsable: ' + esc(a.r) + '</span><span>Plazo: ' + esc(a.p) + '</span></div>' +
        '<div class="txt-mini txt-tenue">' + esc(a.v) + '</div></div>';
    }).join('');
  }

  $('#btnAceptarAcc').addEventListener('click', function () {
    S.accAceptadas = true;
    $('#notaAcc').textContent = 'Cuatro acciones asignadas con responsable y plazo. Cada responsable las ve en su teléfono, y si vencen, se ven vencidas — no esperan a la auditoría.';
    $('#docAcc').textContent = '4 acciones asignadas · responsables y plazos aceptados el 12-07-2026 por P. Toro';
    toast('4 acciones asignadas y notificadas');
  });

  // Reporte regulatorio
  function csv() {
    var filas = ['folio;fecha;hora;faena;empresa;rut;area;tipo;potencial;energia;control_critico;descripcion'];
    S.bandeja.slice(0, 6).forEach(function (r) {
      var h = r.hora.split(' · ');
      filas.push([r.folio, h[0], h[1] || '', 'Cerro Quemado', 'Servicios Mineros Aravena Ltda.', '76.412.883-5',
        r.lugar, r.tipo, r.pot, r.energia, r.cc, '"' + r.txt.replace(/"/g, "'") + '"'].join(';'));
    });
    return filas.join('\n');
  }

  $('#btnDoc').addEventListener('click', function () {
    $('#btnDoc').setAttribute('aria-pressed', 'true');
    $('#btnCsv').setAttribute('aria-pressed', 'false');
    $('#vistaDoc').hidden = false;
    $('#vistaCsv').hidden = true;
  });
  $('#btnCsv').addEventListener('click', function () {
    $('#btnDoc').setAttribute('aria-pressed', 'false');
    $('#btnCsv').setAttribute('aria-pressed', 'true');
    $('#vistaDoc').hidden = true;
    $('#vistaCsv').hidden = false;
    $('#csvOut').textContent = csv();
  });
  $('#btnCopiar').addEventListener('click', function () {
    var txt = csv();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(function () { toast('CSV copiado'); },
        function () { toast('No se pudo copiar: selecciónalo a mano'); });
    } else {
      toast('Selecciona el texto y cópialo');
    }
  });

  /* ───────────────────────── ARRANQUE ───────────────────────── */

  pintarMios();
  pintarCola();
  pintarBandeja();
  pintarScatter();
  pintarBarras();
  pintarCC();
  pintarCCTurno();
})();
