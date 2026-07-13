# Zurcia

**Un agente que vive en el WhatsApp de tu local: agenda, confirma y —cuando una hora se cae— la vuelve a vender antes de que te des cuenta.**

`zurcia.com` · libre (RDAP Verisign, HTTP 404, verificado 2026-07-12) · `.cl` también libre

---

## El problema

Una peluquería de tres sillas en Ñuñoa factura $8,8M al mes y pierde **$1.785.000 mensuales** en horas que se caen: no-shows (14%) y cancelaciones tardías que nadie alcanza a rellenar. Son **$21.420.000 al año** — una hora perdida no se recupera jamás, y casi siempre había alguien en la lista de espera que quería justo esa hora.

Todo el rubro agenda por WhatsApp, a mano, con una persona secándose las manos para contestar el teléfono.

## La cuña

No vendemos un calendario: el calendario ya lo tienen y no les sirve de nada, porque igual hay que llenarlo a mano. Nos metemos **en el WhatsApp**, que es donde ya está pasando la conversación, y cuando una hora se cae **la volvemos a vender**.

Un hueco rescatado se mide en pesos, el mismo día, en el panel. Un calendario no tiene ROI.

## Qué hay acá

| Archivo | Qué es |
|---|---|
| `index.html` | La portada. Incluye un widget en vivo con dos escenas: una clienta pidiendo hora un martes a las 23:11, y un hueco de las 16:00 rescatado en 4 minutos. |
| `demo/index.html` | **El producto funcionando.** Simulador de WhatsApp donde *tú* escribes como la clienta, agenda de la semana, motor de rescate, lista de espera, y una calculadora del costo de Meta que se recalcula con cada ajuste. Reloj simulado: puedes correr el día entero y ver qué pasa con un no-show. |
| `negocio.html` | ICP, TAM/SAM/SOM con la aritmética visible, competidores con nombre, precio, economía unitaria neta de Meta y de la IA, canales, IA en marketing, primeros 90 días, qué nos mataría. |
| `roadmap.html` | Seis hitos, cada uno con su criterio de muerte. Cuatro gráficos SVG escritos a mano. Probabilidad de éxito como rango con derivación. |
| `stack.html` | Modelo de datos, los tres agentes, terceros, variables de entorno, el costo de Meta y de Anthropic con la resta completa, y qué está falseado en el demo. |
| `meta.json` | Los números, en máquina. |

## Dirección de arte

**Libro de citas.** Papel crema con pauta, tinta negra, timbre verde botella. Es el cuaderno de agenda que el producto reemplaza, dibujado en pantalla. Nada de dashboards oscuros, nada de degradados: este producto vive en la trastienda de una peluquería, no en una conferencia de SaaS.

- Titulares en **Petrona** (serif con carácter, un poco áspera).
- Texto en **IBM Plex Sans**.
- Todo número, precio, hora y RUT en **IBM Plex Mono** — porque son datos, no prosa.
- Un solo acento: el verde sello (`#14624A`). El rojo ladrillo (`#A83A22`) está reservado **exclusivamente** para el estado "no llegó". Cuando ves rojo en esta página, es plata que se perdió.

## Precio

| Plan | Mensual | Para |
|---|---|---|
| Silla | $34.000 | 1 profesional |
| **Local** | **$79.000** | 2 a 6 profesionales — el 70% del mix |
| Cadena | $210.000 | 3 a 10 sucursales |

Excedente: $19 por mensaje sobre el cupo (Meta nos cobra $17,30 — no ganamos plata vendiendo mensajes, sólo nos cubrimos).
Precio fundador: $49.000 de por vida para los primeros 30 locales.

**Devolvemos ~$905.000 al mes a un local de 3 sillas. Cobramos $79.000. Retorno: 11,5×.**

## La economía, sin maquillaje

Un SaaS de verdad tiene 80% de margen bruto. Nosotros tenemos **65%**, y la razón está en la primera línea del costo: **Meta cobra peaje por cada conversación que inicia el negocio.**

```
INGRESO plan Local                       $79.000
  Meta (365 mensajes iniciados/mes)       $7.297
  IA (Haiku 4.5 96% + Sonnet 5 4%)        $7.958
  Infra                                   $2.700
  Soporte humano real                     $9.500
                                         ───────
  COSTO                                  $27.455
  MARGEN BRUTO                 $51.545 =   65,2%
```

Sin el soporte humano el margen es 77%. Ésa es la meta, no el dato.

## Cómo correrlo

Es HTML estático. No hay build, no hay npm, no hay dependencias.

```bash
cd 03-agenda && python3 -m http.server 8000
# abre http://localhost:8000
```

## Lo que está falseado

Todo el demo. No hay WhatsApp real ni un modelo de lenguaje detrás: el agente es un clasificador de ~40 reglas en JavaScript. El reloj es simulado. El estado vive en una variable y se pierde al recargar. La lista completa —y qué haría falta para que fuera real— está en `stack.html#falso`.

Lo que **no** está falseado: los precios de Meta, los precios de Anthropic, la aritmética del costo, y la advertencia de que la verificación de Meta Business demora entre 3 días y 3 semanas y es el escalón donde se nos cae el 40% de las pruebas.
