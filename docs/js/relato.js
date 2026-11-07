// Fichas de relato (tools/relato.py): ilustraciones compartidas y entrada de la secuencia.
import { reduce } from './ui.js';

const { gsap } = window;
const FOCUS = { proyector: 'aula-screen', totem: 'aula-totem', holograma: 'aula-holo', luces: 'aula-led', estaciones: 'aula-stations' };

// Antes de crear los pins: copia la ilustración del aula donde una ficha la usa.
export function prepare() {
  const src = document.querySelector('#aula .aula-iso');
  if (!src) return;
  document.querySelectorAll('[data-aula-clone]').forEach((box) => {
    const svg = src.cloneNode(true);
    svg.removeAttribute('aria-labelledby');
    svg.setAttribute('aria-hidden', 'true');
    svg.querySelector('title')?.remove();
    box.appendChild(svg);
  });
  document.querySelectorAll('[data-aula-focus]').forEach((box) => {
    const svg = src.cloneNode(true);
    svg.removeAttribute('aria-labelledby');
    svg.setAttribute('aria-hidden', 'true');
    svg.querySelector('title')?.remove();
    const focus = box.dataset.aulaFocus.split(',').map((k) => FOCUS[k]).filter(Boolean);
    svg.querySelectorAll(':scope > g').forEach((g) => { if (focus.some((c) => g.classList.contains(c))) g.classList.add('is-focus'); });
    box.dataset.focus = box.dataset.aulaFocus;
    box.appendChild(svg);
  });
}

// Después de los pins: la secuencia entra paso a paso.
export function init() {
  if (reduce) return;
  document.querySelectorAll('.relato').forEach((rel) => {
    gsap.from(rel.querySelectorAll('.rel'), { y: 30, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: rel.querySelector('.relato__grid'), start: 'top 82%', once: true } });
    gsap.from(rel.querySelectorAll('.pasos > li'), { y: 14, opacity: 0, duration: 0.45, stagger: 0.05, ease: 'power2.out', scrollTrigger: { trigger: rel.querySelector('.pasos'), start: 'top 85%', once: true } });
    gsap.from(rel.querySelector('.relato__to4'), { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: rel.querySelector('.relato__to4'), start: 'top 90%', once: true } });
  });
}
