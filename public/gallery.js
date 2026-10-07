// Gallery categories: Exterior / Skyline / Interior, each with several images.
// Kept out of index.html on purpose: vite.config.ts injects this file after index.html's own script,
// and it only wraps the gallery view (show, renderConsole, go); every other view is untouched.
(() => {
  'use strict';

  // hero / architecture / location_aerial are the original gallery renders from index.html.
  const SETS = [
    ['Exterior', [
      [A.hero, 'Innovation Campus tower at sunset beside the elevated highway.'],
      [A.architecture, 'Innovation Campus tower at sunset with the flyover in front.'],
      ['/img/gallery/grand-arrival.jpg', 'Gated night arrival at Innovation Campus beside the flyover.'],
    ]],
    ['Skyline', [
      ['/img/gallery/circulation-aerial.jpg', 'Innovation Campus rising above the Mumbai skyline at sunset.'],
      [A.location_aerial, 'Aerial view of Innovation Campus within the surrounding neighbourhood.'],
    ]],
    ['Interior', [
      ['/img/gallery/signature-lobby.jpg', 'Double-height lobby with reception desk and lounge seating.'],
      ['/img/gallery/unobstructed-views.jpg', 'Corner office at night overlooking the Bandra-Worli Sea Link.'],
      ['/img/gallery/elevated-workspaces.jpg', 'Workspace with floor-to-ceiling glazing above the city at night.'],
      ['/img/gallery/skyline-night.jpg', 'Executive office with a night view of the city skyline.'],
    ]],
  ];

  const font = document.createElement('link');
  font.rel = 'stylesheet';
  font.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300&display=swap';
  document.head.append(font);

  const css = document.createElement('style');
  css.textContent = `
.gallery-image>img.photo{position:absolute;inset:0}
.gallery-step{position:absolute;top:50%;z-index:3;transform:translateY(-50%);width:48px;height:48px;min-height:0;padding:0;display:flex;align-items:center;justify-content:center;border-radius:50%;border:1px solid #ffffff40;background:#102235a8;color:#f5f7f9;transition:background .25s,color .25s}
.gallery-step:hover{background:var(--champagne);color:var(--midnight)}.gallery-step svg{width:20px;height:20px}
.gallery-step.prev{left:24px}.gallery-step.next{right:24px}
.gallery-count{position:absolute;z-index:3;right:32px;bottom:22px;font-size:11px;letter-spacing:.08em;color:#f5f7f9;text-shadow:0 1px 5px #000a}
.console .gallery-step.prev{left:120px}.console .gallery-step.next{right:32px}
.gallery-intro{position:absolute;inset:0;z-index:4;display:flex;align-items:center;justify-content:center;pointer-events:none}
.gallery-intro h1{margin:0;color:#fff;font:300 60px/1 Inter,sans-serif;letter-spacing:.15em;opacity:0}
.gallery-blur{filter:blur(24px)}.gallery-blur.clear{filter:blur(0px);transition:filter 1.5s cubic-bezier(.42,0,.58,1) 1.5s}
.gallery-intro-on .console-rail,.gallery-intro-on .console-context,.gallery-intro-on .header-controls,.gallery-intro-on .footer{opacity:0;pointer-events:none}
@media(min-width:768px){.gallery-intro h1{font-size:96px}}@media(min-width:1024px){.gallery-intro h1{font-size:100px}}
@media(max-width:700px){.console .gallery-step{width:44px;height:44px}.console .gallery-step.prev{left:12px}.console .gallery-step.next{right:12px}.console .gallery-count{right:20px;bottom:92px}}`;
  document.head.append(css);

  const EASE = { io: 'cubic-bezier(.42,0,.58,1)', intro: 'cubic-bezier(.25,1,.5,1)' };
  const UI = '.console-rail,.console-context,.header-controls,.footer';

  // Arrows and counter stay hidden until a category tab is clicked; the intro plays on each visit.
  let img = 0, picked = false, intro = false, timers = [], sliding = false, dir = 1;

  const step = (side, label, d, cat) => `<button type="button" class="gallery-step ${side}" data-action="galleryStep" data-dir="${d}" aria-label="${label} ${cat.toLowerCase()} image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d < 0 ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}"/></svg></button>`;

  function stopIntro() {
    timers.forEach(clearTimeout);
    timers = [];
    app.classList.remove('gallery-intro-on');
  }

  function renderGallery() {
    const [cat, imgs] = SETS[state.gallery], n = imgs.length, k = img % n, [src, alt] = imgs[k];
    stage.innerHTML = `<section class="scene gallery-shell"><div class="gallery-heading"><div><div class="eyebrow">Client-supplied project gallery</div><h2>${cat}.</h2></div>${action('Overview', 'overview', true)}</div><div class="gallery-image${intro ? ' gallery-blur' : ''}"><img src="${src}" alt="${esc(alt)}" class="photo" draggable="false">${picked && n > 1 ? step('prev', 'Previous', -1, cat) + step('next', 'Next', 1, cat) + `<span class="gallery-count">${k + 1} / ${n}</span>` : ''}</div>${intro ? '<div class="gallery-intro"><h1>GALLERY</h1></div>' : ''}<nav class="gallery-tools" aria-label="Select project gallery category">${SETS.map(([t], i) => `<button type="button" data-action="gallerySelect" data-index="${i}" aria-pressed="${state.gallery === i}">${t}</button>`).join('')}<small>${k + 1} / ${n} images</small></nav></section>`;
    bindImageErrors();
    if (intro) playIntro();
  }

  // Blurred image with "GALLERY" dropping in, then the title lifts away, the image sharpens and the controls fade in.
  function playIntro() {
    intro = false;
    app.classList.add('gallery-intro-on');
    const h = stage.querySelector('.gallery-intro h1'), box = stage.querySelector('.gallery-blur');
    h.animate([{ transform: 'translateY(-50vh)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 2000, easing: EASE.intro, fill: 'both' });
    timers.push(setTimeout(() => {
      h.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-50vh)', opacity: 0 }], { duration: 2000, easing: EASE.intro, fill: 'both' }).onfinish = () => h.parentNode.remove();
      box.classList.add('clear');
      app.classList.remove('gallery-intro-on');
      document.querySelectorAll(UI).forEach(el => el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1000, delay: 1500, easing: EASE.io, fill: 'backwards' }));
    }, 2000));
  }

  // Old image slides out, then the next one slides in from the other side (spring stiffness 100, damping 20).
  function spring(from) {
    const f = [];
    for (let i = 0; i <= 40; i++) { const t = i / 40; f.push({ transform: `translateX(${i === 40 ? 0 : from * (1 + 10 * t) * Math.exp(-10 * t)}%)` }); }
    return f;
  }
  function slide(d) {
    const n = SETS[state.gallery][1].length;
    img = (img + d + n) % n;
    dir = d;
    if (sliding) return; // the slide in progress picks up the latest index when it finishes
    const box = stage.querySelector('.gallery-image'), old = box && box.querySelector('img.photo');
    if (!old) return;
    sliding = true;
    const view = stage.firstElementChild;
    old.animate([{ transform: 'translateX(0)', opacity: 1 }, { transform: `translateX(${dir > 0 ? -100 : 100}%)`, opacity: 0 }], { duration: 600, easing: EASE.io, fill: 'forwards' }).onfinish = () => {
      sliding = false;
      if (stage.firstElementChild !== view) return; // left the gallery mid-slide
      const [cat, imgs] = SETS[state.gallery], k = img % imgs.length, [src, alt] = imgs[k];
      const next = document.createElement('img');
      Object.assign(next, { src, alt, className: 'photo', draggable: false });
      old.replaceWith(next);
      next.animate(spring(dir > 0 ? 100 : -100), { duration: 1000, easing: 'linear' });
      next.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 800, easing: EASE.io });
      box.querySelector('.gallery-count').textContent = `${k + 1} / ${imgs.length}`;
      stage.querySelector('.gallery-tools small').textContent = `${k + 1} / ${imgs.length} images`;
      bindImageErrors();
    };
  }

  const baseShow = show, baseRenderConsole = renderConsole, baseGo = go;
  show = function () {
    stopIntro();
    sliding = false;
    baseShow();
    if (state.view === 'gallery') renderGallery();
  };
  renderConsole = function () {
    baseRenderConsole();
    if (state.view === 'gallery') document.getElementById('consoleContext').innerHTML = SETS.map(([t], i) => `<button type="button" data-action="gallerySelect" data-index="${i}" aria-pressed="${state.gallery === i}">${t}</button>`).join('');
  };
  go = function (v) {
    if (v === 'gallery' && state.view !== 'gallery') { img = 0; picked = false; intro = true; }
    return baseGo(v);
  };

  // Capture phase runs before index.html's click handler, which then sets state.gallery and calls show().
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-action]');
    if (!b) return;
    if (b.dataset.action === 'gallerySelect') { img = 0; picked = true; }
    else if (b.dataset.action === 'galleryStep') slide(Number(b.dataset.dir));
  }, true);
})();
