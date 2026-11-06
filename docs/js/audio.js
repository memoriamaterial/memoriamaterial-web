// Audio de Memoria Material
// - Ruido blanco generado en el navegador (el aula a oscuras).
// - Voces en off producidas, con subtítulos sincronizados (tiempos estimados, ver PENDIENTES.md #9).

const ICON_PLAY = '<svg class="i-play" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M4 2.5v11l9.5-5.5z"/></svg>';
const ICON_PAUSE = '<svg class="i-pause" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M3.5 2.5h3v11h-3zM9.5 2.5h3v11h-3z"/></svg>';

// Frases por archivo. [inicio, fin, texto] en segundos.
export const VOICES = {
  e1: {
    src: 'assets/audio/e1-voz.mp3', who: 'Voz en off · Etapa 1',
    cues: [
      [0.9, 4.9, 'Entraste a la etapa de la plasticidad sináptica.'],
      [5.1, 11.9, 'En esta etapa tu cerebro reorganiza la conexión entre los objetos que reconoce visualmente, y el significado que este le evoca.'],
      [12.5, 16.6, 'Cómo esas cosas de tu día a día que, con el tiempo, van cobrando valor.'],
      [16.8, 21.8, 'Para avanzar vas a tener que reorganizar las conexiones.'],
    ],
  },
  e2: {
    src: 'assets/audio/e2-voz.mp3', who: 'Voz en off · Etapa 2',
    cues: [
      [2.4, 8.4, 'Cuando el significado de ese objeto tan cotidiano para vos cambia, es porque cambia también el punto de vista desde el que lo mirás.'],
      [8.9, 11.9, 'En esta etapa, vas a entrar en el mundo de los objetos,'],
      [12.1, 16.9, 'un lugar en donde vas a experimentar cómo esos objetos cotidianos pueden simbolizar algo distinto,'],
      [17.3, 21.4, 'por todo lo que ese objeto vio, escuchó, y vivió con vos.'],
      [21.6, 25.4, 'Todo de lo que ese objeto fue testigo.'],
    ],
  },
  llave2: {
    src: 'assets/audio/llave-voz-2.mp3', who: 'Voces · Mundo de la llave',
    cues: [
      [2.2, 4.4, '—¿En dónde quedaron las llaves?'],
      [4.7, 6.8, '—Me falta lo más importante.'],
      [7.1, 12.9, '—Creo que la guardaste en la mesita de luz.'],
    ],
  },
  llave3: {
    src: 'assets/audio/llave-voz-3.mp3', who: 'Voces · Mundo de la llave',
    cues: [[0.6, 4.0, '—¡Sí! Acá están.']],
  },
  e3a: {
    src: 'assets/audio/e3-voz-1.mp3', who: 'Voz en off · Etapa 3',
    cues: [
      [0, 6.6, 'Ya viviste cómo un objeto puede convertirse en una extensión de nosotros,'],
      [6.7, 11.2, 'ahora vamos a vivirlo con vos.'],
    ],
  },
  e3b: {
    src: 'assets/audio/e3-voz-2.mp3', who: 'Voz en off · Etapa 3',
    cues: [
      [0, 10.1, 'En esta etapa, vas a tener que pensar en un objeto que lleves encima: ¿cuál es aquel que puede tener un significado distinto?'],
      [10.2, 14.1, 'Te vamos a dar tiempo. ¿Lo tenés?'],
      [14.3, 26.1, 'Ahora que lo tenés en mente, para avanzar vas a tener que depositar ese objeto en nuestro tótem.'],
      [26.2, 30.8, 'Una vez hecho esto, podrás ingresar a la siguiente etapa.'],
    ],
  },
  e4a: {
    src: 'assets/audio/e4-voz-1.mp3', who: 'Voz en off · Etapa 4',
    cues: [
      [1.6, 7.7, 'Esos objetos a los que les damos valor, funcionan como anclas de seguridad.'],
      [7.9, 12.3, 'Cuando nos dimos cuenta que lo perdimos, el cerebro siente que esa seguridad desapareció,'],
      [12.4, 17.4, 'y comenzamos a preguntarnos sin parar: ¿Dónde estará? ¿Lo voy a recuperar? “Voy a estar todo el día pensando en esto…”'],
      [17.6, 24.7, 'Empezamos a buscarlo en todos lados, pensando que ya no lo vamos a encontrar.'],
    ],
  },
  e4b: {
    src: 'assets/audio/e4-voz-2.mp3', who: 'Voz en off · Etapa 4',
    cues: [
      [0.1, 5.4, '¿Te das cuenta lo que sería perder ese objeto?'],
      [5.9, 8.0, '¿Cómo se sentiría?'],
      [8.5, 12.6, '¿Cómo te sentís ahora que sabés que no está con vos?'],
      [12.8, 15.8, 'Sabemos que ahora querés recuperarlo,'],
      [15.9, 20.4, 'y vos sabés a dónde tenés que ir a buscar.'],
      [20.5, 22.2, 'Te invitamos a que lo hagas.'],
    ],
  },
  e5: {
    src: 'assets/audio/e5-voz.mp3', who: 'Voz en off · Etapa 5',
    cues: [[1.2, 9.4, 'Ahora que tanto pensaste tu objeto, y sentiste su ausencia, tenés una oportunidad de recuperarlo.']],
  },
};

class AudioManager {
  constructor() {
    this.enabled = false;
    this.ctx = null;
    this.noiseGain = null;
    this.noiseLevel = 0.022;
    this.current = null;   // { id, el, card }
    this.cards = new Map(); // id -> [cards]
    this.listeners = new Set();
    this.subbar = null;
  }

  on(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
  emit() { this.listeners.forEach((fn) => fn(this)); }

  // Debe llamarse dentro de un gesto del usuario (click / toque).
  enable() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) {
        this.ctx = new AC();
        this.buildNoise();
      }
    }
    this.ctx?.resume?.();
    this.enabled = true;
    this.fadeNoise(this.noiseLevel, 1.5);
    this.emit();
  }

  disable() {
    this.enabled = false;
    this.fadeNoise(0, 0.4);
    if (this.current) this.pause();
    this.emit();
  }

  toggle() { this.enabled ? this.disable() : this.enable(); }

  // Ruido "rosado" suave, filtrado: el aula a oscuras con ruido blanco.
  buildNoise() {
    const ctx = this.ctx;
    const len = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.99765 * b0 + w * 0.099046;
        b1 = 0.963 * b1 + w * 0.2965164;
        b2 = 0.57 * b2 + w * 1.0526913;
        d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.16;
      }
    }
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 2200;
    this.noiseFilter = lp;
    this.noiseGain = ctx.createGain();
    this.noiseGain.gain.value = 0;
    src.connect(lp).connect(this.noiseGain).connect(ctx.destination);
    src.start();
  }

  fadeNoise(level, secs = 1) {
    if (!this.noiseGain) return;
    const g = this.noiseGain.gain, t = this.ctx.currentTime;
    g.cancelScheduledValues(t);
    g.setValueAtTime(g.value, t);
    g.linearRampToValueAtTime(level, t + secs);
  }

  // Nivel del ruido por escenario (E4 lo sube, por ejemplo).
  setAmbience(mult = 1, cutoff = 2200) {
    this.noiseLevel = 0.022 * mult;
    if (this.noiseFilter) this.noiseFilter.frequency.setTargetAtTime(cutoff, this.ctx.currentTime, 0.4);
    if (this.enabled) this.fadeNoise(this.noiseLevel, 1.2);
  }

  // --- Voces ---------------------------------------------------------------
  registerCard(card) {
    const id = card.dataset.voice;
    const v = VOICES[id];
    if (!v) return;
    card.classList.add('voice');
    card.style.setProperty('--acc', card.dataset.acc ? `var(--${card.dataset.acc})` : '');
    const total = Math.round(v.cues.at(-1)[1]);
    card.innerHTML = `
      <button class="voice__play" type="button" aria-label="Escuchar la voz en off">${ICON_PLAY}${ICON_PAUSE}</button>
      <div>
        <div class="voice__meta"><span class="tag">${v.who}</span><span class="voice__track" aria-hidden="true"></span><span>0:${String(total).padStart(2, '0')}</span></div>
        <p class="voice__text">${v.cues.map((c, i) => `<span class="cue" data-i="${i}">${c[2]}</span>`).join(' ')}</p>
      </div>`;
    card.querySelector('.voice__play').addEventListener('click', () => {
      if (this.current?.id === id && !this.current.el.paused) this.pause();
      else { if (!this.enabled) this.enable(); this.play(id, card); }
    });
    if (!this.cards.has(id)) this.cards.set(id, []);
    this.cards.get(id).push(card);
  }

  play(id, card) {
    const v = VOICES[id];
    if (!v) return;
    if (this.current && this.current.id !== id) this.stop();
    if (!this.current) {
      const el = new Audio(v.src);
      el.preload = 'auto';
      this.current = { id, el, card: card || this.cards.get(id)?.[0] };
      el.addEventListener('timeupdate', () => this.tick());
      el.addEventListener('ended', () => this.ended());
    }
    if (card) this.current.card = card;
    this.current.el.play().catch(() => {});
    this.current.card?.classList.add('is-playing', 'has-played');
    this.fadeNoise(this.noiseLevel * 0.5, 0.6); // la voz manda
    this.showSubbar(true);
    this.emit();
  }

  // Reproduce sola solo si el sonido está activado y nunca sonó esta voz.
  autoplay(id, card) {
    if (!this.enabled) return;
    if (card?.classList.contains('has-played')) return;
    this.play(id, card);
  }

  pause() {
    if (!this.current) return;
    this.current.el.pause();
    this.current.card?.classList.remove('is-playing');
    if (this.enabled) this.fadeNoise(this.noiseLevel, 0.8);
    this.showSubbar(false);
    this.emit();
  }

  stop() {
    if (!this.current) return;
    this.current.el.pause();
    this.current.card?.classList.remove('is-playing');
    this.current = null;
    this.showSubbar(false);
  }

  ended() {
    const c = this.current;
    c?.card?.classList.remove('is-playing');
    c?.card?.querySelectorAll('.cue').forEach((n) => { n.classList.remove('is-on'); n.classList.add('is-past'); });
    this.current = null;
    if (this.enabled) this.fadeNoise(this.noiseLevel, 1);
    this.showSubbar(false);
    document.dispatchEvent(new CustomEvent('voice:ended', { detail: { id: c?.id } }));
    this.emit();
  }

  tick() {
    const c = this.current; if (!c) return;
    const v = VOICES[c.id], t = c.el.currentTime;
    const dur = c.el.duration || v.cues.at(-1)[1];
    let idx = -1;
    v.cues.forEach((cue, i) => { if (t >= cue[0]) idx = i; });
    (this.cards.get(c.id) || []).forEach((card) => {
      card.style.setProperty('--p', (t / dur).toFixed(3));
      card.querySelectorAll('.cue').forEach((n, i) => {
        n.classList.toggle('is-on', i === idx);
        n.classList.toggle('is-past', i < idx);
      });
    });
    if (this.subbar && idx >= 0) {
      const txt = v.cues[idx][2];
      if (this.subbar.txt.textContent !== txt) this.subbar.txt.textContent = txt;
    }
  }

  // Barra flotante: aparece si la tarjeta de la voz no está a la vista.
  mountSubbar() {
    const bar = document.createElement('div');
    bar.className = 'subbar';
    bar.setAttribute('aria-live', 'polite');
    bar.innerHTML = `<button class="subbar__btn" type="button" aria-label="Pausar la voz">${ICON_PAUSE.replace('class="i-pause"', '')}</button><div><div class="subbar__who"></div><div class="subbar__txt"></div></div>`;
    document.body.appendChild(bar);
    this.subbar = { el: bar, who: bar.querySelector('.subbar__who'), txt: bar.querySelector('.subbar__txt') };
    bar.querySelector('button').addEventListener('click', () => this.pause());
    this.io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { e.target._visible = e.isIntersecting; });
      this.showSubbar(!!this.current && !this.current.el.paused);
    }, { threshold: 0.35 });
  }

  observeCard(card) { this.io?.observe(card); }

  showSubbar(playing) {
    if (!this.subbar) return;
    const c = this.current;
    const cardVisible = c?.card?._visible;
    const on = playing && c && !cardVisible;
    if (c) {
      this.subbar.who.textContent = VOICES[c.id].who;
      this.subbar.el.style.setProperty('--acc', getComputedStyle(c.card || document.body).getPropertyValue('--acc'));
    }
    this.subbar.el.classList.toggle('is-on', !!on);
  }
}

export const audio = new AudioManager();
