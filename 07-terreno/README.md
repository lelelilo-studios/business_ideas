# Rutamo

**El despacho, la ruta y el cobro de tu cuadrilla en terreno, en un solo lugar.**

- Dominio: **rutamo.com** — verificado el 2026-07-13 con `./_kit/check-domain.sh rutamo` → `.com AVAILABLE (http 404)`, `.cl AVAILABLE`. Control: `google` → `http 200 TAKEN`.
- Suplentes verificados el mismo día: `faenko.com`, `rutovia.com`, `vueltek.com`.
- Dirección de arte: **señalética de terreno** — la oficina es una orden de trabajo impresa (papel hueso, tinta negra, filetes de 1px, esquinas rectas, cero sombras); el terreno es chaleco reflectante (grafito + lima hi-vis, tipografía enorme). Archivo + IBM Plex Mono.
- Estado: prototipo navegable. El demo corre entero en el navegador, sin servidor.

---

## El negocio

### El dolor

Una empresa chilena de climatización con siete técnicos coordina el día así: el dueño (o su hermana, o la señora de administración) arma las rutas de mañana **de memoria, en un cuaderno**, la noche anterior. Los cambios llegan por WhatsApp a las 7:40 de la mañana. El técnico anota la visita en un papel que se moja, se pierde o se entiende a medias. La cotización se escribe en la oficina dos días después, se manda por correo, y se cobra tres semanas más tarde — **si es que se cobra**.

El costo no es abstracto:

- Un técnico cuesta ~**$1.600.000/mes** cargado → **$9.500 la hora**.
- En Santiago, mal ruteado, se le van **2 horas al día** entre tráfico y vueltas evitables.
- Una visita fallida por falta de repuesto es un día perdido y un cliente enojado.
- Las OT firmadas y no cobradas se acumulan: es plata que ya se gastó y no ha vuelto.

### El ICP

Empresa de oficio en terreno (climatización, refrigeración, gasfitería, electricidad, mantención de ascensores) con **3 a 20 técnicos** en la Región Metropolitana. Tiene contratos de mantención recurrentes + correctivos. Ya paga software (Bsale, Nubox, Defontana) para facturar: **el presupuesto existe, sólo hay que capturarlo.**

### La cuña

No competimos con un ERP. Entramos por el único lugar donde el dueño siente el dolor todos los días a las 7:40: **la lista de mañana**. Una vez que la lista de mañana vive en Rutamo, el resto (OT, repuestos, cobro, historial por número de serie) entra solo.

### Precio

| Plan | Precio | Para quién |
|---|---|---|
| **Maestro** | $59.000/mes (hasta 2 técnicos) | El que recién sale del cuaderno |
| **Cuadrilla** | $39.000 + $19.000 por técnico | El grueso del mercado (5 téc = **$134.000**) |
| **Flota** | $149.000 + $16.000 por técnico | 15+ técnicos, con API y SSO |

**ARPA de referencia: $145.000/mes.**

### Unit economics

```
ARPA ............................................. $145.000
COGS ............................................. $ 18.830
   IA (Claude, 5 agentes) ........... $ 4.750   (US$5,00 × $950)
   WhatsApp Business API ............ $ 2.280
   Infraestructura .................. $ 3.800
   Soporte / éxito de cliente ....... $ 8.000
                                      ─────────
Margen bruto ..................................... $126.170  → 87,0%

CAC .............................................. $551.667
Churn ............................................ 3,0%/mes → vida 33 meses
LTV .............................................. $4.163.610
LTV / CAC ........................................ 7,5×
Payback .......................................... 4,4 meses
```

### Mercado

- **TAM** US$17,6M — todas las empresas de oficio en terreno de Chile con 3–20 técnicos.
- **SAM** US$7,9M — las de la RM, en los cinco oficios que atacamos.
- **SOM** US$474k de ARR a 3 años — el 6% del SAM.

El techo chileno es real y hay que decirlo: **llegar a US$1M de ARR exige ~13% del SAM completo.** Eso es lo que empuja hacia México y Colombia en el año 3, o hacia aceptar que esto es un negocio de dueño excelente.

### ¿Y la IA?

**Sí, pero no donde uno cree.** La optimización de rutas **no la hace un LLM** — la hace un solver clásico (OR-Tools/VROOM sobre OSRM), que es más barato, más rápido y mejor. La IA se usa donde el problema es lenguaje: leer el WhatsApp desordenado que entra, redactar la cotización que el técnico dicta con el guante puesto, resumir la visita, avisarle al dueño el lunes qué equipo se va a romper. Esa disciplina es exactamente lo que mantiene el costo de inferencia en **US$5,00/cuenta/mes** y el margen en 87%.

### Qué mataría esto

1. **Que el técnico no use la app.** Es el riesgo #1 y no es comercial, es de producto. Si el maestro sigue anotando en el papel, el dato del despacho es basura y el dueño cancela a los tres meses.
2. Que un titular con músculo (Simpliroute, Beetrack) baje al segmento PYME con un producto de terreno de verdad.
3. Que el ticket de $145.000 no aguante una venta de campo — que es la única que funciona con este cliente.

---

## El roadmap

Seis hitos, del día 1 al mes 24. **Cada uno con su criterio de muerte**, porque un roadmap sin criterios de muerte es una carta al Viejito Pascuero.

| # | Hito | Fecha | Qué es cierto si se logra | Muere si… |
|---|---|---|---|---|
| **1** | 3 design partners pagando $50.000 | Mes 2 | Alguien paga por algo a medio hacer y nos deja subirnos a la camioneta | De 30 dueños, **menos de 3 aceptan pagar** — o los que aceptan no nos dejan acompañar a un técnico un día completo |
| **2** | Primer cliente a precio de lista ($134.000, sin descuento) | Mes 4 | El precio aguanta y la propuesta se explica sola en 30 minutos | Sólo cerramos con **descuentos ≥40%**, o el ciclo de venta pasa de 45 días |
| **3** | **10 clientes pagando y usando de verdad** (≥70% de visitas cerradas en la app **por los técnicos**) | Mes 6 · deadline mes 10 | **El hito bisagra.** Toda la probabilidad de éxito cuelga de acá | **Adopción del técnico bajo 50%** a la semana 4 → se congela todo y el equipo entero se va seis semanas a la app del técnico; si sigue bajo 50%, se cierra. O: mes 10 sin 10 clientes → no se contrata a nadie |
| **4** | Venta repetible: un AE que no es fundador cierra 6 cuentas/mes | Mes 14 | La venta ya no depende del carisma del fundador. CAC < $600.000 | El AE cierra **<3 cuentas/mes** tras 3 meses de rampa, o el CAC supera **$900.000** |
| **5** | Canal (ERP + contadores) ≥25% del pipeline | Mes 20 | El crecimiento deja de ser proporcional a las horas de un vendedor | Seis meses después de lanzar la integración, el canal aporta **<5% del pipeline** |
| **6** | Punto de decisión: levantar / bootstrapear / cerrar | Mes 24 | MRR base $17,1M (118 cuentas · ARR US$216k) | **El zombi**: crecimiento neto de MRR <4% mensual en el último trimestre. Se decide y **no se estira** |

### Caja

Capital inicial **$60M** (ahorros + capital semilla público). En el escenario base la caja toca un **valle de $21,3M en el mes 17** — 2,2 meses de quema — y se recupera. **En el escenario pesimista la caja se acaba en el mes 14.** No hay colchón: por eso el criterio de muerte del hito 3 no es negociable.

Break-even operacional: **mes 21**.

### La métrica que importa

No el embudo de adquisición: **la curva de adopción del técnico por cohorte.** Si una cohorte se queda plana bajo el 70% de visitas cerradas en la app a la semana 4, ese cliente está muerto y todavía no lo sabemos. Es nuestro indicador adelantado de churn y se revisa todos los lunes.

### Probabilidad de éxito

**Clase de referencia:** startups de software B2B que llegan a US$1M de ARR → **4–10%**. *Confianza baja: es el rango que se cita en la industria, pero no tenemos una fuente primaria que podamos citar con confianza, y menos una chilena. Lo decimos en vez de inventar una cita.*

```
Base (punto medio de la clase de referencia) .............. 7%
× presupuesto existente + cuña afilada + ROI visible ...... × 2,4  → 16,8%
× techo del TAM chileno ................................... × 0,75 → 12,6%
× riesgo de adopción del técnico .......................... × 0,85 → 10,7%
± banda de incertidumbre del método ....................... ±4 pts
                                                            ───────────────
P(ARR ≥ US$1M en 36 meses) ................................ 10 – 18%
```

**Condicional a lograr el Hito 3 antes del mes 10.** Si el Hito 3 se logra, el rango sube a **18–28%**; si no, cae bajo **4%** y lo correcto es cerrar.

Los multiplicadores son juicio nuestro, no ciencia. Están escritos para que alguien los pueda discutir uno por uno, que es exactamente el punto.

Y el número honesto que un fondo llamaría fracaso: **P(negocio rentable de dueño, US$300–600k de ARR, 4–6 personas, sin levantar) ≈ 35–45%.** Es mucho más probable que el anterior. Con 87% de margen bruto y 150 cuentas, cuatro personas viven muy bien. **P(muerte o zombi al mes 24) ≈ 40–50%** — sigue siendo el resultado más probable.

---

## El stack

### Capas

- **Cliente despacho** — SPA (Preact + signals) sobre MapLibre GL con teselas contratadas.
- **Cliente terreno** — **PWA offline-first, y esto no es negociable.** Service worker + IndexedDB. Cada acción del técnico se escribe local con un ULID generado en el dispositivo y se encola; el sync sube la cola cuando hay señal. Pagos y firmas son **append-only**: nunca se sobrescriben.
- **API** — Node 22 + Fastify + Postgres 16. Login por OTP a WhatsApp: ningún maestro va a recordar una contraseña.
- **Motor de rutas** — **OSRM** autohospedado (extracto Chile de OpenStreetMap) para la matriz de tiempos + **VROOM/OR-Tools** para resolver el VRPTW con ventanas horarias, skills y urgencias fijadas. **No es un LLM.**
- **IA** — Claude, cinco agentes acotados, ninguno en el camino crítico de la ruta.

### Modelo de datos

Doce tablas. El corazón es **`visita`** (`ulid` generado en el dispositivo, `estado: pendiente → en_ruta → en_sitio → cerrada|fallida`, `ventana`, `duracion_est`, `orden_en_ruta`, `eta`, `llegada_real`, `origen`). De ahí cuelgan `orden_trabajo` (1:1, con `items[]`, `firma`, `firmada_en`), `pago` (idempotente, append-only, con `dte_folio`), y `evento_sync` (la cola offline). `equipo.serie` es la llave del historial: es lo que convierte "otra falla más" en "este chiller lleva 3 correctivos en 90 días, hay que venderle uno nuevo".

### Agentes de IA

| Agente | Modelo | Qué hace | US$/cuenta/mes |
|---|---|---|---|
| **A1 Triaje de entrada** | `claude-haiku-4-5` | Convierte el WhatsApp crudo en una visita estructurada. Nunca inventa un sitio o equipo que no esté en el catálogo; toda visita que crea entra a la bandeja marcada **IA** y necesita un clic humano | 1,20 |
| **A2 Cotización en terreno** | `claude-sonnet-5` | El técnico dicta, A2 arma la cotización con SKU y precios del catálogo. Si un ítem no está, **no le inventa precio** | 1,76 |
| **A3 Cierre desde nota de voz** | `claude-haiku-4-5` + ASR | 40 segundos hablando con el guante puesto → diagnóstico, repuestos consumidos, revisita si faltó algo. **Nunca escribe un diagnóstico más seguro que lo que dijo el técnico** | 0,57 + 0,85 |
| **A4 Informe semanal** | `claude-opus-4-8` | Lunes 07:00, 6 líneas al WhatsApp del dueño: qué se facturó, qué no se cobró, qué equipo se va a romper. Cada afirmación con su número | 0,39 |
| **A5 Repuesto faltante** | `claude-haiku-4-5` | Normaliza "presostato baja Danfoss" contra el catálogo. **Jamás adivina un SKU con confianza baja** — un SKU equivocado hace viajar una camioneta al otro lado de Santiago para nada | 0,23 |
| | | **TOTAL** | **US$5,00** |

Cuenta de referencia: 5 técnicos, ~260 visitas/mes. Calculado **sin prompt caching** (con caching bajaría a ~US$3,7; ese colchón es a propósito). → **$4.750 CLP/cuenta/mes**, que es exactamente la línea de IA del COGS de arriba.

### APIs a contratar

| Servicio | Fricción |
|---|---|
| Anthropic API | Baja — media hora |
| **WhatsApp Business Platform** (Meta) | **Alta** — verificación de negocio + plantillas aprobadas por Meta. Lenta y arbitraria |
| **Transbank Webpay Plus** | **Alta** — contrato de comercio + certificación. Plan: partir con **Mercado Pago / Khipu** (un día) y agregar Webpay cuando un cliente grande lo exija |
| Proveedor DTE (Bsale / Nubox / Defontana / LibreDTE) | Media — no emitimos DTE nosotros; nos integramos al que el cliente ya usa |
| OSRM + OpenStreetMap | Baja — gratis, autohospedado. **Sin tráfico en tiempo real**: se compensa con perfiles de velocidad por comuna/hora calibrados con nuestros propios datos de `llegada_real`. Ese dataset es, con el tiempo, el foso |
| Teselas de mapa (MapTiler / Protomaps) | Baja |
| Transcripción de audio | Media — el test es un audio real grabado en una sala de máquinas con el chiller andando, no un benchmark |

### Qué está falseado en el demo

El demo no tiene servidor, ni base de datos, ni cuenta de nada. Corre entero en el navegador y se reinicia al recargar.

1. **El optimizador es real** (vecino más cercano + 2-opt, con urgencias fijadas; los km y minutos **sí se recalculan** con cada cambio) pero **mide en línea recta × factor**, no por calles. En producción: OSRM + solver VRPTW.
2. **El mapa** es un SVG dibujado a mano — 26 comunas del Gran Santiago, el Mapocho, el San Cristóbal y Américo Vespucio. Es un esquema, no cartografía. **A propósito no cargamos ningún mapa de un CDN.**
3. **"La IA leyó el WhatsApp"** está escrito a mano en el código. No hay ninguna llamada a Anthropic: no hay servidor donde esconder una clave. Los prompts reales están completos en `stack.html`, para que se juzguen por lo que dicen y no por la animación.
4. **El pago** cambia un estado en memoria. No hay Transbank, no se mueve un peso.
5. **El modo sin señal** es una bandera en memoria y la cola es un arreglo. **No hay service worker ni IndexedDB** — y eso, en producción, es técnicamente la parte más difícil del producto entero.
6. **Los datos** (clientes, equipos, repuestos, precios) son inventados con cuidado. Las comunas, las marcas y los órdenes de magnitud sí son reales.
7. **No hay cuentas, ni login, ni multi-empresa.** Nada persiste.

### Lo primero que rompería esto en producción

1. **La cola offline.** Técnico en el subterráneo de un mall, sin señal, cierra 4 visitas, se le muere la batería. Si perdió una firma o un pago, perdimos el cliente. Se prueba con crueldad: modo avión, ascensor, matando la app a la mala.
2. **El ETA que se equivoca.** Prometer 15:30 y llegar 17:00 es peor que no prometer nada. `llegada_real − eta` se mide desde el día 1.
3. **La aprobación de plantillas de WhatsApp.** Si Meta no aprueba "tu técnico va en camino", la mitad de la propuesta de valor se cae. Se prueba en la semana 1, no en el mes 6.

---

## Archivos

```
07-terreno/
├── index.html          Producto — landing, mini-demo en vivo, calculadora de pérdida, precios, FAQ
├── demo/index.html     Demo — las dos vistas: despacho (mapa) y terreno (teléfono)
├── negocio.html        ICP, TAM/SAM/SOM, unit economics, competencia, canales, plan 90 días
├── roadmap.html        6 hitos con criterio de muerte, MRR ×3 escenarios, caja + valle, cohortes
├── stack.html          Modelo de datos, 5 agentes con sus prompts, APIs, env vars, costo, lo falseado
├── meta.json
├── README.md
└── assets/
    ├── rutamo.css      Tokens y componentes de la dirección de arte
    ├── demo.css        Despacho (papel) + terreno (chaleco reflectante)
    └── demo.js         El motor: ruteo, agenda, estado compartido entre ambas vistas, cola offline
```

Sin build, sin npm, sin framework, sin CDN. La única petición externa en todo el sitio es Google Fonts.
