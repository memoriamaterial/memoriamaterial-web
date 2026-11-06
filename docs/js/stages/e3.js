// E3 · Una extensión del yo
import { audio } from '../audio.js';
import { reduce } from '../ui.js';

const { gsap, ScrollTrigger } = window;
const N = 16;

export function init() {
  const sec = document.getElementById('e3');
  pasillo(sec);
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
  const [va, vb] = ['e3a', 'e3b'].map((k) => wrap.querySelector(`[data-voice="${k}"]`));

  main(0); sides.forEach((s) => s(0.3));
  if (reduce) {
    return; // las frases se leen como lista debajo del pasillo (main.js)
  }

  gsap.set(vb, { autoAlpha: 0 });
  let playedA = false, playedB = false;
  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: {
      trigger: wrap, pin, start: 'top top', end: () => `+=${window.innerHeight * 5}`, scrub: 0.8,
      onUpdate: (self) => {
        const p = self.progress;
        main(p); sides.forEach((s, i) => s(p * 0.8 + i * 0.4));
        if (p > 0.02 && !playedA) { playedA = true; audio.autoplay('e3a', va); }
        if (p > 0.3 && !playedB) { playedB = true; gsap.to(va, { autoAlpha: 0 }); gsap.to(vb, { autoAlpha: 1 }); audio.autoplay('e3b', vb); }
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
      msg.textContent = 'Ese no es el ícono que proyectó el holograma.';
      if (!reduce) gsap.fromTo(ic, { x: 0 }, { x: 6, duration: 0.06, repeat: 5, yoyo: true, clearProps: 'x' });
    }
  }));
  // Nunca bloquea: al seguir bajando, la puerta se abre sola.
  ScrollTrigger.create({ trigger: box, start: 'bottom 30%', onEnter: openDoor });

  if (!reduce) {
    gsap.from(sec.querySelectorAll('.e3-totem > *:not(.ph)'), { opacity: 0, y: 20, stagger: 0.1, duration: 0.6, scrollTrigger: { trigger: '.e3-totem', start: 'top 80%', once: true } });
    gsap.from(icons, { scale: 0, opacity: 0, stagger: 0.1, duration: 0.5, ease: 'back.out(2)', clearProps: 'transform', scrollTrigger: { trigger: box, start: 'top 75%', once: true } });
  }
}
