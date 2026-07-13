# Mermata

**Compra lo que vas a vender.**
`mermata.com` — libre (RDAP Verisign → HTTP 404, 13 jul 2026)

Pronóstico de demanda y órdenes de compra automáticas para restaurantes, cafeterías,
panaderías y minimarkets de Chile. Leemos el histórico de ventas que ya existe en el SII
y en el POS, pronosticamos cuánto se va a vender cada día —considerando el día de pago,
los feriados y el clima— y armamos la orden de compra lista para mandarle al proveedor
por WhatsApp. Y le ponemos un número en pesos a la merma, que es la plata que hoy nadie
mide y todos botan.

---

## El negocio

### El problema, en una frase

El dueño de una panadería pide a ojo. Un martes en la mañana, de memoria, por WhatsApp.
Dos cosas pasan al mismo tiempo, y ninguna aparece en la contabilidad:

- **Merma** — compró de más y lo botó. Nadie la pesa, nadie la anota. Sale de la caja y
  entra al basurero, escondida dentro de "costo de ventas".
- **Quiebre de stock** — compró de menos y no vendió. Es peor, porque no deja rastro: no
  existe una boleta que diga "hoy no vendí 40 empanadas porque se me acabó la carne".

En un rubro con márgenes netos de un dígito, esas dos pérdidas juntas no son un costo:
**son la utilidad del año.**

### Cuánto cuesta — un local tipo (La Espiga, el del demo)

```
Venta anual                    $535.200.000   ($44,6M/mes)
Costo de insumos    × 26,6%  = $142.500.000
Merma               ×  6,4%  =   $9.120.000   ← estimación declarada (rango food service: 4–10%)
Quiebre (2% venta × 66% mg)  =   $7.060.000   ← estimación, la más débil: nadie mide la venta que no ocurrió
                               ────────────
Se le va al año                 $16.180.000
Utilidad neta (6% de la venta)  $32.100.000
                               ────────────
La pérdida es el 50% de la utilidad del año.
```

### Cliente ideal

Panadería-cafetería de barrio, 1 a 3 locales, Santiago. Vende $25–60M al mes. Gasta
28–34% en insumos. El dueño hace la compra él mismo y es la misma persona que decide
comprar software. Tiene POS porque el SII lo obligó, no porque quisiera. Nunca ha medido
su merma.

**Umbral de dolor: gasto en insumos sobre $4.000.000 al mes.** Bajo eso el número no da y
no le vendemos nada.

**Quién NO es el cliente:** el local cuya boleta electrónica no trae detalle por producto
(no hay señal que pronosticar), la cadena de más de 15 locales (ya tiene ERP), y el dark
kitchen que solo vende por Rappi (su demanda la controla otro algoritmo).

### Mercado (Chile, con la aritmética a la vista)

| | Locales | Valor anual | Filtro |
|---|---:|---:|---|
| **TAM** | 81.000 | $82.620M | Restaurantes 42k + panaderías 11k + minimarkets 28k |
| Con detalle por producto | 44.550 | $45.441M | × 55% — *supuesto nuestro, el filtro duro* |
| **SAM** | 17.820 | $18.176M | × 40% — gasto en insumos ≥ $4M/mes |
| **SOM mes 24** (caso base) | 359 | $366M | 2,0% del SAM |
| SOM año 5 (ambición) | 1.500 | $1.530M | 8,4% del SAM |

Los dos porcentajes de filtro son **supuestos**, y son los que más urge validar. Se validan
gratis, conectando 30 locales al SII en los primeros 60 días. Si el detalle por producto
resulta ser 25% y no 55%, el SAM se parte a la mitad y hay que replantear el producto.

**Extensión global:** todo se apoya en que el Estado obligue a declarar ventas y compras
línea por línea, en formato estructurado. Chile lo hace desde 2014 (DTE del SII), pero
también México (CFDI), Perú (SUNAT), Colombia (DIAN), Brasil (NF-e) y Argentina (AFIP).
El motor no cambia; cambia el conector y el calendario de feriados. **Chile no es el
mercado: Chile es el laboratorio donde el producto se prueba barato y en español.**

### Posición

> **Tu POS te dice cuánto *tienes*. Mermata te dice cuánto vas a *necesitar*.**

Toda la categoría de inventario para restaurantes está construida sobre el pasado. Mermata
es la única pieza que mira hacia adelante, y la única que le pone un precio en pesos a lo
que se botó. No competimos con el POS: nos sentamos encima, y el POS es además nuestro
mejor canal de venta.

**Cuña:** panaderías y cafeterías de barrio en Santiago. La merma es visible (el pan que
sobra), la receta es simple y estable (5 insumos explican el 80% del costo), la demanda es
fuertemente predecible, y el gremio panadero es una red densa donde un caso de éxito en
Ñuñoa se sabe en Maipú.

### Competencia

El competidor no es otro software: es **un cuaderno y la memoria de una persona que lleva
doce años haciendo esto**. Es gratis, funciona razonablemente bien, y no requiere aprender
nada.

| Competidor | Precio | Dónde lo ganamos |
|---|---|---|
| **El cuaderno y la memoria** (~85% del rubro) | $0 | No sabe cuánto botaste. Nunca te lo va a decir. |
| Excel | $0 | Requiere que alguien digite. Nadie digita. Muere en 3 meses. |
| Bsale · Toteat · Fudo · Relbase | $25–90k/mes | Cuentan el pasado. Ninguno pronostica. **Y los queremos de socios.** |
| Defontana · Nubox · Softland | $60–300k/mes | Son para el contador, no para el dueño a las 6 AM. |
| MarketMan · Crunchtime · Apicbase | US$250–500/mes | No hablan con el SII, no mandan WhatsApp, no saben qué es el día de pago chileno. |
| El contador | $120–250k/mes | Contesta 40 días tarde y hacia atrás. **Pero es nuestro mejor canal.** |

**El riesgo competitivo real:** que Toteat o Bsale agreguen pronóstico gratis en el plan que
el cliente ya paga. Técnicamente pueden. La respuesta no es defenderse: es llegar antes y
venderles el motor.

### Precio y unit economics

| Plan | Precio | Para quién |
|---|---|---|
| Barrio | **$49.000** + IVA/mes | Almacén, panadería chica. ≤120 SKU. |
| **Local** | **$99.000** + IVA/mes | Restaurante, cafetería, panadería. El ancla. |
| Cadena | **$79.000** + IVA/mes **por local** | 3 locales o más. |
| Puesta en marcha | $190.000, una vez | Mapeo de recetas y proveedores. Al costo. |
| Diagnóstico de merma | **Gratis**, 14 días | Te decimos cuánto botaste el año pasado. |

**Por qué $99.000:** merma evitada en un local tipo ≈ $392.000/mes. El cliente paga a lo más
~25% de lo que rescata → $98.000. Piso: el POS que ya paga cuesta $30–60k; no podemos costar
menos sin parecer un juguete, ni más de 2× sin gatillar un comité.

```
ARPU mezclado                            $85.000
  (0,25×49.000 + 0,55×99.000 + 0,20×79.000 = $82.550, + upsells)

COGS por cuenta / mes:
  Inferencia Claude                       $2.100   ← ver stack.html, aritmética token a token
  Infraestructura                         $1.300
  WhatsApp BSP (~60 conversaciones)         $700
  ─────────────────────────────────────────────
  Subtotal técnico                        $4.100
  Soporte prorrateado (1 CSM / 120 ctas)  $8.500
  ─────────────────────────────────────────────
  COGS total                             $12.600

Margen bruto = (85.000 − 12.600) / 85.000 = 85,2%
Churn 4,0%/mes → vida 25 meses → LTV = $72.400 × 25 = $1.810.000
CAC mezclado                            $420.000
LTV / CAC = 4,3×      Payback = 5,8 meses
```

**El supuesto más frágil es el churn.** El rubro gastronómico tiene mortalidad de empresas
altísima: parte del churn no será insatisfacción, será que el local cerró. Si el churn real
es 7%, el LTV cae a $1.014.000 y el LTV/CAC a **2,4×** — la frontera de lo financiable. Es
el número que hay que vigilar desde el mes 1.

### Canales, en orden de CAC

1. **El POS como canal** — $120.000. Bsale/Toteat/Fudo ofrecen Mermata como módulo, rev
   share 20%. El mayor apalancamiento y el mayor riesgo de ejecución.
2. **Contadores** — $210.000. Ya tienen la relación y ya ven el DTE. Comisión 15% el primer año.
3. **Gremios** (Fechipan, Indupan, Achiga) — $260.000. El "Informe de merma del gremio".
4. **Terreno, barrio por barrio** — $480.000. No escala, pero valida. Es el canal del año 1.
5. **El "Índice Mermata"** — $300.000. Informe trimestral público de precios reales de 40
   insumos, sacado de facturas anonimizadas. Dato que nadie más tiene.
6. **Mayoristas** (Alvi, Central Mayorista) — $340.000, con conflicto de interés incorporado:
   su interés es que compres *más*, no que compres *bien*.
7. **Ads digitales** — $900.000+. En la lista para poder descartarlo con datos.

CAC mezclado: (0,35×120k)+(0,20×210k)+(0,10×260k)+(0,25×480k)+(0,10×300k) = $260.000,
× 1,6 de sobrecarga de ventas = **$420.000**. El año 1 va a ser ~$600.000, porque el canal
POS todavía no existe.

### IA en marketing: dónde sí y dónde no

**Sí:**
- **El diagnóstico gratis *es* el material de venta, y lo produce la IA.** 12 meses de DTE →
  informe con *su* merma en *sus* pesos, por ~$2.500 de inferencia. Eso antes requería un
  consultor de $800.000. **Ese arbitraje es todo el modelo de adquisición.**
- Calificación de prospectos desde datos públicos (rubro, comuna, tamaño).
- El "Índice Mermata": convertir cientos de miles de líneas de factura en un informe que
  **nadie más puede escribir**, porque nadie más tiene el dato.

**No:**
- Contenido genérico en redes. Nuestro cliente no lo lee, y nos posiciona como los otros.
- Correos fríos. El dueño no tiene bandeja de entrada corporativa. El canal está muerto.
- Chatbot de ventas. Con 5–15 conversaciones a la semana, un humano contesta mejor y cada
  conversación es investigación de producto.
- **WhatsApp de venta generado por IA.** WhatsApp es el canal íntimo del cliente. Un mensaje
  comercial de máquina ahí adentro quema la confianza que el producto entero necesita.

**La regla:** la IA sirve para **producir el dato que nadie más tiene**. No para producir
palabras que cualquiera podría escribir.

### Primeros 90 días

Nada de esto es "construir el producto". Los primeros 90 días son para averiguar si el
producto merece existir.

- **Días 1–30 · Escuchar y medir.** 20 locales entrevistados en terreno, sin mostrar producto.
  6 conexiones al SII. Solo se construye el lector de DTE y el normalizador. Meta: responder
  con dureza la pregunta del detalle por producto.
- **Días 31–60 · Vender el diagnóstico.** 6 informes de merma entregados en persona. Cobrar
  $190.000 por el informe. Para 2 locales: pronóstico y orden de compra a mano, en planilla,
  por WhatsApp. Meta: 3 informes pagados.
- **Días 61–90 · La única métrica que importa.** 3 locales pagando $99.000/mes.
  **¿El dueño manda el pedido que le sugerimos editando menos del 20% de las cantidades?**
  Si edita el 60%, no confía en el modelo, y un pronóstico en el que nadie confía vale cero.
  Todo lo demás —MRR, churn, NPS— es ruido al lado de esto.

### Qué mataría esto

1. **El dueño no cambia de conducta.** El riesgo más grande y el menos técnico. El pronóstico
   puede ser un prodigio y el dueño seguir pidiendo a ojo "porque yo igual sé".
2. **El POS lo incluye gratis.** Tienen el dato, la relación y el canal.
3. **El dato del SII no alcanza.** Si la mayoría emite boleta con una sola línea que dice
   "VENTA", no hay serie que pronosticar y el SAM se derrumba. **Se responde en 30 días.**
4. **La merma es 2% y no 6%.** El precio máximo defendible se desploma a ~$33.000 y el
   negocio deja de cerrar. Por eso el diagnóstico gratis mide *exactamente eso*, y primero.

---

## Roadmap

Mes 0 = julio 2026. Seis hitos, cada uno con su **criterio de muerte** escrito ahora, en
frío, para que no se pueda renegociar después en caliente.

| # | Hito | Fecha | Caja gastada | Equipo | Criterio de muerte |
|---|---|---|---:|---:|---|
| **H1** | La señal existe | mes 2 · sep 2026 | $12,6M | 2 | De 20 locales conectados, **menos de 8** tienen detalle por producto. No hay serie que pronosticar: se mata o se pivota a integración POS pura (negocio distinto). |
| **H2** | Alguien paga | mes 4 · nov 2026 | $28,9M | 2 | **Menos de 2 de 10** diagnósticos convierten a pago después de ver el número. Si mostrarle a alguien que perdió $9M no lo mueve a pagar $99.000, el dolor no es lo bastante agudo. |
| **H3** | El modelo le gana al dueño | mes 6 · ene 2027 | $52,3M | 3 | MAPE del modelo peor o igual al del dueño en más de 5 de 20 SKU de alta rotación. **Empatar cuenta como perder:** su método es gratis y le funciona. |
| **H4** | Un POS nos distribuye | mes 10 · may 2027 | $128,8M | 5 | Al **mes 12**: ningún POS firmó **y** alguno anunció su propio módulo. La ventana se cerró. Única jugada racional: venderles la tecnología y salir. |
| **H5** | El dueño cambia de conducta | mes 15 · oct 2027 | $285,9M | 8 | Churn > **8% mensual por 3 meses** en cohorte madura, **o** tasa de edición del pedido > 40% sostenida. El dueño volvió a pedir a ojo. |
| **H6** | Máquina + prueba fuera de Chile | mes 24 · jul 2028 | $681,3M | 11 | CAC > $600.000 y LTV/CAC < 2,5×. No escala con capital de riesgo. Sigue siendo un buen negocio de servicios de 10 personas — hay que decirlo, dejar de llamarlo startup y operarlo como lo que es. |

### Trayectoria (MRR mes 24)

| Escenario | Cierre | Churn | Nuevos/mes al m24 | Locales m24 | MRR m24 |
|---|---:|---:|---:|---:|---:|
| Pesimista | 8% | 5,5% | 11 | 92 | **$7,8M** |
| **Base** | 22% | 4,0% | 38 | **359** | **$30,5M** (ARR ~US$381k) |
| Optimista | 32% | 3,0% | 112 | 901 | **$76,5M** |

Mecánica: `locales(m) = locales(m−1) × (1 − churn) + nuevos(m)`, MRR = locales × $85.000.
El ARPU se mantiene fijo a propósito: no explicamos el crecimiento subiendo el precio en el
escenario que nos conviene.

### Caja

- **Capital total: US$800.000.** Fundadores/FFF $30M (mes 0) + pre-seed US$350k (mes 5) +
  seed US$450k (mes 15).
- **Valle del runway: mes 14.** $160M en caja, quema neta $25,0M/mes → **6,4 meses de runway.**
  Ese es el momento de estar *levantando* la Seed, no de empezar a pensarla.
- Punto de equilibrio: **~mes 36**, con ~600 locales y el equipo congelado en 11 personas.
- Supuestos: nómina $2.400.000 cargado/persona/mes · COGS $12.600/cuenta · CAC $600.000
  hasta el mes 14 y $420.000 desde el 15 · generales $1.200.000 + $150.000/persona ·
  TC $960 CLP/US$.

**Por qué se levanta tan poco:** con la base de costos chilena la quema neta nunca supera
$25M/mes. Levantar US$3M sería levantar 10 años de runway y diluirse por deporte. Que este
negocio necesite menos de un millón de dólares para llegar a la frontera de la rentabilidad
**es la tesis**, no un detalle.

### Embudo de activación — la restricción real

De 100 locales que conectan el SII:

```
1. Conecta el SII                                       100
2. Firma y paga                                          34   (−66)
3. Termina el mapeo de recetas                           29   (−5)
4. Manda su 1ª orden al proveedor                        19   (−10)  ← aquí se decide la empresa
5. ACTIVADO: 4 semanas pidiendo con <20% de edición      11   (−8)
```

**La caída 4→5 es la que mata.** El local recibe su orden, la mira, y la manda *reescribiéndola
entera*. Formalmente es un cliente activo y paga. En la práctica el producto no hace nada, va
a churnear en 4 meses, y no nos vamos a dar cuenta hasta que sea tarde — porque el MRR se veía
bien.

Se mide sin preguntarle nada al cliente:
`tasa_edicion = Σ|q_enviada − q_sugerida| / Σ q_sugerida`

### Probabilidad de éxito

**Éxito =** llegar al mes 36 con más de US$1M de ARR, churn bajo 5%, y la opción real de
levantar Serie A *o* de operar con caja propia. No es unicornio. No es exit.

**Clase de referencia — declarada:** SaaS B2B vertical, pyme, LatAm, con pre-seed.
**No conocemos una tasa base citable para esta clase exacta.** La cifra que se repite para
EE.UU. (15–25% de seed → Serie A) no es trasladable a Chile. En vez de fingir una fuente,
declaramos el rango que usamos **como juicio: 10–20%**.

**Derivación multiplicativa:**

```
P(el dato del SII alcanza)            0,70
P(el modelo le gana al dueño)         0,80
P(el dueño cambia de conducta)        0,45   ← el más bajo, y es el correcto
P(hay canal POS antes del mes 12)     0,50
P(churn se queda bajo 6%)             0,60
P(nadie nos mata antes del mes 24)    0,75
──────────────────────────────────────────
Producto                              5,7%
```

**El 5,7% está mal por lo bajo, y sabemos por qué.** Multiplicar seis probabilidades como si
fueran independientes es un error: **no lo son**. Si el dueño cambia de conducta, el churn baja
solo, y con casos de éxito reales el POS firma más fácil. Están correlacionadas hacia arriba,
y la multiplicación independiente castiga dos y tres veces la misma incertidumbre.

> ### Entre **6% y 15%**. Centrado en **10%**.

El piso (6%) es la cadena multiplicativa, que sub-estima. El techo (15%) es el extremo
optimista de la clase de referencia declarada, que no está medida en Chile. Los dos métodos
discrepan y **preferimos mostrar la discrepancia antes que elegir el que nos conviene.** El
10% no es una medición: es un juicio, y está escrito así.

**La palanca:** un solo factor domina — `P(el dueño cambia de conducta) = 0,45`. Si subiera
a 0,70 (y se puede subir, con producto: el error a la vista, un solo SKU al principio, el
nivel de servicio en sus manos), la cadena pasa a 8,8% y el rango a 9–22%. **Ese es el
trabajo.** No es el modelo: el modelo ya funciona. Es que alguien le crea al modelo a las
6 de la mañana, con el proveedor esperando el WhatsApp.

---

## Stack

### El motor de pronóstico NO es un LLM

Es estadística clásica en CPU, y su costo marginal es prácticamente cero. Eso es lo que
permite cobrar $99.000/mes con 85% de margen bruto.

| Pieza | Qué es |
|---|---|
| Base | **ETS** (suavizamiento exponencial) con estacionalidad semanal, por SKU. Sobrevive con 8 semanas de historia. |
| Regresores | **Gradient boosting** (LightGBM) sobre los residuos: día de la semana, día del mes, proximidad al día de pago, feriado y víspera, temperatura, precipitación, quiebre conocido, tendencia. |
| SKU lentos | **Croston / TSB** para venta intermitente. ETS los destroza. |
| Incertidumbre | Cuantiles **empíricos** de los residuos del backtest, no una normal supuesta. La banda P10–P90 sale de cómo se equivocó el modelo antes. |
| Validación | Backtest con corte temporal deslizante. MAPE global y —más importante— **MAPE en días especiales** (pago y feriado): *el día que más vendes es el día en que más te equivocas.* |
| Cómputo | Cron nocturno. ~90 segundos de CPU por local. Un worker barato reentrena 400 locales en una noche. |

Si el pronóstico dependiera de llamadas a un LLM por SKU y por día, el costo variable sería
del orden de US$40/cuenta/mes y **el negocio no existiría a este precio.**

### Del pronóstico a la orden de compra

```
1. Consumo teórico del insumo i = Σ_sku pronóstico(sku) × receta(sku, i)
2. Necesidad  = Σ consumo teórico sobre los días de cobertura
3. Colchón    = z × σ_consumo × √cobertura      (z = 1,28 / 1,65 / 2,05 → 90 / 95 / 98%)
4. Bruto      = necesidad + colchón − stock actual
5. Unidades   = ⌈ bruto ÷ contenido del formato ⌉     (nadie te vende 3,4 sacos de harina)
```

El paso 5 —el redondeo al formato real del proveedor— es la diferencia entre un número y una
orden de compra.

### Modelo de datos (Postgres)

Las tres tablas que cargan el peso:

- **`dte_linea`** — todo lo que entró y salió, según el Estado. `(dte_id, nro, desc_cruda,
  cantidad, unidad, precio_unit, monto, alias_id)`. El LLM llena `alias_id`.
- **`receta`** — lo que une la venta con el insumo. `(sku_venta_id, insumo_id, coef, unidad,
  origen{humano,inferido}, confianza)`.
- **`orden_linea`** — donde vive la métrica que decide la empresa. `(orden_id, insumo_id,
  q_sugerida, q_enviada, q_recibida, formato, precio_unit, monto)`.

**`q_sugerida` y `q_enviada` son dos columnas separadas y no una.** Es una decisión de esquema
que vale toda la empresa: de ahí sale la tasa de edición.

Resto: `empresa`, `local`, `usuario`, `credencial_sii`, `dte`, `sku_venta`, `proveedor`,
`insumo`, `alias`, `venta_diaria`, `clima_diario`, `feriado`, `pronostico`, `backtest`,
`orden_compra`, `conversacion_wa`, `conteo_inventario`, `merma_mes`.

**La única fórmula que el cliente nos paga por calcular:**

```
merma = compras − consumo_teórico − Δinventario

  compras          ← dte_linea tipo 33   (el SII ya lo sabe)
  consumo teórico  ← venta_diaria × receta
  Δinventario      ← conteo_inventario, un conteo al mes
```

El único dato que le pedimos al cliente es **un conteo de inventario al mes**. Es la fricción
mínima irreducible: sin él, la merma y el error de la receta son indistinguibles.

### Agentes de IA

Cinco. Cada uno con su modelo elegido por la tarea, no por la moda.

| # | Agente | Modelo | Llamadas/mes | Por qué ese modelo |
|---|---|---|---:|---|
| 1 | Extractor de líneas de factura | `claude-haiku-4-5` | 10 | Extracción estructurada con esquema fijo. Sonnet no lo hace mejor y cuesta 3×. |
| 2 | Normalizador de catálogo | `claude-haiku-4-5` | 4 | *Entity resolution*: `HARINA PAN.25K` = `Harina panadera saco 25 kilos`. Sin esto no hay serie de precios ni merma. Umbral de confianza 0,85 → bajo eso, humano. |
| 3 | **Agente de WhatsApp con proveedores** | `claude-sonnet-5` | 144 | **71% del costo de IA.** Lee "no hay palta, el jueves te mando". La ambigüedad chilena rompe a un modelo pequeño, y una orden mal leída cuesta un quiebre. Opus sería pagar 5× por nada. |
| 4 | El resumen del lunes | `claude-sonnet-5` | 4 | Un WhatsApp, 6 líneas. **Empieza siempre por dónde nos equivocamos.** Nunca felicita. La confianza se construye admitiendo el error. |
| 5 | Diagnóstico de merma + inferencia de recetas | `claude-opus-4-8` | **1 vez**, en onboarding | Se hace una vez, decide la venta, y un error contamina el modelo entero. Regla dura: **prefiere subestimar la merma antes que inflarla.** |

### Costo mensual, con la aritmética

Precios Anthropic por MTok: Haiku 4.5 $1/$5 · Sonnet 5 $3/$15 · Opus 4.8 $5/$25.
Caché: lectura 0,1×, escritura 1,25×. TC $960 CLP/US$.

| Agente | Aritmética | US$/mes |
|---|---|---:|
| 1 · Extractor | in 40k×$1/M + out 8k×$5/M | $0,08 |
| 2 · Normalizador | in 4k×$1/M + caché 20k×$0,10/M + out 3,6k×$5/M | $0,03 |
| **3 · WhatsApp** | in 101k×$3/M + caché-r 403k×$0,30/M + caché-w 67k×$3,75/M + out 36k×$15/M | **$1,22** |
| 4 · Resumen del lunes | in 48k×$3/M + out 2,8k×$15/M | $0,19 |
| Alertas de precio | in 150k×$1/M + out 9k×$5/M | $0,20 |
| Motor de pronóstico | *no es un LLM* | $0,00 |
| **Subtotal** | | **$1,72** |
| × 1,25 reintentos y evaluaciones | | **$2,15** |

```
Inferencia Claude   US$2,15 × 960                  = $2.100
Infraestructura     US$1,35 × 960                  = $1.300
  (plataforma fija US$400/mes ÷ 359 cuentas = US$1,11 + marginal US$0,24)
WhatsApp BSP        60 conv × US$0,0122 × 960      =   $700
─────────────────────────────────────────────────────────────
Subtotal técnico                                     $4.100
+ soporte prorrateado (1 CSM / 120 cuentas)          $8.500
─────────────────────────────────────────────────────────────
COGS total por cuenta/mes                           $12.600
Margen bruto sobre ARPU $85.000                       85,2%
```

**Puesta en marcha (una vez):** ~US$14,60 ≈ **$14.000** de inferencia Opus (diagnóstico de 12
meses + inferencia de recetas). Va dentro de los $190.000, junto a ~6 horas de trabajo humano.

**Dónde se dispara:** el agente 3 es el 71% de la factura de IA. Si el proveedor contesta con
audios —cosa que pasa mucho— el costo por conversación se dobla. Plan: transcribir con un
modelo de voz barato *antes* de que el texto llegue a Sonnet.

### APIs de terceros, por tiempo de conseguirlas

| Servicio | Cómo se consigue de verdad | Costo |
|---|---|---|
| **SII · DTE y RCV** ⚠️ *camino crítico* | El SII **no tiene API REST moderna**: son servicios SOAP con certificado digital (semilla → firma → token → RCV). Ruta rápida: apoyarse en un proveedor autorizado (LibreDTE, Nubox) mientras se construye el conector propio. **Solo lectura, siempre.** Nunca emitimos un DTE en nombre del cliente. | $0–25k/mes por empresa |
| **WhatsApp Business Platform** ⚠️ *4–8 semanas* | Vía BSP (360dialog, Twilio, Infobip). Verificación del negocio en Meta + aprobación de plantillas *utility* una por una. **La aprobación es el cuello de botella y no se apura con plata.** | ~US$0,0122/conversación |
| APIs de POS | Bsale, Toteat, Fudo, Relbase. Técnicamente triviales; comercialmente es una negociación. La API viene con el acuerdo. | $0 técnico · 20% rev share |
| Anthropic API | Una clave. Ese es todo el trámite. | US$2,15/cuenta/mes |
| Open-Meteo | Pública, sin clave. Coordenadas por comuna, cacheadas. | ~US$0 |
| Calendario de feriados | **No hay API oficial confiable.** Se mantiene a mano, 1×/año, contra el Diario Oficial. Son 15 fechas. Automatizarlo sería el peor uso posible de una semana de ingeniería. | $0 · 2 horas al año |
| Transbank / Flow | Flow o Khipu para partir. | 2,9% + IVA por transacción |

### Variables de entorno

`ANTHROPIC_API_KEY`, `MODELO_EXTRACCION`, `MODELO_CONVERSACION`, `MODELO_DIAGNOSTICO`,
`LLM_CACHE_TTL`, `LLM_MAX_REINTENTOS` · `SII_AMBIENTE`, `SII_ENDPOINT_SEMILLA`,
`SII_ENDPOINT_TOKEN`, `SII_ENDPOINT_RCV`, `SII_PROVEEDOR_FALLBACK`, `SII_PROVEEDOR_TOKEN`,
`CERT_KMS_KEY_ID`, `CERT_BUCKET` · `WA_BSP`, `WA_API_KEY`, `WA_NUMERO_ID`,
`WA_PLANTILLA_PEDIDO`, `WA_PLANTILLA_RESUMEN`, `WA_WEBHOOK_SECRET` · `BSALE_TOKEN`,
`TOTEAT_CLIENT_ID`, `TOTEAT_CLIENT_SECRET`, `FUDO_API_KEY`, `RELBASE_TOKEN` ·
`OPENMETEO_BASE`, `FERIADOS_JSON` · `DATABASE_URL`, `REDIS_URL`, `S3_BUCKET_DTE`,
`CRON_PRONOSTICO`, `CRON_RESUMEN_LUNES` · `FLOW_API_KEY`, `FLOW_SECRET` · `SENTRY_DSN`,
`UMBRAL_CONFIANZA_ALIAS`, `UMBRAL_TASA_EDICION_ALERTA`

Los certificados `.p12` del SII se cifran con KMS, viven en un bucket con acceso auditado, y
**jamás se guardan en claro.** El cliente puede revocarlos cuando quiera.

### Qué está fingido en el demo

El demo corre entero en el navegador. No hay servidor, ni base de datos, ni una sola llamada
a la red.

**Real, y calculado en vivo:**
- La matemática del pronóstico: factores multiplicativos, banda P10–P90 que se ensancha con
  `σ·√(1+0,22h)`, MAPE, MAPE de días especiales. Cada toggle recalcula de verdad.
- La orden de compra: consumo teórico vía receta, colchón `z×σ×√cobertura`, redondeo al
  formato del proveedor, agrupación, totales en CLP.
- **Los feriados.** El 29 de junio (San Pedro y San Pablo) y el 16 de julio (Virgen del
  Carmen) de 2026 son feriados chilenos reales. No los inventamos para que la historia calzara.
- Los formatos de compra: saco de 25 kg, bandeja de 30 huevos, caja de 12.

**Fingido:**
- **El histórico de ventas.** Sintético: el mismo modelo multiplicativo más ruido gaussiano
  con semilla determinista. *Consecuencia honesta:* **el MAPE del demo (7–11%) es
  artificialmente bueno**, porque los "datos reales" los generó el mismo modelo que los
  pronostica. Un local de verdad tiene más ruido, más quiebres y más días raros.
- **El modelo mismo.** El del demo es de juguete. El de producción es ETS + Croston +
  gradient boosting con validación temporal.
- **Los proveedores.** Nombres, RUT y teléfonos inventados. Sus *formas de operar* (días de
  entrega, formatos, que reciben pedidos por WhatsApp) no lo son.
- **El WhatsApp.** El mensaje se redacta y se muestra. No se envía.
- **Las recetas.** Coeficientes escritos a mano. En producción los infiere el agente 5.
- **El clima.** Serie pre-generada. En producción, Open-Meteo por comuna.

---

## Dominio

| Dominio | Consulta | Respuesta | Estado |
|---|---|---|---|
| **mermata.com** | `rdap.verisign.com/com/v1/domain/mermata.com` | **HTTP 404** | **Libre** — la marca. `mermata.cl` también. |
| abastero.com | `rdap.verisign.com/com/v1/domain/abastero.com` | HTTP 404 | Libre — alternativa 1 |
| cuanteo.com | `rdap.verisign.com/com/v1/domain/cuanteo.com` | HTTP 404 | Libre — alternativa 2 |
| pronosta.com | `rdap.verisign.com/com/v1/domain/pronosta.com` | HTTP 404 | Libre — alternativa 3 |

Verificado el 13 de julio de 2026 con `_kit/check-domain.sh`.

**Por qué Mermata:** es *merma* + *mata* — "mata la merma". Dice el problema y la promesa en
siete letras, se pronuncia igual en todo el español, y el KPI que el producto pone al centro
es literalmente el nombre de la empresa.

---

## Dirección de arte

**"Libreta de bodega".** El dueño de la panadería ya lleva un cuaderno. Ese cuaderno es el
competidor real, y también es la referencia visual: papel cálido en vez de blanco de pantalla,
tinta negra, reglas de un pelo, numeración monoespaciada como una planilla de conteo, y **un
solo acento** — rojo pimentón, el lápiz de corrección.

- **Fraunces 600** para los titulares (voz de imprenta, no de dashboard).
- **IBM Plex Sans** para cuerpo e interfaz (deliberadamente *no* Inter).
- **IBM Plex Mono** para **cada cifra**, tabular. Los números se alinean como en una planilla.
- Un solo modo, papel. Sin modo oscuro: una libreta no tiene modo oscuro.

**Paleta, validada con `scripts/validate_palette.js` del skill `dataviz`, no a ojo:**

```
Papel    #f7f3ea  #fffdf7  #efe9dc  #e6dfcd
Tinta    #17150f (16,5:1)   #4d4738 (8,3:1)   #736b59 (4,8:1)
Reglas   #ddd5c4  #c9bfa8   Grilla #e3dbc9
Acento   #b8452b  (oscuro #9c3520 · lavado #f2e2dc)
Estado   #2e7d4f bien · #a97400 atención · #9b1c1c riesgo   (siempre con icono + etiqueta)

Categórica  #0a6296  #b8452b  #2e7d4f  #a97400        → 6/6 PASS
Ordinal     #7dabc6  #4a8cb0  #1f6f99  #0d5479  #08374f → PASS (ΔL ≥ 0,06, extremo claro 2,23:1)
```

Dos iteraciones fallaron antes de esta: `#1c5f86` tenía croma OKLCH 0,091 (bajo el piso de
0,10 — habría leído como gris), y el extremo claro de la rampa ordinal daba 1,58:1 contra el
papel cálido. Se corrigieron, no se aprobaron a ojo.

**Gráficos:** SVG escrito a mano, sin librería. Barras ≤24px con extremo de dato redondeado
4px y cuadrado en la línea base. Líneas de 2px. Marcadores ≥8px con anillo de 2px del color de
la superficie. Relleno de área al 10–12%. Grillas sólidas de un pelo, **nunca punteadas**.
Leyenda solo con ≥2 series. Etiquetas selectivas, jamás en cada punto. Cada gráfico tiene su
**gemelo en tabla**. Los filtros van en **una sola fila**, arriba de todo lo que gobiernan.
Nunca doble eje.

---

## Archivos

```
04-inventario/
├── index.html        Landing. Calculadora de pérdida en vivo + mini-pronóstico interactivo.
├── demo/index.html   EL PRODUCTO. Pronóstico, orden de compra, WhatsApp, merma. 11 controles vivos.
├── negocio.html      ICP, TAM/SAM/SOM, competencia, precio, unit economics, canales, 90 días.
├── roadmap.html      6 hitos con criterio de muerte, 4 gráficos, probabilidad con derivación.
├── stack.html        Modelo de datos, 5 agentes, APIs, env vars, costos, qué está fingido.
├── mermata.css       El sistema visual completo. Sin frameworks.
├── mermata.js        Toggle de navegación móvil. 30 líneas.
├── meta.json
└── README.md
```

Sin build. Sin npm. Sin framework. Sin CDN. La única petición externa de toda la carpeta es
Google Fonts.
