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
  // lo que se escucha de fondo: sonidos (y voces) en orden, "id,id:ms desde el inicio". Tocar de nuevo detiene.
  const parar = (b) => {
    (b._timers || []).forEach(clearTimeout); b._timers = [];
    const ids = (b.dataset.seq || b.dataset.seqv).split(',').map((x) => x.split(':')[0]);
    audio.stopSfx(ids.filter((id) => VOICES[id]?.sfx));
    if (ids.some((id) => audio.current?.id === id)) { audio.queue = []; audio.pause(); }
    b.classList.remove('is-playing');
  };
  $$('[data-seq]').forEach((b) => b.addEventListener('click', () => {
    if (b.classList.contains('is-playing')) return parar(b);
    if (!audio.enabled) audio.enable();
    const partes = b.dataset.seq.split(',').map((x) => { const [id, ms] = x.split(':'); return { id, ms: Number(ms || 0) }; });
    b._timers = partes.map(({ id, ms }) => setTimeout(() => audio.play(id), ms));
    const fin = Math.max(...partes.map(({ id, ms }) => ms + VOICES[id].cues.at(-1)[1] * 1000));
    b.classList.add('is-playing');
    b._timers.push(setTimeout(() => b.classList.remove('is-playing'), fin));
  }));
  // las voces de un mundo, una detrás de otra (cada una espera a que termine la anterior)
  $$('[data-seqv]').forEach((b) => b.addEventListener('click', () => {
    if (b.classList.contains('is-playing')) return parar(b);
    if (!audio.enabled) audio.enable();
    const ids = b.dataset.seqv.split(',');
    audio.play(ids[0]);
    ids.slice(1).forEach((id) => audio.autoplay(id));
    const fin = ids.reduce((t, id) => t + VOICES[id].cues.at(-1)[1] * 1000 + 250, 0);
    b.classList.add('is-playing');
    b._timers = [setTimeout(() => b.classList.remove('is-playing'), fin)];
  }));
  // el ruido blanco del aula (el mismo que prende el botón del encabezado)
  const ruidos = $$('[data-ruido]');
  ruidos.forEach((b) => b.addEventListener('click', () => audio.toggle()));
  audio.on((a) => ruidos.forEach((b) => b.setAttribute('aria-pressed', String(a.enabled))));
  // "Leer" en las fichas de los mundos
  $$('[data-leer-ficha]').forEach((b) => b.addEventListener('click', () => {
    const txt = $('.ficha__txt', b.closest('.ficha'));
    txt.hidden = !txt.hidden;
    b.setAttribute('aria-expanded', String(!txt.hidden));
    b.textContent = txt.hidden ? 'Leer' : 'Ocultar';
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
  if (!sec) return;
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
  if (!sec) return;
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

// --- Decoración: tramas y elementos de la marca, recoloreados, flotando, sin superponerse --------
// [archivo, color, ancho px, x, y, giro, movimiento a|b|c, duración s]
const AR = { 'trama-01': 147.76 / 378.53, 'trama-02': 210.85 / 91.77, 'trama-03': 120.86 / 54.91, 'elemento-cuadrado-curvo': 190.06 / 185.54, 'elemento-banda-muesca': 446.17 / 172.59, 'elemento-banda-curva': 662.51 / 185.54, 'elemento-banda-dientes': 531.32 / 175.09 };
const DECO = {
  inicio: [['elemento-banda-curva', 'fucsia', 230, '-2%', '14%', -6, 'a', 16], ['trama-01', 'celeste', 46, '12%', '52%', 8, 'b', 13], ['trama-02', 'amarillo', 140, '6%', '80%', -8, 'c', 12], ['elemento-banda-muesca', 'celeste', 190, '80%', '15%', 5, 'a', 15], ['elemento-cuadrado-curvo', 'amarillo', 96, '84%', '48%', 10, 'b', 17], ['trama-03', 'fucsia', 130, '76%', '80%', -5, 'c', 14]],
  experiencia: [['trama-02', 'fucsia', 120, '47%', '9%', -6, 'a', 14], ['elemento-banda-dientes', 'celeste', 150, '72%', '11%', 4, 'b', 16], ['trama-01', 'amarillo', 34, '93%', '42%', 0, 'c', 13]],
  e1: [['elemento-banda-dientes', 'amarillo', 170, '62%', '12%', -4, 'a', 15], ['trama-03', 'celeste', 110, '3%', '86%', 8, 'b', 13], ['trama-01', 'fucsia', 40, '88%', '80%', 12, 'c', 16]],
  e2: [['trama-02', 'celeste', 150, '58%', '13%', 6, 'b', 14], ['elemento-cuadrado-curvo', 'fucsia', 80, '84%', '18%', -8, 'a', 17], ['elemento-banda-muesca', 'amarillo', 160, '2%', '88%', -3, 'c', 15]],
  'e2-mundos': [['elemento-banda-curva', 'celeste', 200, '50%', '5%', -3, 'a', 16], ['trama-03', 'amarillo', 100, '80%', '6%', 6, 'b', 13]],
  e3: [['trama-01', 'celeste', 42, '70%', '10%', -10, 'a', 14], ['elemento-banda-curva', 'amarillo', 180, '78%', '87%', 3, 'b', 16], ['trama-02', 'fucsia', 120, '3%', '86%', -6, 'c', 13]],
  e4: [['elemento-banda-dientes', 'fucsia', 160, '64%', '12%', 5, 'c', 15], ['trama-03', 'crema', 100, '4%', '87%', -4, 'a', 14], ['elemento-cuadrado-curvo', 'celeste', 74, '88%', '84%', 12, 'b', 18]],
  e5: [['trama-02', 'amarillo', 140, '60%', '12%', -5, 'a', 13], ['elemento-banda-muesca', 'fucsia', 150, '79%', '86%', 4, 'b', 15], ['trama-01', 'celeste', 38, '5%', '82%', 8, 'c', 16]],
  e6: [['elemento-banda-curva', 'celeste', 190, '58%', '11%', -4, 'b', 16], ['trama-03', 'fucsia', 110, '81%', '86%', 6, 'a', 13], ['elemento-cuadrado-curvo', 'amarillo', 70, '4%', '86%', -10, 'c', 15]],
  cierre: [['trama-01', 'fucsia', 44, '10%', '24%', -8, 'a', 15], ['elemento-banda-dientes', 'celeste', 170, '78%', '20%', 4, 'b', 16], ['trama-02', 'amarillo', 140, '8%', '76%', 6, 'c', 14], ['elemento-banda-muesca', 'fucsia', 160, '79%', '74%', -4, 'a', 17]],
};
function decoracion() {
  Object.entries(DECO).forEach(([id, items]) => {
    const box = $(`#${id} .deco`);
    if (!box) return;
    box.innerHTML = items.map(([f, c, w, x, y, r, a, d], k) =>
      `<span class="tr" style="--ar:${AR[f].toFixed(3)};--c:var(--${c});--w:${w}px;--x:${x};--y:${y};--r:${r}deg;--anim:flota-${a};--d:${d}s;--dl:${-k * 3.1}s"><i style="-webkit-mask-image:url(assets/graficos/${f}.svg);mask-image:url(assets/graficos/${f}.svg)"></i></span>`).join('');
  });
}

// --- Etapa 2: los objetos se recorren en orden ------------------------------------------
function etapa2() {
  const sec = $('#e2');
  if (!sec) return;
  const gs = $$('.e2a g[data-k]', sec);
  const cap = $('[data-e2-paso]', sec);
  const TXT = ['Primero, la llave', 'Después, el mate', 'Por último, el cuaderno'];
  let i = 0, t = null;
  const paso = () => { gs.forEach((g, k) => g.classList.toggle('is-on', k === i)); cap.textContent = TXT[i]; i = (i + 1) % 3; };
  paso();
  if (reduce) return;
  alVer(sec, () => { if (!t) t = setInterval(paso, 1900); }, () => { clearInterval(t); t = null; });
}

// --- Los tres mundos: cada ficha muestra su secuencia ---------------------------------------
function fichas() {
  const sec = $('#e2-mundos');
  if (!sec) return;
  const ciclos = [];
  // fotos que se suceden
  const fundido = (ficha, cada) => {
    const fotos = $$('.ficha__foto', ficha);
    let i = 0;
    return { fotos, next() { fotos.forEach((f, k) => f.classList.toggle('is-on', k === i)); const cur = i; i = (i + 1) % fotos.length; return cur; }, cada };
  };
  // mundo de la llave: cajas → regalos → mesitas → la llave entra en la cerradura y se abre la salida
  const fl = $('[data-ficha="llave"]', sec);
  const llave = $('.fa-llave', fl), salida = $('.fa-salida', fl);
  const sl = fundido(fl, 2300);
  const tlLlave = gsap.timeline({ paused: true })
    .set(llave, { opacity: 1, x: 120, y: 330, rotation: -30, transformOrigin: '20px 96px' })
    .to(llave, { x: 388, y: 192, rotation: 0, duration: 1.1, ease: 'power2.inOut' })
    .to(llave, { rotation: 90, duration: 0.5, ease: 'power2.inOut' })
    .to(salida, { opacity: 0.75, duration: 0.5 }, '-=0.1')
    .to({}, { duration: 0.9 })
    .to([llave, salida], { opacity: 0, duration: 0.3 });
  ciclos.push(() => { const k = sl.next(); if (k === 3 && !reduce) tlLlave.restart(); });
  // mundo del mate: el charco → la ronda → la mañana
  const sm = fundido($('[data-ficha="mate"]', sec), 2300);
  ciclos.push(() => sm.next());
  // mundo del cuaderno: las hojas sueltas se ordenan en un camino
  const fc = $('[data-ficha="cuaderno"]', sec);
  const g = $('.fa-hojas', fc);
  const NS = 'http://www.w3.org/2000/svg';
  const hojas = Array.from({ length: 7 }, () => { const r = document.createElementNS(NS, 'rect'); r.setAttribute('width', 70); r.setAttribute('height', 44); r.setAttribute('rx', 4); g.appendChild(r); return r; });
  const tlCq = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.8 });
  hojas.forEach((h, k) => tlCq.fromTo(h, { x: gsap.utils.random(80, 860), y: gsap.utils.random(60, 420), rotation: gsap.utils.random(-50, 50), opacity: 0.85 }, { x: 120 + k * 112, y: 430 - k * 48, rotation: gsap.utils.random(-5, 5), duration: 1, ease: 'power2.inOut' }, k * 0.12));
  tlCq.to({}, { duration: 1.4 }).to(hojas, { opacity: 0, duration: 0.4 });
  let t = null;
  const tick = () => ciclos.forEach((c) => c());
  if (reduce) return;
  alVer(sec, () => { if (!t) { tick(); t = setInterval(tick, 2300); tlCq.play(); } }, () => { clearInterval(t); t = null; tlCq.pause(); });
}

// --- Etapa 3: el pasillo (la cámara avanza) y después, en el aula, las luces hasta el tótem -------
function etapa3() {
  const sec = $('#e3');
  if (!sec) return;
  const box = $('[data-aula-clone]', sec);
  const src = $('#experiencia .aula-iso');
  const svg = src.cloneNode(true);
  box.appendChild(svg);
  const NS = 'http://www.w3.org/2000/svg';
  const led = $('.a-led', svg);
  const yo = document.createElementNS(NS, 'circle');
  yo.setAttribute('r', 9); yo.setAttribute('class', 'e3-caminante');
  svg.appendChild(yo);
  const len = led.getTotalLength();
  const ir = (p) => { const pt = led.getPointAtLength(len * (1 - p)); yo.setAttribute('cx', pt.x); yo.setAttribute('cy', pt.y - 10); };
  ir(0);
  const foto = $('.e3-pasillo .escena__foto', sec), pulso = $('.e3-pulso', sec), pasillo = $('.e3-pasillo', sec);
  const holo = $('.a-holo-icon', svg);
  const lugar = $('[data-e3-lugar]', sec), cap = $('[data-e3-paso]', sec);
  const texto = (l, c) => () => { lugar.textContent = l; cap.textContent = c; };
  if (reduce) { box.style.opacity = 0; return; }
  const p = { v: 0 };
  const tl = gsap.timeline({ repeat: -1, paused: true });
  tl.call(texto('En Unreal · el pasillo', 'La voz pide pensar en un objeto'))
    .set(pasillo, { opacity: 1 }).set(box, { opacity: 0 }).set(foto, { scale: 1 })
    .to(foto, { scale: 1.3, duration: 4.5, ease: 'power1.in' }, '<')
    .fromTo(pulso, { opacity: 1, bottom: '6%', scale: 1.4 }, { bottom: '46%', scale: 0.3, opacity: 0, duration: 1.5, repeat: 2, ease: 'power1.in' }, '<')
    .call(texto('En el aula · el camino de luces', 'Sale de Unreal y sigue las luces hasta el tótem'))
    .to(pasillo, { opacity: 0, duration: 0.6 })
    .to(box, { opacity: 1, duration: 0.6 }, '<')
    .fromTo(p, { v: 0 }, { v: 1, duration: 3, ease: 'power1.inOut', onUpdate: () => ir(p.v) })
    .call(texto('En el aula · el holograma', 'El holograma muestra el ícono de la puerta'))
    .fromTo(holo, { scale: 1 }, { scale: 1.8, transformOrigin: '14px 14px', duration: 0.5, yoyo: true, repeat: 3 })
    .to(box, { opacity: 0, duration: 0.5 }, '+=0.4')
    .set(p, { v: 0, onComplete: () => ir(0) });
  alVer(sec, () => tl.play(), () => tl.pause());
}

// --- Etapa 4: destello, la primera etapa invertida con siluetas, y el tótem vacío con humo -------
function etapa4() {
  const sec = $('#e4');
  if (!sec) return;
  const flash = $('.e4-flash', sec), sil = $('.e4-sil', sec), aula = $('.e4-aula', sec), humo = $$('.e4-humo circle', sec);
  const lugar = $('[data-e4-lugar]', sec), cap = $('[data-e4-paso]', sec);
  const texto = (l, c) => () => { lugar.textContent = l; cap.textContent = c; };
  if (reduce) return;
  const tl = gsap.timeline({ repeat: -1, paused: true });
  tl.call(texto('En Unreal · la primera etapa, invertida', 'El destello'))
    .set(aula, { opacity: 0 })
    .fromTo(flash, { opacity: 1 }, { opacity: 0, duration: 1.1, ease: 'power2.in' })
    .call(texto('En Unreal · la primera etapa, invertida', 'Solo quedan las siluetas'))
    .to(sil, { x: 8, duration: 0.06, repeat: 7, yoyo: true, ease: 'steps(1)' }, '+=0.6')
    .to(sil, { opacity: 0.35, duration: 0.08, repeat: 5, yoyo: true, ease: 'steps(1)' }, '+=0.8')
    .call(texto('En el aula · el tótem', 'El tótem está vacío, con humo'), null, '+=0.8')
    .to(aula, { opacity: 1, duration: 0.7 })
    .fromTo(humo, { y: 30, opacity: 0, scale: 0.6, transformOrigin: 'center' }, { y: -60, opacity: 0.35, scale: 1.3, duration: 2.4, stagger: 0.35, ease: 'power1.out' })
    .to(humo, { opacity: 0, duration: 0.8 })
    .to(aula, { opacity: 0, duration: 0.5 }, '+=0.3');
  alVer(sec, () => tl.play(), () => tl.pause());
}

// --- Etapa 5: las pilas de objetos repetidos pasan a los costados hasta los Oculus ---------------
function etapa5() {
  const sec = $('#e5');
  if (!sec) return;
  const g = $('.e5-pilas', sec);
  const NS = 'http://www.w3.org/2000/svg';
  const OBJ = [['obj-llave', '0 0 100 260', 26, 68], ['obj-mate', '0 0 200 240', 56, 66], ['obj-cuaderno', '0 0 240 180', 70, 52]];
  const COL = ['#FCB614', '#ED4380', '#3CC5F2'];
  const items = Array.from({ length: 18 }, (_, k) => {
    const [id, vb, w, h] = OBJ[k % 3];
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', vb); s.setAttribute('width', w); s.setAttribute('height', h); s.style.color = COL[(k + 1) % 3];
    s.innerHTML = `<use href="#${id}"/>`;
    const w2 = document.createElementNS(NS, 'g'); w2.appendChild(s); g.appendChild(w2);
    return { el: w2, lado: k % 2 ? 1 : -1, w, h };
  });
  const oc = $('.e5-oculus', sec);
  if (reduce) return;
  const tl = gsap.timeline({ repeat: -1, paused: true });
  items.forEach(({ el, lado, w, h }, k) => {
    tl.fromTo(el, { x: 500 - w / 2 + lado * 20, y: 300 - h / 2, scale: 0.15, opacity: 0, transformOrigin: 'center' },
      { x: 500 + lado * gsap.utils.random(260, 470) - w / 2, y: gsap.utils.random(330, 470) - h / 2, scale: gsap.utils.random(1.2, 1.9), opacity: 0.9, duration: 3.2, ease: 'power2.in' }, k * 0.35)
      .to(el, { opacity: 0, duration: 0.4 }, k * 0.35 + 2.8);
  });
  tl.fromTo(oc, { scale: 0.8, transformOrigin: '500px 300px' }, { scale: 1.6, duration: 1.2, yoyo: true, repeat: 4, ease: 'sine.inOut' }, 0);
  alVer(sec, () => tl.play(), () => tl.pause());
}

// --- Etapa 6: el detector encuentra las tres esferas y emerge el tótem ------------------------------
function etapa6() {
  const sec = $('#e6');
  if (!sec) return;
  const campo = $('.e6-campo', sec);
  const OBJ = [['obj-llave', '0 0 100 260', 30, 78], ['obj-mate', '0 0 200 240', 62, 74], ['obj-cuaderno', '0 0 240 180', 80, 60]];
  let html = '';
  for (let k = 0; k < 24; k++) { const [id, vb, w, h] = OBJ[k % 3]; html += `<svg x="${(k * 137) % 940}" y="${40 + ((k * 89) % 440)}" width="${w}" height="${h}" viewBox="${vb}"><use href="#${id}"/></svg>`; }
  campo.innerHTML = html;
  const esf = $$('.e6-esferas circle', sec), lente = $('.e6-lente', sec), totem = $('.e6-totem', sec), n = $('[data-e6-n]', sec);
  const cuenta = (k) => () => { n.textContent = `${k} de 3 esferas`; };
  if (reduce) { esf.forEach((e) => { e.style.opacity = 1; }); totem.style.opacity = 1; n.textContent = '3 de 3 esferas'; return; }
  const tl = gsap.timeline({ repeat: -1, paused: true });
  tl.set(esf, { opacity: 0, x: 0, y: 0, scale: 1 }).set(totem, { opacity: 0, y: 120 }).set(lente, { attr: { cx: 500, cy: 281 } }).call(cuenta(0));
  esf.forEach((e, k) => {
    tl.to(lente, { attr: { cx: +e.getAttribute('cx'), cy: +e.getAttribute('cy') }, duration: 1.3, ease: 'power2.inOut' })
      .to(e, { opacity: 1, scale: 1.5, transformOrigin: 'center', duration: 0.3, yoyo: true, repeat: 1 })
      .set(e, { opacity: 1 })
      .call(cuenta(k + 1));
  });
  tl.to(lente, { attr: { cx: 500, cy: 281 }, duration: 1 })
    .to(totem, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' })
    .to(esf, { x: (i, el) => 500 - el.getAttribute('cx'), y: (i, el) => 330 - el.getAttribute('cy'), scale: 0.4, duration: 1, stagger: 0.2, ease: 'power2.in' })
    .to(esf, { opacity: 0, duration: 0.3 })
    .to(totem, { y: 120, opacity: 0, duration: 0.9, ease: 'power2.in' }, '+=0.5');
  alVer(sec, () => tl.play(), () => tl.pause());
}

// --- Cierre: las esferas físicas se encienden de a una ------------------------------------------------
function cierre() {
  const sec = $('#cierre');
  if (!sec) return;
  const es = $$('.cierre__esferas span', sec);
  let i = 0, t = null;
  const paso = () => { es.forEach((e, k) => e.classList.toggle('is-on', i === 3 || k === i)); i = (i + 1) % 4; };
  if (reduce) { es.forEach((e) => e.classList.add('is-on')); return; }
  alVer(sec, () => { if (!t) { paso(); t = setInterval(paso, 1400); } }, () => { clearInterval(t); t = null; });
}

decoracion();
sonido();
popups();
navegar();
riel();
entradas();
aula();
etapa1();
etapa2();
fichas();
etapa3();
etapa4();
etapa5();
etapa6();
cierre();
