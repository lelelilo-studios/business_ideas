# Torniqua

**Habilitación de contratistas para faenas mineras.**
PASA o NO PASA en la portería, en un segundo, con el motivo exacto y la ruta para arreglarlo.

- Dominio: **torniqua.com** — verificado libre el 13-07-2026 (`rdap.verisign.com` → HTTP 404; `torniqua.cl` → "no existe" en NIC Chile).
- Alternativas verificadas y libres: `kredencia.com`, `garitel.com`, `credalza.com`.
- Dirección de arte: **credencial / control de acceso**. Acero oscuro, geometría de tarjeta de faena
  (chaflán, perforación de cordón, banda de estado, zona legible por máquina), Archivo + IBM Plex Mono,
  un teal de sistema (`#22C3AC`) y **un solo** color de alarma (`#FF5A2C`).

---

## El problema

En una faena minera grande, la mayoría de la gente que entra cada día no trabaja para la minera: trabaja
para empresas contratistas. Cientos de empresas, miles de personas, y cada una tiene que estar habilitada:
exámenes ocupacionales vigentes (altura geográfica sobre 3.000 m, altura física), inducción de faena,
licencia interna de conducción, EPP entregado y registrado, cotizaciones previsionales al día, seguros,
certificados de la Dirección del Trabajo.

Hoy eso se administra con carpetas, correos, planillas y una persona en la garita revisando papeles.
La consecuencia no es sólo el riesgo legal: es **el bus parado en la portería a las 06:12** porque a un
operador se le venció un curso y nadie se dio cuenta.

El miedo que abre la billetera es la **Ley 20.123**: la empresa mandante responde solidariamente por las
obligaciones laborales y previsionales de sus contratistas, y sólo baja a responsabilidad subsidiaria si
ejerce el derecho de información y retención (art. 183-C).

## El producto

1. **El documento entra como llega** (foto de WhatsApp, PDF escaneado) y la IA le extrae la vigencia. Nadie tipea.
2. **Cuando la foto está mala, la IA duda y pregunta.** No inventa una fecha: una vigencia mal leída es una
   persona entrando indebidamente a una faena a 4.000 m.
3. **El aviso sale antes** (30/15/5 días), por WhatsApp, con la ruta concreta: dónde se toma el examen y qué día hay cupo.
4. **La portería resuelve en un segundo**, con el motivo exacto, y funciona sin señal (caché firmada, 12 h).
5. **El expediente está armado** cuando llega la Dirección del Trabajo — con lo que falta marcado como faltante,
   no rellenado.

> **Ningún modelo de lenguaje decide accesos.** La IA lee documentos; el veredicto lo produce un motor de reglas
> determinístico, versionado y reproducible.

---

## Negocio

### A quién le vendemos: a la contratista, y el lector va gratis para la minera

| | Camino A · la minera mandante | Camino B · la empresa contratista |
|---|---|---|
| Universo | 45 faenas grandes/medianas (estimación) | 4.500 empresas (derivación abajo) |
| Ticket | $2.900.000/mes | $180.000/mes (ARPU ponderado) |
| Ciclo de venta | 9–14 meses | 9–21 días |
| Primer peso | mes 11 | mes 3 |
| Costo comercial 18 meses | $126.000.000 | $36.000.000 |

Para cubrir el equipo del mes 16 en adelante ($15.500.000/mes) hay que facturar ~$16.300.000/mes: eso son
**6 mineras mandantes** (que con 2 vendedores enterprise recién existirían cerca del mes 36) o **91 contratistas**
(mes 17 en la curva base). Sólo una de las dos cierra.

**La jugada:** el lector de portería es **gratis para siempre** para la minera. No es generosidad, es el canal:
una faena tiene entre 150 y 600 contratistas acreditadas, y cada rechazo en esa portería es una demostración
del producto frente a la persona exacta que lo necesita, con el motivo impreso en el ticket. CAC marginal: cero.

### Mercado (Chile, minería)

```
universo contratistas = 45 faenas × 250 contratistas/faena ÷ 2,3 faenas por contratista ≈ 4.900 → 4.500
ARPU ponderado        = 69.000×45% + 189.000×40% + 490.000×15% = $180.150 ≈ $180.000

TAM = 4.500 × $180.000 × 12  +  45 mandantes × $2.900.000 × 12 = $11.286 M CLP/año ≈ USD 11,9 M
SAM = 2.250 (≥10 personas en faena) + 20 mandantes alcanzables = $5.556 M CLP/año ≈ USD 5,8 M
SOM 36 meses = 12% del SAM contratista + 4 mandantes           = $722 M CLP/año ≈ USD 760 k ARR
```

Las tres cifras del universo son **estimaciones propias, no datos publicados**. La que más mueve el resultado
es el solapamiento (faenas por contratista): si fuera 1,5, el universo sube a 7.500; si fuera 4, baja a 2.800.
Es lo primero que hay que medir con datos reales de una faena.

**La verdad incómoda:** la minería chilena sola tope ~USD 12 M de TAM. Esto es una PYME de software muy rentable,
o es un producto que se extiende a construcción, forestal, energía y puertos (misma Ley 20.123, mismo F30-1,
misma portería) y a Perú. TAM extendido, estimación gruesa: ~USD 45 M.

### Precio

| Plan | Precio | Alcance |
|---|---|---|
| Lector de portería (minera mandante) | **$0** | Decisión PASA/NO PASA, cartera, traza de accesos |
| Contratista · Cuadrilla | $69.000/mes | Hasta 15 trabajadores habilitados |
| Contratista · Faena | **$189.000/mes** | Hasta 60 · expediente DT · 3 faenas |
| Contratista · Multifaena | $490.000/mes | Hasta 250 · API · faenas ilimitadas |
| Panel Mandante (año 2) | desde $2.900.000/mes | La cartera completa del mandante |

Un rechazo en portería le cuesta a una contratista ~**$380.000** (persona parada + bus detenido + cuadrilla
incompleta + horas de prevencionista). El plan Faena cuesta menos que medio rechazo al mes.

### Economía unitaria

```
COGS/cliente/mes: IA $1.150 + WhatsApp $2.600 + infra $2.100 + soporte L1 $9.400 = $15.250
margen bruto     = (180.000 − 15.250) ÷ 180.000 = 91,5%
CAC año 1        = $2.000.000/mes ÷ 6,5 cierres = $307.700
payback          = 1,9 meses     LTV = $4.712.000     LTV/CAC = 15,3×
```

El LTV/CAC se ve espectacular porque el canal es gratis. Cuando haya que comprar clientes fuera de las faenas
con lector, el CAC sube a $600–900 k y la razón cae a 5–8×. Ése es el número a vigilar.

### Competencia

- **Excel + correo + carpeta en la garita** — el titular real del puesto. Gratis, instalado, y no avisa nunca.
- **Achilles / RedMinera** — homologación anual de proveedores. Acredita a la *empresa*, no habilita a la *persona*.
- **Avetta · ISNetworld · ComplyWorks** — precalificación global de contratistas. Sin portería chilena ni F30-1.
- **SAP Ariba / Fieldglass** — vive en el ERP del mandante; nadie de la contratista lo usa.
- **BUK · Rex+ · Softland** — RRHH y remuneraciones. No saben de faena. *Riesgo real: BUK podría entrar acá.*
- **Integradores de control de acceso** — validan quién eres, no si estás habilitado. Complemento, no rival.

Diferenciación honesta: no reemplazamos a Achilles y decirlo ahorra seis meses de discusión. Nuestra debilidad
estructural es que ellos hablan con Abastecimiento de la minera y nosotros no — por eso entramos por la portería,
que es de Operaciones.

### Canales, rankeados

1. **La portería misma** (ticket de rechazo con motivo + URL). CAC marginal cero.
2. Outbound humano en Calama y Antofagasta (prevencionista y jefe de contrato).
3. Gremios: **AIA** y **APRIMIN**.
4. Mutualidades y centros médicos ocupacionales (ACHS, IST, Mutual CChC) — ellos emiten los exámenes.
5. Ferias: Exponor, Expomin.
6. SEO long-tail ("vigencia examen de altura geográfica", "cómo se saca el F30-1").
7. Google Ads (CPL ≈ $15.000, volumen bajísimo: captura demanda, no la crea).
8. **Contadores y software PYME: NO es canal.** El contador no sabe qué es una inducción de faena.

### IA en el marketing

**Sí:** construir y priorizar la lista de 4.500 empresas; personalizar el primer mensaje con un dato real del
lector ("el martes rechazaron a dos personas suyas"); redactar el resumen de auditoría que el cliente comparte.
**No:** blog "potenciado por IA" (este comprador no lee blogs), SDR 100% automatizado por WhatsApp (4.500 empresas
donde todos se conocen: un bot mal calibrado quema la marca en dos semanas), video generado.

### Qué mata esto

1. **La mandante no deja poner el lector.** Riesgo n.º 1 y no depende de nosotros.
2. **Una minera mandata a Achilles/Avetta para esto mismo** y lo escribe en el contrato.
3. **Un falso positivo con consecuencias:** alguien entra con el examen vencido por una lectura mala y tiene un
   accidente de altitud. No es un bug, es el fin de la empresa. Por eso la IA no decide nunca.
4. **El techo:** sin una segunda vertical o un segundo país al mes 24, esto es un buen negocio de dueño, no un
   venture case.

---

## Roadmap (día 1 → mes 24)

| Hito | Cuándo | Qué es cierto | Criterio de muerte |
|---|---|---|---|
| **H1** Una portería nos deja | mes 2 | 1 faena con lector en un turno; 3 contratistas con dotación real | Si en 60 días ninguna faena deja instalar el lector ni en un turno de prueba, **el canal no existe**. Parar. |
| **H2** Primer cliente pagando | mes 4 | Pago a precio de lista, sin descuento de fundador | Si 3 design partners usaron 6 semanas el producto y ninguno paga $69.000, el dolor no era dolor |
| **H3** 10 clientes, 2 porterías | mes 9 | Saldo $28,5 M · MRR base $4,7 M | Lectura IA automática bajo 60% (el margen es falso) · o <15 de 250 contratistas expuestas abren la app |
| **H4** Venta repetible | mes 14 | 63 clientes · el SDR cierra solo | Churn de la cohorte 1 sobre 8%/mes · o CAC sostenido sobre $600.000 |
| **H5** Escala de canal | mes 20 | 114 clientes · 5 porterías · primer Panel Mandante pagado | Ninguna mandante paga el panel tras un año de lector gratis → el techo es sólo el TAM contratista |
| **H6** Decisión | mes 24 | Base: 150 clientes · MRR $27,0 M · ARR USD 341 k · caja $43,7 M | Levantar sólo con tracción fuera de la minería; si no, bootstrapear (o vender la base y cerrar) |

Escenarios (MRR(m) = MRR(m−1)×(1−churn) + cierres(m)×ARPU, dólar a $950):

| | cierres | ARPU | churn | MRR m24 | ARR |
|---|---|---|---|---|---|
| Pesimista | 55% de la base | $140.000 | 6,0% | $9,9 M | USD 126 k |
| **Base** | 0,0,1,2,3,4,5,6,7,8,8,9,9,10,10,11,11,12,12,12,13,13,14,14 | $180.000 | 3,5% | **$27,0 M** | **USD 341 k** |
| Optimista | 145% de la base | $210.000 | 2,5% | $49,1 M | USD 621 k |

Caja: capital inicial $70 M ($45 M propios + $25 M instrumento tipo Corfo Semilla Inicia — monto referencial).
**Valle: $10,1 M en el mes 17**, tres semanas de operación del equipo de esa fecha. La decisión que sale de ahí: o se posterga la
contratación del mes 16, o se levanta una ronda pequeña antes del mes 14.

### Probabilidad de éxito

Clase de referencia: la fracción de SaaS B2B que llega a US$1 M de ARR es del orden de **4–6%** de las fundadas
(cifra de uso común en la industria, no un dato oficial: hay que verificar la fuente primaria antes de citarla).
Supervivencia de empresas nuevas en Chile a 3 años: **50–55%** (boletines de dinámica empresarial del Ministerio
de Economía; cifra de orden, verificar edición). **Tasa base de software B2B vendido a contratistas mineros
chilenos: no existe públicamente y no la vamos a inventar.**

Ajustes ↑: cuña concentrada (el SAM cabe en 300 km), presupuesto que ya se gasta, canal que no requiere una
decisión de compra, dolor con fecha.
Ajustes ↓↓: TAM chico (USD 1 M de ARR exige ~26% del SAM), el canal está en manos de un tercero que puede
cerrarlo con un correo, riesgo asimétrico de un falso positivo, competidor con relación instalada en Abastecimiento.

```
P(ARR ≥ USD 1 M al mes 24)                          → 2–5%    (ni el optimista llega)
P(ARR ≥ USD 300 k al mes 24), condicional a H3      → 30–40%
P(empresa viva y rentable al mes 24, de dueño)      → 45–55%
P(matar antes del mes 12), dominado por H1          → 35–45%
```

Esto **no es una idea de venture** con los números chilenos sobre la mesa. Quien vaya a gastar dos años de su
vida acá tiene derecho a saberlo antes, no en el mes 20.

---

## Arquitectura

**Regla que ordena todo:** ningún modelo de lenguaje participa en la decisión de acceso. La IA lee documentos;
el veredicto lo produce un motor de reglas versionado, con tests, capaz de reproducir cualquier veredicto histórico.

### Datos

`mandante` · `faena` (con **altitud_m**, que decide si el examen de altura geográfica es obligatorio) ·
`empresa_contratista` (con `bloqueo_motivo`, que arrastra a toda su gente) · `trabajador` · `documento`
(con `confianza_json`, `extraido_por`, `aprobado_por`) · `requisito` (distingue `bloquea_ingreso` de
`bloquea_conduccion`) · `evaluacion_acceso` (append-only, con `regla_version`) · `alerta` · `expediente`
(con `faltantes_json`) · `auditoria` (append-only).

### Agentes

| # | Agente | Modelo | Qué hace |
|---|---|---|---|
| 1 | Lector de documentos | `claude-haiku-4-5-20251001` (visión) | Extrae campos con **confianza por campo**. Prohibido inferir una fecha, un RUT o un nombre: si no lo ve, devuelve `null` y explica qué lo impide. |
| 2 | Árbitro de duda | `claude-sonnet-5` | Sólo bajo `CONF_MIN=0.90`. Confirma (si ahora lee ≥0,97), **escala a un humano** con el recorte, o rechaza. Nunca devuelve la fecha "más probable". |
| 3 | Ruteador de bandeja | `claude-haiku-4-5-20251001` | Clasifica adjuntos de WhatsApp/correo, los asocia a empresa y trabajador por RUT, detecta duplicados. |
| 4 | Redactor de alertas | `claude-haiku-4-5-20251001` | Escribe el WhatsApp de los 30/15/5 días. No calcula fechas ni decide a quién avisar: sólo redacta. |
| 5 | Armador de expediente | `claude-sonnet-5` | Índice, resumen y **la lista de lo que falta**. Prohibido incluir un documento que no exista con su hash. |

### Costo mensual (la aritmética completa está en `stack.html`)

```
IA por cliente/mes (60 trabajadores, 48 documentos):
  lector Haiku 48 doc × US$0,00385      = US$0,185
  árbitro Sonnet 15% × US$0,0147        = US$0,106
  ruteador + alertas + expediente + reintentos + verificación = US$0,925
  total US$1,22 × $950                  = $1.150 CLP

COGS/cliente/mes = 1.150 + 2.600 (WhatsApp) + 2.100 (infra) + 9.400 (soporte L1) = $15.250
Flota completa a 150 clientes (inferencia + infra) ≈ $847.500 CLP/mes ≈ US$890
```

### Qué hay que contratar

API de Anthropic · WhatsApp Business API (verificación de número + plantillas *utility*, 2–3 semanas) ·
Transbank/Flow · DTE (LibreDTE o Nubox) · tablet Android + impresora térmica para la portería.

**Previred y la Dirección del Trabajo no tienen API pública para terceros.** En v1 el contratista sube el
comprobante y el F30-1, y la IA los lee — que es exactamente el trámite que hoy hace a mano. La cédula chilena
trae un **PDF417** que se lee con la cámara, offline y sin convenio.

### Qué está falseado en el demo

No hay backend (todo es un objeto JS: si recargas, se reinicia) · la IA no llama a ningún modelo (las
extracciones y las confianzas están escritas a mano para mostrar el caso limpio y el caso dudoso) · el lector
no lee PDF417 (es un temporizador de 700 ms) · los WhatsApp no se envían · la caché offline es un booleano ·
el expediente no genera PDF · empresas, RUT, faenas y personas son inventados.

**Lo que sí es real:** el motor de reglas (`evaluar()` es la lógica que iría a producción), los documentos y
exámenes exigidos, y el mecanismo del F30-1 con deuda previsional bloqueando a una empresa completa.

Para producción: ~17 semanas de 2 desarrolladores. Los exámenes ocupacionales son **datos de salud** (Ley 19.628):
el diseño lo asume desde el día 1, no se parcha después.

---

## Archivos

```
index.html        Landing: el problema a las 06:12, las 4 zonas, el lector en vivo, precios, FAQ
demo/index.html   La consola: portería, bandeja IA, cartera, vencimientos, expediente
negocio.html      ICP, mandante vs contratista con aritmética, TAM/SAM/SOM, competencia, precio, canales
roadmap.html      6 hitos con criterios de muerte, MRR en 3 escenarios, caja, embudo, probabilidad
stack.html        Datos, 5 agentes, APIs, env vars, costo mensual, qué está falseado
torniqua.css      El sistema visual (credencial / control de acceso)
```

Empieza por el demo: escanea el bus completo, arregla el examen de Quilodrán en la bandeja de documentos
y vuelve a escanearlo.
