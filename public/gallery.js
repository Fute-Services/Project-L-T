// Gallery categories: Exterior / Skyline / Interior, each with several images.
// Kept out of index.html on purpose: vite.config.ts injects this file after index.html's own script,
// and it only wraps the gallery view (show, renderConsole, go); every other view is untouched.
(() => {
  'use strict';

  // [src, alt, caption]. hero / architecture / location_aerial are the original gallery renders from index.html.
  const SETS = [
    ['Exterior', [
      [A.hero, 'Innovation Campus tower at sunset beside the elevated highway.', "Samagam of innovation connectivity and grandeur"],
      [A.architecture, 'Innovation Campus tower at sunset with the flyover in front.', "Strategically positioned near Mumbai's landmark double-decker bridge"],
      ['/img/gallery/grand-arrival.jpg', 'Gated night arrival at Innovation Campus beside the flyover.', "Grand Arrival, Crafted For Privacy And Prestige"],
      ['/img/gallery/circulation-aerial.jpg', 'Innovation Campus rising above the Mumbai skyline at sunset.', "At the Epicentre of Mumbai's Business Landscape"],
      [A.location_aerial, 'Aerial view of Innovation Campus within the surrounding neighbourhood.'],
    ]],
    ['Skyline', [
      ['/img/gallery/unobstructed-views.jpg', 'Corner office at night overlooking the Bandra-Worli Sea Link.', "Unobstructed Views, For All 365 Days & Forever"],
      ['/img/gallery/elevated-workspaces.jpg', 'Workspace with floor-to-ceiling glazing above the city at night.', "Elevated Workspaces , Extraordinary Perspectives"],
      ['/img/gallery/skyline-night.jpg', 'Executive office with a night view of the city skyline.', "A Landmark that defines the skyline"],
    ]],
    ['Interior', [
      ['/img/gallery/signature-lobby.jpg', 'Double-height lobby with reception desk and lounge seating.', "A Signature Arrival Of Luxury And Legacy"],
      ['/img/gallery/interior-lobby-lounge.jpg', 'Lobby lounge with armchairs arranged around a glass water feature.', 'Lobby Lounge'],
      ['/img/gallery/interior-cafe.jpg', 'Café counter with pastry display and table seating beside the glazed lobby.', 'Café'],
      ['/img/gallery/interior-fitness.jpg', 'Fitness centre with cardio machines, weights and a mirrored wall.', 'Fitness Centre'],
      ['/img/gallery/interior-creche.jpg', 'Creche play area with reading nooks, activity tables and a play house.', 'Creche'],
      ['/img/gallery/interior-cafeteria.jpg', 'Cafeteria with long dining tables and full-height windows onto the city.', 'Cafeteria'],
      ['/img/gallery/interior-business-lounge.jpg', 'Business lounge with armchairs, a central fireplace and city views.', 'Business Lounge'],
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
.gallery-caption{position:absolute;z-index:3;right:32px;bottom:140px;max-width:min(672px,calc(100% - 64px));text-align:right;pointer-events:none;user-select:none}
.gallery-caption p{display:inline-block;margin:0;padding:16px 56px 16px 48px;color:#fff;font:300 20px/28px Inter,sans-serif;letter-spacing:.05em;text-transform:uppercase;filter:drop-shadow(0 2px 8px rgba(0,0,0,.5));background:linear-gradient(90deg,rgba(161,134,78,.10) 0%,rgba(161,134,78,.4) 40%,rgba(161,134,78,.85) 85%,rgba(161,134,78,.95) 100%);border-radius:40px 9999px 9999px 40px}
@media(max-width:1023px){.gallery-caption p{font-size:18px;padding:12px 48px 12px 40px}}
.gallery-intro{position:absolute;inset:0;z-index:4;display:flex;align-items:center;justify-content:center;pointer-events:none}
.gallery-intro h1{margin:0;color:#fff;font:300 60px/1 Inter,sans-serif;letter-spacing:.15em;opacity:0}
.gallery-blur{filter:blur(24px)}.gallery-blur.clear{filter:blur(0px);transition:filter 1.5s cubic-bezier(.42,0,.58,1) 1.5s}
.gallery-intro-on .console-rail,.gallery-intro-on .console-context,.gallery-intro-on .header-controls,.gallery-intro-on .footer{opacity:0;pointer-events:none}
@media(min-width:768px){.gallery-intro h1{font-size:96px}}@media(min-width:1024px){.gallery-intro h1{font-size:100px}}
@media(max-width:700px){.gallery-caption{right:16px;bottom:200px;max-width:calc(100% - 32px)}.gallery-caption p{font-size:11px;line-height:1.3;padding:8px 32px 8px 24px}.console .gallery-step{width:44px;height:44px}.console .gallery-step.prev{left:12px}.console .gallery-step.next{right:12px}.console .gallery-count{right:20px;bottom:92px}}`;
  document.head.append(css);

  const EASE = { io: 'cubic-bezier(.42,0,.58,1)', intro: 'cubic-bezier(.25,1,.5,1)', sweep: 'cubic-bezier(.16,1,.3,1)' };
  const UI = '.console-rail,.console-context,.header-controls,.footer';

  // Arrows and counter stay hidden until a category tab is clicked; the intro plays on each visit.
  let img = 0, picked = false, intro = false, timers = [], sliding = false, dir = 1;

  const step = (side, label, d, cat) => `<button type="button" class="gallery-step ${side}" data-action="galleryStep" data-dir="${d}" aria-label="${label} ${cat.toLowerCase()} image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d < 0 ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}"/></svg></button>`;

  const caption = title => title ? `<div class="gallery-caption"><p>${esc(title)}</p></div>` : '';

  // Caption sweeps in from the left while its letter-spacing tightens (same motion as the earlier gallery titles).
  function animateCaption(delay = 500) {
    const p = stage.querySelector('.gallery-caption p');
    if (!p) return;
    p.animate([{ opacity: 0, scale: '.95', letterSpacing: '.2em' }, { opacity: 1, scale: '1', letterSpacing: '.05em' }], { duration: 1600, delay, easing: 'cubic-bezier(0,0,.58,1)', fill: 'backwards' });
    p.animate([{ translate: '-55vw 0', easing: EASE.sweep }, { translate: '-25vw 0', offset: .35, easing: EASE.sweep }, { translate: '0 0' }], { duration: 500, delay, fill: 'backwards' });
  }

  function stopIntro() {
    timers.forEach(clearTimeout);
    timers = [];
    app.classList.remove('gallery-intro-on');
  }

  function renderGallery() {
    const [cat, imgs] = SETS[state.gallery], n = imgs.length, k = img % n, [src, alt, title] = imgs[k];
    stage.innerHTML = `<section class="scene gallery-shell"><div class="gallery-heading"><div><div class="eyebrow">Client-supplied project gallery</div><h2>${cat}.</h2></div>${action('Overview', 'overview', true)}</div><div class="gallery-image${intro ? ' gallery-blur' : ''}"><img src="${src}" alt="${esc(alt)}" class="photo" draggable="false">${caption(title)}${picked && n > 1 ? step('prev', 'Previous', -1, cat) + step('next', 'Next', 1, cat) + `<span class="gallery-count">${k + 1} / ${n}</span>` : ''}</div>${intro ? '<div class="gallery-intro"><h1>GALLERY</h1></div>' : ''}<nav class="gallery-tools" aria-label="Select project gallery category">${SETS.map(([t], i) => `<button type="button" data-action="gallerySelect" data-index="${i}" aria-pressed="${state.gallery === i}">${t}</button>`).join('')}<small>${k + 1} / ${n} images</small></nav></section>`;
    bindImageErrors();
    if (intro) playIntro();
    else animateCaption();
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
      animateCaption(1500);
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
    const view = stage.firstElementChild, cap = box.querySelector('.gallery-caption');
    if (cap) cap.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, easing: EASE.io, fill: 'forwards' });
    old.animate([{ transform: 'translateX(0)', opacity: 1 }, { transform: `translateX(${dir > 0 ? -100 : 100}%)`, opacity: 0 }], { duration: 600, easing: EASE.io, fill: 'forwards' }).onfinish = () => {
      sliding = false;
      if (stage.firstElementChild !== view) return; // left the gallery mid-slide
      const [cat, imgs] = SETS[state.gallery], k = img % imgs.length, [src, alt, title] = imgs[k];
      const next = document.createElement('img');
      Object.assign(next, { src, alt, className: 'photo', draggable: false });
      old.replaceWith(next);
      if (cap) cap.remove();
      next.insertAdjacentHTML('afterend', caption(title));
      animateCaption();
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
