"""Recorta SOLO los silencios de los audios (sin cambiar volumen ni aplicar efectos).

- Principio y final: se corta el silencio dejando 0,1 s de margen.
- Voces: las pausas internas de más de 0,7 s se acortan a ~0,5 s (0,25 s a cada lado).
- Efectos (mate): solo principio y final.
- El umbral de silencio se calcula por archivo, según su propio piso de ruido y su nivel.
- Los originales traen sonido solo en el canal izquierdo: se copia a los dos canales.
- Exporta MP3 con la misma calidad del original: 128 kbps CBR si el original es CBR,
  VBR de máxima calidad (V0) si el original es VBR.

Uso: python3 tools/recortar_audios.py <carpeta_originales> <carpeta_salida>
"""
import array, json, math, os, shutil, subprocess, sys

# archivo original → (nombre para la web, tipo)
MAPA = {
    'etapa-1.mp3': ('e1-voz.mp3', 'voz'),
    'etapa-2.mp3': ('e2-voz.mp3', 'voz'),
    'Mundo-de-la-llave-1.mp3': ('llave-voz-1.mp3', 'voz'),
    'Mundo de la llave 2.mp3': ('llave-voz-2.mp3', 'voz'),
    'Mundo de la llave 3.mp3': ('llave-voz-3.mp3', 'voz'),
    'Mate tomado 1.mp3': ('mate-tomado-1.mp3', 'efecto'),
    'Mate tomado 2.mp3': ('mate-tomado-2.mp3', 'efecto'),
    'Mate tomado 3.mp3': ('mate-tomado-3.mp3', 'efecto'),
    'Mate-tomado-4.mp3': ('mate-tomado-4.mp3', 'efecto'),
    'Ruido-de-mate-cebandose.mp3': ('mate-cebandose.mp3', 'efecto'),
    'Etapa-3-Parte-1.mp3': ('e3-voz-1.mp3', 'voz'),
    'Etapa-3-Parte-2.mp3': ('e3-voz-2.mp3', 'voz'),
    'Etapa-4-Parte-1.mp3': ('e4-voz-1.mp3', 'voz'),
    'Etapa-4-Parte-2.mp3': ('e4-voz-2.mp3', 'voz'),
    'Etapa 5.mp3': ('e5-voz.mp3', 'voz'),
    'Etapa 6.mp3': ('e6-voz.mp3', 'voz'),
    'Cierre.mp3': ('cierre-voz.mp3', 'voz'),
}
STEP = 0.02          # ventana de análisis (s)
MARGEN = 0.10        # margen al principio y al final (s)
PAUSA_MAX = 0.70     # pausas internas más largas que esto se acortan...
PAUSA_LADO = 0.25    # ...dejando esto a cada lado (≈ 0,5 s en total)


def niveles(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True).stdout
    a = array.array('h', raw)
    n = int(16000 * STEP)
    return [20 * math.log10(max(1, math.sqrt(sum(x * x for x in a[i:i + n]) / n)) / 32768) for i in range(0, len(a) - n, n)]


def tramos(db, tipo):
    s = sorted(db)
    piso, pico = s[int(len(s) * 0.10)], s[int(len(s) * 0.98)]
    # umbral relativo a ESTE archivo: por encima de su piso de ruido y de su propio nivel
    thr = max(piso + 6, pico - 30) if tipo == 'voz' else piso + 6  # los efectos son suaves: solo relativo al piso
    segs, ini = [], None
    for i, v in enumerate(db + [-200]):
        if v > thr and ini is None:
            ini = i
        if v <= thr and ini is not None:
            segs.append([ini * STEP, i * STEP]); ini = None
    unidos = []
    for sg in segs:                       # huecos menores a 0,25 s no son pausas
        if unidos and sg[0] - unidos[-1][1] < 0.25:
            unidos[-1][1] = sg[1]
        else:
            unidos.append(sg)
    return [u for u in unidos if u[1] - u[0] >= 0.06], thr


def calidad(path):
    with open(path, 'rb') as f:
        head = f.read(4000)
    return ['-b:a', '128k'] if b'Info' in head else ['-q:a', '0']


def recortar(src, dst, tipo):
    db = niveles(src)
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', src], capture_output=True, text=True).stdout)
    segs, thr = tramos(db, tipo)
    a, b = max(0.0, segs[0][0] - MARGEN), min(dur, segs[-1][1] + MARGEN)
    keep = [[a, b]]
    pausas = []
    if tipo == 'voz':
        keep = []
        cur = a
        for prev, nxt in zip(segs, segs[1:]):
            gap = nxt[0] - prev[1]
            if gap > PAUSA_MAX:
                keep.append([cur, prev[1] + PAUSA_LADO])
                cur = nxt[0] - PAUSA_LADO
                pausas.append(round(gap, 2))
        keep.append([cur, b])
    parts = ''.join(f'[0:a]atrim=start={s:.3f}:end={e:.3f},asetpts=PTS-STARTPTS[p{i}];' for i, (s, e) in enumerate(keep))
    graph = parts + ''.join(f'[p{i}]' for i in range(len(keep))) + f'concat=n={len(keep)}:v=0:a=1,pan=stereo|c0=c0|c1=c0[out]'  # C-04: el canal izquierdo en los dos lados
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-filter_complex', graph, '-map', '[out]',
                    '-ar', '48000', '-ac', '2', '-c:a', 'libmp3lame', *calidad(src), dst], check=True)
    nueva = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', dst], capture_output=True, text=True).stdout)
    return dict(umbral=round(thr, 1), antes=round(dur, 2), despues=round(nueva, 2),
                corte_inicio=round(a, 2), corte_final=round(dur - b, 2), pausas_acortadas=pausas)


if __name__ == '__main__':
    src_dir, out_dir = sys.argv[1], sys.argv[2]
    os.makedirs(out_dir, exist_ok=True)
    informe = {}
    for orig, (nombre, tipo) in MAPA.items():
        informe[orig] = dict(web=nombre, tipo=tipo, **recortar(os.path.join(src_dir, orig), os.path.join(out_dir, nombre), tipo))
    print(json.dumps(informe, ensure_ascii=False, indent=1))
