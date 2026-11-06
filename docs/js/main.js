// Memoria Material — punto de entrada
import { initUI, autoReveal } from './ui.js';
import * as inicio from './stages/inicio.js';
import * as e1 from './stages/e1.js';
import * as e2 from './stages/e2.js';
import * as e3 from './stages/e3.js';
import * as e4 from './stages/e4.js';
import * as e5e6 from './stages/e5e6.js';
import * as cierre from './stages/cierre.js';
// Cada escenario nuevo se suma acá, en orden de aparición.
const stages = [inicio, e1, e2, e3, e4, e5e6, cierre];

const { gsap, ScrollTrigger, SplitText, ScrollToPlugin, ScrambleTextPlugin, DrawSVGPlugin } = window;
gsap.registerPlugin(ScrollTrigger, SplitText, ScrollToPlugin, ScrambleTextPlugin, DrawSVGPlugin);
ScrollTrigger.config({ ignoreMobileResize: true });

const start = () => {
  // Primero los escenarios (crean los pins), después el riel y las voces.
  stages.forEach((s) => s.init());
  initUI();
  autoReveal();
  ScrollTrigger.refresh();
};

// Las animaciones de texto necesitan las tipografías cargadas para medir bien.
(document.fonts?.ready || Promise.resolve()).then(start);
