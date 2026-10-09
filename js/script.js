(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const MUSIC = 'assets/audio/music.mp3';            // thay nhạc: bỏ file vào đây
  const COLORS = ['#e8d6a8', '#d9e2c6', '#f3e6cf', '#efd9c0'];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .4, rootMargin: '0px 0px -6% 0px' });
  $$('[data-r]').forEach(el => { el.style.transitionDelay = (el.dataset.d || 0) + 's'; io.observe(el); });

  const btn = $('#music'), audio = new Audio();
  audio.loop = true; audio.volume = .5; audio.preload = 'auto';
  audio.src = MUSIC;
  audio.addEventListener('error', () => { btn.hidden = true; });   // chưa có file nhạc thì ẩn nút
  const setPlay = on => btn.setAttribute('aria-pressed', on);
  btn.addEventListener('click', () => {
    if (audio.paused) audio.play().then(() => setPlay(true)).catch(() => {});
    else { audio.pause(); setPlay(false); }
  });

  function petals() {
    if (reduce) return;
    const box = $('#petals');
    for (let i = 0; i < 10; i++) {
      const p = document.createElement('span');
      p.className = 'petal';
      p.style.cssText = `left:${Math.random() * 100}%;background:${COLORS[i % 4]};--dx:${Math.random() * 80 - 40}px;` +
        `animation-duration:${16 + Math.random() * 10}s;animation-delay:${Math.random() * 12}s`;
      box.appendChild(p);
    }
  }

  $('#open').addEventListener('click', () => {
    const intro = $('#intro');
    intro.classList.add('opening');
    btn.hidden = false;
    setTimeout(() => { intro.classList.add('gone'); document.body.classList.remove('locked'); scrollTo(0, 0); petals(); }, 900);
    setTimeout(() => intro.remove(), 3200);
  }, { once: true });

  // Ảnh: chỉ tải khi cuộn gần tới; chưa có ảnh thì ẩn cả mục (thêm ?demo vào link để xem khung trống)
  const gal = $('#gallery'), demo = /demo/.test(location.search);
  const gio = new IntersectionObserver(es => {
    if (!es[0].isIntersecting) return;
    gio.disconnect();
    $$('#gallery figure').forEach(f => {
      const img = f.querySelector('img');
      img.addEventListener('load', () => gal.removeAttribute('data-empty'), { once: true });
      img.addEventListener('error', () => { if (demo) { f.classList.add('ph'); gal.removeAttribute('data-empty'); } else f.remove(); }, { once: true });
      img.decoding = 'async'; img.src = img.dataset.src;
    });
  }, { rootMargin: '700px' });
  gio.observe(gal);

  $$('.paper p').forEach((p, i) => p.style.setProperty('--i', i));
  $('#openLetter').addEventListener('click', e => {
    $('#letter').classList.add('open');
    e.currentTarget.style.display = 'none';

    // Mở thư là bật nhạc
    btn.hidden = false;
    if (audio.paused) {
      if (!audio.src) audio.src = MUSIC;
      audio.play().then(() => setPlay(true)).catch(() => {});
    }

    setTimeout(() => $('#letter').scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
  });

  const fin = $('#finale'); let done = false;
  function blow() {
    if (done) return; done = true;
    fin.classList.add('out');
    $$('#wish .w').forEach((w, i) => setTimeout(() => w.classList.add('on'), 1400 + i * 1800));
    setTimeout(() => $('#wish').scrollIntoView({ behavior: 'smooth', block: 'center' }), 1600);
  }
  $('#flame').addEventListener('click', blow);
  $('#flame').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); blow(); } });
  $('#blow').addEventListener('click', blow);
})();
