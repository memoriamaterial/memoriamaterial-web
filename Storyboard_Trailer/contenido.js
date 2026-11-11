/* ==========================================================================
   MEMORIA MATERIAL · Storyboard del tráiler
   --------------------------------------------------------------------------
   ESTE ES EL ÚNICO ARCHIVO QUE HAY QUE EDITAR PARA CAMBIAR CONTENIDO.
   - Textos de voz en off: "vo" (una línea por elemento, se revelan en orden).
   - Planos: "planos" (de 2 a 4 por escena).
   - Imágenes: poné el archivo en assets/img/ con el nombre indicado en
     "imagen". Si el archivo no existe, la web muestra un placeholder
     diseñado con el nombre que falta.
   - "objeto" elige el dibujo del placeholder: "llave", "mate" o "cuaderno".
   - "color" de acento: "amarillo", "fucsia" o "celeste".
   - "tipo": "imagen" (por defecto), "texto" o "logo" para planos gráficos.
   Guardá el archivo y recargá la página.
   ========================================================================== */

window.STORYBOARD = {
  titulo: "Memoria Material",
  bajada: "Tráiler — Storyboard",
  duracion: "01:00",
  lema: "Lo habitual desde otro lugar",

  escenas: [
    {
      id: "escena1",
      titulo: "Lo cotidiano",
      inicio: "00:00",
      fin: "00:08",
      vo: [
        "Una llave abre una puerta.",
        "Un mate pasa de mano en mano.",
        "Un cuaderno guarda apuntes."
      ],
      planos: [
        {
          codigo: "P01",
          encuadre: "Primer plano · cámara fija",
          imagen: "assets/img/escena1_plano1.jpg",
          objeto: "llave",
          color: "amarillo",
          nota: "Un manojo de llaves sobre la mesa. Una mano las levanta y las gira en la cerradura.",
          sonido: "Tintineo de llaves · cerradura que gira"
        },
        {
          codigo: "P02",
          encuadre: "Primer plano · paneo lento",
          imagen: "assets/img/escena1_plano2.jpg",
          objeto: "mate",
          color: "fucsia",
          nota: "El mate pasa de una mano a otra. Luz natural, sin intervención gráfica.",
          sonido: "Sorbo de mate · bombilla"
        },
        {
          codigo: "P03",
          encuadre: "Plano detalle · cenital",
          imagen: "assets/img/escena1_plano3.jpg",
          objeto: "cuaderno",
          color: "celeste",
          nota: "Un cuaderno abierto lleno de apuntes. Los dedos pasan una hoja.",
          sonido: "Hoja que pasa"
        }
      ]
    },

    {
      id: "escena2",
      titulo: "Una segunda mirada",
      inicio: "00:08",
      fin: "00:17",
      vo: [
        "Sabés para qué sirven.",
        "Pero… ¿alguna vez te preguntaste qué más pueden significar?"
      ],
      planos: [
        {
          codigo: "P04",
          encuadre: "Cenital → contrapicado · zoom out",
          imagen: "assets/img/escena2_plano1.jpg",
          objeto: "llave",
          color: "amarillo",
          nota: "La llave se agiganta y gira. Entran los primeros recortes geométricos.",
          sonido: "El ambiente se apaga · entra un pulso grave"
        },
        {
          codigo: "P05",
          encuadre: "Cambio de escala · travelling lateral",
          imagen: "assets/img/escena2_plano2.jpg",
          objeto: "mate",
          color: "fucsia",
          nota: "Mate y cuaderno en perspectiva forzada. Las tramas cubren el fondo violeta.",
          sonido: "Pulso + primer acorde"
        },
        {
          codigo: "P06",
          encuadre: "Plano gráfico · texto en pantalla",
          tipo: "texto",
          texto: "¿Qué más pueden significar?",
          color: "celeste",
          nota: "Fondo violeta pleno. La pregunta aparece entre semicírculos que orbitan.",
          sonido: "Música en suspenso"
        }
      ]
    },

    {
      id: "escena3",
      titulo: "Lo que se construye",
      inicio: "00:17",
      fin: "00:28",
      vo: [
        "Una mudanza. Una charla entre amigos. Un recuerdo compartido.",
        "Con el tiempo, algo tan simple puede convertirse en mucho más que un objeto."
      ],
      planos: [
        {
          codigo: "P07",
          encuadre: "Fragmento · travelling hacia adelante",
          imagen: "assets/img/escena3_plano1.jpg",
          objeto: "llave",
          color: "amarillo",
          nota: "Mundo de la llave: marcos de puertas y cajas de mudanza (Unreal).",
          voces: ["“Llegó el día, por fin me voy a mudar”", "“Te voy a extrañar, hijo”"]
        },
        {
          codigo: "P08",
          encuadre: "Fragmento · órbita lenta",
          imagen: "assets/img/escena3_plano2.jpg",
          objeto: "mate",
          color: "fucsia",
          nota: "Mundo del mate: la ronda de sillas. Cada silla que habla se ilumina (Unreal).",
          voces: ["“¿Lo armo yo?”", "risas · mate que se ceba"]
        },
        {
          codigo: "P09",
          encuadre: "Fragmento · grúa ascendente",
          imagen: "assets/img/escena3_plano3.jpg",
          objeto: "cuaderno",
          color: "celeste",
          nota: "Mundo del cuaderno: hojas flotantes que arman un camino (Unreal).",
          voces: ["“Tomá mi número, hablemos”", "lápiz sobre papel"]
        }
      ]
    },

    {
      id: "escena4",
      titulo: "Cambiar la perspectiva",
      inicio: "00:28",
      fin: "00:38",
      vo: [
        "A veces, lo único que hace falta es mirar desde otro lugar",
        "para descubrir algo que siempre estuvo ahí."
      ],
      // Texto chico que aparece dentro de la lupa cuando se revela el detalle
      detalleOculto: "Siempre estuvo ahí",
      planos: [
        {
          codigo: "P10",
          encuadre: "Plano general · órbita 180°",
          imagen: "assets/img/escena4_plano1.jpg",
          objeto: "llave",
          color: "amarillo",
          nota: "Objetos gigantes encallados en la arena. La cámara los rodea (Unreal).",
          sonido: "Whoosh de cámara · la música crece"
        },
        {
          codigo: "P11",
          encuadre: "Plano detalle · push-in",
          imagen: "assets/img/escena4_plano2.jpg",
          objeto: "llave",
          color: "celeste",
          nota: "Al girar, el objeto revela un detalle que antes no se veía.",
          sonido: "Golpe seco en el reencuadre"
        },
        {
          codigo: "P12",
          encuadre: "Motion gráfico · reacomodo",
          imagen: "assets/img/escena4_plano3.jpg",
          objeto: "cuaderno",
          color: "fucsia",
          nota: "Las formas de la identidad se reorganizan alrededor del objeto.",
          sonido: "Un golpe rítmico por cada forma"
        }
      ]
    },

    {
      id: "escena5",
      titulo: "La ausencia",
      inicio: "00:38",
      fin: "00:46",
      vo: [
        "Y otras veces, recién notamos su importancia cuando deja de estar."
      ],
      silencio: "— silencio —",
      planos: [
        {
          codigo: "P13",
          encuadre: "Plano fijo · corte seco",
          imagen: "assets/img/escena5_plano1.jpg",
          objeto: "mate",
          color: "fucsia",
          nota: "El mate desaparece. Quedan su silueta y su sombra.",
          sonido: "— silencio — (1 s)"
        },
        {
          codigo: "P14",
          encuadre: "Planos breves · glitch",
          imagen: "assets/img/escena5_plano2.jpg",
          objeto: "cuaderno",
          color: "celeste",
          nota: "Fragmentos de los escenarios alterados: sillas sin gente, puertas cerradas.",
          sonido: "Ruido blanco leve · reverberación"
        }
      ]
    },

    {
      id: "escena6",
      titulo: "La invitación",
      inicio: "00:46",
      fin: "01:00",
      vo: [
        "Hay mucho más detrás de las cosas que usamos todos los días.",
        "Solo hay que animarse a buscarlo."
      ],
      textoEnPantalla: "¿Estás dispuesto a buscar en lo que te resulta habitual?",
      planos: [
        {
          codigo: "P15",
          encuadre: "Montaje rápido · cámara en mano",
          imagen: "assets/img/escena6_plano1.jpg",
          objeto: "cuaderno",
          color: "celeste",
          nota: "Imágenes breves de búsqueda: cajones que se abren, esferas que brillan.",
          sonido: "La música retoma y crece"
        },
        {
          codigo: "P16",
          encuadre: "Gráfico · conexiones",
          imagen: "assets/img/escena6_plano2.jpg",
          objeto: "mate",
          color: "fucsia",
          nota: "Líneas de color unen objetos y esferas: amarillo, fucsia, celeste.",
          sonido: "Un tono ascendente por conexión"
        },
        {
          codigo: "P17",
          encuadre: "Texto en pantalla",
          tipo: "texto",
          texto: "¿Estás dispuesto a buscar en lo que te resulta habitual?",
          color: "amarillo",
          nota: "La pregunta, sola, sobre violeta.",
          sonido: "Música en suspenso"
        },
        {
          codigo: "P18",
          encuadre: "Pantalla final · logotipo",
          tipo: "logo",
          color: "fucsia",
          nota: "Siluetas y fragmentos se recomponen y convergen en MEMORIA MATERIAL.",
          sonido: "Golpe final · silencio"
        }
      ]
    }
  ],

  cierre: {
    pregunta: "¿Estás dispuesto a buscar en lo que te resulta habitual?",
    // Palabras de la pregunta que se resaltan en color (en minúscula, sin signos)
    resaltar: ["buscar", "habitual"],
    ficha: [
      { etiqueta: "Proyecto", valor: "Memoria Material · Tesis de grado" },
      { etiqueta: "Pieza", valor: "Tráiler · 01:00" },
      { etiqueta: "Carrera", valor: "[Nombre de la carrera]" },
      { etiqueta: "Institución", valor: "[Nombre de la institución] · 2026" }
    ],
    equipo: [
      { nombre: "[Nombre Apellido]", rol: "Dirección y guion" },
      { nombre: "[Nombre Apellido]", rol: "Diseño de identidad y motion" },
      { nombre: "[Nombre Apellido]", rol: "Escenarios en Unreal" },
      { nombre: "[Nombre Apellido]", rol: "Sonido y voces" }
    ],
    docentes: ["[Nombre del docente]", "[Nombre del docente]"]
  }
};
