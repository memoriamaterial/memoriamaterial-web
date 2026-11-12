// E4 · Objetos perdidos
import { audio } from '../audio.js';
import { reduce, echo } from '../ui.js';
import { videoSeq } from './inicio.js';

const { gsap, ScrollTrigger } = window;

export function init() {
  const sec = document.getElementById('e4');
  flash(sec);
  replica(sec);
  ausencias(sec);
  eco(sec);
  sec.querySelectorAll('[data-video]').forEach(videoSeq);
  // la voz del video que presenta la Etapa 5
  const vid = sec.querySelector('.video--e5');
  ScrollTrigger.create({ trigger: vid, start: 'top 40%', onEnter: () => audio.autoplay('e4video', vid.querySelector('[data-voice="e4video"]')) });

  // El ruido blanco sube durante toda la etapa
  ScrollTrigger.create({
    trigger: sec, start: 'top 60%', end: 'bottom 40%',
    onToggle: (self) => audio.setAmbience(self.isActive ? 2.6 : 1, self.isActive ? 5200 : 2200),
  });
}

function flash(sec) {
  const white = sec.querySelector('.e4-flash__white');
  // la voz suena durante el destello (su tarjeta está en la ficha de la etapa)
  ScrollTrigger.create({ trigger: sec.querySelector('.e4-flash'), start: 'top 60%', onEnter: () => audio.autoplay('e4a', document.querySelector('[data-voice="e4a"]')) });
  if (reduce) { white.style.opacity = 0; return; }
  // el destello: de crema a violeta mientras la pantalla entra
  gsap.fromTo(white, { opacity: 1 }, { opacity: 0, ease: 'power2.in', scrollTrigger: { trigger: sec, start: 'top 90%', end: 'top -10%', scrub: true } });
  const title = sec.querySelector('.e4-glitch'); // D-10: el título de la ficha, con glitch
  gsap.from(title, { filter: 'blur(20px)', scale: 1.06, opacity: 0, transformOrigin: '0 50%', ease: 'power3.out', scrollTrigger: { trigger: title, start: 'top 90%', end: 'top 45%', scrub: true } });
}

function replica(sec) {
  const box = sec.querySelector('.e4-replica');
  const out = box.querySelector('[data-loss-text]');
  const spheres = [...box.querySelectorAll('[data-loss]')];
  spheres.forEach((s) => s.addEventListener('click', () => {
    const on = !s.classList.contains('is-active');
    spheres.forEach((x) => x.classList.remove('is-active'));
    if (!on) { out.hidden = true; return; }
    s.classList.add('is-active');
    out.replaceChildren(box.querySelector(`template[data-loss-tpl="${s.dataset.loss}"]`).content.cloneNode(true));
    out.style.setProperty('--acc', getComputedStyle(s.parentElement).getPropertyValue('--c'));
    out.hidden = false;
    if (!reduce) gsap.fromTo(out, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35 });
  }));
  if (!reduce) gsap.from(box.querySelectorAll('.ausente__col'), { y: 40, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: box.querySelector('.ausente'), start: 'top 80%', once: true } });
}

function ausencias(sec) {
  const clack = sec.querySelector('.trip__clack');
  sec.querySelectorAll('.trip__cajon').forEach((c) => c.addEventListener('click', () => {
    clack.textContent = 'cerradura trabada';
    if (!reduce) {
      gsap.fromTo(c, { x: 0 }, { x: 5, duration: 0.05, repeat: 5, yoyo: true, clearProps: 'x' });
      gsap.fromTo(clack, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.2 });
    }
  }));
  if (!reduce) gsap.from(sec.querySelectorAll('.trip__card'), { y: 50, opacity: 0, stagger: 0.15, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.trip', start: 'top 80%', once: true } });
}

// La voz con reverberación: cada pregunta deja ecos que se alejan
function eco(sec) {
  const wrap = sec.querySelector('[data-eco]');
  const pin = wrap.querySelector('.eco__pin');
  const lines = [...wrap.querySelectorAll('[data-eco-line]')];
  const voice = document.querySelector('[data-voice="e4b"]'); // en la ficha de la etapa
  if (reduce) {
    lines.forEach((l) => { l.style.position = 'relative'; l.style.opacity = 1; });
    pin.style.height = 'auto';
    ScrollTrigger.create({ trigger: wrap, start: 'top 60%', once: true, onEnter: () => audio.autoplay('e4b', voice) }); // D-01
    return;
  }
  let played = false;
  const tl = gsap.timeline({
    scrollTrigger: { trigger: wrap, pin, start: 'top top', end: () => `+=${window.innerHeight * 4}`, scrub: 0.8,
      onUpdate: (self) => { if (self.progress > 0.02 && !played) { played = true; audio.autoplay('e4b', voice); } } },
  });
  lines.forEach((l, i) => {
    const echoes = echo(l, 3, 0.5);
    echoes.forEach((e) => e.classList.add('is-echo'));
    const at = i * 1.4;
    tl.fromTo(l, { opacity: 0, scale: 0.94, filter: 'blur(10px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out' }, at);
    echoes.forEach((e, k) => {
      tl.fromTo(e, { opacity: 0, scale: 1 }, { opacity: 0.5 / (k + 1), scale: 1 + (k + 1) * 0.07, duration: 0.6, ease: 'power2.out' }, at + 0.15 + k * 0.1);
    });
    tl.to([l, ...echoes], { opacity: 0, scale: '+=0.06', filter: 'blur(8px)', duration: 0.4, ease: 'power2.in' }, at + 1.05);
  });
}
