// Memoria Material · versión 2
// Una web para EXPLICAR la experiencia. Lo único que se toca: abrir los pop-ups, dar play a un audio,
// pasar el mouse. Las animaciones muestran la mecánica: el visitante la mira, no la juega.
import { audio, VOICES } from './audio.js';
import { mundosV1 } from './v2-mundos.js';
import { relatos } from './v2-relatos.js';

const { gsap, ScrollToPlugin, DrawSVGPlugin, ScrollTrigger } = window;
gsap.registerPlugin(ScrollToPlugin, DrawSVGPlugin, ScrollTrigger);
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// --- Sonido: el botón del encabezado prende el ruido blanco suave del espacio físico ------------
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
  // "Leer": muestra el texto de la voz (los subtítulos, que siguen al audio).
  // El texto se abre DENTRO del pop-up sin cambiar el alto de la sección: en las etapas, el pop-up crece
  // como mucho hasta el alto de su fila (y si no entra, scrollea por dentro); en los pop-ups sueltos,
  // el texto se despliega encima de lo que sigue. Así la página no salta.
  $$('[data-leer]').forEach((b) => b.addEventListener('click', (e) => {
    e.preventDefault();
    const pp = b.closest('.pp');
    const on = !pp.classList.contains('is-leyendo');
    const fila = pp.closest('.etapa__grid');
    const altoFila = fila?.getBoundingClientRect().height;
    if (on && fila) {
      // lo que queda libre en la fila, repartido entre los textos del pop-up (cada uno scrollea por dentro)
      const textos = $$('.voice__text, .pp__txt', pp).length || 1;
      const libre = altoFila - pp.getBoundingClientRect().height - 10 * textos;
      pp.style.setProperty('--leer-max', `${Math.max(textos > 1 ? 64 : 96, Math.floor(libre / textos))}px`);
    }
    pp.style.marginBlock = ''; pp.style.alignSelf = '';
    pp.classList.toggle('is-leyendo', on);
    // si aun así no entra (varias voces), el pop-up se agranda por encima de lo que lo rodea
    // con márgenes negativos: la fila conserva su alto y nada se corre
    if (on && fila) {
      const sobra = pp.getBoundingClientRect().height - altoFila;
      if (sobra > 0) { pp.style.marginBlock = `0 ${-sobra}px`; pp.style.alignSelf = 'start'; }
    }
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
  // el ruido blanco del espacio físico (el mismo que prende el botón del encabezado)
  const ruidos = $$('[data-ruido]');
  ruidos.forEach((b) => b.addEventListener('click', () => audio.toggle()));
  audio.on((a) => ruidos.forEach((b) => b.setAttribute('aria-pressed', String(a.enabled))));
}

// --- Las voces suenan solas al llegar a cada sección (como en la versión 1) ----------------------
// Los navegadores no dejan sonar audio hasta que la persona toca algo (un clic, una tecla o un toque;
// el scroll no cuenta). Por eso el primer gesto en cualquier lugar de la página activa el sonido,
// y desde ahí cada sección reproduce su voz una sola vez al entrar en pantalla.
function vocesSolas() {
  const secs = $$('.v2-sec').filter((s) => $('.pp--voz [data-voice]', s));
  const sonar = (s) => {
    const cards = $$('.pp--voz [data-voice]', s);
    const ids = cards.map((c) => c.dataset.voice);
    audio.queue = audio.queue.filter((q) => ids.includes(q.id)); // las voces de secciones que ya pasaron no esperan más
    cards.forEach((card) => audio.autoplay(card.dataset.voice, card));
  };
  let visible = null;
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { visible = e.target; sonar(e.target); }
  }), { threshold: 0.5 });
  secs.forEach((s) => io.observe(s));

  const gestos = ['pointerdown', 'keydown', 'touchend'];
  const desbloquear = (e) => {
    gestos.forEach((g) => removeEventListener(g, desbloquear, true));
    // si el primer gesto es el botón de sonido (o el del ruido), ese botón decide
    if (e.target.closest?.('[data-sound-toggle], [data-ruido]')) return;
    if (!audio.enabled) {
      try { audio.enable(); } catch { return; }
    }
    if (visible) sonar(visible);
  };
  gestos.forEach((g) => addEventListener(g, desbloquear, { capture: true, passive: true }));
}

// --- Dónde está la persona: espacio físico · Unreal · Oculus (arriba a la derecha) ---------------
const LUGARES = {
  fisico: { txt: 'Espacio físico', ico: ['i-lugar'] },
  unreal: { txt: 'Unreal', ico: ['i-pc'] },
  'unreal+fisico': { txt: 'Unreal + espacio físico', ico: ['i-pc', 'i-lugar'] },
  'fisico>unreal': { txt: 'Espacio físico → Unreal', ico: ['i-lugar', 'i-pc'], sep: '→' },
  'oculus+fisico': { txt: 'Oculus + espacio físico', ico: ['i-oculus', 'i-lugar'] },
};
function dondeEstas() {
  const ui = $('[data-where-ui]');
  if (!ui) return;
  const icos = $('.where__icons', ui), txt = $('.where__txt', ui);
  const secs = $$('main > section');
  let actual;
  const poner = (k) => {
    if (k === actual) return;
    actual = k;
    const l = LUGARES[k];
    ui.classList.toggle('is-hidden', !l);
    if (!l) return;
    icos.innerHTML = l.ico.map((id) => `<svg><use href="#${id}"/></svg>`).join(`<i>${l.sep || '+'}</i>`);
    txt.textContent = l.txt;
    if (!reduce) gsap.fromTo(ui, { opacity: 0.2 }, { opacity: 1, duration: 0.4 });
  };
  const update = () => {
    const y = innerHeight * 0.5;
    const s = secs.find((el) => { const r = el.getBoundingClientRect(); return r.top <= y && r.bottom > y; });
    poner(s?.dataset.where);
    // el logo chico del encabezado aparece al dejar el inicio (ahí ya está el grande)
    document.body.classList.toggle('is-past-intro', scrollY > innerHeight * 0.6);
  };
  addEventListener('scroll', update, { passive: true });
  update();
}

// --- El logo se arma uniendo sus mitades, con eco, y aparece el lema (de la versión 1) ------------
function logo() {
  const svg = $('#inicio .logo');
  if (!svg || reduce) return;
  const NS = 'http://www.w3.org/2000/svg';
  const parte = (k) => $(`[data-p="${k}"]`, svg);
  // eco: cada mitad deja dos estelas que se apagan al encajar
  const ecos = {};
  ['topCrema', 'topFucsia', 'botCeleste', 'botCrema'].forEach((k) => {
    const p = parte(k);
    ecos[k] = [1, 2].map((n) => {
      const c = document.createElementNS(NS, 'use');
      c.setAttribute('href', p.getAttribute('href'));
      c.setAttribute('class', 'is-echo');
      c.style.opacity = (0.35 / n).toFixed(2);
      p.before(c);
      return c;
    });
  });
  const grupo = (k) => [parte(k), ...ecos[k]];
  const tag = $('.logo__tag', svg);
  const resto = $$('#inicio .inicio__txt, #inicio .inicio__q, #inicio .inicio__cta');
  const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 0.9 }, delay: 0.15 });
  tl.from(grupo('topCrema'), { x: -140, opacity: 0, stagger: 0.06 }, 0.1)
    .from(grupo('topFucsia'), { x: 160, opacity: 0, stagger: 0.06 }, 0.18)
    .from(grupo('botCeleste'), { x: -160, opacity: 0, stagger: 0.06 }, 0.24)
    .from(grupo('botCrema'), { x: 140, opacity: 0, stagger: 0.06 }, 0.3)
    .to(Object.values(ecos).flat(), { opacity: 0, duration: 0.5, ease: 'power1.out' }, 0.9)
    .from(tag, { clipPath: 'inset(0 100% 0 0)', duration: 0.8, ease: 'power3.inOut' }, 0.85)
    .from(resto, { y: 16, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, 1.1);
}

// --- La idea: el lema como afiche, línea por línea (de la versión 1) ------------------------------
function idea() {
  const sec = $('#idea');
  if (!sec || reduce) return;
  const lineas = $$('.lema__line', sec);
  const tl = gsap.timeline({ paused: true });
  lineas.forEach((l, i) => {
    tl.from($('.lema__w', l), { yPercent: 40, opacity: 0, duration: 0.6, ease: 'power2.out' }, i * 0.14)
      .from($('.lema__forma', l), { scale: 0, transformOrigin: 'left center', duration: 0.6, ease: 'power3.out' }, i * 0.14 + 0.15);
  });
  tl.from($$('.lema__copy > *', sec), { y: 16, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, 0.5);
  alVer(sec, () => tl.play());
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
    // la última sección marcada en el riel que ya empezó (las explicaciones y los bloques sin marca cuentan como su etapa)
    let i = 0;
    secs.forEach((s, k) => { if (s.getBoundingClientRect().top <= y) i = k; });
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

// --- El espacio físico: cada punto abre su ficha (como en la versión 1, js/ui.js · openPop) ---------
function espacio() {
  const dlg = $('#pop');
  if (!dlg) return;
  dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.closest('[data-close]')) dlg.close(); });
  $$('[data-pop-open]').forEach((btn) => btn.addEventListener('click', () => {
    btn.classList.add('is-seen');
    const tpl = $(`template[data-pop="${btn.dataset.popOpen}"]`);
    if (!tpl) return;
    const frag = tpl.content.cloneNode(true);
    const titulo = frag.querySelector('[data-title]');
    $('[data-pop-title]', dlg).innerHTML = titulo ? titulo.innerHTML : '';
    titulo?.remove();
    $('[data-pop-eyebrow]', dlg).textContent = tpl.dataset.eyebrow || '';
    const body = $('[data-pop-body]', dlg);
    body.replaceChildren(frag);
    $$('[data-voice]', body).forEach((card) => audio.registerCard(card));
    dlg.style.setProperty('--acc', `var(--${tpl.dataset.acc || 'crema'})`);
    dlg.showModal();
    if (!reduce) {
      gsap.fromTo(dlg, { opacity: 0, y: 24, clipPath: 'inset(8% 4% 8% 4% round 18px)' }, { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 18px)', duration: 0.45, ease: 'expo.out' });
      gsap.from(body.children, { opacity: 0, y: 10, stagger: 0.05, duration: 0.4, delay: 0.1, ease: 'power2.out' });
    }
  }));
}

// --- Etapa 1: cada esfera se conecta con su objeto y se eleva la cúpula -------------------
function etapa1() {
  const sec = $('#e1');
  if (!sec) return;
  const svg = $('.escena__anim', sec);
  const ORDEN = ['llave', 'mate', 'cuaderno'];
  const q = (sel) => $(sel, svg);
  const arcos = $$('.e1a-cupula path', svg);

  if (reduce) { // todo conectado, sin movimiento
    ORDEN.forEach((k) => { q(`[data-o="${k}"]`).style.opacity = 1; q(`[data-s="${k}"]`).style.opacity = 1; q(`[data-p="${k}"]`).style.fill = `var(--${k === 'llave' ? 'amarillo' : k === 'mate' ? 'fucsia' : 'celeste'})`; });
    arcos.forEach((a) => { a.style.opacity = 1; });
    return;
  }
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6, paused: true });
  tl.set($$('.e1a-lines path', svg), { drawSVG: '0%' })
    .set($$('.e1a-objs rect', svg), { opacity: 0 })
    .set($$('.e1a-spheres circle', svg), { opacity: 0.55, scale: 1, transformOrigin: 'center' })
    .set($$('.e1a-slots circle', svg), { fill: 'var(--violeta)' })
    .set(arcos, { opacity: 0, drawSVG: '0%' });
  ORDEN.forEach((k) => {
    const c = getComputedStyle(q(`[data-s="${k}"]`)).getPropertyValue('--c');
    tl.to(q(`[data-s="${k}"]`), { opacity: 1, scale: 1.25, duration: 0.35, yoyo: true, repeat: 1, ease: 'power2.out' }, '+=0.5')   // la esfera suena
      .to(q(`[data-l="${k}"]`), { drawSVG: '100%', duration: 0.9, ease: 'power2.inOut' })                                          // se conecta
      .to(q(`[data-o="${k}"]`), { opacity: 1, duration: 0.3 }, '-=0.1')                                                            // el objeto se ilumina
      .to(q(`[data-s="${k}"]`), { opacity: 1, duration: 0.3 }, '<')
      .to(q(`[data-p="${k}"]`), { fill: c, duration: 0.3 }, '<');                                                                  // y su esfera en la plataforma
  });
  tl.to(arcos, { opacity: 1, drawSVG: '100%', duration: 1, stagger: 0.18, ease: 'power2.out' }, '+=0.4')                       // se eleva la cúpula
    .to({}, { duration: 1.6 })
    .to(svg.children, { opacity: 0, duration: 0.4 })
    .set(svg.children, { opacity: 1 });
  alVer(sec, () => tl.play(), () => tl.pause());
}

// --- Elementos gráficos: acompañan la historia y marcan el avance del scroll ----------------------
// Salen de las letras del logo y cada uno tiene un papel:
// · tres ondas (trama-02), una por objeto (amarillo llave, fucsia mate, celeste cuaderno): en la Etapa 1 se
//   conectan desde los costados; en la Etapa 4 parpadean y se pierden; en la Etapa 6 se reencuentran.
// · la curva (cuadrado-curvo) sube desde abajo como la cúpula (Etapa 2 y cada vuelta a la cúpula).
// · la banda con dientes es la llave: avanza puerta por puerta en el mundo de la llave.
// · la banda con muesca se cierra desde los costados como las paredes del pasillo (Etapa 3).
// · en el cierre, las tres bandas (llave, mate, cuaderno) vuelven a encontrarse.
// Van siempre en los márgenes, sin tocar el contenido. Con movimiento reducido quedan quietas.
const AR = { 'trama-01': 147.76 / 378.53, 'trama-02': 210.85 / 91.77, 'trama-03': 120.86 / 54.91, 'elemento-cuadrado-curvo': 190.06 / 185.54, 'elemento-banda-muesca': 446.17 / 172.59, 'elemento-banda-curva': 662.51 / 185.54, 'elemento-banda-dientes': 531.32 / 175.09 };
function forma(box, f, c, w, css, espejo = false) {
  const el = document.createElement('span');
  el.className = 'tr tr--n';
  el.style.cssText = `--ar:${AR[f].toFixed(3)};--c:var(--${c});--w:${w}px;${css}`;
  el.innerHTML = `<i style="-webkit-mask-image:url(assets/graficos/${f}.svg);mask-image:url(assets/graficos/${f}.svg)${espejo ? ';transform:scaleX(-1)' : ''}"></i>`;
  box.appendChild(el);
  return el;
}
const capa = (sec) => $('.deco', sec) || sec.appendChild(Object.assign(document.createElement('div'), { className: 'deco' }));
// una línea de tiempo atada al recorrido de la sección por la pantalla (0 = asoma abajo, 1 = se va arriba)
function alScroll(trigger, build, { start = 'top bottom', end = 'bottom top' } = {}) {
  if (reduce) return;
  const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger, start, end, scrub: 0.8 } });
  build(tl);
  tl.to({}, { duration: Math.max(0, 1 - tl.duration()) });
}
// en las esquinas (a la altura del título y del texto final), donde nunca hay contenido a los costados
const ONDAS = [['amarillo', 'left:-56px;top:15%'], ['fucsia', 'left:-56px;top:86%'], ['celeste', 'right:-56px;top:15%']];

function narrativa() {
  // Etapa 1 · las tres ondas llegan desde los costados y se conectan (al irse, se juntan: va a subir la cúpula)
  const e1 = $('#e1');
  if (e1) {
    const ondas = ONDAS.map(([c, css], k) => forma(capa(e1), 'trama-02', c, 150, css, k === 2));
    alScroll(e1, (tl) => ondas.forEach((o, k) => {
      const lado = k === 2 ? 1 : -1;
      tl.fromTo(o, { x: lado * 200, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }, k * 0.04)
        .to(o, { x: -lado * 70, scale: 0.6, opacity: 0, duration: 0.3, ease: 'power2.in' }, 0.7);
    }));
  }
  // Etapa 2 · la cúpula: dos curvas suben desde abajo, enfrentadas
  const cupula = (sec, trigger = sec) => {
    const a = forma(capa(sec), 'elemento-cuadrado-curvo', 'crema', 120, 'left:-24px;bottom:-30px', true);
    const b = forma(capa(sec), 'elemento-cuadrado-curvo', 'crema', 120, 'right:-24px;bottom:-30px');
    alScroll(trigger, (tl) => tl.fromTo([a, b], { y: 220, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }, 0)
      .to([a, b], { y: -40, opacity: 0, duration: 0.25 }, 0.75));
  };
  if ($('#e2')) cupula($('#e2'));
  // cada vuelta a la cúpula entre los mundos
  $$('[data-swap]').forEach((sw) => { sw.style.position = 'relative'; cupula(sw); });
  // Mundo de la llave · la llave (banda con dientes) avanza de puerta en puerta, abajo, en su propio carril
  const pinLlave = $('#e2-llave .llave__pin');
  if (pinLlave) {
    const carril = pinLlave.appendChild(Object.assign(document.createElement('div'), { className: 'llave__carril' }));
    const llave = forma(carril, 'elemento-banda-dientes', 'amarillo', 74, 'left:0;top:0', true);
    if (!reduce) gsap.fromTo(llave, { left: '0%' }, { left: 'calc(100% - 74px)', ease: 'none', scrollTrigger: { trigger: '#e2-llave .llave', start: 'top top', end: () => ScrollTrigger.getAll().find((t) => t.pin === pinLlave)?.end ?? '+=4000', scrub: 0.5 } });
  }
  // Etapa 3 · el pasillo: dos bandas con muesca se cierran desde los costados y, al salir, se abren
  const e3 = $('#e3');
  if (e3) {
    const l = forma(capa(e3), 'elemento-banda-muesca', 'celeste', 260, 'left:-180px;top:46%', true);
    const r = forma(capa(e3), 'elemento-banda-muesca', 'celeste', 260, 'right:-180px;top:46%');
    alScroll(e3, (tl) => tl.fromTo(l, { x: -160, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 0)
      .fromTo(r, { x: 160, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 0)
      .to(l, { x: -160, opacity: 0, duration: 0.3 }, 0.7).to(r, { x: 160, opacity: 0, duration: 0.3 }, 0.7));
  }
  // Etapa 4 · objetos perdidos: las tres ondas están, parpadean y se pierden de a una
  const e4 = $('#e4');
  if (e4) {
    const ondas = ONDAS.map(([c, css], k) => forma(capa(e4), 'trama-02', c, 150, css, k === 2));
    alScroll(e4, (tl) => {
      tl.fromTo(ondas, { opacity: 0 }, { opacity: 1, duration: 0.15 }, 0.05);
      ondas.forEach((o, k) => tl.to(o, { opacity: 0.15, duration: 0.02, repeat: 5, yoyo: true, ease: 'steps(1)' }, 0.3 + k * 0.12)
        .to(o, { opacity: 0, x: (k === 2 ? 1 : -1) * 30, duration: 0.06 }, 0.42 + k * 0.12));
    });
  }
  // Etapa 6 · la búsqueda: las tres ondas aparecen sueltas en los márgenes y se juntan abajo, en el centro
  const e6 = $('#e6');
  if (e6) {
    const pos = [['amarillo', 'left:-30px;top:18%'], ['fucsia', 'right:-30px;top:16%'], ['celeste', 'left:-30px;top:70%']];
    const ondas = pos.map(([c, css]) => forma(capa(e6), 'trama-02', c, 96, css));
    alScroll(e6, (tl) => {
      tl.fromTo(ondas, { opacity: 0 }, { opacity: 1, duration: 0.12, stagger: 0.04 }, 0.1);
      ondas.forEach((o, k) => tl.to(o, {
        x: () => { const r = o.getBoundingClientRect(), s = e6.getBoundingClientRect(); return s.left + s.width / 2 + (k - 1) * 112 - r.width / 2 - (r.left - (gsap.getProperty(o, 'x') || 0)); },
        y: () => { const r = o.getBoundingClientRect(), s = e6.getBoundingClientRect(); return s.bottom - 72 - r.height / 2 - (r.top - (gsap.getProperty(o, 'y') || 0)) - r.height / 2; },
        duration: 0.35, ease: 'power2.inOut' }, 0.3));
    }, { start: 'top 90%', end: 'bottom 60%' });
  }
  // Cierre · el reencuentro: llave, mate y cuaderno (las tres bandas) entran desde los costados y se encuentran
  const ci = $('#cierre');
  if (ci) {
    const bandas = [forma(capa(ci), 'elemento-banda-dientes', 'amarillo', 220, 'left:-120px;top:150px', true),
      forma(capa(ci), 'elemento-banda-curva', 'fucsia', 260, 'right:-150px;top:300px'),
      forma(capa(ci), 'elemento-banda-muesca', 'celeste', 220, 'left:-120px;top:450px', true)];
    alScroll(ci, (tl) => bandas.forEach((b, k) => tl.fromTo(b, { x: (k === 1 ? 1 : -1) * 240, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, ease: 'power3.out' }, 0.1 + k * 0.1)), { start: 'top bottom', end: 'center center' });
  }
}

// --- Etapa 2: se eleva la Cúpula del Reencuadre, se entra por la puerta y los objetos se recorren en orden ---
// (la animación de la cúpula viene de la versión 1, js/stages/e1.js · dome)
function etapa2() {
  const sec = $('#e2');
  if (!sec) return;
  const gs = $$('.e2a g[data-k]', sec);
  const cup = $('.cupula', sec);
  const stage = $('.cupula__stage', cup), body = $('.dome__body', cup), frame = $('.door__frame', cup);
  const glow = $('.door__glow', cup), gems = $$('.dome__gems circle', cup), flash = $('.cupula__flash', cup);
  const marco = (i) => () => gs.forEach((g, k) => g.classList.toggle('is-on', k === i));
  if (reduce) { cup.style.display = 'none'; gs.forEach((g) => g.classList.add('is-on')); return; }
  const tl = gsap.timeline({ repeat: -1, paused: true, defaults: { ease: 'power2.inOut' } });
  tl.call(marco(-1))
    .set(cup, { opacity: 1 }).set(stage, { scale: 1 }).set(flash, { opacity: 0 }).set(glow, { opacity: 0 })
    .fromTo(stage, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
    .fromTo(body, { scaleY: 0.05, svgOrigin: '300 320' }, { scaleY: 1, svgOrigin: '300 320', duration: 1.1, ease: 'power3.out' }, '<0.1')
    .fromTo(gems, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, transformOrigin: '50% 50%', stagger: 0.15, duration: 0.45, ease: 'back.out(3)' }, '-=0.4')
    .fromTo(frame, { drawSVG: '50% 50%' }, { drawSVG: '0% 100%', duration: 0.8 })
    .to(glow, { opacity: 1, duration: 0.6 })
    // la cámara entra por la puerta
    .to(stage, { scale: 9, transformOrigin: '50% 80%', duration: 1.6, ease: 'power2.in' }, '+=0.4')
    .to(flash, { opacity: 1, duration: 0.45 }, '-=0.45')
    .to(cup, { opacity: 0, duration: 0.6 })
    // adentro: los tres objetos, en orden
    .call(marco(0)).to({}, { duration: 1.9 })
    .call(marco(1)).to({}, { duration: 1.9 })
    .call(marco(2)).to({}, { duration: 1.9 });
  alVer(sec, () => tl.play(), () => tl.pause());
}

// --- Etapa 3: el pasillo (la cámara avanza y aparece la consigna, como en la versión 1) ----------------
// y después, en el espacio físico, las luces hasta el tótem y el holograma
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
  const foto = $('.e3-pasillo .escena__foto', sec), pasillo = $('.e3-pasillo', sec);
  const says = $$('[data-say]', sec), ask = $('.pasillo__ask', sec);
  const holo = $('.a-holo-icon', svg);
  if (reduce) { box.style.opacity = 0; says.at(-1).style.opacity = 1; return; }
  const p = { v: 0 };
  const tl = gsap.timeline({ repeat: -1, paused: true });
  tl.set(pasillo, { opacity: 1 }).set(box, { opacity: 0 }).set(says, { opacity: 0 })
    // la cámara avanza por el pasillo mientras aparecen las frases (js/stages/e3.js · pasillo, versión 1)
    .fromTo(foto, { scale: 1 }, { scale: 1.45, transformOrigin: '50% 52%', duration: says.length * 2.2 + 0.6, ease: 'power1.in' }, 0);
  says.forEach((s, i) => {
    const at = i * 2.2 + 0.3;
    tl.fromTo(s, { opacity: 0, y: 20, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6 }, at);
    if (i < says.length - 1) tl.to(s, { opacity: 0, y: -16, filter: 'blur(6px)', duration: 0.45 }, at + (s === ask ? 1.9 : 1.6));
  });
  tl.to(pasillo, { opacity: 0, duration: 0.6 }, '+=1.2')
    .to(box, { opacity: 1, duration: 0.6 }, '<')
    .fromTo(p, { v: 0 }, { v: 1, duration: 3, ease: 'power1.inOut', onUpdate: () => ir(p.v) })
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
  if (reduce) return;
  const tl = gsap.timeline({ repeat: -1, paused: true });
  tl.set(aula, { opacity: 0 })
    .fromTo(flash, { opacity: 1 }, { opacity: 0, duration: 1.1, ease: 'power2.in' })
    .to(sil, { x: 8, duration: 0.06, repeat: 7, yoyo: true, ease: 'steps(1)' }, '+=0.6')
    .to(sil, { opacity: 0.35, duration: 0.08, repeat: 5, yoyo: true, ease: 'steps(1)' }, '+=0.8')
    .to(aula, { opacity: 1, duration: 0.7 }, '+=0.8')
    .fromTo(humo, { y: 30, opacity: 0, scale: 0.6, transformOrigin: 'center' }, { y: -60, opacity: 0.35, scale: 1.3, duration: 2.4, stagger: 0.35, ease: 'power1.out' })
    .to(humo, { opacity: 0, duration: 0.8 })
    .to(aula, { opacity: 0, duration: 0.5 }, '+=0.3');
  alVer(sec, () => tl.play(), () => tl.pause());
}

// --- Etapa 6: el detector (animación de la versión 1, js/stages/e5e6.js · e6) ----------------------
// Con los Oculus, el campo se ve en wireframe; el lente barre, junta las tres esferas en la bandeja,
// emerge el tótem con las luces que guían, las esferas viajan hasta él, se hunde y los objetos
// vuelven a verse sólidos. Pasando el mouse por encima, el lente lo sigue.
function etapa6() {
  const sec = $('#e6');
  if (!sec) return;
  const scan = $('[data-scan]', sec);
  const dim = $('.scan__field--dim', scan), lit = $('.scan__field--lit', scan);
  const orbs = $$('[data-orb]', scan), tray = $$('[data-tray]', scan), signal = $('[data-signal]', scan);
  const totem = $('.scan__totem-svg', scan), guide = $('.scan__guide', scan);
  const OBJ = [['obj-llave', '0 0 100 260'], ['obj-mate', '0 0 200 240'], ['obj-cuaderno', '0 0 240 180']];

  // versión wireframe de los objetos: misma forma, solo contorno
  OBJ.forEach(([id]) => {
    if (document.getElementById(`${id}-wire`)) return;
    const w = document.getElementById(id).cloneNode(true);
    w.id = `${id}-wire`;
    w.querySelectorAll('*').forEach((n) => { n.setAttribute('fill', 'none'); n.setAttribute('stroke', 'currentColor'); n.setAttribute('stroke-width', '3'); n.setAttribute('vector-effect', 'non-scaling-stroke'); n.removeAttribute('opacity'); });
    document.getElementById(id).after(w);
  });
  // el campo de objetos (la misma composición en las dos capas; fija, para que no cambie en cada visita)
  let field = '';
  let semilla = 7;
  const azar = (a, b) => { semilla = (semilla * 9301 + 49297) % 233280; return a + (semilla / 233280) * (b - a); };
  for (let i = 0; i < 26; i++) {
    const [id, box] = OBJ[i % 3];
    const w = id === 'obj-llave' ? azar(5, 8) : id === 'obj-mate' ? azar(9, 13) : azar(12, 17);
    field += `<svg viewBox="${box}" style="--x:${azar(4, 96).toFixed(1)}%;--y:${azar(8, 94).toFixed(1)}%;--w:${w.toFixed(1)}%;--r:${azar(-40, 40).toFixed(0)}deg"><use href="#${id}-wire"/></svg>`;
  }
  dim.innerHTML = field;
  lit.innerHTML = field;
  const solidos = (si) => $$('use', dim).forEach((u) => u.setAttribute('href', si ? u.getAttribute('href').replace('-wire', '') : u.getAttribute('href').replace(/(-wire)?$/, '-wire')));

  // el lente y la señal
  const taken = new Set();
  const lens = { x: 0.5, y: 0.5 };
  const leer = () => {
    const r = scan.getBoundingClientRect();
    const lr = parseFloat(getComputedStyle(scan).getPropertyValue('--lr')) || 120;
    let best = 0;
    orbs.forEach((o) => {
      const ox = parseFloat(o.style.getPropertyValue('--x')) / 100, oy = parseFloat(o.style.getPropertyValue('--y')) / 100;
      const d = Math.hypot((ox - lens.x) * r.width, (oy - lens.y) * r.height);
      const vis = Math.max(0.18, Math.min(1, 1.25 - d / (lr * 1.6)));
      o.style.setProperty('--vis', taken.has(o.dataset.orb) ? 1 : vis.toFixed(2));
      if (!taken.has(o.dataset.orb)) best = Math.max(best, vis);
    });
    signal.textContent = Math.round(taken.size === 3 ? 100 : best * 100);
  };
  const setLens = () => { scan.style.setProperty('--lx', `${(lens.x * 100).toFixed(2)}%`); scan.style.setProperty('--ly', `${(lens.y * 100).toFixed(2)}%`); leer(); };
  setLens();
  const pos = (o) => ({ x: parseFloat(o.style.getPropertyValue('--x')) / 100, y: parseFloat(o.style.getPropertyValue('--y')) / 100 });

  if (reduce) { orbs.forEach((o) => { o.style.opacity = 0; }); tray.forEach((t, k) => { t.style.setProperty('--c', getComputedStyle(orbs[k]).getPropertyValue('--c')); t.classList.add('is-on'); }); return; }

  // la esfera vuela a la bandeja
  const juntar = (o, k) => () => {
    taken.add(o.dataset.orb);
    const slot = tray[k];
    slot.style.setProperty('--c', getComputedStyle(o).getPropertyValue('--c'));
    const a = o.getBoundingClientRect(), b = slot.getBoundingClientRect();
    gsap.to(o, { x: b.left - a.left - a.width / 2 + 8, y: b.top - a.top - a.height / 2 + 8, scale: 0.3, opacity: 0, duration: 0.7, ease: 'power3.in', onComplete: () => slot.classList.add('is-on') });
    leer();
  };
  // las tres esferas viajan de la bandeja al tótem y desaparecen en él
  const depositar = () => {
    const sr = scan.getBoundingClientRect(), tr = totem.getBoundingClientRect();
    const to = { x: tr.left + tr.width / 2 - sr.left, y: tr.top + tr.height * 0.28 - sr.top };
    const t2 = gsap.timeline();
    t2.add(() => tray.forEach((t) => t.classList.remove('is-on')));
    tray.forEach((slot, i) => {
      const r = slot.getBoundingClientRect();
      const b = document.createElement('span');
      b.className = 'scan__viaje';
      b.style.setProperty('--c', slot.style.getPropertyValue('--c'));
      const x0 = r.left + r.width / 2 - sr.left, y0 = r.top + r.height / 2 - sr.top;
      b.style.left = `${x0}px`; b.style.top = `${y0}px`;
      scan.appendChild(b);
      const dx = to.x - x0, dy = to.y - y0;
      t2.fromTo(b, { scale: 0.6 }, { keyframes: [{ x: dx * 0.45, y: dy * 0.2 - 70, scale: 1.25, duration: 0.55, ease: 'power1.out' }, { x: dx, y: dy, scale: 1, duration: 0.6, ease: 'power2.in' }] }, 0.2 + i * 0.22)
        .to(b, { scale: 0, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => b.remove() }, '>')
        .fromTo(totem, { filter: 'brightness(1)' }, { filter: 'brightness(1.8)', duration: 0.15, yoyo: true, repeat: 1 }, '<');
    });
  };

  let manual = false; // pasando el mouse, el lente lo sigue
  scan.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = scan.getBoundingClientRect();
    manual = true; lens.x = (e.clientX - r.left) / r.width; lens.y = (e.clientY - r.top) / r.height; setLens();
  });
  scan.addEventListener('pointerleave', () => { manual = false; });
  const mover = (x, y, d) => ({ x, y, duration: d, ease: 'sine.inOut', onUpdate: () => { if (!manual) setLens(); } });

  const tl = gsap.timeline({ repeat: -1, paused: true });
  tl.call(() => {
    taken.clear();
    scan.classList.remove('is-off');
    solidos(false);
    tray.forEach((t) => t.classList.remove('is-on'));
    gsap.set(orbs, { x: 0, y: 0, scale: 1, opacity: 1 });
    gsap.set(totem, { yPercent: 105 }); gsap.set(guide, { opacity: 0 });
    leer();
  })
    .to(lens, mover(0.3, 0.4, 1.4));
  // el lente barre el campo y encuentra cada esfera
  orbs.forEach((o, k) => {
    const { x, y } = pos(o);
    tl.to(lens, mover(x + (k % 2 ? -0.12 : 0.1), y + 0.14, 1.3))
      .to(lens, mover(x, y, 1))
      .call(juntar(o, k), null, '+=0.35');
  });
  // con las tres, el tótem emerge del suelo con las luces que guían
  tl.to(lens, mover(0.5, 0.5, 1), '+=0.5')
    .to(totem, { yPercent: 0, duration: 1.2, ease: 'power3.out' })
    .fromTo(scan, { x: -3 }, { x: 3, duration: 0.05, repeat: 9, yoyo: true, clearProps: 'x' }, '<')
    .to(guide, { opacity: 1, duration: 0.5 }, '<0.6')
    .call(depositar, null, '+=0.8')
    .to(totem, { yPercent: 105, duration: 1, ease: 'power2.in' }, '+=1.6')
    .to(guide, { opacity: 0, duration: 0.4 }, '<')
    // "quitate el detector": los objetos vuelven a verse sólidos
    .call(() => { scan.classList.add('is-off'); solidos(true); }, null, '+=0.3')
    .to({}, { duration: 2.4 });
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

sonido();
popups();
vocesSolas();
dondeEstas();
navegar();
riel();
entradas();
logo();
idea();
espacio();
etapa1();
etapa2();
relatos();
mundosV1();
narrativa();
// las secuencias fijas se crearon en distinto orden: se ordenan según la página y se recalculan
ScrollTrigger.sort();
ScrollTrigger.refresh();
etapa3();
etapa4();
etapa6();
cierre();
