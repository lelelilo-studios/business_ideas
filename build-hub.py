#!/usr/bin/env python3
"""Genera el index.html del hub a partir de los meta.json de las 15 ideas.
Correr desde la raíz del repo:  python3 build-hub.py

El HTML y el CSS del hub viven acá dentro, en el f-string de abajo.
Ojo: es un f-string, así que las llaves del CSS van dobladas: {{ }}.
"""
import json, glob, html, re, colorsys

todo    = [json.load(open(f)) for f in sorted(glob.glob("*/meta.json"))]
rank    = json.load(open("ranking/ranking.json"))
por_folder = {r["folder"]: r for r in rank["ideas"]}
sistema = next(d for d in todo if d.get("kind") == "sistema")
ideas   = [d for d in todo if d.get("kind") != "sistema"]
assert len(ideas) == 21, f"esperaba 21 ideas, encontré {len(ideas)}"

# Dos familias: las 10 de PYME y las 5 de minería. Se separan porque el comprador
# es otro (una dueña que contesta el WhatsApp vs. un gerente de operaciones), el
# ticket es otro y el ciclo de venta es otro. En la página esa diferencia no se
# cuenta sólo en un párrafo: cambia el suelo (tinta cálida → grafito frío), cambia
# la densidad (diez tarjetas a dos columnas → cinco tarjetas anchas) y cambia la
# ficha de la familia. Se tiene que *sentir* que entraste a otra pieza.
pyme      = [d for d in ideas if int(d["folder"][:2]) <= 10]
minera    = [d for d in ideas if 11 <= int(d["folder"][:2]) <= 15]
consumo   = [d for d in ideas if int(d["folder"][:2]) == 16]
autonomas = [d for d in ideas if int(d["folder"][:2]) >= 17]


# ---------------------------------------------------------------- color derivado
# El acento de cada idea es su firma, pero ocho de los diez acentos de PYME son
# rojos oscuros (#A81E12, #A8232E, #14624A…) que sobre tinta casi negra dan 2,5:1:
# ilegibles y fuera de AA. En vez de tocar los meta.json (que son de otros agentes),
# el generador deriva un acento seguro: mismo tono, misma saturación, subiendo la
# luminosidad hasta cruzar 4,6:1 contra el fondo de la tarjeta. Los cinco acentos
# de minería ya pasan y salen intactos.

def _rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))

def _lum(c):
    f = lambda v: v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = map(f, c)
    return .2126 * r + .7152 * g + .0722 * b

def contrast(a, b):
    la, lb = _lum(_rgb(a)), _lum(_rgb(b))
    hi, lo = max(la, lb), min(la, lb)
    return (hi + .05) / (lo + .05)

def _hex(c):
    return "#%02X%02X%02X" % tuple(round(max(0, min(1, x)) * 255) for x in c)

def accent_safe(accent, bg, target=4.6):
    """Sube la luminosidad conservando tono y saturación hasta cumplir AA."""
    r, g, b = _rgb(accent)
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    for i in range(101):
        cand = _hex(colorsys.hls_to_rgb(h, min(1.0, l + i / 100 * (1 - l)), s))
        if contrast(cand, bg) >= target:
            return cand
    return "#FFFFFF"

def on_accent(acc):
    """Tinta o papel sobre el acento, la que contraste más (botón Demo)."""
    return "#0B0A09" if contrast("#0B0A09", acc) >= contrast("#FFFFFF", acc) else "#FFFFFF"

def rgba(acc, a):
    r, g, b = (round(x * 255) for x in _rgb(acc))
    return f"rgba({r},{g},{b},{a})"


# ------------------------------------------------------------- datos derivados
# `price_clp` trae la tarifa completa ("Desde $7.900/unidad/mes (1-5 unidades) ·
# $5.900 (6-15) · $3.900 (16+…)"). En un índice eso no se lee. Mostramos el primer
# tramo textual —sin reescribirlo, para no falsear el precio— y avisamos que hay más.

def price_head(s):
    return s.split(" · ")[0].strip()

def price_has_more(s):
    return len(s.split(" · ")) > 1

def e(s):
    return html.escape(str(s))


# --------------------------------------------------------------------- tarjeta
BADGE = '<a class="idea__rank v--{v}" href="ranking/index.html" title="Puesto {p} de 21 en el ranking - el test del LLM: {v}"><b>#{p}</b><span>{v}</span></a>'

def card(d, bg, show_market=False):
    num = d["folder"].split("-")[0]
    f = d["folder"]
    acc = accent_safe(d["accent"], bg)
    style = (f"--acc:{acc};--acc-on:{on_accent(acc)};"
             f"--acc-soft:{rgba(acc, .10)};--acc-line:{rgba(acc, .35)}")
    more = ('<span class="idea__more">+ tramos</span>'
            if price_has_more(d["price_clp"]) else "")
    # El puesto y el veredicto del test del LLM viajan con la tarjeta: son el dato
    # que decide si la idea vale la pena. Esconderlos en otra pagina seria cobarde.
    r = por_folder.get(d['folder'])
    rk = BADGE.format(p=r['puesto'], v=r['test_llm']) if r else ''
    # En minería el mercado es parte de la tesis: el TAM chileno es chico y la
    # plata está afuera. En PYME no aporta nada al índice, así que no se muestra.
    market = (f'''
          <dl class="idea__ext mono">
            <div><dt>Mercado</dt><dd>{e(d['market'])}</dd></div>
          </dl>''' if show_market else "")
    return f'''
      <article class="idea" style="{style}">
        <a class="idea__hit" href="{f}/index.html" tabindex="-1" aria-hidden="true"></a>
        <p class="idea__num mono">{num}</p>
        {rk}
        <div class="idea__head">
          <p class="idea__cat mono">{e(d['category'])}</p>
          <h3 class="idea__brand"><a href="{f}/index.html">{e(d['brand'])}</a></h3>
          <p class="idea__domain mono">{e(d['domain'])}<span class="idea__free">libre</span></p>{market}
        </div>
        <div class="idea__pitch">
          <p class="idea__tagline">{e(d['tagline'])}</p>
          <p class="idea__problem">{e(d['problem'])}</p>
        </div>
        <div class="idea__foot">
          <p class="idea__price mono">{e(price_head(d['price_clp']))}{more}</p>
          <a class="idea__demo" href="{f}/demo/index.html">
            <span>Ver el demo</span>
            <svg class="idea__arrow" viewBox="0 0 20 12" width="20" height="12" aria-hidden="true" focusable="false">
              <path d="M0 6h18M13 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </a>
          <nav class="idea__docs mono" aria-label="Documentos de {e(d['brand'])}">
            <a href="{f}/index.html">Producto</a>
            <a href="{f}/negocio.html">Negocio</a>
            <a href="{f}/roadmap.html">Roadmap</a>
            <a href="{f}/stack.html">Arquitectura</a>
          </nav>
        </div>
      </article>'''


# --------------------------------------------------------------------- familia
def facts(rows):
    return "".join(
        f'<div><dt>{k}</dt><dd>{v}</dd></div>' for k, v in rows)

def family(fid, orden, titulo, bajada, rows, items, bg, show_market=False):
    return f'''
    <section class="fam fam--{fid}" id="{fid}" aria-labelledby="h-{fid}">
      <div class="container">
        <header class="fam__head">
          <p class="fam__kicker mono"><span class="fam__tick"></span>Familia {orden} de 4</p>
          <h2 class="fam__title" id="h-{fid}">{titulo}</h2>
          <p class="fam__count mono"><b>{len(items):02d}</b><span>ideas</span></p>
          <p class="fam__lede">{bajada}</p>
          <dl class="fam__facts mono">{facts(rows)}</dl>
        </header>
        <div class="ideas">
{"".join(card(d, bg, show_market) for d in items)}
        </div>
      </div>
    </section>'''


def banda_ranking(rk):
    top = rk["ideas"][:5]
    n_ap = sum(1 for i in rk["ideas"] if i["test_llm"] == "aprueba")
    n_ju = sum(1 for i in rk["ideas"] if i["test_llm"] == "justo")
    n_re = sum(1 for i in rk["ideas"] if i["test_llm"] == "reprueba")
    filas = "".join(
        FILA.format(
            p=i["puesto"], b=e(i["brand"]), s=i["puntaje"], v=i["test_llm"],
            f=i["folder"], q=e(i["por_que_no_chatgpt"]))
        for i in top)
    marca = {r["folder"]: r["brand"] for r in rk["ideas"]}
    no = ", ".join(e(marca.get(x, x)) for x in rk["no_construiria"])
    return BANDA.format(filas=filas, ap=n_ap, ju=n_ju, re=n_re, no=no)


FILA = (
    '<li class="rk__row v--{v}">'
    '<a href="{f}/index.html"><span class="rk__p mono">{p}</span>'
    '<span class="rk__b">{b}</span>'
    '<span class="rk__q">{q}</span>'
    '<span class="rk__s mono">{s}</span>'
    '<span class="rk__v mono">{v}</span></a></li>')

BANDA = """
    <section class="rk" id="ranking" aria-labelledby="h-rk">
      <div class="container">
        <p class="rk__kicker mono">El veredicto · las 21, ordenadas</p>
        <div class="rk__top">
          <h2 class="rk__title" id="h-rk">&iquest;Por qu&eacute; te pagar&iacute;an a ti, y no US$20 al mes a ChatGPT?</h2>
          <p class="rk__lede">Es la pregunta que mata a la mitad de las ideas de IA, as&iacute; que
            cada una de las 21 la rinde como examen. El hallazgo, despu&eacute;s de leerlas juntas:
            <em>el foso nunca est&aacute; en el modelo — est&aacute; en el cable que va del modelo al mundo.</em></p>
        </div>
        <ol class="rk__list">{filas}</ol>
        <dl class="rk__facts mono">
          <div><dt>Aprueban</dt><dd>{ap} de 21 — dato que el modelo no tiene, vigilancia, actuaci&oacute;n o libro.</dd></div>
          <div><dt>Raspando</dt><dd>{ju} — aprueban el literal, con una defensa d&eacute;bil o de vida corta.</dd></div>
          <div><dt>Reprueba</dt><dd>{re} — Antefirma. Su propio negocio.html ya lista a ChatGPT como competidor a $0.</dd></div>
          <div><dt>No construir&iacute;a</dt><dd>{no} — las tres fallan por techo de mercado, no por ejecuci&oacute;n.</dd></div>
        </dl>
        <a class="rk__cta" href="ranking/index.html"><span>Ver el ranking completo</span>
          <svg viewBox="0 0 20 12" width="20" height="12" aria-hidden="true" focusable="false"><path d="M0 6h18M13 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
        </a>
      </div>
    </section>"""


def banda_sistema(d):
    acc = d["accent"]
    return f"""
    <section class="sis" id="sistema" aria-labelledby="h-sis" style="--acc:{acc};--acc-on:{on_accent(acc)}">
      <div class="container">
        <p class="sis__kicker mono"><span class="sis__dot"></span>El sistema · opera las 21</p>
        <div class="sis__top">
          <div>
            <h2 class="sis__title" id="h-sis">{e(d['brand'])}</h2>
            <p class="sis__domain mono">{e(d['domain'])}<span class="idea__free">libre</span></p>
          </div>
          <p class="sis__tagline">{e(d['tagline'])}</p>
        </div>
        <p class="sis__problem">{e(d['problem'])}</p>
        <dl class="sis__facts mono">
          <div><dt>El juez</dt><dd>Aplica los criterios de muerte que cada idea firmó <em>antes</em> de recibir el primer peso. No puede editarlos, ni levantarse un tope.</dd></div>
          <div><dt>El kernel</dt><dd>Bloquea la acción antes de que toque una API. Nada de cuentas falsas, reseñas inventadas ni llamadas en frío con voz sintética.</dd></div>
          <div><dt>Se enchufan</dt><dd>8 de las 16 viejas, del todo. 3 a medias. Las 5 de minería, no. Las 5 nuevas nacen enchufadas.</dd></div>
          <div><dt>Se paga solo</dt><dd>Con 15 ideas, no con 2. La cuenta cómoda está descartada en su propia página.</dd></div>
        </dl>
        <nav class="sis__links" aria-label="{e(d['brand'])}">
          <a class="sis__cta" href="00-sistema/demo/index.html"><span>Abrir el tablero</span>
            <svg viewBox="0 0 20 12" width="20" height="12" aria-hidden="true" focusable="false"><path d="M0 6h18M13 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
          </a>
          <span class="sis__docs mono">
            <a href="00-sistema/index.html">Qué es</a>
            <a href="00-sistema/arquitectura.html">Arquitectura</a>
            <a href="00-sistema/integracion.html">Integración</a>
            <a href="00-sistema/economia.html">Economía</a>
          </span>
        </nav>
      </div>
    </section>"""


BG_PYME, BG_MINERA, BG_CONSUMO, BG_AUTO = "#191612", "#111922", "#181428", "#12171B"

secciones = (
    banda_sistema(sistema)
    + banda_ranking(rank)
    + family(
        "pyme", "01", "PYME chilena",
        "Diez problemas que hoy se resuelven en Excel, en un cuaderno o no se resuelven. "
        "Se venden solos: la dueña prueba el demo y decide.",
        [("Comprador", "La dueña. Contesta el WhatsApp mientras atiende el mesón."),
         ("Ticket", "Decenas de miles de pesos al mes."),
         ("Ciclo de venta", "Días o semanas. Sin comité, sin procurement."),
         ("El rival real", "Excel, un cuaderno, o simplemente nada.")],
        pyme, BG_PYME)
    + family(
        "mineria", "02", "Minería",
        "Cinco problemas de faena, donde una hora de planta detenida cuesta más que "
        "un año de cualquiera de las diez de arriba. El comprador tiene plata y miedo, "
        "pero compra lento.",
        [("Comprador", "El gerente de operaciones, contra su presupuesto operacional."),
         ("Ticket", "De cientos de miles a millones de pesos al mes."),
         ("Ciclo de venta", "12 a 18 meses: piloto, homologación, procurement."),
         ("La cuña", "Cuatro de las cinco no le venden a la minera, sino a la contratista que ya está adentro.")],
        minera, BG_MINERA, show_market=True)
    + family(
        "consumo", "03", "Consumo",
        "La única idea del set que no le vende a una empresa: le vende a una familia. "
        "El niño juega, el papá paga y el banco termina financiando la cuenta — y esa "
        "cadena de tres es la idea, no un detalle del modelo.",
        [("Comprador", "El papá. Pero el que firma el cheque grande es el banco."),
         ("Ticket", "$4.990 la familia. $54 millones al año la marca."),
         ("Ciclo de venta", "Minutos con el papá. Cuatro a seis meses con el banco."),
         ("El rival real", "Que el niño se aburra y juegue otra cosa.")],
        consumo, BG_CONSUMO, show_market=True)
    + family(
        "autonomas", "04", "Autónomas",
        "Cinco ideas elegidas por una sola razón: se venden, se entregan, se cobran y se "
        "soportan sin que una persona intervenga. Son las que el sistema de arriba puede "
        "operar de verdad — y la razón por la que existe.",
        [("Comprador", "Se registra solo. Nunca habla con nadie, y no quiere hacerlo."),
         ("Entrega", "Software: una API, una alerta, una llamada. Nada físico."),
         ("El humano que queda", "Casi ninguno — y cada idea declara cuál, en vez de decir cero."),
         ("El cuello real", "No el CAC. La demanda: el mercado chileno es chico y lo dicen.")],
        autonomas, BG_AUTO, show_market=True)
)

doc = f'''<!doctype html>
<html lang="es-CL">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>21 ideas + el sistema que las opera — lelelilo studios</title>
<meta name="description" content="Quince productos —diez para PYMEs chilenas, cinco para la minería— cada uno con demo funcionando, plan de marketing, roadmap a 24 meses y la arquitectura que habría que configurar.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="_kit/reset.css">
<link rel="stylesheet" href="_kit/tokens.css">
<style>
/* ------------------------------------------------------------------
   Dirección de arte del hub: "sala de control", deliberadamente opuesta
   a las quince ideas. Casi todas eligieron papel claro; si el índice fuera
   papel también, el conjunto se leería como un solo sitio de 75 páginas.
   Acá: tinta oscura, retícula técnica, mono para todo dato duro, y el
   acento de cada idea usado como su única firma de color.

   Lo que cambia en esta versión, y por qué:

   1. LAS DOS FAMILIAS SON DOS PIEZAS DISTINTAS, no dos títulos. Cada una es
      una banda a sangre completa con su propio suelo: PYME en tinta cálida
      (#12100E), Minería en grafito frío (#0A0F14 — el mismo grafito que
      eligieron por su cuenta las ideas de faena). El ojo registra el cambio
      de temperatura antes de leer el encabezado. Además cambia la densidad:
      PYME va a dos columnas de tarjetas medianas (son diez, ticket bajo,
      se escanean); Minería va a una columna de tarjetas anchas y con aire
      (son cinco, ticket alto, pesan). La diferencia de familia es estructural.

   2. LAS TARJETAS SON OBJETOS, NO UNA LOSA. Antes eran filas pegadas con un
      filete de 1px compartido. Ahora cada una es un panel con borde, fondo
      propio, su lomo en el acento de la idea y un hueco real alrededor.

   3. JERARQUÍA DE LOS CINCO ENLACES, en tres niveles:
        · Demo      → botón sólido en el acento. Es lo que la gente quiere tocar.
        · Producto  → la tarjeta entera es el enlace (más el título de la marca).
        · Negocio / Roadmap / Arquitectura → fila de expediente, mono, discreta.
      Los cinco siguen ahí; dejaron de valer lo mismo.

   4. CONTRASTE. Los acentos oscuros de PYME (#A81E12, #14624A…) daban 2,5:1
      sobre la tinta. El generador deriva un acento del mismo tono que cruza
      4,6:1. Ver accent_safe() en build-hub.py.
   ------------------------------------------------------------------ */
:root {{
  --ink:#0B0A09;          /* suelo del masthead y del colofón */
  --paper:#EDE7DE;
  --mute:#9A9088;
  --mute-2:#8A7F76;
  --line:#2E2A26;
  --hair:#1E1B18;
  --sig:#EDE7DE;          /* color de señal de la sección actual */
  --bg:var(--ink);
  --card:#141210;
}}

html {{ scroll-behavior:smooth; }}
@media (prefers-reduced-motion:reduce) {{ html {{ scroll-behavior:auto; }} }}

body {{
  background:var(--ink); color:var(--paper);
  font-family:'Space Grotesk',system-ui,sans-serif;
  font-size:var(--step-0);
}}
.mono {{ font-family:'JetBrains Mono',ui-monospace,monospace; }}
:focus-visible {{ outline:2px solid var(--sig); outline-offset:2px; }}

.skip {{
  position:absolute; left:var(--sp-s); top:var(--sp-s); z-index:10;
  background:var(--paper); color:var(--ink); padding:var(--sp-2xs) var(--sp-s);
  text-decoration:none; transform:translateY(-200%);
}}
.skip:focus {{ transform:none; }}
.skip {{ min-height:44px; display:inline-flex; align-items:center; }}

/* ============================================================== masthead === */
.masthead {{ padding-block:var(--sp-xl) var(--sp-l); }}
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

/* -- el atajo a las dos familias: la única navegación de la página -- */
.jump {{
  margin-top:var(--sp-l);
  display:grid; gap:var(--sp-2xs);
  border-top:1px solid var(--line);
  padding-top:var(--sp-m);
}}
.jump a {{
  display:grid; grid-template-columns:auto 1fr auto; align-items:center;
  gap:var(--sp-s); min-height:56px; padding:var(--sp-2xs) var(--sp-s);
  text-decoration:none; border:1px solid var(--line); background:var(--hair);
  transition:border-color .15s ease, background .15s ease;
}}
.jump a:hover {{ border-color:var(--mute); background:#17140F; }}
.jump a:nth-child(2):hover {{ background:#0F1720; }}
.jump__n {{ font-size:var(--step-2); font-weight:700; color:var(--paper); line-height:1; }}
.jump__t {{ font-weight:500; }}
.jump__t small {{
  display:block; color:var(--mute); font-weight:400;   /* mute-2 no cruza AA sobre --hair */
  font-size:var(--step--1); margin-top:.15em;
}}
.jump svg {{ color:var(--mute-2); flex:none; }}
.jump a:hover svg {{ color:var(--paper); }}

/* ================================================================= aviso === */
.note {{
  margin-block:var(--sp-l) var(--sp-2xl);
  display:grid; gap:1px; background:var(--line);
  border:1px solid var(--line);
}}
.note > div {{ background:var(--ink); padding:var(--sp-m); }}
.note h2 {{
  font-family:'JetBrains Mono',monospace; font-size:var(--step--1); font-weight:500;
  letter-spacing:.12em; text-transform:uppercase; color:var(--paper);
  padding-bottom:var(--sp-2xs); margin-bottom:var(--sp-2xs);
  border-bottom:1px solid var(--line);
}}
.note p {{ color:var(--mute); font-size:var(--step--1); line-height:1.65; }}
.note em {{ font-style:normal; color:var(--paper); }}

/* =============================================================== familia === */
/* Cada familia es una banda a sangre completa con su propio suelo. El cambio
   de temperatura (tinta cálida → grafito frío) es lo que avisa que entraste
   a otra pieza, antes de que leas nada. */
/* ------------------------------------------------------------------
   La banda del ranking. El test del LLM es el dato que decide si una
   idea vale la pena, asi que va arriba, no escondido en otra pagina.
   Dos colores de veredicto y nada mas: verde aprueba, rojo reprueba,
   y "justo" no gasta un tercer color (es un disco hueco punteado).
   ------------------------------------------------------------------ */
.rk {{
  --bg:#0C0F14; --card:#141A21; --line:#26303B; --sig:#E6EBF0;
  --mute:#94A2AF; --ok:#3DD68C; --no:#FF6B5E;
  position:relative; background:var(--bg); color:var(--sig);
  border-block:1px solid var(--line); padding-block:var(--sp-xl);
}}
.rk__kicker {{
  font-size:var(--step--1); letter-spacing:.14em; text-transform:uppercase;
  color:var(--mute);
}}
.rk__top {{ margin-top:var(--sp-m); }}
.rk__title {{
  font-size:var(--step-3); font-weight:700; letter-spacing:-.02em;
  text-wrap:balance; max-width:22ch;
}}
.rk__lede {{
  margin-top:var(--sp-s); color:var(--mute); max-width:var(--measure);
  line-height:1.65; font-size:var(--step-0);
}}
.rk__lede em {{ color:var(--sig); font-style:italic; }}

.rk__list {{
  list-style:none; margin-top:var(--sp-l);
  display:grid; gap:1px; background:var(--line);
  border:1px solid var(--line);
}}
.rk__row {{ background:var(--card); }}
.rk__row a {{
  display:grid; grid-template-columns:auto 1fr auto; gap:var(--sp-2xs) var(--sp-s);
  align-items:baseline; padding:var(--sp-s) var(--sp-m);
  text-decoration:none; min-height:44px;
}}
.rk__row a:hover {{ background:color-mix(in srgb, var(--sig) 5%, transparent); }}
.rk__p {{
  grid-row:1 / span 2; align-self:center;
  font-size:var(--step-3); font-weight:700; color:var(--mute);
  min-width:2ch; text-align:right;
}}
.rk__b {{ font-weight:700; font-size:var(--step-1); color:var(--sig); }}
.rk__q {{
  grid-column:2; color:var(--mute); font-size:var(--step--1);
  line-height:1.55; text-wrap:pretty;
}}
.rk__s {{ grid-column:3; grid-row:1; color:var(--sig); font-size:var(--step-0); }}
.rk__v {{
  grid-column:3; grid-row:2; font-size:.72rem; letter-spacing:.08em;
  text-transform:uppercase; text-align:right;
}}
.rk__row.v--aprueba .rk__v {{ color:var(--ok); }}
.rk__row.v--reprueba .rk__v {{ color:var(--no); }}
.rk__row.v--justo .rk__v {{ color:var(--mute); }}
.rk__row.v--aprueba {{ box-shadow:inset 3px 0 0 var(--ok); }}
.rk__row.v--reprueba {{ box-shadow:inset 3px 0 0 var(--no); }}
.rk__row.v--justo {{ box-shadow:inset 3px 0 0 var(--mute); }}

.rk__facts {{
  margin-top:var(--sp-l); display:grid; gap:1px;
  background:var(--line); border:1px solid var(--line);
}}
.rk__facts > div {{ background:var(--card); padding:var(--sp-s) var(--sp-m); }}
.rk__facts dt {{
  color:var(--sig); font-size:.78rem; letter-spacing:.1em; text-transform:uppercase;
}}
.rk__facts dd {{
  color:var(--mute); font-size:var(--step--1); line-height:1.6;
  margin-top:var(--sp-3xs); font-family:'Space Grotesk',system-ui,sans-serif;
}}
.rk__cta {{
  margin-top:var(--sp-l);
  display:inline-flex; align-items:center; gap:var(--sp-2xs);
  min-height:44px; padding-inline:var(--sp-m);
  background:var(--sig); color:var(--bg); font-weight:500;
  text-decoration:none; border-radius:2px;
}}
.rk__cta:hover {{ filter:brightness(.92); }}

/* La insignia de puesto que viaja en cada tarjeta de idea. */
.idea__rank {{
  position:relative; z-index:1;
  display:inline-flex; align-items:center; gap:.4em;
  align-self:start; justify-self:end;
  padding:.25em .6em; border:1px solid var(--line);
  border-radius:2px; text-decoration:none;
  font-family:'JetBrains Mono',ui-monospace,monospace;
  font-size:.72rem; letter-spacing:.06em; text-transform:uppercase;
  color:var(--mute-2); white-space:nowrap;
}}
.idea__rank b {{ color:var(--sig); font-weight:500; }}
.idea__rank:hover {{ border-color:currentColor; }}
.idea__rank::after {{ content:""; position:absolute; inset:-10px -6px; }}
.idea__rank.v--aprueba {{ color:#3DD68C; }}
.idea__rank.v--reprueba {{ color:#FF6B5E; }}
.idea__rank.v--justo {{ color:#B9A25E; }}

@media (min-width:48em) {{
  .rk {{ padding-block:var(--sp-2xl); }}
  .rk__facts {{ grid-template-columns:1fr 1fr; }}
  .rk__row a {{
    grid-template-columns:auto 12rem 1fr auto auto;
    align-items:center; gap:var(--sp-m);
  }}
  .rk__p {{ grid-row:1; font-size:var(--step-4); }}
  .rk__b {{ grid-column:2; }}
  .rk__q {{ grid-column:3; }}
  .rk__s {{ grid-column:4; grid-row:1; }}
  .rk__v {{ grid-column:5; grid-row:1; min-width:7ch; }}
}}

/* ------------------------------------------------------------------
   La banda del sistema. No es una idea: es la maquina que opera a las
   otras 21, asi que va arriba de todas y no se parece a ninguna.
   Terminal de mando: verde de senal, mono, densidad.
   ------------------------------------------------------------------ */
.sis {{
  --bg:#0B0E10; --card:#12171B; --line:#243038; --hair:#161D22;
  --mute:#8D9AA3; --mute-2:#7C8892; --sig:#D6E2E8;
  position:relative; background:var(--bg); color:var(--sig);
  border-block:1px solid var(--line); padding-block:var(--sp-xl);
}}
.sis__kicker {{
  display:flex; align-items:center; gap:var(--sp-2xs);
  font-size:var(--step--1); letter-spacing:.14em; text-transform:uppercase;
  color:var(--acc);
}}
.sis__dot {{
  width:.5rem; height:.5rem; border-radius:50%; background:var(--acc);
  box-shadow:0 0 0 3px color-mix(in srgb, var(--acc) 22%, transparent);
  animation:sis-pulse 2.4s ease-in-out infinite;
}}
@keyframes sis-pulse {{ 50% {{ opacity:.35; }} }}
@media (prefers-reduced-motion:reduce) {{ .sis__dot {{ animation:none; }} }}
.sis__top {{ margin-top:var(--sp-m); display:grid; gap:var(--sp-s); }}
.sis__title {{ font-size:var(--step-4); font-weight:700; letter-spacing:-.03em; }}
.sis__domain {{
  display:flex; align-items:center; gap:var(--sp-2xs); flex-wrap:wrap;
  color:var(--mute-2); font-size:var(--step--1); margin-top:.2em;
}}
.sis__tagline {{
  font-size:var(--step-1); color:var(--sig); max-width:34ch; text-wrap:balance;
}}
.sis__problem {{
  margin-top:var(--sp-m); color:var(--mute); max-width:var(--measure);
  font-size:var(--step-0); line-height:1.65;
}}
.sis__facts {{
  margin-top:var(--sp-l); display:grid; gap:1px;
  background:var(--line); border:1px solid var(--line);
}}
.sis__facts > div {{ background:var(--card); padding:var(--sp-s) var(--sp-m); }}
.sis__facts dt {{
  color:var(--acc); font-size:.78rem; letter-spacing:.1em; text-transform:uppercase;
}}
.sis__facts dd {{
  color:var(--mute); font-size:var(--step--1); line-height:1.6;
  margin-top:var(--sp-3xs); font-family:'Space Grotesk',system-ui,sans-serif;
}}
.sis__facts em {{ color:var(--sig); font-style:italic; }}
.sis__links {{
  margin-top:var(--sp-l); display:flex; flex-wrap:wrap; align-items:center;
  gap:var(--sp-s);
}}
.sis__cta {{
  display:inline-flex; align-items:center; gap:var(--sp-2xs);
  min-height:44px; padding-inline:var(--sp-m);
  background:var(--acc); color:var(--acc-on); font-weight:500;
  text-decoration:none; border-radius:2px;
}}
.sis__cta:hover {{ filter:brightness(1.1); }}
.sis__docs {{ display:flex; flex-wrap:wrap; gap:var(--sp-xs); }}
.sis__docs a {{
  display:inline-flex; align-items:center; min-height:44px;
  color:var(--mute); font-size:var(--step--1);
  text-decoration-color:var(--line); text-underline-offset:4px;
}}
.sis__docs a:hover {{ color:var(--sig); text-decoration-color:var(--acc); }}
@media (min-width:48em) {{
  .sis {{ padding-block:var(--sp-2xl); }}
  .sis__top {{ grid-template-columns:1fr 1fr; align-items:end; gap:var(--sp-l); }}
  .sis__facts {{ grid-template-columns:1fr 1fr; }}
}}

.fam {{ position:relative; background:var(--bg); border-top:1px solid var(--line); }}
.fam > .container {{ position:relative; z-index:1; }}
/* retícula técnica: sólo se ve en el encabezado, las tarjetas la tapan */
.fam::before {{
  content:""; position:absolute; inset:0; pointer-events:none;
  background-image:linear-gradient(90deg, var(--hair) 1px, transparent 1px);
  background-size:5rem 100%;
  -webkit-mask-image:linear-gradient(to bottom, #000 0, transparent 22rem);
  mask-image:linear-gradient(to bottom, #000 0, transparent 22rem);
}}
.fam--pyme {{
  --bg:#12100E; --card:#191612; --line:#2E2A26; --hair:#221E1A;
  --mute:#9A9088; --mute-2:#8A7F76; --sig:#EDE7DE;
}}
.fam--mineria {{
  --bg:#0A0F14; --card:#111922; --line:#26333D; --hair:#161F27;
  --mute:#93A1AB; --mute-2:#758590; --sig:#B9CBD6;
}}
/* Consumo: tinta de imprenta. Ni el café de la PYME ni el acero de la faena —
   esta idea se imprime en riso, y la banda lo anticipa antes de que abras la tarjeta. */
.fam--consumo {{
  --bg:#0F0C18; --card:#181428; --line:#2F2A45; --hair:#1E1930;
  --mute:#A199B8; --mute-2:#8C84A3; --sig:#E4DFF0;
}}

.fam__head {{
  padding-block:var(--sp-2xl) var(--sp-xl);
  display:grid; grid-template-columns:1fr auto; align-items:start;
  column-gap:var(--sp-s);
}}
.fam__kicker {{
  grid-column:1 / -1;
  display:flex; align-items:center; gap:var(--sp-2xs);
  font-size:var(--step--1); letter-spacing:.14em; text-transform:uppercase;
  color:var(--mute-2);
}}
.fam__tick {{
  width:1.75rem; height:.5rem; background:var(--sig); flex:none;
}}
.fam--mineria .fam__tick {{
  background:repeating-linear-gradient(90deg, var(--sig) 0 3px, transparent 3px 6px);
}}
.fam__title {{
  grid-column:1; font-size:var(--step-4); font-weight:700; letter-spacing:-.03em;
  color:var(--paper); margin-top:var(--sp-xs); line-height:1;
}}
.fam__count {{
  grid-column:2; grid-row:2; text-align:right; color:var(--mute-2);
  line-height:1; margin-top:var(--sp-xs);
}}
.fam__count b {{ display:block; font-size:var(--step-3); font-weight:700; color:var(--sig); }}
.fam__count span {{ font-size:var(--step--1); letter-spacing:.1em; text-transform:uppercase; }}
.fam__lede {{
  grid-column:1 / -1; color:var(--mute); max-width:60ch;
  margin-top:var(--sp-s); font-size:var(--step-1); line-height:1.5; text-wrap:pretty;
}}
/* la ficha de la familia: acá es donde la diferencia PYME/minería se hace dato */
.fam__facts {{
  grid-column:1 / -1; margin-top:var(--sp-l);
  border-top:1px solid var(--line);
  display:grid; gap:1px; background:var(--line);
  border-bottom:1px solid var(--line);
}}
.fam__facts > div {{ background:var(--bg); padding:var(--sp-s) 0; }}
.fam__facts dt {{
  font-size:var(--step--1); letter-spacing:.1em; text-transform:uppercase;
  color:var(--mute-2);
}}
.fam__facts dd {{
  font-family:'Space Grotesk',sans-serif; color:var(--paper);
  font-size:var(--step--1); line-height:1.5; margin-top:.25em; max-width:34ch;
}}

/* ================================================================ tarjeta === */
/* Ya no es una losa: cada idea es un panel con borde, fondo y hueco propios. */
.ideas {{
  display:grid; gap:var(--sp-s);
  padding-bottom:var(--sp-2xl);
}}
.idea {{
  position:relative; isolation:isolate;
  background:var(--card);
  border:1px solid var(--line);
  border-left:3px solid var(--acc);      /* el lomo: la firma de la idea */
  display:grid; grid-template-columns:auto 1fr;
  column-gap:var(--sp-s); row-gap:var(--sp-s);
  padding:var(--sp-m) var(--sp-s) var(--sp-s);
  transition:border-color .18s ease, background .18s ease, transform .18s ease;
}}
.idea:hover, .idea:focus-within {{
  background:var(--acc-soft); border-color:var(--acc-line); border-left-color:var(--acc);
}}
/* el anillo de foco dentro de una tarjeta se tiñe con el acento de esa idea */
.idea :focus-visible {{ outline:2px solid var(--acc); outline-offset:2px; }}
/* la tarjeta entera lleva a Producto; el pie va por encima con sus propios enlaces */
.idea__hit {{ position:absolute; inset:0; z-index:0; }}

.idea__num {{
  grid-column:1; grid-row:1;
  font-size:var(--step-1); font-weight:700; color:var(--acc);
  line-height:1; padding-top:.15em; letter-spacing:-.02em;
}}
.idea__head {{ grid-column:2; grid-row:1; min-width:0; }}
.idea__cat {{
  font-size:.72rem; letter-spacing:.1em; text-transform:uppercase;
  color:var(--mute-2); line-height:1.4;
}}
.idea__brand {{
  font-size:var(--step-2); font-weight:700; letter-spacing:-.02em;
  line-height:1.1; margin-top:.15em;
}}
/* el padding/margen negativo sube el área táctil a 44px sin mover el layout */
.idea__brand a {{
  display:inline-block; text-decoration:none;
  padding-block:.62rem; margin-block:-.62rem;
}}
.idea:hover .idea__brand a {{
  text-decoration:underline; text-decoration-color:var(--acc);
  text-decoration-thickness:2px; text-underline-offset:4px;
}}
.idea__domain {{
  font-size:var(--step--1); color:var(--mute-2); margin-top:.3em;
  display:flex; align-items:center; gap:var(--sp-2xs); flex-wrap:wrap;
}}
.idea__free {{
  color:var(--acc); border:1px solid currentColor;
  padding:.15em .4em; font-size:.72rem; line-height:1;
  letter-spacing:.08em; text-transform:uppercase;
}}
/* sólo en minería: el mercado, porque el TAM chileno es chico y la plata está afuera */
.idea__ext {{
  margin-top:var(--sp-m); padding-top:var(--sp-s);
  border-top:1px solid var(--line);
}}
.idea__ext dt {{
  font-size:.72rem; letter-spacing:.1em; text-transform:uppercase; color:var(--mute-2);
}}
.idea__ext dd {{
  font-size:var(--step--1); color:var(--mute); margin-top:.35em; line-height:1.5;
}}

.idea__pitch {{ grid-column:1 / -1; grid-row:2; min-width:0; }}
.idea__tagline {{
  font-size:var(--step-1); line-height:1.35; text-wrap:pretty; max-width:44ch;
}}
.idea__problem {{
  color:var(--mute); margin-top:var(--sp-2xs); max-width:60ch;
  font-size:var(--step--1); line-height:1.6;
}}

/* -- el pie: acá vive la jerarquía de los cinco enlaces -- */
.idea__foot {{
  grid-column:1 / -1; grid-row:3; position:relative; z-index:1;
  margin-top:auto; padding-top:var(--sp-s);
  border-top:1px solid var(--line);
  display:grid; gap:var(--sp-s);
}}
.idea__price {{
  font-size:var(--step--1); color:var(--paper); font-weight:500;
  display:flex; align-items:baseline; gap:var(--sp-2xs); flex-wrap:wrap;
}}
.idea__more {{
  color:var(--mute-2); font-weight:400; font-size:.72rem;
  letter-spacing:.08em; text-transform:uppercase;
}}
/* Nivel 1: el demo. Sólido, en el acento, con flecha. Es lo que se toca. */
.idea__demo {{
  display:inline-flex; align-items:center; justify-content:center; gap:var(--sp-2xs);
  min-height:48px; padding-inline:var(--sp-m);
  background:var(--acc); color:var(--acc-on);
  font-weight:700; font-size:var(--step-0); letter-spacing:-.01em;
  text-decoration:none; border:1px solid var(--acc);
  transition:background .15s ease, color .15s ease;
}}
.idea__demo:hover {{ background:transparent; color:var(--acc); }}
.idea__arrow {{ transition:transform .18s ease; }}
.idea__demo:hover .idea__arrow {{ transform:translateX(3px); }}
@media (prefers-reduced-motion:reduce) {{
  .idea__demo:hover .idea__arrow {{ transform:none; }}
}}
/* Nivel 3: el expediente. Mono, discreto, sin caja. No compite con el demo. */
.idea__docs {{
  display:flex; flex-wrap:wrap; align-items:center;
  column-gap:var(--sp-s); row-gap:0;
  font-size:var(--step--1);
}}
.idea__docs a {{
  display:inline-flex; align-items:center; min-height:44px;
  color:var(--mute); text-decoration:none;
  border-bottom:1px solid transparent;
  transition:color .15s ease, border-color .15s ease;
}}
.idea__docs a:hover {{ color:var(--paper); border-bottom-color:var(--acc); }}

/* ================================================================ colofón === */
.colofon {{
  background:var(--ink);
  border-top:1px solid var(--line);
  padding-block:var(--sp-xl) var(--sp-2xl);
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

/* ================================================================= tablet === */
@media (min-width:48em) {{
  .jump {{ grid-template-columns:1fr 1fr; gap:var(--sp-s); }}
  .note {{ grid-template-columns:repeat(3,1fr); }}
  .fam__facts {{ grid-template-columns:repeat(2,1fr); column-gap:1px; }}
  .fam__facts > div {{ padding:var(--sp-s) var(--sp-m) var(--sp-s) 0; }}
  .fam__facts > div:nth-child(2n) {{ padding-left:var(--sp-m); }}

  .idea {{ padding:var(--sp-m) var(--sp-m) var(--sp-m); column-gap:var(--sp-m); }}
  .idea__num {{ font-size:var(--step-2); }}
  .idea__pitch {{ grid-column:2; }}
  .idea__foot {{
    grid-column:2;
    grid-template-columns:1fr auto; align-items:center;
  }}
  .idea__price {{ grid-column:1; grid-row:1; }}
  .idea__demo {{ grid-column:2; grid-row:1; }}
  .idea__docs {{ grid-column:1 / -1; grid-row:2; }}
}}

/* ================================================================ desktop === */
@media (min-width:64em) {{
  .fam__facts {{ grid-template-columns:repeat(4,1fr); }}
  .fam__facts > div {{ padding:var(--sp-s) var(--sp-m); }}
  .fam__facts > div:first-child {{ padding-left:0; }}
  .fam__facts > div:nth-child(2n) {{ padding-left:var(--sp-m); }}

  /* PYME: diez tarjetas medianas, a dos columnas — se escanean. */
  .fam--pyme .ideas {{ grid-template-columns:1fr 1fr; gap:var(--sp-m); }}
  .fam--pyme .idea {{ display:flex; flex-direction:column; }}
  .fam--pyme .idea__num {{
    position:absolute; top:var(--sp-m); right:var(--sp-m);
    font-size:var(--step-2); color:var(--acc); opacity:.55;
  }}
  .fam--pyme .idea__head {{ padding-right:3rem; }}

  /* Minería y Consumo: tarjetas anchas, a dos columnas internas y con aire — pesan. */
  .fam--mineria .ideas, .fam--consumo .ideas {{ gap:var(--sp-m); }}
  .fam--mineria .idea, .fam--consumo .idea {{
    grid-template-columns:5rem minmax(0,.85fr) minmax(0,1.15fr);
    column-gap:var(--sp-xl);
    padding:var(--sp-l) var(--sp-l) var(--sp-m);
  }}
  .fam--mineria .idea__num {{ font-size:var(--step-3); }}
  .fam--mineria .idea__head {{ grid-column:2; grid-row:1; }}
  .fam--mineria .idea__pitch {{ grid-column:3; grid-row:1; }}
  .fam--mineria .idea__tagline {{ font-size:var(--step-2); letter-spacing:-.02em; }}
  .fam--mineria .idea__foot {{ grid-column:2 / -1; grid-row:2; }}
}}

@media (min-width:75em) {{
  .fam--mineria .idea {{ grid-template-columns:6rem minmax(0,.8fr) minmax(0,1.2fr); }}
}}
</style>
</head>
<body>

<a class="skip" href="#pyme">Saltar al índice de ideas</a>

<header class="masthead">
  <div class="container">
    <p class="eyebrow"><span>lelelilo studios</span><span>·</span><span>21 ideas + 1 sistema</span><span>·</span><span>2026</span></p>
    <h1>Veintiún negocios que podrían existir<em>, llevados hasta donde se pueden tocar.</em></h1>
    <p class="lede">Veintiún problemas reales —PYME, minería, consumo, y cinco que se operan solas— con
      un producto que funciona en el navegador, un plan de marketing, un roadmap a 24 meses y la
      arquitectura que habría que configurar para que dejara de ser una maqueta.</p>

    <nav class="jump" aria-label="Las tres familias">
      <a href="#pyme">
        <span class="jump__n mono">{len(pyme):02d}</span>
        <span class="jump__t">PYME chilena<small>Ticket bajo · decide la dueña · venta en días</small></span>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M12 4v16M6 14l6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
      </a>
      <a href="#mineria">
        <span class="jump__n mono">{len(minera):02d}</span>
        <span class="jump__t">Minería<small>Ticket alto · decide operaciones · venta en 12-18 meses</small></span>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M12 4v16M6 14l6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
      </a>
      <a href="#consumo">
        <span class="jump__n mono">{len(consumo):02d}</span>
        <span class="jump__t">Consumo<small>Le vende a una familia · el niño juega, el papá paga</small></span>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M12 4v16M6 14l6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
      </a>
      <a href="#ranking">
        <span class="jump__n mono">#1</span>
        <span class="jump__t">El ranking<small>&iquest;Por qu&eacute; no ChatGPT? · las 21 ordenadas</small></span>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M12 4v16M6 14l6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
      </a>
      <a href="#autonomas">
        <span class="jump__n mono">{len(autonomas):02d}</span>
        <span class="jump__t">Autónomas<small>Se operan solas · nadie en el loop</small></span>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M12 4v16M6 14l6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
      </a>
    </nav>

    <div class="note">
      <div>
        <h2>Sin conexión</h2>
        <p><em>Nada de esto está conectado a nada.</em> No hay base de datos, ni agentes de IA
          corriendo, ni APIs contratadas. Los demos funcionan con datos falsos —creíbles, pero
          falsos— y cada idea documenta en su <em>Arquitectura</em> qué habría que configurar,
          cuánto costaría al mes y qué parte está fingida.</p>
      </div>
      <div>
        <h2>Dominios</h2>
        <p><em>Los veintidós dominios están verificados como libres</em> al 13 de julio de 2026
          (RDAP de Verisign para <span class="mono">.com</span>, NIC Chile para
          <span class="mono">.cl</span>). Eso caduca: si vas a usar uno, verifícalo de nuevo
          antes de comprarlo.</p>
      </div>
      <div>
        <h2>Números</h2>
        <p><em>Son estimaciones, y se muestran con su aritmética.</em> Ninguna idea afirma un
          tamaño de mercado sin decir de dónde lo sacó, y ninguna promete éxito: varias concluyen,
          en su propio roadmap, que el escenario base no cruza punto de equilibrio en 24 meses.</p>
      </div>
    </div>
  </div>
</header>

<main>
{secciones}
</main>

<footer class="colofon">
  <div class="container">
    <h2>Colofón</h2>
    <p>HTML, CSS y JavaScript escritos a mano. Sin build, sin framework, sin CDN: se abre el archivo
      y funciona. Los gráficos son SVG dibujado a mano, no una librería. La única petición externa
      son las tipografías de Google.</p>
    <p>Las quince ideas se construyeron en paralelo, cada una por un agente distinto, siguiendo
      <a href="_kit/README.md">un contrato común</a> que fija el piso de accesibilidad, el mobile-first,
      la verificación de dominio y la regla que más importa: toda cifra va citada o va con su
      derivación a la vista.</p>
    <p><a href="https://github.com/lelelilo-studios/business_ideas">Código en GitHub</a></p>
  </div>
</footer>

</body>
</html>
'''

open("index.html", "w").write(doc)
print(f"hub generado: {len(ideas)} ideas + sistema ({len(pyme)} PYME, {len(minera)} minería, {len(consumo)} consumo, {len(autonomas)} autónomas)")
for d in ideas:
    n = int(d["folder"][:2])
    bg = BG_PYME if n <= 10 else BG_MINERA
    acc = accent_safe(d["accent"], bg)
    flag = "" if acc.lower() == d["accent"].lower() else f"  acento {d['accent']} → {acc} (AA)"
    print(f"  {d['folder']:18} {d['brand']:11} {d['domain']:18}{flag}")
