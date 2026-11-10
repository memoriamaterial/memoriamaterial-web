// E5 · Obsesión con la pérdida — E6 · Búsqueda del significado
import { audio } from '../audio.js';
import { reduce } from '../ui.js';

const { gsap, ScrollTrigger } = window;
const OBJS = [['obj-llave', '0 0 100 260'], ['obj-mate', '0 0 200 240'], ['obj-cuaderno', '0 0 240 180']];

export function init() {
  wireSymbols();
  regreso();
  e5();
  e6();
}

// Versión "wireframe" de los objetos: misma forma, solo contorno.
function wireSymbols() {
  OBJS.forEach(([id]) => {
    const src = document.getElementById(id);
    const w = src.cloneNode(true);
    w.id = `${id}-wire`;
    w.querySelectorAll('*').forEach((n) => {
      n.setAttribute('fill', 'none');
      n.setAttribute('stroke', 'currentColor');
      n.setAttribute('stroke-width', '3');
      n.setAttribute('vector-effect', 'non-scaling-stroke');
      n.removeAttribute('opacity');
    });
    src.after(w);
  });
}

const svgUse = (id, box, cls = '') => `<svg viewBox="${box}" class="${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;

// --- E5 · El regreso a Unreal --------------------------------------------------
// Termina el video del proyector → las luces llevan a la estación → la pantalla se enciende.
function regreso() {
  const wrap = document.querySelector('[data-regreso]');
  const svg = wrap?.querySelector('.aula-iso');
  if (!svg) return;
  const pin = wrap.querySelector('.regreso__pin');
  const steps = [...wrap.querySelectorAll('[data-rstep]')];
  const fade = wrap.querySelector('.regreso__fade');
  const screen = svg.querySelector('.aula-screen');
  const led = svg.querySelectorAll('.a-led, .a-led-glow');
  const ledPath = svg.querySelector('.a-led');
  const station = svg.querySelectorAll('.a-station')[1];
  const person = station.querySelector('.a-person');
  const mon = station.querySelectorAll('.a-mon, .a-mon-glow');
  const monBox = station.querySelector('.a-mon').getBBox();
  const vb = svg.viewBox.baseVal; // el zoom entra en el monitor (origen en % de la ilustración)
  const origin = `${((monBox.x + monBox.width / 2 - vb.x) / vb.width) * 100}% ${((monBox.y + monBox.height / 2 - vb.y) / vb.height) * 100}%`;
  const pb = person.getBBox();
  const from = { x: pb.x + pb.width / 2, y: pb.y + pb.height };
  const top = svg.querySelector('.a-totem-top');
  const start = { x: +top.getAttribute('cx') + 26 - from.x, y: +top.getAttribute('cy') + 34 - from.y };
  const end = ledPath.getPointAtLength(ledPath.getTotalLength());
  const mid = ledPath.getPointAtLength(ledPath.getTotalLength() * 0.45);
  const setStep = (i) => steps.forEach((li, k) => li.classList.toggle('is-on', k === i));
  setStep(0);
  if (reduce) { steps.forEach((li) => li.classList.add('is-on')); return; }

  // al empezar: la persona está junto al tótem (después del humo y del video) y su monitor, en negro
  gsap.set(person, { x: start.x, y: start.y });
  gsap.set(mon, { opacity: 0.08 });
  gsap.set(led, { opacity: 0 });
  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: { trigger: wrap, pin, start: 'top top', end: () => `+=${window.innerHeight * 3.4}`, scrub: 0.7,
      onUpdate: (self) => setStep(Math.min(2, Math.floor(self.progress * 3 * 0.999))) },
  });
  tl.to({}, { duration: 0.3 })
    .to(screen, { opacity: 0.15, duration: 0.5 })                      // 1 · termina el video: el proyector se apaga
    .to({}, { duration: 0.2 })
    .to(led, { opacity: 1, duration: 0.3 })                            // 2 · las luces llevan a la estación
    .to(person, { x: mid.x - from.x, y: mid.y - from.y - 4, duration: 0.3, ease: 'none' })
    .to(person, { x: end.x - from.x, y: end.y - from.y - 4, duration: 0.3, ease: 'none' })
    .to(person, { x: 0, y: 0, duration: 0.2, ease: 'none' })
    .to(led, { opacity: 0, duration: 0.2 })
    .to(mon, { opacity: 1, duration: 0.25 })                           // 3 · la pantalla se enciende
    .to(svg, { scale: 7, transformOrigin: origin, duration: 0.8, ease: 'power2.in' })
    .to(fade, { opacity: 1, duration: 0.25 }, '-=0.25');              // fundido hacia el pasillo
}

// --- E5 -------------------------------------------------------------------------
function e5() {
  const wrap = document.querySelector('[data-hall]');
  const pin = wrap.querySelector('.hall__pin');
  const strips = [...wrap.querySelectorAll('.hall__strip')];
  const end = wrap.querySelector('.hall__end');
  const floor = wrap.querySelector('.hall__floor');
  const voice = document.querySelector('[data-voice="e5"]'); // en la ficha de la etapa

  // pilas de objetos repetidos: "verlo en todos lados"
  strips.forEach((s, k) => {
    let html = '';
    for (let i = 0; i < 240; i++) {
      const [id, box] = OBJS[(i * 7 + k) % 3];
      html += svgUse(id, box, (i * 13 + k * 5) % 29 === 0 ? 'is-acc' : '');
    }
    s.innerHTML = html;
  });

  if (reduce) { end.style.transform = 'none'; ScrollTrigger.create({ trigger: end, start: 'top 70%', once: true, onEnter: () => audio.autoplay('e5', voice) }); return; } // D-01
  let played = false;
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: wrap, pin, start: 'top top', end: () => `+=${window.innerHeight * 3.5}`, scrub: 1,
      onUpdate: (self) => { if (self.progress > 0.55 && !played) { played = true; audio.autoplay('e5', voice); } } },
  });
  // la cámara avanza: las pilas pasan junto a nosotros y los Oculus se acercan
  tl.fromTo(strips[0], { x: -3200 }, { x: 0, duration: 1 }, 0)
    .fromTo(strips[1], { x: 3200 }, { x: 0, duration: 1 }, 0)
    .fromTo(floor, { backgroundPosition: '0px 0px' }, { backgroundPosition: '0px 1440px', duration: 1 }, 0)
    .to(end, { scale: 1, duration: 1, ease: 'power2.in' }, 0)
    ;
}

// --- E6 -------------------------------------------------------------------------
function e6() {
  const sec = document.getElementById('e6');
  const scan = sec.querySelector('[data-scan]');
  const dim = scan.querySelector('.scan__field--dim');
  const lit = scan.querySelector('.scan__field--lit');
  const orbs = [...scan.querySelectorAll('[data-orb]')];
  const tray = [...scan.querySelectorAll('[data-tray]')];
  const signal = scan.querySelector('[data-signal]');
  const countEl = sec.querySelector('[data-e6-count]');
  const endBox = scan.querySelector('[data-e6-end]');
  const deposit = scan.querySelector('[data-deposit]');
  const said = scan.querySelector('[data-e6-said]');
  const totem = scan.querySelector('.scan__totem-svg');
  const guide = scan.querySelector('.scan__guide');
  const taken = new Set();
  let done = false;
  gsap.set(totem, { yPercent: 105 });

  // campo de objetos en wireframe (misma composición en las dos capas)
  let field = '';
  const rand = gsap.utils.random;
  for (let i = 0; i < 26; i++) {
    const [id, box] = OBJS[i % 3];
    const w = id === 'obj-llave' ? rand(5, 8) : id === 'obj-mate' ? rand(9, 13) : rand(12, 17);
    field += `<svg viewBox="${box}" style="--x:${rand(4, 96).toFixed(1)}%;--y:${rand(8, 94).toFixed(1)}%;--w:${w.toFixed(1)}%;--r:${rand(-40, 40).toFixed(0)}deg"><use href="#${id}-wire"/></svg>`;
  }
  dim.innerHTML = field;
  lit.innerHTML = field;

  // el lente del detector
  const lens = { x: 0.5, y: 0.5 };
  const setLens = (x, y) => {
    lens.x = x; lens.y = y;
    scan.style.setProperty('--lx', `${(x * 100).toFixed(2)}%`);
    scan.style.setProperty('--ly', `${(y * 100).toFixed(2)}%`);
    readSignal();
  };
  const readSignal = () => {
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
  const fromEvent = (e) => {
    const r = scan.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return [(p.clientX - r.left) / r.width, (p.clientY - r.top) / r.height];
  };
  let sweep = null;
  const stopSweep = () => { sweep?.kill(); sweep = null; };
  scan.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') { stopSweep(); setLens(...fromEvent(e)); } });
  scan.addEventListener('touchstart', (e) => { stopSweep(); setLens(...fromEvent(e)); }, { passive: true });
  scan.addEventListener('touchmove', (e) => setLens(...fromEvent(e)), { passive: true });
  setLens(0.5, 0.5);

  // si nadie lo mueve, el detector barre solo
  if (!reduce) {
    const p = { t: 0 };
    ScrollTrigger.create({
      trigger: scan, start: 'top 80%', once: true,
      onEnter: () => {
        sweep = gsap.to(p, { t: 1, duration: 9, repeat: -1, ease: 'none', onUpdate: () => setLens(0.5 + Math.sin(p.t * Math.PI * 2) * 0.38, 0.5 + Math.sin(p.t * Math.PI * 4) * 0.28) });
      },
    });
  }

  const collect = (o, animate = true) => {
    const k = o.dataset.orb;
    if (taken.has(k)) return;
    taken.add(k);
    o.classList.add('is-taken');
    const slot = tray[taken.size - 1];
    slot.style.setProperty('--c', getComputedStyle(o).getPropertyValue('--c'));
    if (animate && !reduce) {
      const a = o.getBoundingClientRect(), b = slot.getBoundingClientRect();
      gsap.to(o, { x: b.left - a.left - a.width / 2 + 8, y: b.top - a.top - a.height / 2 + 8, scale: 0.3, opacity: 0, duration: 0.7, ease: 'power3.in', onComplete: () => slot.classList.add('is-on') });
    } else { o.style.opacity = 0; slot.classList.add('is-on'); }
    countEl.textContent = taken.size;
    readSignal();
    if (taken.size === 3) emerge(animate);
  };

  // el tótem emerge del suelo, con luces que guían hasta él
  const emerge = (animate) => {
    endBox.hidden = false;
    stopSweep();
    // C-25: la voz suena al encontrar las tres esferas, antes de depositarlas
    said.hidden = false;
    audio.autoplay('e6', said.querySelector('[data-voice="e6"]'));
    if (animate && !reduce) {
      gsap.timeline()
        .to(totem, { yPercent: 0, duration: 1.2, ease: 'power3.out' })
        .fromTo(scan, { x: -3 }, { x: 3, duration: 0.05, repeat: 9, yoyo: true, clearProps: 'x' }, 0)
        .to(guide, { opacity: 1, duration: 0.5 }, 0.6)
        .from(endBox.children, { opacity: 0, y: 12, stagger: 0.12, duration: 0.4 }, 0.4);
    } else { gsap.set(totem, { yPercent: 0 }); guide.style.opacity = 1; }
  };

  const depositAll = (animate = true) => {
    if (done) return;
    orbs.forEach((o) => collect(o, false));
    done = true;
    deposit.hidden = true;
    // "quitate el detector": los objetos vuelven a verse sólidos
    const finish = () => {
      scan.classList.add('is-off');
      dim.querySelectorAll('use').forEach((u) => u.setAttribute('href', u.getAttribute('href').replace('-wire', '')));
    };
    if (animate && !reduce) {
      // D-11: las tres esferas viajan desde la bandeja hasta el tótem y ahí desaparecen
      const sr = scan.getBoundingClientRect(), tr = totem.getBoundingClientRect();
      const to = { x: tr.left + tr.width / 2 - sr.left, y: tr.top + tr.height * 0.28 - sr.top };
      const balls = tray.map((slot) => {
        const r = slot.getBoundingClientRect();
        const b = document.createElement('span');
        b.className = 'scan__viaje';
        b.style.setProperty('--c', slot.style.getPropertyValue('--c'));
        b.style.left = `${r.left + r.width / 2 - sr.left}px`;
        b.style.top = `${r.top + r.height / 2 - sr.top}px`;
        scan.appendChild(b);
        return { b, dx: to.x - (r.left + r.width / 2 - sr.left), dy: to.y - (r.top + r.height / 2 - sr.top) };
      });
      const tl = gsap.timeline();
      tl.add(() => tray.forEach((t) => t.classList.remove('is-on')));
      balls.forEach(({ b, dx, dy }, i) => {
        tl.fromTo(b, { scale: 0.6 }, { keyframes: [{ x: dx * 0.45, y: dy * 0.2 - 70, scale: 1.25, duration: 0.55, ease: 'power1.out' }, { x: dx, y: dy, scale: 1, duration: 0.6, ease: 'power2.in' }] }, 0.2 + i * 0.22)
          .to(b, { scale: 0, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => b.remove() }, '>')
          .fromTo(totem, { filter: 'brightness(1)' }, { filter: 'brightness(1.8)', duration: 0.15, yoyo: true, repeat: 1 }, '<');
      });
      tl.to(totem, { yPercent: 105, duration: 1, ease: 'power2.in' }, '+=0.4')
        .to(guide, { opacity: 0, duration: 0.4 }, '<')
        .add(finish, '+=0.4');
    } else { gsap.set(totem, { yPercent: 105 }); finish(); }
  };

  orbs.forEach((o) => o.addEventListener('click', () => collect(o)));
  deposit.addEventListener('click', () => depositAll(true));

  // Nunca bloquea: al seguir al cierre, todo se completa solo.
  ScrollTrigger.create({ trigger: scan, start: 'bottom 35%', onEnter: () => depositAll(!reduce) });
}
