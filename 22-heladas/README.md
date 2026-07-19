# Rondalba (22-heladas)

Vigilia de heladas por cuartel para fruta de exportación. Sensores LoRa en el huerto, pronóstico de inversión térmica, y cuando el umbral se cruza, una llamada de voz a las 3 AM que escala por un árbol de contactos hasta que un humano conteste y confirme qué encendió. Cada evento queda en una bitácora por cuartel (predicho, medido, actuado, salvado) que sirve para el seguro y para decidir la próxima torre o el replante.

- **Marca:** Rondalba (la ronda que dura hasta el alba). Dominio rondalba.com verificado disponible el 2026-07-18 (RDAP Verisign HTTP 404); rondalba.cl disponible (NIC Chile). Alternativas verificadas: escarchia.com, brumatia.com, heladia.com.
- **Estado:** prototipo. El demo recorre una noche completa de helada con llamadas, escalamiento y bitácora, todo en el cliente.

## El problema

Una noche despejada y sin viento de septiembre u octubre puede borrar la temporada de un cerezal: media hora a -2,2 °C en plena flor mata cerca del 10% de la flor; a -3,9 °C, cerca del 90% (tablas WSU). El control existe (torres, aspersión, calefactores) pero solo sirve si se enciende dentro de una ventana angosta de madrugada. El sistema de alerta real de la mayoría de los campos es un despertador a las 02:00 y un termómetro, o un pronóstico por comuna que no dice nada del cuartel bajo junto al estero. La helada del 17-09-2013 dejó pérdidas estimadas públicamente en torno a US$1.000 millones.

## Por qué no lo resuelve ChatGPT (el test del LLM)

1. **Vigilancia continua:** ChatGPT no está despierto a las 3 AM mirando el cuartel de nadie; no tiene el sensor.
2. **Actuación sobre el mundo:** no llama por teléfono, no insiste, no escala, no hace sonar una sirena.
3. **El libro:** la historia de frío de un cuartel específico no existe en ningún corpus; se construye estando ahí, y con dos temporadas vale para el seguro, el replante y la calibración local.

El LLM es ingrediente (redacción de partes, guiones de voz e informes con Haiku 4.5 y Sonnet 5), no el producto. La llamada nunca depende de un LLM: umbral cruzado = llamada con plantilla dura.

## Negocio (resumen)

- **ICP:** productor mediano de fruta (10-200 ha) en O'Higgins, Maule y Ñuble; firma el dueño o el administrador. Cuña: cereceros de 20-80 ha entre San Fernando y Longaví que ya tienen torres o aspersión.
- **Precio:** por temporada (ago-nov). Ronda $28.000/ha (mín. $290.000/campo); Ronda Completa $42.000/ha (mín. $450.000) con bulbo húmedo, verificación de encendido e informe para seguro. Hardware en comodato.
- **Mercado:** TAM Chile ≈ $7.350M CLP/año (245.000 ha sensibles × $30.000; superficie frutícola ~490 mil ha según Catastro CIREN-ODEPA). SAM (O'Higgins-Maule-Ñuble, 10-200 ha) ≈ $2.100M/año. SOM 24 meses: $75M/temporada (75 campos). Negocio de nicho en Chile; el techo se multiplica en Argentina y Perú.
- **Economía unitaria (campo tipo 40 ha):** ingreso $1.120.000/temporada; costos directos $496.000 (hardware amortizado $219.000, instalación/mantención $150.000, 4G $72.000, telefonía $35.000, IA $5.000, infra $15.000) → margen bruto 56%. CAC ≈ $350.000; LTV ≈ $2,2M (3,5 temporadas); LTV/CAC ≈ 6; payback en la primera temporada por prepago.
- **Canales (rankeados):** asesores agrícolas con comisión, referidos hiperlocales ("venga a ver la bitácora"), gremios y ferias (Cherry Tech, Expo Chile Agrícola, Comité de Cerezas, Fedefruta), distribuidores de torres y riego, outbound WhatsApp/LinkedIn, SEO técnico long-tail, ads estacionales.
- **Qué lo mata:** una primavera sin heladas (nadie renueva lo que no sonó), una helada con daño sin alerta, perder la ventana de venta de invierno, el hardware en terreno, o que Wiseconn/Instacrops copien la llamada.

## Roadmap (resumen)

Anclado al año agrícola, del 20-07-2026 al invierno de 2028:

| Hito | Fecha | Criterio de muerte |
|---|---|---|
| H1 5 pilotos gratis instalados | sep 2026 | <3 pilotos tras 30 visitas |
| H2 temporada 2026 validada | dic 2026 | detección <80%, o >2 falsas alarmas/noche, o nadie contesta |
| H3 30 campos prepagados | ago 2027 | <10 pagando con pilotos exitosos de referencia |
| H4 temporada 2027 operada | dic 2027 | intención de renovación <60% tras temporada CON heladas |
| H5 canal repetible, 75 campos | jun 2028 | canal <30% y CAC directo >$600.000 |
| H6 decisión | jul 2028 | levantar (expandir), bootstrapear o matar |

- **Escenarios de ingreso contratado acumulado a 24 meses:** pesimista $32M / base $105M / optimista $209M (supuestos: cierre 15/25/35%, renovación 70/85/92%, ticket $0,9/$1,0/$1,1M).
- **Caja:** capital inicial $40M; valle de $3M en octubre de 2027. El prepago de invierno es condición de sobrevivencia.
- **Probabilidad de éxito:** sin tasa base publicada para la clase exacta (se declara). Anclas: ~50% de sobrevivencia a 3 años de empresas chilenas (Min. Economía, gruesa, sesgada al alza) y ~1/3 seed→Serie A (sesgada a la baja). Base 20-30%, castigo neto por estacionalidad y riesgo meteorológico: **~18-28% de llegar a H5 al mes 24; sube a ~35-45% condicional a pasar H2 (detección ≥90%) y H3 (≥10 campos pagados)**.

## Stack (resumen)

- **Hardware (comodato):** nodo ESP32 + SHT31 + LoRa SX1276 + solar, $58.000 BOM; gateway RAK7268 con 4G y sirena de respaldo, $180.000. 1 nodo cada 4 ha, mínimo 1 por cuartel.
- **Predicción:** modelo físico/estadístico de enfriamiento radiativo + regresión por cuartel (no es un LLM; sin GPU). Entradas: sensores propios, Agromet INIA, DMC.
- **Agentes IA:** parte de las 20:00 y guiones de llamada con `claude-haiku-4-5-20251001`; informes post evento y onboarding de campos con `claude-sonnet-5`. Costo ≈ US$3,3 por campo-temporada.
- **Terceros:** Twilio Voice/SMS (TTS es-CL + DTMF), WhatsApp Business API, ChirpStack self-hosted, SIM IoT.
- **Costos:** infra fija ≈ $25.000/mes; con 40 campos, software+telefonía+IA ≈ $1,27M por temporada = 2,8% de la venta. El costo que manda es hardware + visitas.
- **Falseado en el demo:** todo corre en el navegador; la noche es una función de enfriamiento con ruido determinista; las llamadas son simuladas; la bitácora 2025 es inventada con rangos plausibles; los umbrales de daño sí son los publicados (WSU).

## Archivos

- `index.html`: landing (parte de madrugada, comparación honesta, precios, FAQ)
- `demo/index.html`: la vigilia de Fundo Santa Amalia: noche simulada jugable, llamadas con escalamiento, bitácora e informe para el seguro
- `negocio.html`, `roadmap.html`, `stack.html`: los documentos
- `estilo.css`, `sitio.js`, `meta.json`
