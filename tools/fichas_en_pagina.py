"""Reemplaza en docs/index.html todas las fichas de relato por las que genera tools/relato.py."""
import json, re, subprocess, sys
R = json.loads(subprocess.run([sys.executable, 'tools/relato.py'], capture_output=True, text=True, check=True).stdout)
p = 'docs/index.html'
s = open(p).read()
ANTES = {'llave': '<div class="llave" data-world="llave"', 'mate': '<div class="mate1" data-world="mate"', 'cuaderno': '<div class="cuaderno" data-world="cuaderno"'}
for sid, html in R.items():
    if sid.startswith('mundo:'):
        k = sid.split(':')[1]
        ini, fin = f'<!-- mundo:{k} -->', f'<!-- /mundo:{k} -->'
        if ini in s:
            a = s.index(ini); b = s.index(fin) + len(fin)
            s = s[:a] + html + s[b:]
        else:  # primera vez: el bloque va justo antes de la interacción del mundo
            a = s.index(ANTES[k])
            s = s[:a] + html + '\n\n      ' + s[a:]
        continue
    m = re.search(r'<section id="%s"[^>]*>' % sid, s)
    a = s.index('<div class="relato"', m.end())
    b = s.index('\n  </div>\n</div>', a) + len('\n  </div>\n</div>')
    s = s[:a] + html + s[b:]
open(p, 'w').write(s)
print('fichas actualizadas:', ', '.join(R))
