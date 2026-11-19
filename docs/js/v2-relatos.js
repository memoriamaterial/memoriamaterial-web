// Memoria Material · versión 2 · piezas recuperadas de la versión 1:
// los videos del proyector (bienvenida, antes de la Etapa 5 y final, con su voz), los mundos de la
// ausencia, el eco de la Etapa 4 con sus voces, y el regreso a Unreal (js/stages/inicio.js, e4.js, e5e6.js).
import { audio } from './audio.js?v=20261119c';

const { gsap, ScrollTrigger, SplitText } = window;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// --- Secuencia de texto animado que reemplaza a un video (con el scroll) -----------------------
function video(wrap) {
  const pinEl = $('.video__pin', wrap);
  const scenes = $$('[data-scene]', wrap);
  const tc = $('.video__tc', wrap);
  const bar = $('.video__progress i', wrap);
  const TOTAL = parseFloat(wrap.dataset.total) || 58;
  const card = $('[data-voice]', wrap);
  if (reduce) {
    scenes.forEach((s) => { s.style.position = 'relative'; s.style.visibility = 'visible'; s.style.inset = 'auto'; });
    pinEl.classList.remove('pin'); pinEl.style.height = 'auto';
    $('.video__frame', wrap).style.height = 'auto'; $('.video__frame', wrap).style.maxHeight = 'none';
    $$('.hl', wrap).forEach((h) => h.style.setProperty('--hl', '100%'));
    return;
  }
  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    scrollTrigger: {
      trigger: wrap, start: 'top top', end: () => `+=${window.innerHeight * scenes.length * 0.95}`, pin: pinEl, scrub: 0.6, anticipatePin: 1,
      onUpdate: (self) => { tc.textContent = `00:${String(Math.floor(self.progress * TOTAL)).padStart(2, '0')}`; bar.style.transform = `scaleX(${self.progress})`; },
    },
  });
  scenes.forEach((s, i) => {
    const words = $$('[data-vsplit]', s).flatMap((p) => SplitText.create(p, { type: 'words', mask: 'words' }).words);
    tl.set(s, { autoAlpha: 1 });
    tl.from(words, { yPercent: 100, opacity: 0, filter: 'blur(8px)', duration: 0.5, stagger: 0.035 });
    const hl = $$('.hl', s);
    if (hl.length) tl.to(hl, { '--hl': '100%', duration: 0.35, stagger: 0.1, ease: 'power2.inOut' }, '-=0.2');
    const cards = $$('.vescena', s);
    if (cards.length) {
      tl.from(cards, { y: 70, opacity: 0, rotate: (k) => [-5, 3, -2][k], duration: 0.6, stagger: 0.12 }, '-=0.3')
        .from($$('.vescena__frag', s), { scaleX: 0, transformOrigin: 'left', duration: 0.3, stagger: 0.05 }, '-=0.2');
    }
    tl.to({}, { duration: 0.7 });
    if (i < scenes.length - 1) tl.to(s, { autoAlpha: 0, y: -24, filter: 'blur(6px)', duration: 0.35, ease: 'power2.in' });
  });
  const frags = $$('.vescena__frag', wrap);
  if (frags.length) gsap.to(frags, { x: () => gsap.utils.random(-6, 6), duration: 0.08, ease: 'steps(1)', repeat: -1, repeatDelay: 1.6, yoyo: true, stagger: { each: 0.3, repeat: -1 } });
}

// --- Los mundos de la ausencia: los cajones no se abren ------------------------------------------
function ausencias() {
  const sec = $('#e4-ausencia');
  if (!sec) return;
  const clack = $('.trip__clack', sec);
  $$('.trip__cajon', sec).forEach((c) => c.addEventListener('click', () => {
    clack.textContent = 'cerradura trabada';
    if (!reduce) {
      gsap.fromTo(c, { x: 0 }, { x: 5, duration: 0.05, repeat: 5, yoyo: true, clearProps: 'x' });
      gsap.fromTo(clack, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.2 });
    }
  }));
  if (!reduce) gsap.from($$('.trip__card', sec), { y: 50, opacity: 0, stagger: 0.15, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: $('.trip', sec), start: 'top 80%', once: true } });
}

// --- El eco: cada pregunta, con su voz con reverberación, deja ecos que se alejan -----------------
function eco() {
  const wrap = $('[data-eco]');
  if (!wrap) return;
  const pin = $('.eco__pin', wrap);
  // las frases solo se muestran con el eco en pantalla (nunca encima de otra sección)
  new IntersectionObserver(([e]) => wrap.classList.toggle('is-visible', e.isIntersecting)).observe(wrap);
  const lines = $$('[data-eco-line]', wrap);
  const id = (i) => `e4b${i + 1}`;
  if (reduce) {
    lines.forEach((l) => { l.style.position = 'relative'; l.style.opacity = 1; });
    pin.style.height = 'auto';
    return;
  }
  const tl = gsap.timeline({ scrollTrigger: { trigger: wrap, pin, start: 'top top', end: () => `+=${window.innerHeight * 4}`, scrub: 0.8 } });
  // la voz con reverberación suena solo con play (el reproductor está al pie del eco)
  lines.forEach((l, i) => {
    const ecos = [1, 2, 3].map((k) => { const c = l.cloneNode(true); c.classList.add('is-echo'); c.setAttribute('aria-hidden', 'true'); c.style.opacity = (0.5 / k).toFixed(2); l.before(c); return c; });
    const at = i * 1.4;
    tl.fromTo(l, { opacity: 0, scale: 0.94, filter: 'blur(10px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out' }, at);
    ecos.forEach((e, k) => tl.fromTo(e, { opacity: 0, scale: 1 }, { opacity: 0.5 / (k + 1), scale: 1 + (k + 1) * 0.07, duration: 0.6, ease: 'power2.out' }, at + 0.15 + k * 0.1));
    tl.to([l, ...ecos], { opacity: 0, scale: '+=0.06', filter: 'blur(8px)', duration: 0.4, ease: 'power2.in' }, at + 1.05);
  });
}

// --- El regreso a Unreal: termina el video, las luces llevan a la estación y la pantalla se enciende -------
function regreso() {
  const wrap = $('[data-regreso]');
  if (!wrap) return;
  const box = $('[data-aula-clone]', wrap);
  const svg = $('#experiencia .aula-iso').cloneNode(true);
  box.appendChild(svg);
  const pin = $('.regreso__pin', wrap);
  const steps = $$('[data-rstep]', wrap);
  const fade = $('.regreso__fade', wrap);
  const screen = $('.aula-screen', svg);
  const led = $$('.a-led, .a-led-glow', svg);
  const ledPath = $('.a-led', svg);
  const station = $$('.a-station', svg)[1];
  const person = $('.a-person', station);
  const mon = $$('.a-mon, .a-mon-glow', station);
  const setStep = (i) => steps.forEach((li, k) => li.classList.toggle('is-on', k === i));
  setStep(0);
  if (reduce) { steps.forEach((li) => li.classList.add('is-on')); return; }
  // se mide cuando la ilustración ya está en la página
  const monBox = $('.a-mon', station).getBBox();
  const vb = svg.viewBox.baseVal;
  const origin = `${((monBox.x + monBox.width / 2 - vb.x) / vb.width) * 100}% ${((monBox.y + monBox.height / 2 - vb.y) / vb.height) * 100}%`;
  const pb = person.getBBox();
  const from = { x: pb.x + pb.width / 2, y: pb.y + pb.height };
  const top = $('.a-totem-top', svg);
  const start = { x: +top.getAttribute('cx') + 26 - from.x, y: +top.getAttribute('cy') + 34 - from.y };
  const end = ledPath.getPointAtLength(ledPath.getTotalLength());
  const mid = ledPath.getPointAtLength(ledPath.getTotalLength() * 0.45);
  gsap.set(person, { x: start.x, y: start.y });
  gsap.set(mon, { opacity: 0.08 });
  gsap.set(led, { opacity: 0 });
  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: { trigger: wrap, pin, start: 'top top', end: () => `+=${window.innerHeight * 3.4}`, scrub: 0.7,
      onUpdate: (self) => setStep(Math.min(2, Math.floor(self.progress * 3 * 0.999))) },
  });
  tl.to({}, { duration: 0.3 })
    .to(screen, { opacity: 0.15, duration: 0.5 })
    .to({}, { duration: 0.2 })
    .to(led, { opacity: 1, duration: 0.3 })
    .to(person, { x: mid.x - from.x, y: mid.y - from.y - 4, duration: 0.3, ease: 'none' })
    .to(person, { x: end.x - from.x, y: end.y - from.y - 4, duration: 0.3, ease: 'none' })
    .to(person, { x: 0, y: 0, duration: 0.2, ease: 'none' })
    .to(led, { opacity: 0, duration: 0.2 })
    .to(mon, { opacity: 1, duration: 0.25 })
    .to(svg, { scale: 7, transformOrigin: origin, duration: 0.8, ease: 'power2.in' })
    .to(fade, { opacity: 1, duration: 0.25 }, '-=0.25');
}

// --- Las explicaciones antes de cada etapa entran al verlas ----------------------------------------
function intros() {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add('is-in'); }), { threshold: 0.3 });
  $$('.v2-intro').forEach((s) => io.observe(s));
}

export function relatos() {
  $$('[data-video]').forEach(video);
  ausencias();
  eco();
  regreso();
  intros();
}
