// Memoria Material · versión 2 · componente «escena narrativa» (css/v2-narrativa.css)
// - el bloque cuyo texto llegó al centro de la pantalla queda activo; su imagen (data-img) entra con un fundido suave
// - data-zoom="x% y%": zoom sutil atado al scroll, dentro del marco, hacia ese punto
// - [data-aula-clone]: una capa con el dibujo del espacio físico (se copia del de «Antes de empezar»)
const { gsap } = window;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

function escena(n) {
  $$('[data-aula-clone]:empty', n).forEach((box) => { const src = document.querySelector('#experiencia .aula-iso'); if (src) box.appendChild(src.cloneNode(true)); });
  const bloques = $$('.narrativa__bloque', n);
  const capas = $$('.narrativa__lienzo > [data-img]', n);
  const activar = (b) => {
    bloques.forEach((x) => x.classList.toggle('is-on', x === b));
    const k = b.dataset.img;
    if (k !== undefined) capas.forEach((c) => c.classList.toggle('is-on', c.dataset.img === k));
  };
  // el bloque activo es el último cuyo TEXTO ya llegó al centro de la pantalla (no cuenta su margen):
  // así cada imagen queda fija hasta que el bloque que la cambia está realmente en el centro
  let actual = null;
  const revisar = () => {
    const y = innerHeight * 0.55;
    let b = bloques[0];
    bloques.forEach((x) => { const r = x.getBoundingClientRect(); if (r.top + r.height / 2 <= y) b = x; });
    if (b && b !== actual) { actual = b; activar(b); }
  };
  addEventListener('scroll', revisar, { passive: true });
  addEventListener('resize', revisar);
  revisar();

  const zoom = n.dataset.zoom;
  const lienzo = n.querySelector('.narrativa__lienzo');
  if (zoom && lienzo && !reduce) {
    gsap.fromTo(lienzo, { scale: 1 }, { scale: 1.12, ease: 'none', transformOrigin: zoom,
      scrollTrigger: { trigger: n.querySelector('.narrativa__textos'), start: 'top 60%', end: 'bottom 60%', scrub: 0.8 } });
  }
}

export function narrativas() {
  $$('[data-narrativa]').forEach(escena);
}
