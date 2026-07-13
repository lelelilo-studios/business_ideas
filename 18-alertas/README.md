# Pregonia

**Todo se pregona. Casi nada te toca.**

Vigilancia automática del Diario Oficial y los reguladores chilenos. Defines qué te importa —tu RUT, el de tus clientes, tu marca, tu rubro, una comuna— y el sistema te escribe **sólo cuando algo te afecta**, te explica por qué en una frase y te dice qué hacer antes de que venza el plazo.

- **Marca:** Pregonia · `pregonia.com`
- **Dominio:** verificado el 2026-07-13 con `_kit/check-domain.sh` → RDAP Verisign **HTTP 404 = disponible**. `pregonia.cl` también libre.
- **Alternativas verificadas:** `avizorio.com`, `cribante.com`, `atisbia.com` (las tres HTTP 404).
- **Dirección de arte:** boletín / teletipo de agencia de cable. Fondo casi negro, metadatos en monoespaciada, titulares en gótica de prensa, y un solo acento de urgencia (`#FF3B30`) usado con avaricia — porque si todo es urgente, nada lo es, **y eso *es* la tesis del producto**.

---

## La tesis en un párrafo

Buscar tu RUT en un PDF no requiere inteligencia artificial: es Ctrl+F, y cualquiera lo hace en un fin de semana. Por eso los productos de alertas que existen mandan de todo, y **una alerta que avisa de más se apaga en dos semanas** — y una alerta apagada es peor que ninguna, porque te dejó la sensación de estar cubierto.

La parte difícil, y la única que vale plata, es **decidir si esta publicación le importa a este cliente** y decírselo en una frase que se lea en el celular. Por eso la métrica pública no es cuántas alertas mandamos: es **qué fracción de las que mandamos fueron abiertas y accionadas** (la «señal»). Si baja de 40%, el producto está roto y se mata — está escrito como criterio de muerte en el roadmap y copiado en `autopilot.json`.

Y el usuario entrena el filtro: cada pulgar abajo escribe una regla, y la regla se aplica **de inmediato** a lo que está en cola.

---

## Negocio

### A quién le vendemos, y por qué

No a quien tiene el problema. **A quien ya paga por resolverlo.**

| Candidato | Ticket | El problema |
|---|---|---|
| La PYME | $14.900/mes | El dolor es intermitente. Pasan seis meses sin que ocurra nada y cancela. Y ni siquiera sabe que el problema existe. |
| **El estudio de abogados** ✅ | **$79.000–$249.000/mes** | Compra lento, pero **ya tiene el costo en la planilla**. |
| El equipo comercial (señales de compra) | $60.000–$150.000/mes | Es otro producto: quiere volumen, no precisión. Quiere las 613, no las 3. |

**La aritmética que decide:**

```
Renta bruta de un procurador/egresado          $650.000/mes   (estimación 2026)
Costo empresa (× 1,25 por leyes sociales)      $812.500/mes
÷ 176 horas                                    $4.616 / hora
× 1 hora diaria × 22 días hábiles
= Costo directo de revisar el D.O. a mano      $101.500/mes
                            Pregonia Estudio:   $79.000/mes  → 21% más barato
```

Y el costo invisible es el que vende: un plazo de oposición marcaria perdido es la marca del cliente. La culpa es del estudio.

**ICP:** estudio boutique de 3 a 15 abogados (corporativo, propiedad industrial, cobranza, concursal), con 10-80 empresas como clientes recurrentes. Firma el socio; lo usa el procurador. Segundo anillo: oficina contable con cartera. La PYME entra sola por SEO y **por el propio estudio**, que le reenvía la alerta con su logo.

### La cuña

**La oposición marcaria.** Cuando alguien pide en INAPI un signo parecido al de tu cliente, el plazo para oponerse corre desde la publicación del extracto en el Diario Oficial (Ley 19.039, art. 5). Es binario, es caro de perder, es culpa del estudio, y **es verificable el día 1**: le mostramos las publicaciones de la semana pasada que mencionan a sus clientes. Si no hay ninguna, no le vendemos nada.

Se entra por una cosa y se paga por seis: el deudor liquidado, el competidor constituido, la norma que cambió el rubro.

### Mercado (Chile) — toda cifra con su derivación

```
TAM · profesionales que vigilan por terceros
  ~40.000 abogados habilitados × 12% corporativo/PI  = 4.800
  ÷ 3,2 por estudio                                  = 1.500 estudios
  + 120 agentes de PI + 4.000 oficinas contables     = 5.620 cuentas
  × ARPU $110.000 × 12                               = $7.418M CLP/año ≈ US$7,7M

TAM · PYME con dolor real (marca registrada)
  ~300.000 marcas vigentes ÷ 3 por titular × 36% activos chilenos = 36.000
  × $14.900 × 12                                     = $6.437M CLP/año ≈ US$6,7M

TAM Chile ≈ US$14,4M/año   ← y hay que decirlo: es chico.
SOM mes 24: 169 profesionales + 108 PYME = ARR $242M CLP ≈ US$252.000
```

Los supuestos frágiles están marcados como tales en `negocio.html`. El más débil es el 12% de abogados en práctica corporativa: **no tengo el dato y hay que buscarlo**.

### Precio y economía unitaria

| Tramo | Precio/mes | Sujetos | COGS | Margen |
|---|---|---|---|---|
| Vigía | $14.900 | 5 | $1.770 | 88,1% |
| **Estudio** | **$79.000** | 60 | $5.860 | **92,6%** |
| Cartera | $249.000 | 300 | $20.166 | 91,9% |

**Margen bruto mezclado declarado: 90%** (con holgura, porque los supuestos de volumen son estimaciones).

```
CAC Ads (mes 1-6)     $450 CPC ÷ 6% conv ÷ 14% pago × 1,2 holgura = $64.000
CAC mezclado (mes 12) 45% Ads + 40% SEO + 15% referido            = $32.000
LTV Estudio           $71.100 margen/mes × 20 meses (churn 5%)    = $1.422.000
LTV / CAC             44×        Payback: 0,45 meses
```

**La parte honesta:** un LTV/CAC de 44× no es una buena noticia. Es la señal de que **el cuello de botella no es el CAC, es el volumen del canal**. Poca gente en Chile busca esto. Ésa es la restricción real del negocio.

### Canales (rankeados, con el techo declarado)

Techo estimado de cuentas nuevas al mes, en régimen: **36 en total**.

1. **SEO programático — 14/mes.** El canal que decide el negocio. Una página por norma publicada, por regulador, por rubro, por comuna. ~8.000 páginas al mes 18, todas con contenido real (el texto oficial + a quién afecta). El corpus mismo las genera.
   **Lo que NO hacemos:** una página por empresa (serían 1,3 millones). Es contenido delgado en masa que hace que Google penalice el dominio entero, y publicar un perfil indexable de la actividad de una persona natural con giro toca la Ley 19.628 y la 21.719. **Quemar el dominio por tráfico basura es el peor negocio posible.** Las fichas por empresa existen detrás del login.
2. **Google Ads — 9/mes.** Intención alta, volumen bajo. El límite es el volumen de búsqueda, no la plata.
3. **Referido del estudio a su cliente — 5/mes.** CAC $0. El informe semanal sale con el logo del estudio.
4. **Contadores y software PYME (Nubox, Defontana, Bsale) — 4/mes.** Mes 12, no mes 1: requiere un humano.
5. **Colegio de Abogados, ASECH — 2/mes.** Un webinar. Requiere un humano.
6. **LinkedIn saliente — 2/mes.** El mensaje es un dato verificable, no un pitch.

### IA en el marketing

**Sí:** escribir las 8.000 páginas de SEO (US$0,008 c/u, con revisión por muestreo de 1 de cada 20 — una explicación legal errónea publicada 8.000 veces es un problema serio); rotar el copy de Google Ads; encontrar la publicación real que menciona al cliente de un estudio antes de escribirle por LinkedIn; el soporte.

**No:** foros y comunidades haciéndose pasar por usuario orgánico (prohibido por el kernel, y suicida — el gremio legal chileno es chico y se conoce); reseñas falsas; voz sintética saliente; el webinar del Colegio de Abogados; y **prometer exhaustividad**, que además de no verificable es demandable.

### Qué lo mata

1. **El ruido gana** (señal < 40%). Probabilidad media, impacto total. Es el criterio de muerte del mes 2.
2. **El techo del canal.** Probabilidad **alta**, impacto: techo, no muerte. Es el escenario más probable de todos y el más difícil de detectar a tiempo.
3. **El Estado lo hace gratis.** Se lleva el tramo Vigía, no el profesional.
4. **La fuente cambia de formato.** Pasa cada tanto. Es el impuesto permanente de este negocio.
5. **La responsabilidad** por una alerta omitida. Baja probabilidad, alto impacto. Es la razón de que la bandeja de descartadas exista, y es una decisión legal antes que de diseño.
6. **Alguien con distribución lo copia** (Nubox). Mitigación real: ser su proveedor antes de ser su competencia.

---

## Autonomía

| Función | Sin humano |
|---|---|
| **Se vende** | Google Ads API + SEO programático en dominio propio + cuentas de marca en LinkedIn/X. Nadie hace demos: la landing es la demo. |
| **Se prueba** | 14 días sin tarjeta. Pega los RUT, y la **búsqueda retroactiva de 90 días** casi siempre encuentra algo que no sabía. Ése es el momento de la venta, y ocurre solo. |
| **Se cobra** | Flow / Webpay Oneclick + DTE automático al SII. Al día 14 sin tarjeta, la cuenta pasa a **silencio**: sigue vigilando, no envía, y dice «tienes 2 alertas retenidas». |
| **Se entrega** | Correo (SES) + WhatsApp Business API (plantilla aprobada, sólo a opt-in, baja en un clic). |
| **Se soporta** | Agente Haiku con acceso a la cuenta. La pregunta nº1 es «¿por qué no me llegó X?» y se contesta **mostrando el descarte y su motivo**. Cuando no puede: *«No tengo cómo pasarte con una persona, pero te dejo agendada una respuesta por correo»* — y la agenda de verdad. |
| **Se mejora** | Cada pulgar es una etiqueta. Nadie ajusta un prompt a mano. |
| **Se mata** | Los 6 criterios del roadmap están copiados en `autopilot.json`. El juez del sistema los aplica y **no los puede mover**. |

### Lo que NO logramos automatizar (~4 horas/mes en régimen)

1. **Rehacer un parser cuando una fuente cambia de formato.** Es el punto débil del negocio. El sistema lo detecta solo (canario: «hoy 0 avisos de INAPI, el promedio es 142»), pausa el envío y le avisa al usuario que esa fuente está caída — en vez de fingir silencio. Pero rehacer el parser es ingeniería humana: ~4-8 h por trimestre y por fuente, ~30 h/año con 6 fuentes.
2. **Trámites de una vez:** verificación de negocio de Meta (WhatsApp) y certificado digital del SII. Piden documentos de la persona jurídica.
3. **Un reclamo grave** por una alerta omitida. Un bot no comparece.
4. **La decisión de agregar una fuente nueva.** El sistema la propone con datos de demanda; la aprueba el operador del portafolio.
5. **El webinar del gremio y la conversación de partner con Nubox.** Ahí tiene que haber una persona.

**Cero horas de venta, de onboarding y de soporte de primera línea.** Eso es lo que permite cobrar $79.000 en vez de $400.000.

---

## Roadmap

| Hito | Mes | Qué es cierto | **Criterio de muerte** | Acción |
|---|---|---|---|---|
| **M1** Validación | 2 | Ingesta 30 días sin caerse. 5 design partners. Señal ≥ 40%. | **Señal < 40%** con ≥5 cuentas y ≥60 alertas enviadas | **matar** |
| **M2** Primer pago | 4 | Alguien puso la tarjeta sin hablar con nadie. | **0 de 5 design partners paga** tras 6 semanas de uso gratis | pausar |
| **M3** Los primeros 10 | 8 | 10 cuentas. MRR $900k. CAC medido. | **CAC > $237.000** (3× el ticket) con ≥30 conversiones | pausar canal |
| **M4** Venta repetible | 12 | 40 cuentas. MRR $3,6M. <4 h humanas/mes. | **Churn > 8%/mes** 3 meses seguidos con ≥25 cuentas | **matar** |
| **M5** Escala de canal | 18 | 110 cuentas. 8.000 páginas indexadas. | **SEO < 30% de los registros** | reducir |
| **M6** Decisión | 24 | 277 cuentas. ARR $242M (US$252k). | **ARR < $120M CLP** | **matar** |

### Escenarios

| Supuesto | Pesimista | **Base** | Optimista |
|---|---|---|---|
| Conversión registro → tarjeta | 8% | **14%** | 20% |
| Churn mensual | 8% | **5%** | 3% |
| CAC mezclado | $90.000 | **$32.000** | $22.000 |
| **ARR mes 24** | $78M | **$242M (US$252k)** | $456M |

El escenario pesimista termina **bajo el piso del criterio M6**. No es un escenario «malito»: es un escenario en el que esto no existe.

### Caja

**Valle de runway: −$2,9 millones CLP (≈ US$3.000) en el mes 8.** La caja acumulada cruza a positivo en el mes 12. Eso es todo el capital que necesita — y por eso es un candidato natural a ser operado por un portafolio autónomo: **no compite por capital, compite por atención**.

*Ojo:* eso supone que el fundador no se paga sueldo. Si se lo paga, el valle pasa de −$2,9M a −$25M. El negocio no necesita capital, pero **sí necesita ocho meses del tiempo de alguien**.

### La restricción real: la retención

No es el embudo de adquisición (el payback es de medio mes). Es que **la gente apaga las alertas**. La curva de retención por cohorte, segmentada por cuánto filtro había aprendido el sistema, es lo que prueba o refuta toda la tesis: si la cohorte con el filtro entrenado no retiene mejor que la cohorte sin entrenar, **el producto es Ctrl+F con delivery y no vale $79.000**.

### Probabilidad de éxito

**Clase de referencia A:** SaaS B2B que llega a US$1M de ARR — la cifra de consenso de la industria (Point Nine, SaaStr, y los reportes de ChartMogul que muestran una mediana de ~5 años para llegar a US$1M) está en **3-5%**. *Es consenso, no censo: hay que verificarlo.*

**Clase de referencia B:** micro-SaaS bootstrap que llega a US$250k de ARR en un mercado nacional pequeño — que es la clase que de verdad corresponde. **Esa tasa base honestamente no la conozco**, no hay censo público de micro-SaaS chilenos por tramo de ARR, y no me la voy a inventar. Lo que sí sé es que la barra es mucho más baja: no necesita capital, ni equipo, ni salir de Chile.

**Ajustes hacia arriba:** el presupuesto ya existe (el pasante); la cuña tiene fecha y consecuencia legal; payback de 0,45 meses (no muere por caja); 100% autoservicio; el SEO se acumula solo.
**Ajustes hacia abajo:** el techo del canal (la restricción dominante); TAM chileno de US$14,4M; commoditizable en un fin de semana; producto de seguro (se cancela cuando no pasa nada); riesgo de fuente.

> **25–35%** de llegar a ARR ≥ $240M CLP (≈ US$250k) al mes 24, **condicional a pasar M3 en el mes 8**. Si no se pasa M3, cae bajo 10%.
> **4–8%** de llegar a un negocio venture-scale (≥ US$1M ARR), y eso exige salir de Chile a tres países como mínimo.

**La lectura correcta:** probabilidad alta de ser un buen negocio pequeño; baja de ser uno grande. Para un portafolio autónomo con un valle de US$3.000 por idea, ése es exactamente el perfil que se busca. Para un fundador que va a gastar dos años de su vida, es otra conversación — y hay que tenerla antes, no después.

---

## Arquitectura

**La IA no busca. Busca Postgres. La IA decide.** Esa distinción es toda la arquitectura y toda la economía: si un modelo leyera el Diario Oficial completo para cada cliente, el margen sería negativo.

| Etapa | Qué hace | Costo |
|---|---|---|
| **00 Ingesta** | 05:40, se baja la edición del D.O., se parte por CVE. En paralelo: Boletín Concursal, CMF, SEIA, DT. Todo se archiva crudo. | Sin IA. CPU. |
| **01 Extracción** | Haiku 4.5 convierte cada aviso en JSON (RUT, razón social, comuna, tipo de acto, plazos). **Una vez por documento, no por cliente.** | **US$55/mes para toda la base** |
| **02 Recuperación** | Postgres: `tsvector`, `pg_trgm` (para pillar ANDESPAK contra ANDESPACK), RUT exacto. Se levanta **a propósito de más**. | Sin IA. CPU. |
| **03 Juez de relevancia** | **El producto.** Decide si esta publicación cambia lo que este cliente tiene que hacer, y escribe el motivo — **también cuando descarta**. Escala a Sonnet 5 si la confianza < 0,7. | US$0,75/mes por cuenta Estudio |
| **04 Redacción** | Sonnet 5 escribe titular, «por qué te importa» y «qué hacer». **El plazo lo calcula una función, no el modelo**: contar días es lo que un LLM hace mal y lo que un cliente no perdona. | US$0,49/mes |
| **05 Entrega** | Correo + WhatsApp. Cada pulgar vuelve a la tabla `pulgar`. | US$0,78/mes |

### Costo, con la aritmética

```
Precios: Haiku 4.5  US$1/MTok in · US$5/MTok out
         Sonnet 5   US$3/MTok in · US$15/MTok out      TC: $960/US$

INGESTA (fija, compartida):
  17.400 documentos/mes × (1.400 in + 350 out) con Haiku = US$54,81/mes
  A 250 cuentas → US$0,22 por cuenta.  ← el corpus se lee UNA vez

CUENTA ESTUDIO (120 candidatos/mes):
  Juez Haiku       120 × (2.500 + 250)                   US$0,45
  Escalada Sonnet   18 × (3.000 + 500)     [15%]         US$0,30
  Redacción Sonnet  26 × (4.000 + 450)     [pasa 22%]    US$0,49
  Soporte + prorrateo de ingesta                         US$0,24
  ─────────────────────────────────────────────────────────────
  IA         US$1,48 = $1.421      WhatsApp  $749
  Infra      $691                  Flow      $2.999
  COGS = $5.860  →  MARGEN = (79.000 − 5.860)/79.000 = 92,6%
```

Infra fija: **US$180/mes** (VPS + Postgres + workers + storage + proxies + monitoreo). No crece con las cuentas; crece con las **fuentes**.

### Los 6 agentes

`claude-haiku-4-5-20251001` — Extractor (sin herramientas, a propósito: un extractor con herramientas alucina) · Juez (escala a `claude-sonnet-5`) · Soporte · Escritor de SEO.
`claude-sonnet-5` — Redactor · Operador de Google Ads (no declara ganador un anuncio con menos de 30 conversiones: **la honestidad estadística está en el código, no en el prompt**).

### El activo

La tabla **`pulgar`**. Un competidor clona el producto en un fin de semana. No clona 40 semanas de pulgares.

### Qué está falseado en el demo

**Todo el corpus.** No hay ingesta: las 5 alertas y las 6 descartadas son objetos JavaScript. El juez es un `switch`, no un modelo — los motivos de descarte los escribí yo. Las curvas de señal y retención son **proyecciones, no mediciones**: nadie ha usado esto. Los RUT, razones sociales, folios y CVE están inventados; el **formato** de los extractos sí imita al real.

Lo que sí funciona de verdad dentro del demo: la cola de las 18:00, las reglas que la filtran, el umbral que recalcula, y el pulgar que entrena.

**Total para un producto real con 2 fuentes y 5 design partners: ~6 semanas de una persona.** Nada de esto es investigación: es trabajo. Y ése es a la vez el argumento de que es construible y el de que es copiable.

---

## Archivos

```
index.html        Landing — con la bandeja funcionando de verdad
demo/index.html   El producto: bandeja · descartadas · vigilancia · entrega · señal
negocio.html      ICP, mercado, competencia, economía unitaria, canales, autonomía
roadmap.html      6 hitos, 6 criterios de muerte, 4 gráficos, probabilidad como rango
stack.html        Modelo de datos, los 6 agentes, costos con aritmética, qué está falseado
meta.json         Metadata para el hub
autopilot.json    El manifiesto del piloto automático (criterios de muerte copiados del roadmap)
estilo.css        Teletipo de agencia. Un solo acento, usado con avaricia.
```
