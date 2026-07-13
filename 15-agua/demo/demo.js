/* ============================================================================
   FREATIA — demo. Estado en el cliente, datos mock, cero red.

   Regla del producto y de este archivo: el balance CUADRA SIEMPRE.
   Entradas = salidas + acumulación + sin explicar.
   El nodo "sin explicar" no es decorativo: es el residual calculado, y es
   exactamente el hallazgo que se le vende al cliente.
   ============================================================================ */
(function () {
  "use strict";

  var G = window.FreatiaGraficos;
  var C = G.COLOR;
  var fmt = G.fmt;
  var LS_A_M3 = 86.4;                 // 1 l/s = 86,4 m³/día
  var USD_M3_DESAL = 3.5;             // supuesto declarado: costo del m³ desalado puesto en faena

  function num(v, dec) {
    return new Intl.NumberFormat("es-CL", {
      minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0
    }).format(v);
  }

  /* --- Ruido determinista (para que las series se vean reales y no cambien) - */
  function rnd(semilla) {
    var s = semilla;
    return function () { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
  }
  function serie(semilla, base, ruido, n, quiebre, pendiente) {
    var r = rnd(semilla), out = [];
    for (var i = 0; i < n; i++) {
      var v = base + (r() - 0.5) * ruido;
      if (quiebre !== undefined && i > quiebre) v += (i - quiebre) * pendiente;
      out.push(+v.toFixed(3));
    }
    return out;
  }

  /* ======================================================================
     DATOS MOCK — faenas inventadas, geografía y regulación reales.
     ====================================================================== */

  var NODOS_MINA = [
    { id: "R",  col: 0, nombre: "Recirculación del tranque", color: C.recirc },
    { id: "D",  col: 0, nombre: "Agua de mar desalada",      color: C.agua },
    { id: "P",  col: 0, nombre: "Pozos DGA",                 color: C.agua },
    { id: "C",  col: 0, nombre: "Aguas de contacto",         color: C.agua },
    { id: "CO", col: 1, nombre: "Planta concentradora",      color: C.agua },
    { id: "LX", col: 1, nombre: "Pilas de lixiviación",      color: C.agua },
    { id: "SP", col: 1, nombre: "Supresión de polvo",        color: C.agua },
    { id: "CS", col: 1, nombre: "Campamento y servicios",    color: C.agua },
    { id: "RC", col: 2, nombre: "Vuelve al proceso",         color: C.recirc },
    { id: "OC", col: 2, nombre: "Ocluida en relaves y pilas",color: C.perdida },
    { id: "EV", col: 2, nombre: "Evaporación",               color: C.perdida },
    { id: "IN", col: 2, nombre: "Infiltración y consumo",    color: C.perdida },
    { id: "DS", col: 2, nombre: "Δ almacenamiento",          color: C.acum },
    { id: "SE", col: 2, nombre: "Sin explicar",              color: C.sinexpl }
  ];

  var FAENAS = [
    {
      id: "qs",
      nombre: "Faena Quebrada Seca",
      titular: "Minera Quebrada Seca SpA · RUT 76.412.905-3",
      lugar: "Sierra Gorda, Región de Antofagasta",
      cuenca: "Cuenca endorreica del Salar de Punta Negra",
      cota: "2.486,0 m s.n.m. (coronamiento del muro)",
      ficha: "Cobre sulfuros · 42.000 t/d · relaves espesados",
      derechoDGA: 120,
      nodos: NODOS_MINA,
      /* qué fila del libro corresponde a cada nodo del diagrama */
      mapaNodo: { D: 0, P: 1, C: 2, R: 3, CO: 4, LX: 5, SP: 6, CS: 7, OC: 8, EV: 10, IN: 11, DS: 13 },
      periodos: {
        hoy: { rot: "Últimas 24 h", enlaces: {
          R_CO: 470, D_CO: 188, D_LX: 20, P_CO: 26, P_LX: 24, P_CS: 20, P_SP: 20, C_SP: 26, C_LX: 10,
          CO_RC: 470, CO_OC: 124, CO_EV: 22, CO_IN: 15, CO_DS: 8,
          LX_EV: 38, LX_OC: 16, SP_EV: 46, CS_EV: 14, CS_IN: 6 } },
        "7d": { rot: "Últimos 7 días", enlaces: {
          R_CO: 476, D_CO: 194, D_LX: 20, P_CO: 28, P_LX: 24, P_CS: 20, P_SP: 20, C_SP: 27, C_LX: 10,
          CO_RC: 476, CO_OC: 127, CO_EV: 21, CO_IN: 15, CO_DS: 16,
          LX_EV: 38, LX_OC: 16, SP_EV: 47, CS_EV: 14, CS_IN: 6 } },
        "30d": { rot: "Junio 2026 (mes cerrado)", enlaces: {
          R_CO: 480, D_CO: 190, D_LX: 20, P_CO: 30, P_LX: 25, P_CS: 20, P_SP: 21, C_SP: 27, C_LX: 10,
          CO_RC: 480, CO_OC: 128, CO_EV: 20, CO_IN: 14, CO_DS: 18,
          LX_EV: 39, LX_OC: 16, SP_EV: 48, CS_EV: 14, CS_IN: 6 } }
      },
      /* Libro mayor del agua. Cada partida con su procedencia hasta el sensor. */
      libro: [
        { p: "Agua de mar desalada (impulsión desde Mejillones)", clase: "entrada", ls: { hoy: 208, "7d": 214, "30d": 210 },
          tag: "FIT-1010", instr: "Caudalímetro electromagnético DN800", cal: "medido-degradado",
          origen: "OPC-UA · PLC-01 · 1 muestra/min", cobertura: 99.8,
          calib: "2025-11-04 (vencida hace 8 meses — el certificado exige cada 12 meses)",
          nota: "Es el único medidor de una entrada mayor con la calibración vencida. Un sesgo de +8% aquí explica 17 l/s de la discrepancia." },
        { p: "Pozos DGA PP-03 / PP-05 / PP-07", clase: "entrada", ls: { hoy: 90, "7d": 92, "30d": 96 },
          tag: "FIT-1020", instr: "Caudalímetro ultrasónico + totalizador de extracciones", cal: "medido",
          origen: "OPC-UA + transmisión a la DGA (MEE)", cobertura: 100,
          calib: "2026-03-12 (vigente)",
          nota: "Derecho de aprovechamiento: 120 l/s. Extracción del mes: 96 l/s (80% del derecho)." },
        { p: "Aguas de contacto (drenaje de mina + precipitación)", clase: "entrada", ls: { hoy: 36, "7d": 37, "30d": 37 },
          tag: "FIT-1035 / PLU-01", instr: "Caudalímetro DN300 + pluviómetro", cal: "medido",
          origen: "OPC-UA", cobertura: 98.1, calib: "2026-01-22 (vigente)",
          nota: "La precipitación aporta 2 l/s en el mes. Es el desierto: no es un error, es Atacama." },
        { p: "Recirculación desde el tranque (aguas claras)", clase: "interno", ls: { hoy: 470, "7d": 476, "30d": 480 },
          tag: "FIT-2031", instr: "Caudalímetro electromagnético DN1200", cal: "medido",
          origen: "OPC-UA · PLC-02", cobertura: 99.9, calib: "2026-02-18 (vigente)",
          nota: "Es agua interna: entra y sale del mismo sistema, no altera el balance de la frontera." },
        { p: "Alimentación a planta concentradora", clase: "uso", ls: { hoy: 684, "7d": 698, "30d": 700 },
          tag: "FIT-2040", instr: "Caudalímetro electromagnético DN1400", cal: "medido",
          origen: "OPC-UA · PLC-02", cobertura: 99.9, calib: "2026-02-18 (vigente)", nota: "" },
        { p: "Pilas de lixiviación", clase: "uso", ls: { hoy: 54, "7d": 54, "30d": 55 },
          tag: "FIT-3011", instr: "Caudalímetro electromagnético DN400", cal: "medido",
          origen: "OPC-UA", cobertura: 97.4, calib: "2025-12-30 (vigente)", nota: "" },
        { p: "Supresión de polvo (camiones aljibe)", clase: "uso", ls: { hoy: 46, "7d": 47, "30d": 48 },
          tag: "FQI-4002", instr: "Totalizador de carga + planilla de despacho", cal: "manual",
          origen: "Planilla Excel del jefe de camino, cargada cada mañana", cobertura: 84.0,
          calib: "no aplica",
          nota: "El 100% de esta partida se evapora. Es el flujo peor medido de la faena y nadie lo discute." },
        { p: "Campamento y servicios", clase: "uso", ls: { hoy: 20, "7d": 20, "30d": 20 },
          tag: "FIT-5010", instr: "Caudalímetro electromagnético DN200", cal: "medido",
          origen: "OPC-UA", cobertura: 99.5, calib: "2026-04-02 (vigente)", nota: "" },
        { p: "Agua ocluida en el relave depositado", clase: "salida", ls: { hoy: 124, "7d": 127, "30d": 128 },
          tag: "—", instr: "Coeficiente 0,29 m³/t × 42.000 t/d", cal: "estimado",
          origen: "Ensayo de humedad del relave depositado, marzo 2026", cobertura: 100,
          calib: "no aplica",
          nota: "La planta cambió el espesador en marzo. El coeficiente es de antes del cambio. Si el relave sale con 0,32 m³/t, esta partida sube 15 l/s." },
        { p: "Agua retenida en pilas de lixiviación", clase: "salida", ls: { hoy: 16, "7d": 16, "30d": 16 },
          tag: "—", instr: "Coeficiente de retención de la pila", cal: "estimado",
          origen: "Modelo de la operación (informe interno)", cobertura: 100, calib: "no aplica", nota: "" },
        { p: "Evaporación (laguna, pilas, caminos, piscinas)", clase: "salida", ls: { hoy: 120, "7d": 120, "30d": 121 },
          tag: "EVP-01", instr: "Tanque clase A · coef. 0,70 × superficie expuesta", cal: "calculado",
          origen: "Estación meteorológica + superficie de la laguna (topografía trimestral)", cobertura: 100,
          calib: "2026-04-15 (vigente)",
          nota: "La laguna de decantación pasó de 15,0 a 18,4 ha en cuatro meses. La superficie usada en el cálculo es la de marzo." },
        { p: "Infiltración medida (dren basal del muro)", clase: "salida", ls: { hoy: 15, "7d": 15, "30d": 14 },
          tag: "FIT-2090", instr: "Caudalímetro en el dren basal", cal: "medido",
          origen: "OPC-UA", cobertura: 99.1, calib: "2026-05-06 (vigente)",
          nota: "Mide sólo lo que el dren captura. La filtración que se va por el macizo no pasa por aquí." },
        { p: "Consumo del campamento (PTAS, riego)", clase: "salida", ls: { hoy: 6, "7d": 6, "30d": 6 },
          tag: "—", instr: "Balance de la planta de tratamiento", cal: "estimado",
          origen: "Informe mensual de la PTAS (PDF del contratista)", cobertura: 100, calib: "no aplica",
          nota: "Llega en PDF. Freatia lo extrae y lo deja trazable, pero sigue siendo un dato de tercero." },
        { p: "Δ almacenamiento (laguna + piscinas)", clase: "acumulacion", ls: { hoy: 8, "7d": 16, "30d": 18 },
          tag: "LIT-5001", instr: "Radar de nivel + curva de embalse", cal: "medido",
          origen: "OPC-UA", cobertura: 100, calib: "2026-03-20 (vigente)",
          nota: "El agua que se queda guardada. Sube: la laguna está creciendo." }
      ],
      diagnostico: [
        { pct: 52, tit: "Filtración no medida en el pie del muro, sector oeste",
          exp: "25–40 l/s",
          ev: [
            "PZ-14 (pie del muro oeste) sube 4,2 cm/día desde el 18 de junio. La discrepancia empezó a crecer el 21 de junio.",
            "Correlación entre la serie de PZ-14 y la serie diaria de la discrepancia: 0,86 (90 días).",
            "Conductividad en el pozo de monitoreo MW-03, aguas abajo: de 2.140 a 2.610 µS/cm en seis semanas.",
            "El dren basal (FIT-2090) no registra el aumento: si el agua se va por el macizo, el dren no la ve."
          ],
          accion: "Gatillar el protocolo geotécnico (ya está abierto: evento GEO-2026-114) y programar campaña de trazadores en el sector oeste. Costo estimado: $28.000.000." },
        { pct: 30, tit: "El relave se está depositando con más agua de la que supone el coeficiente",
          exp: "10–18 l/s",
          ev: [
            "El coeficiente de agua ocluida (0,29 m³/t) viene del ensayo de humedad de marzo, antes del cambio de espesador.",
            "Un coeficiente de 0,32 m³/t sube la partida de 128 a 143 l/s y absorbe 15 l/s de la discrepancia.",
            "El torque del espesador subió 11% en el mismo período (dato de la planta, no del balance)."
          ],
          accion: "Campaña de humedad del relave depositado: 12 muestras en dos semanas. Costo estimado: $3.500.000." },
        { pct: 18, tit: "Sesgo de medición en FIT-1010 (impulsión de agua desalada)",
          exp: "0–17 l/s",
          ev: [
            "Calibración vencida hace 8 meses. El certificado exige 12 meses.",
            "Es el único medidor de una entrada mayor con la calibración fuera de plazo.",
            "Un sesgo de +8% (dentro del rango típico de deriva de un electromagnético sucio) explica 17 l/s."
          ],
          accion: "Calibración en sitio de FIT-1010 y FIT-1020 esta semana. Costo estimado: $1.800.000. Es lo primero que haría cualquiera: es barato y descarta una hipótesis entera." }
      ],
      tranque: {
        nombre: "Depósito de relaves El Chinche",
        tipo: "Relaves espesados · muro de arenas cicloneadas · Método aguas abajo",
        coronamiento: 2486.0,
        laguna: 2480.4,
        revanchaUmbral: 4.0,
        deform: { valor: 1.8, umbral: 5.0, tag: "PRI-09" },
        piezos: [
          { id: "PZ-14", nombre: "PZ-14 · pie del muro, sector oeste", color: C.critico,
            base: 2445.52, ruido: 0.06, quiebre: 66, pend: 0.042, destacada: true,
            alerta: 2446.0, critico: 2447.5 },
          { id: "PZ-07", nombre: "PZ-07 · muro central", color: C.agua, base: 2443.10, ruido: 0.08 },
          { id: "PZ-11", nombre: "PZ-11 · empotramiento este", color: C.recirc, base: 2441.45, ruido: 0.06 },
          { id: "PZ-18", nombre: "PZ-18 · aguas abajo del muro", color: C.perdida, base: 2438.90, ruido: 0.05, quiebre: 0, pend: 0.004 }
        ],
        evento: {
          id: "GEO-2026-114",
          gatillo: "2026-07-02 04:12",
          motivo: "PZ-14 superó el umbral de alerta (cota 2.446,0 m s.n.m.)",
          nivel: 2,
          acuse: false,
          cerrado: false,
          bitacora: [
            { t: "2026-07-02 04:12", q: "Freatia (automático)", d: "PZ-14 cruza el umbral de alerta. Se abre el evento GEO-2026-114. Nivel 1: notificación a Jefe de Geotecnia por WhatsApp y correo." },
            { t: "2026-07-02 06:12", q: "Freatia (automático)", d: "Sin acuse a 2 horas. Nivel 2: se notifica al Superintendente de Relaves y se llama al turno." },
            { t: "2026-07-02 08:40", q: "Rodrigo Pizarro (Jefe de Geotecnia)", d: "Inspección visual del pie del muro oeste. Sin humedad superficial visible. Se solicita lectura manual de PZ-14 y PZ-18." },
            { t: "2026-07-06 11:15", q: "Freatia (automático)", d: "La tendencia se mantiene: +4,2 cm/día. Proyección al umbral crítico (2.447,5): 24 días." }
          ]
        }
      }
    },

    {
      id: "ca",
      nombre: "Faena Cerro Amarillo",
      titular: "Compañía Minera Cerro Amarillo Ltda. · RUT 78.220.144-6",
      lugar: "Diego de Almagro, Región de Atacama",
      cuenca: "Cuenca del río Salado (Copiapó)",
      cota: "1.842,0 m s.n.m. (coronamiento del muro)",
      ficha: "Cobre sulfuros · 12.000 t/d · tranque convencional",
      derechoDGA: 80,
      nodos: NODOS_MINA.filter(function (n) { return n.id !== "D"; }),
      mapaNodo: { P: 0, C: 1, R: 2, CO: 3, SP: 4, CS: 5, OC: 6, EV: 7, IN: 8, DS: 9 },
      periodos: {
        hoy: { rot: "Últimas 24 h", enlaces: {
          R_CO: 166, P_CO: 32, P_SP: 15, P_CS: 15, C_SP: 8,
          CO_RC: 166, CO_OC: 22, CO_EV: 5, CO_IN: 2, CO_DS: 0,
          SP_EV: 23, CS_EV: 11, CS_IN: 4 } },
        "7d": { rot: "Últimos 7 días", enlaces: {
          R_CO: 167, P_CO: 32, P_SP: 15, P_CS: 15, C_SP: 9,
          CO_RC: 167, CO_OC: 22, CO_EV: 5, CO_IN: 2, CO_DS: 0,
          SP_EV: 24, CS_EV: 11, CS_IN: 4 } },
        "30d": { rot: "Junio 2026 (mes cerrado)", enlaces: {
          R_CO: 168, P_CO: 32, P_SP: 15, P_CS: 15, C_SP: 9,
          CO_RC: 168, CO_OC: 22, CO_EV: 5, CO_IN: 2, CO_DS: 0,
          SP_EV: 24, CS_EV: 11, CS_IN: 4 } }
      },
      libro: [
        { p: "Pozos DGA PP-11 / PP-12", clase: "entrada", ls: { hoy: 62, "7d": 62, "30d": 62 },
          tag: "FIT-1020", instr: "Caudalímetro ultrasónico + totalizador", cal: "medido",
          origen: "OPC-UA + transmisión a la DGA (MEE)", cobertura: 99.6, calib: "2026-02-01 (vigente)",
          nota: "Derecho: 80 l/s. Extracción: 62 l/s (78%)." },
        { p: "Aguas de contacto (drenaje de rajo)", clase: "entrada", ls: { hoy: 8, "7d": 9, "30d": 9 },
          tag: "FIT-1035", instr: "Caudalímetro DN200", cal: "medido", origen: "OPC-UA",
          cobertura: 97.0, calib: "2026-03-10 (vigente)", nota: "" },
        { p: "Recirculación desde el tranque", clase: "interno", ls: { hoy: 166, "7d": 167, "30d": 168 },
          tag: "FIT-2031", instr: "Caudalímetro electromagnético DN800", cal: "medido", origen: "OPC-UA",
          cobertura: 99.4, calib: "2026-01-15 (vigente)", nota: "" },
        { p: "Alimentación a concentradora", clase: "uso", ls: { hoy: 198, "7d": 199, "30d": 200 },
          tag: "FIT-2040", instr: "Caudalímetro electromagnético DN900", cal: "medido", origen: "OPC-UA",
          cobertura: 99.7, calib: "2026-01-15 (vigente)", nota: "" },
        { p: "Supresión de polvo", clase: "uso", ls: { hoy: 23, "7d": 24, "30d": 24 },
          tag: "FQI-4002", instr: "Totalizador de carga de aljibes", cal: "manual",
          origen: "Planilla de despacho", cobertura: 88.0, calib: "no aplica", nota: "" },
        { p: "Campamento y servicios", clase: "uso", ls: { hoy: 15, "7d": 15, "30d": 15 },
          tag: "FIT-5010", instr: "Caudalímetro DN150", cal: "medido", origen: "OPC-UA",
          cobertura: 99.0, calib: "2026-04-20 (vigente)", nota: "" },
        { p: "Agua ocluida en el relave depositado", clase: "salida", ls: { hoy: 22, "7d": 22, "30d": 22 },
          tag: "—", instr: "Coeficiente 0,16 m³/t × 12.000 t/d", cal: "estimado",
          origen: "Ensayo de humedad, mayo 2026", cobertura: 100, calib: "no aplica", nota: "" },
        { p: "Evaporación (laguna, caminos)", clase: "salida", ls: { hoy: 39, "7d": 40, "30d": 40 },
          tag: "EVP-01", instr: "Tanque clase A · coef. 0,72", cal: "calculado",
          origen: "Estación meteorológica", cobertura: 100, calib: "2026-05-02 (vigente)", nota: "" },
        { p: "Infiltración y consumo", clase: "salida", ls: { hoy: 6, "7d": 6, "30d": 6 },
          tag: "FIT-2090", instr: "Dren basal + balance PTAS", cal: "medido",
          origen: "OPC-UA + informe PTAS", cobertura: 98.0, calib: "2026-05-06 (vigente)", nota: "" },
        { p: "Δ almacenamiento", clase: "acumulacion", ls: { hoy: 0, "7d": 0, "30d": 0 },
          tag: "LIT-5001", instr: "Radar de nivel", cal: "medido", origen: "OPC-UA",
          cobertura: 100, calib: "2026-03-20 (vigente)", nota: "La laguna está estable." }
      ],
      diagnostico: [
        { pct: 100, tit: "El balance cierra dentro de la tolerancia del proyecto",
          exp: "3 l/s (4,2% de las entradas)",
          ev: [
            "El umbral de la RCA para el cierre del balance de esta faena es 5%. Estamos en 4,2%.",
            "La mayor fuente de incertidumbre es la supresión de polvo (dato manual, 88% de cobertura)."
          ],
          accion: "Ninguna acción obligatoria. Instalar un caudalímetro en la línea de carga de aljibes bajaría la incertidumbre del balance a ~2%. Costo estimado: $4.200.000." }
      ],
      tranque: {
        nombre: "Depósito de relaves La Higuera",
        tipo: "Convencional · muro de arenas · Método línea central",
        coronamiento: 1842.0,
        laguna: 1835.9,
        revanchaUmbral: 4.0,
        deform: { valor: 0.9, umbral: 5.0, tag: "PRI-04" },
        piezos: [
          { id: "PZ-03", nombre: "PZ-03 · pie del muro", color: C.agua, base: 1812.40, ruido: 0.06, alerta: 1814.0, critico: 1815.5, destacada: true },
          { id: "PZ-05", nombre: "PZ-05 · muro central", color: C.recirc, base: 1810.85, ruido: 0.05 },
          { id: "PZ-09", nombre: "PZ-09 · aguas abajo", color: C.perdida, base: 1808.20, ruido: 0.05 }
        ],
        evento: null
      }
    },

    {
      id: "sn",
      nombre: "Faena Salar Norte",
      titular: "Salar Norte Litio SpA · RUT 77.905.318-K",
      lugar: "San Pedro de Atacama, Región de Antofagasta",
      cuenca: "Cuenca del Salar de Atacama",
      cota: "2.305,0 m s.n.m. (planta)",
      ficha: "Carbonato de litio · salmuera + agua industrial · sin depósito de relaves",
      derechoDGA: 110,
      nodos: [
        { id: "R",  col: 0, nombre: "Recirculación de planta",   color: C.recirc },
        { id: "P",  col: 0, nombre: "Pozos de agua industrial",  color: C.agua },
        { id: "C",  col: 0, nombre: "Otras (condensados, aljibes)", color: C.agua },
        { id: "CO", col: 1, nombre: "Planta de carbonato",       color: C.agua },
        { id: "SP", col: 1, nombre: "Riego y supresión de polvo",color: C.agua },
        { id: "CS", col: 1, nombre: "Servicios y campamento",    color: C.agua },
        { id: "RC", col: 2, nombre: "Vuelve al proceso",         color: C.recirc },
        { id: "OC", col: 2, nombre: "Humedad del producto",      color: C.perdida },
        { id: "EV", col: 2, nombre: "Evaporación",               color: C.perdida },
        { id: "IN", col: 2, nombre: "Infiltración y consumo",    color: C.perdida },
        { id: "DS", col: 2, nombre: "Δ almacenamiento",          color: C.acum },
        { id: "SE", col: 2, nombre: "Sin explicar",              color: C.sinexpl }
      ],
      mapaNodo: { P: 0, C: 1, R: 2, CO: 3, SP: 4, CS: 5, OC: 6, EV: 7, IN: 8, DS: 9 },
      periodos: {
        hoy: { rot: "Últimas 24 h", enlaces: {
          R_CO: 39, P_CO: 31, P_SP: 36, P_CS: 15, C_SP: 3,
          CO_RC: 39, CO_OC: 22, CO_EV: 5, CO_DS: 1,
          SP_EV: 33, SP_IN: 6, CS_EV: 9, CS_IN: 6 } },
        "7d": { rot: "Últimos 7 días", enlaces: {
          R_CO: 40, P_CO: 30, P_SP: 37, P_CS: 15, C_SP: 3,
          CO_RC: 40, CO_OC: 22, CO_EV: 5, CO_DS: 1,
          SP_EV: 34, SP_IN: 6, CS_EV: 9, CS_IN: 6 } },
        "30d": { rot: "Junio 2026 (mes cerrado)", enlaces: {
          R_CO: 40, P_CO: 30, P_SP: 37, P_CS: 15, C_SP: 3,
          CO_RC: 40, CO_OC: 22, CO_EV: 5, CO_DS: 1,
          SP_EV: 34, SP_IN: 6, CS_EV: 9, CS_IN: 6 } }
      },
      libro: [
        { p: "Pozos de agua industrial (PP-21 a PP-24)", clase: "entrada", ls: { hoy: 82, "7d": 82, "30d": 82 },
          tag: "FIT-1020", instr: "Caudalímetro ultrasónico + totalizador", cal: "medido",
          origen: "OPC-UA + transmisión a la DGA (MEE)", cobertura: 100, calib: "2026-04-08 (vigente)",
          nota: "Derecho de agua industrial: 110 l/s. Extracción: 82 l/s (75%)." },
        { p: "Otras entradas (condensados, aljibes)", clase: "entrada", ls: { hoy: 3, "7d": 3, "30d": 3 },
          tag: "—", instr: "Registro de despacho", cal: "manual", origen: "Planilla",
          cobertura: 80.0, calib: "no aplica", nota: "" },
        { p: "Recirculación de planta", clase: "interno", ls: { hoy: 39, "7d": 40, "30d": 40 },
          tag: "FIT-2031", instr: "Caudalímetro electromagnético DN400", cal: "medido", origen: "OPC-UA",
          cobertura: 99.8, calib: "2026-02-25 (vigente)", nota: "" },
        { p: "Planta de carbonato de litio", clase: "uso", ls: { hoy: 70, "7d": 70, "30d": 70 },
          tag: "FIT-2040", instr: "Caudalímetro electromagnético DN500", cal: "medido", origen: "OPC-UA",
          cobertura: 99.9, calib: "2026-02-25 (vigente)", nota: "" },
        { p: "Riego y supresión de polvo", clase: "uso", ls: { hoy: 39, "7d": 40, "30d": 40 },
          tag: "FQI-4002", instr: "Totalizador de aljibes", cal: "manual", origen: "Planilla",
          cobertura: 86.0, calib: "no aplica", nota: "" },
        { p: "Servicios y campamento", clase: "uso", ls: { hoy: 15, "7d": 15, "30d": 15 },
          tag: "FIT-5010", instr: "Caudalímetro DN150", cal: "medido", origen: "OPC-UA",
          cobertura: 99.2, calib: "2026-04-20 (vigente)", nota: "" },
        { p: "Humedad del producto y purgas", clase: "salida", ls: { hoy: 22, "7d": 22, "30d": 22 },
          tag: "—", instr: "Balance de la planta", cal: "calculado", origen: "Modelo de proceso",
          cobertura: 100, calib: "no aplica", nota: "" },
        { p: "Evaporación (planta, riego, caminos)", clase: "salida", ls: { hoy: 47, "7d": 48, "30d": 48 },
          tag: "EVP-01", instr: "Tanque clase A · coef. 0,68", cal: "calculado",
          origen: "Estación meteorológica", cobertura: 100, calib: "2026-05-11 (vigente)", nota: "" },
        { p: "Infiltración y consumo", clase: "salida", ls: { hoy: 12, "7d": 12, "30d": 12 },
          tag: "—", instr: "Balance de la PTAS + riego", cal: "estimado", origen: "Informe mensual",
          cobertura: 100, calib: "no aplica", nota: "" },
        { p: "Δ almacenamiento (estanques)", clase: "acumulacion", ls: { hoy: 1, "7d": 1, "30d": 1 },
          tag: "LIT-5001", instr: "Radar de nivel", cal: "medido", origen: "OPC-UA",
          cobertura: 100, calib: "2026-03-20 (vigente)", nota: "" }
      ],
      diagnostico: [
        { pct: 100, tit: "El balance de agua dulce cierra dentro de tolerancia",
          exp: "2 l/s (2,4% de las entradas)",
          ev: [
            "La extracción de salmuera (1.380 l/s promedio en junio) NO es agua dulce y se reporta por separado.",
            "El balance de salmuera y el modelo hidrogeológico del salar son otro problema y Freatia todavía no lo resuelve. Lo decimos ahora, no en la implementación."
          ],
          accion: "Ninguna. Mantener la calibración al día." }
      ],
      tranque: null
    }
  ];

  /* ======================================================================
     Cálculo del balance. Aquí vive la aritmética que el producto promete.
     ====================================================================== */

  function calcular(faena, periodo) {
    var e = faena.periodos[periodo].enlaces;
    var val = {};                     // valor de cada nodo
    var enlaces = [];
    var colDe = {};
    faena.nodos.forEach(function (n) { val[n.id] = 0; colDe[n.id] = n.col; });

    Object.keys(e).forEach(function (k) {
      var p = k.split("_"), de = p[0], a = p[1], v = e[k];
      if (colDe[de] === 0) { val[de] += v; }
      val[a] += (colDe[a] === 1 && colDe[de] === 0) ? v : 0;
    });

    // Recorremos otra vez para los enlaces uso→destino y armar la lista final
    var salidasDeUso = {};
    Object.keys(e).forEach(function (k) {
      var p = k.split("_"), de = p[0], a = p[1], v = e[k];
      if (colDe[de] === 1) { salidasDeUso[de] = (salidasDeUso[de] || 0) + v; }
    });

    // El residual: lo que entra al nodo principal (col 1, el más grande) menos lo que sale.
    var principal = faena.nodos.filter(function (n) { return n.col === 1; })
      .reduce(function (a, b) { return val[a.id] > val[b.id] ? a : b; });
    var residual = val[principal.id] - (salidasDeUso[principal.id] || 0);
    residual = Math.round(residual * 100) / 100;

    // valores de destinos
    var valDest = {};
    Object.keys(e).forEach(function (k) {
      var p = k.split("_"), de = p[0], a = p[1], v = e[k];
      if (colDe[a] === 2) valDest[a] = (valDest[a] || 0) + v;
    });
    valDest.SE = (valDest.SE || 0) + residual;
    faena.nodos.forEach(function (n) { if (n.col === 2) val[n.id] = valDest[n.id] || 0; });

    // lista de enlaces para el sankey (color por destino/uso)
    Object.keys(e).forEach(function (k) {
      var p = k.split("_"), de = p[0], a = p[1];
      enlaces.push({ de: de, a: a, valor: e[k], color: colorEnlace(faena, de, a) });
    });
    if (residual > 0) enlaces.push({ de: principal.id, a: "SE", valor: residual, color: C.sinexpl });

    var nodos = faena.nodos
      .filter(function (n) { return val[n.id] > 0; })
      .map(function (n) { return { id: n.id, col: n.col, nombre: n.nombre, valor: val[n.id], color: n.color }; });

    // Balance de frontera (la recirculación es interna y no cuenta)
    var entradas = 0;
    faena.nodos.forEach(function (n) { if (n.col === 0 && n.id !== "R") entradas += val[n.id]; });
    var salidas = (val.OC || 0) + (val.EV || 0) + (val.IN || 0);
    var acum = val.DS || 0;

    return {
      nodos: nodos, enlaces: enlaces, val: val,
      entradas: entradas, salidas: salidas, acum: acum, sinExplicar: residual,
      pct: entradas ? (residual / entradas) * 100 : 0,
      recirc: val.R || 0,
      total: val[principal.id] !== undefined ? faena.nodos.filter(function (n) { return n.col === 1; })
        .reduce(function (s, n) { return s + val[n.id]; }, 0) : 0
    };
  }

  function colorEnlace(faena, de, a) {
    var nd = faena.nodos.filter(function (n) { return n.id === a; })[0];
    if (a === "RC" || de === "R") return C.recirc;
    if (a === "SE") return C.sinexpl;
    if (a === "OC" || a === "EV" || a === "IN") return C.perdida;
    if (a === "DS") return C.acum;
    return nd ? nd.color : C.agua;
  }

  /* ======================================================================
     Estado de la aplicación
     ====================================================================== */

  var estado = {
    faena: FAENAS[0],
    periodo: "30d",
    pestana: "balance",
    filtroCalidad: "todos",
    seleccion: null,
    diag: false,
    reportes: {}
  };

  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  /* --- Iconos de trazo (dibujados a mano, nunca emoji) --- */
  var ICO = {
    alerta: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M8 2 15 14H1L8 2Z"/><path d="M8 6.5v3.5"/><circle cx="8" cy="12" r=".6" fill="currentColor" stroke="none"/></svg>',
    ok: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="8" cy="8" r="6.4"/><path d="M5 8.3l2 2 4-4.4"/></svg>',
    critico: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="8" cy="8" r="6.4"/><path d="M8 4.6v4.2"/><circle cx="8" cy="11.4" r=".7" fill="currentColor" stroke="none"/></svg>',
    dato: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M2 12h12M2 9l3.5-4L9 8l5-6"/></svg>',
    lock: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3.5" y="7" width="9" height="6.5"/><path d="M5.5 7V5a2.5 2.5 0 015 0v2"/></svg>'
  };

  function chip(clase, texto, icono) {
    return '<span class="chip chip-' + clase + '">' + (ICO[icono] || "") + texto + "</span>";
  }

  var CALIDAD = {
    medido: { c: "ok", t: "medido" },
    "medido-degradado": { c: "alerta", t: "medido · calibración vencida" },
    calculado: { c: "dato", t: "calculado" },
    estimado: { c: "validar", t: "estimado" },
    manual: { c: "validar", t: "manual" }
  };

  /* ======================================================================
     Render
     ====================================================================== */

  function render() {
    var f = estado.faena;
    var b = calcular(f, estado.periodo);

    // cabecera de faena
    $("#f-nombre").textContent = f.nombre;
    $("#f-meta").innerHTML =
      f.lugar + " · <span class='rotulo'>" + f.cuenca + "</span>";
    $("#f-ficha").textContent = f.ficha;
    $("#f-cota").textContent = f.cota;

    $$("#tabs button").forEach(function (btn) {
      var on = btn.dataset.tab === estado.pestana;
      btn.setAttribute("aria-selected", on ? "true" : "false");
      btn.classList.toggle("act", on);
    });
    $$(".panel").forEach(function (p) { p.hidden = p.dataset.tab !== estado.pestana; });

    $$("#periodos button").forEach(function (btn) {
      btn.classList.toggle("act", btn.dataset.p === estado.periodo);
      btn.setAttribute("aria-pressed", btn.dataset.p === estado.periodo ? "true" : "false");
    });

    var tieneTranque = !!f.tranque;
    $("#tab-tranque").disabled = !tieneTranque;
    $("#tab-tranque").title = tieneTranque ? "" : "Esta faena no tiene depósito de relaves";
    if (!tieneTranque && estado.pestana === "tranque") { estado.pestana = "balance"; return render(); }

    renderBalance(f, b);
    renderTraza(f, b);
    if (tieneTranque) renderTranque(f, b); else $("#panel-tranque").innerHTML = "";
    renderReportes(f, b);
  }

  /* --- 1. Balance ------------------------------------------------------- */
  function renderBalance(f, b) {
    var cuadra = b.pct < 5;
    var m3 = b.sinExplicar * LS_A_M3;

    $("#hallazgo").className = "placa hallazgo " + (cuadra ? "hallazgo-ok" : "hallazgo-mal");
    $("#hallazgo").innerHTML =
      '<div class="hallazgo-cifra">' +
        '<span class="rotulo">' + (cuadra ? "El balance cierra" : "El balance no cierra") + "</span>" +
        '<div class="cifra cifra-hero" style="color:' + (cuadra ? C.ok : C.sinexpl) + '">' +
          (cuadra ? "" : "") + num(b.sinExplicar) + '<span class="cifra-u">l/s sin explicar</span></div>' +
        '<p class="pista">' + num(b.pct, 1) + "% de las entradas · " + num(m3) + " m³/día · " +
        num(m3 * 365 / 1e6, 2) + " hm³/año</p>" +
      "</div>" +
      '<div class="hallazgo-txt">' +
        (cuadra
          ? "<p>Entra lo mismo que sale, dentro de la tolerancia del proyecto (5%). El reporte se puede firmar.</p>" +
            "<p class='pista'>La partida con más incertidumbre sigue siendo la supresión de polvo: dato manual.</p>"
          : "<p><strong>" + num(b.entradas) + " l/s entran</strong>. " + num(b.salidas) +
            " l/s salen por vías conocidas y " + num(b.acum) + " l/s se acumulan. " +
            "Faltan <strong>" + num(b.sinExplicar) + " l/s</strong> que nadie puede decir dónde están.</p>" +
            "<p class='pista'>Si hubiera que reponerlos con agua desalada a US$" + num(USD_M3_DESAL, 1) +
            "/m³ (supuesto declarado; el rango real de la industria es US$2,5–5,0 puesto en faena a 3.000 m), " +
            "son <strong>US$" + num(m3 * USD_M3_DESAL * 365 / 1e6, 1) + " millones al año</strong>. " +
            "Y si no son una pérdida sino un error de medición, entonces el reporte de extracciones a la DGA está malo. " +
            "Cualquiera de las dos cosas es un problema.</p>") +
        '<button class="btn btn-2" id="btn-diag">' +
          (cuadra ? "¿Y qué tan confiable es este cierre?" : "¿Por qué no cuadra?") + "</button>" +
      "</div>";
    $("#btn-diag").addEventListener("click", function () {
      estado.diag = true;
      $("#diag").hidden = false;
      $("#diag").scrollIntoView({ block: "start", behavior: "smooth" });
    });

    // Ecuación
    $("#ecuacion").innerHTML =
      '<div class="eq">' +
        eqBloque("Entradas", b.entradas, C.agua) + eqOp("=") +
        eqBloque("Salidas", b.salidas, C.perdida) + eqOp("+") +
        eqBloque("Acumulación", b.acum, C.acum) + eqOp("+") +
        eqBloque("Sin explicar", b.sinExplicar, C.sinexpl) +
      "</div>" +
      '<p class="pista">La recirculación (' + num(b.recirc) + " l/s) es agua interna: entra y sale del mismo sistema, " +
      "por eso no aparece en la ecuación de la frontera. Sí aparece en el diagrama, porque es el 58% del agua que mueve la faena.</p>";

    // Sankey
    G.sankeyHidrico($("#sankey"), {
      columnas: [{ rotulo: "De dónde viene" }, { rotulo: "En qué se usa" }, { rotulo: "Dónde termina" }],
      nodos: b.nodos, enlaces: b.enlaces
    }, function (n) {
      if (n.id === "SE") {
        estado.diag = true;
        $("#diag").hidden = false;
        $("#diag").scrollIntoView({ block: "start", behavior: "smooth" });
        return;
      }
      var idx = f.mapaNodo[n.id];
      if (idx === undefined) return;
      abrirTraza(f, f.libro[idx].p);
    });

    // Diagnóstico
    var d = f.diagnostico;
    $("#diag-lista").innerHTML = d.map(function (h, i) {
      return '<article class="placa hip">' +
        '<div class="placa-tit"><h4>' + (d.length > 1 ? "Hipótesis " + (i + 1) + " · " : "") + h.tit + "</h4>" +
        '<span class="chip chip-' + (h.pct >= 50 ? "alerta" : "neutro") + '">' + h.pct + "% de probabilidad</span></div>" +
        '<p class="pista">Explicaría <span class="num">' + h.exp + "</span> de la discrepancia.</p>" +
        "<ul class='lista'>" + h.ev.map(function (x) {
          return "<li>" + ICO.dato + "<span>" + x + "</span></li>";
        }).join("") + "</ul>" +
        '<p class="accion"><strong>Acción recomendada.</strong> ' + h.accion + "</p>" +
        "</article>";
    }).join("");
    $("#diag").hidden = !estado.diag;
  }

  function eqBloque(rot, v, color) {
    return '<span class="eq-b"><span class="rotulo">' + rot + '</span>' +
      '<span class="num eq-v" style="color:' + color + '">' + num(v) + '</span>' +
      '<span class="eq-u">l/s</span></span>';
  }
  function eqOp(o) { return '<span class="eq-op">' + o + "</span>"; }

  function renderLibro(f, b) {
    var filas = f.libro.filter(function (r) {
      if (estado.filtroCalidad === "todos") return true;
      if (estado.filtroCalidad === "no-medido") return r.cal !== "medido";
      return r.cal === estado.filtroCalidad;
    });
    var cuerpo = filas.map(function (r) {
      var ls = r.ls[estado.periodo];
      var q = CALIDAD[r.cal];
      return '<tr data-p="' + r.p + '" tabindex="0">' +
        "<td>" + r.p + '<div class="pista">' + r.instr + "</div></td>" +
        '<td><span class="chip chip-neutro">' + claseTxt(r.clase) + "</span></td>" +
        '<td class="n">' + (r.clase === "acumulacion" && ls > 0 ? "+" : "") + num(ls) + "</td>" +
        '<td class="n">' + num(ls * LS_A_M3) + "</td>" +
        '<td><span class="tag">' + r.tag + "</span></td>" +
        "<td>" + chip(q.c, q.t, q.c === "ok" ? "ok" : q.c === "alerta" ? "alerta" : "dato") + "</td>" +
        '<td class="n">' + num(r.cobertura, 1) + "%</td>" +
        "</tr>";
    }).join("");

    var ls = b.sinExplicar;
    cuerpo += '<tr class="fila-se"><td><strong>Sin explicar</strong>' +
      '<div class="pista">Residual del balance. No lo mide nadie: lo calcula Freatia.</div></td>' +
      '<td><span class="chip chip-critico">' + ICO.alerta + "residual</span></td>" +
      '<td class="n" style="color:' + C.sinexpl + '"><strong>' + num(ls) + "</strong></td>" +
      '<td class="n">' + num(ls * LS_A_M3) + "</td>" +
      '<td><span class="tag">—</span></td><td><span class="chip chip-critico">' + ICO.alerta + "sin fuente</span></td>" +
      '<td class="n">—</td></tr>';

    $("#tbl-libro tbody").innerHTML = cuerpo;
    $$("#tbl-libro tbody tr[data-p]").forEach(function (tr) {
      tr.addEventListener("click", function () { abrirTraza(f, tr.dataset.p); });
      tr.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter") { ev.preventDefault(); abrirTraza(f, tr.dataset.p); }
      });
    });
  }

  function claseTxt(c) {
    return { entrada: "entrada", salida: "salida", uso: "uso", interno: "interno", acumulacion: "acumulación" }[c] || c;
  }

  /* --- 2. Trazabilidad --------------------------------------------------- */
  function renderTraza(f, b) {
    // filtros
    $$("#filtros button").forEach(function (btn) {
      btn.classList.toggle("act", btn.dataset.q === estado.filtroCalidad);
    });
    var noMedido = f.libro.filter(function (r) { return r.cal !== "medido"; });
    var totalLs = f.libro.reduce(function (s, r) { return r.clase === "entrada" ? s + r.ls[estado.periodo] : s; }, 0);
    var noMedidoLs = f.libro.reduce(function (s, r) {
      return (r.clase === "salida" || r.clase === "uso") && r.cal !== "medido" ? s + r.ls[estado.periodo] : s;
    }, 0);

    $("#traza-resumen").innerHTML =
      '<div class="rej rej-4">' +
      stat("Partidas del balance", f.libro.length, "") +
      stat("Con sensor y calibración vigente", f.libro.length - noMedido.length, "de " + f.libro.length) +
      stat("Estimadas, calculadas o a mano", noMedido.length, num(noMedidoLs) + " l/s en juego") +
      stat("Cobertura media de muestras", num(f.libro.reduce(function (s, r) { return s + r.cobertura; }, 0) / f.libro.length, 1) + "%", "") +
      "</div>" +
      "<p class='pista'>Un auditor de la SMA no pregunta cuánta agua sacaste. Pregunta cómo lo sabes. " +
      "Esta tabla es la respuesta: cada litro del balance, con su instrumento, su calibración y su cadena de custodia. " +
      "Toca una fila.</p>";

    renderLibro(f, b);
    if (!estado.seleccion) $("#traza-detalle").innerHTML =
      '<div class="vacio"><p>Selecciona una partida de la tabla para ver de dónde viene el dato.</p></div>';
  }

  function stat(rot, v, sub) {
    return '<div class="placa stat"><span class="rotulo">' + rot + '</span>' +
      '<span class="cifra">' + v + "</span>" + (sub ? '<span class="pista">' + sub + "</span>" : "") + "</div>";
  }

  function abrirTraza(f, partida) {
    var r = f.libro.filter(function (x) { return x.p === partida; })[0];
    if (!r) return;
    estado.seleccion = partida;
    estado.pestana = "traza";
    var q = CALIDAD[r.cal];
    var ls = r.ls[estado.periodo];
    var hash = "sha256:" + ("8ab3c1" + f.id + r.tag).replace(/[^a-z0-9]/gi, "").toLowerCase().slice(0, 16);

    $("#traza-detalle").innerHTML =
      '<article class="placa placa-alta">' +
        '<div class="placa-tit"><h3>' + r.p + "</h3>" + chip(q.c, q.t, q.c === "ok" ? "ok" : "alerta") + "</div>" +
        '<div class="rej rej-3">' +
          '<div class="stat"><span class="rotulo">Caudal (' + f.periodos[estado.periodo].rot.toLowerCase() + ')</span><span class="cifra num">' + num(ls) + '<span class="cifra-u">l/s</span></span></div>' +
          '<div class="stat"><span class="rotulo">Volumen</span><span class="cifra num">' + num(ls * LS_A_M3) + '<span class="cifra-u">m³/día</span></span></div>' +
          '<div class="stat"><span class="rotulo">Cobertura de muestras</span><span class="cifra num">' + num(r.cobertura, 1) + '<span class="cifra-u">%</span></span></div>' +
        "</div>" +
        '<dl class="dl">' +
          dl("TAG del instrumento", '<span class="tag">' + r.tag + "</span>") +
          dl("Instrumento", r.instr) +
          dl("Origen del dato", r.origen) +
          dl("Última calibración", r.calib) +
        "</dl>" +
        (r.nota ? '<p class="accion">' + r.nota + "</p>" : "") +
        '<div class="cadena">' +
          '<span class="rotulo">Cadena de custodia</span>' +
          '<ol>' +
            "<li><span class='tag'>" + r.tag + "</span> instrumento en terreno</li>" +
            "<li><span class='tag'>GW-" + f.id.toUpperCase() + "-01</span> gateway OPC-UA en la sala eléctrica</li>" +
            "<li>Freatia · ingesta 2026-07-12 06:00:04 · sin transformación</li>" +
            "<li>Registro sellado <span class='tag'>" + hash + "</span> · inmutable</li>" +
            "<li>Reporte DGA-2026-06 · SMA-RCA-2026-S1</li>" +
          "</ol>" +
        "</div>" +
      "</article>";
    render();
    $("#traza-detalle").scrollIntoView({ block: "nearest" });
  }

  function dl(k, v) { return "<div><dt>" + k + "</dt><dd>" + v + "</dd></div>"; }

  /* --- 3. Tranque -------------------------------------------------------- */
  function renderTranque(f) {
    var t = f.tranque;
    var revancha = t.coronamiento - t.laguna;
    var pz = t.piezos.filter(function (p) { return p.destacada; })[0];
    var series = t.piezos.map(function (p) {
      return {
        id: p.id, nombre: p.nombre, color: p.color, destacada: !!p.destacada,
        visible: p.visible !== false,
        datos: serie(p.base * 1000 | 0, p.base, p.ruido, 90, p.quiebre, p.pend)
      };
    });
    var actual = series.filter(function (s) { return s.destacada; })[0];
    var vNow = actual.datos[89];
    var vAnt = actual.datos[79];
    var pendiente = (vNow - vAnt) / 10 * 100;   // cm/día
    var estadoPz = vNow >= pz.critico ? "critico" : vNow >= pz.alerta ? "alerta" : "ok";
    var diasCrit = pendiente > 0.5 ? Math.round((pz.critico - vNow) / (pendiente / 100)) : null;

    $("#panel-tranque").innerHTML =
      '<div class="placa">' +
        '<div class="placa-tit"><div><h3>' + t.nombre + "</h3>" +
        '<p class="pista">' + t.tipo + "</p></div>" +
        (estadoPz === "ok" ? chip("ok", "operación normal", "ok") : chip(estadoPz, "en " + (estadoPz === "critico" ? "estado crítico" : "alerta"), "alerta")) +
        "</div>" +
        '<div class="rej rej-4">' +
          medidor("Revancha hidráulica", num(revancha, 1), "m", revancha >= t.revanchaUmbral ? "ok" : "critico",
            "umbral " + num(t.revanchaUmbral, 1) + " m") +
          medidor("Cota de coronamiento", num(t.coronamiento, 1), "m s.n.m.", "neutro", "topografía mensual") +
          medidor("Nivel freático " + pz.id, num(vNow, 2), "m s.n.m.", estadoPz,
            (pendiente > 0.5 ? "+" + num(pendiente, 1) + " cm/día" : "estable")) +
          medidor("Deformación " + t.deform.tag, num(t.deform.valor, 1), "mm/día", t.deform.valor >= t.deform.umbral ? "critico" : "ok",
            "umbral " + num(t.deform.umbral, 1) + " mm/día") +
        "</div>" +
      "</div>" +

      (diasCrit ? '<div class="placa aviso aviso-alerta">' + ICO.alerta +
        "<p><strong>Si la tendencia se mantiene, " + pz.id + " llega al umbral crítico (cota " +
        num(pz.critico, 1) + ") en " + diasCrit + " días.</strong> " +
        "Esta es la frase que Freatia existe para poder decir a tiempo. No la dice un modelo: la dice la recta que " +
        "pasa por los últimos 10 días de la serie, y está a la vista.</p></div>" : "") +

      '<div class="rej rej-12-7" style="margin-top:var(--sp-s)">' +
        '<div class="placa">' +
          '<div class="placa-tit"><h3>Nivel freático · 90 días</h3></div>' +
          '<div class="svg-caja"><svg id="g-piezo"></svg></div>' +
          '<div class="leyenda" id="leyenda-pz"></div>' +
          "<p class='pista'>Umbrales de " + pz.id + ". Cada piezómetro tiene los suyos, definidos en el manual de operación del depósito.</p>" +
        "</div>" +
        '<div id="escalamiento"></div>' +
      "</div>" +

      '<div class="placa" style="margin-top:var(--sp-s)">' +
        '<div class="placa-tit"><h3>Sección del muro</h3><span class="rotulo">esquemática · no es un plano de diseño</span></div>' +
        seccionMuro(t, vNow, pz) +
      "</div>";

    G.graficoPiezometros($("#g-piezo"), series, { alerta: pz.alerta, critico: pz.critico },
      { aria: "Nivel freático de " + series.length + " piezómetros del muro en los últimos 90 días. " +
        pz.id + " está en " + num(vNow, 2) + " metros sobre el nivel del mar, sobre el umbral de alerta." });

    $("#leyenda-pz").innerHTML = t.piezos.map(function (p, i) {
      return '<span><button class="btn-leyenda" data-i="' + i + '" aria-pressed="' + (p.visible !== false) + '">' +
        '<span class="pt" style="background:' + p.color + ';opacity:' + (p.visible === false ? ".25" : "1") + '"></span>' +
        p.nombre + "</button></span>";
    }).join("");
    $$("#leyenda-pz .btn-leyenda").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var p = t.piezos[+btn.dataset.i];
        var vis = t.piezos.filter(function (x) { return x.visible !== false; });
        if (p.visible !== false && vis.length === 1) return;   // no dejar el gráfico vacío
        p.visible = p.visible === false;
        render();
      });
    });

    renderEscalamiento(f);
  }

  function medidor(rot, v, u, est, sub) {
    var col = { ok: C.ok, alerta: C.alerta, critico: C.critico, neutro: "var(--txt)" }[est];
    return '<div class="placa stat"><span class="rotulo">' + rot + "</span>" +
      '<span class="cifra num" style="color:' + col + '">' + v + '<span class="cifra-u">' + u + "</span></span>" +
      '<span class="pista">' + sub + "</span></div>";
  }

  function seccionMuro(t, vPz, pz) {
    // Sección esquemática dibujada a mano. Escala vertical exagerada, y lo decimos.
    var yTop = 30, yBase = 190;
    var cotaMax = t.coronamiento + 4, cotaMin = pz.alerta - 8;
    function Y(c) { return yBase - (c - cotaMin) / (cotaMax - cotaMin) * (yBase - yTop); }
    var yCor = Y(t.coronamiento), yLag = Y(t.laguna), yPz = Y(vPz), yAl = Y(pz.alerta), yCr = Y(pz.critico);
    return '<div class="svg-caja"><svg viewBox="0 0 700 220" role="img" aria-label="Sección esquemática del muro: coronamiento en cota ' +
      num(t.coronamiento, 1) + ', laguna en ' + num(t.laguna, 1) + ', nivel freático de ' + pz.id + ' en ' + num(vPz, 2) + '.">' +
      // terreno
      '<path d="M0,' + yBase + ' L700,' + yBase + '" stroke="#7A5C33" stroke-width="1.5"/>' +
      // muro (trapecio)
      '<path d="M120,' + yBase + ' L250,' + yCor + ' L470,' + yCor + ' L620,' + yBase + ' Z" fill="#1A2E36" stroke="#35606E"/>' +
      // relave depositado + laguna
      '<path d="M250,' + yCor + ' L470,' + yCor + ' L470,' + yBase + ' L250,' + yBase + ' Z" fill="#14232A" opacity=".6"/>' +
      '<path d="M470,' + yLag + ' L690,' + yLag + ' L690,' + yBase + ' L470,' + yBase + ' Z" fill="#3F9BD6" opacity=".22"/>' +
      '<line x1="470" y1="' + yLag + '" x2="690" y2="' + yLag + '" stroke="#3F9BD6" stroke-width="2"/>' +
      // umbrales
      '<line x1="60" y1="' + yAl + '" x2="360" y2="' + yAl + '" stroke="#E8A33D" stroke-width="1" stroke-dasharray="5 4"/>' +
      '<line x1="60" y1="' + yCr + '" x2="360" y2="' + yCr + '" stroke="#E8574E" stroke-width="1" stroke-dasharray="5 4"/>' +
      // nivel freático dentro del muro
      '<path d="M120,' + (yPz + 8) + ' Q260,' + yPz + ' 470,' + (yLag + 6) + '" stroke="#B85499" stroke-width="2" fill="none"/>' +
      '<circle cx="200" cy="' + (yPz + 4) + '" r="4" fill="#E8574E" stroke="#0F1A1F" stroke-width="2"/>' +
      // rótulos
      lbl(258, yCor - 8, "Coronamiento " + num(t.coronamiento, 1) + " m", "#C2D2D9") +
      lbl(560, yLag - 8, "Laguna " + num(t.laguna, 1) + " m", "#7FC0E6") +
      lbl(64, yAl - 6, "Alerta " + num(pz.alerta, 1), "#E8A33D") +
      lbl(64, yCr - 6, "Crítico " + num(pz.critico, 1), "#E8574E") +
      lbl(210, yPz - 6, pz.id + " " + num(vPz, 2), "#E8574E") +
      lbl(20, yBase + 16, "escala vertical exagerada", "#5F7A85") +
      // revancha
      '<line x1="480" y1="' + yCor + '" x2="480" y2="' + yLag + '" stroke="#C2D2D9" stroke-width="1"/>' +
      lbl(488, (yCor + yLag) / 2 + 4, "revancha " + num(t.coronamiento - t.laguna, 1) + " m", "#C2D2D9") +
      "</svg></div>";
  }
  function lbl(x, y, txt, col) {
    return '<text x="' + x + '" y="' + y + '" class="eje-txt" fill="' + col + '">' + txt + "</text>";
  }

  /* --- Escalamiento ------------------------------------------------------ */
  function renderEscalamiento(f) {
    var ev = f.tranque.evento;
    var cont = $("#escalamiento");
    if (!ev) {
      cont.innerHTML = '<div class="placa"><div class="placa-tit"><h3>Escalamiento</h3>' +
        chip("ok", "sin eventos abiertos", "ok") + "</div>" +
        "<p>Ningún umbral fuera de rango en los últimos 90 días. El último evento se cerró el 2026-04-18 " +
        "(revancha bajo umbral tras la lluvia del 14 de abril).</p></div>";
      return;
    }
    var niveles = [
      { n: 1, t: "Jefe de Geotecnia", c: "WhatsApp + correo · inmediato" },
      { n: 2, t: "Superintendente de Relaves", c: "Llamada al turno · a las 2 h sin acuse" },
      { n: 3, t: "Gerente de Operaciones + preparación del informe a SERNAGEOMIN", c: "A las 8 h sin acción, o al cruzar el umbral crítico" }
    ];
    cont.innerHTML =
      '<div class="placa">' +
        '<div class="placa-tit"><div><h3>Evento ' + ev.id + "</h3>" +
        '<p class="pista">' + ev.motivo + " · gatillado " + ev.gatillo + "</p></div>" +
        (ev.cerrado ? chip("ok", "cerrado", "ok") : chip(ev.nivel >= 3 ? "critico" : "alerta", "nivel " + ev.nivel + (ev.acuse ? " · reconocido" : " · sin acuse"), "alerta")) +
        "</div>" +
        '<ol class="esc">' + niveles.map(function (x) {
          var st = ev.cerrado ? "hecho" : ev.nivel > x.n ? "hecho" : ev.nivel === x.n ? "activo" : "pend";
          return '<li class="esc-' + st + '"><span class="esc-n">N' + x.n + "</span>" +
            "<div><strong>" + x.t + "</strong><div class='pista'>" + x.c + "</div></div></li>";
        }).join("") + "</ol>" +
        '<div class="esc-btns">' +
          (ev.cerrado ? "" :
            (!ev.acuse ? '<button class="btn" id="b-acuse">Acusar recibo</button>' : "") +
            '<button class="btn btn-2" id="b-accion">Registrar acción</button>' +
            (ev.nivel < 3 ? '<button class="btn btn-2" id="b-escalar">Escalar a N3</button>' : "") +
            '<button class="btn btn-3" id="b-cerrar">Cerrar evento</button>') +
        "</div>" +
        (ev.cerrado ? '<div class="aviso aviso-ok">' + ICO.ok +
          "<p>Evento cerrado. El informe a SERNAGEOMIN quedó desbloqueado en la pestaña de reportes, " +
          "con la bitácora completa adjunta.</p></div>" : "") +
        '<div class="bitacora"><span class="rotulo">Bitácora sellada</span><ol>' +
          ev.bitacora.map(function (x) {
            return "<li><span class='tag'>" + x.t + "</span> <strong>" + x.q + "</strong><p>" + x.d + "</p></li>";
          }).join("") +
        "</ol></div>" +
      "</div>";

    if ($("#b-acuse")) $("#b-acuse").addEventListener("click", function () {
      ev.acuse = true;
      bit(ev, "Rodrigo Pizarro (Jefe de Geotecnia)", "Acusa recibo del evento. Se detiene el escalamiento automático.");
      render();
    });
    if ($("#b-accion")) $("#b-accion").addEventListener("click", function () {
      var opciones = [
        "Se instruye inspección topográfica del muro oeste (turno de día).",
        "Se baja la cota de la laguna 0,8 m recuperando agua a la piscina de emergencia.",
        "Se contrata campaña de piezometría y trazadores en el sector oeste.",
        "Se reduce la tasa de depositación en el sector oeste a la mitad."
      ];
      var i = ev.bitacora.filter(function (b) { return b.q.indexOf("Freatia") < 0; }).length % opciones.length;
      bit(ev, "Rodrigo Pizarro (Jefe de Geotecnia)", opciones[i]);
      ev.acuse = true;
      render();
    });
    if ($("#b-escalar")) $("#b-escalar").addEventListener("click", function () {
      ev.nivel = 3;
      bit(ev, "Freatia (manual)", "Escalado a nivel 3. Se notifica al Gerente de Operaciones y se arma el paquete de evidencia " +
        "(series de PZ-14, PZ-18, conductividad de MW-03, bitácora) para el informe a SERNAGEOMIN.");
      render();
    });
    if ($("#b-cerrar")) $("#b-cerrar").addEventListener("click", function () {
      var acciones = ev.bitacora.filter(function (b) { return b.q.indexOf("Freatia") < 0; }).length;
      if (acciones < 2) {
        alert("No se puede cerrar el evento: se exigen al menos dos acciones registradas por una persona.\n\n" +
          "Registradas hasta ahora: " + acciones + ".\n\nEsto no es un capricho del software: si el evento se cierra sin " +
          "acciones, la bitácora no le sirve a nadie en una fiscalización.");
        return;
      }
      ev.cerrado = true;
      bit(ev, "Rodrigo Pizarro (Jefe de Geotecnia)", "Cierra el evento. Se adjunta la bitácora sellada al informe del depósito.");
      render();
    });
  }
  function bit(ev, quien, que) {
    var d = new Date();
    var t = "2026-07-12 " + String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
    ev.bitacora.push({ t: t, q: quien, d: que });
  }

  /* --- 4. Reportes ------------------------------------------------------- */
  function renderReportes(f, b) {
    var eventoAbierto = f.tranque && f.tranque.evento && !f.tranque.evento.cerrado;
    var noCuadra = b.pct >= 5;
    var firmado = estado.reportes[f.id] || {};
    var pozos = f.libro[f.mapaNodo.P].ls["30d"];          // la partida con derecho DGA
    var m3mes = pozos * LS_A_M3 * 30;
    var pctRe = b.recirc / (b.recirc + b.entradas) * 100; // cuánta del agua que mueve la faena ya se usó

    var reps = [
      {
        id: "dga", org: "DGA", tit: "Monitoreo de extracciones efectivas (MEE)",
        per: "Mensual · junio 2026",
        base: "FIT-1020 · pozos con derecho de aprovechamiento",
        bloqueo: null,
        cuerpo: "<p>Extracción media del período: <strong>" + num(pozos) + " l/s</strong> " +
          "(faena " + f.nombre + ", derecho de aprovechamiento de " + f.derechoDGA + " l/s, " +
          num(pozos / f.derechoDGA * 100) + "% del derecho). " +
          "Volumen total del mes: " + num(m3mes) + " m³.</p>" +
          "<p>Cobertura de muestras válidas: 100%. Instrumento con calibración vigente. " +
          "Cadena de custodia adjunta por cada dato.</p>" +
          "<p class='pista'>La obligación de monitorear y transmitir las extracciones efectivas existe (Código de Aguas, " +
          "reforma de la Ley 21.435). El formato exacto, la periodicidad y el estándar del equipo según caudal " +
          "dependen de la resolución vigente de la DGA: <strong>por validar</strong> con un abogado de aguas antes " +
          "de que esto sea un producto real.</p>"
      },
      {
        id: "sng", org: "SERNAGEOMIN", tit: "Informe de estado del depósito de relaves",
        per: "Trimestral · Q2 2026",
        base: "Piezómetros, prismas, revancha, bitácora de eventos",
        bloqueo: !f.tranque ? "Esta faena no tiene depósito de relaves." :
          eventoAbierto ? "Hay un evento de escalamiento abierto (" + f.tranque.evento.id + "). El informe no se firma con un evento sin cerrar." : null,
        desbloqueo: eventoAbierto ? { txt: "Ir al evento", tab: "tranque" } : null,
        cuerpo: f.tranque ? "<p>Depósito " + f.tranque.nombre + ". Revancha hidráulica: " +
          num(f.tranque.coronamiento - f.tranque.laguna, 1) + " m. Deformación máxima: " + num(f.tranque.deform.valor, 1) + " mm/día. " +
          "Todos los piezómetros dentro de rango salvo los declarados en la sección de eventos.</p>" +
          "<p class='pista'>El reglamento de depósitos de relaves es el DS 248 de SERNAGEOMIN. Las variables a informar y " +
          "la periodicidad exacta salen del manual de operación aprobado en la RCA de cada faena: <strong>por validar</strong> " +
          "caso a caso. No inventamos el formulario.</p>" : ""
      },
      {
        id: "sma", org: "SMA", tit: "Reporte de seguimiento ambiental de la RCA",
        per: "Semestral · S1 2026",
        base: "El balance hídrico completo",
        bloqueo: noCuadra ? "El balance no cierra: " + num(b.sinExplicar) + " l/s sin explicar (" + num(b.pct, 1) +
          "% de las entradas, sobre el umbral de 5%). Freatia no firma un balance que no cuadra." : null,
        desbloqueo: noCuadra ? { txt: "Ver el diagnóstico", tab: "balance" } : null,
        alterna: noCuadra ? "Firmar declarando la incertidumbre" : null,
        cuerpo: "<p>Balance hídrico del período con la trazabilidad de cada partida hasta el instrumento. " +
          "Recirculación: " + num(pctRe) + "% del agua que mueve la faena.</p>" +
          "<p class='pista'>La SMA fiscaliza el cumplimiento de la RCA y puede sancionar. Los montos y categorías " +
          "de infracción están en la ley que crea la Superintendencia (Ley 20.417): <strong>verificar el monto vigente</strong> " +
          "antes de citarlo en una propuesta comercial. Aquí no ponemos la cifra del susto.</p>"
      },
      {
        id: "com", org: "COMUNIDAD", tit: "Reporte público mensual, en castellano",
        per: "Mensual · junio 2026",
        base: "El mismo dato del reporte a la SMA. No hay dos versiones.",
        bloqueo: null,
        cuerpo: "<div class='publico'>" +
          "<p><strong>¿Cuánta agua sacamos este mes?</strong><br>Sacamos " + num(pozos) +
          " litros por segundo del acuífero. Tenemos permiso para sacar " + f.derechoDGA + ". " +
          "Para que se entienda: es el agua que usarían unas " + num(pozos * LS_A_M3 * 1000 / 130) +
          " personas en un día, suponiendo 130 litros por persona.</p>" +
          "<p><strong>¿Cuánta reusamos?</strong><br>" + num(pctRe) +
          "% del agua que mueve la faena es agua que ya usamos antes y volvimos a usar.</p>" +
          (noCuadra ? "<p><strong>¿Hay algo que no cuadre?</strong><br>Sí. Hay " + num(b.sinExplicar) +
            " litros por segundo que todavía no podemos explicar. Puede ser una filtración, puede ser un instrumento " +
            "desajustado, puede ser que estemos calculando mal la evaporación. Estamos haciendo tres cosas para " +
            "averiguarlo y publicaremos el resultado el próximo mes, diga lo que diga.</p>"
            : "<p><strong>¿Hay algo que no cuadre?</strong><br>No. El balance de este mes cierra dentro del margen del proyecto.</p>") +
          "</div>" +
          "<p class='pista'>Un dashboard no arregla un conflicto con una comunidad. Publicar el número que te incomoda, " +
          "todos los meses, sin que te lo pidan, tampoco lo arregla — pero es la única versión de esto que tiene " +
          "alguna posibilidad de servir para algo.</p>"
      }
    ];

    $("#panel-reportes").innerHTML = reps.map(function (r) {
      var est = r.bloqueo ? "bloqueado" : firmado[r.id] ? "firmado" : "listo";
      return '<article class="placa rep rep-' + est + '">' +
        '<div class="placa-tit"><div><span class="rotulo rotulo-agua">' + r.org + "</span>" +
        "<h3>" + r.tit + "</h3><p class='pista'>" + r.per + " · fuente: " + r.base + "</p></div>" +
        (est === "bloqueado" ? chip("critico", "bloqueado", "lock")
          : est === "firmado" ? chip("ok", "firmado y sellado", "ok") : chip("ok", "listo para firmar", "ok")) +
        "</div>" +
        (r.bloqueo ? '<div class="aviso aviso-critico">' + ICO.lock + "<p>" + r.bloqueo + "</p></div>" : "") +
        (est === "firmado" ? '<div class="aviso aviso-ok">' + ICO.ok +
          "<p>Generado desde el dato, no rearmado a mano. Sello sha256:" +
          (r.id + f.id + "7f3a91c4").replace(/[^a-z0-9]/g, "").slice(0, 16) +
          " · cualquier cambio posterior en una partida invalida el sello y avisa.</p></div>" : "") +
        '<div class="rep-cuerpo">' + r.cuerpo + "</div>" +
        '<div class="esc-btns">' +
          (r.bloqueo && r.desbloqueo ? '<button class="btn btn-2" data-ir="' + r.desbloqueo.tab + '">' + r.desbloqueo.txt + "</button>" : "") +
          (r.bloqueo && r.alterna ? '<button class="btn btn-3" data-firmar-inc="' + r.id + '">' + r.alterna + "</button>" : "") +
          (!r.bloqueo && !firmado[r.id] ? '<button class="btn" data-firmar="' + r.id + '">Generar y firmar</button>' : "") +
          (firmado[r.id] ? '<button class="btn btn-3" data-ver="' + r.id + '">Ver el documento</button>' : "") +
        "</div>" +
        "</article>";
    }).join("");

    $$("#panel-reportes [data-ir]").forEach(function (b2) {
      b2.addEventListener("click", function () { estado.pestana = b2.dataset.ir; render(); window.scrollTo({ top: 260 }); });
    });
    $$("#panel-reportes [data-firmar]").forEach(function (b2) {
      b2.addEventListener("click", function () {
        estado.reportes[f.id] = estado.reportes[f.id] || {};
        estado.reportes[f.id][b2.dataset.firmar] = true;
        render();
      });
    });
    $$("#panel-reportes [data-firmar-inc]").forEach(function (b2) {
      b2.addEventListener("click", function () {
        if (!confirm("Vas a firmar el reporte a la SMA declarando una discrepancia de " + num(b.sinExplicar) +
          " l/s (" + num(b.pct, 1) + "% de las entradas).\n\n" +
          "Freatia adjunta un anexo de incertidumbre con las tres hipótesis, la evidencia de cada una y el plan de " +
          "acción con fechas. Queda registrado quién firmó sabiendo esto.\n\n" +
          "¿Confirmas?")) return;
        estado.reportes[f.id] = estado.reportes[f.id] || {};
        estado.reportes[f.id][b2.dataset.firmarInc] = true;
        render();
      });
    });
    $$("#panel-reportes [data-ver]").forEach(function (b2) {
      b2.addEventListener("click", function () { alert("En el producto real esto abre el PDF sellado.\n\nEn el demo, el documento es el texto que ya estás viendo: viene del mismo dato, no de un archivo aparte."); });
    });
  }

  /* ======================================================================
     Arranque
     ====================================================================== */

  function init() {
    var sel = $("#sel-faena");
    sel.innerHTML = FAENAS.map(function (f) {
      return '<option value="' + f.id + '">' + f.nombre + " · " + f.lugar.split(",")[0] + "</option>";
    }).join("");
    sel.addEventListener("change", function () {
      estado.faena = FAENAS.filter(function (f) { return f.id === sel.value; })[0];
      estado.seleccion = null;
      estado.diag = false;
      render();
    });

    $$("#tabs button").forEach(function (btn) {
      btn.addEventListener("click", function () { estado.pestana = btn.dataset.tab; render(); });
    });
    $$("#periodos button").forEach(function (btn) {
      btn.addEventListener("click", function () { estado.periodo = btn.dataset.p; render(); });
    });
    $$("#filtros button").forEach(function (btn) {
      btn.addEventListener("click", function () { estado.filtroCalidad = btn.dataset.q; render(); });
    });

    render();
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
