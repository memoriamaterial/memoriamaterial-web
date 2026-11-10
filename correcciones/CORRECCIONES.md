# Correcciones de la web · Memoria Material

Este documento tiene todas las correcciones que queremos hacer en la web.
Las imágenes de referencia están en la carpeta `referencias/` y cada corrección indica cuál mirar.

## Reglas para hacer las correcciones

- Hacé **solo** lo que pide cada punto. No cambies nada que no esté en esta lista.
- Seguí el orden del documento: primero los cambios generales y después la web de arriba hacia abajo.
- Hacé un commit por sección, con el número de los puntos en el mensaje (por ejemplo, `C-12 a C-15: Etapa 2`).
- Si un punto no se puede resolver con el material que hay (por ejemplo, falta un archivo), no lo inventes: anotalo en `PENDIENTES.md` y seguí con el siguiente.
- Al terminar, revisá cada punto con una captura de la web. Después actualizá la vista previa y pasame una tabla con cada punto (C-01, C-02…) y su estado: **hecho**, **pendiente** o **con duda**.

---

## A. Cambios generales (en toda la web)

**C-01 · No hay versión mobile.**
Eliminá todas las aclaraciones de texto pensadas para el celular: "con el dedo", "tocá", "tocala una vez", indicaciones de gestos táctiles, etc. Por ejemplo, el texto de la cerradura dice "Arrastrala con el mouse o con el dedo. También: tocala una vez, o Enter". Ahí hay que sacar lo que es para celular. Alcanza con borrar esos textos: no hace falta tocar el código responsive.

**C-02 · Tildes cortadas en los títulos.**
En toda la página, las tildes de los títulos grandes quedan cortadas: pasa con las mayúsculas acentuadas (Á, É, Í, Ó, Ú). Corregí el interlineado, el padding o el overflow para que se vean completas. Revisá todos los títulos, no solo uno.

**C-03 · Ruido blanco más sutil.**
El ruido blanco de fondo se escucha muy fuerte. Bajalo bastante, para que quede como un fondo apenas perceptible.

**C-04 · Los audios se escuchan por un solo auricular.**
Lo verificamos: todos los audios tienen sonido **solo en el canal izquierdo**, y el derecho está vacío. Hacé que se escuchen en los dos lados. Lo mejor es corregir los archivos: copiá el canal izquierdo a los dos canales con ffmpeg (por ejemplo, `-af "pan=stereo|c0=c0|c1=c0"`) en todos los audios que usa la web, incluidos los que ya recortaste. Revisá que no se pierda el recorte de silencios que ya está hecho.

**C-05 · Los subtítulos tienen que decir exactamente lo que dice cada audio.**
Hay audios cuyo subtítulo no coincide con lo que dice la voz. Transcribí tal cual lo que dice cada uno.
Importante: vos no podés escuchar los audios. Usá la transcripción que te pasamos en el **Anexo A**, al final de este documento. Si una fila del anexo está vacía, no inventes: dejá el subtítulo actual y anotalo en `PENDIENTES.md`.
Esto reemplaza la regla anterior de cambiar en los subtítulos lo que sonaba a videojuego: ahora el subtítulo tiene que ser literal.

**C-06 · Favicon.**
Reemplazá el favicon de la web por el **logo reducido**, que está en `referencias/logo-reducido` (SVG o PNG). Generá los tamaños necesarios.

---

## B. Entrada y lema

**C-07 · Formas de color del lema → elementos gráficos nuestros.**
Referencia: `referencias/01-lema-formas-de-color.png`
En la pantalla "DALE UNA NUEVA MIRADA A TU COTIDIANIDAD", las formas de color (los círculos fucsia y las píldoras celeste y amarilla al lado de cada palabra) no son nuestras. Reemplazalas por elementos gráficos de la marca, los que están en `assets` (tramas y recursos gráficos). Mantené los colores de la paleta y no cambies nada más de esa pantalla.

**C-08 · Eliminar la franja "El circuito".**
Referencia: `referencias/02-circuito-eliminar.png`
Eliminá completa la franja "El circuito", con los íconos Bienvenida · 01·02 · 03 · 04 · 05·06 · Cierre.

---

## C. Bienvenida y transición a Unreal

**C-09 · Mecánica de la Bienvenida.**
En la sección de Bienvenida, dejá solo el **punto 1 de la mecánica** y la parte de **Interacción**. Sacá los demás puntos, porque repiten lo mismo.

**C-10 · Texto de contexto entre el video de intro y la Etapa 1.**
Entre el video de introducción y el comienzo de la Etapa 1, agregá el texto de contexto que está en el guion, para que se entienda mejor el paso del video a Unreal:

> "Hoy vas a recorrer un circuito que recrea lo que pasaba en tu mente en ese momento, los procesos cognitivos que pasaban en ese instante en el que te diste cuenta del nuevo valor de ese elemento cotidiano."

---

## D. Todas las etapas

**C-11 · Sacar los bloques "Dónde", "Dispositivo" y "Qué hace".**
En **todas** las etapas, eliminá los bloques "Dónde", "Dispositivo" y "Qué hace", porque son repetitivos. Esa información tiene que quedar explicada dentro del texto de la **Mecánica** de cada etapa: revisá que la mecánica lo diga antes de borrar los bloques.

---

## E. Etapa 1

**C-12 · "Qué sucede", ítem 2: un renglón por esfera.**
En la Etapa 1, el ítem 2 de "Qué sucede" tiene que estar separado en tres renglones: uno para la esfera **amarilla**, uno para la **fucsia** y uno para la **celeste**.

**C-13 · Conexión fucsia y elevación de la cúpula.**
Referencia: `referencias/03-e1-conexiones-esferas.png`
En la interacción de conectar esferas con objetos:
- La línea fucsia (rosa) no llega al mate: corregila para que **toque el mate**, igual que las otras dos tocan la llave y el cuaderno.
- Cuando las **tres** esferas están conectadas, la **cúpula se eleva**.

**C-14 · Esferas en la Cúpula del Reencuadre.**
En la Cúpula del Reencuadre, las esferas están mal ubicadas. Tienen que estar en la **parte superior de la cúpula** y **equidistantes** entre sí.

---

## F. Etapa 2

**C-15 · Eliminar un texto incorrecto.**
Eliminá este texto completo, porque está mal: los objetos no están dentro de la cúpula.

> "Los tres objetos de la etapa anterior, otra vez gigantes, dentro de la cúpula. El que hay que recorrer primero aparece en color; los demás, en blanco y negro. Al salir de cada mundo se vuelve a la cúpula: el objeto recorrido pasa a blanco y negro y se colorea el siguiente."

**C-16 · Reorganizar "Qué sucede" de la Etapa 2.**
- En "Qué sucede" de la Etapa 2 tiene que quedar **solo la voz en off**.
- Cada mundo (llave, mate y cuaderno) tiene que estar mejor diferenciado y organizado, como un bloque propio.
- En cada mundo, la **explicación va antes** de la interacción de la web correspondiente: primero se explica el mundo y después aparece su interacción.

### Mundo de la llave

**C-17 · Texto en la parte de "Llegó el día".**
En la parte de "Llegó el día", cambiá "Seguí bajando" por **"Seguí scrolleando para recorrer el camino"**.

**C-18 · Cerradura gigante: la llave del cajón y el rectángulo blanco.**
Referencia: `referencias/04-llave-cerradura.png`
- La llave que se arrastra hasta la cerradura tiene que ser **la llave que está en el cajón** (la amarilla del mueble de la izquierda). Sacá la llave suelta de la derecha.
- Mejorá el dibujo de la cerradura: el **rectángulo blanco horizontal** que la atraviesa se ve raro. Rediseñá esa parte para que se lea claramente como una cerradura.

**C-19 · Audios "Voz 3" y "Sí, acá están".**
- El audio que hoy está como "Voz 3" está mal ubicado: ese audio corresponde a la parte de **"Voz — Te regalo esto, espero que te guste."** Movelo ahí.
- Buscá si existe el audio de **"¡Sí! Acá están."** Si está, ponelo en su lugar. Si no está, dejá esa parte sin audio (solo texto) y anotalo en `PENDIENTES.md`.

**C-20 · El scroll se estira al final del mundo de la llave.**
Al final del mundo de la llave, el scroll sigue de más y queda raro. Cortalo antes, apenas termina la escena.

---

## G. Etapa 3

**C-21 · Pasillo: sacar los pasillos difuminados y unificar la puerta.**
Referencia: `referencias/05-e3-pasillo.png`
- Eliminá los **pasillos difuminados** de los costados, a izquierda y derecha.
- Este escenario tiene que ser **igual al escenario del pasillo que aparece más abajo** en la web.
- La puerta es distinta en los dos escenarios: en **ambos** tiene que ser una **puerta de arco de medio punto**.

**C-22 · Corregir el texto "desprenderse simbólicamente".**
Cambiá:
> "Llega al final del pasillo. La voz le pide desprenderse simbólicamente del objeto que eligió."

por:
> "Llega al final del pasillo. La voz le pide desprenderse del objeto que eligió."

---

## H. Etapa 4

**C-23 · Demasiado aire en el título "Objetos perdidos".**
Referencia: `referencias/06-e4-titulo-objetos-perdidos.png`
En la pantalla del título "OBJETOS PERDIDOS" hay mucho espacio vacío. Reducilo para que la composición quede más compacta.

---

## I. Etapa 5

**C-24 · Revisar "03 · La transición".**
En la Etapa 5, el paso "03 · La transición" dice:

> "La pantalla, que quedó en negro desde que salió de Unreal en la Etapa 4, se enciende con un fundido: aparece el comienzo de un pasillo repleto de objetos. Desde ese momento está otra vez en Unreal."

Eso no está en ningún lado del guion. Chequealo contra el guion: si no está, borralo y reescribí ese paso según lo que sí dice el guion.

---

## J. Etapa 6

**C-25 · Momento de la voz en off.**
En la interacción de la Etapa 6, la voz en off tiene que sonar **cuando se encuentran las tres esferas**, **antes** de depositarlas en el tótem.

---

## K. Reencuentro y Cierre

**C-26 · Punto 4 de "Qué sucede" en el Reencuentro.**
El punto 4 tiene que decir exactamente:

> "Al devolver los objetos, les preguntamos a los participantes si quieren contar por qué lo eligieron."

**C-27 · La parte final termina con la pregunta principal.**
La parte final tiene que terminar con la **pregunta principal**. Eliminá todos los demás diálogos y preguntas de esa parte.

**C-28 · Eliminar los créditos y cerrar con el logo.**
Referencia: `referencias/07-creditos-eliminar.png`
Eliminá la franja de créditos (Integrantes · Materia · Cátedra · Año). La web cierra con el **logo** y el botón **"Volver al inicio"**.

---

## Anexo A · Transcripción de los audios

Completar con lo que dice **textualmente** cada audio. Claude: usá esta tabla para los subtítulos (C-05) y para ubicar los audios (C-19). Si una fila está vacía, no la inventes.

| Archivo original | Dónde va | Lo que dice (textual) |
|---|---|---|
| etapa-1.mp3 | Etapa 1 · voz en off | |
| etapa-2.mp3 | Etapa 2 · voz en off | |
| Mundo-de-la-llave-1.mp3 | Mundo de la llave | |
| Mundo de la llave 2.mp3 | Mundo de la llave | |
| Mundo de la llave 3.mp3 | Mundo de la llave ("Te regalo esto, espero que te guste") | |
| Mate tomado 1.mp3 | Mundo del mate | |
| Mate tomado 2.mp3 | Mundo del mate | |
| Mate tomado 3.mp3 | Mundo del mate | |
| Mate-tomado-4.mp3 | Mundo del mate | |
| Ruido-de-mate-cebandose.mp3 | Mundo del mate · efecto de sonido | (sin voz) |
| Etapa-3-Parte-1.mp3 | Etapa 3 · voz 1 | |
| Etapa-3-Parte-2.mp3 | Etapa 3 · voz 2 | |
| Etapa-4-Parte-1.mp3 | Etapa 4 · voz 1 | |
| Etapa-4-Parte-2.mp3 | Etapa 4 · voz 2 | |
| Etapa 5.mp3 | Etapa 5 · voz en off | |
| Etapa 6.mp3 | Etapa 6 · voz en off | |
| Cierre.mp3 | Cierre | |
