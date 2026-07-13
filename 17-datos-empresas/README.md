# Fedatia

**La API de datos de empresas chilenas.** Un RUT entra, sale la empresa entera —y cada campo
declara de qué fuente vino y cuándo se capturó. Si una fuente se cayó, la respuesta lo dice y esa
consulta no se cobra.

- **Dominio:** `fedatia.com` — verificado libre (RDAP Verisign → HTTP 404, 2026-07-13). `fedatia.cl` también.
- **Alternativas verificadas:** `catastria.com`, `veritanda.com`, `fedante.com` (las tres, HTTP 404).
- **Marca:** de *fedatario*, quien da fe. Es lo que hace el producto: no entrega el dato, da fe de dónde salió.
- **Autonomía:** total. Esta idea se opera sin ningún ser humano — ver `autopilot.json`.

| Página | Qué es |
|---|---|
| `index.html` | La landing, que **es** la documentación. |
| `demo/index.html` | Explorador de API en vivo, con procedencia por campo y el caso de la fuente caída. |
| `negocio.html` | ICP, mercado, competencia, economía unitaria, **Autonomía**, canales, 90 días, qué lo mata. |
| `roadmap.html` | Seis hitos, cuatro gráficos, criterios de muerte, probabilidad como rango derivado. |
| `stack.html` | Modelo de datos, los cinco agentes de IA, terceros, `.env`, costos, qué está falseado. |
| `autopilot.json` | El manifiesto del piloto automático. Sus criterios de muerte se copian del roadmap. |

---

## El producto

Once fuentes públicas chilenas, normalizadas en un solo objeto `empresa`:

| Bloque | Fuente | Frescura prometida |
|---|---|---|
| `identidad` | Diario Oficial · Registro de Empresas y Sociedades | 24 h |
| `actividad` | SII (consulta pública de terceros) | 24 h |
| `mercado_publico` | API de ChileCompra · ChileProveedores | 12 h |
| `marcas` | INAPI | 7 días |
| `cmf` | CMF | 7 días |
| `concursal` | Boletín Concursal | 24 h |
| `sanciones` | Dirección del Trabajo · sanciones publicadas *(por validar)* | 30 días |

**La procedencia es el producto.** Cada bloque trae `_meta` con la fuente, el instante exacto de
captura y el estado contra su ventana de frescura: `vigente`, `vencido` o `no_disponible`.

**La regla que nos castiga:** si `estado_respuesta != "completo"`, entonces `facturado: false`.
Sin formulario, sin ticket, sin discusión. Un scraper casero no puede ofrecer esto porque nadie
se cobra a sí mismo por su propia falla.

### La línea de los datos personales

Fedatia **no entrega datos de personas naturales**: ni nombres de socios, ni de representantes
legales, ni sus RUT, ni sus domicilios. El parámetro `personas=true` está documentado y responde
**403 siempre**.

No es una limitación técnica. Que un dato esté publicado en el Diario Oficial no habilita a
revenderlo para otro fin; tratarlo exigiría declarar finalidad, base de licitud y un contrato de
tratamiento con cada cliente — y eso lo firma una persona. Preferimos renunciar al dato.
Sí entregamos el hecho societario sin la persona: que existan poderes vigentes, cuántos apoderados
hay y cuándo se modificaron.

Tampoco vendemos morosidad: el Boletín Comercial es de Equifax y está regulado por la Ley 20.575.
Marco: Ley 19.628 y Ley 21.719 — *por validar* la fecha exacta de vigencia de cada artículo.

---

## Negocio

**ICP (cuña):** fintech, factoring digital y marketplaces B2B que hacen onboarding de empresas.
5 a 80 personas, con equipo de producto propio. Nadie firma: un CTO pone la tarjeta.

**ICP explícitamente excluido:** bancos regulados. Exigen contratos firmados y un humano que los
firme. Renunciamos al segmento que mejor paga, a propósito.

### Mercado — la conclusión incómoda

Todas las cifras son estimaciones propias con la aritmética a la vista, no datos oficiales.

```
Universo (organizaciones que verifican empresas en Chile) = 4.040
  bancos 40 · seguros 60 · factoring 220 · fintech 250 · marketplaces 120
  ERPs 300 · grandes empresas 1.000 · estudios 250 · equipos comerciales 1.800

ARPA = 0,65×$42.000 + 0,28×$185.000 + 0,07×$450.000 = $110.600/mes → $1,32M/año

TAM = 4.040 × $1.320.000 = $5.333M CLP/año ≈ US$5,6M
SAM = 1.800 × $1.320.000 = $2.376M CLP/año ≈ US$2,5M   (45% puede consumir una API)
SOM = 60 cuentas × $110.000 = $6,6M CLP/mes ≈ US$83k ARR (mes 24, base) = 3,3% del SAM
```

**US$2,5M de SAM no financia una empresa con planilla. Sí financia una sin ella.** Ése es
literalmente el motivo por el que esta idea pertenece al lote de piloto automático: es la idea
correcta para un sistema que opera solo y sería una idea mediocre para un equipo.

### Precios (CLP, IVA incluido)

| Plan | Precio | Incluye |
|---|---|---|
| Sandbox | $0 | 500 consultas/mes, sin tarjeta, todas las fuentes |
| Desarrollador | $29.000/mes | 5.000 consultas, luego $8 c/u · webhooks · SLA 99,5% |
| Escala | $149.000/mes | 50.000 consultas, luego $4 c/u · SLA 99,9% · vigilancia de 2.000 RUT |
| Volumen | $2/consulta | sobre 250.000/mes, mínimo $600.000 — **tarifa publicada, no hay "contáctanos"** |
| Vigilancia | $290 por RUT/mes | el webhook de cambio: el producto que retiene |

### Economía unitaria

```
COGS a MRR $6.600.000:
  infraestructura $258.000 + proxies $76.000 + IA $31.000 + DTE $15.000
  + comisión de pago $231.000 (3,5%) + variable $119.000 (1,32M consultas × $0,09)
  = $730.000  →  margen bruto 88,9%  →  usamos 88%

Churn 3,0%/mes (el modelo da 2,1%; castigamos porque sin humano nadie rescata una cuenta)
Vida media = 33 meses
LTV = $110.000 × 0,88 × 33 = $3.194.000
CAC modelado = $159.058 · planificamos contra un techo de $320.000
Payback = 3,3 meses · LTV/CAC = 10,0×
```

**Un LTV/CAC de 10 no es una virtud, es un síntoma:** si pudiéramos gastar más en anuncios,
gastaríamos más. No hay dónde. El cuello de botella no es el CAC, es el **volumen de demanda**.
Por eso el gráfico que importa es el embudo de activación y no la curva de MRR.

### Canales (todos ejecutables por una máquina)

1. **SEO programático** en dominio propio — una página por fuente, por caso de uso, por pregunta
   long-tail, más perfiles públicos parciales (sólo hechos societarios, jamás una persona natural,
   con endpoint de supresión). Costo marginal ≈ 0. **Es el canal que decide si esto vive.**
2. **La documentación misma** — la landing es la doc.
3. **Google Ads** sobre intención de desarrollador — CPC ~$700, CAC ~$145.833. Techo: el volumen.
4. **Marketplaces de API** (RapidAPI) — ~20% de comisión, intención pura.
5. **La cuenta de la marca** publicando el estado de las fuentes: cada caída, con su post-mortem
   y su diff. Contenido honesto, indexable, y es la prueba del producto.
6. **Correo opt-in** a quien se registró.
7. **Patrocinios comprados**, declarados como publicidad.

**No hacemos:** foros con cuentas que fingen ser usuarios orgánicos (prohibido por el kernel y nos
quemaría el canal), outbound a listas raspadas, ni voz sintética saliente. Meta Ads se descarta no
por prohibición sino porque no sirve: nadie compra una API KYB mirando reels.

---

## Autonomía — cómo opera sin nadie

| Eslabón | Cómo |
|---|---|
| **Vende** | La documentación. Sandbox sin tarjeta. Tarifa completa publicada hasta el último tramo. |
| **Entrega** | HTTP. Registro → verificación de correo → llave, en menos de un minuto. |
| **Cobra** | El medidor de uso → Stripe (Flow de respaldo) → boleta electrónica vía integrador DTE. |
| **Soporta** | **Reembolso automático ante falla.** El mismo log que cobra es el que abona. |

**La escalera de soporte:** (0) la respuesta misma, con `_meta` y `avisos` · (1) docs + página de
estado pública + post-mortems · (2) asistente de recuperación estricta sobre la documentación,
**sin acceso a la API de empresas** · (3) «No tengo cómo responder esto» + abono automático ·
(4) *no existe*, y lo decimos.

**Por qué reembolso y no un agente que improvisa:** un LLM contestando «¿por qué su API dice que mi
proveedor está inhábil?» va a alucinar sobre un hecho jurídico y financiero, y una respuesta
inventada ahí le cuesta plata al cliente. Un reembolso es acotado, auditable y barato.
**Preferimos devolver la plata antes que inventar una explicación.**

### Lo que NO logramos automatizar

1. **Firmar.** DPAs, cuestionarios de proveedor crítico, revisiones de seguridad. Se pierde el
   segmento bancario. Asumido y escrito.
2. **Decidir cuando una fuente cambia de régimen.** Un selector roto se repara solo. Un captcha,
   un login o una prohibición en los términos de uso es un **juicio de licitud**, y automatizarlo
   mal es exactamente cómo un sistema autónomo se mete en un problema legal.
3. **Contestarle a la autoridad.** El endpoint de supresión corre solo; explicar la base de licitud
   es un acto jurídico.
4. **Añadir una fuente nueva.** Rasparla es trivial; decidir si se puede es lo caro.

> El piloto automático vende, entrega, cobra y se disculpa solo.
> Lo que no puede hacer solo es **firmar** y **decidir qué es lícito**.

---

## Roadmap — los seis hitos y sus criterios de muerte

Día 1 = 1 de agosto de 2026. Capital comprometido: **$9.000.000 CLP**. Headcount: **cero, siempre**.

| Hito | Mes | Qué es cierto si lo logras | Criterio de muerte | Acción |
|---|---|---|---|---|
| **H1** Validación | 2 | 20 llaves emitidas, ≥5 con +100 consultas | <5 llaves con ≥100 consultas a las 6 semanas, con $900.000 gastados en anuncios | `pausar` |
| **H2** Primer pago | 4 | Alguien puso la tarjeta sin hablar con nadie | ≥3 cuentas activadas exigen hablar con una persona y ninguna paga sola | `matar` |
| **H3** Los primeros 10 | 7 | 10 clientes, retención a 3 meses ≥80% | Churn > 8%/mes durante 3 meses seguidos | `matar` |
| **H4** Venta repetible | 12 | ≥24 clientes, MRR ≥$1,7M, payback <4 meses en dos canales | **SEO genera <40 registros/mes con 400 páginas y 6 meses de indexación** | `matar` |
| **H5** Escala + Perú | 18 | MRR ≥$4M, SEO ≥50% de los registros | El Estado publica el servicio unificado con SLA (≥70% de los campos) **y** el churn del plan base supera 15%/mes | `reducir` |
| **H6** Decisión | 24 | MRR $6,6M, 60 cuentas, margen 88%, cero personas | MRR < $2.000.000 al mes 24 | `matar` |

**Permanentes:**
- **Operacional:** una fuente crítica (SII o Diario Oficial) caída >72 h sin autorreparación,
  3 veces en un trimestre → `pausar`. Significa que el foso no se sostiene sin una persona.
- **Legal:** ≥3 requerimientos de la Agencia de Protección de Datos o del SERNAC en 12 meses →
  `pausar` la superficie pública de perfiles el mismo día.

**El H4 es el hito rojo:** es el único que mide el riesgo que no controlamos —que haya demanda—.
Los otros cinco miden ejecución.

### Caja

Valle de runway en el **mes 9**: $2.788.000 disponibles, 3,1 meses de gasto.
Punto de equilibrio: **mes 10**. Único gasto grande de una vez: **$1.200.000 en el mes 1 de revisión
legal de licitud de las once fuentes** — literalmente, el precio de lo que no se puede automatizar.

### Probabilidad de éxito

**Clase de referencia:** la que corresponde —«API de datos de nicho, operada sin equipo, que llega a
~US$80k de ARR en 24 meses»— **no tiene tasa base publicada que conozcamos, y no la inventamos.**
Las dos obvias no sirven: el 4% de SaaS B2B que llega a US$1M de ARR (*cifra ampliamente citada, no
verificada de primera fuente*) mide otro juego, y la supervivencia de empresas chilenas a 3 años
(~50-60%, *por validar*) mide almacenes y peluquerías.

```
Base estimada (llegar a ~US$83k ARR)        20–25%   ← estimación nuestra, no un dato
+ umbral de supervivencia bajísimo (sin planilla)    +8
+ presupuesto que el cliente ya gasta                +3
+ cuña afilada y distribución que ya existe          +3
− volumen de demanda muy bajo en Chile              −10
− dependencia de fuentes + Ley 21.719                −5
− sin humano se pierde el segmento bancario          −3
− riesgo de que el Estado publique la API            −2
────────────────────────────────────────────────────────
≈ 16%
```

- **12–20%** de llegar al escenario base (MRR $6,6M) al mes 24, sin condicionar.
- **40–55%** *condicional a superar el hito 4*.
- **35–45%** de no morir (MRR ≥ $2.000.000 al mes 24).

El salto al condicionar por el H4 es la afirmación central: **casi todo el riesgo está concentrado
en una sola pregunta —¿hay suficiente gente buscando esto?— y responderla cuesta 12 meses y
$11,8 millones.** El mejor argumento para construir esto no es que vaya a funcionar: es que
averiguarlo sale barato.

---

## Arquitectura

**El lazo:** 11 fuentes → adaptadores (crawler + parser, versionados) → **captura cruda inmutable**
(R2, con hash sha256 — *ésta es la evidencia*) → extractor con IA → almacén de campos con `_meta` →
API en el borde → log de uso → cobro **y abono**.

Un lazo aparte: si la cobertura de una fuente cae bajo 90%, el **reparador** re-deriva el parser y
lo despliega — pero sólo si el conjunto dorado de 40 empresas pasa al 100%.

### Los cinco agentes

| # | Agente | Modelo | Guardarraíl |
|---|---|---|---|
| 1 | Extractor de publicaciones | `claude-haiku-4-5-20251001` | Cada campo se contrasta **carácter a carácter** contra el texto original. Si no aparece literalmente, se rechaza. |
| 2 | **Reparador de adaptadores** | `claude-sonnet-5` | **El único que escribe en producción.** No despliega si el conjunto dorado no pasa al 100%. No puede resolver captchas, crear cuentas ni aceptar términos. |
| 3 | Asistente de documentación | `claude-haiku-4-5-20251001` | Recuperación estricta. **Sin acceso a la API de empresas.** Si no puede citar, abona y calla. |
| 4 | Generador de páginas (SEO) | `claude-sonnet-5` | Sólo reescribe hechos del sistema. No tiene acceso a datos de personas porque no existen. |
| 5 | Clasificador de ICP | `claude-haiku-4-5-20251001` | Clasificación pura, sin herramientas. |

El **juez** que decide si la idea sigue viva vive en `00-sistema/`, no acá. Nosotros exponemos
`/metrics` y `autopilot.json`.

### Costo mensual (a $950/USD)

```
Inferencia de IA:
  extractor (3.600 docs, haiku)      US$19,80
  reparador (20 activaciones, sonnet) US$ 6,00
  soporte   (300 consultas, haiku)    US$ 2,40
  generador SEO (40 páginas, sonnet)  US$ 3,40
  clasificador ICP (190, haiku)       US$ 1,00
  ─────────────────────────────────────────────
  US$32,60/mes = $31.000 CLP/mes

Infraestructura (mes 24):  $258.000  (Neon, Workers, R2, VPS, Redis, Sentry, Resend, staging)
Proxies residenciales:     $ 76.000
Integrador DTE:            $ 15.000
```

Que la IA cueste $31.000 al mes es la razón por la que este negocio existe: el trabajo que reemplaza
—leer 3.600 publicaciones legales y reparar parsers rotos— costaría un sueldo.

**Costo marginal de una consulta: $0,09 CLP**, contra un precio de $4 a $8. Por eso el plan gratis
de 500 consultas cuesta $45 al mes por usuario y es el canal de adquisición más barato que tenemos.

### Qué está falseado en el demo

**Real:** el validador de dígito verificador (módulo 11 de verdad), el formato de los cuerpos JSON y
de `_meta`, los códigos de error, la lógica de facturación, el payload del webhook, y los RUT
reservados del sandbox (todos terminan en `-K` y ninguno cumple módulo 11 — así no pueden chocar con
una empresa real).

**Falseado:** no hay red. Las once fuentes están mockeadas en `demo/explorador.js`. Las empresas,
montos, licitaciones y marcas son inventados. Los hash son de adorno. No hay llaves, ni cobro, ni
base de datos. Las latencias son constantes.

Lo que el demo sí demuestra es **la forma del contrato**: procedencia por campo, estado explícito
cuando algo falla, y una política de cobro que se castiga a sí misma.

---

## Qué mataría esto

1. **Que no haya suficiente gente buscando.** El riesgo número uno. Criterio de muerte del H4.
2. **Que el Estado publique el servicio unificado.** Si publica *una* fuente, nos abarata. Sólo el
   servicio *unificado, con SLA y normalizado* nos mata. Criterio del H5.
3. **Que una fuente se cierre.** Si el SII exige ClaveÚnica o pone captcha, perdemos el bloque
   `actividad`. No hay agente que resuelva eso: hay que aparecer con una persona a negociar, y no
   tenemos persona.

**Lo que no nos mata:** que alguien copie el producto. Cualquiera lo levanta en un mes; nadie lo
mantiene dos años castigándose a sí mismo cada vez que falla. Y en un mercado de US$2,5M, el segundo
entrante descubre rápido que no hay espacio para dos.
