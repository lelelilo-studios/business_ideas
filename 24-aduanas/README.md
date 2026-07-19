# Aforqua (24-aduanas)

**La partida arancelaria correcta, con respaldo que se firma.**

Un importador PYME vive o muere por un código de ocho dígitos que nadie en su
empresa entiende: la partida arancelaria. Clasificar mal significa pagar derechos
de más por años sin que nadie reclame, o una formulación de cargos de Aduanas con
diferencias retroactivas (hasta 3 años), multa según la Ordenanza y carga retenida
en puerto. Y casi siempre el código lo eligió, en cinco minutos, un agente de
aduana que ese día tenía cuarenta despachos más.

## El producto

El importador describe el producto (ficha técnica, fotos, composición). Entonces:

1. **La IA extrae atributos, no códigos.** Cada atributo con su cita textual en la
   ficha. El esquema de salida del modelo no tiene ningún campo donde quepa una
   partida: la prohibición es arquitectura, no un prompt.
2. **Un árbol de reglas determinista clasifica.** Las Reglas Generales de
   Interpretación (RGI 1 a 6) y las notas legales, implementadas como código
   versionado con suite de casos dorados. Misma ficha, mismo código, siempre, con
   cada paso del recorrido a la vista.
3. **El resultado sale citado.** La partida con las resoluciones anticipadas y
   dictámenes de clasificación que la respaldan (corpus público pero disperso,
   curado y al día). Un verificador de citas en código impide citar documentos
   que no existan.
4. **La plata, calculada.** Derechos ad valorem, IVA, preferencia TLC con su regla
   de origen, y el ahorro frente al régimen general.
5. **El dossier firmable.** El documento que el agente de aduana revisa y firma.
   No reemplazamos al agente: le entregamos el trabajo hecho.

Además: **vigilancia** (arancel, TLC y resoluciones nuevas cruzados a diario
contra los SKU del cliente) y el **libro del importador** (el historial de
clasificaciones defendidas, que es exactamente lo que se muestra en una
fiscalización).

Fosos: **determinismo + libro + vigilancia**. Un chatbot da un código plausible
sin cita ni responsabilidad; la sección "El test del LLM" de `negocio.html`
desarrolla la comparación honesta.

## Negocio (resumen; detalle en negocio.html)

- **ICP**: importador PYME recurrente (ferretería importadora, retail
  especializado, e-commerce con contenedores; 200-2.000 SKU) y agencias de aduana
  de 3-20 personas como herramienta y como canal.
- **Precios**: dossier suelto $45.000 · Plan Importador $79.000/mes (8 dossiers,
  vigilancia 300 SKU, libro) · Plan Agencia $290.000/mes.
- **Mercado** (supuestos declarados): 25.000 importadores recurrentes × 40% con
  carga compleja = SAM 10.000 empresas ≈ $9.480M/año + ~230 agencias ≈ $800M.
  SAM total ≈ $10.280M CLP/año. SOM a 3 años ≈ $212M ARR.
- **Economía unitaria**: margen bruto 88% ($69.880/cliente/mes neto de IA e
  infra); CAC $250.000-$400.000; payback 4-6 meses; LTV/CAC ≈ 6-11×.
- **Canales**: agencias como canal, outbound con auditoría gratis del historial
  (los registros de importación son públicos), SEO programático por partida,
  gremios, contadores, Google Ads en cola larga.
- **Riesgo principal**: dolor agudo pero infrecuente → churn post-susto. Por eso
  vigilancia y libro viven en el plan mensual.

## Roadmap (resumen; detalle y gráficos en roadmap.html)

Seis hitos con criterio de muerte cada uno: validación con design partners (M3),
primer pago (M4), primeros 10 (M8), venta repetible (M12: CAC < $400.000),
escala de canal vía agencias (M18), decisión del mes 24 (levantar / bootstrapear
/ vender el corpus / cerrar con MRR < $2,5M).

Escenario base: MRR $7,4M al mes 24 (78 cuentas, ticket promedio $95.000, churn
2,5%). Déficit acumulado ≈ $88M CLP, cruce de caja estimado mes 26.

**Probabilidad de éxito**: 15-25% de superar $200M ARR al año 3, condicional a
venta repetible en el mes 12. Derivación: base ~20% (tasa declarada como
estimación: no hay medición pública limpia de SaaS B2B que llega a US$1M ARR;
se usa el tramo alto porque el umbral es menor) más ajustes arriba (presupuesto
existente, canal preexistente, activo acumulativo) y abajo (churn estructural,
venta gremial lenta, dependencia regulatoria, LLM generalistas mejorando).

## Stack (resumen; detalle en stack.html)

Postgres + pgvector; scrapers diarios de Aduanas, Diario Oficial y datos
abiertos; cuatro agentes Claude (extractor sonnet-5, bibliotecario haiku-4-5,
redactor sonnet-5 con verificador de citas en código, revisor opus-4-8 para
ambigüedades que siempre terminan en decisión humana). Costo de inferencia:
≈$570 por dossier, ≈$1.520 por cuenta/mes de vigilancia, ≈US$840/mes total con
100 clientes (~10% del MRR). El demo es 100% cliente: datos mock marcados,
árbol precargado en JS, sin backend.

## Marca y dominio

**aforqua.com**: rdap.verisign.com → HTTP 404 (disponible) y aforqua.cl
disponible, verificado con `_kit/check-domain.sh` el 2026-07-18. Alternativas
verificadas el mismo día: partiqua.com, glosavia.com, aranquia.com. El nombre
viene de "aforo", el acto aduanero de clasificar y valorar la mercancía.

## Archivos

- `index.html` : landing con el clasificador compacto en vivo
- `demo/index.html` : flujo completo (clasificar → dossier, vigilancia, libro)
- `negocio.html` : ICP, mercado con aritmética, competencia, test del LLM, canales
- `roadmap.html` : hitos con criterios de muerte, gráficos SVG, probabilidad
- `stack.html` : modelo de datos, agentes, costos, qué está falseado, dominio
