# Conserjo

**conserjo.com** — verificado libre el 2026-07-12 (`rdap.verisign.com/com/v1/domain/conserjo.com` → **HTTP 404**). `conserjo.cl` también libre.
Alternativas verificadas: `arrindo.com`, `llavion.com`, `conserja.com` (las tres, HTTP 404).

> El conserje de tu cartera: filtra al que entra, cobra el arriendo, y diagnostica la filtración por foto.

**Dirección de arte:** el libro de administración del conserje — papel cálido con grano, tinta ferroviaria, columnas regladas, números en monoespaciada, y un solo acento (rojo teja: el color de la cerámica del techo, y también el de "esto se está filtrando").

---

## El negocio

### Quién sufre esto

Dos personas, y no son la misma.

**El ICP primario es la corredora chica**: 20 a 80 unidades ajenas bajo administración, dos o tres personas, cobra entre 5% y 10% del arriendo. Vive de administrar y por eso el dolor es su costo de operación directo. Vender una corredora es vender 40 unidades de golpe.

**El ICP secundario es el inversionista hormiga**: compró 2 a 15 departamentos para arrendar, tiene otra pega, y administra con Excel, WhatsApp y una libreta. Es más fácil de encontrar y mucho más difícil de retener — cuando vende el departamento, churnea.

Deliberadamente **no** es el cliente Assetplan ni el multifamily: esos tienen equipo propio y software a medida, y competir ahí es competir contra un departamento de TI.

### Qué cuesta hoy

Para un dueño de 6 departamentos, sin producto:

| Ítem | Cálculo | Al año |
|---|---|---|
| Horas persiguiendo el arriendo y conciliando transferencias | 9 h/mes × $15.000/h de su tiempo | **$1.620.000** |
| Vacancia extra por filtrar mal o filtrar lento | ~0,7 meses/año × $580.000 promedio × 2 unidades | **$840.000** |
| Reparaciones que se agrandaron por diagnosticar tarde | el caso típico: una filtración de $150.000 que en 3 semanas es $600.000 | **$1.150.000** |
| | | **$3.610.000** |

Cobramos **$425.000 al año** por 6 unidades. La aritmética no requiere fe.

### Qué hacen hoy en vez de esto

El competidor real no es Houm ni Kastor. Es **Excel + WhatsApp + la libreta**, y es gratis, ya está instalado, y nadie tiene que aprenderlo. Cualquier pitch que no gane contra eso, no gana.

De los reales: Houm es un servicio administrado (nos compite por el dueño, pero no puede vender software a corredoras chicas sin canibalizarse a sí mismo — y ahí está nuestro foso); Portal Inmobiliario/Yapo/Toctoc son canal, no competencia; Buildium/AppFolio/TenantCloud no entienden UF, ni DICOM, ni la Ley 18.101, ni que en Chile se paga por transferencia.

### La cuña

No se entra vendiendo "software de administración de arriendos" — eso es una categoría que el cliente no sabe que existe y un gasto que no tiene presupuestado. Se entra vendiendo **el informe de arrendatario a $6.900 por postulante**: un gasto que *ya está haciendo* (el informe DICOM), con un producto mejor, y que deja una unidad cargada en el sistema como efecto secundario.

### Precio

| Plan | Precio | Para quién |
|---|---|---|
| Suelto | **$7.900** / unidad · mes | 1 a 5 unidades |
| Cartera | **$5.900** / unidad · mes | 6 a 15 unidades |
| Corredora | **$3.900** / unidad · mes | 16+ · mínimo $69.000/mes |
| Informe de arrendatario | **$6.900** / postulante | La cuña. Sin suscripción. |

### Unit economics (cuenta media: 7 unidades, plan Cartera)

```
Ingreso por cuenta                    $41.300 /mes
COGS                                 −$ 4.360 /mes
                                    ──────────
Margen bruto                          $36.940  =  89,4%

CAC                                   $95.000
LTV (33 meses a 3% de churn)         $999.000
LTV / CAC                                10,5×
Payback                              3,1 meses
```

### El TAM es chico, y lo decimos

Chile completo son **~USD 42,5 millones al año** de mercado direccionable. No es un error de tipeo y no lo vamos a inflar. El supuesto frágil (35% del stock arrendado es administrado por alguien que podría pagarnos) está marcado como **supuesto sin cita** en `negocio.html`.

La consecuencia es la tesis, no un bonus: **la expansión a LatAm y España no es opcional**, y eso es exactamente lo que hace que este negocio sea, o bien un SaaS de USD 1M ARR con ronda, o bien un negocio rentable de cuatro personas. Las dos son salidas legítimas. Fingir que Chile solo da para un unicornio, no.

---

## El roadmap

Seis hitos, cada uno con su **criterio de muerte** — la observación que debería hacernos parar.

| # | Mes | Hito | Caja acum. | Criterio de muerte |
|---|---|---|---|---|
| H1 | 2 | **Design partners** — 3 carteras reales conectadas, sin cobrar | $2,6M | Después de 15 conversaciones nadie te presta su cartera → el dolor no es real |
| H2 | 3 | **Primer cliente pagando** a precio de lista, sin descuento de fundador | $3,9M | Cero pagando al mes 4, con mucho "me encanta, avísame" → no duele lo suficiente |
| H3 | 9 | **Los primeros 10** — 10 cuentas, ≥120 unidades, **≥3 corredoras** | $14,0M | Ninguna corredora compra tras 40 reuniones → el ICP primario no existe |
| H4 | 15 | **Venta repetible** — CAC estable, payback < 5 meses, un canal que rinde solo | $45,0M | CAC > 6 meses de margen **y** churn > 5% → no es un SaaS, es una administradora |
| H5 | 20 | **Escala de canal** — el SEO trae más leads que el outbound | $45M + ronda | El SEO no despega (< 1.500 visitas orgánicas/mes) → el CAC no baja nunca |
| H6 | 24 | **Punto de decisión** — levantar, bootstrapear, o matar | — | MRR < $8M al mes 24 → matar y escribir el post-mortem |

### Los números

| Escenario | Cuentas M24 | MRR M24 | Supuestos que cambian |
|---|---|---|---|
| Pesimista | 44 | $1.244.116 | 80 leads/mes, cierre 6%, ticket $28k, churn 5% |
| **Base** | **212** | **$10.180.731** (≈ USD 129k ARR) | 170 leads/mes, cierre 12%, ticket $48k, churn 3% |
| Optimista | 522 | $33.935.116 (≈ USD 429k ARR) | 260 leads/mes, cierre 18%, ticket $65k, churn 2% |

El ticket es lo que más mueve la aguja, y el ticket depende de una sola cosa: **cuántas corredoras entran en la mezcla**.

### La caja, sin adornos

Capital inicial **$45M** (ahorros $20M + CORFO Semilla $25M).

- **Contratando según el plan** (6 personas al mes 20): la caja **cruza cero en el mes 20**. El valle es el mes 19 con $596.413 en el banco. Hay que levantar sí o sí, y la decisión se toma en el mes 15 — no cuando se acabe la plata.
- **Ruta bootstrap** (quema tapada en $4,4M, tres personas, sin vendedor): la caja toca piso en **$23.241.981 el mes 15** y desde ahí sube. **Break-even en el mes 16.**

Las dos son decisiones legítimas. La que no es legítima es no elegir.

### Probabilidad de éxito

**No inventamos una tasa base que no tenemos.** La clase de referencia que sí conocemos (supervivencia de empresas nuevas en Chile, ~50% a 4 años según los datos que el Ministerio de Economía publica del SII) mide *seguir existiendo*, que no es la pregunta. Para "SaaS B2B vertical que llega a USD 1M de ARR" no tenemos una tasa base chilena citable, así que usamos **5%–10% declarado como supuesto, no como cita**.

```
Ajustes:
  cuña con presupuesto que ya existe          ×1,4
  canal concentrado y alcanzable              ×1,3
  TAM chileno de USD 42M (obliga LatAm)       ×0,6
  proveedor único (Equifax)                   ×0,8
  churn estructural del ICP secundario        ×0,85
                                          ────────
  multiplicador neto                          0,74

  No condicional:  (5%–10%) × 0,74  =  4% – 7%
  Condicional a pasar H3 y H4 (× ~3,5, y ese
  multiplicador es estimación nuestra, no medición):
```

- **15% – 25%** de llegar a **USD 1M ARR** en 4 años, condicional a los hitos H3 (mes 9) y H4 (mes 15).
- **30% – 40%** de que esto sea un **negocio autosostenible** de 4 a 6 personas (MRR ≥ $10M CLP, rentable). Con un TAM de USD 42M, **este es el desenlace bueno más probable — y no es un fracaso**.

---

## El stack

Sin build, sin framework, sin CDN. Postgres + un backend chico + cuatro agentes.

### Los cuatro agentes

| Agente | Modelo | Qué hace | Por qué ese modelo |
|---|---|---|---|
| **El Maestro** | `claude-sonnet-5` | Foto → diagnóstico, urgencia, rango de costo, gremio, maestro propuesto | Vision + juicio. La diferencia entre condensación y filtración de matriz está en la textura del muro; Haiku la falla. Thinking adaptativo + structured output. |
| **El Portero** | `claude-sonnet-5` | Liquidaciones + DICOM + AFP → score, veredicto, banderas | Lee PDFs y fotos torcidas de liquidaciones. El prompt lleva escrito que desalojar toma 8-18 meses y que **la asimetría entre falso positivo y falso negativo es de 10 a 1**. |
| **El Cajero** | `claude-haiku-4-5` | Cartola bancaria → concilia qué abono es de quién | Emparejamiento estructurado, 30 corridas/mes por cuenta. Es el de mayor volumen. Lo que marca con confianza < 0,5 escala a Sonnet (< 5% de los casos). |
| **El Cobrador** | `claude-haiku-4-5` | Redacta el mensaje de cobranza, escalando el tono por días de atraso e historial | Redacción corta. **Nunca envía solo: el dueño aprueba cada mensaje.** Máximo 1 cada 72 horas — límite duro, no configurable hacia abajo. |

Regla que cruza los cuatro prompts: **si el modelo no sabe, lo dice.** Un diagnóstico inventado con confianza alta manda al gremio equivocado; un pago mal conciliado marca de moroso a alguien que pagó y destruye la relación en un mensaje.

### La tabla que es el foso

`orden_trabajo.hallazgo_real_texto` — cuando el maestro cierra la orden de trabajo, escribe qué era realmente y cuánto costó. Eso convierte cada reparación en una etiqueta supervisada (*foto + texto → lo que era + lo que costó*). A los dos años es el único dataset chileno de daños de arriendo con costo real confirmado. **El foso es el dataset, no el prompt.**

### Lo que hay que ir a firmar

| Proveedor | Para qué | Espera |
|---|---|---|
| **Equifax Chile (DICOM)** | El informe comercial del postulante. Contrato B2B, hay que justificar la finalidad (Ley 19.628). | 4–8 semanas |
| **Meta / WhatsApp Business API** | El canal. Vía BSP, con cada plantilla aprobada una por una. | 2–4 semanas |
| **Fintoc** | Leer la cartola del banco del dueño. Sin esto, la conciliación es a mano. | 1 semana |
| Firma electrónica avanzada | Contrato con mérito ejecutivo. | 2 semanas |
| SII (boleta/factura) | Emitir nuestro propio documento tributario. | 1–2 semanas |
| Anthropic | Los cuatro agentes. | 10 minutos |

**Equifax es un punto único de falla** y está declarado como tal (es el factor ×0,8 en el cálculo de probabilidad). Mitigación: Sinacofi como segunda fuente desde el mes 6, y un score en que DICOM sea *una* señal de cuatro y no *la* señal.

### Costo por cuenta (7 unidades, $41.300/mes de ingreso)

```
Inferencia Claude (los 4 agentes)     $   340    8%
WhatsApp API                          $ 1.400   32%
Fintoc                                $   900   21%
Consultas Equifax                     $   520   12%
Infra (Fly + Neon + S3)               $   700   16%
Firma electrónica                     $   500   11%
                                     ────────
COGS                                  $ 4.360   → margen bruto 89,4%
```

**La IA no es el costo.** Los cuatro agentes son el 8% del COGS; WhatsApp cuesta cuatro veces más que Claude. Optimizar el prompt para ahorrar tokens es la actividad de mejor apariencia y peor retorno disponible.

### Qué está fingido en el demo

Todo el backend. El demo es HTML + JS en tu navegador: cero servidor, cero base de datos, cero llamadas a un modelo. Los diagnósticos, los informes DICOM, los movimientos bancarios y los maestros están escritos a mano.

Lo que el demo **no** exagera: la latencia (Sonnet 5 con una imagen responde más rápido que los 2,4 s que finge la animación), la calidad del razonamiento, y el precio. Lo que el demo **sí** esconde: los rangos de costo de reparación no vienen de ninguna base de datos —**es el problema del arranque en frío, y es el punto más débil del producto en el día 1**— y que hay que pedirle a un señor de 58 años que conecte su banco a una startup de la que supo hace 20 minutos.

---

## Los archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Landing. Incluye un widget de triage en vivo: elegí una foto, apretá Diagnosticar. |
| `demo/index.html` | **El producto funcionando.** 4 pestañas, estado real, todo responde. Vista dueño y vista arrendatario. |
| `negocio.html` | ICP, TAM/SAM/SOM con la aritmética a la vista, competencia con nombre y apellido, unit economics, canales ordenados (y los descartados, con razón). |
| `roadmap.html` | 6 hitos con criterio de muerte, 4 gráficos SVG escritos a mano, probabilidad como rango con derivación. |
| `stack.html` | Modelo de datos, los 4 agentes con su prompt real, las APIs a contratar, el costo con aritmética, y qué está fingido. |
| `assets/marca.css` | El sistema de diseño completo. La declaración de dirección de arte está en el comentario de cabecera. |
| `assets/nav.js` | El menú móvil. Diez líneas. |
