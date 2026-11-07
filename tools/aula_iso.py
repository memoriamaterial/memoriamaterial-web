"""Genera la ilustración isométrica del aula (espacio físico) para la web.

Uso:  python3 tools/aula_iso.py > /ruta/salida.svg
Imprime un <svg> inline con clases para animar y un comentario JSON con la
posición (en %) de cada punto interactivo. Colores solo de brief/paleta.md.
"""
import json, math

V, C, Y, CE, F = '#352A72', '#F2EDD4', '#FCB614', '#3CC5F2', '#ED4380'
U = 34                        # tamaño de la unidad
CX, SY, K = math.cos(math.radians(30)) * U, math.sin(math.radians(30)) * U, U * 0.92
W, D, H = 12, 10, 4.7         # aula: ancho (x), profundidad (y), alto (z)

def P(x, y, z=0):
    return ((x - y) * CX, (x + y) * SY - z * K)

def pts(*ps):
    return ' '.join(f'{a:.1f},{b:.1f}' for a, b in (P(*p) for p in ps))

def poly(cls, *ps, extra=''):
    return f'<polygon class="{cls}" points="{pts(*ps)}" {extra}/>'

def line(cls, a, b, extra=''):
    (x1, y1), (x2, y2) = P(*a), P(*b)
    return f'<line class="{cls}" x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" {extra}/>'

def box(cls, x, y, z, w, d, h):
    """Caja isométrica: tapa, frente (+y) y lateral (+x)."""
    top = poly(f'{cls} f-top', (x, y, z + h), (x + w, y, z + h), (x + w, y + d, z + h), (x, y + d, z + h))
    front = poly(f'{cls} f-front', (x, y + d, z), (x + w, y + d, z), (x + w, y + d, z + h), (x, y + d, z + h))
    side = poly(f'{cls} f-side', (x + w, y, z), (x + w, y + d, z), (x + w, y + d, z + h), (x + w, y, z + h))
    return top + front + side

out, spots = [], {}

# --- definiciones --------------------------------------------------------------
out.append(f'''<defs>
  <filter id="aula-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="aula-soft" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="14"/></filter>
  <pattern id="aula-trama" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M0 10A10 10 0 0 1 20 10A10 10 0 0 0 40 10Z" fill="{C}" fill-opacity=".05"/><path d="M-20 30A10 10 0 0 1 0 30A10 10 0 0 0 20 30Z M20 30A10 10 0 0 1 40 30A10 10 0 0 0 60 30Z" fill="{C}" fill-opacity=".05"/></pattern>
  <linearGradient id="aula-wall" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="{C}" stop-opacity=".09"/><stop offset="1" stop-color="{C}" stop-opacity="0"/></linearGradient>
  <linearGradient id="aula-beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{C}" stop-opacity="0"/><stop offset="1" stop-color="{C}" stop-opacity=".22"/></linearGradient>
  <linearGradient id="aula-holo" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="{CE}" stop-opacity=".55"/><stop offset="1" stop-color="{CE}" stop-opacity="0"/></linearGradient>
  <radialGradient id="aula-pool" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="{C}" stop-opacity=".16"/><stop offset="1" stop-color="{C}" stop-opacity="0"/></radialGradient>
</defs>''')

# --- piso y paredes ------------------------------------------------------------
floor = [(0, 0, 0), (W, 0, 0), (W, D, 0), (0, D, 0)]
out.append('<g class="aula-room">')
out.append(poly('a-floor', *floor, extra=f'fill="{C}" fill-opacity=".035"'))
out.append(poly('a-floor-trama', *floor, extra='fill="url(#aula-trama)"'))
g = []
for i in range(1, W):
    g.append(line('a-grid', (i, 0, 0), (i, D, 0)))
for j in range(1, D):
    g.append(line('a-grid', (0, j, 0), (W, j, 0)))
out.append('<g class="a-grid-g">' + ''.join(g) + '</g>')
out.append(poly('a-wall', (0, 0, 0), (W, 0, 0), (W, 0, H), (0, 0, H), extra='fill="url(#aula-wall)"'))
out.append(poly('a-wall', (0, 0, 0), (0, D, 0), (0, D, H), (0, 0, H), extra='fill="url(#aula-wall)"'))
edges = [((0, D, 0), (0, 0, 0)), ((0, 0, 0), (W, 0, 0)), ((0, 0, 0), (0, 0, H)), ((0, 0, H), (W, 0, H)), ((0, 0, H), (0, D, H)),
         ((W, 0, 0), (W, D, 0)), ((W, D, 0), (0, D, 0)), ((W, 0, 0), (W, 0, H)), ((0, D, 0), (0, D, H))]
out.append('<g class="a-edges">' + ''.join(line('a-edge', a, b) for a, b in edges) + '</g>')
out.append('</g>')

# --- pantalla de proyección en la pared izquierda (x = 0) ------------------------
sy0, sy1, sz0, sz1 = 1.3, 5.7, 1.45, 4.05
out.append('<g class="aula-screen">')
# haz del proyector (desde el techo, hacia la pantalla)
proj = (6.6, 4.6, H - 0.25)
out.append(poly('a-beam', proj, (0, sy0, sz1), (0, sy1, sz1), extra='fill="url(#aula-beam)"'))
out.append(poly('a-beam', proj, (0, sy1, sz1), (0, sy1, sz0), (0, sy0, sz0), extra='fill="url(#aula-beam)" fill-opacity=".6"'))
out.append(box('a-proj', proj[0] - .35, proj[1] - .3, proj[2] - .05, .7, .6, .3))
out.append(poly('a-screen-glow', (0, sy0, sz0), (0, sy1, sz0), (0, sy1, sz1), (0, sy0, sz1), extra=f'fill="{F}" filter="url(#aula-soft)" opacity=".45"'))
out.append(poly('a-screen', (0, sy0, sz0), (0, sy1, sz0), (0, sy1, sz1), (0, sy0, sz1), extra=f'fill="{V}" stroke="{C}" stroke-width="1.6"'))
# contenido de la pantalla: el logo, en el plano de la pared
ox, oy = P(0, sy1, sz1)
sw, sh = sy1 - sy0, sz1 - sz0
out.append(f'<g transform="matrix({CX:.3f},{-SY:.3f},0,{K:.3f},{ox:.1f},{oy:.1f})">'
           f'<svg x=".35" y=".75" width="{sw - .7:.2f}" height="{sh - 1.5:.2f}" viewBox="0 0 710 216" preserveAspectRatio="xMidYMid meet"><use href="#logo-mark"/></svg></g>')
out.append('</g>')
spots['proyector'] = P(0, (sy0 + sy1) / 2, sz1 + .45)

# --- camino de luces LED (del tótem a las estaciones) -----------------------------
totem = (2.0, 7.4)
led = [(2.8, 7.7), (4.4, 8.2), (6.0, 7.6), (7.4, 7.1), (8.6, 7.4), (9.6, 7.9)]
pts_led = [P(*totem, 0)] + [P(x, y, 0) for x, y in led]
d = f'M{pts_led[0][0]:.1f} {pts_led[0][1]:.1f} ' + ' '.join(
    f'Q{pts_led[i][0]:.1f} {pts_led[i][1]:.1f} {(pts_led[i][0] + pts_led[i + 1][0]) / 2:.1f} {(pts_led[i][1] + pts_led[i + 1][1]) / 2:.1f}'
    for i in range(1, len(pts_led) - 1)) + f' L{pts_led[-1][0]:.1f} {pts_led[-1][1]:.1f}'
out.append(f'<g class="aula-led"><path class="a-led-glow" d="{d}" fill="none" stroke="{Y}" stroke-width="7" stroke-opacity=".18" stroke-linecap="round"/>'
           f'<path class="a-led" d="{d}" fill="none" stroke="{Y}" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 13" filter="url(#aula-glow)"/></g>')
spots['luces'] = P(5.0, 8.4, 0)

# --- estaciones: escritorio, monitor encendido, silla -----------------------------
desks = [(4.4, 1.6), (6.6, 3.2), (8.8, 4.8)]
out.append('<g class="aula-stations">')
for i, (x, y) in enumerate(desks):
    out.append(f'<g class="a-station" data-i="{i}">')
    out.append(f'<ellipse class="a-pool" cx="{P(x + 1.3, y + 1.6)[0]:.1f}" cy="{P(x + 1.3, y + 1.6)[1]:.1f}" rx="95" ry="48" fill="url(#aula-pool)"/>')
    out.append(box('a-desk', x, y, 0.95, 2.6, 1.3, .12))
    for lx, ly in ((x + .1, y + 1.15), (x + 2.4, y + 1.15), (x + 2.4, y + .05)):
        out.append(line('a-leg', (lx, ly, 0), (lx, ly, .95)))
    # monitor (mira hacia +y, hacia quien se sienta)
    mx0, mx1, my, mz0, mz1 = x + .55, x + 2.05, y + .35, 1.15, 2.05
    out.append(poly('a-mon-glow', (mx0, my, mz0), (mx1, my, mz0), (mx1, my, mz1), (mx0, my, mz1), extra=f'fill="{C}" filter="url(#aula-soft)" opacity=".5"'))
    out.append(poly('a-mon', (mx0, my, mz0), (mx1, my, mz0), (mx1, my, mz1), (mx0, my, mz1), extra=f'fill="{C}"'))
    # en pantalla: Unreal, las tres esferas
    for k, col in enumerate((Y, F, CE)):
        cx, cy = P(mx0 + .38 + k * .37, my, mz0 + .45 + (k % 2) * .18)
        out.append(f'<circle class="a-orb" cx="{cx:.1f}" cy="{cy:.1f}" r="3.2" fill="{col}"/>')
    out.append(line('a-stand', ((mx0 + mx1) / 2, my, 1.07), ((mx0 + mx1) / 2, my, mz0)))
    # silla
    out.append(box('a-chair', x + .9, y + 1.7, .55, .8, .7, .08))
    out.append(poly('a-chair f-front', (x + .9, y + 2.4, .63), (x + 1.7, y + 2.4, .63), (x + 1.7, y + 2.4, 1.35), (x + .9, y + 2.4, 1.35)))
    hx0, hy0 = P(x + 1.3, y + 2.05, 1.55)
    out.append(f'<g class="a-person"><ellipse cx="{hx0:.1f}" cy="{hy0 + 15:.1f}" rx="9" ry="12" fill="{C}" fill-opacity=".55"/><circle cx="{hx0:.1f}" cy="{hy0 - 3:.1f}" r="6.5" fill="{C}" fill-opacity=".8"/></g>')
    out.append('</g>')
out.append('</g>')
spots['estaciones'] = P(desks[1][0] + 1.3, desks[1][1] + .35, 2.5)

# --- Oculus, sobre la última estación ----------------------------------------------
ocx, ocy, ocz = desks[2][0] + 2.2, desks[2][1] + .9, 1.07
a, b = P(ocx, ocy, ocz + .15)
out.append(f'<g class="aula-oculus" filter="url(#aula-glow)"><rect x="{a - 13:.1f}" y="{b - 6:.1f}" width="26" height="12" rx="6" fill="none" stroke="{Y}" stroke-width="2.4"/>'
           f'<rect x="{a - 9:.1f}" y="{b - 3:.1f}" width="7" height="6" rx="2" fill="{Y}" fill-opacity=".5"/><rect x="{a + 2:.1f}" y="{b - 3:.1f}" width="7" height="6" rx="2" fill="{Y}" fill-opacity=".5"/></g>')
spots['oculus'] = (a, b - 18)

# --- tótem -------------------------------------------------------------------------
tx, ty = totem
base = P(tx, ty, 0); top = P(tx, ty, 2.35)
out.append(f'<g class="aula-totem">'
           f'<ellipse cx="{base[0]:.1f}" cy="{base[1]:.1f}" rx="46" ry="20" fill="{F}" opacity=".22" filter="url(#aula-soft)"/>'
           f'<path class="a-totem-body" d="M{top[0] - 9:.1f} {top[1]:.1f} L{top[0] + 9:.1f} {top[1]:.1f} L{base[0] + 17:.1f} {base[1]:.1f} L{base[0] - 17:.1f} {base[1]:.1f}Z" fill="{F}" filter="url(#aula-glow)"/>'
           f'<path d="M{top[0]:.1f} {top[1]:.1f} L{top[0] + 9:.1f} {top[1]:.1f} L{base[0] + 17:.1f} {base[1]:.1f} L{base[0]:.1f} {base[1]:.1f}Z" fill="{V}" opacity=".3"/>'
           f'<ellipse cx="{base[0]:.1f}" cy="{base[1]:.1f}" rx="17" ry="7" fill="{F}"/>'
           f'<ellipse class="a-totem-top" cx="{top[0]:.1f}" cy="{top[1]:.1f}" rx="21" ry="9" fill="{F}" stroke="{C}" stroke-width="1.2"/></g>')
spots['totem'] = (top[0], top[1] - 24)

# --- holograma, en una mesa cerca del tótem -------------------------------------------
hx, hy = 0.9, 9.1
out.append('<g class="aula-holo">')
out.append(box('a-holo-table', hx, hy - .4, .75, .9, .8, .08))
out.append(line('a-leg', (hx + .45, hy, 0), (hx + .45, hy, .75)))
hb, ht = P(hx + .45, hy, .85), P(hx + .45, hy, 2.6)
out.append(f'<path class="a-holo-beam" d="M{hb[0] - 4:.1f} {hb[1]:.1f} L{hb[0] + 4:.1f} {hb[1]:.1f} L{ht[0] + 22:.1f} {ht[1]:.1f} L{ht[0] - 22:.1f} {ht[1]:.1f}Z" fill="url(#aula-holo)"/>')
out.append(f'<g transform="translate({ht[0] - 14:.1f} {ht[1] - 18:.1f})"><g class="a-holo-icon" filter="url(#aula-glow)"><svg width="28" height="28" viewBox="0 0 48 48" style="color:{CE}"><use href="#i-ancla"/></svg></g></g>')
out.append('</g>')
spots['holograma'] = (ht[0], ht[1] - 30)

# --- límites y salida ------------------------------------------------------------------
xs, ys = [], []
for x in (0, W):
    for y in (0, D):
        for z in (0, H):
            px, py = P(x, y, z); xs.append(px); ys.append(py)
pad = 36
minx, maxx, miny, maxy = min(xs) - pad, max(xs) + pad, min(ys) - pad, max(ys) + pad
vw, vh = maxx - minx, maxy - miny
pos = {k: [round((x - minx) / vw * 100, 1), round((y - miny) / vh * 100, 1)] for k, (x, y) in spots.items()}
print(f'<!-- spots: {json.dumps(pos)} -->')
print(f'<svg class="aula-iso" viewBox="{minx:.0f} {miny:.0f} {vw:.0f} {vh:.0f}" role="img" aria-labelledby="aula-iso-t">'
      f'<title id="aula-iso-t">El aula: pantalla de proyección en la pared, el tótem con su camino de luces, el holograma y tres estaciones con las computadoras encendidas.</title>'
      + ''.join(out) + '</svg>')
