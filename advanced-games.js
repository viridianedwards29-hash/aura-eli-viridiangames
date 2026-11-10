(() => {
  const modal = document.querySelector('#advanced-modal');
  const stage = document.querySelector('#advanced-stage');
  const hud = document.querySelector('#advanced-hud');
  const title = document.querySelector('#advanced-title');
  const category = document.querySelector('#advanced-category');
  const description = document.querySelector('#advanced-description');
  const controls = document.querySelector('#advanced-controls');
  const restart = document.querySelector('#advanced-restart');
  let active = '', cleanup = () => {}, lastFocus = null;
  const info = {
    hole: { title: 'Hole Borough', category: 'CITY ARENA · CPU RIVALS', description: 'Roam an isometric city, swallow objects you are big enough to eat, and outgrow the rival holes.' },
    cookie: { title: 'Cookie Kingdom', category: 'INCREMENTAL · BAKERY EMPIRE', description: 'Click for cookies, invest in fourteen kinds of production, and unlock over a hundred building upgrades.' },
    planet: { title: 'Planet Forge', category: '3D-STYLE PLANET SANDBOX', description: 'Rotate worlds and use persistent, size-scaled weapons to carve craters and fracture their surfaces.' },
    blast: { title: 'Block Bloom', category: 'BLOCK PUZZLE · ENDLESS', description: 'Drag shapes onto the 8 × 8 board. Complete rows and columns to clear space and keep going.' },
    chess: { title: 'Garden Chess', category: 'LOCAL TWO-PLAYER CHESS', description: 'A pass-and-play chess match for two people sharing this device. Moves, castling, en passant, promotion, check, and mate are handled locally.' },
    sound: { title: 'Echo Grove', category: 'SOUNDBOARD · LISTEN & REPEAT', description: 'Tap a dozen original sounds in freeplay, or switch on Echo Challenge and repeat the grove’s growing sound pattern.' }
  };
  function makeHud(items) { hud.innerHTML = items.map((item, i) => `<div class="hud-chip"><span>${item.label}</span><b id="advanced-hud-${i}">${item.value}</b></div>`).join('') + '<div class="hud-message" id="advanced-message" aria-live="polite"></div>'; }
  function hudValue(i, value) { const el = document.querySelector(`#advanced-hud-${i}`); if (el) el.textContent = value; }
  function message(value) { const el = document.querySelector('#advanced-message'); if (el) el.textContent = value || ''; }
  function stop() { cleanup(); cleanup = () => {}; stage.innerHTML = ''; hud.innerHTML = ''; }
  function launch(key) {
    if (!info[key]) return;
    stop(); active = key; title.textContent = info[key].title; category.textContent = info[key].category; description.textContent = info[key].description;
    restart.textContent = 'Start a new game  ↻';
    if (key === 'hole') startHole(); if (key === 'cookie') startCookie(); if (key === 'planet') startPlanet(); if (key === 'blast') startBlast(); if (key === 'chess') startChess(); if (key === 'sound') startSound();
  }
  function open(key, opener) { active = key; lastFocus = opener; modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; launch(key); modal.querySelector('.close-button').focus(); }
  function close() { if (!modal.classList.contains('is-open')) return; stop(); modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; active = ''; if (lastFocus) lastFocus.focus(); }
  document.querySelectorAll('.advanced-open').forEach(button => button.addEventListener('click', () => open(button.dataset.advanced, button)));
  document.querySelectorAll('[data-advanced-close]').forEach(button => button.addEventListener('click', close));
  restart.addEventListener('click', () => { if (active) launch(active); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) close();
    if (event.key === 'Tab' && modal.classList.contains('is-open')) {
      const items = [...modal.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),[tabindex="0"]')].filter(el => el.offsetParent !== null);
      if (!items.length) return; const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  function startCookie() {
    const defs = [
      ['🖱️', 'Cursor', 15, .1], ['👵', 'Grandma', 100, 1], ['🌱', 'Farm', 1100, 8], ['⛏️', 'Mine', 12000, 47],
      ['🏭', 'Factory', 130000, 260], ['🏦', 'Bank', 1400000, 1400], ['🛕', 'Temple', 20000000, 7800], ['🧙', 'Wizard Tower', 330000000, 44000],
      ['🚀', 'Shipment', 5100000000, 260000], ['⚗️', 'Alchemy Lab', 75000000000, 1600000], ['🌀', 'Portal', 1000000000000, 10000000], ['⌛', 'Time Machine', 14000000000000, 65000000],
      ['⚛️', 'Antimatter Condenser', 170000000000000, 430000000], ['🌈', 'Prism', 2100000000000000, 2900000000]
    ].map(([icon, name, price, cps]) => ({ icon, name, base: price, cps }));
    const saveKey = 'aura-cookie-kingdom-v1', milestones = [1, 5, 10, 25, 50, 100, 200, 500, 1000, 2000];
    let saved = {}; try { saved = JSON.parse(localStorage.getItem(saveKey) || '{}'); } catch (_) {}
    let cookies = Number(saved.cookies) || 0, counts = Array.isArray(saved.counts) ? saved.counts.slice(0, defs.length) : [], multipliers = Array.isArray(saved.multipliers) ? saved.multipliers.slice(0, defs.length) : [], upgradeLevels = Array.isArray(saved.upgradeLevels) ? saved.upgradeLevels.slice(0, defs.length) : [];
    while (counts.length < defs.length) counts.push(0); while (multipliers.length < defs.length) multipliers.push(1); while (upgradeLevels.length < defs.length) upgradeLevels.push(0);
    let clicks = Number(saved.clicks) || 0, clickPower = Number(saved.clickPower) || 1, clickUpgradeLevel = Number(saved.clickUpgradeLevel) || 0, muted = !!saved.muted, paused = false, tab = 'buildings', frenzyUntil = 0, elapsed = 0, goldenTimer = 32, done = false, timer = 0, goldenButton = null;
    const clickMilestones = [25, 100, 500, 2500, 10000];
    function format(value) {
      if (!Number.isFinite(value)) return '∞';
      if (value < 1000) return Math.floor(value).toLocaleString();
      const names = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No'];
      const exponent = Math.min(names.length - 1, Math.floor(Math.log10(value) / 3));
      return `${(value / Math.pow(1000, exponent)).toFixed(value >= 1e12 ? 2 : 1)} ${names[exponent]}`;
    }
    function cps() { return defs.reduce((sum, def, i) => sum + counts[i] * def.cps * multipliers[i], 0) * (performance.now() < frenzyUntil ? 7 : 1); }
    function save() { try { localStorage.setItem(saveKey, JSON.stringify({ cookies, counts, multipliers, upgradeLevels, clicks, clickPower, clickUpgradeLevel, muted })); } catch (_) {} }
    function playTone(freq = 480, duration = .045) {
      if (muted) return;
      try { const Audio = window.AudioContext || window.webkitAudioContext; if (!Audio) return; const ctx = new Audio(); const osc = ctx.createOscillator(), gain = ctx.createGain(); osc.frequency.value = freq; osc.type = 'sine'; gain.gain.setValueAtTime(.045, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + duration); osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + duration); osc.onended = () => ctx.close(); } catch (_) {}
    }
    makeHud([{ label: 'Cookies', value: format(cookies) }, { label: 'Per second', value: format(cps()) }, { label: 'Clicks', value: format(clicks) }]);
    controls.textContent = 'Click the cookie, buy production, and spend cookies on upgrades. Progress saves in this browser.';
    stage.innerHTML = `<div class="cookie-game"><div class="cookie-main"><p class="cookie-count" id="cookie-count">${format(cookies)} cookies</p><p class="cookie-rate" id="cookie-rate">${format(cps())} cookies per second</p><button class="cookie-click" aria-label="Bake one cookie"><i class="cookie-chip-big"></i><i class="cookie-chip-big"></i><i class="cookie-chip-big"></i><i class="cookie-chip-big"></i></button><button class="cookie-golden" hidden aria-label="Golden cookie bonus">★</button><div class="cookie-tools"><button id="cookie-tab-buildings">Buildings</button><button id="cookie-tab-upgrades">Upgrades</button><button id="cookie-mute">Sound: ${muted ? 'Off' : 'On'}</button><button id="cookie-reset">Reset bakery</button></div></div><div class="cookie-shop"><h3 id="cookie-shop-title">Buildings</h3><div class="cookie-shop-list" id="cookie-shop-list"></div></div></div>`;
    const cookieButton = stage.querySelector('.cookie-click'), countLabel = stage.querySelector('#cookie-count'), rateLabel = stage.querySelector('#cookie-rate'), shop = stage.querySelector('#cookie-shop-list'), shopTitle = stage.querySelector('#cookie-shop-title'); goldenButton = stage.querySelector('.cookie-golden');
    function buildingCost(i) { return defs[i].base * Math.pow(1.15, counts[i]); }
    function clickUpgradeCost() { return [100, 1000, 10000, 100000, 1000000][clickUpgradeLevel] || Infinity; }
    function renderShop() {
      shop.innerHTML = '';
      if (tab === 'buildings') {
        shopTitle.textContent = 'Buildings';
        defs.forEach((def, i) => {
          const cost = buildingCost(i), button = document.createElement('button'); button.className = 'cookie-building'; button.dataset.cost = cost; button.disabled = cookies < cost || paused;
          button.innerHTML = `<span class="cookie-icon">${def.icon}</span><span class="cookie-build-info"><b>${def.name} <small>Owned: ${counts[i]} · ${format(def.cps * multipliers[i])}/sec</small></b></span><span class="cookie-price">${format(cost)}</span>`;
          button.addEventListener('click', () => { if (cookies < cost || paused) return; cookies -= cost; counts[i]++; playTone(350 + i * 17); render(); }); shop.append(button);
        });
      } else {
        shopTitle.textContent = 'Upgrades';
        const clickCost = clickUpgradeCost();
        if (clickUpgradeLevel < clickMilestones.length) {
          const button = document.createElement('button'); button.className = 'cookie-upgrade'; button.dataset.cost = clickCost; button.disabled = cookies < clickCost || paused;
          button.innerHTML = `<span class="cookie-icon">✋</span><span class="cookie-build-info"><b>Sugar fingers · click power ×2<small>${clicks} clicks so far</small></b></span><span class="cookie-price">${format(clickCost)}</span>`;
          button.addEventListener('click', () => { if (cookies < clickCost || paused) return; cookies -= clickCost; clickPower *= 2; clickUpgradeLevel++; playTone(780); render(); }); shop.append(button);
        }
        defs.forEach((def, i) => {
          const level = upgradeLevels[i], milestone = milestones[level];
          if (milestone === undefined || counts[i] < milestone) return;
          const price = def.base * milestone * 18, button = document.createElement('button'); button.className = 'cookie-upgrade'; button.dataset.cost = price; button.disabled = cookies < price || paused;
          button.innerHTML = `<span class="cookie-icon">${def.icon}</span><span class="cookie-build-info"><b>${def.name} · Double production<small>Own ${milestone} to unlock</small></b></span><span class="cookie-price">${format(price)}</span>`;
          button.addEventListener('click', () => { if (cookies < price || counts[i] < milestone || paused) return; cookies -= price; multipliers[i] *= 2; upgradeLevels[i]++; playTone(660); render(); }); shop.append(button);
        });
        if (!shop.children.length) shop.innerHTML = '<p style="color:#bdc9b2;font-size:10px;padding:8px">Buy a building to unlock production upgrades.</p>';
      }
    }
    function render() {
      hudValue(0, format(cookies)); hudValue(1, format(cps())); hudValue(2, format(clicks)); countLabel.textContent = `${format(cookies)} cookies`;
      rateLabel.textContent = `${format(cps())} cookies per second${paused ? ' · paused' : ''}`;
      stage.querySelector('#cookie-tab-buildings').classList.toggle('active', tab === 'buildings'); stage.querySelector('#cookie-tab-upgrades').classList.toggle('active', tab === 'upgrades');
      renderShop();
    }
    function updateTick() { hudValue(0, format(cookies)); hudValue(1, format(cps())); hudValue(2, format(clicks)); countLabel.textContent = `${format(cookies)} cookies`; rateLabel.textContent = `${format(cps())} cookies per second`; shop.querySelectorAll('[data-cost]').forEach(button => button.disabled = paused || cookies < Number(button.dataset.cost)); }
    cookieButton.addEventListener('click', event => {
      if (paused || done) return;
      cookies += clickPower; clicks++; playTone(500 + Math.min(clicks % 10, 5) * 32);
      const rect = stage.querySelector('.cookie-main').getBoundingClientRect(), float = document.createElement('span'); float.className = 'cookie-float'; float.textContent = `+${format(clickPower)}`; float.style.left = `${event.clientX - rect.left}px`; float.style.top = `${event.clientY - rect.top}px`; stage.querySelector('.cookie-main').append(float); setTimeout(() => float.remove(), 900);
      render();
    });
    stage.querySelector('#cookie-tab-buildings').addEventListener('click', () => { tab = 'buildings'; render(); });
    stage.querySelector('#cookie-tab-upgrades').addEventListener('click', () => { tab = 'upgrades'; render(); });
    stage.querySelector('#cookie-mute').addEventListener('click', event => { muted = !muted; event.currentTarget.textContent = `Sound: ${muted ? 'Off' : 'On'}`; save(); });
    stage.querySelector('#cookie-reset').addEventListener('click', () => { if (!confirm('Reset this bakery and its saved progress?')) return; cookies = 0; clicks = 0; clickPower = 1; clickUpgradeLevel = 0; counts = defs.map(() => 0); multipliers = defs.map(() => 1); upgradeLevels = defs.map(() => 0); save(); render(); });
    goldenButton.addEventListener('click', () => { if (goldenButton.hidden || paused) return; goldenButton.hidden = true; cookies += Math.max(100, cookies * .06); frenzyUntil = performance.now() + 20000; message('Golden rush · seven times production for 20 seconds!'); playTone(950, .16); render(); });
    stage.querySelector('.cookie-tools').insertAdjacentHTML('afterbegin', '<button id="cookie-pause">Pause</button>');
    stage.querySelector('#cookie-pause').addEventListener('click', event => { paused = !paused; event.currentTarget.textContent = paused ? 'Resume' : 'Pause'; render(); });
    let last = performance.now(), lastSaved = 0;
    timer = setInterval(() => {
      if (done) return;
      const now = performance.now(), dt = Math.min(1, (now - last) / 1000); last = now;
      if (!paused) { cookies += cps() * dt; elapsed += dt; goldenTimer -= dt; if (goldenTimer <= 0 && goldenButton.hidden) { goldenButton.hidden = false; goldenTimer = 36 + Math.random() * 32; } updateTick(); if (elapsed - lastSaved >= 10) { save(); lastSaved = elapsed; } }
    }, 250);
    render();
    cleanup = () => { done = true; clearInterval(timer); save(); };
  }

  function startHole() {
    makeHud([{ label: 'Size', value: '16' }, { label: 'Score', value: '0' }, { label: 'Time', value: '2:00' }, { label: 'Rank', value: '1 / 5' }]);
    controls.textContent = 'WASD moves · drag the city to rotate your view · swallow anything smaller than your rim. Local CPU rivals; no online connection.';
    stage.innerHTML = `<div class="hole-game"><canvas class="hole-canvas" aria-label="Isometric city sinkhole game"></canvas><div class="hole-topbar"><span class="hole-tag">HOLE BOROUGH</span><button class="hole-pause">Pause</button></div><div class="hole-leaderboard"></div><div class="hole-overlay show"><div class="hole-start"><span class="hole-tag">CITY ARENA</span><h2>Make the city disappear.</h2><p>Grow from street level to skyline size before the clock runs out.</p><div class="hole-mode-buttons"><button data-mode="classic">Classic · 2 min</button><button data-mode="endless">Endless</button><button data-mode="survival">Survival</button></div><small>Use WASD to move · drag to rotate view</small></div></div><div class="hole-toast"></div></div>`;
    const canvas = stage.querySelector('canvas'), ctx = canvas.getContext('2d'), overlay = stage.querySelector('.hole-overlay'), pauseButton = stage.querySelector('.hole-pause'), leaderboard = stage.querySelector('.hole-leaderboard');
    const W = 2300, H = 1900, keys = new Set(), objects = [], holes = [], particles = [];
    let player = { x: W / 2, y: H / 2, mass: 1, score: 0, radius: 16, color: '#15131b', name: 'YOU' }, mode = 'classic', left = 120, paused = true, over = false, raf = 0, last = 0, rot = -.34, dragging = false, px = 0, lastPop = 0;
    const types = [
      ['person', 180, 180, '#ffbd7c', 12, .5, 1], ['bin', 105, 105, '#70c7a4', 15, .9, 2], ['bench', 84, 95, '#bb8058', 18, 1.8, 3],
      ['light', 90, 130, '#f5cb61', 22, 2.4, 4], ['tree', 130, 155, '#5abf77', 24, 3, 5], ['car', 135, 105, '#57b9e2', 29, 5, 7],
      ['shop', 66, 76, '#e8916f', 40, 13, 12], ['house', 78, 80, '#e7b769', 47, 18, 15], ['bus', 28, 28, '#efcb4a', 54, 26, 19],
      ['tower', 17, 20, '#9a91d3', 82, 70, 30], ['skyscraper', 9, 10, '#76afd3', 116, 130, 44]
    ];
    function rand(min, max) { return min + Math.random() * (max - min); }
    for (let gx = 90; gx < W - 70; gx += 118) for (let gy = 95; gy < H - 70; gy += 118) {
      const rx = gx % 590 < 118 || gy % 472 < 118;
      if (rx) continue;
      const kind = Math.random() < .33 ? 'skyscraper' : Math.random() < .35 ? 'house' : Math.random() < .4 ? 'shop' : 'tower';
      const def = types.find(t => t[0] === kind), spread = kind === 'skyscraper' ? 1 : 1;
      objects.push({ x: gx + rand(-28, 28), y: gy + rand(-27, 27), kind, w: def[1] * spread, h: def[2] * spread, color: def[3], min: def[4], mass: def[5], score: def[6], fall: 0, maxFall: 0, phase: Math.random() * 7 });
      for (let j = 0; j < (kind === 'house' || kind === 'shop' ? 3 : 1); j++) {
        const t = types[Math.floor(Math.random() * 6)];
        objects.push({ x: gx + rand(-70, 70), y: gy + rand(-66, 66), kind: t[0], w: t[1], h: t[2], color: t[3], min: t[4], mass: t[5], score: t[6], fall: 0, maxFall: 0, phase: Math.random() * 7 });
      }
    }
    ['NOVA', 'MOSS', 'EMBER', 'TIDE'].forEach((name, i) => holes.push({ x: rand(110, W - 110), y: rand(110, H - 110), mass: 1.2 + Math.random() * .8, score: 0, radius: 17 + i * .4, color: ['#c94b7c', '#2caa92', '#db853b', '#527bd6'][i], name, target: null, think: 0, alive: true }));
    function resize() { const rect = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 1.5); canvas.width = Math.round(rect.width * dpr); canvas.height = Math.round(rect.height * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    const ro = new ResizeObserver(resize); ro.observe(canvas); resize();
    function view(p) { const rect = canvas.getBoundingClientRect(), sc = Math.min(rect.width / 870, rect.height / 650, 1); const c = Math.cos(rot), s = Math.sin(rot), dx = p.x - player.x, dy = p.y - player.y; return { x: rect.width / 2 + (dx * c - dy * s) * sc, y: rect.height * .5 + (dx * s + dy * c) * sc * .76, sc }; }
    function sizeOf(h) { return 11 + Math.sqrt(h.mass) * 6; }
    function pop(text, x, y) { const t = stage.querySelector('.hole-toast'); t.textContent = text; t.classList.add('show'); clearTimeout(lastPop); lastPop = setTimeout(() => t.classList.remove('show'), 1250); }
    function finishByHole(name) { over = true; paused = true; overlay.innerHTML = `<div class="hole-start"><span class="hole-tag">RUN OVER</span><h2>${name} caught your hole.</h2><p>You swallowed ${player.score.toLocaleString()} points of city.</p><button class="hole-play-again">Try again</button></div>`; overlay.classList.add('show'); overlay.querySelector('.hole-play-again').onclick = () => launch('hole'); }
    function absorb(h, o) { o.fall = .001; o.maxFall = 1; h.mass += o.mass; h.score += o.score; h.radius = sizeOf(h); for (let i = 0; i < 10; i++) particles.push({ x: o.x + rand(-15, 15), y: o.y + rand(-15, 15), life: .4 + Math.random() * .4, c: o.color }); }
    function canEat(h, o) { return h.radius >= o.min && Math.hypot(h.x - o.x, h.y - o.y) < h.radius + Math.max(o.w, o.h) * .38; }
    function tickAi(h, dt) {
      if (!h.alive) return;
      const threats = [player, ...holes].filter(x => x !== h && x.radius > h.radius * 1.24 && Math.hypot(x.x - h.x, x.y - h.y) < 260).sort((a, b) => Math.hypot(a.x - h.x, a.y - h.y) - Math.hypot(b.x - h.x, b.y - h.y));
      if (threats.length) { const foe = threats[0], a = Math.atan2(h.y - foe.y, h.x - foe.x); h.x += Math.cos(a) * dt * 82; h.y += Math.sin(a) * dt * 82; }
      else {
        h.think -= dt;
        if (h.think <= 0 || !h.target || h.target.fall) { h.target = objects.filter(o => !o.fall && o.min <= h.radius).sort((a, b) => (Math.hypot(a.x - h.x, a.y - h.y) - a.score * 1.4) - (Math.hypot(b.x - h.x, b.y - h.y) - b.score * 1.4))[0]; h.think = 1.2 + Math.random() * 1.5; }
        if (h.target) { const a = Math.atan2(h.target.y - h.y, h.target.x - h.x); h.x += Math.cos(a) * dt * 58; h.y += Math.sin(a) * dt * 58; }
      }
      h.x = Math.max(20, Math.min(W - 20, h.x)); h.y = Math.max(20, Math.min(H - 20, h.y));
      for (const o of objects) if (!o.fall && canEat(h, o)) { absorb(h, o); break; }
      for (const other of [player, ...holes]) if (other !== h && h.radius > other.radius * 1.48 && Math.hypot(h.x - other.x, h.y - other.y) < h.radius * .55) { other.alive = false; if (other === player) finishByHole(h.name); else { h.mass += other.mass * .32; h.score += other.score; h.radius = sizeOf(h); other.x = rand(80, W - 80); other.y = rand(80, H - 80); other.mass = 1.4; other.score = 0; other.radius = sizeOf(other); other.alive = true; } }
    }
    function drawBuilding(o, p) {
      const sc = p.sc, w = o.w * sc * .65, h = o.h * sc * .55, tall = (o.kind === 'skyscraper' ? 90 : o.kind === 'tower' ? 54 : o.kind === 'house' ? 25 : o.kind === 'shop' ? 20 : 0) * sc;
      ctx.save(); ctx.translate(p.x, p.y - tall * .35); ctx.globalAlpha = o.fall ? Math.max(0, 1 - o.fall) : 1; if (o.fall) { ctx.rotate(Math.sin(o.phase + o.fall * 9) * o.fall * .35); const shrink = Math.max(.12, 1 - o.fall * .82); ctx.scale(shrink, shrink); }
      ctx.fillStyle = 'rgba(12,18,28,.22)'; ctx.beginPath(); ctx.ellipse(5 * sc, 6 * sc, w * .72, h * .35, 0, 0, Math.PI * 2); ctx.fill();
      if (o.kind === 'person') { ctx.fillStyle = o.color; ctx.beginPath(); ctx.arc(0, 0, 3.2 * sc, 0, 7); ctx.fill(); ctx.fillStyle = '#e7c39d'; ctx.beginPath(); ctx.arc(0, -3 * sc, 1.6 * sc, 0, 7); ctx.fill(); }
      else if (o.kind === 'tree') { ctx.fillStyle = '#7b5b40'; ctx.fillRect(-2 * sc, -8 * sc, 4 * sc, 10 * sc); ctx.fillStyle = '#50a66e'; ctx.beginPath(); ctx.arc(0, -12 * sc, 8 * sc, 0, 7); ctx.fill(); }
      else if (o.kind === 'car' || o.kind === 'bus') { ctx.fillStyle = o.color; ctx.beginPath(); ctx.roundRect(-w * .55, -h * .28, w * 1.1, h * .55, 3 * sc); ctx.fill(); ctx.fillStyle = '#d6f0ed'; ctx.fillRect(-w * .25, -h * .2, w * .42, h * .15); }
      else if (['bin', 'bench', 'light'].includes(o.kind)) { ctx.strokeStyle = o.color; ctx.lineWidth = 3 * sc; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -h * .65); ctx.stroke(); ctx.fillStyle = o.color; ctx.fillRect(-5 * sc, -h * .7, 10 * sc, 6 * sc); }
      else {
        ctx.fillStyle = o.color; ctx.beginPath(); ctx.moveTo(-w * .55, 0); ctx.lineTo(0, h * .32); ctx.lineTo(w * .55, 0); ctx.lineTo(0, -h * .32); ctx.closePath(); ctx.fill();
        ctx.fillStyle = o.color; ctx.beginPath(); ctx.moveTo(-w * .55, -tall * .56); ctx.lineTo(0, h * .32 - tall * .56); ctx.lineTo(0, h * .32); ctx.lineTo(-w * .55, 0); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#f0c894'; ctx.beginPath(); ctx.moveTo(w * .55, -tall * .56); ctx.lineTo(0, h * .32 - tall * .56); ctx.lineTo(0, h * .32); ctx.lineTo(w * .55, 0); ctx.closePath(); ctx.fill();
        if (o.kind === 'skyscraper' || o.kind === 'tower') { ctx.fillStyle = 'rgba(218,238,236,.6)'; for (let i = 0; i < 3; i++) { ctx.fillRect(-w * .38 + i * 6 * sc, -tall * .42, 2.2 * sc, 4 * sc); ctx.fillRect(3 * sc + i * 6 * sc, -tall * .42, 2.2 * sc, 4 * sc); } }
      }
      ctx.restore();
    }
    function drawHole(h, p) {
      const r = h.radius * p.sc * .66; ctx.save(); ctx.translate(p.x, p.y); ctx.fillStyle = h.color; ctx.globalAlpha = .28; ctx.beginPath(); ctx.ellipse(0, r * .18, r * 1.4, r * .62, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
      const g = ctx.createRadialGradient(-r * .18, -r * .2, r * .15, 0, 0, r * 1.1); g.addColorStop(0, '#000'); g.addColorStop(.66, '#090714'); g.addColorStop(.82, h.color); g.addColorStop(1, 'rgba(255,255,255,.8)'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, r * 1.12, r * .68, 0, 0, 7); ctx.fill(); ctx.restore();
    }
    function draw() {
      const rect = canvas.getBoundingClientRect(), w = rect.width, h = rect.height; ctx.clearRect(0, 0, w, h); const bg = ctx.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#a9cbb9'); bg.addColorStop(1, '#d8d4b5'); ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      const sc = Math.min(w / 870, h / 650, 1), c = Math.cos(rot), s = Math.sin(rot);
      for (let x = 0; x < W; x += 118) for (let y = 0; y < H; y += 118) { const dx = x - player.x, dy = y - player.y, sx = w / 2 + (dx * c - dy * s) * sc, sy = h * .5 + (dx * s + dy * c) * sc * .76; if (sx < -120 || sx > w + 120 || sy < -120 || sy > h + 120) continue; const road = x % 590 < 118 || y % 472 < 118; ctx.fillStyle = road ? '#505966' : '#d9d2b7'; ctx.fillRect(sx - 59 * sc, sy - 43 * sc, 118 * sc, 86 * sc); if (road) { ctx.strokeStyle = '#8e96a0'; ctx.setLineDash([8 * sc, 9 * sc]); ctx.beginPath(); if (x % 590 < 118) { ctx.moveTo(sx, sy - 42 * sc); ctx.lineTo(sx, sy + 42 * sc); } else { ctx.moveTo(sx - 58 * sc, sy); ctx.lineTo(sx + 58 * sc, sy); } ctx.stroke(); ctx.setLineDash([]); } }
      const drawables = objects.filter(o => !o.fall || o.fall < .95).map(o => ({ o, p: { ...view(o), sc } })).filter(v => v.p.x > -180 && v.p.x < w + 180 && v.p.y > -180 && v.p.y < h + 180).sort((a, b) => a.p.y - b.p.y);
      drawables.forEach(v => drawBuilding(v.o, v.p)); [player, ...holes].filter(hole => hole === player || hole.alive).map(hole => ({ hole, p: view(hole) })).sort((a, b) => a.p.y - b.p.y).forEach(v => drawHole(v.hole, v.p));
      particles.forEach(p => { const q = view(p); ctx.globalAlpha = Math.max(0, p.life * 2); ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(q.x, q.y, 2.6 * q.sc, 0, 7); ctx.fill(); ctx.globalAlpha = 1; });
    }
    function hudUpdate() {
      hudValue(0, Math.round(player.radius)); hudValue(1, player.score.toLocaleString()); hudValue(2, mode === 'classic' || mode === 'survival' ? `${Math.max(0, Math.floor(left / 60))}:${String(Math.max(0, Math.floor(left) % 60)).padStart(2, '0')}` : '∞');
      const ranks = [player, ...holes].sort((a, b) => b.score - a.score); hudValue(3, `${ranks.indexOf(player) + 1} / 5`); leaderboard.innerHTML = `<b>LEADERBOARD</b>${ranks.map((h, i) => `<div><i style="background:${h.color}"></i>${i + 1}. ${h.name}<span>${h.score}</span></div>`).join('')}`;
    }
    function frame(now) {
      raf = requestAnimationFrame(frame); const dt = Math.min(.04, (now - (last || now)) / 1000); last = now;
      if (!paused && !over) {
        let dx = (keys.has('d') || keys.has('arrowright') ? 1 : 0) - (keys.has('a') || keys.has('arrowleft') ? 1 : 0), dy = (keys.has('s') || keys.has('arrowdown') ? 1 : 0) - (keys.has('w') || keys.has('arrowup') ? 1 : 0); const len = Math.hypot(dx, dy) || 1; const speed = Math.max(68, 190 - player.radius * .45); const nx = Math.max(10, Math.min(W - 10, player.x + dx / len * speed * dt)), ny = Math.max(10, Math.min(H - 10, player.y + dy / len * speed * dt)); const blocked = (x,y) => objects.some(o => !o.fall && player.radius < o.min && Math.hypot(x-o.x,y-o.y) < Math.max(o.w,o.h)*.16 + player.radius*.35); if (!blocked(nx,player.y)) player.x=nx; if (!blocked(player.x,ny)) player.y=ny;
        holes.forEach(h => tickAi(h, dt));
      for (const o of objects) if (!o.fall && canEat(player, o)) absorb(player, o);
        for (const rival of holes) if (rival.alive && Math.hypot(player.x-rival.x,player.y-rival.y) < Math.min(player.radius,rival.radius)*.55) { if (player.radius > rival.radius*1.48) { player.mass += rival.mass*.32; player.score += rival.score; player.radius = sizeOf(player); rival.alive=false; rival.x=rand(80,W-80); rival.y=rand(80,H-80); rival.mass=1.4; rival.score=0; rival.radius=sizeOf(rival); rival.alive=true; pop(`You swallowed ${rival.name}!`,player.x,player.y); } else if (rival.radius > player.radius*1.48) finishByHole(rival.name); }
        objects.forEach(o => { if (o.fall) o.fall = Math.min(1, o.fall + dt * (1.8 + o.score * .02)); }); particles.forEach(p => p.life -= dt); for (let i = particles.length - 1; i >= 0; i--) if (particles[i].life <= 0) particles.splice(i, 1);
        if (mode === 'classic') { left -= dt; if (left <= 0 && !over) { left = 0; over = true; paused = true; overlay.innerHTML = `<div class="hole-start"><span class="hole-tag">ROUND OVER</span><h2>${player.score >= Math.max(...holes.map(x => x.score)) ? 'City champion!' : 'The city still stands.'}</h2><p>You swallowed ${player.score.toLocaleString()} points of city.</p><button class="hole-play-again">Play again</button></div>`; overlay.classList.add('show'); overlay.querySelector('.hole-play-again').onclick = () => launch('hole'); } }
        hudUpdate();
      }
      draw();
    }
    function begin(selected) { mode = selected; left = 120; paused = false; over = false; overlay.classList.remove('show'); overlay.querySelectorAll('button[data-mode]').forEach(b => b.disabled = true); pop(selected === 'classic' ? 'Two minutes. Make them count!' : selected === 'survival' ? 'Grow fast and watch the larger holes!' : 'No clock. Just keep growing.'); }
    overlay.querySelectorAll('[data-mode]').forEach(btn => btn.addEventListener('click', () => begin(btn.dataset.mode)));
    pauseButton.addEventListener('click', () => { if (over) return; paused = !paused; pauseButton.textContent = paused ? 'Resume' : 'Pause'; if (paused && !overlay.classList.contains('show')) { overlay.innerHTML = '<div class="hole-start"><span class="hole-tag">PAUSED</span><h2>Take a breath.</h2><button class="hole-resume">Resume city run</button></div>'; overlay.classList.add('show'); overlay.querySelector('.hole-resume').onclick = () => { overlay.classList.remove('show'); paused = false; pauseButton.textContent = 'Pause'; }; } else if (!over) { overlay.classList.add('show'); } });
    const onKey = e => { const k = e.key.toLowerCase(); if (['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(k)) { keys.add(k); if (modal.classList.contains('is-open') && active === 'hole') e.preventDefault(); } if (k === ' ' && !e.repeat) { pauseButton.click(); } };
    const onUp = e => keys.delete(e.key.toLowerCase());
    const onDown = e => { if (e.button === 0) { dragging = true; px = e.clientX; canvas.setPointerCapture(e.pointerId); } };
    const onMove = e => { if (dragging) { rot += (e.clientX - px) * .006; px = e.clientX; } };
    const onPointerUp = () => dragging = false;
    window.addEventListener('keydown', onKey); window.addEventListener('keyup', onUp); canvas.addEventListener('pointerdown', onDown); canvas.addEventListener('pointermove', onMove); canvas.addEventListener('pointerup', onPointerUp); canvas.addEventListener('pointercancel', onPointerUp);
    hudUpdate(); raf = requestAnimationFrame(frame);
    cleanup = () => { cancelAnimationFrame(raf); ro.disconnect(); clearTimeout(lastPop); window.removeEventListener('keydown', onKey); window.removeEventListener('keyup', onUp); canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('pointerup', onPointerUp); canvas.removeEventListener('pointercancel', onPointerUp); };
  }

  function startBlast() {
    const saveKey = 'aura-block-bloom-v1'; let best = 0, stats = { clears: 0, games: 0 };
    try { const s = JSON.parse(localStorage.getItem(saveKey) || '{}'); best = Number(s.best) || 0; stats = { ...stats, ...(s.stats || {}) }; } catch (_) {}
    makeHud([{ label: 'Score', value: '0' }, { label: 'Best', value: best.toLocaleString() }, { label: 'Combo', value: '—' }, { label: 'Time', value: '∞' }]);
    controls.textContent = 'Drag a shape onto the board, or select it and tap a starting square. Complete a row or column to clear it.';
    stage.innerHTML = `<div class="blast-game"><div class="blast-main"><p class="blast-status">Complete a line to clear it</p><div class="blast-board" role="grid" aria-label="8 by 8 block puzzle"></div></div><div class="blast-pieces"><h3>Your pieces</h3><div class="blast-tray"></div><div class="blast-tools"><button id="blast-pause">Pause</button><button id="blast-sound">Sound: On</button><button id="blast-new">New game</button></div><div class="blast-tools"><button data-blast-mode="classic">Classic</button><button data-blast-mode="timed">2 minute</button><button data-blast-mode="hard">Hard</button></div><p class="blast-status" id="blast-help">Best ${best.toLocaleString()} · ${stats.clears} lines cleared</p></div><div class="hole-overlay blast-overlay" hidden><div class="hole-start"><span class="hole-tag">BOARD BLOOM</span><h2>Keep the board breathing.</h2><p class="blast-final"></p><button id="blast-again">Play again</button></div></div></div>`;
    const boardEl = stage.querySelector('.blast-board'), tray = stage.querySelector('.blast-tray'), status = stage.querySelector('.blast-status'), overlay = stage.querySelector('.blast-overlay'), finalText = stage.querySelector('.blast-final');
    const shapes = [
      [[0,0]], [[0,0],[0,1]], [[0,0],[0,1],[0,2]], [[0,0],[0,1],[0,2],[0,3]], [[0,0],[0,1],[0,2],[0,3],[0,4]],
      [[0,0],[1,0]], [[0,0],[1,0],[2,0]], [[0,0],[1,0],[2,0],[3,0]], [[0,0],[1,0],[2,0],[3,0],[4,0]],
      [[0,0],[0,1],[1,0],[1,1]], [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]],
      [[0,0],[1,0],[2,0],[2,1]], [[0,1],[1,1],[2,0],[2,1]], [[0,0],[0,1],[0,2],[1,0]], [[0,0],[0,1],[0,2],[1,2]],
      [[0,0],[0,1],[1,1],[1,2]], [[0,1],[0,2],[1,0],[1,1]], [[0,1],[1,0],[1,1],[1,2]], [[0,0],[0,1],[0,2],[1,1]],
      [[0,0],[0,1],[0,2],[1,1],[2,1]], [[0,0],[1,0],[1,1],[2,1],[2,2]], [[0,1],[1,0],[1,1],[2,0]],
      [[0,0],[0,1],[1,0],[1,1],[2,0],[2,1]], [[0,0],[1,0],[2,0],[3,0],[3,1]], [[0,1],[1,1],[2,0],[2,1],[3,0]],
      [[0,0],[0,1],[0,2],[0,3],[1,1]], [[0,0],[1,0],[2,0],[2,1],[2,2]], [[0,2],[1,0],[1,1],[1,2],[2,0]],
      [[0,0],[0,1],[0,2],[1,0],[1,2]], [[0,0],[1,0],[2,0],[2,1],[2,2],[1,2]], [[0,0],[0,1],[1,1],[2,1],[2,2]],
      [[0,0],[1,0],[1,1],[1,2],[2,2]], [[0,0],[0,1],[1,0],[1,1],[1,2],[2,1]], [[0,1],[1,0],[1,1],[1,2],[2,1]],
      [[0,0],[0,1],[0,2],[1,0],[1,1]], [[0,0],[0,1],[0,2],[1,1],[1,2]], [[0,0],[1,0],[1,1],[2,1],[2,2]]
    ];
    const colors = ['#72c5ac','#e9aa69','#a9a5dd','#e47e6b','#8fc3e0','#d889b7','#c4d477'];
    let grid, pieces, score, combo, mode = 'classic', left = 120, paused = false, sound = true, gameOver = false, selected = -1, drag = null, suppressClick = false, raf = 0, last = 0, animation = 0;
    function save() { try { localStorage.setItem(saveKey, JSON.stringify({ best, stats })); } catch (_) {} }
    function randPiece() { const pool = mode === 'hard' ? shapes.slice(10) : shapes; const src = pool[Math.floor(Math.random() * pool.length)], maxR = Math.max(...src.map(c => c[0])), maxC = Math.max(...src.map(c => c[1])); return { cells: src.map(c => [...c]), rows: maxR + 1, cols: maxC + 1, color: colors[Math.floor(Math.random() * colors.length)], used: false }; }
    function makePieces() { pieces = Array.from({ length: 3 }, randPiece); }
    function play(freq) { if (!sound) return; try { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; const ac = new AC(), osc = ac.createOscillator(), gain = ac.createGain(); osc.frequency.value = freq; gain.gain.setValueAtTime(.04, ac.currentTime); gain.gain.exponentialRampToValueAtTime(.001, ac.currentTime + .1); osc.connect(gain); gain.connect(ac.destination); osc.start(); osc.stop(ac.currentTime + .1); osc.onended = () => ac.close(); } catch (_) {} }
    function fit(piece, r, c) { return piece.cells.every(([dr, dc]) => r + dr >= 0 && c + dc >= 0 && r + dr < 8 && c + dc < 8 && !grid[r + dr][c + dc]); }
    function fitsAnywhere(piece) { for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if (fit(piece, r, c)) return true; return false; }
    function renderBoard() {
      boardEl.innerHTML = ''; for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { const cell = document.createElement('button'); cell.className = 'blast-cell'; cell.dataset.r = r; cell.dataset.c = c; cell.setAttribute('role', 'gridcell'); if (grid[r][c]) { cell.classList.add('filled'); cell.style.backgroundColor = grid[r][c]; } boardEl.append(cell); }
      renderPreview();
    }
    function renderTray() {
      tray.innerHTML = ''; pieces.forEach((piece, i) => { const button = document.createElement('button'); button.className = `blast-piece${piece.used ? ' used' : ''}${selected === i ? ' selected' : ''}`; button.dataset.i = i; button.setAttribute('aria-label', `Shape ${i + 1}${piece.used ? ', used' : ''}`); const mini = document.createElement('span'); mini.className = 'blast-piece-grid'; mini.style.gridTemplateColumns = `repeat(${piece.cols},14px)`; mini.style.gridTemplateRows = `repeat(${piece.rows},14px)`; for (let r = 0; r < piece.rows; r++) for (let c = 0; c < piece.cols; c++) { const bit = document.createElement('i'); bit.className = 'blast-piece-cell'; bit.style.visibility = piece.cells.some(([y,x]) => y === r && x === c) ? 'visible' : 'hidden'; bit.style.background = piece.color; bit.dataset.r = r; bit.dataset.c = c; mini.append(bit); } button.append(mini); button.addEventListener('pointerdown', e => { if (piece.used || paused || gameOver) return; selected = i; const bit = e.target.closest('.blast-piece-cell'); drag = { i, row: bit ? Number(bit.dataset.r) : 0, col: bit ? Number(bit.dataset.c) : 0, pointer: e.pointerId, moved: false }; button.setPointerCapture(e.pointerId); renderTray(); }); button.addEventListener('pointermove', e => { if (!drag || drag.pointer !== e.pointerId) return; if (Math.abs(e.movementX) + Math.abs(e.movementY) > 2) drag.moved = true; const target = document.elementFromPoint(e.clientX, e.clientY)?.closest('.blast-cell'); if (target) previewAt(Number(target.dataset.r) - drag.row, Number(target.dataset.c) - drag.col); }); button.addEventListener('pointerup', e => { if (!drag || drag.pointer !== e.pointerId) return; const d = drag, target = document.elementFromPoint(e.clientX, e.clientY)?.closest('.blast-cell'); drag = null; if (target && d.moved) { place(i, Number(target.dataset.r) - d.row, Number(target.dataset.c) - d.col); suppressClick = true; setTimeout(() => suppressClick = false, 60); } }); button.addEventListener('pointercancel', () => drag = null); button.addEventListener('click', () => { if (suppressClick || piece.used || paused || gameOver) return; selected = i; renderTray(); renderPreview(); }); tray.append(button); });
    }
    function previewAt(r, c) { boardEl.querySelectorAll('.blast-cell').forEach(cell => { cell.classList.remove('preview-good', 'preview-bad'); }); if (selected < 0 || !pieces[selected] || pieces[selected].used) return; const piece = pieces[selected], good = fit(piece, r, c); piece.cells.forEach(([dr, dc]) => { const el = boardEl.querySelector(`[data-r="${r+dr}"][data-c="${c+dc}"]`); if (el) el.classList.add(good ? 'preview-good' : 'preview-bad'); }); }
    function renderPreview() { if (selected >= 0 && drag && drag.over) previewAt(drag.over.r, drag.over.c); }
    function place(index, r, c) {
      const piece = pieces[index]; if (!piece || piece.used || !fit(piece, r, c) || paused || gameOver) { if (piece && !piece.used) { status.textContent = 'That shape does not fit there.'; play(180); } return false; }
      piece.cells.forEach(([dr, dc]) => grid[r + dr][c + dc] = piece.color); score += piece.cells.length; piece.used = true;
      const fullRows = grid.map((row, ri) => row.every(Boolean) ? ri : -1).filter(x => x >= 0), fullCols = Array.from({ length: 8 }, (_, c0) => c0).filter(c0 => grid.every(row => row[c0])); const lines = fullRows.length + fullCols.length;
      if (lines) { combo++; stats.clears += lines; const bonus = lines * lines * 10 + (lines > 1 ? 12 * (lines - 1) : 0) + Math.max(0, combo - 1) * 15; score += bonus; const rowSet = new Set(fullRows), colSet = new Set(fullCols); grid = grid.map((row, ri) => row.map((v, ci) => rowSet.has(ri) || colSet.has(ci) ? null : v)); status.textContent = lines >= 4 ? 'Amazing clear!' : lines === 3 ? 'Triple clear!' : lines === 2 ? 'Double clear!' : combo > 1 ? `Combo ×${combo} · line clear!` : 'Line clear!'; play(660 + lines * 90); animation = performance.now() + 300; }
      else { combo = 0; status.textContent = 'Nice placement.'; play(360); }
      if (score > best) best = score; if (pieces.every(p => p.used)) { makePieces(); selected = -1; }
      renderBoard(); renderTray(); updateHud(); save(); if (!pieces.some(p => !p.used && fitsAnywhere(p))) endGame(); return true;
    }
    function endGame() { gameOver = true; paused = true; stats.games++; save(); finalText.textContent = `Final score ${score.toLocaleString()} · Best ${best.toLocaleString()}`; overlay.hidden = false; stage.querySelector('#blast-pause').textContent = 'Resume'; status.textContent = 'No remaining piece can fit.'; }
    function updateHud() { hudValue(0, score.toLocaleString()); hudValue(1, best.toLocaleString()); hudValue(2, combo ? `×${combo}` : '—'); hudValue(3, mode === 'timed' ? `${Math.ceil(left)}s` : '∞'); }
    function reset(selectedMode = mode) { mode = selectedMode; grid = Array.from({ length: 8 }, () => Array(8).fill(null)); makePieces(); score = 0; combo = 0; left = 120; paused = false; gameOver = false; selected = -1; overlay.hidden = true; status.textContent = 'Complete a line to clear it'; stage.querySelector('#blast-pause').textContent = 'Pause'; renderBoard(); renderTray(); updateHud(); }
    boardEl.addEventListener('pointermove', e => { const cell = e.target.closest('.blast-cell'); if (!cell || selected < 0) return; const off = drag && drag.moved ? drag : { row: 0, col: 0 }; previewAt(Number(cell.dataset.r) - off.row, Number(cell.dataset.c) - off.col); });
    boardEl.addEventListener('click', e => { if (suppressClick) return; const cell = e.target.closest('.blast-cell'); if (!cell || selected < 0) return; place(selected, Number(cell.dataset.r), Number(cell.dataset.c)); });
    stage.querySelector('#blast-pause').addEventListener('click', e => { if (gameOver) return; paused = !paused; e.currentTarget.textContent = paused ? 'Resume' : 'Pause'; status.textContent = paused ? 'Paused · take your time' : 'Complete a line to clear it'; });
    stage.querySelector('#blast-sound').addEventListener('click', e => { sound = !sound; e.currentTarget.textContent = `Sound: ${sound ? 'On' : 'Off'}`; });
    stage.querySelector('#blast-new').addEventListener('click', () => reset(mode)); stage.querySelector('#blast-again').addEventListener('click', () => reset(mode)); stage.querySelectorAll('[data-blast-mode]').forEach(btn => btn.addEventListener('click', () => reset(btn.dataset.blastMode)));
    let onFrame = now => { raf = requestAnimationFrame(onFrame); const dt = Math.min(.1, (now - (last || now)) / 1000); last = now; if (!paused && !gameOver && mode === 'timed') { left -= dt; if (left <= 0) endGame(); updateHud(); } if (animation && performance.now() > animation) { animation = 0; renderBoard(); } };
    reset('classic'); raf = requestAnimationFrame(onFrame);
    cleanup = () => cancelAnimationFrame(raf);
  }

  function startPlanet() {
    makeHud([{ label: 'Planet', value: 'Earth' }, { label: 'Impacts', value: '0' }, { label: 'Damage', value: '0%' }, { label: 'Fragments', value: '0' }]);
    controls.textContent = 'Drag to rotate · scroll to zoom · select a weapon, then click the world. Craters and fractures stay until you reset or undo.';
    stage.innerHTML = `<div class="planet-game"><div class="planet-canvas-wrap"><canvas class="planet-canvas" aria-label="Planet destruction sandbox"></canvas></div><aside class="planet-panel"><h3 class="planet-name">Earth · Sandbox</h3><select class="planet-select" aria-label="Select planet"><option>Earth</option><option>Mars</option><option>Jupiter</option><option>Saturn</option><option>Neptune</option><option>Venus</option><option>Mercury</option><option>Moon</option><option>Custom</option><option>Random planet</option></select><div class="planet-weapons"></div><div class="planet-tools"><button data-tool="undo">Undo impact</button><button data-tool="reset">Reset world</button><button data-tool="zoom-in">Zoom in</button><button data-tool="zoom-out">Zoom out</button><button data-tool="moon">Add moon</button><button data-tool="mode">Mode: Sandbox</button></div><label class="planet-stats">Planet scale <input class="planet-scale" type="range" min="70" max="125" value="100"></label><label class="planet-stats">World name <input class="planet-custom-name" type="text" maxlength="20" value="Earth" aria-label="World name"></label><div class="planet-stats planet-readout"></div><div class="planet-warning" aria-live="polite">Surface integrity: 100%</div></aside></div>`;
    const canvas = stage.querySelector('canvas'), ctx = canvas.getContext('2d', { alpha: false }), wrap = stage.querySelector('.planet-canvas-wrap'), select = stage.querySelector('.planet-select'), weaponBox = stage.querySelector('.planet-weapons'), panelName = stage.querySelector('.planet-name'), statEl = stage.querySelector('.planet-readout'), warn = stage.querySelector('.planet-warning'), scaleInput = stage.querySelector('.planet-scale'), nameInput = stage.querySelector('.planet-custom-name');
    const planets = {
      Earth: { base: '#2587a2', land: '#79a65c', alt: '#b5ba79', type: 'rock' }, Mars: { base: '#9e5941', land: '#d48762', alt: '#723b3d', type: 'rock' },
      Jupiter: { base: '#bd9065', land: '#e7c092', alt: '#965e53', type: 'gas' }, Saturn: { base: '#c5a76c', land: '#ecd7a5', alt: '#997c5a', type: 'gas' }, Neptune: { base: '#3375c0', land: '#679be0', alt: '#284ea0', type: 'gas' },
      Venus: { base: '#c89b58', land: '#e1c57c', alt: '#a66740', type: 'rock' }, Mercury: { base: '#8b8177', land: '#b2a99c', alt: '#5f5b59', type: 'rock' }, Moon: { base: '#aaa99e', land: '#d2d0c7', alt: '#737571', type: 'rock' }, Custom: { base: '#386d71', land: '#a6b45c', alt: '#804776', type: 'rock' }
    };
    const weapons = [
      ['Laser', 5, 1, '#64ddff'], ['Meteor', 16, 5, '#ffb36d'], ['Nuclear', 33, 12, '#ffe880'], ['Black hole', 23, 8, '#c49bff'], ['Planet cracker', 48, 24, '#ff7387'], ['Supernova', 65, 45, '#fff2c2']
    ];
    let planetName = 'Earth', mode = 'Sandbox', weapon = 'Laser', texture = document.createElement('canvas'), tctx = texture.getContext('2d'), rotation = 0, zoom = 1, scale = 1, impacts = [], particles = [], damage = 0, impactCount = 0, moons = 0, raf = 0, last = 0, dragging = false, moved = false, pointerX = 0, selectedHit = null, custom = 0, spin = 0, active = true, challenge = 0;
    texture.width = 800; texture.height = 400;
    function rngFactory(seed) { let n = seed >>> 0; return () => { n = (n * 1664525 + 1013904223) >>> 0; return n / 4294967296; }; }
    function makeTextureBaseOnly() {
      const spec = planets[planetName] || planets.Custom, rng = rngFactory(planetName.length * 177 + (custom || 4) * 931);
      tctx.clearRect(0, 0, 800, 400); tctx.fillStyle = spec.base; tctx.fillRect(0, 0, 800, 400);
      const baseGrad = tctx.createLinearGradient(0, 0, 0, 400); baseGrad.addColorStop(0, 'rgba(255,255,255,.19)'); baseGrad.addColorStop(.5, 'rgba(255,255,255,.02)'); baseGrad.addColorStop(1, 'rgba(0,0,0,.25)'); tctx.fillStyle = baseGrad; tctx.fillRect(0, 0, 800, 400);
      if (spec.type === 'gas') {
        for (let y = 8; y < 400; y += 19 + rng() * 25) { tctx.fillStyle = rng() > .5 ? spec.land : spec.alt; tctx.globalAlpha = .35 + rng() * .35; tctx.beginPath(); tctx.ellipse(rng() * 800, y, 250 + rng() * 440, 4 + rng() * 14, 0, 0, 7); tctx.fill(); } tctx.globalAlpha = 1;
      } else {
        for (let i = 0; i < 31; i++) { const x = rng() * 820 - 10, y = 18 + rng() * 364, rx = 18 + rng() * (planetName === 'Earth' ? 74 : 48), ry = 11 + rng() * (planetName === 'Earth' ? 37 : 31); tctx.fillStyle = rng() > .72 ? spec.alt : spec.land; tctx.globalAlpha = .55 + rng() * .32; tctx.beginPath(); for (let a = 0; a <= 18; a++) { const ang = a / 18 * Math.PI * 2, rr = .75 + rng() * .38, xx = x + Math.cos(ang) * rx * rr, yy = y + Math.sin(ang) * ry * rr; if (!a) tctx.moveTo(xx, yy); else tctx.lineTo(xx, yy); } tctx.closePath(); tctx.fill(); } tctx.globalAlpha = 1;
      }
      for (let i = 0; i < 32; i++) { const x = rng() * 800, y = rng() * 400, r = 2 + rng() * 7; tctx.fillStyle = 'rgba(28,29,32,.2)'; tctx.beginPath(); tctx.ellipse(x, y, r * 1.3, r * .75, 0, 0, 7); tctx.fill(); tctx.strokeStyle = 'rgba(255,248,221,.22)'; tctx.lineWidth = 1.5; tctx.beginPath(); tctx.arc(x, y, r, Math.PI, Math.PI * 2); tctx.stroke(); }
    }
    function redrawDamage() {
      makeTextureBaseOnly();
      impacts.forEach(hit => {
        const x = hit.u * 800, y = hit.v * 400, radius = hit.radius * 2.4; const g = tctx.createRadialGradient(x, y, 1, x, y, radius); g.addColorStop(0, `rgba(12,18,30,${Math.min(.86, .3 + hit.power * .013)})`); g.addColorStop(.55, 'rgba(48,33,43,.52)'); g.addColorStop(.78, 'rgba(222,152,112,.86)'); g.addColorStop(1, 'rgba(249,203,151,0)'); tctx.fillStyle = g; tctx.beginPath(); tctx.arc(x, y, radius, 0, 7); tctx.fill();
        tctx.strokeStyle = 'rgba(251,224,177,.88)'; tctx.lineWidth = 1.4 + hit.power * .06; tctx.beginPath(); tctx.ellipse(x, y, radius * 1.04, radius * .62, hit.seed, .15, Math.PI * 1.9); tctx.stroke();
        const random = rngFactory(hit.seed * 1000 + 12); for (let i = 0; i < Math.min(15, 3 + Math.floor(hit.power / 4)); i++) { const a = random() * Math.PI * 2, len = radius * (.5 + random() * 1.4); tctx.strokeStyle = 'rgba(35,26,36,.8)'; tctx.lineWidth = .8 + random() * 1.4; tctx.beginPath(); tctx.moveTo(x + Math.cos(a) * radius * .25, y + Math.sin(a) * radius * .25); tctx.lineTo(x + Math.cos(a + (random() - .5) * .6) * len, y + Math.sin(a + (random() - .5) * .6) * len); tctx.stroke(); }
      });
    }
    function makeTexture() { redrawDamage(); }
    makeTexture();
    function resize() { const rect = wrap.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 1.4); canvas.width = Math.max(1, Math.floor(rect.width * dpr)); canvas.height = Math.max(1, Math.floor(rect.height * dpr)); }
    const ro = new ResizeObserver(resize); ro.observe(wrap); resize();
    function drawPlanet(now) {
      const w = wrap.clientWidth, h = wrap.clientHeight, dpr = canvas.width / Math.max(1, w); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = '#111b2b'; ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 180; i++) { const x = (i * 97.73 % 1000) / 1000 * w, y = (i * 53.9 % 997) / 997 * h; ctx.globalAlpha = .18 + (i % 4) * .09; ctx.fillStyle = i % 7 === 0 ? '#d7e6fe' : '#fff'; ctx.fillRect(x, y, i % 9 === 0 ? 2 : 1, i % 9 === 0 ? 2 : 1); } ctx.globalAlpha = 1;
      const orbitX = w * .51, orbitY = h * .52, r = Math.min(w * .32, h * .42) * zoom * scale, ring = planetName === 'Saturn';
      const glow = ctx.createRadialGradient(orbitX, orbitY, r * .65, orbitX, orbitY, r * 1.6); glow.addColorStop(0, 'rgba(124,189,229,.15)'); glow.addColorStop(1, 'rgba(30,74,118,0)'); ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(orbitX, orbitY, r * 1.6, 0, 7); ctx.fill();
      if (ring) { ctx.save(); ctx.translate(orbitX, orbitY); ctx.rotate(-.22); ctx.strokeStyle = 'rgba(229,208,157,.64)'; ctx.lineWidth = r * .19; ctx.beginPath(); ctx.ellipse(0, 0, r * 1.62, r * .53, 0, Math.PI, Math.PI * 2); ctx.stroke(); ctx.restore(); }
      ctx.save(); ctx.beginPath(); ctx.arc(orbitX, orbitY, r, 0, 7); ctx.clip();
      const strips = Math.max(80, Math.ceil(r * 2));
      for (let i = 0; i < strips; i++) { const x = -r + (i / strips) * 2 * r, nextX = -r + ((i + 1) / strips) * 2 * r, mid = (x + nextX) / 2, half = Math.sqrt(Math.max(0, r * r - mid * mid)); if (half <= 0) continue; const lon = Math.asin(Math.max(-.999, Math.min(.999, mid / r))), u = ((.5 + (lon + rotation) / (2 * Math.PI)) % 1 + 1) % 1, sx = Math.floor(u * texture.width); ctx.drawImage(texture, sx, 0, 2, texture.height, orbitX + x, orbitY - half, Math.max(1.25, nextX - x + .6), half * 2); }
      const shade = ctx.createLinearGradient(orbitX - r, orbitY, orbitX + r, orbitY); shade.addColorStop(0, 'rgba(0,0,0,.75)'); shade.addColorStop(.24, 'rgba(0,0,0,.16)'); shade.addColorStop(.56, 'rgba(255,255,255,.14)'); shade.addColorStop(1, 'rgba(0,0,0,.56)'); ctx.fillStyle = shade; ctx.fillRect(orbitX - r, orbitY - r, r * 2, r * 2);
      const highlight = ctx.createRadialGradient(orbitX - r * .36, orbitY - r * .38, 0, orbitX - r * .36, orbitY - r * .38, r * 1.15); highlight.addColorStop(0, 'rgba(255,255,255,.27)'); highlight.addColorStop(.58, 'rgba(255,255,255,0)'); highlight.addColorStop(1, 'rgba(4,8,14,.31)'); ctx.fillStyle = highlight; ctx.fillRect(orbitX - r, orbitY - r, r * 2, r * 2); ctx.restore();
      ctx.strokeStyle = 'rgba(156,220,238,.58)'; ctx.lineWidth = Math.max(1, r * .024); ctx.beginPath(); ctx.arc(orbitX, orbitY, r * 1.006, -1.35, 1.12); ctx.stroke();
      if (ring) { ctx.save(); ctx.translate(orbitX, orbitY); ctx.rotate(-.22); ctx.strokeStyle = 'rgba(237,220,177,.8)'; ctx.lineWidth = r * .12; ctx.beginPath(); ctx.ellipse(0, 0, r * 1.62, r * .53, 0, 0, Math.PI); ctx.stroke(); ctx.restore(); }
      for (let i = 0; i < moons; i++) { const a = now * .00032 + i * 6.28 / Math.max(1, moons); const mx = orbitX + Math.cos(a) * r * (1.62 + i * .12), my = orbitY + Math.sin(a) * r * .43; ctx.fillStyle = '#b7c1c4'; ctx.beginPath(); ctx.arc(mx, my, Math.max(3, r * .045), 0, 7); ctx.fill(); }
      particles.forEach(p => { const t = (now - p.time) / 1000; if (t > 2.1) return; const a = p.angle + t * p.spin, d = p.distance + t * p.speed; ctx.globalAlpha = Math.max(0, 1 - t / 2.1); ctx.fillStyle = p.color; ctx.save(); ctx.translate(orbitX + Math.cos(a) * d, orbitY + Math.sin(a) * d * .75); ctx.rotate(a); ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5); ctx.restore(); ctx.globalAlpha = 1; });
      impacts.forEach(hit => { const frontLon = Math.atan2(Math.sin(hit.lon - rotation), Math.cos(hit.lon - rotation)); if (Math.abs(frontLon) > Math.PI / 2) return; const lat = hit.lat, x = orbitX + Math.sin(frontLon) * Math.cos(lat) * r, y = orbitY - Math.sin(lat) * r; const rr = r * (hit.radius / 110); const alpha = Math.max(.25, 1 - Math.abs(frontLon) / 1.9); ctx.globalAlpha = alpha; ctx.strokeStyle = 'rgba(35,20,31,.78)'; ctx.lineWidth = Math.max(2, rr * .22); ctx.beginPath(); ctx.arc(x, y, rr, 0, 7); ctx.stroke(); ctx.fillStyle = 'rgba(12,15,23,.58)'; ctx.beginPath(); ctx.arc(x, y, rr * .74, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(255,207,143,.8)'; ctx.lineWidth = Math.max(1, rr * .11); ctx.beginPath(); ctx.arc(x, y, rr * 1.04, .1, 4.5); ctx.stroke(); ctx.globalAlpha = 1; });
      ctx.fillStyle = 'rgba(210,224,245,.7)'; ctx.font = '10px Arial'; ctx.fillText(`${nameInput.value || planetName}  ·  ${mode}`, 15, h - 16);
    }
    function setPlanet(name) { planetName = name === 'Random planet' ? ['Earth','Mars','Jupiter','Saturn','Neptune','Venus','Mercury','Moon'][Math.floor(Math.random() * 8)] : name; if (name === 'Random planet') { custom++; } if (planetName === 'Custom') custom++; impacts = []; damage = 0; impactCount = 0; particles = []; nameInput.value = planetName === 'Custom' ? 'Moss-1' : planetName; makeTexture(); update(); }
    function update() { const integrity = Math.max(0, 100 - damage); hudValue(0, nameInput.value || planetName); hudValue(1, impactCount); hudValue(2, `${Math.round(integrity)}%`); hudValue(3, particles.length); panelName.textContent = `${nameInput.value || planetName} · ${mode}`; statEl.innerHTML = `Surface integrity: <b>${Math.round(integrity)}%</b><br>${impacts.length} crater${impacts.length === 1 ? '' : 's'} · ${moons} moon${moons === 1 ? '' : 's'}<br>Weapon: ${weapon} · ${mode === 'Challenge' ? `Target ${challenge}/8` : 'Sandbox ready'}`; warn.textContent = integrity < 25 ? 'CRITICAL · fractures are spreading across the crust.' : integrity < 60 ? 'Severe surface fractures · the planet is weakening.' : integrity < 100 ? 'Impacts are permanently changing the surface.' : 'Surface integrity: 100%'; }
    function renderWeapons() { weaponBox.innerHTML = ''; weapons.forEach(([name, power, radius, color]) => { const b = document.createElement('button'); b.textContent = name; b.classList.toggle('active', name === weapon); b.addEventListener('click', () => { weapon = name; renderWeapons(); update(); }); weaponBox.append(b); }); }
    function fire(u, v, r) {
      if (mode === 'Survival' && impactCount >= 12) { warn.textContent = 'Survival run complete · reset the world to try again.'; return; }
      const [, power, radius, color] = weapons.find(w => w[0] === weapon); const lat = (0.5 - v) * Math.PI;
      const hit = { u: ((u % 1) + 1) % 1, v: Math.max(.04, Math.min(.96, v)), lon: (u - .5) * Math.PI * 2, lat, radius: radius * (1 + (scale - 1) * .45), power, seed: Math.random() * 1000 }; impacts.push(hit); impactCount++; damage = Math.min(100, damage + power * .36);
      const pieces = Math.min(54, Math.floor(power * .85)); for (let i = 0; i < pieces; i++) particles.push({ time: performance.now(), angle: Math.random() * Math.PI * 2, distance: r * .25, speed: r * (.15 + Math.random() * .5), spin: (Math.random() - .5) * 2.2, size: 2 + Math.random() * (power / 4), color: i % 3 === 0 ? '#f9db9c' : color });
      redrawDamage(); update(); if (mode === 'Challenge') { challenge++; message(challenge >= 8 ? 'Challenge complete · the crust is shattered.' : `${8 - challenge} more impacts to fracture the planet.`); }
      message(`${weapon} impact · ${power} damage`);
      try { const AC = window.AudioContext || window.webkitAudioContext; if (AC) { const ac = new AC(), osc = ac.createOscillator(), gain = ac.createGain(); osc.type = 'sawtooth'; osc.frequency.setValueAtTime(80, ac.currentTime); osc.frequency.exponentialRampToValueAtTime(24, ac.currentTime + .32); gain.gain.setValueAtTime(.08, ac.currentTime); gain.gain.exponentialRampToValueAtTime(.001, ac.currentTime + .34); osc.connect(gain); gain.connect(ac.destination); osc.start(); osc.stop(ac.currentTime + .34); osc.onended = () => ac.close(); } } catch (_) {}
    }
    function frame(now) { raf = requestAnimationFrame(frame); const dt = Math.min(.05, (now - (last || now)) / 1000); last = now; rotation += dt * .035; particles = particles.filter(p => now - p.time < 2100); if (mode === 'Survival') { spin += dt; if (spin > 9) { spin = 0; if (impactCount < 12) { fire(.15 + Math.random() * .7, .22 + Math.random() * .56, Math.min(wrap.clientWidth, wrap.clientHeight) * .3); } } } drawPlanet(now); }
    renderWeapons(); update(); raf = requestAnimationFrame(frame);
    let onDown = e => { dragging = true; moved = false; pointerX = e.clientX; selectedHit = { x: e.clientX, y: e.clientY }; canvas.setPointerCapture(e.pointerId); };
    let onMove = e => { if (!dragging) return; const dx = e.clientX - pointerX; if (Math.abs(dx) > 1) moved = true; rotation += dx / Math.max(80, wrap.clientWidth * .55); pointerX = e.clientX; };
    let onUp = e => { if (!dragging) return; dragging = false; if (moved) return; const rect = canvas.getBoundingClientRect(), x = (e.clientX - rect.left - rect.width * .51), y = (e.clientY - rect.top - rect.height * .52), r = Math.min(rect.width * .32, rect.height * .42) * zoom * scale; if (x * x + y * y > r * r || r < 2) { message('Aim inside the planet to land a hit.'); return; } const nx = x / r, ny = y / r, lat = Math.asin(Math.max(-.98, Math.min(.98, -ny))), lon = Math.asin(Math.max(-.98, Math.min(.98, nx))) + rotation; let u = ((lon + Math.PI) / (2 * Math.PI) + 1) % 1, v = .5 - lat / Math.PI; fire(u, v, r); };
    let onWheel = e => { e.preventDefault(); zoom = Math.max(.65, Math.min(1.4, zoom - e.deltaY * .001)); };
    canvas.addEventListener('pointerdown', onDown); canvas.addEventListener('pointermove', onMove); canvas.addEventListener('pointerup', onUp); canvas.addEventListener('pointercancel', onUp); canvas.addEventListener('wheel', onWheel, { passive: false });
    select.addEventListener('change', () => setPlanet(select.value));
    nameInput.addEventListener('input', update);
    stage.querySelectorAll('[data-tool]').forEach(button => button.addEventListener('click', () => { const action = button.dataset.tool; if (action === 'undo' && impacts.length) { const h = impacts.pop(); damage = Math.max(0, damage - h.power * .36); impactCount = Math.max(0, impactCount - 1); particles.splice(-Math.min(particles.length, Math.floor(h.power * .85))); redrawDamage(); update(); message('Last impact undone.'); } if (action === 'reset') { impacts = []; particles = []; damage = 0; impactCount = 0; challenge = 0; makeTexture(); update(); message('World restored to its original surface.'); } if (action === 'zoom-in') zoom = Math.min(1.4, zoom + .12); if (action === 'zoom-out') zoom = Math.max(.65, zoom - .12); if (action === 'moon') { moons = Math.min(6, moons + 1); update(); message('A moon joined the orbit.'); } if (action === 'mode') { const modes = ['Sandbox','Solar System','Survival','Challenge']; mode = modes[(modes.indexOf(mode) + 1) % modes.length]; if (mode === 'Solar System' && !moons) moons = 2; if (mode === 'Survival') { impacts = []; damage = 0; impactCount = 0; challenge = 0; } if (mode === 'Challenge') { challenge = 0; impacts = []; damage = 0; impactCount = 0; } makeTexture(); update(); button.textContent = `Mode: ${mode}`; message(`${mode} mode selected.`); } }));
    scaleInput.addEventListener('input', () => { scale = Number(scaleInput.value) / 100; });
    cleanup = () => { active = false; cancelAnimationFrame(raf); ro.disconnect(); canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('pointercancel', onUp); canvas.removeEventListener('wheel', onWheel); };
  }

  function startSound() {
    let best = 0; try { best = Number(localStorage.getItem('aura-echo-grove-best')) || 0; } catch (_) {}
    makeHud([{ label: 'Mode', value: 'Freeplay' }, { label: 'Score', value: '0' }, { label: 'Best', value: best.toLocaleString() }, { label: 'Round', value: '—' }]);
    controls.textContent = 'Tap any pad to play a sound. In Echo Challenge, listen to the pattern, then repeat it. Keyboard keys Q W E R / A S D F / Z X C V play the pads.';
    stage.innerHTML = `<div class="sound-game"><div class="sound-header"><div><h3>Little sounds, growing songs.</h3><p class="sound-prompt" id="sound-message" aria-live="polite">Choose Freeplay or start an Echo Challenge.</p></div><div class="sound-actions"><button id="sound-free" class="active">Freeplay</button><button id="sound-echo">Echo challenge</button><button id="sound-replay" disabled>Replay pattern</button><button id="sound-stop">Stop sounds</button></div></div><div class="sound-board" role="grid" aria-label="Twelve garden sound pads"></div><div class="sound-footer"><label class="sound-volume">Volume <input id="sound-volume" type="range" min="0" max="100" value="68"><span id="sound-volume-value">68%</span></label><button id="sound-mute">Sound: On</button><span class="sound-hint">Headphones make the tiny details easier to hear.</span></div></div>`;
    const pads = [
      ['Pond ping','💧','tone',659,'sine'], ['Star bell','✦','pair',880,'triangle'], ['Seed pop','●','tone',220,'square'], ['Bird hello','🐦','chirp',740,'sine'],
      ['Wind chime','♫','pair',587,'sine'], ['Frog plop','🐸','tone',165,'triangle'], ['Rain patter','☂','noise',0,'highpass'], ['Soft thunder','☁','noise',0,'lowpass'],
      ['Wood tap','▣','tone',130,'sine'], ['Leaf rustle','🍃','noise',0,'bandpass'], ['Firefly','✧','chirp',980,'triangle'], ['Night owl','◉','chirp',310,'sine']
    ];
    const board = stage.querySelector('.sound-board'), status = stage.querySelector('#sound-message'), replay = stage.querySelector('#sound-replay'), volumeInput = stage.querySelector('#sound-volume'), volumeValue = stage.querySelector('#sound-volume-value'), freeButton = stage.querySelector('#sound-free'), echoButton = stage.querySelector('#sound-echo');
    let mode = 'free', taps = 0, score = 0, round = 0, misses = 0, sequence = [], inputAt = 0, locked = false, muted = false, volume = .68, audio = null, noiseBuffer = null, activeNodes = new Set(), timers = [], closed = false;
    const keyMap = ['q','w','e','r','a','s','d','f','z','x','c','v'];
    function say(text) { status.textContent = text; message(text); }
    function saveBest() { try { localStorage.setItem('aura-echo-grove-best', String(best)); } catch (_) {} }
    function hudUpdate() { hudValue(0, mode === 'free' ? 'Freeplay' : 'Echo'); hudValue(1, (mode === 'free' ? taps : score).toLocaleString()); hudValue(2, best.toLocaleString()); hudValue(3, mode === 'free' ? '—' : String(round)); }
    function setActivePad(index, on) { const pad = board.querySelector(`[data-pad="${index}"]`); if (pad) pad.classList.toggle('playing', on); }
    function ensureAudio() {
      if (audio) { if (audio.state === 'suspended') audio.resume().catch(() => {}); return audio; }
      const Audio = window.AudioContext || window.webkitAudioContext; if (!Audio) { say('This browser does not have audio support. The pad labels and game still work.'); return null; }
      try { audio = new Audio(); const length = Math.ceil(audio.sampleRate * .7); noiseBuffer = audio.createBuffer(1, length, audio.sampleRate); const data = noiseBuffer.getChannelData(0); for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1; return audio; } catch (_) { audio = null; say('Audio could not start in this browser.'); return null; }
    }
    function track(node) { activeNodes.add(node); node.onended = () => activeNodes.delete(node); return node; }
    function playPad(index, when) {
      if (muted || volume <= 0 || closed) return; const ctx = ensureAudio(); if (!ctx) return; const pad = pads[index], start = Math.max(ctx.currentTime + .004, when || ctx.currentTime), gain = ctx.createGain(); gain.gain.setValueAtTime(.0001, start); gain.connect(ctx.destination);
      if (pad[2] === 'noise') {
        const source = track(ctx.createBufferSource()), filter = ctx.createBiquadFilter(); source.buffer = noiseBuffer; filter.type = pad[4]; filter.frequency.value = pad[4] === 'highpass' ? 2100 : pad[4] === 'lowpass' ? 440 : 1150; filter.Q.value = pad[4] === 'bandpass' ? .7 : .45; source.connect(filter); filter.connect(gain); const dur = index === 7 ? .52 : .24, peak = volume * (index === 7 ? .19 : .13); gain.gain.exponentialRampToValueAtTime(peak, start + .014); gain.gain.exponentialRampToValueAtTime(.0001, start + dur); source.start(start); source.stop(start + dur);
      } else {
        const osc = track(ctx.createOscillator()); osc.type = pad[4]; osc.frequency.setValueAtTime(pad[3], start);
        if (pad[2] === 'chirp') { const endFreq = index === 11 ? 230 : pad[3] * 1.48; osc.frequency.exponentialRampToValueAtTime(endFreq, start + .13); }
        else if (index === 2 || index === 8) osc.frequency.exponentialRampToValueAtTime(pad[3] * .48, start + .16);
        osc.connect(gain); const dur = pad[2] === 'pair' ? .48 : pad[2] === 'chirp' ? .22 : .3, peak = volume * (pad[2] === 'pair' ? .16 : .2); gain.gain.exponentialRampToValueAtTime(peak, start + .012); gain.gain.exponentialRampToValueAtTime(.0001, start + dur); osc.start(start); osc.stop(start + dur);
        if (pad[2] === 'pair') { const second = track(ctx.createOscillator()), secondGain = ctx.createGain(); second.type = 'sine'; second.frequency.value = pad[3] * 1.25; secondGain.gain.setValueAtTime(.0001, start); secondGain.gain.exponentialRampToValueAtTime(volume * .065, start + .014); secondGain.gain.exponentialRampToValueAtTime(.0001, start + .42); second.connect(secondGain); secondGain.connect(ctx.destination); second.start(start); second.stop(start + .43); }
      }
    }
    function playSequence() {
      if (!sequence.length || closed) return; locked = true; replay.disabled = true; say('Listen closely…'); const gap = 590;
      sequence.forEach((index, position) => { const timer = setTimeout(() => { setActivePad(index, true); playPad(index); const off = setTimeout(() => setActivePad(index, false), 330); timers.push(off); }, 380 + position * gap); timers.push(timer); });
      const unlock = setTimeout(() => { locked = false; inputAt = 0; replay.disabled = false; say('Your turn — repeat the pattern.'); }, 430 + sequence.length * gap); timers.push(unlock);
    }
    function nextRound() { if (closed || mode !== 'echo') return; sequence.push(Math.floor(Math.random() * pads.length)); round++; hudUpdate(); replay.disabled = false; playSequence(); }
    function chooseMode(next) {
      timers.forEach(clearTimeout); timers = []; sequence = []; inputAt = 0; locked = false; mode = next; misses = 0; round = 0; score = 0; freeButton.classList.toggle('active', mode === 'free'); echoButton.classList.toggle('active', mode === 'echo'); replay.disabled = true;
      if (mode === 'free') say('Freeplay is ready — tap a pad or use the QWERTY row.'); else { say('Echo Challenge · listen for three sounds, then repeat them.'); const start = setTimeout(nextRound, 700); timers.push(start); }
      hudUpdate();
    }
    function hit(index) {
      if (locked || closed) return; setActivePad(index, true); setTimeout(() => setActivePad(index, false), 170); playPad(index);
      if (mode === 'free') { taps++; hudUpdate(); return; }
      if (index === sequence[inputAt]) {
        inputAt++; if (inputAt >= sequence.length) { score += round * 10; if (score > best) { best = score; saveBest(); say('Lovely echo! New best score. The pattern is growing…'); } else say('Lovely echo! The pattern is growing…'); locked = true; replay.disabled = true; hudUpdate(); const next = setTimeout(nextRound, 850); timers.push(next); }
        else say(`${sequence.length - inputAt} more sound${sequence.length - inputAt === 1 ? '' : 's'} to go…`);
      } else {
        misses++; if (misses >= 3) { locked = true; say(`The grove got quiet. Final score: ${score}. Start Echo Challenge to try again.`); sequence = []; replay.disabled = true; }
        else { locked = true; say(`Not quite · ${3 - misses} ${3 - misses === 1 ? 'try' : 'tries'} left. Listen once more…`); const replayTimer = setTimeout(playSequence, 700); timers.push(replayTimer); }
        hudUpdate();
      }
    }
    pads.forEach((def, index) => { const button = document.createElement('button'); button.className = `sound-pad sound-color-${index % 6}`; button.dataset.pad = index; button.setAttribute('role', 'gridcell'); button.setAttribute('aria-label', `${def[0]} sound, key ${keyMap[index].toUpperCase()}`); button.title = `Key ${keyMap[index].toUpperCase()}`; button.innerHTML = `<span class="sound-icon" aria-hidden="true">${def[1]}</span><b>${def[0]}</b><small>${keyMap[index].toUpperCase()}</small>`; button.addEventListener('click', () => hit(index)); board.append(button); });
    freeButton.addEventListener('click', () => chooseMode('free')); echoButton.addEventListener('click', () => chooseMode('echo')); replay.addEventListener('click', () => { if (mode === 'echo' && sequence.length && !locked) playSequence(); });
    stage.querySelector('#sound-stop').addEventListener('click', () => { activeNodes.forEach(node => { try { node.stop(); } catch (_) {} }); activeNodes.clear(); board.querySelectorAll('.playing').forEach(p => p.classList.remove('playing')); say('Sounds stopped.'); });
    stage.querySelector('#sound-mute').addEventListener('click', event => { muted = !muted; event.currentTarget.textContent = `Sound: ${muted ? 'Off' : 'On'}`; say(muted ? 'Sound is off · challenge lights still play.' : 'Sound is on.'); });
    volumeInput.addEventListener('input', () => { volume = Number(volumeInput.value) / 100; volumeValue.textContent = `${volumeInput.value}%`; });
    const onKey = event => { if (!modal.classList.contains('is-open') || active !== 'sound' || event.repeat || event.ctrlKey || event.altKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '')) return; const index = keyMap.indexOf(event.key.toLowerCase()); if (index >= 0) { event.preventDefault(); hit(index); } };
    window.addEventListener('keydown', onKey); hudUpdate();
    cleanup = () => { closed = true; timers.forEach(clearTimeout); timers = []; activeNodes.forEach(node => { try { node.stop(); } catch (_) {} }); activeNodes.clear(); window.removeEventListener('keydown', onKey); if (audio) { audio.close().catch(() => {}); audio = null; } };
  }

  function startChess() {
    makeHud([{ label: 'To move', value: 'White' }, { label: 'Move', value: '1' }, { label: 'Position', value: 'Ready' }]);
    controls.textContent = 'Two players share the board and take turns. Click a piece, then a highlighted square. No account or network is used.';
    stage.innerHTML = `<div class="chess-game"><p class="chess-status" aria-live="polite">White to move</p><div class="chess-board" role="grid" aria-label="Chess board"></div><div class="chess-promote" hidden></div><div class="blast-tools"><button class="chess-undo">Undo move</button><button class="chess-reset">New match</button></div><div class="chess-coordinates">Local pass-and-play · standard chess rules</div></div>`;
    const boardEl = stage.querySelector('.chess-board'), statusEl = stage.querySelector('.chess-status'), promoteEl = stage.querySelector('.chess-promote');
    const glyph = { wk:'♔', wq:'♕', wr:'♖', wb:'♗', wn:'♘', wp:'♙', bk:'♚', bq:'♛', br:'♜', bb:'♝', bn:'♞', bp:'♟' };
    let board, turn, selected = null, targets = [], rights, ep, halfmove, fullmove, history = [], repetitions = new Map(), result = '', promotionPending = null;
    const copyBoard = b => b.map(row => row.map(p => p ? { ...p } : null));
    function initialBoard() {
      const b = Array.from({ length: 8 }, () => Array(8).fill(null)); const back = ['r','n','b','q','k','b','n','r'];
      for (let c = 0; c < 8; c++) { b[0][c] = { t: back[c], c: 'b' }; b[1][c] = { t: 'p', c: 'b' }; b[6][c] = { t: 'p', c: 'w' }; b[7][c] = { t: back[c], c: 'w' }; }
      return b;
    }
    function keyFor(b = board, side = turn, cast = rights) { return `${side}|${cast.K?1:0}${cast.Q?1:0}${cast.k?1:0}${cast.q?1:0}|` + b.map(row => row.map(p => p ? `${p.c}${p.t}` : '--').join('')).join(''); }
    function attacked(b, r, c, by) {
      const pawnRow = r + (by === 'w' ? 1 : -1);
      for (const dc of [-1, 1]) if (pawnRow >= 0 && pawnRow < 8 && c + dc >= 0 && c + dc < 8) { const p = b[pawnRow][c + dc]; if (p && p.c === by && p.t === 'p') return true; }
      for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) { const rr=r+dr, cc=c+dc, p=rr>=0&&rr<8&&cc>=0&&cc<8?b[rr][cc]:null; if (p&&p.c===by&&p.t==='n') return true; }
      for (let dr=-1; dr<=1; dr++) for (let dc=-1; dc<=1; dc++) if (dr||dc) { const rr=r+dr, cc=c+dc, p=rr>=0&&rr<8&&cc>=0&&cc<8?b[rr][cc]:null; if (p&&p.c===by&&p.t==='k') return true; }
      for (const [dr, dc, diagonal] of [[-1,0,false],[1,0,false],[0,-1,false],[0,1,false],[-1,-1,true],[-1,1,true],[1,-1,true],[1,1,true]]) {
        let rr=r+dr, cc=c+dc, distance=1; while (rr>=0&&rr<8&&cc>=0&&cc<8) { const p=b[rr][cc]; if (p) { if (p.c===by&&(p.t==='q'||(diagonal&&p.t==='b')||(!diagonal&&p.t==='r'))) return true; break; } rr+=dr; cc+=dc; distance++; }
      }
      return false;
    }
    function kingAt(b, side) { for (let r=0;r<8;r++) for(let c=0;c<8;c++) if(b[r][c]?.t==='k'&&b[r][c].c===side) return [r,c]; return null; }
    function inCheck(b, side) { const k=kingAt(b,side); return !k || attacked(b,k[0],k[1],side==='w'?'b':'w'); }
    function applyRaw(b, m) {
      const next=copyBoard(b), p=next[m.fr][m.fc]; next[m.fr][m.fc]=null;
      if(m.ep) next[m.fr][m.tc]=null;
      if(m.castle) { const row=m.fr, kingSide=m.tc===6, rookFrom=kingSide?7:0, rookTo=kingSide?5:3; next[row][rookTo]=next[row][rookFrom]; next[row][rookFrom]=null; }
      next[m.tr][m.tc]={...p,t:m.promotion||p.t}; return next;
    }
    function pseudo(r,c) {
      const p=board[r][c], list=[]; if(!p) return list; const add=(tr,tc,extra={})=>{ if(tr<0||tr>7||tc<0||tc>7) return; const q=board[tr][tc]; if(q&&q.c===p.c) return; if(q&&q.t==='k') return; list.push({fr:r,fc:c,tr,tc,...extra}); };
      if(p.t==='p') {
        const dir=p.c==='w'?-1:1, home=p.c==='w'?6:1;
        if(r+dir>=0&&r+dir<8&&!board[r+dir][c]) { add(r+dir,c); if(r===home&&!board[r+2*dir][c]) add(r+2*dir,c,{double:true}); }
        for(const dc of [-1,1]) { const tr=r+dir,tc=c+dc; if(tr>=0&&tr<8&&tc>=0&&tc<8&&board[tr][tc]&&board[tr][tc].c!==p.c) add(tr,tc); if(ep&&ep[0]===tr&&ep[1]===tc) add(tr,tc,{ep:true}); }
      }
      if(p.t==='n') for(const [dr,dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) add(r+dr,c+dc);
      if(['b','r','q'].includes(p.t)) { const dirs=[]; if(p.t!=='r') dirs.push([-1,-1],[-1,1],[1,-1],[1,1]); if(p.t!=='b') dirs.push([-1,0],[1,0],[0,-1],[0,1]); for(const [dr,dc] of dirs) { let rr=r+dr,cc=c+dc; while(rr>=0&&rr<8&&cc>=0&&cc<8) { if(board[rr][cc]) { if(board[rr][cc].c!==p.c&&board[rr][cc].t!=='k') add(rr,cc); break; } add(rr,cc); rr+=dr; cc+=dc; } } }
      if(p.t==='k') {
        for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++) if(dr||dc) add(r+dr,c+dc);
        const row=p.c==='w'?7:0, enemy=p.c==='w'?'b':'w';
        if(r===row&&c===4&&!inCheck(board,p.c)) {
          const ks=p.c==='w'?'K':'k', qs=p.c==='w'?'Q':'q';
          if(rights[ks]&&!board[row][5]&&!board[row][6]&&board[row][7]?.t==='r'&&board[row][7]?.c===p.c&&!attacked(board,row,5,enemy)&&!attacked(board,row,6,enemy)) add(row,6,{castle:true});
          if(rights[qs]&&!board[row][3]&&!board[row][2]&&!board[row][1]&&board[row][0]?.t==='r'&&board[row][0]?.c===p.c&&!attacked(board,row,3,enemy)&&!attacked(board,row,2,enemy)) add(row,2,{castle:true});
        }
      }
      return list;
    }
    function legal(r,c) { return pseudo(r,c).filter(m=>!inCheck(applyRaw(board,m),turn)); }
    function allLegal(side) { const save=turn; turn=side; const out=[]; for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(board[r][c]?.c===side) out.push(...legal(r,c)); turn=save; return out; }
    function squareName(r,c) { return `${'abcdefgh'[c]}${8-r}`; }
    function render() {
      boardEl.innerHTML=''; const moveset=new Map(targets.map(m=>[`${m.tr},${m.tc}`,m]));
      for(let r=0;r<8;r++) for(let c=0;c<8;c++) { const p=board[r][c], btn=document.createElement('button'), id=`${r},${c}`, move=moveset.get(id); btn.className=`chess-square ${(r+c)%2?'dark':'light'}${selected&&selected[0]===r&&selected[1]===c?' selected':''}${move?' legal':''}${move&&p?' capture':''}${p?` ${p.c==='w'?'white-piece':'black-piece'}`:''}`; btn.dataset.r=r;btn.dataset.c=c;btn.setAttribute('role','gridcell');btn.setAttribute('aria-label',`${p?(p.c==='w'?'White':'Black')+' '+({p:'pawn',r:'rook',n:'knight',b:'bishop',q:'queen',k:'king'}[p.t]):'Empty'} ${squareName(r,c)}`);btn.textContent=p?glyph[p.c+p.t]:'';btn.addEventListener('click',()=>selectSquare(r,c));boardEl.append(btn); }
      const king=kingAt(board,turn); if(king&&inCheck(board,turn)) boardEl.querySelector(`[data-r="${king[0]}"][data-c="${king[1]}"]`)?.classList.add('capture');
    }
    function stateText() {
      const check=inCheck(board,turn), moves=allLegal(turn); if(!moves.length) { result=check?'checkmate':'stalemate'; statusEl.textContent=check?`${turn==='w'?'Black':'White'} wins by checkmate`:'Draw by stalemate'; } else if(halfmove>=100) { result='fifty-move draw'; statusEl.textContent='Draw by the fifty-move rule'; } else if((repetitions.get(keyFor())||0)>=3) { result='threefold repetition'; statusEl.textContent='Draw by threefold repetition'; } else { result=''; statusEl.textContent=`${turn==='w'?'White':'Black'} to move${check?' · Check!':''}`; }
      hudValue(0,turn==='w'?'White':'Black');hudValue(1,fullmove);hudValue(2,result?result.toUpperCase():check?'Check':'Ready');
    }
    function selectSquare(r,c) {
      if(result||promotionPending) return; const p=board[r][c];
      if(selected) { const move=targets.find(m=>m.tr===r&&m.tc===c); if(move) { const moving=board[move.fr][move.fc]; if(moving.t==='p'&&(r===0||r===7)) { promotionPending=move; showPromotion(moving.c); return; } commit(move); return; } }
      if(p&&p.c===turn) { selected=[r,c]; targets=legal(r,c); } else { selected=null; targets=[]; }
      render();
    }
    function showPromotion(color) { promoteEl.hidden=false; promoteEl.innerHTML=''; for(const t of ['q','r','b','n']) { const b=document.createElement('button'); b.textContent=glyph[color+t];b.setAttribute('aria-label',`Promote to ${t}`);b.addEventListener('click',()=>{const m={...promotionPending,promotion:t};promotionPending=null;promoteEl.hidden=true;commit(m);});promoteEl.append(b); } statusEl.textContent=`${color==='w'?'White':'Black'} pawn promotion · choose a piece`; }
    function commit(move) {
      history.push({board:copyBoard(board),turn,rights:{...rights},ep:ep&&[...ep],halfmove,fullmove,repetitions:new Map(repetitions)});
      const p=board[move.fr][move.fc], captured=move.ep?board[move.fr][move.tc]:board[move.tr][move.tc];
      if(p.t==='k') { rights[p.c==='w'?'K':'k']=false; rights[p.c==='w'?'Q':'q']=false; }
      if(p.t==='r') { if(move.fr===7&&move.fc===0)rights.Q=false;if(move.fr===7&&move.fc===7)rights.K=false;if(move.fr===0&&move.fc===0)rights.q=false;if(move.fr===0&&move.fc===7)rights.k=false; }
      if(captured?.t==='r') { if(move.tr===7&&move.tc===0)rights.Q=false;if(move.tr===7&&move.tc===7)rights.K=false;if(move.tr===0&&move.tc===0)rights.q=false;if(move.tr===0&&move.tc===7)rights.k=false; }
      board=applyRaw(board,move); ep=move.double?[move.fr+(p.c==='w'?-1:1),move.fc]:null; halfmove=p.t==='p'||captured?0:halfmove+1; if(turn==='b')fullmove++; turn=turn==='w'?'b':'w'; selected=null;targets=[];repetitions.set(keyFor(),(repetitions.get(keyFor())||0)+1); render(); stateText();
    }
    function reset() { board=initialBoard();turn='w';selected=null;targets=[];rights={K:true,Q:true,k:true,q:true};ep=null;halfmove=0;fullmove=1;history=[];repetitions=new Map();repetitions.set(keyFor(),1);result='';promotionPending=null;promoteEl.hidden=true;render();stateText(); }
    stage.querySelector('.chess-undo').addEventListener('click',()=>{const lastMove=history.pop();if(!lastMove)return;board=lastMove.board;turn=lastMove.turn;rights=lastMove.rights;ep=lastMove.ep;halfmove=lastMove.halfmove;fullmove=lastMove.fullmove;repetitions=lastMove.repetitions;result='';selected=null;targets=[];render();stateText();});
    stage.querySelector('.chess-reset').addEventListener('click',reset); reset();
    cleanup=()=>{ selected=null; targets=[]; };
  }
})();
