/* ============================================================================
   CINTAVIA — sala de control (prototipo)
   Estado en el cliente. Datos mock, aritmética real.
   Paleta de series validada contra surface #111A21 (dataviz/validate_palette.js).
   ========================================================================== */
'use strict';

// ---------------------------------------------------------------- constantes
var USD = 940;                    // CLP por USD, referencia julio 2026
var HOY = new Date(2026, 6, 13);  // 2026-07-13

var C = {
  s1: '#C48400', s2: '#0E9EB4', s3: '#7B7FE0', s4: '#BE5A52', s5: '#3F9767',
  ok: '#43C08A', warn: '#FFB000', crit: '#FF6152', none: '#64798A',
  grid: '#1E2C36', rule: '#22323D', ink: '#DDE7ED', ink2: '#93A8B6', ink3: '#7B90A0',
  panel: '#111A21', sunken: '#070B0E'
};
// rampa térmica semántica (sequential con leyenda de escala — excepción legítima)
function heat(v) {
  if (v > 40) return C.crit;
  if (v > 20) return C.s1;
  if (v > 5)  return '#8A6A1E';
  return '#2C3B45';
}
var ST_COL = { crit: C.crit, warn: C.warn, ok: C.ok, none: C.none };

// ---------------------------------------------------------------- datos mock
var FAENAS = {
  QAM: {
    nombre: 'Minera Quebrada Amarga',
    comuna: 'Sierra Gorda, Región de Antofagasta',
    tpd: 110000, ley: 0.0068, rec: 0.87, cuLb: 4.10, costoVarLb: 1.75,
    bufferH: 10,           // autonomía del acopio de gruesos
    estaciones: 12,
    precision90: 0.83,
    correas: [
      { tag: 'CV-2210', desc: 'Chancador primario → acopio', largo: 310,  tph: 6800, ancho: 1830 },
      { tag: 'CV-3410', desc: 'Overland acopio → planta',    largo: 4240, tph: 6500, ancho: 1830 },
      { tag: 'CV-3420', desc: 'Torre TT-04 → molienda',      largo: 760,  tph: 6500, ancho: 1830 },
      { tag: 'CV-3430', desc: 'Alimentación molino SAG',     largo: 1150, tph: 3200, ancho: 1400 },
      { tag: 'CV-3510', desc: 'Recirculación de pebbles',    largo: 420,  tph: 900,  ancho: 1000 }
    ],
    ventanas: [
      { id: 'VM-118', t: 'Detención programada línea 3', fecha: '2026-07-28', dias: 15, horas: 8,  comprometidas: 3.5, cuadrilla: 6 },
      { id: 'VM-121', t: 'Detención mayor de planta',    fecha: '2026-08-11', dias: 29, horas: 24, comprometidas: 14,  cuadrilla: 12 }
    ]
  },
  LCO: {
    nombre: 'Minera Los Cóndores',
    comuna: 'Diego de Almagro, Región de Atacama',
    tpd: 18000, ley: 0.0091, rec: 0.84, cuLb: 4.10, costoVarLb: 2.10,
    bufferH: 6,
    estaciones: 4,
    precision90: 0.76,
    correas: [
      { tag: 'CV-1120', desc: 'Overland mina → planta', largo: 1850, tph: 1400, ancho: 1200 },
      { tag: 'CV-1130', desc: 'Alimentación planta',    largo: 640,  tph: 1400, ancho: 1200 }
    ],
    ventanas: [
      { id: 'VM-041', t: 'Parada semanal de planta', fecha: '2026-07-19', dias: 6,  horas: 10, comprometidas: 5, cuadrilla: 4 },
      { id: 'VM-044', t: 'Detención mayor',          fecha: '2026-08-16', dias: 34, horas: 20, comprometidas: 9, cuadrilla: 8 }
    ]
  }
};

// severidad: crit | warn | info
var ANOMALIAS = [
  { id: 'AN-2308', f: 'QAM', cv: 'CV-2210', m: 86, tag: 'PL-2210-0086-I', sev: 'crit',
    tipo: 'Polín de impacto trabado', canal: 'Visión + térmica',
    conf: 0.93, lo: 0.87, hi: 0.97, p50: 2, vlo: 1, vhi: 5,
    dT: 61.4, horas: 1.0, pers: 3, estado: 'abierta',
    rep: 'Polín de impacto 152×750 CEMA E ×2',
    desc: 'No gira en ninguna de las 8 pasadas evaluadas. ΔT +61 °C. Está bajo la caja de descarga del chancador, en la zona de mayor caída de mineral.',
    riesgo: 'Ignición de la cubierta de la cinta. Este es el modo de falla que SERNAGEOMIN identifica como causa real de incendio de correa.',
    evidencia: [
      ['Rotación detectada', '0 de 8 pasadas'],
      ['ΔT vs 6 polines vecinos', '+61,4 °C'],
      ['Firma acústica 2–6 kHz', '+18 dB sobre línea base'],
      ['Corriente del motor (PLC)', '+3,1 % en 11 días'],
      ['Primera detección', '2026-07-11 04:22']
    ]
  },
  { id: 'AN-2291', f: 'QAM', cv: 'CV-3410', m: 2180, tag: 'PL-3410-2180-C', sev: 'crit',
    tipo: 'Polín de carga sobre temperatura', canal: 'Térmica + acústica',
    conf: 0.91, lo: 0.84, hi: 0.95, p50: 9, vlo: 6, vhi: 14,
    dT: 47.2, horas: 1.5, pers: 2, estado: 'abierta',
    rep: 'Polín de carga 152×750 CEMA C ×3 · grasa NLGI 2',
    desc: 'Rodamiento en degradación. ΔT sube 4,1 °C por semana de forma monótona desde el 21 de junio. Todavía gira, pero el sello está comprometido.',
    riesgo: 'Cuando se traba, roza la cinta a 5,2 m/s. Caso mediano sin incendio: 20 h de correa fuera de servicio − 10 h de acopio vivo = 10 h de planta detenida.',
    evidencia: [
      ['ΔT vs 6 polines vecinos', '+47,2 °C'],
      ['Pendiente térmica', '+4,1 °C / semana, 21 días'],
      ['Firma acústica 2–6 kHz', '+12 dB sobre línea base'],
      ['Rotación detectada', '8 de 8 pasadas (aún gira)'],
      ['Primera detección', '2026-06-24 19:07']
    ]
  },
  { id: 'AN-2287', f: 'QAM', cv: 'CV-3410', m: 2544, tag: 'EMP-3410-03', sev: 'crit',
    tipo: 'Empalme con elongación progresiva', canal: 'Visión + marca de referencia',
    conf: 0.73, lo: 0.58, hi: 0.84, p50: 34, vlo: 21, vhi: 60,
    dT: 0, horas: 6.0, pers: 6, estado: 'abierta',
    rep: 'Kit de vulcanizado en caliente ST-2500 · 1.830 mm · prensa 2,4 m',
    desc: 'La marca de referencia del empalme se ha desplazado 41 mm en 8 semanas. La elongación se acelera: 3 mm/semana hace dos meses, 7 mm/semana ahora.',
    riesgo: 'Apertura del empalme con la correa cargada. 14 h de reparación en terreno − 10 h de buffer = 4 h de planta detenida, más el tramo de cinta.',
    evidencia: [
      ['Elongación acumulada', '41 mm en 8 semanas'],
      ['Tasa actual', '7 mm / semana (acelerando)'],
      ['Cables expuestos', '0 (aún no)'],
      ['Confianza del modelo', 'baja — el detector de empalmes está en beta'],
      ['Primera detección', '2026-05-19 11:40']
    ]
  },
  { id: 'AN-2294', f: 'QAM', cv: 'CV-3410', m: 3080, tag: 'CV-3410 · m 3.020–3.140', sev: 'warn',
    tipo: 'Desalineamiento hacia el lado sur', canal: 'Visión (borde de cinta)',
    conf: 0.88, lo: 0.79, hi: 0.94, p50: 22, vlo: 12, vhi: 40,
    dT: 15.1, horas: 2.0, pers: 3, estado: 'abierta',
    rep: 'Alineación de 4 estaciones · 2 polines guía',
    desc: 'El borde de la cinta corre 34 mm fuera del eje en 120 m de tramo. Roza contra la estructura: calienta y se come la cubierta.',
    riesgo: 'Desgaste acelerado de la cubierta y derrame de mineral. No detiene la planta, pero acorta la vida de la cinta.',
    evidencia: [
      ['Desviación máxima del borde', '34 mm (umbral: 25 mm)'],
      ['Tramo afectado', 'm 3.020 – 3.140'],
      ['Pérdida de cubierta estimada', '1,8 mm en 60 días'],
      ['Correlación con tonelaje', 'aparece sobre 5.900 t/h'],
      ['Primera detección', '2026-07-02 08:15']
    ]
  },
  { id: 'AN-2299', f: 'QAM', cv: 'CV-3410', m: 940, tag: 'PL-3410-0940-R', sev: 'warn',
    tipo: 'Polín de retorno trabado', canal: 'Visión (rotación)',
    conf: 0.64, lo: 0.48, hi: 0.78, p50: 5, vlo: 2, vhi: 12,
    dT: 21.8, horas: 0.8, pers: 2, estado: 'abierta',
    rep: 'Polín de retorno 152×1.950 ×1',
    desc: 'La visión no detecta rotación en 4 de 6 pasadas. La térmica sí sube (+21,8 °C) pero menos de lo esperado para un polín completamente trabado.',
    riesgo: 'Si de verdad está trabado, desgasta la cubierta del lado limpio. Menos grave que un polín de carga.',
    evidencia: [
      ['Rotación detectada', '2 de 6 pasadas'],
      ['ΔT vs vecinos', '+21,8 °C'],
      ['Calidad óptica de la estación', '0,71 — hay polvo en el visor'],
      ['Nota del modelo', 'confianza baja: la señal es compatible con lente sucio'],
      ['Primera detección', '2026-07-09 22:31']
    ]
  },
  { id: 'AN-2303', f: 'QAM', cv: 'CV-3410', m: 60, tag: 'PL-3410-0060-I', sev: 'warn',
    tipo: 'Polín de impacto con anillo desprendido', canal: 'Visión',
    conf: 0.86, lo: 0.77, hi: 0.92, p50: 16, vlo: 9, vhi: 28,
    dT: 8.2, horas: 1.2, pers: 3, estado: 'abierta',
    rep: 'Polín de impacto 152×750 ×2',
    desc: 'Dos anillos de goma del polín de impacto de la zona de carga se desprendieron. El eje trabaja metal contra cinta en 90 mm de ancho.',
    riesgo: 'Corte longitudinal de la cubierta en la zona de carga.',
    evidencia: [
      ['Anillos faltantes', '2 de 9'],
      ['Ancho de contacto metálico', '~90 mm'],
      ['ΔT vs vecinos', '+8,2 °C'],
      ['Primera detección', '2026-07-06 14:55']
    ]
  },
  { id: 'AN-2301', f: 'QAM', cv: 'CV-3410', m: 4210, tag: 'CT-3410-DESC', sev: 'warn',
    tipo: 'Derrame en el punto de descarga', canal: 'Visión',
    conf: 0.79, lo: 0.66, hi: 0.88, p50: 0, vlo: 0, vhi: 0,
    dT: 0, horas: 2.5, pers: 4, estado: 'abierta',
    rep: 'Faldón de sello 6 m · limpieza',
    desc: 'Acumulación de finos bajo el chute de descarga, creciendo desde el 5 de julio. El faldón de sello está vencido.',
    riesgo: 'Riesgo de atrapamiento y de acumulación combustible. Es un hallazgo de DS 132, no de producción.',
    evidencia: [
      ['Volumen estimado', '~2,4 m³'],
      ['Tasa de crecimiento', '+0,3 m³ / día'],
      ['Primera detección', '2026-07-05 06:10']
    ]
  },
  { id: 'AN-2276', f: 'QAM', cv: 'CV-3410', m: 1610, tag: 'CV-3410 · cubierta', sev: 'info',
    tipo: 'Rasgadura superficial de cubierta (340 mm)', canal: 'Visión',
    conf: 0.41, lo: 0.22, hi: 0.61, p50: 0, vlo: 0, vhi: 0,
    dT: 0, horas: 3.0, pers: 3, estado: 'abierta',
    rep: 'Reparación en frío · parche 400×150',
    desc: 'Marca longitudinal de 340 mm en la cubierta superior. Podría ser una rasgadura o podría ser mineral adherido: a esta confianza el modelo no distingue.',
    riesgo: 'Bajo. Vigilar y confirmar en la próxima ronda visual.',
    evidencia: [
      ['Largo aparente', '340 mm'],
      ['Profundidad estimada', 'no medible con visión 2D'],
      ['Confirmación', 'requiere inspección física'],
      ['Nota del modelo', 'a 0,41 este hallazgo es tan probable ruido como señal'],
      ['Primera detección', '2026-06-30 03:44']
    ]
  },
  { id: 'AN-2288', f: 'QAM', cv: 'CV-3420', m: 412, tag: 'PL-3420-0412-C', sev: 'warn',
    tipo: 'Polín de carga sobre temperatura', canal: 'Térmica',
    conf: 0.69, lo: 0.55, hi: 0.81, p50: 19, vlo: 11, vhi: 33,
    dT: 28.6, horas: 1.5, pers: 2, estado: 'abierta',
    rep: 'Polín de carga 152×750 CEMA C ×3',
    desc: 'ΔT +28,6 °C. La pendiente térmica es plana en los últimos 6 días: puede estar estabilizándose.',
    riesgo: 'Moderado. La banda de vida remanente es ancha justamente porque la pendiente se aplanó.',
    evidencia: [
      ['ΔT vs vecinos', '+28,6 °C'],
      ['Pendiente térmica', '+0,3 °C / semana (plana)'],
      ['Firma acústica', 'sin anomalía'],
      ['Primera detección', '2026-07-01 17:22']
    ]
  },
  { id: 'AN-2296', f: 'QAM', cv: 'CV-3510', m: 118, tag: 'PL-3510-0118-C', sev: 'warn',
    tipo: 'Ruido de rodamiento sin firma térmica', canal: 'Acústica',
    conf: 0.58, lo: 0.41, hi: 0.74, p50: 27, vlo: 14, vhi: 48,
    dT: 3.1, horas: 1.5, pers: 2, estado: 'abierta',
    rep: 'Polín de carga 127×500 ×3',
    desc: 'La acústica ve una banda de 3,2 kHz que no estaba hace tres semanas. La térmica no lo confirma. Es un aviso temprano — o es un chute que suena distinto.',
    riesgo: 'Bajo por ahora. Es exactamente el tipo de hallazgo que el umbral de confianza debería dejarte filtrar.',
    evidencia: [
      ['Banda acústica nueva', '3,2 kHz · +9 dB'],
      ['ΔT vs vecinos', '+3,1 °C (dentro de rango)'],
      ['Concordancia entre canales', '1 de 3'],
      ['Primera detección', '2026-07-08 12:03']
    ]
  },
  { id: 'AN-1142', f: 'LCO', cv: 'CV-1120', m: 1240, tag: 'PL-1120-1240-C', sev: 'warn',
    tipo: 'Polín de carga sobre temperatura', canal: 'Térmica + acústica',
    conf: 0.81, lo: 0.70, hi: 0.89, p50: 12, vlo: 7, vhi: 21,
    dT: 38.4, horas: 1.5, pers: 2, estado: 'abierta',
    rep: 'Polín de carga 127×500 ×3',
    desc: 'ΔT +38,4 °C y subiendo. Los Cóndores no tiene departamento de confiabilidad: este hallazgo es el que justifica el contrato completo.',
    riesgo: 'La overland de LCO no tiene acopio intermedio. Si se corta, la planta para de inmediato.',
    evidencia: [
      ['ΔT vs vecinos', '+38,4 °C'],
      ['Pendiente térmica', '+5,8 °C / semana'],
      ['Firma acústica 2–6 kHz', '+14 dB'],
      ['Primera detección', '2026-07-04 09:48']
    ]
  },
  { id: 'AN-1147', f: 'LCO', cv: 'CV-1120', m: 380, tag: 'CV-1120 · m 340–420', sev: 'warn',
    tipo: 'Desalineamiento hacia el lado oriente', canal: 'Visión',
    conf: 0.77, lo: 0.63, hi: 0.87, p50: 30, vlo: 16, vhi: 55,
    dT: 6.9, horas: 2.0, pers: 3, estado: 'abierta',
    rep: 'Alineación de 3 estaciones',
    desc: 'Borde de cinta 29 mm fuera del eje. Aparece sólo con la correa cargada sobre 1.200 t/h.',
    riesgo: 'Derrame y desgaste de cubierta.',
    evidencia: [
      ['Desviación máxima', '29 mm (umbral: 25 mm)'],
      ['Correlación con tonelaje', 'aparece sobre 1.200 t/h'],
      ['Primera detección', '2026-07-07 15:30']
    ]
  }
];

// Empalmes por correa (posición, vida remanente P10/P50/P90 en días)
var EMPALMES = {
  'CV-3410': [
    { id: 'EMP-3410-01', m: 880,  p10: 210, p50: 340, p90: 480 },
    { id: 'EMP-3410-02', m: 1706, p10: 95,  p50: 160, p90: 250 },
    { id: 'EMP-3410-03', m: 2544, p10: 21,  p50: 34,  p90: 60  },
    { id: 'EMP-3410-04', m: 3390, p10: 150, p50: 240, p90: 360 }
  ],
  'CV-3420': [ { id: 'EMP-3420-01', m: 705, p10: 180, p50: 300, p90: 440 } ],
  'CV-3430': [ { id: 'EMP-3430-01', m: 620, p10: 240, p50: 390, p90: 520 } ],
  'CV-2210': [],
  'CV-3510': [],
  'CV-1120': [
    { id: 'EMP-1120-01', m: 620,  p10: 60,  p50: 110, p90: 190 },
    { id: 'EMP-1120-02', m: 1290, p10: 190, p50: 300, p90: 430 }
  ],
  'CV-1130': [ { id: 'EMP-1130-01', m: 310, p10: 130, p50: 220, p90: 340 } ]
};

// Curva precisión/recall del detector (meta del hito M2, no medición)
var PR = [
  [40, 0.58, 0.92], [50, 0.68, 0.86], [60, 0.79, 0.74],
  [70, 0.87, 0.61], [80, 0.92, 0.44], [90, 0.96, 0.23], [95, 0.98, 0.14]
];
function prAt(u) {
  for (var i = 0; i < PR.length - 1; i++) {
    if (u >= PR[i][0] && u <= PR[i + 1][0]) {
      var t = (u - PR[i][0]) / (PR[i + 1][0] - PR[i][0]);
      return { p: PR[i][1] + t * (PR[i + 1][1] - PR[i][1]),
               r: PR[i][2] + t * (PR[i + 1][2] - PR[i][2]) };
    }
  }
  return { p: PR[PR.length - 1][1], r: PR[PR.length - 1][2] };
}

// ---------------------------------------------------------------- estado
var S = {
  faena: 'QAM',
  correa: 'CV-3410',
  umbral: 0.60,
  sel: 'AN-2291',
  ventana: 'VM-118',
  incluidas: {},        // id de anomalía -> true (asignada a la ventana seleccionada)
  tab: 'sin',
  playing: true,
  eventos: []
};
var A = ANOMALIAS.map(function (a) { return Object.assign({}, a); });

// ---------------------------------------------------------------- utilidades
var $ = function (id) { return document.getElementById(id); };
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
function clp(n) { return '$' + Math.round(n).toLocaleString('es-CL'); }
function usd(n) { return 'US$' + Math.round(n).toLocaleString('es-CL'); }
function n2(n) { return n.toFixed(2).replace('.', ','); }
function n1(n) { return n.toFixed(1).replace('.', ','); }

/* Probabilidad como texto. NUNCA imprime «100 %» ni «0 %»: un modelo de
   confiabilidad que declara certeza absoluta está mintiendo, y el mantenedor que
   lea «100 %» y vea que el polín aguantó una semana más no vuelve a creernos.
   Se satura en >99 y <1, que es lo que el modelo realmente puede sostener. */
function pct(p) {
  if (p >= 0.995) return '&gt;99 %';
  if (p > 0 && p < 0.005) return '&lt;1 %';
  return Math.round(p * 100) + ' %';
}

function faena() { return FAENAS[S.faena]; }
function correa() {
  var cs = faena().correas;
  for (var i = 0; i < cs.length; i++) if (cs[i].tag === S.correa) return cs[i];
  return cs[0];
}
function ventana() {
  var vs = faena().ventanas;
  for (var i = 0; i < vs.length; i++) if (vs[i].id === S.ventana) return vs[i];
  return vs[0];
}
function anom(id) { for (var i = 0; i < A.length; i++) if (A[i].id === id) return A[i]; return null; }

// Anomalías visibles: de la faena, abiertas o con OT, y sobre el umbral.
function visibles(cv) {
  return A.filter(function (a) {
    return a.f === S.faena && a.conf >= S.umbral && a.estado !== 'descartada'
        && (!cv || a.cv === cv);
  });
}

// Margen de contribución perdido por hora de planta detenida — aritmética a la vista.
function margenHora(f) {
  var cuFinoDia = f.tpd * f.ley * f.rec;            // t/día
  var lbDia = cuFinoDia * 2204.62;
  var ingresoH = lbDia * f.cuLb / 24;
  var costoH = lbDia * f.costoVarLb / 24;
  return ingresoH - costoH;                          // US$/h
}

// Probabilidad de falla antes de d días, desde la banda P10–P90 (log-normal aproximada).
function pFalla(a, dias) {
  if (!a.p50) return 0;
  var lo = Math.max(a.vlo, 0.5), hi = Math.max(a.vhi, lo + 1);
  var mu = Math.log(a.p50);
  var sigma = (Math.log(hi) - Math.log(lo)) / 2.563;   // P10..P90 = ±1,2816σ
  if (sigma <= 0) return dias >= a.p50 ? 1 : 0;
  var z = (Math.log(Math.max(dias, 0.5)) - mu) / sigma;
  // CDF normal (aprox. Abramowitz-Stegun)
  var t = 1 / (1 + 0.2316419 * Math.abs(z));
  var d = 0.3989423 * Math.exp(-z * z / 2);
  var p = 1 - d * t * (1.330274 * Math.pow(t, 4) - 1.821256 * Math.pow(t, 3) + 1.781478 * t * t - 0.356538 * t + 0.319382);
  return z >= 0 ? p : 1 - p;
}

// Costo esperado de que la anomalía falle sin intervención.
function costoFalla(a) {
  var f = FAENAS[a.f];
  var mh = margenHora(f);
  var horasFuera = { crit: 20, warn: 8, info: 2 }[a.sev];
  if (a.tipo.indexOf('Empalme') === 0) horasFuera = 14;
  if (a.tipo.indexOf('Derrame') === 0) return 0;
  if (a.tipo.indexOf('Desalineamiento') === 0) return 0;
  var horasPlanta = Math.max(horasFuera - f.bufferH, 0);
  return horasPlanta * mh;
}

function toast(msg) {
  var t = $('toast');
  t.textContent = msg;
  t.setAttribute('data-on', 'true');
  clearTimeout(t._h);
  t._h = setTimeout(function () { t.setAttribute('data-on', 'false'); }, 3200);
}

function log(txt, sev, tag) {
  var d = new Date();
  var p = function (n) { return String(n).padStart(2, '0'); };
  S.eventos.unshift({ t: p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds()), txt: txt, sev: sev || 'ok', tag: tag || '' });
  if (S.eventos.length > 40) S.eventos.pop();
  renderFeed();
}

// ---------------------------------------------------------------- SVG helpers
function svgEl(tag, attrs, inner) {
  var s = '<' + tag;
  for (var k in attrs) if (attrs[k] !== undefined && attrs[k] !== null) s += ' ' + k + '="' + attrs[k] + '"';
  return inner !== undefined ? s + '>' + inner + '</' + tag + '>' : s + '/>';
}

// ================================================================ RENDER

// ---- barra HMI
function renderHmi() {
  var f = faena();
  $('hmiFaena').textContent = f.nombre.replace('Minera ', '');
  $('hmiEst').textContent = f.estaciones + ' / ' + f.estaciones;
  $('hmiPrec').textContent = n2(f.precision90);
  var d = new Date(), p = function (n) { return String(n).padStart(2, '0'); };
  $('hmiSync').textContent = p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
}

// ---- curva P/R (2 series, leyenda presente, etiqueta directa en el punto actual)
function renderPR() {
  var W = 210, H = 62, X0 = 4, X1 = 172, Y0 = 52, Y1 = 8;
  var x = function (u) { return X0 + (u - 40) / 55 * (X1 - X0); };
  var y = function (v) { return Y0 - v * (Y0 - Y1); };
  var o = [];
  o.push(svgEl('line', { x1: X0, y1: Y0, x2: X1, y2: Y0, class: 'ax' }));
  var lp = [], lr = [];
  for (var u = 40; u <= 95; u += 1) {
    var v = prAt(u);
    lp.push(x(u).toFixed(1) + ',' + y(v.p).toFixed(1));
    lr.push(x(u).toFixed(1) + ',' + y(v.r).toFixed(1));
  }
  o.push(svgEl('polyline', { points: lp.join(' '), fill: 'none', stroke: C.s1, 'stroke-width': 2 }));
  o.push(svgEl('polyline', { points: lr.join(' '), fill: 'none', stroke: C.s2, 'stroke-width': 2 }));
  var cur = prAt(S.umbral * 100), cx = x(S.umbral * 100);
  o.push(svgEl('line', { x1: cx.toFixed(1), y1: Y1, x2: cx.toFixed(1), y2: Y0, stroke: C.warn, 'stroke-width': 1 }));
  o.push(svgEl('circle', { cx: cx.toFixed(1), cy: y(cur.p).toFixed(1), r: 3.4, fill: C.s1, stroke: C.panel, 'stroke-width': 2 }));
  o.push(svgEl('circle', { cx: cx.toFixed(1), cy: y(cur.r).toFixed(1), r: 3.4, fill: C.s2, stroke: C.panel, 'stroke-width': 2 }));
  o.push(svgEl('text', { x: X1 + 4, y: (y(cur.p) + 3.2).toFixed(1), fill: C.s1, 'font-size': 9 }, n2(cur.p)));
  o.push(svgEl('text', { x: X1 + 4, y: (y(cur.r) + 3.2).toFixed(1), fill: C.s2, 'font-size': 9 }, n2(cur.r)));
  o.push(svgEl('text', { x: X0, y: 60, class: 'lbl' }, '0,40'));
  o.push(svgEl('text', { x: X1, y: 60, 'text-anchor': 'end', class: 'lbl' }, '0,95'));
  $('prCurve').innerHTML = o.join('');
}

// ---- KPIs
function renderKpis() {
  var f = faena();
  var vis = visibles(null);
  var abiertas = vis.filter(function (a) { return a.estado === 'abierta'; });
  var crit = abiertas.filter(function (a) { return a.sev === 'crit'; }).length;
  var ots = A.filter(function (a) { return a.f === S.faena && a.estado === 'ot'; });
  var v = ventana();
  var mh = margenHora(f);
  var riesgo = abiertas.reduce(function (s, a) { return s + costoFalla(a) * pFalla(a, v.dias); }, 0);
  var tph = f.correas.reduce(function (s, c) { return Math.max(s, c.tph); }, 0);

  var cards = [
    { k: 'Correas en línea', v: f.correas.length + '/' + f.correas.length, u: 'estaciones ' + f.estaciones, col: C.ok },
    { k: 'Tonelaje actual', v: Math.round(tph * 0.93).toLocaleString('es-CL'), u: 't/h · nominal ' + tph.toLocaleString('es-CL'), col: C.ink },
    { k: 'Hallazgos abiertos', v: String(abiertas.length), u: crit + ' crítico' + (crit === 1 ? '' : 's') + ' · umbral ' + n2(S.umbral), col: crit ? C.crit : C.warn },
    { k: 'OT generadas', v: String(ots.length), u: 'a ventana ' + v.id, col: C.cyan },
    { k: 'Margen / hora detenida', v: usd(mh / 1000) + 'k', u: clp(mh * USD / 1e6) + ' M CLP/h', col: C.ink },
    { k: 'Riesgo diferido a ' + v.id, v: usd(riesgo / 1000) + 'k', u: 'costo × prob. de falla en ' + v.dias + ' d', col: riesgo > 500000 ? C.crit : C.warn }
  ];
  $('kpis').innerHTML = cards.map(function (c) {
    return '<div class="kpi"><span class="kpi__k">' + esc(c.k) + '</span>' +
           '<div class="kpi__v" style="color:' + c.col + '">' + esc(c.v) + '</div>' +
           '<div class="kpi__u">' + esc(c.u) + '</div></div>';
  }).join('');
}

// ---- sinóptico: correas
function renderBelts() {
  var f = faena();
  $('sinMeta').textContent = f.comuna + ' · ' + f.tpd.toLocaleString('es-CL') + ' tpd';
  var out = f.correas.map(function (c) {
    var an = visibles(c.tag).filter(function (a) { return a.estado === 'abierta'; });
    var segs = Math.max(6, Math.min(24, Math.round(c.largo / 200)));
    var bars = [];
    for (var i = 0; i < segs; i++) {
      var m0 = i * c.largo / segs, m1 = (i + 1) * c.largo / segs;
      var worst = 'ok';
      an.forEach(function (a) {
        if (a.m >= m0 && a.m < m1) {
          if (a.sev === 'crit') worst = 'crit';
          else if (a.sev === 'warn' && worst !== 'crit') worst = 'warn';
          else if (a.sev === 'info' && worst === 'ok') worst = 'none';
        }
      });
      bars.push('<i style="background:' + ST_COL[worst] + '"></i>');
    }
    var st = an.some(function (a) { return a.sev === 'crit'; }) ? 'crit'
           : an.some(function (a) { return a.sev === 'warn'; }) ? 'warn' : 'ok';
    var stTxt = { crit: 'CRÍTICO', warn: 'ATENCIÓN', ok: 'NORMAL' }[st];
    var icon = st === 'crit'
      ? '<svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 0l5 10H0z" fill="currentColor"/></svg>'
      : st === 'warn'
      ? '<svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 1l4 8H1z" fill="currentColor"/></svg>'
      : '<svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="currentColor"/></svg>';
    return '<button class="belt" data-cv="' + c.tag + '">' +
      '<div class="belt__top"><span class="belt__tag">' + c.tag + '</span>' +
      '<span class="st st--' + st + '">' + icon + stTxt + '</span></div>' +
      '<div class="belt__desc">' + esc(c.desc) + '</div>' +
      '<div class="belt__bar">' + bars.join('') + '</div>' +
      '<div class="belt__nums"><span>' + c.largo.toLocaleString('es-CL') + ' m</span>' +
      '<span>' + c.tph.toLocaleString('es-CL') + ' t/h</span>' +
      '<span>tramo ' + Math.round(c.largo / segs) + ' m</span>' +
      '<span>' + an.length + ' hallazgo' + (an.length === 1 ? '' : 's') + '</span></div>' +
      '</button>';
  }).join('');
  $('belts').innerHTML = out;
  Array.prototype.forEach.call(document.querySelectorAll('.belt'), function (b) {
    b.addEventListener('click', function () {
      S.correa = b.dataset.cv;
      $('selCorrea').value = S.correa;
      goTab('per');
    });
  });
}

// ---- feed
function renderFeed() {
  $('feed').innerHTML = S.eventos.map(function (e) {
    return '<li><time>' + e.t + '</time>' +
      '<span class="dot" style="background:' + ST_COL[e.sev] + '"></span>' +
      '<span>' + (e.tag ? '<span class="mono">' + esc(e.tag) + '</span> ' : '') + esc(e.txt) + '</span></li>';
  }).join('');
}

// ---- perfil kilométrico
function renderPerfil() {
  var c = correa(), f = faena();
  $('perTitle').textContent = c.tag + ' · ' + c.desc;
  $('perMeta').textContent = c.largo.toLocaleString('es-CL') + ' m · ' + c.tph.toLocaleString('es-CL') + ' t/h · v 5,2 m/s';

  var W = 900, X0 = 44, X1 = 884;
  var N = Math.max(20, Math.min(60, Math.round(c.largo / 80)));
  var PASO = c.largo / N;
  var an = visibles(c.tag);
  var mapa = {};
  an.forEach(function (a) { mapa[Math.min(N - 1, Math.floor(a.m / PASO))] = a; });

  // señales sintéticas, deterministas
  var dt = [], mis = [], ac = [];
  for (var i = 0; i < N; i++) {
    dt.push(2 + 3.2 * Math.abs(Math.sin(i * 0.71 + 1.3)));
    mis.push(6 + 7 * Math.abs(Math.sin(i * 0.33 + 0.4)) + 3 * Math.sin(i * 1.7));
    ac.push(3 + 4 * Math.abs(Math.sin(i * 1.1 + 2.2)));
  }
  an.forEach(function (a) {
    var i = Math.min(N - 1, Math.floor(a.m / PASO));
    if (a.dT) dt[i] = a.dT;
    if (a.tipo.indexOf('Desalineamiento') === 0) { mis[i] = 34; if (i + 1 < N) mis[i + 1] = 30; if (i > 0) mis[i - 1] = 28; }
    if (a.canal.indexOf('acústica') >= 0 || a.canal.indexOf('Acústica') >= 0) ac[i] = 15 + a.conf * 8;
  });

  var o = [];
  var cw = (X1 - X0) / N;

  // ---- carril 1: térmica (celdas)
  /* Los pines de hallazgo viven en una banda propia arriba (y 7-26). Los títulos
     de carril arrancan en y=38 para no quedar debajo de un pin. */
  var Y1 = 46, H1 = 40;
  o.push(svgEl('text', { x: X0, y: 38, class: 'lbl-em' }, 'ΔT POLÍN vs VECINOS  ·  °C'));
  for (var j = 0; j < N; j++) {
    var x = X0 + j * cw;
    o.push('<rect class="cell" data-i="' + j + '" data-m="' + Math.round(j * PASO) + '" data-v="' + n1(dt[j]) +
      '" data-an="' + (mapa[j] ? mapa[j].id : '') + '" x="' + (x + 0.5).toFixed(1) + '" y="' + Y1 +
      '" width="' + (cw - 1).toFixed(1) + '" height="' + H1 + '" fill="' + heat(dt[j]) +
      '" tabindex="0" role="button" style="cursor:pointer" aria-label="Metro ' + Math.round(j * PASO) +
      ', delta T ' + n1(dt[j]) + ' grados' + (mapa[j] ? ', hallazgo ' + mapa[j].id : '') + '"/>');
  }
  // escala de la rampa térmica
  /* La escala de la rampa ya está en la leyenda del pie del gráfico; repetirla aquí
     sólo la hacía chocar con el pin del último hallazgo (m 4.210). */

  // ---- carril 2: desalineamiento (línea + umbral)
  var Y2 = 112, H2 = 44;
  o.push(svgEl('text', { x: X0, y: Y2 - 6, class: 'lbl-em' }, 'DESALINEAMIENTO DEL BORDE  ·  mm'));
  var ymis = function (v) { return Y2 + H2 - Math.min(v, 40) / 40 * H2; };
  [0, 20, 40].forEach(function (g) {
    o.push(svgEl('line', { x1: X0, y1: ymis(g), x2: X1, y2: ymis(g), class: 'gridline' }));
    o.push(svgEl('text', { x: X0 - 6, y: ymis(g) + 3, 'text-anchor': 'end', class: 'lbl' }, String(g)));
  });
  o.push(svgEl('line', { x1: X0, y1: ymis(25), x2: X1, y2: ymis(25), stroke: C.crit, 'stroke-width': 1, opacity: 0.55 }));
  o.push(svgEl('text', { x: X1 - 2, y: ymis(25) - 3, 'text-anchor': 'end', fill: C.crit, 'font-size': 8.5 }, 'límite 25 mm'));
  var pts = mis.map(function (v, i) { return (X0 + (i + 0.5) * cw).toFixed(1) + ',' + ymis(v).toFixed(1); });
  o.push(svgEl('polyline', { points: pts.join(' '), fill: 'none', stroke: C.s2, 'stroke-width': 2 }));

  // ---- carril 3: acústica (espigas)
  var Y3 = 180, H3 = 36;
  o.push(svgEl('text', { x: X0, y: Y3 - 6, class: 'lbl-em' }, 'ENERGÍA ACÚSTICA 2–6 kHz  ·  dB sobre línea base'));
  o.push(svgEl('line', { x1: X0, y1: Y3 + H3, x2: X1, y2: Y3 + H3, class: 'ax' }));
  for (var k = 0; k < N; k++) {
    var h = Math.min(ac[k], 24) / 24 * H3;
    var xx = X0 + (k + 0.5) * cw;
    o.push(svgEl('line', { x1: xx.toFixed(1), y1: (Y3 + H3).toFixed(1), x2: xx.toFixed(1), y2: (Y3 + H3 - h).toFixed(1),
                           stroke: ac[k] > 12 ? C.s3 : '#33424D', 'stroke-width': Math.max(1.5, cw * 0.4) }));
  }

  // ---- riel de referencia
  var YR = 232;
  o.push(svgEl('line', { x1: X0, y1: YR, x2: X1, y2: YR, class: 'ax' }));
  var paso = c.largo > 2000 ? 1000 : c.largo > 800 ? 200 : 100;
  for (var m = 0; m <= c.largo; m += paso) {
    var xm = X0 + (m / c.largo) * (X1 - X0);
    o.push(svgEl('line', { x1: xm.toFixed(1), y1: YR, x2: xm.toFixed(1), y2: YR + 4, class: 'ax' }));
    o.push(svgEl('text', { x: xm.toFixed(1), y: YR + 15, 'text-anchor': 'middle', class: 'lbl' }, m.toLocaleString('es-CL') + ' m'));
  }
  (EMPALMES[c.tag] || []).forEach(function (e) {
    var xe = X0 + (e.m / c.largo) * (X1 - X0);
    o.push('<path d="M' + xe.toFixed(1) + ' ' + (YR - 12) + ' l4 4 l-4 4 l-4 -4 z" fill="none" stroke="' +
      (e.p50 < 60 ? C.crit : '#3DD6EA') + '" stroke-width="1.2"><title>' + e.id + ' · m ' + e.m + ' · vida P50 ' + e.p50 + ' d</title></path>');
  });

  // pines de anomalía
  an.forEach(function (a) {
    var xa = X0 + (a.m / c.largo) * (X1 - X0);
    var col = a.estado === 'ot' ? C.ok : ST_COL[a.sev === 'info' ? 'none' : a.sev];
    o.push('<g class="pin" data-an="' + a.id + '" style="cursor:pointer" tabindex="0" role="button" aria-label="Hallazgo ' + a.id + ', ' + esc(a.tipo) + '">' +
      svgEl('line', { x1: xa.toFixed(1), y1: 22, x2: xa.toFixed(1), y2: YR, stroke: col, 'stroke-width': 1, 'stroke-dasharray': '2 3', opacity: 0.5 }) +
      '<path d="M' + xa.toFixed(1) + ' 26 l-5 -8 h10 z" fill="' + col + '"/>' +
      svgEl('circle', { cx: xa.toFixed(1), cy: 14, r: 7, fill: C.panel, stroke: col, 'stroke-width': 1.4 }) +
      svgEl('text', { x: xa.toFixed(1), y: 17.4, 'text-anchor': 'middle', 'font-size': 7.5, fill: col, 'font-weight': 700 },
            a.estado === 'ot' ? 'OT' : String(Math.round(a.conf * 100))) +
      '<title>' + a.id + ' · ' + esc(a.tipo) + ' · confianza ' + n2(a.conf) + '</title></g>');
  });

  $('perfil').innerHTML = o.join('');
  $('perCount').textContent = an.length + ' de ' + A.filter(function (a) { return a.f === S.faena && a.cv === c.tag && a.estado !== 'descartada'; }).length + ' sobre el umbral';

  renderAnomList(an);
  renderEmpalmes(c);
}

// Listeners del perfil: se registran UNA vez (delegación sobre el <svg>, cuyo
// innerHTML se reemplaza en cada render pero cuyo nodo persiste).
(function bindPerfil() {
  var svg = $('perfil'), tip = $('tipPerfil'), wrap = svg.closest('.chart-wrap');

  svg.addEventListener('mousemove', function (e) {
    var cell = e.target.closest && e.target.closest('.cell');
    if (!cell) { tip.setAttribute('data-on', 'false'); return; }
    var r = cell.getBoundingClientRect(), wr = wrap.getBoundingClientRect();
    tip.innerHTML = 'm ' + Number(cell.dataset.m).toLocaleString('es-CL') + ' · ΔT ' + cell.dataset.v + ' °C' +
      (cell.dataset.an ? '<br>' + cell.dataset.an : '');
    tip.style.left = (r.left - wr.left + r.width / 2) + 'px';
    tip.style.top = (r.top - wr.top) + 'px';
    tip.setAttribute('data-on', 'true');
  });
  svg.addEventListener('mouseleave', function () { tip.setAttribute('data-on', 'false'); });

  function abrir(el) {
    var id = el.dataset.an;
    if (id) { S.sel = id; goTab('hal'); }
  }
  svg.addEventListener('click', function (e) {
    var p = e.target.closest && (e.target.closest('.pin') || e.target.closest('.cell'));
    if (p) abrir(p);
  });
  svg.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var p = e.target.closest && (e.target.closest('.pin') || e.target.closest('.cell'));
    if (p) { e.preventDefault(); abrir(p); }
  });
})();

// ---- lista de hallazgos del perfil
function renderAnomList(an) {
  if (!an.length) {
    $('anomList').innerHTML = '<p class="dim" style="font-size:var(--step--1);padding:var(--sp-s) 0">' +
      'Ningún hallazgo sobre el umbral ' + n2(S.umbral) + ' en esta correa. Baja el umbral para ver los dudosos.</p>';
    return;
  }
  var v = ventana();
  $('anomList').innerHTML = an.map(function (a) {
    var pf = a.p50 ? pFalla(a, v.dias) : 0;
    var col = a.estado === 'ot' ? C.ok : ST_COL[a.sev === 'info' ? 'none' : a.sev];
    var badge = a.estado === 'ot' ? 'OT EMITIDA' : a.estado === 'vigilar' ? 'EN VIGILANCIA' : (a.sev === 'crit' ? 'CRÍTICO' : a.sev === 'warn' ? 'ATENCIÓN' : 'BAJA CONF.');
    return '<button class="belt" data-an="' + a.id + '" style="border-left:3px solid ' + col + ';padding-left:8px">' +
      '<div class="belt__top"><span class="belt__tag" style="font-size:0.82rem">' + a.id + ' · ' + esc(a.tipo) + '</span>' +
      '<span class="mono" style="font-size:0.66rem;color:' + col + '">' + badge + '</span></div>' +
      '<div class="belt__nums">' +
      '<span class="cyan">' + esc(a.tag) + '</span>' +
      '<span>m ' + a.m.toLocaleString('es-CL') + '</span>' +
      '<span>conf ' + n2(a.conf) + ' [' + n2(a.lo) + '–' + n2(a.hi) + ']</span>' +
      (a.p50 ? '<span>vida P50 ' + a.p50 + ' d</span><span style="color:' + (pf > 0.5 ? C.crit : C.ink3) + '">P(falla antes de ' + v.id + ') ' + pct(pf) + '</span>' : '') +
      '</div></button>';
  }).join('');
  Array.prototype.forEach.call($('anomList').querySelectorAll('[data-an]'), function (b) {
    b.addEventListener('click', function () { S.sel = b.dataset.an; goTab('hal'); });
  });
}

// ---- empalmes: dot plot con banda P10–P90
function renderEmpalmes(c) {
  var es = EMPALMES[c.tag] || [];
  var W = 420, X0 = 92, X1 = 388, TOP = 26, ROW = 30;
  /* +22 px extra por si hay 2 ventanas: sus etiquetas se escalonan en dos alturas
     (VM-118 a 15 d y VM-121 a 29 d caen a ~12 px una de otra y se pisarían). */
  var H = Math.max(90, TOP + es.length * ROW + 44 + (faena().ventanas.length > 1 ? 22 : 0));
  $('empalmes').setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  if (!es.length) {
    $('empalmes').innerHTML = svgEl('text', { x: 10, y: 40, class: 'lbl' }, 'Esta correa no tiene empalmes vulcanizados registrados.');
    return;
  }
  var vs = faena().ventanas;
  var max = Math.max(120, Math.max.apply(null, es.map(function (e) { return e.p90; })) * 1.05);
  var x = function (d) { return X0 + Math.min(d, max) / max * (X1 - X0); };
  var o = [];
  o.push(svgEl('text', { x: 4, y: 12, class: 'lbl-em' }, 'EMPALME'));
  o.push(svgEl('text', { x: X1, y: 12, 'text-anchor': 'end', class: 'lbl' }, 'días desde hoy →'));

  // ventanas de mantención como reglas verticales — el evento que importa
  var base = TOP + es.length * ROW;
  vs.forEach(function (v, i) {
    var xv = x(v.dias);
    var esc2 = i % 2 ? 22 : 0;                       // escalón: las dos ventanas están muy juntas
    o.push(svgEl('line', { x1: xv.toFixed(1), y1: TOP - 8, x2: xv.toFixed(1), y2: base + esc2 - 6, stroke: C.warn, 'stroke-width': 1, 'stroke-dasharray': i ? '3 3' : '', opacity: 0.75 }));
    o.push(svgEl('text', { x: xv.toFixed(1), y: base + 14 + esc2, 'text-anchor': 'middle', fill: C.warn, 'font-size': 8.5 }, v.id));
    o.push(svgEl('text', { x: xv.toFixed(1), y: base + 25 + esc2, 'text-anchor': 'middle', class: 'lbl' }, v.dias + ' d'));
  });

  es.forEach(function (e, i) {
    var y = TOP + i * ROW + 8;
    var urgente = e.p10 < vs[vs.length - 1].dias;
    var col = urgente ? C.s4 : C.s2;
    o.push(svgEl('text', { x: 4, y: y + 3.5, fill: C.ink2, 'font-size': 9 }, e.id));
    o.push(svgEl('line', { x1: x(e.p10).toFixed(1), y1: y, x2: x(e.p90).toFixed(1), y2: y, stroke: col, 'stroke-width': 3, opacity: 0.5 }));
    o.push(svgEl('line', { x1: x(e.p10).toFixed(1), y1: y - 4, x2: x(e.p10).toFixed(1), y2: y + 4, stroke: col, 'stroke-width': 1.4 }));
    o.push(svgEl('line', { x1: x(e.p90).toFixed(1), y1: y - 4, x2: x(e.p90).toFixed(1), y2: y + 4, stroke: col, 'stroke-width': 1.4 }));
    o.push(svgEl('circle', { cx: x(e.p50).toFixed(1), cy: y, r: 4.5, fill: col, stroke: C.panel, 'stroke-width': 2 },
      '<title>' + e.id + ' · P50 ' + e.p50 + ' d · banda ' + e.p10 + '–' + e.p90 + ' d</title>'));
    o.push(svgEl('text', { x: (x(e.p50) + 9).toFixed(1), y: y - 7, fill: C.ink3, 'font-size': 8.5 }, e.p50 + ' d'));
  });
  $('empalmes').innerHTML = o.join('');
}

// ---- hallazgo (la vista más importante)
function renderHallazgo() {
  var a = anom(S.sel);
  if (!a || a.f !== S.faena) {
    var cand = visibles(null)[0];
    if (!cand) {
      $('hallazgo').innerHTML = '<div class="panel"><p class="dim">No hay hallazgos sobre el umbral en esta faena. Baja el umbral de confianza.</p></div>';
      return;
    }
    a = cand; S.sel = a.id;
  }
  var f = FAENAS[a.f], v = ventana();
  var col = ST_COL[a.sev === 'info' ? 'none' : a.sev];
  var cf = costoFalla(a);
  var pf = a.p50 ? pFalla(a, v.dias) : 0;

  var head =
    '<div class="panel" style="border-left:3px solid ' + col + '">' +
      '<div class="row" style="justify-content:space-between;align-items:flex-start">' +
        '<div>' +
          '<div class="row"><span class="mono" style="font-size:1.05rem;font-weight:700;color:' + col + '">' + a.id + '</span>' +
          '<span class="tag">' + esc(a.tag) + '</span>' +
          '<span class="mono dim" style="font-size:0.74rem">' + a.cv + ' · m ' + a.m.toLocaleString('es-CL') + '</span></div>' +
          '<h3 style="margin-top:6px">' + esc(a.tipo) + '</h3>' +
          '<p class="mono dim" style="font-size:0.72rem;margin-top:4px">Canal: ' + esc(a.canal) + ' · Estado: ' +
            (a.estado === 'ot' ? '<span style="color:' + C.ok + '">OT EMITIDA</span>' :
             a.estado === 'vigilar' ? '<span style="color:' + C.cyan + '">EN VIGILANCIA</span>' : 'ABIERTO') + '</p>' +
        '</div>' +
      '</div>' +
      '<p style="margin-top:var(--sp-s);font-size:var(--step--1)">' + esc(a.desc) + '</p>' +
    '</div>';

  // ---- recorte térmico sintetizado
  var crop = '<div class="panel"><div class="panel__head">' +
    '<span class="panel__title">Recorte de la detección</span>' +
    '<span class="panel__meta">EST-' + a.cv.slice(3) + '-0' + (1 + (a.m % 6)) + ' · térmica 640×512</span></div>' +
    '<div class="chart-wrap">' + termica(a) + '</div>' +
    '<div class="legend"><span><i style="background:#1B2A33"></i> 18 °C</span>' +
    '<span><i style="background:#8A6A1E"></i> 45</span>' +
    '<span><i style="background:#C48400"></i> 65</span>' +
    '<span><i style="background:#FF6152"></i> 90 °C</span></div>' +
    '<p class="src">Imagen sintetizada para el prototipo. En producción es un recorte radiométrico real de 200 KB, ' +
    'con la caja del detector y la temperatura absoluta por píxel.</p></div>';

  // ---- confianza
  var conf = '<div class="panel"><div class="panel__head">' +
    '<span class="panel__title">Confianza de la detección</span>' +
    '<span class="panel__meta">umbral actual ' + n2(S.umbral) + '</span></div>' +
    '<div class="conf-bar">' +
      '<div class="conf-bar__band" style="left:' + (a.lo * 100) + '%;width:' + ((a.hi - a.lo) * 100) + '%"></div>' +
      '<div class="conf-bar__p50" style="left:' + (a.conf * 100) + '%"></div>' +
      '<div style="position:absolute;top:0;bottom:0;left:' + (S.umbral * 100) + '%;width:1px;background:' + C.cyan + '"></div>' +
    '</div>' +
    '<div class="conf-bar__scale"><span>0,00</span><span>0,50</span><span>1,00</span></div>' +
    '<div class="evi mt-s">' +
      '<div class="evi__row"><span>Confianza puntual</span><span style="color:' + C.warn + '">' + n2(a.conf) + '</span></div>' +
      '<div class="evi__row"><span>Intervalo de credibilidad 90 %</span><span>' + n2(a.lo) + ' – ' + n2(a.hi) + '</span></div>' +
      '<div class="evi__row"><span>Umbral de la faena</span><span style="color:' + C.cyan + '">' + n2(S.umbral) + '</span></div>' +
      '<div class="evi__row"><span>Precisión esperada a este umbral</span><span>' + n2(prAt(S.umbral * 100).p) + '</span></div>' +
    '</div>' +
    '<p class="src">Léelo así: de cada 100 hallazgos que el sistema emite a umbral ' + n2(S.umbral) + ', unos ' +
    Math.round(prAt(S.umbral * 100).p * 100) + ' resultan reales al abrir el equipo. ' +
    '<b>El resto es tu costo de falsa alarma, y te lo decimos antes de que lo descubras solo.</b></p></div>';

  // ---- evidencia
  var evi = '<div class="panel"><div class="panel__head"><span class="panel__title">Evidencia</span>' +
    '<span class="panel__meta">' + a.evidencia.length + ' señales</span></div><div class="evi">' +
    a.evidencia.map(function (e) {
      return '<div class="evi__row"><span>' + esc(e[0]) + '</span><span>' + esc(e[1]) + '</span></div>';
    }).join('') + '</div></div>';

  // ---- curva térmica + proyección
  var curva = a.p50 ? '<div class="panel"><div class="panel__head">' +
    '<span class="panel__title">Curva térmica y vida remanente</span>' +
    '<span class="panel__meta">ΔT sobre el promedio de los 6 polines vecinos</span></div>' +
    '<div class="chart-wrap"><div class="scroll-x">' + curvaTermica(a) + '</div></div>' +
    '<div class="legend">' +
      '<span><i style="background:' + C.s1 + '"></i> ΔT medido</span>' +
      '<span><i style="background:' + C.s1 + ';opacity:.35"></i> proyección · cono P10–P90</span>' +
      '<span><i style="background:' + C.crit + '"></i> umbral de falla</span>' +
      '<span><i style="background:' + C.warn + '"></i> ventana de mantención</span>' +
    '</div>' +
    '<div class="evi mt-s">' +
      '<div class="evi__row"><span>Vida remanente P50</span><span style="color:' + C.warn + '">' + a.p50 + ' días</span></div>' +
      '<div class="evi__row"><span>Banda P10 – P90</span><span>' + a.vlo + ' – ' + a.vhi + ' días</span></div>' +
      '<div class="evi__row"><span>P(falla antes de ' + v.id + ', en ' + v.dias + ' d)</span><span style="color:' + (pf > 0.5 ? C.crit : C.ink) + '">' + pct(pf) + '</span></div>' +
      '<div class="evi__row"><span>Costo si falla (planta detenida)</span><span>' + (cf ? usd(cf) + ' · ' + clp(cf * USD / 1e6) + ' M CLP' : 'no detiene planta') + '</span></div>' +
      '<div class="evi__row"><span>Costo esperado de postergar</span><span style="color:' + C.crit + '">' + usd(cf * pf) + '</span></div>' +
    '</div>' +
    veredicto(a, pf) +
    '</div>' : '';

  // ---- acciones
  var acc = '<div class="panel"><div class="panel__head"><span class="panel__title">Acción</span></div>' +
    '<p class="dim" style="font-size:var(--step--1);margin-bottom:var(--sp-s)">' +
    'Una detección que no termina en una orden de trabajo es una alarma más. Estas tres acciones son todo el producto.</p>' +
    '<div class="stack-s">' +
      (a.estado === 'ot'
        ? '<div class="sap"><b>OT EMITIDA</b> · aviso SAP PM ' + avisoNum(a) + ' · asignado a ' + v.id + ' (' + v.fecha + ')</div>'
        : '<button class="btn btn--primary" data-act="ot" style="width:100%">Generar OT para ' + v.id + ' · ' + v.fecha + '</button>') +
      '<button class="btn btn--cyan" data-act="vig" style="width:100%">' + (a.estado === 'vigilar' ? 'En vigilancia — quitar' : 'Vigilar (no intervenir aún)') + '</button>' +
      '<button class="btn btn--ghost" data-act="fp" style="width:100%">Descartar — falso positivo</button>' +
    '</div>' +
    '<p class="src">Descartar no sólo cierra el hallazgo: alimenta el reentrenamiento del modelo de <b>esta</b> faena. ' +
    'La precisión de las últimas 90 detecciones está arriba en la barra de estado; si la ves caer, el modelo se está degradando ' +
    'y tienes que llamarnos.</p></div>';

  $('hallazgo').innerHTML =
    '<div class="grid g2">' +
      '<div class="stack">' + head + crop + evi + '</div>' +
      '<div class="stack">' + conf + curva + acc + '</div>' +
    '</div>';

  Array.prototype.forEach.call($('hallazgo').querySelectorAll('[data-act]'), function (b) {
    b.addEventListener('click', function () { accion(a.id, b.dataset.act); });
  });
}

function avisoNum(a) { return 'AV-44' + (71000 + parseInt(a.id.slice(3), 10)); }

function veredicto(a, pf) {
  var v = ventana(), vs = faena().ventanas;
  if (pf > 0.55) {
    var f = FAENAS[a.f];
    var hMicro = a.horas + 0.5;                       // la tarea + 30 min de LOTO
    var hPlanta = Math.max(hMicro - f.bufferH, 0);    // lo que el acopio NO alcanza a absorber
    var cuadrilla = a.horas * a.pers * 42000;         // CLP: HH de la cuadrilla del contratista
    var costoTxt = hPlanta > 0
      ? 'Detiene planta ' + n1(hPlanta) + ' h netas (el acopio absorbe ' + f.bufferH + ' h de las ' +
        n1(hMicro) + ' h): <strong>' + usd(margenHora(f) * hPlanta) + '</strong>, más ' +
        clp(cuadrilla) + ' de cuadrilla'
      : '<strong>No detiene planta:</strong> las ' + n1(hMicro) + ' h caben enteras dentro de las ' +
        f.bufferH + ' h de acopio. El costo real son ' + clp(cuadrilla) + ' de cuadrilla (' +
        a.pers + ' personas × ' + n1(a.horas) + ' h)';
    return '<div class="callout callout--crit mt-s"><p><strong>No alcanza la ventana.</strong> ' +
      'Con P50 de ' + a.p50 + ' días y ' + v.dias + ' días hasta ' + v.id + ', la probabilidad de que falle antes es de ' +
      pct(pf) + '. La recomendación no es «esperar la ventana»: es una <strong>micro-detención de ' +
      n1(hMicro) + ' h en el próximo cambio de turno</strong>. ' + costoTxt +
      ' — contra ' + usd(costoFalla(a) * pf) + ' de riesgo esperado si se deja correr.</p></div>';
  }
  if (pf > 0.15) {
    return '<div class="callout mt-s"><p><strong>Entra en ' + v.id + '.</strong> ' +
      pct(pf) + ' de probabilidad de falla antes de la ventana: aguanta, pero no aguanta la siguiente. ' +
      'Esta es exactamente la tarea que justifica reservar ' + n1(a.horas) + ' h de las ' +
      (v.horas - v.comprometidas) + ' h libres.</p></div>';
  }
  return '<div class="callout callout--cyan mt-s"><p><strong>Puede esperar.</strong> Sólo ' +
    pct(pf) + ' de probabilidad de falla antes de ' + v.id + '. ' +
    'Meterlo a la fuerza en una ventana llena desplaza tareas que sí urgen. Déjalo en vigilancia y revísalo en 2 semanas.</p></div>';
}

// ---- imagen térmica sintetizada
function termica(a) {
  var W = 420, H = 190, COLS = 42, ROWS = 19;
  var cw = W / COLS, ch = H / ROWS;
  var hx = 26, hy = 9;                       // centro del punto caliente
  var caliente = a.dT > 15;
  var o = ['<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Recorte térmico del ' + esc(a.tag) + '. ' +
    (caliente ? 'Se ve un punto caliente en el rodillo central.' : 'No hay punto caliente evidente.') + '">'];
  for (var r = 0; r < ROWS; r++) {
    for (var c2 = 0; c2 < COLS; c2++) {
      var base = 18 + 5 * Math.abs(Math.sin(c2 * 0.4 + r * 0.9));
      // la estructura de la correa: la cinta cruza el centro
      if (r >= 6 && r <= 12) base += 9;
      if (caliente) {
        var d = Math.sqrt(Math.pow((c2 - hx) * 0.9, 2) + Math.pow((r - hy) * 1.5, 2));
        base += (a.dT + 22) * Math.exp(-d * d / 16);
      }
      var t = Math.min(base, 95);
      var col = t > 78 ? C.crit : t > 58 ? C.s1 : t > 38 ? '#8A6A1E' : t > 27 ? '#3A4B56' : '#1B2A33';
      o.push('<rect x="' + (c2 * cw).toFixed(1) + '" y="' + (r * ch).toFixed(1) + '" width="' + (cw + 0.4).toFixed(1) +
             '" height="' + (ch + 0.4).toFixed(1) + '" fill="' + col + '"/>');
    }
  }
  // silueta de la correa y los polines
  o.push('<line x1="0" y1="' + (6 * ch).toFixed(1) + '" x2="' + W + '" y2="' + (6 * ch).toFixed(1) + '" stroke="#0A0F14" stroke-width="1" opacity=".55"/>');
  o.push('<line x1="0" y1="' + (13 * ch).toFixed(1) + '" x2="' + W + '" y2="' + (13 * ch).toFixed(1) + '" stroke="#0A0F14" stroke-width="1" opacity=".55"/>');
  if (caliente) {
    var bx = (hx - 6) * cw, by = (hy - 5) * ch, bw = 12 * cw, bh = 10 * ch;
    o.push('<rect x="' + bx.toFixed(1) + '" y="' + by.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + bh.toFixed(1) +
           '" fill="none" stroke="' + C.warn + '" stroke-width="1.6"/>');
    o.push('<rect x="' + bx.toFixed(1) + '" y="' + (by - 13).toFixed(1) + '" width="86" height="13" fill="' + C.warn + '"/>');
    o.push('<text x="' + (bx + 3).toFixed(1) + '" y="' + (by - 3.5).toFixed(1) + '" font-size="8" font-weight="700" fill="#0A0F14" font-family="JetBrains Mono, monospace">' +
           n2(a.conf) + ' · ' + n1(a.dT) + '°C</text>');
  }
  o.push('<text x="6" y="' + (H - 6) + '" font-size="8" fill="#DDE7ED" font-family="JetBrains Mono, monospace" opacity=".8">' +
         esc(a.tag) + '  2026-07-13 06:41:22</text>');
  o.push('</svg>');
  return o.join('');
}

// ---- curva térmica con proyección y cono de incertidumbre
function curvaTermica(a) {
  var W = 560, H = 220, X0 = 34, X1 = 546, Y0 = 178, Y1 = 18;
  var D0 = -30, D1 = Math.max(a.vhi + 4, 26);
  var TMAX = 90;
  var x = function (d) { return X0 + (d - D0) / (D1 - D0) * (X1 - X0); };
  var y = function (t) { return Y0 - Math.min(t, TMAX) / TMAX * (Y0 - Y1); };

  var t0 = a.dT;
  // pendiente implícita: llega al umbral de falla (70 °C) en p50 días
  var UMB = 70;
  var k = a.p50 > 0 ? (UMB - t0) / a.p50 : 0;

  var o = ['<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Curva térmica del ' + esc(a.tag) +
    ': 30 días de historia y proyección con banda de incertidumbre hasta el umbral de falla.">'];

  [0, 20, 40, 60, 80].forEach(function (g) {
    o.push(svgEl('line', { x1: X0, y1: y(g), x2: X1, y2: y(g), class: 'gridline' }));
    o.push(svgEl('text', { x: X0 - 6, y: y(g) + 3, 'text-anchor': 'end', class: 'lbl' }, String(g)));
  });
  o.push(svgEl('text', { x: 4, y: 12, class: 'lbl-em' }, 'ΔT (°C)'));

  // umbral de falla
  o.push(svgEl('line', { x1: X0, y1: y(UMB), x2: X1, y2: y(UMB), stroke: C.crit, 'stroke-width': 1.2 }));
  o.push(svgEl('text', { x: X0 + 4, y: y(UMB) - 4, fill: C.crit, 'font-size': 9 }, 'umbral de falla 70 °C'));

  // hoy
  o.push(svgEl('line', { x1: x(0), y1: Y1, x2: x(0), y2: Y0, stroke: C.ink3, 'stroke-width': 1 }));
  o.push(svgEl('text', { x: x(0), y: Y1 - 4, 'text-anchor': 'middle', class: 'lbl' }, 'HOY'));

  // cono de incertidumbre: entre la pendiente que llega al umbral en vhi y la que llega en vlo
  var kLo = a.vhi > 0 ? (UMB - t0) / a.vhi : 0;   // pendiente lenta
  var kHi = a.vlo > 0 ? (UMB - t0) / a.vlo : 0;   // pendiente rápida
  var up = [], dn = [];
  for (var d = 0; d <= D1; d += 1) {
    up.push(x(d).toFixed(1) + ',' + y(t0 + kHi * d).toFixed(1));
    dn.push(x(d).toFixed(1) + ',' + y(t0 + kLo * d).toFixed(1));
  }
  o.push(svgEl('polygon', { points: up.join(' ') + ' ' + dn.reverse().join(' '), fill: C.s1, opacity: 0.16 }));

  // proyección P50
  var pj = [];
  for (var d2 = 0; d2 <= D1; d2 += 1) pj.push(x(d2).toFixed(1) + ',' + y(t0 + k * d2).toFixed(1));
  o.push(svgEl('polyline', { points: pj.join(' '), fill: 'none', stroke: C.s1, 'stroke-width': 2, 'stroke-dasharray': '4 3', opacity: 0.85 }));

  // historia medida (30 días, ruido determinista alrededor de la tendencia)
  var hs = [];
  for (var h = D0; h <= 0; h += 1) {
    var trend = t0 + k * h;
    var noise = 1.6 * Math.sin(h * 1.9) + 0.9 * Math.sin(h * 0.7);
    hs.push(x(h).toFixed(1) + ',' + y(Math.max(trend + noise, 1)).toFixed(1));
  }
  o.push(svgEl('polyline', { points: hs.join(' '), fill: 'none', stroke: C.s1, 'stroke-width': 2 }));
  o.push(svgEl('circle', { cx: x(0), cy: y(t0), r: 4, fill: C.s1, stroke: C.panel, 'stroke-width': 2 }));
  o.push(svgEl('text', { x: x(0) - 6, y: y(t0) - 8, 'text-anchor': 'end', fill: C.ink, 'font-size': 10, 'font-weight': 500 }, n1(t0) + ' °C'));

  // banda de vida remanente en el eje
  o.push(svgEl('rect', { x: x(a.vlo).toFixed(1), y: Y0 + 4, width: (x(a.vhi) - x(a.vlo)).toFixed(1), height: 5, fill: C.s1, opacity: 0.45 }));
  o.push(svgEl('circle', { cx: x(a.p50).toFixed(1), cy: Y0 + 6.5, r: 3.5, fill: C.s1 }));
  o.push(svgEl('text', { x: x(a.p50).toFixed(1), y: Y0 + 22, 'text-anchor': 'middle', fill: C.s1, 'font-size': 9 }, 'P50 ' + a.p50 + ' d'));

  // ventanas de mantención — el evento que decide todo
  faena().ventanas.forEach(function (v) {
    if (v.dias > D1) return;
    var xv = x(v.dias);
    o.push(svgEl('line', { x1: xv.toFixed(1), y1: Y1, x2: xv.toFixed(1), y2: Y0, stroke: C.warn, 'stroke-width': 1.4, opacity: v.id === S.ventana ? 1 : 0.4 }));
    o.push(svgEl('rect', { x: (xv - 22).toFixed(1), y: Y1 - 13, width: 44, height: 12, fill: v.id === S.ventana ? C.warn : '#3B3220' }));
    o.push(svgEl('text', { x: xv.toFixed(1), y: Y1 - 4, 'text-anchor': 'middle', 'font-size': 8, 'font-weight': 700,
                           fill: v.id === S.ventana ? '#0A0F14' : C.warn }, v.id));
  });

  // eje de días
  o.push(svgEl('line', { x1: X0, y1: Y0, x2: X1, y2: Y0, class: 'ax' }));
  for (var dd = -30; dd <= D1; dd += 10) {
    o.push(svgEl('text', { x: x(dd).toFixed(1), y: Y0 + 36, 'text-anchor': 'middle', class: 'lbl' }, (dd > 0 ? '+' : '') + dd + ' d'));
  }
  o.push('</svg>');
  return o.join('');
}

// ---- acciones sobre un hallazgo
function accion(id, act) {
  var a = anom(id);
  if (!a) return;
  var v = ventana();
  if (act === 'ot') {
    a.estado = 'ot';
    S.incluidas[id] = true;
    log('OT generada · aviso SAP ' + avisoNum(a) + ' → ' + v.id, 'ok', a.id);
    toast('OT ' + avisoNum(a) + ' emitida a ' + v.id + ' · ' + v.fecha);
    goTab('ven');
    return;
  }
  if (act === 'vig') {
    a.estado = a.estado === 'vigilar' ? 'abierta' : 'vigilar';
    log(a.estado === 'vigilar' ? 'Marcado en vigilancia' : 'Devuelto a hallazgos abiertos', 'warn', a.id);
    toast(a.estado === 'vigilar' ? a.id + ' en vigilancia' : a.id + ' reabierto');
  }
  if (act === 'fp') {
    a.estado = 'descartada';
    delete S.incluidas[id];
    var f = faena();
    f.precision90 = Math.max(0.5, f.precision90 - 0.012);
    log('Descartado como falso positivo · alimenta reentrenamiento', 'none', a.id);
    toast(a.id + ' descartado — precisión de 90 días bajó a ' + n2(f.precision90));
    var next = visibles(null).filter(function (x) { return x.estado === 'abierta'; })[0];
    S.sel = next ? next.id : null;
  }
  renderAll();
}

// ---- ventana / OT
function renderVentana() {
  var f = faena(), v = ventana();
  var cand = A.filter(function (a) {
    return a.f === S.faena && a.estado !== 'descartada' && a.conf >= S.umbral && a.horas > 0;
  });
  var sel = cand.filter(function (a) { return S.incluidas[a.id]; });
  var horas = sel.reduce(function (s, a) { return s + a.horas; }, 0);
  var libres = v.horas - v.comprometidas;
  var over = horas > libres;

  var riesgoCubierto = sel.reduce(function (s, a) { return s + costoFalla(a) * pFalla(a, v.dias); }, 0);
  var riesgoAbierto = cand.filter(function (a) { return !S.incluidas[a.id]; })
                          .reduce(function (s, a) { return s + costoFalla(a) * pFalla(a, v.dias); }, 0);

  // Horas-hombre de la cuadrilla: $42.000/HH cargado (contratista de correas, turno 7×7).
  var hhTot = sel.reduce(function (s, a) { return s + a.horas * a.pers; }, 0);
  var hh = hhTot * 42000;

  var pctComp = v.comprometidas / v.horas * 100;
  var pctSel = Math.min(horas, libres) / v.horas * 100;
  var pctOver = Math.max(horas - libres, 0) / v.horas * 100;
  var pctLibre = Math.max(100 - pctComp - pctSel - pctOver, 0);

  var vsel = f.ventanas.map(function (w) {
    return '<button class="btn ' + (w.id === S.ventana ? 'btn--primary' : 'btn--ghost') + '" data-vent="' + w.id + '">' +
      w.id + ' · ' + w.fecha + ' · ' + w.horas + ' h</button>';
  }).join('');

  var lista = cand.map(function (a) {
    var pf = a.p50 ? pFalla(a, v.dias) : 0;
    var cf = costoFalla(a);
    var on = !!S.incluidas[a.id];
    return '<div class="ot">' +
      '<input type="checkbox" id="ot-' + a.id + '" data-ot="' + a.id + '"' + (on ? ' checked' : '') + '>' +
      '<label for="ot-' + a.id + '">' +
        '<div class="ot__t">' + a.id + ' · ' + esc(a.tipo) + '</div>' +
        '<div class="ot__m">' +
          '<span class="cyan">' + esc(a.tag) + '</span> · ' + a.cv + ' m ' + a.m.toLocaleString('es-CL') + '<br>' +
          n1(a.horas) + ' h · ' + a.pers + ' personas · ' + esc(a.rep) + '<br>' +
          (a.p50
            ? 'P(falla antes de ' + v.id + ') <b style="color:' + (pf > 0.5 ? C.crit : C.ink2) + '">' + pct(pf) + '</b>' +
              (cf ? ' · riesgo esperado <b style="color:' + C.warn + '">' + usd(cf * pf) + '</b>' : ' · no detiene planta')
            : 'hallazgo de condición · no aplica vida remanente') +
          (a.estado === 'ot' ? '<br><b style="color:' + C.ok + '">Aviso SAP ' + avisoNum(a) + ' emitido</b>' : '') +
        '</div>' +
      '</label></div>';
  }).join('');

  var sapTxt = sel.length
    ? sel.map(function (a) {
        return 'AVISO ' + avisoNum(a) + '  TIPO M2 (avería)\n' +
          '  Equipo         ' + a.tag + '\n' +
          '  Ubic. técnica  ' + f.nombre.replace('Minera ', '').toUpperCase().replace(/ /g, '-') + '/' + a.cv + '/M' + a.m + '\n' +
          '  Descripción    ' + a.tipo + ' — detección Cintavia, confianza ' + n2(a.conf) + '\n' +
          '  Prioridad      ' + (a.sev === 'crit' ? '1 · MUY ALTA' : a.sev === 'warn' ? '2 · ALTA' : '3 · MEDIA') + '\n' +
          '  Parada         ' + v.id + '  ' + v.fecha + '\n' +
          '  Trabajo        ' + n1(a.horas) + ' h × ' + a.pers + ' pers\n' +
          '  Repuesto       ' + a.rep;
      }).join('\n\n')
    : 'Sin tareas seleccionadas para ' + v.id + '.';

  $('ventana').innerHTML =
    '<div class="grid g23">' +
      '<div class="stack">' +
        '<div class="panel">' +
          '<div class="panel__head"><span class="panel__title">Ventana de mantención</span>' +
          '<span class="panel__meta">' + f.nombre + '</span></div>' +
          '<div class="row" style="margin-bottom:var(--sp-s)">' + vsel + '</div>' +
          '<p style="font-size:var(--step--1);margin-bottom:var(--sp-s)">' + esc(v.t) + ' · cuadrilla de ' + v.cuadrilla + ' personas.</p>' +

          '<div class="cap" role="img" aria-label="Capacidad de la ventana: ' + n1(v.comprometidas) + ' horas ya comprometidas, ' +
            n1(Math.min(horas, libres)) + ' horas seleccionadas, ' + n1(Math.max(libres - horas, 0)) + ' horas libres.">' +
            '<i style="width:' + pctComp + '%;background:#3A4B56"></i>' +
            '<i style="width:' + pctSel + '%;background:' + C.warn + '"></i>' +
            (pctOver > 0 ? '<i style="width:' + pctOver + '%;background:' + C.crit + '"></i>' : '') +
            '<i style="width:' + pctLibre + '%;background:transparent"></i>' +
          '</div>' +
          '<div class="cap__lbl"><span>0 h</span><span>' + v.horas + ' h</span></div>' +
          '<div class="legend" style="margin-top:6px">' +
            '<span><i style="background:#3A4B56"></i> ya comprometidas ' + n1(v.comprometidas) + ' h</span>' +
            '<span><i style="background:' + C.warn + '"></i> Cintavia ' + n1(horas) + ' h</span>' +
            (over ? '<span><i style="background:' + C.crit + '"></i> exceso ' + n1(horas - libres) + ' h</span>' : '') +
          '</div>' +

          (over
            ? '<div class="callout callout--crit mt-s"><p><strong>La ventana no da.</strong> Seleccionaste ' + n1(horas) +
              ' h y hay ' + n1(libres) + ' h libres. Saca ' + n1(horas - libres) + ' h o mueve la tarea de menor riesgo a ' +
              (f.ventanas.filter(function (w) { return w.id !== v.id; })[0] || {}).id + '. ' +
              'El planificador no te va a dejar emitir el aviso igual — te va a rebotar en SAP y vas a perder tres días.</p></div>'
            : horas > 0
              ? '<div class="callout mt-s"><p><strong>Cabe.</strong> ' + n1(horas) + ' h de ' + n1(libres) +
                ' h libres. Quedan ' + n1(libres - horas) + ' h de holgura.</p></div>'
              : '<div class="callout callout--cyan mt-s"><p>Selecciona hallazgos de la lista para ver si caben en la ventana.</p></div>') +

          '<div class="evi mt-s">' +
            '<div class="evi__row"><span>Riesgo cubierto por esta ventana</span><span style="color:' + C.ok + '">' + usd(riesgoCubierto) + '</span></div>' +
            '<div class="evi__row"><span>Riesgo que queda abierto</span><span style="color:' + (riesgoAbierto > 300000 ? C.crit : C.ink) + '">' + usd(riesgoAbierto) + '</span></div>' +
            '<div class="evi__row"><span>Costo de las ' + n1(horas) + ' h de trabajo</span><span>' + clp(hh) + ' <span class="dim">(' + Math.round(hhTot) + ' HH × $42.000)</span></span></div>' +
            '<div class="evi__row"><span>Margen de planta / hora</span><span>' + usd(margenHora(f)) + '</span></div>' +
          '</div>' +
          '<p class="src"><b>Cómo se calcula el riesgo.</b> Para cada hallazgo: costo si falla × probabilidad de que falle antes ' +
          'de la ventana. La probabilidad sale de la banda P10–P90 de vida remanente, con una log-normal. ' +
          'El costo sale del margen de contribución de la faena menos las horas de acopio vivo. ' +
          'Toda la aritmética está en <a href="../negocio.html#roi">negocio.html</a>.</p>' +
        '</div>' +

        '<div class="panel">' +
          '<div class="panel__head"><span class="panel__title">Aviso SAP PM generado</span>' +
          '<span class="panel__meta">' + sel.length + ' aviso' + (sel.length === 1 ? '' : 's') + '</span></div>' +
          '<div class="sap">' + esc(sapTxt) + '</div>' +
          '<button class="btn ' + (sel.length && !over ? 'btn--primary' : '') + '" id="btnSap"' +
            (sel.length && !over ? '' : ' disabled') +
            ' style="width:100%;margin-top:var(--sp-s)' + (sel.length && !over ? '' : ';opacity:.45;cursor:not-allowed') + '">' +
            'Emitir ' + sel.length + ' aviso' + (sel.length === 1 ? '' : 's') + ' a SAP PM</button>' +
        '</div>' +
      '</div>' +

      '<div class="panel">' +
        '<div class="panel__head"><span class="panel__title">Hallazgos candidatos</span>' +
        '<span class="panel__meta">umbral ' + n2(S.umbral) + '</span></div>' +
        (cand.length ? lista : '<p class="dim" style="font-size:var(--step--1)">Ningún hallazgo sobre el umbral.</p>') +
      '</div>' +
    '</div>';

  Array.prototype.forEach.call($('ventana').querySelectorAll('[data-vent]'), function (b) {
    b.addEventListener('click', function () { S.ventana = b.dataset.vent; renderAll(); });
  });
  Array.prototype.forEach.call($('ventana').querySelectorAll('[data-ot]'), function (cb) {
    cb.addEventListener('change', function () {
      if (cb.checked) S.incluidas[cb.dataset.ot] = true; else delete S.incluidas[cb.dataset.ot];
      renderVentana(); renderKpis();
    });
  });
  var bs = $('btnSap');
  if (bs && !bs.disabled) bs.addEventListener('click', function () {
    sel.forEach(function (a) { a.estado = 'ot'; });
    log(sel.length + ' aviso(s) emitido(s) a SAP PM · parada ' + v.id, 'ok', 'SAP');
    toast(sel.length + ' aviso(s) emitido(s). Repuestos reservados en MM.');
    renderAll();
  });
}

// ---- bitácora (tabla equivalente a todos los gráficos)
function renderBitacora() {
  var rows = A.filter(function (a) { return a.f === S.faena; }).map(function (a) {
    var v = ventana();
    var pf = a.p50 ? pFalla(a, v.dias) : null;
    var st = a.estado === 'descartada' ? 'Descartado (FP)'
           : a.estado === 'ot' ? 'OT ' + avisoNum(a)
           : a.estado === 'vigilar' ? 'En vigilancia' : 'Abierto';
    var vis = a.conf >= S.umbral && a.estado !== 'descartada';
    return '<tr style="' + (vis ? '' : 'opacity:.45') + '">' +
      '<td class="mono">' + a.id + '</td>' +
      '<td class="mono cyan">' + esc(a.tag) + '</td>' +
      '<td>' + esc(a.tipo) + '</td>' +
      '<td class="num-r">' + n2(a.conf) + '<br><span class="dim" style="font-size:0.66rem">' + n2(a.lo) + '–' + n2(a.hi) + '</span></td>' +
      '<td class="num-r">' + (a.p50 ? a.p50 + ' d<br><span class="dim" style="font-size:0.66rem">' + a.vlo + '–' + a.vhi + '</span>' : '—') + '</td>' +
      '<td class="num-r">' + (pf !== null ? pct(pf) : '—') + '</td>' +
      '<td class="num-r">' + (costoFalla(a) ? usd(costoFalla(a)) : '—') + '</td>' +
      '<td class="mono" style="font-size:0.7rem">' + st + '</td>' +
      '<td class="mono dim" style="font-size:0.7rem">' + (vis ? 'visible' : 'bajo umbral') + '</td>' +
      '</tr>';
  }).join('');
  $('tablaBit').innerHTML =
    '<thead><tr><th>ID</th><th>Equipo</th><th>Tipo</th><th class="num-r">Confianza</th>' +
    '<th class="num-r">Vida P50</th><th class="num-r">P(falla ' + S.ventana + ')</th>' +
    '<th class="num-r">Costo si falla</th><th>Estado</th><th>Umbral ' + n2(S.umbral) + '</th></tr></thead>' +
    '<tbody>' + rows + '</tbody>';
}

// ---- tabs
function goTab(t) {
  S.tab = t;
  ['sin', 'per', 'hal', 'ven', 'bit'].forEach(function (k) {
    var btn = $('tab-' + k), view = $('v-' + k);
    var on = k === t;
    btn.setAttribute('aria-selected', String(on));
    view.hidden = !on;
  });
  renderAll();
  if (t !== 'sin') window.scrollTo({ top: 0, behavior: 'auto' });
}

// ---- selectores
function renderCorreaSel() {
  var cs = faena().correas;
  if (!cs.some(function (c) { return c.tag === S.correa; })) S.correa = cs[1] ? cs[1].tag : cs[0].tag;
  $('selCorrea').innerHTML = cs.map(function (c) {
    return '<option value="' + c.tag + '"' + (c.tag === S.correa ? ' selected' : '') + '>' +
      c.tag + ' — ' + esc(c.desc) + ' (' + c.largo.toLocaleString('es-CL') + ' m)</option>';
  }).join('');
}

// ---- render maestro
function renderAll() {
  renderHmi();
  renderPR();
  var vis = visibles(null);
  var abiertas = vis.filter(function (a) { return a.estado === 'abierta'; }).length;
  $('tabBadge').textContent = String(abiertas);
  $('tabBadge').style.display = abiertas ? '' : 'none';

  var u = S.umbral, pr = prAt(u * 100);
  var total = A.filter(function (a) { return a.f === S.faena && a.estado !== 'descartada'; }).length;
  var fp = Math.round(vis.length * (1 - pr.p));
  var perdidas = Math.max(0, Math.round(vis.length / Math.max(pr.r, 0.05) - vis.length));
  $('umbralV').textContent = n2(u);
  $('umbralTxt').innerHTML =
    'Ves <b style="color:var(--ink)">' + vis.length + '</b> de ' + total + ' hallazgos · precisión esperada <b style="color:#C48400">' + n2(pr.p) +
    '</b> (≈' + fp + ' falso' + (fp === 1 ? '' : 's') + ') · recall <b style="color:#0E9EB4">' + n2(pr.r) +
    '</b> (se te ' + (perdidas === 1 ? 'escapa ≈1 real' : 'escapan ≈' + perdidas + ' reales') + ')';

  renderKpis();
  if (S.tab === 'sin') renderBelts();
  if (S.tab === 'per') renderPerfil();
  if (S.tab === 'hal') renderHallazgo();
  if (S.tab === 'ven') renderVentana();
  if (S.tab === 'bit') renderBitacora();
}

// ---------------------------------------------------------------- eventos
(function () {
  var t = $('navToggle'), n = $('nav');
  t.addEventListener('click', function () {
    var open = n.getAttribute('data-open') === 'true';
    n.setAttribute('data-open', String(!open));
    t.setAttribute('aria-expanded', String(!open));
  });
})();

['sin', 'per', 'hal', 'ven', 'bit'].forEach(function (k) {
  $('tab-' + k).addEventListener('click', function () { goTab(k); });
});

$('selFaena').addEventListener('change', function (e) {
  S.faena = e.target.value;
  S.incluidas = {};
  renderCorreaSel();
  var first = visibles(null)[0];
  S.sel = first ? first.id : null;
  log('Faena cambiada a ' + faena().nombre, 'ok', S.faena);
  renderAll();
});

$('selCorrea').addEventListener('change', function (e) {
  S.correa = e.target.value;
  renderAll();
});

$('umbral').addEventListener('input', function (e) {
  S.umbral = (+e.target.value) / 100;
  renderAll();
});

$('btnPlay').addEventListener('click', function () {
  S.playing = !S.playing;
  $('btnPlay').textContent = S.playing ? 'Pausar' : 'Reanudar';
  log(S.playing ? 'Bitácora en vivo reanudada' : 'Bitácora en vivo pausada', 'none', '');
});

// ---------------------------------------------------------------- arranque
var SEMILLA = [
  ['Pasada de inspección completa · 53 tramos evaluados', 'ok', 'EST-3410-06'],
  ['ΔT +47,2 °C sostenido · confianza 0,91', 'crit', 'PL-3410-2180-C'],
  ['Rotación no detectada en 4 de 6 pasadas', 'warn', 'PL-3410-0940-R'],
  ['Calidad óptica 0,71 — se programó limpieza de visor', 'none', 'EST-3410-03'],
  ['Borde de cinta 34 mm fuera de eje', 'warn', 'CV-3410'],
  ['Tonelaje 6.045 t/h · 93 % de nominal', 'ok', 'CV-3410'],
  ['Sincronizado con AVEVA PI · 41 tags', 'ok', 'PI-SRV-01']
];
SEMILLA.forEach(function (e) { log(e[0], e[1], e[2]); });

var TICKS = [
  ['Pasada de inspección · sin novedad', 'ok', 'EST-3410-08'],
  ['Firma acústica 3,2 kHz · +9 dB', 'warn', 'PL-3510-0118-C'],
  ['Tonelaje 6.180 t/h', 'ok', 'CV-3410'],
  ['Empalme evaluado · elongación 41 mm', 'warn', 'EMP-3410-03'],
  ['Temperatura de polea motriz 52 °C · normal', 'ok', 'CV-3420'],
  ['Pasada de inspección · sin novedad', 'ok', 'EST-3410-02'],
  ['Derrame bajo chute: +0,3 m³ en 24 h', 'warn', 'CT-3410-DESC'],
  ['Estación reporta visor limpio · calidad óptica 0,94', 'ok', 'EST-3410-03'],
  ['Corriente de motor +3,1 % en 11 días', 'warn', 'CV-2210']
];
var ti = 0;
setInterval(function () {
  if (!S.playing) return;
  var e = TICKS[ti % TICKS.length]; ti++;
  log(e[0], e[1], e[2]);
}, 6000);

setInterval(renderHmi, 1000);

renderCorreaSel();
renderAll();
