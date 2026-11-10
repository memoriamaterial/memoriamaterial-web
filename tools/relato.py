"""Fichas de relato por etapa: 1 Mecánica · 2 Escenario · 3 Qué sucede · 4 Interacción.

El contenido sigue brief/guion.md. `python3 tools/relato.py` imprime un JSON {id: html}
que se inserta al comienzo de cada etapa en docs/index.html.
"""
import json

ICON = {'fisico': 'i-lugar', 'unreal': 'i-pc', 'oculus': 'i-oculus'}
NAME = {'fisico': 'Espacio físico', 'unreal': 'Unreal', 'oculus': 'Oculus'}


def lugar(*keys):
    return ' <i class="rel__arrow">→</i> '.join(
        f'<span class="rel__place"><svg aria-hidden="true"><use href="#{ICON[k]}"/></svg>{NAME[k]}</span>' for k in keys)


def voice(vid, acc, auto=True):
    a = '' if auto else ' data-autoplay="off"'
    return f'<div data-voice="{vid}" data-acc="{acc}"{a} class="voice--compact"></div>'


def said(txt):
    return f'<span class="rel__said">{txt}</span>'


def onoma(txt):
    return f'<span class="onoma">{txt}</span>'


def img(src, w, h, tag):
    return (f'<span class="ph ph--right">{tag}</span>'
            f'<img src="{src}" width="{w}" height="{h}" alt="" loading="lazy" decoding="async">')


TRIO = '''<svg class="rel__dome" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><g fill="none" stroke="currentColor"><path d="M-40 600A540 540 0 0 1 1040 600"/><path d="M60 600A440 440 0 0 1 940 600"/><path d="M180 600A320 320 0 0 1 820 600"/><ellipse cx="500" cy="600" rx="140" ry="540"/><ellipse cx="500" cy="600" rx="300" ry="540"/><ellipse cx="500" cy="600" rx="440" ry="540"/></g></svg>
<ol class="e2-trio rel__trio" aria-label="Orden de los mundos">
<li class="e2-trio__item is-color" style="--c:var(--amarillo)"><svg viewBox="0 0 100 260" aria-hidden="true"><use href="#obj-llave"/></svg><span class="mono"><b>1</b> Llave · en color</span></li>
<li class="e2-trio__item" style="--c:var(--fucsia)"><svg viewBox="0 0 200 240" aria-hidden="true"><use href="#obj-mate"/></svg><span class="mono"><b>2</b> Mate</span></li>
<li class="e2-trio__item" style="--c:var(--celeste)"><svg viewBox="0 0 240 180" aria-hidden="true"><use href="#obj-cuaderno"/></svg><span class="mono"><b>3</b> Cuaderno</span></li>
</ol>'''

PASILLO = '''<svg class="rel__svg" viewBox="0 0 400 250" aria-hidden="true">
<defs><filter id="rel-blur"><feGaussianBlur stdDeviation="3"/></filter><filter id="rel-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<g fill="none" stroke="#F2EDD4" filter="url(#rel-blur)" opacity=".3"><rect x="18" y="70" width="70" height="90"/><rect x="34" y="88" width="38" height="52"/><rect x="312" y="60" width="70" height="90"/><rect x="328" y="78" width="38" height="52"/></g>
<g fill="none" stroke="#F2EDD4"><rect x="80" y="20" width="240" height="220" stroke-opacity=".5"/><rect x="128" y="62" width="144" height="146" stroke-opacity=".38"/><rect x="160" y="90" width="80" height="96" stroke-opacity=".28"/><rect x="178" y="106" width="44" height="64" stroke-opacity=".2"/>
<path d="M80 240 178 170M320 240 222 170M80 20 178 106M320 20 222 106" stroke-opacity=".22"/></g>
<path d="M188 170v-38a12 12 0 0 1 24 0v38Z" fill="#3CC5F2" fill-opacity=".25" stroke="#3CC5F2" stroke-width="2" filter="url(#rel-glow)"/>
<path d="M200 240 200 172" stroke="#3CC5F2" stroke-opacity=".5" stroke-width="2"/>
<circle class="rel__pulse" cx="200" cy="214" r="5" fill="#3CC5F2" filter="url(#rel-glow)"/>
</svg>'''

# pilas de objetos repetidos a los costados de un pasillo recto, con los Oculus al fondo
_piles = []
for side in (-1, 1):
    for row in (0, 1):
        for i, ico in enumerate(['llave', 'mate', 'cuaderno', 'llave', 'mate', 'cuaderno', 'llave', 'mate']):
            s_ = 1 - i * 0.11
            x = 200 + side * (34 + (150 + row * 22) * s_) + (row * 10 * s_ * side)
            y = 118 + 112 * s_ - row * 34 * s_
            ico = ['llave', 'mate', 'cuaderno'][(i + row + (side > 0)) % 3]
            vb = {'llave': '0 0 100 260', 'mate': '0 0 200 240', 'cuaderno': '0 0 240 180'}[ico]
            w = {'llave': 26, 'mate': 50, 'cuaderno': 60}[ico] * s_
            acc = (i * 3 + row * 5 + (side > 0) * 2) % 7 == 0
            col = '#FCB614' if acc else '#F2EDD4'
            op = '1' if acc else f'{0.22 + 0.34 * s_:.2f}'
            _piles.append(f'<svg x="{x - w / 2:.1f}" y="{y - w * 1.1:.1f}" width="{w:.1f}" height="{w * 1.2:.1f}" viewBox="{vb}" style="color:{col};opacity:{op}"><use href="#obj-{ico}"/></svg>')
_piles.reverse()  # las del fondo primero, las cercanas encima
PILAS = ('<svg class="rel__svg" viewBox="0 0 400 250" aria-hidden="true"><g stroke="#F2EDD4" stroke-opacity=".18">'
         '<path d="M0 250 186 120M400 250 214 120M60 250 192 120M340 250 208 120"/></g>' + ''.join(_piles) +
         '<g transform="translate(184 104)" fill="none" stroke="#FCB614" stroke-width="2.4" style="filter:drop-shadow(0 0 6px #FCB614)"><rect width="32" height="15" rx="7"/></g>'
         '<rect x="176" y="120" width="48" height="8" rx="3" fill="#F2EDD4" fill-opacity=".3"/></svg>')

_wire = []
for x, y, ico, w, r in [(50, 60, 'llave', 22, -30), (110, 150, 'cuaderno', 64, 12), (170, 50, 'mate', 46, 8), (230, 170, 'llave', 22, 40),
                        (290, 70, 'cuaderno', 60, -10), (350, 160, 'mate', 44, -12), (70, 190, 'mate', 40, 20), (330, 40, 'llave', 18, 60)]:
    vb = {'llave': '0 0 100 260', 'mate': '0 0 200 240', 'cuaderno': '0 0 240 180'}[ico]
    _wire.append(f'<g transform="translate({x} {y}) rotate({r})"><svg x="{-w / 2}" y="{-w / 2}" width="{w}" height="{w * 1.2}" viewBox="{vb}" style="color:#3CC5F2;opacity:.6"><use href="#obj-{ico}-wire"/></svg></g>')
WIRE = ('<svg class="rel__svg" viewBox="0 0 400 250" aria-hidden="true"><defs><radialGradient id="rel-orb"><stop offset="0" stop-color="#F2EDD4"/><stop offset=".45" stop-color="currentColor"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></radialGradient></defs>'
        + ''.join(_wire) +
        '<circle cx="140" cy="96" r="14" fill="url(#rel-orb)" style="color:#ED4380"/><circle cx="262" cy="130" r="14" fill="url(#rel-orb)" style="color:#FCB614"/><circle cx="214" cy="218" r="14" fill="url(#rel-orb)" style="color:#3CC5F2"/>'
        '<g fill="none" stroke="#3CC5F2" stroke-width="2"><path d="M8 26V8h18M374 8h18v18M8 224v18h18M392 224v18h-18"/></g></svg>')


STAGES = {
    # C-11: sin los bloques Dónde / Dispositivo / Qué hace; la Mecánica explica lugar, dispositivo y acción
    'bienvenida': dict(
        where='fisico', acc='fucsia', num='Antes de empezar', title='Bienvenida',
        lead='Todo empieza en el aula, frente al proyector, antes de sentarse en las estaciones.',
        mec='Los participantes entran al aula y miran el video de bienvenida en el proyector. Todavía no usan ningún dispositivo: miran, escuchan y después cada uno va a su estación.',
        # C-09: en la Bienvenida quedan solo la Mecánica y la Interacción
        inter='El video de bienvenida, cuadro por cuadro, a medida que bajás.'),

    'e1': dict(
        where='unreal', acc='amarillo', num='Etapa 01', title='Plasticidad sináptica',
        lead='El cerebro reorganiza la conexión entre los objetos que reconoce y el significado que le evocan.',
        mec='Sentado en su estación, el participante recorre el escenario en Unreal desde la computadora. Se acerca a las esferas para escucharlas y conecta cada una con el objeto que le corresponde.',
        fig=img('assets/img/maqueta-e1.webp', 1927, 903, 'Maqueta · Unreal'),
        esc='Un espacio desértico con estructuras rectangulares que simulan los pliegues del cerebro. Tres objetos gigantes (un manojo de llaves, un mate y un cuaderno) encallados en la arena, esferas flotantes que apenas brillan y, en el cielo, formas de la marca que pasan. En el centro, una plataforma con tres esferas incrustadas.',
        pasos=[
            ('Al comenzar', 'La voz en off presenta la etapa.' + voice('e1', 'amarillo')),
            # C-12: un renglón por esfera
            (None, 'Al acercarse a una esfera, se ilumina y emite un sonido y una voz vinculados a un objeto:'
                   + '<span class="pasos__linea"><b class="c-amarillo">Amarilla:</b> ' + onoma('llaves abriendo una puerta') + ' ' + said('—¿Cómo te fue? ¿Ya comiste?') + '</span>'
                   + '<span class="pasos__linea"><b class="c-fucsia">Fucsia:</b> ' + onoma('alguien toma mate') + ' ' + said('—Gracias, yo ya estoy.') + '</span>'
                   + '<span class="pasos__linea"><b class="c-celeste">Celeste:</b> ' + onoma('una hoja se arranca') + ' ' + said('—Tomá mi número, hablemos.') + '</span>'),
            (None, 'Al interactuar con una esfera, la pantalla toma levemente su color. Se puede volver a tocarla para quitarlo.'),
            (None, 'Para hacer la conexión hay que interactuar con el objeto correspondiente: la esfera, el objeto y la conexión se iluminan del mismo color.'),
            (None, 'Con cada conexión se enciende, del mismo color, una de las tres esferas incrustadas en la plataforma central.'),
            (None, 'Con las tres conexiones, la plataforma se eleva y revela la Cúpula del Reencuadre.'),
            (None, 'Se entra a la cúpula por una puerta; al atravesarla empieza la Etapa 2.'),
        ],
        inter='Hacé clic en una esfera para escucharla y después en el objeto que le corresponde. Si seguís bajando, las conexiones se hacen solas.'),

    'e2': dict(
        where='unreal', acc='fucsia', num='Etapa 02', title='El mundo de los objetos',
        lead='Cuando cambia el significado de un objeto, es porque cambia el punto de vista desde el que lo mirás.',
        mec='En Unreal, desde la computadora de su estación, el participante se acerca a cada objeto gigante y entra a su mundo por una abertura. Los recorre en un orden fijo (llave, mate y cuaderno) y en cada uno realiza una acción ligada al uso del objeto: encuentra la llave, se sienta en la ronda y sigue las hojas del cuaderno.',
        fig=TRIO,
        # C-15: se eliminó el texto del escenario (los objetos no están dentro de la cúpula)
        # C-16: en "Qué sucede" queda solo la voz en off; cada mundo tiene su bloque antes de su interacción
        pasos=[
            ('Al ingresar', 'La voz en off presenta la etapa.' + voice('e2', 'fucsia')),
        ],
        inter='Cada mundo se explica primero y después se recorre: abrí los cajones y llevá la llave hasta la cerradura (es la única acción necesaria para continuar), sentate en la ronda y seguí las hojas del cuaderno.'),

    'e3': dict(
        where='unreal', acc='celeste', num='Etapa 03', title='Una extensión del yo',
        lead='Ahora el objeto es tuyo: lo elegís, lo pensás y te desprendés de él.',
        mec='En Unreal, desde la computadora de su estación, el participante recorre un pasillo mientras la voz le pide pensar en un objeto que lleve encima. Al final sale un momento de la experiencia: se levanta, sigue las luces LED del aula hasta el tótem y deposita ahí su objeto real; el holograma de una mesa cercana le muestra un ícono. Después vuelve a Unreal y elige ese ícono para abrir la puerta.',
        fig=PASILLO,
        esc='Un pasillo con una puerta al fondo. Un pulso de luz lo recorre hacia adelante y, alrededor, se adivinan muy difuminados otros pasillos como este.',
        pasos=[
            ('Mientras recorre el pasillo', 'La voz en off: ' + said('“Ya viviste cómo un objeto puede convertirse en una extensión de nosotros, ahora vamos a vivirlo con vos.”') + voice('e3a', 'celeste', auto=False)),
            (None, 'La consigna se desarrolla durante el recorrido, para dar tiempo a pensar: elegir, entre lo que lleva encima, un objeto que pueda tener un significado distinto.' + voice('e3b', 'celeste', auto=False)),
            ('Al llegar al final', 'Se le indica desprenderse simbólicamente del objeto: sale de Unreal y, guiado por luces LED como el pulso del pasillo, lo deposita en el tótem del aula.'),
            (None, 'Al depositarlo, un holograma en una mesa cercana proyecta un ícono que refiere a la próxima zona del cerebro.'),
            (None, 'Vuelve a su estación: la puerta del pasillo, antes cerrada, ahora presenta tres íconos.'),
            (None, 'Al elegir el correcto, el que mostró el holograma, la puerta se abre hacia la Etapa 4.'),
        ],
        inter='Recorré el pasillo con el scroll, seguí la secuencia del tótem y del holograma, y elegí el ícono de la puerta.'),

    'e4': dict(
        where='unreal', acc='fucsia', num='Etapa 04', title='Objetos perdidos',
        lead='Los objetos que valoramos son anclas de seguridad: cuando se pierden, la mente no para de buscarlos.',
        mec='En Unreal, desde la computadora de su estación, el participante recorre una réplica de la primera etapa, ahora sin sus objetos: escucha las esferas apagadas y puede volver a entrar en cada mundo. Al final sale otra vez de Unreal, sigue las luces LED hasta el tótem del aula, donde dejó su objeto, y después mira el video del proyector.',
        fig=img('assets/img/maqueta-e1-inv.webp', 1927, 903, 'Maqueta · invertida'),
        esc='La réplica del desierto de la Etapa 1, con los colores invertidos. Donde estaban los objetos solo quedan su silueta y su sombra, que por momentos se glitchean como si el objeto reapareciera.',
        pasos=[
            ('Al ingresar', 'Un fuerte destello blanco y un pitido intenso y sostenido. Durante el destello, la voz en off.' + voice('e4a', 'fucsia', auto=False)),
            (None, 'Todo se transita con aberración cromática y glitches donde antes pasaban las formas del cielo. De fondo, siempre, un leve ruido blanco. El espacio se revela de a poco.'),
            (None, 'Las esferas vuelven a estar desconectadas y apagadas. Al interactuar, hablan de cuando los objetos se perdieron: ' + said('“Me quiero matar, dejé las llaves en el auto…”') + ', ' + said('“…se me pudrió el mate…”') + ', ' + said('“…arruiné el cuaderno, tenía todos mis apuntes…”')),
            (None, 'Se puede volver a entrar en cada objeto, pero los mundos cambiaron. Llave: los marcos ahora son puertas cerradas y los cajones no se abren. Mate: una luz cenital ilumina el círculo donde estaban las sillas; solo quedan sus sombras. Cuaderno: caen bollos de papel que forman una pila y las anotaciones se apagan antes de terminar.'),
            ('En el último mundo', 'La voz en off, ahora con mucha reverberación.' + voice('e4b', 'fucsia', auto=False)),
            (None, 'Las luces del aula y el proyector se apagan; las luces LED vuelven a guiar al tótem. Al acercarse, saliendo de nuevo de Unreal, donde estaban los objetos solo hay humo.'),
            (None, 'El proyector vuelve a encenderse con un video en el que la voz les habla directamente a los profesores y presenta la Etapa 5.'),
        ],
        inter='Hacé clic en las esferas apagadas y en los cajones que no se abren; después, seguí bajando hasta el tótem con humo.'),

    'e5': dict(
        where='unreal', acc='amarillo', num='Etapa 05', title='Obsesión con la pérdida',
        lead='Cuando lo tenías encima ni pensabas en él; ahora que lo perdiste, lo ves en todos lados.',
        mec='Vuelve a Unreal cuando termina el video del proyector: las luces lo llevan de nuevo a su estación y la pantalla se enciende en el comienzo de un pasillo. Lo recorre entre pilas de objetos hasta encontrar los Oculus.',
        fig=PILAS,
        esc='El escenario está repleto de los objetos que en la etapa anterior parecían perdidos, ahora en su escala normal. Forman pilas a los lados y un pasillo recto que lleva a una pila más chica, donde están apoyados los Oculus, el “Detector de significado”.',
        pasos=[
            ('La señal', 'Termina el video del proyector, que les habló a los profesores: es la señal para volver. El proyector se apaga.'),
            (None, 'Las luces LED vuelven a encenderse, ahora desde el tótem hacia las estaciones, y cada participante vuelve a sentarse frente a su computadora.'),
            ('La transición', 'La pantalla, que quedó en negro desde que salió de Unreal en la Etapa 4, se enciende con un fundido: aparece el comienzo de un pasillo repleto de objetos. Desde ese momento está otra vez en Unreal.'),
            (None, 'Recorre el pasillo recto entre las pilas de objetos repetidos: llaves, mates y cuadernos por todos lados.'),
            ('Al llegar a los Oculus', 'La voz en off.' + voice('e5', 'amarillo', auto=False)),
        ],
        inter='Seguí bajando: la cámara recorre el pasillo hasta los Oculus.'),

    'e6': dict(
        where='oculus', acc='celeste', num='Etapa 06', title='Búsqueda del significado',
        lead='Con el detector puesto, lo que se busca no es el objeto: es su significado.',
        mec='El participante se pone los Oculus. El escenario es el mismo de la Etapa 5, pero en wireframe, y los Oculus funcionan como detector: busca entre los objetos las esferas que brillan, guiado por sus sonidos, las recolecta y las deposita en un tótem que emerge del suelo.',
        fig=WIRE,
        esc='La réplica del pasillo de la Etapa 5, con todos los objetos en modo wireframe. Entre ellos brillan tres esferas, acompañadas de sonidos que sirven de guía.',
        pasos=[
            (None, 'Con los Oculus puestos, recorre el escenario en wireframe. Las esferas brillan y suenan para guiarlo.'),
            (None, 'Al acercarse a cada esfera, puede interactuar para recolectarla.'),
            (None, 'Con las tres, un tótem igual al del aula emerge del suelo, donde antes estaban la pila chica y los Oculus, con un ruido mecánico para llamar la atención.'),
            (None, 'Luces como las que en el aula lo guiaron antes lo llevan hasta ese tótem. Al interactuar, deposita las esferas y el tótem vuelve a meterse en el suelo.'),
            (None, 'La voz le indica quitarse el detector.' + voice('e6', 'celeste', auto=False)),
            (None, 'En el aula, las luces que van hacia el tótem vuelven a encenderse.'),
        ],
        inter='Mové el detector con el cursor y hacé clic en las esferas que brillan.'),

    'cierre': dict(
        where='fisico', acc='crema', num='Cierre', title='El reencuentro',
        lead='El objeto vuelve, pero ya no es el mismo.',
        mec='El participante se quita los Oculus y vuelve al tótem del aula, guiado por las luces. Ahí recibe su objeto dentro de una esfera y mira el video final en el proyector. El final es en persona, con el equipo.',
        fig='<div class="rel__aula" data-aula-focus="totem"></div>',
        esc='El tótem del aula, ahora con esferas físicas como las del recorrido. Cada una tiene un color (rosa, amarillo, celeste) y un nombre; adentro está el objeto de cada participante.',
        pasos=[
            (None, 'Al volver al tótem, encuentra las esferas físicas con su color y su nombre; dentro está su objeto.'),
            (None, 'Al recibirlas, el proyector reproduce el video final, con la voz en off.' + voice('cierre', 'crema', auto=False)),
            (None, 'El equipo cuenta brevemente cómo nació el proyecto y muestra su objeto de partida.'),
            (None, 'Al devolver los objetos, conversamos con cada participante sobre lo que vivió.'),
        ],
        inter='Las esferas, el video final y la conversación con la que termina la experiencia.'),
}


# C-16: los mundos de la Etapa 2, cada uno como bloque propio, antes de su interacción
MUNDOS = {
    'llave': dict(acc='amarillo', titulo='Mundo de la llave', sub='Una mudanza',
        pasos=[
            (None, 'Al entrar se escucha ' + said('“Llegó el día, por fin me voy a mudar.”') + ' Se recorre un camino a través de cuatro marcos de puerta.'),
            (None, 'Entre la primera y la segunda puerta, cajas de mudanza de distintos tamaños.'),
            (None, 'Entre la segunda y la tercera, ' + said('“Te voy a extrañar, hijo”') + ' y ' + said('“Te regalo esto, espero que te guste”') + ', entre objetos que se regalan a quien se muda: sartén, toallas, decoración, lámpara, muebles.'),
            (None, 'Entre la tercera y la cuarta, ' + said('“¿En dónde quedaron las llaves?”') + ', ' + said('“Me falta lo más importante”') + ', ' + said('“Creo que la guardaste en la mesita de luz”') + '. Hay tres cajones: en uno está la llave.'),
            (None, 'Tras la cuarta puerta, una cerradura gigante con el pasador cerrado y una última abertura detrás. Con la llave se abre: ' + said('“¡Sí! Acá están.”')),
        ],
        inter='Recorré el camino de puerta en puerta, abrí los cajones y llevá la llave hasta la cerradura.'),
    'mate': dict(acc='fucsia', titulo='Mundo del mate', sub='Una ronda',
        pasos=[
            (None, 'Se entra por la base del mate. El piso es un gran charco (se escucha el chapoteo) con sillas flotando y otras caídas. En el centro, la única silla de pie y en color.'),
            (None, 'Al sentarse, las sillas se acomodan en ronda y empieza el diálogo del último recreo del año. Cada silla que habla se colorea e ilumina.'),
            (None, 'Cada vez que se escucha el mate tomado, el agua baja, hasta revelar en el centro de la ronda un hueco iluminado que lleva al segundo escenario.'),
            (None, 'Todo se oscurece y se escuchan pájaros. Se prende la hornalla con una pava vieja, se oye un bostezo y unas persianas: se abren ventanas rectangulares con una luz anaranjada que sube como la salida del sol.'),
            (None, 'Una mañana en familia: ' + said('“Buen día hijo, ¿cómo estás?”') + ', se prende la radio, se ceba un mate. Al final, pasos y una puerta que se abre con luz blanca: ' + said('“Bueno, nos vemos a la noche.”') + ' Al pasar, el portazo.'),
        ],
        inter='Sentate en la silla de color y seguí la ronda; después, la mañana.'),
    'cuaderno': dict(acc='celeste', titulo='Mundo del cuaderno', sub='Anotaciones',
        pasos=[
            (None, 'Cuadernos y hojas flotantes. Las hojas se ordenan frente al participante y forman un camino de plataformas hacia el siguiente cuaderno.'),
            (None, 'Cuaderno de materiales: ruido de obra, la cámara tiembla y se levanta polvo. Un diálogo sobre un escritorio nuevo; las anotaciones se escriben flotando a medida que se habla.'),
            (None, 'Cuaderno de recetas: el escenario pasa de violeta a crema, se escucha algo que se bate y aparecen postres caseros. La abuela dicta la receta; al caer sobre las hojas se levantan nubes de harina, y al nombrar el horno todo se ve más anaranjado.'),
            (None, 'El último cuaderno, el más grande y abierto de par en par, tiene la salida dibujada en sus hojas: lleva a la Etapa 3.'),
        ],
        inter='Seguí las hojas: el cuaderno de materiales, el de recetas y la salida dibujada.'),
}


def build_mundo(key, d):
    items = ''.join(f'<li><span class="pasos__n">{n:02d}</span><div class="pasos__body"><p>{body}</p></div></li>' for n, (t, body) in enumerate(d['pasos'], 1))
    return f'''<!-- mundo:{key} -->
      <div class="mundo" style="--acc:var(--{d['acc']})">
        <div class="wrap mundo__in">
          <header class="mundo__head">
            <p class="stage-num">Etapa 02 · {d['titulo']}</p>
            <h3 class="title mundo__title">{d['sub']}</h3>
          </header>
          <section class="rel rel--seq" aria-label="Qué sucede en el {d['titulo'].lower()}">
            <h4 class="rel__h"><span class="rel__n">3</span>Qué sucede</h4>
            <ol class="pasos">{items}</ol>
          </section>
          <div class="relato__to4">
            <h4 class="rel__h"><span class="rel__n">4</span>Interacción</h4>
            <p class="rel__p">{d['inter']}</p>
            <span class="relato__cue" aria-hidden="true"><svg><use href="#i-arrow"/></svg></span>
          </div>
        </div>
      </div>
      <!-- /mundo:{key} -->'''


def build(key, d):
    acc = d['acc']
    facts = ''.join(f'<div><dt>{a}</dt><dd>{b}</dd></div>' for a, b in d.get('facts', []))
    items, n = [], 0
    for t, body in d.get('pasos', []):
        if t == 'grupo':
            items.append(f'<li class="pasos__grupo">{body}</li>')
            continue
        n += 1
        when = f'<span class="pasos__when">{t}</span>' if t else ''
        items.append(f'<li><span class="pasos__n">{n:02d}</span><div class="pasos__body">{when}<p>{body}</p></div></li>')
    facts_html = f'\n        <dl class="rel__facts">{facts}</dl>' if d.get('facts') else ''
    esc_html = f'''
      <section class="rel rel--esc" aria-label="Escenario">
        <h3 class="rel__h"><span class="rel__n">2</span>Escenario</h3>
        <figure class="rel__fig">{d['fig']}</figure>
        {('<p class="rel__p">' + d['esc'] + '</p>') if d.get('esc') else ''}
      </section>''' if d.get('fig') else ''
    seq_html = f'''
      <section class="rel rel--seq" aria-label="Qué sucede">
        <h3 class="rel__h"><span class="rel__n">3</span>Qué sucede</h3>
        <ol class="pasos">{''.join(items)}</ol>
      </section>''' if items else ''
    solo = '' if (esc_html or seq_html) else ' relato__grid--solo'
    return f'''<div class="relato" data-where="{d['where']}" style="--acc:var(--{acc})">
  <div class="wrap">
    <header class="relato__head">
      <p class="stage-num">{d['num']}</p>
      <h2 class="display relato__title" data-split>{d['title']}</h2>
      <p class="lead relato__lead">{d['lead']}</p>
    </header>
    <div class="relato__grid{solo}">
      <section class="rel rel--mec" aria-label="Mecánica">
        <h3 class="rel__h"><span class="rel__n">1</span>Mecánica</h3>
        <p class="rel__p">{d['mec']}</p>{facts_html}
      </section>{esc_html}{seq_html}
    </div>
    <div class="relato__to4">
      <h3 class="rel__h"><span class="rel__n">4</span>Interacción</h3>
      <p class="rel__p">{d['inter']}</p>
      <span class="relato__cue" aria-hidden="true"><svg><use href="#i-arrow"/></svg></span>
    </div>
  </div>
</div>'''


if __name__ == '__main__':
    out = {k: build(k, d) for k, d in STAGES.items()}
    out.update({f'mundo:{k}': build_mundo(k, d) for k, d in MUNDOS.items()})
    print(json.dumps(out, ensure_ascii=False))
