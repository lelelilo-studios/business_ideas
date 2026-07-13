/* ============================================================================
   CONTRALTA — demo. Estado en el cliente, datos mock, cero red.
   Los hallazgos NO están escritos a mano: se derivan del estado. Por eso,
   cuando resuelves uno, el riesgo en pesos baja de verdad y el finiquito
   cambia de resultado. Esa es la demostración.
   ========================================================================== */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var HOY = CL.hoy();
  var P = CL.PARAMS;

  /* ======================================================== DATOS MOCK ===== */
  /* Panificadora San Bernardo SpA. 15 trabajadores. Las fechas que tienen un
     reloj corriendo están ancladas a HOY para que el escenario se vea igual
     cualquier día que abras el demo. Las demás son fechas fijas.             */

  var INGRESO_FERNANDA = CL.fechaCorta(CL.masDias(HOY, -11));   /* contrato sin escriturar: día 11 de 15 */
  var SEPARACION_HECTOR = CL.fechaCorta(CL.masDias(HOY, -12));  /* finiquito: el plazo se está acabando */

  var EMPRESA = {
    nombre: 'Panificadora San Bernardo SpA',
    rut: '76.412.883-4',
    giro: 'Elaboración de pan y productos de panadería',
    comuna: 'San Bernardo, Región Metropolitana',
    direccion: 'Av. Colón 1842, San Bernardo',
    repLegal: 'Óscar Villalobos Bravo',
    repRut: '10.456.789-4',
    mutual: 'Mutual de Seguridad CChC'
  };

  var TRABAJADORES = [
    { id: 't1', nombre: 'Marisol Espinoza Fuentes', rut: '13.456.789-9', cargo: 'Maestra panadera',
      tipo: 'indefinido', ingreso: '2019-03-04', base: 890000, afp: 'Habitat', salud: 'Fonasa',
      jornadaContrato: 42, comuna: 'San Bernardo', hhee: 0,
      docs: { contrato: 1, anexo42: 1, karin: 1, riohs: 0, pactoHHEE: 0 } },

    { id: 't2', nombre: 'Rodrigo Cáceres Muñoz', rut: '12.987.654-9', cargo: 'Jefe de producción',
      tipo: 'indefinido', ingreso: '2021-06-01', base: 1290000, afp: 'Cuprum', salud: 'Colmena',
      jornadaContrato: 45, comuna: 'El Bosque', hhee: 0,
      docs: { contrato: 1, anexo42: 0, karin: 1, riohs: 0, pactoHHEE: 0 } },

    { id: 't3', nombre: 'Katherine Villablanca Soto', rut: '17.654.321-3', cargo: 'Vendedora de local',
      tipo: 'indefinido', ingreso: '2022-11-14', base: 620000, afp: 'Modelo', salud: 'Fonasa',
      jornadaContrato: 45, comuna: 'San Bernardo', hhee: 12,
      docs: { contrato: 1, anexo42: 0, karin: 1, riohs: 0, pactoHHEE: 0 } },

    { id: 't4', nombre: 'Jonathan Pizarro Aguilera', rut: '16.543.210-K', cargo: 'Repartidor',
      tipo: 'plazo_fijo', ingreso: '2025-09-01', base: 720000, afp: 'Modelo', salud: 'Fonasa',
      jornadaContrato: 45, comuna: 'La Cisterna', hhee: 8, renovaciones: 2,
      docs: { contrato: 1, anexo42: 0, karin: 1, riohs: 0, pactoHHEE: 0 } },

    { id: 't5', nombre: 'Camila Riquelme Tapia', rut: '18.234.567-9', cargo: 'Administrativa',
      tipo: 'indefinido', ingreso: '2023-02-20', base: 780000, afp: 'PlanVital', salud: 'Cruz Blanca',
      jornadaContrato: 42, comuna: 'San Bernardo', hhee: 0, fuero: 'maternal',
      docs: { contrato: 1, anexo42: 1, karin: 1, riohs: 0, pactoHHEE: 0 } },

    { id: 't6', nombre: 'Héctor Sandoval Lagos', rut: '13.876.543-1', cargo: 'Ayudante de panadería',
      tipo: 'indefinido', ingreso: '2017-11-20', base: 680000, afp: 'Provida', salud: 'Fonasa',
      jornadaContrato: 42, comuna: 'San Bernardo', hhee: 0, enTermino: true,
      separacion: SEPARACION_HECTOR, causal: '161', diasFeriado: 12.5,
      docs: { contrato: 1, anexo42: 1, karin: 1, riohs: 0, pactoHHEE: 0 } },

    { id: 't7', nombre: 'Fernanda Ortiz Cárdenas', rut: '21.456.789-K', cargo: 'Cajera',
      tipo: 'plazo_fijo', ingreso: INGRESO_FERNANDA, base: 560000, afp: 'Uno', salud: 'Fonasa',
      jornadaContrato: 42, comuna: 'San Bernardo', hhee: 0,
      docs: { contrato: 0, anexo42: 0, karin: 0, riohs: 0, pactoHHEE: 0 } },

    { id: 't8', nombre: 'Luis Alberto Contreras Rojas', rut: '14.567.890-0', cargo: 'Maestro pastelero',
      tipo: 'indefinido', ingreso: '2020-08-17', base: 950000, afp: 'Capital', salud: 'Banmédica',
      jornadaContrato: 45, comuna: 'Puente Alto', hhee: 14,
      docs: { contrato: 1, anexo42: 0, karin: 1, riohs: 0, pactoHHEE: 0 } },

    { id: 't9', nombre: 'Paola Miranda Sepúlveda', rut: '19.876.543-0', cargo: 'Vendedora de local',
      tipo: 'indefinido', ingreso: '2024-04-02', base: 600000, afp: 'Habitat', salud: 'Fonasa',
      jornadaContrato: 45, comuna: 'San Bernardo', hhee: 10,
      docs: { contrato: 1, anexo42: 0, karin: 1, riohs: 0, pactoHHEE: 0 } },

    { id: 't10', nombre: 'Ignacio Barrera Núñez', rut: '20.345.678-6', cargo: 'Bodeguero',
      tipo: 'indefinido', ingreso: '2023-07-10', base: 650000, afp: 'Modelo', salud: 'Fonasa',
      jornadaContrato: 45, comuna: 'El Bosque', hhee: 6,
      docs: { contrato: 1, anexo42: 0, karin: 1, riohs: 0, pactoHHEE: 0 } },

    { id: 't11', nombre: 'Verónica Salgado Peña', rut: '15.234.567-4', cargo: 'Administración y remuneraciones',
      tipo: 'indefinido', ingreso: '2022-03-01', base: 700000, afp: 'Cuprum', salud: 'Consalud',
      jornadaContrato: 30, comuna: 'San Bernardo', hhee: 0, parcial: true,
      docs: { contrato: 1, anexo42: 1, karin: 1, riohs: 0, pactoHHEE: 0 } },

    { id: 't12', nombre: 'Cristián Fuentealba Ávila', rut: '19.345.678-2', cargo: 'Repartidor',
      tipo: 'indefinido', ingreso: '2024-10-21', base: 700000, afp: 'PlanVital', salud: 'Fonasa',
      jornadaContrato: 45, comuna: 'La Pintana', hhee: 16,
      docs: { contrato: 1, anexo42: 0, karin: 1, riohs: 0, pactoHHEE: 0 } },

    { id: 't13', nombre: 'Daniela Quintana Vergara', rut: '20.987.654-K', cargo: 'Ayudante de pastelería',
      tipo: 'indefinido', ingreso: '2025-01-13', base: 529000, afp: 'Modelo', salud: 'Fonasa',
      jornadaContrato: 45, comuna: 'San Bernardo', hhee: 4,
      docs: { contrato: 1, anexo42: 0, karin: 1, riohs: 0, pactoHHEE: 0 } },

    { id: 't14', nombre: 'Mauricio Leiva Zúñiga', rut: '11.234.567-1', cargo: 'Maestro panadero',
      tipo: 'indefinido', ingreso: '2017-05-02', base: 920000, afp: 'Provida', salud: 'Nueva Masvida',
      jornadaContrato: 45, comuna: 'Calera de Tango', hhee: 0,
      docs: { contrato: 1, anexo42: 0, karin: 1, riohs: 0, pactoHHEE: 0 } },

    { id: 't15', nombre: 'Antonia Godoy Cifuentes', rut: '18.765.432-7', cargo: 'Vendedora de local',
      tipo: 'plazo_fijo', ingreso: '2026-05-05', base: 560000, afp: 'Uno', salud: 'Fonasa',
      jornadaContrato: 42, comuna: 'San Bernardo', hhee: 0, renovaciones: 0,
      docs: { contrato: 1, anexo42: 1, karin: 0, riohs: 0, pactoHHEE: 0 } }
  ];

  /* Estado mutable. Todo lo que el usuario cambia vive acá. */
  var S = {
    vista: 'tablero',
    trabajadores: TRABAJADORES.map(function (t) { return JSON.parse(JSON.stringify(t)); }),
    /* Cotizaciones del período de hace 2 meses: rechazadas en Previred y nadie revisó. */
    cotizacionesImpagas: ['t6', 't10', 't12'],
    cotizacionesJunioPagadas: false,
    riohs: false,
    protocoloKarin: false,
    pactoHHEEVigente: false,
    pactoHHEEVencio: CL.fechaCorta(CL.masDias(HOY, -25)),
    resueltos: {},
    filtroT: 'todos',
    ordenH: 'costo',
    abiertos: {},
    fin: {
      trabajador: 't6',
      causal: '161',
      termino: SEPARACION_HECTOR,
      avisoConAnticipacion: false,
      avisoInspeccion: false,
      registroAsistencia: false,
      sabadoHabil: true
    },
    finAhorro: 0,
    wiz: { paso: 1, datos: { nombre: '', rut: '', cargo: '', base: '', tipo: 'indefinido', jornada: 42, afp: 'Modelo', salud: 'Fonasa', ingreso: CL.fechaCorta(HOY) } }
  };

  function trab(id) { return S.trabajadores.filter(function (t) { return t.id === id; })[0]; }
  function activos() { return S.trabajadores.filter(function (t) { return !t.terminado; }); }
  function periodoImpago() {
    var m = HOY.getMonth() - 2, a = HOY.getFullYear();
    if (m < 0) { m += 12; a--; }
    return CL.MESES[m] + ' de ' + a;
  }

  /* ==================================================== HALLAZGOS (derivados) */

  function deudaCotizaciones() {
    return S.cotizacionesImpagas.reduce(function (s, id) {
      var t = trab(id);
      if (!t) return s;
      var g = CL.gratificacionMensual(t.base);
      return s + CL.cotizaciones(t.base + g.monto, t.afp, t.tipo).total;
    }, 0);
  }

  function conJornadaVieja() {
    return activos().filter(function (t) { return t.jornadaContrato === 45; });
  }

  /* Diferencia acumulada de horas extra por no bajar el divisor de 45 a 42.
     Devengado desde la entrada en vigencia de las 42 h (26-04-2026).          */
  function difHorasExtra() {
    var vig = CL.fecha('2026-04-26');
    var meses = Math.max(0, CL.difDias(vig, HOY) / 30.4375);
    var total = 0, detalle = [];
    conJornadaVieja().forEach(function (t) {
      if (!t.hhee) return;
      var h45 = CL.horaExtra(t.base, 45).extra;
      var h42 = CL.horaExtra(t.base, 42).extra;
      var dif = (h42 - h45) * t.hhee * meses;
      total += dif;
      detalle.push({ t: t, h45: h45, h42: h42, dif: dif });
    });
    return { total: Math.round(total), meses: meses, detalle: detalle };
  }

  function finiquitoHector() {
    var t = trab('t6');
    return CL.finiquito({
      base: t.base, ingreso: t.ingreso, termino: t.separacion, causal: t.causal,
      diasFeriado: t.diasFeriado, tipo: t.tipo, fuero: t.fuero,
      cotizacionesAlDia: S.cotizacionesImpagas.indexOf('t6') === -1,
      avisoConAnticipacion: false, avisoInspeccion: false, sabadoHabil: true
    });
  }

  function hallazgos() {
    var H = [];
    var multa = CL.rangoMulta(activos().length);
    var utm = P.utm.valor;

    /* ---- 1. Cotizaciones impagas → bloquea el finiquito (Ley Bustos) ------ */
    if (S.cotizacionesImpagas.length) {
      var deuda = deudaCotizaciones();
      var f = finiquitoHector();
      var bustos = f.baseCalculo * 3;
      H.push({
        id: 'cotiz-impagas', nivel: 'vencido',
        titulo: 'Cotizaciones de ' + periodoImpago() + ' impagas: ' + S.cotizacionesImpagas.length + ' trabajadores',
        resumen: 'Y uno de ellos es el que estás despidiendo.',
        cita: 'Art. 162 inc. 5 CT — Ley Bustos', citaTipo: 'norma',
        costo: Math.round(deuda + bustos),
        costoEtq: 'deuda + nulidad',
        porque: '<p>Las cotizaciones de <strong>' + periodoImpago() + '</strong> de ' +
          S.cotizacionesImpagas.map(function (id) { return trab(id).nombre.split(' ')[0] + ' ' + trab(id).nombre.split(' ')[1]; }).join(', ') +
          ' quedaron rechazadas en Previred y nadie revisó el archivo de rechazos.</p>' +
          '<p><strong>Héctor Sandoval es uno de ellos y lo estás despidiendo.</strong> Si al momento del despido ' +
          'las cotizaciones no están íntegramente pagadas, el despido <em>no produce el efecto de poner término ' +
          'al contrato</em>: sigues debiendo las remuneraciones hasta que convalides el despido pagando lo adeudado ' +
          'y le comuniques por carta certificada. Esto es lo que en la práctica se llama Ley Bustos, y es la forma ' +
          'más cara que existe de perder plata en una PYME.</p>' +
          '<p>Se arregla pagando <strong>antes</strong> de firmar el finiquito. Después es tarde.</p>',
        calculo:
          'Deuda previsional ' + periodoImpago() + ' (' + S.cotizacionesImpagas.length + ' trabajadores) ... <b>' + CL.clp(deuda) + '</b>\n' +
          'Base de cálculo de Héctor (sueldo + gratificación) ...... ' + CL.clp(f.baseCalculo) + '\n' +
          'Remuneraciones hasta convalidar (supuesto: 3 meses) ...... <b>' + CL.clp(bustos) + '</b>\n' +
          '                                                          ─────────────\n' +
          'Exposición total ......................................... <b>' + CL.clp(deuda + bustos) + '</b>\n' +
          '\n▲ Los 3 meses son un SUPUESTO nuestro, no un plazo legal. El período\n' +
          '  real corre hasta que convalidas: puede ser un mes o puede ser un año.',
        acciones: [
          { txt: 'Pagar la deuda y convalidar', primaria: true, fn: function () {
              S.cotizacionesImpagas = [];
              S.resueltos['cotiz-impagas'] = true;
              S.fin.cotizacionesAlDia = true;
              toast('Cotizaciones pagadas y despido convalidado. El finiquito de Héctor ya no es nulo.');
            } },
          { txt: 'Ver el finiquito afectado', fn: function () { irA('finiquito'); } }
        ]
      });
    }

    /* ---- 2. El finiquito de Héctor y su plazo de doble lectura ------------ */
    var t6 = trab('t6');
    if (t6 && !t6.terminado) {
      var fh = finiquitoHector();
      var venA = fh.plazos.corridosA;   /* sábado hábil */
      var venB = fh.plazos.corridosB;   /* sábado inhábil */
      H.push({
        id: 'finiquito-hector', nivel: venA < 0 ? 'vencido' : 'riesgo',
        titulo: 'Finiquito de Héctor Sandoval sin entregar',
        resumen: venA < 0
          ? 'Bajo un criterio de cómputo el plazo ya venció; bajo el otro te quedan ' + Math.max(0, venB) + ' días.'
          : 'Te quedan entre ' + Math.max(0, venA) + ' y ' + Math.max(0, venB) + ' días según el criterio de cómputo.',
        cita: 'Art. 177 CT — Ley 21.361', citaTipo: 'verificar',
        costo: Math.round(fh.riesgo.total),
        costoEtq: 'riesgo del término',
        porque: '<p>Héctor fue separado el <strong>' + CL.fechaLarga(t6.separacion) + '</strong>. El finiquito debe ' +
          'otorgarse y ponerse a disposición del trabajador dentro de <strong>10 días hábiles</strong> contados desde ' +
          'la separación. <span class="cita cita--verificar">Ley 21.361 — validar redacción vigente</span></p>' +
          '<p>Acá viene lo incómodo: <strong>el cómputo de los "días hábiles" no es pacífico.</strong> Si se excluyen ' +
          'sólo domingos y festivos, el plazo vence el ' + CL.fechaDia(fh.plazos.finiquitoA) + '. Si además se excluye ' +
          'el sábado, vence el ' + CL.fechaDia(fh.plazos.finiquitoB) + '. Contralta no te va a decir cuál es la buena: ' +
          'te muestra las dos y te recomienda <strong>la fecha más temprana</strong>. En un plazo, la duda siempre se ' +
          'resuelve entregando antes.</p>',
        calculo:
          'Separación .................. ' + CL.fechaDia(t6.separacion) + '\n' +
          'Plazo ....................... 10 días hábiles (Ley 21.361)\n\n' +
          'Criterio A — inhábiles: domingos y festivos\n' +
          '  vence ..................... <b>' + CL.fechaDia(fh.plazos.finiquitoA) + '</b> ' +
            (venA < 0 ? '(venció hace ' + Math.abs(venA) + ' día' + (Math.abs(venA) === 1 ? '' : 's') + ')' : '(faltan ' + venA + ' días)') + '\n' +
          'Criterio B — inhábiles: sábados, domingos y festivos\n' +
          '  vence ..................... <b>' + CL.fechaDia(fh.plazos.finiquitoB) + '</b> ' +
            (venB < 0 ? '(venció hace ' + Math.abs(venB) + ' días)' : '(faltan ' + venB + ' días)') + '\n\n' +
          '▲ Criterio de cómputo por validar con abogado laboral.\n' +
          '  Contralta te muestra la fecha conservadora en el tablero.',
        acciones: [
          { txt: 'Abrir el finiquito', primaria: true, fn: function () { irA('finiquito'); } }
        ]
      });
    }

    /* ---- 3. Contrato sin escriturar — el reloj del art. 9 ----------------- */
    var t7 = trab('t7');
    if (t7 && !t7.docs.contrato) {
      var vence = CL.masDias(t7.ingreso, 15);
      var quedan = CL.difDias(HOY, vence);
      H.push({
        id: 'contrato-fernanda', nivel: quedan <= 0 ? 'vencido' : quedan <= 5 ? 'vencido' : 'riesgo',
        titulo: 'Fernanda Ortiz lleva ' + CL.difDias(t7.ingreso, HOY) + ' días trabajando sin contrato firmado',
        resumen: quedan > 0 ? 'Quedan ' + quedan + ' días para escriturarlo.' : 'El plazo venció hace ' + Math.abs(quedan) + ' días.',
        cita: 'Art. 9 CT', citaTipo: 'norma',
        costo: Math.round(5 * utm),
        costoEtq: 'multa máxima',
        porque: '<p>El contrato de trabajo debe constar por escrito dentro de <strong>15 días</strong> de incorporado ' +
          'el trabajador (5 días si es por obra o faena determinada, o de duración menor a 30 días).</p>' +
          '<p>La multa es lo de menos: va de 1 a 5 UTM. <strong>Lo caro es la presunción.</strong> Si no hay contrato ' +
          'escrito, la ley presume que las estipulaciones del contrato son <em>las que declare el trabajador</em>. ' +
          'Si mañana Fernanda dice que le prometiste $900.000 y jornada de 30 horas, la carga de probar lo contrario ' +
          'es tuya, y no la tienes.</p>',
        calculo:
          'Fecha de ingreso ............ ' + CL.fechaDia(t7.ingreso) + '\n' +
          'Plazo art. 9 ................ 15 días corridos\n' +
          'Vence ....................... <b>' + CL.fechaDia(vence) + '</b>\n' +
          'Estado ...................... <b>' + (quedan > 0 ? 'quedan ' + quedan + ' días' : 'VENCIDO hace ' + Math.abs(quedan) + ' días') + '</b>\n\n' +
          'Multa art. 9 ................ 1 a 5 UTM = ' + CL.clp(utm) + ' a <b>' + CL.clp(5 * utm) + '</b>\n' +
          'Presunción del inc. 4 ....... las condiciones son las que declare\n' +
          '                              el trabajador. Sin techo.',
        acciones: [
          { txt: 'Generar el contrato ahora', primaria: true, fn: function () {
              S.wiz.paso = 1;
              S.wiz.datos = {
                nombre: t7.nombre, rut: t7.rut, cargo: t7.cargo, base: String(t7.base),
                tipo: 'plazo_fijo', jornada: 42, afp: t7.afp, salud: t7.salud, ingreso: t7.ingreso,
                prellenado: 't7'
              };
              irA('contratar');
              toast('Datos de Fernanda cargados en el generador de contrato.');
            } }
        ]
      });
    }

    /* ---- 4. Jornada de 45 h — ley 21.561 ---------------------------------- */
    var viejos = conJornadaVieja();
    if (viejos.length) {
      var dhe = difHorasExtra();
      H.push({
        id: 'jornada-42', nivel: 'riesgo',
        titulo: viejos.length + ' contratos todavía dicen 45 horas semanales',
        resumen: 'Desde el 26 de abril de 2026 el máximo legal es 42.',
        cita: 'Ley 21.561', citaTipo: 'norma',
        costo: Math.round(dhe.total + 4 * utm),
        costoEtq: 'diferencias + multa',
        porque: '<p>La ley 21.561 bajó la jornada ordinaria máxima de forma gradual: <strong>44 horas desde el ' +
          '26-04-2024, 42 desde el 26-04-2026 y 40 desde el 26-04-2028</strong>. Hoy el techo es 42.</p>' +
          '<p>La rebaja opera por ley y no depende de que firmes un anexo. Pero la <em>distribución</em> de la jornada ' +
          'sí se acuerda, y tener el contrato diciendo 45 es la prueba escrita en tu contra de que no ajustaste nada. ' +
          '<span class="cita cita--verificar">criterio DT — validar</span></p>' +
          '<p><strong>Y hay una trampa aritmética que casi nadie ve:</strong> al bajar la jornada sin bajar el sueldo, ' +
          'la hora ordinaria vale más, y por lo tanto la hora extra también. Si sigues pagando las horas extra dividiendo ' +
          'por 45, estás pagando de menos todos los meses, y esa diferencia se cobra después con reajustes e intereses.</p>',
        calculo:
          'Fórmula del valor de la hora (criterio DT):\n' +
          '  hora ordinaria = (sueldo base / 30 × 28) / jornada semanal\n' +
          '  hora extra     = hora ordinaria × 1,5   (art. 32, recargo 50%)\n\n' +
          (dhe.detalle.length ? dhe.detalle.map(function (d) {
            return d.t.nombre.split(' ')[0] + ' — base ' + CL.clp(d.t.base) + ', ' + d.t.hhee + ' h extra/mes\n' +
              '  con 45 h: ' + CL.clp(d.h45) + '/h    con 42 h: <b>' + CL.clp(d.h42) + '/h</b>' +
              '   (+' + CL.clp(d.h42 - d.h45) + ')';
          }).join('\n') : '(ninguno de los contratos con 45 h registra horas extra)') + '\n\n' +
          'Meses devengados desde el 26-04-2026 ..... ' + CL.fmtNum(dhe.meses) + '\n' +
          'Diferencia acumulada ..................... <b>' + CL.clp(dhe.total) + '</b>\n' +
          'Multa estimada (pequeña empresa, art. 506) . ' + CL.clp(4 * utm) + '\n\n' +
          '▲ La multa es una estimación al medio del rango 1–10 UTM. La fija el fiscalizador.',
        acciones: [
          { txt: 'Generar los ' + viejos.length + ' anexos de jornada', primaria: true, fn: function () {
              viejos.forEach(function (t) { t.jornadaContrato = 42; t.docs.anexo42 = 1; });
              S.resueltos['jornada-42'] = true;
              toast(viejos.length + ' anexos de jornada generados. Falta que los firmen: quedan en pendientes.');
            } }
        ]
      });
    }

    /* ---- 5. Plazo fijo en segunda renovación ------------------------------ */
    var t4 = trab('t4');
    if (t4 && t4.tipo === 'plazo_fijo' && t4.renovaciones >= 2) {
      var f4 = CL.finiquito({
        base: t4.base, ingreso: t4.ingreso, termino: CL.fechaCorta(HOY), causal: '159-4',
        diasFeriado: 4.5, tipo: 'plazo_fijo_2a_renovacion', cotizacionesAlDia: true
      });
      H.push({
        id: 'plazo-fijo-jonathan', nivel: 'vencido',
        titulo: 'Jonathan Pizarro ya no es un contrato a plazo fijo',
        resumen: 'Segunda renovación: pasó a indefinido por el solo ministerio de la ley.',
        cita: 'Art. 159 N°4 CT', citaTipo: 'norma',
        costo: Math.round(f4.riesgo.total),
        costoEtq: 'si lo "no renuevas"',
        porque: '<p>El contrato de Jonathan (RUT ' + t4.rut + ') se firmó a plazo fijo el ' + CL.fechaLarga(t4.ingreso) +
          ' y se ha renovado <strong>dos veces</strong>. La segunda renovación lo transforma en indefinido por el solo ' +
          'ministerio de la ley. También pasa si el trabajador sigue prestando servicios con conocimiento del empleador ' +
          'después de vencido el plazo.</p>' +
          '<p>Si en septiembre decides "no renovarle el contrato", eso no es un vencimiento de plazo: <strong>es un ' +
          'despido</strong>. Y un despido sin causal válida se paga con indemnización por años de servicio más el ' +
          'recargo del art. 168.</p>',
        calculo:
          'Contrato ................ plazo fijo, 2 renovaciones\n' +
          'Efecto legal ............ <b>indefinido</b> (art. 159 N°4)\n\n' +
          'Si lo terminas invocando "vencimiento del plazo":\n' +
          '  Indemnización años de servicio ..... ' + CL.clp(f4.aniosIAS * f4.baseCalculo) + '\n' +
          '  Recargo 50% (art. 168 letra a) ..... ' + CL.clp(f4.aniosIAS * f4.baseCalculo * 0.5) + '\n' +
          '                                      ─────────────\n' +
          '  Exposición ......................... <b>' + CL.clp(f4.riesgo.total) + '</b>\n\n' +
          '▲ Los recargos del art. 168 (30/50/80/100%) dependen de la causal invocada.\n' +
          '  Verificar con abogado antes de terminar este contrato.',
        acciones: [
          { txt: 'Reclasificar como indefinido', primaria: true, fn: function () {
              t4.tipo = 'indefinido'; t4.renovaciones = 0;
              S.resueltos['plazo-fijo-jonathan'] = true;
              toast('Jonathan Pizarro reclasificado como contrato indefinido. Se generó el anexo.');
            } },
          { txt: 'Ver ficha', fn: function () { abrirFicha('t4'); } }
        ]
      });
    }

    /* ---- 6. Fuero maternal ------------------------------------------------ */
    var t5 = trab('t5');
    if (t5 && t5.fuero && !S.resueltos['fuero-camila']) {
      var f5 = CL.finiquito({
        base: t5.base, ingreso: t5.ingreso, termino: CL.fechaCorta(HOY), causal: '161',
        diasFeriado: 9, tipo: 'indefinido', fuero: 'maternal', cotizacionesAlDia: true
      });
      H.push({
        id: 'fuero-camila', nivel: 'vencido',
        titulo: 'Camila Riquelme tiene fuero maternal y está en la lista de reducción',
        resumen: 'No se puede despedir sin autorización judicial previa.',
        cita: 'Arts. 174 y 201 CT', citaTipo: 'norma',
        costo: Math.round(f5.baseCalculo * 6),
        costoEtq: 'si la despides',
        porque: '<p>Camila declaró embarazo en marzo. El fuero maternal corre desde el embarazo y hasta un año después ' +
          'de expirado el descanso postnatal.</p>' +
          '<p>Un trabajador con fuero <strong>no puede ser despedido sin autorización previa del juez</strong> ' +
          '(desafuero), y sólo por causales acotadas. Si la despides igual, el despido es nulo: procede la ' +
          'reincorporación y el pago de las remuneraciones de todo el período de separación. Esto no se arregla ' +
          'pagando más — se para acá.</p>' +
          '<p>Contralta bloquea el flujo de término para Camila. Para levantarlo hace falta la resolución judicial.</p>',
        calculo:
          'Fuero ................... maternal (declarado en marzo)\n' +
          'Requisito para despedir . autorización judicial previa (desafuero)\n' +
          'Estado .................. <b>BLOQUEADO</b>\n\n' +
          'Si se despide sin desafuero:\n' +
          '  Remuneraciones del período de separación\n' +
          '  (supuesto: 6 meses × ' + CL.clp(f5.baseCalculo) + ') ..... <b>' + CL.clp(f5.baseCalculo * 6) + '</b>\n' +
          '  + reincorporación obligatoria\n\n' +
          '▲ Los 6 meses son un SUPUESTO. El período real depende del juicio.',
        acciones: [
          { txt: 'Entendido, bloquear término', primaria: true, fn: function () {
              S.resueltos['fuero-camila'] = true;
              toast('Término bloqueado para Camila Riquelme. Queda registrado en su ficha.');
            } },
          { txt: 'Ver ficha', fn: function () { abrirFicha('t5'); } }
        ]
      });
    }

    /* ---- 7. Ley Karin ----------------------------------------------------- */
    if (!S.protocoloKarin) {
      H.push({
        id: 'karin', nivel: 'vencido',
        titulo: 'Sin protocolo de prevención del acoso (Ley Karin)',
        resumen: 'Es obligatorio para todo empleador desde el 1 de agosto de 2024.',
        cita: 'Ley 21.643', citaTipo: 'norma',
        costo: Math.round(6 * utm),
        costoEtq: 'multa estimada',
        porque: '<p>La ley 21.643 (Karin) rige desde el <strong>1 de agosto de 2024</strong> y obliga a todo empleador ' +
          '—sin importar el tamaño— a tener un protocolo de prevención del acoso laboral, sexual y de la violencia en ' +
          'el trabajo, un procedimiento de investigación y denuncia, y a incorporarlo al reglamento interno.</p>' +
          '<p>El riesgo grande no es la multa: es que llegue una denuncia y no tengas procedimiento. Ahí la empresa ' +
          'queda expuesta y la investigación la termina haciendo la Dirección del Trabajo con sus reglas, no con las tuyas.</p>',
        calculo:
          'Vigencia ................ 01-08-2024\n' +
          'A quién obliga .......... a todo empleador, sin mínimo de trabajadores\n' +
          'Estado en tu empresa .... <b>no existe</b>\n\n' +
          'Multa estimada (pequeña empresa) ...... <b>' + CL.clp(6 * utm) + '</b>\n' +
          '  rango art. 506: ' + multa.minUTM + ' a ' + multa.maxUTM + ' UTM = ' + CL.clp(multa.minCLP) + ' a ' + CL.clp(multa.maxCLP) + '\n\n' +
          '▲ Estimación al medio del rango. El monto lo fija el fiscalizador\n' +
          '  y puede escalar si hay denuncia de por medio.',
        acciones: [
          { txt: 'Generar protocolo y procedimiento', primaria: true, fn: function () {
              S.protocoloKarin = true;
              S.trabajadores.forEach(function (t) { t.docs.karin = 1; });
              S.resueltos['karin'] = true;
              toast('Protocolo Ley Karin generado. Hay que difundirlo a los 15 trabajadores y anexarlo al RIOHS.');
            } }
        ]
      });
    }

    /* ---- 8. Reglamento interno ------------------------------------------- */
    if (!S.riohs && activos().length >= 10) {
      H.push({
        id: 'riohs', nivel: 'riesgo',
        titulo: 'Sin Reglamento Interno de Orden, Higiene y Seguridad',
        resumen: 'Con ' + activos().length + ' trabajadores es obligatorio. La obligación parte en 10.',
        cita: 'Art. 153 CT', citaTipo: 'norma',
        costo: Math.round(5 * utm),
        costoEtq: 'multa estimada',
        porque: '<p>Toda empresa con <strong>10 o más trabajadores permanentes</strong> debe tener Reglamento Interno de ' +
          'Orden, Higiene y Seguridad, entregarle copia a cada trabajador y remitirlo a la Dirección del Trabajo y a la ' +
          'Seremi de Salud.</p>' +
          '<p>Tienes ' + activos().length + '. Y sin reglamento interno no puedes sancionar a nadie: si mañana despides ' +
          'por incumplimiento de una regla que nunca escribiste ni comunicaste, la causal se cae sola.</p>',
        calculo:
          'Trabajadores ............ ' + activos().length + '\n' +
          'Umbral art. 153 ......... 10 o más → <b>obligatorio</b>\n' +
          'Estado .................. no existe\n\n' +
          'Multa estimada .......... <b>' + CL.clp(5 * utm) + '</b> (rango ' + multa.minUTM + '–' + multa.maxUTM + ' UTM)\n' +
          'Efecto colateral ........ sin RIOHS no hay causal disciplinaria que aguante\n\n' +
          '▲ Estimación al medio del rango. Verificar umbral y rango vigentes.',
        acciones: [
          { txt: 'Generar borrador del RIOHS', primaria: true, fn: function () {
              S.riohs = true;
              S.trabajadores.forEach(function (t) { t.docs.riohs = 1; });
              S.resueltos['riohs'] = true;
              toast('Borrador del RIOHS generado. Debe revisarlo un abogado antes de depositarlo en la DT.');
            } }
        ]
      });
    }

    /* ---- 9. Pacto de horas extraordinarias vencido ------------------------ */
    if (!S.pactoHHEEVigente) {
      var conHHEE = activos().filter(function (t) { return t.hhee > 0; });
      H.push({
        id: 'pacto-hhee', nivel: 'riesgo',
        titulo: 'El pacto de horas extraordinarias venció hace ' + Math.abs(CL.difDias(HOY, S.pactoHHEEVencio)) + ' días',
        resumen: conHHEE.length + ' trabajadores siguen haciendo horas extra sin pacto vigente.',
        cita: 'Art. 32 CT', citaTipo: 'norma',
        costo: Math.round(3 * utm),
        costoEtq: 'multa estimada',
        porque: '<p>Las horas extraordinarias deben pactarse por escrito, sólo pueden pactarse para atender ' +
          'necesidades o situaciones temporales de la empresa, y el pacto <strong>tiene una vigencia de 3 meses, ' +
          'renovable</strong>. Máximo 2 horas por día.</p>' +
          '<p>El pacto de esta empresa venció el ' + CL.fechaLarga(S.pactoHHEEVencio) + ' y nadie lo renovó. ' +
          conHHEE.length + ' personas siguen haciendo horas extra. Hay que pagarlas igual —el trabajo hecho se paga— ' +
          'pero la empresa queda infraccionada.</p>',
        calculo:
          'Pacto vigente hasta ..... ' + CL.fechaDia(S.pactoHHEEVencio) + '\n' +
          'Estado .................. <b>VENCIDO</b> hace ' + Math.abs(CL.difDias(HOY, S.pactoHHEEVencio)) + ' días\n' +
          'Trabajadores con h. extra este mes ... ' + conHHEE.length + '\n' +
          'Horas extra del mes ..................... ' + conHHEE.reduce(function (s, t) { return s + t.hhee; }, 0) + ' h\n\n' +
          'Multa estimada .......................... <b>' + CL.clp(3 * utm) + '</b>\n\n' +
          '▲ Estimación. El rango de pequeña empresa es ' + multa.minUTM + '–' + multa.maxUTM + ' UTM.',
        acciones: [
          { txt: 'Renovar el pacto por 3 meses', primaria: true, fn: function () {
              S.pactoHHEEVigente = true;
              S.trabajadores.forEach(function (t) { if (t.hhee > 0) t.docs.pactoHHEE = 1; });
              S.resueltos['pacto-hhee'] = true;
              toast('Pacto renovado hasta el ' + CL.fechaLarga(CL.masDias(HOY, 90)) + '. Lo firman los ' + conHHEE.length + ' trabajadores.');
            } }
        ]
      });
    }

    /* ---- 10. Cotizaciones del mes en curso: el día 13 --------------------- */
    if (!S.cotizacionesJunioPagadas) {
      var v = CL.vencimientoCotizaciones();
      H.push({
        id: 'cotiz-mes', nivel: v.dias <= 2 ? 'riesgo' : 'ok',
        titulo: 'Cotizaciones de ' + v.periodo + ': ' + (v.dias === 0 ? 'vencen hoy' : v.dias === 1 ? 'vence mañana' : 'vencen en ' + v.dias + ' días'),
        resumen: 'Plazo electrónico (Previred): ' + CL.fechaDia(v.fecha) + '.',
        cita: 'Plazo de declaración y pago', citaTipo: 'verificar',
        costo: 0,
        costoEtq: 'aún sin costo',
        porque: '<p>Las cotizaciones previsionales del mes se declaran y pagan hasta el <strong>día 10 del mes ' +
          'siguiente</strong> en papel, o hasta el <strong>día 13</strong> por vía electrónica (Previred). Si el 13 ' +
          'cae en día inhábil, corre al hábil siguiente. <span class="cita cita--verificar">plazo a validar con Previred</span></p>' +
          '<p>Pagar fuera de plazo genera reajustes, intereses y multas, y —lo importante— te deja expuesto a la ' +
          'nulidad del despido de cualquier persona que salga en los próximos meses. La deuda previsional es el ' +
          'hallazgo que más veces se convierte en plata perdida.</p>',
        calculo:
          'Período ................. ' + v.periodo + '\n' +
          'Vence (electrónico) ..... <b>' + CL.fechaDia(v.fecha) + '</b>\n' +
          'Faltan .................. <b>' + v.dias + ' día' + (v.dias === 1 ? '' : 's') + '</b>\n' +
          'Trabajadores ............ ' + activos().length + '\n' +
          'Monto estimado a pagar .. ' + CL.clp(activos().reduce(function (s, t) {
              var g = CL.gratificacionMensual(t.base);
              return s + CL.cotizaciones(t.base + g.monto, t.afp, t.tipo).total;
            }, 0)),
        acciones: [
          { txt: 'Marcar como pagadas', primaria: true, fn: function () {
              S.cotizacionesJunioPagadas = true;
              S.resueltos['cotiz-mes'] = true;
              toast('Cotizaciones de ' + v.periodo + ' marcadas como pagadas en Previred.');
            } }
        ]
      });
    }

    /* ---- 11. Registro de asistencia --------------------------------------- */
    H.push({
      id: 'asistencia', nivel: 'riesgo',
      titulo: 'El registro de asistencia es un libro en papel con firmas incompletas',
      resumen: 'Es tu única prueba de la jornada y de las horas extra. Hoy no prueba nada.',
      cita: 'Art. 33 CT', citaTipo: 'norma',
      costo: Math.round(4 * utm),
      costoEtq: 'multa estimada',
      porque: '<p>El empleador debe llevar registro de asistencia para determinar las horas de trabajo, ordinarias y ' +
        'extraordinarias. Puede ser libro de asistencia o reloj control.</p>' +
        '<p>El libro de esta empresa tiene semanas completas sin firmar. Sin registro, dos cosas se te caen: ' +
        '<strong>no puedes probar cuántas horas extra hizo alguien</strong> (y si te demandan, se presume lo que ' +
        'declare el trabajador), y <strong>no puedes despedir por inasistencia</strong> invocando el art. 160 N°3, ' +
        'porque no tienes con qué acreditarla. Es exactamente lo que está pasando con Héctor.</p>' +
        '<p>Los sistemas electrónicos de control de asistencia deben cumplir el reglamento de la Dirección del Trabajo ' +
        'y quedar registrados. <span class="cita cita--verificar">Estado del Registro Electrónico de Asistencia (REA): ' +
        'verificar la normativa vigente con la DT antes de implementar</span></p>',
      calculo:
        'Sistema actual .......... libro de asistencia en papel\n' +
        'Semanas sin firmar ...... 6 de las últimas 12\n' +
        'Consecuencia 1 .......... no puedes probar las horas extra\n' +
        'Consecuencia 2 .......... no puedes sostener una causal del art. 160 N°3\n\n' +
        'Multa estimada .......... <b>' + CL.clp(4 * utm) + '</b>\n\n' +
        '▲ Requisitos del registro electrónico: verificar reglamento vigente de la DT.',
      acciones: [
        { txt: 'Ver requisitos del registro', fn: function () {
            toast('En producción esto abre la ficha del reglamento vigente de la DT. Acá está falseado.');
          } }
      ]
    });

    /* Marca los resueltos y los manda al final. */
    H.forEach(function (h) { h.resuelto = !!S.resueltos[h.id]; if (h.resuelto) { h.nivel = 'ok'; h.costo = 0; } });
    return H;
  }

  function ordenarHallazgos(H) {
    var pesoNivel = { vencido: 0, riesgo: 1, ok: 2 };
    return H.slice().sort(function (a, b) {
      if (a.resuelto !== b.resuelto) return a.resuelto ? 1 : -1;
      if (S.ordenH === 'costo') {
        if (b.costo !== a.costo) return b.costo - a.costo;
        return pesoNivel[a.nivel] - pesoNivel[b.nivel];
      }
      if (pesoNivel[a.nivel] !== pesoNivel[b.nivel]) return pesoNivel[a.nivel] - pesoNivel[b.nivel];
      return b.costo - a.costo;
    });
  }

  /* ========================================================== RENDER ======= */

  var ICONOS = {
    tablero: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><rect x="2" y="2" width="6" height="7" stroke="currentColor" stroke-width="1.4"/><rect x="10" y="2" width="6" height="4" stroke="currentColor" stroke-width="1.4"/><rect x="2" y="11" width="6" height="5" stroke="currentColor" stroke-width="1.4"/><rect x="10" y="8" width="6" height="8" stroke="currentColor" stroke-width="1.4"/></svg>',
    trabajadores: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="6" r="3" stroke="currentColor" stroke-width="1.4"/><path d="M3 16c0-3.3 2.7-5 6-5s6 1.7 6 5" stroke="currentColor" stroke-width="1.4"/></svg>',
    contratar: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4 2h6l4 4v10H4V2z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M10 2v4h4" stroke="currentColor" stroke-width="1.4"/><path d="M6.5 11h5M9 8.5v5" stroke="currentColor" stroke-width="1.4"/></svg>',
    finiquito: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.4"/><path d="M9 4.5V9l3 2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    plazos: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><rect x="2" y="3.5" width="14" height="12.5" stroke="currentColor" stroke-width="1.4"/><path d="M2 7.5h14M6 2v3M12 2v3" stroke="currentColor" stroke-width="1.4"/></svg>'
  };

  function iconoNivel(n) {
    if (n === 'vencido') return '<svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 1.5l6 11H1l6-11z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M7 5.5v3M7 10.2v.1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>';
    if (n === 'riesgo') return '<svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.3"/><path d="M7 3.6v4M7 10v.1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>';
    return '<svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.3"/><path d="M4.4 7.2l1.8 1.8 3.4-3.8" stroke="currentColor" stroke-width="1.3" stroke-linecap="square"/></svg>';
  }

  /* ----------------------------------------------------------- 1. TABLERO -- */
  function renderTablero() {
    var H = ordenarHallazgos(hallazgos());
    var abiertos = H.filter(function (h) { return !h.resuelto; });
    var riesgo = abiertos.reduce(function (s, h) { return s + h.costo; }, 0);
    var vencidos = abiertos.filter(function (h) { return h.nivel === 'vencido'; }).length;

    /* Estado documental: contrato + anexo 42 + karin + riohs sobre el total */
    var docsTotal = 0, docsOk = 0;
    activos().forEach(function (t) {
      var req = ['contrato', 'anexo42', 'karin', 'riohs'];
      req.forEach(function (k) {
        if (k === 'anexo42' && t.jornadaContrato !== 42) { docsTotal++; return; }
        if (k === 'anexo42' && t.jornadaContrato === 42) { docsTotal++; docsOk += t.docs.anexo42 ? 1 : 0; return; }
        docsTotal++; docsOk += t.docs[k] ? 1 : 0;
      });
    });
    var pctOk = Math.round(docsOk / docsTotal * 100);

    var v = CL.vencimientoCotizaciones();
    var fh = finiquitoHector();
    var t7 = trab('t7');
    var venceContrato = t7 && !t7.docs.contrato ? CL.difDias(HOY, CL.masDias(t7.ingreso, 15)) : null;

    var conservador = fh.plazos.corridosA <= fh.plazos.corridosB ? fh.plazos : fh.plazos;
    var diasFin = Math.min(fh.plazos.corridosA, fh.plazos.corridosB);

    return '' +
    '<div class="vista__cab">' +
      '<h1>Tablero de cumplimiento</h1>' +
      '<p>' + activos().length + ' trabajadores · tramo <strong>pequeña empresa</strong> (10 a 49) ' +
      '<span class="cita cita--norma">Art. 505 bis CT</span> · expediente al ' + CL.fechaLarga(HOY) + '</p>' +
    '</div>' +

    '<div class="tiles">' +
      '<div class="tile tile--riesgo">' +
        '<span class="tile__t">Riesgo abierto</span>' +
        '<div class="tile__v" id="tile-riesgo">' + CL.clp(riesgo) + '</div>' +
        '<p class="tile__s">' + abiertos.length + ' hallazgos sin cerrar, ' + vencidos + ' de ellos vencidos. ' +
        'Suma de multas estimadas y pasivo laboral. Cada línea muestra su aritmética.</p>' +
      '</div>' +
      '<div class="tile tile--plazo">' +
        '<span class="tile__t">Plazo más cercano</span>' +
        '<div class="tile__v">' + (v.dias === 0 ? 'HOY' : v.dias + (v.dias === 1 ? ' día' : ' días')) + '</div>' +
        '<p class="tile__s">Cotizaciones de ' + v.periodo + ', vía Previred. Vence el ' + CL.fechaDia(v.fecha) + '.</p>' +
      '</div>' +
      '<div class="tile tile--ok">' +
        '<span class="tile__t">Carpeta laboral</span>' +
        '<div class="tile__v">' + pctOk + '%</div>' +
        '<div class="medidor"><i class="m-ok" style="width:' + pctOk + '%"></i>' +
          '<i class="m-vencido" style="width:' + (100 - pctOk) + '%"></i></div>' +
        '<p class="tile__s">' + docsOk + ' de ' + docsTotal + ' documentos obligatorios en regla.</p>' +
      '</div>' +
    '</div>' +

    '<div class="titulillo" style="margin-top:var(--sp-m)">Relojes corriendo</div>' +
    '<div class="plazos">' +
      plazoCard('Cotizaciones de ' + v.periodo, v.dias, CL.fechaDia(v.fecha), S.cotizacionesJunioPagadas) +
      plazoCard('Finiquito de Héctor Sandoval', diasFin, 'entre el ' + CL.fechaDia(fh.plazos.finiquitoA) + ' y el ' + CL.fechaDia(fh.plazos.finiquitoB), trab('t6').terminado) +
      (venceContrato !== null
        ? plazoCard('Contrato de Fernanda Ortiz', venceContrato, CL.fechaDia(CL.masDias(t7.ingreso, 15)), false)
        : plazoCard('Contrato de Fernanda Ortiz', 99, 'firmado', true)) +
    '</div>' +

    '<div class="barra-orden">' +
      '<span class="barra-orden__t">Hallazgos · ' + abiertos.length + ' abiertos</span>' +
      '<button class="chip" data-orden="costo" aria-pressed="' + (S.ordenH === 'costo') + '">Por costo</button>' +
      '<button class="chip" data-orden="urgencia" aria-pressed="' + (S.ordenH === 'urgencia') + '">Por urgencia</button>' +
    '</div>' +

    '<div class="lista-h">' + H.map(itemHallazgo).join('') + '</div>' +

    '<div class="descargo" style="margin-top:var(--sp-m)">' +
      '<strong>Cómo leer estos números.</strong> Las multas son <em>estimaciones</em> al medio del rango legal del ' +
      'art. 506 para pequeña empresa (1 a 10 UTM): el monto exacto lo fija el fiscalizador. El pasivo laboral ' +
      '(nulidad del despido, recargos del art. 168) se calcula con supuestos que están declarados dentro de cada ' +
      'hallazgo. Ninguna cifra de este tablero reemplaza la opinión de un abogado laboral.' +
    '</div>';
  }

  function plazoCard(q, dias, sub, hecho) {
    var nivel = hecho ? 'ok' : dias < 0 ? 'vencido' : dias <= 3 ? 'riesgo' : 'ok';
    var n = hecho ? 'Listo' : dias < 0 ? 'Vencido' : dias === 0 ? 'Hoy' : dias;
    var u = hecho ? '' : dias < 0 ? '' : dias === 0 ? '' : '<span style="font-size:0.8rem;color:var(--tinta-2)"> día' + (dias === 1 ? '' : 's') + '</span>';
    return '<div class="plazo plazo--' + nivel + '">' +
      '<div class="plazo__q">' + q + '</div>' +
      '<div class="plazo__n">' + n + u + '</div>' +
      '<div class="plazo__f">' + (hecho ? 'sin plazo pendiente' : dias < 0 ? 'hace ' + Math.abs(dias) + ' días · ' + sub : sub) + '</div>' +
    '</div>';
  }

  function itemHallazgo(h) {
    var abierto = !!S.abiertos[h.id];
    return '<article class="h-item h-item--' + h.nivel + '">' +
      '<button class="h-cab" data-toggle="' + h.id + '" aria-expanded="' + abierto + '">' +
        '<span>' +
          '<span class="h-t">' + h.titulo + '</span>' +
          '<span class="h-meta">' +
            (h.resuelto
              ? '<span class="h-resuelto">' + iconoNivel('ok') + ' Resuelto</span>'
              : '<span class="pill pill--' + h.nivel + '">' + (h.nivel === 'vencido' ? 'vencido' : 'por vencer') + '</span>') +
            '<span class="cita cita--' + h.citaTipo + '">' + h.cita + '</span>' +
          '</span>' +
          (h.resumen && !h.resuelto ? '<span class="tile__s" style="display:block;margin-top:0.5rem">' + h.resumen + '</span>' : '') +
        '</span>' +
        '<span class="h-costo">' +
          (h.costo > 0
            ? '<span class="cifra">' + CL.clpCorto(h.costo) + '</span><small>' + h.costoEtq + '</small>'
            : '<span class="h-flecha">' + (abierto ? '▲' : '▼') + '</span>') +
        '</span>' +
      '</button>' +
      '<div class="h-detalle" ' + (abierto ? '' : 'hidden') + '>' +
        '<div class="h-porque">' + h.porque + '</div>' +
        '<pre class="h-calculo">' + h.calculo + '</pre>' +
        (h.acciones && !h.resuelto
          ? '<div class="h-acciones">' + h.acciones.map(function (a, i) {
              return '<button class="btn ' + (a.primaria ? 'btn--lacre' : 'btn--fantasma') + '" data-accion="' + h.id + ':' + i + '">' + a.txt + '</button>';
            }).join('') + '</div>'
          : '') +
      '</div>' +
    '</article>';
  }

  /* ------------------------------------------------------ 2. TRABAJADORES -- */
  function hallazgosDe(t) {
    var n = [];
    if (!t.docs.contrato) n.push('sin contrato escrito');
    if (t.jornadaContrato === 45) n.push('jornada 45 h');
    if (t.tipo === 'plazo_fijo' && t.renovaciones >= 2) n.push('2ª renovación');
    if (t.fuero) n.push('fuero ' + t.fuero);
    if (S.cotizacionesImpagas.indexOf(t.id) !== -1) n.push('cotización impaga');
    if (t.hhee > 0 && !S.pactoHHEEVigente) n.push('h. extra sin pacto');
    if (!t.docs.karin) n.push('sin protocolo Karin');
    if (t.enTermino && !t.terminado) n.push('en término');
    return n;
  }

  function renderTrabajadores() {
    var lista = activos().filter(function (t) {
      if (S.filtroT === 'todos') return true;
      if (S.filtroT === 'hallazgos') return hallazgosDe(t).length > 0;
      if (S.filtroT === 'plazo_fijo') return t.tipo === 'plazo_fijo';
      if (S.filtroT === 'fuero') return !!t.fuero;
      if (S.filtroT === 'hhee') return t.hhee > 0;
      return true;
    });

    var filtros = [
      ['todos', 'Todos (' + activos().length + ')'],
      ['hallazgos', 'Con hallazgos (' + activos().filter(function (t) { return hallazgosDe(t).length; }).length + ')'],
      ['plazo_fijo', 'Plazo fijo'],
      ['fuero', 'Con fuero'],
      ['hhee', 'Con horas extra']
    ];

    return '' +
    '<div class="vista__cab">' +
      '<h1>Trabajadores</h1>' +
      '<p>Toca a cualquiera para abrir su ficha: contrato, cotizaciones, documentos que faltan y qué se puede ' +
      'hacer con él hoy.</p>' +
    '</div>' +
    '<div class="filtros">' + filtros.map(function (f) {
      return '<button class="chip" data-filtro="' + f[0] + '" aria-pressed="' + (S.filtroT === f[0]) + '">' + f[1] + '</button>';
    }).join('') + '</div>' +
    '<div class="lista-t">' + (lista.length ? lista.map(function (t) {
      var hs = hallazgosDe(t);
      var g = CL.gratificacionMensual(t.base);
      return '<button class="t-fila" data-ficha="' + t.id + '">' +
        '<span>' +
          '<span class="t-n">' + t.nombre + '</span>' +
          '<span class="t-d">' + t.rut + ' · ' + t.cargo + '</span>' +
          '<span class="t-badges">' +
            '<span class="pill pill--' + (t.tipo === 'indefinido' ? 'nulo' : 'riesgo') + '">' +
              (t.tipo === 'indefinido' ? 'indefinido' : 'plazo fijo') + '</span>' +
            (t.fuero ? '<span class="pill pill--vencido">fuero</span>' : '') +
            (t.enTermino && !t.terminado ? '<span class="pill pill--vencido">en término</span>' : '') +
          '</span>' +
        '</span>' +
        '<span class="t-mid" style="display:none">' + t.afp + ' · ' + t.salud + '<br>' + t.jornadaContrato + ' h · desde ' + CL.fechaLarga(t.ingreso) + '</span>' +
        '<span class="t-der">' +
          '<span class="t-sueldo">' + CL.clp(t.base) + '</span>' +
          '<span class="t-halla" style="color:' + (hs.length ? 'var(--st-vencido)' : 'var(--st-ok)') + '">' +
            (hs.length ? hs.length + ' hallazgo' + (hs.length === 1 ? '' : 's') : 'al día') + '</span>' +
        '</span>' +
      '</button>';
    }).join('') : '<div class="t-fila"><span class="tenue">Ningún trabajador cumple ese filtro.</span></div>') + '</div>' +
    '<style>@media (min-width:48em){.t-mid{display:block !important}}</style>';
  }

  function abrirFicha(id) {
    var t = trab(id);
    var g = CL.gratificacionMensual(t.base);
    var cot = CL.cotizaciones(t.base + g.monto, t.afp, t.tipo);
    var he = CL.horaExtra(t.base, t.jornadaContrato);
    var hs = hallazgosDe(t);
    var antig = CL.difDias(t.ingreso, HOY) / 365.25;

    var docs = [
      ['contrato', 'Contrato de trabajo escriturado', 'Art. 9 y 10 CT'],
      ['anexo42', 'Anexo de jornada 42 horas', 'Ley 21.561'],
      ['karin', 'Protocolo Ley Karin difundido', 'Ley 21.643'],
      ['riohs', 'Copia del Reglamento Interno', 'Art. 153 CT'],
      ['pactoHHEE', 'Pacto de horas extraordinarias', 'Art. 32 CT']
    ];

    var html = '' +
    '<div class="dl">' +
      '<div><dt>RUT</dt><dd class="mono">' + t.rut + '</dd></div>' +
      '<div><dt>Cargo</dt><dd>' + t.cargo + '</dd></div>' +
      '<div><dt>Contrato</dt><dd>' + (t.tipo === 'indefinido' ? 'Indefinido' : 'Plazo fijo' + (t.renovaciones ? ' · ' + t.renovaciones + ' renovaciones' : '')) + '</dd></div>' +
      '<div><dt>Ingreso</dt><dd>' + CL.fechaLarga(t.ingreso) + ' <span class="tenue">(' + CL.fmtNum(antig) + ' años)</span></dd></div>' +
      '<div><dt>Sueldo base</dt><dd class="mono">' + CL.clp(t.base) + '</dd></div>' +
      '<div><dt>Gratificación art. 50</dt><dd class="mono">' + CL.clp(g.monto) + (g.topeado ? ' <span class="tenue">(topada)</span>' : '') + '</dd></div>' +
      '<div><dt>AFP</dt><dd>' + t.afp + ' <span class="tenue mono chico">(' + CL.fmtNum(P.afp[t.afp]) + '%)</span></dd></div>' +
      '<div><dt>Salud</dt><dd>' + t.salud + '</dd></div>' +
      '<div><dt>Jornada en el contrato</dt><dd>' + t.jornadaContrato + ' h ' +
        (t.jornadaContrato > 42 ? '<span class="pill pill--vencido">sobre el máximo</span>' : '') + '</dd></div>' +
      '<div><dt>Comuna</dt><dd>' + t.comuna + '</dd></div>' +
    '</div>' +

    '<hr class="sep">' +
    '<div class="titulillo">Costo real de esta persona para la empresa</div>' +
    '<pre class="h-calculo">' +
      'Sueldo base ......................... ' + CL.clp(t.base) + '\n' +
      'Gratificación (art. 50, 25% topado) .. ' + CL.clp(g.monto) + '\n' +
      'Imponible ........................... <b>' + CL.clp(cot.imponible) + '</b>\n' +
      'Aportes del empleador (SIS + AFC + mutual) ' + CL.clp(cot.empleador) + '\n' +
      '                                     ─────────────\n' +
      'Costo empresa ....................... <b>' + CL.clp(cot.imponible + cot.empleador) + '</b>\n' +
      'Descuentos del trabajador ........... ' + CL.clp(cot.trabajador) + '\n' +
      'Líquido aproximado (sin impuesto) ... ' + CL.clp(cot.imponible - cot.trabajador) + '\n\n' +
      'Valor hora extra (jornada ' + t.jornadaContrato + ' h) .... <b>' + CL.clp(he.extra) + '</b>\n' +
      (t.jornadaContrato === 45
        ? '  ▲ con la jornada legal de 42 h sería ' + CL.clp(CL.horaExtra(t.base, 42).extra) + ' — estás pagando de menos\n'
        : '') +
      '\n▲ Comisión AFP, SIS y mutual son parámetros referenciales. Ver pestaña Plazos.' +
    '</pre>' +

    '<hr class="sep">' +
    '<div class="titulillo">Documentos obligatorios</div>' +
    '<div class="check-docs">' + docs.map(function (d) {
      var ok = !!t.docs[d[0]];
      if (d[0] === 'pactoHHEE' && !t.hhee) return '';
      return '<div class="check-doc ' + (ok ? '' : 'check-doc--falta') + '">' +
        '<span style="color:' + (ok ? 'var(--st-ok)' : 'var(--st-vencido)') + '">' + iconoNivel(ok ? 'ok' : 'vencido') + '</span>' +
        '<span class="check-doc__n">' + d[1] + '</span>' +
        '<span class="cita cita--norma">' + d[2] + '</span>' +
      '</div>';
    }).join('') + '</div>' +

    (hs.length ? '<hr class="sep"><div class="titulillo">Hallazgos abiertos</div>' +
      '<ul style="list-style:none;display:grid;gap:0.4rem">' + hs.map(function (h) {
        return '<li style="display:grid;grid-template-columns:16px 1fr;gap:0.5rem;font-size:0.9rem;color:var(--st-vencido)">' +
          iconoNivel('vencido') + '<span style="color:var(--tinta-2)">' + h + '</span></li>';
      }).join('') + '</ul>' : '') +

    '<hr class="sep">' +
    '<div class="h-acciones">' +
      (t.fuero
        ? '<button class="btn" disabled title="Bloqueado por fuero">Terminar contrato (bloqueado)</button>'
        : '<button class="btn btn--lacre" data-finiquitar="' + t.id + '">Simular término</button>') +
      '<button class="btn btn--fantasma" data-cerrar-panel>Cerrar</button>' +
    '</div>' +
    (t.fuero ? '<p class="pista pista--error">Tiene fuero ' + t.fuero + '. El término requiere autorización judicial previa (desafuero). Contralta bloquea el flujo. <span class="cita cita--norma">Arts. 174 y 201 CT</span></p>' : '');

    mostrarPanel(t.nombre, html);
  }

  /* --------------------------------------------------------- 3. CONTRATAR -- */
  function renderContratar() {
    var d = S.wiz.datos;
    var paso = S.wiz.paso;
    var rutOk = d.rut ? CL.rutValido(d.rut) : null;
    var baseNum = parseInt(String(d.base).replace(/\D/g, ''), 10) || 0;
    var bajoMinimo = baseNum > 0 && baseNum < P.imm.valor && d.jornada >= 42;
    var g = CL.gratificacionMensual(baseNum);

    var cab = '<div class="vista__cab"><h1>Contratar</h1>' +
      '<p>El reloj del art. 9 parte el día que la persona entra a trabajar, no el día que te acuerdas del contrato. ' +
      'Tienes 15 días para tenerlo firmado.</p></div>' +
      '<div class="pasos">' +
        ['Datos', 'Condiciones', 'Documento'].map(function (p, i) {
          var n = i + 1;
          return '<div class="paso ' + (n < paso ? 'paso--hecho' : '') + '" ' + (n === paso ? 'aria-current="step"' : '') + '>' +
            (n < paso ? iconoNivel('ok') : n + '.') + ' ' + p + '</div>';
        }).join('') +
      '</div>';

    if (paso === 1) {
      return cab +
      '<div class="ficha"><div class="form-grid form-grid--2">' +
        campo('Nombre completo', '<input type="text" id="w-nombre" value="' + esc(d.nombre) + '" placeholder="Nombre y dos apellidos" autocomplete="off">') +
        campo('RUT', '<input type="text" id="w-rut" value="' + esc(d.rut) + '" placeholder="12.345.678-5" inputmode="text" autocomplete="off" aria-invalid="' + (rutOk === false) + '">' +
          (rutOk === true ? '<p class="pista pista--ok">RUT válido. Dígito verificador calculado con módulo 11.</p>'
           : rutOk === false ? '<p class="pista pista--error">El dígito verificador no calza. Debería ser <strong>' + CL.rutDV(String(d.rut).toUpperCase().replace(/[^0-9K]/g, '').slice(0, -1) || '0') + '</strong>.</p>'
           : '<p class="pista">Se valida con módulo 11 acá mismo, sin llamar a ningún servicio.</p>')) +
        campo('Cargo', '<input type="text" id="w-cargo" value="' + esc(d.cargo) + '" placeholder="Ayudante de panadería">') +
        campo('Fecha de ingreso', '<input type="date" id="w-ingreso" value="' + d.ingreso + '">' +
          '<p class="pista">El plazo del art. 9 vence el <strong>' + CL.fechaLarga(CL.masDias(d.ingreso, 15)) + '</strong>. ' +
          'Si el contrato es por obra o faena, o dura menos de 30 días, el plazo son 5 días.</p>') +
      '</div>' +
      '<div class="h-acciones" style="margin-top:var(--sp-s)">' +
        '<button class="btn btn--lacre" id="w-sig1" ' + (d.nombre && rutOk && d.cargo ? '' : 'disabled') + '>Continuar</button>' +
      '</div></div>';
    }

    if (paso === 2) {
      return cab +
      '<div class="ficha"><div class="form-grid form-grid--2">' +
        campo('Tipo de contrato', '<select id="w-tipo">' +
          '<option value="indefinido"' + (d.tipo === 'indefinido' ? ' selected' : '') + '>Indefinido</option>' +
          '<option value="plazo_fijo"' + (d.tipo === 'plazo_fijo' ? ' selected' : '') + '>Plazo fijo</option>' +
          '<option value="obra"' + (d.tipo === 'obra' ? ' selected' : '') + '>Por obra o faena</option>' +
          '</select>' +
          (d.tipo === 'plazo_fijo' ? '<p class="pista">Máximo 1 año (2 si es profesional con título). A la <strong>segunda renovación</strong> pasa a indefinido por ley. <span class="cita cita--norma">Art. 159 N°4</span></p>' : '') +
          (d.tipo === 'obra' ? '<p class="pista pista--error">Ojo: por obra o faena el plazo para escriturar el contrato baja a <strong>5 días</strong>. <span class="cita cita--norma">Art. 9 CT</span></p>' : '')) +
        campo('Jornada semanal', '<select id="w-jornada">' +
          '<option value="42"' + (+d.jornada === 42 ? ' selected' : '') + '>42 horas — máximo legal vigente</option>' +
          '<option value="45"' + (+d.jornada === 45 ? ' selected' : '') + '>45 horas</option>' +
          '<option value="30"' + (+d.jornada === 30 ? ' selected' : '') + '>30 horas — jornada parcial</option>' +
          '</select>' +
          (+d.jornada === 45
            ? '<p class="pista pista--error">45 horas está <strong>sobre el máximo legal</strong>. Desde el 26-04-2026 el techo es 42 h; desde el 26-04-2028 será 40. <span class="cita cita--norma">Ley 21.561</span></p>'
            : +d.jornada === 30
            ? '<p class="pista">Jornada parcial: máximo 30 horas. La gratificación y el sueldo mínimo se proporcionan. <span class="cita cita--norma">Art. 40 bis</span></p>'
            : '<p class="pista pista--ok">Jornada correcta según la ley vigente hoy.</p>')) +
        campo('Sueldo base mensual', '<input type="text" id="w-base" value="' + esc(d.base) + '" placeholder="560000" inputmode="numeric">' +
          (bajoMinimo
            ? '<p class="pista pista--error">Bajo el ingreso mínimo de ' + CL.clp(P.imm.valor) + ' para jornada completa. <span class="cita cita--verificar">IMM a validar</span></p>'
            : baseNum > 0
            ? '<p class="pista pista--ok">Gratificación art. 50: <strong>' + CL.clp(g.monto) + '/mes</strong>' + (g.topeado ? ' (topada en 4,75 IMM al año)' : ' (25% del sueldo)') + '. Remuneración imponible: ' + CL.clp(baseNum + g.monto) + '.</p>'
            : '<p class="pista">El ingreso mínimo mensual es ' + CL.clp(P.imm.valor) + '. <span class="cita cita--verificar">parámetro a validar</span></p>')) +
        campo('AFP', '<select id="w-afp">' + ['Capital', 'Cuprum', 'Habitat', 'Modelo', 'PlanVital', 'Provida', 'Uno'].map(function (a) {
          return '<option value="' + a + '"' + (d.afp === a ? ' selected' : '') + '>' + a + ' — comisión ' + CL.fmtNum(P.afp[a]) + '%</option>';
        }).join('') + '</select><p class="pista">Comisiones referenciales. <span class="cita cita--verificar">sincronizar con la Superintendencia</span></p>') +
        campo('Salud', '<select id="w-salud">' + ['Fonasa', 'Banmédica', 'Colmena', 'Consalud', 'Cruz Blanca', 'Nueva Masvida', 'Esencial'].map(function (a) {
          return '<option value="' + a + '"' + (d.salud === a ? ' selected' : '') + '>' + a + '</option>';
        }).join('') + '</select>') +
      '</div>' +
      '<div class="h-acciones" style="margin-top:var(--sp-s)">' +
        '<button class="btn btn--lacre" id="w-sig2" ' + (baseNum > 0 && !bajoMinimo ? '' : 'disabled') + '>Generar el contrato</button>' +
        '<button class="btn btn--fantasma" id="w-atras2">Atrás</button>' +
      '</div></div>';
    }

    /* paso 3 — el documento */
    var jor = +d.jornada;
    var cot = CL.cotizaciones(baseNum + g.monto, d.afp, d.tipo === 'plazo_fijo' ? 'plazo_fijo' : 'indefinido');
    return cab +
    '<div class="fin-grid">' +
      '<div class="apilar">' +
        '<div class="ficha">' +
          '<div class="titulillo">Lo que este contrato genera</div>' +
          '<pre class="h-calculo">' +
            'Sueldo base .................... ' + CL.clp(baseNum) + '\n' +
            'Gratificación art. 50 .......... ' + CL.clp(g.monto) + '\n' +
            'Imponible ...................... <b>' + CL.clp(cot.imponible) + '</b>\n' +
            'Aportes del empleador .......... ' + CL.clp(cot.empleador) + '\n' +
            'Costo mensual para la empresa .. <b>' + CL.clp(cot.imponible + cot.empleador) + '</b>\n\n' +
            'Valor hora ordinaria ........... ' + CL.clp(CL.horaExtra(baseNum, jor).ordinaria) + '\n' +
            'Valor hora extraordinaria ...... <b>' + CL.clp(CL.horaExtra(baseNum, jor).extra) + '</b> (+50%)\n\n' +
            'Plazo para firmar (art. 9) ..... <b>' + CL.fechaLarga(CL.masDias(d.ingreso, d.tipo === 'obra' ? 5 : 15)) + '</b>' +
          '</pre>' +
        '</div>' +
        '<div class="descargo">' +
          '<strong>Antes de firmar.</strong> Esta plantilla incorpora las menciones mínimas del art. 10 del Código del ' +
          'Trabajo. No reemplaza la revisión de un abogado laboral, sobre todo si hay cláusulas de confidencialidad, ' +
          'exclusividad, comisiones variables o teletrabajo.' +
        '</div>' +
        '<div class="h-acciones">' +
          '<button class="btn btn--lacre" id="w-guardar">Guardar y arrancar el reloj</button>' +
          '<button class="btn btn--fantasma" id="w-atras3">Atrás</button>' +
        '</div>' +
      '</div>' +
      '<div class="doc">' + docContrato(d, baseNum, g, jor) + '</div>' +
    '</div>';
  }

  function docContrato(d, base, g, jor) {
    return '<h3>Contrato individual de trabajo</h3>' +
    '<p>En ' + EMPRESA.comuna.split(',')[0] + ', a ' + CL.fechaLarga(d.ingreso) + ', entre <strong>' + EMPRESA.nombre +
    '</strong>, RUT <span class="mono">' + EMPRESA.rut + '</span>, del giro ' + EMPRESA.giro + ', representada legalmente por don ' +
    EMPRESA.repLegal + ', cédula de identidad <span class="mono">' + EMPRESA.repRut + '</span>, ambos domiciliados en ' +
    EMPRESA.direccion + ', en adelante "el empleador"; y <strong>' + (d.nombre || '—') + '</strong>, cédula de identidad ' +
    '<span class="mono">' + (d.rut || '—') + '</span>, en adelante "el trabajador", se ha convenido el siguiente contrato ' +
    'individual de trabajo:</p>' +

    '<p><span class="clau">PRIMERO: Naturaleza de los servicios.</span> El trabajador se obliga a desempeñar el cargo de ' +
    '<strong>' + (d.cargo || '—') + '</strong>, y las funciones anexas o complementarias que le encomiende el empleador ' +
    'dentro del giro, en el establecimiento ubicado en ' + EMPRESA.direccion + ', comuna de ' + EMPRESA.comuna.split(',')[0] + '.</p>' +

    '<p><span class="clau">SEGUNDO: Jornada de trabajo.</span> La jornada ordinaria será de <strong>' + jor + ' horas ' +
    'semanales</strong>, distribuidas de lunes a viernes. ' +
    (jor > 42 ? '<mark>Advertencia: la jornada ordinaria máxima vigente es de 42 horas semanales conforme a la ley 21.561. ' +
      'Esta cláusula excede el máximo legal y debe corregirse antes de firmar.</mark>' :
      'Esta jornada se ajusta al máximo legal vigente conforme a la ley 21.561, que fija 42 horas desde el 26 de abril ' +
      'de 2026 y 40 horas desde el 26 de abril de 2028.') + '</p>' +

    '<p><span class="clau">TERCERO: Remuneración.</span> El empleador pagará al trabajador un sueldo base mensual de ' +
    '<strong><span class="mono">' + CL.clp(base) + '</span></strong>, que se pagará por mes vencido, a más tardar el ' +
    'último día hábil del mes, mediante transferencia electrónica.</p>' +

    '<p><span class="clau">CUARTO: Gratificación.</span> El empleador pagará mensualmente, en conformidad al artículo 50 ' +
    'del Código del Trabajo, el 25% de lo devengado por concepto de remuneración mensual, con el tope de 4,75 ingresos ' +
    'mínimos mensuales al año, lo que a esta fecha equivale a <span class="mono">' + CL.clp(g.monto) + '</span> mensuales.</p>' +

    '<p><span class="clau">QUINTO: Horas extraordinarias.</span> Sólo podrán trabajarse horas extraordinarias previo ' +
    'pacto escrito, para atender necesidades o situaciones temporales de la empresa, con un máximo de dos por día. ' +
    'Se pagarán con el recargo del 50% sobre el sueldo convenido para la jornada ordinaria, esto es, ' +
    '<span class="mono">' + CL.clp(CL.horaExtra(base, jor).extra) + '</span> por hora a esta fecha.</p>' +

    '<p><span class="clau">SEXTO: Duración.</span> El presente contrato ' +
    (d.tipo === 'indefinido' ? 'es de <strong>duración indefinida</strong>.'
     : d.tipo === 'plazo_fijo' ? 'tiene el carácter de <strong>plazo fijo</strong> y regirá hasta el ' +
        CL.fechaLarga(CL.masDias(d.ingreso, 180)) + '. Las partes dejan constancia de que la segunda renovación ' +
        'transformará este contrato en indefinido por el solo ministerio de la ley.'
     : 'es <strong>por obra o faena determinada</strong>, y terminará con la conclusión de la obra o faena que le dio origen.') +
    ' Se deja constancia de que el trabajador ingresó a prestar servicios el ' + CL.fechaLarga(d.ingreso) + '.</p>' +

    '<p><span class="clau">SÉPTIMO: Previsión.</span> El trabajador está afiliado a <strong>AFP ' + d.afp + '</strong> y a ' +
    '<strong>' + d.salud + '</strong> para efectos de salud.</p>' +

    '<p><span class="clau">OCTAVO: Reglamento interno y protocolos.</span> El trabajador declara recibir copia del ' +
    'Reglamento Interno de Orden, Higiene y Seguridad y del protocolo de prevención del acoso laboral, sexual y de la ' +
    'violencia en el trabajo de la ley 21.643, y se obliga a cumplirlos.</p>' +

    '<p><span class="clau">NOVENO: Ejemplares.</span> El presente contrato se firma en dos ejemplares, quedando uno en ' +
    'poder de cada parte, declarando el trabajador haber recibido el suyo en este acto.</p>' +

    '<div class="doc__firmas">' +
      '<div>' + (d.nombre || '—') + '<br><span class="mono">' + (d.rut || '—') + '</span><br>Trabajador</div>' +
      '<div>' + EMPRESA.repLegal + '<br><span class="mono">' + EMPRESA.repRut + '</span><br>p.p. ' + EMPRESA.nombre + '</div>' +
    '</div>';
  }

  /* --------------------------------------------------------- 4. FINIQUITO -- */
  function renderFiniquito() {
    var t = trab(S.fin.trabajador);
    var f = CL.finiquito({
      base: t.base, ingreso: t.ingreso, termino: S.fin.termino, causal: S.fin.causal,
      diasFeriado: t.diasFeriado || Math.round(CL.difDias(t.ingreso, HOY) / 365.25 * 15 % 15 * 2) / 2 || 6,
      tipo: (t.tipo === 'plazo_fijo' && t.renovaciones >= 2) ? 'plazo_fijo_2a_renovacion' : t.tipo,
      fuero: t.fuero,
      cotizacionesAlDia: S.cotizacionesImpagas.indexOf(t.id) === -1,
      avisoConAnticipacion: S.fin.avisoConAnticipacion,
      avisoInspeccion: S.fin.avisoInspeccion,
      registroAsistencia: S.fin.registroAsistencia,
      sabadoHabil: S.fin.sabadoHabil
    });

    var plazoElegido = S.fin.sabadoHabil ? f.plazos.finiquitoA : f.plazos.finiquitoB;
    var diasElegido = S.fin.sabadoHabil ? f.plazos.corridosA : f.plazos.corridosB;

    return '' +
    '<div class="vista__cab">' +
      '<h1>Auditoría de finiquito</h1>' +
      '<p>Arma el finiquito y mira qué se rompe <strong>antes</strong> de firmarlo. Cada monto muestra su fórmula; ' +
      'cada advertencia, su artículo.</p>' +
    '</div>' +

    '<div class="fin-grid">' +

      '<div class="apilar">' +
        '<div class="ficha">' +
          '<div class="form-grid">' +
            campo('Trabajador', '<select id="f-trab">' + activos().map(function (x) {
              return '<option value="' + x.id + '"' + (x.id === S.fin.trabajador ? ' selected' : '') + '>' +
                x.nombre + ' — ' + CL.clp(x.base) + '</option>';
            }).join('') + '</select>') +
            campo('Causal de término', '<select id="f-causal">' +
              '<option value="161"' + (S.fin.causal === '161' ? ' selected' : '') + '>Art. 161 — necesidades de la empresa</option>' +
              '<option value="159-2"' + (S.fin.causal === '159-2' ? ' selected' : '') + '>Art. 159 N°2 — renuncia voluntaria</option>' +
              '<option value="159-4"' + (S.fin.causal === '159-4' ? ' selected' : '') + '>Art. 159 N°4 — vencimiento del plazo</option>' +
              '<option value="160-3"' + (S.fin.causal === '160-3' ? ' selected' : '') + '>Art. 160 N°3 — no concurrencia (sin indemnización)</option>' +
              '</select>' +
              (S.fin.causal === '161' ? '<p class="pista">Da derecho a indemnización por años de servicio y exige aviso con 30 días de anticipación o el pago del mes.</p>' : '') +
              (S.fin.causal === '160-3' ? '<p class="pista pista--error">Causal sin indemnización: la carga de la prueba es del empleador. Sin registro de asistencia, se cae.</p>' : '') +
              (S.fin.causal === '159-4' ? '<p class="pista">Sólo procede si el contrato es efectivamente a plazo fijo y no se ha transformado en indefinido.</p>' : '')) +
            campo('Fecha de separación', '<input type="date" id="f-fecha" value="' + S.fin.termino + '">') +
          '</div>' +

          '<hr class="sep">' +
          '<div class="titulillo">Lo que dice el expediente</div>' +
          '<div class="apilar-s">' +
            sw('f-cot', 'Cotizaciones de los últimos 3 meses pagadas', S.cotizacionesImpagas.indexOf(t.id) === -1, true) +
            sw('f-aviso30', 'Se avisó con 30 días de anticipación', S.fin.avisoConAnticipacion) +
            sw('f-avisoinsp', 'Se envió copia del aviso a la Inspección del Trabajo', S.fin.avisoInspeccion) +
            sw('f-registro', 'Hay registro de asistencia firmado del período', S.fin.registroAsistencia) +
          '</div>' +
          (S.cotizacionesImpagas.indexOf(t.id) !== -1
            ? '<p class="pista pista--error" style="margin-top:0.6rem">Las cotizaciones de ' + periodoImpago() + ' de ' +
              t.nombre.split(' ')[0] + ' están impagas. Se arregla en el tablero, no acá: hay que pagarlas y convalidar.</p>'
            : '') +

          '<hr class="sep">' +
          '<div class="titulillo">Criterio de cómputo de días hábiles</div>' +
          sw('f-sabado', 'El sábado cuenta como día hábil', S.fin.sabadoHabil) +
          '<p class="pista">Este criterio no es pacífico y cambia la fecha de vencimiento. Contralta calcula las dos ' +
          'lecturas y recomienda la más temprana. <span class="cita cita--verificar">validar con abogado</span></p>' +
        '</div>' +

        '<div class="doble-criterio">' +
          '<div class="doble-criterio__cab">Plazos del término</div>' +
          '<div class="dc-fila">' +
            '<span class="dc-fila__q">Finiquito a disposición del trabajador' +
              '<small>10 días hábiles · Ley 21.361 · por validar</small></span>' +
            '<span class="dc-fila__v" style="color:' + (diasElegido < 0 ? 'var(--st-vencido)' : diasElegido <= 3 ? 'var(--st-riesgo)' : 'var(--st-ok)') + '">' +
              (diasElegido < 0 ? 'venció ' + CL.fechaDia(plazoElegido) : CL.fechaDia(plazoElegido)) + '</span>' +
          '</div>' +
          '<div class="dc-fila">' +
            '<span class="dc-fila__q">Criterio A — sábado hábil<small>inhábiles: domingos y festivos</small></span>' +
            '<span class="dc-fila__v">' + CL.fechaDia(f.plazos.finiquitoA) +
              '<br><small style="color:var(--tinta-3)">' + (f.plazos.corridosA < 0 ? 'venció hace ' + Math.abs(f.plazos.corridosA) + ' d' : 'faltan ' + f.plazos.corridosA + ' d') + '</small></span>' +
          '</div>' +
          '<div class="dc-fila">' +
            '<span class="dc-fila__q">Criterio B — sábado inhábil<small>inhábiles: sábados, domingos y festivos</small></span>' +
            '<span class="dc-fila__v">' + CL.fechaDia(f.plazos.finiquitoB) +
              '<br><small style="color:var(--tinta-3)">' + (f.plazos.corridosB < 0 ? 'venció hace ' + Math.abs(f.plazos.corridosB) + ' d' : 'faltan ' + f.plazos.corridosB + ' d') + '</small></span>' +
          '</div>' +
          '<div class="dc-fila">' +
            '<span class="dc-fila__q">Aviso a la Inspección del Trabajo' +
              '<small>3 días hábiles · art. 162 · causales 160 y 159 N°4,5,6</small></span>' +
            '<span class="dc-fila__v">' + CL.fechaDia(f.plazos.avisoInspeccion) + '</span>' +
          '</div>' +
        '</div>' +

        (f.riesgo.total > 0
          ? '<div class="ficha ficha--lacre">' +
              '<div class="titulillo">Riesgo si firmas así, línea por línea</div>' +
              '<pre class="h-calculo">' + f.riesgo.items.map(function (r) {
                return r.nombre + '\n  <b>' + CL.clp(r.monto) + '</b>\n  ▲ ' + r.nota.replace(/\n/g, '\n    ');
              }).join('\n\n') + '\n\n' + '─────────────────────────────\nTOTAL EXPUESTO   <b>' + CL.clp(f.riesgo.total) + '</b>' + '</pre>' +
              '<button class="btn btn--lacre btn--bloque" id="f-corregir" style="margin-top:var(--sp-s)">Corregir todo y recalcular</button>' +
            '</div>'
          : '<div class="ahorro">' +
              '<span class="ahorro__t">Sin hallazgos bloqueantes</span>' +
              '<span class="ahorro__v">' + (S.finAhorro > 0 ? CL.clp(S.finAhorro) : '$0') + '</span>' +
              '<p>' + (S.finAhorro > 0
                ? 'Eso es lo que dejaste de arriesgar al corregir antes de firmar. La aritmética está arriba: no es una promesa de marketing, es la suma de los hallazgos que cerraste.'
                : 'Con estos datos el término se puede cursar. Igual revisa el desglose línea por línea y ratifica ante ministro de fe.') + '</p>' +
            '</div>') +
      '</div>' +

      '<div class="apilar">' +
        '<div class="ficha">' +
          '<div class="titulillo">Desglose del finiquito · ' + t.nombre + '</div>' +
          '<table class="desglose">' +
            '<thead><tr><th>Concepto</th><th style="text-align:right">Monto</th></tr></thead>' +
            '<tbody>' + f.lineas.map(function (l) {
              return '<tr><td>' +
                '<div class="q">' + l.q + ' <span class="cita cita--' + (l.conf === 'verificar' ? 'verificar' : 'norma') + '">' + l.cita + '</span></div>' +
                '<div class="d">' + l.d + '</div>' +
                (l.nota ? '<div class="nota">' + l.nota + '</div>' : '') +
              '</td><td>' + CL.clp(l.m) + '</td></tr>';
            }).join('') + '</tbody>' +
            '<tfoot><tr><td>Total a pagar</td><td>' + CL.clp(f.total) + '</td></tr></tfoot>' +
          '</table>' +
        '</div>' +

        '<div class="lista-h">' + f.hallazgos.map(function (h) {
          return '<article class="h-item h-item--' + h.nivel + '"><div style="padding:var(--sp-s)">' +
            '<div style="display:flex;gap:0.5rem;align-items:flex-start">' +
              '<span style="color:var(--st-' + h.nivel + ');flex:none;margin-top:2px">' + iconoNivel(h.nivel) + '</span>' +
              '<div><div class="h-t" style="font-size:0.95rem">' + h.titulo + '</div>' +
              '<p style="font-size:0.87rem;color:var(--tinta-2);line-height:1.55;margin-top:0.35rem">' + h.texto + '</p>' +
              '<div class="h-meta">' +
                '<span class="cita cita--' + (h.citaTipo || 'norma') + '">' + h.cita + '</span>' +
                (h.costo ? '<span class="cita" style="border-color:var(--lacre);color:var(--lacre)">≈ ' + CL.clp(h.costo) + '</span>' : '') +
              '</div></div>' +
            '</div>' +
          '</div></article>';
        }).join('') + '</div>' +

        '<div class="h-acciones">' +
          '<button class="btn btn--lacre" id="f-doc">Ver el finiquito redactado</button>' +
          '<button class="btn btn--fantasma" id="f-carta">Ver la carta de aviso</button>' +
        '</div>' +

        /* El cierre del ciclo de vida. Bloqueado mientras haya hallazgos que
           cuesten plata: ésa es la tesis entera del producto, hecha botón. */
        '<div class="ficha" style="border-top:3px solid ' + (f.riesgo.total > 0 ? 'var(--st-vencido)' : 'var(--st-ok)') + '">' +
          '<div class="titulillo">Cerrar el término</div>' +
          (t.fuero
            ? '<p class="pista pista--error">Bloqueado: ' + t.nombre.split(' ')[0] + ' tiene fuero ' + t.fuero + '. ' +
              'Se necesita autorización judicial previa. <span class="cita cita--norma">Art. 174 CT</span></p>' +
              '<button class="btn btn--bloque" disabled style="margin-top:var(--sp-2xs)">Bloqueado por fuero</button>'
            : f.riesgo.total > 0
            ? '<p class="pista pista--error">Bloqueado: hay ' + f.hallazgos.filter(function (h) { return h.nivel === 'vencido'; }).length +
              ' hallazgo(s) que hoy te costarían <strong>' + CL.clp(f.riesgo.total) + '</strong>. ' +
              'Contralta no te deja cerrar un término que sabe que está malo.</p>' +
              '<button class="btn btn--bloque" disabled style="margin-top:var(--sp-2xs)">Corrige los hallazgos primero</button>'
            : '<p class="pista">Se registra la entrega del finiquito y su ratificación ante ministro de fe (art. 177), ' +
              'se archiva el expediente y ' + t.nombre.split(' ')[0] + ' sale de la nómina activa.</p>' +
              '<button class="btn btn--lacre btn--bloque" id="f-cerrar" style="margin-top:var(--sp-2xs)">Registrar entrega y ratificación</button>') +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function docFiniquito(t, f) {
    return '<h3>Finiquito de contrato de trabajo</h3>' +
    '<p>En San Bernardo, a ' + CL.fechaLarga(HOY) + ', entre <strong>' + EMPRESA.nombre + '</strong>, RUT ' +
    '<span class="mono">' + EMPRESA.rut + '</span>, representada por don ' + EMPRESA.repLegal + ', ambos domiciliados en ' +
    EMPRESA.direccion + ', en adelante "el empleador"; y <strong>' + t.nombre + '</strong>, cédula de identidad ' +
    '<span class="mono">' + t.rut + '</span>, en adelante "el trabajador", se deja constancia de lo siguiente:</p>' +

    '<p><span class="clau">PRIMERO.</span> El trabajador prestó servicios para el empleador desde el ' +
    CL.fechaLarga(t.ingreso) + ' hasta el ' + CL.fechaLarga(S.fin.termino) + ', desempeñando el cargo de ' + t.cargo + '.</p>' +

    '<p><span class="clau">SEGUNDO.</span> El contrato termina por la causal establecida en el ' +
    (S.fin.causal === '161' ? 'artículo 161 inciso primero del Código del Trabajo, esto es, necesidades de la empresa'
     : S.fin.causal === '159-2' ? 'artículo 159 N°2 del Código del Trabajo, esto es, renuncia voluntaria del trabajador'
     : S.fin.causal === '159-4' ? 'artículo 159 N°4 del Código del Trabajo, esto es, vencimiento del plazo convenido'
     : 'artículo 160 N°3 del Código del Trabajo, esto es, no concurrencia del trabajador a sus labores sin causa justificada') +
    '.</p>' +

    '<p><span class="clau">TERCERO.</span> El empleador paga al trabajador, y éste recibe conforme, las siguientes sumas:</p>' +

    '<table class="desglose" style="font-size:0.85rem">' + f.lineas.filter(function (l) { return l.m > 0; }).map(function (l) {
      return '<tr><td><div class="q" style="font-weight:400">' + l.q + '</div><div class="d">' + l.d + '</div></td>' +
        '<td>' + CL.clp(l.m) + '</td></tr>';
    }).join('') +
    '<tfoot><tr><td>Total</td><td>' + CL.clp(f.total) + '</td></tr></tfoot></table>' +

    '<p style="margin-top:1rem"><span class="clau">CUARTO.</span> El empleador declara que las cotizaciones ' +
    'previsionales del trabajador se encuentran íntegramente pagadas hasta el último día del mes anterior al del ' +
    'término, lo que se acredita con los certificados que se acompañan. ' +
    (S.cotizacionesImpagas.indexOf(t.id) !== -1
      ? '<mark>Advertencia de Contralta: esta declaración es FALSA con los datos actuales. Las cotizaciones de ' +
        periodoImpago() + ' están impagas. Firmar este finiquito así expone al empleador a la nulidad del despido ' +
        'del artículo 162 inciso quinto. No firmes.</mark>'
      : '') + '</p>' +

    '<p><span class="clau">QUINTO.</span> El trabajador declara recibir conforme las sumas señaladas y no tener cargo ' +
    'ni cobro alguno que formular en contra del empleador, otorgándole el más amplio y total finiquito. ' +
    'El trabajador puede firmar con <strong>reserva de derechos</strong>, dejando constancia de ella en este acto.</p>' +

    '<p><span class="clau">SEXTO.</span> El presente finiquito se ratifica ante ministro de fe conforme al artículo 177 ' +
    'del Código del Trabajo: notario público, inspector del trabajo, oficial del registro civil, secretario municipal ' +
    'o el presidente del sindicato respectivo. <strong>Sin ratificación no tiene poder liberatorio.</strong> ' +
    'También puede ratificarse electrónicamente en Mi DT.</p>' +

    '<div class="doc__firmas">' +
      '<div>' + t.nombre + '<br><span class="mono">' + t.rut + '</span><br>Trabajador</div>' +
      '<div>' + EMPRESA.repLegal + '<br><span class="mono">' + EMPRESA.repRut + '</span><br>p.p. ' + EMPRESA.nombre + '</div>' +
    '</div>' +
    '<p style="text-align:center;margin-top:2rem;font-size:0.78rem;color:#71757E">' +
      '_______________________________<br>Ministro de fe · ratificación art. 177</p>';
  }

  function docCarta(t, f) {
    var causalTxt = S.fin.causal === '161'
      ? 'necesidades de la empresa, establecimiento o servicio, previstas en el artículo 161 inciso primero del Código del Trabajo, derivadas de la baja sostenida en la demanda del canal mayorista durante los últimos dos trimestres, lo que hace necesaria la reducción de la dotación del área de producción'
      : S.fin.causal === '160-3'
      ? 'la causal del artículo 160 N°3 del Código del Trabajo, esto es, la no concurrencia del trabajador a sus labores sin causa justificada durante dos días seguidos'
      : 'la causal del artículo 159 N°4 del Código del Trabajo, esto es, el vencimiento del plazo convenido en el contrato';

    return '<h3>Carta de aviso de término de contrato</h3>' +
    '<p style="text-align:right" class="mono chico">San Bernardo, ' + CL.fechaLarga(S.fin.termino) + '</p>' +
    '<p>Señor(a)<br><strong>' + t.nombre + '</strong><br><span class="mono">' + t.rut + '</span><br>Presente</p>' +
    '<p>De mi consideración:</p>' +
    '<p>Por medio de la presente, y en conformidad a lo dispuesto en el artículo 162 del Código del Trabajo, comunico a ' +
    'usted que <strong>' + EMPRESA.nombre + '</strong> ha decidido poner término al contrato de trabajo que nos vincula, ' +
    'con fecha ' + CL.fechaLarga(S.fin.termino) + ', invocando ' + causalTxt + '.</p>' +

    (S.fin.causal === '160-3' && !S.fin.registroAsistencia
      ? '<p><mark>Advertencia de Contralta: estás invocando una causal del artículo 160 y el expediente no tiene ' +
        'registro de asistencia firmado del período. La carta debe expresar los hechos concretos y las fechas. ' +
        'Sin prueba, esta causal se cae en tribunales y el recargo puede llegar al 80% de la indemnización. ' +
        'Antes de enviar esta carta, llama a un abogado laboral.</mark></p>'
      : '') +

    '<p>Se deja constancia de que las cotizaciones previsionales de usted se encuentran ' +
    (S.cotizacionesImpagas.indexOf(t.id) !== -1
      ? '<mark>PENDIENTES de pago respecto del período de ' + periodoImpago() + '. Contralta: no envíes esta carta ' +
        'hasta pagarlas. El despido sería nulo (art. 162 inc. 5).</mark>'
      : 'íntegramente pagadas hasta el último día del mes anterior al del término, adjuntándose los certificados ' +
        'que así lo acreditan.') + '</p>' +

    (S.fin.causal === '161'
      ? '<p>En razón de la causal invocada, se le pagará la indemnización por años de servicio ascendente a ' +
        '<span class="mono">' + CL.clp(f.aniosIAS * f.baseCalculo) + '</span>' +
        (S.fin.avisoConAnticipacion ? '' : ', más la indemnización sustitutiva del aviso previo por ' +
          '<span class="mono">' + CL.clp(f.baseCalculo) + '</span>, al no haberse dado el aviso con treinta días de anticipación') +
        '.</p>'
      : '') +

    '<p>Se remite copia de esta comunicación a la Inspección del Trabajo respectiva dentro del plazo legal. ' +
    (S.fin.avisoInspeccion ? '' : '<mark>Advertencia: en el expediente no consta el envío de la copia a la Inspección. ' +
      'El plazo es de 3 días hábiles desde la separación (art. 162), y vence el ' + CL.fechaDia(f.plazos.avisoInspeccion) + '.</mark>') +
    '</p>' +

    '<p>Le saluda atentamente,</p>' +
    '<div class="doc__firmas" style="grid-template-columns:1fr;max-width:260px">' +
      '<div>' + EMPRESA.repLegal + '<br><span class="mono">' + EMPRESA.repRut + '</span><br>Representante legal<br>' + EMPRESA.nombre + '</div>' +
    '</div>';
  }

  /* ------------------------------------------------------------ 5. PLAZOS -- */
  function renderPlazos() {
    var v = CL.vencimientoCotizaciones();
    var fh = finiquitoHector();
    var t7 = trab('t7');

    var eventos = [
      { q: 'Cotizaciones previsionales de ' + v.periodo, f: v.fecha, n: 'Día 13 por Previred (día 10 en papel). Si cae inhábil, corre al hábil siguiente.', cita: 'plazo a validar', tipo: 'verificar', hecho: S.cotizacionesJunioPagadas },
      { q: 'Finiquito de Héctor Sandoval — criterio conservador', f: fh.plazos.corridosA <= fh.plazos.corridosB ? fh.plazos.finiquitoA : fh.plazos.finiquitoB, n: '10 días hábiles desde la separación. Contralta muestra la fecha más temprana de las dos lecturas.', cita: 'Ley 21.361', tipo: 'verificar', hecho: trab('t6').terminado },
      { q: 'Aviso a la Inspección del Trabajo — término de Héctor', f: fh.plazos.avisoInspeccion, n: '3 días hábiles desde la separación (6 si es caso fortuito, art. 159 N°6).', cita: 'Art. 162 CT', tipo: 'norma', hecho: S.fin.avisoInspeccion },
      { q: 'Contrato de Fernanda Ortiz por escriturar', f: CL.masDias(t7.ingreso, 15), n: '15 días desde el ingreso (5 si es por obra o faena, o dura menos de 30 días).', cita: 'Art. 9 CT', tipo: 'norma', hecho: !!t7.docs.contrato },
      { q: 'Renovación del pacto de horas extraordinarias', f: CL.masDias(S.pactoHHEEVencio, 0), n: 'El pacto dura 3 meses y hay que renovarlo por escrito.', cita: 'Art. 32 CT', tipo: 'norma', hecho: S.pactoHHEEVigente },
      { q: 'Jornada máxima baja a 40 horas', f: CL.fecha('2028-04-26'), n: 'Tercer tramo de la ley 21.561. Hoy el máximo es 42 h (desde el 26-04-2026).', cita: 'Ley 21.561', tipo: 'norma', hecho: false },
      { q: 'Feriado anual de Marisol Espinoza', f: CL.fecha('2027-03-04'), n: '15 días hábiles por año de servicio. El sábado se considera inhábil para el feriado.', cita: 'Art. 67 CT', tipo: 'norma', hecho: false }
    ].sort(function (a, b) { return CL.fecha(a.f) - CL.fecha(b.f); });

    var params = [
      ['UF', CL.clp(P.uf.valor), 'verificar', P.uf.fuente],
      ['UTM', CL.clp(P.utm.valor), 'verificar', P.utm.fuente],
      ['Ingreso mínimo mensual', CL.clp(P.imm.valor), 'verificar', P.imm.fuente],
      ['Tope imponible AFP y salud', CL.fmtNum(P.topeImponibleUF.valor) + ' UF = ' + CL.clp(P.topeImponibleUF.valor * P.uf.valor), 'verificar', P.topeImponibleUF.fuente],
      ['Tope imponible seguro de cesantía', CL.fmtNum(P.topeAFCUF.valor) + ' UF = ' + CL.clp(P.topeAFCUF.valor * P.uf.valor), 'verificar', P.topeAFCUF.fuente],
      ['Tope base de indemnización', '90 UF = ' + CL.clp(90 * P.uf.valor), 'norma', P.topeIndemnUF.fuente],
      ['Tope años de indemnización', '11 años', 'norma', P.topeAniosIAS.fuente],
      ['Jornada ordinaria máxima', '42 horas semanales', 'norma', P.jornadaMaxima.fuente],
      ['Recargo hora extraordinaria', '50%', 'norma', P.recargoHoraExtra.fuente],
      ['Gratificación art. 50', '25%, tope 4,75 IMM al año = ' + CL.clp(4.75 * P.imm.valor / 12) + '/mes', 'norma', P.gratifTopeIMM.fuente],
      ['Seguro de cesantía — indefinido', '2,4% empleador · 0,6% trabajador', 'verificar', P.afc.fuente],
      ['Seguro de cesantía — plazo fijo', '3,0% empleador', 'verificar', P.afc.fuente],
      ['SIS (invalidez y sobrevivencia)', CL.fmtNum(P.sis.valor * 100) + '% de cargo del empleador', 'verificar', P.sis.fuente],
      ['Mutual — ley 16.744', CL.fmtNum(P.mutual.valor * 100) + '% (ejemplo)', 'verificar', P.mutual.fuente],
      ['Multa · pequeña empresa (10 a 49)', '1 a 10 UTM = ' + CL.clp(P.utm.valor) + ' a ' + CL.clp(10 * P.utm.valor), 'verificar', P.multas.fuente],
      ['Cómputo de días hábiles', 'Sábado hábil (criterio A)', 'verificar', P.sabadoHabil.fuente]
    ];

    return '' +
    '<div class="vista__cab">' +
      '<h1>Plazos y parámetros</h1>' +
      '<p>Todo lo que corre contra el reloj, y todas las cifras variables de las que depende el cálculo. Las que ' +
      'están marcadas <span class="cita cita--verificar">por validar</span> son las que hay que sincronizar de una ' +
      'fuente oficial: en este demo están cargadas a mano.</p>' +
    '</div>' +

    '<div class="titulillo">Línea de tiempo</div>' +
    '<div class="lista-h">' + eventos.map(function (e) {
      var d = CL.difDias(HOY, e.f);
      var nivel = e.hecho ? 'ok' : d < 0 ? 'vencido' : d <= 7 ? 'riesgo' : 'ok';
      return '<article class="h-item h-item--' + nivel + '"><div class="h-cab" style="cursor:default">' +
        '<span>' +
          '<span class="h-t" style="font-size:0.98rem">' + e.q + '</span>' +
          '<span class="tile__s" style="display:block;margin-top:0.35rem">' + e.n + '</span>' +
          '<span class="h-meta"><span class="cita cita--' + e.tipo + '">' + e.cita + '</span>' +
            (e.hecho ? '<span class="pill pill--ok">hecho</span>' : '') + '</span>' +
        '</span>' +
        '<span class="h-costo">' +
          '<span class="cifra" style="color:' + (e.hecho ? 'var(--st-ok)' : d < 0 ? 'var(--st-vencido)' : d <= 7 ? 'var(--st-riesgo)' : 'var(--tinta-2)') + '">' +
            (e.hecho ? '✓' : d < 0 ? 'vencido' : d === 0 ? 'hoy' : d < 400 ? d + ' d' : Math.round(d / 30) + ' m') + '</span>' +
          '<small>' + CL.fechaCorta(e.f) + '</small>' +
        '</span>' +
      '</div></article>';
    }).join('') + '</div>' +

    '<hr class="sep">' +
    '<div class="aviso-param">' +
      '<strong>Estos parámetros están cargados a mano el ' + CL.fechaLarga(P.cargado) + '.</strong> En producción se ' +
      'sincronizan a diario desde el SII (UF, UTM), la Superintendencia de Pensiones (topes y comisiones) y la ley de ' +
      'reajuste vigente (ingreso mínimo). Un parámetro desactualizado produce un cálculo equivocado, y en este producto ' +
      'un cálculo equivocado es un pasivo. Por eso se muestran todos, con su fuente y su fecha, en vez de esconderlos.' +
    '</div>' +

    '<div class="titulillo" style="margin-top:var(--sp-m)">Parámetros vigentes</div>' +
    '<div class="scroll-x"><table class="tabla param-tabla">' +
      '<thead><tr><th>Parámetro</th><th>Valor</th><th>Origen</th></tr></thead>' +
      '<tbody>' + params.map(function (p) {
        return '<tr><td><strong>' + p[0] + '</strong><div class="chico tenue" style="margin-top:0.2rem;max-width:44ch">' + p[3] + '</div></td>' +
          '<td class="mono" style="white-space:nowrap">' + p[1] + '</td>' +
          '<td class="conf"><span class="cita cita--' + p[2] + '">' + (p[2] === 'norma' ? 'en la ley' : 'por validar') + '</span></td></tr>';
      }).join('') + '</tbody>' +
    '</table></div>' +

    '<div class="titulillo" style="margin-top:var(--sp-m)">Feriados cargados para el cómputo de días hábiles · ' + HOY.getFullYear() + '</div>' +
    '<div class="ficha"><p class="chico mono" style="line-height:1.9">' +
      (CL.FERIADOS[HOY.getFullYear()] || []).map(function (f) { return CL.fechaCorta(f); }).join(' · ') +
    '</p><p class="chico tenue" style="margin-top:0.6rem">Tabla cargada, no calculada. Los feriados trasladables y los ' +
    'feriados regionales tienen que venir de una fuente oficial. <span class="cita cita--verificar">por validar</span></p></div>';
  }

  /* ============================================================ HELPERS ==== */
  function campo(l, inner) {
    var id = (inner.match(/id="([^"]+)"/) || [])[1] || '';
    return '<div class="campo"><label for="' + id + '">' + l + '</label>' + inner + '</div>';
  }
  function sw(id, txt, checked, disabled) {
    return '<label class="switch"><input type="checkbox" id="' + id + '"' + (checked ? ' checked' : '') +
      (disabled ? ' disabled' : '') + '><span>' + txt + '</span></label>';
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  var toastT;
  function toast(msg) {
    var el = $('#toast');
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastT);
    toastT = setTimeout(function () { el.hidden = true; }, 4200);
  }

  function mostrarPanel(titulo, html) {
    $('#panel-titulo').textContent = titulo;
    $('#panel-cuerpo').innerHTML = html;
    $('#panel-fondo').hidden = false;
    $('#panel-cerrar').focus();
  }
  function cerrarPanel() { $('#panel-fondo').hidden = true; }

  function irA(v) {
    S.vista = v;
    render();
    window.scrollTo(0, 0);
  }

  /* ============================================================== RENDER === */
  var VISTAS = {
    tablero: renderTablero,
    trabajadores: renderTrabajadores,
    contratar: renderContratar,
    finiquito: renderFiniquito,
    plazos: renderPlazos
  };

  function render() {
    var H = hallazgos().filter(function (h) { return !h.resuelto; });
    var vencidos = H.filter(function (h) { return h.nivel === 'vencido'; }).length;

    $$('.nav-tabs button').forEach(function (b) {
      var sel = b.dataset.vista === S.vista;
      b.setAttribute('aria-selected', String(sel));
      var pip = $('.pip', b);
      if (pip) { pip.hidden = vencidos === 0; pip.textContent = vencidos; }
    });

    $('#vista').innerHTML = VISTAS[S.vista]();
    conectar();
  }

  /* Delegación: se reconecta después de cada render. */
  function conectar() {
    var v = $('#vista');

    $$('[data-toggle]', v).forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.dataset.toggle;
        S.abiertos[id] = !S.abiertos[id];
        render();
      });
    });

    $$('[data-accion]', v).forEach(function (b) {
      b.addEventListener('click', function () {
        var p = b.dataset.accion.split(':');
        var h = hallazgos().filter(function (x) { return x.id === p[0]; })[0];
        if (!h) return;
        var antes = hallazgos().filter(function (x) { return !x.resuelto; }).reduce(function (s, x) { return s + x.costo; }, 0);
        h.acciones[+p[1]].fn();
        var despues = hallazgos().filter(function (x) { return !x.resuelto; }).reduce(function (s, x) { return s + x.costo; }, 0);
        if (S.vista === 'tablero') {
          render();
          var t = $('#tile-riesgo');
          if (t && despues < antes) t.classList.add('destella');
        }
      });
    });

    $$('[data-orden]', v).forEach(function (b) {
      b.addEventListener('click', function () { S.ordenH = b.dataset.orden; render(); });
    });
    $$('[data-filtro]', v).forEach(function (b) {
      b.addEventListener('click', function () { S.filtroT = b.dataset.filtro; render(); });
    });
    $$('[data-ficha]', v).forEach(function (b) {
      b.addEventListener('click', function () { abrirFicha(b.dataset.ficha); });
    });

    /* --- wizard --- */
    var w = S.wiz.datos;
    bind('#w-nombre', 'input', function (e) { w.nombre = e.target.value; });
    bind('#w-cargo', 'input', function (e) { w.cargo = e.target.value; });
    bind('#w-rut', 'input', function (e) { w.rut = e.target.value; render(); ponerFoco('#w-rut'); });
    bind('#w-ingreso', 'change', function (e) { w.ingreso = e.target.value; render(); });
    bind('#w-sig1', 'click', function () { S.wiz.paso = 2; render(); });
    bind('#w-tipo', 'change', function (e) { w.tipo = e.target.value; render(); });
    bind('#w-jornada', 'change', function (e) { w.jornada = +e.target.value; render(); });
    bind('#w-base', 'input', function (e) { w.base = e.target.value; render(); ponerFoco('#w-base'); });
    bind('#w-afp', 'change', function (e) { w.afp = e.target.value; render(); });
    bind('#w-salud', 'change', function (e) { w.salud = e.target.value; });
    bind('#w-sig2', 'click', function () { S.wiz.paso = 3; render(); });
    bind('#w-atras2', 'click', function () { S.wiz.paso = 1; render(); });
    bind('#w-atras3', 'click', function () { S.wiz.paso = 2; render(); });
    bind('#w-guardar', 'click', function () {
      var base = parseInt(String(w.base).replace(/\D/g, ''), 10) || 0;
      if (w.prellenado) {
        var t = trab(w.prellenado);
        t.docs.contrato = 1; t.jornadaContrato = +w.jornada; t.base = base;
        if (+w.jornada === 42) t.docs.anexo42 = 1;
        S.resueltos['contrato-fernanda'] = true;
        toast('Contrato de ' + t.nombre.split(' ')[0] + ' generado. Falta firmarlo: el plazo del art. 9 se cierra al firmar.');
      } else {
        S.trabajadores.push({
          id: 't' + (S.trabajadores.length + 1), nombre: w.nombre, rut: CL.rutFormato(w.rut), cargo: w.cargo,
          tipo: w.tipo === 'obra' ? 'plazo_fijo' : w.tipo, ingreso: w.ingreso, base: base,
          afp: w.afp, salud: w.salud, jornadaContrato: +w.jornada, comuna: 'San Bernardo', hhee: 0, renovaciones: 0,
          docs: { contrato: 1, anexo42: +w.jornada === 42 ? 1 : 0, karin: S.protocoloKarin ? 1 : 0, riohs: S.riohs ? 1 : 0, pactoHHEE: 0 }
        });
        toast(w.nombre + ' incorporado. Contrato generado y reloj del art. 9 cerrado.');
      }
      S.wiz = { paso: 1, datos: { nombre: '', rut: '', cargo: '', base: '', tipo: 'indefinido', jornada: 42, afp: 'Modelo', salud: 'Fonasa', ingreso: CL.fechaCorta(HOY) } };
      irA('trabajadores');
    });

    /* --- finiquito --- */
    bind('#f-trab', 'change', function (e) {
      S.fin.trabajador = e.target.value;
      var t = trab(e.target.value);
      S.fin.termino = t.separacion || CL.fechaCorta(HOY);
      S.finAhorro = 0;
      render();
    });
    bind('#f-causal', 'change', function (e) { S.fin.causal = e.target.value; S.finAhorro = 0; render(); });
    bind('#f-fecha', 'change', function (e) { S.fin.termino = e.target.value; render(); });
    bind('#f-aviso30', 'change', function (e) { S.fin.avisoConAnticipacion = e.target.checked; render(); });
    bind('#f-avisoinsp', 'change', function (e) { S.fin.avisoInspeccion = e.target.checked; render(); });
    bind('#f-registro', 'change', function (e) { S.fin.registroAsistencia = e.target.checked; render(); });
    bind('#f-sabado', 'change', function (e) { S.fin.sabadoHabil = e.target.checked; render(); });
    bind('#f-corregir', 'click', function () {
      var t = trab(S.fin.trabajador);
      var antes = calcFin().riesgo.total;
      S.cotizacionesImpagas = S.cotizacionesImpagas.filter(function (id) { return id !== t.id; });
      if (!S.cotizacionesImpagas.length) S.resueltos['cotiz-impagas'] = true;
      S.fin.avisoInspeccion = true;
      S.fin.registroAsistencia = true;
      if (t.tipo === 'plazo_fijo' && t.renovaciones >= 2) { t.tipo = 'indefinido'; t.renovaciones = 0; S.resueltos['plazo-fijo-jonathan'] = true; }
      if (t.fuero) { S.fin.trabajador = 't6'; toast('Camila tiene fuero: el término no se puede corregir, se bloquea. Volvimos a Héctor.'); }
      var despues = calcFin().riesgo.total;
      S.finAhorro = Math.max(0, antes - despues);
      render();
      if (S.finAhorro > 0) toast('Corregido. Dejaste de arriesgar ' + CL.clp(S.finAhorro) + ' antes de firmar.');
    });
    bind('#f-cerrar', 'click', function () {
      var t = trab(S.fin.trabajador);
      var f = calcFin();
      t.terminado = true;
      t.enTermino = false;
      S.resueltos['finiquito-hector'] = true;
      var otro = activos()[0];
      S.fin.trabajador = otro ? otro.id : t.id;
      S.fin.termino = CL.fechaCorta(HOY);
      S.finAhorro = 0;
      $('#app-empresa-r').textContent = EMPRESA.rut + ' · ' + activos().length + ' trabajadores';
      irA('tablero');
      toast('Término cerrado: ' + CL.clp(f.total) + ' pagados y finiquito ratificado. ' +
            t.nombre.split(' ')[0] + ' sale de la nómina. Quedan ' + activos().length + ' trabajadores.');
    });

    bind('#f-doc', 'click', function () {
      var t = trab(S.fin.trabajador);
      mostrarPanel('Finiquito · ' + t.nombre, '<div class="doc">' + docFiniquito(t, calcFin()) + '</div>' +
        '<div class="descargo" style="margin-top:var(--sp-s)"><strong>Este documento es un borrador.</strong> Debe ' +
        'revisarlo un abogado laboral y ratificarse ante ministro de fe (art. 177). Las marcas amarillas son ' +
        'advertencias de Contralta sobre declaraciones que hoy serían falsas.</div>' +
        '<div class="h-acciones" style="margin-top:var(--sp-s)"><button class="btn btn--fantasma" data-cerrar-panel>Cerrar</button></div>');
    });
    bind('#f-carta', 'click', function () {
      var t = trab(S.fin.trabajador);
      mostrarPanel('Carta de aviso · ' + t.nombre, '<div class="doc">' + docCarta(t, calcFin()) + '</div>' +
        '<div class="descargo" style="margin-top:var(--sp-s)"><strong>Plazo.</strong> La copia a la Inspección del ' +
        'Trabajo se envía dentro de 3 días hábiles desde la separación para las causales del art. 160 y del art. 159 ' +
        'N°4, 5 y 6. <span class="cita cita--norma">Art. 162 CT</span></div>' +
        '<div class="h-acciones" style="margin-top:var(--sp-s)"><button class="btn btn--fantasma" data-cerrar-panel>Cerrar</button></div>');
    });

    $$('[data-cerrar-panel]').forEach(function (b) { b.addEventListener('click', cerrarPanel); });
    $$('[data-finiquitar]').forEach(function (b) {
      b.addEventListener('click', function () {
        S.fin.trabajador = b.dataset.finiquitar;
        var t = trab(b.dataset.finiquitar);
        S.fin.termino = t.separacion || CL.fechaCorta(HOY);
        S.finAhorro = 0;
        cerrarPanel();
        irA('finiquito');
      });
    });
  }

  function calcFin() {
    var t = trab(S.fin.trabajador);
    return CL.finiquito({
      base: t.base, ingreso: t.ingreso, termino: S.fin.termino, causal: S.fin.causal,
      diasFeriado: t.diasFeriado || 6,
      tipo: (t.tipo === 'plazo_fijo' && t.renovaciones >= 2) ? 'plazo_fijo_2a_renovacion' : t.tipo,
      fuero: t.fuero,
      cotizacionesAlDia: S.cotizacionesImpagas.indexOf(t.id) === -1,
      avisoConAnticipacion: S.fin.avisoConAnticipacion,
      avisoInspeccion: S.fin.avisoInspeccion,
      registroAsistencia: S.fin.registroAsistencia,
      sabadoHabil: S.fin.sabadoHabil
    });
  }

  function bind(sel, ev, fn) {
    var el = $(sel);
    if (el) el.addEventListener(ev, fn);
  }
  function ponerFoco(sel) {
    var el = $(sel);
    if (el) { el.focus(); var v = el.value; el.value = ''; el.value = v; }
  }

  /* ================================================================ INIT === */
  $$('.nav-tabs button').forEach(function (b) {
    b.addEventListener('click', function () { irA(b.dataset.vista); });
  });
  $('#panel-cerrar').addEventListener('click', cerrarPanel);
  $('#panel-fondo').addEventListener('click', function (e) {
    if (e.target === $('#panel-fondo')) cerrarPanel();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') cerrarPanel();
  });

  $('#app-empresa-n').textContent = EMPRESA.nombre;
  $('#app-empresa-r').textContent = EMPRESA.rut + ' · ' + activos().length + ' trabajadores';

  render();
})();
