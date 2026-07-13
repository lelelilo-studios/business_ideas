# El contrato

Todo agente que construye una idea sigue este documento al pie de la letra.
Ninguna regla aquí es decorativa: cada una existe porque su ausencia rompe algo.

---

## 0. Alcance

- Escribes **sólo dentro de tu carpeta** (`NN-slug/`). Nada fuera de ella.
- **Nunca** ejecutas `git`. Ni `add`, ni `commit`, ni `push`. La integración es serial y la hace el orquestador; diez agentes escribiendo en el mismo repo es una pila de conflictos garantizada.
- **Nunca** editas `_kit/` ni el `index.html` de la raíz.
- No renombras tu carpeta. El slug es un id interno fijo. Tu **marca** es otra cosa y la inventas tú.

## 1. Stack: HTML/CSS/JS a mano, sin build

Sin compilación, sin npm, sin framework, sin CDN. El navegador ejecuta los archivos directamente.

- Permitido: Google Fonts, y librerías pequeñas **copiadas dentro del repo** si de verdad hacen falta.
- Prohibido: cualquier cosa cargada desde un CDN en tiempo de página. Un CDN caído es un sitio caído, y estos sitios se revisan en vivo.
- Los gráficos se dibujan en **SVG inline escrito a mano**. No hay librería de charts.

## 2. Entregables (los cinco archivos)

| Archivo | Qué es |
|---|---|
| `index.html` | Landing. El problema en las palabras del cliente, cómo funciona, el producto mostrado **en vivo** (no screenshots), precios en CLP, FAQ, CTA. |
| `demo/index.html` | El producto funcionando. Se recorre **el flujo de negocio completo** de punta a punta, con estado en el cliente y datos mock realistas. Esta es la pieza que tiene que sentirse real. |
| `negocio.html` | Plan de marketing y go-to-market (§5). |
| `roadmap.html` | Día 1 → 24 meses: hitos, gráficos, criterios de muerte, probabilidad de éxito (§6). |
| `stack.html` | Qué habría que configurar para que esto funcione de verdad (§7). |
| `meta.json` | Metadata para el hub (§8). |
| `README.md` | negocio + roadmap + stack en texto, para quien lee el repo. |

Navegación idéntica en las cinco páginas: `← Ideas` · Producto · Demo · Negocio · Roadmap · Arquitectura.
(`← Ideas` apunta a `../index.html`.) En móvil colapsa a un menú.

## 3. Marca y dominio (requisito duro)

Tu marca **no es válida hasta que el dominio esté verificado como libre**.

```bash
./_kit/check-domain.sh minombre otronombre tercero
```

`.com` disponible es el filtro principal; `.cl` se reporta también.

Ojo: casi todo está tomado. `cobrafy` y `zentaro` ya tienen `.com` dueño. Esto te empuja a nombres realmente
acuñados y memorables, que es exactamente lo que queremos — no vas a llamar al producto "Cobranza".

En `meta.json` registras el nombre elegido, **el código HTTP como evidencia**, y **3 alternativas también verificadas**
(si dos agentes eligen la misma marca, el orquestador resuelve desde esa lista sin re-ejecutarte).

## 4. Responsive (requisito duro)

**Mobile-first de verdad**, escrito así desde la primera línea. No un layout de escritorio apretado al final.

- Los estilos base son el layout **de teléfono** (390px). Se sube a tablet y desktop con `min-width`. Nunca al revés.
- Se verifica en **390px, 768px y 1440px**.
- **El demo tiene que servir en un teléfono.** Un dashboard que sólo funciona a 1440px incumple el contrato.
- Targets táctiles ≥44px. Nada que dependa sólo de `:hover`. Cero scroll horizontal del body a cualquier ancho
  (lo ancho —tablas, gráficos— scrollea dentro de su propia caja: usa `.scroll-x`).

## 5. `negocio.html`

- **Cliente objetivo (ICP)** — quién exactamente: segmento, tamaño, quién firma, quién lo usa, dónde ya está.
- **Tamaño de mercado** — TAM/SAM/SOM para Chile **con la aritmética a la vista y cada supuesto declarado**. Después la extensión global.
- **Posicionamiento y cuña** — el segmento cabecera de playa que ganas primero, y por qué ése.
- **Competencia** — competidores reales, con nombre (incluyendo "lo hacen en Excel / en un cuaderno", que suele ser el verdadero titular del puesto) y una diferenciación honesta.
- **Precio y economía unitaria** — tramos en CLP, CAC estimado, LTV, payback, margen bruto **neto del costo de inferencia de IA que declaras en `stack.html`**. Las dos páginas tienen que cuadrar.
- **Canales de adquisición**, rankeados, específicos de Chile donde importe: outbound LinkedIn/WhatsApp, gremios (ASECH, Cámara de Comercio, Sofofa, CChC), **contadores y software PYME como canal de distribución** (Defontana, Bsale, Nubox), Mercado Público, SEO long-tail en español, Google/Meta con CPL estimado, ferias.
- **Uso de IA en el marketing mismo** — dónde ayuda de verdad y dónde no. Tú decides y lo justificas. "IA en todo" no es una respuesta aceptable.
- **Primeros 90 días** — secuencia de lanzamiento concreta.
- **Qué mataría esto** — el riesgo honesto que mata el negocio.

## 6. `roadmap.html`

Seis hitos del día 1 al mes 24: validación con design partners → primer cliente pagando → primeros 10 → venta repetible → escala de canal → punto de decisión del mes 24 (levantar / bootstrapear / matar).

Cada hito declara: fecha objetivo, qué es cierto si lo lograste, caja requerida, headcount, y —lo más importante— su **criterio de muerte**: la observación que debería hacerte parar. *Un roadmap sin criterios de muerte es una carta al Viejito Pascuero.*

**Gráficos** (SVG inline a mano). Carga la skill **`dataviz`** antes de escribir la primera línea de código de gráfico.
- Trayectoria de MRR/ARR a 24 meses, tres escenarios (pesimista / base / optimista), cada uno movido por supuestos **declarados** de tasa de cierre, ticket y churn.
- Caja: quema vs ingresos, con el valle de runway marcado.
- El embudo de adquisición o la curva de retención por cohorte — la que sea la restricción real de *tu* producto.
- Línea de tiempo de hitos con los criterios de muerte marcados.

### Probabilidad de éxito — la regla de honestidad

Un número único y confiado ("68% de éxito") es autoridad inventada, y vuelve el documento inútil para comparar ideas. El método obligatorio:

1. **Declara una clase de referencia** con una tasa base real y citada (ej.: qué fracción de SaaS B2B llega a US$1M ARR; conversión seed→Serie A; supervivencia de PYMEs chilenas según CORFO / Ministerio de Economía / Start-Up Chile).
2. **Declara los ajustes** para *esta* idea: hacia arriba por una cuña afilada, un canal de distribución que ya existe, un presupuesto que el cliente ya gasta; hacia abajo por ciclo de venta largo, canal capturado por el titular, dependencia regulatoria.
3. **Da el resultado como rango**, condicional a los hitos ("~25–35%, condicional a llegar a M3 en el mes 12"), con la derivación a la vista.
4. Si la tasa base honestamente no se conoce, **dilo**. No la inventes.

**Regla de números (en negocio y roadmap, no negociable):** toda cifra o está citada, o está etiquetada como estimación **con su aritmética mostrada**. "El mercado es de US$4,2B" sin derivación es exactamente el tell que estamos evitando. Quien lee esto va a decidir en qué idea gastar dos años de su vida.

## 7. `stack.html`

Nada de infraestructura se aprovisiona. Se **documenta**:

- Modelo de datos (tablas/campos).
- Los agentes de IA: qué modelo, qué prompt, qué herramientas, con qué se conectan. (Modelos Claude actuales: Opus 4.8 `claude-opus-4-8`, Sonnet 5 `claude-sonnet-5`, Haiku 4.5 `claude-haiku-4-5-20251001`.)
- APIs de terceros y qué hay que contratar: WhatsApp Business API, SII/DTE, Transbank, Twilio, couriers, etc.
- Variables de entorno.
- **Costo mensual estimado** (inferencia + infra), con la aritmética. Este número es el que `negocio.html` descuenta del margen.
- **Qué está falseado en el demo** y qué haría falta para que fuera real.
- La evidencia de disponibilidad del dominio.

## 8. `meta.json`

```json
{
  "folder": "02-cobranza",
  "brand": "Nombre",
  "domain": "nombre.com",
  "domain_evidence": "rdap.verisign.com -> HTTP 404 (disponible), 2026-07-12",
  "alternates": ["otro.com", "tercero.com", "cuarto.com"],
  "tagline": "Una línea, sin humo.",
  "category": "Fintech PYME",
  "market": "Chile → LatAm",
  "icp": "PYME de servicios, 10-80 empleados, factura a 30-60 días",
  "price_clp": "Desde $49.000/mes",
  "accent": "#c2410c",
  "problem": "Una frase con el dolor real.",
  "status": "prototipo"
}
```

## 9. Diseño: el contrato anti-slop

Diez ideas no pueden parecer diez páginas de la misma plantilla. Antes de escribir CSS, **declara tu dirección de arte** en un comentario de cabecera (editorial suizo, técnico/terminal, print cálido, broadsheet denso en datos, …) y sé consecuente con ella.

**Prohibido**
- Héroes con degradado violeta→azul. Glassmorphism.
- Emojis usados como iconos.
- Copy tipo "Potencia tu negocio con IA".
- La grilla de tres columnas con cuadraditos redondeados de icono.
- Inter/Poppins por defecto (elígelas sólo si de verdad son la decisión correcta, y dilo).
- Lorem ipsum. Logos de empresas reales como clientes falsos. Contadores de stats sin fuente.

**Obligatorio**
- Un pairing tipográfico deliberado. Una paleta contenida con **un** acento.
- Copy real en es-CL, pegado al problema real. Nada de relleno.
- Datos mock creíbles: nombres chilenos, RUT bien formateado (`76.543.210-K`), CLP como `$1.290.000`, comunas que existen.
- Iconos SVG inline, de trazo, dibujados por ti.
- Contraste AA. Foco de teclado visible. `prefers-reduced-motion` respetado.

## 10. Antes de darte por terminado

- [ ] Las 5 páginas cargan y la navegación entre ellas funciona en las cinco.
- [ ] Cada control del demo **hace algo**. Nada decorativo que no responda.
- [ ] Se ve bien a 390px, 768px y 1440px. El demo se usa en teléfono.
- [ ] Cero requests externos que no sean Google Fonts (`grep -rn "https://" .` y revisa cada uno).
- [ ] El dominio está verificado y la evidencia está en `meta.json` y en `stack.html`.
- [ ] Precio → costo de IA → curva de ingresos: las tres páginas cuadran entre sí.
- [ ] El roadmap tiene criterios de muerte y la probabilidad es un **rango con derivación**.
