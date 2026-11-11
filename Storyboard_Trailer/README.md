# Memoria Material · Storyboard interactivo del tráiler

Abrí `index.html` con doble clic. No necesita servidor, instalación ni internet
(GSAP y las fuentes están en `assets/`). Para mandarlo, comprimí la carpeta
`Storyboard_Trailer` entera en un .zip, o subila tal cual a GitHub Pages o Netlify.

## Editar textos
Todo el contenido (voz en off, planos, notas de imagen y sonido, créditos)
está en **`contenido.js`**. Editás, guardás y recargás. No hace falta tocar el código.

## Reemplazar imágenes
Poné cada archivo en `assets/img/` con **este nombre exacto**. Si falta, la web
muestra un placeholder con el nombre que corresponde. Formato 16:9 (ej. 1920×1080).

| Archivo | Escena · plano | Qué tiene que mostrar | Estado |
|---|---|---|---|
| `escena1_plano1.jpg` | E1 · P01 | Foto: manojo de llaves / mano en la cerradura | falta |
| `escena1_plano2.jpg` | E1 · P02 | Foto: mate pasando de mano en mano | falta |
| `escena1_plano3.jpg` | E1 · P03 | Foto: cuaderno con apuntes, hoja que pasa | falta |
| `escena2_plano1.jpg` | E2 · P04 | Llave en escala/perspectiva cambiada | falta |
| `escena2_plano2.jpg` | E2 · P05 | Mate y cuaderno en perspectiva forzada | falta |
| `escena3_plano1.jpg` | E3 · P07 | Unreal: mundo de la llave (mudanza) | provisoria (captura Etapa2-llave) |
| `escena3_plano2.jpg` | E3 · P08 | Unreal: mundo del mate (ronda de sillas) | falta |
| `escena3_plano3.jpg` | E3 · P09 | Unreal: mundo del cuaderno (hojas flotantes) | provisoria (captura Etapa2-cuaderno) |
| `escena4_plano1.jpg` | E4 · P10 | Unreal: objetos gigantes en la arena | provisoria (captura Etapa 1) |
| `escena4_plano2.jpg` | E4 · P11 | Detalle oculto del objeto (también llena la lupa grande) | falta |
| `escena4_plano3.jpg` | E4 · P12 | Formas gráficas reorganizándose (frame de motion) | falta |
| `escena5_plano1.jpg` | E5 · P13 | El mate desaparece, queda la silueta | falta |
| `escena5_plano2.jpg` | E5 · P14 | Escenarios alterados (sillas vacías, puertas cerradas) | falta |
| `escena6_plano1.jpg` | E6 · P15 | Imágenes de búsqueda | falta |
| `escena6_plano2.jpg` | E6 · P16 | Conexiones de color entre objetos y esferas | falta |

P06, P17 y P18 son planos gráficos (texto y logo) y no llevan imagen.
Si querés usar .png u otro nombre, cambiá la ruta `imagen` en `contenido.js`.

## Estructura
- `index.html`: esqueleto de la página
- `contenido.js`: **todo el contenido editable**
- `css/styles.css`: estilos (paleta y tipografías de la identidad)
- `css/tramas.css`: tramas de la marca embebidas (generadas desde `assets/tramas/*.png`)
- `js/main.js`: armado de la página y animaciones (GSAP + ScrollTrigger)
- `js/logo.js`: el logo original en línea, para animar sus fragmentos
