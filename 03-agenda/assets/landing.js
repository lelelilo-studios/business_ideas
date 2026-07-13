/* ---------------------------------------------------------------------------
   Zurcia — widget "en vivo" de la landing.
   Dos escenas guionadas. Todo el estado vive acá; no hay red, no hay backend.
   El demo completo (demo/index.html) es el que responde a lo que tú escribes.
   --------------------------------------------------------------------------- */
(function () {
  var hilo    = document.getElementById('v-hilo');
  var agendaE = document.getElementById('v-agenda');
  var notaE   = document.getElementById('v-nota-txt');
  var rescE   = document.getElementById('v-rescatado');
  var nomE    = document.getElementById('v-nombre');
  var iniE    = document.getElementById('v-ini');
  var telE    = document.getElementById('v-estado');
  var pieE    = document.getElementById('v-pie');
  var fechaE  = document.getElementById('v-fecha');
  var b1      = document.getElementById('v-escena-1');
  var b2      = document.getElementById('v-escena-2');
  if (!hilo) return;

  var lenta = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var timers = [];
  function limpia() { timers.forEach(clearTimeout); timers = []; }
  function luego(ms, fn) { timers.push(setTimeout(fn, lenta ? 0 : ms)); }

  var CLP = function (n) { return '$' + n.toLocaleString('es-CL'); };

  /* ---------------- agenda ---------------- */
  function pintaAgenda(slots) {
    agendaE.innerHTML = '';
    slots.forEach(function (s) {
      var d = document.createElement('div');
      d.className = 'slot' + (s.nueva ? ' slot--nueva' : '');
      d.dataset.estado = s.estado;
      var etiqueta = '';
      if (s.estado === 'rescatada') etiqueta = '<span class="tag tag--sello">Rescatada</span>';
      else if (s.estado === 'cancelada') etiqueta = '<span class="tag tag--ladrillo">Cayó</span>';
      else if (s.estado === 'libre') etiqueta = '<span class="tag tag--tinta">Libre</span>';
      else etiqueta = '<span class="tag tag--tinta">' + CLP(s.monto) + '</span>';
      d.innerHTML =
        '<span class="slot__h">' + s.hora + '</span>' +
        '<span class="slot__q">' + s.quien + (s.serv ? '<small>' + s.serv + '</small>' : '') + '</span>' +
        etiqueta;
      agendaE.appendChild(d);
    });
  }

  function base(escena) {
    if (escena === 1) {
      return [
        { hora: '10:00', quien: 'Josefa Ibarra',  serv: 'Corte',          estado: 'ok', monto: 18000 },
        { hora: '11:30', quien: 'Libre',          serv: '',               estado: 'libre' },
        { hora: '13:30', quien: 'Libre',          serv: '',               estado: 'libre' },
        { hora: '16:00', quien: 'Fernanda Soto',  serv: 'Corte + barba',  estado: 'ok', monto: 22000 },
        { hora: '17:30', quien: 'Antonia Vera',   serv: 'Manicure',       estado: 'ok', monto: 15000 }
      ];
    }
    return [
      { hora: '10:00', quien: 'Josefa Ibarra',  serv: 'Corte',           estado: 'ok', monto: 18000 },
      { hora: '11:30', quien: 'Libre',          serv: '',                estado: 'libre' },
      { hora: '13:30', quien: 'Camila Reyes',   serv: 'Color + corte',   estado: 'ok', monto: 52000 },
      { hora: '16:00', quien: 'Fernanda Soto',  serv: 'Corte + barba',   estado: 'ok', monto: 22000 },
      { hora: '17:30', quien: 'Antonia Vera',   serv: 'Manicure',        estado: 'ok', monto: 15000 }
    ];
  }

  /* ---------------- burbujas ---------------- */
  function burbuja(lado, texto, hora) {
    var d = document.createElement('div');
    d.className = 'glob glob--' + lado;
    d.innerHTML = texto.replace(/&/g, '&amp;').replace(/</g, '&lt;') +
      '<span class="glob__hora">' + hora + (lado === 'out' ? ' ✓✓' : '') + '</span>';
    hilo.appendChild(d);
    hilo.scrollTop = hilo.scrollHeight;
    return d;
  }
  function escribiendo() {
    var d = document.createElement('div');
    d.className = 'glob glob--out glob--escribe';
    d.innerHTML = '<span></span><span></span><span></span>';
    hilo.appendChild(d);
    hilo.scrollTop = hilo.scrollHeight;
    return d;
  }
  function contacto(nombre, tel) {
    nomE.textContent = nombre;
    iniE.textContent = nombre.charAt(0);
    telE.textContent = tel;
  }

  /* ---------------- guiones ---------------- */
  var ESCENA_1 = {
    contacto: ['Camila Reyes', '+56 9 8412 ····'],
    fecha: 'Martes, 23:11',
    pie: 'Agente activo · responde en 4 s',
    nota: 'Camila escribe un martes a las 23:11. El local cerró hace cuatro horas. El agente contesta igual, mira la agenda real y sólo ofrece horas que existen.',
    pasos: [
      { t: 400,  lado: 'in',  hora: '23:11', txt: 'hola! tienen hora pa el sábado? necesito color y corte 🙏' },
      { t: 1200, esc: true },
      { t: 1600, lado: 'out', hora: '23:11', txt: 'Hola Camila 👋 Sí. Color + corte toma 2 horas. Para el sábado 18 me quedan:\n\n· 10:00 con Marisol\n· 13:30 con Marisol\n· 17:00 con Katherine\n\n¿Cuál te acomoda?' },
      { t: 2600, lado: 'in',  hora: '23:12', txt: 'la de las 13:30 está bien' },
      { t: 1000, esc: true },
      { t: 1400, lado: 'out', hora: '23:12', txt: 'Listo, quedaste agendada 📌\n\nSábado 18 · 13:30\nColor + corte con Marisol\n$52.000 · 2 horas\n\nEl viernes te mando un recordatorio para confirmar. Si algo cambia, me avisas por acá nomás.',
        efecto: function (slots) {
          slots[2] = { hora: '13:30', quien: 'Camila Reyes', serv: 'Color + corte', estado: 'ok', monto: 52000, nueva: true };
          notaE.textContent = 'La reserva entró a la agenda. Nadie del local hizo nada: son las 23:12 de un martes y Marisol está durmiendo.';
        } },
      { t: 1600, lado: 'in',  hora: '23:13', txt: 'gracias!! 🙌' },
      { t: 900,  fin: function () {
          notaE.innerHTML = '<strong>Conversación cerrada en 2 minutos, sin nadie despierto.</strong> Ahora mira la escena 2: qué pasa cuando esa agenda se rompe.';
          b2.focus({ preventScroll: true });
        } }
    ]
  };

  var ESCENA_2 = {
    contacto: ['Fernanda Soto', '+56 9 7736 ····'],
    fecha: 'Sábado, 08:40',
    pie: 'Agente activo · motor de rescate encendido',
    nota: 'Sábado, 8:40 de la mañana. Fernanda tiene hora a las 16:00 y avisa que no llega. A mano, esa silla queda muerta.',
    pasos: [
      { t: 400,  lado: 'in',  hora: '08:40', txt: 'hola, no voy a poder ir hoy a las 16 😔 se me complicó' },
      { t: 1100, esc: true },
      { t: 1500, lado: 'out', hora: '08:40', txt: 'Qué lata, Fernanda. Te la cancelo sin costo, avisaste con tiempo. ¿Te busco otra hora?',
        efecto: function (slots) {
          slots[3] = { hora: '16:00', quien: 'Fernanda Soto', serv: 'Corte + barba', estado: 'cancelada' };
          notaE.innerHTML = '<strong>Hueco abierto:</strong> hoy 16:00 · corte + barba · 60 min. El motor busca calce en la lista de espera: 3 candidatos.';
        } },
      { t: 1900, lado: 'in',  hora: '08:41', txt: 'sí porfa, la próxima semana mejor' },
      { t: 900,  esc: true },
      { t: 1300, lado: 'out', hora: '08:41', txt: 'Te dejo el martes 21 a las 16:00 con Marisol. Ya está confirmada.' },
      { t: 1400, corte: function () {
          contacto('Rodrigo Pinto', '+56 9 5520 ····');
          pieE.textContent = 'Rescate 1 de 3 · esperando respuesta';
          fechaE.textContent = 'Sábado, 08:42';
          notaE.innerHTML = 'Rodrigo pidió algo "para el finde" el jueves. Calce: <span class="mono">94%</span> — mismo servicio, mismo profesional, pidió tarde. El agente le escribe a él primero.';
          hilo.innerHTML = '';
        } },
      { t: 700,  lado: 'out', hora: '08:42', txt: 'Rodrigo, se soltó una hora HOY a las 16:00 con Marisol (corte + barba, $22.000). Me pediste algo para el fin de semana.\n\n¿La tomas? Te la reservo 8 minutos.' },
      { t: 2400, lado: 'in',  hora: '08:44', txt: 'la tomo!! 🔥' },
      { t: 900,  esc: true },
      { t: 1300, lado: 'out', hora: '08:44', txt: 'Hecho ✅\n\nHoy 16:00 · Corte + barba con Marisol · $22.000\nAv. Irarrázaval 3410, Ñuñoa. Nos vemos.',
        efecto: function (slots) {
          slots[3] = { hora: '16:00', quien: 'Rodrigo Pinto', serv: 'Corte + barba · rescatada', estado: 'rescatada', monto: 22000, nueva: true };
          rescE.textContent = CLP(22000);
          pieE.textContent = 'Hueco rescatado en 4 min';
          notaE.innerHTML = '<strong>4 minutos.</strong> La silla de las 16:00 vuelve a estar vendida y Marisol todavía no llega al local. Costo para nosotros: <span class="mono">2 plantillas de Meta = $35</span>. Devuelto al local: <span class="mono">$22.000</span>.';
        } },
      { t: 1000, fin: function () {} }
    ]
  };

  /* ---------------- reproductor ---------------- */
  function corre(escena, cual) {
    limpia();
    hilo.innerHTML = '';
    var slots = base(cual);
    pintaAgenda(slots);
    rescE.textContent = '$0';
    contacto(escena.contacto[0], escena.contacto[1]);
    fechaE.textContent = escena.fecha;
    pieE.textContent = escena.pie;
    notaE.textContent = escena.nota;
    b1.dataset.activo = cual === 1 ? 'true' : 'false';
    b2.dataset.activo = cual === 2 ? 'true' : 'false';

    var acum = 0;
    var puntero = null;
    escena.pasos.forEach(function (p) {
      acum += p.t;
      luego(acum, function () {
        if (p.esc)   { puntero = escribiendo(); return; }
        if (p.corte) { p.corte(); return; }
        if (p.fin)   { p.fin(); return; }
        if (puntero) { puntero.remove(); puntero = null; }
        burbuja(p.lado, p.txt, p.hora);
        if (p.efecto) { p.efecto(slots); pintaAgenda(slots); }
      });
    });
  }

  b1.addEventListener('click', function () { corre(ESCENA_1, 1); });
  b2.addEventListener('click', function () { corre(ESCENA_2, 2); });

  /* arranca sola cuando entra en pantalla, una vez */
  var arrancada = false;
  var obs = new IntersectionObserver(function (ents) {
    ents.forEach(function (e) {
      if (e.isIntersecting && !arrancada) { arrancada = true; corre(ESCENA_1, 1); }
    });
  }, { threshold: 0.25 });
  obs.observe(hilo);

  /* pinta algo aunque nunca entre en pantalla */
  pintaAgenda(base(1));
})();
