/* TARIFANA · demo/app.js
   Todo el estado vive aquí, en el cliente. El motor (../motor.js) hace
   el 100% de la aritmética; este archivo solo orquesta y pinta. */

/* ---------- navegación móvil ---------- */
(function () {
  const btn = document.querySelector("[data-nav-btn]");
  const drawer = document.querySelector("[data-nav-drawer]");
  if (btn && drawer) {
    btn.addEventListener("click", () => {
      const abierto = drawer.classList.toggle("abierto");
      btn.setAttribute("aria-expanded", String(abierto));
    });
  }
})();

/* ---------- datos del cliente demo ---------- */
/* 12 meses reales de la Panificadora: jul 2025 .. jun 2026.
   mesIdx: 0 = enero (para identificar meses de punta abr..sep). */
const PERFIL = [
  { etq: "jul 2025", mesIdx: 6, kwh: 39480, dLeida: 89.6, dPunta: 60.2, fp: 0.90 },
  { etq: "ago 2025", mesIdx: 7, kwh: 40120, dLeida: 90.4, dPunta: 61.8, fp: 0.89 },
  { etq: "sep 2025", mesIdx: 8, kwh: 38910, dLeida: 88.1, dPunta: 59.4, fp: 0.89 },
  { etq: "oct 2025", mesIdx: 9, kwh: 37240, dLeida: 86.9, dPunta: 56.1, fp: 0.90 },
  { etq: "nov 2025", mesIdx: 10, kwh: 36110, dLeida: 85.2, dPunta: 54.7, fp: 0.91 },
  { etq: "dic 2025", mesIdx: 11, kwh: 37820, dLeida: 87.4, dPunta: 55.9, fp: 0.90 },
  { etq: "ene 2026", mesIdx: 0, kwh: 36540, dLeida: 86.1, dPunta: 53.8, fp: 0.88 },
  { etq: "feb 2026", mesIdx: 1, kwh: 35980, dLeida: 85.8, dPunta: 54.2, fp: 0.88 },
  { etq: "mar 2026", mesIdx: 2, kwh: 36890, dLeida: 87.0, dPunta: 55.6, fp: 0.89 },
  { etq: "abr 2026", mesIdx: 3, kwh: 38350, dLeida: 88.6, dPunta: 58.3, fp: 0.90 },
  { etq: "may 2026", mesIdx: 4, kwh: 39060, dLeida: 89.1, dPunta: 59.7, fp: 0.89 },
  { etq: "jun 2026", mesIdx: 5, kwh: 38640, dLeida: 88.2, dPunta: 57.9, fp: 0.89 }
];
const MES_ACTUAL = PERFIL[11];
const CTR_PUNTA_ACTUAL = 95;      // lo declarado en 2019
const CTR_FUERA = 92;             // para opciones con contratada fuera de punta
const OPCION_ACTUAL = "BT4.2";

const estado = {
  tab: "boleta",
  ctrPunta: CTR_PUNTA_ACTUAL,
  fpFix: false,
  seleccion: null               // opción abierta en el detalle del simulador
};

/* Costo anual de la situación real hoy (baseline fija: BT4.2 con 95 kW, fp real). */
const BASE_ACTUAL = costoAnual(OPCION_ACTUAL, PERFIL, { ctrPunta: CTR_PUNTA_ACTUAL });

function paramsSim() {
  const fp = estado.fpFix ? { fpFijo: 0.95 } : {};
  return {
    "BT2": { ctrFuera: CTR_FUERA, ...fp },
    "BT3": { ...fp },
    "BT4.1": { ctrPunta: estado.ctrPunta, ctrFuera: CTR_FUERA, ...fp },
    "BT4.2": { ctrPunta: estado.ctrPunta, ...fp },
    "BT4.3": { ...fp }
  };
}

const COMO_COBRA = {
  "BT2": "Potencia contratada única (92 kW), presente en punta",
  "BT3": "Demanda máxima leída cada mes, presente en punta",
  "BT4.1": "Punta contratada + fuera de punta contratada (92 kW)",
  "BT4.2": "Punta contratada + demanda máxima leída",
  "BT4.3": "Punta leída (promedio de las 2 mayores) + demanda máxima leída"
};

/* ---------- pestañas ---------- */
const tabs = document.querySelectorAll(".pestana");
tabs.forEach(t => t.addEventListener("click", () => activarTab(t.dataset.tab)));
function activarTab(clave) {
  estado.tab = clave;
  tabs.forEach(t => t.setAttribute("aria-selected", String(t.dataset.tab === clave)));
  document.querySelectorAll(".panel-tab").forEach(p => p.classList.add("oculto"));
  document.getElementById("panel-" + clave).classList.remove("oculto");
}

/* ---------- LA BOLETA ---------- */
function pintarBoleta() {
  const c = costoMes(OPCION_ACTUAL, MES_ACTUAL, PERFIL, { ctrPunta: CTR_PUNTA_ACTUAL });
  const lineas = [
    {
      concepto: "Cargo fijo",
      detalle: "administración del servicio",
      monto: c.fijo,
      explica: "Lo cobra toda opción tarifaria por igual. Aquí nunca hay ahorro posible: se revisa solo para cuadrar la boleta al peso."
    },
    {
      concepto: "Electricidad consumida",
      detalle: `38.640 kWh × $114,82`,
      monto: c.energia,
      explica: "La energía propiamente tal. El precio por kWh es el mismo en las cinco opciones BT de este suministro: la diferencia de plata casi nunca está aquí, está en cómo se cobra la potencia."
    },
    {
      concepto: "Demanda máxima leída",
      detalle: `88,2 kW × $3.412,5`,
      monto: c.potencia - CTR_PUNTA_ACTUAL * PLIEGO.ddaPunta,
      explica: "El mayor 'ancho de cañería' que usaste en el mes, medido por el medidor. Se paga por kW. Es razonable: refleja uso real."
    },
    {
      concepto: "Demanda de punta contratada",
      detalle: `95,0 kW × $10.914,2 · declarada en 2019`,
      monto: CTR_PUNTA_ACTUAL * PLIEGO.ddaPunta,
      marcada: true,
      sello: "aquí está la fuga",
      explica: "En BT4.2 pagas la punta que DECLARASTE, no la que usas. Tu máxima leída en horas de punta en 12 meses fue 61,8 kW: cada mes pagas más de 33 kW de aire. La opción BT4.3 cobra la punta leída. Ver el simulador."
    },
    {
      concepto: "Recargo por energía reactiva",
      detalle: "factor de potencia 0,89 (umbral 0,93)",
      monto: c.reactiva,
      marcada: true,
      sello: "evitable",
      explica: "Los motores y compresores 'ensucian' la red cuando el factor de potencia baja de 0,93, y el pliego lo recarga al 1% por centésima. Un banco de condensadores lo elimina. Es el hallazgo H-03."
    }
  ];

  const cont = document.getElementById("boleta-lineas");
  cont.innerHTML = lineas.map((l, i) => `
    <div class="linea-boleta expandible ${l.marcada ? "marcada" : ""}" role="button" tabindex="0"
         aria-expanded="false" data-linea="${i}">
      <span class="concepto">${l.concepto}
        ${l.sello ? `<span class="sello">${l.sello}</span>` : ""}
        <span class="detalle">${l.detalle}</span></span>
      <span class="monto">${fmtCLP(l.monto)}<br><span class="abre">explicar +</span></span>
      <div class="explica oculto">${l.explica}</div>
    </div>`).join("") + `
    <div class="linea-boleta total"><span class="concepto">Total reconstruido por el motor</span>
      <span class="monto">${fmtCLP(c.total)}</span></div>`;

  cont.querySelectorAll(".expandible").forEach(el => {
    const abrir = () => {
      const exp = el.querySelector(".explica");
      const abierto = exp.classList.toggle("oculto");
      el.setAttribute("aria-expanded", String(!abierto));
      el.querySelector(".abre").textContent = abierto ? "explicar +" : "cerrar";
    };
    el.addEventListener("click", abrir);
    el.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrir(); }
    });
  });

  document.getElementById("cuadratura").innerHTML = `
    <span class="sello sello-ok">cuadra al peso</span>
    <span>Total facturado por la distribuidora: <strong class="mono">${fmtCLP(c.total)}</strong>.
    La reconstrucción del motor coincide. Cuando no coincide, el caso pasa a revisión: así se cazan los errores de facturación.</span>`;
}

/* ---------- EL SIMULADOR ---------- */
function pintarSimulador() {
  const filas = simularTodas(PERFIL, paramsSim());
  const mejor = filas[0];
  if (!estado.seleccion) estado.seleccion = mejor.opcion;

  const cuerpo = document.getElementById("sim-cuerpo");
  cuerpo.innerHTML = filas.map(f => {
    const delta = f.total - BASE_ACTUAL.total;
    const esActual = f.opcion === OPCION_ACTUAL;
    const esMejor = f.opcion === mejor.opcion;
    const deltaTxt = Math.abs(delta) < 1 ? "=" :
      (delta < 0 ? "ahorra " + fmtCLP(-delta) : "+" + fmtCLP(delta));
    return `<tr class="radio-fila ${esMejor ? "fila-mejor" : ""}" data-op="${f.opcion}">
      <td><input type="radio" name="op-sim" value="${f.opcion}" id="radio-${f.opcion}"
        ${estado.seleccion === f.opcion ? "checked" : ""}
        aria-label="Ver detalle de ${f.opcion}"></td>
      <td><label for="radio-${f.opcion}" style="cursor:pointer;"><strong>${f.opcion}</strong>${esActual ? ' <span class="sello sello-rojo">tu opción hoy</span>' : ""}${esMejor ? ' <span class="sello">la mejor</span>' : ""}</label></td>
      <td>${COMO_COBRA[f.opcion]}</td>
      <td class="num tab-num">${fmtCLP(f.total)}</td>
      <td class="num tab-num">${deltaTxt}</td>
    </tr>`;
  }).join("");

  cuerpo.querySelectorAll("tr").forEach(tr => {
    tr.addEventListener("click", () => {
      estado.seleccion = tr.dataset.op;
      tr.querySelector("input").checked = true;
      pintarDetalleSim(filas);
      pintarCarta();
    });
  });

  const ahorro = BASE_ACTUAL.total - mejor.total;
  const placa = document.getElementById("sim-mejor");
  if (mejor.opcion === OPCION_ACTUAL && Math.abs(ahorro) < 1) {
    placa.innerHTML = `<strong>Veredicto: todo en orden.</strong> Tu opción actual es la más barata para tu perfil. Seguimos vigilando cada boleta.`;
  } else {
    placa.innerHTML = `<strong>Veredicto: hay hallazgo.</strong>
      La mejor opción para tu consumo real es <strong>${mejor.opcion}</strong>:
      <span class="mono" style="font-weight:600;">${fmtCLP(ahorro)}</span> menos al año que tu situación actual
      (${fmtCLP(ahorro / 12)} al mes). ${estado.fpFix ? "Incluye el efecto del banco de condensadores simulado." : ""}
      La carta de cambio está en la pestaña siguiente.`;
  }

  pintarDetalleSim(filas);
}

function pintarDetalleSim(filas) {
  const f = filas.find(x => x.opcion === estado.seleccion) || filas[0];
  const params = paramsSim()[f.opcion];
  const cm = costoMes(f.opcion, MES_ACTUAL, PERFIL, params);
  const det = document.getElementById("sim-detalle");
  const califTxt = (f.opcion === "BT2" || f.opcion === "BT3")
    ? `<p class="nota" style="margin-top:.5rem;">Calificación del cliente: <strong>${cm.calif === "presente" ? "presente en punta" : "parcialmente presente en punta"}</strong> (la punta llega al ${Math.round(100 * Math.max(...PERFIL.map(m => m.dPunta)) / Math.max(...PERFIL.map(m => m.dLeida)))}% de la máxima).</p>` : "";
  det.innerHTML = `
    <h3>Así se vería junio 2026 en ${f.opcion}</h3>
    <div class="scroll-x" style="margin-top:var(--sp-s);">
    <table>
      <tbody>
        <tr><td>Cargo fijo</td><td class="num tab-num">${fmtCLP(cm.fijo)}</td></tr>
        <tr><td>Energía (38.640 kWh)</td><td class="num tab-num">${fmtCLP(cm.energia)}</td></tr>
        <tr><td>Potencia / demanda</td><td class="num tab-num">${fmtCLP(cm.potencia)}</td></tr>
        <tr><td>Recargo reactiva${estado.fpFix ? " (fp 0,95 simulado)" : " (fp 0,89)"}</td><td class="num tab-num">${fmtCLP(cm.reactiva)}</td></tr>
        ${cm.exceso > 0 ? `<tr><td>Exceso sobre punta contratada (recargado)</td><td class="num tab-num">${fmtCLP(cm.exceso)}</td></tr>` : ""}
        <tr style="font-weight:700; border-top:2px solid var(--tinta);"><td>Total del mes</td><td class="num tab-num">${fmtCLP(cm.total)}</td></tr>
      </tbody>
    </table>
    </div>
    ${califTxt}`;
}

const slider = document.getElementById("slider-punta");
slider.addEventListener("input", () => {
  estado.ctrPunta = Number(slider.value);
  document.getElementById("out-punta").textContent = slider.value + " kW";
  pintarSimulador();
  pintarCarta();
});
document.getElementById("check-fp").addEventListener("change", e => {
  estado.fpFix = e.target.checked;
  pintarSimulador();
  pintarCarta();
});

/* ---------- HALLAZGOS ---------- */
function pintarHallazgos() {
  const ahorroMes = (CTR_PUNTA_ACTUAL - demandaPunta43(PERFIL)) * PLIEGO.ddaPunta;
  document.getElementById("h1-ahorro").textContent = fmtCLP(ahorroMes) + "/mes";
  const reactivaAnual = costoAnual("BT4.3", PERFIL, {}).reactiva;
  document.getElementById("h3-recargo").textContent = fmtCLP(reactivaAnual);
  document.getElementById("h3-payback").textContent =
    (2890000 / (reactivaAnual / 12)).toLocaleString("es-CL", { maximumFractionDigits: 1 });
  document.querySelectorAll("[data-ir-carta]").forEach(b =>
    b.addEventListener("click", () => activarTab("carta")));
}

/* ---------- LA CARTA ---------- */
function pintarCarta() {
  const filas = simularTodas(PERFIL, paramsSim());
  const mejor = filas[0];
  const objetivo = mejor.opcion === OPCION_ACTUAL ? "BT4.3" : mejor.opcion;
  const maxPunta = Math.max(...PERFIL.map(m => m.dPunta));

  const texto = `Cerrillos, 12 de noviembre de 2025

Señores
Enel Distribución Chile S.A.
Oficina de atención de clientes
Presente

REF.: Solicitud de cambio de opción tarifaria
N° de cliente: 45.218.907-3

De nuestra consideración:

Panificadora Alto Maipo SpA, RUT 76.842.135-6, titular del
suministro eléctrico ubicado en Av. Los Cerrillos 1240, comuna de
Cerrillos, viene en solicitar el cambio de la opción tarifaria del
suministro individualizado, actualmente ${OPCION_ACTUAL}, a la opción
tarifaria ${objetivo}, en ejercicio del derecho de libre elección de
opción tarifaria que asiste a los clientes sometidos a regulación de
precios, conforme al reglamento y al decreto tarifario vigentes.

Solicitamos que el cambio rija a partir del próximo ciclo de
facturación, en el entendido de la permanencia mínima de doce meses
en la opción elegida.

Antecedentes técnicos que fundan la solicitud:
  1. Demanda máxima leída en horas de punta, últimos 12 meses:
     ${fmtKW(maxPunta)} kW.
  2. Potencia de punta actualmente contratada: ${fmtKW(CTR_PUNTA_ACTUAL)} kW.
  3. Diferencia facturada mensualmente sin uso efectivo:
     ${fmtKW(CTR_PUNTA_ACTUAL - maxPunta)} kW.

Agradeceremos confirmar por escrito la recepción de esta solicitud
y la fecha de aplicación del cambio.

Saluda atentamente a ustedes,



_____________________________
Representante legal
Panificadora Alto Maipo SpA
RUT 76.842.135-6`;

  document.getElementById("carta-texto").textContent = texto;
  document.getElementById("btn-descargar").href =
    "data:text/plain;charset=utf-8," + encodeURIComponent(texto);
}

document.getElementById("btn-copiar").addEventListener("click", async () => {
  const texto = document.getElementById("carta-texto").textContent;
  const aviso = document.getElementById("copiado-aviso");
  try {
    await navigator.clipboard.writeText(texto);
    aviso.textContent = "Copiado al portapapeles.";
  } catch {
    aviso.textContent = "Tu navegador bloqueó el copiado: usa Descargar .txt.";
  }
  setTimeout(() => { aviso.textContent = ""; }, 3500);
});

/* ---------- EL LIBRO ---------- */
function pintarLibro() {
  const ahorroMes = (CTR_PUNTA_ACTUAL - demandaPunta43(PERFIL)) * PLIEGO.ddaPunta;
  const calculoCambio = `(95,0 kW contratados - 61,0 kW de punta leída BT4.3) × $10.914,2/kW = ${fmtCLP(ahorroMes)}`;
  const filas = [
    { mes: "nov 2025", veredicto: "Hallazgo H-01", accion: "Carta de cambio a BT4.3 enviada el 12-11", ahorro: 0, calc: "El ahorro se anota cuando aparece en la boleta, no cuando se envía la carta." },
    { mes: "dic 2025", veredicto: "Cambio aplicado", accion: "Primera boleta en BT4.3", ahorro: ahorroMes, calc: calculoCambio },
    { mes: "ene 2026", veredicto: "Todo en orden", accion: "Vigilancia mensual", ahorro: ahorroMes, calc: calculoCambio },
    { mes: "feb 2026", veredicto: "Hallazgo H-02", accion: "Reclamo por lecturas estimadas ingresado el 05-03", ahorro: ahorroMes, calc: calculoCambio },
    { mes: "mar 2026", veredicto: "Refacturación", accion: "Devolución de la distribuidora en boleta", ahorro: ahorroMes + 412680, calc: calculoCambio + " + refacturación verificada $412.680" },
    { mes: "abr 2026", veredicto: "Todo en orden", accion: "Vigilancia mensual", ahorro: ahorroMes, calc: calculoCambio },
    { mes: "may 2026", veredicto: "Hallazgo H-03", accion: "Recomendación: banco de condensadores (sin variable)", ahorro: ahorroMes, calc: calculoCambio },
    { mes: "jun 2026", veredicto: "Todo en orden", accion: "Vigilancia mensual", ahorro: ahorroMes, calc: calculoCambio }
  ];

  let acum = 0;
  const cuerpo = document.getElementById("libro-cuerpo");
  cuerpo.innerHTML = filas.map((f, i) => {
    acum += f.ahorro;
    return `<tr>
      <td class="mono" style="white-space:nowrap;">${f.mes}</td>
      <td>${f.veredicto}</td>
      <td>${f.accion}<br><button class="ver-calculo" type="button" data-calc="${i}" aria-expanded="false">ver cálculo</button>
        <div class="calculo oculto" id="calc-${i}">${f.calc}</div></td>
      <td class="num tab-num">${f.ahorro ? fmtCLP(f.ahorro) : "$0"}</td>
      <td class="num tab-num">${fmtCLP(acum)}</td>
    </tr>`;
  }).join("");

  cuerpo.querySelectorAll(".ver-calculo").forEach(b => {
    b.addEventListener("click", () => {
      const caja = document.getElementById("calc-" + b.dataset.calc);
      const abierto = caja.classList.toggle("oculto");
      b.setAttribute("aria-expanded", String(!abierto));
      b.textContent = abierto ? "ver cálculo" : "cerrar cálculo";
    });
  });

  document.getElementById("libro-total").textContent = fmtCLP(acum);
  document.getElementById("libro-fee").textContent = fmtCLP(acum * 0.2);
  document.getElementById("libro-neto").textContent = fmtCLP(acum * 0.8);
}

/* ---------- arranque ---------- */
pintarBoleta();
pintarSimulador();
pintarHallazgos();
pintarCarta();
pintarLibro();

/* enlace profundo: demo/index.html#sim, #carta, #libro, #hallazgos */
const hashTab = location.hash.replace("#", "");
if (["boleta", "sim", "hallazgos", "carta", "libro"].includes(hashTab)) activarTab(hashTab);
