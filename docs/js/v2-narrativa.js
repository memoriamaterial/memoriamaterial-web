// Memoria Material · versión 2 · componente «escena narrativa» (css/v2-narrativa.css)
// - el bloque de texto que está en el centro de la pantalla queda activo; su imagen (data-img) entra con un fundido
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
  if (bloques[0]) activar(bloques[0]);
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) activar(e.target); }), { rootMargin: '-42% 0px -42% 0px' });
  bloques.forEach((b) => io.observe(b));

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
