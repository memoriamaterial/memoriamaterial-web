/* ==========================================================================
   MEMORIA MATERIAL · Storyboard del tráiler
   Arma la página a partir de contenido.js y coreografía el scroll con
   GSAP + ScrollTrigger. Solo se animan transform y opacity.
   ========================================================================== */
(function () {
  "use strict";

  var D = window.STORYBOARD;
  var LOGO = window.MM_LOGO || "";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Dibujos geométricos de los objetos (viewBox 0 0 200 200) ---------- */
  var OBJ = {
    llave:
      "M20 100a42 42 0 1 0 84 0a42 42 0 1 0-84 0ZM45 100a17 17 0 1 1 34 0a17 17 0 1 1-34 0Z" +
      "M103.6 91H182V109H103.6ZM150 109H162V132H150ZM168 109H180V124H168Z",
    mate:
      "M60 64H140V78H60ZM52 80H148V112A48 48 0 0 1 52 112ZM82 160H118V168H82Z" +
      "M106 62L142 16L151 23L118 66Z",
    cuaderno:
      "M54 34H150Q158 34 158 42V162Q158 170 150 170H54Z" +
      "M61 52a5 5 0 1 0 10 0a5 5 0 1 0-10 0ZM61 72a5 5 0 1 0 10 0a5 5 0 1 0-10 0Z" +
      "M61 92a5 5 0 1 0 10 0a5 5 0 1 0-10 0ZM61 112a5 5 0 1 0 10 0a5 5 0 1 0-10 0Z" +
      "M61 132a5 5 0 1 0 10 0a5 5 0 1 0-10 0ZM61 152a5 5 0 1 0 10 0a5 5 0 1 0-10 0Z" +
      "M86 62H144V68H86ZM86 84H144V90H86ZM86 106H144V112H86ZM86 128H130V134H86Z"
  };
  function objSVG(name, cls) {
    return '<svg class="' + cls + '" viewBox="0 0 200 200" aria-hidden="true" focusable="false"><path d="' +
      (OBJ[name] || OBJ.llave) + '"/></svg>';
  }

  var COLORS = { amarillo: "#FCB614", celeste: "#3CC5F2", fucsia: "#ED4380" };
  var TRAMAS = ["ondas", "escamas", "diagonal"];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function secs(tc) { var p = String(tc).split(":"); return (+p[0]) * 60 + (+p[1]); }
  function fmt(t) {
    t = Math.max(0, Math.min(60, Math.round(t)));
    return String(Math.floor(t / 60)).padStart(2, "0") + ":" + String(t % 60).padStart(2, "0");
  }
  function pad2(n) { return String(n).padStart(2, "0"); }
  function fileName(p) { return String(p || "").split("/").pop(); }

  /* ======================================================================
     RENDER
     ====================================================================== */
  function panelHTML(p, sceneN, idx) {
    var color = p.color || "celeste";
    var tipo = p.tipo || "imagen";
    var frame;
    if (tipo === "texto") {
      frame = '<div class="frame-text"><span>' + esc(p.texto) + "</span></div>";
    } else if (tipo === "logo") {
      frame = '<div class="frame-logo">' + LOGO + "</div>";
    } else {
      frame =
        '<div class="ph" aria-hidden="true">' +
          '<i class="trama trama--' + TRAMAS[idx % 3] + '"></i>' +
          objSVG(p.objeto, "ph__obj") +
          '<span class="ph__file mono"><em>Reemplazar</em><strong>' + esc(fileName(p.imagen)) + "</strong></span>" +
        "</div>" +
        (p.imagen ? '<img src="' + esc(p.imagen) + '" alt="' + esc(p.nota) + '" decoding="async">' : "") +
        '<i class="panel__cut" aria-hidden="true"></i>';
    }
    var sound = p.voces
      ? '<p class="snd"><span class="tag">VOCES</span><ul class="voces">' +
          p.voces.map(function (v) { return "<li>" + esc(v) + "</li>"; }).join("") + "</ul></p>"
      : '<p class="snd"><span class="tag">SND</span><span class="snd__txt"><span class="wave" aria-hidden="true"><i></i><i></i><i></i><i></i></span>' +
          esc(p.sonido) + "</span></p>";

    return (
      '<figure class="panel c-' + esc(color) + '">' +
        '<div class="panel__bar mono"><b>' + esc(p.codigo) + "</b><span>" + esc(p.encuadre) + '</span><i class="panel__live"></i></div>' +
        '<div class="panel__box"><i class="panel__echo" aria-hidden="true"></i><div class="panel__frame">' + frame + "</div></div>" +
        '<figcaption class="panel__notes"><p><span class="tag">IMG</span><span>' + esc(p.nota) + "</span></p>" + sound + "</figcaption>" +
      "</figure>"
    );
  }

  var STAGES = {
    1: function () { return ""; },
    2: function () {
      return '<div class="scene__stage" aria-hidden="true">' +
        '<div class="grid-bg"><span></span></div>' +
        '<i class="shape shape--semi c-amarillo s2-cut s2-cut--semi"></i>' +
        '<i class="shape shape--quarter c-celeste s2-cut s2-cut--quarter"></i>' +
        '<i class="shape shape--pill c-fucsia s2-cut s2-cut--pill"></i>' +
        '<i class="trama trama--escamas c-celeste s2-cut s2-trama"></i>' +
        '<span class="c-amarillo">' + objSVG("llave", "s2-obj s2-obj--llave") + "</span>" +
        '<span class="c-fucsia">' + objSVG("mate", "s2-obj s2-obj--mate") + "</span>" +
        '<span class="c-celeste">' + objSVG("cuaderno", "s2-obj s2-obj--cuaderno") + "</span>" +
      "</div>" +
      '<i class="s2-cover" aria-hidden="true"></i>';
    },
    3: function () {
      return '<div class="scene__stage" aria-hidden="true"><div class="grid-bg"><span></span></div>' +
        '<i class="trama trama--diagonal s3-trama"></i><i class="shape shape--semi-down s3-semi"></i></div>';
    },
    4: function (e) {
      var p = e.planos[1] || {};
      return '<div class="scene__stage" aria-hidden="true"><div class="grid-bg"><span></span></div>' +
        '<div class="s4-shapes">' +
          '<i class="shape shape--semi c-amarillo"></i><i class="shape shape--quarter c-celeste"></i>' +
          '<i class="shape shape--circle c-fucsia"></i><i class="shape shape--semi-down c-celeste"></i>' +
          '<i class="shape shape--quarter c-fucsia"></i><i class="shape shape--semi c-amarillo"></i>' +
        "</div></div>" +
        '<div class="s4-wrap" aria-hidden="true">' + objSVG("llave", "s4-object") +
          '<div class="s4-lens"><i class="trama trama--ondas"></i>' +
            (p.imagen ? '<img src="' + esc(p.imagen) + '" alt="">' : "") +
            "<p>" + esc(e.detalleOculto || "") + "</p></div>" +
        "</div>";
    },
    5: function (e) {
      return '<div class="scene__stage" aria-hidden="true">' +
        '<div class="s5-wrap">' + objSVG("mate", "s5-sil") + objSVG("mate", "s5-obj") + '<div class="s5-shadow"></div></div>' +
        "</div>" +
        '<p class="silencio mono">' + esc(e.silencio || "— silencio —") + "</p>";
    },
    6: function (e) {
      var frags = "";
      var kinds = ["shape--semi c-amarillo", "shape--quarter c-celeste", "shape--pill c-fucsia", "shape--circle c-amarillo",
        "shape--semi-down c-fucsia", "shape--pill-l c-celeste", "shape--quarter c-amarillo", "shape--semi c-celeste",
        "shape--circle c-fucsia", "shape--bar c-celeste", "shape--semi-down c-amarillo", "shape--pill c-celeste"];
      kinds.forEach(function (k, i) {
        frags += '<i class="shape ' + k + ' s6-frag" style="width:' + (36 + (i * 17) % 70) + 'px"></i>';
      });
      ["llave", "mate", "cuaderno"].forEach(function (o, i) {
        frags += '<span class="s6-frag c-' + ["amarillo", "fucsia", "celeste"][i] + '" style="width:70px">' + objSVG(o, "s2-obj").replace('class="s2-obj"', 'class="s2-obj" style="position:static;width:100%"') + "</span>";
      });
      var words = String(e.textoEnPantalla || "").split(/\s+/).map(function (w) { return "<span>" + esc(w) + "</span>"; }).join(" ");
      return '<div class="scene__stage" aria-hidden="true"><div class="grid-bg"><span></span></div></div>' +
        '<p class="s6-question" aria-hidden="true">' + words + "</p>" +
        '<div class="s6-frags" aria-hidden="true">' + frags + "</div>" +
        '<div class="s6-final">' + LOGO + "</div>";
    }
  };

  function sceneHTML(e, i) {
    var n = i + 1;
    var lines = e.vo.map(function (l) { return '<p class="vo__line"><span>' + esc(l) + "</span></p>"; }).join("");
    return (
      '<section class="scene scene--' + n + '" id="' + esc(e.id) + '" data-n="' + n + '" aria-labelledby="' + esc(e.id) + '-t">' +
        '<div class="scene__pin">' +
          STAGES[n](e) +
          '<header class="scene__head">' +
            '<p class="scene__num mono">Escena ' + pad2(n) + " <span>/ " + pad2(D.escenas.length) + "</span></p>" +
            '<h2 class="scene__title" id="' + esc(e.id) + '-t">' + esc(e.titulo) + "</h2>" +
            '<p class="scene__tc mono" aria-label="Timecode ' + esc(e.inicio) + " a " + esc(e.fin) + '"><span>' + esc(e.inicio) + "</span><i></i><span>" + esc(e.fin) + "</span></p>" +
          "</header>" +
          '<div class="scene__panels" style="--cols:' + Math.min(e.planos.length, 4) + '">' +
            e.planos.map(function (p, k) { return panelHTML(p, n, k); }).join("") +
          "</div>" +
          '<blockquote class="scene__vo"><p class="vo__label">Voz en off</p>' + lines + "</blockquote>" +
        "</div>" +
      "</section>"
    );
  }

  function render() {
    $$("[data-bind]").forEach(function (el) { el.textContent = D[el.getAttribute("data-bind")] || ""; });
    $$("[data-logo]").forEach(function (el) { el.insertAdjacentHTML("beforeend", LOGO); });

    $("#escenas").innerHTML = D.escenas.map(sceneHTML).join("");

    // Imágenes: si falta el archivo queda el placeholder diseñado
    $$(".panel__frame img, .s4-lens img").forEach(function (img) {
      var host = img.parentNode;
      var ok = function () { host.classList.add("has-img"); };
      var fail = function () { img.remove(); };
      if (img.complete && img.naturalWidth) ok();
      else if (img.complete) fail();
      img.addEventListener("load", ok);
      img.addEventListener("error", fail);
    });

    // Línea de tiempo
    var accs = ["#F2EDD4", "#FCB614", "#ED4380", "#3CC5F2", "#F2EDD4", "#FCB614"];
    $(".timeline__track").innerHTML = D.escenas.map(function (e, i) {
      var dur = secs(e.fin) - secs(e.inicio);
      return '<li class="timeline__seg" style="--dur:' + dur + ";--acc-seg:" + accs[i % accs.length] + '">' +
        '<button type="button" data-go="' + i + '" aria-label="Ir a la escena ' + (i + 1) + ", " + esc(e.titulo) + ", " + esc(e.inicio) + " a " + esc(e.fin) + '">' +
          '<span class="seg__label mono"><b>' + pad2(i + 1) + "</b><span>" + esc(e.titulo) + "</span></span>" +
          '<span class="seg__rail"><i class="seg__fill"></i></span>' +
        "</button></li>";
    }).join("");

    // Cierre
    var c = D.cierre || {};
    var hl = (c.resaltar || []).map(function (w) { return w.toLowerCase(); });
    $(".cierre__pregunta").innerHTML = String(c.pregunta || "").split(/\s+/).map(function (w) {
      var clean = w.toLowerCase().replace(/[¿?¡!.,]/g, "");
      var k = hl.indexOf(clean);
      return '<span class="w' + (k > -1 ? " hl-" + (k % 2) : "") + '">' + esc(w) + "</span>";
    }).join(" ");
    $(".ficha__datos").innerHTML = (c.ficha || []).map(function (f) {
      return "<dt>" + esc(f.etiqueta) + "</dt><dd>" + esc(f.valor) + "</dd>";
    }).join("");
    $(".ficha__equipo ul").innerHTML = (c.equipo || []).map(function (m) {
      return "<li>" + esc(m.nombre) + "<span>" + esc(m.rol) + "</span></li>";
    }).join("");
    $(".ficha__docentes ul").innerHTML = (c.docentes || []).map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("");
  }

  render();

  /* ======================================================================
     SIN GSAP (por ejemplo, si falta la carpeta vendor): queda la versión estática
     ====================================================================== */
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger, window.ScrollToPlugin);
  ScrollTrigger.config({ ignoreMobileResize: true });

  var scenes = $$(".scene");
  var sceneData = D.escenas.map(function (e) { return { start: secs(e.inicio), dur: secs(e.fin) - secs(e.inicio) }; });
  var segs = $$(".timeline__seg");
  var fills = $$(".seg__fill");
  var nowEl = $(".timeline__now");
  var progressST = []; // un ScrollTrigger por escena (se reemplaza según el modo)
  var reduced = false;

  /* ---------- Línea de tiempo: progreso global ---------- */
  var lastActive = -1, lastTxt = "";
  function updateBar() {
    var t = 0, active = -1;
    progressST.forEach(function (st, i) {
      if (!st) return;
      var p = st.progress;
      fills[i].style.transform = "scaleX(" + p.toFixed(4) + ")";
      if (p > 0) { t = sceneData[i].start + p * sceneData[i].dur; active = i; }
      if (p > 0 && p < 1) active = i;
    });
    var txt = fmt(t);
    if (txt !== lastTxt) { nowEl.textContent = txt; lastTxt = txt; }
    if (active !== lastActive) {
      segs.forEach(function (s, i) { s.classList.toggle("is-active", i === active); });
      lastActive = active;
    }
  }
  $(".timeline__track").addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-go]");
    if (!b) return;
    var st = progressST[+b.getAttribute("data-go")];
    if (!st) return;
    var y = st.start + 2;
    if (reduced) window.scrollTo(0, y);
    else gsap.to(window, { scrollTo: { y: y, autoKill: true }, duration: 1.2, ease: "power2.inOut" });
    var target = scenes[+b.getAttribute("data-go")];
    if (target) target.setAttribute("tabindex", "-1");
  });

  /* ---------- Helpers de coreografía ---------- */
  var rnd = gsap.utils.random;

  function prepVO(sec) {
    var spans = $$(".vo__line > span", sec);
    gsap.set(spans, { yPercent: 110, opacity: 0 });
    gsap.set($(".vo__label", sec), { opacity: 0 });
    return spans;
  }
  function showLine(tl, sec, spans, j, at) {
    if (j === 0) tl.to($(".vo__label", sec), { opacity: 0.7, duration: 0.3 }, at);
    tl.to(spans[j], { yPercent: 0, opacity: 1, duration: 0.55, ease: "power3.out" }, at);
    if (j > 0) tl.to(spans.slice(0, j), { opacity: 0.55, duration: 0.4 }, at);
  }
  // Viñeta: en compu se suman en fila; en celular se reemplazan como un mazo
  function prepPanels(sec, mobile) {
    var panels = $$(".panel", sec);
    gsap.set(panels, { opacity: 0, y: mobile ? 24 : 36 });
    return panels;
  }
  function showPanel(tl, panels, i, at, mobile, from) {
    var p = panels[i];
    var inAt = mobile && i > 0 ? at + 0.2 : at;
    tl.to(p, { opacity: 1, y: 0, x: 0, rotation: 0, scale: 1, duration: mobile ? 0.4 : 0.6, ease: "power3.out" }, inAt);
    tl.to($(".panel__live", p), { scaleX: 1, duration: 0.5, ease: "power2.out" }, at + 0.1);
    if (i > 0) {
      tl.to($(".panel__live", panels[i - 1]), { scaleX: 0, duration: 0.3 }, at);
      if (mobile) tl.to(panels[i - 1], { opacity: 0, y: -18, duration: 0.25, ease: "power2.in" }, at - 0.05);
    }
  }
  function headIn(tl, sec, at) {
    var h = $(".scene__head", sec);
    tl.fromTo(h.children, { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.4, ease: "power2.out" }, at || 0);
  }
  function pinTL(sec, steps, scrub) {
    return gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: sec, start: "top top", pin: true, scrub: scrub == null ? 0.7 : scrub,
        end: function () { return "+=" + Math.round(window.innerHeight * steps); },
        invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: updateBar, onRefresh: updateBar
      }
    });
  }

  /* ---------- Escena por escena ---------- */
  var SCENE_FX = {
    // E1 · calma: cada objeto entra con su línea
    1: function (sec, m) {
      var panels = prepPanels(sec, m), vo = prepVO(sec);
      var tl = pinTL(sec, 2.6);
      headIn(tl, sec, 0);
      panels.forEach(function (p, i) {
        showPanel(tl, panels, i, 0.3 + i * 1, m);
        if (vo[i]) showLine(tl, sec, vo, i, 0.45 + i * 1);
      });
      tl.to({}, { duration: 0.6 });
      return tl;
    },

    // E2 · lo cotidiano se achica en un punto y aparece la identidad
    2: function (sec, m) {
      var panels = prepPanels(sec, m), vo = prepVO(sec);
      var cover = $(".s2-cover", sec);
      var objs = $$(".s2-obj", sec), cuts = $$(".s2-cut", sec);
      gsap.set(cover, { xPercent: -50, yPercent: -50, scale: 1 });
      gsap.set($(".scene__head", sec).children, { opacity: 0 });
      gsap.set(objs, { scale: 0.35, rotation: function (i) { return [-25, 18, -12][i]; }, opacity: 0, transformOrigin: "50% 50%" });
      gsap.set(cuts[0], { yPercent: 105 });
      gsap.set(cuts[1], { scale: 0 });
      gsap.set(cuts[2], { xPercent: -105 });
      gsap.set(cuts[3], { xPercent: 60, opacity: 0 });
      gsap.set(panels, { rotation: function (i) { return [-8, 6, -4][i] || 0; }, scale: 1.25 });

      var tl = pinTL(sec, 3.2);
      tl.to(cover, { scale: 0, duration: 0.9, ease: "power3.inOut" }, 0);
      tl.to(objs, { opacity: 1, duration: 0.3, stagger: 0.1 }, 0.35);
      tl.to(objs, { scale: m ? 1.1 : 1.35, rotation: function (i) { return [32, -24, 20][i]; }, x: function (i) { return [-40, 30, 50][i]; }, duration: 3.6, ease: "power1.inOut" }, 0.35);
      headIn(tl, sec, 0.7);
      tl.to(cuts[0], { yPercent: 0, duration: 0.6, ease: "power3.out" }, 0.7);
      tl.to(cuts[2], { xPercent: 0, duration: 0.6, ease: "power3.out" }, 0.85);
      tl.to(cuts[1], { scale: 1, duration: 0.6, ease: "back.out(1.6)" }, 1.0);
      tl.to(cuts[3], { xPercent: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, 1.15);
      panels.forEach(function (p, i) { showPanel(tl, panels, i, 1.0 + i * 0.9, m); });
      showLine(tl, sec, vo, 0, 1.1);
      if (vo[1]) showLine(tl, sec, vo, 1, 2.2);
      tl.to({}, { duration: 0.5 });
      return tl;
    },

    // E3 · tres mundos en recortes, cada uno desde un lado distinto, con eco
    3: function (sec, m) {
      var panels = prepPanels(sec, m), vo = prepVO(sec);
      var from = m ? [{ x: -40 }, { x: 40 }, { x: -40 }] : [{ x: -140, rotation: -4 }, { y: 140, rotation: 3 }, { x: 140, rotation: 4 }];
      panels.forEach(function (p, i) { gsap.set(p, from[i] || {}); gsap.set($(".panel__echo", p), { x: 0, y: 0 }); });
      var tl = pinTL(sec, 3);
      headIn(tl, sec, 0);
      tl.fromTo($(".s3-trama", sec), { yPercent: 40 }, { yPercent: -30, duration: 3.6 }, 0);
      tl.fromTo($(".s3-semi", sec), { yPercent: -100 }, { yPercent: 0, duration: 0.7, ease: "power3.out" }, 0.2);
      panels.forEach(function (p, i) {
        var at = 0.3 + i * 0.95;
        showPanel(tl, panels, i, at, m);
        tl.to($(".panel__echo", p), { x: 10, y: 10, duration: 0.5, ease: "power2.out" }, at + 0.35);
      });
      showLine(tl, sec, vo, 0, 0.4);
      if (vo[1]) showLine(tl, sec, vo, 1, 2.4);
      tl.to({}, { duration: 0.6 });
      return tl;
    },

    // E4 · el objeto gira, la lupa revela el detalle, las formas se reordenan; corte seco al final
    4: function (sec, m) {
      var panels = prepPanels(sec, m), vo = prepVO(sec);
      var obj = $(".s4-object", sec), lens = $(".s4-lens", sec), wrap = $(".s4-wrap", sec);
      var shapes = $$(".s4-shapes .shape", sec);
      gsap.set(obj, { transformOrigin: "50% 50%", rotation: 0, scale: m ? 0.9 : 1 });
      gsap.set(lens, { scale: 0, opacity: 0 });
      gsap.set(shapes, {
        x: function () { return rnd(-window.innerWidth * 0.5, -40); },
        y: function () { return rnd(-window.innerHeight * 0.6, -60); },
        rotation: function () { return rnd(-180, 180); }
      });
      var tl = pinTL(sec, 3.6, 0.9);
      headIn(tl, sec, 0);
      tl.to(obj, { rotation: -205, scale: m ? 1.05 : 1.2, x: m ? 0 : "-6vw", y: m ? 0 : "4svh", duration: 3.2, ease: "power1.inOut" }, 0.1);
      if (m) {
        tl.to(wrap, { opacity: 0, duration: 0.3 }, 1.95);
        tl.to(lens, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.4)" }, 1.0);
        showPanel(tl, panels, 0, 2.35, m);
        if (panels[1]) showPanel(tl, panels, 1, 3.05, m);
        if (panels[2]) showPanel(tl, panels, 2, 3.75, m);
      } else {
        tl.to(lens, { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.4)" }, 1.2);
        showPanel(tl, panels, 0, 0.3, m);
        if (panels[1]) showPanel(tl, panels, 1, 1.4, m);
        if (panels[2]) showPanel(tl, panels, 2, 2.3, m);
      }
      tl.to(shapes, { x: 0, y: 0, rotation: 0, duration: 0.9, stagger: 0.08, ease: "power3.inOut" }, 2.1);
      showLine(tl, sec, vo, 0, 0.35);
      if (vo[1]) showLine(tl, sec, vo, 1, 1.5);
      tl.to({}, { duration: 0.7 });
      // Corte seco: todo desaparece de golpe y queda el violeta vacío
      tl.to(sec.querySelector(".scene__pin").children, { opacity: 0, duration: 0.01 });
      tl.to({}, { duration: 0.35 });
      return tl;
    },

    // E5 · silencio: corte, silueta, mucho vacío
    5: function (sec, m) {
      var panels = prepPanels(sec, m), vo = prepVO(sec);
      var objFill = $(".s5-obj", sec), sil = $(".s5-sil", sec), quiet = $(".silencio", sec);
      gsap.set($(".scene__head", sec), { opacity: 0 });
      gsap.set(sil, { opacity: 0 });
      gsap.set(quiet, { opacity: 0, xPercent: -50 });
      gsap.set(panels, { y: 0 });
      var tl = pinTL(sec, 3.2, 0.4);
      tl.to({}, { duration: 0.35 });
      tl.to(objFill, { opacity: 0, duration: 0.01 }, 0.35);  // desaparece sin transición
      tl.to(sil, { opacity: 1, duration: 0.01 }, 0.35);
      tl.to(quiet, { opacity: 0.85, duration: 0.6, ease: "power1.inOut" }, 0.7);
      tl.to({}, { duration: 1 }, 1.3);           // la pausa
      tl.to($(".scene__head", sec), { opacity: 1, duration: 0.5 }, 2.0);
      showLine(tl, sec, vo, 0, 2.3);
      if (m) {
        // En celular la silueta deja lugar a las viñetas
        tl.to([$(".s5-wrap", sec), quiet], { opacity: 0, duration: 0.3 }, 2.8);
        showPanel(tl, panels, 0, 3.0, m);
        if (panels[1]) showPanel(tl, panels, 1, 3.7, m);
      } else {
        tl.to(panels, { opacity: 0.9, y: 0, duration: 0.6, stagger: 0.25 }, 2.9);
      }
      tl.to({}, { duration: 0.6 });
      return tl;
    },

    // E6 · todo converge en el logo
    6: function (sec, m) {
      var panels = prepPanels(sec, m), vo = prepVO(sec);
      var q = $$(".s6-question span", sec);
      var frags = $$(".s6-frag", sec);
      var pieces = $$(".s6-final .mm-piece", sec), tag = $$(".s6-final .mm-tag", sec);
      var W = window.innerWidth, H = window.innerHeight;
      gsap.set(q, { yPercent: 120, opacity: 0 });
      gsap.set(frags, {
        xPercent: -50, yPercent: -50,
        x: function () { return rnd(-W * 0.55, W * 0.55); },
        y: function () { return rnd(-H * 0.5, H * 0.5); },
        rotation: function () { return rnd(-160, 160); }, opacity: 0, scale: 1
      });
      gsap.set(pieces, {
        transformOrigin: "50% 50%",
        x: function () { return rnd(-420, 420); }, y: function () { return rnd(-260, 260); },
        rotation: function () { return rnd(-120, 120); }, opacity: 0
      });
      gsap.set(tag, { opacity: 0, y: 12 });

      var tl = pinTL(sec, 5.4, 0.8);
      headIn(tl, sec, 0);
      panels.forEach(function (p, i) { showPanel(tl, panels, i, 0.3 + i * 0.75, m); });
      showLine(tl, sec, vo, 0, 0.35);
      if (vo[1]) showLine(tl, sec, vo, 1, 1.6);
      // Se despeja la pantalla
      var ui = [$(".scene__head", sec), $(".scene__panels", sec), $(".scene__vo", sec)];
      tl.to(ui, { opacity: 0, y: -24, duration: 0.5, ease: "power2.in" }, 3.4);
      // Texto en pantalla
      tl.to(q, { yPercent: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: "power3.out" }, 3.8);
      tl.to(frags, { opacity: 1, duration: 0.4, stagger: 0.03 }, 4.4);
      tl.to(q, { opacity: 0, duration: 0.4, stagger: 0.02 }, 5.2);
      // Los fragmentos convergen y el logo se arma
      tl.to(frags, { x: 0, y: 0, rotation: 0, scale: 0.2, duration: 1, stagger: 0.02, ease: "power3.in" }, 5.3);
      tl.to(frags, { opacity: 0, duration: 0.2 }, 6.25);
      tl.to(pieces, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.9, stagger: { each: 0.02, from: "random" }, ease: "power3.out" }, 6.1);
      tl.to(tag, { opacity: 1, y: 0, duration: 0.5, stagger: 0.01 }, 7.0);
      tl.to({}, { duration: 0.8 });
      return tl;
    }
  };

  /* ---------- Portada y cierre ---------- */
  function coverIntro() {
    var pieces = $$(".cover__logo .mm-piece"), tag = $$(".cover__logo .mm-tag");
    var tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.from(pieces, {
      x: function () { return rnd(-160, 160); }, y: function () { return rnd(-120, 120); },
      rotation: function () { return rnd(-60, 60); }, opacity: 0, transformOrigin: "50% 50%",
      duration: 1.3, stagger: { each: 0.025, from: "random" }
    }, 0.1)
      .from(tag, { opacity: 0, y: 10, duration: 0.6, stagger: 0.01 }, 0.9)
      .from(".cover__kicker > *", { opacity: 0, y: 12, duration: 0.6, stagger: 0.08 }, 0.6)
      .from(".cover__meta > *", { opacity: 0, y: 16, duration: 0.7, stagger: 0.1 }, 1.0)
      .from(".cover__shapes > *", { opacity: 0, scale: 0.6, duration: 1, stagger: 0.08, ease: "power3.out" }, 0.2)
      .from(".cover__hint", { opacity: 0, duration: 0.6 }, 1.5);

    gsap.to(".cover__inner", {
      yPercent: -18, opacity: 0.15, ease: "none",
      scrollTrigger: { trigger: ".cover", start: "top top", end: "bottom top", scrub: true }
    });
    gsap.to(".cover__shapes > *", {
      y: function (i) { return [-120, 80, -60, -160][i]; }, rotation: function (i) { return [0, 200, 0, 0][i]; }, ease: "none",
      scrollTrigger: { trigger: ".cover", start: "top top", end: "bottom top", scrub: true }
    });
  }
  function closing() {
    var words = $$(".cierre__pregunta .w");
    gsap.from(words, {
      yPercent: 60, opacity: 0, duration: 0.8, stagger: 0.05, ease: "power3.out",
      scrollTrigger: { trigger: ".cierre__pregunta", start: "top 75%", toggleActions: "play none none reverse" }
    });
    gsap.from(".cierre__logo .mm-piece", {
      x: function () { return rnd(-80, 80); }, y: function () { return rnd(-60, 60); }, opacity: 0,
      rotation: function () { return rnd(-40, 40); }, transformOrigin: "50% 50%",
      duration: 1, stagger: { each: 0.02, from: "random" }, ease: "expo.out",
      scrollTrigger: { trigger: ".cierre__logo", start: "top 80%", toggleActions: "play none none reverse" }
    });
    gsap.from(".ficha > *", {
      y: 24, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power2.out",
      scrollTrigger: { trigger: ".ficha", start: "top 85%", toggleActions: "play none none reverse" }
    });
  }

  /* ======================================================================
     MODOS: compu / celular / movimiento reducido
     ====================================================================== */
  var mm = gsap.matchMedia();
  mm.add({
    desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
    reduce: "(prefers-reduced-motion: reduce)"
  }, function (ctx) {
    var c = ctx.conditions;
    reduced = !!c.reduce;
    if (c.reduce) {
      document.documentElement.classList.remove("motion");
      progressST = scenes.map(function (sec) {
        return ScrollTrigger.create({ trigger: sec, start: "top 55%", end: "bottom 55%", onUpdate: updateBar, onRefresh: updateBar });
      });
      updateBar();
      return;
    }
    document.documentElement.classList.add("motion");
    coverIntro();
    progressST = scenes.map(function (sec) {
      var n = +sec.getAttribute("data-n");
      var tl = SCENE_FX[n](sec, !!c.mobile);
      return tl.scrollTrigger;
    });
    closing();
    ScrollTrigger.refresh();
    updateBar();
    return function () { document.documentElement.classList.remove("motion"); };
  });

  // Recalcular cuando cargan las fuentes (cambian alturas de texto)
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
})();
