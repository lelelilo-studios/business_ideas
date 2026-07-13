# Kilonauta

**El mismo paquete a Puerto Montt cuesta $9.930 o $5.320. Depende de a quién le preguntes.**

Un solo lugar para despachar a todo Chile: compara Chilexpress, Starken, Blue Express y Correos
de Chile en cada envío, imprime la etiqueta desde una sola impresora, le avisa al cliente antes
de que pregunte, y cuando el paquete se pierde —que se pierde— **el reclamo lo hacemos nosotros**.

| | |
|---|---|
| **Dominio** | `kilonauta.com` — **libre** (`rdap.verisign.com` → HTTP **404**, 2026-07-12). `kilonauta.cl` también libre. |
| **Alternativas verificadas** | `kilonave.com` · `zarpea.com` · `despachea.com` (las tres, HTTP 404) |
| **Categoría** | Logística / e-commerce PYME |
| **Mercado** | Chile → Perú y Colombia |
| **Precio** | Gratis (pagas la etiqueta) · Bodega $34.900/mes · Cordillera $99.900/mes |
| **Acento** | `#D8461B` — naranja de cinta de embalaje |
| **Estado** | Prototipo. Ninguna tarifa del sitio es una oferta. |

## Los archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Landing, con el **comparador de tarifas corriendo en vivo** (no una captura) |
| `demo/index.html` | El producto entero: pedidos → cotizar → etiqueta → tracking → reclamo |
| `negocio.html` | ICP, mercado con la aritmética a la vista, competencia con nombre, economía unitaria |
| `roadmap.html` | Seis hitos, seis criterios de muerte, cuatro gráficos, probabilidad como rango derivado |
| `stack.html` | Modelo de datos, agentes de IA con su costo, qué contratar, y **qué está falseado en el demo** |
| `tarifas.js` | El motor de tarifas. Lo usan la landing y el demo. |
| `kilonauta.css` | La hoja de estilo y la dirección de arte. |

Sin build, sin npm, sin CDN. Se abre `index.html` en un navegador y funciona.

---

## Dirección de arte

**"Sala de despacho".** La estética del rincón donde se empaqueta: cartón kraft, tinta de sello,
cinta de embalaje naranja, y el código de barras como motivo gráfico. Bordes de etiqueta
troquelada, reglas punteadas, números en monoespaciado tabular —porque un número de guía se lee
en mono, no en una grotesca de marketing— y titulares en una grotesca industrial estrecha, como
estarcida sobre una caja.

- **Archivo** (variable, ejes de ancho y peso) para titulares.
- **IBM Plex Sans** para la interfaz: familia hecha para interfaces técnicas.
- **IBM Plex Mono** para todo número: guías, tarifas, pesos, RUT.
- Un solo acento: `#D8461B`. Texto chico en `#A8330E` (5,83:1 sobre papel, AA).
- Paleta de gráficos validada con el validador de la skill `dataviz` (6/6 PASS, daltonismo incluido).

---

## Negocio

### El cliente

No es "PYME chilena". Es la dueña-operadora de una tienda online de productos físicos, entre 1 y
6 personas, que vende por su propio sitio (Jumpseller, Shopify) *y* por Instagram *y* por Mercado
Libre. **Ella firma y ella lo usa** — no hay comité, no hay TI, y por eso el ciclo de venta se
mide en días.

**El filtro duro:** 100–900 envíos/mes, y **más del 30% sale de la Región Metropolitana**.
Bajo 100 envíos el dolor no justifica cambiar de hábito. Sobre 900 negocia su propia tarifa.
Y si despacha sólo dentro de Santiago, el arbitraje es de un 5% y le estaríamos vendiendo humo.

### Cuánto le cuesta hoy (400 envíos/mes)

| Concepto | Al año |
|---|---|
| Sobrepago de flete (15% evitable) | $4.320.000 |
| 26,7 h/mes copiando direcciones e imprimiendo etiquetas | $1.920.000 |
| Paquetes perdidos que nunca reclamó | $1.008.000 |
| "¿Dónde está mi pedido?" × 100 al mes | $360.000 |
| **Total** | **$7.608.000** |

Estimación, no dato censal. Supuestos declarados: flete promedio pagado $6.000, hora de la dueña
$6.000, 0,45% de paquetes perdidos. **El 57% del dolor es plata que se va en flete, no tiempo
perdido** — y por eso el producto no puede ser sólo software.

### La tesis: el arbitraje es geográfico

Chile es largo. Con el motor de tarifas del sitio, mismo paquete (2 kg, caja 30×25×15):

| Destino | Dispersión entre couriers |
|---|---|
| Ñuñoa | **+5%** — no hay negocio |
| Antofagasta | +40% |
| Puerto Montt | +43% |
| Punta Arenas | **+83%** |

Correos de Chile tiene obligación de servicio universal: a zona extrema llega barato y llega
siempre. Blue Express ni siquiera cubre Coyhaique. **Nadie le está contando esto a la tienda que
despacha desde Providencia.**

### Mercado (la aritmética completa está en `negocio.html`)

- **TAM** — 190M paquetes/año × $4.400 = **US$880M**. El supuesto blando son los 15,3 paquetes
  por comprador al año; si fuera 12 el TAM cae a US$690M. **No conocemos el dato censal y no lo
  inventamos.**
- **SAM** — 28% de los paquetes (los grandes tienen contrato propio) × spread de $550 =
  **US$39M de ingreso neto al año.**
- **SOM (36 meses)** — 900 tiendas × 220 envíos = **US$1,65M de ingreso neto.**

**La lectura honesta:** si capturáramos el 10% del SAM seríamos una empresa de US$3,9M de ingreso
neto. Buena empresa. No un unicornio. Quien invierta acá tiene que estar cómodo con eso, o
financiar desde el día 1 la expansión a Perú y Colombia.

### La decisión: margen sobre la tarifa, NO SaaS

**Elegimos margen sobre la tarifa negociada al volumen**, con un piso de suscripción opcional.
Cuatro razones:

1. **Toca la plata.** El 57% del dolor de la clienta es el precio del flete. Un SaaS le vendería
   *orden* a alguien cuyo problema es el *costo*.
2. **Nos hace dueños del reclamo.** Si tenemos el contrato, el courier nos responde a nosotros.
   **Un SaaS puro no puede ofrecer esto ni queriendo** — no tiene legitimación frente al courier.
   Es nuestra única ventaja estructural.
3. **El techo del SaaS es bajo.** La disposición a pagar por "software para despachar" ronda los
   $30.000–$50.000/mes. Con 900 tiendas serían $36M/mes — cuatro veces menos que el modelo de margen.
4. **El SaaS es indefendible.** Cualquier competidor que llegue con tarifa negociada nos pone el
   software en $0 y se lleva a todos los clientes en un trimestre.

**Lo que nos cuesta, y lo asumimos:**

- El margen bruto se ve feo: 7,8% sobre GMV, 59% sobre ingreso neto. **Reportamos ingreso neto
  siempre.** El GMV es cifra de vanidad.
- **Riesgo de siniestro:** el paquete perdido lo pagamos nosotros. $20.300/tienda/mes de provisión,
  el 15% del ingreso neto. Es caro **y es el punto**: es lo que compra la retención.
- **Boletas de garantía:** cada courier exige ~30 días de facturación. Al mes 24 son ~$556M de
  colateral. Se financia con línea bancaria, **no con el saldo prepago de los clientes** — esa
  plata va en cuenta separada, y esa regla no se negocia.
- Riesgo de crédito: **eliminado por diseño.** Saldo prepago. Nadie despacha con plata que no tiene.

### Precios

| Plan | Fijo/mes | La etiqueta | Dto. efectivo | Spread nuestro |
|---|---|---|---|---|
| **Nauta** (hasta 150 envíos) | $0 | lista − 62% del descuento mayorista | 22,3% | 13,6% de lista |
| **Bodega** (desde 150) | $34.900 | lista − 80% del descuento mayorista | 28,8% | 7,2% de lista |
| **Cordillera** (desde 600) | $99.900 | **costo + 7%**, con la factura del courier a la vista | 31,5% | 4,5% de lista |

A más suscripción, menos margen por etiqueta. El cliente que crece nos paga más fijo y menos
variable, y eso lo hace quedarse.

### Economía unitaria (tienda de 200 envíos/mes)

```
Ingreso neto      $133.500/mes   (spread $110.000 + suscripción $23.500)
Costos variables  $ 54.350       (IA $450 · WhatsApp $2.000 · Transbank $17.600
                                  · provisión reclamos $20.300 · soporte $14.000)
Contribución      $ 79.150/mes   (59,3%)
```

| | |
|---|---|
| CAC combinado | $145.000 |
| Churn mensual | 4,2% (vida 23,8 meses) |
| **Payback** | **1,8 meses** |
| LTV | $1.883.000 |
| LTV/CAC | 13,0× |

**Un LTV/CAC de 13× debería darte desconfianza. A nosotros nos la da.** El CAC va a subir (los
primeros 200 clientes salen del marketplace de Jumpseller a $40.000; los siguientes 700 hay que ir
a buscarlos): a escala se parece más a 8×–9×. Y el número que de verdad manda no es éste: **es el
descuento mayorista.** Si en vez de 38% conseguimos 25%, el spread cae a $310, la contribución baja
a $31.150 y el LTV/CAC se desploma a 3,4×. **Este negocio no se gana vendiendo: se gana negociando.**

### Competencia

La categoría **existe en Chile desde hace años** y sería una señal de alerta que dijéramos lo contrario.

- **El portal de cada courier** — gratis, oficial. **Es el titular real del puesto.** Pero son
  cuatro, y ninguno te va a decir que el vecino está más barato.
- **Excel y un cuaderno** — el competidor que más veces nos va a ganar. Funciona hasta los ~150
  envíos/mes.
- **Shipit** (shipit.cl) — el competidor más directo. Agregador con tarifas negociadas para tiendas
  chicas. **Hacen básicamente lo que nosotros.** Foco en Santiago; el reclamo sigue siendo tuyo.
- **Envíame** (enviame.io) — excelente capa de API multi-courier, para retail mediano y grande.
  Requiere desarrollador. La dueña de la tienda de suplementos no es su cliente.
- **Shopify Shipping** — resuelve exactamente esto… en EE.UU., Canadá, Reino Unido y la UE.
  **No opera con tarifas negociadas en Chile.** Ése es el hueco.

**Diferenciación, y ninguna es "mejor UX":** (1) el reclamo con plata de por medio, que un
competidor no puede copiar sin asumir el mismo costo; (2) el arbitraje geográfico expuesto en la
interfaz; (3) ranking transparente, reproducible en una servilleta, no una caja negra.

### Canales (rankeados por CAC real)

1. **Marketplace de apps de Jumpseller y Bsale** — CAC ~$40.000. El canal #1.
2. **SEO long-tail sobre el momento de dolor** — comparador público y gratis. La joya:
   *"cómo hacer un reclamo a Chilexpress"*. Quien busca eso está en el peor día de su vida
   logística. CAC ~$25.000.
3. **Outbound por Instagram DM** — las tiendas se autoidentifican ("despachos a todo Chile").
   CAC ~$160.000.
4. **Contadores y software PYME** (Defontana, Nubox, Bsale) — les damos **una sola factura** en vez
   de cuatro. CAC ~$70.000.
5. **Comunidad** — grupos de vendedores de Mercado Libre, CCS, ASECH. Publicamos el índice mensual
   de tarifas por comuna, gratis.
6. **Meta Ads** — el más caro, último a propósito. CAC ~$64.000 + costo de venta.

**Mercado Público / ChileCompra: descartado.** El Estado no es nuestro cliente.

### IA en el marketing

**Sí:** las 340 páginas del comparador público (el *dato* lo pone el motor de tarifas; la IA sólo
escribe la prosa alrededor), personalizar el outbound con el catálogo real del prospecto, y
priorizar leads.

**No:** contenido de blog a granel, chatbot para el comprador final (él quiere su paquete, no
conversar), elegir el courier por el cliente, y precios dinámicos (si descubre que el precio cambia
según quién es, perdemos lo único que no se compra).

### Qué mataría esto

**El proveedor es el titular.** Kilonauta se para entre la tienda y el courier y le quita al courier
la relación con el cliente. **Eso es exactamente lo que un courier no quiere.** Chilexpress puede
despertar un martes y no renovarnos el contrato: no sería una represalia extraña, sería una decisión
comercial racional. Si perdemos dos de los cuatro, el spread se evapora.

**No hay mitigación completa.** Sólo tres cosas parciales: repartir el volumen (ninguno sobre el
40%), llevarles demanda *nueva* que hoy no tienen, y que Correos de Chile —estatal, con obligación
de servicio universal— es el más difícil de perder y justo el que sostiene el arbitraje de zona
extrema.

---

## Roadmap

Seis hitos, seis criterios de muerte. El que importa es el del mes 9, y no tiene nada que ver con
el producto.

| Hito | Cuándo | Es cierto si… | **Criterio de muerte** |
|---|---|---|---|
| **M1** Probar que el arbitraje existe | mes 3 | 8 design partners auditados muestran ≥12% de ahorro sobre sus facturas reales | **Ahorro observado sobre envíos reales < 8%.** No hay arbitraje. Se para. No se pivota. |
| **M2** El contrato mayorista | mes 9 | ≥2 couriers firman a ≥30% bajo lista | **Ningún courier baja del 25% bajo lista.** El spread no existe. Repliegue a SaaS puro (negocio mucho peor) o parar. |
| **M3** 10 pagando + app publicada | mes 12 | 10 tiendas en Bodega/Cordillera, 120 activas, app en Jumpseller | **Churn > 8% mensual**, o < 50 etiquetas por tienda en su primer mes. No se arregla con más marketing. |
| **M4** Venta repetible | mes 17 | CAC < $180.000, payback < 2,5 meses, 350 tiendas | **CAC sobre $350.000 sin que suba el ARPU.** Estamos comprando ingreso a pérdida. |
| **M5** Escala + reclamos como foso | mes 22 | 550 tiendas, ≥85% de reclamos resueltos en <21 días, recupero ≥55% | **Un courier nos corta y perdemos >30% del volumen.** El modelo es rehén del proveedor. |
| **M6** Punto de decisión | mes 24 | — | Ingreso < $35M/mes o spread < $500 → **matar**. Sin "un trimestre más". |

### Trayectoria (escenario base)

`Ingreso neto = tiendas × (envíos × spread + suscripción)`

| Escenario | Tiendas m24 | Envíos | Spread | Churn | Ingreso m24 |
|---|---|---|---|---|---|
| Pesimista | 240 | 150 | $380 | 6,5% | $18,0M/mes |
| **Base** | **620** | **205** | **$550** | **4,2%** | **$84,5M/mes** (≈ US$1,07M ARR) |
| Optimista | 1.250 | 235 | $640 | 3,0% | $223M/mes |

**La diferencia entre los tres no es el ánimo: es el descuento mayorista.**

### Caja

Capital: **$95M CLP** (fundadores $10M + Corfo Semilla Expande $60M + ángeles $25M).
El ingreso cruza a los gastos en el **mes 14**.

**El valle está en el mes 12: $28,5M de caja con $18M/mes de gastos = 1,6 meses de aire.**
El plan contempla un puente de $60M en el mes 11 si vamos bajo el base; si no se levanta, se corta
headcount en el mes 10. No hay una tercera opción y no vamos a fingir que la hay.

### La restricción real: activación, no adquisición

Con payback de 1,8 meses, conseguir clientes no es el problema. **El problema es que se despiden en
el mes 1.** La cohorte de enero retenía 73% al mes 2; la de junio, 88%. La palanca no es publicidad
— es **lograr que la tienda despache 50 etiquetas en su primer mes**.

### El umbral (el gráfico más importante del documento)

El descuento mayorista no se negocia con carisma: **se compra con volumen**.

| Paquetes/mes agregados | Descuento alcanzable | |
|---|---|---|
| 2.000 | 8% | Mes 4. Perdemos plata en cada etiqueta. |
| **16.600** | **26%** | **Mes 9. Bajo el umbral. Criterio de muerte M2.** |
| **25.000** | **30%** | **Umbral de viabilidad.** |
| 127.100 | 40% | Mes 24. |

### Probabilidad de éxito

**Clase de referencia A:** SaaS/marketplace B2B que llega a US$1M de ingreso anual — ~20-25% de las
que levantan semilla institucional. **Regla del pulgar de la industria, no dato censal.** No
conocemos un estudio chileno con esta métrica y no lo inventamos.

**Clase de referencia B (la que importa):** agregadores de courier en LatAm. Skydropx opera,
Envia.com opera, Enviopack fue adquirida, Shipit lleva años en Chile. **La categoría funciona —no
es una idea que nunca haya funcionado— pero casi ninguno se volvió grande.** El techo típico es un
negocio bueno de US$2M–8M de ingreso neto.

```
22%  × 1,25 (presupuesto que ya gasta) × 1,15 (canal que ya existe) × 1,10 (payback 1,8 meses)
     × 0,72 (el titular es el proveedor) × 0,85 (Shipit) × 0,80 (negocio con umbral)
= 22% × 1,581 × 0,490 = 17,0%   →   rango honesto: 15% – 26%
```

| Qué significa "éxito" | Probabilidad |
|---|---|
| US$1M de ingreso neto al mes 24, **condicional a superar M2** | **15 – 26%** |
| Lo mismo, **si M2 falla** | **< 4%** |
| Negocio rentable y autosostenible (US$300k–800k) — *el resultado más probable* | **38 – 48%** |
| Salida venture-scale (>US$10M) | **3 – 6%** |

**La conclusión que hay que leer dos veces:** la probabilidad de que Kilonauta sea *un buen negocio*
es razonablemente alta (~40%). La de que sea *un retorno de fondo* es baja (~4%). Son dos apuestas
distintas y hay que saber cuál se está haciendo **antes de firmar**, no en el mes 30.

---

## Stack

Monolito en **Node + Postgres**, con una cola (Redis) para todo lo que habla con un tercero.
Nada exótico: **el riesgo de esta empresa es comercial, no técnico.**

### Modelo de datos

Cuatro tablas importan: `tiendas`, `envios`, `eventos_tracking` (append-only, guarda el payload
crudo del courier — cuando haya que pelear un reclamo, esto es la prueba) y `reclamos`.

**El campo que nadie modela y que hunde a los agregadores** es `envios.costo_real_clp`: la
diferencia entre lo que el courier *cotizó* y lo que después *facturó* (sobrepeso, re-aforo, zona
mal declarada). Si no lo concilias factura por factura, el spread se te evapora y no sabes por qué.

Pesos en **gramos** y dimensiones en **milímetros**, enteros: los decimales en flotante causan
disputas de facturación. `saldo_clp` **nunca negativo**, con restricción a nivel de base de datos.

### Los agentes de IA

| Agente | Modelo | Qué hace |
|---|---|---|
| Normalizador de direcciones | `claude-haiku-4-5-20251001` | "los aromos 455 depto 52b, al lado del jardin, pto montt" → JSON. La comuna **siempre** sale de `buscar_comuna()` contra el catálogo de 346; el modelo no adivina. Si `confianza < 0,8`, no despacha: pregunta. |
| Traductor de eventos | `claude-haiku-4-5-20251001` | Cuatro vocabularios → seis estados. **El 95% se resuelve con una tabla de mapeo**; el LLM sólo ve strings nuevos. Eso baja el costo 20×. |
| Redactor de reclamos | `claude-sonnet-5` | El reclamo formal, con evidencia y plazo. **Un humano lo lee antes de que salga. Siempre.** |
| Rescatador de direcciones rebotadas | `claude-sonnet-5` | Devuelve 2-3 candidatas **con su razonamiento**. No decide sola. |

**Y donde a propósito NO hay IA:** el detector de envíos en riesgo (es una consulta SQL contra el
percentil 95 histórico — determinista y auditable) y el ranking de couriers (una fórmula que la
clienta puede reproducir en una servilleta; **la confianza es el producto**).

### Costo mensual

Tienda de 200 envíos/mes:

```
Normalizar direcciones (Haiku)      US$0,234
Traducir eventos desconocidos       US$0,030
Redactar reclamos (Sonnet)          US$0,120
Importar pedidos raros              US$0,054
Rescatar direcciones rebotadas      US$0,042
─────────────────────────────────────────────
TOTAL IA = US$0,480/tienda/mes ≈ $456 CLP   (redondeado a $450 en negocio.html)
```

**Infra fija: US$165/mes** (Fly.io, Neon, Upstash, R2, Sentry, Resend) — va en *gastos*, no en el
COGS por tienda. Esa separación es la que hace que los tres documentos cuadren.

A escala (mes 24, 620 tiendas): **~$2,37M CLP/mes = 2,8% del ingreso neto.** *El costo técnico no
es el problema de este negocio. El problema son los $20.300/tienda de provisión de reclamos.*

### Qué hay que contratar

1. **Contrato empresa + API con los 4 couriers** — 4 a 10 semanas cada uno, más **boleta de
   garantía**. Algunas APIs siguen siendo SOAP en 2026. **No es una integración técnica: es una
   negociación comercial que define si la empresa existe.**
2. **WhatsApp Business API** (Meta Cloud API) — plantillas aprobadas una por una, categoría *utility*.
3. **Transbank** Webpay Plus + Oneclick — para el saldo prepago.
4. **Facturación electrónica** vía Nubox/LibreDTE — una factura mensual, no cuatro. Es una feature
   de venta, no un trámite.
5. **API de Anthropic** — una tarjeta y una key. Lo más fácil y lo más barato de la lista.
6. **Marketplace de Jumpseller/Bsale** — 4-6 semanas de revisión. Es go-to-market, no ingeniería.

### Qué está falseado en el demo

Todo esto es mentira, y preferimos decirlo nosotros. El demo se siente real porque la **estructura**
es real; los **datos y las conexiones** no lo son.

- **Las tarifas** — modelo calibrado en `tarifas.js`, no la API de ningún courier. La estructura es
  correcta (base por zona + $/kg + peso volumétrico ÷4000 + recargo por destino) y el orden relativo
  entre couriers refleja la realidad. Los valores exactos, no. **Ninguna tarifa del sitio es una oferta.**
- **El código de barras y el QR** — patrones deterministas. Se ven como códigos; **un escáner no los lee**.
- **La normalización de dirección con IA** — la dirección "sucia" y la "limpia" están **las dos
  escritas a mano**. No hay llamada a Haiku. Es la ilusión más barata del demo y la más convincente.
- **El reclamo "redactado por IA"** — es una plantilla determinista en JS. Sonnet no toca nada.
- **El "% a tiempo en esta comuna"** — inventado. Y hay un problema honesto que no se resuelve con
  código: **en producción ese número sale de nuestro historial, y el día 1 no tenemos historial.**
  Los primeros 6 meses habría que mostrar el promedio nacional del courier, o no mostrar nada.
  Mostrar un número inventado sería exactamente lo que le criticamos a todos los demás.
- **Los números de guía** — `Math.random()` con el formato correcto de cada courier. No existen en
  el sistema de nadie.
- **Los avisos, el saldo y el pago** — no se envía nada a nadie; el saldo baja en una variable de JS.

---

## El dominio

```
$ curl -s -o /dev/null -w '%{http_code}' \
    https://rdap.verisign.com/com/v1/domain/kilonauta.com
404          # 404 en el RDAP de Verisign = NO registrado

$ ./_kit/check-domain.sh kilonauta
kilonauta   .com AVAILABLE   (http 404)   .cl AVAILABLE
```

Verificado el **2026-07-12**. *Kilo* (la unidad con la que se cobra un paquete) + *nauta* (el que
navega). Chile es largo y hay que navegarlo por kilo.

Alternativas verificadas el mismo día, también con `.com` libre (HTTP 404):
`kilonave.com` · `zarpea.com` · `despachea.com`

---

Chilexpress, Starken, Blue Express y Correos de Chile son **proveedores de transporte reales**,
listados como integraciones previstas. No son clientes, ni socios, ni tienen relación alguna con
Kilonauta.
