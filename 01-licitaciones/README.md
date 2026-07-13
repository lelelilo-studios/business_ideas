# Adjudate

**adjudate.com** · *Deja de perder licitaciones por el Anexo N°4.*

Un feed de licitaciones de Mercado Público filtrado por la capacidad real de la empresa,
y un taller donde la postulación se arma, se revisa y se valida antes de subirla.

---

## El problema

En Mercado Público hay miles de licitaciones abiertas en cualquier momento. La PYME que
podría ganarlas no las ve, porque el correo de alerta de ChileCompra llega con 40
oportunidades irrelevantes y una buena. Y cuando postula, postula contra el reloj:
bases técnicas de 80 páginas, anexos, boletas de garantía, plazos que vencen a las 15:00
de un martes.

El resultado es que muchas PYMEs simplemente **no postulan**, o postulan mal y **quedan
fuera por un tecnicismo**: un anexo que faltaba, una firma, una boleta mal emitida.
No pierden por precio ni por calidad. Pierden por formalismo.

**Lo que hacen hoy en vez de usarnos:** el correo de alerta de ChileCompra, un Excel con
las licitaciones que alcanzaron a ver, un gestor freelance a $150.000–$400.000 por
postulación, o directamente no postular.

## La ventaja injusta

Los oferentes de cada licitación son **dato público**. Sabemos por nombre, RUT y monto
quién perdió, contra quién y por cuánto. Eso nos da dos cosas que casi ninguna startup
B2B tiene el día 1:

1. **Una estimación de probabilidad de adjudicación** que no es un adjetivo: sale del
   histórico real de ese comprador, en ese rubro, con esa cantidad de oferentes.
2. **Una lista de prospectos perfectamente enumerable.** Todo el que aparece con
   `ganador = false` es un cliente potencial, y sabemos exactamente qué perdió.

## El producto

| Superficie | Qué hace |
|---|---|
| **Feed** | Licitaciones puntuadas contra el perfil real de la empresa (rubro, región, dotación, capital, experiencia, certificaciones). Con el bloqueo señalado en rojo antes de que pierdas la tarde. |
| **Bases** | Claude lee el PDF y extrae cada requisito **con su cita textual y su página**. Si no puede citarlo, no lo emite. |
| **Competencia** | El histórico de adjudicaciones del mismo comprador: quién gana siempre acá, en qué banda de precio, cuántos se presentan. |
| **Simulador de precio** | La fórmula real de evaluación económica de Mercado Público (`precio_menor / tu_precio × ponderador`), con tu margen bruto al lado. |
| **Taller** | Los anexos y la propuesta técnica redactados por IA, en un textarea editable. Nunca se marca como listo sin que un humano lo toque. |
| **Chequeo** | Un modelo distinto al que redactó revisa el paquete completo. Si falta algo obligatorio, **bloquea el botón de envío**. |
| **Envío** | Genera el .zip y el folio, y te da la checklist de 5 pasos para subirlo a mano al portal. Porque *no existe una API para enviar ofertas.* |

### Lo que NO hacemos, a propósito

**Mercado Público no tiene endpoint de envío de ofertas.** Podríamos automatizarlo con un
navegador headless manejando la clave del cliente. No lo vamos a hacer: guardar la clave
de Mercado Público de una PYME es una responsabilidad que no queremos, y si el portal
cambia un selector, el cliente pierde $80 millones por nuestra culpa. Preparamos el
paquete y guiamos el handoff humano.

**El match no es IA.** Es una función pura de 60 líneas — rubro 30 + región 15 +
dotación 20 + capital 15 + experiencia 10 + certificaciones 10, ajustada por oferentes
históricos. Un cliente que pierde tiene derecho a saber por qué le mostramos (o no) una
oportunidad, y *"el modelo dijo"* no es una respuesta que se le pueda dar a alguien que
acaba de perder un contrato.

---

## Negocio

**ICP:** PYME de servicios generales (aseo, mantención, áreas verdes, alimentación),
10–80 trabajadores, $200M–$2.000M en ventas, con ≥1 adjudicación en los últimos 24 meses.
RM + Valparaíso. Firma el dueño; usa la persona que hoy arma las postulaciones a mano.

### Precio

| Plan | CLP/mes | Para quién |
|---|---|---|
| Alerta | $0 | El feed filtrado. Es el lead magnet, no un negocio. |
| Postulante | $59.000 | 1 postulación armada al mes. |
| **Adjudica** | **$149.000** | **El plan real.** Postulaciones ilimitadas hasta el tope, competencia, simulador. |
| Consorcio | $390.000 | Multi-empresa / holding, sobre el tope de uso. |

**Sin success fee.** Alinea mal el incentivo (nos convendría que postules a todo), a los
compradores les incomoda, y el flujo de caja es impredecible.

### Mercado (aritmética, no adjetivos)

```
TAM Chile = 30.000 empresas que postulan × $1.140.000/año  = $34.200M CLP ≈ US$35,6M ARR
SAM       =  9.000 (servicios, tamaño y frecuencia)         = $10.260M CLP ≈ US$10,7M ARR
SOM 36m   =  4% del SAM = 360 clientes                      =    $410M CLP ≈ US$427k ARR
```

**La conclusión incómoda:** con un TAM de US$35M, **Chile solo es un lifestyle business.**
Un buen negocio de US$400k ARR con 5 personas — pero no una startup de riesgo. La tesis
de venture exige LatAm (SEACE en Perú, SECOP II en Colombia, CompraNet en México, PNCP en
Brasil), que es ~8–10× Chile. **Eso hay que decidirlo antes de empezar, no en el mes 20.**

### Unit economics

```
ARPU = 0,65×59.000 + 0,30×149.000 + 0,05×390.000 = $102.550
       menos descuento anual                      → $95.000

COGS = IA $6.500 + infra $2.100 + soporte humano $8.000 = $16.600
Margen bruto = (95.000 − 16.600) / 95.000 = 82,5%

Churn 4%/mes → vida 25 meses
LTV = 95.000 × 82,5% × 25 = $1.959.375
CAC = $260.000
LTV/CAC = 7,5×    Payback = 3,3 meses
                                       (USD 1 = $960 CLP)
```

### Competencia

El incumbente real es **el Excel + el correo de alerta de ChileCompra**. Después:
LicitaLAB, los gestores freelance a $150k–$400k por postulación, los estudios jurídicos.
Categoría probada afuera: SAM.gov (US), TED (EU), GovDash, Sweetspot, Loopio, Responsive.

**El riesgo existencial es ChileCompra**, que podría lanzar algo parecido gratis.

---

## Roadmap y honestidad financiera

Seis hitos, día 1 → mes 24, **cada uno con su criterio de muerte escrito antes de empezar.**

| # | Cuándo | Hito | Criterio de muerte |
|---|---|---|---|
| 1 | m0–3 | Validación con 8 design partners | Si pierden por precio y no por formalismo, el producto no ataca la causa. Se para en el mes 3. |
| 2 | m4–6 | Primer cliente pagando (≥3) | Si <3 de 8 design partners pagan al cobrarles, "me encanta pero no lo pagaría" es un NO. |
| 3 | m7–9 | **Primeros 10 · valle de caja** | Sin 10 clientes en el mes 9 no se levanta ronda con esa tracción. O CAC >$450.000 → el canal no existe. |
| 4 | m10–15 | Venta repetible sin fundadores | Retención a 6 meses <55% → los clientes se van porque no ganan. El negocio no tiene fondo. |
| 5 | m16–23 | Escala de canal + Perú (SEACE) | Ningún canal escala y Perú no despega → esto es una consultora con software. |
| 6 | m24 | **Levantar / bootstrapear / matar** | El default es **matar**. Si hay que argumentar mucho para seguir, la respuesta ya es no. |

### Los tres números que duelen

- **Valle de runway: mes 9, con $6,4M en caja.** Se parte con $60M, quemando $7M/mes.
- **En el escenario base NO cruzamos punto de equilibrio en 24 meses.** Ingreso neto
  $21,2M/mes contra una quema de $28M/mes. Por eso el mes 24 es una decisión real.
- **La retención está atada a un resultado que sólo controlamos a medias.** Los clientes
  que se adjudican algo en 90 días retienen 76% a 12 meses. Los que no ganan nada, 24%.
  Mezclado a un 42% de éxito: **46%** → churn implícito 6,3%/mes, peor que el 4% del plan.

De ahí salen las dos decisiones de producto menos obvias:

1. **Calificar duro en la venta.** Si el feed de un prospecto no le muestra
   oportunidades ganables, **le decimos que no nos pague.** Vender a quien no puede
   ganar es comprar churn con descuento.
2. **Vender también el ahorro de horas.** Las horas las controlamos al 100%; las
   adjudicaciones no. Es la red de seguridad contra ese mismo gráfico.

### Probabilidad de éxito — rango, con derivación

```
Clase de referencia: SaaS B2B que llega a US$1M ARR ≈ 5-10%  → tomamos 7%
  (No existe una serie chilena confiable para esto. No la vamos a inventar.)

Al alza:   presupuesto ya existe ×1,4 · outbound sobre dato público ×1,6 · cuña afilada ×1,2 = 2,69
A la baja: TAM chico ×0,7 · riesgo ChileCompra ×0,8 · retención atada a outcome ajeno ×0,8 = 0,448

7% × 2,69 × 0,448 = 8,4%   →  con ±40% de incertidumbre sobre los ajustes:
```

| Resultado | Probabilidad |
|---|---|
| **US$1M ARR en 36 meses** (caso Serie A) | **5 – 12%** |
| **Negocio rentable de nicho** (US$300–500k ARR, equipo de 5) | **30 – 40%** |
| **Muerte total** (cierre o abandono en 24 meses) | **50 – 60%** |

**Esta idea es mucho mejor negocio pequeño que negocio grande**, y el análisis lo dice
sin ambigüedad.

---

## Arquitectura

**Backend Python** (FastAPI + workers), **PostgreSQL**, frontend React. Python porque el
70% del trabajo real es pipeline de documentos (PDF → OCR → texto → extracción).

### Los cinco agentes

| Agente | Modelo | Corridas/cliente/mes | Por qué ese modelo |
|---|---|---|---|
| Lector de bases | `claude-sonnet-5` | 8 | Volumen alto, tarea acotada. No puede emitir un requisito sin llamar a `citar_fuente()`. |
| Redactor de anexos | `claude-opus-4-8` | 12 | Calidad de prosa. Bases en caché de 5 min (1,25× escritura, 0,1× lectura). |
| **Chequeador** | `claude-opus-4-8` | 3 | **El que no puede fallar.** Conversación limpia, sin ver el razonamiento del redactor: no le pedimos al que escribió que se corrija a sí mismo. |
| Analista de competencia | `claude-sonnet-5` | 8 | Con <3 adjudicaciones históricas tiene prohibido concluir. |
| Clasificador de feed | `claude-haiku-4-5` | 3.000/mes (plataforma) | Alto volumen, baja apuesta. Sin Batch API: el feed debe estar fresco a las 8 AM. |

### Costo de IA — la aritmética

```
1. Lector      Sonnet 5 · 8 × (38k in + 5k out)                    = US$ 1,51
2. Redactor    Opus 4.8 · caché 5min + 12 docs                     = US$ 2,13
3. Chequeador  Opus 4.8 · 3 × (45k in + 3k out)                    = US$ 0,90
4. Competencia Sonnet 5 · 8 × (20k in + 1,5k out)                  = US$ 0,66
5. Clasificador Haiku 4.5 · $12/mes plataforma ÷ 66 clientes       = US$ 0,18
                                                          Subtotal = US$ 5,38
                          + 25% reintentos, evals y desperdicio    = US$ 1,35
                                                          ─────────────────────
                                                             TOTAL = US$ 6,73
                                              × $960 CLP ≈ $6.500 / cliente / mes
```

Existe una tabla `evento_ia` (modelo, tokens, costo, latencia) porque **sin ella el COGS
de arriba es una fantasía.** Con ella es un dashboard, y sabemos qué cliente nos cuesta plata.

### APIs a contratar

- **API Mercado Público** — existe, es gratis, requiere un *ticket* que entrega ChileCompra.
- **Descarga de bases (los PDF adjuntos)** — hay que bajarlos del portal. **Es la
  dependencia más frágil del sistema** y hay que monitorearla como producción crítica.
- **Envío de ofertas** — **no existe.** Handoff humano, por diseño.
- **SII** — sin API para terceros. El cliente sube su Carpeta Tributaria en PDF.
- Anthropic · Khipu/Transbank · WhatsApp Business · Resend.

---

## Qué está fingido en la demo

La demo corre entera en el navegador: **sin servidor, sin base de datos, sin una sola
llamada a la API de Claude.**

| Real | Fingido |
|---|---|
| El motor de match y la probabilidad (**es la función que iría a producción**) | Las 12 licitaciones (formato real, datos inventados) |
| La fórmula del simulador de precio (la real de Mercado Público) | La extracción de requisitos (pre-escrita a mano) |
| El chequeo que bloquea el botón de envío | "Redactar con IA" (plantilla con `setTimeout`) |
| El handoff humano del envío (*eso sí pasa en producción*) | Login, pagos, persistencia (recargar reinicia todo) |

---

## Las 3 cosas que habría que configurar para que esto sea real

1. **El ticket de la API de Mercado Público**, y encima de eso el pipeline de descarga de
   bases desde el portal — que es la pieza frágil y sin contrato de la que depende todo
   el producto.
2. **La cuenta de Anthropic con presupuesto por cliente** (`TOPE_USD_CLIENTE_MES`) y la
   tabla `evento_ia` instrumentada desde el día 1, o el margen bruto de 82,5% es ficción.
3. **La métrica que domina a todas las demás: qué fracción de clientes se adjudica algo
   en 90 días.** Se instrumenta desde el cliente número uno. Si es >50%, el plan se
   sostiene. Si es <30%, ninguno de los tres escenarios ocurre.

---

## Estructura

```
01-licitaciones/
├── index.html          Landing (con el lector de bases funcionando en vivo)
├── demo/index.html     El producto: 6 pasos, estado real, 12 licitaciones
├── negocio.html        ICP, TAM/SAM/SOM, precio, unit economics, canales, killers
├── roadmap.html        6 hitos con criterio de muerte + 4 gráficos SVG a mano
├── stack.html          Modelo de datos, 5 agentes, APIs, env vars, costo, lo fingido
├── estilo.css          "El Expediente" — Newsreader + IBM Plex Mono, un solo acento
├── meta.json
└── README.md
```

**Dirección de arte:** *El Expediente* — la burocracia chilena reeditada con criterio:
papel oficio color crema, tinta casi negra, filetes de 1px en vez de tarjetas con sombra,
cero esquinas redondeadas, y un solo acento — el bermellón del timbre "RECIBIDO".
Datos duros (ID, RUT, CLP, plazos) en mono; la prosa en serif.
