/* Menú móvil. Sin dependencias. */
(function () {
  var btn = document.querySelector('.nav-toggle');
  var links = document.getElementById('nav-links');
  if (!btn || !links) return;
  btn.addEventListener('click', function () {
    var abierto = links.classList.toggle('abierto');
    btn.setAttribute('aria-expanded', abierto ? 'true' : 'false');
  });
})();
