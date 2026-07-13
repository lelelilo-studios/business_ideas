# Contralta

**Cumplimiento laboral para PYMEs chilenas.**
El contador te lleva la contabilidad. Nadie te lleva el Código del Trabajo.

- **Dominio:** `contralta.com` — libre (RDAP Verisign → HTTP 404, verificado el 13-07-2026). `contralta.cl` también.
- **Alternativas verificadas:** `finiquita.com` · `reglaria.com` · `cauteo.com` (las tres, HTTP 404).
- **Precio:** desde $34.000/mes. Plan Empresa (11–49 trabajadores) $69.000/mes. Auditoría de un finiquito suelto: $19.000.
- **Estado:** prototipo. Nada de la infraestructura está aprovisionado.

```
index.html        Landing, con la auditoría de finiquito funcionando en vivo
demo/index.html   El producto: tablero de cumplimiento, ciclo de vida del trabajador
demo/calculo.js   El motor determinista (plazos, finiquito, cotizaciones, RUT)
demo/app.js       Estado, datos mock y los cinco flujos
negocio.html      ICP, TAM/SAM/SOM, competencia, economía unitaria, canales
roadmap.html      Seis hitos, tres escenarios, el valle de runway, criterios de muerte
stack.html        Modelo de datos, agentes de IA, APIs, costo y qué está falseado
```

---

## El problema

Para una PYME chilena de 15 personas, cumplir con la ley laboral es un campo minado.
Contratar bien (contrato dentro de plazo, anexos, cláusulas correctas), pagar bien
(Previred, AFP, isapre, gratificación, horas extra) y sobre todo **terminar bien**.

Un finiquito mal hecho es una demanda en la Dirección del Trabajo y una multa. El dueño
no lo sabe, no tiene RRHH, y lo resuelve preguntándole al contador — que **no es abogado
laboral, no le pagan por serlo, y no tiene por qué saber** que la fracción de siete meses
cuenta como un año entero de indemnización.

**Ahí está la cuña.** Contralta no reemplaza al contador: le tapa el hoyo que él mismo
te dice que tiene.

Encima, la ley se movió dos veces hace poco y se va a mover otra vez:

| Norma | Qué cambió | Cuándo |
|---|---|---|
| Ley 21.561 (40 horas) | Jornada máxima: 45 → 44 → **42** → 40 h | 42 h desde el **26-04-2026**; 40 h desde el 26-04-2028 |
| Ley 21.643 (Karin) | Protocolo de acoso obligatorio para todo empleador | desde el **01-08-2024** |
| Ley 21.361 | Regula el plazo y el pago del finiquito | vigente |

---

## El principio que ordena todo el producto

> **La IA no calcula tu finiquito.**

Un modelo de lenguaje que "estima" una indemnización es un pasivo legal con cara de
feature. Los montos y los plazos salen de código determinista: tablas de parámetros, un
calendario de días hábiles con los feriados de Chile, y las fórmulas escritas a mano. El
mismo caso da el mismo número las mil veces.

La IA sí lee contratos en PDF, redacta anexos sobre plantillas revisadas por un abogado,
y explica en castellano por qué algo importa. Nada más.

Y una regla de honestidad que atraviesa todo: **cada dato legal está marcado** como
`norma citada` (con su artículo) o `por validar` (criterio interpretativo o parámetro
variable). Cuando el cómputo de un plazo admite dos lecturas, el producto **muestra las
dos** y recomienda la conservadora. Un producto que vive de la precisión tiene que ser
cobarde a propósito.

---

## El demo

Panificadora San Bernardo SpA, RUT 76.412.883-4, 15 trabajadores. RUT sintéticos pero
**todos con dígito verificador válido** (módulo 11 — incluido `16.543.210-K`).

Al abrirlo, el tablero muestra **~$15,3 millones de riesgo abierto** repartido en 11
hallazgos derivados del estado, no escritos a mano. Los que importan:

- **Cotizaciones impagas de tres trabajadores** — y uno de ellos es el que estás
  despidiendo. Ley Bustos (art. 162 inc. 5): el despido **no produce el efecto de terminar
  el contrato** y sigues pagando sueldo hasta convalidar.
- **El finiquito de Héctor Sandoval, con el plazo corriendo** — y con las **dos lecturas**
  del cómputo de días hábiles a la vista: bajo un criterio ya venció, bajo el otro quedan
  dos días. En la duda, se entrega antes.
- **Nueve contratos que todavía dicen 45 horas** — y la trampa aritmética que casi nadie
  ve: al bajar la jornada sin bajar el sueldo, la hora extra se encarece. Si sigues
  dividiendo por 45, pagas de menos todos los meses.
- **Un plazo fijo en su segunda renovación** — que por ley ya es indefinido. "No le renové
  el contrato" es, en realidad, un despido.
- **Una trabajadora con fuero maternal** en la lista de reducción. El producto **bloquea el
  flujo de término**.

Cada hallazgo se abre, muestra la norma citada, la aritmética completa y un botón que lo
resuelve. Al resolverlo, **el riesgo en pesos baja de verdad** y el finiquito cambia de
resultado, porque los hallazgos se derivan del estado.

El ciclo se cierra: **no puedes registrar la entrega del finiquito mientras haya hallazgos
que cuesten plata.** Esa es la tesis entera del producto, hecha botón.

Cinco vistas: Tablero · Gente · Contratar (wizard con validación de RUT real) · Finiquito ·
Plazos y parámetros. Todo funciona en teléfono.

---

## Negocio

**ICP:** PYME de 10 a 49 trabajadores, con local o faena. El dueño firma solo, en una
reunión. La administrativa lo usa. El disparador es la primera demanda —o el susto de
haber estado cerca de una.

**Mercado (aritmética completa y supuestos declarados en `negocio.html`):**

| | Cálculo | Resultado |
|---|---|---|
| **TAM** | 1.300.000 empresas × 25% con trabajadores × $46.000 × 12 | $179.400M CLP/año ≈ US$189M |
| **SAM** | 325.000 × 37% (5–199 trabajadores) × $46.000 × 12 | $66.240M CLP/año ≈ **US$70M** |
| **SOM 36m** | 1,4% del SAM = 1.700 clientes | $938M CLP/año ≈ US$988k ARR |

> El eslabón débil está declarado: el **25% de empresas con al menos un trabajador** es un
> supuesto nuestro, no una cifra oficial. No encontré el corte limpio y no lo invento.

**Competencia real:** la carpeta de AZ y el Excel (el titular del puesto), el contador
(que es nuestro **canal**, no nuestro rival), Buk / Talana / Rankmi (HR suites, apuntan a
50+), Nubox / Defontana / Softland (calculan, no vigilan), y **Mi DT** de la Dirección del
Trabajo — gratis, oficial, y que es un archivador: guarda lo que le entregas, **no te
revisa antes**.

**Economía unitaria:**

```
ARPU mezclado                     $46.000/mes
COGS en régimen (750 cuentas)      $5.610      → margen bruto 87,8%
  IA $1.400 · infra $600 · pasarela $1.610 · retainer abogado $2.000
CAC mezclado                     $180.000      → payback 4,5 meses
Churn 3,5%/mes → vida 28,6 meses → LTV $1.154.000 → LTV/CAC 6,4×
```

> Y la trampa que no escondemos: al mes 24 hay **315 cuentas, no 750**. El retainer del
> abogado se prorratea a $4.762 y el margen real es **81,8%**, no 87,8%.

**Canales, rankeados:** contadores (el que decide la empresa, 20% de comisión a 12 meses) →
SEO long-tail con una calculadora de finiquito gratis de imán → Google Ads sólo sobre
palabras de pánico → gremios (ASECH, CCS, **CChC** — construcción = finiquitos constantes) →
outbound → mutuales → software PYME (con cuidado: es canal y competidor a la vez).

**IA en el marketing:** sí para fabricar el long-tail de SEO a escala (con revisión legal
obligatoria antes de publicar) y para personalizar el outbound. **No** para un chatbot de
ventas que conteste dudas laborales: vendemos precisión legal, y un bot que se equivoca una
vez destruye lo único que estamos vendiendo.

---

## Roadmap

Día 1 = 1 de agosto de 2026. Seis hitos, cada uno con su **criterio de muerte**.

| | Hito | Fecha | Criterio de muerte |
|---|---|---|---|
| M1 | 8 design partners auditados a mano | mes 2 | Encontramos hallazgos pero **a los dueños les da lo mismo**. La indiferencia mata; la ausencia de hallazgos, no. |
| M2 | 3 clientes pagando, ninguno amigo | mes 4 | 25 auditorías gratis y **cero pesos cobrados**. Si la objeción es "mejor le pregunto al contador", hay que venderle **al contador**. |
| M3 | 10 clientes + un caso con nombre | mes 7 | 3 de 10 se van antes del mes 3. O peor: **un cliente recibe una multa estando suscrito** por algo que debimos detectar. |
| M4 | Venta repetible · **59 clientes, $2,7M MRR** | mes 12 | Al **mes 9**, CAC > $350.000 o churn > 6%. La decisión se toma en el mes 9, no en el 11 — porque el valle es el mes 11. |
| M5 | El canal contable prende · 164 clientes | mes 18 | Menos del 15% de las altas vienen de contadores. O que Nubox/Defontana lancen esto adentro. |
| M6 | Punto de decisión · 315 clientes, ARR $174M | mes 24 | Churn > 5% mensual, **o la DT lanza gratis lo que cobramos**. Esa última nos mata sin apelación. |

**Los tres escenarios** (movidos por altas/mes, churn y ARPU, todo declarado):

| mes 24 | Clientes | MRR | ARR |
|---|---|---|---|
| Pesimista | 157 | $6,3M | $75M |
| **Base** | **315** | **$14,5M** | **$174M ≈ US$183k** |
| Optimista | 520 | $27,0M | $324M ≈ US$341k |

**El valle de runway es el mes 11, con $9,8 millones en el banco** — cinco semanas de
sueldos. Con $75M de capital inicial hay 13 meses de pista. Todo el plan existe para llegar
a ese mes con los números de M4 en la mano, porque es el único argumento que sirve para
levantar la semilla de $250M.

Y lo incómodo: **en el escenario base, al mes 24 la empresa todavía quema $5,1M al mes.**
Las curvas de ingresos y salidas se acercan pero no se cruzan. Sólo el optimista alcanza
flujo neto positivo, en el mes 23.

### Probabilidad de éxito

**Éxito = US$1M de ARR (~1.700 clientes) en 48 meses.** No en 24: ni el mejor escenario
llega a un tercio de eso en dos años, y fingir otra cosa sería mentir con un gráfico.

- **Clase de referencia:** la cifra de industria más citada es que **menos del 5% de los
  SaaS B2B llegan a US$1M de ARR** (fuentes de VC, no auditadas). **No conozco una tasa base
  publicada y confiable para SaaS B2B chilenos, y no la voy a inventar** — es la mayor
  debilidad de esta estimación. Punto de partida: **4%**.
- **Ajustes al alza:** ×1,8 cuña con fecha en el calendario (la ley crea el evento forzoso
  sola, dos veces) · ×1,6 canal de distribución que ya existe (los contadores) · ×1,3
  presupuesto que ya se gasta.
- **Ajustes a la baja:** ×0,45 techo de mercado (US$1M ARR = 1,4% del SAM chileno) · ×0,6
  riesgo regulatorio (Mi DT) · ×0,75 el producto es un pasivo si se equivoca · ×0,85 churn
  de PYME.

**Resultado: 3% – 7%**, condicional a alcanzar M4 en el mes 12. Si M4 falla, cae **bajo 1%**
y lo correcto es cortar a dos personas. Si el canal contable prende antes del mes 15, sube a
**10–14%**.

> Y lo que casi nadie escribe: la probabilidad de un resultado **bueno pero no de riesgo**
> —$150M a $250M de ARR, seis personas, rentable, sin salida— la estimo en **25–35%**, y
> honestamente **es el desenlace más probable de todos**. Vale la pena decirlo antes de que
> alguien ponga dos años de su vida acá pensando en otra cosa.

---

## Arquitectura

**La decisión que manda sobre todas las demás:** código determinista para plazos, montos y
días hábiles; IA sólo para el desorden del mundo.

El guardarraíl, en concreto: cuando el Redactor genera un finiquito, un **validador
post-hoc** extrae todo número que parezca dinero o fecha y **rechaza la generación si no
venía en el input**. Al modelo se le prohíbe físicamente inventar una cifra. Son unas 40
líneas y es probablemente la pieza más importante del producto.

**Agentes:**

| # | Agente | Modelo | Guardarraíl |
|---|---|---|---|
| 1 | Extractor documental | `claude-haiku-4-5-20251001` | Bajo el umbral de confianza no escribe: encola para revisión humana |
| 2 | Redactor de documentos | `claude-sonnet-5` | Los montos llegan calculados; el validador rechaza cifras inventadas |
| 3 | Explicador legal (RAG) | `claude-sonnet-5` | Sin norma que la sostenga, **tiene prohibido responder**: escala al abogado |
| 4 | Vigía de parámetros | `claude-haiku-4-5-20251001` | **Sin permiso de escritura.** Abre un ticket; un humano confirma |
| 5 | Curador del corpus | `claude-opus-4-8` | Fuera de producción. Su salida es un PR que firma el abogado |
| — | *Calculador de finiquitos* | **no existe** | Una indemnización es una multiplicación, no una opinión |

**Modelo de datos:** Postgres, diez tablas. Las tres que hacen que esto sea un producto de
cumplimiento y no un CRUD de empleados: `obligacion` (con **dos** fechas de vencimiento,
porque el cómputo de días hábiles no es pacífico), `parametro` (cada valor con vigencia,
fuente y nivel de confianza) y `regla` (las reglas son **datos**, no código — para que un
abogado pueda auditarlas sin saber programar; la columna `revisado_por_abogado_at` bloquea
el despliegue).

**Las dos incógnitas técnicas reales**, marcadas como tales:

1. **Previred.** Necesitamos saber qué cotizaciones fueron *rechazadas* — de ahí sale la Ley
   Bustos. No me consta que exista API pública para terceros. **Hay que verificarlo antes de
   prometer la función estrella del producto.**
2. **Mi DT.** Si hay integración, el ciclo cierra completo. Si no, el flujo termina en
   "descarga el PDF y súbelo tú".

**Costo de servir (aritmética completa en `stack.html`):** US$1,30/cuenta/mes de inferencia
(≈$1.235, redondeado a $1.400 con holgura) + $600 de infra + $1.610 de pasarela + $2.000 de
retainer legal = **$5.610**, que es exactamente lo que `negocio.html` descuenta del margen.

**Qué está falseado en el demo:** no hay servidor ni base de datos ni login (el estado vive
en el navegador); **no hay una sola llamada a un modelo de IA** — los cinco agentes están
documentados, no implementados; no puedes subir un PDF; los parámetros y los feriados están
cargados a mano. **Lo que sí es real es la aritmética**, y ese motor iría a producción tal
cual.

---

## Diseño

**Dirección de arte: "Expediente".** La referencia no es un SaaS, es un expediente de la
Dirección del Trabajo. Papel crema (no blanco), hairlines de 1px en vez de sombras, esquinas
rectas, numeración de artículos en el margen, y un único acento: **rojo lacre `#A8232E`** —
el color del timbre. Nada es simpático: un producto que te dice cuánto te va a costar una
multa no puede parecer una app de meditación.

**Tipografía**, tres roles y no tres modas: **Source Serif 4** para la ley (titulares y texto
de norma), **IBM Plex Sans** para la interfaz, **IBM Plex Mono** para el reloj y la plata
(RUT, montos, plazos — todo dato duro va en mono y se alinea).

**Los colores de los gráficos se validaron, no se eligieron a ojo.** El par rojo/verde de
estado colapsa bajo protanopia (ΔE 9,1), así que no se usa junto en ningún gráfico. La
paleta de datos que sí pasa las seis comprobaciones: `#A8232E` lacre · `#1665AD` azul de
tinta · `#94620B` ocre — peor par adyacente bajo deuteranopia **ΔE 18,0**, todos ≥3:1 de
contraste sobre el papel. El embudo usa una rampa ordinal de una sola familia.

---

## Correr esto

```bash
python3 -m http.server 8000
# → http://localhost:8000/08-laboral/
```

Sin build, sin npm, sin framework, sin CDN. HTML, CSS y JS a mano.

---

## Descargo

Contralta es una herramienta de gestión del cumplimiento, **no asesoría jurídica**. Las
normas citadas provienen del Código del Trabajo y de las leyes indicadas. Los criterios
interpretativos y los parámetros variables están marcados como tales y deben validarse con
un abogado laboral. Este sitio es un prototipo: la empresa, los trabajadores y los datos son
ficticios.
