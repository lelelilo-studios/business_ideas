/* ============================================================
   TARIFANA · motor.js
   Motor tarifario DETERMINISTA. Aquí no hay IA: toda cifra que ve
   el usuario sale de estas funciones, con el pliego como dato.
   El pliego de abajo es REFERENCIAL para el demo (magnitudes
   plausibles BT 2026, declarado en stack.html); en producción se
   carga versionado desde los decretos tarifarios publicados.
   ============================================================ */

const PLIEGO = {
  version: "referencial demo · ene 2026",
  cargoFijo: 1421.3,          // $/mes
  energia: 114.82,            // $/kWh
  potPresente: 11483.7,       // BT2 pot. contratada / BT3 dda. leída, presente en punta ($/kW/mes)
  potParcial: 7655.8,         // ídem, parcialmente presente en punta
  ddaPunta: 10914.2,          // BT4.x demanda de punta ($/kW/mes)
  ddaFuera: 3412.5,           // BT4.x demanda fuera de punta / leída ($/kW/mes)
  fpUmbral: 0.93,             // bajo esto, recargo 1% por centésima
  mesesPunta: [3, 4, 5, 6, 7, 8] // abr..sep (índice 0 = enero)
};

const OPCIONES = ["BT2", "BT3", "BT4.1", "BT4.2", "BT4.3"];

function fmtCLP(n) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency", currency: "CLP", maximumFractionDigits: 0
  }).format(Math.round(n));
}
function fmtKW(n) { return n.toLocaleString("es-CL", { minimumFractionDigits: 1, maximumFractionDigits: 1 }); }
function fmtKWH(n) { return Math.round(n).toLocaleString("es-CL"); }

/* Calificación BT2/BT3: presente en punta si la demanda en punta
   alcanza el 50% de la máxima (proxy sobre máximas; simplificación
   declarada en stack.html). */
function calificacion(perfil) {
  const maxLe = Math.max(...perfil.map(m => m.dLeida));
  const maxPu = Math.max(...perfil.map(m => m.dPunta));
  return (maxPu / maxLe) >= 0.5 ? "presente" : "parcial";
}

/* Demanda de punta BT4.3: promedio de las dos mayores demandas en
   horas de punta registradas en meses de punta, aplicado todo el año. */
function demandaPunta43(perfil) {
  const enPunta = perfil
    .filter(m => PLIEGO.mesesPunta.includes(m.mesIdx))
    .map(m => m.dPunta)
    .sort((a, b) => b - a);
  return (enPunta[0] + enPunta[1]) / 2;
}

function recargoFP(fp, base) {
  if (fp >= PLIEGO.fpUmbral) return 0;
  const cent = Math.round((PLIEGO.fpUmbral - fp) * 100);
  return base * 0.01 * cent;
}

/* Costo de UN mes bajo una opción. params:
   { ctrPunta, ctrFuera, fpFijo } (fpFijo: number|null simula banco de condensadores) */
function costoMes(opcion, mes, perfil, params) {
  const p = params || {};
  const energia = mes.kwh * PLIEGO.energia;
  const calif = calificacion(perfil);
  const precioCalif = calif === "presente" ? PLIEGO.potPresente : PLIEGO.potParcial;
  let potencia = 0;
  const maxLe = Math.max(...perfil.map(m => m.dLeida));

  if (opcion === "BT2") {
    potencia = (p.ctrFuera || Math.ceil(maxLe)) * precioCalif;
  } else if (opcion === "BT3") {
    potencia = mes.dLeida * precioCalif;
  } else if (opcion === "BT4.1") {
    potencia = (p.ctrPunta || 0) * PLIEGO.ddaPunta + (p.ctrFuera || Math.ceil(maxLe)) * PLIEGO.ddaFuera;
  } else if (opcion === "BT4.2") {
    potencia = (p.ctrPunta || 0) * PLIEGO.ddaPunta + mes.dLeida * PLIEGO.ddaFuera;
  } else if (opcion === "BT4.3") {
    potencia = demandaPunta43(perfil) * PLIEGO.ddaPunta + mes.dLeida * PLIEGO.ddaFuera;
  }

  const fp = (p.fpFijo != null) ? p.fpFijo : mes.fp;
  const reactiva = recargoFP(fp, energia + potencia);
  /* Exceso sobre potencia contratada de punta: la demanda leída no puede
     superar lo contratado sin recargo (simplificación: exceso a 2x). */
  let exceso = 0;
  if ((opcion === "BT4.1" || opcion === "BT4.2") && p.ctrPunta && mes.dPunta > p.ctrPunta) {
    exceso = (mes.dPunta - p.ctrPunta) * PLIEGO.ddaPunta * 2;
  }
  const total = PLIEGO.cargoFijo + energia + potencia + reactiva + exceso;
  return { fijo: PLIEGO.cargoFijo, energia, potencia, reactiva, exceso, total, calif };
}

/* Costo de los 12 meses del perfil bajo una opción. */
function costoAnual(opcion, perfil, params) {
  const acc = { fijo: 0, energia: 0, potencia: 0, reactiva: 0, exceso: 0, total: 0 };
  perfil.forEach(mes => {
    const c = costoMes(opcion, mes, perfil, params);
    acc.fijo += c.fijo; acc.energia += c.energia; acc.potencia += c.potencia;
    acc.reactiva += c.reactiva; acc.exceso += c.exceso; acc.total += c.total;
  });
  return acc;
}

/* Simula todas las opciones y ordena de menor a mayor costo anual. */
function simularTodas(perfil, paramsPorOpcion) {
  return OPCIONES.map(op => {
    const params = (paramsPorOpcion && paramsPorOpcion[op]) || {};
    return { opcion: op, params, ...costoAnual(op, perfil, params) };
  }).sort((a, b) => a.total - b.total);
}
