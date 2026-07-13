# business_ideas

Quince productos de negocio, cada uno llevado hasta una web que se puede recorrer:
landing, demo funcionando, plan de marketing, roadmap a 24 meses y la arquitectura
que habría que configurar para que existiera de verdad.

**En vivo:** https://lelelilo-studios.github.io/business_ideas/

Los quince dominios `.com` y `.cl` están verificados como libres (RDAP de Verisign,
NIC Chile) al 13 de julio de 2026. Eso caduca: verifica de nuevo antes de comprar.

## PYME chilena

El comprador es la dueña que contesta el WhatsApp mientras atiende. Ticket bajo,
venta rápida, y un competidor que casi siempre es Excel o un cuaderno.

| # | Marca | Dominio | Problema |
|---|------|---------|----------|
| 01 | [Adjudate](01-licitaciones/) | adjudate.com | Las PYMEs se pierden licitaciones en Mercado Público; postular es manual y contra reloj |
| 02 | [Tinoria](02-cobranza/) | tinoria.com | Facturas impagas que hay que perseguir a mano |
| 03 | [Zurcia](03-agenda/) | zurcia.com | No-shows y reservas por WhatsApp en servicios locales |
| 04 | [Mermata](04-inventario/) | mermata.com | Restaurantes y minimarkets sobre-compran y botan merma |
| 05 | [Antefirma](05-contratos/) | antefirma.com | Se firman contratos que nadie alcanzó a leer |
| 06 | [Conserjo](06-arriendos/) | conserjo.com | Administrar arriendos: filtrar, cobrar, reparar |
| 07 | [Rutamo](07-terreno/) | rutamo.com | Despacho y cotización en oficios de terreno |
| 08 | [Contralta](08-laboral/) | contralta.com | Cumplimiento laboral PYME: contratos, finiquitos, Previred |
| 09 | [Kilonauta](09-despacho/) | kilonauta.com | E-commerce malabareando Chilexpress, Starken y Blue Express |
| 10 | [Talonio](10-contabilidad/) | talonio.com | Boletas y gastos → contabilidad → F29 |

## Minería

El comprador tiene plata y miedo, pero compra lento: piloto, homologación,
procurement, 12-18 meses. Por eso cuatro de las cinco no le venden a la minera,
sino a la contratista que ya está adentro de la faena.

| # | Marca | Dominio | Problema |
|---|------|---------|----------|
| 11 | [Cintavia](11-correas/) | cintavia.com | Una correa cortada detiene la faena entera; hoy la inspección es un tipo con una linterna |
| 12 | [Cuasio](12-seguridad/) | cuasio.com | El casi-accidente es el único aviso antes de la muerte, y es justo el que nadie reporta |
| 13 | [Torniqua](13-contratistas/) | torniqua.com | El camión parado en portería porque a un operador se le venció el examen de altura |
| 14 | [Cianota](14-permisos/) | cianota.com | Permitología: un permiso se atrasa un mes y la puesta en marcha se corre tres |
| 15 | [Freatia](15-agua/) | freatia.com | En Atacama el agua es la licencia para operar, y el relave es el pasivo que no deja dormir |

## Consumo

La única idea que no le vende a una empresa: le vende a una familia. El niño juega,
el papá paga y el banco termina financiando la cuenta.

| # | Marca | Dominio | Problema |
|---|------|---------|----------|
| 16 | [Finakids](16-finakids/) | finakids.com | Educación financiera para niños: recibe la mesada el día 1 y tiene que llegar a fin de mes |

## Autónomas

Cinco ideas elegidas por una sola razón: se venden, se entregan, se cobran y se soportan
sin que una persona intervenga. Cada una declara un [`autopilot.json`](_kit/autopilot.md)
y es operada por el sistema de abajo.

| # | Marca | Dominio | Problema |
|---|------|---------|----------|
| 17 | [Fedatia](17-datos-empresas/) | fedatia.com | Un RUT entra, sale la empresa entera — y cada campo declara de qué fuente vino |
| 18 | [Pregonia](18-alertas/) | pregonia.com | El Estado publicó 613 avisos hoy; tres te tocan |
| 19 | [Cotejia](19-precios/) | cotejia.com | Te bajaron el precio a las 3 de la mañana. Tú te enteras el viernes |
| 20 | [Fonalta](20-recepcion/) | fonalta.com | El teléfono que siempre contesta — y que se declara IA en los primeros 5 segundos |
| 21 | [Caprato](21-inmuebles/) | caprato.com | Arriendo × 12 ÷ precio no es la rentabilidad. La mayoría de las semanas no te avisa nada |

## El sistema: [Cuantario](00-sistema/)

`cuantario.com` — La máquina que comercializa, mide y decide sobre todas las ideas de acá,
y sobre las que vengan. Veintiuna ideas, un dueño, cero personas en el loop.

- **El juez** aplica los criterios de muerte que cada idea firmó *antes* de recibir el primer
  peso. No puede editarlos ni levantarse un tope.
- **El kernel de cumplimiento** bloquea la acción antes de que toque una API: nada de cuentas
  falsas, reseñas inventadas ni llamadas en frío con voz sintética. El canal es el activo.
- **El acoplamiento** es un solo archivo: [`autopilot.json`](_kit/autopilot.md). Cualquier idea
  futura se enchufa escribiéndolo.
- **Se enchufan** 8 de las 16 viejas del todo, 3 a medias, y las 5 de minería no.

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
