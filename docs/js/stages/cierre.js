// Cierre
import { reduce } from '../ui.js';
import { videoSeq } from './inicio.js';

const { gsap } = window;

export function init() {
  const sec = document.getElementById('cierre');
  sec.querySelectorAll('[data-video]').forEach(videoSeq);

  sec.querySelector('[data-restart]').addEventListener('click', () => {
    gsap.to(window, { scrollTo: 0, duration: reduce ? 0 : 2.4, ease: 'power3.inOut' });
  });

  if (reduce) return;
  // el ritmo desacelera hacia el final: entradas más lentas y amplias
  gsap.from(sec.querySelectorAll('.orbe'), {
    y: 60, opacity: 0, scale: 0.9, duration: 1.4, stagger: 0.25, ease: 'expo.out',
    scrollTrigger: { trigger: '.orbes', start: 'top 80%', once: true },
  });
  gsap.to(sec.querySelectorAll('.orbe__ball'), { y: -10, duration: 3.2, ease: 'sine.inOut', repeat: -1, yoyo: true, stagger: 0.6 });
  sec.querySelectorAll('.origen, .pregunta, .creditos').forEach((el) => gsap.from(el, {
    y: 40, opacity: 0, duration: 1.4, ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 85%', once: true },
  }));
}
