// Audio de Memoria Material
// - Ruido blanco generado en el navegador (el lugar a oscuras).
// - Voces (assets/audio/voces, tools/sonidos_nuevos.py) con subtítulos según el guion, sincronizados con
//   las pausas medidas de cada audio. Efectos (assets/audio/ruidos) más bajos que las voces.

// Los efectos siempre más bajos que las voces, y todavía más mientras habla una voz.
const SFX_VOL = 0.6;
const SFX_DUCK = 0.22;
const ICON_PLAY = '<svg class="i-play" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M4 2.5v11l9.5-5.5z"/></svg>';
const ICON_PAUSE = '<svg class="i-pause" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M3.5 2.5h3v11h-3zM9.5 2.5h3v11h-3z"/></svg>';

// Frases por archivo. [inicio, fin, texto] en segundos.
export const VOICES = {
  e1: {
    src: 'assets/audio/voces/e1.mp3', who: 'Voz en off · Etapa 1',
    cues: [
      [0, 2.95, 'Entraste a la etapa de la plasticidad sináptica.'],
      [2.95, 10.18, 'En esta etapa tu cerebro reorganiza la conexión entre los objetos que reconoce visualmente, y el significado que este le evoca.'],
      [10.18, 14.31, 'Cómo esas cosas de tu día a día que, con el tiempo, van cobrando valor.'],
      [14.31, 17.47, 'Para avanzar vas a tener que reorganizar las conexiones.'],
    ],
  },
  e2: {
    src: 'assets/audio/voces/e2.mp3', who: 'Voz en off · Etapa 2',
    cues: [
      [0, 6.68, 'Cuando el significado de ese objeto tan cotidiano para vos cambia, es porque cambia también el punto de vista desde el que lo mirás.'],
      [6.68, 10.39, 'En esta etapa, vas a entrar en el mundo de los objetos,'],
      [10.39, 15.63, 'un lugar en donde vas a experimentar cómo esos objetos cotidianos pueden simbolizar algo distinto,'],
      [15.63, 19.81, 'por todo lo que ese objeto vio, escuchó, y vivió con vos.'],
      [19.81, 21.67, 'Todo de lo que ese objeto fue testigo.'],
    ],
  },
  // Mundo de la llave: una voz por frase del guion, en orden
  llave1: {
    src: 'assets/audio/voces/llave-1.mp3', who: 'Voz 1 · Mundo de la llave',
    cues: [[0, 2.76, '—Llegó el día, por fin me voy a mudar.']],
  },
  llave2: {
    src: 'assets/audio/voces/llave-2.mp3', who: 'Voz 2 · Mundo de la llave',
    cues: [[0, 1.63, '—Te voy a extrañar, hijo.']],
  },
  llave3: {
    src: 'assets/audio/voces/llave-3.mp3', who: 'Voz 3 · Mundo de la llave',
    cues: [[0, 2.69, '—Te regalo esto, espero que te guste.']],
  },
  // --- Efectos (assets/audio/ruidos, fragmentos de los sonidos nuevos; el subtítulo describe el sonido) ---
  mate1: { src: 'assets/audio/ruidos/sorbo-1.mp3', who: 'Sonido · Mundo del mate', sfx: true, cues: [[0, 1.13, '[mate tomado]']] },
  mate2: { src: 'assets/audio/ruidos/sorbo-2.mp3', who: 'Sonido · Mundo del mate', sfx: true, cues: [[0, 1.34, '[mate tomado]']] },
  mate3: { src: 'assets/audio/ruidos/sorbo-3.mp3', who: 'Sonido · Mundo del mate', sfx: true, cues: [[0, 0.94, '[mate tomado]']] },
  mate4: { src: 'assets/audio/ruidos/sorbo-4.mp3', who: 'Sonido · Mundo del mate', sfx: true, cues: [[0, 0.74, '[mate tomado]']] },
  cebando: { src: 'assets/audio/ruidos/cebando-1.mp3', who: 'Sonido · Mundo del mate', sfx: true, cues: [[0, 6.02, '[mate cebándose]']] },
  cebando2: { src: 'assets/audio/ruidos/cebando-2.mp3', who: 'Sonido · Mundo del mate', sfx: true, cues: [[0, 5.04, '[mate cebándose]']] },
  pajaros: { src: 'assets/audio/ruidos/pajaros.mp3', who: 'Sonido · Mundo del mate', sfx: true, cues: [[0, 10.03, '[pájaros]']] },
  pava: { src: 'assets/audio/ruidos/pava.mp3', who: 'Sonido · Mundo del mate', sfx: true, cues: [[0, 10.03, '[la pava en la hornalla]']] },
  sorboEsfera: { src: 'assets/audio/ruidos/sorbo-esfera.mp3', who: 'Sonido · Esfera fucsia', sfx: true, cues: [[0, 0.74, '[alguien toma un mate]']] },
  llavesAbriendo: { src: 'assets/audio/ruidos/llaves-abriendo.mp3', who: 'Sonido · Llaves', sfx: true, cues: [[0, 4.03, '[llaves abriendo una puerta]']] },
  llavesCajon: { src: 'assets/audio/ruidos/llaves-cajon.mp3', who: 'Sonido · Mundo de la llave', sfx: true, cues: [[0, 1.94, '[las llaves en el cajón]']] },
  llavesMano: { src: 'assets/audio/ruidos/llaves-mano.mp3', who: 'Sonido · Mundo de la llave', sfx: true, cues: [[0, 2.54, '[la llave entra en la cerradura]']] },
  paginas1: { src: 'assets/audio/ruidos/paginas-1.mp3', who: 'Sonido · Mundo del cuaderno', sfx: true, cues: [[0, 4.03, '[hojas que se ordenan]']] },
  paginas2: { src: 'assets/audio/ruidos/paginas-2.mp3', who: 'Sonido · Mundo del cuaderno', sfx: true, cues: [[0, 4.03, '[hojas que se ordenan]']] },
  escribiendo1: { src: 'assets/audio/ruidos/escribiendo-1.mp3', who: 'Sonido · Mundo del cuaderno', sfx: true, cues: [[0, 7.03, '[alguien escribe]']] },
  escribiendo2: { src: 'assets/audio/ruidos/escribiendo-2.mp3', who: 'Sonido · Mundo del cuaderno', sfx: true, cues: [[0, 7.03, '[alguien escribe]']] },
  // --- Voces nuevas (tools/sonidos_nuevos.py) ---------------------------------------
  bienvenida: { src: 'assets/audio/voces/bienvenida.mp3', who: 'Voz en off · Video de bienvenida', cues: [
      [0, 5.76, 'Bienvenido a Memoria Material, una experiencia donde vas a darle una nueva mirada a lo cotidiano.'],
      [5.76, 10.26, '¿Nunca tuviste un objeto, un momento, un hábito'],
      [10.26, 15.24, 'que con el tiempo pasó de ser cotidiano y rutinario, a resignificarse como algo importante y propio de vos?'],
      [15.24, 20.3, 'Hoy vas a recorrer un circuito que recrea lo que pasaba en tu mente en ese momento,'],
      [20.3, 26.97, 'los procesos cognitivos que se daban en ese instante en el que te diste cuenta del nuevo valor de ese elemento cotidiano.'],
      [26.97, 30.94, 'Acercate a la computadora designada y preparate para vivir esta experiencia.'],
    ] },
  esferaMate: { src: 'assets/audio/voces/e1-esfera-mate.mp3', who: 'Esfera fucsia · Etapa 1', cues: [[0, 2.38, '—Gracias, yo ya estoy.']] },
  esferaCuaderno: { src: 'assets/audio/voces/e1-esfera-cuaderno.mp3', who: 'Esfera celeste · Etapa 1', cues: [[0, 2.35, '—Tomá mi número, hablemos.']] },
  llave4: { src: 'assets/audio/voces/llave-4.mp3', who: 'Voz 4 · Mundo de la llave', cues: [[0, 1.51, '—¿En dónde quedaron las llaves?']] },
  llave5: { src: 'assets/audio/voces/llave-5.mp3', who: 'Voz 5 · Mundo de la llave', cues: [[0, 1.61, '—Me falta lo más importante.']] },
  llave6: { src: 'assets/audio/voces/llave-6.mp3', who: 'Voz 6 · Mundo de la llave', cues: [[0, 3.14, '—Creo que la guardaste en la mesita de luz.']] },
  llave7: { src: 'assets/audio/voces/llave-7.mp3', who: 'Voz 7 · Mundo de la llave', cues: [
      [0, 2.62, '—¡Sí!'],
      [2.62, 3.89, '—¡Acá están!'],
    ] },
  mateR3a: { src: 'assets/audio/voces/mate-reunion-v3a.mp3', who: 'Voz 3 · Mundo del mate', cues: [
      [0, 3.75, '—Uh, sí, dale… Espero que este verano no sea como siempre, eh,'],
      [3.75, 8.18, 'que nos terminamos viendo de vuelta en marzo en el aula.'],
    ] },
  mateR3b: { src: 'assets/audio/voces/mate-reunion-v3b.mp3', who: 'Voz 3 · Mundo del mate', cues: [[0, 3.58, '—Daaa, si después andás diciendo que nos extrañás.']] },
  mateM2a: { src: 'assets/audio/voces/mate-manana-v2a.mp3', who: 'Voz 2 · Mundo del mate', cues: [[0, 2.23, '—Pasame un mate que ya me tengo que ir a laburar.']] },
  mateM2b: { src: 'assets/audio/voces/mate-manana-v2b.mp3', who: 'Voz 2 · Mundo del mate', cues: [[0, 1.22, '—Gracias, amor.']] },
  mateM2c: { src: 'assets/audio/voces/mate-manana-v2c.mp3', who: 'Voz 2 · Mundo del mate', cues: [[0, 1.87, '—Ustedes también, los amo.']] },
  mateM2d: { src: 'assets/audio/voces/mate-manana-v2d.mp3', who: 'Voz 2 · Mundo del mate', cues: [[0, 3.02, '—Bueno, nos vemos a la noche.']] },
  cqL2a: { src: 'assets/audio/voces/cuaderno-lista-v2a.mp3', who: 'Voz 2 · Mundo del cuaderno', cues: [[0, 5.52, '—Sí, primero hay que cambiar el piso, pintar, y último el escritorio.']] },
  cqL2b: { src: 'assets/audio/voces/cuaderno-lista-v2b.mp3', who: 'Voz 2 · Mundo del cuaderno', cues: [[0, 1.8, '—Dale.']] },
  cqL2c: { src: 'assets/audio/voces/cuaderno-lista-v2c.mp3', who: 'Voz 2 · Mundo del cuaderno', cues: [
      [0, 4.87, '—Vamos a necesitar un metro, caladora y sellador.'],
      [4.87, 6.74, 'Con eso creo que estamos bien.'],
    ] },
  cqR2a: { src: 'assets/audio/voces/cuaderno-receta-v2a.mp3', who: 'Voz 2 · Mundo del cuaderno', cues: [[0, 2.4, '—¡Obvio, abu, eso no se pregunta!']] },
  cqR2b: { src: 'assets/audio/voces/cuaderno-receta-v2b.mp3', who: 'Voz 2 · Mundo del cuaderno', cues: [
      [0, 1.64, '—A ver…'],
      [1.64, 2.42, '¡Acá está!'],
    ] },
  cqR2c: { src: 'assets/audio/voces/cuaderno-receta-v2c.mp3', who: 'Voz 2 · Mundo del cuaderno', cues: [[0, 3.36, '—¿Y no iba una taza de aceite también?']] },
  e4video: { src: 'assets/audio/voces/e4-video.mp3', who: 'Voz en off · Video antes de la Etapa 5', cues: [
      [0, 2.69, 'Cuando lo tenías encima ni pensabas en él,'],
      [2.69, 7.23, 'ahora que lo perdiste, no podés dejar de pensarlo, de verlo en todos lados.'],
      [7.23, 10.54, 'Tu cerebro no te va a dejar descansar hasta que lo encuentres,'],
      [10.54, 11.28, 'volvé a buscarlo.'],
    ] },
  e3a: {
    src: 'assets/audio/voces/e3-1.mp3', who: 'Voz en off · Etapa 3',
    cues: [
      [0, 4.65, 'Ya viviste cómo un objeto puede convertirse en una extensión de nosotros,'],
      [4.65, 6.5, 'ahora vamos a vivirlo con vos.'],
    ],
  },
  e3b: {
    src: 'assets/audio/voces/e3-2.mp3', who: 'Voz en off · Etapa 3',
    cues: [
      [0, 3.79, 'En esta etapa, vas a tener que pensar en un objeto que lleves encima:'],
      [3.79, 7.94, '¿cuál es aquel que puede tener un significado distinto?'],
      [7.94, 10.74, 'Te vamos a dar tiempo.'],
      [10.74, 11.69, '¿Lo tenés?'],
      [11.69, 16.03, 'Ahora que lo tenés en mente, para avanzar vas a tener que depositar ese objeto en nuestro tótem.'],
      [16.03, 19.18, 'Una vez hecho esto, podrás ingresar a la siguiente etapa.'],
    ],
  },
  e4a: {
    src: 'assets/audio/voces/e4-1.mp3', who: 'Voz en off · Etapa 4',
    cues: [
      [0, 6.32, 'Esos objetos a los que les damos valor, funcionan como anclas de seguridad.'],
      [6.32, 11.21, 'Cuando nos dimos cuenta que lo perdimos, el cerebro siente que esa seguridad desapareció,'],
      [11.21, 17.21, 'y comenzamos a preguntarnos sin parar: ¿Dónde estará? ¿Lo voy a recuperar? “Voy a estar todo el día pensando en esto…”'],
      [17.21, 20.66, 'Empezamos a buscarlo en todos lados, pensando que ya no lo vamos a encontrar.'],
    ],
  },
  e4b: {
    src: 'assets/audio/voces/e4-2.mp3', who: 'Voz en off · Etapa 4',
    cues: [
      [0, 3.6, '¿Te das cuenta lo que sería perder ese objeto?'],
      [3.6, 5.47, '¿Cómo se sentiría?'],
      [5.47, 8.49, '¿Cómo te sentís ahora que sabés que no está con vos?'],
      [8.49, 11.02, 'Sabemos que ahora querés recuperarlo,'],
      [11.02, 13.12, 'y vos sabés a dónde tenés que ir a buscar.'],
      [13.12, 14.26, 'Te invitamos a que lo hagas.'],
    ],
  },
  e5: {
    src: 'assets/audio/voces/e5.mp3', who: 'Voz en off · Etapa 5',
    cues: [[0, 5.74, 'Ahora que tanto pensaste tu objeto, y sentiste su ausencia, tenés una oportunidad de recuperarlo.']],
  },
  e6: {
    src: 'assets/audio/voces/e6.mp3', who: 'Voz en off · Etapa 6',
    cues: [
      [0, 2.25, 'Encontraste el significado,'],
      [2.25, 4.42, 'depositalo en el tótem.'],
      [4.42, 7.42, 'Ya podés quitarte el detector e ir en busca de tu objeto.'],
    ],
  },
  cierre: {
    src: 'assets/audio/voces/cierre.mp3', who: 'Voz en off · Video final',
    cues: [
      [0, 5.84, 'Esto fue Memoria Material, una experiencia dispuesta a buscar en eso que te resultaba habitual.'],
      [5.84, 10.46, 'Esperamos haberte hecho notar que en lo cotidiano, hay cosas que pueden cobrar otro significado.'],
    ],
  },
};

class AudioManager {
  constructor() {
    this.enabled = false;
    this.ctx = null;
    this.noiseGain = null;
    this.noiseLevel = 0.006; // C-03: ruido blanco apenas perceptible (antes 0.022)
    this.current = null;   // { id, el, card }
    this.queue = [];       // voces que esperan a que termine la que suena
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
    this.queue = [];
    this.fadeNoise(0, 0.4);
    if (this.current) this.pause();
    this.emit();
  }

  toggle() { this.enabled ? this.disable() : this.enable(); }

  // Ruido "rosado" suave, filtrado: el lugar a oscuras con ruido blanco.
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
    this.noiseLevel = 0.006 * mult;
    if (this.noiseFilter) this.noiseFilter.frequency.setTargetAtTime(cutoff, this.ctx.currentTime, 0.4);
    if (this.enabled) this.fadeNoise(this.noiseLevel, 1.2);
  }

  // --- Voces ---------------------------------------------------------------
  registerCard(card) {
    const id = card.dataset.voice;
    const v = VOICES[id];
    if (!v) return;
    card.style.setProperty('--acc', card.dataset.acc ? `var(--${card.dataset.acc})` : '');
    const total = Math.round(v.cues.at(-1)[1]);
    if (v.sfx) {
      // efecto de sonido: píldora con play/pausa; el subtítulo describe el sonido
      card.classList.add('sfx');
      card.innerHTML = `<button class="sfx__play voice__play" type="button" aria-label="Escuchar el sonido: ${v.cues[0][2].replace(/[\[\]]/g, '')}">${ICON_PLAY}${ICON_PAUSE}</button><span class="sfx__label">${v.cues[0][2]}</span>`;
      card.querySelector('button').addEventListener('click', () => {
        if (!this.enabled) this.enable();
        this.playSfx(id, card, true); // vuelve a tocarlo para pausar
      });
      if (!this.cards.has(id)) this.cards.set(id, []);
      this.cards.get(id).push(card);
      return;
    }
    card.classList.add('voice');
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
    if (v.sfx) return this.playSfx(id, card);
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
    this.current.el.addEventListener('playing', () => this.duckSfx(), { once: true });
    this.showSubbar(true);
    this.emit();
  }

  // Efectos de sonido: reproductores independientes, para que dos sonidos seguidos no se corten.
  playSfx(id, card, toggle = false) {
    const v = VOICES[id];
    this.sfx = this.sfx || new Map();
    const prev = this.sfx.get(id);
    if (prev && !prev.el.paused) {
      if (!toggle) { prev.el.currentTime = 0; return; } // si se dispara de nuevo, vuelve a empezar (no se corta)
      prev.el.pause(); prev.card?.classList.remove('is-playing'); this.sfx.delete(id); this.sfxCaption(); return;
    }
    const el = new Audio(v.src);
    el.volume = this.voiceOn() ? SFX_DUCK : SFX_VOL;
    const entry = { el, card };
    this.sfx.set(id, entry);
    card?.classList.add('is-playing', 'has-played');
    el.addEventListener('ended', () => { card?.classList.remove('is-playing'); this.sfx.delete(id); this.sfxCaption(); });
    el.play().catch(() => {});
    this.sfxCaption(v);
  }

  voiceOn() { return !!(this.current && !this.current.el.paused); }
  duckSfx() { const vol = this.voiceOn() ? SFX_DUCK : SFX_VOL; this.sfx?.forEach((e) => { e.el.volume = vol; }); }

  // Subtítulo del sonido en la barra flotante, si no hay una voz sonando.
  sfxCaption(v) {
    if (!this.subbar || (this.current && !this.current.el.paused)) return;
    const on = !!v || (this.sfx && this.sfx.size > 0);
    const last = v || (this.sfx && [...this.sfx.keys()].map((k) => VOICES[k]).at(-1));
    if (last) { this.subbar.who.textContent = last.who; this.subbar.txt.textContent = last.cues[0][2]; }
    this.subbar.el.classList.toggle('is-on', on);
  }

  // Reproduce sola solo si el sonido está activado y nunca sonó esta voz.
  // D-01/D-08: si otra voz está sonando, la nueva espera a que termine (no la corta).
  autoplay(id, card) {
    if (!this.enabled) return;
    if (card?.classList.contains('has-played')) return;
    const busy = this.current && !this.current.el.paused && this.current.id !== id && !VOICES[id]?.sfx;
    if (busy) { if (!this.queue.some((q) => q.id === id)) this.queue.push({ id, card }); return; }
    this.play(id, card);
  }

  // Ejecuta `fn` cuando termina la voz `id` (si está sonando o en espera); si no, enseguida.
  after(id, fn) {
    const pending = (this.current?.id === id && !this.current.el.paused) || this.queue.some((q) => q.id === id);
    if (!pending) return fn();
    const h = (e) => { if (e.detail?.id === id) { document.removeEventListener('voice:ended', h); fn(); } };
    document.addEventListener('voice:ended', h);
  }

  pause() {
    if (!this.current) return;
    this.current.el.pause();
    this.current.card?.classList.remove('is-playing');
    if (this.enabled) this.fadeNoise(this.noiseLevel, 0.8);
    this.duckSfx();
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
    this.duckSfx();
    if (this.enabled) this.fadeNoise(this.noiseLevel, 1);
    this.showSubbar(false);
    document.dispatchEvent(new CustomEvent('voice:ended', { detail: { id: c?.id } }));
    this.emit();
    // la siguiente voz en espera, si todavía no sonó y la persona sigue en su sección
    while (this.queue.length && !this.current) {
      const q = this.queue.shift();
      const zone = q.card?.closest('section');
      const r = zone?.getBoundingClientRect();
      const here = !r || (r.top < window.innerHeight && r.bottom > 0);
      if (here && !q.card?.classList.contains('has-played')) this.play(q.id, q.card);
    }
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
