/* ============================================================================
   CONTRALTA — motor de cálculo. NO hay IA acá, y ese es el punto.
   ----------------------------------------------------------------------------
   Plazos, montos y días hábiles se calculan con aritmética y un calendario.
   Un modelo de lenguaje que "estima" una indemnización es un pasivo legal.
   Todo parámetro variable (UF, UTM, IMM, topes, comisiones AFP) vive en
   CL.PARAMS con su fecha de carga y su nivel de confianza declarado.
   ========================================================================== */

var CL = (function () {
  'use strict';

  /* ------------------------------------------------------------ parámetros */
  /* CONFIANZA:
       'norma'     → está en la ley y lo citamos con artículo.
       'verificar' → parámetro variable o criterio interpretativo. En producción
                     se sincroniza desde la fuente oficial. Acá está cargado a
                     mano y hay que validarlo. Lo decimos en la interfaz.       */
  var PARAMS = {
    cargado: '2026-07-01',
    uf:  { valor: 39480, conf: 'verificar', fuente: 'Banco Central / SII — se sincroniza a diario' },
    utm: { valor: 69542, conf: 'verificar', fuente: 'SII — mensual' },
    imm: { valor: 529000, conf: 'verificar', fuente: 'Ley de reajuste del ingreso mínimo vigente' },

    topeImponibleUF:  { valor: 87.8,  conf: 'verificar', fuente: 'Superintendencia de Pensiones — anual' },
    topeAFCUF:        { valor: 131.9, conf: 'verificar', fuente: 'Superintendencia de Pensiones — anual' },
    topeIndemnUF:     { valor: 90,    conf: 'norma',     fuente: 'Art. 172 CT — tope de la base de cálculo' },
    topeAniosIAS:     { valor: 11,    conf: 'norma',     fuente: 'Art. 163 CT — tope 11 años' },

    gratifTopeIMM:    { valor: 4.75,  conf: 'norma',     fuente: 'Art. 50 CT — 25% con tope de 4,75 IMM al año' },
    gratifPorcentaje: { valor: 0.25,  conf: 'norma',     fuente: 'Art. 50 CT' },

    jornadaMaxima:    { valor: 42,    conf: 'norma',     fuente: 'Ley 21.561 — 42 h desde el 26-04-2026; 40 h desde el 26-04-2028' },
    recargoHoraExtra: { valor: 0.5,   conf: 'norma',     fuente: 'Art. 32 CT — recargo mínimo 50%' },

    afc: {
      indefinido:  { empleador: 0.024, trabajador: 0.006 },
      plazo_fijo:  { empleador: 0.030, trabajador: 0.000 },
      conf: 'verificar', fuente: 'Ley 19.728 — verificar tasas vigentes'
    },
    sis:    { valor: 0.0188, conf: 'verificar', fuente: 'Seguro de invalidez y sobrevivencia, de cargo del empleador. Cambia con cada licitación.' },
    mutual: { valor: 0.0095, conf: 'verificar', fuente: 'Ley 16.744: básica 0,90% + adicional por riesgo (0% a 3,4%) + Ley SANNA. El % exacto depende de tu actividad y siniestralidad.' },
    salud:  { valor: 0.07,   conf: 'norma',     fuente: 'Cotización de salud, mínimo 7%' },
    afpTasa:{ valor: 0.10,   conf: 'norma',     fuente: 'Cotización obligatoria 10%' },

    /* Comisiones de AFP — REFERENCIALES. Cambian y hay que sincronizarlas. */
    afp: {
      'Capital':  1.44, 'Cuprum': 1.44, 'Habitat': 1.27, 'Modelo': 0.58,
      'PlanVital': 1.16, 'Provida': 1.45, 'Uno': 0.49,
      conf: 'verificar', fuente: 'Superintendencia de Pensiones — comisión sobre renta imponible, %'
    },

    /* Multas: art. 505 bis (tamaño) y art. 506 (rangos). Rangos a validar. */
    multas: {
      micro:    { trab: '1 a 9',     min: 1, max: 10 },
      pequena:  { trab: '10 a 49',   min: 1, max: 10 },
      mediana:  { trab: '50 a 199',  min: 2, max: 40 },
      grande:   { trab: '200 o más', min: 3, max: 60 },
      conf: 'verificar', fuente: 'Arts. 505 bis y 506 CT — rangos en UTM. Validar redacción vigente.'
    },

    /* Cómputo de plazos de días hábiles: criterio no pacífico. Ver diasHabiles(). */
    sabadoHabil: { valor: true, conf: 'verificar',
      fuente: 'Criterio de cómputo. Para los plazos del Código del Trabajo, la DT ha sostenido que son inhábiles los domingos y festivos. Hay lecturas que además excluyen el sábado. Contralta calcula las dos y recomienda la conservadora.' }
  };

  /* Feriados de Chile — tabla cargada, no calculada. En producción viene de una
     fuente oficial (feriados.cl / DS del Ministerio del Interior).            */
  var FERIADOS = {
    2026: ['2026-01-01','2026-04-03','2026-04-04','2026-05-01','2026-05-21','2026-06-20',
           '2026-06-29','2026-07-16','2026-08-15','2026-09-18','2026-09-19','2026-10-12',
           '2026-10-31','2026-11-01','2026-12-08','2026-12-25'],
    2027: ['2027-01-01','2027-03-26','2027-03-27','2027-05-01','2027-05-21','2027-06-21',
           '2027-06-28','2027-07-16','2027-08-15','2027-09-18','2027-09-19','2027-10-11',
           '2027-10-31','2027-11-01','2027-12-08','2027-12-25']
  };

  /* --------------------------------------------------------------- fechas   */

  var MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto',
               'septiembre','octubre','noviembre','diciembre'];
  var DIAS = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];

  function hoy() {
    var d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  function fecha(s) {           /* 'YYYY-MM-DD' -> Date local, sin sorpresas de TZ */
    if (s instanceof Date) return new Date(s.getFullYear(), s.getMonth(), s.getDate());
    var p = s.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function fechaCorta(d) {
    d = fecha(d);
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var a = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + a;
  }
  function fechaLarga(d) {
    d = fecha(d);
    return d.getDate() + ' de ' + MESES[d.getMonth()] + ' de ' + d.getFullYear();
  }
  function fechaDia(d) {
    d = fecha(d);
    return DIAS[d.getDay()] + ' ' + d.getDate() + ' de ' + MESES[d.getMonth()];
  }
  function masDias(d, n) {
    var x = fecha(d);
    x.setDate(x.getDate() + n);
    return x;
  }
  function difDias(a, b) {       /* días corridos de a hasta b */
    return Math.round((fecha(b) - fecha(a)) / 86400000);
  }
  function esFeriado(d) {
    var y = fecha(d).getFullYear();
    return (FERIADOS[y] || []).indexOf(fechaCorta(d)) !== -1;
  }
  function esHabil(d, sabadoHabil) {
    var dow = fecha(d).getDay();
    if (dow === 0) return false;                       /* domingo, siempre inhábil */
    if (dow === 6 && !sabadoHabil) return false;       /* sábado, según criterio    */
    return !esFeriado(d);
  }
  /* Suma n días hábiles a partir del día siguiente a 'desde'. */
  function masDiasHabiles(desde, n, sabadoHabil) {
    var d = fecha(desde), c = 0;
    while (c < n) {
      d = masDias(d, 1);
      if (esHabil(d, sabadoHabil)) c++;
    }
    return d;
  }
  /* Días hábiles que faltan de hoy (excl.) hasta 'hasta' (incl.). Negativo si pasó. */
  function habilesRestantes(hasta, sabadoHabil, desde) {
    var h = desde ? fecha(desde) : hoy();
    var t = fecha(hasta);
    if (difDias(h, t) < 0) return -contarHabiles(t, h, sabadoHabil) || 0;
    return contarHabiles(h, t, sabadoHabil);
  }
  function contarHabiles(a, b, sabadoHabil) {
    var d = fecha(a), c = 0;
    while (difDias(d, b) > 0) {
      d = masDias(d, 1);
      if (esHabil(d, sabadoHabil)) c++;
    }
    return c;
  }
  function proximoHabil(d, sabadoHabil) {
    var x = fecha(d);
    while (!esHabil(x, sabadoHabil)) x = masDias(x, 1);
    return x;
  }

  /* ---------------------------------------------------------------- formato */

  function miles(n) {
    var neg = n < 0;
    var s = String(Math.round(Math.abs(n)));
    var out = '';
    while (s.length > 3) { out = '.' + s.slice(-3) + out; s = s.slice(0, -3); }
    return (neg ? '-' : '') + s + out;
  }
  function clp(n) { return '$' + miles(n); }
  function clpCorto(n) {                     /* $8,9M para titulares */
    if (Math.abs(n) >= 1000000) return '$' + (n / 1000000).toFixed(1).replace('.', ',') + 'M';
    if (Math.abs(n) >= 1000) return '$' + Math.round(n / 1000) + 'k';
    return clp(n);
  }
  function pct(n) { return (n * 100).toFixed(1).replace('.', ',') + '%'; }
  function utm(n) { return miles(n * PARAMS.utm.valor); }

  /* -------------------------------------------------------------- RUT (m11) */

  function rutDV(num) {
    var s = 0, m = 2, str = String(num);
    for (var i = str.length - 1; i >= 0; i--) {
      s += (+str[i]) * m;
      m = (m === 7) ? 2 : m + 1;
    }
    var r = 11 - (s % 11);
    return r === 11 ? '0' : r === 10 ? 'K' : String(r);
  }
  function rutValido(rut) {
    var limpio = String(rut).toUpperCase().replace(/[^0-9K]/g, '');
    if (limpio.length < 2) return false;
    var cuerpo = limpio.slice(0, -1);
    var dv = limpio.slice(-1);
    if (!/^\d+$/.test(cuerpo)) return false;
    return rutDV(cuerpo) === dv;
  }
  function rutFormato(rut) {
    var limpio = String(rut).toUpperCase().replace(/[^0-9K]/g, '');
    if (limpio.length < 2) return limpio;
    var cuerpo = limpio.slice(0, -1), dv = limpio.slice(-1);
    return miles(+cuerpo) + '-' + dv;
  }

  /* ------------------------------------------------- cotizaciones: el día 13 */
  /* Se declaran y pagan hasta el día 10 del mes siguiente (papel) o el 13 por
     vía electrónica (Previred). Si el 13 cae en día inhábil, corre al hábil
     siguiente. → plazo a validar con Previred / normativa vigente.            */
  function vencimientoCotizaciones(ref) {
    var h = ref ? fecha(ref) : hoy();
    /* El período que se paga este mes es el mes anterior. */
    var v = proximoHabil(new Date(h.getFullYear(), h.getMonth(), 13), true);
    var periodoMes = h.getMonth() - 1, periodoAnio = h.getFullYear();
    if (periodoMes < 0) { periodoMes = 11; periodoAnio--; }
    /* Si el vencimiento de este mes ya pasó, el próximo plazo es el del mes que viene. */
    if (difDias(h, v) < 0) {
      v = proximoHabil(new Date(h.getFullYear(), h.getMonth() + 1, 13), true);
      periodoMes = h.getMonth(); periodoAnio = h.getFullYear();
    }
    return {
      fecha: v,
      dias: difDias(h, v),
      periodo: MESES[periodoMes] + ' de ' + periodoAnio
    };
  }

  /* ----------------------------------------------------- gratificación art.50 */
  function gratificacionMensual(base) {
    var porPorcentaje = base * PARAMS.gratifPorcentaje.valor;
    var tope = PARAMS.gratifTopeIMM.valor * PARAMS.imm.valor / 12;
    return { monto: Math.min(porPorcentaje, tope), tope: tope, topeado: porPorcentaje > tope };
  }

  /* ------------------------------------------------------ valor de hora extra */
  /* Criterio DT: valor hora ordinaria = (sueldo base / 30 × 28) / jornada semanal.
     Hora extraordinaria = valor hora × 1,5 (art. 32).                          */
  function horaExtra(base, jornada) {
    var horaOrd = (base / 30 * 28) / jornada;
    return { ordinaria: horaOrd, extra: horaOrd * (1 + PARAMS.recargoHoraExtra.valor) };
  }

  /* --------------------------------------------------- cotizaciones mensuales */
  function cotizaciones(base, afpNombre, tipoContrato) {
    var imponible = Math.min(base, PARAMS.topeImponibleUF.valor * PARAMS.uf.valor);
    var comision = (PARAMS.afp[afpNombre] || 1.0) / 100;
    var afc = tipoContrato === 'plazo_fijo' ? PARAMS.afc.plazo_fijo : PARAMS.afc.indefinido;
    var trabajador = imponible * (PARAMS.afpTasa.valor + comision + PARAMS.salud.valor + afc.trabajador);
    var empleador = imponible * (PARAMS.sis.valor + afc.empleador + PARAMS.mutual.valor);
    return {
      imponible: imponible,
      trabajador: trabajador,
      empleador: empleador,
      total: trabajador + empleador,
      detalle: [
        { q: 'AFP ' + afpNombre + ' — cotización obligatoria', p: PARAMS.afpTasa.valor, m: imponible * PARAMS.afpTasa.valor, quien: 'trabajador', conf: 'norma' },
        { q: 'AFP ' + afpNombre + ' — comisión', p: comision, m: imponible * comision, quien: 'trabajador', conf: 'verificar' },
        { q: 'Salud (Fonasa / isapre)', p: PARAMS.salud.valor, m: imponible * PARAMS.salud.valor, quien: 'trabajador', conf: 'norma' },
        { q: 'Seguro de cesantía', p: afc.trabajador, m: imponible * afc.trabajador, quien: 'trabajador', conf: 'verificar' },
        { q: 'Seguro de cesantía', p: afc.empleador, m: imponible * afc.empleador, quien: 'empleador', conf: 'verificar' },
        { q: 'SIS — invalidez y sobrevivencia', p: PARAMS.sis.valor, m: imponible * PARAMS.sis.valor, quien: 'empleador', conf: 'verificar' },
        { q: 'Mutual — Ley 16.744', p: PARAMS.mutual.valor, m: imponible * PARAMS.mutual.valor, quien: 'empleador', conf: 'verificar' }
      ]
    };
  }

  /* ================================================================ FINIQUITO */
  /*
     opts = {
       base, ingreso, termino, causal, diasFeriado, tipo, fuero,
       cotizacionesAlDia, avisoConAnticipacion, avisoInspeccion,
       registroAsistencia, sabadoHabil
     }
  */
  function finiquito(o) {
    var sabadoHabil = (o.sabadoHabil === undefined) ? PARAMS.sabadoHabil.valor : o.sabadoHabil;
    var ingreso = fecha(o.ingreso);
    var termino = fecha(o.termino);

    /* --- antigüedad: años completos + fracción superior a 6 meses (art. 163) */
    var anios = termino.getFullYear() - ingreso.getFullYear();
    var aniv = new Date(ingreso.getFullYear() + anios, ingreso.getMonth(), ingreso.getDate());
    if (difDias(aniv, termino) < 0) { anios--; aniv = new Date(ingreso.getFullYear() + anios, ingreso.getMonth(), ingreso.getDate()); }
    var mesesFraccion = difDias(aniv, termino) / 30.4375;
    var fraccionCuenta = mesesFraccion > 6;
    var aniosIAS = Math.min(anios + (fraccionCuenta ? 1 : 0), PARAMS.topeAniosIAS.valor);
    var topeado = (anios + (fraccionCuenta ? 1 : 0)) > PARAMS.topeAniosIAS.valor;

    /* --- base de cálculo: sueldo base + gratificación mensual, tope 90 UF ---- */
    var grat = gratificacionMensual(o.base);
    var baseBruta = o.base + grat.monto;
    var topeBase = PARAMS.topeIndemnUF.valor * PARAMS.uf.valor;
    var baseCalculo = Math.min(baseBruta, topeBase);
    var baseTopeada = baseBruta > topeBase;

    /* --- líneas del finiquito --------------------------------------------- */
    var lineas = [];
    var causal = o.causal;
    var daIndemnizacion = (causal === '161');

    if (daIndemnizacion) {
      lineas.push({
        q: 'Indemnización por años de servicio',
        d: aniosIAS + ' año' + (aniosIAS === 1 ? '' : 's') + ' × ' + clp(baseCalculo),
        m: aniosIAS * baseCalculo,
        cita: 'Art. 163 CT', citaTipo: 'norma',
        nota: fraccionCuenta
          ? 'Son ' + anios + ' años y ' + Math.floor(mesesFraccion) + ' meses. La fracción supera los 6 meses, así que cuenta como un año completo: se pagan ' + aniosIAS + '. Contar ' + anios + ' es el error más caro y más común.'
          : 'Son ' + anios + ' años y ' + Math.floor(mesesFraccion) + ' meses. La fracción no supera 6 meses, no suma año.'
      });
      if (o.avisoConAnticipacion === false || o.avisoConAnticipacion === undefined) {
        lineas.push({
          q: 'Indemnización sustitutiva del aviso previo',
          d: '1 mes × ' + clp(baseCalculo),
          m: baseCalculo,
          cita: 'Art. 161 inc. 2 CT', citaTipo: 'norma',
          nota: 'No se dio el aviso con 30 días de anticipación, así que se paga el mes.'
        });
      }
    }

    /* Feriado proporcional: los días hábiles pendientes se pagan incluyendo los
       domingos y festivos comprendidos. El factor de conversión es un criterio
       de cómputo — marcado como por validar.                                   */
    var diasHabilesFeriado = o.diasFeriado || 0;
    var diasCorridosFeriado = diasHabilesFeriado * 1.4;
    if (diasHabilesFeriado > 0) {
      lineas.push({
        q: 'Feriado proporcional',
        d: fmtNum(diasHabilesFeriado) + ' días hábiles ≈ ' + fmtNum(diasCorridosFeriado) + ' corridos × ' + clp(baseCalculo / 30),
        m: (baseCalculo / 30) * diasCorridosFeriado,
        cita: 'Arts. 67 a 73 CT', citaTipo: 'norma',
        nota: 'El feriado se paga con remuneración íntegra e incluye los domingos y festivos comprendidos en el período. El factor 1,4 es la conversión de días hábiles a corridos que usa la práctica — verificar el criterio.',
        conf: 'verificar'
      });
    }

    lineas.push({
      q: 'Gratificación proporcional del ejercicio',
      d: 'Ya pagada mes a mes (art. 50)',
      m: 0,
      cita: 'Art. 50 CT', citaTipo: 'norma',
      nota: 'Esta empresa paga la gratificación mensualmente con el 25% topado en 4,75 IMM al año. Ya está pagada: no se vuelve a pagar en el finiquito. Si tu empresa reparte utilidades (art. 47), acá va un cálculo distinto.'
    });

    var total = lineas.reduce(function (s, l) { return s + l.m; }, 0);

    /* --- plazos ------------------------------------------------------------ */
    /* Ley 21.361 / art. 177: el finiquito debe otorgarse y ponerse a disposición
       del trabajador dentro de 10 días hábiles desde la separación. → validar.  */
    var plazoA = masDiasHabiles(termino, 10, true);   /* sábado hábil */
    var plazoB = masDiasHabiles(termino, 10, false);  /* sábado inhábil */
    var plazos = {
      finiquitoA: plazoA, finiquitoB: plazoB,
      restanA: habilesRestantes(plazoA, true),
      restanB: habilesRestantes(plazoB, false),
      corridosA: difDias(hoy(), plazoA),
      corridosB: difDias(hoy(), plazoB),
      avisoInspeccion: masDiasHabiles(termino, 3, true)
    };

    /* --- hallazgos --------------------------------------------------------- */
    var hallazgos = [];
    var riesgo = { total: 0, items: [] };

    function riesgoAdd(nombre, monto, nota) {
      riesgo.items.push({ nombre: nombre, monto: monto, nota: nota });
      riesgo.total += monto;
    }

    /* 1. Ley Bustos — el hallazgo más caro que existe. */
    if (o.cotizacionesAlDia === false) {
      var bustos = baseCalculo * 3;
      hallazgos.push({
        nivel: 'vencido',
        titulo: 'Cotizaciones impagas: el despido sería nulo. ',
        texto: 'Si al momento del despido las cotizaciones previsionales no están íntegramente pagadas, el despido no produce el efecto de poner término al contrato. Sigues debiendo las remuneraciones hasta que convalides el despido pagando lo adeudado. Paga las cotizaciones y convalida <strong>antes</strong> de firmar.',
        cita: 'Art. 162 inc. 5 CT — Ley Bustos', citaTipo: 'norma',
        costo: bustos
      });
      riesgoAdd('Nulidad del despido (Ley Bustos)', bustos,
        'Estimación: 3 meses de remuneración hasta convalidar. El plazo real depende de cuándo te des cuenta; hay casos de más de un año. Supuesto declarado, no una cifra de la ley.');
    }

    /* 2. Fuero. */
    if (o.fuero) {
      var f = baseCalculo * 6;
      hallazgos.push({
        nivel: 'vencido',
        titulo: 'Tiene fuero ' + o.fuero + '. No puedes despedir sin autorización judicial. ',
        texto: 'El despido de un trabajador con fuero requiere autorización previa del juez (desafuero). Sin ella, el despido es nulo: procede la reincorporación y el pago de las remuneraciones del período de separación. Esto no se arregla pagando más: se para acá y se llama a un abogado.',
        cita: 'Arts. 174 y 201 CT', citaTipo: 'norma',
        costo: f
      });
      riesgoAdd('Despido de trabajador con fuero', f,
        'Estimación: 6 meses de remuneraciones por el período de separación hasta la reincorporación. Muy variable. Supuesto declarado.');
    }

    /* 3. Plazo fijo en segunda renovación → ya es indefinido. */
    if (o.tipo === 'plazo_fijo_2a_renovacion' && causal === '159-4') {
      var iasNoPagada = aniosIAS * baseCalculo;
      var recargo = iasNoPagada * 0.5;
      hallazgos.push({
        nivel: 'vencido',
        titulo: 'Este contrato ya no es a plazo fijo. ',
        texto: 'El contrato a plazo fijo que se renueva por segunda vez se transforma en indefinido por el solo ministerio de la ley. Terminarlo invocando "vencimiento del plazo" es un despido injustificado: procede la indemnización por años de servicio, más un recargo del 50%.',
        cita: 'Art. 159 N°4 y art. 168 letra a) CT', citaTipo: 'norma',
        costo: iasNoPagada + recargo
      });
      riesgoAdd('Despido injustificado por causal improcedente', iasNoPagada + recargo,
        'Indemnización que no estarías pagando (' + clp(iasNoPagada) + ') más recargo del 50% (art. 168). Los porcentajes de recargo (30/50/80/100%) dependen de la causal invocada — verificar con abogado.');
    }

    /* 4. Causal del art. 160 sin respaldo. */
    if (causal === '160-3') {
      var iasHipotetica = aniosIAS * baseCalculo;
      var recargo80 = iasHipotetica * 0.8;
      hallazgos.push({
        nivel: o.registroAsistencia === true ? 'riesgo' : 'vencido',
        titulo: 'Causal del art. 160: sin prueba, se cae. ',
        texto: o.registroAsistencia === true
          ? 'Tienes registro de asistencia, que es la prueba central. Aun así, el art. 160 exige hechos concretos y fechas en la carta de aviso: si la carta es genérica, el tribunal la desestima aunque tengas razón.'
          : 'Estás invocando una causal del art. 160 (despido sin indemnización) y no hay registro de asistencia que la respalde. Si el trabajador demanda y el tribunal la declara indebida, pagas la indemnización completa con un recargo de hasta 80%.',
        cita: 'Arts. 160 y 168 letra c) CT', citaTipo: 'norma',
        costo: o.registroAsistencia === true ? Math.round(iasHipotetica * 0.3) : iasHipotetica + recargo80
      });
      riesgoAdd('Causal del art. 160 declarada indebida',
        o.registroAsistencia === true ? Math.round(iasHipotetica * 0.3) : iasHipotetica + recargo80,
        'Escenario: el tribunal declara indebida la causal. Se paga la IAS (' + clp(iasHipotetica) + ') más recargo del 80% (art. 168 letra c). Con registro de asistencia el escenario cambia; acá se muestra ponderado. Rangos y porcentajes a validar con abogado.');
    }

    /* 5. Carta de aviso a la Inspección del Trabajo. */
    if (causal !== '159-2' && o.avisoInspeccion === false) {
      hallazgos.push({
        nivel: 'riesgo',
        titulo: 'Falta la copia del aviso a la Inspección del Trabajo. ',
        texto: 'La comunicación de término debe enviarse al trabajador y una copia a la Inspección del Trabajo respectiva. Para las causales del art. 160 y del art. 159 N°4, 5 y 6, el plazo es de <strong>3 días hábiles</strong> desde la separación (6 días hábiles en el caso del 159 N°6). El aviso no valida el despido, pero su omisión es una infracción sancionable.',
        cita: 'Art. 162 CT', citaTipo: 'norma',
        costo: Math.round(3 * PARAMS.utm.valor)
      });
      riesgoAdd('Multa por omisión del aviso', Math.round(3 * PARAMS.utm.valor),
        'Estimación al medio del rango de pequeña empresa (1 a 10 UTM, art. 506). El monto lo fija el fiscalizador. UTM referencial ' + clp(PARAMS.utm.valor) + '.');
    }

    /* 6. Renuncia: recordar la ratificación. */
    if (causal === '159-2') {
      hallazgos.push({
        nivel: 'riesgo',
        titulo: 'La renuncia también tiene formalidad. ',
        texto: 'La renuncia debe darse con 30 días de anticipación y, para que te sirva como prueba, debe ratificarse ante ministro de fe. Una renuncia "de palabra" o un WhatsApp no te protege: si mañana dice que lo echaste, la carga de la prueba es tuya.',
        cita: 'Arts. 159 N°2 y 177 CT', citaTipo: 'norma'
      });
    }

    /* 7. Ratificación del finiquito: siempre. */
    hallazgos.push({
      nivel: 'riesgo',
      titulo: 'El finiquito hay que ratificarlo ante ministro de fe. ',
      texto: 'Firmado por el trabajador y ratificado ante notario, inspector del trabajo, oficial del registro civil, secretario municipal o el presidente del sindicato. Sin ratificación no tiene poder liberatorio: puede reclamarte igual. La DT permite hacerlo en línea por Mi DT.',
      cita: 'Art. 177 CT', citaTipo: 'norma'
    });

    return {
      anios: anios, mesesFraccion: mesesFraccion, fraccionCuenta: fraccionCuenta,
      aniosIAS: aniosIAS, topeado: topeado,
      gratificacion: grat, baseCalculo: baseCalculo, baseTopeada: baseTopeada,
      lineas: lineas, total: total, plazos: plazos,
      hallazgos: hallazgos, riesgo: riesgo,
      sabadoHabil: sabadoHabil
    };
  }

  function fmtNum(n) {
    return (Math.round(n * 10) / 10).toString().replace('.', ',');
  }

  /* ----------------------------------------------------------------- multas */
  function tamanoEmpresa(nTrabajadores) {
    if (nTrabajadores <= 9) return 'micro';
    if (nTrabajadores <= 49) return 'pequena';
    if (nTrabajadores <= 199) return 'mediana';
    return 'grande';
  }
  function rangoMulta(nTrabajadores) {
    var t = PARAMS.multas[tamanoEmpresa(nTrabajadores)];
    return {
      tramo: tamanoEmpresa(nTrabajadores),
      minUTM: t.min, maxUTM: t.max,
      minCLP: t.min * PARAMS.utm.valor,
      maxCLP: t.max * PARAMS.utm.valor
    };
  }

  return {
    PARAMS: PARAMS, FERIADOS: FERIADOS, MESES: MESES,
    hoy: hoy, fecha: fecha, fechaCorta: fechaCorta, fechaLarga: fechaLarga, fechaDia: fechaDia,
    masDias: masDias, difDias: difDias, esHabil: esHabil, esFeriado: esFeriado,
    masDiasHabiles: masDiasHabiles, habilesRestantes: habilesRestantes, proximoHabil: proximoHabil,
    clp: clp, clpCorto: clpCorto, miles: miles, pct: pct, utm: utm, fmtNum: fmtNum,
    rutDV: rutDV, rutValido: rutValido, rutFormato: rutFormato,
    vencimientoCotizaciones: vencimientoCotizaciones,
    gratificacionMensual: gratificacionMensual, horaExtra: horaExtra, cotizaciones: cotizaciones,
    finiquito: finiquito, tamanoEmpresa: tamanoEmpresa, rangoMulta: rangoMulta
  };
})();
