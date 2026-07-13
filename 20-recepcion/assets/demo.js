/* ═══════════════════════════════════════════════════════════════════════
   FONALTA — motor del demo.

   Qué es real acá: la máquina de estados de la llamada, el reloj de latencia,
   el barge-in (que trunca el turno del modelo, no sólo el audio), la regla de
   "sin herramienta no hay afirmación", y el resumen que se arma al final.

   Qué NO es real: no hay telefonía, no hay ASR, no hay TTS, no hay audio. La
   forma de onda es una función, no un micrófono. Los milisegundos son el
   presupuesto de arquitectura, no una medición. Está declarado en la página y
   en stack.html.
   ══════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var REDUCIDO = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- helper: un desglose de latencia que SUMA de verdad --- */
  function L(red, asr, llm, tts, jit) {
    return { red: red, asr: asr, llm: llm, tts: tts, jit: jit,
             total: red + asr + llm + tts + jit };
  }

  /* ═══════════════════════════ LOS GUIONES ═══════════════════════════ */

  var LLAMADAS = [
    {
      id: 'vet',
      rotulo: 'Veterinaria Los Aromos',
      cuando: 'martes 19:42',
      de: '+56 9 8472 1103',
      comuna: 'Ñuñoa',
      contexto: 'La clínica cerró a las 19:00. No hay nadie.',
      campos: { intencion: '—', quien: '—', asunto: '—', accion: '—' },
      turnos: [
        { a: 'sys', t: 'Llamada entrante · +56 9 8472 1103 · Ñuñoa · martes 19:42 · la clínica cerró a las 19:00 y no hay nadie en el local' },

        { a: 'ia', t: 'Aló, le habla la asistente virtual de Veterinaria Los Aromos.',
          dur: 3400, lat: L(0, 0, 0, 40, 0), flag: 'divulgacion',
          nota: 'El saludo va PRE-SINTETIZADO en caché: suena en el milisegundo 40, sin esperar al modelo. La palabra «virtual» sale de la boca de la IA antes del segundo 4 de la llamada. Es el requisito de divulgación, y se cumple sin costo de latencia.',
          campos: { intencion: 'saludo' } },

        { a: 'ia', t: 'Soy una inteligencia artificial y la llamada queda grabada. ¿En qué le puedo ayudar?',
          dur: 4400,
          nota: 'Aviso de IA + aviso de grabación, en la misma respiración. Nadie tiene que preguntarlo.' },

        { a: 'cliente', t: 'Aló… eh, sí. Hola. Mira, necesito una hora para mi perro. Está con una cojera hace dos días.',
          dur: 5400 },

        { a: 'ia', t: 'Ya, entiendo. ¿Es urgente, o el perro está comiendo y caminando normal aparte de la cojera?',
          dur: 4200, lat: L(78, 176, 312, 88, 36),
          nota: 'Triage antes de agendar. Si el modelo detecta signos de urgencia, corta el guión, llama al celular del dueño y le manda un SMS. Una IA no atiende una emergencia y no vamos a fingir que sí.',
          campos: { intencion: 'pedir hora', asunto: 'perro con cojera, 2 días' } },

        { a: 'cliente', t: 'No, come bien. Camina no más que cojeando.', dur: 2600 },

        { a: 'ia', t: 'Perfecto. Le puedo dar hora con el doctor Cárdenas. Tengo mañana miércoles a las 10:30, o el jueves a las 16:00. ¿Cuál le acomoda?',
          dur: 5600, lat: L(82, 168, 320, 92, 43),
          herr: [{ c: 'consultar_agenda("15–17 jul", "traumatología")', r: '2 bloques libres', ok: true }],
          nota: 'La disponibilidad NO la inventa el modelo: sale del calendario, por herramienta. Si la herramienta no responde, la IA no ofrece horas — ofrece el recado.',
          campos: { accion: 'agendar' } },

        { a: 'cliente', t: 'Mañana a las diez y media, sí.', dur: 2200 },

        { a: 'ia', t: 'Ya. ¿Me da su nombre y el nombre del perro?',
          dur: 2500, lat: L(74, 170, 300, 86, 38),
          nota: '«¿Me da su nombre?», no «¿me regalas tu nombre?». El guión es chileno, no español neutro traducido.' },

        { a: 'cliente', t: 'Marcela Fuentes. Y el perro se llama Cholo.', dur: 2900 },

        { a: 'ia', t: 'Marcela Fuentes y Cholo. Le confirmo: mañana miércoles 15 de julio a las 10:30, con el doctor Cárdenas, acá en Irarrázaval 4120. Una consulta de traumatología sale…',
          dur: 8400, lat: L(80, 178, 318, 90, 46), corte: 2600, flag: 'barge',
          herr: [{ c: 'agendar("Marcela Fuentes", "Cholo", "15 jul 10:30", "Dr. Cárdenas")', r: 'evento creado en el calendario', ok: true }],
          nota: 'BARGE-IN. La clienta habló encima a los 2,6 s. Voz entrante detectada a los 120 ms → se corta el TTS, se purga el audio que ya iba en camino en el buffer de la operadora, y —esto es lo que casi nadie hace— el turno del modelo se TRUNCA a lo que alcanzó a sonar. Si no lo truncas, el modelo cree que dijo la frase completa y dos turnos después la conversación se descarrila.',
          campos: { quien: 'Marcela Fuentes', accion: 'hora agendada · mié 15 jul 10:30' } },

        { a: 'cliente', t: 'Oye, perdona —¿ustedes atienden gatos también? Porque tengo una gata.',
          dur: 4200, flag: 'interrumpe' },

        { a: 'ia', t: 'No le voy a inventar una respuesta: eso no lo tengo. En mi ficha están los servicios de perros, pero de gatos no dice nada. Se lo dejo anotado a la clínica y le responden mañana por WhatsApp a este mismo número. ¿Le sirve?',
          dur: 9400, lat: L(70, 160, 290, 80, 40), flag: 'nosupo',
          herr: [
            { c: 'buscar_conocimiento("gatos · felinos · atienden")', r: '0 resultados en la ficha', ok: false },
            { c: 'marcar_no_supo("¿atienden gatos?")', r: 'registrado · va al dueño', ok: true }
          ],
          nota: 'REGLA DURA: si la herramienta no devuelve nada, el modelo NO PUEDE AFIRMAR. La única salida que el sistema le permite es admitirlo. Suena peor por un segundo y te ahorra un cliente enojado por semana. Y esa pregunta le llega al dueño por WhatsApp: la contesta una vez y no vuelve a fallar.',
          campos: { intencion: 'pedir hora + consulta sin responder' } },

        { a: 'cliente', t: 'Ya, gracias. Sí, perfecto.', dur: 2100 },

        { a: 'ia', t: 'Bien. Le repito entonces: Cholo, mañana miércoles a las 10:30, en Irarrázaval 4120. Que esté bien, Marcela.',
          dur: 5800, lat: L(72, 166, 296, 82, 39),
          nota: 'Cierre con repetición de los datos. Es la última defensa contra un error de transcripción que nadie alcanzó a atajar.' },

        { a: 'cliente', t: 'Ya, chao.', dur: 1100 },

        { a: 'sys', t: 'Llamada terminada · resultado: hora agendada + 1 pregunta que la IA no supo responder' }
      ],
      wa: {
        titulo: 'Veterinaria Los Aromos',
        cuerpo: '<span class="rot">AGENDADA</span>\n<b>Marcela Fuentes</b> · perro <b>Cholo</b>, cojera hace 2 días, sin signos de urgencia.\nMié 15 jul, 10:30, con el Dr. Cárdenas. Ya quedó en el calendario.\n\n<span class="rot">NO SUPE RESPONDER</span>\n«¿Atienden gatos?»\nRespóndeme acá <b>sí</b> o <b>no</b> y lo agrego a la ficha para la próxima.\n\nGrabación y transcripción: fonalta.com/l/8f2c'
      }
    },

    {
      id: 'taller',
      rotulo: 'Taller Hnos. Peña',
      cuando: 'jueves 11:20',
      de: '+56 9 6631 4478',
      comuna: 'Maipú',
      contexto: 'Hora punta. Don Patricio está abajo de un auto.',
      campos: { intencion: '—', quien: '—', asunto: '—', accion: '—' },
      turnos: [
        { a: 'sys', t: 'Llamada entrante · +56 9 6631 4478 · Maipú · jueves 11:20 · hora punta, los dos mecánicos están abajo de un auto' },

        { a: 'ia', t: 'Aló, le contesta la asistente virtual del Taller Hermanos Peña.',
          dur: 3300, lat: L(0, 0, 0, 40, 0), flag: 'divulgacion',
          nota: 'Mismo saludo cacheado, mismo compromiso: la palabra «virtual» antes del segundo 4.',
          campos: { intencion: 'saludo' } },

        { a: 'ia', t: 'Soy una inteligencia artificial, la llamada se graba. Dígame.',
          dur: 3200 },

        { a: 'cliente', t: 'Ya. ¿Está don Patricio?', dur: 1800 },

        { a: 'ia', t: 'Don Patricio está en el taller, pero no lo tengo en la línea. ¿Le puedo ayudar yo, o prefiere que le deje el recado?',
          dur: 5000, lat: L(76, 172, 308, 86, 40),
          herr: [{ c: 'consultar_derivacion("Patricio Peña")', r: 'sin destino disponible en horario de taller', ok: false }],
          nota: 'La IA consulta si hay un destino de transferencia configurado y disponible. No lo hay. Ojo con lo que NO dice: no dice «se lo paso», no lo deja en espera, no inventa que lo va a buscar.',
          campos: { intencion: 'hablar con el dueño', quien: '—' } },

        { a: 'cliente', t: 'No, es que necesito hablar con él. ¿Me lo puede pasar?', dur: 3100 },

        { a: 'ia', t: 'No tengo cómo pasarle con una persona en este minuto: soy la asistente virtual y no hay nadie tomando llamadas ahora. Lo que sí puedo hacer es dejarle el recado a don Patricio con su número y él le devuelve el llamado, o agendarle una devolución a una hora que le acomode. ¿Qué prefiere?',
          dur: 11800, lat: L(84, 180, 324, 94, 44), flag: 'sinhumano',
          nota: 'PIDEN UN HUMANO Y NO HAY HUMANO. El sistema lo DICE. Este es el único turno de todo el producto donde mentir lo convertiría en una estafa: «se lo transfiero» hacia un timbre que no suena en ninguna parte. El guión no tiene esa salida — literalmente no está en las opciones que el modelo puede tomar.',
          campos: { accion: 'ofrecer recado o devolución' } },

        { a: 'cliente', t: 'Ya, que me llame. Es por la camioneta, la Hilux, que la dejé el lunes.', dur: 4400 },

        { a: 'ia', t: 'Ya. ¿Su nombre, y lo llamamos a este mismo número del que está llamando?',
          dur: 3600, lat: L(72, 164, 298, 84, 37),
          campos: { asunto: 'Hilux dejada el lunes' } },

        { a: 'cliente', t: 'Sí, este mismo. Rodrigo Salinas.', dur: 2200 },

        { a: 'ia', t: 'Rodrigo Salinas, al +56 9 6631 4478. Necesito su permiso para llamarlo de vuelta a ese número: ¿me autoriza?',
          dur: 5600, lat: L(78, 174, 306, 88, 41), flag: 'consentimiento',
          nota: 'Sin este «sí», Fonalta NO llama. Nunca. El consentimiento queda grabado y guardado junto a la llamada. Es la línea entre una devolución legítima y una robocall: en Chile choca con el registro No Molestar (Ley 21.398) y con la Ley 19.496; en EE.UU. la FCC ya declaró ilegales las llamadas con voz de IA sin consentimiento. Y aunque no lo fuera: te quema el número.',
          campos: { quien: 'Rodrigo Salinas' } },

        { a: 'cliente', t: 'Sí, sí. Llámenme.', dur: 1400 },

        { a: 'ia', t: 'Anotado. ¿Le sirve entre las 14:00 y las 15:00, cuando don Patricio para a almorzar?',
          dur: 4400, lat: L(74, 168, 302, 86, 38),
          herr: [
            { c: 'guardar_consentimiento("+56966314478", "devolucion")', r: 'grabado · 1 devolución, máx. 2 intentos', ok: true },
            { c: 'consultar_agenda("hoy", "ventana de devolución")', r: '14:00–15:00 libre', ok: true }
          ] },

        { a: 'cliente', t: 'Ya, perfecto.', dur: 1200 },

        { a: 'ia', t: 'Listo, don Rodrigo. Recado enviado: la Hilux que dejó el lunes, y devolución entre las 2 y las 3. Que esté bien.',
          dur: 6200, lat: L(70, 162, 294, 82, 36),
          herr: [{ c: 'tomar_recado("Rodrigo Salinas", "Hilux dejada el lunes", urgencia: "normal")', r: 'enviado al WhatsApp del dueño', ok: true }],
          campos: { accion: 'recado + devolución consentida 14:00–15:00' } },

        { a: 'cliente', t: 'Ya, gracias. Chao.', dur: 1300 },

        { a: 'sys', t: 'Llamada terminada · resultado: recado tomado + devolución agendada con consentimiento grabado' }
      ],
      wa: {
        titulo: 'Taller Hermanos Peña',
        cuerpo: '<span class="rot">RECADO</span>\n<b>Rodrigo Salinas</b> pregunta por su <b>Hilux</b>, la dejó el lunes.\nPidió hablar contigo. Le dije que no tenía cómo pasarlo con nadie y quedó en devolución.\n\n<span class="rot">DEVOLUCIÓN AGENDADA</span>\nHoy, 14:00–15:00. Él autorizó que lo llamen (queda grabado).\n\nLlamar ahora: +56 9 6631 4478'
      }
    },

    {
      id: 'hotel',
      rotulo: 'Hotel Casa Nogal',
      cuando: 'sábado 02:47',
      de: '+56 2 2789 3341',
      comuna: 'Pucón',
      contexto: 'Las 2:47 de la madrugada. Sin Fonalta esto era casilla de voz.',
      campos: { intencion: '—', quien: '—', asunto: '—', accion: '—' },
      turnos: [
        { a: 'sys', t: 'Llamada entrante · +56 2 2789 3341 · sábado 02:47 · la recepción del hotel cerró a las 22:00' },

        { a: 'ia', t: 'Aló, le habla la asistente virtual del Hotel Casa Nogal.',
          dur: 3200, lat: L(0, 0, 0, 40, 0), flag: 'divulgacion',
          campos: { intencion: 'saludo' } },

        { a: 'ia', t: 'Soy una inteligencia artificial y la llamada se graba. ¿En qué le ayudo?',
          dur: 3600 },

        { a: 'cliente', t: 'Uy, perdón. Pensé que no iban a contestar a esta hora. ¿A qué hora atienden ustedes?',
          dur: 5000 },

        { a: 'ia', t: 'Yo contesto las 24 horas. La recepción del hotel atiende de 8 de la mañana a 10 de la noche, pero si necesita algo ahora yo le puedo ayudar. Dígame.',
          dur: 6800, lat: L(76, 170, 304, 86, 42),
          herr: [{ c: 'buscar_conocimiento("horario de atención")', r: '08:00–22:00, recepción', ok: true }],
          nota: 'La IA distingue entre SU horario (24/7) y el del negocio (8 a 22). Confundir los dos es el error clásico de estos sistemas.',
          campos: { intencion: 'consulta de horario' } },

        { a: 'cliente', t: 'Ya. Es que quiero saber si tienen pieza para el fin de semana largo de septiembre, para dos personas.',
          dur: 5600 },

        { a: 'ia', t: 'Déjeme ver… Para el 18, 19 y 20 de septiembre me queda una habitación doble con vista al lago, a $128.000 la noche, con desayuno. ¿Se la reservo?',
          dur: 8000, lat: L(118, 248, 448, 96, 30), relleno: 620, flag: 'relleno',
          herr: [{ c: 'consultar_disponibilidad("18–20 sep", 2)', r: '1 doble vista al lago · $128.000/noche', ok: true }],
          nota: 'ESTE TURNO SE PASÓ DEL PRESUPUESTO: 940 ms, sobre los 800 de diseño. La regla: cuando el turno pasa de 900 ms, la IA emite un relleno («déjeme ver…») a los 620 ms mientras llega el primer token, en vez de dejar al que llama en el vacío. Un silencio de 940 ms suena a robot; un «déjeme ver» a los 620 ms suena a persona buscando. Lo estamos mostrando a propósito: el p95 existe y no lo vamos a esconder.',
          campos: { intencion: 'reservar', asunto: 'doble, 18–20 sep, 2 personas' } },

        { a: 'cliente', t: '¿Y tiene estacionamiento?', dur: 1800 },

        { a: 'ia', t: 'Sí, estacionamiento sin costo para los huéspedes. Son 8 lugares y no se reservan.',
          dur: 4400, lat: L(72, 166, 296, 84, 33),
          herr: [{ c: 'buscar_conocimiento("estacionamiento")', r: '8 lugares, gratis, no reservables', ok: true }] },

        { a: 'cliente', t: 'Ya. ¿Y aceptan mascotas? Porque llevo un perro chico.', dur: 3600 },

        { a: 'ia', t: 'Eso no lo tengo en mi ficha y no se lo voy a inventar: el hotel no me dejó la política de mascotas. Se lo consulto a recepción apenas abran a las 8 y le responden por WhatsApp a este número. Igual le puedo dejar la habitación tomada sin compromiso hasta mañana al mediodía, para que no se la ganen. ¿Le parece?',
          dur: 13000, lat: L(74, 172, 300, 88, 36), flag: 'nosupo',
          herr: [
            { c: 'buscar_conocimiento("mascotas · perros · pet friendly")', r: '0 resultados en la ficha', ok: false },
            { c: 'marcar_no_supo("¿aceptan mascotas?")', r: 'registrado · va al dueño', ok: true }
          ],
          nota: 'Otra vez: sin herramienta, sin afirmación. Fíjate en lo que sí hace igual: no se queda paralizada. Admite lo que no sabe Y avanza con lo que sí puede hacer. Un «no sé» que además cierra la venta.',
          campos: { accion: 'reserva tentativa' } },

        { a: 'cliente', t: 'Ya, déjemela tomada. Gracias.', dur: 2100 },

        { a: 'ia', t: '¿Su nombre?', dur: 1200, lat: L(68, 158, 288, 80, 32) },

        { a: 'cliente', t: 'Ignacio Ovalle.', dur: 1400 },

        { a: 'ia', t: 'Listo, don Ignacio. Doble con vista al lago, del 18 al 20 de septiembre, tomada sin compromiso hasta mañana a las 12. Y mañana le confirman lo del perro. Buenas noches.',
          dur: 8600, lat: L(76, 168, 302, 86, 47),
          herr: [{ c: 'reservar_tentativa("Ignacio Ovalle", "doble lago", "18–20 sep", "vence 12:00")', r: 'bloqueada 12 h', ok: true }],
          campos: { quien: 'Ignacio Ovalle' } },

        { a: 'cliente', t: 'Ya, gracias. Chao.', dur: 1400 },

        { a: 'sys', t: 'Llamada terminada · 02:47 de la madrugada · resultado: reserva tentativa + 1 pregunta sin responder' }
      ],
      wa: {
        titulo: 'Hotel Casa Nogal',
        cuerpo: '<span class="rot">RESERVA TENTATIVA</span>\n<b>Ignacio Ovalle</b> · doble con vista al lago, 18–20 sep (fin de semana largo).\n$128.000 la noche. Tomada sin compromiso hasta hoy a las 12:00.\n\n<span class="rot">NO SUPE RESPONDER</span>\n«¿Aceptan mascotas?» Lleva un perro chico.\nRespóndeme acá y le contesto yo.\n\n<b>Esta llamada entró a las 2:47 de la madrugada.</b> Sin Fonalta era casilla de voz.'
      }
    }
  ];

  /* ═══════════════════════════ ESTADO ════════════════════════════════
     Un solo reloj virtual (E.reloj, en ms de llamada) que avanza SÓLO
     mientras la llamada corre, escalado por la velocidad. Todo —la onda,
     el tipeo, la cuenta de latencia, el cronómetro— lee de ese reloj.
     Así pausar funciona en cualquier punto, incluso en medio del silencio
     de "pensando", y la duración final es exactamente la del guión.
     ══════════════════════════════════════════════════════════════════ */

  var E = {
    llamada: LLAMADAS[0],
    i: 0,              // próximo turno a reproducir
    corriendo: false,
    vel: 1,
    lats: [],
    reloj: 0,          // ms transcurridos de la llamada
    energia: 0.04,
    quien: 'sys',
    act: null,         // actividad en curso: {tipo, paso, el, t0, dur}
    ultimoFrame: 0
  };

  var $ = function (s) { return document.querySelector(s); };
  var trans   = $('#trans');
  var lienzo  = $('#onda');
  var quienEl = $('#quien');
  var relojEl = $('#reloj');
  var cajaEl  = $('#linea-caja');
  var hudN    = $('#hud-n');
  var hudB    = $('#hud-b');
  var hudD    = $('#hud-d');
  var hudP    = $('#hud-p');
  var notaEl  = $('#diag-nota');
  var notaCaja= $('#diag-nota-caja');
  var herrEl  = $('#diag-herr');
  var camposEl= $('#diag-campos');
  var waEl    = $('#wa');
  var waT     = $('#wa-titulo');
  var waC     = $('#wa-cuerpo');
  var btnPlay = $('#btn-play');
  var saltosEl= $('#saltos');
  var metaEl  = $('#lc-meta');
  var ctxEl   = $('#lc-ctx');

  var COLORES = { red: 'var(--c2)', asr: 'var(--c1)', llm: 'var(--c5)', tts: 'var(--c4)', jit: 'var(--c3)' };
  var NOMBRES = { red: 'red', asr: 'ASR', llm: 'LLM', tts: 'TTS', jit: 'jitter' };
  var GAP = 380;      // silencio natural entre turnos
  var GAP_CORTE = 110; // tras un barge-in el cliente ya está encima
  var GAP_SYS = 650;

  /* duración total de un guión, para poder mostrarla sin reproducirla */
  function duracion(ll) {
    var t = 0;
    ll.turnos.forEach(function (p) {
      if (p.a === 'sys') { t += GAP_SYS; return; }
      t += (p.lat ? p.lat.total : 0);
      t += (p.corte != null ? p.corte : (p.dur || 0));
      t += (p.corte != null ? GAP_CORTE : GAP);
    });
    return t;
  }

  /* ═══════════════════════ EL LAZO ÚNICO ═════════════════════════════ */

  function mmss(ms) {
    var s = Math.max(0, Math.round(ms / 1000));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }

  var ctx = lienzo.getContext('2d'), W = 0, H = 0;
  function medir() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var r = lienzo.getBoundingClientRect();
    W = Math.max(r.width, 1); H = Math.max(r.height, 1);
    lienzo.width = Math.round(W * dpr); lienzo.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function onda() {
    var t = (REDUCIDO ? 1400 : E.reloj) / 1000;
    var n = W < 420 ? 44 : (W < 700 ? 68 : 96);
    var paso = W / n, ancho = Math.max(2, paso * 0.46), medio = H / 2;
    var col = E.quien === 'ia' ? '#F0A93F' : (E.quien === 'cliente' ? '#D6C9B8' : '#5C5042');
    ctx.clearRect(0, 0, W, H);
    for (var k = 0; k < n; k++) {
      var x = k / n;
      var a = Math.abs(
        0.40 + 0.32 * Math.sin(x * 8.3 + t * 3.4)
             + 0.22 * Math.sin(x * 19.1 - t * 5.2)
             + 0.13 * Math.sin(x * 37.7 + t * 2.1)
      );
      a = Math.max(0.03, Math.min(1, a * (0.28 + 0.72 * Math.sin(Math.PI * x)) * E.energia + 0.028));
      var alto = Math.max(2, a * (H - 12));
      ctx.globalAlpha = 0.18 + 0.82 * a;
      ctx.fillStyle = col;
      var px = k * paso + (paso - ancho) / 2, py = medio - alto / 2;
      if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(px, py, ancho, alto, 2); ctx.fill(); }
      else ctx.fillRect(px, py, ancho, alto);
    }
    ctx.globalAlpha = 1;
  }

  /* El único requestAnimationFrame del demo. */
  function lazo(ahora) {
    var dt = E.ultimoFrame ? Math.min(ahora - E.ultimoFrame, 64) : 0;
    E.ultimoFrame = ahora;

    if (E.corriendo) {
      E.reloj += dt * E.vel;
      avanzar();
      relojEl.textContent = mmss(E.reloj);
    }
    if (!REDUCIDO) onda();
    requestAnimationFrame(lazo);
  }

  /* Avanza la actividad en curso según el reloj. */
  function avanzar() {
    var A = E.act;
    if (!A) { siguienteTurno(); return; }
    var t = E.reloj - A.t0;   // ms dentro de la actividad

    if (A.tipo === 'pensando') {
      var lat = A.paso.lat.total;
      E.energia = 0.045;
      if (t < lat) {
        hudN.innerHTML = Math.round(t).toLocaleString('es-CL') + '<small>ms</small>';
        hudN.setAttribute('data-sobre', t > 800 ? 'si' : 'no');
        if (A.paso.relleno && t >= A.paso.relleno && !A.rellenoPuesto) {
          A.el.p.textContent = 'Déjeme ver…';
          A.rellenoPuesto = true;
        }
      } else {
        A.el.p.textContent = '';
        empezarHabla(A.paso, A.el, A.t0 + lat);
      }
      return;
    }

    if (A.tipo === 'hablando') {
      var limite = A.paso.corte != null ? A.paso.corte : A.paso.dur;
      var k = Math.min(1, t / limite);
      var hasta = Math.round(k * (A.paso.t.length * (limite / A.paso.dur)));
      A.el.p.textContent = A.paso.t.slice(0, Math.min(hasta, A.paso.t.length));
      if (k < 1) {
        if (!A.cursorPuesto) { A.el.p.appendChild(A.cursor); A.cursorPuesto = true; }
        else A.el.p.appendChild(A.cursor);
        E.energia = 0.52 + 0.48 * Math.abs(Math.sin(E.reloj / (E.quien === 'ia' ? 165 : 135)));
      } else {
        E.energia = 0.05;
        if (A.paso.corte != null) {
          var m = document.createElement('span');
          m.className = 'trunc';
          m.textContent = ' — [interrumpida a los ' + (A.paso.corte / 1000).toFixed(1).replace('.', ',') +
                          ' s · el turno del modelo se trunca acá]';
          A.el.p.appendChild(m);
        }
        trans.scrollTop = trans.scrollHeight;
        E.act = { tipo: 'gap', t0: E.reloj, dur: A.paso.corte != null ? GAP_CORTE : GAP };
      }
      return;
    }

    if (A.tipo === 'gap') {
      E.energia = 0.05;
      if (t >= A.dur) { E.act = null; siguienteTurno(); }
      return;
    }
  }

  function empezarHabla(paso, el, t0) {
    if (paso.lat) { E.lats.push(paso.lat.total); hudPinta(paso.lat); }
    if (paso.herr) herrPinta(paso.herr);
    etiquetas(el.x, paso);
    trans.scrollTop = trans.scrollHeight;

    if (REDUCIDO) {
      var limite = paso.corte != null ? paso.corte : paso.dur;
      el.p.textContent = paso.t.slice(0, Math.round(paso.t.length * (limite / paso.dur)));
      if (paso.corte != null) {
        var m = document.createElement('span');
        m.className = 'trunc';
        m.textContent = ' — [interrumpida a los ' + (paso.corte / 1000).toFixed(1).replace('.', ',') + ' s]';
        el.p.appendChild(m);
      }
      E.act = { tipo: 'gap', t0: t0, dur: paso.corte != null ? GAP_CORTE : GAP };
      return;
    }
    var cur = document.createElement('span');
    cur.className = 'cursor';
    E.act = { tipo: 'hablando', paso: paso, el: el, t0: t0, cursor: cur };
  }

  function siguienteTurno() {
    if (E.i >= E.llamada.turnos.length) { fin(); return; }
    var paso = E.llamada.turnos[E.i];
    E.i++;
    E.quien = paso.a;
    quienEl.dataset.a = paso.a;
    quienEl.textContent = paso.a === 'ia' ? '◤ habla Fonalta'
                        : paso.a === 'cliente' ? '◤ habla el cliente' : '◤ línea';

    if (paso.a === 'sys') {
      var s = nuevoTurno(paso);
      s.p.textContent = paso.t;
      E.energia = 0.04;
      trans.scrollTop = trans.scrollHeight;
      E.act = { tipo: 'gap', t0: E.reloj, dur: GAP_SYS };
      return;
    }

    var el = nuevoTurno(paso);
    if (paso.campos) { Object.assign(campos, paso.campos); camposPinta(); }
    notaCaja.dataset.vivo = paso.nota ? 'si' : 'no';
    if (paso.nota) notaEl.textContent = paso.nota;

    if (paso.lat && paso.lat.total > 60) {
      var pen = document.createElement('span');
      pen.style.color = 'var(--tiza-3)';
      pen.textContent = '· · ·';
      el.p.appendChild(pen);
      E.act = { tipo: 'pensando', paso: paso, el: el, t0: E.reloj };
    } else {
      el.p.textContent = '';
      empezarHabla(paso, el, E.reloj);
    }
  }

  /* ═══════════════════════════ HUD ═══════════════════════════════════ */

  function hudReset() {
    hudN.textContent = '—';
    hudN.removeAttribute('data-sobre');
    hudB.innerHTML = '';
    hudD.innerHTML = '<span style="color:var(--tiza-3)">el reloj de latencia se enciende en el primer turno de la IA</span>';
    hudP.innerHTML = '';
  }

  function percentiles() {
    var o = E.lats.slice().sort(function (a, b) { return a - b; });
    if (!o.length) return null;
    return { p50: o[Math.floor(o.length * 0.5)],
             p95: o[Math.min(o.length - 1, Math.floor(o.length * 0.95))] };
  }

  function hudPinta(lat) {
    var sobre = lat.total > 800;
    hudN.innerHTML = lat.total.toLocaleString('es-CL') + '<small>ms</small>';
    hudN.setAttribute('data-sobre', sobre ? 'si' : 'no');
    hudB.innerHTML = '';
    hudD.innerHTML = '';
    ['red', 'asr', 'llm', 'tts', 'jit'].forEach(function (k) {
      if (!lat[k]) return;
      var s = document.createElement('span');
      s.style.width = (lat[k] / lat.total * 100) + '%';
      s.style.background = COLORES[k];
      hudB.appendChild(s);
      var d = document.createElement('span');
      d.innerHTML = '<i style="background:' + COLORES[k] + '"></i>' + NOMBRES[k] + ' ' + lat[k];
      hudD.appendChild(d);
    });
    if (lat.total === 40) {
      hudD.innerHTML = '<span style="color:var(--tiza-3)">saludo pre-sintetizado · no pasa por el modelo</span>';
    }
    var p = percentiles();
    if (p) {
      hudP.innerHTML = 'de esta llamada · p50 <b>' + p.p50 + ' ms</b> · p95 <b>' + p.p95 +
        ' ms</b> · presupuesto <b>800 ms</b>' +
        (sobre ? ' · <span style="color:var(--c3)">este turno se pasó → se emitió relleno</span>' : '');
    }
  }

  /* ═══════════════════════════ DIAGNÓSTICO ═══════════════════════════ */

  var campos = {};
  function camposReset() {
    campos = { intencion: '—', quien: '—', asunto: '—', accion: '—' };
    camposPinta();
  }
  function camposPinta() {
    var rot = { intencion: 'Intención', quien: 'Quién', asunto: 'Asunto', accion: 'Acción' };
    camposEl.innerHTML = '';
    Object.keys(rot).forEach(function (k) {
      var d = document.createElement('div');
      d.className = 'campo';
      d.innerHTML = '<dt>' + rot[k] + '</dt><dd class="' + (campos[k] === '—' ? 'vacio' : '') + '">' +
        (campos[k] === '—' ? 'sin extraer' : esc(campos[k])) + '</dd>';
      camposEl.appendChild(d);
    });
  }
  function herrVacia() {
    herrEl.innerHTML = '<div style="color:var(--tiza-3);font-size:.68rem;border:0">sin llamadas a herramientas todavía</div>';
  }
  function herrPinta(hs) {
    if (!hs || !hs.length) return;
    if (herrEl.dataset.vacia !== 'no') { herrEl.innerHTML = ''; herrEl.dataset.vacia = 'no'; }
    hs.forEach(function (h) {
      var d = document.createElement('div');
      d.innerHTML = '<span class="pt ' + (h.ok ? 'si' : 'no') + '"></span>' +
        '<span><code>' + esc(h.c) + '</code><em>→ ' + esc(h.r) + '</em></span>';
      herrEl.appendChild(d);
    });
    herrEl.scrollTop = herrEl.scrollHeight;
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ═══════════════════════════ TURNOS ════════════════════════════════ */

  var ETIQ = {
    divulgacion:   { t: 'divulgación de IA · seg. 3',  c: 'ok' },
    barge:         { t: 'interrumpida (barge-in)',     c: 'corte' },
    interrumpe:    { t: 'el cliente habla encima',     c: 'corte' },
    nosupo:        { t: 'no lo sabe · lo admite',      c: 'corte' },
    sinhumano:     { t: 'piden un humano · no hay',    c: 'corte' },
    relleno:       { t: 'sobre presupuesto · relleno', c: 'corte' },
    consentimiento:{ t: 'consentimiento grabado',      c: 'ok' }
  };

  function nuevoTurno(paso) {
    var d = document.createElement('div');
    d.className = 'turno';
    d.dataset.a = paso.a;
    var x = document.createElement('div');
    x.className = 'turno__x';
    var p = document.createElement('p');
    x.appendChild(p);
    if (paso.a !== 'sys') {
      var q = document.createElement('span');
      q.className = 'turno__q';
      q.textContent = paso.a === 'ia' ? 'Fonalta' : 'Cliente';
      d.appendChild(q);
    }
    d.appendChild(x);
    trans.appendChild(d);
    trans.scrollTop = trans.scrollHeight;
    return { caja: d, x: x, p: p };
  }

  function etiquetas(x, paso) {
    var e = document.createElement('div');
    e.className = 'eti';
    if (paso.lat) {
      var b = document.createElement('span');
      b.className = 'lat';
      b.textContent = paso.lat.total.toLocaleString('es-CL') + ' ms';
      if (paso.lat.total > 800) b.setAttribute('data-sobre', 'si');
      e.appendChild(b);
    }
    if (paso.relleno) {
      var r = document.createElement('span');
      r.className = 'corte';
      r.textContent = 'relleno a los ' + paso.relleno + ' ms';
      e.appendChild(r);
    }
    if (paso.flag && ETIQ[paso.flag]) {
      var f = document.createElement('span');
      f.className = ETIQ[paso.flag].c;
      f.textContent = ETIQ[paso.flag].t;
      e.appendChild(f);
    }
    if (e.children.length) x.appendChild(e);
  }

  /* ═══════════════════════════ FIN ═══════════════════════════════════ */

  var iconoPlay    = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  var iconoPausa   = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h3v14H7zM14 5h3v14h-3z"/></svg>';
  var iconoRepetir = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>';

  function fin() {
    E.corriendo = false;
    E.act = null;
    cajaEl.dataset.estado = 'colgada';
    E.energia = 0.03;
    E.quien = 'sys';
    quienEl.dataset.a = 'sys';
    quienEl.textContent = '◤ colgó';
    relojEl.textContent = mmss(E.reloj);
    btnPlay.innerHTML = iconoRepetir + ' De nuevo';

    waT.textContent = 'Fonalta · ' + E.llamada.wa.titulo;
    waC.innerHTML = 'Llamada ' + E.llamada.cuando + ' · ' + mmss(E.reloj) + ' · ' + E.llamada.de +
                    '\n\n' + E.llamada.wa.cuerpo;
    waEl.dataset.ver = 'si';

    var p = percentiles();
    if (p) {
      hudP.innerHTML = 'llamada cerrada · <b>' + E.lats.length + ' turnos de la IA</b> · p50 <b>' +
        p.p50 + ' ms</b> · p95 <b>' + p.p95 + ' ms</b> · presupuesto <b>800 ms</b>';
    }
  }

  /* ═══════════════════════════ CONTROL ═══════════════════════════════ */

  function cargar(ll) {
    E.llamada = ll;
    E.i = 0;
    E.lats = [];
    E.reloj = 0;
    E.corriendo = false;
    E.act = null;
    E.energia = 0.04;
    E.quien = 'sys';
    trans.innerHTML = '';
    herrEl.dataset.vacia = 'si';
    herrVacia();
    notaEl.textContent = '';
    notaCaja.dataset.vivo = 'no';
    waEl.dataset.ver = 'no';
    cajaEl.dataset.estado = 'espera';
    quienEl.dataset.a = 'sys';
    quienEl.textContent = '◤ en espera';
    relojEl.textContent = '0:00';
    metaEl.textContent = ll.de + ' · ' + ll.comuna + ' · ' + ll.cuando;
    ctxEl.textContent = ll.contexto;
    hudReset();
    camposReset();
    btnPlay.innerHTML = iconoPlay + ' Contestar';
    document.querySelectorAll('.llams button').forEach(function (b) {
      b.setAttribute('aria-pressed', b.dataset.id === ll.id ? 'true' : 'false');
    });
    pintaSaltos();
  }

  function play() {
    if (E.i >= E.llamada.turnos.length && !E.act) cargar(E.llamada);
    E.corriendo = true;
    cajaEl.dataset.estado = 'activa';
    btnPlay.innerHTML = iconoPausa + ' Pausa';
  }
  function pausa() {
    E.corriendo = false;
    cajaEl.dataset.estado = 'pausa';
    btnPlay.innerHTML = iconoPlay + ' Seguir';
  }

  btnPlay.addEventListener('click', function () { E.corriendo ? pausa() : play(); });
  $('#btn-reset').addEventListener('click', function () { cargar(E.llamada); });

  document.querySelectorAll('.vel button').forEach(function (b) {
    b.addEventListener('click', function () {
      E.vel = parseFloat(b.dataset.v);
      document.querySelectorAll('.vel button').forEach(function (o) {
        o.setAttribute('aria-pressed', o === b ? 'true' : 'false');
      });
    });
  });

  document.querySelectorAll('.llams button').forEach(function (b) {
    b.addEventListener('click', function () {
      cargar(LLAMADAS.filter(function (x) { return x.id === b.dataset.id; })[0]);
    });
  });

  /* ---- saltos a los momentos que importan ---- */
  var SALTOS = [
    { flag: 'divulgacion',    txt: 'Ir a la <b>divulgación de IA</b> del segundo 3' },
    { flag: 'barge',          txt: 'Ver al cliente <b>interrumpir</b> a la IA' },
    { flag: 'nosupo',         txt: 'Ver a la IA <b>admitir que no sabe</b>' },
    { flag: 'sinhumano',      txt: 'Ver qué dice cuando <b>piden un humano y no hay</b>' },
    { flag: 'relleno',        txt: 'Ver un turno <b>sobre el presupuesto</b> de 800 ms' },
    { flag: 'consentimiento', txt: 'Ver el <b>consentimiento</b> para devolver el llamado' }
  ];
  function pintaSaltos() {
    saltosEl.innerHTML = '';
    SALTOS.forEach(function (s) {
      var idx = -1;
      E.llamada.turnos.forEach(function (t, i) { if (t.flag === s.flag && idx < 0) idx = i; });
      if (idx < 0) return;
      var b = document.createElement('button');
      b.innerHTML = '↦ ' + s.txt;
      b.addEventListener('click', function () { saltar(idx); });
      saltosEl.appendChild(b);
    });
  }

  /* Reconstruye la llamada hasta el turno pedido, al instante, y sigue desde ahí. */
  function saltar(destino) {
    cargar(E.llamada);
    var t = 0;
    for (var k = 0; k < destino; k++) {
      var p = E.llamada.turnos[k];
      var el = nuevoTurno(p);
      if (p.a === 'sys') { el.p.textContent = p.t; t += GAP_SYS; continue; }
      var limite = p.corte != null ? p.corte : p.dur;
      el.p.textContent = p.t.slice(0, Math.round(p.t.length * (limite / p.dur)));
      if (p.corte != null) {
        var m = document.createElement('span');
        m.className = 'trunc';
        m.textContent = ' — [interrumpida a los ' + (p.corte / 1000).toFixed(1).replace('.', ',') + ' s]';
        el.p.appendChild(m);
      }
      if (p.lat) E.lats.push(p.lat.total);
      etiquetas(el.x, p);
      if (p.herr) herrPinta(p.herr);
      if (p.campos) Object.assign(campos, p.campos);
      if (p.nota) { notaEl.textContent = p.nota; notaCaja.dataset.vivo = 'si'; }
      t += (p.lat ? p.lat.total : 0) + limite + (p.corte != null ? GAP_CORTE : GAP);
    }
    camposPinta();
    var pc = percentiles();
    if (pc && E.lats.length) {
      var ult = E.llamada.turnos.slice(0, destino).filter(function (x) { return x.lat; }).pop();
      if (ult) hudPinta(ult.lat);
    }
    E.i = destino;
    E.reloj = t;
    relojEl.textContent = mmss(t);
    trans.scrollTop = trans.scrollHeight;
    play();
  }

  /* arranca el lazo y la primera llamada */
  medir();
  window.addEventListener('resize', medir);
  cargar(LLAMADAS[0]);
  if (REDUCIDO) { E.energia = 0.35; onda(); }
  requestAnimationFrame(lazo);

  /* ═══════════════════════════ PESTAÑAS ══════════════════════════════ */

  document.querySelectorAll('.pest button').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.pest button').forEach(function (o) {
        o.setAttribute('aria-selected', o === b ? 'true' : 'false');
      });
      document.querySelectorAll('.vista').forEach(function (v) {
        v.hidden = v.id !== b.dataset.vista;
      });
      if (b.dataset.vista === 'vista-llamada') medir();
    });
  });

  /* ═══════════ BANDEJA "LO QUE NO SUPE" — el bucle de mejora ═════════ */

  var sinRespuesta = document.getElementById('sin-respuesta');
  document.querySelectorAll('.pregunta').forEach(function (pr) {
    var form = pr.querySelector('.pregunta__f');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var val = pr.querySelector('input').value.trim();
      if (!val) { pr.querySelector('input').focus(); return; }
      pr.dataset.resuelta = 'si';
      pr.querySelector('.pregunta__ok').innerHTML =
        '✓ Guardado en la ficha: «' + esc(val) + '». La IA ya lo sabe. La próxima persona que pregunte esto va a tener respuesta.';
      var quedan = document.querySelectorAll('.pregunta:not([data-resuelta="si"])').length;
      sinRespuesta.textContent = quedan;
      if (quedan === 0) {
        document.getElementById('bandeja-vacia').hidden = false;
      }
    });
  });

})();
