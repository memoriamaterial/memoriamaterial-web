// Memoria Material · versión 2 · Los tres mundos y la Etapa 5, como en la versión 1 (js/stages/e2.js y e5e6.js).
// Se avanza con el scroll: de puerta en puerta en la llave, línea por línea en el mate y en el cuaderno,
// y cada audio suena en su lugar, cuando se llega a él. Lo que en la versión 1 era juego (arrastrar la
// llave, abrir los cajones, sentarse) acá sucede solo, al avanzar: la web explica, no se juega.
import { audio } from './audio.js';

const { gsap, ScrollTrigger } = window;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const vh = () => window.innerHeight;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// Sonidos de una escena con scroll: cada uno suena una vez, al pasar su paso bajando.
// - data-voz: la voz que dice esa línea (si otra voz está sonando, espera su turno).
// - data-sfx / data-drain: efectos de la línea. Si la línea tiene voz, el efecto suena cuando la voz termina.
// - extra: efectos sueltos en un momento de la escena ({ id, label }).
function sfxCues(tl, items, { prefix = '', extra = [] } = {}) {
  const cues = [];
  items.forEach((li, i) => {
    const t = tl.labels[`${prefix}step${i}`] + 0.25;
    const voz = li.dataset.voz;
    if (voz) cues.push({ id: voz, voz: true, li, t });
    (li.dataset.drain || li.dataset.sfx || '').split(/\s+/).filter(Boolean)
      .forEach((id) => cues.push({ id, li, card: li.querySelector(`[data-voice="${id}"]`), t, after: voz }));
  });
  extra.forEach((e) => cues.push({ id: e.id, t: tl.labels[e.label] + (e.offset || 0) }));
  const fire = (c) => { if (audio.enabled) audio.play(c.id, c.card); };
  return () => {
    const now = tl.time();
    cues.forEach((c) => {
      if (!c.passed && now >= c.t) {
        c.passed = true;
        if (c.voz) return; // las voces suenan solo con play
        if (c.after && audio.enabled) audio.after(c.after, () => fire(c)); else fire(c);
      } else if (c.passed && now < c.t) c.passed = false;
    });
  };
}

// Diálogo en pasos: la línea actual entra, la anterior sube y se atenúa.
function dialog(tl, items, { onStep, prefix = '', previa = true } = {}) {
  items.forEach((li, i) => {
    const at = `${prefix}step${i}`;
    tl.addLabel(at);
    if (items[i - 2]) tl.to(items[i - 2], { opacity: 0, duration: 0.25 }, at);
    // la línea anterior sube atenuada; en el mate (previa: false) se va, así el escenario puede ser grande
    if (items[i - 1]) tl.to(items[i - 1], previa ? { yPercent: -112, opacity: 0.35, duration: 0.35 } : { yPercent: -30, opacity: 0, duration: 0.3 }, at);
    tl.fromTo(li, { yPercent: 50, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }, at);
    onStep?.(li, i, at);
    tl.to({}, { duration: 0.5 }); // tiempo de lectura
  });
  return tl;
}

// --- Mundo de la llave: el camino de puerta en puerta ------------------------------------------
function llave() {
  const wrap = $('#e2-llave .llave');
  if (!wrap) return;
  const pin = $('.llave__pin', wrap);
  const track = $('.llave__track', wrap);
  const pips = $$('.llave__doors i', wrap);
  const panels = [...track.children];
  const v = (k) => $(`[data-voice="${k}"]`, wrap);
  const mesita = $('.mesita', wrap);
  const cajon = $$('.cajon', wrap)[1];
  const found = $('[data-found]', wrap);
  const lock = $('[data-lock]', wrap);
  const ojo = $('.cerradura__ojo', lock);

  const distance = () => track.scrollWidth - pin.clientWidth;
  const tween = gsap.to(track, {
    x: () => -distance(), ease: 'none',
    scrollTrigger: {
      trigger: wrap, pin, start: 'top top', end: () => `+=${Math.max(distance(), vh() * 4.5)}`, scrub: 0.5, invalidateOnRefresh: true,
      onUpdate: (self) => pips.forEach((p, i) => p.classList.toggle('is-on', self.progress >= (i + 0.55) / 4)),
    },
  });
  // cada panel aparece con un leve desfasaje (paralaje de profundidad)
  panels.forEach((p, n) => {
    const door = $('.door', p);
    if (door) gsap.fromTo(door, { scale: 0.86 }, { scale: 1.06, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
    const items = p.querySelectorAll('.llave__voices, .llave__copy, .mesita, .cerradura');
    if (items.length && n > 0) gsap.from(items, { y: 40, opacity: 0, stagger: 0.08, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left 70%', toggleActions: 'play none none reverse' } });
  });

  // las voces, cada una entre sus puertas
  const al = (panel, fn) => ScrollTrigger.create({ trigger: panel, containerAnimation: tween, start: 'left 55%', onEnter: fn });
  // las voces de cada panel suenan solo con play (sus tarjetas están en cada panel)

  // "Creo que la guardaste en la mesita de luz." → se abre el segundo cajón: "¡Sí! ¡Acá están!"
  let abierto = false;
  function abrirCajon() {
    if (abierto) return;
    abierto = true;
    cajon.classList.add('is-open');
    mesita.classList.add('is-llave');
    if (audio.enabled) audio.play('llavesCajon');
    found.hidden = false;
    if (!reduce) gsap.from(found, { y: 12, opacity: 0, duration: 0.45, delay: 0.3 });
  }
  // el cajón se abre al cruzar el panel de la mesita
  ScrollTrigger.create({ trigger: panels[3], containerAnimation: tween, start: 'left 25%', onEnter: abrirCajon });

  // la cerradura gigante: la llave entra, gira y la puerta se abre
  const llaveEnLaCerradura = $('[data-llave-drag]', wrap).cloneNode(true);
  llaveEnLaCerradura.classList.add('cerradura__llave');
  lock.appendChild(llaveEnLaCerradura);
  let usada = false;
  ScrollTrigger.create({
    trigger: panels.at(-1), containerAnimation: tween, start: 'left 45%',
    onEnter: () => {
      if (usada) return;
      usada = true;
      abrirCajon();
      mesita.classList.add('is-usada');
      const t = reduce ? 0 : 1;
      gsap.timeline()
        .fromTo(llaveEnLaCerradura, { x: -260, y: 60, rotation: -20, opacity: 0 }, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.9 * t, ease: 'power3.out' })
        .add(() => { llaveEnLaCerradura.classList.add('is-in'); if (audio.enabled) audio.play('llavesMano'); })
        .to(llaveEnLaCerradura, { rotation: 90, transformOrigin: '50% 92%', duration: 0.55 * t, ease: 'power2.inOut' }, '+=0.3')
        .add(() => { lock.classList.add('is-open'); if (audio.enabled) audio.after('llavesMano', () => audio.play('llavesAbriendo')); }, '+=0.2');
    },
  });
  // la llave queda apuntando al ojo de la cerradura de la foto
  const ubicar = () => {
    const l = lock.getBoundingClientRect(), o = ojo.getBoundingClientRect();
    llaveEnLaCerradura.style.left = `${o.left + o.width / 2 - l.left}px`;
    llaveEnLaCerradura.style.top = `${o.top + o.height / 2 - l.top}px`;
  };
  ScrollTrigger.addEventListener('refresh', ubicar);
  ubicar();
}

// --- Pasajes por la cúpula: el objeto recorrido pasa a B/N y se colorea el siguiente ------------
function swaps() {
  $$('[data-swap]').forEach((sw) => {
    const next = sw.dataset.swap;
    const order = ['llave', 'mate', 'cuaderno'];
    const prev = order[order.indexOf(next) - 1];
    const items = Object.fromEntries($$('[data-k]', sw).map((li) => [li.dataset.k, li]));
    items[prev].classList.add('is-color');
    ScrollTrigger.create({
      trigger: sw, start: 'top 65%',
      onEnter: () => { items[prev].classList.remove('is-color'); gsap.delayedCall(0.35, () => items[next].classList.add('is-color')); },
      onLeaveBack: () => { items[next].classList.remove('is-color'); items[prev].classList.add('is-color'); },
    });
    if (!reduce) gsap.from($('.e2-swap__in', sw).children, { y: 24, opacity: 0, stagger: 0.08, duration: 0.5, scrollTrigger: { trigger: sw, start: 'top 80%', once: true } });
  });
}

// --- Mundo del mate · escenario 1: la ronda en el charco ------------------------------------------
function mate1() {
  const wrap = $('.mate1');
  if (!wrap) return;
  const pin = $('.mate1__pin', wrap);
  const fotos = $('.mate1__fotos', wrap);
  const ronda = $('.mate1__foto--ronda', wrap);
  const lines = $$('.ronda [data-line]', wrap);
  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: { trigger: wrap, pin, start: 'top top', end: () => `+=${vh() * 5}`, scrub: 0.6 },
  });
  // al sentarse, el charco con las sillas a la deriva se funde a la ronda
  tl.to(ronda, { opacity: 1, duration: 1 });
  dialog(tl, lines, { previa: false });
  // al final, la cámara entra por el hueco del centro de la ronda
  tl.to(lines.slice(-2), { opacity: 0, duration: 0.3 })
    .to(fotos, { scale: 6, transformOrigin: '51% 45%', duration: 1.2, ease: 'power2.in' }, '+=0.3')
    .to(fotos, { opacity: 0, duration: 0.3 }, '-=0.3');
  tl.eventCallback('onUpdate', sfxCues(tl, lines));
}

// --- Mundo del mate · escenario 2: la mañana -----------------------------------------------------
function mate2() {
  const wrap = $('.mate2');
  if (!wrap) return;
  const pin = $('.mate2__pin', wrap);
  const lines = $$('.manana [data-line]', wrap);
  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: { trigger: wrap, pin, start: 'top top', end: () => `+=${vh() * 5}`, scrub: 0.6,
      // al salir de la escena los pájaros y la pava dejan de sonar
      onLeave: () => audio.stopSfx(['pajaros', 'pavaHirviendo']), onLeaveBack: () => audio.stopSfx(['pajaros', 'pavaHirviendo']) },
  });
  tl.addLabel('pajaros', 0)
    .from($('.mate2__copy', wrap), { opacity: 0, y: 20, duration: 0.4 })
    .addLabel('pava', '+=0.6')
    .to({}, { duration: 0.4 }, 'pava'); // la pava empieza a sonar un poco después de los pájaros
  dialog(tl, lines, { previa: false });
  tl.to(lines.slice(-2), { opacity: 0, duration: 0.2 });
  const sync = sfxCues(tl, lines, { extra: [{ id: 'pajaros', label: 'pajaros', offset: 0.02 }, { id: 'pavaHirviendo', label: 'pava' }] });
  // la pava suena solo hasta el siguiente diálogo: cuando entra "Buen día hijo…", se apaga con un fundido corto
  const corte = tl.labels.step1;
  let cortada = false;
  tl.eventCallback('onUpdate', () => {
    sync();
    if (!cortada && tl.time() >= corte) { cortada = true; audio.stopSfx('pavaHirviendo', 0.4); }
    else if (cortada && tl.time() < corte) cortada = false;
  });
}

// --- Mundo del cuaderno: materiales → recetas → la salida dibujada ----------------------------------
function cuaderno() {
  const wrap = $('.cuaderno');
  if (!wrap) return;
  const pin = $('.cuaderno__pin', wrap);
  const hojas = $$('.hojas i', wrap);
  const polvo = $('.polvo', wrap), cream = $('.cuaderno__cream', wrap), horno = $('.horno', wrap);
  const maqueta = $('.cuaderno__maqueta', wrap);
  const [mat, rec] = ['materiales', 'recetas'].map((k) => $(`[data-cq="${k}"]`, wrap));
  const [hMat, hRec] = ['materiales', 'recetas'].map((k) => $(`[data-cq-head="${k}"]`, wrap));
  const torta = $('.torta', wrap), final = $('.cuaderno__final', wrap), libro = $('.libro', wrap);

  // hojas sueltas flotando; se ordenan como un camino de plataformas
  hojas.forEach((h) => gsap.set(h, { left: `${gsap.utils.random(8, 92)}%`, top: `${gsap.utils.random(20, 85)}%`, rotation: gsap.utils.random(-50, 50) }));
  const path = (i) => ({ left: `${10 + i * 13}%`, top: `${82 - i * 7}%`, rotation: gsap.utils.random(-6, 6) });
  const notas = (box, li) => (li.dataset.notas || '').split(',').filter(Boolean).map((n) => $$('[data-nota]', box)[+n]);

  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: { trigger: wrap, pin, start: 'top top', end: () => `+=${vh() * 8}`, scrub: 0.6 },
  });
  tl.addLabel('hojas', 0)
    .from(hMat, { opacity: 0, y: 16, duration: 0.3 })
    .to(hojas, { left: (i) => path(i).left, top: (i) => path(i).top, rotation: (i) => path(i).rotation, duration: 1, stagger: 0.08 }, 0)
    .to(polvo, { opacity: 0.8, y: -30, duration: 0.6 }, 0.4)
    .to(pin, { x: 5, duration: 0.05, repeat: 9, yoyo: true, ease: 'none' }, 0.5)
    .to(polvo, { opacity: 0, duration: 0.5 }, 1.2);

  const matLines = $$('[data-line]', mat);
  dialog(tl, matLines, {
    prefix: 'mat-',
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
  const recLines = $$('[data-line]', rec);
  gsap.set(recLines, { opacity: 0 });
  dialog(tl, recLines, {
    prefix: 'rec-',
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
  const syncMat = sfxCues(tl, matLines, { prefix: 'mat-', extra: [{ id: 'paginas1', label: 'hojas', offset: 0.05 }] });
  const syncRec = sfxCues(tl, recLines, { prefix: 'rec-', extra: [{ id: 'paginas2', label: 'recetas', offset: 0.3 }] });
  tl.eventCallback('onUpdate', () => { syncMat(); syncRec(); });
}

// --- Etapa 5: el pasillo de objetos (la cámara avanza por el escenario de Unreal hasta los Oculus) -------
function pasilloDeObjetos() {
  const wrap = $('[data-hall]');
  if (!wrap) return;
  const pin = $('.hall__pin', wrap);
  const foto = $('.hall__foto', wrap);
  const desc = $('.hall__desc', wrap);
  if (reduce) return;
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: wrap, pin, start: 'top top', end: () => `+=${vh() * 3.5}`, scrub: 1 },
  });
  // primero la descripción, en el centro del pasillo; después la cámara llega hasta los Oculus
  tl.fromTo(foto, { scale: 1 }, { scale: 1.9, transformOrigin: '50% 50%', duration: 1, ease: 'power1.in' }, 0)
    .fromTo(desc, { opacity: 1, y: 0 }, { opacity: 0, y: -30, duration: 0.15, ease: 'power2.in' }, 0.4);
}

export function mundosV1() {
  llave();
  swaps();
  mate1();
  mate2();
  cuaderno();
  pasilloDeObjetos();
}
