# Talonio

**La boleta que botaste era plata.**

`talonio.com` — verificado libre (RDAP Verisign → HTTP 404, 2026-07-13). `talonio.cl` también.

Foto de la boleta → la IA extrae monto, RUT, IVA y fecha → se concilia contra la cartola del banco →
aparece en el F29 pre-armado. El contador revisa, firma y presenta. Nosotros no presentamos nada.

- [Producto](index.html) · [Demo](demo/index.html) · [Negocio](negocio.html) · [Roadmap](roadmap.html) · [Arquitectura](stack.html)

---

## El problema

El SII ya tiene tus facturas electrónicas. Ése no es el problema.

El problema es **lo que nunca fue factura**: la bencina que cargaste con tu tarjeta personal y te dieron
boleta, los $71.400 de la ferretería, el almuerzo de la faena, el estacionamiento. Eso no está en el SII,
**no da crédito fiscal** y son cientos de miles de pesos al año.

Una boleta no da derecho a crédito fiscal. Punto. Pero la mayoría de esos proveedores **sí factura si se
la pides** — Sodimac, Copec, Líder, Easy tienen ese proceso. Talonio detecta la boleta, cuantifica lo que
estás perdiendo y le pide la factura de reemplazo al proveedor antes de que venza el plazo.

**La cuenta, para la PYME del demo** (maestranza de 14 personas, Quilicura):

| | |
|---|---|
| Gasto con boleta o tarjeta personal, junio 2026 | $1.355.530 |
| De eso, proveedores que sí facturan | $1.217.200 |
| IVA recuperable (19/119) | **$194.343 / mes** |
| IVA que se pierde igual (proveedores que no facturan) | $22.086 / mes |
| **IVA botado al año** | **$2.597.148** |

Paga $34.900 al mes por el producto. **El producto se paga solo el día 3.**

---

## Negocio

### A quién le vendemos: al contador

Hay dos personas y confundirlas cuesta el negocio entero. **Rodrigo**, dueño de la maestranza, *sufre* el
problema. **Patricia**, contadora con 43 RUT en cartera, *firma* el cheque. No son la misma.

La decisión no es estética, es aritmética:

| Por RUT activo | Vía contador | Directo a PYME |
|---|---|---|
| Precio (ARPU) | $7.900 | $34.900 |
| COGS | $2.911 | $2.911 |
| Margen bruto | $4.989 (63%) | $31.989 (92%) |
| CAC | $20.000 | $180.000 |
| **Payback** | **4,0 meses** | **5,6 meses** |
| Churn mensual | 4,0% | 5,5% |
| LTV | $124.725 | $582.200 |
| **LTV / CAC** | **6,2×** | **3,2×** |

La trampa: el margen bruto por RUT es mucho mejor en el plan directo (92% vs 63%), y un análisis perezoso
concluiría "vende directo". Lo que decide es el **CAC**: una venta al contador cuesta 9 veces más pero trae
**21 RUT de una**. Y el CAC directo *sube* con el volumen (los ads se encarecen), mientras que el del
contador *baja* (el gremio es chico y se recomienda entre sí).

El contador es además el **guardián**: si él dice que no, la PYME no lo usa aunque le encante.
Por eso Talonio **nunca presenta el F29** — lo presenta él. No lo reemplazamos: le devolvemos ~100 horas al mes.

### Precio

- **Estudio** (contador, por RUT activo/mes): $12.900 (1–10) · $9.900 (11–30) · **$7.900 (31+)**
  Un contador con 43 RUT paga $339.700/mes — el **7%** de lo que él le factura a esos mismos clientes.
- **Empresa** (PYME directa): **$34.900/mes** por RUT, con un asiento gratis para su contador.
- Piloto: 5 RUT gratis por 2 meses, sin tarjeta.

### Mercado (Chile)

| | Derivación | Resultado |
|---|---|---|
| **TAM** | 215.000 PYMEs formales × $34.900 × 12 | **$90.042 MM CLP ≈ US$94 M** |
| **SAM** | 96.750 (45% con gasto fuera del DTE) × $16.000 ARPU mix × 12 | **$18.576 MM ≈ US$19,4 M** |
| **SOM 36m** | 5.500 RUT vía contador + 1.100 directos | **$982 MM ≈ US$1,02 M ARR** |

El supuesto más frágil es el 45%. Es contrastable con 40 entrevistas: si baja al 25%, el SAM cae a
US$10,7 M y hay que salir de Chile antes.

### Competencia

- **La caja de zapatos y el WhatsApp al contador el día 18** — el verdadero titular. Cuesta $0.
  Ganamos poniéndole un número al desorden, no compitiendo en orden.
- **Nubox** — tiene el canal contador. Riesgo #1 de copia. El foso no es el OCR (una tarde de trabajo):
  es el mapa de qué proveedor chileno factura, cómo y en qué plazo.
- **Chipax** — el más cercano en conciliación bancaria, pero entra por la tesorería, no por el gasto,
  y no arma el F29. El comprador más probable.
- **Defontana** (ERP, otra liga), **Bsale** (POS, otro problema).
- **Dext / Hubdoc** — validan el modelo entero afuera (ambos terminaron adquiridos). Ninguno hace el F29
  chileno, ni baja el RCV del SII, ni concilia una cartola del Banco de Chile.

### Canales, rankeados

1. **Contadores y estudios** — el canal, no *un* canal. LinkedIn, Colegio de Contadores, grupos de
   WhatsApp del gremio, cursos de actualización tributaria.
2. **Software PYME como reventa** (Nubox, Defontana, Bsale, Chipax) — alto retorno, alto riesgo:
   es enseñarle a tu competidor qué construir. Sólo después de M3.
3. **Gremios del rubro cabeza de playa** — CChC, ASECH, cámaras comunales. Charla: *"cuánto IVA botó tu
   empresa el año pasado"*, con la calculadora en vivo.
4. **SEO long-tail** — "cómo pedir factura de una boleta de Sodimac", "código 520 F29". Poco volumen,
   intención enorme: quien busca eso está perdiendo plata en ese momento.
5. **WhatsApp outbound** a maestranzas y constructoras chicas.
6. **Google Ads** — sólo plan Empresa, techo del 15% del presupuesto. CAC $180.000, LTV/CAC 3,2×.

**No**: Meta Ads (segmentación B2B contable mala), Mercado Público (no aplica).

### IA en el marketing

- **Sí:** las ~400 páginas de SEO por proveedor (factual, verificable, imposible a mano). Regla dura:
  ninguna se publica sin que una persona haya hecho el trámite y confirmado que el instructivo funciona.
- **Sí:** calificar leads de contadores (estimar tamaño y rubro de su cartera antes de llamar).
- **No:** los posts del fundador. En un gremio chico y conservador, el contenido con olor a IA te marca
  como "otro más" y quema el canal.
- **No:** chatbot de soporte el año 1. Con 40 clientes contesta el fundador: cada pregunta es una
  entrevista de producto gratis.

### Qué mataría esto

1. **Que el SII lo haga gratis.** El Portal MIPYME ya ofrece contabilidad simplificada y propuesta de F29
   sin costo. El día que agregue captura de boletas con IA, el producto muere en seis meses. No se compite
   contra $0 con el organismo que además fija las reglas. Mitigación real pero delgada: el SII no va a
   perseguir facturas de reemplazo con Sodimac ni conciliar tu cartola.
2. **Que el contador nos cierre la puerta.** Parte de su valor es la asimetría de información. Un producto
   que le muestra al dueño su resultado del mes se la quita. Contrastable en la semana 1, con 8 entrevistas.
3. **Que Nubox lo copie antes de que tengamos foso.**

---

## Roadmap · día 1 → mes 24

Arranque: 1 de septiembre de 2026.

| Hito | Fecha | Qué es cierto si lo lograste | MRR | Criterio de muerte |
|---|---|---|---|---|
| **M0** Validación | Mes 0–2 | 5 PYMEs suben ≥15 docs/mes **sin que se los pidamos**; 3 contadores nos abren su cartera | $0 | Si a las 6 semanas menos de 4 de 5 suben solas: **el hábito no existe**. Parar. |
| **M1** Primer pagando | Mes 4 | Un contador con 12 RUT paga precio de lista tras presentar un F29 real | $118.800 | Si el contador que **más usó** el producto no paga en 60 días, el WTP del canal es cero. |
| **M2** Primeros 10 | Mes 8 | 10 contadores, 195 RUT, CAC real dentro del rango modelado | $2,3 M | CAC por contador > **$900.000** (2,1× lo modelado) → la economía no cierra. |
| **M3** Venta repetible | Mes 12 | La venta no depende del fundador; el contador promedio pasó de 3 a >15 RUT migrados | $9,7 M | Retención de RUT a 6 meses < **90%**, o contador promedio estancado bajo 8 RUT. |
| **M4** Escala de canal | Mes 18 | 85 contadores, 2.290 RUT; se abre la conversación de reventa | $30,4 M | Nubox/Defontana lanza captura con IA **gratis en su plan base** y nos iguala en 2 trimestres → vender o pivotar. No se pelea. |
| **M5** Decisión | Mes 24 | 160 contadores, 4.100 RUT, flujo positivo desde el mes 22 | $51,3 M | Si el SII lanza esto gratis **en cualquier momento** del mes 1 al 24, se activa sin importar el ARR. |

**Mes 24 — la regla de decisión:** ARR > US$600k y NRR > 105% → **levantar Serie A** (el techo chileno es
US$19 M de SAM: se financia México, no se estira Chile). ARR US$300–600k con flujo positivo →
**bootstrapear**. ARR < US$300k → **vender o cerrar**.

### Caja

- Mes 0: $28 M de los fundadores · Mes 4: pre-seed $120 M · Mes 14: seed $480 M (≈US$500k).
- Quema: $5,6 M (2 personas) → $10 M (3) → $17 M (5) → $22 M y $30 M (9) → $43 M (13).
- **Valle 1 — mes 3: $11,2 M.** Dos meses de quema. Si la pre-seed no cierra, se acabó antes de empezar.
- **Valle 2 — mes 13: $39,1 M.** 1,8 meses de quema con 9 personas. Si la seed no cierra en el mes 14, la
  única salida es **congelar el headcount en 5**: con quema de $17 M y MRR ya en $12,6 M, la empresa
  sobrevive y llega a flujo positivo hacia el mes 17, creciendo mucho más lento. Ésa es la rama bootstrap,
  y hay que tomarla **antes** de contratar, no después.
- **Flujo positivo:** el MRR pasa a la quema por primera vez en el mes 18 ($30,4 vs $30,0 M) — y dura un
  mes, porque en el 19 se contrata al equipo de 13 y vuelve a negativo. Queda positivo de verdad en el
  **mes 22** ($45,3 vs $43,0 M). El break-even que cuenta es el que sobrevive a la siguiente contratación.

### La restricción real: el embudo del contador

| Etapa | Contadores | Conversión |
|---|---|---|
| Contactados | 1.000 | — |
| Agendan demo | 260 | 26,0% |
| Hacen piloto (≥3 RUT) | 95 | 36,5% |
| **Convierten a pago** | **42** | **44,2%** ← aquí se cae el 56% |
| Escalan a >15 RUT migrados | 30 | 71,4% |

Un contador que se queda en 3 RUT no es un cliente: es un costo de soporte. **Toda la ingeniería del año 1
apunta a un solo número: hacer que migrar el RUT #4 sea trivial.**

### Probabilidad de éxito

**Clase de referencia.** La literatura de benchmarks SaaS (Bessemer, ChartMogul, SaaS Capital) sitúa entre
**5% y 10%** la fracción de startups SaaS B2B con producto lanzado que alcanza US$1 M de ARR. Segunda clase:
conversión seed → Serie A, ~25–35% en EE.UU. y del orden de **15–20% en LatAm**.

**Y la parte honesta:** *no existe* una tasa base publicada y confiable para "SaaS B2B **chileno** que llega
a US$1 M de ARR". No la tenemos y no la vamos a inventar. Ese dato sí existe — está en los portafolios de
Start-Up Chile, Corfo y los fondos locales — pero no es público. Construirlo es tarea previa a invertir.

**Ajustes hacia arriba:** el presupuesto ya existe (la PYME ya le paga a un contador); deadline regulatorio
mensual e ineludible; canal de distribución preexistente y concentrado (250 contadores = 5.500 RUT); cuña
afilada; ROI demostrable con los datos del propio cliente el primer mes.

**Ajustes hacia abajo:** dependencia regulatoria total (el SII); el canal es también el guardián; titulares
con el canal capturado; techo local de US$19 M; churn estructural (las PYMEs chicas se mueren).
Casi todos son **binarios**, y por eso ensanchan el rango en vez de moverlo.

> ### 12 – 20%
> de alcanzar **US$1 M de ARR al mes 36**, incondicionalmente.
>
> - **25 – 35%** — *condicional a cumplir M3 en el mes 12* (30 contadores, 740 RUT, retención >90%).
> - **< 5%** — si M3 no se cumple. Y en ese caso su criterio de muerte ya se activó: la decisión no es
>   "seguir con menos probabilidad", es **parar**.

El mes 12 no es un checkpoint de vanidad: es la fecha en que la probabilidad de este negocio se duplica
o se hace cero.

---

## Arquitectura

PWA con captura **offline** (la señal en una obra es mala — esa restricción, sacada del cliente y no de una
preferencia técnica, define media arquitectura) + cola asíncrona + PostgreSQL.

### La regla que hace esto creíble

> Un modelo de lenguaje **lee papeles y propone hipótesis**. No suma, no calcula el F29 y no decide una
> conciliación. Toda cifra que termina en un formulario del SII sale de aritmética determinística, auditable
> y con test unitario. Un producto contable que le pide a un LLM que sume no es un producto contable: es una
> demanda esperando ocurrir.

### Los cinco agentes

| Agente | Modelo | Qué hace |
|---|---|---|
| **Extractor** | `claude-haiku-4-5-20251001` (visión) | Lee la foto → JSON con **confianza por campo** y `bbox`. Regla dura: si un campo monetario baja de 0,85 de confianza, **no adivina** — devuelve el recorte y pide confirmación. |
| **Clasificador** | `claude-haiku-4-5-20251001` | Cuenta contable y categoría tributaria. El 70% de los docs son de un proveedor ya visto y **ni siquiera llaman al modelo**. |
| **Conciliador** | `claude-sonnet-5` (sólo el 12% difícil) | Un motor determinístico resuelve el 88% gratis. El resto va a Sonnet, que **propone y nunca decide**. |
| **Revisor de F29** | `claude-sonnet-5` (1×/mes) | **No calcula el F29.** Compara con los 6 períodos previos y levanta anomalías, para el contador. |
| **Rescate** | `claude-sonnet-5` + Playwright | Le pide al proveedor la factura de reemplazo por la boleta. El componente **más frágil** — y el único que no se copia en un trimestre. **El foso es el trabajo sucio.** |

### Qué hay que contratar

- **SimpleAPI / OpenFactura** (~US$820/mes a 4.100 RUT) — RCV y DTE del SII. **No scrapear el SII**: no hay
  API REST pública, el acceso es con certificado digital y el portal cambia sin aviso.
- **Fintoc** (~US$0,45/cuenta/mes = $432/RUT) — cartolas, sólo lectura. Chile aún no tiene finanzas abiertas
  operativas (Ley Fintec 21.521, en implementación por la CMF). **La carga de CSV es gratis y es el default.**
- **WhatsApp Business API** (~US$0,02/conversación) — en Chile nadie instala una app nueva.
- **Flow / Khipu** (~2,95% + IVA) — cobro de la suscripción.
- **Firma electrónica avanzada: $0 — no la tocamos.** El contador ya la tiene y es él quien firma. Presentar
  un F29 mal declarado es responsabilidad legal; no tomar ese riesgo es también lo que hace que nos deje entrar.

### Costo mensual (la aritmética que descuenta el margen)

**IA por RUT/mes**, con 115 documentos: extractor US$0,477 + clasificador US$0,104 + conciliador US$0,273 +
revisor US$0,173 + evals US$0,135 = **US$1,1606 × $960 = $1.114 CLP**.

| COGS por RUT / mes | Mes 12 · 740 RUT | Mes 24 · 4.100 RUT |
|---|---|---|
| Inferencia de IA | $1.114 | $1.114 |
| APIs de terceros | $896 | $854 |
| Infraestructura | $285 | $119 |
| Soporte humano | **$2.284** | $824 |
| **Total** | **$4.579** | **$2.911** |
| ARPU | $13.108 | $12.510 |
| **Margen bruto** | **65,1%** | **76,7%** |

El margen del mes 12 no es el del mes 24, y lo que lo aprieta **no es la IA: es el soporte humano**.
A escala: 4.100 × $2.911 = **$11.935.100/mes** de COGS contra un MRR de **$51.290.000** → 76,7%.
Es el mismo número que usa `negocio.html`.

### Qué está falseado en el demo

- **La extracción no existe.** Los datos están escritos a mano en el JS. Es un `setInterval` con una
  animación de barrido. Ninguna llamada a ningún modelo.
- **Si sacas una foto real, no la leemos.** El botón sí abre tu cámara (`<input capture="environment">`),
  pero la foto se queda en tu navegador y los datos que aparecen son los del ejemplo. El demo lo dice en
  pantalla en vez de fingir que leyó tu papel.
- **La conciliación es una tabla de `if`** sobre 12 movimientos escritos a mano.
- **El F29 está simplificado** (9 códigos de 90+), **pero la aritmética es real**: el IVA es 19% exacto,
  débito − crédito da el impuesto determinado, y el aporte de Talonio ($194.343) es la suma verificable de
  las cinco facturas rescatadas. Revísalo con una calculadora.
- **El rescate de la factura es teatro.** En la realidad es un agente navegando un portal que se cae.
- **Las empresas y los RUT son ficticios.** Usamos los *nombres* reales de Copec, Sodimac y Líder porque son
  donde de verdad se fuga el IVA de una PYME chilena, pero no afirmamos ningún dato real sobre ellas.

**Lo que NO está falseado:** el comportamiento. Que la IA dude cuando el papel está desteñido, que se niegue
a elegir entre dos conciliaciones que dan el mismo monto, que te diga que la boleta no da crédito fiscal en
vez de simular que sí — **eso es exactamente cómo tendría que comportarse el sistema real.** Un producto
contable que finge certeza absoluta no es creíble.

---

## Marca y dominio

**Talonio** — de *talonario*: el objeto donde vivía la contabilidad chilena antes de que existiera el
software, y donde todavía vive la mitad. Acuñado, tres sílabas, se escribe como suena.

```
$ ./_kit/check-domain.sh talonio cuadraje foliario cerofuga

talonio     .com AVAILABLE  (http 404)   .cl AVAILABLE
cuadraje    .com AVAILABLE  (http 404)   .cl AVAILABLE
foliario    .com AVAILABLE  (http 404)   .cl AVAILABLE
cerofuga    .com AVAILABLE  (http 404)   .cl AVAILABLE
```

RDAP de Verisign (autoritativo para `.com`) responde **HTTP 404** = no registrado. Verificado el
**13 de julio de 2026**. Alternativas: `cuadraje.com`, `foliario.com`, `cerofuga.com`
(`tirilio.com` también libre, de reserva).

## Dirección de arte

**"Papel de caja: crema, tinta y timbre."**

La contabilidad chica de Chile vive en papel: la boleta térmica del mesón, el talonario, el timbre de goma.
En vez de huir de eso hacia el SaaS azul de siempre (Defontana, Bsale y Nubox se ven todos igual), el
producto lo abraza y lo moderniza. La página **es** un documento: fondo crema, tinta casi negra, reglas
finas de libro contable, y **un** acento — el rojo del timbre — que sólo aparece donde hay una acción o una
cifra que importa.

- **Fraunces** (display) + **Archivo** (UI) + **Courier Prime** (todos los documentos, cifras, RUT y folios).
  Si parece salido de una impresora térmica, el contador confía. Ninguna es Inter ni Poppins.
- Sin modo oscuro: el papel no tiene modo oscuro. Es una decisión, no un olvido.
- Paleta de gráficos validada con `validate_palette.js` de la skill `dataviz` sobre la superficie `#FBF7EE`:
  categórico `#0B7CA8` / `#C1391C` (CVD ΔE 66,7 — muy por sobre el umbral de 12), rampa ordinal roja para
  los escenarios de MRR y azul para el embudo. Cada figura tiene su vista de tabla.

## Stack de este prototipo

HTML/CSS/JS a mano. Sin build, sin framework, sin CDN. Gráficos en SVG inline. Estado del demo en el
navegador. Se abre el archivo y funciona.

```bash
python3 -m http.server 8000
```
