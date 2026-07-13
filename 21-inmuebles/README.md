# Caprato — el cap rate honesto, antes de que firmes

`caprato.com` · dominio verificado libre el 2026-07-13 (RDAP Verisign → HTTP 404; `.cl` libre en NIC Chile).
Alternativas verificadas: `cabidal.com`, `catastria.com`, `deslindo.com`.

**Radar de oportunidades de inversión inmobiliaria.** Le dices qué buscas —comuna, presupuesto en UF,
cap rate mínimo— y el sistema vigila las publicaciones, las cruza con lo que ese *mismo edificio* arrienda
de verdad, calcula el cap rate honesto (con vacancia, gastos comunes, contribuciones, administración,
comisión de re-arriendo y mantención descontados) y te avisa cuando algo pasa tu filtro.

La mayoría de las semanas no te avisa nada. **Ése es el producto.**

---

## El problema

Así se compra hoy el segundo o el tercer departamento en Chile: a mano, de noche, con catorce pestañas
abiertas. El aviso dice «renta estimada $780.000 · rentabilidad 6,8%». Nadie sabe cuánto arrienda *de verdad*
ese edificio, ni cuánto tiempo pasa vacío, ni cuánto se lleva la administración. La cuenta de la servilleta
—arriendo × 12 ÷ precio— ignora la mitad de los costos, y el comprador descubre la rentabilidad real dos años
después.

En el ejemplo del demo: ese departamento de Ñuñoa rinde **3,8%**, no 6,8%. Los once departamentos 2D de su
edificio que se arrendaron el último año lo hicieron a **$610.000**, no a los $780.000 que promete el aviso —
un **22% menos**.

## La honestidad es el producto

Todo el rubro vende el sueño. La cuña de Caprato es que **nadie en la cadena gana plata diciéndote que no
compres**: el corredor cobra 2% por venderte, el portal vive de la publicación. El único que puede cobrar por
el «no» es el que no participa de la operación.

Consecuencia comercial, dicha de frente: nuestro cliente *quiere* que le digamos que sí. Un producto que
responde «esto rinde 3,1%, no lo compres» convierte peor y tiene más churn temprano — modelamos **18% de
abandono el primer mes**, y es sano. El que se queda es el que ya se quemó una vez, y ése renueva.

Y el titular del sitio es el resultado, no el eslogan: **ninguna comuna del Gran Santiago tiene una mediana de
cap rate honesto sobre 5%.** Existe el 5%, pero es la excepción: ~6 de cada 100 publicaciones. Encontrar *ese*
6% es todo el trabajo.

## No es Conserjo

[`06-arriendos`](../06-arriendos/index.html) (Conserjo) **administra** el arriendo que ya tienes: filtra
arrendatarios, cobra, gestiona reparaciones. Caprato **encuentra y evalúa** el que todavía no compras. La
frontera es dura: Caprato no cobra arriendos ni administra nada. Después de la compra hace una sola cosa más:
avisarte si tu arriendo quedó bajo el de tu propio edificio.

---

## Negocio

| | |
|---|---|
| **ICP** | Inversionista hormiga: persona natural 34–55, ingreso familiar > $3.000.000, 1–2 departamentos arrendados, va por el siguiente. Presupuesto 1.500–3.500 UF. Compra con crédito, busca renta. |
| **Precio** | Radar $9.900/mes · **Inversionista $19.900/mes** · Cartera $49.000/mes · informe suelto $4.900 (pago único). ARPU mezclado **$17.300**. |
| **TAM Chile** | US$18,4M/año. 85.000 buscadores activos × $207.600 de ARPU anual. Cada supuesto de la derivación está declarado en `negocio.html`, varios marcados *por validar*. |
| **SAM** | US$13,2M/año (Gran Santiago, Valparaíso, Concepción, La Serena: 72% del stock). |
| **SOM año 3** | US$489.000 de ARR: 1.950 cuentas + 1.100 informes/mes. |
| **CAC** | **$72.339** mezclado (55% SEO a $2.070 · 30% Google Ads a $166.667 · 15% Meta a $141.333). |
| **LTV** | **$234.450** (churn 6,5% → vida 15,4 meses × margen 0,88). LTV/CAC **3,24**. Payback **4,8 meses**. |
| **Margen bruto** | **88%** a 400 cuentas — pero **41% a 40 cuentas**: el costo del corpus es fijo y no escala con los usuarios. |

**Todo cuelga de una cosa.** Si el SEO programático no llega a ser al menos la mitad de la adquisición, el CAC
salta a $159.267, el LTV/CAC cae a **1,47** y el negocio no cierra. Por eso es el criterio de muerte M3.

**Competencia:** buscar a mano (el titular real, y va ganando), Toctoc (el más peligroso: tiene los datos),
Portal Inmobiliario y Yapo (son el catálogo, no el análisis), el corredor (conflicto estructural: gana si
compras), y las calculadoras de cap rate gratis (la aritmética nunca fue el problema — el insumo sí).

**Qué lo mata:** el acceso a los datos, y es binario.

---

## Autonomía: cómo opera sin ningún humano

| Función | Cómo |
|---|---|
| **Venta** | No hay venta, hay descubrimiento. SEO programático (~2.400 páginas de comuna que *son* el producto gratis) + Google Ads + Meta Ads + cuentas propias. Campañas creadas, rotadas y matadas por API dentro de topes duros. |
| **Registro** | Correo y clave, o Google. Sin verificación manual. |
| **Activación** | Filtro en 3 minutos; el corpus histórico ya está cargado, así que la primera ficha honesta se entrega en el mismo minuto. |
| **Entrega** | Una alerta. Correo + WhatsApp (plantilla aprobada, sólo a quien se registró y consintió). |
| **Cobro** | Flow (CLP recurrente) y Stripe. Dunning automático. **Cancelación en un clic, sin flujo de retención.** |
| **Soporte** | Agente de IA con herramientas: explica el cálculo, edita el filtro, pausa, **reembolsa** y cierra la cuenta. Cuando no puede, lo dice: *«No tengo cómo pasarte con una persona. Te devuelvo el mes.»* Y lo ejecuta. |

### Lo que NO logro automatizar

1. **Existir legalmente.** Sociedad, RUT, cuenta bancaria y contrato con Flow exigen KYC de una persona con
   cédula. Un agente no tiene cédula. Alguien tiene que firmar **una vez**.
2. **La relación con los portales.** Una carta de sus abogados la contesta un abogado. Y la negociación de un
   acuerdo de datos —la única salida que vuelve robusto el negocio— es una conversación entre humanos. *Éste es
   el punto exacto donde el piloto automático se queda corto, y es donde el negocio se juega la vida.*
3. **Interpretar qué es lícito.** El kernel bloquea lo que `robots.txt` prohíbe y lo registra. Leer unos ToS y
   decidir si cierta forma de acceso es legítima es un juicio jurídico.
4. **Recalibrar el modelo** cuando el sistema detecta *drift*: ~4 horas de una persona al mes. No cero.
5. **Dar una recomendación de inversión.** No es que no pueda: **no debe**. No somos asesores registrados ante
   la CMF. Es la única línea que ningún agente tiene permiso de cruzar.
6. **Un reclamo que escale a SERNAC.**

**Canales prohibidos** (el kernel los bloquea y los registra): cuentas falsas en foros, sockpuppets, reseñas
plantadas, comentarios «orgánicos» simulados, voz saliente en frío. No es escrúpulo: **el canal es el activo**,
y un sistema autónomo que se quema sus propios canales es una trituradora, no un negocio.

---

## Roadmap · los seis criterios de muerte

Copiados literalmente en `autopilot.json`. El juez del sistema meta los aplica y **no puede modificarlos**.

| Hito | Mes | Cierto si | Criterio de muerte | Acción |
|---|---|---|---|---|
| **M1** El corpus dice la verdad | 2 | Nuestro arriendo estimado cae dentro de ±8% de lo que reporta el dueño | Error mediano **> 15%** con n ≥ 8 | **matar** |
| **M2** Alguien paga | 4 | 40 informes sueltos + 10 suscriptores | CAC de registro **> $35.000** por 30 días | pausar |
| **M3** El canal existe | 6 | SEO ≥ 35% de los registros · 14 cuentas | **SEO < 35%** de los registros | pausar → **matar** al mes 9 |
| **M4** Se repite solo | 12 | 150 cuentas · churn ≤ 7% · LTV/CAC ≥ 2,5 | < 100 cuentas **o** churn > 9% por 3 meses | reducir |
| **M5** El dato está defendido | 18 | 450 cuentas · fuente redundante ≥ 70% del stock | Bloqueo de un portal **sin redundancia** | **matar** |
| **M6** La decisión | 24 | MRR ≥ $18 MM · LTV/CAC ≥ 3 | MRR **< $8.000.000** | **matar** |

**Trayectoria (mes 24):** pesimista $4,6 MM/mes · **base $18,5 MM/mes (US$232k ARR)** · optimista $44,3 MM/mes.
Valle de caja: **mes 7, $9,3 MM** de los $14 MM invertidos. Equilibrio operativo: **mes 8**.

> La restricción de esta idea **no es la plata**: el gasto en régimen es $1,4 MM al mes con los anuncios topados
> en $450.000. La restricción es el tiempo que Google tarda en indexar 2.400 páginas, y eso no se puede comprar.

### Probabilidad de éxito

**Clase de referencia:** producto prosumer de autoservicio, nicho, mercado nacional chico, bootstrapeado. La
fracción de SaaS que llega a US$1M de ARR está en el **rango bajo de un dígito** (orden de magnitud, *por
validar la cifra exacta*). **No conozco una tasa base chilena publicada para esto y no la voy a inventar.**

- **Hacia arriba:** cuña afilada · intención ya existente en buscadores · el canal *es* el producto · presupuesto
  que el cliente ya gasta (la comisión) · costo de operación de US$382/mes.
- **Hacia abajo:** mercado chico (SAM US$13,2M) · riesgo binario de datos · churn estructural · el producto dice
  «no» · Toctoc tiene los datos.

> **Llegar a US$1M de ARR en 36 meses: 4–9%**, condicional a cumplir M3 al mes 6. Si M3 falla, bajo 2%.
>
> **Resultado modal: 35–45%** de terminar como un negocio chico, rentable y completamente automático —
> US$150–300k de ARR, 88% de margen, cero empleados, cuatro horas al mes de un fundador. No es un unicornio.
> Es un negocio.
>
> Muerte por bloqueo de datos en 24 meses: **20–30%**. Muerte por no encontrar canal (M3): **30–40%**.

---

## Arquitectura

**La regla que ordena todo: ningún número sale de un modelo de lenguaje.** Sale de Postgres o no se publica.

- **Stack:** Postgres 16 + PostGIS · Redis/BullMQ · Fly.io · Cloudflare · Nominatim autohospedado · Flow +
  Stripe · WhatsApp Cloud API · Amazon SES.
- **El motor de cálculo son 12 líneas de SQL.** Determinista, versionado, auditable con una calculadora.
- **Cinco agentes**, ninguno produce una cifra:
  1. **Extractor** (`claude-haiku-4-5-20251001`, temp 0) — aviso → JSON estricto. Lo que no aparece vuelve `null`;
     nunca infiere.
  2. **Resolutor de edificio** (Haiku 4.5 + herramientas) — dirección → edificio, y dedupe. *Es el 80% del riesgo
     técnico.* Si la confianza es baja, no se calcula nada: mejor no mostrar ficha que mostrar el edificio equivocado.
  3. **Narrador** (`claude-sonnet-5`) — redacta el «por qué» sobre un cálculo ya hecho. **Un validador compara con
     regex cada número del texto contra el JSON de entrada; si aparece uno nuevo, el texto se rechaza.**
  4. **Soporte** (Haiku 4.5 → Sonnet 5) — con `reembolsar_mes()` y `cerrar_cuenta()` entre sus herramientas.
  5. **Redactor SEO** (Sonnet 5) — las 2.400 páginas de comuna, refrescadas cada mes. Mismo validador de números.

### Costo mensual · US$382 (a 400 cuentas, TC $960 → **$367.000 CLP**)

| | Aritmética | USD/mes |
|---|---|---|
| Extractor · entrada | 52.000 avisos × 1.400 tok = 72,8 MTok × US$1 | $72,80 |
| Extractor · salida | 52.000 × 320 tok = 16,64 MTok × US$5 | $83,20 |
| Narrador (Sonnet 5) | 880 × (3.500 in × $3 + 700 out × $15) / 1M | $18,48 |
| Soporte (Haiku 4.5) | 320 conv. × (6.000 in × $1 + 500 out × $5) / 1M | $2,72 |
| **Subtotal IA** | | **$177,20** |
| Infra (Postgres/PostGIS, IPs de ingesta, Fly, Cloudflare, Redis, storage) | | **$205,00** |
| **Total** | | **US$382,20** |

El costo del extractor **no depende de cuántos clientes tengas**: depende de cuántas publicaciones existan. Es un
costo fijo disfrazado de variable, y es la razón del margen de 41% a 40 cuentas.

### Los datos, con las dudas puestas

- **Públicos:** avalúo fiscal y rol (SII), inscripciones del Conservador, estadísticas del Observatorio del
  Mercado Inmobiliario. Todos marcados *por validar* donde no nos consta la vía lícita de acceso.
- **Publicaciones de portales:** `robots.txt` respetado por el kernel (con bitácora de cada bloqueo), 1 request
  cada 3 s por dominio, user-agent identificado. **Los ToS de cada portal son distintos y están *por validar*.**
- **Plan B:** el usuario pega el link y el análisis se hace sobre la página que él abrió.
- **Cero datos personales.** El schema del extractor **no tiene** campo para teléfono ni nombre.
- **No existe registro público de contratos de arriendo en Chile.** Por eso el «arriendo real» es una
  *estimación* —la mediana de los avisos del mismo edificio que desaparecieron sin bajar de precio— y cada ficha
  declara su **n**, su rango y su nivel de confianza. Es la limitación central del producto y está impresa en la
  cara de cada ficha.

### Qué está falseado en el demo

Las 5 publicaciones, los edificios, los roles, los avalúos, los arriendos observados, los cap rates por comuna y
la UF ($40.180). No hay ingesta, no hay envío de alertas, no hay cobro.

**Lo que sí es verdadero: el cálculo.** La aritmética de las cinco fichas es exactamente la fórmula que correría
en producción, con los mismos siete descuentos, y cuadra línea por línea con una calculadora.

---

## Los archivos

| | |
|---|---|
| `index.html` | El problema, el mapa de comunas interactivo, el desglose completo, precios, FAQ. |
| `demo/index.html` | El radar: filtro → barrido → 5 fichas → la cuenta completa, la evidencia del arriendo y el simulador con crédito. |
| `negocio.html` | ICP, TAM/SAM/SOM con la aritmética, competencia, economía unitaria, canales, **Autonomía**, qué lo mata. |
| `roadmap.html` | Seis hitos con sus criterios de muerte, tres escenarios, caja, retención por cohorte, probabilidad como rango. |
| `stack.html` | Modelo de datos, los cinco agentes, las fuentes y su estado legal, costos, variables de entorno, evidencia del dominio. |
| `autopilot.json` | El manifiesto del piloto automático. Los `criterios_de_muerte` están copiados del roadmap, no inventados acá. |
