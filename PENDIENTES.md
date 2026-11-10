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
- [ ] **2. Escenarios.** Solo hay maquetas de E1, mundo de la llave, mundo del cuaderno y espacio físico.
  Faltan: mundo del mate, cúpula, E3 (pasillo), E4, E5, E6, tótem, Oculus, esferas físicas.
  ¿Hay capturas o renders finales de Unreal? ¿Se pueden exportar recorridos de cámara (Sequencer)?
  - *Hoy:* maquetas con duotono donde existen; escenas ilustradas 2,5D en el resto. PLACEHOLDER.
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

- [x] **9. Audios nuevos (audios.zip, nov. 2026).** Recortados solo en sus silencios con
  `tools/recortar_audios.py` (originales intactos en `assets/audio/originales/`) e integrados con
  subtítulos rehechos sobre las versiones recortadas. Sin transcripción: cada frase se asignó por
  duración y pausas. Quedan las dudas del punto 25.

  | Archivo | En la web | Frase |
  |---|---|---|
  | `etapa-1` | `e1-voz` · E1 | "Entraste a la etapa de la plasticidad sináptica… reorganizar las conexiones." |
  | `etapa-2` | `e2-voz` · E2 cúpula | "Cuando el significado de ese objeto… fue testigo." |
  | `Mundo-de-la-llave-1` | `llave-voz-1` · llave, puerta 1 | "Llegó el día, por fin me voy a mudar." (a confirmar, #25) |
  | `Mundo de la llave 2` | `llave-voz-2` · llave, regalos | "Te voy a extrañar, hijo." (a confirmar, #25) |
  | `Mundo de la llave 3` | `llave-voz-3` · llave, cerradura | "¡Sí! Acá están." (a confirmar, #25) |
  | `Mate tomado 1` a `3` | `mate-tomado-1..3` · ronda | los tres mates tomados de la ronda, con el agua que baja |
  | `Mate-tomado-4` | `mate-tomado-4` · la mañana | "Gracias amor" + mate tomado (a confirmar, #25) |
  | `Ruido-de-mate-cebandose` | `mate-cebandose` · ronda y mañana | el mate cebándose |
  | `Etapa-3-Parte-1` / `2` | `e3-voz-1` / `e3-voz-2` · E3 | consigna del pasillo (tiempos de la parte 2 aproximados, #25) |
  | `Etapa-4-Parte-1` / `2` | `e4-voz-1` / `e4-voz-2` · E4 | destello / último mundo |
  | `Etapa 5` | `e5-voz` · E5 | "Ahora que tanto pensaste tu objeto…" |
  | `Etapa 6` | `e6-voz` · E6 | "Encontraste el significado… en busca de tu objeto." (antes escrita) |
  | `Cierre` | `cierre-voz` · video final | "Esto fue Memoria Material… otro significado." (antes escrita) |

  Sigue escrita, sin audio: la voz del video de bienvenida.
- [ ] **21. Regrabar dos audios para que coincidan con sus subtítulos.** No puedo escuchar los audios
  nuevos: **¿`etapa-1` y `Etapa-3-Parte-2` ya dicen "para continuar con la experiencia" y "vas a poder
  seguir recorriendo la experiencia"?** Si siguen diciendo "para avanzar" / "siguiente etapa", hay que
  regrabarlos con el texto de esta tabla:

  | Audio | Subtítulo (texto a grabar) |
  |---|---|
  | E1 | "Para continuar con la experiencia, vas a tener que reorganizar las conexiones." |
  | E3, parte 2 | "…para continuar con la experiencia vas a tener que depositar ese objeto en nuestro tótem." |
  | E3, parte 2 | "Una vez hecho esto, vas a poder seguir recorriendo la experiencia." |

- [ ] **10. Efectos de sonido.** Resueltos: los cuatro "mate tomado" y el mate cebándose. Siguen como
  onomatopeyas escritas: llaves, papel, chapoteo, pitido, obra, batido, portazo, ruido mecánico.
- [ ] **25. Dudas de los audios nuevos** (no se adivinó: se integraron así y hay que confirmar):
  1. **Voces del mundo de la llave.** Las duraciones no encajan con seguridad con el guion. Medido con
     un umbral sensible: voz 1 = tres tramos cortos (~0,6 s cada uno), voz 2 = un tramo de ~0,9 s,
     voz 3 = un tramo de ~1,2 s. Se asignó: 1 = "Llegó el día, por fin me voy a mudar", 2 = "Te voy a
     extrañar, hijo" y 3 = "¡Sí! Acá están". En la voz 2 no entran las tres frases de los cajones (como
     suponía la versión anterior) ni las dos de la despedida. **¿Qué dice cada una?** Las frases sin
     audio ("Te regalo esto…" y las de los cajones) siguen escritas.
  2. **Cuatro "mate tomado".** En la ronda del guion hay tres mates tomados; el cuarto está en la
     mañana ("Gracias amor" + mate tomado). Se ubicó así: 1 a 3 en la ronda (cada uno baja el agua) y
     4 en la mañana. **¿Va ahí, o la ronda tiene que tener cuatro mates?**
  3. **Mate cebándose.** El guion lo nombra en la ronda y en la mañana; se usa el mismo sonido en las dos.
  4. **`Etapa-4-Parte-1` termina con voz justo en el último instante:** puede estar cortado al final.
  5. **`Etapa-3-Parte-2` va más rápido de lo esperado para su texto:** los tiempos de sus subtítulos son
     aproximados. Si la grabación usa otras palabras, pasame el texto exacto.

## Correcciones (correcciones/CORRECCIONES.md) que esperan material

- [ ] **26. C-05 · Subtítulos literales.** La regla nueva es que cada subtítulo diga exactamente lo que
  dice su audio (reemplaza la de sacar el lenguaje de videojuego). El **Anexo A** de CORRECCIONES.md
  llegó vacío, así que no se cambió ningún subtítulo: siguen los actuales. Cuando esté la transcripción
  textual de cada audio, se reemplazan uno por uno (esto también resuelve #21 y #25).
- [ ] **27. C-06 · Favicon con el logo reducido.** El archivo `referencias/logo-reducido` (SVG o PNG) no
  vino en la carpeta de correcciones. Sigue el favicon actual; cuando esté el archivo, se generan los
  tamaños (16, 32, 180, 192 y 512 px, más el SVG).
- [ ] **28. C-19 · Audio de "¡Sí! Acá están."** No hay ningún audio con esa frase entre los que llegaron
  (el que estaba como "Voz 3" dice "Te regalo esto, espero que te guste" y ahora suena en los regalos).
  Al abrir la cerradura la frase queda solo como texto. Cuando se grabe, va en `data-found` (Etapa 2).

## Contenido

- [ ] **11.** Puerta de E3: ¿cuáles son los 3 íconos y cuál es el correcto? ¿Qué muestra el holograma?
  - *Hoy:* íconos provisorios (llave, ojo, cerebro). PLACEHOLDER.
- [ ] **12.** ¿Qué "nombre" lleva cada esfera física del cierre (rosa, amarilla, celeste)?
  - *Hoy:* nombres de ejemplo. PENDIENTE.
- [ ] **13.** Cierre: cómo nació el proyecto, el objeto de partida (foto), integrantes, materia, cátedra y año.
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

- [ ] **24.** Al final, al devolver los objetos, el equipo conversa con cada participante. En el guion hay una sola
  pregunta, que se usa tal cual: *"¿Y ahora, habiendo experimentado nuestro recorrido, te gustaría contarnos por qué
  elegiste este objeto?"*. Se proponen cinco más (marcadas PENDIENTE en la web). Confirmar, cambiar o sacar:
  1. ¿Qué objeto te vino a la mente cuando la voz te pidió elegir uno? ¿Por qué ese?
  2. ¿Qué sentiste cuando fuiste al tótem y tu objeto ya no estaba?
  3. ¿En qué momento del recorrido te sentiste más cerca de tu propia historia?
  4. ¿Qué sentiste al recibir tu objeto adentro de la esfera?
  5. ¿Cambió en algo tu mirada sobre las cosas de todos los días? ¿Hay otro objeto que ahora mirarías distinto?

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

- [ ] **GitHub Pages.** El repo es **privado** y Pages no está activado. Opciones:
  1. Hacer el repo público → Settings → Pages → *Deploy from a branch* → rama
     `claude/interactive-web-experience-plan-r34fzm` (o `main` cuando se mergee) → carpeta `/docs` → Save.
  2. Mantenerlo privado: requiere que la organización tenga un plan pago (GitHub Team/Enterprise).

  Queda en `https://memoriamaterial.github.io/memoriamaterial-web/`.
