# Antefirma

**antefirma.com** — verificado libre (RDAP Verisign → HTTP 404, 12-jul-2026).
Alternativas verificadas, también HTTP 404: `prefirma.com`, `fojaroja.com`, `clausara.com`.
`antefirma.cl` también está libre (NIC Chile: «no existe»).

> **Antefirma** es una palabra jurídica real en castellano: el bloque de texto que va sobre la
> firma en un documento. Y se lee también como **ante-firma**: antes de firmar. Es el producto
> entero en una palabra que ya existía.

**Pitch:** subes el contrato y en minutos sabes qué cláusulas te van a doler, cuánto te van a
costar en pesos y qué texto exacto pedir que cambien — y después te vigilamos las fechas que
muerden durante los tres años que dura.

**Dirección de arte:** *marginalia jurídica* — papel de expediente, tipografía de imprenta legal
(Spectral + IBM Plex Mono), numerales de cláusula colgando en el margen, y una sola tinta roja de
corrector que aparece únicamente donde hay peligro. El rojo no decora: acusa.

---

## El negocio

### El problema

Una PYME chilena firma un contrato de arriendo de local en un strip center. Son 14 páginas
escritas por el abogado del mall, para el mall. Un abogado cobra 5–15 UF y se demora una semana;
el local se arrienda ahora o se lo lleva otro. Así que se firma.

**El daño no llega el día que firmas. Llega dos años después**, cuando descubres que el contrato
se renovó solo por 36 meses más porque nadie mandó una carta certificada ante notario 120 días
antes de una fecha que nadie anotó.

No competimos con un abogado. **Competimos con «nadie lo leyó».**

### Cliente objetivo

PYME de retail, gastronomía y servicios, 3–60 empleados, ventas de 2.400 a 25.000 UF/año
(«pequeña empresa» según la Ley 20.416). Firma el dueño o socio gerente — la misma persona que
firmó el contrato, que se acuerda del susto, y que puede aprobar $39.000/mes sin comité.

Está **con su contador**, que es la única persona externa a la que la PYME chilena le muestra los
papeles. Ése es el canal.

### Mercado (aritmética completa en `negocio.html`)

| | Chile | Derivación |
|---|---|---|
| **TAM** | US$172M/año | 235.000 empresas pequeñas + medianas (SII) × $58.000 ARPU × 12 ÷ 950 |
| **SAM** | US$70M/año | 95.000 con arriendo comercial o contrato marco con una empresa grande |
| **SOM (36 m)** | US$513K/año | 700 clientes = 0,74% del SAM |

El supuesto más frágil es el 28% de PYMEs con local arrendado. **Se mide con 100 llamadas al padrón
de un gremio, y es lo primero que hay que hacer.**

### Competencia

| Quién | Precio | Le ganamos en | No le ganamos en |
|---|---|---|---|
| **«Nadie lo leyó»** — el titular real del puesto | $0 | Todo | Distribución: hay que enterarlos de que existimos |
| ChatGPT / Claude pegado a mano | $0 | La vigilancia; el contexto chileno | El análisis, que se está volviendo commodity |
| Abogado | 5–15 UF, 3–10 días | Precio, velocidad, seguimiento | **Se hace responsable. Nosotros no.** |
| Lemontech | Enterprise | Segmento (ellos venden a estudios) | Marca y base instalada, si bajan |
| Ironclad / LinkSquares / Robin AI | US$500+/mes | Idioma, precio, contexto legal chileno | Nada — no van a bajar a una panadería |
| E-Sign / Acepta / FirmaVirtual | — | **Son socios, no rivales** — están en el segundo antes de la firma | — |

**La diferenciación honesta:** no somos los que mejor leen un contrato — a 24 meses eso lo hará
cualquiera. Somos **los únicos que siguen ahí tres años después**, el día que la cláusula se
activa.

### Precio

| Plan | Precio | Contratos nuevos | Vigilados |
|---|---|---|---|
| Suelta | $29.000 pago único | 1 | — |
| **Vigía** ← el que importa | **$39.000/mes** | 5/mes | **25** |
| Cartera | $89.000/mes | 20/mes | 150 |
| Estudio / Contador | $190.000/mes | ilimitados | ilimitados (20 RUT) |

El primer contrato es gratis, sin tarjeta.

### Economía unitaria

```
ARPU mezclado                    $58.000/mes
COGS por cliente/mes             $6.593    → margen bruto 88,7%
Contribución mensual             $51.446
CAC (mezcla de canales)          $140.000
Payback                          2,72 meses
LTV (churn 6%)                   $857.433
LTV/CAC                          6,1×
```

**El supuesto peligroso es el churn de 6%.** Con 10% el LTV/CAC cae a 3,7× (apretado pero viable);
con 15% cae a 2,4× y **el negocio no funciona**. La defensa estructural contra el churn *es* el
producto: cancelar significa quedarse ciego sobre 25 contratos vigilados.

### Canales, rankeados

1. **Contadores** — el canal real. Un contador convertido trae 8 clientes. CAC ≈ $45.000. El plan
   Estudio existe para convertirlo en distribuidor, no en cliente.
2. **Gremios** (ASECH, ACHIGA, CCS) — charla gratis: «Las cinco cláusulas que tiene tu contrato de
   arriendo y no leíste», con el demo proyectado. Duele en la sala.
3. **SEO long-tail chileno** — «tácita reconducción arriendo comercial», «me renovaron el contrato
   sin avisarme». Búsquedas de gente en pánico. El canal más lento y el único que compone.
4. **Firma electrónica avanzada** — integración con E-Sign/Acepta. El momento de mayor intención
   que existe.
5. **Software PYME** (Nubox, Defontana, Bsale) — ya tienen al cliente adentro. Riesgo: lo
   construyen ellos.
6. **Google Ads** en intención de pánico. CAC estimado $62.500 — hay que medirlo el mes 1 con
   $200.000, no discutirlo.
7. **Outbound** — sirve para los primeros 10 design partners. **No escala a $39.000 de ticket** y
   lo descartamos a propósito.

### IA en el marketing

**Sí:** contenido SEO a escala con sustancia real (200 artículos, uno por cláusula problemática —
salen del mismo motor que es el producto); personalización del outbound al gremio (analizar el
contrato tipo de ese mall y llegar con sus cláusulas en pantalla); calificación de leads.

**No:** chatbot de ventas (le vendemos confianza a alguien pasado a llevar por un documento que no
entendió — ponerle un bot refuerza la sensación que combatimos); correos masivos generados (el
dueño de PYME los huele en dos segundos y los asocia a estafa); y **jamás testimonios o cifras
inventadas** — en un producto que existe para decir lo que un documento realmente dice, eso nos
descalifica por completo.

### Primeros 90 días

- **Días 1–30:** conseguir **15 contratos reales**. Análisis gratis hecho a mano. Nadie construye
  producto. *Se mide:* ¿cuántos dicen «no tenía idea de esto»? Bajo 10 → el dolor no es el que
  creemos.
- **Días 31–60:** cobrar antes de estar listos. $29.000 por el segundo contrato. *Se mide:* cuántos
  de los 15 pagan. Bajo 4 → el dolor es real pero **no es un dolor por el que se pague**.
- **Días 61–90:** **10 reuniones con contadores.** *Se mide:* ¿3 de 10 traen al menos un cliente en
  30 días? Si no, el canal principal no existe.

Ninguno de los tres meses tiene como objetivo «terminar el producto». **Este negocio no muere por
producto: muere por distribución.**

### Qué mataría esto

1. **El análisis se vuelve gratis y no alcanzamos a construir la vigilancia.** El riesgo más
   probable. *Mitigación:* todo el diseño empuja hacia la cartera vigilada. Un LLM no tiene memoria
   de tu contrato de 2026 en marzo de 2029. Nosotros sí. Ése es todo el foso.
2. **La IA se salta una cláusula, el cliente pierde $60M y nos demanda.** Estructural, no
   eliminable. *Mitigación en cuatro capas:* (a) **producto — nunca emitimos un certificado verde**;
   Antefirma jamás dice «este contrato está bien», sólo dice «encontramos esto»; (b) técnica —
   verificador adversarial; (c) contractual — tope de responsabilidad, **con la advertencia honesta
   de que bajo la Ley 19.496 una exoneración total puede declararse abusiva**; (d) seguro E&O.
3. **El canal del contador no existe.** El CAC se va a $340.000 y el payback a 6,6 meses. Se prueba
   en el día 61.
4. **El dolor es real pero nadie paga por él.** *Mitigación:* no vender el riesgo futuro; vender el
   susto presente — el análisis gratis del contrato que **ya** firmaste.
5. **Ejercicio ilegal de la profesión.** Menor de lo que parece (no representamos, no comparecemos,
   no firmamos opiniones), pero un requerimiento público es un golpe de credibilidad.

---

## Roadmap

### El hallazgo que ordena todo

La primera versión del modelo tenía 8 personas al mes 24. Con esa nómina **los tres escenarios se
quedaban sin caja** — incluido el optimista. Cuando el modelo mata tu escenario optimista, el
modelo no está equivocado: el plan lo está. Se rehizo con nómina disciplinada, y apareció esto:

```
Base, creciendo a full ········· caja al mes 24 = −$896.537     (se acaba justo en el punto de decisión)
Base, cortando el marketing ···· caja al mes 24 = −$2.530.950   y con 65 clientes menos
Base, congelando el equipo ····· caja al mes 24 = +$27.903.463  con los mismos 192 clientes
```

**Cortar el marketing no salva la caja: la empeora.** El CAC se paga solo en 2,7 meses; el sueldo
no se paga nunca. La palanca de este negocio no es cuánto gastas en crecer — es cuánta gente
contratas.

### Supuestos

| | Pesimista | Base | Optimista |
|---|---|---|---|
| Tasa de cierre (demo → paga) | 12% | 18% | 25% |
| Churn mensual | 9% | 6% | 4% |
| ARPU | $58.000 | $58.000 | $58.000 |
| Margen bruto | 88,7% | 88,7% | 88,7% |
| CAC | $140.000 | $140.000 | $140.000 |
| Demos/mes | 6 → 210 (+16,7%/mes) | ídem | ídem |
| Nómina | 2 → 3 → 4 → 5 personas | ídem | ídem |
| Caja inicial | $110.000.000 (Corfo SSAF-S + fundadores/ángeles) | | |

### Resultado a 24 meses

| | Clientes | MRR | ARR | Caja m24 |
|---|---|---|---|---|
| Pesimista | 114 | $6.597.903 | US$83.342 | −$14,2M (sin caja en el **mes 22**) |
| **Base** | **192** | **$11.144.783** | **US$140.776** | **−$896.537** |
| Optimista | 291 | $16.871.953 | US$213.119 | +$16,6M |

Break-even de contribución (el margen paga al equipo): **mes 23** en el base, mes 21 en el
optimista. Break-even de flujo, incluyendo lo que se gasta en crecer: **después del mes 24 en los
tres escenarios.**

### Los seis hitos y sus criterios de muerte

| | Mes | Es cierto si | **Criterio de muerte** |
|---|---|---|---|
| **M1** | 3 | 15 contratos reales analizados; 10 de 15 dicen «no tenía idea» | Menos de 10 se sorprenden → **el contrato no esconde nada que la gente no supiera.** No hay pivote. |
| **M2** | 4 | 4 de los 15 design partners pagan | Menos de 3 pagan → el dolor es real pero **no es un dolor por el que se pague** |
| **M3** | 8 | 10 clientes, 6 por canal, churn < 8% | Churn > 12% sostenido → **la vigilancia no se siente**, y la vigilancia es el único foso |
| **M4** | 12 | 26 clientes · MRR $1,5M · **8+ contadores activos** | De 25 contadores, menos de 5 traen un cliente → **el canal principal no existe**. Se para con **$62M todavía en el banco** |
| **M5** | 18 | 74 clientes · MRR $4,3M · >50% de los nuevos sin toque humano | MRR < $2,6M → la caja se acaba en el mes 22. Y entre $2,6M y $4,3M: **no se contrata a nadie más** |
| **M6** | 24 | 192 clientes · MRR $11,1M · caja en cero | **La pregunta del mes 24 no es cuánto MRR hay: es cuánto churn hay.** Churn > 10% → matar |

Toda la plata se gasta **después** del mes 12 — es decir, después de que M4 respondió si el canal
existe. Ése es el diseño.

### Probabilidad de éxito

**Éxito = llegar a US$1M de ARR en 5 años.**

Clase de referencia: SaaS B2B con capital semilla que alcanza US$1M ARR ≈ **5%**.
*Honestidad sobre la cifra:* circula mucho y tiene fuente primaria débil — la tratamos como orden
de magnitud. **La tasa base chilena específica no está publicada de forma confiable y no la vamos a
inventar.**

```
Al alza:   cuña afilada ×1,4 · canal que ya existe ×1,3 · payback 2,7 meses ×1,2 · presupuesto que ya se gasta ×1,1  =  2,40
A la baja: el análisis se comoditiza ×0,5 · cliente disperso ×0,7 · mercado chico ×0,75 · responsabilidad ×0,85      =  0,223
Combinado: 2,40 × 0,223 = 0,536      →      5% × 0,536 = 2,7%
```

| | Probabilidad |
|---|---|
| Hoy, incondicional | **2 – 4 %** |
| Condicional a superar **M4** (mes 12) | **12 – 20 %** |
| Condicional a superar **M5** con churn < 5% (mes 18) | **30 – 40 %** |

La probabilidad de esta idea está casi enteramente determinada por **si el canal del contador
existe**, y eso se sabe en el mes 12, no en el mes 24.

---

## Arquitectura

### Pipeline

1. **Extracción** — `pdfplumber` (60%) / Google Document AI si viene escaneado. Se guarda el
   SHA-256: el mismo contrato no se paga dos veces.
2. **Segmentación** — cláusulas con offsets exactos. Nunca reescribimos el contrato, sólo lo
   anotamos.
3. **Análisis de riesgo** — el contrato se escribe **una vez** al caché de prompt y tres pasadas
   paralelas lo leen a 0,1×: *plata*, *plazos*, *responsabilidad*.
4. **Verificación adversarial** — «Eres el abogado de la contraparte. ¿Qué cláusula que te favorece
   se le pasó al analista?»
5. **Redlines** — el modelo caro, **sólo** para las críticas y ámbar.
6. **Vigilancia** — un cron que compara fechas contra hoy. **No usa IA.**

### Agentes

| Agente | Modelo | Por qué |
|---|---|---|
| Segmentador | `claude-haiku-4-5-20251001` | Es partir texto por numerales. No requiere razonar. |
| Analista de riesgo ×3 | `claude-sonnet-5` | El caballo de batalla. Caché de prompt: las 3 pasadas leen a 0,1×. |
| Verificador adversarial | `claude-sonnet-5` | La ganancia viene del **encuadre**, no de la potencia. |
| **Redactor de redlines** | **`claude-opus-4-8`** | El único lugar donde se justifica el modelo caro: este texto lo lee el abogado de la contraparte. |
| Q&A del contrato | `claude-sonnet-5` | No se manda el contrato entero: se manda el índice y el agente pide las cláusulas. |

### Costo de inferencia — **$650 CLP por contrato**

Supuestos: contrato de 14 páginas ≈ 8.000 tokens. $950 CLP/USD.

```
1. OCR (Document AI, 40% escaneados)                      US$0,0084
2. Segmentación (Haiku 4.5)                               US$0,0230
3. Análisis ×3 (Sonnet 5, caché)                          US$0,2307
   ├─ escritura de caché  8.000 × $3 × 1,25 ÷ 1e6 = $0,0300
   ├─ 3 lecturas de caché 3 × 8.000 × $3 × 0,1 ÷ 1e6 = $0,0072  ← el ahorro (sin caché: $0,072)
   ├─ prompts propios     3 × 1.500 × $3 ÷ 1e6 = $0,0135
   └─ salida              3 × 4.000 × $15 ÷ 1e6 = $0,1800
4. Verificación adversarial (Sonnet 5)                    US$0,0354
5. Redlines (Opus 4.8, ≈9 cláusulas)                      US$0,2300
                                                          ─────────
   TOTAL = US$0,5275 × $950 =                             $501 CLP
   Redondeado a $650 para 30% de holgura.
```

**COGS por cliente/mes = $6.593** (análisis $1.170 + Q&A $150 + almacenamiento $340 + infra $2.363
+ WhatsApp $480 + correo $60 + pasarela $2.030) → **margen bruto 88,7%**, que es el número que usa
el modelo del roadmap. Mes 24: 192 clientes × $6.593 = **$1.265.856/mes** de COGS.

**La vigilancia — que es el producto — cuesta cero en inferencia.** Lo que nos defiende de la
comoditización es también lo que no nos cuesta plata.

### Modelo de datos

`empresas` · `usuarios` · `contratos` · `clausulas` · **`riesgos`** · `redlines` ·
**`obligaciones`** · `alertas_enviadas` · `indicadores` · `auditoria`

Dos columnas cargan el peso: `contratos.vigilado` (el booleano del que depende el negocio) y
`riesgos.modelo` + `riesgos.version_prompt` — porque cuando un cliente reclame que se nos pasó una
cláusula, hay que poder decir exactamente qué estaba corriendo ese día. **En un producto con riesgo
de responsabilidad, la trazabilidad es una función, no un lujo.**

### APIs y `.env`

Anthropic · Google Document AI · **WhatsApp Business API** (verificación de empresa + plantillas
aprobadas: **es el trámite del día 1**) · mindicador.cl (UF) · Flow/Transbank · Resend · Google
Calendar.

`ANTHROPIC_API_KEY` `GOOGLE_APPLICATION_CREDENTIALS` `DOCUMENT_AI_PROCESSOR_ID` `DATABASE_URL`
`REDIS_URL` `S3_BUCKET` `KMS_KEY_ID` `WHATSAPP_TOKEN` `RESEND_API_KEY` `FLOW_API_KEY`
`GOOGLE_OAUTH_CLIENT_ID` `SENTRY_DSN` `UF_API_URL` **`PROMPT_VERSION`**

---

## Qué está falseado en el demo

Somos un producto sobre leer la letra chica. Sería raro que tuviéramos letra chica.

**Falseado:** no hay servidor ni modelo — el demo corre entero en tu navegador y las anotaciones
están precomputadas en `demo/contratos.js`. **El archivo que arrastras no se lee, y te lo decimos
en pantalla en vez de fingir un análisis.** La barra de progreso es teatro sincronizado (en
producción son 60–180 s reales). La UF está fija en $40.150. Las alertas no se envían.

**No falseado:** el `.ics` **se genera y se descarga de verdad** (VEVENT + dos VALARM, a 30 y 7
días); el simulador de renta efectiva **recalcula de verdad** y muestra el escalón exacto de las
900 UF; las cuentas regresivas **se calculan contra la fecha real de tu computador**; el
portapapeles copia de verdad; y **los dos contratos están redactados, no resumidos** — 15 y 10
cláusulas en lenguaje jurídico chileno con las trampas adentro.

## Qué haría falta para que fuera real

1. **El corpus de cláusulas chilenas anotadas.** 500–800 contratos reales leídos por un abogado,
   con cada cláusula problemática etiquetada. Es lo único que no se compra, y es lo que hace que el
   modelo sepa que «tácita reconducción» no es lo mismo que un *auto-renewal* gringo. **Sin esto
   tenemos un ChatGPT con marca.**
2. **El proceso de evaluación.** Un golden set de 100 contratos y una métrica que se mira todos los
   días: **recall de cláusulas críticas** — no precisión. Una falsa alarma molesta; un falso
   negativo nos demanda. Ningún cambio de prompt sale a producción sin pasar el golden set.
3. **WhatsApp Business API verificado.** Verificación ante Meta y plantillas aprobadas. Demora
   semanas y no depende de nosotros. Sin WhatsApp la alerta llega por correo, y el correo no se lee.

---

## Archivos

```
index.html          la landing — con tres cláusulas reales que se abren en vivo
demo/index.html     EL DEMO — dos contratos chilenos redactados de verdad
demo/contratos.js   los contratos, sus 24 anotaciones, 21 redlines y 12 fechas
demo/demo.js        el motor: simulador, filtros, panel deslizante, .ics real
negocio.html        ICP, mercado, competencia, economía unitaria, canales, riesgos
roadmap.html        6 hitos con criterios de muerte · 4 gráficos SVG a mano
stack.html          pipeline, agentes, costo de inferencia, qué está falseado
assets/             el sistema de diseño (marginalia jurídica) y la navegación
```

**Antefirma no es asesoría legal y no reemplaza a un abogado.** Decirlo claro da credibilidad, no
la quita — y por eso está en cada página, en un recuadro visible, y no en letra chica.
