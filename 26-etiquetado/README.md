# Etiquaria: el reglamento de rotulado, hecho código

**Carpeta:** `26-etiquetado` · **Dominio:** etiquaria.com (rdap.verisign.com -> HTTP 404, disponible, 2026-07-18; alternativas verificadas: porcionia.com, rotulida.com, nutrogia.com) · **Estado:** prototipo

## El problema

Desde la Ley 20.606 y el Reglamento Sanitario de los Alimentos (DS 977/96, con los límites del DS 13/2015), todo alimento envasado que supere los umbrales debe llevar los sellos negros "ALTO EN", dimensionados y ubicados según la cara principal del envase. El laboratorio le entrega a la fábrica los nutrientes por 100 g; lo que viene después es una cadena de reglas deterministas que nadie en una PYME sabe aplicar con confianza: formato de la declaración (art. 115), cuáles de los cuatro sellos corresponden (art. 120 bis: sólidos 275 kcal / 400 mg sodio / 10 g azúcares / 4 g grasas saturadas por 100 g; líquidos 70 / 100 / 5 / 3 por 100 ml), tamaño del sello por superficie de cara principal, y las prohibiciones que arrastra cada sello (venta en colegios, publicidad a menores de 14: Ley 20.606 arts. 6 y 7, Ley 20.869). Equivocarse es sumario sanitario, rechazo del lote en recepción del supermercado, o recall.

## El producto

De la receta o el informe de laboratorio, Etiquaria: (1) arma la declaración nutricional; (2) determina cada sello citando el artículo y el límite que lo gatilla; (3) entrega la etiqueta lista para imprenta con la geometría legal del sello para el envase elegido; (4) corre el simulador de reformulación ("cuántos gramos de azúcar por 100 g hay que bajar para soltar el sello, y qué le hace eso al costo de receta"); (5) vigila el Diario Oficial y re-verifica los SKUs cuando el reglamento cambia. Todo queda en el **libro del SKU**: la historia de rotulado que se le muestra a la SEREMI en una fiscalización.

**La decisión central de arquitectura:** las reglas corren como CÓDIGO (`motor-rsa`, puro, versionado, con tests contra el texto del decreto). El modelo de lenguaje redacta, explica, extrae y clasifica; tiene prohibido calcular umbrales o geometría. Foso: determinismo + vigilancia + libro. Un chatbot alucina umbrales con total seguridad, no sabe qué versión rige, no imprime geometría y no deja evidencia: ninguna fábrica imprime 40.000 envases sobre la palabra de un chatbot.

## Negocio (resumen)

- **ICP:** jefe de calidad o dueño de fábrica de alimentos PYME (5-100 personas): mermeladas, granolas, jugos, pan envasado, marcas regionales. Segundo segmento: supermercados regionales con marcas propias.
- **Precios:** $29.000 por SKU verificado · Vigía $59.000/mes (15 SKUs) · Fábrica $149.000/mes (60 SKUs, API) · Marca propia desde $390.000/mes. Ticket promedio asumido: $95.000/mes.
- **Mercado (estimaciones con supuestos declarados):** TAM Chile ~5.000 fábricas que rotulan → $5.700 M CLP/año; SAM ~2.000 PYMEs + 30 cadenas → $2.420 M; SOM 24 meses: 60 clientes → $68 M ARR (2,8% del SAM). Extensión: Perú (octógonos 2019) y México (NOM-051) con el mismo motor y otra tabla.
- **Economía unitaria:** CAC ~$282.000 (derivado de herramientas + ferias + medio SDR / 16 clientes año 1), LTV ~$2,1 M (churn 4%/mes → 25 meses de vida), payback 3,3 meses, margen bruto ~97% (costo variable $2.800/cliente/mes, ver stack).
- **Canales, rankeados:** laboratorios bromatológicos como referidores (timing perfecto), ferias y gremios (Espacio Food & Service, Chilealimentos), outbound quirúrgico LinkedIn/WhatsApp, SEO long-tail regulatorio, imprentas de etiquetas, Google Ads de rescate.
- **Competencia honesta:** asesores de etiquetado (los convertimos en canal de casos borde), laboratorios (aliados, no competencia), Genesis R&D/Trustwell (caro, en inglés, sin la letra chica chilena), y Excel + el PDF del DS 977 (el titular real del puesto).
- **Qué lo mataría:** un verificador estatal gratuito; que el mercado compre firma humana y no software; que Chile solo sea muy chico y la extensión llegue tarde; que un software PYME instalado lo agregue como módulo.

## Roadmap (resumen)

Arranque agosto 2026, un fundador, colchón ~$32 M CLP. Hitos con criterio de muerte: M2 validación con 5 design partners (muerte: el motor no puede ser determinista o nadie presta datos ni gratis) → M4 primer pago (muerte: 3 meses de demos sin que nadie pague $29.000) → M9 diez clientes (muerte: churn >8%/mes o CAC >$600.000) → M14 venta repetible (muerte: consultoría disfrazada) → M18 caja mensual positiva, valle -$30,2 M en M17 (muerte: el valle pasa el colchón) → M24 decisión levantar / bootstrapear / salir (60 clientes, MRR $5,7 M, ARR $68 M en escenario base; pesimista $2,4 M; optimista $11,2 M de MRR).

**Probabilidad de éxito:** ~20-30% condicional a lograr 10 clientes pagando entre el mes 9 y 12 (incondicional ~15-25%). Derivación: no existe tasa base limpia para "SaaS regulatorio PYME Chile" (declarado); anclas imperfectas: ~1 de cada 5 SaaS B2B con primeros clientes llega a US$1M ARR (orden de magnitud de la industria) y ~50% de supervivencia a 5 años de empresas chilenas nuevas (orden de magnitud, Ministerio de Economía). Ajustes arriba: presupuesto existente, dolor agudo con fecha, canal laboratorios, producto auditable. Ajustes abajo: mercado chico, venta PYME lenta, riesgo de verificador estatal, dependencia del fundador en ventas.

## Stack (resumen)

- **Motor:** paquete TypeScript puro `motor-rsa`, sin red ni IA, versionado y amarrado por hash a `reglamento_versiones`; tests por artículo (casos límite, líquidos/sólidos, envases <30 cm², sin añadidos).
- **Datos:** Postgres (empresas, usuarios, skus, informes_lab, verificaciones = el libro inmutable, reglamento_versiones, eventos_regulatorios, simulaciones, suscripciones).
- **Agentes:** lector de PDFs de laboratorio (claude-sonnet-5, structured outputs, humano confirma); redactor/copiloto (claude-sonnet-5, sólo números del motor, post-chequeo numérico); vigía del Diario Oficial (claude-haiku-4-5-20251001, recall alto, revisión humana); analista de impacto regulatorio (claude-opus-4-8, pocas veces al año, siempre con humano). **El modelo nunca calcula umbrales ni geometría.**
- **APIs:** Diario Oficial (scraping) + LeyChile/BCN, Anthropic, Flow/Webpay, OpenFactura (DTE), Postmark, Cloudflare R2.
- **Costo mensual a 50 clientes:** ~US$146 ≈ $138.700 CLP (inferencia US$72 + infra US$74) → $2.800 por cliente. Es el número que negocio.html descuenta del margen.
- **Falseado en el demo:** 4 productos precargados, tabla de tamaños de sello marcada como estimación, libro en memoria, sin cuentas/pagos/vigilancia, precios de ingredientes estimados.

## Umbrales usados (fuentes)

Art. 120 bis RSA (DS 977/96, incorporado por DS 13/2015), etapa final vigente desde junio 2019. Tabla de tamaños de sello: implementada desde el DS 13/2015 con valores marcados como estimación en `demo/motor.js` (el motor productivo exige la tabla oficial transcrita con doble control). Prohibiciones: Ley 20.606 arts. 6-8 y Ley 20.869.
