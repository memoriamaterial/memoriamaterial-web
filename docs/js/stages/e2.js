// E2 · El mundo de los objetos
// Cúpula → mundo de la llave (horizontal) → mate (ronda y mañana) → cuaderno (materiales y recetas).
import { audio } from '../audio.js';
import { reduce } from '../ui.js';

const { gsap, ScrollTrigger } = window;
const vh = () => window.innerHeight;

export function init() {
  const sec = document.getElementById('e2');
  if (reduce) { sec.classList.add('is-static'); staticFallback(sec); return; }
  llave(sec);
  swaps(sec);
  mate1(sec);
  mate2(sec);
  cuaderno(sec);
}

// Diálogo en pasos: la línea actual entra, la anterior sube y se atenúa.
function dialog(tl, items, { onStep } = {}) {
  items.forEach((li, i) => {
    const at = `step${i}`;
    tl.addLabel(at);
    if (items[i - 2]) tl.to(items[i - 2], { opacity: 0, duration: 0.25 }, at);
    if (items[i - 1]) tl.to(items[i - 1], { yPercent: -112, opacity: 0.35, duration: 0.35 }, at);
    tl.fromTo(li, { yPercent: 50, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }, at);
    onStep?.(li, i, at);
    tl.to({}, { duration: 0.5 }); // tiempo de lectura
  });
  return tl;
}

// --- Mundo de la llave ---------------------------------------------------------
function llave(sec) {
  const wrap = sec.querySelector('.llave');
  const pin = wrap.querySelector('.llave__pin');
  const track = wrap.querySelector('.llave__track');
  const pips = [...wrap.querySelectorAll('.llave__doors i')];
  const panels = [...track.children];
  const cajones = [...wrap.querySelectorAll('.cajon')];
  const inv = wrap.querySelector('[data-inv]');
  const unlockBtn = wrap.querySelector('[data-unlock]');
  const lock = wrap.querySelector('[data-lock]');
  const found = wrap.querySelector('[data-found]');
  const v2 = wrap.querySelector('[data-voice="llave2"]');
  const v3 = wrap.querySelector('[data-voice="llave3"]');
  let hasKey = false, opened = false;

  const distance = () => track.scrollWidth - pin.clientWidth;
  const tween = gsap.to(track, {
    x: () => -distance(), ease: 'none',
    scrollTrigger: {
      trigger: wrap, pin, start: 'top top', end: () => `+=${Math.max(distance(), vh() * 4.5)}`, scrub: 0.5, invalidateOnRefresh: true,
      onUpdate: (self) => pips.forEach((p, i) => p.classList.toggle('is-on', self.progress >= (i + 0.55) / 4)),
      onLeave: () => { findKey(); unlock(); },
    },
  });

  // Cada panel aparece con un leve desfasaje (paralaje de profundidad)
  panels.forEach((p) => {
    const door = p.querySelector('.door');
    if (door) gsap.fromTo(door, { scale: 0.86 }, { scale: 1.06, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
    const items = p.querySelectorAll('.said, .cajas svg, .regalos svg, .mesita, .cerradura');
    if (items.length) gsap.from(items, { y: 40, opacity: 0, stagger: 0.08, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left 70%', toggleActions: 'play none none reverse' } });
  });

  ScrollTrigger.create({ trigger: panels[3], containerAnimation: tween, start: 'left 55%', onEnter: () => audio.autoplay('llave2', v2) });

  function findKey() {
    if (hasKey) return;
    hasKey = true;
    cajones[1].classList.add('is-open');
    inv.textContent = 'Encontraste la llave';
    inv.classList.add('is-on');
    unlockBtn.disabled = false;
  }
  function unlock() {
    if (opened) return;
    findKey();
    opened = true;
    lock.classList.add('is-open');
    unlockBtn.hidden = true;
    found.hidden = false;
    v3.hidden = false;
    gsap.from([found, v3], { y: 12, opacity: 0, stagger: 0.1, duration: 0.4 });
    if (audio.enabled) audio.play('llave3', v3);
  }

  cajones.forEach((c, i) => c.addEventListener('click', () => {
    c.classList.toggle('is-open');
    c.setAttribute('aria-label', `${c.classList.contains('is-open') ? 'Cerrar' : 'Abrir'} el ${['primer', 'segundo', 'tercer'][i]} cajón`);
    if (i === 1 && c.classList.contains('is-open')) findKey();
  }));
  unlockBtn.addEventListener('click', unlock);
}

// --- Pasajes por la cúpula: el objeto recorrido pasa a B/N y se colorea el siguiente ---
function swaps(sec) {
  sec.querySelectorAll('[data-swap]').forEach((sw) => {
    const next = sw.dataset.swap;
    const order = ['llave', 'mate', 'cuaderno'];
    const prev = order[order.indexOf(next) - 1];
    const items = Object.fromEntries([...sw.querySelectorAll('[data-k]')].map((li) => [li.dataset.k, li]));
    items[prev].classList.add('is-color');
    ScrollTrigger.create({
      trigger: sw, start: 'top 65%',
      onEnter: () => { items[prev].classList.remove('is-color'); gsap.delayedCall(0.35, () => items[next].classList.add('is-color')); },
      onLeaveBack: () => { items[next].classList.remove('is-color'); items[prev].classList.add('is-color'); },
    });
    gsap.from(sw.querySelector('.e2-swap__in').children, { y: 24, opacity: 0, stagger: 0.08, duration: 0.5, scrollTrigger: { trigger: sw, start: 'top 80%', once: true } });
  });
}

// --- Mate 1: la ronda en el charco ---------------------------------------------
function mate1(sec) {
  const wrap = sec.querySelector('.mate1');
  const pin = wrap.querySelector('.mate1__pin');
  const charco = wrap.querySelector('.charco');
  const water = wrap.querySelector('.charco__water');
  const hole = wrap.querySelector('.charco__hole');
  const chairs = [...wrap.querySelectorAll('.silla')];
  const lines = [...wrap.querySelectorAll('.ronda [data-line]')];
  const sit = wrap.querySelector('[data-sit]');

  chairs.forEach((c) => gsap.set(c, { rotation: parseFloat(c.style.getPropertyValue('--fr')) || 0 }));
  // las sillas flotan a la deriva hasta que te sentás
  const bob = gsap.to(chairs.filter((c) => !c.classList.contains('silla--yo')), { y: '+=8', rotation: '+=6', duration: 2.4, ease: 'sine.inOut', repeat: -1, yoyo: true, stagger: 0.3 });

  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: { trigger: wrap, pin, start: 'top top', end: () => `+=${vh() * 5}`, scrub: 0.6,
      onUpdate: (self) => (self.progress > 0.02 ? bob.pause() : bob.play()) },
  });
  tl.to(chairs, {
    left: (i, el) => el.style.getPropertyValue('--x'), top: (i, el) => el.style.getPropertyValue('--y'),
    rotation: 0, y: 0, duration: 1, stagger: 0.05,
  })
    .to(sit, { opacity: 0, y: -10, duration: 0.3 }, 0.1);

  const levels = [0.66, 0.36, 0.04];
  let drains = 0;
  dialog(tl, lines, {
    onStep: (li, i, at) => {
      const ch = li.dataset.chair && wrap.querySelector(`.silla[data-chair="${li.dataset.chair}"]`);
      chairs.forEach((c) => { if (c !== ch && !c.classList.contains('silla--yo')) tl.set(c, { attr: { 'data-on': 0 } }, at); });
      if (ch) tl.set(ch, { attr: { 'data-on': 1 } }, at);
      if (li.hasAttribute('data-drain')) tl.to(water, { scaleY: levels[drains++], duration: 0.6, ease: 'power1.inOut' }, `${at}+=0.2`);
    },
  });
  tl.to(lines.slice(-2), { opacity: 0, duration: 0.3 })
    .to(hole, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }, '<')
    .to(chairs, { attr: { 'data-on': 0 }, duration: 0.01 }, '<')
    .to(charco, { scale: 6, transformOrigin: '50% 58%', duration: 1.2, ease: 'power2.in' }, '+=0.3')
    .to(pin, { backgroundColor: '#352A72', duration: 0.01 })
    .to(charco, { opacity: 0, duration: 0.3 }, '-=0.3');

  sit.addEventListener('click', () => {
    const st = tl.scrollTrigger;
    gsap.to(window, { scrollTo: st.start + (st.end - st.start) * 0.1, duration: 1.2, ease: 'power2.inOut' });
  });
}

// --- Mate 2: la mañana ------------------------------------------------------------
function mate2(sec) {
  const wrap = sec.querySelector('.mate2');
  const pin = wrap.querySelector('.mate2__pin');
  const lines = [...wrap.querySelectorAll('.manana [data-line]')];
  const wins = [...wrap.querySelectorAll('.ventanas i')];
  const sky = wrap.querySelector('.mate2__sky');
  const fuego = wrap.querySelector('.hornalla__fuego');
  const pava = wrap.querySelector('.hornalla__pava');
  const door = wrap.querySelector('.mate2__door span');
  const pam = wrap.querySelector('.mate2__portazo');

  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: { trigger: wrap, pin, start: 'top top', end: () => `+=${vh() * 5}`, scrub: 0.6 },
  });
  tl.from(wrap.querySelector('.mate2__copy'), { opacity: 0, y: 20, duration: 0.4 })
    .to(fuego, { opacity: 1, duration: 0.4 })
    .to(pava, { color: 'rgb(242 237 212 / .95)', duration: 0.3 }, '<');
  dialog(tl, lines, {
    onStep: (li, i, at) => {
      if (i === 0) {
        tl.to(wins, { '--open': 1, duration: 0.5, stagger: 0.18, ease: 'power3.out' }, `${at}+=0.1`);
        tl.to(sky, { opacity: 0.55, duration: 1.4, ease: 'none' }, at);
      }
      if (i > 0) tl.to(sky, { opacity: 0.55 + i * 0.03, duration: 0.4, ease: 'none' }, at);
      if (li.hasAttribute('data-door')) tl.to(door, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, `${at}+=0.1`);
    },
  });
  tl.to(lines.slice(-2), { opacity: 0, duration: 0.2 })
    .fromTo(pam, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1.1, duration: 0.15, ease: 'power4.out' })
    .to(door, { scaleX: 0, duration: 0.1 }, '<')
    .to(pam, { opacity: 0, duration: 0.3 }, '+=0.25')
    .to([sky, ...wins], { opacity: 0, duration: 0.4 }, '<');
}

// --- Mundo del cuaderno: materiales → recetas → la salida dibujada ------------
function cuaderno(sec) {
  const wrap = sec.querySelector('.cuaderno');
  const pin = wrap.querySelector('.cuaderno__pin');
  const hojas = [...wrap.querySelectorAll('.hojas i')];
  const polvo = wrap.querySelector('.polvo');
  const cream = wrap.querySelector('.cuaderno__cream');
  const horno = wrap.querySelector('.horno');
  const maqueta = wrap.querySelector('.cuaderno__maqueta');
  const [mat, rec] = ['materiales', 'recetas'].map((k) => wrap.querySelector(`[data-cq="${k}"]`));
  const [hMat, hRec] = ['materiales', 'recetas'].map((k) => wrap.querySelector(`[data-cq-head="${k}"]`));
  const torta = wrap.querySelector('.torta');
  const final = wrap.querySelector('.cuaderno__final');
  const libro = wrap.querySelector('.libro');

  // hojas sueltas flotando; se ordenan como un camino de plataformas
  hojas.forEach((h, i) => gsap.set(h, { left: `${gsap.utils.random(8, 92)}%`, top: `${gsap.utils.random(20, 85)}%`, rotation: gsap.utils.random(-50, 50) }));
  const path = (i) => ({ left: `${10 + i * 13}%`, top: `${82 - i * 7}%`, rotation: gsap.utils.random(-6, 6) });

  const notas = (box, li) => (li.dataset.notas || '').split(',').filter(Boolean).map((n) => box.querySelectorAll('[data-nota]')[+n]);

  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: { trigger: wrap, pin, start: 'top top', end: () => `+=${vh() * 8}`, scrub: 0.6 },
  });
  tl.from(hMat, { opacity: 0, y: 16, duration: 0.3 })
    .to(hojas, { ...{ left: (i) => path(i).left, top: (i) => path(i).top, rotation: (i) => path(i).rotation }, duration: 1, stagger: 0.08 }, 0)
    .to(polvo, { opacity: 0.8, y: -30, duration: 0.6 }, 0.4)
    .to(pin, { x: 5, duration: 0.05, repeat: 9, yoyo: true, ease: 'none' }, 0.5)
    .to(polvo, { opacity: 0, duration: 0.5 }, 1.2);

  const matLines = [...mat.querySelectorAll('[data-line]')];
  dialog(tl, matLines, {
    onStep: (li, i, at) => notas(mat, li).forEach((n, k) => tl.to(n, { clipPath: 'inset(0 0% 0 0)', duration: 0.5, ease: 'none' }, `${at}+=${0.2 + k * 0.3}`)),
  });

  // cambio de color del escenario: violeta → crema
  tl.addLabel('recetas')
    .to(mat, { opacity: 0, duration: 0.4 }, 'recetas')
    .to(hMat, { opacity: 0, duration: 0.3 }, 'recetas')
    .to(maqueta, { opacity: 0, duration: 0.3 }, 'recetas')
    .to(cream, { opacity: 1, duration: 0.6 }, 'recetas')
    .to(hojas, { borderColor: 'rgb(53 42 114 / .6)', duration: 0.4 }, 'recetas')
    .to(rec, { opacity: 1, duration: 0.01 }, 'recetas+=0.4')
    .to(hRec, { opacity: 1, duration: 0.4 }, 'recetas+=0.4');

  const recLines = [...rec.querySelectorAll('[data-line]')];
  gsap.set(recLines, { opacity: 0 });
  dialog(tl, recLines, {
    onStep: (li, i, at) => {
      notas(rec, li).forEach((n, k) => tl.to(n, { clipPath: 'inset(0 0% 0 0)', duration: 0.5, ease: 'none' }, `${at}+=${0.2 + k * 0.3}`));
      if (li.hasAttribute('data-oven')) {
        tl.to(horno, { opacity: 0.4, duration: 0.8 }, `${at}+=0.3`);
        tl.to(torta, { opacity: 1, y: -10, duration: 0.5 }, `${at}+=0.5`);
      }
    },
  });

  // el último cuaderno, abierto de par en par, con la salida dibujada
  tl.to([rec, hRec, ...hojas], { opacity: 0, duration: 0.4 })
    .to(final, { opacity: 1, duration: 0.4 }, '<0.2')
    .from(libro, { scale: 0.6, rotationX: 40, duration: 0.6, ease: 'power3.out' }, '<')
    .to(libro, { scale: 7, transformOrigin: '75% 62%', duration: 1.2, ease: 'power2.in' }, '+=0.4')
    .to(final, { opacity: 0, duration: 0.3 }, '-=0.3')
    .to([cream, horno], { opacity: 0, duration: 0.3 }, '<');
}

// Movimiento reducido: los diálogos y anotaciones ya salen de los pins (main.js).
function staticFallback(sec) {
  sec.querySelectorAll('.notas li').forEach((n) => { n.style.clipPath = 'none'; });
}
