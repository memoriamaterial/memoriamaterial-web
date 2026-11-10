// E2 · El mundo de los objetos
// Cúpula → mundo de la llave (horizontal) → mate (ronda y mañana) → cuaderno (materiales y recetas).
import { audio, VOICES } from '../audio.js';
import { reduce } from '../ui.js';

const { gsap, ScrollTrigger } = window;
const vh = () => window.innerHeight;

export function init() {
  const sec = document.getElementById('e2');
  if (reduce) {
    sec.classList.add('is-static');
    staticFallback(sec);
    cerradura(sec.querySelector('.llave'), null); // obligatoria también sin animaciones
    // D-01: las voces del mundo de la llave también suenan solas (los paneles van uno debajo del otro)
    const [p1, p2] = [...sec.querySelectorAll('.llave__panel')].slice(1, 3);
    const v = (k) => sec.querySelector(`[data-voice="${k}"]`);
    ScrollTrigger.create({ trigger: p1, start: 'top 60%', once: true, onEnter: () => audio.autoplay('llave1', v('llave1')) });
    ScrollTrigger.create({ trigger: p2, start: 'top 60%', once: true, onEnter: () => { audio.autoplay('llave2', v('llave2')); audio.autoplay('llave3', v('llave3')); } });
    return;
  }
  llave(sec);
  swaps(sec);
  mate1(sec);
  mate2(sec);
  cuaderno(sec);
}

// Sonidos de una escena con scroll: cada uno suena una vez, al pasar su paso bajando.
// `onCue(cue, forward)` permite sincronizar una animación con el sonido (el agua del mate).
function sfxCues(tl, items, onCue) {
  const cues = items.map((li, i) => {
    const id = li.dataset.drain || li.dataset.sfx;
    if (!id) return null;
    return { id, li, card: li.querySelector(`[data-voice="${id}"]`), t: tl.labels[`step${i}`] + 0.25, passed: false };
  }).filter(Boolean);
  return () => {
    const now = tl.time();
    cues.forEach((c) => {
      if (!c.passed && now >= c.t) {
        c.passed = true;
        if (audio.enabled) audio.play(c.id, c.card);
        onCue?.(c, true);
      } else if (c.passed && now < c.t) {
        c.passed = false;
        onCue?.(c, false);
      }
    });
  };
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
  const v1 = wrap.querySelector('[data-voice="llave1"]');
  const v2 = wrap.querySelector('[data-voice="llave2"]');
  const v3 = wrap.querySelector('[data-voice="llave3"]');
  const mesita = wrap.querySelector('.mesita');

  // C-20: el panel de la cerradura mide lo que su contenido (css), así el recorrido termina con la escena
  const distance = () => track.scrollWidth - pin.clientWidth;
  const tween = gsap.to(track, {
    x: () => -distance(), ease: 'none',
    scrollTrigger: {
      trigger: wrap, pin, start: 'top top', end: () => `+=${Math.max(distance(), vh() * 4.5)}`, scrub: 0.5, invalidateOnRefresh: true,
      onUpdate: (self) => pips.forEach((p, i) => p.classList.toggle('is-on', self.progress >= (i + 0.55) / 4)),
    },
  });

  // Cada panel aparece con un leve desfasaje (paralaje de profundidad)
  panels.forEach((p) => {
    const door = p.querySelector('.door');
    if (door) gsap.fromTo(door, { scale: 0.86 }, { scale: 1.06, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
    const items = p.querySelectorAll('.said:not([data-found]), .cajas svg, .regalos svg, .mesita, .cerradura');
    if (items.length) gsap.from(items, { y: 40, opacity: 0, stagger: 0.08, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left 70%', toggleActions: 'play none none reverse' } });
  });

  // D-05: la primera voz suena entre el primer y el segundo marco de puerta
  ScrollTrigger.create({ trigger: panels[1], containerAnimation: tween, start: 'left 55%', onEnter: () => audio.autoplay('llave1', v1) });
  // la voz 3 queda en espera y suena apenas termina la 2
  ScrollTrigger.create({ trigger: panels[2], containerAnimation: tween, start: 'left 55%', onEnter: () => { audio.autoplay('llave2', v2); audio.autoplay('llave3', v3); } });

  cajones.forEach((c, i) => c.addEventListener('click', () => {
    c.classList.toggle('is-open');
    c.setAttribute('aria-label', `${c.classList.contains('is-open') ? 'Cerrar' : 'Abrir'} el ${['primer', 'segundo', 'tercer'][i]} cajón`);
    if (i === 1 && !mesita.classList.contains('is-usada')) mesita.classList.toggle('is-llave', c.classList.contains('is-open'));
  }));
  // al llegar a la cerradura, el cajón de la llave queda abierto para poder llevarla
  ScrollTrigger.create({ trigger: panels[panels.length - 1], containerAnimation: tween, start: 'left 85%', onEnter: () => { cajones[1].classList.add('is-open'); mesita.classList.add('is-llave'); } });

  cerradura(wrap, tween);
}

// La cerradura gigante: la única interacción obligatoria.
// El scroll hacia abajo queda frenado hasta que la llave entra en la cerradura.
function cerradura(wrap, tween) {
  const panel = wrap.querySelector('[data-lock-panel]');
  const lock = wrap.querySelector('[data-lock]');
  const lockSvg = lock.querySelector('.cerradura__lock');
  const key = wrap.querySelector('[data-llave-drag]');
  const hint = wrap.querySelector('[data-lock-hint]');
  const done = wrap.querySelector('[data-lock-done]');
  const found = wrap.querySelector('[data-found]');
  const mesita = wrap.querySelector('.mesita');
  const cajonLlave = wrap.querySelectorAll('.cajon')[1];
  const rm = document.documentElement.classList.contains('rm');
  let opened = false, jumping = false, busy = false;

  // --- dónde se frena el scroll -----------------------------------------------------
  const lockY = () => {
    if (!rm) return tween.scrollTrigger.end;
    const r = panel.getBoundingClientRect();
    return r.bottom + window.scrollY - window.innerHeight + 24;
  };
  const near = () => Math.abs(window.scrollY - lockY()) < 6;
  let lastY = window.scrollY, nudgeAt = 0;
  const nudge = () => {
    const now = performance.now();
    if (now - nudgeAt < 900) return;
    nudgeAt = now;
    hint.classList.add('is-nudge');
    if (!reduce) {
      gsap.fromTo(hint, { x: 0 }, { x: 6, duration: 0.07, repeat: 5, yoyo: true, clearProps: 'x' });
      if (!busy) gsap.to(key, { rotation: '+=8', duration: 0.1, repeat: 3, yoyo: true });
    }
    setTimeout(() => hint.classList.remove('is-nudge'), 1200);
  };
  window.addEventListener('scroll', () => {
    const y = window.scrollY, L = lockY();
    if (!opened && !jumping && lastY <= L + 2 && y > L + 2) { window.scrollTo(0, L); nudge(); }
    lastY = window.scrollY;
  }, { passive: true });
  window.addEventListener('wheel', (e) => {
    if (!opened && !jumping && near() && e.deltaY > 0) { e.preventDefault(); nudge(); }
  }, { passive: false });
  let ty = 0;
  window.addEventListener('touchstart', (e) => { ty = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (opened || jumping || !near()) return;
    if (ty - e.touches[0].clientY > 0) { if (e.cancelable) e.preventDefault(); if (!e.target.closest('[data-llave-drag]')) nudge(); }
  }, { passive: false });
  window.addEventListener('keydown', (e) => {
    if (opened || jumping || !near()) return;
    const typing = e.target.closest('button, input, textarea, select, a');
    const down = ['PageDown', 'ArrowDown', 'End'].includes(e.key) || (e.key === ' ' && !typing);
    if (down) { e.preventDefault(); nudge(); }
  });
  // los saltos desde el riel no se frenan (son navegación, no scroll)
  document.addEventListener('nav:jump', (e) => {
    jumping = true;
    setTimeout(() => { jumping = false; lastY = window.scrollY; }, (e.detail?.duration || 0) * 1000 + 250);
  });

  // --- geometría: punta de la llave y centro del ojo de la cerradura ------------
  const tip = () => { const r = key.getBoundingClientRect(); return { x: r.left + r.width * 0.5, y: r.top + r.height * 0.92 }; };
  const hole = () => { const r = lockSvg.getBoundingClientRect(); return { x: r.left + r.width * 0.5, y: r.top + r.height * 0.46 }; };
  const gap = () => { const a = tip(), b = hole(); return { dx: b.x - a.x, dy: b.y - a.y, d: Math.hypot(b.x - a.x, b.y - a.y) }; };
  const magnet = () => Math.max(90, lockSvg.getBoundingClientRect().width * 0.55);

  // --- encajar: imán, giro, luz amarilla y la puerta se abre ---------------------
  const EN_CAJON = { rotation: 90, scale: 0.42 };     // C-18: la llave del cajón, chica y acostada
  const EN_MANO = { rotation: 0, scale: 1 };
  gsap.set(key, EN_CAJON);
  // En celular el mueble y la cerradura no entran juntos: al llegar a la cerradura, la llave
  // sale del cajón y queda al lado de la cerradura, lista para llevarla.
  const dock = wrap.querySelector('[data-llave-dock]');
  const narrow = window.matchMedia('(max-width: 899px)');
  const home = () => (key.parentElement === dock ? EN_MANO : EN_CAJON);
  const moveTo = (parent, animate) => {
    if (key.parentElement === parent || opened || busy) return;
    const a = key.getBoundingClientRect();
    parent.appendChild(key);
    gsap.set(key, { x: 0, y: 0, ...home() });
    const b = key.getBoundingClientRect();
    if (animate && !reduce) gsap.from(key, { x: a.left + a.width / 2 - (b.left + b.width / 2), y: a.top + a.height / 2 - (b.top + b.height / 2), ...EN_CAJON, duration: 0.9, ease: 'power3.inOut' });
  };
  ScrollTrigger.create({ trigger: panel, containerAnimation: tween, start: 'left 85%', onEnter: () => { if (narrow.matches) moveTo(dock, true); } });
  narrow.addEventListener('change', () => { if (!narrow.matches) moveTo(mesita, false); });
  const insert = (fromDrag = false) => {
    if (opened || busy) return;
    busy = true;
    drag?.disable();
    cajonLlave.classList.add('is-open');
    mesita.classList.add('is-llave', 'is-usada', 'is-dragging');
    const t = reduce ? 0 : 1;
    gsap.timeline({ onComplete: () => {
      const { dx, dy } = gap();   // se mide con la llave ya derecha y en su tamaño
      gsap.timeline({ onComplete: open })
        .to(key, { x: `+=${dx}`, y: `+=${dy}`, duration: (fromDrag ? 0.3 : 0.8) * t, ease: fromDrag ? 'back.out(2)' : 'power3.inOut' })
        .to(key, { y: '+=6', duration: 0.12 * t, ease: 'power2.in' })
        .add(() => key.classList.add('is-in'))
        .to(key, { rotation: 90, transformOrigin: '50% 92%', duration: 0.55 * t, ease: 'power2.inOut' });
    } }).to(key, { ...EN_MANO, duration: fromDrag ? 0 : 0.3 * t });
  };
  function open() {
    opened = true;
    lock.classList.add('is-open');
    lock.classList.remove('is-near');
    key.setAttribute('aria-disabled', 'true');
    key.setAttribute('aria-label', 'Llave en la cerradura');
    done.hidden = false;
    found.hidden = false;  // C-19: "¡Sí! Acá están." queda como texto (no hay audio)
    if (!reduce) gsap.from([done, found], { y: 12, opacity: 0, stagger: 0.1, duration: 0.45, delay: 0.5 });
    lastY = window.scrollY;
  }

  // --- arrastrar con mouse o dedo -----------------------------------------------
  const drag = window.Draggable.create(key, {
    type: 'x,y', zIndexBoost: false, minimumMovement: 4,
    onPress() { gsap.killTweensOf(key); mesita.classList.add('is-dragging'); gsap.to(key, { ...EN_MANO, duration: 0.2 }); },
    onDragStart() { key.classList.add('is-dragging'); },
    onDrag() { lock.classList.toggle('is-near', gap().d < magnet()); },
    onDragEnd() {
      key.classList.remove('is-dragging');
      if (gap().d < magnet()) insert(true);
      else {
        lock.classList.remove('is-near');
        gsap.to(key, { x: 0, y: 0, ...home(), duration: reduce ? 0 : 0.6, ease: 'elastic.out(1, 0.6)', onComplete: () => mesita.classList.remove('is-dragging') }); // vuelve a su lugar
      }
    },
    onClick() { insert(false); }, // un toque también la lleva
  })[0];

  // teclado: Enter o Espacio sobre la llave
  key.addEventListener('click', (e) => { if (e.detail === 0) insert(false); });
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
  let syncCues = null;
  tl.to(chairs, {
    left: (i, el) => el.style.getPropertyValue('--x'), top: (i, el) => el.style.getPropertyValue('--y'),
    rotation: 0, y: 0, duration: 1, stagger: 0.05,
  })
    .to(sit, { opacity: 0, y: -10, duration: 0.3 }, 0.1);

  dialog(tl, lines, {
    onStep: (li, i, at) => {
      const ch = li.dataset.chair && wrap.querySelector(`.silla[data-chair="${li.dataset.chair}"]`);
      chairs.forEach((c) => { if (c !== ch && !c.classList.contains('silla--yo')) tl.set(c, { attr: { 'data-on': 0 } }, at); });
      if (ch) tl.set(ch, { attr: { 'data-on': 1 } }, at);
    },
  });
  tl.to(lines.slice(-2), { opacity: 0, duration: 0.3 })
    .to(hole, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }, '<')
    .to(chairs, { attr: { 'data-on': 0 }, duration: 0.01 }, '<')
    .to(charco, { scale: 6, transformOrigin: '50% 58%', duration: 1.2, ease: 'power2.in' }, '+=0.3')
    .to(pin, { backgroundColor: '#352A72', duration: 0.01 })
    .to(charco, { opacity: 0, duration: 0.3 }, '-=0.3');

  // cada mate tomado baja el agua mientras suena su sorbo (al volver para arriba, el agua sube)
  const levels = { mate1: 0.66, mate2: 0.36, mate3: 0.04 };
  const before = { mate1: 1, mate2: 0.66, mate3: 0.36 };
  // se revisa en cada cuadro de la animación (con scrub, sigue avanzando después del scroll)
  syncCues = sfxCues(tl, lines, (c, forward) => {
    if (!(c.id in levels)) return;
    const dur = VOICES[c.id].cues.at(-1)[1];
    gsap.to(water, forward
      ? { scaleY: levels[c.id], duration: audio.enabled ? Math.min(dur * 0.8, 4) : 1.4, ease: 'power1.inOut', overwrite: true }
      : { scaleY: before[c.id], duration: 0.4, ease: 'power2.out', overwrite: true });
  });
  tl.eventCallback('onUpdate', syncCues);

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
  let syncCues = null;
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
  syncCues = sfxCues(tl, lines);
  tl.eventCallback('onUpdate', syncCues);
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
