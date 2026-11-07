// E3 · Una extensión del yo
import { audio } from '../audio.js';
import { reduce } from '../ui.js';

const { gsap, ScrollTrigger } = window;
const N = 16;

export function init() {
  const sec = document.getElementById('e3');
  pasillo(sec);
  holoSeq(sec);
  puerta(sec);
}

// Túnel: marcos que vienen hacia la cámara. "p" es el avance (0 → 1).
function buildTunnel(el, n = N) {
  const frames = Array.from({ length: n }, () => {
    const f = document.createElement('i');
    f.className = 'frame';
    el.prepend(f);
    return f;
  });
  return (p) => {
    frames.forEach((f, i) => {
      const d = (i / n + p * 3) % 1;         // profundidad 0 (lejos) → 1 (cerca)
      const s = 0.06 / Math.max(0.04, 1 - d * 0.96);
      f.style.setProperty('--s', s.toFixed(3));
      f.style.setProperty('--o', (Math.min(1, d * 3) * (1 - Math.max(0, (s - 1.6) / 1.4)) * 0.45).toFixed(3));
    });
  };
}

function pasillo(sec) {
  const wrap = sec.querySelector('[data-pasillo]');
  const pin = wrap.querySelector('.pasillo__pin');
  const main = buildTunnel(wrap.querySelector('.tunel--main'));
  const sides = [...wrap.querySelectorAll('.tunel--side')].map((t) => buildTunnel(t, 10));
  const door = wrap.querySelector('.tunel__door');
  const says = [...wrap.querySelectorAll('[data-say]')];
  const ask = wrap.querySelector('.pasillo__ask');
  const btn = wrap.querySelector('[data-lo-tengo]');
  const [va, vb] = ['e3a', 'e3b'].map((k) => document.querySelector(`[data-voice="${k}"]`)); // en la ficha de la etapa

  main(0); sides.forEach((s) => s(0.3));
  if (reduce) {
    return; // las frases se leen como lista debajo del pasillo (main.js)
  }

  let playedA = false, playedB = false;
  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: {
      trigger: wrap, pin, start: 'top top', end: () => `+=${window.innerHeight * 5}`, scrub: 0.8,
      onUpdate: (self) => {
        const p = self.progress;
        main(p); sides.forEach((s, i) => s(p * 0.8 + i * 0.4));
        if (p > 0.02 && !playedA) { playedA = true; audio.autoplay('e3a', va); }
        if (p > 0.3 && !playedB) { playedB = true; audio.autoplay('e3b', vb); }
      },
    },
  });
  // la puerta del fondo se acerca a lo largo de todo el recorrido
  tl.to(door, { scale: 0.42, duration: says.length * 1.2 + 0.5, ease: 'power1.in' }, 0);
  says.forEach((s, i) => {
    const at = i * 1.2 + 0.2;
    tl.fromTo(s, { opacity: 0, y: 20, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4 }, at);
    if (s === ask) tl.to({}, { duration: 0.6 }, at + 0.4); // pausa para pensar
    if (i < says.length - 1) tl.to(s, { opacity: 0, y: -16, filter: 'blur(6px)', duration: 0.3 }, at + (s === ask ? 1.0 : 0.85));
  });

  btn.addEventListener('click', () => {
    ask.classList.add('is-answered');
    btn.textContent = 'Lo tengo ✓';
    const st = tl.scrollTrigger;
    const target = st.start + (st.end - st.start) * ((4 * 1.2 + 0.25) / tl.duration());
    gsap.to(window, { scrollTo: target, duration: 1.2, ease: 'power2.inOut' });
  });
}

// --- En el aula: del pasillo al tótem y al holograma, paso a paso --------------
function holoSeq(sec) {
  const wrap = sec.querySelector('[data-holo-seq]');
  const pin = wrap.querySelector('.holo-seq__pin');
  const svg = wrap.querySelector('.aula-iso');
  const steps = [...wrap.querySelectorAll('[data-step]')];
  const callout = wrap.querySelector('.holo-seq__callout');
  if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg';
  const station = svg.querySelectorAll('.a-station')[1];
  const person = station.querySelector('.a-person');
  const monitor = station.querySelectorAll('.a-mon-glow, .a-mon');
  const led = svg.querySelectorAll('.a-led, .a-led-glow');
  const ledPath = svg.querySelector('.a-led');
  const totemTop = svg.querySelector('.a-totem-top');
  const totem = svg.querySelector('.aula-totem');
  const beam = svg.querySelector('.a-holo-beam');
  const icon = svg.querySelector('.a-holo-icon');
  const others = svg.querySelectorAll('.a-station:not([data-i="1"]) .a-person');

  // puntos del recorrido (en coordenadas del dibujo)
  const pb = person.getBBox();
  const from = { x: pb.x + pb.width / 2, y: pb.y + pb.height };
  const ledEnd = ledPath.getPointAtLength(ledPath.getTotalLength());
  const ledMid = ledPath.getPointAtLength(ledPath.getTotalLength() * 0.45);
  const top = { x: +totemTop.getAttribute('cx'), y: +totemTop.getAttribute('cy') };
  // el objeto que lleva la persona
  const obj = document.createElementNS(NS, 'circle');
  obj.setAttribute('r', '5'); obj.setAttribute('fill', '#FCB614');
  obj.setAttribute('cx', from.x + 9); obj.setAttribute('cy', from.y - 16);
  obj.style.filter = 'drop-shadow(0 0 6px #FCB614)';
  svg.appendChild(obj);

  gsap.set([beam, icon, obj], { opacity: 0 });
  gsap.set(others, { opacity: 0.35 });
  const setStep = (i) => steps.forEach((li, k) => { li.classList.toggle('is-on', k === i); li.classList.toggle('is-done', k < i); });
  setStep(0);
  if (reduce) { steps.forEach((li) => li.classList.add('is-on')); gsap.set([beam, icon], { opacity: 1 }); gsap.set(led, { opacity: 1 }); return; }

  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: {
      trigger: wrap, pin, start: 'top top', end: () => `+=${window.innerHeight * 6}`, scrub: 0.7,
      onUpdate: (self) => setStep(Math.min(steps.length - 1, Math.floor(self.progress * steps.length * 0.999))),
    },
  });
  const seg = 1; // cada paso dura lo mismo
  // 1 · en la estación: el monitor encendido
  tl.to(monitor, { opacity: 1, duration: seg * 0.5 }).to({}, { duration: seg * 0.5 });
  // 2 · sale de Unreal: se levanta, el monitor queda en pausa
  tl.to(person, { y: -8, duration: seg * 0.4 }).to(monitor, { opacity: 0.45, duration: seg * 0.4 }, '<').to(obj, { opacity: 1, y: -8, duration: seg * 0.3 }, '<0.1').to({}, { duration: seg * 0.3 });
  // 3 · las luces lo guían
  tl.to(led, { opacity: 1, duration: seg * 0.6 }).to({}, { duration: seg * 0.4 });
  // 4 · camina hasta el tótem y deposita el objeto
  tl.to([person, obj], { x: ledEnd.x - from.x, y: ledEnd.y - from.y - 4, duration: seg * 0.3, ease: 'none' })
    .to([person, obj], { x: ledMid.x - from.x, y: ledMid.y - from.y - 4, duration: seg * 0.3, ease: 'none' })
    .to([person, obj], { x: top.x - from.x + 26, y: top.y - from.y + 34, duration: seg * 0.25, ease: 'none' })
    .to(obj, { x: top.x - (from.x + 9), y: top.y - (from.y - 16), scale: 0.6, transformOrigin: 'center', duration: seg * 0.15 })
    .to(obj, { opacity: 0, duration: 0.05 })
    .fromTo(totem, { filter: 'brightness(1)' }, { filter: 'brightness(1.8)', duration: seg * 0.1, yoyo: true, repeat: 1 });
  // 5 · se enciende el holograma
  tl.to(beam, { opacity: 1, duration: seg * 0.5 }).to(icon, { opacity: 1, scale: 1.25, transformOrigin: '50% 50%', duration: seg * 0.5 }, '<0.1');
  // 6 · qué muestra: el ícono, en grande
  tl.to(callout, { opacity: 1, y: 0, duration: seg * 0.4 }).from(callout, { y: 12, duration: seg * 0.4 }, '<').to({}, { duration: seg * 0.6 });
  // 7 · vuelve a su estación; las luces se apagan y vuelve a Unreal
  tl.to(callout, { opacity: 0.6, duration: seg * 0.2 })
    .to(person, { x: ledMid.x - from.x, y: ledMid.y - from.y - 4, duration: seg * 0.25, ease: 'none' })
    .to(person, { x: ledEnd.x - from.x, y: ledEnd.y - from.y - 4, duration: seg * 0.25, ease: 'none' })
    .to(person, { x: 0, y: 0, duration: seg * 0.2, ease: 'none' })
    .to(led, { opacity: 0, duration: seg * 0.2 }, '<')
    .to(monitor, { opacity: 1, duration: seg * 0.1 });
}

function puerta(sec) {
  const box = sec.querySelector('.e3-door');
  const msg = sec.querySelector('[data-e3msg]');
  const icons = [...box.querySelectorAll('.e3-icon')];
  const RIGHT = 'ancla'; // provisorio (PENDIENTES #11)
  let open = false;

  const openDoor = () => {
    if (open) return;
    open = true;
    icons.forEach((i) => { i.classList.toggle('is-right', i.dataset.icon === RIGHT); i.classList.remove('is-wrong'); });
    box.classList.add('is-open');
    msg.textContent = 'La puerta se abre. Seguí bajando.';
  };
  icons.forEach((ic) => ic.addEventListener('click', () => {
    if (open) return;
    if (ic.dataset.icon === RIGHT) openDoor();
    else {
      ic.classList.add('is-wrong');
      msg.textContent = 'Ese no es el ícono que proyectó el holograma. La puerta sigue cerrada: podés volver a elegir.';
      if (!reduce) gsap.fromTo(ic, { x: 0 }, { x: 6, duration: 0.06, repeat: 5, yoyo: true, clearProps: 'x' });
    }
  }));
  // Nunca bloquea: al seguir bajando, la puerta se abre sola.
  ScrollTrigger.create({ trigger: box, start: 'bottom 30%', onEnter: openDoor });

  if (!reduce) {
    gsap.from(icons, { scale: 0, opacity: 0, stagger: 0.1, duration: 0.5, ease: 'back.out(2)', clearProps: 'transform', scrollTrigger: { trigger: box, start: 'top 75%', once: true } });
  }
}
