# Freatia

**El balance hídrico de la faena, cuadrado y auditable. Y cuando no cuadra, te dice cuánto falta y dónde buscarlo.**

Dominio: **freatia.com** — disponible (RDAP Verisign → HTTP 404, verificado el 2026-07-13 con `_kit/check-domain.sh`; `freatia.cl` también libre).
Alternativas verificadas: `isohipsa.com`, `cuencora.com`, `piezara.com`.

*Freatia*, de **nivel freático**: la cota del agua subterránea. Es el número que decide si un tranque duerme tranquilo, y es —literalmente— dónde está el agua que no se ve.

---

## El problema

En el norte de Chile el agua es la licencia para operar. Una faena en el Atacama consume agua donde no la hay, se la disputa con las comunidades y con la agricultura, y tiene que demostrarle al regulador y al vecino —con números que sobrevivan una auditoría— cuánta extrae, de dónde, cuánta recircula y cuánta pierde.

Hoy ese balance vive en una planilla que arma una sola persona, con datos que vienen de sensores, de informes en PDF y de lecturas a mano. **Casi nunca cuadra.** Y cuando no cuadra, se ajusta un coeficiente hasta que cuadre, porque el reporte hay que mandarlo igual.

Ese hueco tapado es dos cosas al mismo tiempo:

1. Una **multa de la SMA** esperando a que alguien revise la trazabilidad.
2. El **primer síntoma de una filtración en el muro del tranque** — y después de Brumadinho, eso no es una molestia administrativa: es gente muerta y una empresa cerrada.

## La solución

Tres superficies sobre un solo dato:

1. **Balance hídrico en tiempo real y trazable.** Un Sankey dibujado a mano donde cada litro tiene origen: qué sensor lo midió, con qué método, cuándo se calibró ese instrumento, qué cobertura tuvo el dato. Entradas = salidas + acumulación + **sin explicar**. El residual se *calcula*, no se escribe.
2. **Monitoreo del depósito de relaves.** Piezómetros, revancha hidráulica, deformación. Umbrales que salen del manual de operación aprobado (no de nuestra imaginación), y un escalamiento con bitácora sellada que no se puede cerrar sin que una persona haya hecho algo.
3. **Reportes generados desde el mismo dato sellado** — DGA, SERNAGEOMIN, SMA, y el reporte en castellano simple a la comunidad. Si el balance no cierra, el reporte a la SMA **se bloquea**. Si hay un evento geotécnico abierto, el informe a SERNAGEOMIN **se bloquea**.

## La cuña

Todos los demás cierran el balance forzando un coeficiente. **Freatia se niega.** Deja el hueco a la vista, lo cuantifica en l/s, lo diagnostica con hipótesis rankeadas y evidencia, y no deja firmar hasta que alguien lo explique o declare explícitamente la incertidumbre —con su nombre.

Ese residual sin explicar *es* el producto. Es incómodo, y por eso vale plata.

## Lo que Freatia no hace

Con esto abrimos las reuniones, no las cerramos:

- **No compra licencia social.** Un conflicto con una comunidad no se arregla con un dashboard. Se arregla con agua, con acuerdos y con años de comportamiento. Freatia sólo hace más difícil mentir, y da algo que mostrar cuando lo que se hizo estuvo bien hecho.
- **No predice la falla del muro.** Eso lo hace un ingeniero geotécnico. Freatia vigila las variables que él definió y lo llama cuando se salen de rango, a las 3 de la mañana si hace falta.
- **No mide lo que no está instrumentado.** Si el agua de contacto se estima con un coeficiente de 2011, Freatia va a decir "estimado, calidad baja". No va a inventar un caudalímetro.
- **No evita una multa.** Evita la sorpresa. La multa la evita la faena, actuando a tiempo con lo que ahora sí sabe.

---

## Negocio

### A quién le vendemos

Faena minera de cobre o litio en el norte de Chile, entre 5.000 y 60.000 t/d, con derechos DGA vigentes y al menos un depósito de relaves activo. Compra el **Superintendente de Medio Ambiente / Recursos Hídricos** —el que hoy arma la planilla y el que responde cuando llega la SMA—. Firma el **Gerente de Operaciones**, y en compañías del ICMM aparece un tercero decisivo: el que responde por el GISTM ante el directorio.

### Precio (CLP, mensual, por faena)

| Plan | Precio | Qué incluye |
|---|---|---|
| **Cuenca** | $2.900.000 | Balance hídrico trazable + reportes DGA/SMA |
| **Tranque** | $4.900.000 | Todo lo anterior + monitoreo del depósito, umbrales y escalamiento |
| **Corporativo** | desde $9.800.000 | Varias faenas, consolidado, panel de directorio |
| Implementación | $12.000.000 – $28.000.000 | Una sola vez. Depende de cuántas fuentes de dato haya que domar. |

No es SaaS barato y no debe serlo: compite con un consultor que cobra $40M por un estudio de balance hídrico una vez al año, y con una multa que cuesta órdenes de magnitud más.

### Unit economics (plan Tranque)

- **COGS por faena/mes: $1.328.800** = IA US$30 ($28.500) + infra US$382 ($362.900) + plataforma compartida US$92 ($87.400) + soporte humano $550.000 + visita trimestral de calibración prorrateada $300.000.
- **Margen bruto: 72,9%.**
- **CAC: $35.000.000** ($315M de costo comercial ÷ 9 cierres). Ciclo de venta largo, con visita a faena, piloto y comité.
- Margen bruto anual por cliente: **$42.900.000**. Contribución de la implementación: $7.200.000.
- **Payback: 7,8 meses.** LTV a 5 años: $214.500.000. **LTV/CAC: 6,1×.**

### Mercado

- **TAM Chile: ~$7.608 millones/año (≈US$8,0M).** 20 faenas grandes × $117,6M + 45 medianas × $58,8M + 75 pequeñas × $34,8M.
- **SAM: 70 operaciones ≈ $3.516M (≈US$3,7M).** Las que tienen depósito activo, instrumentación mínima y presupuesto.
- **SOM a 36 meses: 14 faenas ≈ $735M de ARR (≈US$774k).**
- Global: ~1.800 depósitos de relaves activos según el Global Tailings Portal (*verificar edición vigente*) × US$50k ≈ US$90M. Es un mercado chico y profundo, no uno grande y plano. Se construye un negocio de US$5–15M, no un unicornio, y hay que decirlo antes de levantar plata.

### Con quién compite de verdad

**Con Excel.** El incumbente es una planilla, es gratis, y la persona que la arma es dueña de ella. Ese es el rival.

Después: AVEVA PI (no compite — es la fuente de datos, hay que integrarse), Vista Data Vision / Geokon / Worldsensing / RST (monitoreo geotécnico: ven el tranque pero no el agua), Maptek Sentry / IDS GeoRadar (deformación por radar: caro y específico), las consultoras (Amphos 21, SRK, WSP, Arcadis, Poch, JRI — hacen el estudio anual y son a la vez competencia y el mejor canal), y las suites EHS globales (Sphera, Cority, Enablon, Intelex: cumplimiento genérico, cero idea de un salar).

### Canales, en orden

1. **Las consultoras hidrogeológicas.** Ellas ya hacen el balance a mano una vez al año y odian esa parte del trabajo. Que lo hagan con Freatia y se queden con la interpretación, que es lo que les da margen.
2. Congresos y asociaciones (Sonami, Consejo Minero, Expomin, encuentros de relaves).
3. Venta directa a superintendentes, con un piloto de 8 semanas sobre datos históricos.
4. Los proveedores de instrumentación, que necesitan una capa de software encima de sus sensores.
5. Contenido técnico corto y muy específico (cómo se cierra un balance en cuenca endorreica).
6. El regulador, no como cliente: como fuente de verdad sobre qué se exige realmente.

Descartados: Google/Meta Ads (nadie googlea "software balance hídrico" a las 11 de la noche), Mercado Público (esto se vende a privados), y el canal PYME de software (no existe en minería).

### Qué mataría esto

Lo más probable no es que un competidor nos gane. Es que **nadie quiera un producto cuyo principal aporte es hacer visible un problema incómodo.** Un balance que no cuadra es una mala noticia, y hay una versión del mundo donde el superintendente prefiere su planilla precisamente porque la planilla cuadra.

Eso se testea con el piloto, no con una presentación. Si a la faena N°3 el hallazgo de los 40 l/s no genera una acción, el producto está muerto y hay que decirlo rápido.

---

## Roadmap

Seis hitos, cada uno con un **criterio de muerte** explícito.

| # | Mes | Hito | Muere si |
|---|---|---|---|
| M1 | 0–4 | Un piloto pagado sobre datos históricos de una faena real. El balance cierra o el hallazgo es real. | A los 4 meses no hay una sola faena que nos deje mirar sus datos. |
| M2 | 5–12 | **3 faenas pagando.** Ingesta OPC-UA en producción. Primer reporte firmado con datos de Freatia. | Al mes 12 hay 0 o 1 cliente pagando. |
| M3 | 13–15 | El escalamiento del tranque se usa de verdad: un evento real, acusado y cerrado con acciones. | Nadie configura umbrales; el módulo queda de adorno. |
| M4 | 16–19 | 8 faenas. Un cliente corporativo con más de una faena. | El churn del primer año supera 1 de 6. |
| M5 | 20–22 | Un hallazgo de Freatia le ahorra a un cliente algo que se puede contar en una referencia pública. | A los 22 meses ningún cliente nos deja usar su nombre. |
| M6 | 23–24 | **12 faenas, MRR $58,8M, ARR ~$706M.** Caja para 12 meses sin levantar. | Base < 8 faenas y no hay ronda. |

### Escenarios al mes 24

- **Pesimista:** 4 faenas, ARR $235M (US$248k). Sobrevivimos como consultora con software.
- **Base:** 12 faenas, MRR $58,8M, **ARR $706M (US$743k)**.
- **Optimista:** 19 faenas, ARR $1.277M (US$1,34M). Aparece Perú.

### Caja

Fundadores $60M (m0) + CORFO $50M (m3) + semilla $430M (m8). Gastos por tramo: $16M → $26M → $48M → $66M al mes. **El valle está en el mes 7: quedan $15,8M.** Es un mes de miedo real y hay que planificarlo, no descubrirlo. Caja proyectada al mes 24: $339,4M.

### Probabilidad (con su derivación, no una corazonada)

Clase de referencia: SaaS B2B que llega a US$1M de ARR. Tasa base ~5% (*no es estadística oficial; es el orden de magnitud que se repite en la literatura de la industria*).

Ajustes: fundadores con acceso al sector ×1,6 · dolor caro y comprobable ×1,5 · regulación que aprieta ×1,3 · ciclo de venta brutal ×0,6 · mercado chico ×0,8 · dependencia de instrumentación que no controlamos ×0,85 → **≈4,0%**.

Lo reportamos como rango, porque un solo número aquí sería falsa precisión:

- **3–8% incondicional** de llegar a US$1M de ARR.
- **20–30% condicional** a cumplir M2 (3 faenas pagando al mes 12).
- **<3%** si al mes 12 hay 0 o 1 cliente.
- **25–35%** de un desenlace distinto y digno: bootstrapped rentable con 6–10 faenas, o adquirida por una consultora o un proveedor de instrumentación.

---

## Stack

Sin build, sin framework, sin CDN: HTML, CSS y JS escritos a mano. Los gráficos —el Sankey del balance y las series de piezómetros— son SVG dibujado a mano en `graficos.js`. La única petición externa es Google Fonts.

### Arquitectura del producto real

```
FAENA (red OT)                    NUBE (VPC)                     SALIDAS
 PLC / DCS / sensores      →  ingesta + validación        →  aplicación web
 historiador (AVEVA PI)    →  TimescaleDB (lecturas)      →  reportes DGA / SNGM / SMA
 piezómetros, dataloggers  →  motor de balance (SQL)      →  reporte público a la comunidad
 PDF, planillas, fotos     →  registro sellado (WORM)     →  escalamiento: WhatsApp / voz
 GW-01 gateway OPC-UA      →  4 agentes (Claude)          →  exportación al consultor
        └── MQTT/TLS, sólo salida. No acepta conexiones entrantes. No escribe en el PLC.
```

Esa última línea es la primera pregunta que hace el área de TI de la minera, y de la respuesta depende que el proyecto exista.

### Modelo de datos

Nada se actualiza; todo se agrega. Una corrección es una fila nueva con autor, hora y motivo. Tablas: `faena`, `fuente_dato`, `sensor` (la llave es el TAG: `FIT-1010`, `PZ-14`), `lectura` (hipertabla TimescaleDB, ~8,6M filas/mes por faena), `partida` (con la expresión de cálculo **versionada**), `flujo`, `balance` (sellado e inmutable), `balance_detalle` (guarda con qué versión de la fórmula se calculó cada partida — esto es lo que lo hace auditable), `umbral` (cada uno apunta al párrafo del manual de operación que lo justifica), `evento`, `evento_bitacora` (append-only, sin excepción), `hipotesis`, `reporte`.

### Los cuatro agentes

**Ninguno suma los números.** El balance lo calcula SQL determinista y testeado. Un LLM sumando catorce caudales es una idea espantosa.

| Agente | Modelo | Frecuencia | Trabajo |
|---|---|---|---|
| 1 · Conciliador | `claude-haiku-4-5` | 720/mes | Clasifica calidad de dato, detecta sensores mudos, escribe la bitácora, gatilla al agente 2. |
| 2 · Diagnóstico | `claude-sonnet-5` | ~25/mes | Las hipótesis de la discrepancia, con evidencia, rango explicado y la acción más barata que descarte una. `thinking: adaptive`, `effort: high`. |
| 3 · Documentos | `claude-sonnet-5` | ~120/mes | Lee PDF, certificados de calibración y fotos de planillas. Devuelve la coordenada de la página de cada número. Todo entra como `estimado` o `manual`, nunca `medido`. |
| 4 · Reportes | `claude-opus-4-8` | ~12/mes | Redacta el informe al organismo y el reporte a la comunidad. |

**Guardarraíl obligatorio:** un verificador determinista extrae con regex todos los números del documento generado y los coteja contra el JSON del balance sellado. Si aparece un número que no está en la fuente, el reporte se rechaza. Un modelo que alucina un caudal en un documento firmado ante la SMA no es un bug: es el fin de la empresa.

### Costo por faena/mes: US$504 ($478.800, a US$1 = $950)

- **IA: US$30.** Conciliador US$8,9 (con caché de prompt) + diagnóstico US$5,6 + documentos US$7,0 + reportes US$8,1.
- **Infraestructura dedicada: US$382.** TimescaleDB gestionado 180 · backend/API 70 · gateway industrial amortizado 39 · enlace de respaldo 25 · almacenamiento WORM 15 · observabilidad 25 · WhatsApp + voz 22 · sellado RFC 3161 6.
- **Plataforma compartida: US$92** (US$1.100/mes ÷ 12 faenas; con 24 faenas baja a US$46).

### Terceros

Se contratan: API de Claude, Twilio (voz), WhatsApp Business API, autoridad de sellado RFC 3161, Sentry/Grafana. Depende del cliente: la licencia de AVEVA PI. **Por validar antes de vender:** el formato y la periodicidad exactos que exige la DGA para transmitir extracciones, la periodicidad de los informes a SERNAGEOMIN, si el regulador exige firma electrónica avanzada, y la cobertura de los datos meteorológicos de la DMC.

### Regulación: lo que nos consta y lo que no

**Nos consta:** DGA y el Código de Aguas (derechos, monitoreo de extracciones; la Ley 21.435 de 2022 endureció caducidad y patentes por no uso). SERNAGEOMIN y el DS 248 sobre depósitos de relaves, más el DS 132 y la Ley 20.551 de cierre. La SMA (Ley 20.417) fiscaliza la RCA y sanciona. El GISTM, que no es ley chilena pero pesa por presión de inversionistas.

**Por validar:** los formatos, periodicidades y montos de sanción específicos. En el demo, cada obligación no verificada aparece marcada como **"por validar"** — porque la alternativa, inventarla, es exactamente lo que destruye la credibilidad frente a la única persona que puede firmar el contrato.

Lo primero que hay que contratar no es un servidor: son cuatro horas de un abogado de aguas y cuatro de un ingeniero de relaves con experiencia en fiscalización. Cuesta menos que un mes de nube.

---

## El demo

`demo/index.html` — tres faenas inventadas sobre geografía real (Sierra Gorda / Salar de Punta Negra; Diego de Almagro / río Salado; San Pedro de Atacama / Salar de Atacama), tres períodos, cuatro pestañas.

**Faena Quebrada Seca** no cuadra: entran 343 l/s, salen 285, se acumulan 18, y **faltan 40 l/s (11,7%)**. El producto no lo esconde: lo pone en el titular, lo pinta magenta en el Sankey, ofrece tres hipótesis rankeadas (52% filtración en el pie del muro oeste — PZ-14 subiendo 4,2 cm/día, correlación 0,86 con la discrepancia, conductividad del pozo de monitoreo MW-03 pasando de 2.140 a 2.610 µS/cm), y **bloquea el reporte a la SMA** porque 11,7% supera el umbral de 5%.

La aritmética está verificada mecánicamente para las 3 faenas × 3 períodos: el residual se calcula a partir de los flujos, no está escrito a mano.

### Qué está falseado

No hay ingesta (los datos son un archivo `.js`). El sello criptográfico es un string. Las probabilidades del diagnóstico están escritas a mano —en el producto salen del agente 2, y hasta tener 20 faenas con resultados reales, esas probabilidades son una opinión con decimales—. El escalamiento no manda nada: hay un `alert()`. Las faenas y sus RUT son ficticios; las cuencas, los salares, los organismos, los reglamentos y los instrumentos, no.

---

## Archivos

```
15-agua/
├── index.html        producto (landing, con el Sankey vivo)
├── demo/index.html   el demo
├── demo/demo.js      estado, datos y toda la aritmética del balance
├── graficos.js       Sankey y piezómetros, SVG a mano
├── negocio.html      ICP, precio, TAM/SAM/SOM, competencia, unit economics, canales
├── roadmap.html      6 hitos con criterio de muerte, escenarios, caja, probabilidad
├── stack.html        modelo de datos, agentes, terceros, costos, qué está falseado
├── estilo.css        la carta topográfica
├── meta.json
└── README.md
```

## Dirección de arte

**Carta topográfica nocturna.** Fondo de tinta oscura con retícula de mapa, curvas de nivel en ocre árido, agua en azul (`#3F9BD6`) y recirculación en verde (`#2E9E70`) sobre terreno seco; pérdidas en ocre (`#B3762F`) y lo que no se explica en magenta (`#B85499`), porque no tiene color natural. Barlow y Barlow Condensed para los rótulos de plancheta, JetBrains Mono para cotas y caudales. El Sankey es el protagonista.

Paleta validada con `scripts/validate_palette.js` del skill `dataviz` (`--mode dark`, `--pairs all`): pasa banda de luminosidad, piso de croma, separación CVD y contraste.

Nada de papel crema, nada de serif editorial sobre fondo claro, nada de acento rojo óxido.
