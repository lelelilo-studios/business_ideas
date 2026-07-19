/* ============================================================
   Etiquaria, motor.js
   El reglamento hecho código. TODO veredicto sale de estas
   funciones deterministas; ningún modelo de lenguaje calcula
   umbrales ni geometría de sellos (ver stack.html).

   FUENTES DE LOS UMBRALES
   - Límites "ALTO EN": art. 120 bis del Reglamento Sanitario de
     los Alimentos (DS 977/96 MINSAL), incorporado por DS 13/2015.
     Etapa final, vigente desde el 27 de junio de 2019:
       sólidos  (por 100 g):  energía ≥275 kcal · sodio ≥400 mg ·
                              azúcares totales ≥10 g · g. saturadas ≥4 g
       líquidos (por 100 ml): energía ≥70 kcal · sodio ≥100 mg ·
                              azúcares totales ≥5 g · g. saturadas ≥3 g
   - Alcance: aplica a alimentos a los que se les haya AÑADIDO
     azúcares, miel, jarabes, sodio o grasas saturadas (art. 120 bis).
   - Criterio implementado: lleva sello si valor >= límite. El motor
     real fija el criterio exacto (igual o superior) con tests contra
     el texto vigente del decreto.
   - Declaración de nutrientes: art. 115 RSA (por 100 g/ml y por porción).
   - Prohibiciones derivadas: Ley 20.606 arts. 6 y 7; Ley 20.869.
   - Tamaños de sello por superficie de cara principal: implementados
     a partir de las especificaciones gráficas del DS 13/2015. Los
     valores en cm de la tabla TAMANOS son ESTIMACIÓN de memoria del
     equipo; el motor productivo los amarra a la tabla oficial con
     tests antes de que ninguna etiqueta llegue a imprenta.
   ============================================================ */

"use strict";

const LIMITES = {
  solido:  { energia: 275, sodio: 400, azucares: 10, gsat: 4 },  // por 100 g
  liquido: { energia: 70,  sodio: 100, azucares: 5,  gsat: 3 },  // por 100 ml
};

const CITA_120BIS = "art. 120 bis RSA · DS 977/96 · límites DS 13/2015";

const DESCRIPTORES = [
  { clave: "energia",  sello: ["CALORÍAS"],            unidad: { solido: "kcal/100 g", liquido: "kcal/100 ml" }, decimales: 0 },
  { clave: "azucares", sello: ["AZÚCARES"],            unidad: { solido: "g/100 g",    liquido: "g/100 ml" },    decimales: 1 },
  { clave: "gsat",     sello: ["GRASAS", "SATURADAS"], unidad: { solido: "g/100 g",    liquido: "g/100 ml" },    decimales: 1 },
  { clave: "sodio",    sello: ["SODIO"],               unidad: { solido: "mg/100 g",   liquido: "mg/100 ml" },   decimales: 0 },
];

/* Tamaño del símbolo octogonal según superficie de la cara principal.
   ESTIMACIÓN a partir del DS 13/2015 (ver cabecera). */
const TAMANOS = [
  { max: 30,       lado: null, tramo: "menos de 30 cm²: envase exento de rotular el símbolo" },
  { max: 60,       lado: 1.5,  tramo: "30 a 60 cm²" },
  { max: 100,      lado: 2.0,  tramo: "60 a 100 cm²" },
  { max: 200,      lado: 2.5,  tramo: "100 a 200 cm²" },
  { max: 300,      lado: 3.0,  tramo: "200 a 300 cm²" },
  { max: Infinity, lado: 3.5,  tramo: "300 cm² o más" },
];

/* ------------------------------------------------------------
   Datos mock: cuatro SKUs de fábricas chilenas inventadas.
   Nutrientes = "informe de laboratorio". Precios de ingredientes
   son estimación (mercado mayorista 2026).
   ------------------------------------------------------------ */
const PRODUCTOS = {
  granola: {
    nombre: "Granola Miel y Avena 400 g",
    marca: "Cumbres del Maule",
    razon: "Alimentos Cumbres del Maule SpA",
    rut: "76.842.310-5",
    comuna: "San Javier, Región del Maule",
    estado: "solido",
    neto: "400 g",
    porcion: { cantidad: 30, texto: "30 g (¾ taza)", porEnvase: "13 porciones por envase" },
    anadidos: true,
    anadidosTexto: "miel y azúcar añadidas",
    lab: { energia: 452, proteinas: 9.8, gtot: 18.2, gsat: 6.4, gtrans: 0.1, hcd: 61.5, azucares: 22.0, sodio: 85 },
    envases: [
      { id: "doypack", nombre: "Doypack 400 g", ancho: 13, alto: 16 },
      { id: "bolsa",   nombre: "Bolsa 40 g",    ancho: 8,  alto: 10 },
      { id: "sachet",  nombre: "Sachet 20 g",   ancho: 5,  alto: 5.5 },
    ],
    receta: {
      loteKg: 300, unidades: 750,
      ingredientes: {
        azucares: { nombre: "azúcar y miel", precio: 890, reemplazo: "polidextrosa (fibra)", precioReemplazo: 4900 },
        gsat:     { nombre: "aceite de coco", precio: 3200, reemplazo: "aceite alto oleico", precioReemplazo: 2100 },
        sodio:    { nombre: "sal", precio: 450, factorSal: 2.5, reemplazo: "extracto de levadura", precioReemplazo: 6800 },
      },
    },
    libro: [
      { fecha: "12-05-2026", receta: "v1", detalle: "Primera verificación · azúcares 24,5 g/100 g", sellos: "CALORÍAS · AZÚCARES · G. SATURADAS" },
      { fecha: "30-06-2026", receta: "v2 (menos miel)", detalle: "Azúcares baja a 22,0 g/100 g · sigue sobre el límite", sellos: "CALORÍAS · AZÚCARES · G. SATURADAS" },
    ],
  },

  mermelada: {
    nombre: "Mermelada de Frambuesa 250 g",
    marca: "Ñuble Puro",
    razon: "Conservas Ñuble Puro Ltda.",
    rut: "77.215.640-5",
    comuna: "San Carlos, Región de Ñuble",
    estado: "solido",
    neto: "250 g",
    porcion: { cantidad: 20, texto: "20 g (1 cucharada)", porEnvase: "12 porciones por envase aprox." },
    anadidos: true,
    anadidosTexto: "azúcar añadida",
    lab: { energia: 216, proteinas: 0.4, gtot: 0.1, gsat: 0.0, gtrans: 0.0, hcd: 53.0, azucares: 48.0, sodio: 12 },
    envases: [
      { id: "frasco250", nombre: "Frasco 250 g",      ancho: 7,    alto: 8 },
      { id: "frasco500", nombre: "Frasco 500 g",      ancho: 8.5,  alto: 10 },
      { id: "pote5k",    nombre: "Pote HORECA 5 kg",  ancho: 18,   alto: 18 },
    ],
    receta: {
      loteKg: 200, unidades: 800,
      ingredientes: {
        azucares: { nombre: "azúcar", precio: 890, reemplazo: "fruta adicional", precioReemplazo: 1450 },
      },
    },
    libro: [
      { fecha: "03-04-2026", receta: "v1", detalle: "Verificación inicial · azúcares 48,0 g/100 g", sellos: "AZÚCARES" },
    ],
  },

  nectar: {
    nombre: "Néctar de Manzana 300 ml",
    marca: "Valle Claro",
    razon: "Jugos Valle Claro SpA",
    rut: "76.109.385-1",
    comuna: "Rengo, Región de O'Higgins",
    estado: "liquido",
    neto: "300 ml",
    porcion: { cantidad: 200, texto: "200 ml (1 vaso)", porEnvase: "1,5 porciones por envase" },
    anadidos: true,
    anadidosTexto: "azúcar añadida",
    lab: { energia: 46, proteinas: 0.1, gtot: 0.0, gsat: 0.0, gtrans: 0.0, hcd: 11.2, azucares: 10.8, sodio: 8 },
    envases: [
      { id: "botella", nombre: "Botella 300 ml", ancho: 8,   alto: 9 },
      { id: "caja1l",  nombre: "Caja 1 L",       ancho: 9.5, alto: 16 },
      { id: "vasito",  nombre: "Vasito 200 ml",  ancho: 6,   alto: 5 },
    ],
    receta: {
      loteKg: 900, unidades: 3000,
      ingredientes: {
        azucares: { nombre: "azúcar", precio: 890, reemplazo: "agua + sucralosa (dulzor equivalente)", precioReemplazo: 600 },
      },
    },
    libro: [
      { fecha: "20-06-2026", receta: "v1", detalle: "Verificación inicial · azúcares 10,8 g/100 ml", sellos: "AZÚCARES" },
    ],
  },

  pan: {
    nombre: "Pan de Molde Integral 600 g",
    marca: "Horno del Itata",
    razon: "Panificadora Horno del Itata Ltda.",
    rut: "77.480.226-6",
    comuna: "Quillón, Región de Ñuble",
    estado: "solido",
    neto: "600 g",
    porcion: { cantidad: 50, texto: "50 g (2 rebanadas)", porEnvase: "12 porciones por envase" },
    anadidos: true,
    anadidosTexto: "sal añadida",
    lab: { energia: 259, proteinas: 9.1, gtot: 3.4, gsat: 0.7, gtrans: 0.0, hcd: 44.6, azucares: 4.8, sodio: 470 },
    envases: [
      { id: "bolsa600", nombre: "Bolsa 600 g", ancho: 18, alto: 20 },
      { id: "bolsa300", nombre: "Bolsa 300 g", ancho: 14, alto: 15 },
    ],
    receta: {
      loteKg: 500, unidades: 830,
      ingredientes: {
        sodio: { nombre: "sal", precio: 450, factorSal: 2.5, reemplazo: "extracto de levadura", precioReemplazo: 6800 },
      },
    },
    libro: [
      { fecha: "28-05-2026", receta: "v1", detalle: "Verificación inicial · sodio 470 mg/100 g", sellos: "SODIO" },
    ],
  },
};

/* ------------------------------------------------------------
   Funciones deterministas (lo que el modelo tiene PROHIBIDO hacer)
   ------------------------------------------------------------ */

/** Evalúa los cuatro descriptores. Devuelve un veredicto por descriptor. */
function evaluarSellos(estado, valores, tieneAnadidos) {
  const limites = LIMITES[estado];
  return DESCRIPTORES.map((d) => {
    const limite = limites[d.clave];
    const valor = valores[d.clave];
    const lleva = tieneAnadidos && valor >= limite;
    return {
      clave: d.clave,
      sello: d.sello,
      unidad: d.unidad[estado],
      decimales: d.decimales,
      valor,
      limite,
      lleva,
      exento: !tieneAnadidos,
      margen: limite - valor,
      cita: CITA_120BIS,
    };
  });
}

/** Tamaño mínimo del sello para una superficie de cara principal (cm²). */
function tamanoSello(superficieCm2) {
  const fila = TAMANOS.find((t) => superficieCm2 < t.max);
  return { lado: fila.lado, tramo: fila.tramo, superficie: superficieCm2 };
}

/** Prohibiciones que se gatillan al llevar al menos un sello. */
function prohibiciones(nSellos) {
  if (nSellos === 0) return [];
  return [
    {
      texto: "Prohibida su venta, promoción y publicidad en establecimientos de educación parvularia, básica y media.",
      cita: "Ley 20.606, art. 6",
    },
    {
      texto: "Prohibida la publicidad dirigida a menores de 14 años, en cualquier medio.",
      cita: "Ley 20.606, art. 7 · Ley 20.869",
    },
    {
      texto: "Prohibidos los ganchos comerciales dirigidos a niños (juguetes, regalos, personajes infantiles en el envase).",
      cita: "Ley 20.606, art. 6 y art. 8 (el motor real cita el inciso exacto)",
    },
  ];
}

/** Filas de la declaración nutricional (art. 115 RSA): por 100 y por porción. */
function declaracion(producto, valores) {
  const p = producto.porcion.cantidad;
  const base = producto.estado === "solido" ? "100 g" : "100 ml";
  const f = (v, dec) => v.toLocaleString("es-CL", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const fila = (nombre, v100, dec) => ({ nombre, v100: f(v100, dec), vPorcion: f((v100 * p) / 100, dec) });
  return {
    base,
    filas: [
      fila("Energía (kcal)", valores.energia, 0),
      fila("Proteínas (g)", producto.lab.proteinas, 1),
      fila("Grasas totales (g)", producto.lab.gtot, 1),
      fila("Grasas saturadas (g)", valores.gsat, 1),
      fila("Grasas trans (g)", producto.lab.gtrans, 1),
      fila("H. de C. disponibles (g)", producto.lab.hcd, 1),
      fila("Azúcares totales (g)", valores.azucares, 1),
      fila("Sodio (mg)", valores.sodio, 0),
    ],
  };
}

/**
 * Simulador de reformulación para un descriptor.
 * Devuelve: reducción necesaria para soltar el sello, y el costo de
 * receta de una reducción dada (si hay ingrediente mapeado).
 */
function simular(producto, valoresActuales, clave, reduccion) {
  const limite = LIMITES[producto.estado][clave];
  const actual = valoresActuales[clave];
  const nuevo = Math.max(0, actual - reduccion);
  const objetivo = limite - (clave === "energia" || clave === "sodio" ? 1 : 0.1);
  const paraSoltar = actual >= limite ? actual - objetivo : 0;
  const suelta = nuevo < limite;

  let costo = null;
  const ing = producto.receta.ingredientes[clave];
  if (ing && reduccion > 0) {
    // g del NUTRIENTE por 100 g de producto → kg de INGREDIENTE por lote.
    // Para sodio: 1 g de sodio ≈ 2,5 g de sal (factorSal).
    const factor = ing.factorSal || 1;
    const kgNutriente = (producto.receta.loteKg * reduccion) / 100;
    const kgIngrediente = clave === "sodio" ? (kgNutriente / 1000) * factor : kgNutriente * factor;
    const ahorro = kgIngrediente * ing.precio;
    const costoReemplazo = kgIngrediente * ing.precioReemplazo;
    const delta = costoReemplazo - ahorro;
    costo = {
      ingrediente: ing.nombre,
      reemplazo: ing.reemplazo,
      kgIngrediente,
      ahorro: Math.round(ahorro),
      costoReemplazo: Math.round(costoReemplazo),
      deltaLote: Math.round(delta),
      deltaUnidad: Math.round(delta / producto.receta.unidades),
      loteKg: producto.receta.loteKg,
      unidades: producto.receta.unidades,
    };
  }
  return { limite, actual, nuevo, paraSoltar, suelta, costo, cita: CITA_120BIS };
}

/* Formato CLP: $1.290.000 */
function clp(n) {
  const signo = n < 0 ? "-" : "";
  return signo + "$" + Math.abs(Math.round(n)).toLocaleString("es-CL");
}

function numCl(n, dec) {
  return n.toLocaleString("es-CL", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}
