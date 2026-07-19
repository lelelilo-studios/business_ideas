/* TARIFANA · sitio.js: navegación + widget de la landing. */

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

/* ---- Widget "revisa un perfil" (usa motor.js si está cargado) ---- */
(function () {
  const cont = document.querySelector("[data-widget]");
  if (!cont || typeof simularTodas !== "function") return;

  function perfilPlano(kwh, dLeida, dPunta, fp) {
    return Array.from({ length: 12 }, (_, i) => ({
      mesIdx: i, kwh, dLeida, dPunta: dPunta * (PLIEGO.mesesPunta.includes(i) ? 1 : 0.97), fp
    }));
  }

  const PERFILES = {
    panaderia: {
      nombre: "Panadería industrial",
      detalle: "Hornos de madrugada y frío 24 h · 38.600 kWh/mes",
      opcionActual: "BT4.2",
      params: { "BT4.2": { ctrPunta: 95 }, "BT4.1": { ctrPunta: 65, ctrFuera: 92 }, "BT2": { ctrFuera: 92 } },
      perfil: [
        { mesIdx: 6, kwh: 39480, dLeida: 89.6, dPunta: 60.2, fp: 0.90 },
        { mesIdx: 7, kwh: 40120, dLeida: 90.4, dPunta: 61.8, fp: 0.89 },
        { mesIdx: 8, kwh: 38910, dLeida: 88.1, dPunta: 59.4, fp: 0.89 },
        { mesIdx: 9, kwh: 37240, dLeida: 86.9, dPunta: 56.1, fp: 0.90 },
        { mesIdx: 10, kwh: 36110, dLeida: 85.2, dPunta: 54.7, fp: 0.91 },
        { mesIdx: 11, kwh: 37820, dLeida: 87.4, dPunta: 55.9, fp: 0.90 },
        { mesIdx: 0, kwh: 36540, dLeida: 86.1, dPunta: 53.8, fp: 0.88 },
        { mesIdx: 1, kwh: 35980, dLeida: 85.8, dPunta: 54.2, fp: 0.88 },
        { mesIdx: 2, kwh: 36890, dLeida: 87.0, dPunta: 55.6, fp: 0.89 },
        { mesIdx: 3, kwh: 38350, dLeida: 88.6, dPunta: 58.3, fp: 0.90 },
        { mesIdx: 4, kwh: 39060, dLeida: 89.1, dPunta: 59.7, fp: 0.89 },
        { mesIdx: 5, kwh: 38640, dLeida: 88.2, dPunta: 57.9, fp: 0.89 }
      ]
    },
    frigorifico: {
      nombre: "Frigorífico",
      detalle: "Cámaras de frío parejas todo el día · 30.200 kWh/mes",
      opcionActual: "BT2",
      params: { "BT2": { ctrFuera: 90 }, "BT4.2": { ctrPunta: 70 }, "BT4.1": { ctrPunta: 70, ctrFuera: 72 } },
      perfil: perfilPlano(30240, 70.0, 68.0, 0.92)
    },
    taller: {
      nombre: "Taller metalmecánico",
      detalle: "Turno de 8 a 18 h, casi nada en punta · 21.800 kWh/mes",
      opcionActual: "BT4.3",
      params: { "BT4.2": { ctrPunta: 20 }, "BT4.1": { ctrPunta: 20, ctrFuera: 76 }, "BT2": { ctrFuera: 76 } },
      perfil: perfilPlano(21800, 75.0, 18.0, 0.94)
    }
  };

  const salida = cont.querySelector("[data-widget-salida]");
  const botones = cont.querySelectorAll("[data-perfil]");

  function pintar(clave) {
    const p = PERFILES[clave];
    const filas = simularTodas(p.perfil, p.params);
    const actual = filas.find(f => f.opcion === p.opcionActual);
    const mejor = filas[0];
    const ahorroAnual = actual.total - mejor.total;
    const enOrden = mejor.opcion === p.opcionActual || ahorroAnual < actual.total * 0.005;

    let veredicto;
    if (enOrden) {
      veredicto = `<p class="widget-veredicto widget-ok">
        <span class="sello sello-ok">todo en orden</span>
        Tu opción actual (${p.opcionActual}) es la más barata para este perfil.
        Ese veredicto también vale plata: significa que nadie te está cobrando de más.</p>`;
    } else {
      veredicto = `<p class="widget-veredicto">
        <span class="sello">hallazgo</span>
        Cambiando de ${p.opcionActual} a <strong>${mejor.opcion}</strong> este perfil paga
        <strong class="mono">${fmtCLP(ahorroAnual)}</strong> menos al año
        (<span class="mono">${fmtCLP(ahorroAnual / 12)}</span> al mes). La solicitud de cambio
        es una carta que la distribuidora está obligada a aceptar.</p>`;
    }

    salida.innerHTML = `
      <p class="dato-etq">${p.nombre} · ${p.detalle} · hoy en ${p.opcionActual}</p>
      <div class="widget-cifras">
        <div><span class="dato-etq">Paga hoy (año)</span>
          <span class="num-grande">${fmtCLP(actual.total)}</span></div>
        <div><span class="dato-etq">Con la mejor opción (${mejor.opcion})</span>
          <span class="num-grande">${fmtCLP(mejor.total)}</span></div>
      </div>
      ${veredicto}`;

    botones.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.perfil === clave)));
  }

  botones.forEach(b => b.addEventListener("click", () => pintar(b.dataset.perfil)));
  pintar("panaderia");
})();
