# Plan — Memoria Material, experiencia web

Plan aprobado para la web interactiva que cuenta la experiencia **Memoria Material**.
Lo que falta o quedó como placeholder está en [PENDIENTES.md](PENDIENTES.md).

---

## 1. Cómo entendemos la experiencia

**Memoria Material** es una experiencia física y digital (aula a oscuras + Unreal + tótem físico + Oculus) que propone darle una segunda mirada a tres objetos cotidianos: **llaves, mate y cuaderno**. El recorrido sigue un arco emocional:

**darle valor → entender el significado → desprenderse → perderlo → buscarlo → reencontrarlo**

La web no reemplaza la experiencia: **la cuenta**. El visitante vive una versión resumida, con una interacción clave por escenario, y siempre entiende qué pasaba en el aula y qué en Unreal.

**Identidad.** Fondo violeta profundo y texto crema. Los tres acentos tienen un significado fijo:

| Color | Objeto | Dónde manda |
|---|---|---|
| `#FCB614` amarillo | Llave | Esfera, mundo de la llave |
| `#ED4380` fucsia | Mate | Esfera, mundo del mate |
| `#3CC5F2` celeste | Cuaderno | Esfera, mundo del cuaderno |

Tipografía: **Space Grotesk Bold** para títulos (la de los afiches) e **IBM Plex Mono** para etiquetas, anotaciones y textos tipo "oculto". El logo, con letras cortadas y mitades de color, ya es una "otra mirada": se anima separando y uniendo esas mitades.

## 2. Estructura, escenario por escenario

Una sola página con scroll. Una **línea de luz** la recorre entera (conexión sináptica + luces LED del aula + pulso del pasillo). Un riel fijo con las etapas permite saltar entre ellas.

| # | Escenario | Qué se ve y qué se hace | Recursos | Pantallas |
|---|---|---|---|---|
| 0 | **Entrada** | El logo se arma uniendo sus mitades. Promesa *"¿Estás dispuesto a buscar en lo que te resulta habitual?"* y dos botones: entrar con sonido o sin sonido. | Animación, grilla | 1 |
| 1 | **Bienvenida** | Escenas cotidianas con el objeto resaltado en color (tratamiento fotográfico). El guion del video de bienvenida como texto animado. | Fotos, texto revelado | 2 |
| 2 | **El espacio físico** | Maqueta del aula con puntos que abren pop-ups: proyector, estaciones, tótem, camino de luces, holograma, Oculus. | Pop-ups, imagen | 1 |
| 3 | **E1 · Plasticidad sináptica** | Desierto con pliegues; formas de la marca con eco en el cielo. Tocás una esfera apagada → se ilumina, tiñe la pantalla y muestra su frase. La conectás con su objeto. La plataforma se eleva, aparece la Cúpula del Reencuadre y el scroll entra por la puerta. | Audio, interacción, scroll | 3 |
| 4 | **E2 · El mundo de los objetos** | Cúpula (un objeto en color, dos en blanco y negro). **Llave:** 4 marcos de puerta, cajas, regalos, 3 cajones, cerradura gigante. **Mate:** charco con sillas que se acomodan en ronda; el agua baja con cada mate; después la mañana con ventanas y portazo. **Cuaderno:** hojas que se ordenan, anotaciones que se escriben solas, fondo crema en recetas, horno. Corte breve en la cúpula entre mundo y mundo. | Scroll horizontal, interacciones, audio | 8 |
| 5 | **E3 · Una extensión del yo** | Pasillo en perspectiva con pulso de luz. Pausa *"¿Lo tenés?"* + botón. Pop-up del tótem físico. Puerta con 3 íconos. | Audio, 3D, pop-up, interacción | 2 |
| 6 | **E4 · Objetos perdidos** | Destello crema, aberración cromática y glitch. Réplica de E1 con paleta invertida: siluetas y sombras. Esferas que cuentan pérdidas. Tríptico de mundos de ausencia. Tótem vacío con humo + texto del video de E5. | Audio con reverb, glitch, interacción | 4 |
| 7 | **E5 · Obsesión con la pérdida** | Pasillo entre pilas de objetos repetidos. La cámara avanza hasta los Oculus. | Audio, scroll | 1–2 |
| 8 | **E6 · Búsqueda del significado** | Modo wireframe con lecturas de detector. El cursor/dedo revela esferas; juntás 3, emerge el tótem, depositás las esferas. | Interacción, animación | 2 |
| 9 | **Cierre** | Esferas físicas, texto del video final, frase de cierre, cómo nació el proyecto, pregunta final, créditos, volver a empezar. | Fotos, texto | 2 |

**Las interacciones nunca bloquean el scroll**: si alguien sigue de largo, la escena se completa sola.

## 3. Voces

**Con audio real (9 archivos):** E1 · E2 (cúpula) · mundo de la llave (voz 2 y voz 3) · E3 (voz 1 y 2) · E4 (voz 1 y 2, con reverb) · E5. Cada una suena al entrar al escenario, con subtítulos sincronizados y botón de play/pausa.

**Escritas:** video de bienvenida · frases de las esferas de E1 (con onomatopeya) · frases sin audio del mundo de la llave · diálogos del mate (burbujas desde cada silla) · diálogos del cuaderno (anotaciones manuscritas) · esferas de pérdida de E4 · video de introducción a E5 · voz de E6 · video final · pregunta final.

Narración en Space Grotesk; personajes en Plex Mono con el color de su objeto.

## 4. Identidad aplicada

- **Paleta:** solo los 5 colores exactos de `paleta.md`. La inversión de E4 y el cuaderno de recetas se resuelven cambiando fondo y texto (crema/violeta), sin filtro de inversión. El "blanco" del destello es crema. El "naranja" (amanecer, horno) es un degradé amarillo → fucsia. El blanco y negro es duotono violeta. Los acentos van en gráficos y títulos grandes, nunca en texto corrido.
- **Tramas:** reconstruidas como patrones SVG livianos (la "S" de dos semicírculos). Se usan como telón de transición entre etapas, textura en esferas y objetos, y formas del cielo con eco. Una por etapa.
- **Motion:** eco, glow, grilla animada (también pliegue cerebral y wireframe), textos revelados palabra por palabra con desenfoque y decodificado en mono, cambios de perspectiva. Ritmo rápido al principio (0,4 s) y lento al final (1,2–1,6 s). Con "reducir movimiento": fundidos simples, sin glitch ni destello.
- **Tratamiento fotográfico:** objeto recortado en fragmentos rectangulares con bloques de color encima, resto en duotono violeta, halos desenfocados y palabra repetida en mono ("oculto").

## 5. Stack y publicación

- HTML + CSS + JS sin compilación. GSAP 3.13 (ScrollTrigger, SplitText, DrawSVG, ScrollTo, ScrambleText) guardado dentro del proyecto en `docs/js/vendor/`.
- Audio: administrador propio sobre Web Audio (sonido con el primer toque, voces en cola, subtítulos, ruido blanco generado en el navegador). Voces con volumen igualado.
- Escenarios: capas SVG/PNG con paralaje. Si se exportan recorridos de cámara desde Unreal (Sequencer), se puede scrubbear el video con el scroll.
- Estructura: `docs/index.html`, `docs/css/`, `docs/js/` (un módulo por escenario), `docs/assets/` con archivos optimizados. El material original queda intacto en `Experiencia_MemoriaMaterial_Web/`.
- Celular: todo funciona tocando, alto visible real (`dvh`), márgenes de muesca, carga por etapa.
- **GitHub Pages:** Settings → Pages → *Deploy from a branch* → rama + carpeta `/docs`. Rutas relativas. El repo tiene que ser público (o la organización tener un plan pago que permita Pages en repos privados).

## 6. Decisiones tomadas al aprobar el plan

- Se maqueta ya con el material disponible y se corrige sobre lo funcionando.
- Faltantes visuales → placeholders con la identidad (escenas 2,5D, duotono violeta) marcados con la etiqueta **PLACEHOLDER**. Donde hay maqueta, se usa.
- Videos → secuencias de texto animado.
- Efectos de sonido → onomatopeyas en pantalla. Ruido blanco generado en el navegador.
- Audios → mejor suposición de qué frase va en cada uno (ver PENDIENTES.md).
- Colores → unificados a los hexadecimales exactos de `paleta.md`.
- Esfera celeste → tiñe de celeste.
- Logo → se deja como está por ahora.
- Lema → "Dale una nueva mirada a tu normalidad".
- Cierre y créditos → textos de ejemplo marcados como pendientes.
- Un commit por etapa.
