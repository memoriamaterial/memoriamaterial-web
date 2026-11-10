"""Reemplaza en docs/index.html todas las fichas de relato por las que genera tools/relato.py."""
import json, re, subprocess, sys
R = json.loads(subprocess.run([sys.executable, 'tools/relato.py'], capture_output=True, text=True, check=True).stdout)
p = 'docs/index.html'
s = open(p).read()
for sid, html in R.items():
    m = re.search(r'<section id="%s"[^>]*>' % sid, s)
    a = s.index('<div class="relato"', m.end())
    b = s.index('\n  </div>\n</div>', a) + len('\n  </div>\n</div>')
    s = s[:a] + html + s[b:]
open(p, 'w').write(s)
print('fichas actualizadas:', ', '.join(R))
