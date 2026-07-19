/* Etiquaria, demo.js: interfaz del verificador.
   Todo el estado vive en el cliente. Las reglas están en motor.js;
   aquí sólo hay dibujo y wiring. */

(function () {
  "use strict";

  /* ---------------- Estado ---------------- */
  const estado = {
    productoId: "granola",
    valores: {},        // energia, azucares, gsat, sodio (editables)
    anadidos: true,
    envaseId: null,
    simClave: "azucares",
    simReduccion: 0,
    libros: {},         // copia mutable del libro por producto
  };

  const RANGOS = {
    solido:  { energia: [0, 600, 1], azucares: [0, 60, 0.5], gsat: [0, 30, 0.1], sodio: [0, 800, 5] },
    liquido: { energia: [0, 150, 1], azucares: [0, 30, 0.5], gsat: [0, 10, 0.1], sodio: [0, 300, 5] },
  };

  const NOMBRES_CAMPO = {
    energia: "Energía", azucares: "Azúcares totales",
    gsat: "Grasas saturadas", sodio: "Sodio",
  };

  /* ---------------- Utilidades SVG ---------------- */
  function octPuntos(x, y, s) {
    const k = 0.2929 * s;
    return `M${x + k} ${y}H${x + s - k}L${x + s} ${y + k}V${y + s - k}L${x + s - k} ${y + s}H${x + k}L${x} ${y + s - k}V${y + k}Z`;
  }

  /** Sello octogonal como fragmento SVG. s = lado en unidades del viewBox. */
  function selloFrag(x, y, s, lineas) {
    const borde = s * 0.04;
    let t = `<path d="${octPuntos(x, y, s)}" fill="#0b0b0c"/>`;
    t += `<path d="${octPuntos(x + borde, y + borde, s - 2 * borde)}" fill="none" stroke="#fff" stroke-width="${(s * 0.022).toFixed(2)}"/>`;
    const cx = x + s / 2;
    const ff = `font-family="Sora, sans-serif" fill="#fff" text-anchor="middle"`;
    if (lineas.length === 1) {
      const fsNombre = lineas[0].length > 6 ? s * 0.125 : s * 0.16;
      t += `<text x="${cx}" y="${y + s * 0.43}" ${ff} font-weight="800" font-size="${(s * 0.125).toFixed(2)}">ALTO EN</text>`;
      t += `<text x="${cx}" y="${y + s * 0.61}" ${ff} font-weight="800" font-size="${fsNombre.toFixed(2)}">${lineas[0]}</text>`;
    } else {
      t += `<text x="${cx}" y="${y + s * 0.36}" ${ff} font-weight="800" font-size="${(s * 0.115).toFixed(2)}">ALTO EN</text>`;
      t += `<text x="${cx}" y="${y + s * 0.52}" ${ff} font-weight="800" font-size="${(s * 0.11).toFixed(2)}">${lineas[0]}</text>`;
      t += `<text x="${cx}" y="${y + s * 0.66}" ${ff} font-weight="800" font-size="${(s * 0.098).toFixed(2)}">${lineas[1]}</text>`;
    }
    t += `<text x="${cx}" y="${y + s * 0.82}" ${ff} font-size="${(s * 0.062).toFixed(2)}">Ministerio de Salud</text>`;
    return t;
  }

  /* ---------------- Referencias DOM ---------------- */
  const $ = (id) => document.getElementById(id);
  const chipsProducto = $("chipsProducto");
  const chipsEnvase = $("chipsEnvase");

  function prod() { return PRODUCTOS[estado.productoId]; }

  /* ---------------- Carga de producto ---------------- */
  function cargarProducto(id) {
    estado.productoId = id;
    const p = prod();
    estado.valores = {
      energia: p.lab.energia, azucares: p.lab.azucares,
      gsat: p.lab.gsat, sodio: p.lab.sodio,
    };
    estado.anadidos = p.anadidos;
    estado.envaseId = p.envases[0].id;
    if (!estado.libros[id]) estado.libros[id] = p.libro.slice();
    const v = evaluarSellos(p.estado, estado.valores, estado.anadidos);
    const conCosto = v.find((x) => x.lleva && p.receta.ingredientes[x.clave]);
    const activo = conCosto || v.find((x) => x.lleva);
    estado.simClave = activo ? activo.clave : "azucares";
    estado.simReduccion = 0;
    construirSliders();
    renderTodo();
  }

  /* ---------------- Chips ---------------- */
  function renderChipsProducto() {
    chipsProducto.innerHTML = "";
    Object.keys(PRODUCTOS).forEach((id) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = PRODUCTOS[id].nombre;
      b.setAttribute("aria-pressed", id === estado.productoId ? "true" : "false");
      b.addEventListener("click", () => { cargarProducto(id); renderChipsProducto(); });
      chipsProducto.appendChild(b);
    });
  }

  function renderChipsEnvase() {
    const p = prod();
    chipsEnvase.innerHTML = "";
    p.envases.forEach((e) => {
      const sup = e.ancho * e.alto;
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.innerHTML = `${e.nombre} <span class="mono" style="font-size:.7rem; opacity:.75">${e.ancho}×${e.alto} cm</span>`;
      b.setAttribute("aria-pressed", e.id === estado.envaseId ? "true" : "false");
      b.title = `Cara principal: ${numCl(sup, 1)} cm²`;
      b.addEventListener("click", () => { estado.envaseId = e.id; renderChipsEnvase(); renderEtiqueta(); });
      chipsEnvase.appendChild(b);
    });
  }

  /* ---------------- Sliders del informe ---------------- */
  function construirSliders() {
    const p = prod();
    const cont = $("sliders");
    cont.innerHTML = "";
    const rangos = RANGOS[p.estado];
    const unidadBase = p.estado === "solido" ? "100 g" : "100 ml";
    $("basePor").textContent = unidadBase;
    $("anadidosTexto").textContent = p.anadidosTexto;
    $("chkAnadidos").checked = estado.anadidos;

    DESCRIPTORES.forEach((d) => {
      const [min, max, paso] = rangos[d.clave];
      const unidad = d.unidad[p.estado];
      const div = document.createElement("div");
      div.className = "campo";
      div.innerHTML =
        `<label for="sl_${d.clave}">${NOMBRES_CAMPO[d.clave]}: ` +
        `<span class="valor"><span id="v_${d.clave}"></span> ${unidad}</span></label>` +
        `<input type="range" id="sl_${d.clave}" min="${min}" max="${max}" step="${paso}">`;
      cont.appendChild(div);
      const sl = div.querySelector("input");
      sl.value = estado.valores[d.clave];
      sl.addEventListener("input", () => {
        estado.valores[d.clave] = parseFloat(sl.value);
        renderTodo();
      });
    });
  }

  function refrescarValoresSliders() {
    DESCRIPTORES.forEach((d) => {
      const el = $("v_" + d.clave);
      if (el) el.textContent = numCl(estado.valores[d.clave], d.decimales);
      const sl = $("sl_" + d.clave);
      if (sl && parseFloat(sl.value) !== estado.valores[d.clave]) sl.value = estado.valores[d.clave];
    });
  }

  /* ---------------- Veredictos ---------------- */
  function renderVeredictos() {
    const p = prod();
    const veredictos = evaluarSellos(p.estado, estado.valores, estado.anadidos);
    const cont = $("veredictos");
    cont.innerHTML = "";

    const activos = veredictos.filter((v) => v.lleva);
    const res = $("resumen");
    if (!estado.anadidos) {
      res.innerHTML = `<span class="exento">EXENTO de sellos</span> <span class="nota" style="font-weight:400">· sin nutrientes críticos añadidos, el art. 120 bis no aplica</span>`;
    } else if (activos.length === 0) {
      res.innerHTML = `<span class="exento">0 de 4 sellos</span> <span class="nota" style="font-weight:400">· ningún descriptor supera su límite</span>`;
    } else {
      res.innerHTML = `LLEVA ${activos.length} de 4 sellos <span class="nota" style="font-weight:400">· ${activos.map((v) => v.sello.join(" ")).join(" · ")}</span>`;
    }

    veredictos.forEach((v) => {
      const div = document.createElement("div");
      div.className = "veredicto " + (v.lleva ? "lleva" : "libre");
      const svg = `<svg viewBox="0 0 100 100" role="img" aria-label="Sello ALTO EN ${v.sello.join(" ")} ${v.lleva ? "activo" : "inactivo"}">${selloFrag(0, 0, 100, v.sello)}</svg>`;
      let estadoTxt, margenTxt;
      if (v.exento) {
        estadoTxt = "No aplica";
        margenTxt = "sin adición del nutriente";
      } else if (v.lleva) {
        estadoTxt = "LLEVA sello";
        margenTxt = `${numCl(Math.abs(v.margen), v.decimales)} sobre el límite`;
      } else {
        estadoTxt = "No lleva";
        margenTxt = `a ${numCl(v.margen, v.decimales)} del límite`;
      }
      div.innerHTML =
        svg +
        `<div><p class="estado">${estadoTxt}</p>` +
        `<p class="datos">${numCl(v.valor, v.decimales)} / límite ${numCl(v.limite, v.decimales)} ${v.unidad} · ${margenTxt}</p>` +
        `<span class="cita-legal">${v.cita}</span></div>`;
      cont.appendChild(div);
    });
  }

  /* ---------------- Etiqueta ---------------- */
  function renderEtiqueta() {
    const p = prod();
    const envase = p.envases.find((e) => e.id === estado.envaseId);
    const sup = envase.ancho * envase.alto;
    const tam = tamanoSello(sup);
    const veredictos = evaluarSellos(p.estado, estado.valores, estado.anadidos);
    const activos = veredictos.filter((v) => v.lleva);

    const W = envase.ancho * 10, H = envase.alto * 10; // 1 cm = 10 unidades
    let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Cara principal del envase ${envase.nombre} con ${activos.length} sellos">`;
    svg += `<rect x="0" y="0" width="${W}" height="${H}" fill="#ffffff" stroke="#0d0d0f" stroke-width="${Math.max(0.8, W * 0.006)}"/>`;

    // Marca y nombre
    const fsMarca = Math.min(W * 0.085, H * 0.09);
    const fsNombre = fsMarca * 0.52;
    const margen = W * 0.07;
    svg += `<text x="${margen}" y="${H * 0.30}" font-family="Sora, sans-serif" font-weight="800" font-size="${fsMarca.toFixed(1)}" fill="#0d0d0f">${p.marca}</text>`;
    const partes = p.nombre.split(" ");
    const mitad = Math.ceil(partes.length / 2);
    svg += `<text x="${margen}" y="${H * 0.30 + fsNombre * 1.5}" font-family="Sora, sans-serif" font-weight="600" font-size="${fsNombre.toFixed(1)}" fill="#b0135c">${partes.slice(0, mitad).join(" ")}</text>`;
    svg += `<text x="${margen}" y="${H * 0.30 + fsNombre * 2.7}" font-family="Sora, sans-serif" font-weight="600" font-size="${fsNombre.toFixed(1)}" fill="#b0135c">${partes.slice(mitad).join(" ")}</text>`;
    svg += `<text x="${margen}" y="${H - H * 0.06}" font-family="JetBrains Mono, monospace" font-size="${(fsNombre * 0.8).toFixed(1)}" fill="#45454d">Cont. neto ${p.neto}</text>`;

    // Sellos: esquina superior derecha de la cara principal, de derecha a izquierda.
    if (tam.lado && activos.length > 0) {
      const lado = tam.lado * 10;
      const gap = 2, m = 5;
      activos.forEach((v, i) => {
        const x = W - m - (i + 1) * lado - i * gap;
        const y = m;
        if (x > 0) svg += selloFrag(x, y, lado, v.sello);
      });
    }
    svg += `</svg>`;
    $("lienzoEtiqueta").innerHTML = svg;

    // Anotación
    const anota = $("anotaSello");
    const supTxt = `${numCl(sup, 1)} cm² (${envase.ancho} × ${envase.alto} cm)`;
    if (!estado.anadidos || activos.length === 0) {
      anota.innerHTML = `Cara principal: <strong>${supTxt}</strong> · sin sellos que rotular. La declaración nutricional del art. 115 sigue siendo obligatoria.`;
    } else if (!tam.lado) {
      anota.innerHTML = `Cara principal: <strong>${supTxt}</strong> · ${tam.tramo} (según DS 13/2015; ver nota del motor). Las prohibiciones de la Ley 20.606 se mantienen aunque el símbolo no se imprima.`;
    } else {
      anota.innerHTML = `Cara principal: <strong>${supTxt}</strong> · tramo ${tam.tramo} → sello de <strong>${numCl(tam.lado, 1)} × ${numCl(tam.lado, 1)} cm</strong> cada uno, ${activos.length} ${activos.length === 1 ? "sello" : "sellos"} en la esquina superior derecha. Tabla de tamaños: DS 13/2015 (valores en verificación contra la tabla oficial).`;
    }
  }

  /* ---------------- Declaración ---------------- */
  function renderDeclaracion() {
    const p = prod();
    const d = declaracion(p, estado.valores);
    $("declBase").textContent = d.base;
    $("thBase").textContent = d.base;
    $("declPorcion").textContent = `Porción: ${p.porcion.texto} · ${p.porcion.porEnvase}`;
    const tbody = $("tablaDecl").querySelector("tbody");
    tbody.innerHTML = d.filas
      .map((f) => `<tr><td>${f.nombre}</td><td class="num">${f.v100}</td><td class="num">${f.vPorcion}</td></tr>`)
      .join("");
  }

  /* ---------------- Simulador ---------------- */
  function renderSimuladorControles() {
    const p = prod();
    const sel = $("simNutriente");
    const veredictos = evaluarSellos(p.estado, estado.valores, estado.anadidos);
    sel.innerHTML = "";
    veredictos.forEach((v) => {
      const op = document.createElement("option");
      op.value = v.clave;
      op.textContent = `${NOMBRES_CAMPO[v.clave]}: ${v.lleva ? "LLEVA sello" : "sin sello"}`;
      if (v.clave === estado.simClave) op.selected = true;
      sel.appendChild(op);
    });

    const d = DESCRIPTORES.find((x) => x.clave === estado.simClave);
    const sl = $("simReduccion");
    const actual = estado.valores[estado.simClave];
    sl.min = 0;
    sl.max = actual;
    sl.step = d.decimales === 0 ? 1 : 0.5;
    if (estado.simReduccion > actual) estado.simReduccion = 0;
    sl.value = estado.simReduccion;
    const unidad = d.unidad[p.estado];
    $("simReduccionValor").textContent = `${numCl(estado.simReduccion, d.decimales)} ${unidad.replace("/100", " por 100")}`;
  }

  function renderSimuladorResultado() {
    const p = prod();
    const clave = estado.simClave;
    const d = DESCRIPTORES.find((x) => x.clave === clave);
    const r = simular(p, estado.valores, clave, estado.simReduccion);
    const unidad = d.unidad[p.estado];
    const cont = $("simResultado");

    let html = "";
    if (!estado.anadidos) {
      html += `<p class="grande">Producto exento de sellos (sin nutrientes críticos añadidos): nada que soltar.</p>`;
      cont.innerHTML = html;
      return;
    }

    if (r.actual >= r.limite) {
      html += `<p class="grande">Para soltar el sello ${DESCRIPTORES.find(x=>x.clave===clave).sello.join(" ")}: baja al menos ${numCl(r.paraSoltar, d.decimales)} ${unidad.replace("/100", " por 100")}.</p>`;
    } else {
      html += `<p class="grande">Este descriptor ya está bajo el límite (${numCl(r.actual, d.decimales)} &lt; ${numCl(r.limite, d.decimales)} ${unidad}).</p>`;
    }
    html += `<p class="cifra nota">Con la reducción elegida: ${numCl(r.actual, d.decimales)} → ${numCl(r.nuevo, d.decimales)} ${unidad} · ${r.nuevo < r.limite ? "SIN sello" : "sigue LLEVANDO sello"} · ${r.cita}</p>`;

    if (clave === "energia") {
      html += `<p class="nota">La energía no se baja directo: baja ~4 kcal por gramo de azúcar y ~9 kcal por gramo de grasa que saques de la receta (estimación, factores de Atwater). Simula desde azúcares o grasas saturadas.</p>`;
    } else if (r.costo && estado.simReduccion > 0) {
      const c = r.costo;
      html += `<div class="sim-costo"><table>
        <tr><td>Lote de referencia</td><td>${numCl(c.loteKg, 0)} kg · ${numCl(c.unidades, 0)} unidades</td></tr>
        <tr><td>${c.ingrediente} que sale</td><td>${numCl(c.kgIngrediente, 1)} kg (${clp(c.ahorro)} de ahorro)</td></tr>
        <tr><td>Entra ${c.reemplazo}</td><td>${clp(c.costoReemplazo)}</td></tr>
        <tr class="total"><td>Costo de receta por lote</td><td>${c.deltaLote >= 0 ? "+" : ""}${clp(c.deltaLote)}</td></tr>
        <tr class="total"><td>Por unidad</td><td>${c.deltaUnidad >= 0 ? "+" : ""}${clp(c.deltaUnidad)}</td></tr>
      </table>
      <p class="nota" style="margin-top:8px">Supuesto: reemplazo 1:1 en masa; el impacto sensorial y de conservación no está modelado (estimación).</p></div>`;
    } else if (!r.costo && estado.simReduccion > 0) {
      html += `<p class="nota">Sin ingrediente mapeado para este descriptor en la receta de ejemplo: el costo no se simula.</p>`;
    } else {
      html += `<p class="nota">Mueve el control de reducción para ver el efecto en el costo de la receta.</p>`;
    }
    cont.innerHTML = html;
  }

  /* ---------------- Prohibiciones ---------------- */
  function renderProhibiciones() {
    const p = prod();
    const activos = evaluarSellos(p.estado, estado.valores, estado.anadidos).filter((v) => v.lleva);
    const zona = $("zonaProhibiciones");
    const lista = prohibiciones(activos.length);
    if (lista.length === 0) {
      zona.innerHTML = `<p class="sin-sellos">Sin sellos: este producto puede venderse en colegios y publicitarse sin las restricciones de la Ley 20.606.</p>`;
      return;
    }
    zona.innerHTML =
      `<ul class="prohibiciones lista-limpia">` +
      lista.map((x) => `<li><p>${x.texto}</p><span class="cita-legal">${x.cita}</span></li>`).join("") +
      `</ul>`;
  }

  /* ---------------- Libro ---------------- */
  function renderLibro() {
    const tbody = $("tablaLibro").querySelector("tbody");
    tbody.innerHTML = estado.libros[estado.productoId]
      .map((e) => `<tr><td class="mono" style="white-space:nowrap">${e.fecha}</td><td>${e.receta}</td><td>${e.detalle}</td><td class="mono" style="font-size:.72rem">${e.sellos}</td></tr>`)
      .join("");
  }

  function guardarVerificacion() {
    const p = prod();
    const activos = evaluarSellos(p.estado, estado.valores, estado.anadidos).filter((v) => v.lleva);
    const hoy = new Date();
    const fecha = [
      String(hoy.getDate()).padStart(2, "0"),
      String(hoy.getMonth() + 1).padStart(2, "0"),
      hoy.getFullYear(),
    ].join("-");
    const libro = estado.libros[estado.productoId];
    libro.unshift({
      fecha,
      receta: "v" + (libro.length + 1) + " (simulada)",
      detalle: `Verificación manual desde el demo · azúcares ${numCl(estado.valores.azucares, 1)} · sodio ${numCl(estado.valores.sodio, 0)}`,
      sellos: estado.anadidos && activos.length ? activos.map((v) => v.sello.join(" ")).join(" · ") : (estado.anadidos ? "SIN SELLOS" : "EXENTO"),
    });
    renderLibro();
    const ok = $("guardadoOk");
    ok.hidden = false;
    setTimeout(() => { ok.hidden = true; }, 2500);
  }

  /* ---------------- Render maestro ---------------- */
  function renderTodo() {
    const p = prod();
    $("fabricaInfo").textContent = `${p.razon} · RUT ${p.rut} · ${p.comuna} · informe con ${p.anadidosTexto}`;
    refrescarValoresSliders();
    renderVeredictos();
    renderChipsEnvase();
    renderEtiqueta();
    renderDeclaracion();
    renderSimuladorControles();
    renderSimuladorResultado();
    renderProhibiciones();
    renderLibro();
  }

  /* ---------------- Eventos globales ---------------- */
  $("chkAnadidos").addEventListener("change", (e) => {
    estado.anadidos = e.target.checked;
    renderTodo();
  });
  $("btnRestaurar").addEventListener("click", () => {
    const p = prod();
    estado.valores = { energia: p.lab.energia, azucares: p.lab.azucares, gsat: p.lab.gsat, sodio: p.lab.sodio };
    estado.anadidos = p.anadidos;
    construirSliders();
    renderTodo();
  });
  $("simNutriente").addEventListener("change", (e) => {
    estado.simClave = e.target.value;
    estado.simReduccion = 0;
    renderSimuladorControles();
    renderSimuladorResultado();
  });
  $("simReduccion").addEventListener("input", (e) => {
    estado.simReduccion = parseFloat(e.target.value);
    renderSimuladorControles();
    renderSimuladorResultado();
  });
  $("btnGuardar").addEventListener("click", guardarVerificacion);

  /* ---------------- Arranque ---------------- */
  renderChipsProducto();
  cargarProducto("granola");
})();
