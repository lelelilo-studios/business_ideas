# Tarifana (23-energia)

**La cuenta de la luz, leída línea por línea, todos los meses.**

Una PYME con frío, hornos o máquinas paga entre $800.000 y $8.000.000 al mes de electricidad, y nadie en la empresa ha leído la boleta más allá del total. La boleta esconde decisiones que cuestan plata cada mes: potencia contratada que ya no calza con la demanda real, la opción tarifaria equivocada para el perfil de consumo, recargos por energía reactiva, y errores de lectura o facturación que nadie reclama. Cambiar de opción tarifaria es una solicitud escrita a la que el cliente regulado tiene derecho, y casi nadie sabe que existe.

**El producto:** el cliente reenvía el PDF de la boleta (o Tarifana lo descarga de la oficina virtual). El motor tarifario reconstruye cada línea contra el pliego publicado, simula las cinco opciones tarifarias con el consumo real de 12 meses, marca anomalías y recargos, y cada mes entrega una de dos cosas: "todo en orden", o la carta exacta para cambiar de opción, ajustar potencia o reclamar. Cada peso recuperado queda en un libro de ahorro verificado contra la boleta siguiente.

- Marca y dominio: **tarifana.com** (rdap.verisign.com -> HTTP 404, disponible, 2026-07-18; tarifana.cl también libre). Alternativas verificadas: amperva.com, vatiora.com, empalmia.com.
- Estado: **prototipo**. Demo completo en `demo/` (boleta desarmada, simulador de opciones, hallazgos, carta generada, libro de ahorro), con motor tarifario determinista en `motor.js` y pliego referencial declarado.

## Negocio (resumen de negocio.html)

- **ICP:** PYME electrointensiva regulada (panaderías industriales, frigoríficos, metalmecánica, hoteles, minimarkets con frío), 5-80 empleados, cuenta $800.000-$8.000.000/mes. Firma el dueño o administración y finanzas.
- **Mercado (aritmética a la vista en la página):** ~260.000 PYMEs formales (orden de magnitud SII, estimación) × ~13% electrointensivas ≈ 34.000 empresas. TAM ≈ $26.100M/año con ARPU año 1 de $768.000. SAM (Enel + CGE + Chilquinta, ~85%) ≈ 29.000 empresas. SOM a 24 meses: 170 clientes ≈ $130,6M/año run-rate.
- **Precio:** Medidor $24.000 / Tablero $44.000 / Subestación $79.000 mensuales + 20% del ahorro verificado durante los primeros 12 meses de cada hallazgo. Caso del demo: Tarifana cuesta $1.451.254 el año 1 y el cliente se queda con $3.693.016 de ahorro (2,0% de su gasto eléctrico anual).
- **Economía unitaria:** ticket promedio $39.000; costo variable ~$900/cliente/mes (IA $240 presupuestados + WhatsApp/correo); margen bruto 95% usado en LTV; CAC estimado $180.000 (aritmética declarada); payback 4,9 meses; churn base 2,5%; LTV/CAC 8,2.
- **Canales (rankeados):** contadores y software PYME (Defontana, Nubox, Bsale) → gremios (Fechipan, ASIMET, hoteleros, ASECH) → outbound WhatsApp con el gancho "mándanos tu boleta" → SEO long-tail + calculadora pública → Google Ads de nicho → Mercado Público más adelante.
- **El test del LLM (por qué no lo hace ChatGPT):** el dato (pliegos versionados desde la fuente), la vigilancia (la boleta llega aunque nadie pregunte), el determinismo (el modelo tiene prohibido calcular; el motor codificado hace el 100% de la aritmética y cuadra la boleta al peso), y el libro (el ahorro verificado acumulado es un activo). Foso = dato + vigilancia + determinismo + libro.
- **Qué lo mataría:** una reforma tarifaria que asigne la opción óptima automáticamente (riesgo letal, monitoreado); la indiferencia del dueño (conversión < 25% con hallazgo en mano); tasa de hallazgo material < 40%.

## Roadmap (resumen de roadmap.html)

Seis hitos con criterio de muerte cada uno:

1. **H1 (mes 3)** Validación: 10 design partners, ≥ 60% con hallazgo material. Muerte: < 40% de hallazgo o parsing sin automatizar.
2. **H2 (mes 4)** Primer cliente pagando. Muerte: nadie paga tras 3 meses de veredictos gratis.
3. **H3 (mes 8)** 10 clientes. Muerte: conversión < 25% o churn temprano > 5%. La probabilidad de la idea está condicionada a este hito.
4. **H4 (mes 13)** Venta repetible: 30+ clientes, canal indirecto ≥ 30% de cierres, CAC ≤ $250.000. Muerte: CAC > $400.000 sostenido o caja bajo 1 mes de gastos.
5. **H5 (mes 18)** ~90 clientes, MRR $3,4M, caja positiva desde m16. Muerte: churn sostenido > 4% (sería un estudio one-shot disfrazado).
6. **H6 (mes 24)** ~170 clientes, MRR $6,6M + variable: levantar, bootstrapear o vender. Muerte permanente: la autoridad automatiza la asignación de opción tarifaria.

Escenarios MRR (ticket $39.000): base cierres 1→18/mes y churn 2,5% termina en $6,6M; pesimista $1,4M (muere por caja en m13); optimista $12,0M. Caja: $28M iniciales, valle de $3,7M en el mes 15. **Probabilidad de éxito: ~20-30% de llegar vivo y rentable al mes 24, condicional a pasar H3 en el mes 8** (derivación completa en la página: sin tasa base citable, se declara; anclas imperfectas + ajustes al alza y a la baja declarados).

## Stack (resumen de stack.html)

- **Regla de diseño:** la IA lee y redacta; el código calcula. El motor tarifario es TypeScript determinista con tests; ningún número generado por un modelo llega al cliente, a una carta ni al libro.
- **Agentes:** extractor de boletas (claude-haiku-4-5-20251001, doble pasada + cuadratura al peso obligatoria), redactor de veredictos y cartas (claude-sonnet-5, cifras inmutables del motor), vigía de pliegos (claude-sonnet-5, doble extracción + aprobación humana; además alerta temprana del riesgo regulatorio).
- **APIs:** Anthropic, Postmark inbound (ingesta por correo), WhatsApp Business API vía BSP, Transbank/Flow, Supabase/Postgres + S3, scraping con consentimiento de oficinas virtuales (frágil; plan B: el reenvío por correo).
- **Costos (aritmética en la página):** inferencia ≈ US$0,17/cliente/mes, presupuestados $240; variable total ~$900/cliente/mes; infra fija US$120 ≈ $114.000/mes. Estos números cuadran con el margen declarado en negocio.html.
- **Falseado en el demo:** pliego referencial (magnitudes plausibles, no vigentes), regla de reactiva simplificada al 1% por centésima, calificación punta con proxy, exceso de potencia a 2x como convención, sin parser real de PDF, empresa y refacturación ficticias.
