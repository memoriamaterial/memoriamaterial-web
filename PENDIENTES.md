# Pendientes

Todo lo que falta o quedó resuelto de forma provisoria. En la web, lo provisorio lleva una
etiqueta **PLACEHOLDER** (visual) o **PENDIENTE** (texto). Marcá cada punto cuando lo completes.

Para reemplazar archivos, dejalos en `Experiencia_MemoriaMaterial_Web/assets/` y avisame:
yo los optimizo y los copio a `docs/assets/`.

---

## Bloqueantes para que los escenarios "se vean bien"

- [ ] **1. Fotos del tratamiento fotográfico.** `TratamientoGrafico.svg` enlaza fotos a un disco local
  (`D:\ARCHIVOS SEGUROS\...\Links\`): `pexels-masi-461420600-18156364.jpg`, `pexels-shojol-27742953.jpg`,
  `afiche3.jpg` y dos `WhatsApp Image 2026-09-27 ...`. Faltan esas fotos y fotos de los objetos reales
  (llaves, mate, cuaderno) y de escenas cotidianas.
  - *Hoy:* escenas ilustradas en duotono violeta con el objeto resaltado (Bienvenida). PLACEHOLDER.
- [ ] **2. Escenarios.** Llegaron 10 fotos de Unreal (`assets/escenarios/`, originales intactos, renombrados con la etapa: `e1-desierto.png`, `e2-mundo-llave-1-cajas.png`…) y ya
  están en la web, en WebP y sin filtros (`docs/assets/img/escenarios/`):
  E1 (ficha y escena interactiva), E2 (ficha), mundo de la llave (los cuatro tramos), mundo del mate
  (charco → ronda, y la mañana) y E3 (ficha y pasillo). A la del mate (estadio 1) se le recortó el borde de
  abajo para sacar la marca "Activar Windows". La de la E1 conserva las herramientas del editor (flechas y
  líneas rojas), como se pidió.
  **Siguen sin foto:** mundo del cuaderno (usa la maqueta vieja), E4 (réplica invertida, las tres
  ausencias, el humo), E5 (el pasillo de objetos), E6 (el detector), el aula (tótem, holograma), la foto del
  objeto de partida del cierre y las tres fotos del video de bienvenida.
  Decisiones al reemplazar (confirmadas): en el mate ya no baja el agua ni se iluminan las sillas que hablan
  (la foto pasa del charco a la ronda al sentarse); en la mañana ya no se abren las ventanas ni aclara el
  cielo. La llave, al llegar a la cerradura, sale del cajón y queda al lado de la foto (también en
  escritorio), porque con la foto grande la mesita y la cerradura no entran juntas en pantalla.
  El texto del escenario de la ficha de la E3 sigue el guion ("una puerta de arco al fondo… un pulso de
  luz"); la foto todavía no muestra esa puerta ni el pulso.
- [ ] **3. Videos** (bienvenida, introducción a E5, final). No hay ninguno.
  - *Hoy:* secuencias de texto animado con el guion.

## Inconsistencias del material

- [ ] **4.** `claude.md` menciona `brief/fotografia.md`, pero ese archivo no existe.
- [ ] **5.** `recursos graficos.svg` es idéntico a `tramas.svg`. Parecen faltar los recursos gráficos
  (las formas que vuelan en el cielo de E1).
  - *Hoy:* formas armadas con los semicírculos de las tramas y el logo.
- [x] **6. Logo:** decía "LO HABITUALL" (doble L). Corregido a "LO HABITUAL" en `assets/logo/logo.svg`
  y en la web (se quitó la L sobrante y se recentró la frase).
  **Lema principal:** "Dale una nueva mirada a tu cotidianidad".
- [x] **7. Colores:** tramas y tratamiento usaban `#EE569A`, `#ED4280`, `#40C5F0`, `#352A71`.
  Unificados a los hexadecimales exactos de `paleta.md`.
- [x] **8. Esfera celeste:** el guion decía que tiñe "de rosa". Corregido: tiñe de celeste.

## Audio

- [x] **9, 10, 21 y 25. Audios de la ronda anterior.** Reemplazados por los sonidos nuevos (punto 29).
  Los archivos viejos (sueltos, `audios.zip`, `originales/` y `viejos/`) se borraron: en
  `assets/audio` quedan solo `Voces` y `Sonidos Extras`.
- [ ] **29. Sonidos nuevos (nov. 2026: `assets/audio/Voces` y `Sonidos Extras`).** Integrados con
  `tools/sonidos_nuevos.py`: voces recortadas solo al principio y al final (todas tienen los dos canales
  parejos) y efectos tomados en fragmentos, más bajos que las voces (y se bajan más mientras habla una voz).
  Quedan estas dudas:
  1. ~~Esfera de la llave (E1)~~ **resuelto:** llegó el archivo corregido ("¿Cómo te fue? ¿Ya comiste?",
     suena después de las llaves abriendo la puerta).
  2. **Voces de los diálogos que todavía no están grabadas** (quedan solo como texto):
     - Reunión del mate: Voz 1 ("Bueno che, al final llegamos…"), Voz 2 ("Y el último mate también…",
       "Dejá, yo no les quiero ver más la cara…") y Voz 4 ("Sí, loco, hay que hacer algo").
     - La mañana del mate: Voz 1 (la mamá: "Buen día hijo…", "Obvio amor, tomá", "Que tengas un lindo
       día") y Voz 3 (el hijo: "Buen día").
     - Cuaderno de materiales: Voz 1 ("Va a quedar genial…", "Va a tardar…", "Bueno, primero hay que
       elegir el modelo del piso…", "Y los zócalos…").
     - Cuaderno de recetas: Voz 1, la abuela (las cuatro frases).
  3. **Hoja arrancada (esfera celeste de la E1):** sin sonido todavía; suena solo la voz.
  4. **Fragmentos de efectos elegidos sin escucharlos** (por los tramos con sonido de cada archivo):
     sorbos de mate, páginas, escritura y llaves. Si alguno no es el momento justo, se cambia el inicio en
     `tools/sonidos_nuevos.py`. El mate cebándose (`Mate_Cebandose`) y la pava hirviendo
     (`Ruido_Pava_Hirviendo`) se usan enteros.
  10. **La mañana del mate:** primero suenan los pájaros (`Pajaros`) y, cuando se prende la hornalla, la
     pava hirviendo (`Ruido_Pava_Hirviendo`). Los dos se apagan con un fundido al salir de la escena.
  11. **"¡Sí! Acá están."** suena (y aparece) al abrir el segundo cajón, donde está la llave; al abrir la
     puerta suenan solo las llaves.
  12. **Voz del eco (E4, partes 2.1 a 2.4):** una voz por frase de la escena, cada una cuando aparece su
     frase (la 2.4 se cortó en su pausa: "Sabemos…, y vos sabés…" / "Te invitamos…"). Con reverberancia
     hecha con ffmpeg (ecos múltiples que se apagan, `REVERB` en `tools/sonidos_nuevos.py`); si se quiere
     más o menos reverberación, se ajusta ahí.

## Versión 2 (rama `claude/version-2`): material que falta

- [ ] **30. Material del paquete `Subidas.rar`.** Llegaron el análisis de WHY, 4 capturas (solo el Home de
  WHY: portada, presentación, manifiesto y botón), 3 tramas y 4 elementos gráficos. **No llegaron:**
  capturas de las páginas de Bienvenida y de Fases de WHY (la plantilla por etapa se toma del análisis
  escrito), screens nuevos de escenarios ni videos de mecánica.
- [ ] **31. Escenarios sin screen.** En la versión 2 van con un recuadro "Screen pendiente" y la animación de la
  mecánica dibujada encima: Etapa 4 (destello, la primera etapa invertida con siluetas, el tótem con humo),
  Etapa 5 (pasillo entre pilas de objetos hasta los Oculus) y Etapa 6 (detector en wireframe, tres esferas y
  el tótem). El mundo del cuaderno usa la maqueta anterior, marcada "foto pendiente". Cuando lleguen los
  screens (o videos de la mecánica), reemplazan esos recuadros.
- [ ] **34. Sonidos de fondo sin archivo (versión 2).** Marcados "pendiente" en su pop-up: el pitido de la
  Etapa 4, los sonidos que guían hasta las esferas y el ruido mecánico del tótem de la Etapa 6.
- [ ] **32. Subtítulo con lenguaje de juego.** La voz de la Etapa 1 dice "Para avanzar vas a tener que
  reorganizar las conexiones" (es la frase del guion). Como el subtítulo tiene que decir exactamente lo que
  dice el audio, queda así; para sacar "avanzar" habría que regrabar esa frase.
- [ ] **33. Favicon con el logo reducido.** Sigue el favicon anterior: el archivo del logo reducido no llegó
  (ver #27).
- [x] **35. Frase de contexto del cierre.** Reemplazada por el final de la versión 1 (frase, de dónde salió la
  experiencia y la devolución con la pregunta).
- [ ] **36. "aula" que queda a propósito.** La voz del mundo del mate dice "…en marzo en el aula" (habla de un
  aula de la escuela): el subtítulo y el texto de "Leer" la conservan porque tienen que decir lo que dice el
  audio. En todo lo demás, "aula" pasó a "espacio físico".
- [ ] **38. Mundos y Etapa 5 como en la versión 1.** Se recorren con el scroll (de puerta en puerta en la llave,
  línea por línea en el mate y en el cuaderno, el pasillo de objetos en la E5) y cada audio suena en su lugar.
  Lo que en la v1 era juego (arrastrar la llave, abrir los cajones, "Sentate en la silla de color") ahora
  sucede solo al avanzar, y se sacaron sus instrucciones. Revisar si se quiere recuperar algo de eso.
- [ ] **39. Voz de la bienvenida.** "Antes de empezar" quedó como la captura de referencia (sin el pop-up de la
  voz). La voz del video de bienvenida pasó a la ficha del Proyector, que es donde se proyecta ese video.
- [ ] **40. Elementos gráficos con papel en la historia.** Las tres ondas (una por objeto) se conectan en la E1,
  se pierden en la E4 y se juntan en la E6; la curva sube como la cúpula (E2 y cada vuelta a la cúpula); la
  banda con dientes es la llave que avanza puerta por puerta; la banda con muesca se cierra como el pasillo
  (E3); en el cierre se reencuentran las tres bandas. Revisar si se quiere sumar alguno en el mate y el cuaderno.
- [ ] **41. Títulos que quedan de la v1.** "Llegó el día" (mundo de la llave) y "El pasillo de objetos" (E5)
  vienen de la versión 1 y no de un material entregado: confirmar si van.
- [ ] **42. Explicaciones antes de cada etapa (para revisar).** Las de los mundos y la de la Etapa 4 son las que
  pasaste. Las otras las escribí con lo que ya dice la web; revisalas:
  - Etapa 1: "Los asistentes entran a Unreal, a un desierto con una llave, un mate y un cuaderno gigantes, y
    conectan cada esfera que flota con el objeto al que pertenece."
  - Etapa 2: "Los asistentes entran en cada objeto, uno por uno, y recorren lo que ese objeto vio, escuchó y vivió."
  - Etapa 3: "Los asistentes recorren un pasillo, piensan en un objeto que llevan encima, salen de Unreal y lo
    dejan en el tótem."
  - Etapa 5: "Los asistentes vuelven a su estación y recorren un pasillo lleno de los objetos que parecían
    perdidos, hasta encontrar los Oculus."
  - Etapa 6: "Los asistentes se ponen los Oculus, buscan tres esferas que brillan entre los objetos y las
    depositan en un tótem."
  - Cierre: "Los asistentes vuelven al tótem, reciben su objeto dentro de una esfera y ven el video final en el
    proyector."
- [ ] **43. Cierre · por qué la experiencia es así y de dónde salió.** El recuadro está vacío para completar
  (en el HTML, `.origen__txt` con `data-pendiente`), con su foto pendiente al lado.
- [ ] **44. Textos que vuelven de la versión 1.** Vuelven como estaban: "Los mundos de la ausencia" (y la
  descripción de cada uno), "Donde estaban los objetos, ahora solo hay humo", "De vuelta a la estación" y sus
  tres pasos, y en el cierre "En lo cotidiano hay cosas que pueden cobrar otro significado." y "Al devolver los
  objetos, conversamos".
- [x] **37. Audio.** Las voces suenan solo con play, desde el reproductor fijo al pie de cada etapa o mundo;
  los subtítulos aparecen solo con el botón «Subtítulos». El primer gesto en la página activa el ruido blanco.
## Correcciones (correcciones/CORRECCIONES.md) que esperan material

- [x] **26. C-05 · Subtítulos literales.** Reemplazado por el punto 29.6 (subtítulos de las voces nuevas).
- [ ] **27. C-06 · Favicon con el logo reducido.** El archivo `referencias/logo-reducido` (SVG o PNG) no
  vino en la carpeta de correcciones. Sigue el favicon actual; cuando esté el archivo, se generan los
  tamaños (16, 32, 180, 192 y 512 px, más el SVG).
- [x] **28. C-19 · Audio de "¡Sí! Acá están."** Llegó con los sonidos nuevos (Voz 7 de la llave).

## Contenido

- [ ] **11.** Puerta de E3: ¿cuáles son los 3 íconos y cuál es el correcto? ¿Qué muestra el holograma?
  - *Hoy:* íconos provisorios (llave, ojo, cerebro). PLACEHOLDER.
- [ ] **12.** ¿Qué "nombre" lleva cada esfera física del cierre (rosa, amarilla, celeste)?
  - *Hoy:* nombres de ejemplo. PENDIENTE.
- [ ] **13.** Cierre: cómo nació el proyecto y el objeto de partida (foto). (Integrantes, materia, cátedra y año ya no van: C-28.)
  - *Hoy:* textos de ejemplo. PENDIENTE.
- [x] **14.** Las interacciones nunca bloquean el recorrido. Confirmado, con **una excepción**: la cerradura
  gigante del mundo de la llave, donde el scroll se detiene hasta que la llave entra en la cerradura.

## Interpretaciones hechas al maquetar (revisar)

- [ ] **15.** Mundo del mate, escenario 2: el guion dice "una hornalla y encima una *paja* vieja".
  Se interpretó como **pava vieja**.
- [ ] **16.** Holograma y puerta de E3: se usó un **ancla** como ícono correcto (por las "anclas de
  seguridad" de E4), con ojo y cerebro como opciones incorrectas. Ver punto 11.
- [ ] **17.** Diálogos sin número de voz en el guion (mundo de la llave) aparecen como "Voz".
  En el mate y el cuaderno se respetó Voz 1, 2, 3, 4 y "abu".
- [ ] **19.** Cerradura obligatoria: el scroll (rueda, dedo, teclado y barra de desplazamiento) se detiene,
  pero los **saltos desde el riel o el menú de etapas** sí pasan, porque son navegación y no scroll
  (útil para mostrar una etapa puntual en la presentación). Si preferís que también se frenen, avisame.
- [ ] **18.** El video de introducción a E5 y el video final se resolvieron como secuencias de
  texto, igual que el de bienvenida (punto 3).

## Secuencia del holograma (E3) — decisiones a confirmar

- [ ] **22.** El guion describe el holograma en una sola frase. Para contar la secuencia completa se decidió:
  1. **Qué lo enciende:** el tótem detecta que se depositó el objeto (un sensor) y enciende el holograma solo.
     Alternativa: lo enciende alguien del equipo a mano.
  2. **Qué muestra:** un ancla, por las "anclas de seguridad" de la Etapa 4 (ver #11 y #16).
  3. **Cuánto dura:** queda encendido hasta que la puerta de Unreal se abre, para poder volver a mirarlo.
  4. **Mientras tanto, en Unreal:** la experiencia queda en pausa al final del pasillo.
  5. **Si se elige el ícono equivocado:** la puerta no se abre y se puede volver a elegir.
  6. **Tres participantes a la vez:** el mismo tótem recibe los tres objetos y el holograma muestra el mismo ícono.
  7. **Tipo de holograma** (pirámide, ventilador LED, pantalla): sin definir.

## El regreso a Unreal (E5) — decisión a confirmar

- [ ] **23.** El guion solo dice "Vuelve al Unreal". Se decidió: **lo dispara el final del video del proyector**;
  las luces LED se encienden del tótem hacia las estaciones y cada participante vuelve a sentarse.
  Por C-24 se sacó lo de la pantalla en negro y el fundido (no está en el guion): ahora solo dice que vuelve
  a Unreal. En la web, ese tramo muestra "Espacio físico → Unreal" en el indicador.

## Preguntas de la devolución (Cierre)

- [x] **24.** Resuelto por C-27: la parte final termina solo con la pregunta del guion, *"¿Y ahora, habiendo
  experimentado nuestro recorrido, te gustaría contarnos por qué elegiste este objeto?"*. Se sacaron las cinco
  preguntas propuestas.

## Dónde está la persona (indicador "Estás en")

| Bloque | Etiqueta | Por qué (guion) |
|---|---|---|
| Entrada y lema | — (oculta) | Es la presentación de la web, no un momento de la experiencia |
| Video de bienvenida | Espacio físico | Se proyecta en el aula |
| El espacio físico | Espacio físico | El aula, las estaciones y el tótem |
| E1 · Plasticidad sináptica | Unreal | Se inicia la experiencia en Unreal en cada estación |
| E2 · El mundo de los objetos | Unreal | Cúpula y los tres mundos |
| E3 · El pasillo | Unreal | Recorrido del pasillo |
| E3 · Depositar el objeto en el tótem | Espacio físico | "Saliendo momentáneamente del entorno de Unreal" |
| E3 · La puerta con tres íconos | Unreal + espacio físico | Se elige en Unreal el ícono que proyectó el holograma del aula |
| E4 · Destello, desierto invertido, mundos, preguntas | Unreal | Réplica de E1 y mundos de ausencia |
| E4 · El tótem con humo | Espacio físico | "Saliendo nuevamente de Unreal por un momento" |
| E4 · Video antes de la Etapa 5 | Espacio físico | Se proyecta en el aula |
| E5 · El regreso a Unreal | Espacio físico → Unreal | Termina el video, vuelve a la estación y se enciende la pantalla (#23) |
| E5 · Obsesión con la pérdida | Unreal | "Vuelve al Unreal" hasta llegar a los Oculus |
| E6 · Búsqueda del significado | Oculus | "Con los Oculus puestos" |
| Cierre (esferas, video final, pregunta) | Espacio físico | Tótem del aula, proyector y devolución a los profesores |

- [ ] **20.** Casos ambiguos, decididos así (revisar):
  - **E3, la puerta:** "Unreal + espacio físico", porque la clave está en el holograma del aula y se elige en Unreal.
  - **E5, el final:** queda "Unreal" aunque termina al llegar a los Oculus; el cambio a "Oculus" se marca en E6.
  - **E6, el final:** queda "Oculus" aunque en el aula se encienden las luces hacia el tótem; el paso al
    espacio físico se marca en el Cierre, cuando la voz indica quitarse el detector.

## Publicación

- [ ] **GitHub Pages con la versión 2.** El repo es público y Pages está activado. Para publicar la versión 2
  sin perder la 1: Settings → Pages → *Build and deployment* → *Deploy from a branch* → rama
  `claude/version-2`, carpeta `/docs` → Save.
  - Versión 2: `https://memoriamaterial.github.io/memoriamaterial-web/`
  - Versión 1 (de respaldo): `https://memoriamaterial.github.io/memoriamaterial-web/v1.html`
  - La rama `claude/interactive-web-experience-plan-r34fzm` queda intacta como copia de la versión 1;
    para volver a publicarla, se elige esa rama en el mismo lugar.
