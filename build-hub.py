#!/usr/bin/env python3
"""Genera el index.html del hub a partir de los meta.json de las 10 ideas.
Correr desde la raíz del repo:  python3 build-hub.py"""
import json, glob, html

ideas = [json.load(open(f)) for f in sorted(glob.glob("*/meta.json"))]
assert len(ideas) == 15, f"esperaba 15 ideas, encontré {len(ideas)}"

# Dos familias: las 10 de PYME y las 5 de minería. Se separan porque el comprador
# es otro (una dueña que contesta el WhatsApp vs. un gerente de operaciones), el
# ticket es otro y el ciclo de venta es otro.
pyme   = [d for d in ideas if int(d["folder"][:2]) <= 10]
minera = [d for d in ideas if int(d["folder"][:2]) >= 11]

def e(s):
    return html.escape(str(s))

def card(d):
    num = d["folder"].split("-")[0]
    f = d["folder"]
    return f'''
    <article class="idea" style="--accent:{e(d['accent'])}">
      <a class="idea__hit" href="{f}/index.html" aria-labelledby="t{num}"></a>
      <div class="idea__num">{num}</div>
      <div class="idea__body">
        <h2 class="idea__brand" id="t{num}">{e(d['brand'])}</h2>
        <p class="idea__domain">{e(d['domain'])}<span class="idea__free">libre</span></p>
        <p class="idea__tagline">{e(d['tagline'])}</p>
        <p class="idea__problem">{e(d['problem'])}</p>
        <dl class="idea__meta">
          <div><dt>Rubro</dt><dd>{e(d['category'])}</dd></div>
          <div><dt>Mercado</dt><dd>{e(d['market'])}</dd></div>
          <div><dt>Precio</dt><dd>{e(d['price_clp'])}</dd></div>
        </dl>
        <nav class="idea__links" aria-label="{e(d['brand'])}">
          <a href="{f}/index.html">Producto</a>
          <a href="{f}/demo/index.html" class="is-demo">Demo</a>
          <a href="{f}/negocio.html">Negocio</a>
          <a href="{f}/roadmap.html">Roadmap</a>
          <a href="{f}/stack.html">Arquitectura</a>
        </nav>
      </div>
    </article>'''

def section(titulo, bajada, items):
    return f'''
  <section class="fam">
    <header class="fam__head">
      <h2>{titulo}</h2>
      <p>{bajada}</p>
      <span class="fam__n mono">{len(items)}</span>
    </header>
    <div class="grid">
{"".join(card(d) for d in items)}
    </div>
  </section>'''

cards = (
    section("PYME chilena",
            "El comprador es la dueña que contesta el WhatsApp mientras atiende. "
            "Ticket bajo, venta rápida, y un competidor que casi siempre es Excel o un cuaderno.",
            pyme)
    + section("Minería",
              "El comprador tiene plata y miedo, pero compra lento: piloto, homologación, procurement. "
              "Por eso cuatro de las cinco no le venden a la minera, sino a la contratista que ya está adentro.",
              minera)
)

doc = f'''<!doctype html>
<html lang="es-CL">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>15 ideas de negocio — lelelilo studios</title>
<meta name="description" content="Quince productos —diez para PYMEs chilenas, cinco para la minería— cada uno con demo funcionando, plan de marketing, roadmap a 24 meses y la arquitectura que habría que configurar.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="_kit/reset.css">
<link rel="stylesheet" href="_kit/tokens.css">
<style>
/* ------------------------------------------------------------------
   Dirección de arte del hub: "sala de control", deliberadamente opuesta
   a las diez ideas. Casi todas eligieron papel crema; si el índice fuera
   papel también, el conjunto se leería como un solo sitio de 50 páginas.
   Acá: tinta oscura, retícula técnica, mono para los datos duros, y el
   acento de cada idea usado como su única firma de color.
   ------------------------------------------------------------------ */
:root {{
  --ink:#100F0E; --ink-2:#181614; --line:#2E2A26;
  --paper:#EDE7DE; --mute:#9A9088; --mute-2:#6E655E;
}}
body {{
  background:var(--ink); color:var(--paper);
  font-family:'Space Grotesk',system-ui,sans-serif;
  font-size:var(--step-0);
}}
.mono {{ font-family:'JetBrains Mono',ui-monospace,monospace; }}

/* -- masthead -- */
.masthead {{ padding-block:var(--sp-xl) var(--sp-l); border-bottom:1px solid var(--line); }}
.eyebrow {{
  font-family:'JetBrains Mono',monospace; font-size:var(--step--1);
  letter-spacing:.14em; text-transform:uppercase; color:var(--mute-2);
  display:flex; gap:var(--sp-s); flex-wrap:wrap;
}}
.masthead h1 {{
  font-size:var(--step-5); font-weight:700; letter-spacing:-.03em;
  margin-block:var(--sp-s) var(--sp-m); text-wrap:balance;
}}
.masthead h1 em {{ font-style:normal; color:var(--mute); }}
.lede {{ font-size:var(--step-1); color:var(--mute); max-width:56ch; text-wrap:pretty; }}

/* -- nota -- */
.note {{
  margin-block:var(--sp-l); padding:var(--sp-m); background:var(--ink-2);
  border-left:2px solid var(--line);
}}
.note p {{ color:var(--mute); max-width:var(--measure); }}
.note p + p {{ margin-top:var(--sp-s); }}
.note strong {{ color:var(--paper); font-weight:500; }}

/* -- familia (PYME / Minería) -- */
.fam {{ margin-block:var(--sp-2xl); }}
.fam__head {{
  display:grid; grid-template-columns:1fr auto; align-items:baseline;
  gap:var(--sp-s); padding-bottom:var(--sp-s);
  border-bottom:2px solid var(--paper);
}}
.fam__head h2 {{
  font-size:var(--step-3); font-weight:700; letter-spacing:-.02em;
  grid-column:1;
}}
.fam__head p {{
  grid-column:1; grid-row:2; color:var(--mute); max-width:62ch;
  font-size:var(--step--1); line-height:1.6; margin-top:var(--sp-2xs);
}}
.fam__n {{
  grid-column:2; grid-row:1; color:var(--mute-2); font-size:var(--step-2);
}}

/* -- grilla: móvil primero, una columna -- */
.grid {{
  list-style:none; display:grid; gap:1px;
  background:var(--line); border-bottom:1px solid var(--line);
}}
.idea {{
  position:relative; background:var(--ink);
  display:grid; grid-template-columns:auto 1fr; gap:var(--sp-s);
  padding:var(--sp-m) var(--gutter);
  transition:background .18s ease;
}}
.idea:hover, .idea:focus-within {{ background:var(--ink-2); }}
/* la tarjeta entera es clickeable, pero los enlaces de abajo siguen siendo
   targets reales: el hit va detrás (z-index 0) y los links delante (z-index 1) */
.idea__hit {{ position:absolute; inset:0; z-index:0; }}
.idea__hit:focus-visible {{ outline:2px solid var(--accent); outline-offset:-4px; }}

.idea__num {{
  font-family:'JetBrains Mono',monospace; font-size:var(--step-1); font-weight:500;
  color:var(--accent); line-height:1.1; padding-top:.15em;
}}
.idea__brand {{ font-size:var(--step-2); font-weight:700; letter-spacing:-.02em; }}
.idea__domain {{
  font-family:'JetBrains Mono',monospace; font-size:var(--step--1);
  color:var(--mute-2); margin-top:.15em;
  display:flex; align-items:center; gap:var(--sp-2xs); flex-wrap:wrap;
}}
.idea__free {{
  color:var(--accent); border:1px solid currentColor; border-radius:2px;
  padding:.1em .4em; font-size:.85em; letter-spacing:.06em; text-transform:uppercase;
}}
.idea__tagline {{
  font-size:var(--step-1); margin-top:var(--sp-s); text-wrap:pretty;
  max-width:48ch;
}}
.idea__problem {{
  color:var(--mute); margin-top:var(--sp-2xs); max-width:60ch;
  font-size:var(--step--1); line-height:1.6;
}}
.idea__meta {{
  margin-top:var(--sp-m); display:grid; gap:var(--sp-2xs);
  font-size:var(--step--1);
}}
.idea__meta > div {{ display:grid; grid-template-columns:6.5rem 1fr; gap:var(--sp-2xs); }}
.idea__meta dt {{
  font-family:'JetBrains Mono',monospace; color:var(--mute-2);
  font-size:.85em; letter-spacing:.06em; text-transform:uppercase; padding-top:.25em;
}}
.idea__meta dd {{ color:var(--paper); }}

.idea__links {{
  position:relative; z-index:1;
  margin-top:var(--sp-m); display:flex; flex-wrap:wrap; gap:var(--sp-2xs);
}}
.idea__links a {{
  display:inline-flex; align-items:center; min-height:44px; padding-inline:var(--sp-xs);
  border:1px solid var(--line); border-radius:2px;
  font-size:var(--step--1); text-decoration:none; color:var(--mute);
  transition:border-color .15s ease, color .15s ease;
}}
.idea__links a:hover {{ border-color:var(--accent); color:var(--paper); }}
.idea__links a.is-demo {{ color:var(--paper); border-color:var(--accent); }}
.idea__links a.is-demo:hover {{ background:var(--accent); color:var(--ink); }}

/* -- colofón -- */
.colofon {{
  border-top:1px solid var(--line); padding-block:var(--sp-xl) var(--sp-2xl);
  color:var(--mute-2); font-size:var(--step--1);
}}
.colofon h2 {{
  font-family:'JetBrains Mono',monospace; font-size:var(--step--1);
  letter-spacing:.14em; text-transform:uppercase; color:var(--mute);
  margin-bottom:var(--sp-s);
}}
.colofon p {{ max-width:var(--measure); line-height:1.7; }}
.colofon p + p {{ margin-top:var(--sp-s); }}
.colofon a {{ color:var(--paper); text-decoration-color:var(--mute-2); text-underline-offset:3px; }}

/* -- tablet -- */
@media (min-width:48em) {{
  .idea {{ grid-template-columns:4rem 1fr; padding:var(--sp-l) var(--gutter); }}
  .idea__num {{ font-size:var(--step-2); }}
  .idea__meta > div {{ grid-template-columns:7rem 1fr; }}
}}
/* -- desktop: dos columnas, porque el problema de cada idea merece leerse -- */
@media (min-width:75em) {{
  .grid {{ grid-template-columns:1fr 1fr; }}
}}
</style>
</head>
<body>
<div class="container">

  <header class="masthead">
    <p class="eyebrow"><span>lelelilo studios</span><span>·</span><span>15 ideas</span><span>·</span><span>2026</span></p>
    <h1>Quince negocios que podrían existir<em>, llevados hasta donde se pueden tocar.</em></h1>
    <p class="lede">Cada idea es un problema real —diez de la PYME chilena, cinco de la minería— con
      un producto que funciona en el navegador, un plan de marketing, un roadmap a 24 meses y la
      arquitectura que habría que configurar para que dejara de ser una maqueta.</p>
  </header>

  <div class="note">
    <p><strong>Nada de esto está conectado a nada.</strong> No hay base de datos, ni agentes de IA
      corriendo, ni APIs contratadas. Los demos funcionan con datos falsos —creíbles, pero falsos— y
      cada idea documenta en su página de <em>Arquitectura</em> exactamente qué habría que configurar,
      cuánto costaría al mes y qué parte está fingida.</p>
    <p><strong>Los quince dominios están verificados como libres</strong> al 13 de julio de 2026
      (RDAP de Verisign para <span class="mono">.com</span>, NIC Chile para <span class="mono">.cl</span>).
      Eso caduca: si vas a usar uno, verifícalo de nuevo antes de comprarlo.</p>
    <p><strong>Los números son estimaciones, y se muestran con su aritmética.</strong> Ninguna idea
      afirma un tamaño de mercado sin decir de dónde lo sacó, y ninguna promete un éxito seguro:
      varias concluyen, en su propio roadmap, que el escenario base no cruza punto de equilibrio
      en 24 meses.</p>
  </div>

  <main class="grid">
{cards}
  </main>

  <footer class="colofon">
    <h2>Colofón</h2>
    <p>HTML, CSS y JavaScript escritos a mano. Sin build, sin framework, sin CDN: se abre el archivo
      y funciona. Los gráficos son SVG dibujado a mano, no una librería. La única petición externa
      son las tipografías de Google.</p>
    <p>Las diez ideas se construyeron en paralelo, cada una por un agente distinto, siguiendo
      <a href="_kit/README.md">un contrato común</a> que fija el piso de accesibilidad, el mobile-first,
      la verificación de dominio y la regla que más importa: toda cifra va citada o va con su
      derivación a la vista.</p>
    <p><a href="https://github.com/lelelilo-studios/business_ideas">Código en GitHub</a></p>
  </footer>

</div>
</body>
</html>
'''

open("index.html", "w").write(doc)
print(f"hub generado: {len(ideas)} ideas")
for d in ideas:
    print(f"  {d['folder']:18} {d['brand']:11} {d['domain']}")
