// Memoria Material · versión 2
// Una web para EXPLICAR la experiencia. Lo único que se toca: abrir los pop-ups, dar play a un audio,
// pasar el mouse. Las animaciones muestran la mecánica: el visitante la mira, no la juega.
import { audio, VOICES } from './audio.js';

const { gsap, ScrollToPlugin, DrawSVGPlugin } = window;
gsap.registerPlugin(ScrollToPlugin, DrawSVGPlugin);
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// --- Sonido: el botón del encabezado prende el ruido blanco suave del aula ------------
function sonido() {
  const btn = $('[data-sound-toggle]');
  const lbl = $('[data-sound-label]', btn);
  btn.addEventListener('click', () => audio.toggle());
  audio.on((a) => {
    btn.setAttribute('aria-pressed', String(a.enabled));
    lbl.textContent = a.enabled ? 'Sonido activado' : 'Sonido apagado';
  });
}

// --- Pop-ups de audio --------------------------------------------------------------
function popups() {
  audio.mountSubbar();
  $$('[data-voice]').forEach((card) => { audio.registerCard(card); audio.observeCard(card); });
  // "Leer": muestra el texto de la voz (los subtítulos, que siguen al audio)
  $$('[data-leer]').forEach((b) => b.addEventListener('click', () => {
    const pp = b.closest('.pp');
    const on = !pp.classList.contains('is-leyendo');
    pp.classList.toggle('is-leyendo', on);
    b.setAttribute('aria-expanded', String(on));
    b.textContent = on ? 'Ocultar texto' : 'Leer';
  }));
  // lo que se escucha de fondo: un sonido, o un sonido y después una voz ("id,id:espera")
  $$('[data-seq]').forEach((b) => b.addEventListener('click', () => {
    if (!audio.enabled) audio.enable();
    let t = 0;
    b.dataset.seq.split(',').forEach((part, i) => {
      const [id, wait] = part.split(':');
      if (i > 0) t = Number(wait || 0);
      setTimeout(() => audio.play(id), t);
    });
    const last = b.dataset.seq.split(',').at(-1).split(':')[0];
    const total = t + VOICES[last].cues.at(-1)[1] * 1000;
    b.classList.add('is-playing');
    clearTimeout(b._t); b._t = setTimeout(() => b.classList.remove('is-playing'), total);
  }));
}

// --- Navegación: los enlaces internos se desplazan suave ------------------------------
function navegar() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-go], .v2-rail a');
    if (!a) return;
    e.preventDefault();
    gsap.to(window, { scrollTo: { y: a.getAttribute('href'), autoKill: true }, duration: reduce ? 0 : 1, ease: 'power3.inOut' });
  });
}

// --- Riel: una marca por sección; resalta la que ocupa la pantalla ---------------------
function riel() {
  const secs = $$('[data-rail]');
  const ol = $('.v2-rail ol');
  ol.innerHTML = secs.map((s) => `<li><a href="#${s.id}" style="--c:${getComputedStyle(s).getPropertyValue('--acc')}"><i></i><span>${s.dataset.rail}</span></a></li>`).join('');
  const links = $$('a', ol);
  const update = () => {
    const y = innerHeight * 0.55;
    let i = secs.findIndex((s) => { const r = s.getBoundingClientRect(); return r.top <= y && r.bottom > y; });
    if (i < 0) i = secs.length - 1;
    links.forEach((l, k) => { l.classList.toggle('is-on', k === i); l.classList.toggle('is-past', k < i); });
  };
  addEventListener('scroll', update, { passive: true });
  update();
}

// --- Entrada de cada sección y animaciones que corren solo mientras se ven ----------------
function alVer(el, onIn, onOut) {
  new IntersectionObserver(([e]) => (e.isIntersecting ? onIn() : onOut?.()), { threshold: 0.35 }).observe(el);
}
function entradas() {
  $$('.v2-sec').forEach((s) => alVer(s, () => s.classList.add('is-in')));
}

// --- La experiencia en una pantalla: los lugares del aula se nombran de a uno ------------
function aula() {
  const sec = $('#experiencia');
  const items = $$('[data-lugar]', sec);
  const pins = $$('[data-pin]', sec);
  let i = 0, timer = null;
  const paso = () => {
    items.forEach((li, k) => li.classList.toggle('is-on', k === i));
    pins.forEach((p, k) => p.classList.toggle('is-on', k === i));
    i = (i + 1) % items.length;
  };
  if (reduce) return;
  alVer(sec, () => { if (!timer) { paso(); timer = setInterval(paso, 1800); } }, () => { clearInterval(timer); timer = null; });
}

// --- Etapa 1: cada esfera se conecta con su objeto y se eleva la cúpula -------------------
function etapa1() {
  const sec = $('#e1');
  const svg = $('.escena__anim', sec);
  const count = $('[data-e1-count]', sec);
  const ORDEN = ['llave', 'mate', 'cuaderno'];
  const q = (sel) => $(sel, svg);
  const arcos = $$('.e1a-cupula path', svg);
  const setCount = (n) => { count.textContent = `${n} de 3 conexiones`; };

  if (reduce) { // todo conectado, sin movimiento
    ORDEN.forEach((k) => { q(`[data-o="${k}"]`).style.opacity = 1; q(`[data-s="${k}"]`).style.opacity = 1; q(`[data-p="${k}"]`).style.fill = `var(--${k === 'llave' ? 'amarillo' : k === 'mate' ? 'fucsia' : 'celeste'})`; });
    arcos.forEach((a) => { a.style.opacity = 1; });
    setCount(3);
    return;
  }
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6, paused: true, onRepeat: () => setCount(0) });
  tl.set($$('.e1a-lines path', svg), { drawSVG: '0%' })
    .set($$('.e1a-objs rect', svg), { opacity: 0 })
    .set($$('.e1a-spheres circle', svg), { opacity: 0.55, scale: 1, transformOrigin: 'center' })
    .set($$('.e1a-slots circle', svg), { fill: 'var(--violeta)' })
    .set(arcos, { opacity: 0, drawSVG: '0%' })
    .call(() => setCount(0));
  ORDEN.forEach((k, n) => {
    const c = getComputedStyle(q(`[data-s="${k}"]`)).getPropertyValue('--c');
    tl.to(q(`[data-s="${k}"]`), { opacity: 1, scale: 1.25, duration: 0.35, yoyo: true, repeat: 1, ease: 'power2.out' }, '+=0.5')   // la esfera suena
      .to(q(`[data-l="${k}"]`), { drawSVG: '100%', duration: 0.9, ease: 'power2.inOut' })                                          // se conecta
      .to(q(`[data-o="${k}"]`), { opacity: 1, duration: 0.3 }, '-=0.1')                                                            // el objeto se ilumina
      .to(q(`[data-s="${k}"]`), { opacity: 1, duration: 0.3 }, '<')
      .to(q(`[data-p="${k}"]`), { fill: c, duration: 0.3 }, '<')                                                                   // y su esfera en la plataforma
      .call(() => setCount(n + 1));
  });
  tl.to(arcos, { opacity: 1, drawSVG: '100%', duration: 1, stagger: 0.18, ease: 'power2.out' }, '+=0.4')                       // se eleva la cúpula
    .to({}, { duration: 1.6 })
    .to(svg.children, { opacity: 0, duration: 0.4 })
    .set(svg.children, { opacity: 1 });
  alVer(sec, () => tl.play(), () => tl.pause());
}

sonido();
popups();
navegar();
riel();
entradas();
aula();
etapa1();
