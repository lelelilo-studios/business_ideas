# Cuasio

**El casi-accidente es el único aviso que vas a recibir. Captúralo en 30 segundos.**

Captura de incidentes y casi-accidentes en faena minera —con guantes, con casco y sin señal—,
triage con IA que cruza los reportes que nadie cruzó, gestión de controles críticos y armado
del reporte regulatorio.

- **Dominio:** `cuasio.com` — verificado libre el 13-07-2026 (RDAP Verisign → HTTP 404). `cuasio.cl` también libre.
- **Alternativas verificadas:** `centinelo.com`, `senaleo.com`, `cuasil.com`.
- **El nombre:** *cuasi-accidente* es el término que la industria realmente usa para el evento que avisó y no dolió.
- **Dirección de arte:** señalética industrial. Azul noche + amarillo de seguridad, geometría dura, grotesca ancha, rayado de peligro. Cero decoración.

---

## El problema

En minería la seguridad no es un trámite: es que alguien se puede morir hoy. El aparato de
cumplimiento existe (DS 132, SERNAGEOMIN), pero en la práctica **el sistema es de papel**:

- El reporte de incidente se llena a mano al final del turno.
- **El casi-accidente —el que te avisa antes de la muerte— no se reporta**, porque reportarlo
  es un trámite de veinte minutos y a nadie le pagan por hacerlo.
- La investigación se hace en Word, copiando la anterior.
- Las acciones correctivas viven en un Excel que nadie abre hasta la próxima auditoría.

El casi-accidente es la señal temprana, y es exactamente la que el sistema pierde.

## El hallazgo que sólo aparece cruzando

El demo lo muestra con datos simulados de la Faena Cerro Quemado:

> **Siete casi-accidentes distintos en tres meses. Todos en la Rampa 7. Todos entre las 19:41
> y las 20:18 — el cambio de turno. Cinco de siete mencionan “polvo” o “no la vi”.**

La causa aparece al cruzar los reportes con el dato de despacho: el camión regador riega la
ruta cada 40 minutos, pero **también entra a relevo a las 19:30**. Durante el cambio de turno
la ruta acumula dos ciclos sin regar — justo cuando las camionetas del turno entrante suben la
misma rampa por la que bajan los CAEX cargados del turno saliente.

Ninguno de los siete reportes contiene esa conclusión. La conclusión sólo aparece cruzándolos.
Y sólo se puede cruzar si existen.

---

## Marco legal: lo que consta y lo que hay que validar

Inventar una obligación legal en un producto de seguridad minera no es un error de copy: es un
pasivo. Por eso el sitio separa las dos columnas, y la marca **“por validar”** vive dentro del
producto, no en el pie de página.

**Nos consta:** el DS 132 (Ministerio de Minería) es el Reglamento de Seguridad Minera;
SERNAGEOMIN es el fiscalizador de la seguridad minera; la Ley 16.744 establece el seguro contra
accidentes del trabajo; la obligación de seguridad alcanza igual al contratista que al mandante;
la metodología de controles críticos es práctica estándar de la industria.

**Por validar (no lo afirmamos):** artículos y numerales exactos del DS 132; plazos y vías de
notificación según tipo de evento; formato oficial del reporte; si el DS 40 sigue vigente o fue
reemplazado por la normativa reciente de gestión preventiva; toda cifra de accidentabilidad —
las publica SERNAGEOMIN y se citan de la fuente o no se citan.

---

## Negocio

### A quién le vendemos primero: **a la empresa contratista**, no a la minera

| | Minera grande | **Contratista** |
|---|---|---|
| Ciclo de venta | 12–18 meses (piloto + procurement + homologación) | **4–8 semanas** |
| Cuántos hay | Decenas | **Miles** |
| Quién firma | Comité | **Una persona: el gerente general** |
| Obligación legal | Idéntica | **Idéntica** |
| Dolor | Reputacional y moral | **Comercial y hoy: si el mandante le baja el índice de seguridad, pierde el contrato y pierde la empresa** |

**El costo de esta decisión, dicho:** el contratista es un comprador con menos plata, ticket más
chico y más mortalidad. Ese churn estructural es el que puede matar la economía unitaria.

**La jugada larga:** cada contratista que entra deja su dato adentro de Cuasio. A los 18 meses
tenemos 25–30 contratistas de la misma faena, y ahí le vendemos a la minera algo que no puede
comprarle a nadie más: **la vista cruzada de todos sus contratistas**, el patrón que se repite
entre dos empresas distintas en la misma rampa. Land-and-expand de abajo hacia arriba.

### ICP

Contratista o subcontratista minera, **80–250 personas en faena** (movimiento de tierra,
mantención, perforación y tronadura, servicios de planta). Antofagasta, Calama, Copiapó,
Los Andes, Rancagua. Firma el gerente general; la campeona interna es la experta en prevención
de riesgos; en terreno lo usan operadores CAEX, mantenedores y jefes de turno.

### Precio (CLP, neto)

| Plan | Dotación | Precio | Por trabajador |
|---|---|---|---|
| Cuadrilla | hasta 50 | $190.000/mes | ≈ $3.800 |
| **Faena** | 51–250 | **$490.000/mes** | ≈ $1.960 |
| Multifaena | 251–1.000 | $1.290.000/mes | ≈ $1.290 |
| Minera mandante | — | desde $4.900.000/mes | se cotiza |

**No se cobra por usuario.** El éxito del producto depende de que reporte todo el mundo; cobrar
por asiento sería pagarnos por sabotearnos.

### Mercado (con la aritmética a la vista)

Supuestos declarados: ~250.000 empleos mineros *(orden de magnitud, por validar)*; ~60% en
contratistas → 150.000; dotación media 70 → **≈ 2.100 contratistas** *(el supuesto más frágil)*;
ARPU mezclado **$466.000**.

```
TAM Chile  = 2.100 × $466.000 × 12  +  60 faenas × $4.900.000 × 12
           = $11.743M + $3.528M = $15.271M CLP/año ≈ US$16,1M
SAM (3 años) = 1.365 contratistas × $466.000 × 12 = $7.633M ≈ US$8,0M
SOM (mes 36) = 120 contratistas + 4 mineras = $906M CLP ARR ≈ US$954k
```

**Un TAM de US$16M no sostiene una empresa de riesgo. Sostiene un negocio bueno, rentable y
chico.** El crecimiento exige una de dos extensiones (Perú/LatAm, o construcción/forestal/
portuario en Chile), y hay que elegirla en el mes 24.

### Economía unitaria

```
ARPU                         $466.000
Costo directo                $ 53.327   (IA $5.200 · voz $2.100 · infra $11.400
                                          · soporte $27.960 · onboarding $6.667)
Margen bruto                    88,6%
CAC (venta directa)          $1.398.000
Payback                          3,4 meses
LTV @ churn 1,5%/mes         $19.818.000   → LTV/CAC 14,2×
LTV @ churn 5%/mes           $ 8.258.000   → LTV/CAC  5,9×
LTV @ churn 12%/mes          $ 3.427.000   → LTV/CAC  2,5×
```

Un LTV/CAC de 14× no es buena noticia: es la señal de que un supuesto está mintiendo, y el
sospechoso es el churn. **La métrica que gobierna esta empresa no es el MRR: es la cobertura de
reporte** (qué % de la dotación reportó al menos una vez este mes).

### Canales, rankeados

1. **Outbound directo a Calama y Antofagasta** — costo por reunión ≈ $45.000, cierre 15%, ciclo 4–8 semanas.
2. **El mandante como canal** (recomienda, no impone) — una faena con 60 contratistas son 60 leads calientes. El de mayor apalancamiento y el más lento.
3. **El prevencionista consultor como distribuidor** — el "contador de la PYME" de este mercado. Comisión 15%.
4. **Mutualidades y gremios** — ACHS, Mutual de Seguridad CChC, IST, APRIMIN, SONAMI. Lento y político.
5. **SEO long-tail** — regalamos la planilla de controles críticos que venimos a reemplazar. Compone lento, no se apaga.
6. **Ferias** (EXPONOR, EXPOMIN) — CPL ≈ $150.000. Sólo el año 2.
7. **Google Ads** — tope $300.000/mes. Sólo captura al que ya busca.

**IA en el marketing:** sí para investigación de cuentas, producción de SEO long-tail (revisado
por un prevencionista con registro) y análisis de llamadas. **No** para el mensaje de contacto
—Calama es un pueblo y el spam te quema con todos—, no para contenido de autoridad sin firma
humana, no para un chatbot que conteste "¿esto me deja cumpliendo?".

### Qué mataría esto

1. **Que la gente no reporte.** No es un problema de software. Bajamos el costo de reportar de
   20 minutos a 30 segundos; no bajamos el miedo. *Señal de muerte: cobertura < 25% al mes 3 en
   2 de 3 pilotos.*
2. **Que el mandante lo regale.** Si una minera obliga a sus contratistas a usar su plataforma,
   o si Cority saca un módulo de contratistas gratis, el canal se cierra.
3. **Que esté caro.** Una contratista a suma alzada no tiene holgura.
4. **Un error normativo nuestro.** El riesgo más chico en probabilidad y el más grande en consecuencia.

---

## Roadmap (día 1 → mes 24)

| Hito | Mes | Qué es cierto | Criterio de muerte |
|---|---|---|---|
| **H1** Design partners | 3 | 3 cartas de piloto firmadas · asesor prevencionista adentro · marco legal levantado por un abogado | Si nadie quiere probarlo **gratis**, nadie lo va a comprar |
| **H2** Primer cliente pagando | 6 | Un piloto paga · cobertura ≥50% en el mes 2 · reporte en <40 s con guantes | Cobertura <25% al mes 3 en 2 de 3 pilotos. **Se para. No se pivotea.** |
| **H3** Primeros 10 | 12 | 10 clientes · churn <5% · **3 clientes pueden nombrar un hallazgo que el cruce les dio** | <10 clientes, o ningún hallazgo accionado. Sin hallazgos es un formulario caro |
| **H4** Venta repetible | 17 | CAC <$1,6M · payback <5 meses · 5 cierres/mes por un AE que no es fundador | CAC >$2,5M por 3 meses. Sólo vende el fundador = es una consultora |
| **H5** Escala de canal | 22 | 2 mandantes recomendando · 10 consultores activos · 40% de clientes por canal | 90% sigue viniendo de outbound al mes 22 |
| **H6** Decisión | 24 | ARR base $505M CLP | Matar/vender si ARR <$200M **o** cobertura promedio <40% |

**Escenarios al mes 24** (misma aritmética, supuestos distintos):

| | Cierres/mes | ARPU | Churn | MRR m24 | ARR m24 |
|---|---|---|---|---|---|
| Pesimista | 2 | $330.000 | 8% | $6,5M | $78M |
| **Base** | 5 | $466.000 | 3% | **$42,1M** | **$505M** |
| Optimista | 8 | $520.000 | 2% | $84,6M | $1.016M |

**Caja:** valle de **$17,4M en el mes 12**, ronda ángel de $180M en el mes 13, equilibrio
operacional en el mes 14.

### Probabilidad de éxito (rango, con derivación)

Éxito = US$1M de ARR sostenible al mes 36.

Clase de referencia: fracción de SaaS B2B que llega a US$1M de ARR — una minoría de un dígito
*(cifra exacta por validar)*. **La clase que de verdad importaría —SaaS vertical B2B para minería
en LatAm— no tiene una tasa base conocida. Decirlo es más útil que inventarla.** Base de trabajo: 8%.

```
8% × 1,4 (cuña afilada, presupuesto que ya existe)
   × 1,3 (canal de distribución preexistente)
   × 1,2 (ciclo de venta corto)
   × 0,55 (la adopción depende de un cambio cultural que no controlamos)  ← el brutal
   × 0,85 (dependencia regulatoria)
   × 0,80 (techo del mercado chileno)
   = 6,5%
```

- **Hoy, sin condicionar: 5 – 9%**
- **Condicional a superar H3 (mes 12): 10 – 18%** — si la gente reporta, el factor 0,55 desaparece.
- **Condicional a superar H4 (mes 17): 30 – 45%**

Y lo más importante: si redefines el éxito como *"un negocio rentable de $400M de ARR, doce
personas, 88% de margen, que hace que menos gente se muera en una faena"*, la probabilidad sube
a **25–35%** — y ése es, casi con seguridad, el negocio real.

---

## Arquitectura

### Modelo de datos (Postgres) — tres decisiones que no son cosméticas

- **`persona_id` es nullable.** El anonimato es una decisión de esquema, no un switch de la
  interfaz. Si el sistema puede volver a unir el reporte con la persona, no es anónimo. Cuando
  es anónimo se guarda sólo un hash irreversible con sal.
- **`ocurrido_at` ≠ `recibido_at`.** El reporte se escribe a las 19:55 en el rajo y llega al
  servidor a las 21:40. **La hora del evento es la primera** — un sistema que sólo guarda la de
  recepción destruye exactamente el dato que permite encontrar el patrón del cambio de turno.
- **`local_id` + sincronización idempotente.** El teléfono genera el UUID antes de tener red.
  Un reintento en una red mala no crea siete duplicados.

Tablas: `empresa · faena · area · persona · reporte · triage · control_critico · verificacion ·
patron · patron_reporte · investigacion · accion · exportacion · auditoria` (append-only, 5 años).

### Los seis agentes

| # | Agente | Modelo | Regla dura |
|---|---|---|---|
| 1 | Triage | `claude-haiku-4-5-20251001` | Confianza <0,7 → lo clasifica una persona |
| 2 | **Detector de patrones** | `claude-sonnet-5` | **No puede afirmar un patrón sin citar ≥3 folios reales.** La barrera anti-alucinación es de arquitectura, no de prompt. Dos reportes de la misma persona cuentan como uno |
| 3 | Investigación asistida | `claude-sonnet-5` | Genera un borrador. `firmada_por` sólo lo escribe un humano con rol de prevención |
| 4 | Reporte regulatorio | `claude-sonnet-5` | La plantilla la escribe un abogado. **El modelo no puede afirmar un plazo legal** |
| 5 | Resumen semanal | `claude-haiku-4-5-20251001` | Sólo cifras que existen en la base |
| 6 | Evaluador de calidad | `claude-opus-4-8` | Offline, mensual, nunca toca producción |

**Lo que la IA no hace:** no cierra investigaciones, no afirma obligaciones legales, no decide
detener una tarea, y **no califica a personas** — el día que el reporte sea un instrumento de
castigo, se acaban los reportes y se acaba el producto.

### Costo mensual (cliente de 200 personas, 160 reportes/mes, USD a $950)

```
Inferencia IA        $  5.200   (US$5,08: Haiku triage $0,60 + Sonnet patrones $1,32 +
                                 investigación $0,85 + regulatorio $0,29 + resúmenes $0,40 +
                                 eval Opus $0,15 + embeddings $0,02, con 40% de colchón)
Transcripción de voz $  2.100   (120 min/mes × US$0,015/min)
Infra asignada       $ 11.400   (US$450/mes ÷ 40 clientes, incl. retención de auditoría 5 años)
─────────────────────────────
Costo técnico        $ 18.700   = 4,0% del ARPU.  La IA sola: 1,1%.
```

**La IA no es el costo de este negocio.** El costo es la persona que va a la faena a lograr que
la gente reporte.

### Qué hay que contratar

Anthropic API · ASR con vocabulario minero (**el riesgo técnico n.º 1: hay que probarlo con motor
de CAEX de fondo**) · Postgres + pgvector · object storage cifrado · push · facturación electrónica
vía proveedor autorizado SII. **No hay integración con SERNAGEOMIN** —no nos consta que exista una
API pública— así que Cuasio genera el documento y la presentación se hace por el canal que la
autoridad exija.

### Qué está falseado en el demo

No hay backend (el estado vive en el navegador). **No hay IA**: el triage, el patrón de la Rampa 7
y el borrador de investigación están escritos a mano. El botón de grabar no graba. El "sin señal"
es un botón que prendes tú. Los datos del regador son inventados. El reporte regulatorio no se
envía a ninguna parte. **La Faena Cerro Quemado no existe y ningún dato sale de una faena real.**

---

*Prototipo. Ninguna cita normativa de este repositorio debe usarse como asesoría legal.*
