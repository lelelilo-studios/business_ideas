/* comun.js — navegación, formato y primitivas de gráfico. Sin dependencias. */

/* ---------- navegación móvil ---------- */
(function () {
  var b = document.querySelector('.burger');
  var n = document.getElementById('nav');
  if (!b || !n) return;
  b.addEventListener('click', function () {
    var abierto = n.classList.toggle('abierto');
    b.setAttribute('aria-expanded', abierto ? 'true' : 'false');
  });
})();

/* ---------- formato es-CL ---------- */
function clp(v, signo) {
  var s = '$' + Math.round(Math.abs(v)).toLocaleString('es-CL');
  if (signo && v > 0) return '+' + s;
  if (v < 0) return '−' + s;
  return s;
}
function miles(v) { return Math.round(v).toLocaleString('es-CL'); }
function pct(v, d) { return (v * 100).toFixed(d === undefined ? 1 : d).replace('.', ',') + '%'; }
function dec(v, d) { return Number(v).toFixed(d === undefined ? 1 : d).replace('.', ','); }
function mm(v) { return dec(v / 1e6, 1) + ' M'; }

/* ---------- SVG ---------- */
var NS = 'http://www.w3.org/2000/svg';
function el(t, a, txt) {
  var e = document.createElementNS(NS, t);
  for (var k in a) if (a[k] !== null && a[k] !== undefined) e.setAttribute(k, a[k]);
  if (txt !== undefined) e.textContent = txt;
  return e;
}
/* redibuja al cambiar el ancho — los gráficos son fluidos, no fijos */
function fluido(host, dibuja) {
  var w = 0;
  function run() {
    var nw = host.clientWidth;
    if (!nw || Math.abs(nw - w) < 8) return;
    w = nw;
    var tip = host.querySelector('.tip');
    host.querySelectorAll('svg.g').forEach(function (s) { s.remove(); });
    dibuja(host, Math.max(260, nw), tip);
  }
  run();
  var t;
  addEventListener('resize', function () { clearTimeout(t); t = setTimeout(run, 90); });
  if (!host.clientWidth) requestAnimationFrame(run);
}
function tipDe(host) {
  var t = host.querySelector('.tip');
  if (!t) { t = document.createElement('div'); t.className = 'tip'; host.appendChild(t); }
  return t;
}
function mostrarTip(tip, host, x, y, html) {
  tip.innerHTML = html;
  tip.classList.add('on');
  var hw = host.clientWidth, tw = tip.offsetWidth;
  var left = Math.min(Math.max(4, x - tw / 2), hw - tw - 4);
  tip.style.left = left + 'px';
  tip.style.top = Math.max(0, y - tip.offsetHeight - 10) + 'px';
}
function ocultarTip(tip) { tip.classList.remove('on'); }

/* ---------- toggle "ver datos como tabla" ---------- */
document.addEventListener('click', function (ev) {
  var b = ev.target.closest('.ver-datos');
  if (!b) return;
  var t = document.getElementById(b.getAttribute('aria-controls'));
  if (!t) return;
  var oculto = t.hasAttribute('hidden');
  if (oculto) { t.removeAttribute('hidden'); } else { t.setAttribute('hidden', ''); }
  b.setAttribute('aria-expanded', oculto ? 'true' : 'false');
  b.textContent = oculto ? 'Ocultar la tabla' : 'Ver los datos como tabla';
});
