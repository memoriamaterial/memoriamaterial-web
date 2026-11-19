// Memoria Material · versión 2 · el reproductor de voces fijo al pie de la pantalla (css/v2-reproductor.css)
// Cada parte con voz es una «zona»: data-voces="id1,id2" y data-voces-titulo="…".
// - Mientras la persona está dentro de una zona, la barra muestra su voz; al salir, desaparece.
// - La voz nunca arranca sola: solo con play. Si hay varias voces, siguen una detrás de otra hasta pausar.
// - Al cambiar de zona, lo que sonaba se pausa: nunca suenan dos voces a la vez.
// - «Subtítulos»: apagados por defecto; al activarlos, la frase que suena (sincronizada) aparece sobre la barra.
import { audio, VOICES } from './audio.js?v=20261119d';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const ICON_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>';
const ICON_PAUSA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>';
const fin = (id) => VOICES[id].cues.at(-1)[1];
const mmss = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

export function reproductor() {
  const zonas = $$('[data-voces]');
  if (!zonas.length) return;
  const bar = document.createElement('div');
  bar.className = 'repro';
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', 'Reproductor de la voz');
  bar.innerHTML = `
    <p class="repro__subs" aria-live="polite" hidden></p>
    <div class="repro__barra">
      <button class="repro__play" type="button" aria-label="Escuchar la voz">${ICON_PLAY}</button>
      <div class="repro__info">
        <span class="repro__titulo"></span>
        <input class="repro__avance" type="range" min="0" max="1" step="0.1" value="0" aria-label="Avance de la voz">
      </div>
      <span class="repro__tiempo">0:00</span>
      <button class="repro__cc" type="button" aria-pressed="false">Subtítulos</button>
    </div>`;
  document.body.appendChild(bar);
  const btn = $('.repro__play', bar), titulo = $('.repro__titulo', bar), avance = $('.repro__avance', bar);
  const tiempo = $('.repro__tiempo', bar), cc = $('.repro__cc', bar), subs = $('.repro__subs', bar);

  // pos: dónde quedó la voz actual (en segundos) cuando no está sonando, por ejemplo después de mover la barra
  let zona = null, ids = [], idx = 0, pos = 0, sonando = false, conSubs = false, arrastrando = false;
  const total = () => ids.reduce((t, id) => t + fin(id), 0);
  const antes = () => ids.slice(0, idx).reduce((t, id) => t + fin(id), 0);
  const mia = () => audio.current && ids.includes(audio.current.id);

  const pintar = () => {
    btn.innerHTML = sonando ? ICON_PAUSA : ICON_PLAY;
    btn.setAttribute('aria-label', sonando ? 'Pausar la voz' : 'Escuchar la voz');
    bar.classList.toggle('is-sonando', sonando);
  };
  // el punto actual dentro de la voz que corresponde
  const ahora = () => (mia() && audio.current.id === ids[idx] ? audio.current.el.currentTime : pos);
  const subtitulo = () => {
    if (!conSubs || !ids.length) { subs.hidden = true; return; }
    const v = VOICES[ids[idx]], t = ahora();
    let txt = '';
    v.cues.forEach((c) => { if (t >= c[0]) txt = c[2]; });
    subs.textContent = txt || v.cues[0][2];
    subs.hidden = false;
  };
  const pintarAvance = (t) => {
    const tot = total();
    avance.max = tot.toFixed(1);
    if (!arrastrando) avance.value = t.toFixed(1);
    avance.style.setProperty('--p', `${Math.min(100, ((arrastrando ? +avance.value : t) / tot) * 100) || 0}%`);
    tiempo.textContent = `${mmss(arrastrando ? +avance.value : t)} / ${mmss(tot)}`;
  };
  const progreso = () => {
    if (!ids.length) return;
    pintarAvance(antes() + ahora());
    subtitulo();
  };
  let raf = 0;
  const loop = () => {
    if (sonando && !mia()) { sonando = false; pintar(); } // otra cosa cortó la voz
    progreso();
    if (sonando) raf = requestAnimationFrame(loop);
  };

  const tocar = () => {
    if (!audio.enabled) audio.enable();
    const id = ids[idx];
    if (audio.current && audio.current.id !== id) audio.stop();
    audio.queue = [];
    const desde = pos;
    audio.play(id); // si es la misma voz en pausa, sigue desde donde quedó
    if (audio.current && Math.abs(audio.current.el.currentTime - desde) > 0.25) audio.current.el.currentTime = desde;
    pos = 0;
    sonando = true; pintar(); cancelAnimationFrame(raf); loop();
  };
  const pausar = () => { if (mia()) { pos = audio.current.el.currentTime; audio.pause(); } sonando = false; pintar(); progreso(); };
  btn.addEventListener('click', () => (sonando ? pausar() : tocar()));
  const saltar = (t) => {
    // a qué voz de la zona cae ese momento, y en qué segundo de esa voz
    let k = 0, acc = 0;
    while (k < ids.length - 1 && t >= acc + fin(ids[k])) { acc += fin(ids[k]); k += 1; }
    const off = Math.max(0, Math.min(fin(ids[k]) - 0.05, t - acc));
    if (k !== idx) {
      if (mia()) audio.stop();
      idx = k; pos = off;
      if (sonando) tocar(); else progreso();
    } else if (mia() && audio.current.id === ids[idx]) {
      audio.current.el.currentTime = off; pos = sonando ? 0 : off; progreso();
    } else { pos = off; progreso(); }
  };
  avance.addEventListener('input', () => { arrastrando = true; pintarAvance(+avance.value); });
  avance.addEventListener('change', () => { arrastrando = false; saltar(+avance.value); });
  avance.addEventListener('pointerup', () => { if (arrastrando) { arrastrando = false; saltar(+avance.value); } });
  cc.addEventListener('click', () => {
    conSubs = !conSubs;
    cc.setAttribute('aria-pressed', String(conSubs));
    subtitulo();
  });
  // al terminar una voz, sigue la siguiente de la zona (solo si la persona había dado play)
  document.addEventListener('voice:ended', (e) => {
    if (!sonando || e.detail?.id !== ids[idx]) return;
    if (idx < ids.length - 1) { idx += 1; pos = 0; tocar(); } else { idx = 0; pos = 0; sonando = false; pintar(); progreso(); }
  });

  const entrar = (z) => {
    if (z === zona) return;
    if (sonando || mia()) { audio.stop(); sonando = false; }
    zona = z; idx = 0; pos = 0;
    if (!z) { bar.classList.remove('is-on'); pintar(); return; }
    ids = z.dataset.voces.split(',').filter((id) => VOICES[id]);
    titulo.textContent = z.dataset.vocesTitulo || 'Voz en off';
    bar.style.setProperty('--acc', getComputedStyle(z).getPropertyValue('--acc') || 'var(--crema)');
    bar.classList.add('is-on');
    pintar(); progreso();
  };
  const buscar = () => {
    const y = innerHeight * 0.5;
    // la zona más interna que contiene la mitad de la pantalla
    let z = null;
    zonas.forEach((el) => {
      const r = el.getBoundingClientRect();
      let top = r.top;
      const desde = el.dataset.vocesDesde && el.querySelector(el.dataset.vocesDesde);
      if (desde) top = desde.getBoundingClientRect().top + parseFloat(getComputedStyle(desde).paddingTop);
      if (top <= y && r.bottom > y && (!z || z.contains(el))) z = el;
    });
    entrar(z);
  };
  addEventListener('scroll', buscar, { passive: true });
  addEventListener('resize', buscar);
  buscar();
}
