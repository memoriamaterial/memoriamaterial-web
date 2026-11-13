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
  // La idea: un medio círculo flotando
  idea: [f('half', C.a, [86, 18, 6], { r: 0, d: 19 })],
  // Bienvenida: una S flotando
  bienvenida: [f('s', C.c, [8, 76, 7], { r: 10, d: 18 })],
  // Etapa 1: arcos concéntricos (la cúpula) en amarillo
  e1: [a(C.a, [86, 96, 70]), f('half', C.f, [6, 20, 5], { r: 0, d: 16 }), f('half', C.c, [90, 14, 4], { r: 0, d: 20 })],
  // (sin tramas en rectángulo: el aula y las etapas 2, 3 y 4 quedan sin fondo propio)
  // Etapa 5: formas que caen muy despacio, como objetos repetidos
  e5: [f('s', C.a, [12, 10, 6], { r: 20, d: 24, fall: true }), f('half', C.a, [44, 0, 5], { r: -10, d: 28, fall: true }), f('s', C.f, [74, 6, 5], { r: -25, d: 26, fall: true }), f('half', C.c, [90, 30, 4], { r: 40, d: 30, fall: true })],
  // Etapa 6: arcos que se abren como un radar, en celeste
  e6: [a(C.c, [12, 92, 60], { radar: true })],
  // Cierre: una S flotando
  cierre: [f('s', C.f, [84, 14, 6], { r: -8, d: 20 })],
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
