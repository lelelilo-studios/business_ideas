/* ============================================================================
   KILONAUTA — motor de tarifas (mock, pero con la forma del real)
   ----------------------------------------------------------------------------
   Qué es real acá y qué no (el detalle honesto está en stack.html):

   REAL: la ESTRUCTURA del precio. Los couriers chilenos cotizan igual:
     precio = base(zona) + $/kg × (peso_facturable − 1kg)
     peso_facturable = max(peso_real, (L×A×H)/4000) redondeado al medio kilo
     hacia arriba. El divisor 4000 es el de carga terrestre.

   MOCK: los valores de base y $/kg. Están calibrados para que el ORDEN y la
   DISPERSIÓN entre couriers se parezcan a la realidad chilena de 2025-2026:
     · En la RM la diferencia entre couriers es de centavos. No hay negocio ahí.
     · Al sur, Starken (red de buses) muerde barato.
     · En zona extrema, Correos de Chile es dramáticamente más barato porque
       tiene obligación de servicio universal, y es a veces el único que llega.
     · Chilexpress es el más caro casi siempre, y es el que todos usan por
       inercia. Ése es el arbitraje.
   Sin contrato mayorista firmado, ningún número acá es una oferta.
   ========================================================================== */

const KN = (() => {
  'use strict';

  /* --- zonas -------------------------------------------------------------- */
  const ZONAS = {
    z1: 'Metropolitana',
    z2: 'Centro',
    z3: 'Sur',
    z4: 'Norte',
    z5: 'Zona extrema',
  };

  /* Comunas reales de Chile.
     zona   = tramo tarifario base.
     factor = recargo/descuento del destino DENTRO de su zona. Es lo que hace que
              Castro (barcaza a Chiloé) no cueste lo mismo que Punta Arenas, y que
              Puerto Williams —al otro lado del canal Beagle, sólo aire y mar— sea
              la comuna más cara de Chile para recibir un paquete. */
  const DESTINOS = [
    { id: 'nunoa',      comuna: 'Ñuñoa',            region: 'RM',                zona: 'z1', factor: 1.00 },
    { id: 'maipu',      comuna: 'Maipú',            region: 'RM',                zona: 'z1', factor: 1.00 },
    { id: 'puentealto', comuna: 'Puente Alto',      region: 'RM',                zona: 'z1', factor: 1.06 },
    { id: 'vina',       comuna: 'Viña del Mar',     region: 'Valparaíso',        zona: 'z2', factor: 0.94 },
    { id: 'rancagua',   comuna: 'Rancagua',         region: "O'Higgins",         zona: 'z2', factor: 0.90 },
    { id: 'talca',      comuna: 'Talca',            region: 'Maule',             zona: 'z2', factor: 1.00 },
    { id: 'chiguayante',comuna: 'Chiguayante',      region: 'Biobío',            zona: 'z3', factor: 0.92 },
    { id: 'villarrica', comuna: 'Villarrica',       region: 'La Araucanía',      zona: 'z3', factor: 1.04 },
    { id: 'valdivia',   comuna: 'Valdivia',         region: 'Los Ríos',          zona: 'z3', factor: 1.00 },
    { id: 'puertomontt',comuna: 'Puerto Montt',     region: 'Los Lagos',         zona: 'z3', factor: 1.06 },
    { id: 'castro',     comuna: 'Castro',           region: 'Los Lagos (Chiloé)',zona: 'z5', factor: 0.62 },
    { id: 'laserena',   comuna: 'La Serena',        region: 'Coquimbo',          zona: 'z4', factor: 0.86 },
    { id: 'antofagasta',comuna: 'Antofagasta',      region: 'Antofagasta',       zona: 'z4', factor: 1.00 },
    { id: 'calama',     comuna: 'Calama',           region: 'Antofagasta',       zona: 'z4', factor: 1.12 },
    { id: 'arica',      comuna: 'Arica',            region: 'Arica y Parinacota',zona: 'z5', factor: 0.80 },
    { id: 'coyhaique',  comuna: 'Coyhaique',        region: 'Aysén',             zona: 'z5', factor: 0.95 },
    { id: 'puntaarenas',comuna: 'Punta Arenas',     region: 'Magallanes',        zona: 'z5', factor: 1.00 },
    { id: 'pwilliams',  comuna: 'Puerto Williams',  region: 'Magallanes',        zona: 'z5', factor: 1.30 },
  ];

  /* --- couriers ----------------------------------------------------------- */
  /* dto = descuento del contrato mayorista Kilonauta sobre la tarifa de lista.
     Distinto por courier: es lo que cada uno está dispuesto a ceder por volumen. */
  const COURIERS = [
    {
      id: 'chilexpress', nombre: 'Chilexpress', corto: 'CHX', dto: 0.38,
      guia: () => 'CHX ' + rnd(9, 12),
      guiaPlana: (g) => g.replace(/\D/g, ''),
      z: {
        z1: { base: 3290, kg: 1150, dias: 1, ontime: 96 },
        z2: { base: 4690, kg: 1290, dias: 2, ontime: 94 },
        z3: { base: 6190, kg: 1590, dias: 3, ontime: 91 },
        z4: { base: 6890, kg: 1690, dias: 3, ontime: 92 },
        z5: { base: 12900, kg: 3200, dias: 6, ontime: 84 },
      },
      excluye: [],
      nota: 'El de siempre. Cobertura total, el más rápido al norte, el más caro casi en todas partes.',
    },
    {
      id: 'starken', nombre: 'Starken', corto: 'STK', dto: 0.42,
      guia: () => 'OT-' + rnd(8, 8),
      guiaPlana: (g) => g.replace(/\D/g, ''),
      z: {
        z1: { base: 3590, kg: 990, dias: 2, ontime: 93 },
        z2: { base: 3990, kg: 1050, dias: 2, ontime: 93 },
        z3: { base: 4590, kg: 1190, dias: 3, ontime: 92 },
        z4: { base: 5890, kg: 1490, dias: 4, ontime: 89 },
        z5: { base: 9990, kg: 2490, dias: 8, ontime: 80 },
      },
      excluye: ['pwilliams'],
      nota: 'Red de buses: barato al sur, y la sucursal está donde el cliente ya va.',
    },
    {
      id: 'blueexpress', nombre: 'Blue Express', corto: 'BEX', dto: 0.34,
      guia: () => 'OD-' + rnd(10, 10),
      guiaPlana: (g) => g.replace(/\D/g, ''),
      z: {
        z1: { base: 2990, kg: 1090, dias: 1, ontime: 95 },
        z2: { base: 4390, kg: 1250, dias: 2, ontime: 93 },
        z3: { base: 5990, kg: 1520, dias: 3, ontime: 90 },
        z4: { base: 6490, kg: 1640, dias: 4, ontime: 88 },
        z5: { base: 14500, kg: 3400, dias: 9, ontime: 76 },
      },
      excluye: ['pwilliams', 'coyhaique'],
      nota: 'Hecho para e-commerce. Imbatible en la RM. Al sur austral, se cae.',
    },
    {
      id: 'correos', nombre: 'Correos de Chile', corto: 'CDC', dto: 0.30,
      guia: () => 'R' + L() + rnd(9, 9) + 'CL',
      guiaPlana: (g) => g,
      z: {
        z1: { base: 3190, kg: 890, dias: 3, ontime: 88 },
        z2: { base: 3590, kg: 950, dias: 4, ontime: 87 },
        z3: { base: 3990, kg: 1090, dias: 5, ontime: 86 },
        z4: { base: 4490, kg: 1190, dias: 5, ontime: 85 },
        z5: { base: 7490, kg: 1890, dias: 9, ontime: 82 },
      },
      excluye: [],
      nota: 'Obligación de servicio universal: llega a todos lados y en zona extrema no tiene competencia de precio. Lento.',
    },
  ];

  /* --- helpers ------------------------------------------------------------ */
  function rnd(min, max) {
    const n = min + Math.floor(Math.random() * (max - min + 1));
    let s = '';
    for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 10);
    return s;
  }
  function L() {
    const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    return a[Math.floor(Math.random() * a.length)];
  }

  /** CLP chileno: $4.990 */
  function clp(n) {
    const v = Math.round(n);
    return '$' + v.toLocaleString('es-CL');
  }

  /** peso facturable: max(real, volumétrico), redondeado hacia arriba al medio kilo */
  function pesoFacturable(kg, l, a, h) {
    const vol = (l * a * h) / 4000;
    const mayor = Math.max(kg, vol);
    return {
      volumetrico: Math.round(vol * 100) / 100,
      real: kg,
      facturable: Math.max(0.5, Math.ceil(mayor * 2) / 2),
      manda: vol > kg ? 'volumen' : 'peso',
    };
  }

  /** Redondeo comercial a la decena — así se ven las tarifas de verdad. */
  const dec = (n) => Math.round(n / 10) * 10;

  /**
   * Cotiza los 4 couriers para un envío.
   * @returns {{opciones: Array, pf: Object, destino: Object}}
   */
  function cotizar({ destinoId, kg, largo, ancho, alto, seguro = false, valor = 0, plan = 'nauta' }) {
    const destino = DESTINOS.find((d) => d.id === destinoId) || DESTINOS[0];
    const pf = pesoFacturable(kg, largo, ancho, alto);

    /* El plan del cliente decide cuánto del descuento mayorista le traspasamos.
       Ver negocio.html §Economía unitaria — estos tres números SON el modelo. */
    const traspaso = { nauta: 0.62, bodega: 0.80 }[plan];

    const f = destino.factor ?? 1;

    const opciones = COURIERS.map((c) => {
      const cobertura = !c.excluye.includes(destino.id);
      const t = c.z[destino.zona];
      const lista = dec((t.base + t.kg * Math.max(0, pf.facturable - 1)) * f);
      const costo = dec(lista * (1 - c.dto));                    // lo que nos cobra el courier

      /* Los tres planes, que SON el modelo de negocio:
         · Nauta      → le traspasamos el 62% del descuento mayorista. Nos queda el 38%.
         · Bodega     → le traspasamos el 80%. Nos queda el 20%, más $34.900 fijos.
         · Cordillera → le vendemos a COSTO + 7%, y le mostramos la factura del courier.
                        El fijo de $99.900 es donde está el negocio. Transparencia total. */
      const precio = plan === 'cordillera'
        ? dec(costo * 1.07)
        : dec(lista * (1 - c.dto * traspaso));

      const primaSeguro = seguro ? Math.max(590, dec(valor * 0.012)) : 0;

      return {
        id: c.id,
        nombre: c.nombre,
        corto: c.corto,
        nota: c.nota,
        cobertura,
        lista,
        costo,
        precio: precio + primaSeguro,
        primaSeguro,
        spread: precio - costo,
        dias: t.dias,
        ontime: t.ontime,
        ahorroVsLista: lista - precio,
      };
    });

    const validas = opciones.filter((o) => o.cobertura);
    const min = Math.min(...validas.map((o) => o.precio));
    const max = Math.max(...validas.map((o) => o.precio));
    const rapido = Math.min(...validas.map((o) => o.dias));

    validas.forEach((o) => {
      o.esMasBarato = o.precio === min;
      o.esMasRapido = o.dias === rapido;
      /* "Recomendado": mejor relación precio/plazo/fiabilidad.
         Puntaje transparente — el usuario lo puede reproducir a mano.
         Nada de caja negra: la confianza ES el producto. */
      o.puntaje = Math.round(
        100 - ((o.precio - min) / Math.max(1, max - min)) * 55 - (o.dias - rapido) * 4.5 + (o.ontime - 88) * 1.1
      );
    });
    const mejor = validas.slice().sort((a, b) => b.puntaje - a.puntaje)[0];
    validas.forEach((o) => (o.recomendado = mejor && o.id === mejor.id));

    /* El ahorro que le enseñamos: contra lo que pagaría hoy, que es
       Chilexpress a precio de lista. No contra un número inventado. */
    const chxLista = opciones.find((o) => o.id === 'chilexpress');
    const referencia = chxLista && chxLista.cobertura
      ? chxLista.lista
      : Math.max(...validas.map((o) => o.lista));

    return {
      destino,
      pf,
      opciones,
      min,
      max,
      referencia,
      ahorro: referencia - min,
      ahorroPct: Math.round(((referencia - min) / referencia) * 100),
      dispersion: Math.round(((max - min) / min) * 100),
    };
  }

  /* --- código de barras (visual, determinista) ---------------------------- */
  /* Es un patrón de barras derivado del número de guía. NO es Code128 válido:
     eso lo genera el courier en su API. Lo dice stack.html sin adornos. */
  function barras(codigo, ancho = 300, alto = 44) {
    let semilla = 0;
    for (let i = 0; i < codigo.length; i++) semilla = (semilla * 31 + codigo.charCodeAt(i)) >>> 0;
    const next = () => ((semilla = (semilla * 1103515245 + 12345) >>> 0) / 4294967296);

    const rects = [];
    let x = 2;
    // guardas
    const guarda = (px) => { rects.push(`<rect x="${px}" y="0" width="1.6" height="${alto}"/>`); };
    guarda(x); x += 4;
    while (x < ancho - 8) {
      const w = 1 + Math.floor(next() * 3) * 0.9;
      rects.push(`<rect x="${x.toFixed(1)}" y="0" width="${w.toFixed(1)}" height="${alto}"/>`);
      x += w + (0.9 + next() * 2.4);
    }
    guarda(ancho - 4);
    return `<svg class="barcode" viewBox="0 0 ${ancho} ${alto}" preserveAspectRatio="none" role="img" aria-label="Código de barras ${codigo}">${rects.join('')}</svg>`;
  }

  /* --- QR (visual, determinista) ------------------------------------------ */
  function qr(codigo, px = 21) {
    let s = 7;
    for (let i = 0; i < codigo.length; i++) s = (s * 131 + codigo.charCodeAt(i)) >>> 0;
    const next = () => ((s = (s * 1103515245 + 12345) >>> 0) / 4294967296);
    const n = px;
    const cells = [];
    const finder = (ox, oy) => {
      cells.push(`<rect x="${ox}" y="${oy}" width="7" height="7"/>`);
      cells.push(`<rect x="${ox + 1}" y="${oy + 1}" width="5" height="5" fill="#fff"/>`);
      cells.push(`<rect x="${ox + 2}" y="${oy + 2}" width="3" height="3"/>`);
    };
    const inFinder = (x, y) =>
      (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if (inFinder(x, y)) continue;
        if (next() > 0.52) cells.push(`<rect x="${x}" y="${y}" width="1" height="1"/>`);
      }
    }
    finder(0, 0); finder(n - 7, 0); finder(0, n - 7);
    return `<svg viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" role="img" aria-label="Código QR de seguimiento" style="width:100%;height:auto"><rect width="${n}" height="${n}" fill="#fff"/><g fill="#1C1A17">${cells.join('')}</g></svg>`;
  }

  return { ZONAS, DESTINOS, COURIERS, cotizar, clp, pesoFacturable, barras, qr, rnd, dec };
})();

if (typeof window !== 'undefined') window.KN = KN;
