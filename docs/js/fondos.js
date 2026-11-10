// D-02 · Fondos: cada sección tiene su propia combinación de tramas y formas de la marca,
// animadas muy despacio detrás del contenido. Con "reducir movimiento" quedan quietas (css).
//
// Capas:
//  trama  → un bloque de trama de la marca (ondas, densa o diagonal) que se desliza adentro de su caja
//  forma  → una forma suelta (la S de dos semicírculos o el medio círculo) que flota
//  arcos  → semicírculos concéntricos de línea que respiran

const C = { f: 'var(--fucsia)', a: 'var(--amarillo)', c: 'var(--celeste)', k: 'var(--crema)' };

// caja: [izquierda, arriba, ancho, alto] en % de la pantalla
const t = (kind, color, box, o = {}) => ({ type: 'trama', kind, color, box, ...o });
const f = (shape, color, at, o = {}) => ({ type: 'forma', shape, color, at, ...o });
const a = (color, at, o = {}) => ({ type: 'arcos', color, at, ...o });

const FONDOS = {
  // Entrada: formas sueltas de los tres colores, flotando
  entrada: [f('s', C.f, [8, 18, 9], { r: -12 }), f('half', C.c, [80, 12, 7], { r: 18, d: 17 }), f('s', C.a, [70, 74, 6], { r: 8, d: 21 }), f('half', C.k, [16, 80, 5], { r: -30, d: 15 })],
  // La idea: una franja de trama densa que cruza en diagonal
  idea: [t('densa', C.f, [-10, 86, 120, 12], { r: -4, dx: 1, dur: 60, o: 0.07 }), f('half', C.a, [86, 18, 6], { r: 0, d: 19 })],
  // El espacio físico: trama de ondas en los bordes de arriba y abajo, en sentidos opuestos
  aula: [t('ondas', C.c, [0, 0, 100, 9], { dx: 1, dur: 50, o: 0.08 }), t('ondas', C.c, [0, 91, 100, 9], { dx: -1, dur: 50, o: 0.08 })],
  // Bienvenida: un bloque grande de trama de ondas a un costado, que baja despacio
  bienvenida: [t('ondas', C.f, [68, 10, 26, 64], { dy: 1, dur: 70, o: 0.06, round: 28 }), f('s', C.c, [8, 76, 7], { r: 10, d: 18 })],
  // Etapa 1: arcos concéntricos (la cúpula) en amarillo
  e1: [a(C.a, [86, 96, 70]), f('half', C.f, [6, 20, 5], { r: 0, d: 16 }), f('half', C.c, [90, 14, 4], { r: 0, d: 20 })],
  // Etapa 2: los tres mundos, tres tramas en bloques chicos
  e2: [t('ondas', C.a, [84, 12, 12, 18], { dx: 1, dur: 40, o: 0.09, round: 18 }), t('densa', C.f, [88, 44, 10, 20], { dy: -1, dur: 46, o: 0.08, round: 18 }), t('diag', C.c, [80, 82, 16, 14], { dx: -1, dur: 52, o: 0.08, round: 18 })],
  // Etapa 3: la trama diagonal como un pasillo de franjas en los laterales
  e3: [t('diag', C.c, [0, 0, 9, 100], { dy: 1, dur: 55, o: 0.07 }), t('diag', C.c, [91, 0, 9, 100], { dy: -1, dur: 55, o: 0.07 })],
  // Etapa 4: trama densa que salta de lugar, como una señal que se corta
  e4: [t('densa', C.f, [58, 8, 36, 30], { dx: 1, dur: 38, o: 0.07, glitch: true, round: 6 }), t('densa', C.c, [6, 70, 24, 16], { dx: -1, dur: 44, o: 0.06, glitch: true, round: 6 })],
  // Etapa 5: formas que caen muy despacio, como objetos repetidos
  e5: [f('s', C.a, [12, 10, 6], { r: 20, d: 24, fall: true }), f('half', C.a, [44, 0, 5], { r: -10, d: 28, fall: true }), f('s', C.f, [74, 6, 5], { r: -25, d: 26, fall: true }), f('half', C.c, [90, 30, 4], { r: 40, d: 30, fall: true })],
  // Etapa 6: arcos que se abren como un radar, en celeste
  e6: [a(C.c, [12, 92, 60], { radar: true }), t('ondas', C.c, [74, 8, 20, 12], { dx: 1, dur: 48, o: 0.07, round: 14 })],
  // Cierre: los tres colores juntos, trama de ondas abajo y formas arriba
  cierre: [t('ondas', C.f, [0, 92, 34, 8], { dx: 1, dur: 50, o: 0.09 }), t('ondas', C.a, [33, 92, 34, 8], { dx: -1, dur: 50, o: 0.09 }), t('ondas', C.c, [66, 92, 34, 8], { dx: 1, dur: 50, o: 0.09 }), f('s', C.f, [84, 14, 6], { r: -8, d: 20 })],
};

function layer(l) {
  const el = document.createElement('div');
  if (l.type === 'trama') {
    const [x, y, w, h] = l.box;
    el.className = `fl fl-trama fl-trama--${l.kind}${l.glitch ? ' is-glitch' : ''}`;
    Object.assign(el.style, { left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%`, borderRadius: `${l.round || 0}px`, transform: l.r ? `rotate(${l.r}deg)` : '' });
    el.style.setProperty('--o', l.o ?? 0.07);
    const rot = document.createElement('b'); // la trama diagonal es la de ondas girada
    el.appendChild(rot);
    const inner = document.createElement('i');
    inner.style.setProperty('--c', l.color);
    inner.style.setProperty('--dx', l.dx || 0);
    inner.style.setProperty('--dy', l.dy || 0);
    inner.style.animationDuration = `${l.dur || 50}s`;
    rot.appendChild(inner);
  } else if (l.type === 'forma') {
    const [x, y, s] = l.at;
    el.className = `fl fl-forma${l.fall ? ' is-fall' : ''}`;
    Object.assign(el.style, { left: `${x}%`, top: `${y}%`, width: `${s}vmax`, color: l.color, animationDuration: `${l.d || 18}s` });
    el.style.setProperty('--r', `${l.r || 0}deg`);
    el.innerHTML = `<svg viewBox="0 0 80 40"><use href="#shape-${l.shape}"/></svg>`;
  } else {
    const [x, y, s] = l.at;
    el.className = `fl fl-arcos${l.radar ? ' is-radar' : ''}`;
    Object.assign(el.style, { left: `${x}%`, top: `${y}%`, width: `${s}vmax`, color: l.color });
    el.innerHTML = '<svg viewBox="0 0 200 100">' + [96, 78, 60, 42, 24].map((r, i) => `<path style="--i:${i}" d="M${100 - r} 100A${r} ${r} 0 0 1 ${100 + r} 100"/>`).join('') + '</svg>';
  }
  return el;
}

export function init() {
  const io = new IntersectionObserver((entries) => entries.forEach((e) => e.target.classList.toggle('is-on', e.isIntersecting)));
  Object.entries(FONDOS).forEach(([id, layers]) => {
    const sec = document.getElementById(id);
    if (!sec) return;
    const fondo = document.createElement('div');
    fondo.className = `fondo fondo--${id}`;
    fondo.setAttribute('aria-hidden', 'true');
    const vista = document.createElement('div');
    vista.className = 'fondo__vista';
    layers.forEach((l) => vista.appendChild(layer(l)));
    fondo.appendChild(vista);
    sec.prepend(fondo);
    io.observe(fondo);
  });
}
