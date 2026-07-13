# Cotejia — inteligencia de precios para el e-commerce chico

**cotejia.com** (libre: RDAP Verisign → HTTP 404, 2026-07-13) · **cotejia.cl** libre
Alternativas verificadas: `repricia.com`, `cotizal.com`, `pizarria.com`

> Te bajaron el precio a las 3 de la mañana. Tú te enteras el viernes.

Cotejia vigila el precio de tus productos y el de tu competencia en Mercado Libre, Falabella,
Paris, Ripley y tu propia tienda; te muestra **dónde estás regalando margen** y **dónde se te
está escapando la venta**; y —el corazón— **te sugiere el precio con la regla que tú definiste**.
Con tu permiso, lo cambia solo.

De **cotejar**: comparar dos cosas para ver en qué se diferencian.

---

## Lo que hace distinto a un repricer tonto

Un repricer que sólo sabe igualar al más barato es una máquina de destruir margen — el tuyo y el
de todo el mercado. Cotejia tiene tres frenos que no se pueden apagar del todo:

1. **Piso de margen duro.** Costo + el % que tú digas. Ninguna regla lo cruza. Ni "sólo por hoy".
2. **Tope de cambios al día.** Por defecto 2. Veinte cambios al día no es estrategia: es pánico.
3. **Detector de bucle.** Si el "competidor" responde a cada cambio tuyo en minutos, con el mismo
   delta, no es una persona: es un repricer en bucle contigo.
   *"Llevas 14 bajadas en 6 horas contra un bot. Para de perseguirlo."*
   Ese aviso es el momento más valioso del producto.

Y una cuarta cosa, que da credibilidad porque va contra nuestro propio producto:
**el precio no es la única palanca.** A veces la respuesta correcta es despacho gratis, no bajar
$500 — y cuando lo es, el sistema lo dice y no toca el precio.

---

## Postura sobre la lectura de precios ajenos

Un precio de vitrina es información pública de mercado: no hay persona dentro de un precio, no está
detrás de un login y cualquier comprador lo ve. Leerlo con un programa no es raspar datos personales.

**Pero público no significa "todo vale":**

- **Primero la API oficial.** Mercado Libre es ~70% del volumen y tiene API pública: app registrada,
  rate limit respetado. Es un contrato, no una tolerancia.
- Donde no hay API (Falabella, Paris, Ripley) leemos el mismo endpoint público que usa el navegador:
  `robots.txt` respetado, User-Agent `CotejiaBot/1.0 (+cotejia.com/bot)`, 1 request cada 4 s por
  dominio, backoff ante 429. Sin login, sin captcha, sin datos personales, sin republicar catálogos.
- **Si un marketplace nos pide parar, paramos ese día** y le avisamos al cliente que perdió cobertura
  en ese canal. Está escrito como criterio de muerte (M3), no escondido en los términos.

---

## Negocio

### Cliente (ICP)
Tienda online chilena que **revende** (no fabrica): 60–3.000 SKU, ventas de $8M a $150M CLP/mes,
publica en Mercado Libre **más** al menos uno de Falabella / Paris / Ripley / su propio Jumpseller.
Firma la dueña. Es la misma persona que hoy mira los precios a mano.

### Mercado (aritmética, no adorno)

| Nivel | Cálculo | Resultado |
|---|---|---|
| TAM Chile | 1.100.000 empresas formales × 2,5% que vende online con >20 SKU | **27.500 tiendas** |
| SAM | × 40% que tiene ≥50 SKU y **con quién compararse** (revendedores, no marcas únicas) | **11.000** |
| SOM | × 55% que vende ≥$8M/mes (bajo eso, $29.900 no se justifica) | **6.050** |

Cada supuesto está declarado en `negocio.html` y es discutible. **El techo importa:** para llegar a
US$1M ARR sólo con Chile harían falta ~1.522 clientes = **25% del SOM**. Ninguna herramienta B2B de
nicho toma un cuarto de su mercado. **Con Chile solo, esto es un negocio de US$170k–230k de ARR.**
El negocio grande está en cruzar a Mercado Libre regional (SAM ≈15×), y esa es la decisión del mes 24.

### Precio — suscripción, no comisión

| Tramo | CLP/mes | SKU | Lectura | Cambio automático |
|---|---|---|---|---|
| Vitrina | $0 | 25 | 1×/día | no |
| Cinta | $29.900 | 250 | cada 3 h | no |
| **Pizarra** | **$59.900** | 1.000 | cada 30 min | **sí** + detector de bucle |
| Mesa | $129.900 | 5.000 | cada 10 min | sí + API |

**Por qué no comisión sobre el margen defendido**, aunque sería más rentable:
una tienda de $30M/mes con 30% de margen gana $9M de margen; si le mejoramos 1,5 puntos son
$450.000/mes, y un 15% de comisión serían $67.500 — más que Pizarra. **Pero ese 1,5 punto es un
contrafactual que calcularíamos nosotros mismos**: un proveedor que mide su propio valor y factura
sobre esa medición tiene un conflicto de interés estructural. Además, la comisión sobre margen empuja
al sistema a subir precios aunque pierdas ventas, y exige una conciliación mensual — o sea, un humano.
La suscripción plana es la única que se cobra sola. Para esa misma tienda, Pizarra es el **0,2% de sus
ventas** y el **13% del margen extra** que le devolvemos.

### Economía unitaria (cliente Pizarra, $59.900)

```
COGS   IA               $1.160    (US$1,22 · derivado token por token en stack.html, dólar $950)
       infra            $1.640    (US$173/mes ÷ 100 clientes)
       pasarela (4,2%)  $2.516
       ────────────────────────
       COGS = $5.316 → margen bruto 91,1%  (85% consolidado, castigando rev-share de app stores)

CAC    Google Ads: CPC $500 / conv. 6% / cierre 20% = $41.700 + $7.600 de IA de onboarding = $49.300
       App store: $0 de desembolso, 20% de rev-share
LTV    churn 6% → vida 16,7 meses × contribución $50.915 = $850.281
       LTV/CAC = 17×   ·   payback = 0,97 meses
```

**Cuidado con el 17×:** no significa que el negocio sea increíble. Significa que **el CAC no es la
restricción**. Las restricciones son la activación y el tamaño del mercado chileno.

### Canales (rankeados, todos automatizables salvo el último)

1. **App stores de Jumpseller / Bsale / Shopify** — el único canal donde el cliente nos busca a
   nosotros. Confianza prestada + OAuth de un clic. Rev-share 15–20%.
2. **SEO programático propio** — 400 páginas de índice de precios por categoría, con datos reales
   que ya tenemos. El producto genera su propio contenido.
3. **Google Ads** — intención altísima, volumen bajo. CAC ≈ $49.300.
4. **Cuentas propias de marca** — el "Índice Cotejia" semanal. Dato real, con nuestro nombre.
5. **Meta Ads** — sólo retargeting.
6. **Patrocinio de newsletters** — comprado y declarado como publicidad.

**Prohibido:** entrar a los grupos de vendedores de Mercado Libre con cuentas que fingen ser
vendedores. Es astroturfing, y el kernel lo bloquea y lo registra.

### IA en el marketing
**Sí:** las 400 páginas de SEO (los números salen de la base de datos, no del modelo), variantes de
anuncios, clasificación del correo entrante, el resumen semanal al cliente.
**No:** el blog genérico de "10 tips para vender en Mercado Libre" (no lo lee nadie y baja la
autoridad del dominio), las reseñas, y hacerse pasar por un vendedor en un grupo de WhatsApp.
La IA multiplica una idea buena; no la tiene.

---

## Autonomía — cómo opera sin ningún ser humano

- **Venta:** ficha en el app store + SEO + Google Ads + cuentas propias. **El demo es el vendedor:**
  en 14 días de prueba, con su propio catálogo conectado, la clienta ve su plata sobre la mesa con
  sus productos y sus costos. No hay argumento mejor, y ninguna persona lo daría mejor que el software.
- **Entrega:** OAuth → importamos catálogo, costos y ventas → el emparejador arma la pizarra →
  tres sliders. Del clic a la primera sugerencia: 10 minutos. Cero implementación, cero capacitación.
- **Cobro:** Flow/Webpay Oneclick, tarjeta recurrente en CLP, boleta electrónica por API. Dunning
  automático: 3 reintentos, correo, suspensión del cambio automático (no del monitoreo), cancelación.
  Sin cobranza telefónica.
- **Soporte:** agente LLM con acceso **de sólo lectura** a la cuenta: puede abrir la pizarra del
  cliente y explicar qué regla se aplicó a qué SKU con sus números. El 80% de los tickets de este
  producto son "¿por qué me sugirió esto?", y ésa es una pregunta que el sistema puede contestar
  leyendo su propia bitácora. Cuando no sabe, **lo dice**: *"no tengo cómo pasarte con una persona;
  te dejo el ticket y te respondo por correo"*. Mentir ahí es lo único que convertiría un producto
  honesto en una estafa.

### Lo que NO logro automatizar (dicho antes de que lo descubras tú)

1. **Los parsers se rompen.** Cuando Falabella cambia su HTML, el lector muere. Hay autorreparación
   (un modelo re-deriva los selectores y valida contra precios conocidos), pero no cubre todos los
   casos. **1 a 3 horas de trabajo humano por semana, impredecibles: $600.000/mes de contratista.**
   Es el 44% de la estructura de costos y lo pongo primero, no en un pie de página.
2. **La relación con el marketplace.** Si Mercado Libre nos escribe por el uso de su API, no hay bot
   que negocie eso.
3. **El papeleo inicial:** constituir la sociedad, firmar con Flow, habilitar el DTE ante el SII,
   publicar la app en el app store. Un humano, **una vez**, antes del día 1. Después no vuelve.
4. **El emparejamiento dudoso lo confirma el cliente** (con un botón). Si no confirma, ese SKU se
   queda sin vigilar. No adivinamos.

---

## Roadmap — seis hitos, seis formas de morir

| Hito | Cuándo | Qué es cierto si lo lograste | Criterio de muerte |
|---|---|---|---|
| **M0** Validación | día 45 | 5 de 8 design partners conectan OAuth; emparejador ≥92% sin falsos positivos peligrosos | <5/8 conectan en 2 semanas **o** precisión <90% → **matar** |
| **M1** Primer peso | mes 3 | Alguien paga con tarjeta sin haber hablado con nadie | CAC > 3× el precio ($180.000) por 4 semanas con ≥40 pruebas → **pausar** |
| **M2** Los primeros 10 | mes 6 | ≥10 clientes pagando, activación ≥40% | **activación <20% → matar** |
| **M3** Venta repetible | mes 12 | 90–100 clientes, MRR ≥$4,5M, ≥50% de los nuevos por app store/SEO | churn >8%/mes por 3 meses → **matar**; MELI corta la API o cobertura <60% → **pausar** |
| **M4** Prueba del holdout | mes 18 | 175 clientes, MRR ≥$9M, y el grupo de control muestra margen defendido ≥2× la suscripción | holdout muestra margen defendido < suscripción → **matar y devolver el último mes** |
| **M5** Decisión | mes 24 | 250–350 clientes, MRR $13–18M, 0 empleados | <150 clientes → **cerrar ordenadamente** (60 días de aviso, exportar los datos, devolver el mes) |

**Activación** = conectó + definió una regla + **aplicó al menos un cambio de precio** en 14 días.
Si no movió un precio, no le entregamos nada.

Estos criterios están copiados literalmente en `autopilot.json`. El juez del sistema los ejecuta y
no puede cambiarlos.

### Probabilidad de éxito

**Lo que no sé:** no existe una tasa base pública y confiable de "qué fracción de los micro-SaaS
listados en un app store de e-commerce llega a US$100k ARR". No la tengo y **no la voy a inventar.**

**Lo que sí sé (esto es división, no opinión):** el SOM chileno son 6.050 tiendas; US$1M ARR exige
1.522 clientes = 25% del SOM → **P(US$1M ARR sólo con Chile) ≈ 0.**

Cadena de condicionales, con los puntos medios:

```
P(M0: el emparejador funciona)              75–85%
P(M2: activación ≥40% | M0)                 40–55%   ← el eslabón débil
P(M3: churn ≤8%, canal repetible | M2)      50–65%
P(M4: el holdout demuestra el valor | M3)   60–75%

P(negocio autosostenible al mes 24) = 0,80 × 0,48 × 0,58 × 0,68 = 15%
Rango declarado: 12–25%, condicional a llegar a M2 en el mes 6.
Si M2 se cumple: 0,58 × 0,68 = 39% (30–49%).
P(cruzar a LatAm y superar US$1M ARR al mes 36) ≈ 5% (3–8%)
```

**Ajustes al alza:** canal que ya existe (app stores), presupuesto que el cliente ya gasta (su tiempo),
cuña afilada (emparejamiento en español chileno + detector de bucle), ciclo de venta de minutos.
**Ajustes a la baja:** techo estructural del mercado chileno (el más pesado), Mercado Libre podría
hacerlo gratis, la confianza que exige entregarle el precio a un software sin nadie detrás,
dependencia de raspado en el 30% del volumen, churn alto de PYME e-commerce.

---

## Arquitectura

**Lo primero: el motor de precios no es un modelo de lenguaje.** Es aritmética determinista con tests,
que corre en milisegundos y da siempre el mismo resultado. Un LLM decidiendo precios es un generador
de alucinaciones con acceso a tu margen.

**Dónde sí hay IA:**

| Agente | Modelo | Qué hace |
|---|---|---|
| Emparejador | `claude-haiku-4-5-20251001` | ¿Es el mismo termo? JSON con confianza 0–1. **Bajo 0,85 pregunta y no calcula.** |
| Reparador de lectores | `claude-opus-4-8` | Re-deriva selectores cuando un marketplace cambia su HTML. Si no valida contra 20 precios conocidos, no despliega: abre ticket. |
| Explicador / soporte | `claude-sonnet-5` | Herramientas **de sólo lectura**. No puede cambiar un precio ni una regla. Jamás. |
| Redactor SEO | `claude-haiku-4-5-20251001` | 400 páginas de índice de precios. Los números salen de la BD; si no está en los datos, no lo escribe. |

**El detector de bucle** (sin IA — estadística de series de tiempo):

```
DECLARO BUCLE si:
  tasa_respuesta ≥ 0,70  y  latencia_mediana ≤ 15 min
  y cv(delta) ≤ 0,25     y  direccionalidad = 100%
  y el resto del listado NO se movió   ← sin esto, grita en cada CyberDay
  y n ≥ 5 respuestas                   ← no se declara un bot con 2 datos
ACCIÓN: congelar 24 h · marcar es_bot · avisar con la aritmética · no responderle más
```

Preferimos no detectar un bucle a congelarle el precio a alguien por error: el costo de los dos
errores no es simétrico.

**Costo mensual (100 clientes):** infra US$173 ($164.350) + IA ($76.000) + correo/DTE ($30.000) +
**mantención humana de lectores ($600.000)** + Ads ($400.000) + contabilidad ($80.000)
= **$1.350.350/mes** contra un MRR de ≈$5.200.000.

**Qué está falseado en el demo:** los datos (tienda, competidores y precios son ficticios; productos y
marketplaces, reales), las series de 14 días (PRNG con semilla), el bucle guionado, el emparejamiento
(en el demo no hay ni una llamada a un modelo) y el "aplicar" (que en realidad sería un
`PUT /items/{id}` a Mercado Libre). **Lo que NO está falseado: el motor de reglas.** Es determinista
y es el mismo código que correría en el servidor: mueve un slider y mira cómo se recalcula todo.

---

## Los archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Landing. El problema, los tres frenos, el precio y la postura sobre el raspado. |
| `demo/index.html` | **La pizarra.** 9 productos, 3 marketplaces, una guerra de precios en curso. |
| `negocio.html` | ICP, mercado con la aritmética, competencia, economía unitaria, canales, **autonomía**. |
| `roadmap.html` | 6 hitos con criterios de muerte, 4 gráficos, probabilidad como rango derivado. |
| `stack.html` | Modelo de datos, agentes, detector de bucle, costos, qué está falseado. |
| `autopilot.json` | El manifiesto. Los criterios de muerte están copiados del roadmap, no inventados. |
| `meta.json` | Metadata del hub. |

**Dirección de arte:** cinta de cotizaciones / pantalla de mercado en vivo. Fondo casi negro azulado,
IBM Plex Mono tabular para todo número, Archivo para el texto. **Verde y rojo son dato (sube/baja),
nunca decoración.** Un solo acento: ámbar de tubo de rayos catódicos. Paleta de gráficos validada con
`dataviz/validate_palette.js` sobre el fondo `#0e1218` (banda de luminosidad, croma, separación CVD y
contraste: las cuatro pruebas en PASS).
