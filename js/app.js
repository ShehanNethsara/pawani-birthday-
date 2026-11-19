"use strict";
var $ = function (s) { return document.querySelector(s); };
var scenes = [].slice.call(document.querySelectorAll(".scene")), cur = 0, T = 0, DK = 1;
var NAMES = scenes.map(function (s) { return s.dataset.s; });
var sn = function () { return NAMES[cur]; };
var MOBILE = Math.min(innerWidth, innerHeight) < 700;

/* ---------- photos ----------
   New names: img/p1.jpg ... img/p46.jpg
   Old names: img/1 (1).jpeg ...   (auto-detected, whichever exists) */
var OLD = [1,2,3,4,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,47,48,50,53,54,55];
var IMGS = [];
function pickPhotos(done) {
  var t = new Image();
  t.onload = function () { for (var q = 1; q <= 46; q++) IMGS.push("img/p" + q + ".jpg"); done(); };
  t.onerror = function () { IMGS = OLD.map(function (n) { return "img/" + encodeURI("1 (" + n + ").jpeg"); }); done(); };
  t.src = "img/p1.jpg";
}
// 0-9 carousel | 10-17 polaroids | 18-25 floating | 26-37 slideshow | 38-45 finale

var MSG = "Chuti Manika... 💖\n\nYou are the best thing that ever happened to me. You turn my ordinary days into beautiful ones, and you make my heart smile without even trying.\n\nOn your special day, I wish you endless happiness, laughter and every dream you hold close to your heart 🌹\n\nI love you so much! ❤️";
var CAP = ["Our first memory", "That smile 😍", "Cutest moment", "Forever favourite", "My happy place", "Pure magic", "Just you", "Always us"];
var KC = ["You light up every room", "My favourite smile", "Pretty as always", "Moments I will never forget", "You and me, always", "My sunshine", "Simply beautiful", "My heart is yours", "Every day with you is a gift", "Look at that glow", "My favourite person", "Forever and always"];
var SKCAP = ["Every line, drawn with love 💗", "My favourite face in the world", "Even in neon, you shine ✨", "Sketched by my heart", "Beautiful in every colour", "Simply perfect"];
var SKI = [0, 4, 8, 12, 20, 30];   // photos used on the neon page (0 = first photo, 45 = last)

/* funny Yes / No texts */
var NOQ = ["Wrong button! 😂", "Your finger slipped, right? 😏", "Are you sure about that? 🥺", "Think again, Chuti Manika... 🤨",
  "The No button is scared of you 😨", "I can do this all day 😎", "Okay now you are just playing 😤", "Last chance... pretty please? 🥹", "Fine, the No button gave up 😴"];
var EMO = ["😏", "🥺", "🥺", "😢", "😭", "😤", "😡", "😭", "🤣"];

/* ---------- navigation ---------- */
var dots = $("#dots");
scenes.forEach(function () { dots.appendChild(document.createElement("i")); });

function resize() {
  var cf = $("#cf"); cf.width = innerWidth; cf.height = innerHeight;
  ["c1", "c2", "c3"].forEach(function (id) {
    var c = $("#" + id); c.width = c.clientWidth || innerWidth; c.height = c.clientHeight || innerHeight;
  });
}
addEventListener("resize", resize);

var ENTER = {
  yesno: function () { resetYN(); },
  iluv: function () { buildSprites(); confetti(50); },
  spark: function () { initSpark(); },
  msg: function () { typeIt(); },
  sketch: function () { startSketch(0); },
  kb: function () { startShow(); },
  letter: function () { $("#env").classList.remove("open"); },
  game: function () { startGame(); },
  fin: function () { initGalaxy(); confetti(); setTimeout(confetti, 900); }
};

function go(n) {
  if (n >= scenes.length) n = 0;
  scenes.forEach(function (s, i) { s.classList.toggle("on", i == n); });
  [].forEach.call(dots.children, function (d, i) { d.className = i == n ? "a" : ""; });
  cur = n; resize(); stopGame(); skToken++; kbTok++;
  var nb = $("#next"); nb.style.display = (n && sn() != "yesno") ? "block" : "none";
  nb.textContent = n == scenes.length - 1 ? "Again 🔁" : "Next 💗";
  if (ENTER[sn()]) ENTER[sn()]();
}

/* ---------- confetti ---------- */
var P = [], cx = $("#cf").getContext("2d");
function confetti(num) {
  var n = num || (MOBILE ? 80 : 130);
  for (var i = 0; i < n; i++) P.push({
    x: innerWidth / 2, y: innerHeight / 2, vx: (Math.random() - .5) * 16, vy: Math.random() * -14 - 2,
    c: "hsl(" + (320 + Math.random() * 40) + ",90%," + (60 + Math.random() * 25) + "%)", s: Math.random() * 7 + 4, l: 140
  });
}

/* ---------- floating hearts (light pages) ---------- */
setInterval(function () {
  if (["gate", "yesno", "cake", "letter"].indexOf(sn()) < 0) return;
  var h = document.createElement("div");
  h.className = "fh"; h.textContent = ["💖", "💗", "💕", "🌸"][Math.floor(Math.random() * 4)];
  h.style.left = Math.random() * 100 + "vw"; h.style.fontSize = (14 + Math.random() * 22) + "px";
  h.style.animationDuration = (5 + Math.random() * 5) + "s";
  document.body.appendChild(h); setTimeout(function () { h.remove(); }, 10000);
}, 650);

/* ---------- falling rose petals (photo pages) ---------- */
var PETAL_PAGES = ["ring", "board", "msg", "kb", "fin"];
setInterval(function () {
  if (PETAL_PAGES.indexOf(sn()) < 0) return;
  var p = document.createElement("div");
  p.className = "petal"; p.textContent = ["🌹", "🌸", "🌺", "🌷", "🌹"][Math.floor(Math.random() * 5)];
  p.style.left = Math.random() * 100 + "vw"; p.style.fontSize = (16 + Math.random() * 16) + "px";
  p.style.animationDuration = (7 + Math.random() * 5) + "s";
  p.style.setProperty("--dx", (Math.random() * 160 - 80) + "px");
  document.body.appendChild(p); setTimeout(function () { p.remove(); }, 13000);
}, MOBILE ? 750 : 520);

/* ---------- FUNNY YES / NO ---------- */
var noTries = 0, ynDone = false;
var noBtn = $("#nob"), yesBtn = $("#yesb"), ynZone = $("#yn");
function resetYN() {
  noTries = 0; ynDone = false;
  noBtn.textContent = "No 😈"; noBtn.style.left = "60%"; noBtn.style.top = "70px"; noBtn.style.background = "";
  noBtn.onclick = dodge; noBtn.onmouseover = dodge;
  yesBtn.style.transform = "scale(1)";
  $("#ynemo").textContent = "🥺"; $("#ynmsg").textContent = "Be honest... 😏";
}
function yesClick(e) {
  if (e && e.preventDefault) e.preventDefault();
  if (ynDone) return; ynDone = true;
  $("#ynemo").textContent = "🥰"; $("#ynmsg").textContent = "I knew it! 😍 Get ready for your surprise...";
  confetti(); setTimeout(confetti, 500);
  setTimeout(function () { if (sn() == "yesno") go(cur + 1); }, 2000);
}
function dodge(e) {
  if (e && e.preventDefault) e.preventDefault();
  if (ynDone) return;
  noTries++;
  if (noTries >= 9) {
    noBtn.textContent = "Yes 😏"; noBtn.style.left = "60%"; noBtn.style.top = "70px";
    noBtn.style.background = "#ff4d8d"; $("#ynmsg").textContent = NOQ[8]; $("#ynemo").textContent = EMO[8];
    noBtn.onclick = yesClick; noBtn.onmouseover = null;
    return;
  }
  var zw = ynZone.clientWidth - noBtn.offsetWidth, zh = ynZone.clientHeight - noBtn.offsetHeight;
  noBtn.style.left = Math.random() * zw + "px"; noBtn.style.top = Math.random() * zh + "px";
  yesBtn.style.transform = "scale(" + Math.min(2.5, 1 + noTries * .18) + ")";
  $("#ynmsg").textContent = NOQ[noTries - 1]; $("#ynemo").textContent = EMO[noTries - 1];
}
noBtn.onmouseover = dodge; noBtn.onclick = dodge;
noBtn.addEventListener("touchstart", function (e) {
  if (noTries >= 9) { yesClick(e); return; }
  dodge(e);
}, { passive: false });
yesBtn.onclick = yesClick;

/* ---------- heart curve ---------- */
function hp(a) {
  return [16 * Math.pow(Math.sin(a), 3), -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a))];
}

/* ---------- "I love you" text heart (fast: pre-rendered text + lookup table) ---------- */
var HT = [], SPR = [], HN = 720, LAYERS = 6;
(function buildTable() {
  for (var i = 0; i < HN; i++) {
    var a = i / HN * 6.2832, p = hp(a);
    var dx = 48 * Math.pow(Math.sin(a), 2) * Math.cos(a);
    var dy = 13 * Math.sin(a) - 10 * Math.sin(2 * a) - 6 * Math.sin(3 * a) - 4 * Math.sin(4 * a);
    var r = Math.atan2(dy, dx);
    HT.push({ x: p[0], y: p[1], c: Math.cos(r), s: Math.sin(r) });
  }
})();
function buildSprites() {
  SPR = [];
  for (var l = 0; l < LAYERS; l++) {
    var cv = document.createElement("canvas"); cv.width = 72; cv.height = 20;
    var x = cv.getContext("2d");
    x.font = "600 12px Poppins, sans-serif"; x.textAlign = "center";
    x.fillStyle = "hsla(335,90%," + (78 - l * 4) + "%," + (1 - l * .12) + ")";
    x.fillText("I love you", 36, 14); SPR.push(cv);
  }
}
buildSprites();
function dIluv(c, x, t) {
  var w = c.width, h = c.height, m = Math.min(w / 36, h / 44), L = MOBILE ? 5 : LAYERS, K = MOBILE ? 44 : 60;
  x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, w, h);
  for (var l = 0; l < L; l++) {
    var s = m * (1 - l * .07), ox = Math.sin(t + l) * 8, oy = Math.cos(t * .8 + l) * 5;
    var off = (t * .25 * (l % 2 ? -1 : 1) + l * .15) * HN / 6.2832, sp = SPR[l];
    for (var i = 0; i < K; i++) {
      var q = HT[(((i * HN / K + off) % HN) + HN) % HN | 0];
      x.setTransform(q.c, q.s, -q.s, q.c, w / 2 + q.x * s + ox, h * .4 + q.y * s + oy);
      x.drawImage(sp, -36, -14);
    }
  }
  x.setTransform(1, 0, 0, 1, 0, 0);
}

/* ---------- sparkle heart + touch burst ---------- */
var A = [], B = [];
function initSpark() {
  var c = $("#c2"), m = Math.min(c.width / 36, c.height / 44), n = MOBILE ? 180 : 260; A = [];
  for (var i = 0; i < n; i++) {
    var p = hp(Math.random() * 6.2832), j = (Math.random() - .5) * 1.4;
    A.push({
      x: Math.random() * c.width, y: Math.random() * c.height,
      tx: c.width / 2 + p[0] * m * (1 + j * .06) + j * 6, ty: c.height * .38 + p[1] * m * (1 + j * .06) + j * 6,
      r: Math.random() * 2 + .8, o: Math.random() * 6
    });
  }
}
function dSpark(c, x, t) {
  x.fillStyle = "rgba(11,4,8,.28)"; x.fillRect(0, 0, c.width, c.height);
  var e = 1 - Math.pow(1 - .035, DK);
  x.fillStyle = "#ffb3d1";
  A.forEach(function (p) {
    p.x += (p.tx - p.x) * e + Math.sin(t * 2 + p.o) * .3 * DK;
    p.y += (p.ty - p.y) * e + Math.cos(t * 2 + p.o) * .3 * DK;
    x.globalAlpha = .55 + Math.sin(t * 3 + p.o) * .4;
    x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.3); x.fill();
  });
  x.globalAlpha = 1;
  B.forEach(function (p) {
    p.x += p.vx * DK; p.y += p.vy * DK; p.vy += .05 * DK; p.l -= DK;
    x.fillStyle = "hsla(" + p.h + ",100%,70%," + Math.max(0, p.l / 70) + ")"; x.beginPath(); x.arc(p.x, p.y, 2, 0, 6.3); x.fill();
  });
  B = B.filter(function (p) { return p.l > 0; });
}
function burst(e) {
  var r = e.currentTarget.getBoundingClientRect(), n = MOBILE ? 30 : 50;
  for (var i = 0; i < n; i++) {
    var a = Math.random() * 6.28, v = Math.random() * 4 + 1;
    B.push({ x: e.clientX - r.left, y: e.clientY - r.top, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: 70, h: 325 + Math.random() * 30 });
  }
}
$("#c2").addEventListener("pointerdown", burst);
$("#c2").addEventListener("pointermove", function (e) { if (e.buttons) burst(e); });

/* ---------- pink galaxy swirl (finale) ---------- */
var G = [];
function initGalaxy() {
  G = []; var n = MOBILE ? 500 : 800;
  for (var i = 0; i < n; i++) G.push({
    a: Math.random() * 6.28, r: Math.pow(Math.random(), .6) * Math.min(innerWidth, innerHeight) * .62 + 8,
    c: "hsl(" + (325 + Math.random() * 30 | 0) + ",100%,72%)", s: Math.random() * 1.8 + .6
  });
}
function dGalaxy(c, x, t) {
  x.fillStyle = "rgba(11,4,8,.16)"; x.fillRect(0, 0, c.width, c.height);
  var X = c.width / 2, Y = c.height * .5, last = "";
  G.forEach(function (p) {
    p.a += 1.44 / (p.r + 30) * DK;
    if (p.c != last) { x.fillStyle = p.c; last = p.c; }
    x.fillRect(X + Math.cos(p.a) * p.r, Y + Math.sin(p.a) * p.r * .7, p.s, p.s);
  });
  var hr = Math.min(c.width, c.height) * .4;
  for (var k = 0; k < 14; k++) {
    var aa = t * 2.2 - k * .05;
    x.fillStyle = "rgba(255,200,225," + (1 - k / 14) + ")"; x.beginPath();
    x.arc(X + Math.cos(aa) * hr, Y + Math.sin(aa) * hr * .7, 5 - k * .3, 0, 6.3); x.fill();
  }
}

/* ---------- main animation loop (time based) ---------- */
var DRAW = { iluv: ["c1", dIluv], spark: ["c2", dSpark], fin: ["c3", dGalaxy] }, lastT = 0;
function loop(now) {
  var dt = Math.min(.05, (now - (lastT || now)) / 1000); lastT = now;
  T += dt; DK = dt * 60;
  if (P.length) {
    cx.clearRect(0, 0, innerWidth, innerHeight);
    P.forEach(function (p) {
      p.x += p.vx * DK; p.y += p.vy * DK; p.vy += .3 * DK; p.l -= DK;
      cx.fillStyle = p.c; cx.fillRect(p.x, p.y, p.s, p.s);
    });
    P = P.filter(function (p) { return p.l > 0; });
    if (!P.length) cx.clearRect(0, 0, innerWidth, innerHeight);
  }
  var d = DRAW[sn()];
  if (d) { var c = $("#" + d[0]); d[1](c, c.getContext("2d"), T); }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/* ---------- typewriter ---------- */
var tw;
function typeIt() {
  clearTimeout(tw); var i = 0, el = $("#type"); el.textContent = "";
  (function t() { el.textContent = MSG.slice(0, i++); if (i <= MSG.length) tw = setTimeout(t, 55); })();
}

/* ======================= NEON PENCIL ART ======================= */
var skToken = 0, SW = 330, SH = 440, BGN = "#0a0212";
var PAL = [                                   // colour schemes (changes with every photo)
  [[255, 46, 151], [180, 0, 255], [0, 229, 255]],     // pink  > purple > cyan
  [[0, 229, 255], [0, 255, 170], [255, 255, 90]],     // cyan  > green  > yellow
  [[255, 130, 0], [255, 46, 151], [170, 0, 255]]      // orange> pink   > violet
];
function lerp3(p, t) {
  var s = t * 2, i = s >= 1 ? 1 : 0, f = s - i, a = p[i], b = p[i + 1];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
}
function boxBlur(src, w, h, r) {
  var tmp = new Float32Array(w * h), out = new Float32Array(w * h), x, y, acc, n = 2 * r + 1;
  for (y = 0; y < h; y++) {
    acc = 0; for (x = -r; x <= r; x++) acc += src[y * w + Math.min(w - 1, Math.max(0, x))];
    for (x = 0; x < w; x++) {
      tmp[y * w + x] = acc / n;
      acc += src[y * w + Math.min(w - 1, x + r + 1)] - src[y * w + Math.max(0, x - r)];
    }
  }
  for (x = 0; x < w; x++) {
    acc = 0; for (y = -r; y <= r; y++) acc += tmp[Math.min(h - 1, Math.max(0, y)) * w + x];
    for (y = 0; y < h; y++) {
      out[y * w + x] = acc / n;
      acc += tmp[Math.min(h - 1, y + r + 1) * w + x] - tmp[Math.max(0, y - r) * w + x];
    }
  }
  return out;
}
function shrink(src, n) {                     // halves the canvas n times (cheap blur for the glow)
  var c = src;
  for (var i = 0; i < n; i++) {
    var t = document.createElement("canvas"); t.width = Math.max(1, c.width >> 1); t.height = Math.max(1, c.height >> 1);
    var x = t.getContext("2d"); x.imageSmoothingEnabled = true; x.drawImage(c, 0, 0, t.width, t.height); c = t;
  }
  return c;
}
function cropTo(img, x) {
  var iw = img.naturalWidth, ih = img.naturalHeight;
  var cw = Math.min(iw, ih * SW / SH), ch = cw * SH / SW;
  x.drawImage(img, (iw - cw) / 2, (ih - ch) * .25, cw, ch, 0, 0, SW, SH);
}
function makeNeon(img, k) {                   // photo -> glowing neon line art (returns a canvas)
  var s = document.createElement("canvas"); s.width = SW; s.height = SH;
  var x = s.getContext("2d"); cropTo(img, x);
  var d = x.getImageData(0, 0, SW, SH), px = d.data, n = SW * SH, g = new Float32Array(n), inv = new Float32Array(n), i;
  for (i = 0; i < n; i++) { g[i] = .299 * px[i * 4] + .587 * px[i * 4 + 1] + .114 * px[i * 4 + 2]; inv[i] = 255 - g[i]; }
  var b = boxBlur(boxBlur(inv, SW, SH, 3), SW, SH, 3), pal = PAL[k % PAL.length], lut = [];
  for (i = 0; i < 256; i++) lut.push(lerp3(pal, i / 255));
  for (i = 0; i < n; i++) {
    var v = b[i] >= 254 ? 255 : Math.min(255, g[i] * 255 / (255 - b[i]));
    var a = Math.max(0, Math.min(1, (255 - v - 10) / 105)) * 1.1;
    var gx = (i % SW) / SW, gy = ((i / SW) | 0) / SH;
    var c = lut[Math.min(255, Math.floor((gx * .45 + gy * .55) * 255))];
    px[i * 4] = Math.min(255, c[0] * a); px[i * 4 + 1] = Math.min(255, c[1] * a); px[i * 4 + 2] = Math.min(255, c[2] * a); px[i * 4 + 3] = 255;
  }
  x.putImageData(d, 0, 0);
  var o = document.createElement("canvas"); o.width = SW; o.height = SH;   // lines + glow
  var ox = o.getContext("2d"); ox.fillStyle = BGN; ox.fillRect(0, 0, SW, SH);
  ox.globalCompositeOperation = "lighter"; ox.drawImage(s, 0, 0);
  ox.imageSmoothingEnabled = true;
  var GL = [[2, .8], [3, .9], [4, .9]];
  GL.forEach(function (a) { ox.globalAlpha = a[1]; ox.drawImage(shrink(s, a[0]), 0, 0, SW, SH); });
  ox.globalAlpha = 1; return o;
}
function startSketch(k) {
  var token = ++skToken, cv = $("#sk"), fr = $("#frame"), pen = $("#pencil"), colorImg = $("#skc");
  var idx = SKI[k % SKI.length]; fr.classList.remove("color"); $("#skcap").textContent = "";
  cv.width = SW; cv.height = SH; cv.style.filter = "";
  var x = cv.getContext("2d"); x.fillStyle = BGN; x.fillRect(0, 0, SW, SH);
  var img = new Image();
  img.onload = function () {
    if (token != skToken) return;
    var neon;
    try { neon = makeNeon(img, k); } catch (e) {          // e.g. file:// blocks pixel access
      neon = document.createElement("canvas"); neon.width = SW; neon.height = SH;
      cropTo(img, neon.getContext("2d"));
      cv.style.filter = "grayscale(1) contrast(1.6) sepia(1) hue-rotate(290deg) saturate(6) brightness(1.1)";
    }
    colorImg.src = IMGS[idx];
    var BANDS = 44, bh = SH / BANDS, DUR = 4200, t0 = performance.now();
    (function frame(now) {
      if (token != skToken) return;
      var p = Math.min(1, (now - t0) / DUR), pos = p * BANDS, band = Math.min(BANDS - 1, Math.floor(pos)), f2 = pos - band;
      x.fillStyle = BGN; x.fillRect(0, 0, SW, SH);
      var top = band * bh; if (top > 0) x.drawImage(neon, 0, 0, SW, top, 0, 0, SW, top);
      var rtl = band % 2 == 1, w = SW * f2;
      if (w > 0) x.drawImage(neon, rtl ? SW - w : 0, top, w, bh + 1, rtl ? SW - w : 0, top, w, bh + 1);
      var rect = cv.getBoundingClientRect(), fr0 = fr.getBoundingClientRect();
      var px = (rtl ? SW - w : w) / SW * rect.width + (rect.left - fr0.left);
      var py = (top + bh * .5) / SH * rect.height + (rect.top - fr0.top);
      pen.style.transform = "translate(" + (px - 7) + "px," + (py - 7) + "px)";
      if (p < 1) requestAnimationFrame(frame);
      else setTimeout(function () {
        if (token != skToken) return;
        fr.classList.add("color"); $("#skcap").textContent = SKCAP[k % SKCAP.length];
        setTimeout(function () { if (token == skToken) startSketch(k + 1); }, 4200);
      }, 500);
    })(t0);
  };
  img.src = IMGS[idx];
}
var skNext = 0;
$("#frame").onclick = function () { startSketch(++skNext); };

/* ======================= ROSE FRAME SLIDESHOW ======================= */
var kbTok = 0, kbi = 0, kbTop, kbBot;
var HSVG = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M50 90C10 60 0 35 18 20C32 9 46 17 50 30C54 17 68 9 82 20C100 35 90 60 50 90Z'/></svg>";
var HEART = "url(\"data:image/svg+xml," + encodeURIComponent(HSVG) + "\")";
function setMask(e) {
  e.style.webkitMaskImage = HEART; e.style.maskImage = HEART;
  e.style.webkitMaskRepeat = "no-repeat"; e.style.maskRepeat = "no-repeat";
  e.style.webkitMaskPosition = "50% 50%"; e.style.maskPosition = "50% 50%";
}
function clearMask(e) { e.style.webkitMaskImage = "none"; e.style.maskImage = "none"; }
var TR = [                                   // photo change effects (they repeat in this order)
  function (e) { return e.animate({ clipPath: ["circle(0% at 50% 50%)", "circle(75% at 50% 50%)"] }, { duration: 1200, easing: "ease-in-out" }); },
  function (e) { setMask(e); return e.animate({ maskSize: ["0%", "400%"], webkitMaskSize: ["0%", "400%"] }, { duration: 1400, easing: "ease-in-out" }); },
  function (e) { return e.animate({ clipPath: ["polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)", "polygon(50% -50%, 150% 50%, 50% 150%, -50% 50%)"] }, { duration: 1200, easing: "ease-in-out" }); },
  function (e) { return e.animate({ clipPath: ["inset(0 50% 0 50%)", "inset(0 0 0 0)"] }, { duration: 1100, easing: "ease-in-out" }); },
  function (e) { return e.animate({ filter: ["blur(22px) brightness(2.2)", "blur(0) brightness(1)"], opacity: [0, 1] }, { duration: 1300, easing: "ease-out" }); },
  function (e) { return e.animate({ clipPath: ["inset(0 100% 0 0)", "inset(0 0 0 0)"] }, { duration: 1000, easing: "ease-in-out" }); }
];
function resetSl(e) {
  if (e.getAnimations) e.getAnimations().forEach(function (a) { a.cancel(); });
  e.style.cssText = "";
}
function setSlide(e, src) { e.style.backgroundImage = "url('" + src + "')"; }
function kenburns(e) { e.animate({ transform: ["scale(1)", "scale(1.13)"] }, { duration: 5200, fill: "forwards", easing: "linear" }); }
function startShow() {
  var tok = ++kbTok, A1 = $("#slA"), B1 = $("#slB");
  resetSl(A1); resetSl(B1); kbTop = A1; kbBot = B1; kbi = 0;
  setSlide(kbTop, IMGS[26]); kbTop.style.zIndex = 2; kbBot.style.zIndex = 1; kenburns(kbTop);
  $("#kcap").textContent = KC[0];
  (function tick() {
    setTimeout(function () { if (tok != kbTok) return; nextSlide(tok); tick(); }, 4300);
  })();
}
function nextSlide(tok) {
  kbi = (kbi + 1) % 12;
  var src = IMGS[26 + kbi], inc = kbBot, out = kbTop, im = new Image(), k = kbi;
  im.onload = function () {
    if (tok != kbTok) return;
    resetSl(inc); setSlide(inc, src); inc.style.zIndex = 3; kenburns(inc);
    var tr = TR[k % TR.length](inc);
    $("#kcap").textContent = KC[k];
    tr.onfinish = function () {
      if (tok != kbTok) return;
      clearMask(inc); inc.style.zIndex = 2; out.style.zIndex = 1;
      if (out.getAnimations) out.getAnimations().forEach(function (a) { a.cancel(); });
      kbTop = inc; kbBot = out;
    };
  };
  im.src = src;
}

/* ---------- candles ---------- */
document.querySelectorAll(".candle").forEach(function (c) {
  c.onclick = function () {
    c.classList.add("off");
    if (!document.querySelector(".candle:not(.off)")) {
      $("#wish").textContent = "Make a wish, Chuti Manika... 🌟 I know it will come true 😉";
      confetti(); setTimeout(confetti, 600);
    }
  };
});

/* ---------- love letter ---------- */
$("#env").onclick = function () {
  var e = $("#env"); e.classList.toggle("open");
  if (e.classList.contains("open")) setTimeout(confetti, 900);
};

/* ---------- catch the hearts game ---------- */
var GOAL = 12, score = 0, gTimer = null, won = false;
function setBar() { $("#gbar").style.width = Math.max(0, score) / GOAL * 100 + "%"; }
function startGame() {
  stopGame(); score = 0; won = false; setBar();
  $("#game").innerHTML = ""; $("#gtxt").textContent = "Tap 12 hearts. Careful with the broken ones 💔";
  gTimer = setInterval(spawn, 650);
}
function stopGame() { if (gTimer) { clearInterval(gTimer); gTimer = null; } }
function spark(g, x, y, ch) {
  var s = document.createElement("div"); s.className = "fx2"; s.textContent = ch;
  s.style.left = x + "px"; s.style.top = y + "px";
  g.appendChild(s); setTimeout(function () { s.remove(); }, 600);
}
function spawn() {
  var g = $("#game"), bad = Math.random() < .2, h = document.createElement("div");
  h.className = "gh"; h.textContent = bad ? "💔" : ["💗", "💖", "💕", "💘"][Math.floor(Math.random() * 4)];
  h.style.left = Math.random() * (g.clientWidth - 50) + "px";
  h.style.setProperty("--h", g.clientHeight + 70 + "px");
  h.style.animationDuration = (2.6 + Math.random() * 2) + "s";
  h.addEventListener("animationend", function () { h.remove(); });
  var hit = function (e) {
    e.preventDefault(); if (won) return;
    var r = h.getBoundingClientRect(), gr = g.getBoundingClientRect();
    spark(g, r.left - gr.left, r.top - gr.top, bad ? "😢" : "✨"); h.remove();
    score += bad ? -1 : 1; if (score < 0) score = 0; setBar();
    if (score >= GOAL) win(g);
  };
  h.addEventListener("pointerdown", hit); g.appendChild(h);
}
function win(g) {
  won = true; stopGame(); confetti(); setTimeout(confetti, 500);
  g.innerHTML = '<div class="win"><span>💘</span><p>You caught all my hearts!<br>They were always yours, Chuti Manika.</p></div>';
  $("#gtxt").textContent = "Mission complete! 🎉";
}

/* ---------- build everything that needs photos, then start ---------- */
function build() {
  /* 3D carousel */
  var ring = $("#ring");
  IMGS.slice(0, 10).forEach(function (src, i) {
    var im = new Image(); im.src = src; im.decoding = "async";
    im.style.transform = "rotateY(" + i * 36 + "deg) translateZ(175px)"; ring.appendChild(im);
  });
  ring.onclick = function () {
    ring.style.animationPlayState = ring.style.animationPlayState == "paused" ? "running" : "paused";
  };

  /* polaroid board */
  IMGS.slice(10, 18).forEach(function (src, i) {
    var f = document.createElement("figure");
    f.className = "polaroid"; f.style.setProperty("--r", (Math.random() * 14 - 7) + "deg"); f.style.setProperty("--i", i);
    f.innerHTML = '<img loading="lazy" decoding="async" src="' + src + '" alt=""><figcaption>' + CAP[i] + "</figcaption>";
    f.onclick = function () { f.classList.toggle("big"); };
    $("#board").appendChild(f);
  });

  /* floating photos behind the message */
  IMGS.slice(18, MOBILE ? 23 : 26).forEach(function (src, i) {
    var p = new Image(); p.src = src; p.decoding = "async"; p.className = "pol"; p.style.left = (i * 14 + Math.random() * 4) + "%";
    p.style.animationDuration = (14 + Math.random() * 10) + "s"; p.style.animationDelay = (-Math.random() * 14) + "s";
    p.style.setProperty("--r", (Math.random() * 40 - 20) + "deg"); $("#s5").appendChild(p);
  });

  /* roses around the slideshow frame: [left %, top %, size px] */
  var RP = [[0,0,46],[100,0,46],[0,100,46],[100,100,46],[50,0,34],[50,100,34],[0,50,34],[100,50,34],
    [25,0,26],[75,0,26],[25,100,26],[75,100,26],[0,25,26],[0,75,26],[100,25,26],[100,75,26]];
  var RE = ["🌹", "🌸", "🌹", "🍃"];
  RP.forEach(function (r, i) {
    var s = document.createElement("span"); s.className = "rose";
    s.textContent = i < 4 ? "🌹" : RE[i % RE.length];
    s.style.left = r[0] + "%"; s.style.top = r[1] + "%"; s.style.fontSize = r[2] + "px"; s.style.animationDelay = (-i * .35) + "s";
    $("#rframe").appendChild(s);
  });

  /* rose wreath around the finale photo */
  var WE = ["🌹", "🌸", "🌹", "🌺"];
  for (var w = 0; w < 14; w++) {
    var sp = document.createElement("span"); sp.textContent = WE[w % WE.length];
    sp.style.transform = "translate(-50%,-50%) rotate(" + (w * 360 / 14) + "deg) translateY(-96px)";
    $("#wr").appendChild(sp);
  }

  /* finale photo circle */
  var FIN = IMGS.slice(38, 46), fi = 0, fe = $("#fin");
  fe.src = FIN[0];
  setInterval(function () {
    if (sn() != "fin") return;
    fe.style.opacity = 0;
    setTimeout(function () { fi = (fi + 1) % FIN.length; fe.src = FIN[fi]; fe.style.opacity = 1; }, 500);
  }, 2600);

  resize(); go(0);
}
pickPhotos(build);
