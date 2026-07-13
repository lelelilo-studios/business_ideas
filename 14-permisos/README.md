# Cianota

**La ruta crítica de tus permisos, en un solo plano.**

`cianota.com` — verificado disponible (RDAP Verisign → HTTP 404, 2026-07-13).
Alternativas verificadas: `isocrona.com`, `cianoplano.com`, `rutaje.com` (las tres HTTP 404).

Dirección de arte: **plano / blueprint técnico**. Fondo azul cianotipo, retícula de dibujo en cian,
filetes de 1px, anotaciones en monoespaciada (IBM Plex), cartucho de lámina al pie. El grafo de
dependencias es el elemento gráfico protagonista.

---

## El problema

Un proyecto minero grande no necesita *un* permiso. Necesita decenas: la RCA del SEIA más los
sectoriales de SERNAGEOMIN, DGA, CONAF, el Consejo de Monumentos, el SAG, la autoridad sanitaria, la
DOM y la SEC. Con dependencias entre sí: hay permisos que exigen como requisito otro permiso que
todavía no existe.

Eso no es una lista. **Es un grafo.** Y hoy lo administra un equipo de abogados con una carta Gantt en
Excel y una carpeta compartida.

El resultado: un permiso se atrasa un mes, arrastra a otros cuatro, se pierde una ventana de terreno y
la puesta en marcha se corre **tres meses**. Con US$ 620 millones ya comprometidos, eso cuesta
**US$ 34,8 millones**. Nadie lo vio venir porque nadie tenía el grafo.

## El producto

Cuatro piezas:

1. **El plano** — el grafo de dependencias de los permisos del proyecto, con la ruta crítica marcada.
2. **El reloj legal** — el cómputo en días hábiles de cada trámite, con feriados chilenos, y la alerta
   cuando *el servicio* se pasa del plazo.
3. **El simulador** — mueves un permiso y ves correrse la fecha de puesta en marcha y el costo en US$.
4. **El lector** — la IA lee el ICSARA que llegó, extrae cada observación, dice qué te piden y busca en
   el expediente qué documentos ya lo responden, con la cita.

### El momento estrella del demo

Proyecto **Sierra Ancha** (ficticio, Calama, 4.050 m, US$ 1.240 M de inversión). Atrasas la Adenda
complementaria **30 días** → la puesta en marcha pasa de 12-oct-2029 a **18-ene-2030**: **98 días** y
**US$ 34,8 millones**.

¿Por qué 30 días se vuelven 98? Porque la curva no es una recta, es **un escalón**: la Adenda tiene 9
días de holgura; pasado el día 10, la campaña de rescate arqueológico ya no cabe en la ventana de
terreno (15-dic a 31-ene, invierno altiplánico a 4.050 m) y se va entera a la temporada siguiente.

### La regla que ordena el producto

> **Si un plazo no nos consta, se marca `por validar`. No se inventa.**

En el demo, el único plazo marcado *confirmado* es el de evaluación de un EIA (120 días hábiles,
Ley 19.300 art. 15). Todos los demás están explícitamente marcados como estimaciones no verificadas.
Un producto que inventa un plazo legal es peor que no tener producto.

---

## Negocio

### Cliente

- **A — El titular.** Minera, generadora o industria con un proyecto > US$ 100 M en tramitación.
  Firma el gerente de proyecto; lo usa el jefe de permisos. Hoy vive en un Excel.
- **B — El estudio o consultora.** Gestiona permisos para varios titulares. Comprador **y canal**.

### Mercado (Chile) — con la aritmética a la vista

| Segmento | Cuentas | Precio/mes | CLP/año |
|---|---:|---:|---:|
| Titulares > US$ 100 M | 130 | $2.400.000 | $3.744 M |
| Estudios y consultoras | 45 | $3.900.000 | $2.106 M |
| Proyectos medianos US$ 10–100 M | 420 | $890.000 | $4.485 M |
| **TAM Chile** | **595** | | **$10.335 M/año** |

**SAM** = A + B + 30 % de C = **$7.196 M/año**. **SOM (mes 24)** = 24 cuentas × $1.795.000 × 12 =
**$517 M/año** (≈ US$ 545 k de ARR), el 5,0 % del TAM.

El TAM chileno es chico y lo decimos de entrada. Los conteos de cuentas son estimaciones propias y
están marcados como tales; hay que verificarlos contra Cochilco y las estadísticas del SEA.
La tesis de crecimiento es Perú y Brasil, no Chile.

### Precio (CLP/mes, sin IVA)

- **Expediente** $890.000 — 1 proyecto, 40 permisos, 5 usuarios.
- **Cartera** $2.400.000 — 5 proyectos, simulador de escenarios, alertas, API.
- **Estudio** $3.900.000 — 15 proyectos de clientes distintos, informes con marca del estudio.
- Implementación (una vez): $2.900.000.

### Economía unitaria

| | |
|---|---|
| ARPU | $1.794.500/mes |
| COGS por cuenta | $117.800 (IA $31.300 + infra $27.100 + analista regulatorio $55.000 + soporte $4.500) |
| Margen bruto | **93 %** a escala (40 cuentas) · **84 %** con 10 cuentas |
| CAC | $8.200.000 |
| LTV | $64,6 M (40 meses × 90 % de margen) |
| Payback / LTV:CAC | 5,1 meses · 7,9× |

### Canales, en orden

1. **El disparador del e-SEIA** — todo proyecto que ingresa aparece en el portal público. La IA arma su
   grafo con datos públicos y se lo mandamos. No es un correo de venta: es el producto.
2. **Estudios y consultoras como distribuidores** — plan Estudio gratis 6 meses por el primer proyecto,
   15 % de referido. Es el canal que baja el CAC de $8,2 M a ~$3 M. Y puede no existir.
3. **Gremios y Cesco Week** — Consejo Minero, SONAMI, Aprimin. Exponor en Antofagasta.
4. **Outbound nominal** — hay menos de 400 personas en Chile con el cargo. Se listan una por una.
5. **SEO long-tail** — “plazo adenda SEIA días hábiles”, “cuánto demora una RCA”.
6. ~~Google/Meta Ads~~ — descartado. Con 600 cuentas, comprar clics es tirar la plata.

### IA en el marketing

**Sí:** la radiografía gratis del proyecto que acaba de ingresar al SEIA (imposible de hacer a mano:
costaría dos semanas de un abogado por proyecto), la detección de la señal de compra y la investigación
de cuenta antes de una reunión.

**No:** correos “personalizados” generados (el comprador es un abogado y lo detecta en la primera
línea), contenido SEO de volumen (un plazo mal publicado destruye el único activo que vendemos) y
chatbots.

### Qué mataría esto

1. **La reforma funciona.** Hay reforma en curso al sistema de autorizaciones sectoriales y al SEIA —
   *no damos por conocido su estado de tramitación*. Si el Estado entrega una ventanilla única con
   seguimiento de plazos y API, la mitad “seguimiento” del producto se vuelve gratis.
   **Lo que queda:** el grafo, la ruta crítica y el costo de la demora, que dependen del proyecto y no
   del Estado, y que ninguna ventanilla única va a calcular jamás. **Y la oportunidad:** durante una
   reforma nadie sabe qué permiso aplica, y ahí un catálogo mantenido vale más que nunca.
   Veredicto honesto: la reforma no nos mata, nos *recorta*. Si es muy buena, esto es un negocio de
   cinco años, no de quince.
2. **El churn es estructural.** El proyecto termina y la cuenta se acaba. El supuesto de 40 meses de
   vida depende de que el 40 % de los titulares renueve con su siguiente proyecto. Es el supuesto más
   frágil del plan.
3. **Un plazo mal.** Si Cianota dice “te quedan 12 días” y eran 6, no perdemos un cliente: perdemos el
   mercado, porque son 600 cuentas y todas se conocen.

---

## Roadmap

| Hito | Mes | Qué es cierto si lo logras | Criterio de muerte |
|---|---|---|---|
| **M1** 3 design partners | 2 | El dolor existe y es de ellos | Si en 60 días nadie carga un expediente real —con el grafo hecho gratis— el dolor no está donde creemos |
| **M2** La primera factura | 4 | Hay presupuesto y llega a nosotros | Si los 3 usan el producto y ninguno firma en 90 días, es un *nice to have* |
| **M3** 5 pagando, lector medido | 9 | El producto funciona, no sólo el pitch | Recall de extracción < 90 %, o el abogado igual tiene que leer el ICSARA completo |
| **M4** 10 pagando | 12 | La máquina de ventas existe | CAC > $15 M o ciclo > 9 meses. Con menos de 7 cuentas, **no se hace la contratación del mes 13** |
| **M5** El canal existe | 18 | El CAC baja, el crecimiento no depende de un fundador | Ningún estudio trae un cliente en 6 meses → el canal no existe |
| **M6** Decisión | 24 | ARR $517 M, caja $124 M | Matar si ARR < US$ 300 k con el canal muerto — o si la ventanilla única del Estado salió y funciona |

**Caja:** capital inicial $140 M. **Valle de runway en el mes 13**: $49,4 M, 1,8 meses de gasto — es
cuando entra la segunda tanda de contrataciones y el crecimiento todavía no la cubre. Cruce operacional
en el mes 11.

**ARR mes 24:** pesimista $158 M · base $517 M · optimista $1.058 M (movidos por supuestos declarados de
tasa de cierre, ticket y churn).

### Probabilidad de éxito — 20 a 30 %

Definimos éxito como llegar a **US$ 1 M de ARR en 36 meses**.

**No tenemos una tasa base verificada** para “SaaS B2B vertical chileno que llega a US$ 1 M de ARR”.
La cifra del “5 %” que circula no tiene fuente sólida y no la usamos. Tampoco tenemos a mano la
supervivencia a 3 años de las startups CORFO. Así que derivamos desde el universo, que sí podemos
contar:

- US$ 1 M ARR ÷ 12 ÷ ARPU $1.795.000 = **44 cuentas pagando**.
- Universo alcanzable: 130 titulares + 45 estudios + 125 medianos con equipo = **300 cuentas**.
- 44 / 300 = **15 % de penetración del universo en 36 meses.**

**Ajustes al alza:** el presupuesto ya se gasta (va a consultores), el dolor está cuantificado en
US$/día por el propio cliente, existe un canal real y casi no hay software compitiendo pre-RCA.
**A la baja:** ciclo de venta de 5–9 meses por comité, universo de sólo 300 cuentas, dependencia
regulatoria, churn estructural, y una reputación que se quema con un solo plazo mal publicado.

**Resultado: 20–30 %, condicional a alcanzar M4 (10 cuentas pagando) en el mes 12.** Si M4 no se
cumple, cae por debajo del 10 %: sin 10 cuentas no hay caja para el mes 13 y el valle se traga el plan.
El rango es ancho a propósito — la incertidumbre está concentrada en una sola pregunta: **si los
estudios distribuyen o no.**

---

## Arquitectura

### El principio

**La IA lee. La aritmética la hace el código.** Ningún LLM calcula una fecha en Cianota: el motor de
ruta crítica (días hábiles, feriados, compuertas de sesión mensual, ventanas de terreno) es
determinista, auditable y reproducible en una planilla. La IA devuelve *“esta observación exige dos
campañas de terreno, 45 días de trabajo adicional”*; el motor decide qué le hace eso a la fecha.

### Los tres agentes

| Agente | Modelo | Qué hace |
|---|---|---|
| **A1 Lector** | `claude-opus-4-8` | Lee el ICSARA/RCA/oficio y extrae cada requerimiento con cita. `thinking: adaptive`, `effort: high`, structured outputs, prompt caching del contexto. Herramientas de sólo lectura sobre el expediente. |
| **A2 Emparejador** | `claude-sonnet-5` | Por cada observación, decide qué documentos del expediente la responden. `effort: medium`. **No redacta la respuesta**: eso lo firma un abogado. |
| **A3 Vigía** | `claude-haiku-4-5` (Batches API, −50 %) | Monitorea el Diario Oficial y el e-SEIA. Propone cambios al catálogo, que **aprueba un humano**. También dispara la radiografía gratis del canal de adquisición. |

**Dónde NO hay IA:** la ruta crítica, el costo de la demora, la respuesta a la autoridad y la
aprobación del catálogo.

### Datos

PostgreSQL 16 + pgvector. El corazón es un DAG sobre `permiso_proyecto` y `dependencia`, más un
**catálogo normativo versionado** con el campo que más importa: `plazo_estado ∈ {confirmado, por_validar}`.
Una base por cliente (no una fila con `org_id`), cifrado con clave por cliente, y auditoría de cada
acceso a un documento — incluidos los del equipo de Cianota.

### APIs a contratar

- **e-SEIA** — la fuente de datos más importante y **el punto más frágil del stack**: no nos consta que
  exista una API pública documentada. Hoy el plan es leer el portal público. Un cambio de maquetado nos
  rompe. Conseguir un acceso formal es la primera prioridad técnica.
- **Anthropic API**, **Google Document AI** (OCR), **WhatsApp Business API** (alertas — en terreno nadie
  lee correos), **Postmark**, **Hetzner/Fly + Cloudflare R2**.
- **Clave Única**: no aplica hoy. Cianota no presenta trámites.

### Costo mensual por cuenta

| | US$/mes |
|---|---:|
| A1 Lector (Opus 4.8) — 12 documentos × US$ 1,07 | 12,8 |
| Indexación del expediente (Sonnet 5) | 5,3 |
| A2 Emparejador (Sonnet 5) — 324 emparejamientos × US$ 0,0396 | 12,8 |
| A3 Vigía (Haiku 4.5, batch) | 2,0 |
| OCR + almacenamiento + cómputo + WhatsApp | 28,5 |
| **Total técnico** | **US$ 61,4** ≈ $58.300 CLP |

La aritmética token por token está en `stack.html`. Este número es exactamente el que `negocio.html`
descuenta del margen: $1.794.500 − $117.800 = **93,4 %** de margen bruto.

### Qué está falseado en el demo

- **No hay backend.** Todo corre en el navegador.
- **El lector no llama a la API.** Las 9 observaciones están escritas a mano; la extracción es una
  animación.
- **El proyecto Sierra Ancha no existe**, ni la Compañía Minera Altoandina, ni el ICSARA 0417/2026.
- **Todos los plazos marcados `por validar` son literalmente eso: no verificados contra la norma.** Son
  estimaciones plausibles para que el modelo corra.
- El calendario de feriados es aproximado. La ventana de terreno no es una norma: es una restricción de
  faena, configurable.
- No hay autenticación, ni persistencia, ni auditoría.

**Lo que sí es real:** el motor de ruta crítica (mismo código que correría en producción), los servicios
y permisos citados, y el comportamiento no lineal — que un mes de atraso cueste tres meses porque se
pierde una ventana de terreno es exactamente lo que pasa en un proyecto a 4.050 m.

---

## Los cinco archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Producto — el problema, el simulador en vivo, precios, la conversación incómoda sobre la reforma, FAQ |
| `demo/index.html` | El plano (grafo), la ruta crítica, la lista, los relojes legales y el lector de ICSARA |
| `negocio.html` | ICP, TAM/SAM/SOM con la aritmética, competencia, economía unitaria, canales, 90 días, qué lo mata |
| `roadmap.html` | 6 hitos con criterio de muerte, 4 gráficos, probabilidad como rango derivado |
| `stack.html` | Modelo de datos, agentes, APIs, variables de entorno, costo token por token, qué está falseado |
