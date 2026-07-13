# Fonalta — el teléfono que siempre contesta

**Dominio:** `fonalta.com` — verificado libre el 2026-07-13 (RDAP de Verisign: HTTP 404; `.cl` también libre).
**Alternativas verificadas:** `tonalva.com`, `aloline.com`, `lineafon.com` (las tres, HTTP 404).

Una recepcionista de IA que contesta el teléfono de una PYME chilena 24/7. Se declara IA en los
primeros 5 segundos, responde en menos de 800 ms, entiende para qué llaman, responde lo que sabe,
agenda, toma el recado — y cuando **no** sabe algo, lo admite en vez de inventarlo.
El resumen le llega al dueño por WhatsApp.

---

## El problema

El teléfono suena y no hay nadie. El mecánico está abajo de un auto, la consulta está en hora
punta, el hotel cerró la recepción a las 22:00. **El cliente que no fue atendido llama al siguiente
de la lista y no vuelve** — y el dueño ni siquiera se entera de que existió.

Las dos alternativas que hay hoy son malas:

- **Una recepcionista** cuesta ~$625.000/mes (sueldo mínimo 2026 ~$500.000 + ~25% de cargas).
  Contesta 8 horas, 5 días. Se enferma, sale a colación, se va de vacaciones.
- **La casilla de voz** es gratis, y es donde los clientes van a morir. Nadie deja mensaje.
  El que lo deja ya llamó a otro mientras tanto.

---

## El producto, y la postura

Desvías tu número al nuestro. Contestamos.

Lo que nos separa de un servicio de voz cualquiera son cuatro decisiones que están escritas en el
código, no en el prompt (§2 de `stack.html`):

1. **Se declara IA en los primeros 5 segundos. Siempre.** El saludo con la palabra «virtual» va
   pre-sintetizado en caché y suena en el milisegundo 40. **No lo genera el modelo, así que el
   modelo no lo puede omitir.** Lo que mata la credibilidad no es saber que hablas con una máquina:
   es enterarte después de que te lo escondieron.
2. **Lo que hace creíble a una voz es la latencia, no el timbre.** Presupuesto de **800 ms** punta a
   punta, streaming en las tres capas, y *barge-in*: se le puede interrumpir. Una voz preciosa con 3
   segundos de silencio suena a robot; una voz normal que responde al tiro suena viva.
3. **Sin herramienta, no hay afirmación.** El modelo no puede decir un precio, un horario ni una
   política que no venga del resultado de una herramienta en ese turno. Si la ficha no dice si
   atienden gatos, la IA dice que no sabe — y esa pregunta le llega al dueño para que la conteste
   una vez.
4. **Cuando piden un humano y no hay humano, el sistema lo dice.** La herramienta `transferir()`
   sólo existe si hay un destino disponible. Si no lo hay, el modelo *literalmente no tiene esa
   opción*. Simular una transferencia hacia un timbre que no suena en ninguna parte es lo único que
   convertiría un producto honesto en una estafa.

Y dos cosas que no hacemos: **nunca clonamos la voz de una persona real** (la voz base la graba una
locutora chilena contratada, con cesión escrita de derechos para uso sintético), y **nunca llamamos
a nadie en frío**. Sólo entrante, o devolución a quien dejó su número y dijo que sí, con el
consentimiento grabado. En Chile las robocalls con voz sintética chocan con el registro *No
Molestar* (Ley 21.398); en EE.UU. la FCC ya las declaró ilegales. Y aunque no lo fueran: te queman
el número.

---

## Precio

| Plan | CLP/mes | Minutos | Para quién |
|---|---:|---:|---|
| Recado | $29.000 | 100 | Taller o servicio técnico chico. Sólo quiere el recado. |
| **Recepción** | **$69.000** | **400** | El que se lleva casi todo. Agenda contra Google Calendar. |
| Central | $159.000 | 1.200 | Varias sucursales o mucho volumen. |

Excedente: **$89/minuto**. Prueba: **30 minutos sin tarjeta**.

---

## El costo por minuto — el número del que cuelga todo

| Componente | US$/min | CLP/min | % |
|---|---:|---:|---:|
| TTS · voz sintética con licencia | 0,0240 | $23,0 | 46% |
| Telefonía · Twilio (entrante + media stream) | 0,0130 | $12,5 | 25% |
| ASR · Deepgram Nova-3 streaming | 0,0077 | $7,4 | 15% |
| LLM · Claude Haiku 4.5 (4 turnos/min, prompt cacheado) | 0,0057 | $5,5 | 11% |
| Infra · media server + relay | 0,0020 | $1,9 | 4% |
| **Total** | **0,0524** | **$50,3** | |

*(Tipo de cambio supuesto: $960/USD. La aritmética completa, línea por línea, está en `stack.html`.)*

**Cómo cuadra con el margen:**

```
ARPU (mezcla 30/55/15 + excedentes) ............ $74.500 / mes
Consumo real supuesto .......................... 330 min / mes

COGS:  330 min × $50,3 ......................... $16.605
       número local (US$3) ..................... $ 2.880
       WhatsApp (60 plantillas) ................ $ 1.705
       infra fija prorrateada .................. $ 2.000
                                                 ───────
                                                 $23.190

MARGEN BRUTO = (74.500 − 23.190) ÷ 74.500 ...... 68,9%
```

**El 31% de cada peso que cobramos se va en minutos de voz.** Eso no es un SaaS de 88% de margen y
no vamos a fingir que lo es: no podemos regalar uso ilimitado, y por eso el excedente existe desde
el día uno. El TTS solo es el 46% del costo variable — si baja a la mitad, el margen salta a 77%;
si sube, el plan Recado deja de tener sentido.

**CAC** $109.133 · **LTV** $1.026.200 (churn 5%) · **LTV/CAC** 9,4 · **payback** 2,1 meses.

> Un LTV/CAC de 9,4 debería darte desconfianza. Normalmente significa que se gasta poco en
> adquisición porque **el canal no da para más**, y eso es exactamente lo que pasa acá. El problema
> de este negocio no es el CAC: es el volumen.

---

## Mercado

```
Empresas con inicio de actividades vigente (SII, orden de magnitud) .... ~1.200.000
  − micro (< UF 2.400/año), sin presupuesto ...........................   −800.000
  − grandes (> UF 100.000), ya tienen call center .....................    −15.000
  Pequeñas + medianas ..................................................  ≈225.000
  × 25% — supuesto propio: rubros donde el teléfono es canal ...........   ≈56.250

TAM Chile = 56.250 × $74.500 × 12 ................ ≈ US$52,4M / año
SAM       = 40% (urbanas, con tarjeta, ≥6 llam./día) ≈ US$20,9M / año
SOM año 3 = ~450 clientes = 2,0% del SAM ........... ≈ US$419k / año
```

El 25% y el 40% son supuestos míos, declarados. Si el 25% fuera 12%, el TAM cae a US$25M y el
negocio sigue existiendo; si fuera 5%, no.

**Extensión global:** el mismo producto con otro acento y otra telefonía. LatAm hispanohablante
tiene ~15–20× la población de empresas de Chile → TAM regional del orden de **US$900M/año**. Es un
escalamiento por población de empresas, no un estudio.

---

## Competencia

| Quién | Diferencia honesta |
|---|---|
| **La casilla de voz** *(el verdadero titular)* | Gratis y ya está. Nadie deja mensaje. Nuestra ventaja es enorme **si** el dueño acepta que perder llamadas le cuesta plata — muchos no lo han medido nunca. |
| **La recepcionista** | Entiende matices y calma a un cliente enojado. **No la reemplazamos y no vamos a decir que sí.** Contestamos cuando ella no está. |
| **Call centers chilenos** | $300–600/min contra nuestros $50. Pero un humano sí puede manejar una queja de verdad. |
| **Bland, Retell, Vapi, Synthflow, PolyAI** | Plataformas para desarrolladores: te venden la API y tú armas el agente. La PYME chilena no va a armar nada. Hablan español neutro, no dan número +56 self-serve, no emiten boleta chilena. **Es la diferenciación más frágil que tengo: es de meses, no de años.** |
| **Zurcia** *(idea 03 de este repo)* | Canal distinto: ellos viven en el chat de WhatsApp, nosotros en la línea telefónica. Se complementan — Fonalta manda su resumen *por* WhatsApp. |

---

## Cómo opera sin ningún humano

- **Venta.** Google Ads sobre intención + SEO programático en dominio propio + retargeting. Sin
  llamada de venta, sin demo agendada, sin «conversemos».
- **Entrega.** Tres pantallas: número asignado al instante, instrucciones de desvío de *su*
  operadora (detectada por el prefijo), y la ficha del negocio pegada como texto o leída de su web.
  **El producto se entrega por la red telefónica.** No hay nada que instalar.
- **Cobro.** Flow (tarjeta, CLP), suscripción recurrente, boleta electrónica automática. Dunning
  automático con el desvío intacto para que no pierda llamadas mientras arregla su tarjeta.
- **Soporte.** Lo contesta la propia IA por WhatsApp. Y el sistema se autodiagnostica: detecta el
  desvío roto, el ruido de fondo excesivo, y al cliente que va a pasarse de plan.
- **Mejora.** La tabla `no_supo`. Cada vez que la IA no encuentra algo, lo admite *y lo registra*.
  Una vez a la semana un agente agrupa esas preguntas y le manda al dueño un WhatsApp concreto:
  *«3 personas preguntaron si atienden gatos. ¿Atienden?»*. Responde una vez y la ficha mejora.
  **Nadie de nuestro lado tocó nada.**

### Lo que NO logro automatizar

1. **El desvío en una línea fija antigua.** En móvil se activa con un código GSM en 20 segundos.
   Pero algunas centrales fijas exigen que la *operadora* lo active por mesa de ayuda, y yo no tengo
   poder para actuar sobre la cuenta de Entel del cliente — ni debería tenerlo. Le doy el número y
   el guión de lo que tiene que pedir. **Es el punto de fuga más grande del embudo (se cae el 43% de
   los registrados) y no lo puedo tapar.**
2. **Portar el número.** Requiere firma del titular y trámite ante la Subtel. Humano por diseño
   legal. No lo ofrezco: el producto funciona con desvío.
3. **Que la ficha del cliente sea buena.** Si carga tres líneas y se va, la IA va a decir «no sé»
   muy seguido. Lo detecto y lo persigo por WhatsApp. **No puedo inventarle los precios de su
   taller**, y no debo.
4. **Un contracargo o un reclamo al SERNAC.** El sistema arma el expediente completo (grabación,
   transcripción, log de facturación). La firma es humana.
5. **La emergencia real.** Si alguien llama a la veterinaria porque su perro se está muriendo,
   ninguna IA de voz sirve. Detección de urgencia → corta el guión, marca al celular del dueño,
   manda SMS. **Eso no es automatización: es reconocer un límite y diseñar la salida.**
6. **Decidir el precio.** No se le pregunta al modelo. Se prueba, con muestra mínima y prueba
   secuencial.

---

## Roadmap y criterios de muerte

Los seis hitos, con la observación que debería hacernos parar en cada uno. Están copiados tal cual
en `autopilot.json`; el juez automático los aplica y **no los puede cambiar**.

| Hito | Cuándo | Qué es cierto si lo logras | Criterio de muerte | Acción |
|---|---|---|---|---|
| **M1** | día 45 | 5 pilotos, 300 llamadas reales. La apuesta cultural está confirmada. | **Más del 25% cuelga en los primeros 15 s** (justo tras oír que es una IA) | **matar** |
| **M1b** | día 45 | La voz suena viva. | p95 de latencia sobre 1.500 ms por una semana | pausar → matar a los 30 días |
| **M2** | mes 3 | Alguien que nunca habló con nosotros pagó con su tarjeta. Existe un negocio que una máquina puede operar. | Con 200 pruebas iniciadas, **cero pagos sin intervención humana** | **matar** |
| **M3** | mes 6 | 16 clientes, y se quedan. | Churn sobre 12% mensual, 2 meses seguidos, con ≥15 clientes | **matar** |
| **M4** | mes 9 | El SEO empieza a componer. | Tráfico orgánico bajo 250 visitas/mes | reducir |
| **M4** | mes 12 | 72 clientes, CAC bajo control. | CAC sobre 3× ARPU ($223.500) por 8 semanas, ≥60 conversiones | pausar el canal |
| **M5** | mes 18 | 162 clientes y el margen aguanta a escala. | Margen bruto bajo 50%, 2 meses seguidos | pausar → matar a los 3 meses |
| **M6** | mes 24 | 264 clientes, US$246k ARR. Decisión: levantar / bootstrapear / matar. | MRR bajo $6M **y** caja bajo $10M | **matar** |

**Trayectoria (escenario base):** MRR mes 24 = **$19,7M CLP** (US$246k ARR), 264 clientes.
Pesimista: US$76k. Optimista: US$553k.
**Caja:** parte en $30M ($15M de ahorros + $15M de Semilla Inicia de Corfo), valle de **$15,6M en el
mes 13**, punto de equilibrio en el **mes 14**.

### Probabilidad de éxito

**No existe una tasa base publicada para «SaaS de voz con IA en Chile»** — la categoría tiene tres
años. Uso dos clases adyacentes y digo cuál es cuál:

- **Clase A:** supervivencia de empresas nuevas en Chile, ~55–60% al tercer año (Ministerio de
  Economía). *Es contexto, no una tasa de éxito.*
- **Clase B:** fracción de SaaS B2B que llega a US$1M de ARR. El rango citado en la literatura de la
  industria va de ~4% (denominador: empresas fundadas) a ~15% (denominador: SaaS financiados). Para
  un SaaS **bootstrapeado y sin venta humana**, la tasa base honesta está entre **5% y 12%**.
  *Declaro el rango. No tengo el paper con el número exacto y no lo voy a inventar.*

**Ajustes hacia arriba:** el presupuesto ya existe (una recepcionista cuesta $625.000); la demanda
es explícita (la gente escribe «recepcionista virtual» en Google); la entrega es por la red
telefónica, sin integración; el self-serve es real.

**Ajustes hacia abajo:** **el techo del canal es chico** (~2.800 búsquedas/mes → 6 clientes/mes, y
satura en el mes 6 — éste es el ajuste más grande); competencia americana financiada con ventaja de
meses, no de años; el margen es 69%, no 88%; y el riesgo cultural no está probado.

```
LLEGAR A US$1M DE ARR EN 36 MESES ......... 6% – 12%
  condicional a cumplir M4 en el mes 12.
  Y casi todo ese 6–12% pasa por salir de Chile: con el techo del canal
  chileno, US$1M sólo con clientes chilenos requiere ~1.100 clientes
  (4,9% del SAM). Posible, pero no en 36 meses con este motor.

RESULTADO MODAL ........................... 35% – 45%
  US$150k–400k de ARR, bootstrapeado, dos socios, 70% de margen, sin
  haber levantado un peso. No es un unicornio. Es un buen negocio chico.

MORIR ANTES DEL MES 12 .................... 30% – 40%
  Los dos caminos más probables:
    1. M1 — la gente cuelga cuando oye que es una IA      (~15%)
    2. M4 — el SEO no rankea y el negocio queda con techo (~15%)
```

*(Los porcentajes de los caminos de muerte son un juicio mío repartiendo el 30–40%, no una medición.)*

---

## Arquitectura

**La cadena de voz** — cuatro procesos en streaming, encadenados, con presupuesto de **800 ms**:

| Etapa | p50 | p95 | Cómo |
|---|---:|---:|---|
| Red telefónica | 80 ms | 120 ms | Twilio Media Streams · media server en São Paulo (RTT desde Santiago ~40 ms) |
| ASR | 180 ms | 260 ms | Deepgram Nova-3 streaming · endpointing 150 ms + detección semántica de fin de turno |
| LLM (primer token) | 320 ms | 610 ms | Claude Haiku 4.5, prompt cacheado. El TTS arranca con la *primera frase*, no espera el turno |
| TTS (primer byte) | 90 ms | 110 ms | ElevenLabs Flash v2.5 (~75 ms TTFB) |
| Jitter + salida | 60 ms | 80 ms | 2 tramas de 20 ms |
| **Total** | **730 ms** | **1.180 ms** | El p50 cabe. **El p95 es el que hay que vigilar.** |

Regla: si un turno pasa de **900 ms**, se emite un relleno («mmm, déjeme ver…») a los 620 ms
mientras llega el primer token, en vez de dejar al que llama en el vacío.

> **Estos números son presupuesto de arquitectura, no una medición.** Salen de las latencias
> publicadas de cada proveedor más el RTT Santiago→São Paulo. El día que exista el pipeline se mide
> y se publica el número real, sea el que sea.

**El barge-in** es más difícil de lo que parece. Cortar el audio es lo fácil. Lo que casi nadie hace:

1. Callar el TTS.
2. **Purgar el audio que ya salió hacia Twilio** y todavía no suena (`{event:'clear'}`). Sin esto,
   la IA sigue hablando 400 ms después de «callarse».
3. **Truncar el turno del modelo a lo que alcanzó a sonar**, no a lo que generó. Si no lo truncas,
   el modelo cree que dijo la frase entera y dos turnos después la conversación se descarrila:
   *«como le decía, la consulta sale $32.000»* — nunca lo dijo.
4. Volver a escuchar. El ASR nunca se apagó.

**Los agentes:**

| Agente | Modelo | Dónde |
|---|---|---|
| **Recepcionista** | `claude-haiku-4-5` | En la llamada. <320 ms al primer token. |
| Resumidor | `claude-haiku-4-5` | Post-llamada. |
| Curador de la ficha | `claude-sonnet-5` | Semanal. Lee `no_supo` y le pregunta al dueño. |
| Juez de calidad | `claude-sonnet-5` | Muestrea 5% de las llamadas contra una rúbrica fija. |
| Escritor de SEO | `claude-sonnet-5` | Sólo publica en dominio propio. |

*Por qué Haiku en la llamada:* el presupuesto de primer token son 320 ms — Haiku 4.5 lo cumple en
streaming con prompt cacheado, Sonnet 5 no de forma confiable. Y el **94% de los turnos son
intención simple**. Sonnet 5 se usa fuera del camino crítico, donde tres segundos no le importan a
nadie.

**Stack:** Node 22 + media server WebSocket · Twilio Voice + Media Streams · Deepgram Nova-3 ·
ElevenLabs Flash v2.5 (respaldo: Azure Neural es-CL, 4× más barato) · Anthropic API ·
Postgres 16 + pgvector (Neon) · Redis · Meta WhatsApp Cloud API · Flow + SII · Fly.io (`gru`,
São Paulo — **no hay región en Chile**) · Sentry · Axiom.

**Fricción real de los terceros:** los números chilenos de Twilio requieren un **bundle regulatorio**
(RUT, domicilio en Chile, documento de la empresa). Es un trámite de días, una sola vez — y es la
barrera de entrada más real que tenemos contra un competidor extranjero.

---

## Qué está falseado en el demo

**Falso:** no hay audio (ni telefonía, ni ASR, ni TTS — nadie habla); la forma de onda es una
función, no un micrófono; los milisegundos son el presupuesto, no una medición; no hay LLM (las
respuestas están escritas); el WhatsApp está maquetado, no enviado.

**Verdadero — es el diseño real:** la máquina de estados de la llamada; el barge-in con truncado del
turno del modelo; la regla «sin herramienta no hay afirmación» y la salida forzada de «no lo sé»; el
guión de «no hay humano» palabra por palabra; y el bucle de `no_supo` (en el panel del dueño se
responde una pregunta y de verdad desaparece de la bandeja).

**Para que fuera real:** un media server con WebSocket bidireccional, las tres API keys, un número
Twilio con el bundle chileno, y el pegamento entre las cuatro etapas con manejo de contrapresión.
**2 a 3 semanas para un pipeline que conteste una llamada**, y otras 4 a 6 para que el barge-in y el
p95 estén decentes. Lo difícil no es que funcione: es que funcione rápido y no se caiga.

---

## Qué mataría esto

**Que el chileno cuelgue.** Todo el negocio descansa sobre una apuesta cultural que nadie ha probado
en Chile: que una persona acepte que le conteste una máquina que se declara máquina, y siga la
conversación en vez de cortar. Si la tasa de cuelgue tras la divulgación es alta, no hay precio, no
hay canal, no hay latencia y no hay acento que salve esto. **Se mata en el día 45 y se aprende
barato.** Por eso M1 no es «tener el producto listo»: es *medir esa fracción*.

Lo segundo: que Retell, Bland o Synthflow lancen es-CL con número +56 y self-serve.
Lo tercero: que el SEO programático no rankee, y el negocio quede con techo de 6 clientes/mes — eso
no es una empresa, es un trabajo.
Lo cuarto: que el costo del TTS no baje.

---

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Landing. El producto tocando en vivo en el hero, no un screenshot. |
| `demo/index.html` | **La pieza principal.** Una llamada que se recorre turno a turno, con el reloj de latencia visible, el barge-in, el «no lo sé», y el panel del dueño. |
| `negocio.html` | ICP, mercado con la aritmética, competencia, economía unitaria, canales, **Autonomía**. |
| `roadmap.html` | Seis hitos con criterios de muerte, tres escenarios de MRR, caja, embudo, probabilidad como rango. |
| `stack.html` | La cadena de voz, las reglas duras del kernel, modelo de datos, agentes, **el costo por minuto**, qué está falseado. |
| `meta.json` | Metadata para el hub. |
| `autopilot.json` | El manifiesto del piloto automático. Los `criterios_de_muerte` están copiados de `roadmap.html`. |
