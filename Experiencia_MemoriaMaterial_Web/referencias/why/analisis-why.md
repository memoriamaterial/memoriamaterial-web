# Análisis de la web de WHY (referencia de estructura)

Recorrido de la web https://whymultimedial.wixstudio.com/experiencia, página por página.
Sirve como referencia de **estructura, largo de los textos y forma de presentar cada etapa**. No es una referencia de contenido: WHY es otra experiencia (kit físico, Unity, controles de teclado, sin aula).

Complementa las capturas de `referencias/why/`. El texto describe el orden y la lógica; las capturas muestran el diseño.

---

## Recorrido general

La web está dividida en **páginas cortas que se recorren en orden**, cada una con un botón para pasar a la siguiente:

1. **Home** (`/experiencia`): presentación del grupo y del concepto.
2. **Bienvenida** (`/experiencia/blank`): qué es la experiencia, con qué plataforma se hace, qué incluye y cómo se usa.
3. **Inicio de la simulación** (`/experiencia/blank-1`): los primeros pasos dentro de la experiencia, hasta entrar.
4. **Fase 1, Fase 2…** (`/experiencia/fases/fase-1`…): una página por fase, con el desarrollo de cada una.

Cada página es corta. El texto total del Home ronda las **80 a 100 palabras**.

---

## 1. Home

- Logo animado arriba, al centro.
- Una frase de presentación: *"Hola, somos Why…"*.
- Una frase de manifiesto (1 oración).
- Una frase de producto: qué es la experiencia (1 oración).
- Un botón de llamada a la acción: *"Quiero reconectar con mi curiosidad"*, que lleva a la Bienvenida.
- Alrededor: ilustraciones y GIFs chicos con tratamiento de trama (halftone), repetidos, como decoración.

**Patrón:** cada bloque tiene 1 o 2 oraciones y elementos gráficos alrededor. No hay explicaciones largas.

---

## 2. Bienvenida: qué es y cómo se usa

En orden:
1. **GIF de apertura** a todo el ancho.
2. **"¡BIENVENIDXS!"**: una oración que dice qué es la experiencia.
3. **Párrafo corto** sobre qué va a hacer la persona (explorar, moverse, interactuar).
4. **El kit físico**: qué es, con la pregunta *"¿Qué hay adentro?"* y un GIF del render de la caja.
5. **La experiencia digital**: una oración que dice **en qué plataforma está hecha** (Unity) y **en cuántas etapas se divide** (5).
6. **CONTROLES**: un GIF por control con una etiqueta de una o dos palabras debajo (Moverte, Correr, Saltar, Interactuar, Ayuda).
7. **ICONOGRAFÍA**: los íconos que aparecen en la web, cada uno con un GIF y una frase corta de qué significa.
8. **Botón** *"Ejecutar experiencia"*, que lleva a la página siguiente.

**Patrón:** antes de las etapas, la web explica **las partes de la experiencia y las plataformas**, con un GIF o una imagen grande y una frase por bloque.

---

## 3. Inicio de la simulación: los primeros pasos

Cada paso tiene:
- Una **imagen grande en el centro** (render del lugar).
- **1 o 2 oraciones** de lo que pasa. Ejemplo: *"Aparecerás en el umbral de acceso a la simulación, una sala blanca y amplia. Te hablará Oteo, la IA encargada de guiarte."*
- Cuando habla la voz guía: los botones **"Oteo"** (escuchar) y **"Leer"** (ver el texto).
- A veces, un botón de confirmación (*"Ya lo comí"*) o un link a un video.

Termina con un link a la **Fase 1**.

---

## 4. Fase 1: la plantilla de cada etapa

Es la página que mejor muestra el molde. La fase se divide en **islas** (zonas del escenario), y cada isla sigue siempre la misma plantilla:

### Bloque de cada zona
- **Render del escenario en el centro**, grande. Hay una versión normal y una versión **"brillo"**, que resalta lo importante encima del render, y a veces un detalle recortado.
- **Dos títulos**: el nombre de la zona y un subtítulo conceptual. Por ejemplo: **"ISLA 5"** + **"EL CAMBIO"**, o **"ISLA 1"** + **"PRIMER ABRIR DE OJOS"**.
- **Un párrafo de 25 a 40 palabras** con lo que pasa ahí.
- **Etiqueta de audio al costado**: *"Sonido ambiente – Isla 5"*.
- Cuando habla la voz guía: botones **"Oteo"** y **"Leer"**, con una nota como *"Nuevamente escucharás a Oteo."*

### Fichas de objetos
Cada objeto interactivo del escenario se muestra como una ficha corta:
- Imagen chica del objeto.
- **NOMBRE EN MAYÚSCULAS**.
- **La pregunta o frase que aparece** en la experiencia.
- **Entre paréntesis, qué pasa** al interactuar.

Ejemplos:
- **FLOR MARCHITA**: *"¿Todo lo que se va puede volver?"* (al tocarla vuelve a florecer)
- **MARIPOSAS**: *"¿Qué sentirán cuando vuelan?"* (vuelan y dejan partículas)
- **OSO DE PELUCHE**: *"¿Está vivo?"* (se mueve)

### Otros elementos
- **Contador** junto a un ícono (1, 2, 3), que indica el progreso dentro de la fase.
- **GIFs de tramas** y destellos como capas de fondo.
- **Transiciones en una oración**: *"A medida que avances por la oscuridad de la caja, escucharás nuevamente a Oteo…"*
- **Cierre de fase en una oración**: *"Finalizará la primera etapa."*
- Link a la fase siguiente.

---

## Resumen: qué tomar y qué no

**Tomar:**
- Páginas o secciones cortas, que se recorren en orden.
- Antes de las etapas, explicar las partes de la experiencia y las plataformas.
- Una plantilla fija por etapa o zona: render grande en el centro, título y subtítulo, párrafo de 25 a 40 palabras como máximo.
- El audio presentado al costado: la voz guía (escuchar o leer) y el sonido ambiente, con etiquetas.
- Fichas de objetos: nombre, frase que aparece y qué pasa.
- Elementos gráficos y tramas como decoración, nunca como texto.
- Transiciones y cierres de una sola oración.

**No tomar:**
- El contenido, las frases ni el tono humorístico.
- Los controles de teclado, la iconografía de botones ni el kit físico: son propios de su experiencia.
- La lógica de islas: nuestra experiencia se divide en etapas, mundos y escenarios del aula, Unreal, el tótem y los Oculus.
