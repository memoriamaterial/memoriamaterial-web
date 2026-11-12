// Entrada · Bienvenida · Espacio físico
import { audio } from '../audio.js';
import { reduce, scrambleIn, echo, splitReveal } from '../ui.js';

const { gsap, ScrollTrigger, SplitText } = window;

export function init() {
  entrada();
  lema();
  video();
  aula();
}

// --- Entrada: el logo se arma uniendo sus mitades ---------------------------
function entrada() {
  const sec = document.getElementById('entrada');
  const logo = sec.querySelector('.logo');
  const parts = {
    topCrema: logo.querySelector('.lg--top.lg--crema'),
    topFucsia: logo.querySelector('.lg--top.lg--fucsia'),
    botCeleste: logo.querySelector('.lg--bot.lg--celeste'),
    botCrema: logo.querySelector('.lg--bot.lg--crema'),
  };
  const tag = logo.querySelector('.logo__tag');
  const promesa = sec.querySelector('.entrada__promesa');
  const ctas = sec.querySelectorAll('.entrada__ctas .btn, .entrada__hint, .entrada__cue');

  // Formas del cielo con eco
  sec.querySelectorAll('.sky-s').forEach((s, i) => {
    const clones = echo(s, 3, 0.45);
    if (reduce) return;
    gsap.to([s, ...clones], {
      x: gsap.utils.random(-50, 50), y: gsap.utils.random(-40, 40), rotation: gsap.utils.random(-25, 25),
      duration: gsap.utils.random(5, 8), ease: 'sine.inOut', repeat: -1, yoyo: true, stagger: 0.14, delay: i * 0.3,
    });
  });

  // Botones de entrada
  sec.querySelectorAll('[data-enter]').forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.enter === 'sound') audio.enable(); else audio.disable();
    gsap.to(window, { scrollTo: { y: '#idea' }, duration: reduce ? 0 : 1.2, ease: 'power3.inOut' });
  }));

  if (reduce) return;

  // Eco del logo: cada mitad deja estelas que se apagan al encajar
  const echoes = Object.values(parts).flatMap((p) => echo(p, 2, 0.35));
  const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 0.9 }, delay: 0.15 });
  scrambleIn(sec.querySelector('.entrada__eyebrow'));
  const groupOf = (p) => [p, ...echoes.filter((e) => e.nextElementSibling === p || e.nextElementSibling?.nextElementSibling === p)];
  tl.from(groupOf(parts.topCrema), { x: -140, opacity: 0, stagger: 0.06 }, 0.1)
    .from(groupOf(parts.topFucsia), { x: 160, opacity: 0, stagger: 0.06 }, 0.18)
    .from(groupOf(parts.botCeleste), { x: -160, opacity: 0, stagger: 0.06 }, 0.24)
    .from(groupOf(parts.botCrema), { x: 140, opacity: 0, stagger: 0.06 }, 0.3)
    .to(echoes, { opacity: 0, duration: 0.5, ease: 'power1.out' }, 0.9)
    .from(tag, { clipPath: 'inset(0 100% 0 0)', duration: 0.8, ease: 'power3.inOut' }, 0.85);

  const split = SplitText.create(promesa, { type: 'words', mask: 'words' });
  tl.from(split.words, { yPercent: 110, opacity: 0, filter: 'blur(6px)', duration: 0.5, stagger: 0.035, ease: 'power3.out', clearProps: 'filter' }, 1.0)
    .from(ctas, { y: 16, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, 1.35);

  // Al salir: el contenido se va hacia arriba y la grilla queda
  gsap.to(sec.querySelector('.entrada__inner'), {
    yPercent: -18, opacity: 0, ease: 'none',
    scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom top', scrub: true },
  });
}

// --- Lema como afiche ---------------------------------------------------------
function lema() {
  const lines = document.querySelectorAll('.lema__line');
  if (reduce) return;
  lines.forEach((line, i) => {
    const w = line.querySelector('.lema__w');
    const pill = line.querySelector('.lema__forma');
    const note = line.querySelector('.lema__note');
    const tl = gsap.timeline({
      scrollTrigger: { trigger: line, start: 'top 92%', end: 'top 55%', scrub: 0.6 },
    });
    tl.from(w, { yPercent: 40, opacity: 0, ease: 'power2.out' })
      .from(pill, { scale: 0, transformOrigin: 'left center', ease: 'power3.out' }, '<0.15');
    if (note) tl.from(note, { opacity: 0, y: 6 }, '<0.2');
  });
}

// --- Video de bienvenida: secuencia de texto animado con el scroll -----------------
function video() {
  document.querySelectorAll('#bienvenida [data-video]').forEach((w) => {
    videoSeq(w);
    // la voz del video de bienvenida suena sola al llegar al video
    ScrollTrigger.create({ trigger: w, start: 'top 40%', onEnter: () => audio.autoplay('bienvenida', w.querySelector('[data-voice="bienvenida"]')) });
  });
}

// Secuencia de texto animado que reemplaza a un video (se usa también en E4).
export function videoSeq(wrap) {
  const pinEl = wrap.querySelector('.video__pin');
  const scenes = [...wrap.querySelectorAll('[data-scene]')];
  const tc = wrap.querySelector('.video__tc');
  const bar = wrap.querySelector('.video__progress i');
  const TOTAL = parseFloat(wrap.dataset.total) || 58; // duración "simulada" del video, en segundos

  if (reduce) {
    scenes.forEach((s) => { s.style.position = 'relative'; s.style.visibility = 'visible'; s.style.inset = 'auto'; });
    pinEl.classList.remove('pin');
    pinEl.style.height = 'auto';
    wrap.querySelector('.video__frame').style.height = 'auto';
    wrap.querySelector('.video__frame').style.maxHeight = 'none';
    wrap.querySelectorAll('.hl').forEach((h) => h.style.setProperty('--hl', '100%'));
    return;
  }

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    scrollTrigger: {
      trigger: wrap, start: 'top top', end: () => `+=${window.innerHeight * scenes.length * 0.95}`,
      pin: pinEl, scrub: 0.6, anticipatePin: 1,
      onUpdate: (self) => {
        const s = Math.floor(self.progress * TOTAL);
        tc.textContent = `00:${String(s).padStart(2, '0')}`;
        bar.style.transform = `scaleX(${self.progress})`;
      },
    },
  });

  scenes.forEach((s, i) => {
    const words = [...s.querySelectorAll('[data-vsplit]')].flatMap((p) => SplitText.create(p, { type: 'words', mask: 'words' }).words);
    tl.set(s, { autoAlpha: 1 });
    tl.from(words, { yPercent: 100, opacity: 0, filter: 'blur(8px)', duration: 0.5, stagger: 0.035 });
    const hl = s.querySelectorAll('.hl');
    if (hl.length) tl.to(hl, { '--hl': '100%', duration: 0.35, stagger: 0.1, ease: 'power2.inOut' }, '-=0.2');
    const cards = s.querySelectorAll('.escena');
    if (cards.length) {
      tl.from(cards, { y: 70, opacity: 0, rotate: (k) => [-5, 3, -2][k], duration: 0.6, stagger: 0.12 }, '-=0.3')
        .from(s.querySelectorAll('.escena__frag'), { scaleX: 0, transformOrigin: 'left', duration: 0.3, stagger: 0.05 }, '-=0.2');
    }
    tl.to({}, { duration: 0.7 }); // pausa de lectura
    if (i < scenes.length - 1) tl.to(s, { autoAlpha: 0, y: -24, filter: 'blur(6px)', duration: 0.35, ease: 'power2.in' });
  });

  // Fragmentos de color que "parpadean" como en el tratamiento gráfico
  const frags = wrap.querySelectorAll('.escena__frag');
  if (frags.length) gsap.to(frags, {
    x: () => gsap.utils.random(-6, 6), duration: 0.08, ease: 'steps(1)', repeat: -1, repeatDelay: 1.6, yoyo: true, stagger: { each: 0.3, repeat: -1 },
  });
}

// --- Espacio físico ----------------------------------------------------------
function aula() {
  const sec = document.getElementById('aula');
  const map = sec.querySelector('.aula__map');
  const spots = [...map.querySelectorAll('.spot')];

  // Leyenda accesible debajo de la maqueta (útil en celular, donde no hay hover)
  const legend = document.createElement('div');
  legend.className = 'legend';
  legend.innerHTML = spots.map((s) => `<button type="button" data-pop-open="${s.dataset.popOpen}"><b>${s.querySelector('.spot__n').textContent}</b>${s.querySelector('.spot__l').textContent}</button>`).join('');
  map.after(legend);
  legend.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b) spots.find((s) => s.dataset.popOpen === b.dataset.popOpen)?.classList.add('is-seen');
  });

  if (reduce) return;
  // El aula se arma: aristas, piso, objetos y luces que se encienden
  const iso = map.querySelector('.aula-iso');
  const q = (sel) => iso.querySelectorAll(sel);
  gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: map, start: 'top 80%', once: true } })
    .from(q('.a-edge'), { drawSVG: 0, duration: 0.9, stagger: 0.04, ease: 'power2.inOut' })
    .from(q('.a-floor-trama, .a-grid-g, .a-wall'), { opacity: 0, duration: 0.8 }, 0.3)
    .from(q('.a-station, .aula-totem, .aula-holo, .aula-oculus'), { opacity: 0, y: 24, duration: 0.7, stagger: 0.1 }, 0.6)
    .from(q('.a-mon, .a-mon-glow'), { opacity: 0, duration: 0.08, repeat: 4, yoyo: true, stagger: 0.12, ease: 'steps(1)' }, 1.2)
    .from(q('.aula-screen'), { opacity: 0, duration: 0.6 }, 1.3)
    .from(q('.aula-led'), { opacity: 0, duration: 0.6 }, 1.5)
    .from(spots, { scale: 0, opacity: 0, duration: 0.4, stagger: 0.06, ease: 'back.out(2)' }, 1.6)
    .from(legend.children, { opacity: 0, y: 8, duration: 0.3, stagger: 0.04 }, 1.7);

}
