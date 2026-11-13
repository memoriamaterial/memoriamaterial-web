"""Prepara las voces y los efectos nuevos para la web.

Voces (assets/audio/Voces → docs/assets/audio/voces/):
  - Se corta SOLO el silencio del principio y del final (0,1 s de margen). Las pausas internas quedan.
  - Si un canal está casi mudo comparado con el otro, se copia el canal con sonido a los dos.
  - La Etapa 4 (parte 2) llegó en cuatro archivos: se unen en uno, con 0,6 s entre frases.
Efectos (assets/audio/Sonidos Extras → docs/assets/audio/ruidos/):
  - Se toma un fragmento de cada archivo (los originales son largos), con fundido de entrada y salida.
  - Se pasan a estéreo y se bajan a un volumen parejo y suave (-30 LUFS), por debajo de las voces.

Uso: python3 tools/sonidos_nuevos.py
"""
import json, os, subprocess, sys, tempfile
sys.path.insert(0, os.path.dirname(__file__))
from recortar_audios import niveles, tramos, MARGEN  # mismo criterio de silencio que la ronda anterior

BASE = 'Experiencia_MemoriaMaterial_Web/assets/audio'
VOCES_IN, RUIDOS_IN = f'{BASE}/Voces', f'{BASE}/Sonidos Extras'
VOCES_OUT, RUIDOS_OUT = 'docs/assets/audio/voces', 'docs/assets/audio/ruidos'

# archivo original → nombre en la web
VOCES = {
    'Voz - Video incial.mp3': 'bienvenida.mp3',
    'Voz en off - Etapa 1.mp3': 'e1.mp3',
    'Voz Esfera Llave - Etapa 1.mp3': 'e1-esfera-llave.mp3',
    'Voz Esfera Mate- Etapa 1.mp3': 'e1-esfera-mate.mp3',
    'Voz Esfera Cuaderno - Etapa 1.mp3': 'e1-esfera-cuaderno.mp3',
    'Voz en off - Etapa 2.mp3': 'e2.mp3',
    'Voz 1 - Mundo de la llave.mp3': 'llave-1.mp3',
    'Voz 2 - Mundo de la llave.mp3': 'llave-2.mp3',
    'Voz 3 - Mundo de la llave.mp3': 'llave-3.mp3',
    'Voz 4 - Mundo de la llave.mp3': 'llave-4.mp3',
    'Voz 5 - Mundo de la llave.mp3': 'llave-5.mp3',
    'Voz 6 - Mundo de la llave.mp3': 'llave-6.mp3',
    'Voz 7 - Mundo de la llave.mp3': 'llave-7.mp3',
    'Voz 3 parte 1 - Mundo mate (Reunion).mp3': 'mate-reunion-v3a.mp3',
    'Voz 3 parte 2- Mundo mate (Reunion).mp3': 'mate-reunion-v3b.mp3',
    'Voz 2 parte 1- Mundo mate (mañana).mp3': 'mate-manana-v2a.mp3',
    'Voz 2 parte 2- Mundo mate (mañana).mp3': 'mate-manana-v2b.mp3',
    'Voz 2 parte 3- Mundo mate (mañana).mp3': 'mate-manana-v2c.mp3',
    'Voz 2 parte 4- Mundo mate (mañana).mp3': 'mate-manana-v2d.mp3',
    'Voz 2 parte 1- Mundo Cuaderno (lista).mp3': 'cuaderno-lista-v2a.mp3',
    'Voz 2 parte 2 - Mundo Cuaderno (lista).mp3': 'cuaderno-lista-v2b.mp3',
    'Voz 2 parte 3 - Mundo Cuaderno (lista).mp3': 'cuaderno-lista-v2c.mp3',
    'Voz 2 Parte 1 - Mundo cuaderno (Receta).mp3': 'cuaderno-receta-v2a.mp3',
    'Voz 2 Parte 2 - Mundo cuaderno (Receta).mp3': 'cuaderno-receta-v2b.mp3',
    'Voz 2 Parte 3 - Mundo cuaderno (Receta).mp3': 'cuaderno-receta-v2c.mp3',
    'Voz en off Parte 1 - Etapa 3.mp3': 'e3-1.mp3',
    'Voz en off Parte 2 - Etapa 3.mp3': 'e3-2.mp3',
    'Voz en off Parte 1- Etapa 4.mp3': 'e4-1.mp3',
    'Voz en off Video - Etapa 4.mp3': 'e4-video.mp3',
    'Voz en off - Etapa 5.mp3': 'e5.mp3',
    'Voz en off - Etapa 6.mp3': 'e6.mp3',
    'Voz en off - Cierre.mp3': 'cierre.mp3',
}
E4_PARTE2 = ['Voz en off Parte 2.1 - Etapa 4.mp3', 'Voz en off Parte 2.2 - Etapa 4.mp3',
             'Voz en off Parte 2.3 - Etapa 4.mp3', 'Voz en off Parte 2.4 - Etapa 4.mp3']

# efecto → (archivo, inicio, duración) en segundos, elegidos sobre los tramos con sonido de cada archivo
RUIDOS = {
    'llaves-abriendo.mp3': ('Ruido_llaves_Abriendo.mp3', 0.6, 4.0),   # E1 esfera amarilla · la cerradura se abre
    'llaves-cajon.mp3': ('Ruido_LLaves.mp3', 2.1, 1.9),                # aparece la llave en el cajón
    'llaves-mano.mp3': ('Ruido_LLaves.mp3', 5.1, 2.5),                 # la llave entra en la cerradura
    'sorbo-1.mp3': ('Ruido_Mate_Sorbos.wav', 7.2, 1.1),                # mate tomado (ronda, voz 3)
    'sorbo-2.mp3': ('Ruido_Mate_Sorbos.wav', 9.7, 1.3),                # mate tomado (ronda, voz 4)
    'sorbo-3.mp3': ('Ruido_Mate_Sorbos.wav', 13.8, 0.9),               # mate tomado (ronda, voz 3)
    'sorbo-4.mp3': ('Ruido_Mate_Sorbos.wav', 4.1, 0.7),                # mate tomado (la mañana)
    'sorbo-esfera.mp3': ('Ruido_Mate_Sorbos.wav', 15.9, 0.7),          # E1 esfera fucsia
    'mate-cebandose.mp3': ('Mate_Cebandose.mp3', 0.0, 1.85),           # mate cebándose (la ronda y la mañana)
    'pava-hirviendo.mp3': ('Ruido_Pava_Hirviendo.mp3', 0.0, 25.9),     # la mañana: la pava hierve y de fondo, pájaros
    'paginas-1.mp3': ('Ruido_Paginas.mp3', 0.0, 4.0),                  # cuaderno: las hojas se ordenan
    'paginas-2.mp3': ('Ruido_Paginas_2.mp3', 0.9, 4.0),                # cuaderno: el camino de hojas de las recetas
    'escribiendo-1.mp3': ('Ruido_Escribiendo.mp3', 2.0, 7.0),          # cuaderno de materiales: anotaciones
    'escribiendo-2.mp3': ('Ruido_Escribiendo.mp3', 12.0, 7.0),         # cuaderno de recetas: anotaciones
}


def run(*a):
    subprocess.run(a, check=True, capture_output=True)


def dur(p):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout)


def rms_canales(p):
    out = []
    for ch in ('c0', 'c1'):
        r = subprocess.run(['ffmpeg', '-nostats', '-i', p, '-af', f'pan=mono|c0={ch},astats', '-f', 'null', '-'], capture_output=True, text=True).stderr
        line = [l for l in r.splitlines() if 'RMS level dB' in l][0].split()[-1]
        out.append(-200.0 if 'inf' in line else float(line))
    return out


def voz(src, dst):
    l, r = rms_canales(src)
    pan = []
    if l - r > 20: pan = ['pan=stereo|c0=c0|c1=c0']   # sonido solo a la izquierda → a los dos
    elif r - l > 20: pan = ['pan=stereo|c0=c1|c1=c1']
    segs, _ = tramos(niveles(src), 'voz')
    d = dur(src)
    a, b = max(0.0, segs[0][0] - MARGEN), min(d, segs[-1][1] + MARGEN)
    af = ','.join(pan + [f'atrim={a:.3f}:{b:.3f}', 'asetpts=PTS-STARTPTS'])
    run('ffmpeg', '-y', '-v', 'error', '-i', src, '-af', af, '-ac', '2', '-b:a', '128k', dst)
    return {'antes': round(d, 2), 'despues': round(dur(dst), 2), 'corte': [round(a, 2), round(d - b, 2)], 'canales': [l, r], 'copia_canal': bool(pan)}


def e4_unida(dst):
    with tempfile.TemporaryDirectory() as tmp:
        parts = []
        for i, f in enumerate(E4_PARTE2):
            p = os.path.join(tmp, f'{i}.wav')
            segs, _ = tramos(niveles(f'{VOCES_IN}/{f}'), 'voz')
            d = dur(f'{VOCES_IN}/{f}')
            a, b = max(0.0, segs[0][0] - MARGEN), min(d, segs[-1][1] + MARGEN)
            run('ffmpeg', '-y', '-v', 'error', '-i', f'{VOCES_IN}/{f}', '-af', f'atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS', '-ar', '48000', '-ac', '2', p)
            parts.append(p)
        gap = os.path.join(tmp, 'gap.wav')
        run('ffmpeg', '-y', '-v', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-t', '0.6', gap)
        lst = os.path.join(tmp, 'l.txt')
        with open(lst, 'w') as fh:
            for i, p in enumerate(parts):
                fh.write(f"file '{p}'\n")
                if i < len(parts) - 1: fh.write(f"file '{gap}'\n")
        run('ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-b:a', '128k', dst)
        return [round(dur(p), 2) for p in parts]


def ruido(src, ini, d, dst):
    fade = min(0.4, d / 4)
    af = f'atrim={ini}:{ini + d},asetpts=PTS-STARTPTS,afade=t=in:d={fade / 2:.2f},afade=t=out:st={d - fade:.2f}:d={fade:.2f},loudnorm=I=-30:TP=-6:LRA=11'
    run('ffmpeg', '-y', '-v', 'error', '-i', src, '-af', af, '-ac', '2', '-ar', '48000', '-b:a', '128k', dst)


if __name__ == '__main__':
    os.makedirs(VOCES_OUT, exist_ok=True); os.makedirs(RUIDOS_OUT, exist_ok=True)
    informe = {'voces': {}, 'ruidos': {}}
    for src, dst in VOCES.items():
        informe['voces'][dst] = voz(f'{VOCES_IN}/{src}', f'{VOCES_OUT}/{dst}')
    informe['voces']['e4-2.mp3'] = {'partes': e4_unida(f'{VOCES_OUT}/e4-2.mp3'), 'despues': round(dur(f'{VOCES_OUT}/e4-2.mp3'), 2)}
    for dst, (src, ini, d) in RUIDOS.items():
        ruido(f'{RUIDOS_IN}/{src}', ini, d, f'{RUIDOS_OUT}/{dst}')
        informe['ruidos'][dst] = round(dur(f'{RUIDOS_OUT}/{dst}'), 2)
    print(json.dumps(informe, ensure_ascii=False, indent=1))
