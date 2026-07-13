# Finakids

**Que aprenda que la plata se acaba. Jugando.**

Un juego donde un niño de 7 a 12 años recibe la mesada el día 1 y tiene que llegar a fin de mes.
Si se la gasta el primer día, se queda sin colación. Y lo siente. La lección la enseña la
mecánica, no un cartel. La otra cara del producto es el panel del adulto: no cuántas estrellas
ganó su hijo, sino **qué aprendió de verdad** y **de qué conversar el domingo, antes de pasarle
la mesada**.

- **Dominio:** `finakids.com` → **HTTP 404 = libre** (rdap.verisign.com, verificado con
  `_kit/check-domain.sh` el 13-07-2026). `finakids.cl` también libre.
  Alternativas verificadas: `platalandia.com`, `ahorrolandia.com`, `mesadita.com`.
- **Estado:** prototipo. El juego se juega entero; nada más está construido.
- **Dirección de arte:** risografía / imprenta infantil de autor. Tintas planas, trama de medio
  tono, registro desplazado a propósito, personajes dibujados en SVG a mano. Cero degradados.

---

## Las cuatro verdades incómodas, respondidas

### 1. Las compras dentro del juego: las matamos

La idea original traía *"monedas virtuales y recompensas premium"*. Es decir: venderle micropagos
a un niño dentro de una app que le enseña a resistir los micropagos. **Las matamos, y no fue por
buenos.** Fue por la resta:

| | |
|---|---|
| Lo que valen las monedas premium | 30.000 usuarios gratis × US$0,20 de ARPU × $950 = **$68M/año** *(el ARPU es estimación nuestra; no encontré fuente pública sólida)* |
| Lo que destruyen | **$162M/año** de contratos de banco (ningún comité de Legal + Cumplimiento de un banco chileno pone su marca junto a micropagos para niños) **+ $180M/año** de familias, que sin el canal gratis del banco dejan de ser rentables (el CAC salta de $12.900 a $37.400) |

**$68M contra $342M. No es una decisión difícil.** Y de yapa, la renuncia *es* el posicionamiento:
*"sin compras dentro del juego, nunca"* es lo primero que tranquiliza al papá y lo primero que
desbloquea al banco.

La línea exacta: los **sellos** (las monedas del juego) se ganan jugando y **no se compran con
plata real, jamás**. Los cuadernillos y packs se venden **al adulto, en la web, fuera del juego**.
Los rankings son por curso, por avatar, y se borran cada semana.

### 2. La retención en edtech infantil es brutal. Y es lo que nos puede matar

- Retención al día 30 de las apps educativas: **~2%**. De las peores de todas las categorías.
- Churn mensual en edtech infantil: **~7,4%** (59,9% anual). Motivos: el niño perdió el interés
  (36%) y se le quedó chico el contenido (24%). *(Estimaciones editoriales de la industria, no
  cifras auditadas — así están publicadas y así las citamos.)*

Nuestro plan supone **32% de retención D30** en la cohorte de aula. Eso es **16 veces el
promedio**. Es una afirmación enorme y hay que decirla así. Se apoya en dos cosas: que un profesor
haga jugar al curso, y que el papá tenga una razón para abrir la app el domingo (los operadores
reportan que los padres que ven el progreso renuevan 2 a 3 veces más). **No lo hemos probado.**

**El criterio de muerte está escrito antes de empezar:** si en el mes 9 la retención D30 está bajo
el **10%**, no hay negocio y se para, con caja en el banco.

### 3. Quién paga de verdad: el banco. Con aritmética, no con ganas

Margen bruto de una familia: $4.990 − $749 (15% de la tienda) − $180 (IA) − $200 (infra) − $150
(soporte) = **$3.711/mes (74%)**.

| Candidato | Ticket | CAC | LTV/CAC | Payback | Veredicto |
|---|---|---|---|---|---|
| **Padre por avisos** (Meta/App Store, frío) | $4.990/mes | $37.400 | **1,3×** | 10,1 meses | **No cierra.** Payback de 10 meses contra una vida de 13,5. Trabajamos gratis para Meta. |
| **Colegio** | $0 | $12.900 | **5,2×** | 3,5 meses | **Sirve, pero no paga.** El colegio chileno paga poco y decide lento. Como cliente es malo; como puerta a 58 familias, es el canal más barato que hay. |
| **Banco / fintech** | **$54M/año** | ~$9M (6 meses de venta) | **6×** el primer año | 2 meses | **Acá empezamos.** |

**Le vendemos primero al banco** — no porque ponga más plata (que la pone), sino porque **es el
único cliente que además nos regala el canal**: financia el aula gratis y empuja la app a su base.
Después de eso, cada familia que paga cuesta $7.700 en vez de $37.400.

- **El colegio no es cliente: es canal.** Decirlo así ahorra dos años de reuniones con sostenedores.
- **El padre no es el primer cliente: es el margen.**
- **El costo de esta decisión:** riesgo de concentración brutal (3 contratos) y un mes 6 sin
  ingresos, escribiendo correos.

**El hueco que lo hace posible:** todos los productos bancarios chilenos para menores empiezan a
los **12 o 14 años** (CuentaRUT desde 12, FAN Clan 14-17, Teenpo 14+). De **7 a 12 no hay
producto**: hay charlas de RSE. El banco tiene el presupuesto y no tiene qué mostrar, justo en la
edad en que se forman los hábitos.

### 4. Datos de menores: lo que sabemos, lo que hay que validar, y lo que decidimos

**Sabido y citable.** La **Ley 21.719** fue publicada el 13-12-2024 y entra en **plena vigencia el
1 de diciembre de 2026**. Crea la Agencia de Protección de Datos Personales, con facultad de
multar (hasta **20.000 UTM**), suspender el tratamiento y publicar un registro de sanciones.
Considera **niños a los menores de 14** y exige **consentimiento del padre, madre o tutor** para
tratar sus datos. Nuestro usuario tiene 7-12: **siempre** requiere consentimiento del tutor.

**Por validar con abogado — no lo inventamos:**

1. ¿El consentimiento del tutor debe ser *verificable*, y con qué mecanismo? (En COPPA hay métodos
   tasados; en Chile depende del reglamento y de la doctrina de la APDP. **No me consta.**)
2. ¿Mandarle el avance del niño al profesor es una cesión que requiere consentimiento aparte?
3. **¿Que un banco patrocine una app usada por niños es publicidad dirigida a menores?**
   Ésta puede volar el modelo de negocio entero. Postura de diseño mientras tanto: la marca del
   banco aparece **sólo en el panel del adulto**. Jamás dentro del juego.
4. ¿Cuánto tiempo se pueden conservar las decisiones de juego de un niño?
5. Si publicamos en la App Store global, ¿nos alcanzan COPPA y el art. 8 del RGPD?

**Decidido por diseño, sin que nadie nos obligue:** la cuenta la crea el adulto; no pedimos RUT,
apellido, foto, voz ni ubicación; no hay chat; **ningún LLM le habla al niño, nunca**; cero
publicidad, cero SDK de terceros; el banco sólo ve agregados con **k ≥ 25** y el rol de base de
datos del agente que los genera **no tiene permiso de leer la tabla de niños**.

**"Aprender con dinero real":** no lo hacemos. Custodiar fondos de menores es actividad regulada
(CMF): no es un feature, es otra empresa. Lo único que haríamos algún día es un **"modo espejo" de
sólo lectura** —el saldo real de la Cuenta de Ahorro Niño alimenta la meta del chanchito, sin mover
un peso— y **hasta eso está por validar** (la Ley Fintech 21.521 creó un marco de finanzas abiertas
de implementación gradual; si un tercero puede *leer* el saldo de un menor con consentimiento del
tutor, y desde cuándo, **no me consta**).

---

## Negocio

**Mercado (Chile), con la aritmética afuera.**
Población 18,5M (Censo 2024) × 17,7% de 0-14 años = 3.274.500 niños → × 7/15 = **1.528.100 niños
de 6-12** (supuesto: cohortes parejas; es un techo, la natalidad cae) → ÷ 1,6 niños por familia =
**955.000 familias**.

- **TAM B2C** (techo irreal, supone que todos pagan): 955.000 × $4.990 × 12 = **$57.200M/año**
- **SAM B2C** (35% de hogares que pueden y quieren pagar): **$20.000M/año**
- **SAM B2B Chile:** 12 bancos × $54M + 6 cajas/aseguradoras × $30M = **$828M/año**
- **SOM a 24 meses (base):** 3 bancos ($162M) + 3.000 familias ($180M) = **$342M/año** ≈ US$360k ARR

**Lo incómodo:** el TAM B2B de Chile es de **US$870k al año**. Aunque ganáramos *todos* los
contratos de banco del país, sería menos de US$1M de ARR. **O la expansión regional funciona, o
esto es un buen negocio de cuatro personas** — que no es un fracaso, pero no es lo que se le vende
a un fondo.

**Competencia real.** Greenlight (US$5,99-14,98/mes, 6M de usuarios según la compañía, no opera en
Chile); GoHenry → Acorns Early (US$5/mes 1 niño, US$9 hasta 4; la marca se plegó en Acorns a fines
de 2025 — la categoría se consolida); **Rooster Money, comprada por NatWest** (la mejor prueba de
que los bancos compran esto… y de que pueden construirlo); **Zogo** (educación financiera
gamificada vendida a bancos, exactamente nuestro modelo, pero para adolescentes/adultos en EE.UU.);
PiggyBot (gratis, sin modelo de negocio, abandonada — la lápida de la categoría). Y el verdadero
titular del puesto: **lo gratis** (Khan Academy Kids, YouTube, Roblox, y que el niño simplemente
abra otra cosa). Contra eso perdemos si competimos por diversión pura. **No competimos por eso:
competimos por los 10 minutos que un adulto decide que valen la pena.**

**Canales, rankeados.** (1) Venta directa a 12 cuentas de banco/fintech, entra el fundador, la
puerta es Sostenibilidad y no Marketing. (2) Colegios como distribución, no como cliente: un
profesor entusiasta vale más que un convenio con el sostenedor. (3) El grupo de WhatsApp del curso
—el canal más subestimado de Chile y cuesta $0—. (4) SEO long-tail en español. (5) Prensa (la
promesa "sin compras internas" es una nota que se escribe sola). (6) **Avisos pagados: prohibidos
para adquisición en frío** por la aritmética de arriba; sólo retargeting de padres que ya
instalaron.

**IA en el marketing: dónde sí y dónde no.** *Sí:* el informe del domingo (US$0,015 por informe
que sostiene una suscripción de $4.990 — la mejor relación costo-valor del negocio); generar 40
escenarios nuevos al mes con revisión pedagógica humana obligatoria; resumir entrevistas. *No:*
**ningún LLM conversa con un niño, nunca**; no personalizamos el "loop de enganche" (es exactamente
la tecnología que hace daño acá); no generamos creatividades masivas (el canal pagado está
restringido).

**Qué mataría esto.** (1) La retención — el riesgo #1 y no hay talento de diseño que lo garantice.
(2) Que el banco descubra que le sale más barato hacerlo él; nuestra defensa es que para ellos es
un proyecto aburrido, y es una defensa frágil. (3) Un incidente con datos de menores: un titular y
se acabó. (4) Chile es muy chico.

---

## Roadmap

Seis hitos, cada uno con su **criterio de muerte**. Un roadmap sin criterios de muerte es una carta
al Viejito Pascuero.

| | Cuándo | Qué es cierto si lo logras | Caja / equipo | **Criterio de muerte** |
|---|---|---|---|---|
| **H0** | Día 1-45 | 30 niños de 8-11 juegan grabados: el juego se entiende sin adulto | $12M · 2 personas | **<60% termina el mes solo** → el juego no funciona. Se rehace o se para. |
| **H1** | Mes 3 | 5 colegios design partner que lo usan solos | $28M acum. · 3 | **Ningún profesor hace una segunda clase sin que se la pidamos** → el canal colegio no existe. |
| **H2** | Mes 6 | Piloto de banco **pagado**: $18M por 6 meses. Firmado, no prometido. | $3,0M/mes · 3 | **En 12 cuentas nadie pasó de "qué bonito" a propuesta formal** → el canal banco no existe. No se insiste 6 meses más. |
| **H3** | **Mes 9** | **Retención D30 ≥ 25% y ≥40% de padres abren el informe** | $3,6M/mes · 4 | **D30 < 10%** → el producto no engancha y todo lo demás es fantasía. **Se para acá.** Es el criterio que más probablemente nos va a matar. |
| **H4** | Mes 13 | El piloto se vuelve contrato anual ($54M) + 600 familias | $7,9M/mes · 5 · ARR $95M | **El banco no renueva** → es el acantilado del escenario pesimista. |
| **H5** | Mes 18 | Segundo banco cerrado en <5 meses, mismo playbook | $17,0M/mes · 5 · ARR $204M | **El segundo tarda más que el primero** → no hay playbook, hubo suerte. |
| **H6** | Mes 24 | 3 contratos, 3.000 familias, **$342M de ARR** | 7 personas | Levantar si ARR ≥ $300M y churn <6%. Bootstrapear entre $150-300M. **Matar bajo $120M o churn >8%.** |

**Caja:** partiendo con **$120M levantados**, el valle está en el **mes 21 con $3,7M en caja** —
una semana de planilla. Si el tercer banco se atrasa un mes, no hay sueldos. Con $180M el valle
desaparece: esa diferencia de US$63.000 es literalmente la diferencia entre dormir y no dormir.

### Probabilidad de éxito — un rango, con la derivación

**Primero, lo que no sé.** No conozco una tasa base publicada y confiable de qué fracción de las
edtech infantiles latinoamericanas llega a US$1M de ARR. La busqué y no la encontré. **No la voy a
inventar.**

Lo que sí está citado: retención D30 de apps educativas **~2%**; churn en edtech infantil
**~7,4%/mes**; conversión prueba→pago con muro duro **10,7%** (mediana D35) contra **2,1%** con
freemium blando, y LatAm monetiza más bajo (RevenueCat, 2026).

**Ajustes hacia arriba:** presupuesto que el cliente ya gasta; canal que ya existe; cuña afilada
(7-12 años sin producto); comprador probado (NatWest compró Rooster Money, Zogo vive de venderle a
bancos).
**Ajustes hacia abajo:** retención estructuralmente mala de la categoría; ciclo de venta de 4-9
meses con dos personas; dependencia regulatoria; TAM chileno de US$870k; el titular del puesto es
**gratis** e imbatible en diversión.

| Escenario | Derivación | Rango |
|---|---|---|
| **A · negocio sano de 4 personas** (2 bancos, ~$204M ARR, mes 18) | P(el juego engancha, D30 ≥ 10%) **50%** × P(1 banco pagado <mes 12) **50%** × P(renueva y entra un 2°) **55%** = **13,8%** | **10% – 18%** |
| **B · venture-scale** (US$5M ARR regional, mes 60) | P(A) **13,8%** × P(la expansión regional funciona \| A) **25%** = **3,5%** | **2% – 6%** |

Ambos **condicionales a pasar el hito 3 en el mes 9**. Hay **una posibilidad en dos** de que el
juego no enganche y esto muera ahí. Eso no es razón para no hacerlo: es razón para **gastar sólo
$30 millones antes de saberlo**, que es exactamente como está armado el roadmap.

---

## Arquitectura

**Sin build, sin framework, sin CDN.** HTML, CSS y JS a mano. Los gráficos son SVG inline generado
desde arreglos de datos declarados en la propia página — no hay librería de charts. La única
petición externa es Google Fonts.

**Modelo de datos, con una regla por delante:** *si un campo no es imprescindible para enseñar, no
existe.* `tutor` (el único con cuenta) · `nino` (nombre de pila, mes y año de nacimiento, avatar
dibujado — **sin RUT, sin apellido, sin foto, sin voz, sin ubicación**) · `partida` · `decision`
(incluye `ms_pensando`: comprar en 0,8 s es un impulso; en 6 s, una decisión) · `destreza`
(**calculada por reglas, no por IA** — el papá tiene derecho a que el número sea trazable) ·
`informe` (guarda qué modelo escribió qué y cuántos tokens) · `colegio`/`curso` (con RBD del
MINEDUC) · `impacto_agregado` (**lo único que ve el banco**, con k-anonimato ≥ 25, y el rol de BD
del agente que lo genera no tiene `SELECT` sobre `nino`).

**Los agentes de IA.** La regla que ordena todo: **ningún modelo le habla al niño**. Los LLM sólo
escriben para el adulto.

| Agente | Modelo | Cuándo | Costo |
|---|---|---|---|
| El informe del domingo | `claude-sonnet-5` | Semanal, por niño | ~2.500 tok in / 500 out = **US$0,015** |
| Reporte mensual de destrezas | `claude-opus-4-8` | Mensual, por niño | ~6.000 / 800 = **US$0,050** |
| Generador de cartas del juego | `claude-opus-4-8` | Lote mensual, offline | US$0,38/mes + **$120.000 de revisión pedagógica humana** |
| Reporte de impacto al banco | `claude-sonnet-5` | Mensual, por contrato | Lee **sólo** la vista agregada |

**Costo de IA por familia que paga: $180 CLP/mes** (= $98 del informe semanal + $76 del mensual +
reintentos, con 1,6 niños por familia y precio de **lista**, no el introductorio). Es el mismo
número que Negocio le descuenta a los $4.990. **Las familias gratis no generan costo de IA porque
no tienen panel:** el costo variable existe sólo donde hay ingreso, y eso fue diseño, no suerte.

**Infra al mes 24:** Supabase + Fly.io + Cloudflare + Sentry + Expo EAS + RevenueCat + Resend +
WhatsApp Business API = **US$481/mes** ($457.000 CLP) = $152 por familia. Negocio usa $200 con
holgura.

### Qué está falseado en el demo

**Falso:** no hay servidor, ni cuenta, ni base de datos (todo vive en memoria del navegador); el
informe "de la IA" **no llama a la API** (es una plantilla determinista con los datos reales de tu
partida — el prompt real está publicado en `stack.html`); las 5 partidas anteriores de Matías son
inventadas; los otros 9 juegos del catálogo no existen; no hay app, ni tienda, ni WhatsApp; nada de
la sección de datos está implementado.

**De verdad:** el juego (14 cartas, el chanchito que no se abre sin romperlo, el quiosco que fía
con 20% de recargo, la deuda que se cobra a fin de mes). Se juega entero, se puede ganar y perder.
El juicio del cierre se arma con tus decisiones: si ahorraste *y* pediste fiado, te lo dice y te
quita el sello. El panel se alimenta de tu partida.

### Las tres cosas que habría que configurar para que fuera real

1. **Una cuenta de Anthropic y el cron del domingo** (Sonnet 5 semanal, Opus 4.8 mensual, caché de
   prompt). Una semana de trabajo, $180 por familia al mes.
2. **Un abogado de datos y un DPO externo, *antes* de la primera instalación real**, para cerrar
   los cinco "por validar" — sobre todo el que puede volar el negocio: si el patrocinio de un banco
   dentro de una app infantil cuenta como publicidad dirigida a menores.
3. **Un banco ancla que firme los $18 millones del piloto.** Sin él, el CAC de $37.400 se come la
   línea de familias y no hay negocio: hay una app bonita. Todo lo demás es ejecutable; esto es lo
   único que hay que **ganar**.

---

## Archivos

```
16-finakids/
├── index.html        Landing. Con la semana 1 del juego jugable en vivo, no una foto.
├── demo/index.html   El producto: el juego completo (cara del niño) + el panel (cara del papá).
├── negocio.html      ICP, mercado, competencia, economía unitaria por canal, la decisión sobre
│                     las compras internas y a quién le vendemos primero.
├── roadmap.html      6 hitos con criterios de muerte, 4 gráficos SVG, probabilidad como rango.
├── stack.html        Modelo de datos, agentes de IA, costos, el frente regulatorio, lo falseado.
├── estilo.css        El sistema riso.
├── meta.json
└── README.md
```
