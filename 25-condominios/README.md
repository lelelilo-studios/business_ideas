# Prorratia (25-condominios)

**El libro de administración del condominio, llevado como exige la Ley 21.442.** Cada gasto con su boleta adjunta y visible para todos los copropietarios; prorrateo por alícuota calculado por código determinista (la IA jamás suma); gastos comunes emitidos y cobrados solos el día 5, con recordatorios, convenios de pago e interés según reglamento; fondo de reserva contabilizado con su historial; citaciones y actas generadas con las formalidades legales verificadas por checklist; y el libro multianual que hace auditable el traspaso al próximo administrador en un link.

- **Marca / dominio:** Prorratia · prorratia.com (RDAP Verisign HTTP 404 = disponible, 2026-07-18; prorratia.cl también disponible). Alternativas verificadas: alicuotia.com, rendicia.com, alicuora.com, prorratea.com.
- **Estado:** prototipo. Demo completo en cliente con la comunidad ficticia "Mirador del Parque" (Ñuñoa, 24 unidades, alícuotas que suman 100,000%).

## El problema

La mediana de los condominios chilenos (20 a 80 unidades) la administra un amateur: un vecino con Excel o un administrador unipersonal que lleva ocho comunidades por WhatsApp. Resultado: gastos comunes que nadie puede auditar, morosidad que financia el edificio involuntariamente, asambleas citadas sin formalidades (legalmente impugnables) y peleas. La Ley 21.442 impone desde 2022 obligaciones reales: rendición documentada, fondo de reserva (5%), citaciones y actas en regla, plan de emergencia.

## Negocio (resumen de negocio.html)

- **ICP de dos lados:** (A) el comité que quiere auditar y cumplir; (B) el administrador chico (3-10 comunidades) que quiere verse profesional y escalar. Cabecera de playa: comités autoadministrados de Santiago.
- **Mercado (aritmética declarada):** ~1,4M unidades en copropiedad (Censo 2017 INE ~1,1M departamentos + casas y post-2017, estimación) ⇒ TAM Chile $8.736M CLP/año (1,4M × $520 × 12) ≈ US$9,2M. SAM $3.494M (40% de unidades en comunidades 20-80 mal servidas). SOM 24 meses: 150 comunidades ⇒ $42,3M/año (1,2% del SAM).
- **Precio:** $590/unidad/mes comités (mín. $19.900); $450 administradores desde 150 unidades (mín. $59.000); traspaso histórico $190.000 por una vez. Comunidad tipo 45 unidades ⇒ ARPA $23.500/mes.
- **Economía unitaria:** costo variable $3.040/comunidad (ver stack) ⇒ margen bruto 87%; CAC combinado $110.000; payback 5,4 meses; LTV ≈ $1,23M a churn 1%/mes acotado a 60 meses ⇒ LTV/CAC ≈ 11.
- **Competencia honesta:** Excel + transferencias (el titular real), ComunidadFeliz (líder, fuerte en cobro/comunicación; nuestra cuña es cumplimiento auditable, no guerra frontal), Edipro/Kastor (administradoras medianas-grandes), y no hacer nada.
- **El test del LLM:** un chat redacta un acta, pero no sostiene el libro (años de estado), no actúa solo (cobranza el día 5) y no garantiza determinismo auditable (prorrateo). Foso: libro + actuación + determinismo.
- **Canales:** SEO legal long-tail con plantillas gratis; el libro visto por 45 unidades como viralidad; outbound al Registro Nacional de Administradores; inmobiliarias que entregan edificios nuevos; Ads chico (CPL estimado $6.000-12.000).
- **Riesgos que matan:** (R1) el administrador informal ve el libro como amenaza; (R2) ComunidadFeliz lanza "modo cumplimiento"; (R3) la venta por asamblea alarga el ciclo sobre 90 días.

## Roadmap (resumen de roadmap.html)

| Hito | Mes | Criterio de muerte |
|---|---|---|
| H1: 5 design partners | 0-2 | 60 reuniones sin 5 comités dispuestos |
| H2: primera comunidad pagando | 4 | nadie convierte tras 2 ciclos de asamblea |
| H3: 10 pagando + 1 admin Pro | 8 | churn > 3%/mes |
| H4: 40 comunidades, venta repetible | 12 | CAC > $300.000 o ciclo > 90 días |
| H5: 90 comunidades, canal Pro = 50% altas | 18 | administradores < 25% de las altas |
| H6: 150 comunidades, decisión | 24 | MRR < $2M con canales probados |

Escenarios de MRR mes 24: pesimista $1,3M / base $3,5M / optimista $7,5M (supuestos de cierre, ticket y churn declarados en la página). Capital $55M (fundador/cercanos $40M + CORFO Semilla Inicia $15M, sujeto a adjudicación); valle de caja $3,1M en el mes 24 con breakeven proyectado ~m27.

**Probabilidad de éxito: ~20-30%**, condicional a H3 en el mes 8 (sube a ~40-50% si se cumple). Derivación: sin tasa base pública para el caso exacto (dicho explícitamente); anclas imperfectas (supervivencia a 5 años de empresas chilenas ~50%, benchmark SaaS 20-30% como supuesto declarado); ajustes arriba (gasto ya existe, cuña legal, churn bajo) y abajo (incumbente, ciclo por asamblea, dos lados, TAM acotado) se compensan.

## Stack (resumen de stack.html)

- **Núcleo:** monolito (Rails/Django) + Postgres + S3; montos en enteros; libro de doble registro con auditoría append-only (sin UPDATE/DELETE).
- **Agentes:** Digitalizador de boletas (claude-haiku-4-5-20251001, JSON schema + confirmación humana); Escribano legal y Respondedor del copropietario (claude-sonnet-5, solo lectura, cifras inyectadas desde la base); Redactor de cobranza (Haiku 4.5); Auditor de plantillas trimestral (claude-opus-4-8, batch).
- **IA prohibida en:** prorrateo, intereses, saldos, conciliación y quórum (código determinista con tests); ningún agente escribe en el libro.
- **APIs:** Khipu, Transbank Webpay, WhatsApp Business API, SII/DTE (fase 2), SES, firma electrónica simple, Anthropic.
- **Costo mensual por comunidad (150 comunidades):** inferencia $858 + WhatsApp $1.430 + infra $760 ≈ **$3.048** ⇒ el margen 87% de negocio.html cuadra.
- **Falseado en el demo:** todo corre en el navegador; digitalización, envíos y pagos simulados; checklist legal simplificado al reglamento tipo; datos ficticios con formato real (RUT, CLP, alícuotas suman 100%).

## Dirección de arte

"Concreto / acta de asamblea": tema claro con suelo gris hormigón frío (#E6E8E7), tinta grafito, un solo acento verde profundo #0D5E36 (el color de "al día"), Archivo (neogrotesca) + IBM Plex Mono con cifras tabulares para cada peso y alícuota. Gráficos SVG a mano según la skill dataviz (rampa ordinal verde validada con validate_palette.js, 2026-07-18).
