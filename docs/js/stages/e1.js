// E1 · Plasticidad sináptica
// Conectar cada esfera con su objeto. Nunca bloquea: si se sigue de largo, se completa sola.
import { reduce, echo } from '../ui.js';
import { audio } from '../audio.js';

const { gsap, ScrollTrigger } = window;
const COLORS = { llave: 'var(--amarillo)', mate: 'var(--fucsia)', cuaderno: 'var(--celeste)' };

export function init() {
  const sec = document.getElementById('e1');
  sec.querySelectorAll('.drift').forEach((d) => echo(d, 3, 0.4).forEach((c, k) => { c.style.animationDelay = `calc(var(--delay, 0s) + ${(k + 1) * -0.35}s)`; }));
  play(sec);
  dome(sec);
}

function play(sec) {
  const scene = sec.querySelector('[data-scene-e1]');
  const playScreen = sec.querySelector('.e1-play');
  const svg = scene.querySelector('.e1-lines');
  const bubble = scene.querySelector('.e1-bubble');
  const countEl = sec.querySelector('[data-count]');
  const spheres = [...scene.querySelectorAll('[data-sphere]')];
  const objs = [...scene.querySelectorAll('[data-obj]')];
  const linked = new Set();
  let active = null;

  const center = (el, part = 'center') => {
    const r = el.getBoundingClientRect(), s = scene.getBoundingClientRect();
    return { x: r.left - s.left + r.width / 2, y: r.top - s.top + (part === 'top' ? r.height * 0.15 : r.height / 2) };
  };

  // C-13: cada línea llega a un punto del dibujo de su objeto (no de la caja del botón)
  const ANCHOR = { llave: [0.5, 0.14], cuaderno: [0.5, 0.1], mate: [0.42, 0.4] };
  const anchor = (key) => {
    const r = scene.querySelector(`[data-obj="${key}"] use`).getBoundingClientRect(), s = scene.getBoundingClientRect();
    const [fx, fy] = ANCHOR[key];
    return { x: r.left - s.left + r.width * fx, y: r.top - s.top + r.height * fy };
  };

  // Curva "sináptica" de la esfera al objeto
  const pathFor = (key) => {
    const a = center(scene.querySelector(`[data-sphere="${key}"]`));
    const b = anchor(key);
    const mx = (a.x + b.x) / 2, my = Math.min(a.y, b.y) + Math.abs(b.y - a.y) * 0.25;
    return `M${a.x},${a.y} Q${mx + (b.x - a.x) * 0.25},${my - 40} ${b.x},${b.y}`;
  };
  const drawLine = (key, animate = true) => {
    const ns = 'http://www.w3.org/2000/svg';
    const p = document.createElementNS(ns, 'path');
    p.setAttribute('d', pathFor(key));
    p.dataset.key = key;
    p.style.stroke = COLORS[key];
    p.style.filter = `drop-shadow(0 0 6px ${COLORS[key]})`;
    svg.appendChild(p);
    if (animate && !reduce) gsap.from(p, { drawSVG: 0, duration: 0.7, ease: 'power2.inOut' });
  };
  const relayout = () => svg.querySelectorAll('path').forEach((p) => p.setAttribute('d', pathFor(p.dataset.key)));
  new ResizeObserver(relayout).observe(scene);

  const showBubble = (key) => {
    const tpl = sec.querySelector(`template[data-said="${key}"]`);
    bubble.replaceChildren(tpl.content.cloneNode(true));
    bubble.style.setProperty('--acc', COLORS[key]);
    bubble.hidden = false;
    const c = center(scene.querySelector(`[data-sphere="${key}"]`));
    const sw = scene.clientWidth, bw = bubble.offsetWidth;
    const left = Math.min(Math.max(c.x - bw / 2, 12), sw - bw - 12);
    bubble.style.left = `${left}px`;
    bubble.style.top = `${c.y + 52}px`;
    if (!reduce) gsap.fromTo(bubble, { opacity: 0, y: -8, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(2)' });
  };
  const hideBubble = () => { bubble.hidden = true; };

  const setTint = (key) => {
    scene.classList.toggle('has-tint', !!key);
    if (key) scene.style.setProperty('--tint', COLORS[key]);
  };

  const select = (key) => {
    active = key;
    spheres.forEach((s) => s.classList.toggle('is-active', s.dataset.sphere === key));
    scene.classList.toggle('is-choosing', !!key);
    setTint(key);
    if (key) showBubble(key); else hideBubble();
  };

  const connect = (key, animate = true, auto = false) => {
    if (linked.has(key)) return;
    linked.add(key);
    const sphere = scene.querySelector(`[data-sphere="${key}"]`);
    const obj = scene.querySelector(`[data-obj="${key}"]`);
    sphere.classList.remove('is-active');
    sphere.classList.add('is-linked');
    sphere.setAttribute('aria-label', `${sphere.getAttribute('aria-label')}, conectada`);
    obj.classList.add('is-linked');
    obj.setAttribute('aria-disabled', 'true');
    drawLine(key, animate);
    const slot = scene.querySelector(`[data-slot="${key}"]`);
    slot.classList.add('is-on');
    if (animate && !reduce) {
      gsap.fromTo(obj, { scale: 1 }, { scale: 1.08, yoyo: true, repeat: 1, duration: 0.25, ease: 'power2.out' });
      gsap.fromTo(slot, { scale: 0.4 }, { scale: 1, duration: 0.5, ease: 'back.out(3)', delay: 0.5 });
    }
    countEl.textContent = linked.size;
    if (linked.size === 3) {
      playScreen.classList.add('is-complete');
      sec.querySelector('.e1-play__how:not(.e1-play__done)').hidden = true;
      sec.querySelector('.e1-play__done').hidden = false;
      // C-13: con las tres conexiones, la cúpula se eleva (la página baja sola hasta verla arriba)
      const dome = ScrollTrigger.getById('e1-dome');
      if (!auto && dome && !reduce) {
        gsap.delayedCall(0.9, () => gsap.to(window, { scrollTo: dome.start + (dome.end - dome.start) * 0.45, duration: 2.6, ease: 'power2.inOut' }));
      }
    }
  };

  // al tocar una esfera suena su pista (la de la llave todavía no tiene voz: llegó vacía)
  const SOUND = { mate: 'esferaMate', cuaderno: 'esferaCuaderno' };
  const sound = (key) => { if (audio.enabled && SOUND[key]) audio.play(SOUND[key]); };

  spheres.forEach((s) => s.addEventListener('click', () => {
    const key = s.dataset.sphere;
    if (active !== key) sound(key);
    if (linked.has(key)) { showBubble(key); return; }
    select(active === key ? null : key); // volver a tocarla quita el tinte
  }));

  objs.forEach((o) => o.addEventListener('click', () => {
    const key = o.dataset.obj;
    if (linked.has(key)) return;
    if (!active) {
      // sin esfera elegida: una pista
      if (!reduce) gsap.fromTo(spheres.filter((s) => !linked.has(s.dataset.sphere)).map((s) => s.firstElementChild), { scale: 1 }, { scale: 1.2, yoyo: true, repeat: 1, duration: 0.2, stagger: 0.08 });
      return;
    }
    if (key === active) {
      connect(key);
      select(null);
    } else if (!reduce) {
      gsap.fromTo(o, { x: 0 }, { x: 8, duration: 0.06, repeat: 5, yoyo: true, ease: 'none', clearProps: 'x' });
    }
  }));

  // Nunca bloquea: al llegar a la cúpula, lo que falte se conecta solo.
  const completeAll = () => {
    select(null);
    ['llave', 'mate', 'cuaderno'].forEach((k, i) => {
      if (linked.has(k)) return;
      gsap.delayedCall(reduce ? 0 : i * 0.15, () => connect(k, !reduce, true));
    });
  };
  ScrollTrigger.create({ trigger: sec.querySelector('[data-dome]'), start: 'top 75%', onEnter: completeAll });

  if (!reduce) {
    gsap.from([...spheres, ...objs, scene.querySelector('.e1-platform')], {
      opacity: 0, y: 30, duration: 0.6, stagger: 0.06, ease: 'power3.out',
      scrollTrigger: { trigger: scene, start: 'top 75%', once: true },
    });
  }
}

// --- La cúpula se eleva y la cámara entra por la puerta --------------------------
function dome(sec) {
  const wrap = sec.querySelector('[data-dome]');
  const pin = wrap.querySelector('.e1-dome__pin');
  const stage = wrap.querySelector('.e1-dome__stage');
  const body = wrap.querySelector('.dome__body');
  const frame = wrap.querySelector('.door__frame');
  const glow = wrap.querySelector('.door__glow');
  const gems = wrap.querySelectorAll('.dome__gems circle');
  const copy = wrap.querySelector('.e1-dome__copy');
  const flash = wrap.querySelector('.e1-dome__flash');

  if (reduce) { wrap.style.height = 'auto'; return; }

  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: { id: 'e1-dome', trigger: wrap, start: 'top top', end: () => `+=${window.innerHeight * 2.2}`, pin, scrub: 0.6 },
  });
  tl.from(stage, { yPercent: 40, opacity: 0, duration: 0.5, ease: 'power3.out' })
    .from(body, { scaleY: 0.05, transformOrigin: '50% 100%', duration: 0.7, ease: 'power3.out' }, '<0.1')
    .from(gems, { scale: 0, transformOrigin: 'center', stagger: 0.1, duration: 0.3, ease: 'back.out(3)' }, '-=0.3')
    .from(copy.children, { opacity: 0, y: 16, stagger: 0.08, duration: 0.35 }, '<')
    .from(frame, { drawSVG: '50% 50%', duration: 0.5 })
    .to(glow, { opacity: 1, duration: 0.4 })
    .to(copy, { opacity: 0, y: -20, duration: 0.3 }, '+=0.2')
    // la cámara entra por la puerta
    .to(stage, { scale: 9, transformOrigin: '50% 80%', duration: 1.2, ease: 'power2.in' }, '<')
    .to(flash, { opacity: 1, duration: 0.35 }, '-=0.35');
}
