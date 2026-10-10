// FAQ accordion
document.querySelectorAll('.qa').forEach(function (item) {
  var btn = item.querySelector('.q');
  var ans = item.querySelector('.a');
  btn.addEventListener('click', function () {
    var open = item.classList.contains('open');
    // funga zote
    document.querySelectorAll('.qa.open').forEach(function (o) {
      o.classList.remove('open');
      o.querySelector('.a').style.maxHeight = null;
      o.querySelector('.q').setAttribute('aria-expanded', 'false');
    });
    if (!open) {
      item.classList.add('open');
      ans.style.maxHeight = ans.scrollHeight + 'px';
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// kivuli kwenye header ukisogeza ukurasa
var nav = document.getElementById('nav');
window.addEventListener('scroll', function () {
  nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });


/* ============================================================
   1) SLIDESHOW — picha za wanyama wa Tanzania (Wikimedia Commons)
   Zinabadilika kila sekunde chache. Ongeza/ondoa picha hapa chini.
   ============================================================ */
var PHOTOS = [
  { f: 'Serengeti Elefantenherde1.jpg',      pos: 'center 55%' },  // Tembo - Serengeti
  { f: 'Zebras Ngorongoro Crater.jpg',       pos: 'center'     },  // Pundamilia - Ngorongoro
  { f: 'Serengeti Loewin.jpg',               pos: 'center 40%' },  // Simba jike - Serengeti
  { f: 'Giraffes Mikumi National Park.jpg',  pos: 'center 22%' },  // Twiga - Mikumi
  { f: 'Ngorongoro Spitzmaulnashorn.jpg',    pos: 'center'     },  // Kifaru - Ngorongoro
  { f: 'Tarangire Warzenschwein1.jpg',       pos: 'center 45%' },  // Ngiri - Tarangire
  { f: 'Lake Manyara Wildlife.jpg',          pos: 'center'     },  // Wanyama - Ziwa Manyara
  { f: 'Serengeti Bueffel1.jpg',             pos: 'center 40%' }   // Nyati - Serengeti
];
var SLIDE_MS = 5500; // sekunde 5.5 kwa kila picha

(function () {
  var box = document.getElementById('bgSlides');
  if (!box) return;
  var width = window.innerWidth < 760 ? 900 : 1600; // simu = picha ndogo, inaokoa bando
  var slides = [], loaded = [], cur = -1, timer;

  PHOTOS.forEach(function (p) {
    var d = document.createElement('div');
    d.className = 'slide';
    d.style.backgroundPosition = p.pos;
    box.appendChild(d);
    slides.push(d);
    loaded.push(null);
  });

  function url(p) {
    return 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(p.f) + '?width=' + width;
  }

  // pakia picha moja; inarudisha Promise<true/false>
  function load(i) {
    if (loaded[i]) return loaded[i];
    loaded[i] = new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () { slides[i].style.backgroundImage = 'url("' + img.src + '")'; resolve(true); };
      img.onerror = function () { resolve(false); };
      img.src = url(PHOTOS[i]);
    });
    return loaded[i];
  }

  function show(i) {
    if (cur >= 0) slides[cur].classList.remove('active');
    slides[i].classList.add('active');
    cur = i;
    load((i + 1) % slides.length); // andaa picha inayofuata mapema
  }

  function next(tries) {
    tries = tries || 0;
    if (tries >= slides.length) return;
    var n = (cur + 1 + tries) % slides.length;
    load(n).then(function (ok) {
      if (ok) { show(n); schedule(); }
      else next(tries + 1); // kama picha imeshindwa kupakia, ruka
    });
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(function () { if (!document.hidden) next(); else schedule(); }, SLIDE_MS);
  }

  // picha ya kwanza
  (function first(i) {
    if (i >= slides.length) return;
    load(i).then(function (ok) {
      if (ok) { show(i); schedule(); } else first(i + 1);
    });
  })(0);
})();

/* ============================================================
   2) MWENDO WA PC NA SIMU — zinapanda juu na kushuka chini
   ============================================================ */
(function () {
  var laptop = document.querySelector('.laptop');
  var phone = document.querySelector('.phone');
  if (!laptop || !phone) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var t0 = performance.now();
  function tick(now) {
    var t = (now - t0) / 1000;
    // laptop: polepole, ± 9px | simu: kasi kidogo zaidi, ± 14px, kinyume cha laptop
    var ly = Math.sin(t * 1.5) * 9;
    var py = Math.sin(t * 2.1 + Math.PI) * 14;
    laptop.style.transform = 'translateY(' + ly.toFixed(2) + 'px)';
    phone.style.transform = 'translateY(' + py.toFixed(2) + 'px)';
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
