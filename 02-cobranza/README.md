# Tinoria — cobrar con tino

**Dominio:** `tinoria.com` — verificado libre (RDAP Verisign → HTTP 404, 2026-07-12 y 2026-07-13).
`tinoria.cl` también libre. Alternativas verificadas: `cobralto.com`, `talantar.com`, `saldaru.com`.

**Pitch:** un tablero de cuentas por cobrar que se arma solo desde el SII, más un agente de IA que
persigue tus facturas vencidas por WhatsApp y correo — con el tono exacto para que te paguen sin que
pierdas al cliente.

**Precio:** $49.000 (Libro) · **$99.000 (Cartera)** · $229.000 (Cobranza) al mes + IVA.
Y un Plan Resultado —$29.000 + 1,2% de lo recuperado sobre facturas con más de 45 días— para el escéptico.

---

## El problema

Las PYMEs chilenas facturan a 30, 60 y 90 días, y después tienen que ir a buscar la plata a mano.
Alguien —normalmente la dueña, o la única persona de administración— se sienta el viernes a mandar
correos incómodos, llamar, mandar WhatsApp, y a hacerlo todo de nuevo la semana siguiente. Es un trabajo
emocionalmente desagradable, se posterga, y la caja se muere esperando.

El costo real no es la factura incobrable. Es la que te pagan **45 días tarde, todos los meses, para
siempre**: el capital de trabajo atrapado y el tiempo del dueño.

La aritmética de una PYME cualquiera (estimación, supuestos declarados):

```
Facturación anual              $480.000.000
DSO real 68 días · pactado 30  → 38 días de exceso
Capital atrapado por día:  480.000.000 / 365  = $1.315.068
38 × $1.315.068                              = $49.972.584  ← tu plata, gratis, en el balance de otro
Si se financia con factoring al 1,9% mensual = $11.393.749/año de puro costo financiero
Más 6 h/semana de administración             =  $1.934.400
────────────────────────────────────────────────────────────
Costo anual de cobrar mal  ≈ $13,3 MM     ·     Tinoria (Cartera) = $1.188.000/año
```

## La cuña

**El tono es el producto. Todos los demás son el recordatorio.**

Nadie posterga la cobranza porque le falte un botón. La posterga porque no sabe cómo pedirle plata a
alguien sin quedar mal. Un ERP te dice *quién* debe; no te dice *qué decirle*, no conversa, no entiende
la respuesta, y no distingue a un deudor que colabora de uno que te está esquivando.

Chile juega a favor: el DTE del SII es obligatorio, así que las cuentas por cobrar ya son datos
estructurados y el onboarding son once minutos.

---

## Negocio

### Cliente objetivo

- **Segmento:** PYME B2B que vende a crédito a otras empresas — metalmecánica, ingeniería, proveedores
  de la construcción, importadores, transporte, imprentas. Tramo pequeña/mediana del SII
  (2.400–25.000 UF ≈ $100 MM–$1.000 MM de facturación anual).
- **Quién lo usa:** la encargada de administración. Una sola persona, 30–200 facturas abiertas, vive en
  un Excel que armó ella.
- **Quién firma:** el dueño. No compra software: compra caja. El argumento que cierra la venta es
  *"tu DSO son 68 días y deberían ser 40 — eso son $37 millones tuyos en el bolsillo de otro"*.
- **Señal de compra más limpia:** usó factoring en los últimos 12 meses. Ya está pagando, y caro, por el
  problema que resolvemos barato.
- **Cabecera de playa:** metalmecánica e ingeniería de 10–60 trabajadores en la RM y el Biobío. Seis
  meses, sólo ése.

### Mercado (Chile) — aritmética a la vista

```
Empresas formales (SII, orden de magnitud): pequeña ≈180.000 + mediana ≈25.000 = 205.000
SUPUESTO 1 — 45% vende B2B a crédito                   → 92.250 empresas
TAM   92.250 × $99.000 × 12                            = $109.593 MM CLP/año ≈ US$115 MM
SAM   × 55% (usa software integrable) × 65% (≥25 facturas abiertas)
      32.980 empresas × $99.000 × 12                   = $39.180 MM CLP/año  ≈ US$41 MM
SOM   1,8% del SAM en 36 meses = 594 clientes × $95.000 × 12 ≈ US$713 k de ARR
LatAm (extrapolación gruesa, ×12 PYMEs formales × 0,7 disposición a pagar) ≈ US$345 MM
```

Los conteos del SII son de orden de magnitud (bailan ±15% según el año). El 45% es **un supuesto
nuestro, no un dato** — es la primera cosa que hay que medir.

### Competencia

| Quién | Cobra | Por qué le ganamos — y dónde no |
|---|---|---|
| **El Excel de Paulina** (el titular real) | $0 | El Excel no escribe, no insiste, no se acuerda. Pero es gratis y ella lo controla: no le ganamos en confianza. |
| **Nubox · Bsale · Defontana · Softland** | $25k–$150k/mes | Su reporte dice quién debe, no qué decirle. **El riesgo real: que lo construyan como módulo y lo regalen.** |
| **Chipax** | desde ~$60k/mes | El competidor chileno más cercano y más peligroso: ya tiene la confianza del mismo comprador. Le ganamos en profundidad de una sola cosa: la conversación. |
| **Toku** | % del recaudo | Pagos recurrentes de alto volumen. Solapamiento parcial y creciente. |
| **Factoring (Tanner, Factotal, BICE)** | 1,7–2,4% mensual | No compiten: son el argumento de venta. Pero ellos te dan la plata *hoy*; nosotros no prestamos. |
| **Estudios de cobranza** | 8–15% de lo recuperado | No competimos: los evitamos. Tinoria termina donde ellos empiezan. |
| **Chaser · Upflow · Growfin** | US$50–500/mes | Maduros, pero no leen el SII, no mandan WhatsApp, no saben de la Ley 21.131, y su IA no escribe como una administradora de Quilicura. |

**Diferenciación honesta:** el software no es difícil de copiar; un ERP lo clona en dos trimestres. Lo
que no se copia rápido es (1) el corpus de qué mensaje, en qué tono y por qué canal hace pagar a qué tipo
de deudor chileno, y (2) la confianza para soltarle el teclado a una máquina frente a tu mejor cliente.
Si en 18 meses no tenemos ninguna de las dos, somos una feature y merecemos que nos coman.

### Economía unitaria

```
Plan Cartera $99.000/mes
COGS: WhatsApp $4.200 + IA $3.800 + AWS $2.500 + correo/banco/soporte $1.500 = $12.000  → margen 88%

Por plan:  Libro $4.500 (91%) · Cartera $12.000 (88%) · Cobranza $32.000 (86%)
Mezcla 25/60/15 → COGS mezclado $13.125 · ARPU de trabajo $95.000
                  Contribución $81.875   ·  MARGEN BRUTO MEZCLADO 86%

CAC mezclado $260.000 (SDR $320k · contadores $237k · Ads $233k · SEO $150k)
LTV, con sensibilidad al churn (que NO conocemos):
   churn 3%/mes → 33 m → LTV $2.728.000 → 10,5×
   churn 4%/mes → 25 m → LTV $2.047.000 →  7,9×   ← caso base
   churn 6%/mes → 17 m → LTV $1.364.000 →  5,2×
Payback de CAC = 3,2 meses
```

El 86% es el mismo número que dibuja la curva de caja del roadmap y el mismo COGS que calcula
`stack.html`. Las tres páginas cuadran.

### Canales, en orden

1. **Contadores** — un contador ve 40 PYMEs y es el único a quien el dueño le cree. 20% recurrente.
   Es el canal que decide si esto escala.
2. **Outbound con gancho** — no ofrecemos software, ofrecemos un **diagnóstico de DSO gratis**: mándanos
   tu Registro de Ventas (CSV del SII, sin claves) y te decimos cuánta plata tienes atrapada. El informe
   *es* el producto de entrada.
3. **Integración en el ERP que ya usan** (Nubox, Bsale, Defontana). Lento y político, pero un botón
   "Cobrar con Tinoria" dentro de Nubox vale más que todo el presupuesto de Ads del año.
4. **SEO long-tail es-CL** — "carta de cobranza modelo", "ley de pago a 30 días interés", calculadora de
   interés de la Ley 21.131. El único canal con CAC decreciente.
5. **Gremios** (ASIMET, ASECH, CChC, CCS) — charla: *"Cómo cobrarle a tu cliente sin pelearte con él"*.
6. **Google Ads** — sólo Google, nunca Meta. Nadie compra software de cobranza mirando reels.
   CPL estimado $28.000 · conversión 12% · CAC $233.000.
7. **Mercado Público** — no, todavía. Alarga el ciclo y nos saca del segmento.

### IA en el marketing

**Sí:** el informe de DSO personalizado (es marketing porque es producto), 40 páginas SEO de plantillas
por rubro donde la variación es real, y calificar leads entrantes.
**No:** responder leads calientes (vendemos confianza para delegar conversaciones difíciles — un bot ahí
destruye el argumento), 300 artículos de blog, casos de éxito inventados, y outbound masivo generado.

### Primeros 90 días

- **Día 1–15** — 20 entrevistas, cero código. Copiar a mano 40 secuencias de cobranza reales. Ese corpus
  es el activo fundacional y no se puede comprar.
- **Día 16–45** — el núcleo con el humano adentro: SII por CSV, tablero, redactor de tres tonos,
  aprobación. Sólo correo; el WhatsApp lo mandamos nosotros copiando y pegando. 5 design partners gratis.
- **Día 46–75** — WhatsApp Business API de verdad. Y les cobramos $49.000. Si ninguno paga, el problema
  no era tan caro como creíamos.
- **Día 76–90** — 10 clientes pagando y publicamos *"El DSO real de 10 PYMEs chilenas"*: dato propio que
  no existe publicado en Chile, y que ningún competidor puede copiar.

### Qué mataría esto

1. **Que no sea olvido, que sea que no hay plata.** Todo el producto asume que buena parte de la mora es
   *fricción*. Si la mayoría no paga porque **no puede**, ningún tono mueve la aguja. **Es la hipótesis
   central y se mide antes del día 60.**
2. **Que la administradora no suelte el teclado.** Si *todo* pasa por aprobación manual, no ahorramos
   tiempo: agregamos un paso.
3. **Que Nubox lo incluya gratis.** Es lo que yo haría en su lugar.
4. **Que Meta nos corte WhatsApp.** El canal principal no lo controlamos.

---

## Roadmap — 6 hitos, cada uno con su criterio de muerte

| # | Mes | Hito | Caja gastada | Equipo | Clientes / MRR | **Criterio de muerte** |
|---|---|---|---|---|---|---|
| H1 | 2 | 5 design partners usando el producto | $15 MM | 3 | 0 / $0 | < 5 de 20 aceptan conectar su cartera **gratis** → el problema no duele |
| H2 | 4 | Primer cliente pagando | $31 MM | 3 | 3 / $0,3 MM | 0 de 5 design partners acepta pagar $49.000 |
| H3 | 7 | Los primeros diez | $56 MM | 4 | 14 / $1,4 MM | **Recuperar < 25% del vencido, o el DSO no baja 8 días en 90 días de uso** |
| H4 | 12 | Venta repetible | $102 MM | 4 | 51 / $4,8 MM | CAC > $600.000 o churn > 7%/mes |
| H5 | 18 | Escala de canal (contadores) | $154 MM | 5 | 117 / $11,1 MM | 80% aún llega por outbound del fundador → no hay canal, hay una consultora |
| H6 | 24 | **Punto de decisión** | $186 MM | 6 | 200 / $19,0 MM | MRR < $8 MM → devolver la caja |

**H3 es el hito que mata la idea**, y por eso es el más importante: ahí se sabe si la mora es fricción o
insolvencia.

### Escenarios (simulación mes a mes, supuestos declarados)

| Escenario | Nuevos/mes | Churn | Ticket | Mes 24 |
|---|---|---|---|---|
| Pesimista | 6 | 6% | $79.000 | 61 clientes · $4,8 MM/mes · **US$60k ARR** |
| **Base** | 20 | 4% | $95.000 | 200 clientes · $19,0 MM/mes · **US$240k ARR** |
| Optimista | 34 | 3% | $110.000 | 411 clientes · $45,2 MM/mes · **US$571k ARR** |

### Caja

Levantamiento supuesto **$220 MM** (CORFO Semilla Inicia ≈$25 MM + programa tipo Start-Up Chile ≈$30 MM
+ ángeles ≈$165 MM; los montos públicos son de orden de magnitud, hay que verificar las bases vigentes).

En el caso base, al mes 24: **$19,0 MM de quema contra $16,4 MM de contribución** — una brecha de
$2,6 MM. Quedan **$33,7 MM de caja = 1,8 meses de runway**. El break-even de contribución llega recién
alrededor del **mes 27**.

**Las curvas no se cruzan dentro del horizonte, y eso no es un error del gráfico: es el hecho central del
plan.** Por eso el mes 24 es un punto de decisión —levantar, bootstrapear o matar— y hay que tomarlo en
el mes 21, no en el 24.

### La restricción real: la retención, no el embudo

Conseguir reuniones no es el problema (el dolor es agudo y el informe de DSO abre puertas). El problema
es **el mes 3**, cuando el cliente mira su DSO y decide si esto sirvió. Proyección declarada: la cohorte
cuyo DSO baja ≥8 días retiene ~85% al mes 12; la que no lo ve bajar cae a ~23%. **El trabajo del equipo
de éxito de cliente no es "acompañar": es hacer bajar el DSO de la cohorte antes del mes 3.**

### Probabilidad de éxito — rango, con derivación

**Clase de referencia A:** fracción de startups SaaS B2B que llega a US$1 MM de ARR. El número que se
cita habitualmente es **~4%**. *Advertencia honesta: no he podido verificar una fuente primaria sólida;
las estimaciones van de 2% a 6% según cómo se defina "startup". Lo uso como orden de magnitud, no como
dato.*

**Clase de referencia C —la que de verdad importa:** ¿qué fracción de los SaaS verticales B2B fundados en
Chile, con ticket bajo US$120/mes, llega a US$500k de ARR? **No lo sé, y no hay dato público confiable.
No lo voy a inventar.** Su ausencia es, en sí misma, incertidumbre que hay que declarar.

```
Base (clase A)                                        ~4%
× 2,0  presupuesto existente + cuña medible + datos gratis del SII
× 1,4  canal de distribución preexistente (contadores)
× 0,6  riesgo binario de la hipótesis central (¿fricción o insolvencia?)
× 0,7  imitabilidad por el ERP titular
─────────────────────────────────────────────────────────────────
                                          = 4,7%  incondicional

Condicional a superar H3 en el mes 7 (el riesgo binario se resuelve
y el ×0,6 desaparece):   4% × 2,0 × 1,4 × 0,7 = 7,8%
Con la incertidumbre de la clase de referencia (2%–6%) → rango 4%–12%
```

| Desenlace | Probabilidad |
|---|---|
| Muerte o zombi antes del mes 24 | **50–60%** |
| Negocio rentable y chico (US$200–500k ARR, 4–6 personas) | **28–36%** |
| Trayectoria de capital de riesgo (≥US$1 MM ARR al mes 36) | **8–14%**, condicional a H3 en el mes 7 (sin ese condicional: 4–7%) |

Los puntos medios suman ~98%. No suman exacto y no lo van a hacer: son estimaciones subjetivas, y
forzarlas a sumar 100 les daría una precisión que no tienen.

**Lo mejor de esta idea no es la probabilidad: es que la pregunta que lo decide todo se responde en
7 meses y por $56 millones.**

---

## Arquitectura

### Cuatro capas

1. **Entrada** — SII/DTE (certificado digital o CSV del Registro de Ventas) · ERP (Nubox, Bsale,
   Defontana, Softland, Chipax) · banco (Fintoc, para conciliar pagos).
2. **Núcleo** — Postgres con RLS por `empresa_id` · motor de cadencia (cron horario) · cola Redis.
3. **Agentes** — ver abajo.
4. **Salida** — WhatsApp Cloud API (desde el número **del cliente**, vía 360dialog) · Postmark con DKIM
   delegado · la bandeja de aprobación.

### Modelo de datos

`empresa` · `deudor` · `factura` · `mensaje` · `cadencia`/`paso_cadencia` · `plan_pago`/`cuota`

Campos que importan más de lo que parecen:

- `factura.acuse_recibo` — **el plazo de 30 días de la Ley 21.131 corre desde acá, no desde la emisión.**
  Sin acuse no hay mora exigible.
- `deudor.sensible` — si es true, ningún mensaje sale sin aprobación humana. Ni el recordatorio.
- `deudor.promesas_rotas` — dos, y el crédito se suspende. Es una regla, no una sugerencia.
- `mensaje.resultado_7d` — ¿pagó dentro de 7 días de este mensaje? **Es el foso**: es la etiqueta con la
  que se aprende qué tono funciona con qué deudor.
- `mensaje.aprobado_por` — auditoría: siempre se sabe quién autorizó qué.

### Los tres agentes

| Agente | Modelo | Trabajo | Por qué ese modelo |
|---|---|---|---|
| **El Redactor** | `claude-sonnet-5` | Escribe el mensaje de cobranza. 180/mes por cuenta. | Haiku escribe un español correcto pero plano, y una plantilla no cobra. Opus cuadruplicaría el costo sin una mejora que el deudor note. |
| **El Oyente** | `claude-haiku-4-5-20251001` | Clasifica la respuesta del deudor: promesa / disputa / falta_documento / problema_caja / evasiva / pagado. | Es clasificación con extracción de fechas: Haiku la hace igual de bien y corre en cada mensaje entrante. |
| **El Escribano** | `claude-opus-4-8` | Sólo la carta de cobro formal y el escalamiento. 3/mes. | Es el único caso donde un error tiene consecuencias legales, y el costo por llamada (≈$64) es irrelevante frente al daño de equivocarse. |

El contexto que se le arma al Redactor **es** el producto: el hilo completo, las promesas rotas, cuánto
vale ese cliente al año, y qué tono funcionó antes con *ese* deudor. El modelo es un commodity.

Lo que ningún agente hace: escalar solo, mandar la carta formal sin que un humano apriete el botón,
escribirle a un cliente sensible sin aprobación, calcular intereses (los recibe calculados), condonar
deuda, o llamar por teléfono con voz sintética.

### Costo mensual (plan Cartera, dólar a $950)

```
A · Inferencia sin caché
  Redactor  · sonnet-5 · 180 msg → 0,720 MTok in × US$3 + 0,108 MTok out × US$15 = US$3,78
  Oyente    · haiku-4-5 · 90 resp → 0,135 × US$1 + 0,018 × US$5                  = US$0,23
  Priorización diaria · sonnet-5 · 30 → 0,240 × US$3 + 0,024 × US$15             = US$1,08
  Escribano · opus-4-8 · 3 cartas → 0,018 × US$5 + 0,0045 × US$25                = US$0,20
                                                                     TOTAL sin caché = US$5,29
B · Con prompt caching (600k tok de sistema cacheados, lectura a 10%)  = US$3,76 = $3.570
    + 6% de holgura por reintentos                                     →  $3.800

C · El resto
  WhatsApp 110 msg × US$0,04 = $4.200 · AWS ($360/mes ÷ 150 cuentas) = $2.500
  Postmark $570 + Fintoc $475 + soporte L1 $455 = $1.500
  ──────────────────────────────────────────────────────────────────────
  COGS Cartera = 3.800 + 4.200 + 2.500 + 1.500 = $12.000   → margen 88%

D · Mezclado (25/60/15) → COGS $13.125 · contribución $81.875 · MARGEN BRUTO 86%
E · Costo fijo de plataforma (no por cuenta) ≈ US$590/mes = $560.000 CLP
```

### Lo que hay que contratar

Anthropic API · Meta WhatsApp Cloud API (vía 360dialog o Twilio) · SII/DTE (gratis, pero sin API moderna:
asumir mantención permanente) · Fintoc (conciliación bancaria — **no es opcional**: seguirle cobrando a
alguien que ya pagó es el peor error posible del producto) · Postmark · APIs de los ERP · AWS.

**El cuello de botella real del onboarding no es técnico, es Meta:** la verificación de negocio y las
plantillas aprobadas toman entre 3 días y 3 semanas. Es la parte que hay que hacer *por* el cliente, no
*con* el cliente.

### Frenos de mano (no son decoración)

```
MAX_MENSAJES_DIA_POR_DEUDOR=1        # jamás dos mensajes el mismo día
ESCALAMIENTO_DIA_MINIMO=45           # la carta formal no existe antes del día 45
REQUIERE_APROBACION_SI_SENSIBLE=true
HORA_MIN_ENVIO=09:00 / HORA_MAX_ENVIO=19:00
ENVIAR_FIN_DE_SEMANA=false           # cobrar un domingo es una falta de respeto
```

Es lo que separa un producto de cobranza de un producto de acoso. Un bug que mande tres WhatsApp
seguidos a las 23:00 no es un bug: es el fin de la empresa.

### Qué está falseado en el demo

- **No hay conexión al SII.** Los 218 DTE y los 11 deudores son inventados.
- **Ningún mensaje sale a ninguna parte.** Se agregan a un array en memoria.
- **Los textos los escribí yo, no un modelo** — tres tonos × dos canales × siete pasos, a mano. Es
  deliberado: quería que el tono se pudiera juzgar sin que un modelo tuviera un buen día. **Lo que el demo
  demuestra no es que el modelo escriba bien: es qué debería escribir. Ese es el spec.**
- **Las respuestas de los deudores están guionadas** (tres desenlaces por deudor, uno por tono). Que la
  carta formal a Servicios Austral le cueste el cliente no es una predicción del modelo: es una **tesis de
  producto**, y hay que validarla — es H3.
- **Las probabilidades de pago son ilustrativas.** Ese modelo no existe hasta tener ~200 interacciones
  etiquetadas.
- **El DSO baja demasiado rápido.** En la realidad es una media móvil y se mueve como un glaciar — que es
  justamente por lo que el cliente se impacienta en el mes 3.
- No hay autenticación, ni multi-tenancy, ni persistencia.

**Lo que NO está falseado:** el estado del demo es real y todo se deriva de él — los $100.180.000 por
cobrar, el 65% vencido, los 18 folios, los días de mora, el envejecimiento por tramos, el interés de la
Ley 21.131 factura por factura, las cuotas del plan de pago y la agenda que resulta de la cadencia. Nada
está escrito a mano en el HTML: se calcula. Marca una factura como pagada y los cinco números se mueven
juntos.

---

## Los archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Landing. El problema, la aritmética, cómo funciona, **el redactor en vivo** (mismo deudor, tres tonos, dos canales), precios, FAQ. |
| `demo/index.html` | El producto. Importas la cartera → tablero + envejecimiento → hilo del deudor → el agente redacta → apruebas → el deudor responde y el tablero se recalcula. Cadencia editable e Impacto (DSO). |
| `negocio.html` | ICP, TAM/SAM/SOM con la división a la vista, competencia, precio y economía unitaria, canales, IA en el marketing, 90 días, qué lo mata. |
| `roadmap.html` | 6 hitos con criterios de muerte, MRR en 3 escenarios, quema vs. contribución, saldo de caja y el valle, retención por cohorte, probabilidad como rango. |
| `stack.html` | Modelo de datos, los tres agentes con sus prompts, APIs, variables de entorno, costo con la aritmética, qué está falseado. |
| `estilo.css` | La dirección de arte. |

**Dirección de arte — "libro de caja":** papel crema, filetes de un pelo, cifras tabulares alineadas a la
derecha y un único acento, el rojo óxido del timbre `VENCIDO`. Tipografía deliberada: **Newsreader**
(serif editorial, con itálicas de verdad) para la *voz* —porque lo que este producto fabrica es prosa— y
**IBM Plex Sans/Mono** para las *cifras* —porque lo que administra es un libro de cuentas—.
Paleta de los gráficos validada con el validador de la skill `dataviz`: rampa ordinal de una sola tinta
para el envejecimiento y los escenarios, par categórico rojo/azul (ΔE 73 bajo protanopia) para la caja.
