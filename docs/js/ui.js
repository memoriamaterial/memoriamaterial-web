// Utilidades compartidas por todos los escenarios.
import { audio } from './audio.js';

const { gsap, ScrollTrigger, SplitText } = window;

export const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isTouch = window.matchMedia('(pointer: coarse)').matches;
export const mqMobile = window.matchMedia('(max-width: 899px)');

// Ritmo: rápido al principio, desacelera hacia el final (brief/motion.md).
export function tempoOf(el) {
  const host = el.closest('[data-tempo]');
  return host ? parseFloat(host.dataset.tempo) : 1;
}

const colorVar = (name) => (name ? `var(--${name})` : '');

// --- Texto revelado palabra por palabra (estilo "SaaS") ----------------------
export function splitReveal(el, { delay = 0, trigger = true, start = 'top 85%' } = {}) {
  if (reduce) {
    gsap.from(el, { opacity: 0, duration: 0.6, delay, scrollTrigger: trigger ? { trigger: el, start, once: true } : undefined });
    return null;
  }
  const t = tempoOf(el);
  return SplitText.create(el, {
    type: 'lines,words',
    mask: 'lines',
    linesClass: 'split-line',
    autoSplit: true,
    onSplit(self) {
      return gsap.from(self.words, {
        yPercent: 110, opacity: 0, filter: 'blur(6px)',
        duration: 0.6 * t, stagger: 0.022 * t, ease: 'power3.out', delay,
        clearProps: 'filter',
        scrollTrigger: trigger ? { trigger: el, start, once: true } : undefined,
      });
    },
  });
}

// Etiquetas en mono que se "decodifican".
export function scrambleIn(el, { delay = 0, trigger = false } = {}) {
  if (reduce) return;
  const text = el.textContent;
  gsap.from(el, {
    duration: 0.9 * tempoOf(el), delay,
    scrambleText: { text, chars: 'MEMORIAL01·—', revealDelay: 0.2, speed: 0.6 },
    scrollTrigger: trigger ? { trigger: el, start: 'top 90%', once: true } : undefined,
  });
}

// Revela todo lo marcado con data-split / data-scramble que no esté dentro de un pin.
export function autoReveal(root = document) {
  root.querySelectorAll('[data-split]').forEach((el) => {
    if (el.closest('[data-no-auto]')) return;
    splitReveal(el);
  });
  root.querySelectorAll('[data-scramble]').forEach((el) => {
    if (el.closest('[data-no-auto]')) return;
    scrambleIn(el, { trigger: true });
  });
}

// --- Pop-ups -----------------------------------------------------------------
const pop = () => document.getElementById('pop');

export function openPop(id, scope = document) {
  const tpl = scope.querySelector(`template[data-pop="${id}"]`) || document.querySelector(`template[data-pop="${id}"]`);
  const dlg = pop();
  if (!tpl || !dlg) return;
  const frag = tpl.content.cloneNode(true);
  const title = frag.querySelector('[data-title]');
  dlg.querySelector('[data-pop-title]').innerHTML = title ? title.innerHTML : '';
  title?.remove();
  dlg.querySelector('[data-pop-eyebrow]').textContent = tpl.dataset.eyebrow || '';
  const body = dlg.querySelector('[data-pop-body]');
  body.replaceChildren(frag);
  dlg.style.setProperty('--acc', colorVar(tpl.dataset.acc) || 'var(--crema)');
  dlg.showModal();
  if (!reduce) {
    gsap.fromTo(dlg, { opacity: 0, y: 24, clipPath: 'inset(8% 4% 8% 4% round 18px)' },
      { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 18px)', duration: 0.45, ease: 'expo.out' });
    gsap.from(body.children, { opacity: 0, y: 10, stagger: 0.05, duration: 0.4, delay: 0.1, ease: 'power2.out' });
  }
  document.dispatchEvent(new CustomEvent('pop:open', { detail: { id } }));
}

function wireDialogs() {
  document.querySelectorAll('dialog').forEach((dlg) => {
    dlg.addEventListener('click', (e) => {
      if (e.target === dlg || e.target.closest('[data-close]')) dlg.close();
    });
  });
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-pop-open]');
    if (!btn) return;
    btn.classList.add('is-seen');
    openPop(btn.dataset.popOpen, btn.closest('section') || document);
  });
}

// --- Riel de etapas -------------------------------------------------------------
function initRail() {
  const sections = [...document.querySelectorAll('[data-rail]')];
  const list = document.querySelector('.rail__list');
  const menuList = document.querySelector('.menu__list');
  const now = document.querySelector('.rail__now');
  const fill = document.querySelector('.rail__fill');
  const menu = document.getElementById('menu');
  const root = document.documentElement;

  const label = (s) => (s.dataset.num ? `<b>${s.dataset.num}</b>` : '') + s.dataset.label;
  list.innerHTML = sections.map((s) => `<li><a class="rail__item" href="#${s.id}"><span class="rail__dot"></span><span class="rail__label">${label(s)}</span><span class="sr-only">${s.dataset.num || ''} ${s.dataset.label}</span></a></li>`).join('');
  menuList.innerHTML = sections.map((s) => `<li><a href="#${s.id}"><b>${s.dataset.num || '—'}</b>${s.dataset.label}</a></li>`).join('');
  const items = [...list.querySelectorAll('.rail__item')];
  const menuItems = [...menuList.querySelectorAll('a')];

  const go = (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    if (menu.open) menu.close();
    const target = document.querySelector(a.getAttribute('href'));
    gsap.to(window, { scrollTo: { y: target, autoKill: true }, duration: reduce ? 0 : 1.1, ease: 'power3.inOut' });
  };
  list.addEventListener('click', go);
  menuList.addEventListener('click', go);
  document.querySelectorAll('.hdr__mark').forEach((a) => a.addEventListener('click', go));
  document.querySelector('[data-open-menu]').addEventListener('click', () => menu.showModal());

  let active = -1;
  const setActive = (i) => {
    if (i === active) return;
    active = i;
    const s = sections[i];
    const acc = getComputedStyle(s).getPropertyValue('--acc').trim();
    root.style.setProperty('--acc', acc || 'var(--crema)');
    items.forEach((it, k) => { it.classList.toggle('is-active', k === i); it.classList.toggle('is-done', k < i); it.toggleAttribute('aria-current', k === i); });
    menuItems.forEach((it, k) => it.setAttribute('aria-current', k === i ? 'true' : 'false'));
    now.innerHTML = label(s);
    document.body.classList.toggle('is-past-intro', i > 0);
  };
  sections.forEach((s, i) => {
    ScrollTrigger.create({ trigger: s, start: 'top 55%', end: 'bottom 55%', onToggle: (self) => self.isActive && setActive(i) });
  });
  setActive(0);

  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => {
      fill.style.transform = mqMobile.matches ? `scaleX(${self.progress})` : `scaleY(${self.progress})`;
    },
  });
}

// --- Sonido -------------------------------------------------------------------
function initSound() {
  const btn = document.querySelector('[data-sound-toggle]');
  const lbl = btn.querySelector('[data-sound-label]');
  btn.addEventListener('click', () => audio.toggle());
  audio.on((a) => {
    btn.setAttribute('aria-pressed', String(a.enabled));
    lbl.textContent = a.enabled ? 'Sonido activado' : 'Sonido apagado';
  });
}

// --- Voces en off ------------------------------------------------------------
function initVoices() {
  audio.mountSubbar();
  document.querySelectorAll('[data-voice]').forEach((card) => {
    audio.registerCard(card);
    audio.observeCard(card);
    if (card.dataset.autoplay === 'off') return;
    ScrollTrigger.create({
      trigger: card.closest('[data-voice-zone]') || card,
      start: card.dataset.start || 'top 70%',
      onEnter: () => audio.autoplay(card.dataset.voice, card),
    });
  });
}

export function initUI() {
  wireDialogs();
  initRail();
  initSound();
  initVoices();
}

// Clona un elemento N veces para el efecto "eco" del brief de motion.
export function echo(el, n = 3, base = 0.4) {
  const clones = [];
  for (let k = 1; k <= n; k++) {
    const c = el.cloneNode(true);
    c.classList.add('is-echo');
    c.setAttribute('aria-hidden', 'true');
    c.style.opacity = (base / k).toFixed(2);
    el.before(c);
    clones.push(c);
  }
  return clones;
}
