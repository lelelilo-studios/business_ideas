# business_ideas

Diez productos de negocio, cada uno llevado hasta una web que se puede recorrer:
landing, demo funcionando, plan de marketing, roadmap a 24 meses y la arquitectura
que habría que configurar para que existiera de verdad.

**En vivo:** https://lelelilo-studios.github.io/business_ideas/

Foco: problemas reales de PYMEs chilenas, con extensión al mercado global.

| # | Idea | Problema |
|---|------|----------|
| 01 | [Licitaciones](01-licitaciones/) | Las PYMEs se pierden licitaciones en Mercado Público; postular es manual y contra reloj |
| 02 | [Cobranza](02-cobranza/) | Facturas impagas que hay que perseguir a mano |
| 03 | [Agenda](03-agenda/) | No-shows y reservas por WhatsApp en servicios locales |
| 04 | [Inventario](04-inventario/) | Restaurantes y minimarkets sobre-compran y botan merma |
| 05 | [Contratos](05-contratos/) | Se firman contratos que nadie alcanzó a leer |
| 06 | [Arriendos](06-arriendos/) | Administrar arriendos: filtrar, cobrar, reparar |
| 07 | [Terreno](07-terreno/) | Despacho y cotización en oficios de terreno |
| 08 | [Laboral](08-laboral/) | Cumplimiento laboral PYME: contratos, finiquitos, Previred |
| 09 | [Despacho](09-despacho/) | E-commerce malabareando Chilexpress, Starken y Blue Express |
| 10 | [Contabilidad](10-contabilidad/) | Boletas y gastos → contabilidad → F29 |

## Cómo está hecho

HTML/CSS/JS a mano. Sin build, sin framework, sin CDN — se abre el archivo y funciona.
`_kit/` tiene el reset compartido, la escala tipográfica y [el contrato](_kit/README.md)
que siguen las diez ideas. Cada idea es dueña de su propia identidad visual.

Nada de infraestructura está aprovisionado: cada idea documenta en su página
*Arquitectura* qué base de datos, agentes de IA y APIs habría que configurar,
y qué está falseado en el demo.

## Local

```bash
python3 -m http.server 8000
```
