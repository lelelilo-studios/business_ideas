# Cuantario · el sistema meta

**Veintiuna ideas. Un dueño. Cero personas en el loop.**

`cuantario.com` — verificado libre el 13-07-2026 (RDAP de Verisign → HTTP 404; control:
`google.com` → HTTP 200, o sea que el chequeo distingue). `cuantario.cl` también libre.
Alternativas verificadas el mismo día: `asignaria.com`, `ponderario.com`, `juzgaria.com`.

Esto **no es una idea de negocio**. Es la infraestructura que opera a las otras: les da presupuesto,
las promociona por canales que se pueden automatizar sin quemarlos, mide gasto contra ingreso, y
decide —sin humanos— si escalar, mantener, reducir, pausar o matar.

| Página | Qué es |
|---|---|
| `index.html` | Qué es y por qué. |
| `demo/index.html` | **El tablero funcionando.** La pieza principal. |
| `arquitectura.html` | El sistema completo: kernel, canales, bandits, juez, voz, datos, costo con su aritmética. |
| `integracion.html` | Cómo se enchufa una idea: el manifiesto campo por campo + **la clasificación de las 16**. |
| `economia.html` | Cuánto cuesta correrlo y desde cuántas ideas se paga solo. |

---

## Por qué existe

Dos problemas, y el caro no es el que parece.

**El barato:** un operador de *growth* decente lleva bien **dos** ideas a la vez. Veintiuna serían
once personas y $25.300.000 al mes.

**El caro:** **nadie mata su propia idea.** El fundador que lleva seis meses y $3.400.000 gastados en
algo que no convierte no escribe «se acabó»: escribe «hay que iterar el mensaje». Encuentra la razón.
Siempre la encuentra. Eso es costo hundido disfrazado de estrategia.

El contrato de este repositorio ya obligó a cada idea a escribir sus **criterios de muerte** en su
`roadmap.html`, en frío, antes de gastar el primer peso. Están ahí. Nunca nadie los ejecutó.

Cuantario los ejecuta.

---

## Las piezas

### 1. El núcleo de cumplimiento — un puerto de salida, no un prompt

**Ninguna acción llega a una API de terceros sin pasar por acá.** No es una capa de consejo que el
agente pueda ignorar cuando encuentra un argumento mejor: es la única función con permiso para hablar
con Meta, Google, Twilio o el servidor de correo. El motor de campañas y el juez *proponen*. El kernel
*emite*.

Cuatro pasos, y los dos primeros no son un LLM:

1. **Reglas duras** (código determinístico). ¿El canal está en `publico.canales`? ¿El gasto cabe en el
   tope diario? ¿El número está en la lista de supresión o en el registro No Molestar? Esto es un `if`.
   Aquí muere el 80% de lo que se bloquea, sin gastar un token.
2. **Topes.** Diario, mensual, total, de portafolio y de escalamiento (+40% por ciclo). **El juez opera
   dentro; no puede levantarlos.** Cuando pidió subir el de 05-contratos a +70%, esta regla lo rechazó.
3. **Clasificador de contenido** (`claude-haiku-4-5`) para lo que no cabe en un `if`: ¿esto se hace pasar
   por un usuario orgánico? ¿esta afirmación es verificable? Su veredicto vuelve a pasar por las reglas duras.
4. **Falla cerrado.** Timeout, ambigüedad, dato que falta: **la acción no sale.**

El argumento es económico antes que ético: **el canal es el activo.** Un sistema que hace astroturfing
se quema Meta, X y su propio dominio en semanas. Un sistema autónomo que se quema sus propios canales
no es un negocio autónomo — es una máquina de destruir activos rápido.

Cada acción bloqueada **queda en el tablero**. Un sistema autónomo sin bitácora de lo que *no* hizo no
se puede auditar.

### 2. Los canales

Permitidos: anuncios pagados por API (la plataforma los rotula), cuentas propias de marca hablando con
su nombre, SEO programático en dominio propio, email y WhatsApp **sólo a quien se registró**,
patrocinios declarados, voz entrante (o saliente sólo a quien dejó su número).

Rechazados por el kernel: astroturfing, reseñas falsas, voz en frío, voz que no se declara IA,
afirmaciones no verificables, datos raspados.

### 3. Los bandits — con el freno de mano puesto

Thompson sampling sobre Beta-Bernoulli, un brazo por (canal × creatividad). Tres frenos:

- **Piso de exploración:** ningún brazo baja del 5% del presupuesto mientras tenga `n < 30`.
- **Cuota fija al arranque:** las primeras 3 semanas el reparto es plano. El bandit mira, no toca.
- **Prueba secuencial (mSPRT):** para que el *juez* use un ganador como evidencia se exige `n ≥ 30`
  conversiones por brazo. Un peek diario sin corrección secuencial infla el falso positivo sobre 30%.

**La distinción que importa:** el bandit puede inclinar el reparto con poca evidencia — el costo de
equivocarse son unos pesos mal puestos. El juez no: mover presupuesto entre creatividades y **matar una
idea** son decisiones de peso muy distinto, y exigen evidencia de peso muy distinto.

### 4. El juez

Corre una vez al día por idea (`claude-sonnet-5`). Recibe tres cosas: el manifiesto **sellado con un
hash**, las métricas del endpoint de la idea, y su propia bitácora.

| Puede | No puede |
|---|---|
| Leer los `criterios_de_muerte`. | **Editarlos.** No tiene herramienta de escritura sobre el manifiesto. |
| Emitir `escalar` · `mantener` · `reducir` · `pausar` · `matar`. | Inventar una decisión fuera de esa lista. |
| Reasignar presupuesto **dentro** de los topes. | **Levantar un tope.** Lo pidió; el kernel lo rechazó. |
| Declarar que **no puede decidir** por falta de muestra o de dato. | Sustituir un criterio que no puede medir por otro que sí. |
| Citar la regla y la evidencia. | Emitir un veredicto sin cita. |

**Por qué el sello importa:** con seis meses invertidos, «relajar el umbral de activación de 15% a 11%»
suena razonable. Suena razonable *porque* hay seis meses invertidos. Ese es el sesgo entero, y la única
defensa es que el arco no se pueda mover.

### 5. El tablero

Gasto vs ingreso por idea y por portafolio, CAC, payback, activación, churn, runway, la bitácora del juez
con su regla citada, y las acciones que el kernel bloqueó. Datos mock, **aritméticamente consistentes**:
la suma del gasto de las 16 ideas es el gasto del portafolio ($38.530.000), y la suma de los presupuestos
asignados cabe bajo el tope ($8.180.000 ≤ $9.000.000).

---

## El manifiesto `autopilot.json` — el único acoplamiento

El sistema no sabe nada de una idea salvo lo que ese archivo dice. No hay código por idea, no hay rama,
no hay despliegue. Una idea futura se enchufa escribiéndolo.

**Los `criterios_de_muerte` no se inventan ahí: se copian** del `roadmap.html` que la idea ya escribió.
El campo `cita` guarda el texto literal, y **es lo que el juez le lee de vuelta a la idea cuando la mata.**
Un criterio no se puede editar después de que la idea recibió gasto: el manifiesto se sella con un hash.

Campos obligatorios: `idea` (el id de carpeta, no la marca), `autonomia`, `oferta.checkout` (si no hay
pasarela donde un desconocido pueda pagar solo a las 2 de la mañana, **no hay autonomía total**),
`publico.canales` (lista blanca — pedir un canal no declarado es una acción bloqueada),
`presupuesto.tope_total_antes_de_revisar_clp` (**el número que el juez no puede levantar**),
`metricas.endpoint` + `metricas.eventos`, `metricas.activacion` (en prosa honesta),
`criterios_de_muerte[]` y `cumplimiento`.

---

## ¿Cuáles de las 16 ideas existentes se enchufan?

Cuatro criterios operativos: **¿puede un desconocido comprar solo? ¿la entrega es 100% software?
¿hace falta que un humano venda? ¿hace falta onboarding, hardware en terreno o un contrato firmado?**

| Carpeta | Marca | Clase | Motivo |
|---|---|---|---|
| `01-licitaciones` | Adjudate | **Total** | Dato público, alertas por software. Su criterio M5 dice que si al mes 20 todo sigue siendo outbound a mano «esto es una consultora». El sistema es el canal que le falta. |
| `02-cobranza` | Tinoria | **Total** | Conectar el SII es self-service estándar en Chile. El WhatsApp lo manda *el cliente a sus deudores*: su canal, no el nuestro. |
| `03-agenda` | Zurcia | **Total** | El número de WhatsApp se conecta con el *embedded signup* de Meta. Ticket bajo, ICP alcanzable por Meta Ads. El caso de libro. |
| `04-inventario` | Mermata | **Parcial** | El diagnóstico gratis es un imán de leads automatizable — *el sistema lo corrió, y por eso pudo matarla*. Pero la **puesta en marcha de $190.000** y la integración con cada POS son trabajo humano. Su hito H4 es «un POS nos distribuye»: eso es una negociación. |
| `05-contratos` | Antefirma | **Total** | **El caso más limpio.** Subes un PDF, pagas con tarjeta, recibes el informe. Payback 2,8 meses en el tablero. |
| `06-arriendos` | Conserjo | **Total** | Cuña transaccional ideal para adquisición pagada: informe de arrendatario a $6.900, sin hablar con nadie. |
| `07-terreno` | Rutamo | **Parcial** | La activación depende de que **una cuadrilla de técnicos adopte una app en terreno**. Su criterio H3 es «adopción del técnico bajo 50%», y su roadmap modela un vendedor con CAC de $900.000. Y hoy ni siquiera puede evaluar su criterio: **no publica el evento**. |
| `08-laboral` | Contralta | **Total** | Software puro, con cuña transaccional ($19.000 la auditoría de un finiquito). Se enchufó bien — **y el sistema la pausó igual.** |
| `09-despacho` | Kilonauta | **Total \*** | La demanda es 100% self-service. **\*Pero el negocio no existe sin un contrato de tarifas negociado a mano con los couriers** (su hito M2). Eso es compra de suministro, aguas arriba: Cuantario la *opera*, no la *funda*. |
| `10-contabilidad` | Talonio | **Total** | Software puro. Su canal preferido son los contadores (alianza humana), pero el SEO long-tail y Google Ads funcionan sin nadie. |
| `11-correas` | Cintavia | **No** | **Hardware instalado en faena.** Su M0 es «una estación instalada con permiso escrito al día 90». Homologación, ciclo 8-14 semanas. |
| `12-seguridad` | Cuasio | **No** | El ticket más bajo de las cinco mineras y **aun así no**. Su H1 exige «tres contratistas firmaron carta de piloto». Desplegar a 80-250 personas en faena es gestión del cambio, no un signup. |
| `13-contratistas` | Torniqua | **No** | **Lector físico en la portería**, que además hay que regalarle a un tercero que no paga. Su H1: «si ninguna faena nos deja instalar el lector, el canal no existe». |
| `14-permisos` | Cianota | **No** | ICP: titular de proyecto > US$100 M. **CAC modelado $8.200.000–$15.000.000, ciclo 9 meses.** No hay embudo: hay una lista y hay que ir a verlos. |
| `15-agua` | Freatia | **No** | Ciclo > 12 meses (es su propio criterio de muerte), implementación de 12 semanas con un fundador en faena, 200 cuentas en todo Chile. Su M4: «si no se puede instalar sin nosotros, no es un producto». |
| `16-finakids` | Finakids | **Parcial** | **Dos negocios en una carpeta.** La línea Familia ($4.990/mes) se opera entera. La línea Marca ($54.000.000/año) pasa por un comité legal y un RFP. Además el kernel le impone una restricción única: **prohibido segmentar a menores.** Se publicita al padre. |

**8 total · 3 parcial · 5 no.** Las 5 nuevas (`17`–`21`) nacen con el manifiesto puesto: `total` por diseño.

> «Total» no significa que la idea vaya a funcionar: significa que el sistema puede operarla sin humanos.
> 08-laboral es autonomía total y el juez la pausó en el mes 9.

---

## El juez, con dientes (lo que se ve en el tablero)

- **MATAR · 04-inventario / Mermata.** Regla H2, copiada de su roadmap: *«Menos de 2 de cada 10
  diagnósticos convierten a pago…»*. Evidencia: 118 diagnósticos, 13 pagos = **11,0%**, IC 95% Wilson
  **[6,6% – 17,9%]**. El límite superior está bajo el umbral de 20%: no es ruido. Gasto congelado en
  $3.410.000 de un tope de $6.000.000. **$2.590.000 no se gastan.**
- **PAUSAR · 08-laboral / Contralta.** Regla M4 (mes 9): CAC > $350.000 **o** churn > 6%. Observado: CAC
  $484.000 y churn 6,4%. **No la mata**, la pausa: su roadmap declara «cortar el equipo», no «cerrar».
  El juez no cierra lo que la idea no declaró como muerte.
- **REDUCIR · 06-arriendos / Conserjo.** Regla M4: CAC sobre 6 meses de margen **y** churn sobre 5%,
  **a la vez**. Churn 5,8% ✓, payback 5,5 meses ✗. **Una de dos no es dos. No es criterio de muerte y el
  juez no lo trata como tal.** Reduce 40% y re-evalúa. *El arco no se mueve en ninguna de las dos
  direcciones.*
- **SIN VEREDICTO · 03-agenda / Zurcia.** Payback 4,0, LTV/CAC 6,4, la mejor idea del portafolio.
  **El juez no la escala:** n = 23 pagos, el umbral es 30. Faltan 7.
- **SIN VEREDICTO · 16-finakids.** Retención D30 14,2% con n=340. Para distinguirla de 10% con α=0,05 y
  potencia 0,8 se necesita **n ≈ 441**. Todo apunta a que pasa. **No basta.**
- **SIN VEREDICTO · 07-terreno / Rutamo.** Su criterio depende de `adopcion_tecnico` y **su endpoint no
  lo publica.** El juez no evalúa lo que no puede medir y no lo sustituye por otro criterio. Emite una
  falla de manifiesto, no una decisión.
- **TOPE DURO · portafolio.** El juez pidió reasignar los $1.400.000 liberados. Sólo pudo colocar
  $590.000: 05-contratos y 17-datos-empresas tocaron su tope de +40%/ciclo. Pidió una excepción.
  **El kernel se la negó.**

---

## Economía

### Costo mensual (16 ideas operadas, 21 manifiestos conectados)

| Componente | Detalle | CLP/mes |
|---|---|---|
| Inferencia | US$120,02 × $960 — juez, kernel, creatividades, SEO, voz | $115.219 |
| Infraestructura | US$306 × $960 — Fly, Postgres, Redis, Twilio, dominios… | $293.760 |
| Mantención de plataforma | 4 h × $32.000 — **fuera del loop de decisión** | $128.000 |
| **Total** | | **$536.977** |

Inferencia, con la aritmética a la vista (`claude-sonnet-5` US$3/US$15 por MTok; `claude-haiku-4-5`
US$1/US$5; TC $960):

| Agente | Modelo | Volumen | US$/mes |
|---|---|---|---|
| Juez | sonnet-5 | 21 × 30 = 630 corridas · 14.000 in / 1.200 out | 37,80 |
| Kernel (clasificador) | haiku-4.5 | 2.400 acciones · 3.000 in / 400 out | 12,00 |
| Creatividades | sonnet-5 | 252 piezas · 4.000 in / 800 out | 6,05 |
| SEO programático | sonnet-5 | 840 páginas · 6.000 in / 2.500 out | 46,62 |
| Voz | haiku-4.5 | 5.400 turnos · 2.000 in / 250 out | 17,55 |
| | | | **120,02** |

**La forma importa más que el monto:** $536.977 = **$446.689 fijos + $5.643 por idea × 16**.
La idea número 17 cuesta $5.643 al mes.

Construcción, aparte: ~5 meses de un senior a $4.500.000 de costo empresa = **$22.500.000**,
amortizados a 24 meses = $937.500/mes. Va incluida en todo lo que sigue.

### ¿A partir de cuántas ideas se paga solo? Hay dos respuestas.

**Lectura A — ¿es más barato que contratar a alguien? → 2 ideas.**
Un operador de growth cuesta $2.300.000/mes y lleva 2 ideas: $1.150.000 por idea.

```
1.150.000·N = 1.384.189 + 5.643·N
1.144.357·N = 1.384.189
N = 1,21  →  desde la segunda idea
```
Con las 16 de hoy: **$1.474.477 contra $18.400.000. 12,5× más barato.**

**Lectura B — ¿no será el sistema más caro que la plata que administra? → 15 ideas.**
Una operación de medios sana no gasta más del 20% en la estructura que la administra. Cada idea mueve
$511.250/mes de gasto de canal ($8.180.000 ÷ 16).

```
1.384.189 + 5.643·N ≤ 0,20 · 511.250 · N
1.384.189 ≤ 96.607·N
N = 14,3  →  recién a las 15 ideas
```

**Con 2 ideas, Cuantario cuesta $1.395.475 al mes para repartir $1.022.500 en anuncios.** Es más barato
que un humano y aun así es una idiotez.

**La respuesta útil es 15, no 2.** Bajo eso, esto es una obra de ingeniería buscando un problema.
Este portafolio tiene 21, con 16 operables. Por eso el sistema existe. Si tuviera tres, no debería.

### El juez, por sí solo, NO paga el sistema

| Concepto | CLP |
|---|---|
| 04-inventario matada · tope $6.000.000 − gastado $3.410.000 | $2.590.000 |
| 08-laboral pausada · tope $5.000.000 − gastado $2.420.000 | $2.580.000 |
| **Capital preservado por el juez** | **$5.170.000** |
| Costo del sistema en el ciclo · 6 meses × $1.474.477 | −$8.846.862 |
| **Diferencia** | **−$3.676.862** |

Un vendedor diría que el juez «se paga 2,3 veces» comparándolo contra los $3.221.862 de operación pura y
escondiendo la construcción. Es la cuenta que este mismo kernel bloquearía por no verificable.

**La escala paga el sistema; el juez hace que la escala no arruine al dueño.** Son dos cosas distintas y
sólo una de las dos es un ahorro contable.

---

## Qué haría falsa toda esta página

- **Que el humano y el sistema no produzcan lo mismo** — y no lo producen. Un operador humano negocia con
  un courier, arma una alianza con Nubox, consigue prensa. Cuantario no hace nada de eso. La Lectura A
  supone un humano dedicado sólo a comprar medios y mirar números: es la comparación **más favorable al
  sistema** que se puede hacer con honestidad, y hay que leerla sabiéndolo.
- **Que el gasto de canal por idea sea mucho menor.** Con la mitad de presupuesto, el umbral de la
  Lectura B se duplica a ~29 ideas.
- **Que las ideas no publiquen su endpoint de métricas.** Sin eso el juez es ciego, el sistema es un
  comprador de anuncios sin freno, y no vale $536.977 al mes. **Es la dependencia dura, y hoy no la
  cumple ninguna** — el síntoma ya se ve en el tablero con 07-terreno.

## Qué está falseado en el demo

Las cifras (mock, pero aritméticamente consistentes), el bandit (las cuotas se interpolan; Thompson real
necesita conversiones reales), los nueve veredictos (escritos — pero **las reglas y las citas salen
textuales de los `roadmap.html`**, y las cuentas están hechas: 11,0% con IC [6,6%–17,9%]; n=441 requerido
para Finakids), y las 11 acciones del kernel (plausibles, no reales).

## Stack

Node 22 + Fastify · Postgres 16 · Redis (estado de bandits, colas idempotentes) · Fly.io ·
Meta/Google/TikTok Ads API · Instagram Graph, X, LinkedIn API · WhatsApp Business API · Resend ·
Twilio + Deepgram (ASR) + Cartesia (TTS) · Anthropic API (`claude-sonnet-5` para el juez, las
creatividades y el SEO; `claude-haiku-4-5` para el kernel y la voz) · Axiom · Sentry.
