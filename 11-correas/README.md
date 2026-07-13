# Cintavia

**La correa, kilómetro a kilómetro.**

Monitoreo continuo de correas transportadoras para minería. Detectamos el polín que se está trabando
y el empalme que se está abriendo, y lo convertimos en una **orden de trabajo para la próxima ventana
de mantención programada** — no en otra alarma en un tablero que nadie mira.

- **Dominio:** `cintavia.com` — verificado LIBRE el 2026-07-13 (rdap.verisign.com → HTTP 404). `cintavia.cl` también libre.
- **Alternativas verificadas:** `rodalto.com`, `kilocinta.com`, `tramovia.com` (las tres con .com y .cl libres).
- **Dirección de arte:** sala de control / HMI industrial. Grafito, ámbar y cian. Nada de papel.
- **Estado:** prototipo. Datos mock, aritmética real.

| Archivo | Qué es |
|---|---|
| `index.html` | Landing. El problema, cómo funciona, el producto en vivo, precios en CLP, FAQ. |
| `demo/index.html` | **La pieza principal.** La sala de control funcionando de punta a punta. |
| `negocio.html` | ICP, mercado con la aritmética a la vista, la decisión de a quién vender primero, economía unitaria, canales, qué mataría esto. |
| `roadmap.html` | Seis hitos con criterio de muerte, tres escenarios de ARR, valle de caja, probabilidad como rango derivado. |
| `stack.html` | Modelo de datos, los cuatro agentes de IA, hardware, integraciones, costo mensual derivado, qué está falseado. |

---

## El problema

En una faena minera la correa transportadora es el sistema circulatorio: mueve el mineral desde el
chancador hasta la planta, kilómetros de cinta. **Cuando se corta, la faena entera se detiene.**

Hoy la inspección es un tipo caminando cuatro kilómetros de correa con una linterna y una libreta,
mirando 13.400 rodillos. Pasa dos veces por semana. La mantención es *«cada X horas»*, no *«cuando hace
falta»*: se botan polines buenos y se revientan polines malos. Un polín trabado roza la cinta a 5,2 m/s
y **prende fuego** — SERNAGEOMIN lo tiene identificado como causa real de incendio de correa (DS 132).

### La aritmética del dolor

Faena de 110.000 tpd, ley 0,68 % Cu, recuperación 87 %, cobre a US$4,10/lb, costo variable US$1,75/lb:

```
110.000 t/día × 0,0068 × 0,87              =    651 t Cu fino/día
651 t × 2.204,62 lb/t                      = 1.435.207 lb/día
× US$4,10/lb ÷ 24 h                        = US$245.181 /h  (ingreso bruto)
× US$1,75/lb ÷ 24 h                        = US$104.650 /h  (costo variable)
                                             ─────────────
Margen de contribución por hora detenida   = US$140.531 /h
```

Pero **que la correa se corte no significa que la planta se detenga**: el acopio de gruesos tiene ~10 h
de autonomía. Ese matiz es la diferencia entre un caso de negocio honesto y uno inflado:

| Evento | Correa fuera | − buffer | Planta detenida | Costo |
|---|---:|---:|---:|---:|
| Empalme abierto | 14 h | 10 h | 4 h | **US$562 k** |
| Polín trabado que daña la cinta | 20 h | 10 h | 10 h | **US$1,41 M** |
| Incendio de correa (tramo corto) | 48 h | 10 h | 38 h | **US$5,34 M** |
| Incendio de correa (tramo largo) | 96 h | 10 h | 86 h | **US$12,1 M** |

*Estimación con aritmética declarada, no cifra citada. Ninguno de estos números incluye lesionados.*

---

## El producto

1. **Estaciones fijas** cada 400–600 m: cámara industrial, sensor térmico radiométrico y micrófono.
   No se instala nada sobre la correa y no se toca la cuerda de tiro.
2. **Detección en el borde:** 30 fps de visión, térmica y acústica se procesan en la estación
   (Jetson Orin Nano). Se sube el *hallazgo* (~40 KB), no el video.
3. **Vida remanente con banda.** No decimos «falla en 9 días». Decimos `P50 = 9 d`, banda `6–14 d`,
   confianza `0,91`. Un sistema de confiabilidad que finge certeza absoluta no es creíble.
4. **La orden de trabajo.** El hallazgo se convierte en un aviso de **SAP PM** con repuesto reservado,
   horas asignadas y la ventana correcta. **Aquí es donde esto se transforma en plata.**

### Qué detectamos y qué no

| Modo de falla | Precisión* | Madurez |
|---|---:|---|
| Polín trabado (no gira) | 0,93 | Producción |
| Desalineamiento de cinta | 0,91 | Producción |
| Polín de carga sobrecalentado | 0,88 | Producción |
| Derrame en punto de transferencia | 0,84 | Producción |
| Empalme en elongación | 0,73 | Beta |
| Rasgadura superficial de cubierta | 0,61 | Beta |
| Rasgadura longitudinal pasante («rip») | — | **No lo hacemos** — necesita RFID embebido en la cinta |
| Metal extraño (tramp metal) | — | **No lo hacemos** — necesita detector magnético en línea |

*\*Precisión = fracción de hallazgos emitidos que resultan reales al intervenir, a umbral 0,60.*
**Estos números son la meta del hito M2, no un resultado medido: hoy no existe el dataset.**

---

## Precio

| Plan | CLP/mes | USD | Qué incluye |
|---|---|---|---|
| **Tramo Ronda** | $890.000 | US$947 | 1 correa hasta 1,5 km · 3 estaciones |
| **Tramo Faena** | $3.900.000 | US$4.149 | Hasta 6 km · 12 estaciones · SAP PM + AVEVA PI · ing. de confiabilidad asignado |
| **Tramo Cinturón** | desde $8.400.000 | US$8.936 | Faena completa · modelo reentrenado con tu histórico · SLA |

**Habilitación:** $2.250.000 por estación (una vez) — hardware + instalación, prácticamente a costo (16 % de margen).
**O comodato:** $0 de entrada, +35 % en la mensualidad.

Deliberadamente **OPEX y no CAPEX**: una inversión de capital en una minera necesita directorio y 14 meses.
Un gasto operacional lo firma el gerente de mantención.

---

# Negocio

## La decisión: a quién le vendemos primero

Es la única decisión que importa. Está resuelta con aritmética, y la respuesta **no** es «a la minera».

| | **A · La minera grande** | **B · El contratista de correas** ✅ | **C · La mediana minería** |
|---|---|---|---|
| Ciclo de venta | 12–18 meses | **8–14 semanas** | 4–8 semanas |
| Ticket anual | US$107.000 | US$49.800 | US$11.400 |
| Prob. de cierre | ~12 % | ~50 % (post-piloto) | — |
| **CAC implícito** | **US$326.000** | **US$18.800** | US$6.000 |
| Veredicto | ✗ Descartada | ✅ **Elegida** | Año 3 |

**Por qué A no:** 15 meses hasta el primer peso × US$28.000/mes de quema = **US$420.000 de caja quemada
con cero ingresos**. No es mal negocio: es que no lo puedes financiar sin levantar US$3 M *antes* de tener
un cliente. Y para levantar US$3 M necesitas un cliente.

**Por qué B sí — tres razones, en orden de peso:**

1. **Ya está adentro.** Homologado, con credencial, con acceso físico a la correa y con sus propias ventanas
   de mantención. No necesitamos que la minera nos apruebe a *nosotros*: instalamos bajo *su* contrato, en
   *su* ventana. **Ese es el atajo de 14 meses.**
2. **El ahorro es suyo.** Su contrato es a **suma alzada por disponibilidad**: le pagan por que la correa esté
   arriba, no por hora hombre. Si baja sus HH y sube su disponibilidad, la diferencia es margen suyo.
3. **Lo firma una persona.** El gerente de operaciones, contra su presupuesto operacional. Sin comité de inversión.

**Por qué C todavía no:** su correa tiene 800 m y un corte le cuesta US$150.000, no US$1,4 M. Y el riesgo real:
cuando el cobre baja de US$3,40/lb, **la mediana minería chilena para**. Nuestro churn quedaría correlacionado
con el precio del cobre, justo cuando menos podemos aguantarlo.

**La jugada completa:** entramos por el contratista (mes 5), acumulamos 12–18 meses de detecciones validadas
*dentro* de la faena, y cuando llega la relicitación del contrato de correas **la minera nos pone en las bases
técnicas**. Ahí dejamos de venderle al contratista y le vendemos a la minera, sin ciclo de 18 meses.

## ICP

- **Segmento:** contratista de mantención de correas en faena de gran minería del norte. 20–60 personas en faena, US$3–12 M/año de facturación.
- **Filtro duro:** contrato a **suma alzada o por disponibilidad**, NO a precio unitario por HH.
  *Si le pagan por hora hombre, no es cliente: es enemigo* — reducir cambios de polín le baja la facturación.
- **Quién firma:** gerente de operaciones. **Quién lo usa:** el planificador de mantención y el supervisor de terreno (en el teléfono, caminando).
- **Dónde está hoy:** Excel y WhatsApp. Ese Excel es el verdadero titular del puesto.
- **Dónde lo encuentro:** Calama, Antofagasta, Copiapó. **Son catorce empresas en todo el norte. Cabe en una servilleta.**

## Mercado — con la aritmética a la vista

**Supuestos declarados (mi conteo desde listados públicos de Cochilco/SERNAGEOMIN, no una cifra citada;
puede estar ±20 % equivocado):**

| | Cuenta | Sitios | ARR |
|---|---|---:|---:|
| **TAM Chile** | 24 faenas grandes × US$107k | 24 | US$2,57 M |
| | 14 medianas × US$11,4k | 14 | US$0,16 M |
| | 17 adyacentes (cemento, cal, puertos, celulosa) × US$49,8k | 17 | US$0,85 M |
| | **Total** | **55** | **US$3,58 M** |
| **SAM** | de las 24 grandes, las con contratista externo a suma alzada (60 %) | 14 | US$1,50 M |
| | adyacentes alcanzables | 6 | US$0,30 M |
| | **Total** | **20** | **US$1,80 M** |
| **SOM 36 m** | 12 sitios, ticket mezclado US$70k | 12 | **US$840 k** |

### La conclusión incómoda

**El TAM de Chile es de US$3,6 M de ARR. Eso no sostiene una empresa de venture.**
Chile no es el mercado — **Chile es el laboratorio**: 24 faenas de clase mundial en 800 km de desierto,
en tu idioma, con tus normas y con tus contratistas. El mejor lugar del planeta para *construir* esto,
y un lugar pésimo para venderlo solamente ahí.

**La extensión (mi conteo):** faenas de cobre, hierro y carbón con overland > 2 km en el mundo —
Perú 22, Brasil 40, Australia 85, Sudáfrica 30, Indonesia 12, EE.UU./Canadá 45, resto 60 = **~294 faenas**.
× US$107k = **US$31 M de ARR**; con adyacentes, US$50–65 M.

> **Y la honestidad final: esto, muy bien ejecutado, es un negocio de US$10 a 25 M de ARR.
> No es un unicornio y no va a serlo.** Si tu tesis necesita un fondo de 100×, no construyas esto.
> Si buscas una empresa que valga US$120 M y que sea difícil de matar, es una candidata razonable.

## Competencia

| Quién | Qué hace bien | Dónde no llega |
|---|---|---|
| **El inspector con la linterna** (el titular real) | Barato, ya contratado, conoce la correa | Pasa 2 veces/semana. No está a las 03:14 del jueves |
| **Continental ContiTech, Flexco, Bridgestone, Fenner Dunlop** | Ya en la especificación. Sensores embebidos en *su* cinta. Detección de rip real | Sólo ven su marca. Una faena tiene 4 marcas de cinta y 6 de polín |
| **Vayeron Smart-Idler** | Sensor dentro del rodillo. Dato limpio, sin falsos por polvo | Hay que *reemplazar el polín* para monitorearlo. 13.400 rodillos en una overland |
| **Dingo, Uptake, Aspen Mtell, GE APM** | Ya instaladas. Dingo es fuerte en flota móvil y aceite | Plataformas horizontales: *tú* pones los sensores y *tú* etiquetas las fallas |
| **AVEVA PI System** | *El* sistema de datos de la minería chilena | Guarda las series del PLC, no ve la correa. **No competimos con PI: escribimos en PI** |
| **Consultora de termografía** | Barata, ronda mensual con FLIR de mano | Una foto al mes de un fenómeno que se desarrolla en dos semanas |

**Diferenciación honesta:** la detección es copiable — cualquiera de los de arriba entrena un clasificador
térmico en 18 meses. Lo que no se copia rápido es **el último kilómetro: el aviso de SAP PM con el repuesto
reservado, las horas asignadas y la ventana correcta**, más el canal (llegamos adentro de la faena de la mano
del contratista que ya está homologado ahí). **Si tu tesis de inversión es «tenemos el mejor modelo», no
inviertas en esto.**

## Economía unitaria — Tramo Faena (12 estaciones, US$4.149/mes)

```
COGS mensual por faena
  IA + cloud (derivado en stack.html)          US$   85
  Conectividad LTE de respaldo (6 × US$25)     US$  150
  Garantía hardware (5 %/año de US$16.800)     US$   70
  Soporte en terreno (ing. Calama ÷ 8 sitios)  US$  563   ← el costo que duele
                                               ─────────
  COGS                                         US$  868
  Precio                                       US$4.149
  MARGEN BRUTO                                    79,1 %
```

**No es 90 %: esto tiene fierro.** Y el costo que más duele no es la IA (2,0 % del precio) — es el ingeniero
en Calama.

```
CAC (por 2 contratos cerrados)
  10 conversaciones × 0,15 FTE × US$5.500      US$ 8.250
  4 pilotos subsidiados × US$6.000             US$24.000
  Viajes: 4 × 3 visitas × US$450               US$ 5.400
                                               ─────────
  Total para cerrar 2                          US$37.650
  CAC                                          US$18.825

PAYBACK — dos números distintos
  Contable (CAC ÷ margen bruto)                  5,7 meses
  En CAJA, con habilitación pagada                4,2 meses
  En CAJA, con comodato                           8,9 meses

LTV (churn 18 %/año, vida usada 4 años)        US$157.500
LTV / CAC                                            8,4×
```

### Por qué existen dos modalidades de hardware

- **Habilitación pagada** ($2.250.000/estación): el cliente compra el fierro. Ganamos 16 % — *prácticamente
  nada* — pero nos deja el balance limpio: **payback en caja de 4,2 meses** y podemos bootstrapear.
- **Comodato** (+35 % mensual, US$0 de entrada): nosotros financiamos US$24.000 de fierro por cliente. El
  payback en caja se va a **8,9 meses** y cada venta nueva nos come caja. Es un arma comercial cara.

**Decisión:** año 1 empujamos habilitación pagada (no tenemos caja para financiar fierro). Desde el mes 15,
con caja levantada, el comodato pasa a ser el default — elimina la única objeción real (el CAPEX) y sube el
ARPU un 35 %.

### El churn no depende de nuestro producto. Ese es el problema.

El contratista renueva su contrato con la faena cada 3–5 años. **Si pierde la licitación, nos vamos con él**,
aunque el producto haya funcionado perfecto. Ese es el 18 % de churn y no lo controlamos con retención.

**La mitigación, y hay que pelearla desde el día 1:** una **cláusula de novación**. Las estaciones ya están
instaladas en la estructura de la correa y la faena las quiere. Si el contratista sale, la suscripción se
transfiere al que entra. Firmar eso en el contrato inicial es la diferencia entre 18 % y 6 % de churn — y
entre un LTV de US$158 k y uno de US$470 k.

> **Si en los primeros 3 contratos no logramos meter la cláusula de novación, hay que revisar toda la tesis
> del canal.**

## Canales, rankeados

1. **Outbound directo al gerente de operaciones.** Son 14 empresas. Se llaman una por una. El demo se muestra
   en el teléfono, en la faena, en 4 minutos. *CAC US$18,8k.*
2. **Distribuidores de polines y correa como canal de referencia.** Quien le vende los polines **sabe cuáles se
   están reventando**. Comisión 10 % del año 1.
3. **Exponor (Antofagasta) y EXPOMIN.** No un stand: una **charla técnica en el bloque de confiabilidad** con
   el dato de una faena real. ~US$9.000.
4. **Aprimin y Consejo Minero.** Aprimin es literalmente el gremio de nuestros clientes. ~$2 M CLP/año.
5. **SEO long-tail en español.** «vida útil polín correa transportadora», «causas de incendio de correa minera»,
   «DS 132 correas». Volumen bajo (200–800/mes), **intención perfecta, cero competencia**.
6. **Mercado Público y portales de compra de las mineras.** Sirve desde el año 2: los pliegos piden 3 años de
   experiencia comprobable.
7. ~~**Google / Meta / LinkedIn Ads**~~ — **descartado explícitamente.** Nuestro comprador son ~40 personas en
   todo Chile. Pagar CPC para llegarle a alguien que puedo llamar por teléfono es una confesión de que no sé
   quién es mi cliente.

## IA en el marketing mismo

**Donde sirve:**
- **El informe del piloto.** 40 páginas con curvas, hallazgos, validación contra la termografía manual del
  cliente y ROI con *sus* supuestos. Antes: 3 días de un ingeniero. Con Claude: 2 horas y una revisión humana.
  **Ese informe ES la venta** — es lo único que el gerente lleva a su directorio.
- **Vigilancia de licitaciones** en Mercado Público y los portales de compra de las mineras.
- **Adaptación a Perú** (allá la correa es «faja»; el vocabulario cambia, la precisión técnica no puede perderse).

**Donde NO, y por qué:**
- **Contenido de LinkedIn escrito por IA: no.** Nuestro comprador es un ingeniero de mantención de 48 años que
  lleva 20 años en el norte y detecta el texto de IA en dos frases. Lo que vendemos es *credibilidad técnica*:
  es el único activo comercial que tenemos. **Todo lo que se publica con nuestro nombre lo escribe alguien que
  ha estado en una sala de control.**
- **Prospección en frío a volumen: no.** La lista tiene catorce nombres. Automatizar correos a catorce personas
  es teatro. Se les llama.
- **Chatbot en el sitio: no.** Si alguien de una faena entra a las 2 AM, quiero que le conteste el fundador.

*La regla: la IA sirve donde el trabajo es real y voluminoso, y estorba donde el trabajo es la relación.
En un mercado de 14 clientes, casi todo es la relación.*

## Primeros 90 días

| Semana | Qué | Entregable duro |
|---|---|---|
| 1–2 | La lista: las 14 contratistas del norte, con nombre, tipo de contrato y faena. Se llama a todas. | **6 reuniones agendadas** |
| 3–4 | Estación #1 con hardware comprado al detalle (US$2.200, caro porque es una unidad) | **Una estación que enciende y transmite** |
| 5–6 | Instalar en el **taller del contratista**, no en faena. Filmar 200 h de polines reales — incluido uno que trabamos a propósito | **200 h etiquetadas.** Este dataset no existe hoy |
| 7–10 | Modelo v0. La meta *no* es la precisión: es que un mantenedor mire 20 detecciones y diga «esa sí, esa no» | **Sesión de revisión con 3 mantenedores** |
| 11–13 | Primer piloto en faena. La parte difícil no es el software: es la carta de acceso, el permiso, el LOTO, el comité paritario | **Una estación en una correa de verdad, con permiso escrito** |

> **Criterio de salida — el único que importa:** una estación instalada en una faena de verdad, con permiso
> escrito, generando detecciones. **Si al día 90 no tenemos eso, el problema no es el software: es que no
> tenemos acceso.** Y sin acceso no hay negocio. Ese es el momento de parar, no el mes 18.

## Qué mataría esto (en orden de probabilidad)

1. **El contratista a precio unitario.** Si le pagan por HH y por polín cambiado, reducir cambios le baja la
   factura: lo compra, no lo usa, y nos boicotea con una sonrisa. Nos obliga a filtrar el ICP y **eso corta el
   SAM a la mitad.** *Probabilidad: alta. Control: ninguno.*
2. **Un OEM regala el software.** Continental o Flexco meten monitoreo gratis en la venta de la cinta. Jugada
   obvia, tienen el canal y 30 años de relación. *Probabilidad: media-alta a 3 años.*
3. **La precisión no llega.** Bajo 0,70 a un umbral útil, el mantenedor deja de mirar el sistema en tres semanas
   y **no vuelve nunca**. La confianza se pierde una sola vez.
4. **El polvo.** Suena tonto; no lo es. Si el visor se ensucia cada 4 días, el soporte en terreno (ya son
   US$563 de los US$868 de COGS) se dispara y el margen de 79 % se convierte en 45 %.
5. **El tamaño del mercado.** Si tardamos más de 24 meses en poder vender en Perú, nos quedamos sin mercado
   antes de quedarnos sin producto.
6. **El precio del cobre.** A US$3,20/lb el margen por hora cae de US$140.531 a **US$86.700** y todo el caso se
   comprime 38 %. Bajo US$3,00/lb las mineras congelan todo gasto no crítico y «monitoreo predictivo» es lo
   primero que se corta. **No lo controlamos en absoluto.**

**Lo que NO nos mata, aunque lo parezca:** que alguien copie la detección. La detección es el 20 % del producto.
El otro 80 % es el aviso de SAP, la ventana correcta, la cláusula de novación y el ingeniero que se sube a la
camioneta en Calama.

---

# Roadmap

## Escenarios de ARR a 24 meses

| Supuesto | Pesimista | **Base** | Optimista |
|---|---:|---:|---:|
| Primer cliente pagando | mes 9 | **mes 6** | mes 5 |
| Ritmo de cierre (régimen) | 1 / 3 meses | **1 / 2 meses** | 1 / mes |
| Ticket promedio | US$3.200 | **US$4.149** | US$5.200 |
| *(por qué ese ticket)* | *mezcla con Ronda* | *Faena puro* | *Cinturón + comodato* |
| Churn de logo | 25 % | **18 %** | 12 % |
| *(por qué ese churn)* | *sin novación* | *novación en la mitad* | *novación en todos* |
| **Clientes al mes 24** | **4** | **9** | **15** |
| **ARR al mes 24** | US$154 k | **US$448 k** | US$936 k |

*El techo no es la demanda, es el SAM: el SAM chileno son 20 sitios. Por eso el hito M4 es «primer sitio en
Perú» y no «más clientes en Chile».*

## Caja — el número que no me gusta

```
Quema
  m1–m6    4 personas   US$28.000/mes
  m7–m14   6 personas   US$42.000/mes
  m15–m24  9 personas   US$63.000/mes
  Quema neta acumulada al m24 (escenario base)   US$554 k
```

**El plan base NO cabe en US$400 k. Con US$400 k, la caja cruza cero en el mes 18.**
Hay exactamente dos salidas y hay que elegir una *antes* de empezar:

- **(a) Levantar US$700 k.** Pre-seed de US$400 k + segundo tramo de US$300 k al mes 12, **condicionado a
  haber logrado M2**. Llegamos al mes 24 con US$146 k — 2,3 meses de colchón. Apretado.
- **(b) No contratar la tercera tanda.** Quedarse en 6 personas: la acumulada al m24 baja a US$344 k, que sí
  cabe en US$400 k. Costo: 6 clientes en vez de 9, y no salimos a Perú.

**Recomendación: (a), con el segundo tramo amarrado a M2.** Si M2 falla, (b) es la retirada ordenada y no
la quiebra.

## La restricción real: el embudo de instalación

No es conseguir leads. Es la puerta de la faena.

| Etapa | Quedan | Semana acumulada |
|---|---:|---:|
| Contratista contactado | 14 (100 %) | 0 |
| Reunión técnica | 10 (71 %) | 2 |
| Piloto aprobado por el contratista | 6 (43 %) | 5 |
| **Permiso de acceso de la MINERA** | **4 (29 %)** | **11** ← *6 semanas, elimina 1 de cada 3* |
| Estación instalada en ventana | 4 (29 %) | 14 |
| Contrato firmado | 2 (14 %) | 20 |

**Cómo se ataca:** piloto en el taller del contratista (sin permiso de la minera); tramitar el permiso el
día 1 en paralelo, no el día 35; entrar como equipo del contratista, con su credencial y su camioneta;
**cero intervención sobre la correa** (baja el permiso de «modificación de equipo crítico» a «instalación de
instrumentación» — de comité a formulario).

*Indicador semanal: semanas promedio desde piloto aprobado hasta estación energizada. Si sube de 9,
el negocio se está trabando en la puerta y ninguna mejora de producto lo va a arreglar.*

## Los seis hitos y sus criterios de muerte

| Hito | Cuándo | Qué es cierto si lo lograste | **Criterio de muerte** |
|---|---|---|---|
| **M0** El acceso | día 90 · caja US$84 k · 4 pers. | Una estación instalada en una correa de verdad con permiso escrito. 200 h etiquetadas. | **Si al día 90 no hay estación en faena con permiso escrito**, el problema no es el software: no tenemos acceso. Parar acá cuesta US$84 k; parar en el mes 18 cuesta US$400 k. |
| **M1** Primer cliente pagando | mes 6 · caja acum. US$136 k | Un contratista firmó contrato pagado (no piloto extendido) y pagó la habilitación. Novación en el contrato. | **El piloto funcionó y aun así nadie firma.** Significa que el ahorro no es de nadie. Si 3 pilotos exitosos no convierten, el problema es el modelo de negocio, no el producto. |
| **M2** Precisión validada ← *decide todo* | mes 12 · 4 clientes · 6 pers. | **Precisión ≥ 0,80 con recall ≥ 0,70**, validada contra intervención física. 2 fallas evitadas documentadas. | **Precisión < 0,70** con 12 meses de datos reales. Si no llegó a los 12 meses, no llega «con más datos»: llegaría con *otro sensor*, y eso es otra empresa. **Este hito condiciona el segundo tramo de capital.** |
| **M3** Cinco sitios | mes 15 · ARR US$249 k · 9 pers. | 5 sitios pagando, **al menos 2 cerrados por alguien que no es fundador**. Ciclo bajó de 20 a 14 semanas. | **CAC en caja > US$45.000** o ciclo > 9 meses. Cualquiera rompe la economía unitaria. |
| **M4** Perú y la primera renovación | mes 20 · ARR US$398 k | Un sitio en Perú con el mismo contratista. Los primeros 3 clientes **renovaron**. Una minera nos pidió estar en sus bases técnicas. | **Más de 1 de los primeros 5 clientes se va** en la renovación. Si los que atendimos a mano se van, los que no atendamos se van más rápido. |
| **M5** Decisión | mes 24 · ARR base US$448 k · caja US$146 k | — | Ver abajo. |

### M5 — el punto de decisión (mes 24)

- **Levantar Serie A** — *sólo si el sitio de Perú funcionó.* US$448 k de ARR con un TAM chileno de US$3,6 M
  no levanta nada. Con Perú validado, la historia es «294 faenas en el mundo» y sí levanta.
  *Umbral: ARR > US$400 k Y ≥ 1 cliente fuera de Chile Y NRR > 100 %.*
- **Bootstrapear** — *el resultado más probable, y no es malo.* Con 79 % de margen y 9 clientes, la empresa
  es rentable con 7 personas. Crece 3–4 clientes al año, sin diluir, y llega a US$1,5–2,5 M de ARR en el
  año 5. Vale US$8–12 M. *Umbral: ARR > US$300 k Y churn < 20 %.*
- **Matar** — *si M2 falló o el churn superó el 25 %.* El hardware se le regala a los clientes, el equipo se
  coloca y se devuelve lo que quede de caja. **Se hace en el mes 24, no en el 36.**
  *Umbral: precisión < 0,70 O churn > 25 % O ARR < US$150 k.*

## Probabilidad de éxito

**Clase de referencia declarada.** ¿Qué fracción de startups B2B llega a US$1 M de ARR? Los análisis públicos
del ecosistema SaaS B2B (conteos de Crunchbase, el trabajo de Point Nine sobre tasas de progresión) ubican esa
fracción en el orden del **5–10 %**. Uso el punto medio: **7 %**.

> **Donde no sé, y lo digo: no encontré una tasa base publicada específica para mining-tech chileno, y no la
> voy a inventar.** Lo más cercano son los datos de supervivencia de Corfo y Start-Up Chile, pero esos miden
> *que la empresa siga viva*, no que llegue a US$1 M de ARR. No es la misma pregunta y usarlos sería hacer
> trampa con una cita.

**Los ajustes, declarados:**

| Factor | × | Por qué |
|---|---:|---|
| El presupuesto ya existe | 1,6 | La mantención de correas es una línea de US$3–8 M/año que ya se gasta |
| Canal que ya está adentro | 1,8 | El contratista tiene credencial, camioneta y ventana. Ahorra 12 meses de homologación |
| Dolor cuantificado | 1,3 | US$140.531/hora. No hay que evangelizar a nadie |
| Hardware en faena | 0,6 | CAPEX, homologación, polvo, soporte en terreno |
| TAM chileno de US$3,6 M | 0,7 | Obliga a internacionalizar antes del mes 24, con 9 clientes y sin equipo |
| Canal capturable por el OEM | 0,8 | Continental o Flexco pueden regalar el software con la cinta |
| Contratista a precio unitario | 0,8 | La mitad del SAM tiene el incentivo invertido |

```
7 % × 1,6 × 1,8 × 1,3 × 0,6 × 0,7 × 0,8 × 0,8 = 7,0 %
```

> **El resultado más interesante:** los vientos a favor y en contra **se cancelan casi exactamente**.
> Eso significa que este no es un negocio especialmente fácil ni especialmente difícil: **es un negocio
> normal, y el resultado lo decide la ejecución de M2 y del canal**, no la estructura del mercado.

**El resultado, como rango condicional:**

| | Probabilidad de llegar a US$1 M de ARR al mes 30 |
|---|---|
| **Incondicional** | **6 – 12 %** (centrado en el 7 % derivado, banda por la incertidumbre de la tasa base) |
| **Condicional a lograr M2 antes del mes 12** | **18 – 28 %** — M2 elimina el riesgo técnico, el más grande, y desbloquea el segundo tramo de capital. Llegar a M2 es ~40 % del riesgo total |
| **Si M2 falla** | **< 3 %** — sin precisión no hay confianza; sin confianza el mantenedor no renueva. No hay venta que lo compense |

**Cómo usar este número:** el 7 % incondicional dice «esta idea es tan riesgosa como cualquier startup B2B».
El salto a 18–28 % condicional a M2 dice **dónde está el riesgo y qué hay que hacer primero**: no vender, no
contratar, no levantar — **demostrar que el detector funciona en una correa de verdad, con polvo de verdad,
contra una intervención física de verdad.** Todo lo demás viene después.

---

# Arquitectura

Nada aprovisionado. Todo documentado.

## El flujo, en cuatro capas

| Capa | Qué corre | Dónde | Latencia |
|---|---|---|---|
| **1 · BORDE** | Detector de polines (CNN tipo YOLO, 30 fps) · clasificador térmico (gradient boosting sobre ΔT vs vecinos, pendiente 7d/30d, área caliente) · rotación (flujo óptico) · acústica (espectrograma → CNN). **Ninguno es un LLM.** Se sube el hallazgo (~40 KB), no el video | Jetson Orin Nano, en el gabinete | < 1 s |
| **2 · FUSIÓN** | Modelo de supervivencia (Weibull acelerada) → vida remanente **P10/P50/P90**. La banda no es decoración: es el output | Worker en la nube | minutos |
| **3 · CRITERIO** | Los cuatro agentes de Claude | Anthropic API | seg – min |
| **4 · ACCIÓN** | Aviso en SAP PM · escritura de vuelta en AVEVA PI · WhatsApp al supervisor · el tablero | Sistemas de la minera | < 15 min |

**La decisión de arquitectura que define el margen bruto:** el cómputo pesado corre *en la estación*, no en la
nube. Costo marginal por frame ≈ 0 porque el hardware ya está pagado. **Claude entra después de la detección**,
donde de verdad aporta. Meter un LLM multimodal a mirar 30 fps de correa sería 400× más caro y peor.

## Los cuatro agentes de IA

| # | Agente | Modelo | Qué hace | Herramientas |
|---|---|---|---|---|
| 1 | **Triage de eventos dudosos** | `claude-haiku-4-5` | Los eventos entre 0,35 y 0,75 de score son los caros. Cruza los 3 canales, el histórico, el contexto del PLC y **la calidad óptica de la estación** (¿o es que el lente está sucio?). Salida estructurada obligatoria (`output_config.format`) | `leer_historico_componente`, `leer_tags_pi`, `leer_clima`, `leer_estado_optico` |
| 2 | **Consolidador de turno** ← *el que evita que esto sea ruido* | `claude-sonnet-5` · adaptive thinking · effort high · prompt caching del catálogo (~11k tok) | Convierte ~60 detecciones crudas en **6 hallazgos**. El mismo polín visto 8 veces por 3 estaciones es *un* hallazgo, no ocho alarmas. **Es la diferencia entre un producto y un tablero que nadie mira** | `agrupar_detecciones`, `ajustar_curva_vida`, `leer_ot_abiertas`, `leer_intervenciones`, `escribir_hallazgo` |
| 3 | **Redactor de la OT** | `claude-sonnet-5` · strict tool use | Escribe el aviso SAP PM tipo M2: descripción, prioridad, ubicación técnica, repuestos con código de SAP MM, horas, cuadrilla, ventana. Calcula el riesgo de postergar | `buscar_material_sap`, `leer_ventanas`, `calcular_riesgo_diferido`, `crear_aviso_sap` ← **requiere confirmación humana** |
| 4 | **Analista de confiabilidad** | `claude-opus-4-8` · adaptive thinking (`display: summarized`) · effort high · code execution | Preguntas abiertas: *«¿cuántos polines marca X cambiamos por sobretemperatura y en qué tramos?»*. Corre código de verdad sobre las series. 50 consultas/mes | `code_execution_20260521`, `consultar_timescale`, `leer_intervenciones_historicas` |

**El aviso a SAP no se emite solo. Nunca.** El agente lo redacta, el planificador lo aprueba con un toque.
Una IA creando avisos de avería automáticamente en el sistema de mantención de una minera es exactamente la
forma de que te saquen del contrato en una semana.

## Modelo de datos

`faena` · `correa` · `estacion` · `componente` · `lectura` (hypertable) · `deteccion` · `hallazgo` ·
`ventana` · `orden_trabajo` · **`intervencion`**

```sql
CREATE TABLE intervencion (          -- la tabla que vale por todas las otras
  id             uuid PRIMARY KEY,
  hallazgo_id    uuid REFERENCES hallazgo,
  ot_id          uuid REFERENCES orden_trabajo,
  ts             timestamptz NOT NULL,
  se_intervino   boolean NOT NULL,   -- ¿alguien abrió el equipo?
  hallazgo_real  boolean,            -- ¿estaba realmente malo?
  modo_falla     text,               -- qué era en verdad
  horas_reales   numeric,            -- vs. horas_est
  notas          text,
  quien          text                -- el mantenedor que lo confirmó
);
```

**Sin esta tabla:** no hay ground truth → no hay reentrenamiento → el modelo nunca mejora en *tu* faena;
no hay precisión medible → la curva P/R es humo; no hay ROI demostrable → en la renovación no tenemos nada.

**Y llenarla es un problema humano, no técnico.** El mantenedor que cambió el polín a las 4 AM no quiere abrir
una app. Por eso el cierre de la OT dispara **una sola pregunta** por WhatsApp: *«¿El polín estaba realmente
malo? SÍ / NO»*. Si esa tasa de respuesta baja del 60 %, el producto se degrada solo y nadie se entera.

Volumen de series: 12 estaciones × 8 canales × 1 Hz = 96 pts/s → 250 M puntos/mes/faena → ~500 MB/mes
comprimido por Timescale. **No es big data y no hay que fingir que lo es.**

## Costo mensual estimado — US$85 por faena

**Inferencia de Claude** (Tramo Faena, 12 estaciones):

| Agente | Modelo | Volumen | Tokens | US$/mes |
|---|---|---|---|---:|
| Triage | `haiku-4-5` ($1/$5 por MTok) | 900 llamadas | 2,16 M in / 0,32 M out | $3,74 |
| Consolidador | `sonnet-5` ($3/$15) | 60 turnos | 1,68 M in / 0,18 M out | $7,74 |
| Redactor de OT | `sonnet-5` ($3/$15) | 22 OT | 0,35 M in / 0,05 M out | $1,79 |
| Analista | `opus-4-8` ($5/$25) | 50 consultas | 1,70 M in / 0,13 M out | $11,75 |
| | | | **Subtotal IA** | **US$25,02** |

*No descuento el prompt caching y debería: el catálogo de equipos (~11.000 tok) es idéntico en cada llamada
y bajaría el subtotal a ~US$21. Dejo el número sin descontar **porque prefiero equivocarme hacia arriba en el
costo que hacia abajo en el margen.***

**Infraestructura** (prorrateada a 20 faenas): Postgres+TimescaleDB gestionado $31 · object storage $6 ·
API + workers + cola $17 · observabilidad $6 = **US$60**

```
TOTAL IA + CLOUD = US$85 /faena/mes  ($79.900 CLP)
```

**Contexto: el precio del Tramo Faena es US$4.149/mes. La IA y la nube son el 2,0 % del precio.**
El costo real no es el cómputo — es el ingeniero en Calama (US$563/mes/sitio) y el fierro (US$16.800/faena).
*Cualquiera que te venda una idea de «IA industrial» y te hable del costo de inferencia como si fuera el
problema, no ha estado en una faena.*

## La estación — US$1.400 de fierro

| Componente | US$ |
|---|---:|
| Módulo térmico radiométrico LWIR 640×512 · 30 Hz | **480** ← el caro |
| Cómputo · NVIDIA Jetson Orin Nano 8 GB | 280 |
| Cámara IP66 · global shutter 5 MP · lente 12 mm | 220 |
| Gabinete IP66 + purga de aire + calefactor + **ventana de germanio** | 210 ← **el crítico** |
| Alimentación PoE++ o solar + batería | 110 |
| Array de micrófonos MEMS + preamplificador | 60 |
| Cableado, montaje, misceláneos | 40 |
| **BOM** | **1.400** |
| Instalación (2 personas × 4 h, en ventana) | 600 |
| **Costo total por estación** | **2.000** *(precio: $2.250.000 = US$2.394)* |

**El problema de ingeniería que decide la empresa es el gabinete de US$210, no el sensor de US$480.**
El visor ve pasar 6.500 t/h de mineral triturado, con 30 °C de amplitud térmica diaria y lluvia ácida en
invierno. **Un lente sucio es un hallazgo perdido — y peor: un hallazgo perdido que el sistema no sabe que
perdió.** Por eso la estación calcula su propia `calidad_optica` con una carta de referencia y, si baja de
0,75, **degrada la confianza de sus detecciones y lo declara.** Es la diferencia entre un sistema honesto y
uno que inventa.

## Terceros — lo difícil no se contrata, se negocia con TI de la minera

| Qué | Para qué | Dificultad |
|---|---|---|
| **SAP PM** (de la minera) | Crear el aviso M2 con repuesto reservado. **Sin esto, esto es un tablero más** | **6–10 semanas** · proyecto de TI de la minera · **no depende de ti** |
| **AVEVA PI System** | Leer tonelaje, corriente de motor, velocidad. Y escribir de vuelta nuestros tags de salud | 2–4 semanas |
| **Anthropic API** | Los cuatro agentes | 1 día — lo más fácil del sistema |
| **Entel / Movistar M2M** | SIM LTE industrial (~US$25/SIM/mes) | 2 semanas |
| **WhatsApp Business API** | Avisar al supervisor y hacerle *la* pregunta. En Chile el correo no se lee | 1–2 semanas |
| **SEC** | Declaración TE-1 de la instalación eléctrica. La minera la pide antes de energizar | 3 semanas |
| **Comité paritario + Dirección del Trabajo** | Cámaras en el lugar de trabajo. La DT tiene doctrina sobre videovigilancia laboral | **antes de instalar** |

> **La V1 no tiene SAP, y hay que decirlo así en la venta.** La integración toma 6–10 semanas de un proyecto
> de TI que *no controlamos*. La V1 emite la OT como PDF, la manda por correo y WhatsApp, y el planificador la
> copia a SAP a mano. Es feo, es manual, y funciona. **La integración se pelea en el mes 6, con el cliente ya
> adentro y con el caso de negocio demostrado — no en la venta inicial, donde mata el deal.**

## Qué está falseado en el demo

**Falso:**
- **No hay estaciones.** Las imágenes térmicas están **sintetizadas en SVG** con una gaussiana sobre una grilla
  de 42×19. Un recorte real es radiométrico, 640×512, con temperatura absoluta por píxel.
- **No hay modelo.** Confianzas, bandas y vidas remanentes están escritas a mano en `demo/app.js`.
- **La curva precisión/recall es la META del hito M2, no una medición.** Hoy no existe el dataset con el que medirla.
- **No hay SAP.** El «aviso emitido» es texto generado en el navegador. `AV-4471029` es inventado.
- **No hay PI.** Las lecturas del PLC son series sintéticas deterministas.
- **Las faenas son ficticias.** Quebrada Amarga y Los Cóndores no existen.
- **El estado vive en memoria.** Recargas y vuelve a empezar.

**Real:**
- **El flujo completo:** detección → hallazgo con banda → vida remanente → probabilidad de falla antes de la
  ventana → orden de trabajo → capacidad de la ventana.
- **Toda la aritmética:** el margen de US$140.531/hora, el riesgo diferido (costo × probabilidad), la capacidad
  de la ventana, la conversión CLP/USD.
- **El modelo de probabilidad.** `P(falla antes de la ventana)` usa una log-normal ajustada a la banda P10–P90
  declarada, con la CDF de Abramowitz-Stegun. Está en `app.js:pFalla()` y lo puedes leer.
- **La incertidumbre.** El umbral de confianza mueve de verdad qué ves y te dice de verdad cuánto se te escapa.
  Descartar un falso positivo baja de verdad la precisión de 90 días.
- **Las comunas, las normas y los TAG:** Sierra Gorda, Diego de Almagro, Calama, DS 132, SERNAGEOMIN,
  `CV-3410`, `PL-3410-2180-C`.
- **La paleta**, validada para daltonismo y contraste contra el fondo oscuro. En una sala de control el color
  significa estado, no decoración.

## Las tres cosas que habría que hacer para que fuera real

1. **El dataset.** 200+ horas de polines reales, etiquetadas **contra intervención física** — alguien abrió el
   equipo y confirmó. **No se compra: se filma.** Es el hito M0 y no hay atajo. Nada más importa hasta que exista.
2. **La integración con SAP PM.** Sin el aviso automático con repuesto reservado, esto es un tablero más.
   OData vía el gateway de la minera: 6–10 semanas de un proyecto de TI que no controlamos, con un sponsor interno.
3. **La estación que aguanta el desierto.** IP66, purga de aire positiva, ventana de germanio, calefactor y
   autodiagnóstico óptico. **El problema no es la IA: es que el visor se ensucia.**

---

## Dominio

```
$ ./_kit/check-domain.sh cintavia rodalto kilocinta tramovia

cintavia               .com AVAILABLE   (http 404)   .cl AVAILABLE
rodalto                .com AVAILABLE   (http 404)   .cl AVAILABLE
kilocinta              .com AVAILABLE   (http 404)   .cl AVAILABLE
tramovia               .com AVAILABLE   (http 404)   .cl AVAILABLE

# rdap.verisign.com/com/v1/domain/cintavia.com -> HTTP 404 = disponible
# verificado 2026-07-13
```

**Cintavia** = *cinta* (la correa) + *vía* (el recorrido). La correa como una ruta que se recorre kilómetro a
kilómetro, que es literalmente lo que hace el producto. Se pronuncia igual en Chile, en Perú y en Brasil.
