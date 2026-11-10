(() => {
  const modal = document.querySelector('#game-modal');
  const stage = document.querySelector('#game-stage');
  const hud = document.querySelector('#game-hud');
  const title = document.querySelector('#modal-title');
  const category = document.querySelector('#modal-category');
  const description = document.querySelector('#modal-description');
  const controls = document.querySelector('#game-controls');
  const restartButton = document.querySelector('#restart-game');
  let activeGame = '';
  let cleanupGame = () => {};
  let priorFocus = null;
  const gameInfo = {
    comet: { title: 'Comet Catch', category: 'ARCADE · 30 SECONDS', description: 'Slide your little catcher beneath the stars. Catch the bright blooms and let the dark comets pass.' },
    signal: { title: 'Signal Garden', category: 'MEMORY · FIND THE RHYTHM', description: 'Watch the lights wake up one by one, then tap them back in the same order. Each round adds a new note.' },
    circuit: { title: 'Circuit Bloom', category: 'PUZZLE · TURN THE TILES', description: 'Connect the glowing seed to the flower. Tap tiles to turn their little paths.' },
    kite: { title: 'Kite Keeper', category: 'ARCADE · RIDE THE BREEZE', description: 'Guide your kite through a breezy sky. Gather wind blooms, dodge the clouds, and keep your string safe.' },
    maze: { title: 'Firefly Maze', category: 'ADVENTURE · FIND YOUR WAY', description: 'Wander a little garden maze, gather three fireflies, then find the flower gate.' },
    word: { title: 'Word Lanterns', category: 'WORDPLAY · UNSHUFFLE', description: 'A small word is hiding in these letters. Use the clue and ask for gentle hints whenever you need one.' },
    pairs: { title: 'Pebble Pairs', category: 'MEMORY · FIND A MATCH', description: 'Turn over two pebbles at a time and remember where each little keepsake is hiding.' },
    shapes: { title: 'Cloud Shapes', category: 'LOGIC · REVEAL A PICTURE', description: 'Read the numbers along each row and column to reveal the hidden garden picture.' },
    stars: { title: 'Star Mapper', category: 'TRACE · CONNECT THE SKY', description: 'Follow each numbered star in order to draw three tiny constellations.' },
    lily: { title: 'Lily Hop', category: 'ARCADE · CROSS THE STREAM', description: 'Hop from the bank to the flower garden. Drift with the logs and scoop up a few pearls.' },
    numbers: { title: 'Number Nook', category: 'QUICK THINK · 45 SECONDS', description: 'Solve as many little sums as you can. The questions get a tiny bit trickier as you go.' },
    patchwork: { title: 'Patchwork Path', category: 'PUZZLE · SLIDE INTO ORDER', description: 'Slide the tiles into number order. Only tiles beside the empty space can move.' },
    runes: { title: 'Rune Riddle', category: 'DEDUCE · CRACK THE CODE', description: 'A hidden sequence of four runes is waiting. Use the clues to find the right symbols in the right places.' },
    sort: { title: 'Dewdrop Sort', category: 'PUZZLE · POUR THE COLORS', description: 'Move the little droplets between bottles until each bottle holds just one color.' },
    putt: { title: 'Pocket Putt', category: 'AIM · A TINY GOLF COURSE', description: 'Pull back from the ball to choose the strength and direction of your shot.' },
    type: { title: 'Garden Type', category: 'TYPING · FIND YOUR RHYTHM', description: 'Type as many little nature words as you can before the 45-second timer ends.' },
    seed: { title: 'Seed Shifter', category: 'PUZZLE · PUSH WITH CARE', description: 'Push every seed onto a flower plot. Seeds only move when you push from behind.' },
    swatch: { title: 'Swatch Sprint', category: 'COLOR · 40-SECOND REFLEX', description: 'Choose the color of the letters. Read the ink color, not the word.' },
    rally: { title: 'Bounce Buddies', category: 'ARCADE · SOLO RALLY', description: 'Keep the ball moving and score seven points against the garden computer.' },
    seek: { title: 'Sunbeam Seek', category: 'SEARCH · HOT AND COLD', description: 'Find the hidden sunseed. The garden tells you when your guesses are getting warmer.' },
    odd: { title: 'Odd Acorn', category: 'FOCUS · SPOT THE DIFFERENCE', description: 'Spot the one unusual symbol in each growing patch before time is up.' },
    petalpop: { title: 'Petal Pop', category: 'PUZZLE · MATCH THREE', description: 'Swap neighboring blooms to create chains of three or more and watch the petals tumble.' },
    knight: { title: "Knight's Garden", category: 'EXPLORE · L-SHAPED HOPS', description: 'Move like a chess knight, gather three fireflies, and find the glowing garden gate.' },
    mosslight: { title: 'Mosslight', category: 'DEDUCE · UNCOVER THE GARDEN', description: 'Use the numbers to find all the safe patches and avoid the hidden thorns.' },
    shut: { title: 'Shut the Garden', category: 'STRATEGY · ROLL AND CHOOSE', description: 'Close numbered petals by choosing a group that adds up to the dice.' },
    clover: { title: 'Clover Climber', category: 'PUSH YOUR LUCK · HIGH OR LOW', description: 'Guess the next card, grow your streak, then bank it before a risky guess.' }
  };

  function makeHud(items) {
    hud.innerHTML = items.map((item, index) => `<div class="hud-chip"><span>${item.label}</span><b id="hud-value-${index}">${item.value}</b></div>`).join('') + '<div class="hud-message" id="hud-message" aria-live="polite"></div>';
  }
  function updateHud(index, value) {
    const node = document.querySelector(`#hud-value-${index}`);
    if (node) node.textContent = value;
  }
  function setMessage(value) {
    const node = document.querySelector('#hud-message');
    if (node) node.textContent = value;
  }
  function stopGame() {
    cleanupGame();
    cleanupGame = () => {};
    stage.innerHTML = '';
    hud.innerHTML = '';
  }
  function openGame(key) {
    if (!gameInfo[key]) return;
    priorFocus = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    launchGame(key);
    modal.querySelector('.close-button').focus();
  }
  function closeGame() {
    if (!modal.classList.contains('is-open')) return;
    stopGame();
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    activeGame = '';
    if (priorFocus && priorFocus.focus) priorFocus.focus();
  }
  function launchGame(key) {
    stopGame();
    activeGame = key;
    title.textContent = gameInfo[key].title;
    category.textContent = gameInfo[key].category;
    description.textContent = gameInfo[key].description;
    restartButton.textContent = key === 'circuit' ? 'New puzzle  ↻' : 'Start a new round  ↻';
    if (key === 'comet') startComet();
    if (key === 'signal') startSignal();
    if (key === 'circuit') startCircuit();
    if (key === 'kite') startKite();
    if (key === 'maze') startMaze();
    if (key === 'word') startWord();
    if (key === 'pairs') startPairs();
    if (key === 'shapes') startShapes();
    if (key === 'stars') startStars();
    if (key === 'lily') startLily();
    if (key === 'numbers') startNumbers();
    if (key === 'patchwork') startPatchwork();
    if (key === 'runes') startRunes();
    if (key === 'sort') startSort();
    if (key === 'putt') startPutt();
    if (key === 'type') startType();
    if (key === 'seed') startSeed();
    if (key === 'swatch') startSwatch();
    if (key === 'rally') startRally();
    if (key === 'seek') startSeek();
    if (key === 'odd') startOdd();
    if (key === 'petalpop') startPetalPop();
    if (key === 'knight') startKnight();
    if (key === 'mosslight') startMosslight();
    if (key === 'shut') startShut();
    if (key === 'clover') startClover();
  }
  document.querySelectorAll('.card-open').forEach(button => button.addEventListener('click', () => openGame(button.dataset.game)));
  const searchField = document.querySelector('#game-search');
  const gameCards = [...document.querySelectorAll('.game-card')];
  const gameResults = document.querySelector('#game-results');
  const noGames = document.querySelector('#no-games');
  searchField.addEventListener('input', () => {
    const query = searchField.value.trim().toLowerCase(); let visible = 0;
    gameCards.forEach(card => {
      const content = card.textContent.toLowerCase();
      const matches = content.includes(query); card.hidden = !matches;
      if (matches) visible++;
    });
    gameResults.textContent = query ? `${visible} ${visible === 1 ? 'game' : 'games'} found` : `${visible} little worlds`;
    noGames.hidden = visible !== 0;
  });
  document.querySelectorAll('[data-close-modal]').forEach(button => button.addEventListener('click', closeGame));
  restartButton.addEventListener('click', () => { if (activeGame) launchGame(activeGame); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) closeGame();
    if (event.key === 'Tab' && modal.classList.contains('is-open')) {
      const focusables = [...modal.querySelectorAll('button:not(:disabled),[tabindex="0"]')].filter(el => el.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  function startComet() {
    makeHud([{ label: 'Starlight', value: '0' }, { label: 'Time', value: '30' }, { label: 'Streak', value: '0' }]);
    controls.textContent = 'Move with ← → or A / D. Mouse and touch work too.';
    const canvas = document.createElement('canvas');
    canvas.className = 'arcade-canvas';
    canvas.width = 900; canvas.height = 420;
    canvas.tabIndex = 0;
    canvas.setAttribute('aria-label', 'Comet Catch game. Move the catcher along the bottom to catch glowing stars and avoid dark comets.');
    stage.append(canvas);
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    let playerX = W / 2, targetX = W / 2, score = 0, streak = 0, bestStreak = 0, remaining = 30;
    let elapsed = 0, spawnClock = 0, last = performance.now(), raf = 0, over = false;
    const drops = [];
    const stars = Array.from({ length: 65 }, (_, i) => ({ x: (i * 137.3) % W, y: (i * 71.9) % H, r: i % 9 === 0 ? 1.8 : 1, a: .24 + (i % 5) * .1 }));
    const catcherY = H - 49;
    function pointerMove(event) {
      const rect = canvas.getBoundingClientRect();
      targetX = Math.max(48, Math.min(W - 48, (event.clientX - rect.left) * W / rect.width));
    }
    function keyMove(event) {
      if (!modal.classList.contains('is-open') || activeGame !== 'comet') return;
      if (['ArrowLeft', 'ArrowRight', 'a', 'A', 'd', 'D'].includes(event.key)) event.preventDefault();
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') targetX = Math.max(48, targetX - 38);
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') targetX = Math.min(W - 48, targetX + 38);
    }
    canvas.addEventListener('pointermove', pointerMove);
    canvas.addEventListener('pointerdown', pointerMove);
    document.addEventListener('keydown', keyMove);
    function spawn() {
      const rock = Math.random() < .25;
      drops.push({ x: 36 + Math.random() * (W - 72), y: -25, vy: 108 + Math.random() * 90 + (30 - remaining) * 1.4, r: rock ? 13 : 11, kind: rock ? 'rock' : 'bloom', spin: Math.random() * 6.3, drift: (Math.random() - .5) * 31 });
    }
    function draw() {
      const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#202c3d'); bg.addColorStop(1, '#293d48'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      stars.forEach(s => { ctx.globalAlpha = s.a; ctx.fillStyle = '#eef2d7'; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill(); }); ctx.globalAlpha = 1;
      ctx.strokeStyle = 'rgba(203,225,177,.14)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, catcherY + 20); ctx.lineTo(W, catcherY + 20); ctx.stroke();
      drops.forEach(drop => {
        ctx.save(); ctx.translate(drop.x, drop.y); ctx.rotate(drop.spin);
        if (drop.kind === 'bloom') {
          ctx.shadowColor = '#dbf58e'; ctx.shadowBlur = 17; ctx.fillStyle = '#d6f27e';
          for (let p = 0; p < 5; p++) { ctx.beginPath(); ctx.ellipse(0, -7, 4, 7, p * Math.PI * 2 / 5, 0, Math.PI * 2); ctx.fill(); }
          ctx.shadowBlur = 0; ctx.fillStyle = '#fff3be'; ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fill();
        } else {
          ctx.shadowColor = '#111925'; ctx.shadowBlur = 10; ctx.fillStyle = '#151c28'; ctx.beginPath();
          for (let p = 0; p < 7; p++) { const a = p * Math.PI * 2 / 7; const r = drop.r * (p % 2 ? .76 : 1.1); ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
          ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(170,183,194,.35)'; ctx.stroke();
        }
        ctx.restore();
      });
      // A small crescent-shaped catcher, drawn as a quiet visual anchor.
      ctx.save(); ctx.translate(playerX, catcherY); ctx.shadowColor = 'rgba(211,242,122,.35)'; ctx.shadowBlur = 13;
      ctx.fillStyle = '#d2ed85'; ctx.beginPath(); ctx.moveTo(-47, -8); ctx.quadraticCurveTo(-37, 22, 0, 20); ctx.quadraticCurveTo(37, 22, 47, -8); ctx.lineTo(37, -3); ctx.quadraticCurveTo(0, 11, -37, -3); ctx.closePath(); ctx.fill();
      ctx.shadowBlur = 0; ctx.fillStyle = '#eff5c9'; ctx.beginPath(); ctx.ellipse(0, -6, 48, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
    function finish() {
      over = true; cancelAnimationFrame(raf); draw();
      const overlay = document.createElement('div'); overlay.className = 'end-overlay'; overlay.innerHTML = `<div class="end-card"><div class="end-mark">✦</div><h3>Lovely catching.</h3><p>You gathered ${score} ${score === 1 ? 'bright bloom' : 'bright blooms'}${bestStreak ? ` · best streak ${bestStreak}` : ''}.</p><button type="button">Catch again</button></div>`;
      overlay.querySelector('button').addEventListener('click', () => launchGame('comet'));
      stage.append(overlay);
    }
    function frame(now) {
      if (over || activeGame !== 'comet') return;
      const dt = Math.min(.04, (now - last) / 1000); last = now;
      remaining = Math.max(0, remaining - dt); elapsed += dt; spawnClock += dt;
      if (spawnClock > .55) { spawnClock = 0; spawn(); }
      playerX += (targetX - playerX) * Math.min(1, dt * 12);
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i]; d.y += d.vy * dt; d.x += d.drift * dt; d.spin += dt * (d.kind === 'rock' ? -.8 : .55);
        if (d.y + d.r > catcherY - 5 && d.y - d.r < catcherY + 17 && Math.abs(d.x - playerX) < 45 + d.r * .4) {
          if (d.kind === 'bloom') { score += 1; streak += 1; bestStreak = Math.max(bestStreak, streak); }
          else { streak = 0; }
          updateHud(0, String(score)); updateHud(2, String(streak)); drops.splice(i, 1); continue;
        }
        if (d.y > H + 25) drops.splice(i, 1);
      }
      updateHud(1, String(Math.ceil(remaining)));
      draw();
      if (remaining <= 0) { finish(); return; }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    cleanupGame = () => { over = true; cancelAnimationFrame(raf); canvas.removeEventListener('pointermove', pointerMove); canvas.removeEventListener('pointerdown', pointerMove); document.removeEventListener('keydown', keyMove); };
  }

  function startSignal() {
    makeHud([{ label: 'Bloom', value: '1' }, { label: 'Best', value: '0' }]);
    controls.textContent = 'Tap or click the lights. There is no timer.';
    stage.innerHTML = '<div class="signal-game"><p class="signal-prompt" id="signal-prompt" aria-live="polite">Watch the first little song…</p><div class="signal-board" role="group" aria-label="Four garden lights"><button class="signal-pad" data-pad="0" aria-label="Green light"></button><button class="signal-pad" data-pad="1" aria-label="Amber light"></button><button class="signal-pad" data-pad="2" aria-label="Mint light"></button><button class="signal-pad" data-pad="3" aria-label="Violet light"></button></div><p class="signal-caption">A little song, one light at a time.</p></div>';
    const pads = [...stage.querySelectorAll('.signal-pad')];
    const prompt = stage.querySelector('#signal-prompt');
    const sequence = [];
    let timers = [], input = 0, busy = true, round = 1, best = 0, over = false;
    const later = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); return id; };
    function light(index) { pads[index].classList.add('lit'); later(() => pads[index].classList.remove('lit'), 300); }
    function playSequence() {
      busy = true; input = 0; prompt.textContent = 'Watch the little song…';
      sequence.forEach((n, i) => later(() => light(n), 480 + i * 620));
      later(() => { if (!over) { busy = false; prompt.textContent = 'Your turn — tap the lights in order.'; } }, 600 + sequence.length * 620);
    }
    function nextRound() {
      round += 1; updateHud(0, String(round));
      sequence.push(Math.floor(Math.random() * 4));
      playSequence();
    }
    function gameOver() {
      over = true; busy = true;
      const reached = Math.max(0, round - 1);
      best = Math.max(best, reached); updateHud(1, String(best));
      prompt.textContent = 'The song changed. Shall we try again?';
      const overlay = document.createElement('div'); overlay.className = 'end-overlay'; overlay.innerHTML = `<div class="end-card"><div class="end-mark">✳</div><h3>A garden of ${reached}.</h3><p>That was a lovely little rhythm.</p><button type="button">Grow another</button></div>`;
      overlay.querySelector('button').addEventListener('click', () => launchGame('signal'));
      stage.append(overlay);
    }
    function choose(index) {
      if (busy || over) return;
      light(index);
      if (sequence[input] !== index) { gameOver(); return; }
      input += 1;
      if (input === sequence.length) {
        busy = true; best = Math.max(best, round); updateHud(1, String(best)); prompt.textContent = 'Beautifully remembered.';
        later(nextRound, 700);
      }
    }
    pads.forEach(button => button.addEventListener('click', () => choose(Number(button.dataset.pad))));
    sequence.push(Math.floor(Math.random() * 4));
    playSequence();
    cleanupGame = () => { over = true; timers.forEach(clearTimeout); };
  }

  function startCircuit() {
    makeHud([{ label: 'Turns', value: '0' }, { label: 'Connected', value: 'Not yet' }]);
    controls.textContent = 'Tap a tile to turn it clockwise. Follow the light from seed to flower.';
    stage.innerHTML = '<div class="circuit-game"><div class="circuit-board" role="group" aria-label="Circuit puzzle"></div><div class="circuit-hint"><b>Turn the path.</b><br>Every tile has two ends. Make them meet from left to right.</div></div>';
    const boardEl = stage.querySelector('.circuit-board');
    const size = 5;
    const pieces = [];
    const route = [
      { r: 2, c: 0, type: 'line', solved: 1 },
      { r: 2, c: 1, type: 'elbow', solved: 3 },
      { r: 1, c: 1, type: 'line', solved: 0 },
      { r: 1, c: 2, type: 'elbow', solved: 2 },
      { r: 2, c: 2, type: 'line', solved: 0 },
      { r: 3, c: 2, type: 'elbow', solved: 0 },
      { r: 3, c: 3, type: 'line', solved: 1 }
    ];
    const key = (r, c) => `${r},${c}`;
    const routeMap = new Map(route.map(part => [key(part.r, part.c), part]));
    for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) {
      const onRoute = routeMap.get(key(r, c));
      const type = onRoute ? onRoute.type : (Math.random() < .52 ? 'line' : 'elbow');
      let rotation = onRoute ? (onRoute.solved + 1 + Math.floor(Math.random() * 3)) % 4 : Math.floor(Math.random() * 4);
      pieces.push({ r, c, type, rotation, onRoute: !!onRoute });
    }
    let turns = 0, won = false;
    const dirNames = ['up', 'right', 'down', 'left'];
    function ports(piece) {
      const base = piece.type === 'line' ? [0, 2] : [0, 1];
      return base.map(dir => (dir + piece.rotation) % 4);
    }
    function trace() {
      let r = 2, c = 0, incoming = 3;
      const visited = new Set(), powered = new Set();
      for (let step = 0; step < 30; step++) {
        const id = key(r, c), piece = pieces[r * size + c], currentPorts = ports(piece);
        if (!currentPorts.includes(incoming) || visited.has(id)) return { connected: false, powered };
        visited.add(id); powered.add(id);
        const outgoing = currentPorts.find(p => p !== incoming);
        const delta = [[-1, 0], [0, 1], [1, 0], [0, -1]][outgoing];
        const nr = r + delta[0], nc = c + delta[1];
        if (nr < 0 || nc < 0 || nr >= size || nc >= size) return { connected: id === key(3, 3) && outgoing === 1, powered };
        r = nr; c = nc; incoming = (outgoing + 2) % 4;
      }
      return { connected: false, powered };
    }
    function render() {
      boardEl.innerHTML = '';
      const result = trace();
      pieces.forEach((piece, index) => {
        const cell = document.createElement('button'); cell.type = 'button'; cell.className = 'circuit-tile';
        cell.setAttribute('aria-label', `Row ${piece.r + 1}, column ${piece.c + 1}, ${piece.type}, turn clockwise`);
        if (result.powered.has(key(piece.r, piece.c))) cell.classList.add('powered');
        ports(piece).forEach(direction => {
          const arm = document.createElement('i'); arm.className = `wire-arm ${dirNames[direction]}`; cell.append(arm);
        });
        const center = document.createElement('i'); center.className = 'wire-center'; cell.append(center);
        if (piece.r === 2 && piece.c === 0) { const marker = document.createElement('span'); marker.className = 'circuit-marker'; marker.textContent = '✦'; cell.append(marker); }
        if (piece.r === 3 && piece.c === 3) { const marker = document.createElement('span'); marker.className = 'circuit-marker'; marker.textContent = '✿'; cell.append(marker); }
        cell.addEventListener('click', () => {
          if (won) return;
          piece.rotation = (piece.rotation + 1) % 4; turns += 1; updateHud(0, String(turns));
          const state = trace(); updateHud(1, state.connected ? 'Yes!' : 'Not yet');
          if (state.connected) won = true;
          render();
          if (won) {
            setMessage('A path has blossomed.');
            const overlay = document.createElement('div'); overlay.className = 'end-overlay'; overlay.innerHTML = `<div class="end-card"><div class="end-mark">✿</div><h3>Connection made.</h3><p>You grew a path in ${turns} ${turns === 1 ? 'turn' : 'turns'}.</p><button type="button">Grow a new puzzle</button></div>`;
            overlay.querySelector('button').addEventListener('click', () => launchGame('circuit'));
            stage.append(overlay);
          }
        });
        boardEl.append(cell);
      });
    }
    for (let attempt = 0; attempt < 100 && trace().connected; attempt++) {
      route.forEach(part => { pieces[part.r * size + part.c].rotation = (part.solved + 1 + Math.floor(Math.random() * 3)) % 4; });
    }
    render();
    cleanupGame = () => { won = true; };
  }

  function startKite() {
    makeHud([{ label: 'Wind blooms', value: '0' }, { label: 'Time', value: '45' }, { label: 'Strings', value: '3' }]);
    controls.textContent = 'Fly with arrow keys or WASD. Mouse and touch steer too.';
    const canvas = document.createElement('canvas'); canvas.className = 'arcade-canvas'; canvas.width = 900; canvas.height = 420; canvas.tabIndex = 0;
    canvas.setAttribute('aria-label', 'Kite Keeper game. Steer through the sky to collect wind blooms and avoid clouds.'); stage.append(canvas);
    const ctx = canvas.getContext('2d'), W = canvas.width, H = canvas.height;
    const player = { x: 155, y: H / 2 }, target = { x: 155, y: H / 2 }, keys = {};
    let score = 0, strings = 3, remaining = 45, cloudClock = .7, bloomClock = 1.1, invulnerable = 0, last = performance.now(), raf = 0, over = false, pointerMode = false;
    const clouds = [], blooms = [];
    function pointerMove(event) {
      const rect = canvas.getBoundingClientRect();
      target.x = Math.max(28, Math.min(W - 28, (event.clientX - rect.left) * W / rect.width));
      target.y = Math.max(28, Math.min(H - 28, (event.clientY - rect.top) * H / rect.height));
      pointerMode = true;
    }
    function onDown(event) {
      if (event.key.startsWith('Arrow') || ['w', 'a', 's', 'd'].includes(event.key.toLowerCase())) {
        if (modal.classList.contains('is-open') && activeGame === 'kite') event.preventDefault();
        keys[event.key.toLowerCase()] = true; pointerMode = false;
      }
    }
    function onUp(event) { keys[event.key.toLowerCase()] = false; }
    canvas.addEventListener('pointermove', pointerMove); canvas.addEventListener('pointerdown', pointerMove);
    document.addEventListener('keydown', onDown); document.addEventListener('keyup', onUp);
    function drawCloud(cloud) {
      ctx.save(); ctx.translate(cloud.x, cloud.y); ctx.fillStyle = cloud.flash ? '#f2b780' : '#728c8a'; ctx.shadowColor = cloud.flash ? '#f2b780' : 'transparent'; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(-16, 4, 13, 0, Math.PI * 2); ctx.arc(0, -4, 18, 0, Math.PI * 2); ctx.arc(18, 4, 13, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(-19, 3, 38, 12); ctx.restore();
    }
    function draw() {
      const sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#9dc5c3'); sky.addColorStop(.72, '#d5dfca'); sky.addColorStop(1, '#e8e5c9'); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(255,247,202,.75)'; ctx.beginPath(); ctx.arc(748, 79, 39, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'rgba(255,247,202,.24)'; ctx.beginPath(); ctx.arc(748, 79, 55, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,246,.33)';
      for (let i = 0; i < 5; i++) { const x = ((i * 211 - (45 - remaining) * 8) % (W + 130) + W + 130) % (W + 130) - 60; const y = 70 + (i * 71) % 220; ctx.beginPath(); ctx.ellipse(x, y, 25, 3, -.08, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = '#78956e'; ctx.beginPath(); ctx.moveTo(0, H); ctx.quadraticCurveTo(230, H - 45, 430, H - 10); ctx.quadraticCurveTo(690, H - 66, W, H - 24); ctx.lineTo(W, H); ctx.fill();
      blooms.forEach(b => { ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.spin); ctx.shadowColor = '#fff5a9'; ctx.shadowBlur = 13; ctx.fillStyle = '#f6e997'; for (let p = 0; p < 6; p++) { ctx.beginPath(); ctx.ellipse(0, -7, 3, 6, p * Math.PI / 3, 0, Math.PI * 2); ctx.fill(); } ctx.shadowBlur = 0; ctx.fillStyle = '#fff8ce'; ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fill(); ctx.restore(); });
      clouds.forEach(drawCloud);
      if (invulnerable <= 0 || Math.floor(performance.now() / 90) % 2 === 0) {
        ctx.save(); ctx.translate(player.x, player.y); ctx.rotate(.08); ctx.shadowColor = 'rgba(72,83,76,.25)'; ctx.shadowBlur = 9; ctx.fillStyle = '#e27e63'; ctx.beginPath(); ctx.moveTo(0, -22); ctx.lineTo(17, 0); ctx.lineTo(0, 22); ctx.lineTo(-17, 0); ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0; ctx.strokeStyle = '#fff0cd'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, 22); ctx.quadraticCurveTo(18, 48, -2, 62); ctx.stroke(); ctx.fillStyle = '#e7cd82'; ctx.beginPath(); ctx.arc(8, 43, 3, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    }
    function finish() {
      if (over) return; over = true; cancelAnimationFrame(raf); draw();
      const result = strings > 0 ? 'The breeze was kind.' : 'A little too stormy.';
      const overlay = document.createElement('div'); overlay.className = 'end-overlay'; overlay.innerHTML = `<div class="end-card"><div class="end-mark">〰</div><h3>${result}</h3><p>You gathered ${score} wind ${score === 1 ? 'bloom' : 'blooms'}.</p><button type="button">Fly again</button></div>`;
      overlay.querySelector('button').addEventListener('click', () => launchGame('kite')); stage.append(overlay);
    }
    function frame(now) {
      if (over || activeGame !== 'kite') return;
      const dt = Math.min(.04, (now - last) / 1000); last = now; remaining = Math.max(0, remaining - dt);
      cloudClock -= dt; bloomClock -= dt; invulnerable = Math.max(0, invulnerable - dt);
      if (cloudClock <= 0) { cloudClock = .9 + Math.random() * .8; clouds.push({ x: W + 48, y: 32 + Math.random() * (H - 95), r: 23 + Math.random() * 7, speed: 120 + Math.random() * 60, flash: Math.random() < .16 }); }
      if (bloomClock <= 0) { bloomClock = .7 + Math.random() * .8; blooms.push({ x: W + 20, y: 34 + Math.random() * (H - 90), spin: Math.random() * 5, speed: 120 + Math.random() * 35 }); }
      const speed = 225;
      if (pointerMode) { player.x += (target.x - player.x) * Math.min(1, dt * 8); player.y += (target.y - player.y) * Math.min(1, dt * 8); }
      else { if (keys.arrowleft || keys.a) player.x -= speed * dt; if (keys.arrowright || keys.d) player.x += speed * dt; if (keys.arrowup || keys.w) player.y -= speed * dt; if (keys.arrowdown || keys.s) player.y += speed * dt; }
      player.x = Math.max(22, Math.min(W - 22, player.x)); player.y = Math.max(22, Math.min(H - 22, player.y));
      clouds.forEach(c => { c.x -= c.speed * dt; }); blooms.forEach(b => { b.x -= b.speed * dt; b.spin += dt; });
      for (let i = blooms.length - 1; i >= 0; i--) { const b = blooms[i]; if (Math.hypot(b.x - player.x, b.y - player.y) < 26) { score++; updateHud(0, String(score)); blooms.splice(i, 1); } else if (b.x < -25) blooms.splice(i, 1); }
      for (let i = clouds.length - 1; i >= 0; i--) { const c = clouds[i]; if (invulnerable <= 0 && Math.hypot(c.x - player.x, c.y - player.y) < c.r + 12) { strings--; invulnerable = 1.05; updateHud(2, String(strings)); setMessage('Watch those clouds!'); clouds.splice(i, 1); } else if (c.x < -70) clouds.splice(i, 1); }
      updateHud(1, String(Math.ceil(remaining))); draw();
      if (remaining <= 0 || strings <= 0) { finish(); return; }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    cleanupGame = () => { over = true; cancelAnimationFrame(raf); canvas.removeEventListener('pointermove', pointerMove); canvas.removeEventListener('pointerdown', pointerMove); document.removeEventListener('keydown', onDown); document.removeEventListener('keyup', onUp); };
  }

  function startMaze() {
    makeHud([{ label: 'Steps', value: '0' }, { label: 'Fireflies', value: '0 / 3' }]);
    controls.textContent = 'Use arrow keys or the direction buttons. Gather all 3 fireflies to open the garden gate.';
    stage.innerHTML = '<div class="maze-game"><div class="maze-board" role="grid" aria-label="Firefly Maze. Use the arrow keys or buttons to move." tabindex="0"></div><div class="maze-controls" aria-label="Move controls"><button type="button" class="maze-up" data-dir="up" aria-label="Move up">↑</button><button type="button" class="maze-left" data-dir="left" aria-label="Move left">←</button><button type="button" class="maze-down" data-dir="down" aria-label="Move down">↓</button><button type="button" class="maze-right" data-dir="right" aria-label="Move right">→</button></div><p class="maze-help">The flower gate opens when all three lights are gathered.</p></div>';
    const board = stage.querySelector('.maze-board'), dimension = 15, rooms = 7;
    const maze = Array.from({ length: dimension }, () => Array(dimension).fill(1));
    const visited = Array.from({ length: rooms }, () => Array(rooms).fill(false));
    const stack = [{ r: 0, c: 0 }]; visited[0][0] = true; maze[1][1] = 0;
    while (stack.length) {
      const current = stack[stack.length - 1];
      const options = [[-1, 0], [0, 1], [1, 0], [0, -1]].map(([dr, dc]) => ({ r: current.r + dr, c: current.c + dc, dr, dc })).filter(n => n.r >= 0 && n.c >= 0 && n.r < rooms && n.c < rooms && !visited[n.r][n.c]);
      if (!options.length) { stack.pop(); continue; }
      const next = options[Math.floor(Math.random() * options.length)];
      visited[next.r][next.c] = true; maze[current.r * 2 + 1 + next.dr][current.c * 2 + 1 + next.dc] = 0; maze[next.r * 2 + 1][next.c * 2 + 1] = 0; stack.push(next);
    }
    const start = { r: 1, c: 1 }, exit = { r: 13, c: 13 };
    let player = { ...start }, steps = 0, found = 0, done = false;
    const lights = new Set();
    const candidates = [];
    for (let r = 1; r < 14; r += 2) for (let c = 1; c < 14; c += 2) if (!(r === start.r && c === start.c) && !(r === exit.r && c === exit.c)) candidates.push(`${r},${c}`);
    while (lights.size < 3) lights.add(candidates.splice(Math.floor(Math.random() * candidates.length), 1)[0]);
    function render() {
      board.innerHTML = '';
      for (let r = 0; r < dimension; r++) for (let c = 0; c < dimension; c++) {
        const cell = document.createElement('div'); cell.className = `maze-cell ${maze[r][c] ? 'wall' : ''}`; cell.setAttribute('aria-hidden', 'true');
        if (r === exit.r && c === exit.c) cell.classList.add('exit');
        if (lights.has(`${r},${c}`)) cell.classList.add('firefly');
        if (r === player.r && c === player.c) cell.classList.add('player');
        board.append(cell);
      }
    }
    function move(dir) {
      if (done) return;
      const delta = { up: [-1, 0], right: [0, 1], down: [1, 0], left: [0, -1] }[dir];
      if (!delta) return;
      const nr = player.r + delta[0], nc = player.c + delta[1];
      if (nr < 0 || nc < 0 || nr >= dimension || nc >= dimension || maze[nr][nc]) return;
      player = { r: nr, c: nc }; steps++; updateHud(0, String(steps));
      const position = `${nr},${nc}`;
      if (lights.delete(position)) { found++; updateHud(1, `${found} / 3`); setMessage('A firefly joined you!'); }
      else if (nr === exit.r && nc === exit.c && found < 3) setMessage(`${3 - found} more ${3 - found === 1 ? 'firefly' : 'fireflies'} to find.`);
      else setMessage('');
      render();
      if (nr === exit.r && nc === exit.c && found === 3) {
        done = true; setMessage('The garden gate opens.');
        const overlay = document.createElement('div'); overlay.className = 'end-overlay'; overlay.innerHTML = `<div class="end-card"><div class="end-mark">✿</div><h3>Home by firefly light.</h3><p>You found the gate in ${steps} ${steps === 1 ? 'step' : 'steps'}.</p><button type="button">Wander again</button></div>`;
        overlay.querySelector('button').addEventListener('click', () => launchGame('maze')); stage.append(overlay);
      }
    }
    function onKey(event) {
      if (!modal.classList.contains('is-open') || activeGame !== 'maze') return;
      const directions = { ArrowUp: 'up', w: 'up', W: 'up', ArrowRight: 'right', d: 'right', D: 'right', ArrowDown: 'down', s: 'down', S: 'down', ArrowLeft: 'left', a: 'left', A: 'left' };
      if (directions[event.key]) { event.preventDefault(); move(directions[event.key]); }
    }
    document.addEventListener('keydown', onKey);
    stage.querySelectorAll('[data-dir]').forEach(button => button.addEventListener('click', () => move(button.dataset.dir)));
    render(); board.focus();
    cleanupGame = () => { done = true; document.removeEventListener('keydown', onKey); };
  }

  function startWord() {
    const puzzles = [
      { word: 'MEADOW', clue: 'A wide, grassy place where tiny flowers grow.', hints: ['It begins with M.', 'It has 6 letters.', 'It begins with M and ends with W.'] },
      { word: 'LANTERN', clue: 'A little light you can carry on a night walk.', hints: ['It begins with L.', 'It has 7 letters.', 'It begins with L and ends with N.'] },
      { word: 'COMPASS', clue: 'A pocket tool that helps you find north.', hints: ['It begins with C.', 'It has 7 letters.', 'It begins with C and ends with S.'] },
      { word: 'TIDEPOOL', clue: 'A tiny sea world left behind by the waves.', hints: ['It begins with T.', 'It has 8 letters.', 'It begins with T and ends with L.'] },
      { word: 'MOSAIC', clue: 'A picture made from many little pieces.', hints: ['It begins with M.', 'It has 6 letters.', 'It begins with M and ends with C.'] },
      { word: 'ACORN', clue: 'A small seed with a little hat, destined to be a tree.', hints: ['It begins with A.', 'It has 5 letters.', 'It begins with A and ends with N.'] },
      { word: 'RIPPLE', clue: 'A small circle that wanders across still water.', hints: ['It begins with R.', 'It has 6 letters.', 'It begins with R and ends with E.'] },
      { word: 'POCKET', clue: 'A small place to keep a found treasure.', hints: ['It begins with P.', 'It has 6 letters.', 'It begins with P and ends with T.'] }
    ];
    const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    const letters = puzzle.word.split('');
    do { for (let i = letters.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [letters[i], letters[j]] = [letters[j], letters[i]]; } } while (letters.join('') === puzzle.word);
    makeHud([{ label: 'Guesses', value: '0 / 5' }, { label: 'Hints', value: '0 / 3' }]);
    controls.textContent = 'Type your guess and press Enter. No timer, and hints are always welcome.';
    stage.innerHTML = `<div class="word-game"><p class="word-prompt">The letters are having a little shuffle…</p><div class="word-tiles" aria-label="Shuffled letters">${letters.map(letter => `<span class="word-letter">${letter}</span>`).join('')}</div><p class="word-clue">${puzzle.clue}</p><form class="word-form"><input class="word-input" aria-label="Your word guess" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="${puzzle.word.length}" placeholder="Your word"><button class="word-submit" type="submit">Try it</button></form><p class="word-feedback" aria-live="polite">You have five guesses.</p><button class="word-hint-button" type="button">A little hint?</button></div>`;
    const form = stage.querySelector('.word-form'), input = stage.querySelector('.word-input'), feedback = stage.querySelector('.word-feedback'), clue = stage.querySelector('.word-clue'), hintButton = stage.querySelector('.word-hint-button');
    let guesses = 0, hints = 0, done = false;
    function finish(won) {
      done = true; input.disabled = true; form.querySelector('button').disabled = true; hintButton.disabled = true;
      const overlay = document.createElement('div'); overlay.className = 'end-overlay';
      overlay.innerHTML = won ? `<div class="end-card"><div class="end-mark">✧</div><h3>Word found.</h3><p>${puzzle.word.length} letters, ${guesses} ${guesses === 1 ? 'guess' : 'guesses'}. Nicely done.</p><button type="button">Light another lantern</button></div>` : `<div class="end-card"><div class="end-mark">✧</div><h3>The word was ${puzzle.word}.</h3><p>Every little shuffle has a word inside.</p><button type="button">Try another word</button></div>`;
      overlay.querySelector('button').addEventListener('click', () => launchGame('word')); stage.append(overlay);
    }
    form.addEventListener('submit', event => {
      event.preventDefault(); if (done) return;
      const guess = input.value.trim().toUpperCase();
      if (!guess) { feedback.textContent = 'Type a guess first, little word finder.'; input.focus(); return; }
      guesses++; updateHud(0, `${guesses} / 5`); form.classList.remove('shake');
      if (guess === puzzle.word) { feedback.textContent = 'You found it!'; finish(true); return; }
      if (guess.length !== puzzle.word.length) feedback.textContent = `This word has ${puzzle.word.length} letters. Try a different shuffle.`;
      else feedback.textContent = 'Not quite. Give those letters another look.';
      void form.offsetWidth; form.classList.add('shake'); input.value = ''; input.focus();
      if (guesses >= 5) finish(false);
    });
    hintButton.addEventListener('click', () => {
      if (done) return;
      if (hints >= puzzle.hints.length) { feedback.textContent = 'That is all the little hints for this word.'; return; }
      clue.textContent = puzzle.hints[hints]; hints++; updateHud(1, `${hints} / 3`);
      if (hints === puzzle.hints.length) hintButton.textContent = 'All hints found';
    });
    cleanupGame = () => { done = true; };
  }

  function startPairs() {
    const set = [
      ['✿', 'flower'], ['◈', 'crystal'], ['☾', 'moon'], ['♧', 'clover'],
      ['❋', 'sunburst'], ['♡', 'heart'], ['☀', 'sun'], ['✦', 'star']
    ];
    const deck = set.flatMap((item, pair) => [{ glyph: item[0], name: item[1], pair }, { glyph: item[0], name: item[1], pair }]);
    for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
    makeHud([{ label: 'Pairs', value: '0 / 8' }, { label: 'Turns', value: '0' }]);
    controls.textContent = 'Choose two pebbles. Remember what you have seen.';
    stage.innerHTML = '<div class="pair-game"><p class="pair-prompt" aria-live="polite">Eight matching pairs are tucked away.</p><div class="pair-board" role="group" aria-label="Sixteen memory tiles"></div></div>';
    const board = stage.querySelector('.pair-board'), prompt = stage.querySelector('.pair-prompt');
    let open = [], matched = new Set(), pairs = 0, turns = 0, lock = false, done = false, timer = 0;
    function finish() {
      done = true; clearTimeout(timer);
      const overlay = document.createElement('div'); overlay.className = 'end-overlay'; overlay.innerHTML = `<div class="end-card"><div class="end-mark">✿</div><h3>All the pairs found.</h3><p>You matched every pebble in ${turns} ${turns === 1 ? 'turn' : 'turns'}.</p><button type="button">Gather another set</button></div>`;
      overlay.querySelector('button').addEventListener('click', () => launchGame('pairs')); stage.append(overlay);
    }
    deck.forEach((card, index) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'pair-tile'; button.textContent = '·'; button.setAttribute('aria-label', `Hidden pebble ${index + 1}`);
      button.addEventListener('click', () => {
        if (done || lock || matched.has(index) || open.includes(index)) return;
        button.textContent = card.glyph; button.classList.add('face-up'); button.setAttribute('aria-label', `${card.name} pebble`); open.push(index);
        if (open.length < 2) return;
        turns++; updateHud(1, String(turns));
        const [first, second] = open;
        if (deck[first].pair === deck[second].pair) {
          matched.add(first); matched.add(second); pairs++;
          board.children[first].classList.add('matched'); board.children[second].classList.add('matched');
          board.children[first].setAttribute('aria-label', `Matched ${deck[first].name}`); board.children[second].setAttribute('aria-label', `Matched ${deck[second].name}`);
          updateHud(0, `${pairs} / 8`);
          prompt.textContent = 'A lovely match. Keep going!'; open = [];
          if (pairs === 8) finish();
        } else {
          lock = true; prompt.textContent = 'Not a pair this time. Take another look.';
          timer = setTimeout(() => {
            [first, second].forEach(i => { board.children[i].textContent = '·'; board.children[i].classList.remove('face-up'); board.children[i].setAttribute('aria-label', `Hidden pebble ${i + 1}`); });
            open = []; lock = false; prompt.textContent = 'Choose two pebbles. Remember what you have seen.';
          }, 700);
        }
      });
      board.append(button);
    });
    cleanupGame = () => { done = true; clearTimeout(timer); };
  }

  function startShapes() {
    const puzzles = [
      { name: 'Moonflower', rows: ['00100', '01110', '11111', '01110', '00100'] },
      { name: 'Little boat', rows: ['00100', '01110', '00100', '11111', '01110'] },
      { name: 'Night owl', rows: ['10001', '01110', '11111', '10101', '10101'] }
    ];
    const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    const solution = puzzle.rows.map(row => row.split('').map(Number));
    const clueRuns = cells => { const runs = []; let count = 0; cells.forEach(value => { if (value) count++; else if (count) { runs.push(count); count = 0; } }); if (count) runs.push(count); return runs.length ? runs : [0]; };
    const rowClues = solution.map(clueRuns);
    const colClues = Array.from({ length: 5 }, (_, c) => clueRuns(solution.map(row => row[c])));
    const total = solution.flat().reduce((a, b) => a + b, 0);
    makeHud([{ label: 'Petals', value: `0 / ${total}` }, { label: 'Picture', value: puzzle.name }]);
    controls.textContent = 'Click a square to fill it. Click again for an X. No timer.';
    stage.innerHTML = `<div class="nonogram-game"><p class="nonogram-prompt">The numbers tell how many neighboring squares are filled in each line.</p><div class="nonogram-board" role="grid" aria-label="Cloud Shapes picture puzzle"></div><p class="nonogram-note">A 0 means that line has no filled squares.</p></div>`;
    const board = stage.querySelector('.nonogram-board');
    const corner = document.createElement('div'); corner.className = 'nonogram-clue'; board.append(corner);
    colClues.forEach((clue, c) => { const cell = document.createElement('div'); cell.className = 'nonogram-clue nonogram-col-clue'; cell.setAttribute('aria-label', `Column ${c + 1}: ${clue.join(', ')}`); clue.forEach(n => { const span = document.createElement('span'); span.textContent = n; cell.append(span); }); board.append(cell); });
    let filled = 0, done = false;
    function checkWin() {
      if (filled !== total) return;
      for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) if ((board.querySelector(`[data-cell="${r},${c}"]`).dataset.state === '1') !== !!solution[r][c]) return;
      done = true; setMessage('Picture revealed!');
      const overlay = document.createElement('div'); overlay.className = 'end-overlay'; overlay.innerHTML = `<div class="end-card"><div class="end-mark">☁</div><h3>${puzzle.name} revealed.</h3><p>You read every row and column just right.</p><button type="button">Find another shape</button></div>`;
      overlay.querySelector('button').addEventListener('click', () => launchGame('shapes')); stage.append(overlay);
    }
    solution.forEach((row, r) => {
      const rowClue = document.createElement('div'); rowClue.className = 'nonogram-clue'; rowClue.setAttribute('aria-label', `Row ${r + 1}: ${rowClues[r].join(', ')}`); rowClues[r].forEach(n => { const span = document.createElement('span'); span.textContent = n; rowClue.append(span); }); board.append(rowClue);
      row.forEach((value, c) => {
        const cell = document.createElement('button'); cell.type = 'button'; cell.className = 'nonogram-cell'; cell.dataset.state = '0'; cell.dataset.cell = `${r},${c}`; cell.setAttribute('aria-label', `Row ${r + 1}, column ${c + 1}, unknown`);
        cell.addEventListener('click', () => {
          if (done) return;
          const previous = Number(cell.dataset.state), next = (previous + 1) % 3;
          if (previous === 1) filled--;
          if (next === 1) filled++;
          cell.dataset.state = String(next); cell.classList.toggle('filled', next === 1); cell.classList.toggle('marked', next === 2); cell.textContent = next === 2 ? '×' : '';
          cell.setAttribute('aria-label', `Row ${r + 1}, column ${c + 1}, ${next === 1 ? 'filled' : next === 2 ? 'marked empty' : 'unknown'}`);
          updateHud(0, `${filled} / ${total}`); checkWin();
        });
        board.append(cell);
      });
    });
    cleanupGame = () => { done = true; };
  }

  function startStars() {
    const maps = [
      { name: 'The Little Fox', points: [[50, 12], [31, 30], [21, 54], [39, 68], [59, 70], [78, 53], [68, 30]] },
      { name: 'The Sailing Kite', points: [[51, 10], [71, 35], [52, 51], [28, 34], [51, 10], [52, 51], [49, 80]] },
      { name: 'The Night Flower', points: [[50, 12], [62, 34], [84, 39], [68, 55], [73, 79], [50, 67], [27, 79], [32, 55], [16, 39], [38, 34], [50, 12]] }
    ];
    let level = 0, progress = [], done = false;
    makeHud([{ label: 'Map', value: '1 / 3' }, { label: 'Stars', value: '0' }]);
    controls.textContent = 'Tap the numbered stars in order to trace each shape.';
    function finishMap() {
      done = true;
      const isLast = level === maps.length - 1;
      const overlay = document.createElement('div'); overlay.className = 'end-overlay';
      overlay.innerHTML = isLast ? `<div class="end-card"><div class="end-mark">✦</div><h3>Sky well mapped.</h3><p>You traced all three tiny constellations.</p><button type="button">Trace the sky again</button></div>` : `<div class="end-card"><div class="end-mark">✦</div><h3>${maps[level].name} found.</h3><p>A new constellation is waiting in the sky.</p><button type="button">Map the next one</button></div>`;
      overlay.querySelector('button').addEventListener('click', () => { if (isLast) launchGame('stars'); else { level++; renderMap(); } });
      stage.append(overlay);
    }
    function renderMap() {
      done = false; progress = [];
      const map = maps[level]; updateHud(0, `${level + 1} / ${maps.length}`); updateHud(1, `0 / ${map.points.length}`); setMessage('');
      stage.innerHTML = `<div class="star-game"><p class="star-prompt">Trace ${map.name.toLowerCase()} by tapping each star in number order.</p><div class="star-board"></div><p class="maze-help">The faint line is your map. Follow the numbers to draw it.</p></div>`;
      const board = stage.querySelector('.star-board');
      const path = map.points.map(point => point.join(',')).join(' ');
      board.innerHTML = `<svg viewBox="0 0 100 100" aria-hidden="true"><polyline class="star-guide" points="${path}"></polyline><polyline class="star-progress" points=""></polyline></svg>`;
      map.points.forEach(([x, y], index) => {
        const button = document.createElement('button'); button.type = 'button'; button.className = 'star-node'; button.style.left = `${x}%`; button.style.top = `${y}%`; button.textContent = String(index + 1); button.setAttribute('aria-label', `Star ${index + 1}`);
        button.addEventListener('click', () => {
          if (done) return;
          if (index !== progress.length) {
            progress = index === 0 ? [0] : [];
            board.querySelector('.star-progress').setAttribute('points', progress.map(i => map.points[i].join(',')).join(' '));
            board.querySelectorAll('.star-node').forEach(node => node.classList.remove('visited'));
            progress.forEach(i => board.querySelectorAll('.star-node')[i].classList.add('visited'));
            updateHud(1, `${progress.length} / ${map.points.length}`); setMessage(index === 0 ? 'Start at star one.' : 'Follow the numbers in order.');
            return;
          }
          progress.push(index); button.classList.add('visited');
          board.querySelector('.star-progress').setAttribute('points', progress.map(i => map.points[i].join(',')).join(' '));
          updateHud(1, `${progress.length} / ${map.points.length}`); setMessage('A little brighter.');
          if (progress.length === map.points.length) finishMap();
        });
        board.append(button);
      });
    }
    renderMap(); cleanupGame = () => { done = true; };
  }

  function startLily() {
    const cols = 9, rows = 7, lanes = [];
    for (let r = 1; r <= 5; r++) {
      const direction = r % 2 ? 1 : -1, cells = Array(cols).fill(false);
      const start = r % 2 ? 0 : 3;
      for (let step = 0; step < 6; step++) cells[(start + step) % cols] = true;
      lanes.push({ row: r, direction, cells });
    }
    let player = { x: 4, y: 6 }, crossings = 0, pearlsFound = 0, lives = 3, remaining = 45, done = false;
    const pearls = new Set(); let laneTimer = 0, clockTimer = 0;
    makeHud([{ label: 'Crossings', value: '0' }, { label: 'Time', value: '45' }, { label: 'Pearls', value: '0' }, { label: 'Lives', value: '3' }]);
    controls.textContent = 'Use the arrows or direction buttons. Step onto a log before hopping across the stream.';
    stage.innerHTML = '<div class="lily-game"><div class="lily-board" role="grid" aria-label="Lily Hop stream crossing. Use arrow keys or buttons to move." tabindex="0"></div><div class="maze-controls lily-controls" aria-label="Hop controls"><button type="button" class="maze-up" data-dir="up" aria-label="Hop up">↑</button><button type="button" class="maze-left" data-dir="left" aria-label="Hop left">←</button><button type="button" class="maze-down" data-dir="down" aria-label="Hop down">↓</button><button type="button" class="maze-right" data-dir="right" aria-label="Hop right">→</button></div><p class="lily-help">Cross the stream and return to the starting bank to score.</p></div>';
    const board = stage.querySelector('.lily-board');
    function hasLog(row, x) { const lane = lanes.find(item => item.row === row); return !!lane && lane.cells[x]; }
    function placePearl() {
      const possible = [];
      for (let r = 1; r <= 5; r++) for (let c = 0; c < cols; c++) if (!hasLog(r, c) && !(player.x === c && player.y === r)) possible.push(`${r},${c}`);
      if (possible.length && pearls.size < 4) pearls.add(possible[Math.floor(Math.random() * possible.length)]);
    }
    for (let i = 0; i < 4; i++) placePearl();
    function render() {
      board.innerHTML = '';
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const cell = document.createElement('div'); cell.className = `lily-cell ${r === 0 || r === 6 ? 'bank' : 'water'}`;
        if (hasLog(r, c)) cell.classList.add('log');
        if (pearls.has(`${r},${c}`)) cell.classList.add('pearl');
        if (player.x === c && player.y === r) cell.classList.add('hopper');
        cell.setAttribute('aria-hidden', 'true'); board.append(cell);
      }
    }
    function finish() {
      if (done) return; done = true; clearInterval(laneTimer); clearInterval(clockTimer);
      const overlay = document.createElement('div'); overlay.className = 'end-overlay'; overlay.innerHTML = `<div class="end-card"><div class="end-mark">✿</div><h3>Back to the bank.</h3><p>${crossings} ${crossings === 1 ? 'crossing' : 'crossings'} and ${pearlsFound} ${pearlsFound === 1 ? 'pearl' : 'pearls'} gathered.</p><button type="button">Hop again</button></div>`;
      overlay.querySelector('button').addEventListener('click', () => launchGame('lily')); stage.append(overlay);
    }
    function takeHit(message) {
      lives--; updateHud(3, String(lives)); player = { x: 4, y: 6 }; setMessage(message);
      if (lives <= 0) finish(); else render();
    }
    function move(direction) {
      if (done) return;
      const delta = { up: [-1, 0], right: [0, 1], down: [1, 0], left: [0, -1] }[direction];
      const x = player.x + delta[1], y = player.y + delta[0];
      if (x < 0 || x >= cols || y < 0 || y >= rows) return;
      if (y > 0 && y < 6 && !hasLog(y, x)) { setMessage('Look for a drifting log.'); return; }
      player = { x, y };
      if (pearls.delete(`${y},${x}`)) { pearlsFound++; updateHud(1, String(pearlsFound)); setMessage('Pearl found!'); if (Math.random() < .65) placePearl(); }
      else setMessage('');
      if (y === 0) { crossings++; updateHud(0, String(crossings)); player = { x: 4, y: 6 }; setMessage('Across! Here comes another.'); }
      render();
    }
    function onKey(event) {
      if (!modal.classList.contains('is-open') || activeGame !== 'lily') return;
      const dirs = { ArrowUp: 'up', ArrowRight: 'right', ArrowDown: 'down', ArrowLeft: 'left', w: 'up', d: 'right', s: 'down', a: 'left', W: 'up', D: 'right', S: 'down', A: 'left' };
      if (dirs[event.key]) { event.preventDefault(); move(dirs[event.key]); }
    }
    document.addEventListener('keydown', onKey);
    stage.querySelectorAll('[data-dir]').forEach(button => button.addEventListener('click', () => move(button.dataset.dir)));
    laneTimer = setInterval(() => {
      if (done) return;
      const occupiedBefore = player.y > 0 && player.y < 6 && hasLog(player.y, player.x);
      const lane = lanes.find(item => item.row === player.y);
      lanes.forEach(item => { item.cells = item.direction > 0 ? [item.cells[cols - 1], ...item.cells.slice(0, cols - 1)] : [...item.cells.slice(1), item.cells[0]]; });
      if (lane && occupiedBefore) player.x = (player.x + lane.direction + cols) % cols;
      if (player.y > 0 && player.y < 6 && !hasLog(player.y, player.x)) takeHit('A log slipped away. Try another hop.');
      else { if (pearls.size < 2) placePearl(); render(); }
    }, 680);
    clockTimer = setInterval(() => { if (done) return; remaining--; updateHud(1, String(remaining)); if (remaining <= 0) finish(); }, 1000);
    // Keep the remaining time in a small live hint; the three life markers stay visible in the HUD.
    setMessage('45 seconds · 3 hops');
    render(); board.focus();
    cleanupGame = () => { done = true; clearInterval(laneTimer); clearInterval(clockTimer); document.removeEventListener('keydown', onKey); };
  }

  function startNumbers() {
    let solved = 0, lives = 3, remaining = 45, answer = 0, done = false, clock = 0;
    makeHud([{ label: 'Solved', value: '0' }, { label: 'Time', value: '45' }, { label: 'Chances', value: '3' }]);
    controls.textContent = 'Type your answer and press Enter. The sums grow a little with your streak.';
    stage.innerHTML = '<div class="number-game"><p class="number-prompt">A little number puzzle for your brain.</p><p class="number-equation" aria-live="polite"></p><form class="number-form"><input class="number-input" type="number" inputmode="numeric" aria-label="Your answer" autocomplete="off"><button class="number-submit" type="submit">Solve</button></form><p class="number-feedback" aria-live="polite">45 seconds. Three chances.</p></div>';
    const equation = stage.querySelector('.number-equation'), form = stage.querySelector('.number-form'), input = stage.querySelector('.number-input'), feedback = stage.querySelector('.number-feedback');
    function makeQuestion() {
      const level = Math.min(5, 1 + Math.floor(solved / 4));
      const op = level < 2 ? (Math.random() < .65 ? '+' : '−') : ['+', '−', '×'][Math.floor(Math.random() * 3)];
      let a, b;
      if (op === '+') { a = 3 + Math.floor(Math.random() * (7 + level * 5)); b = 2 + Math.floor(Math.random() * (7 + level * 4)); answer = a + b; }
      else if (op === '−') { a = 5 + Math.floor(Math.random() * (9 + level * 5)); b = Math.floor(Math.random() * a); answer = a - b; }
      else { a = 2 + Math.floor(Math.random() * (2 + level)); b = 2 + Math.floor(Math.random() * 8); answer = a * b; }
      equation.textContent = `${a} ${op} ${b} = ?`;
    }
    function finish() {
      if (done) return; done = true; clearInterval(clock); input.disabled = true; form.querySelector('button').disabled = true;
      const overlay = document.createElement('div'); overlay.className = 'end-overlay'; overlay.innerHTML = `<div class="end-card"><div class="end-mark">∑</div><h3>Nice thinking.</h3><p>You solved ${solved} ${solved === 1 ? 'puzzle' : 'puzzles'}.</p><button type="button">Try another round</button></div>`;
      overlay.querySelector('button').addEventListener('click', () => launchGame('numbers')); stage.append(overlay);
    }
    form.addEventListener('submit', event => {
      event.preventDefault(); if (done) return;
      if (input.value === '') { feedback.textContent = 'Give it a guess first.'; input.focus(); return; }
      if (Number(input.value) === answer) { solved++; updateHud(0, String(solved)); feedback.textContent = 'Exactly right. Next one!'; }
      else { lives--; updateHud(2, String(lives)); feedback.textContent = `Not quite. The answer was ${answer}.`; }
      input.value = '';
      if (lives <= 0) { finish(); return; }
      makeQuestion(); input.focus();
    });
    clock = setInterval(() => { if (done) return; remaining--; updateHud(1, String(remaining)); if (remaining <= 0) finish(); }, 1000);
    makeQuestion(); cleanupGame = () => { done = true; clearInterval(clock); };
  }

  function startPatchwork() {
    const goal = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    let board = goal.slice(), moves = 0, done = false;
    for (let step = 0; step < 100; step++) {
      const empty = board.indexOf(0), options = [empty - 3, empty + 3, empty - 1, empty + 1].filter(index => index >= 0 && index < 9 && Math.abs(Math.floor(index / 3) - Math.floor(empty / 3)) + Math.abs(index % 3 - empty % 3) === 1);
      const choice = options[Math.floor(Math.random() * options.length)]; [board[empty], board[choice]] = [board[choice], board[empty]];
    }
    if (board.every((value, index) => value === goal[index])) { const empty = board.indexOf(0), choice = [empty - 3, empty + 3, empty - 1, empty + 1].find(index => index >= 0 && index < 9 && Math.abs(Math.floor(index / 3) - Math.floor(empty / 3)) + Math.abs(index % 3 - empty % 3) === 1); [board[empty], board[choice]] = [board[choice], board[empty]]; }
    makeHud([{ label: 'Slides', value: '0' }, { label: 'Tiles', value: '8' }]);
    controls.textContent = 'Click a tile beside the empty space or use the arrow keys to slide.';
    stage.innerHTML = '<div class="patchwork-game"><p class="patchwork-prompt">Put the tiles back in order, from 1 to 8.</p><div class="patchwork-board" role="grid" aria-label="Eight tile sliding puzzle" tabindex="0"></div></div>';
    const boardEl = stage.querySelector('.patchwork-board');
    function isSolved() { return board.every((value, index) => value === goal[index]); }
    function finish() {
      done = true; setMessage('The path is in order.');
      const overlay = document.createElement('div'); overlay.className = 'end-overlay'; overlay.innerHTML = `<div class="end-card"><div class="end-mark">⌘</div><h3>Path pieced together.</h3><p>You solved it in ${moves} ${moves === 1 ? 'slide' : 'slides'}.</p><button type="button">Shuffle a new path</button></div>`;
      overlay.querySelector('button').addEventListener('click', () => launchGame('patchwork')); stage.append(overlay);
    }
    function render() {
      boardEl.innerHTML = '';
      board.forEach((value, index) => {
        const tile = document.createElement('button'); tile.type = 'button'; tile.className = `patchwork-tile ${value === 0 ? 'blank' : ''}`; tile.textContent = value || ''; tile.disabled = value === 0 || done; tile.setAttribute('aria-label', value ? `Tile ${value}` : 'Empty space');
        tile.addEventListener('click', () => slide(index)); boardEl.append(tile);
      });
    }
    function slide(index) {
      if (done) return;
      const empty = board.indexOf(0);
      if (Math.abs(Math.floor(index / 3) - Math.floor(empty / 3)) + Math.abs(index % 3 - empty % 3) !== 1) return;
      [board[index], board[empty]] = [board[empty], board[index]]; moves++; updateHud(0, String(moves)); render();
      if (isSolved()) finish();
    }
    function onKey(event) {
      if (!modal.classList.contains('is-open') || activeGame !== 'patchwork') return;
      const empty = board.indexOf(0), shift = { ArrowUp: -3, ArrowDown: 3, ArrowLeft: -1, ArrowRight: 1 }[event.key];
      if (shift === undefined) return;
      event.preventDefault(); const target = empty + shift;
      if (target >= 0 && target < 9 && Math.abs(Math.floor(target / 3) - Math.floor(empty / 3)) + Math.abs(target % 3 - empty % 3) === 1) slide(target);
    }
    document.addEventListener('keydown', onKey); render(); boardEl.focus();
    cleanupGame = () => { done = true; document.removeEventListener('keydown', onKey); };
  }

  function startRunes() {
    const runes = [
      { icon: '✦', name: 'star', color: '#d5c76f' }, { icon: '☾', name: 'moon', color: '#87a9c6' },
      { icon: '❋', name: 'sunburst', color: '#d89a70' }, { icon: '◈', name: 'crystal', color: '#92bc91' },
      { icon: '✿', name: 'flower', color: '#d18a9f' }, { icon: '♧', name: 'clover', color: '#a89aca' }
    ];
    const secret = Array.from({ length: 4 }, () => Math.floor(Math.random() * runes.length));
    let guess = [null, null, null, null], activeSlot = 0, attempts = 0, done = false;
    makeHud([{ label: 'Try', value: '1 / 8' }, { label: 'Exact', value: '0' }, { label: 'Elsewhere', value: '0' }]);
    controls.textContent = 'Fill the four slots, then submit. Clues count correct runes and positions.';
    stage.innerHTML = '<div class="runes-game"><p class="runes-prompt">Choose four runes. The code may repeat a symbol.</p><div class="runes-history" aria-live="polite"></div><div class="runes-current" role="group" aria-label="Your four rune slots"></div><div class="rune-palette" role="group" aria-label="Rune choices"></div><button type="button" class="rune-submit">Test this code</button><p class="rune-rule">Exact means right rune, right place. Elsewhere means right rune, another place.</p></div>';
    const history = stage.querySelector('.runes-history'), current = stage.querySelector('.runes-current'), palette = stage.querySelector('.rune-palette'), submit = stage.querySelector('.rune-submit');
    function renderSlots() {
      current.innerHTML = '';
      guess.forEach((value, index) => {
        const button = document.createElement('button'); button.type = 'button'; button.className = `rune-slot ${value === null ? '' : 'filled'} ${index === activeSlot ? 'active' : ''}`; button.textContent = value === null ? '·' : runes[value].icon; button.style.background = value === null ? '' : runes[value].color; button.setAttribute('aria-label', `Position ${index + 1}${value === null ? ', empty' : `, ${runes[value].name}`}`);
        button.addEventListener('click', () => { activeSlot = index; renderSlots(); }); current.append(button);
      });
      palette.querySelectorAll('button').forEach(button => button.disabled = done);
    }
    runes.forEach((rune, index) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'rune-color'; button.textContent = rune.icon; button.style.background = rune.color; button.setAttribute('aria-label', `Choose ${rune.name}`);
      button.addEventListener('click', () => {
        if (done) return;
        guess[activeSlot] = index;
        const nextEmpty = guess.findIndex(value => value === null); activeSlot = nextEmpty >= 0 ? nextEmpty : (activeSlot + 1) % guess.length;
        renderSlots();
      });
      palette.append(button);
    });
    function finish(won) {
      done = true; renderSlots(); submit.disabled = true;
      const overlay = document.createElement('div'); overlay.className = 'end-overlay'; overlay.innerHTML = won ? `<div class="end-card"><div class="end-mark">✦</div><h3>Code unlocked.</h3><p>You found the four-rune secret in ${attempts} ${attempts === 1 ? 'try' : 'tries'}.</p><button type="button">Find another code</button></div>` : `<div class="end-card"><div class="end-mark">◈</div><h3>The code was a mystery.</h3><p>The runes were ${secret.map(i => runes[i].icon).join(' ')}.</p><button type="button">Try a new code</button></div>`;
      overlay.querySelector('button').addEventListener('click', () => launchGame('runes')); stage.append(overlay);
    }
    submit.addEventListener('click', () => {
      if (done) return;
      if (guess.some(value => value === null)) { setMessage('Fill all four rune slots first.'); return; }
      attempts++; let exact = 0, remainingSecret = [], remainingGuess = [];
      secret.forEach((value, i) => { if (guess[i] === value) exact++; else { remainingSecret.push(value); remainingGuess.push(guess[i]); } });
      let elsewhere = 0;
      remainingGuess.forEach(value => { const found = remainingSecret.indexOf(value); if (found >= 0) { elsewhere++; remainingSecret.splice(found, 1); } });
      updateHud(0, `${Math.min(8, attempts + 1)} / 8`); updateHud(1, String(exact)); updateHud(2, String(elsewhere));
      const row = document.createElement('div'); row.className = 'rune-row';
      const code = document.createElement('div'); code.className = 'rune-row-code';
      guess.forEach(value => { const token = document.createElement('span'); token.className = 'rune-token'; token.style.background = runes[value].color; token.textContent = runes[value].icon; code.append(token); });
      const clue = document.createElement('span'); clue.className = 'rune-feedback'; clue.textContent = `${exact} exact · ${elsewhere} elsewhere`;
      row.append(code, clue); history.prepend(row); setMessage('');
      if (exact === 4) { finish(true); return; }
      if (attempts >= 8) { finish(false); return; }
      guess = [null, null, null, null]; activeSlot = 0; renderSlots();
    });
    renderSlots();
    cleanupGame = () => { done = true; };
  }

  function startSort() {
    let tubes = [[0, 0, 0, 0], [1, 1, 1, 1], [2, 2, 2, 2], []], moves = 0, selected = null, done = false;
    const undoStack = [];
    function countTop(tube) { if (!tube.length) return 0; let count = 0; const color = tube[tube.length - 1]; for (let i = tube.length - 1; i >= 0 && tube[i] === color; i--) count++; return count; }
    function canPour(from, to, source = tubes) { const origin = source[from], destination = source[to]; if (from === to || !origin.length || destination.length >= 4) return false; const color = origin[origin.length - 1], top = destination[destination.length - 1]; return top === undefined || top === color; }
    function pour(from, to, source = tubes) {
      if (!canPour(from, to, source)) return false;
      const amount = Math.min(countTop(source[from]), 4 - source[to].length);
      for (let i = 0; i < amount; i++) source[to].push(source[from].pop());
      return amount > 0;
    }
    function solved(state) { return state.every(tube => tube.length === 0 || (tube.length === 4 && tube.every(color => color === tube[0]))); }
    let previous = null;
    for (let step = 0; step < 45; step++) {
      const choices = [];
      for (let from = 0; from < 4; from++) for (let to = 0; to < 4; to++) if (canPour(from, to) && (!previous || previous[0] !== to || previous[1] !== from)) choices.push([from, to]);
      if (!choices.length) break;
      const move = choices[Math.floor(Math.random() * choices.length)]; pour(move[0], move[1]); previous = move;
    }
    // A very unlikely solved shuffle gets another handful of reversible moves.
    if (solved(tubes)) {
      for (let step = 0; step < 8; step++) {
        const choices = [];
        for (let from = 0; from < 4; from++) for (let to = 0; to < 4; to++) if (canPour(from, to)) choices.push([from, to]);
        if (choices.length) { const move = choices[Math.floor(Math.random() * choices.length)]; pour(move[0], move[1]); }
      }
    }
    makeHud([{ label: 'Pours', value: '0' }, { label: 'Bottles', value: '0 / 3' }]);
    controls.textContent = 'Tap a bottle, then another. Only matching colors can pour together. One bottle stays empty.';
    stage.innerHTML = '<div class="sort-game"><p class="sort-prompt">Gather each color into its own bottle. You can pour a top group into an empty or matching bottle.</p><div class="sort-tubes" role="group" aria-label="Four color bottles"></div><div class="sort-actions"><button class="sort-undo" type="button" disabled>Undo last pour</button></div></div>';
    const tubeRow = stage.querySelector('.sort-tubes'), undoButton = stage.querySelector('.sort-undo');
    const colors = ['amber', 'mint', 'violet'];
    function finish() {
      done = true; setMessage('All the colors found their home.');
      const overlay = document.createElement('div'); overlay.className = 'end-overlay'; overlay.innerHTML = `<div class="end-card"><div class="end-mark">◈</div><h3>Every drop sorted.</h3><p>You organized the colors in ${moves} ${moves === 1 ? 'pour' : 'pours'}.</p><button type="button">Pour a new puzzle</button></div>`;
      overlay.querySelector('button').addEventListener('click', () => launchGame('sort')); stage.append(overlay);
    }
    function render() {
      tubeRow.innerHTML = '';
      tubes.forEach((tube, index) => {
        const button = document.createElement('button'); button.type = 'button'; button.className = `sort-tube ${selected === index ? 'selected' : ''}`;
        const topColor = tube[tube.length - 1]; button.setAttribute('aria-label', `Bottle ${index + 1}${topColor === undefined ? ', empty' : `, top color ${colors[topColor]}`}`);
        for (let slot = 0; slot < 4; slot++) {
          const seed = document.createElement('i'); const value = tube[slot]; seed.className = `sort-seed ${value === undefined ? '' : `color-${value}`}`; seed.setAttribute('aria-hidden', 'true'); button.append(seed);
        }
        button.addEventListener('click', () => {
          if (done) return;
          if (selected === null) { if (tube.length) { selected = index; setMessage(`Bottle ${index + 1} selected.`); render(); } return; }
          if (selected === index) { selected = null; setMessage(''); render(); return; }
          const before = tubes.map(item => item.slice());
          if (pour(selected, index)) {
            undoStack.push(before); moves++; updateHud(0, String(moves)); selected = null;
            const complete = tubes.filter(item => item.length === 4 && item.every(color => color === item[0])).length; updateHud(1, `${complete} / 3`); setMessage('A little color in the right place.'); render();
            if (solved(tubes)) finish();
          } else if (tube.length) { selected = index; setMessage('Try pouring into an empty or matching bottle.'); render(); }
          else { setMessage('That color needs a matching home.'); }
        });
        tubeRow.append(button);
      });
      undoButton.disabled = !undoStack.length || done;
    }
    undoButton.addEventListener('click', () => {
      if (done || !undoStack.length) return;
      tubes = undoStack.pop(); moves = Math.max(0, moves - 1); selected = null; updateHud(0, String(moves));
      const complete = tubes.filter(item => item.length === 4 && item.every(color => color === item[0])).length; updateHud(1, `${complete} / 3`); setMessage('Last pour undone.'); render();
    });
    render(); cleanupGame = () => { done = true; };
  }

  function startPutt() {
    makeHud([{ label: 'Shots', value: '0' }, { label: 'Power', value: '55%' }]);
    controls.textContent = 'Drag back from the ball and release. Arrow keys aim, Up/Down set power, Space swings.';
    stage.innerHTML = '<div class="putt-game"><p class="putt-guide">Pull away from the ball to line up your shot.</p><canvas class="putt-canvas" width="640" height="440" tabindex="0" aria-label="Pocket Putt. Drag backwards from the ball to shoot toward the hole."></canvas><p class="putt-caption">The little barriers bounce your ball back. A gentle shot can be just right.</p></div>';
    const canvas = stage.querySelector('.putt-canvas'), ctx = canvas.getContext('2d'), W = canvas.width, H = canvas.height;
    const cup = { x: 557, y: 73, r: 13 }, start = { x: 72, y: 365 };
    const obstacles = [{ x: 186, y: 82, w: 22, h: 220 }, { x: 286, y: 218, w: 172, h: 22 }, { x: 472, y: 75, w: 22, h: 113 }, { x: 339, y: 322, w: 130, h: 20 }];
    const ball = { x: start.x, y: start.y, vx: 0, vy: 0, r: 9 };
    let shots = 0, aimAngle = -0.58, power = 245, dragging = false, pointer = null, done = false, raf = 0, last = performance.now();
    function coords(event) { const rect = canvas.getBoundingClientRect(); return { x: (event.clientX - rect.left) * W / rect.width, y: (event.clientY - rect.top) * H / rect.height }; }
    function onPointerDown(event) {
      if (done || Math.hypot(ball.vx, ball.vy) > 5) return;
      const p = coords(event);
      if (Math.hypot(p.x - ball.x, p.y - ball.y) < 38) { dragging = true; pointer = p; canvas.setPointerCapture(event.pointerId); }
    }
    function onPointerMove(event) { if (dragging) pointer = coords(event); }
    function onPointerUp(event) {
      if (!dragging) return;
      pointer = coords(event); dragging = false;
      const dx = ball.x - pointer.x, dy = ball.y - pointer.y, strength = Math.min(460, Math.hypot(dx, dy) * 4);
      if (strength > 16) { aimAngle = Math.atan2(dy, dx); power = strength; shoot(aimAngle, power); }
      pointer = null;
    }
    function shoot(angle, strength) { if (done || Math.hypot(ball.vx, ball.vy) > 5) return; ball.vx = Math.cos(angle) * strength; ball.vy = Math.sin(angle) * strength; shots++; updateHud(0, String(shots)); updateHud(1, `${Math.round(strength / 4.6)}%`); }
    canvas.addEventListener('pointerdown', onPointerDown); canvas.addEventListener('pointermove', onPointerMove); canvas.addEventListener('pointerup', onPointerUp); canvas.addEventListener('pointercancel', onPointerUp);
    function onKey(event) {
      if (!modal.classList.contains('is-open') || activeGame !== 'putt') return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) event.preventDefault();
      if (event.key === 'ArrowLeft') aimAngle -= .08; if (event.key === 'ArrowRight') aimAngle += .08;
      if (event.key === 'ArrowUp') power = Math.min(460, power + 25); if (event.key === 'ArrowDown') power = Math.max(55, power - 25);
      updateHud(1, `${Math.round(power / 4.6)}%`);
      if (event.key === ' ') shoot(aimAngle, power);
    }
    document.addEventListener('keydown', onKey);
    function finish() {
      if (done) return; done = true; cancelAnimationFrame(raf);
      const overlay = document.createElement('div'); overlay.className = 'end-overlay'; overlay.innerHTML = `<div class="end-card"><div class="end-mark">●</div><h3>A little hole in one.</h3><p>You found the cup in ${shots} ${shots === 1 ? 'shot' : 'shots'}.</p><button type="button">Play another hole</button></div>`;
      overlay.querySelector('button').addEventListener('click', () => launchGame('putt')); stage.append(overlay);
    }
    function draw() {
      const green = ctx.createLinearGradient(0, 0, 0, H); green.addColorStop(0, '#527c61'); green.addColorStop(1, '#365e4e'); ctx.fillStyle = green; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < W; i += 48) { ctx.fillStyle = i % 96 ? 'rgba(228,239,197,.035)' : 'rgba(228,239,197,.075)'; ctx.fillRect(i, 0, 24, H); }
      ctx.strokeStyle = '#a8c58d'; ctx.lineWidth = 3; ctx.strokeRect(12, 12, W - 24, H - 24);
      obstacles.forEach((o, index) => { ctx.fillStyle = index % 2 ? '#8b9a6d' : '#718b68'; ctx.strokeStyle = 'rgba(237,241,211,.3)'; ctx.lineWidth = 1; ctx.fillRect(o.x, o.y, o.w, o.h); ctx.strokeRect(o.x, o.y, o.w, o.h); });
      ctx.fillStyle = '#243c34'; ctx.beginPath(); ctx.ellipse(cup.x, cup.y, cup.r, cup.r * .72, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#e4e9c5'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cup.x + 2, cup.y); ctx.lineTo(cup.x + 2, cup.y - 50); ctx.stroke(); ctx.fillStyle = '#df9b77'; ctx.beginPath(); ctx.moveTo(cup.x + 3, cup.y - 49); ctx.lineTo(cup.x + 31, cup.y - 41); ctx.lineTo(cup.x + 3, cup.y - 33); ctx.fill();
      if (dragging && pointer) { ctx.strokeStyle = '#f5f0c9'; ctx.setLineDash([5, 5]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ball.x, ball.y); ctx.lineTo(pointer.x, pointer.y); ctx.stroke(); ctx.setLineDash([]); }
      else if (Math.hypot(ball.vx, ball.vy) < 5) { ctx.strokeStyle = 'rgba(245,240,201,.55)'; ctx.setLineDash([3, 5]); ctx.beginPath(); ctx.moveTo(ball.x, ball.y); ctx.lineTo(ball.x + Math.cos(aimAngle) * 48, ball.y + Math.sin(aimAngle) * 48); ctx.stroke(); ctx.setLineDash([]); }
      ctx.fillStyle = '#f1efd9'; ctx.shadowColor = 'rgba(0,0,0,.3)'; ctx.shadowBlur = 5; ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; ctx.strokeStyle = '#b1b39b'; ctx.lineWidth = 1; ctx.stroke();
    }
    function frame(now) {
      if (done || activeGame !== 'putt') return;
      const dt = Math.min(.035, (now - last) / 1000); last = now;
      if (Math.hypot(ball.vx, ball.vy) > .1) {
        ball.x += ball.vx * dt; ball.y += ball.vy * dt;
        const friction = Math.pow(.986, dt * 60); ball.vx *= friction; ball.vy *= friction;
        if (ball.x < 22 || ball.x > W - 22) { ball.x = Math.max(22, Math.min(W - 22, ball.x)); ball.vx *= -.72; }
        if (ball.y < 22 || ball.y > H - 22) { ball.y = Math.max(22, Math.min(H - 22, ball.y)); ball.vy *= -.72; }
        obstacles.forEach(o => {
          const cx = Math.max(o.x, Math.min(ball.x, o.x + o.w)), cy = Math.max(o.y, Math.min(ball.y, o.y + o.h));
          if (Math.hypot(ball.x - cx, ball.y - cy) < ball.r) {
            if (ball.x < o.x || ball.x > o.x + o.w) ball.vx *= -.72; else ball.vy *= -.72;
            ball.x += Math.sign(ball.vx) * 2; ball.y += Math.sign(ball.vy) * 2;
          }
        });
        if (Math.hypot(ball.x - cup.x, ball.y - cup.y) < cup.r + 3 && Math.hypot(ball.vx, ball.vy) < 290) { ball.x = cup.x; ball.y = cup.y; ball.vx = 0; ball.vy = 0; draw(); finish(); return; }
        if (Math.hypot(ball.vx, ball.vy) < 5) { ball.vx = 0; ball.vy = 0; }
      }
      draw(); raf = requestAnimationFrame(frame);
    }
    draw(); raf = requestAnimationFrame(frame);
    cleanupGame = () => { done = true; cancelAnimationFrame(raf); canvas.removeEventListener('pointerdown', onPointerDown); canvas.removeEventListener('pointermove', onPointerMove); canvas.removeEventListener('pointerup', onPointerUp); canvas.removeEventListener('pointercancel', onPointerUp); document.removeEventListener('keydown', onKey); };
  }

  function startType() {
    const words = ['acorn', 'bloom', 'brook', 'cloud', 'clover', 'fern', 'firefly', 'flower', 'garden', 'meadow', 'moss', 'pebble', 'petal', 'pollen', 'rabbit', 'ripple', 'seedling', 'sunrise', 'thistle', 'willow'];
    let score = 0, streak = 0, remaining = 45, current = '', previous = '', done = false, clock = 0;
    makeHud([{ label: 'Words', value: '0' }, { label: 'Time', value: '45' }, { label: 'Streak', value: '0' }]);
    controls.textContent = 'Type the word and press Enter. Misses do not cost points.';
    stage.innerHTML = '<div class="type-game"><p class="type-prompt">Ready for a gentle typing sprint?</p><p class="type-word-target" aria-live="polite"></p><form class="type-form"><input class="type-input" aria-label="Type the displayed word" autocomplete="off" autocapitalize="off" spellcheck="false"><button class="type-submit" type="submit">Next word</button></form><p class="type-feedback" aria-live="polite">45 seconds · take a breath and begin.</p></div>';
    const target = stage.querySelector('.type-word-target'), form = stage.querySelector('.type-form'), input = stage.querySelector('.type-input'), feedback = stage.querySelector('.type-feedback');
    function nextWord() { let choice; do { choice = words[Math.floor(Math.random() * words.length)]; } while (choice === previous); previous = current; current = choice; target.textContent = current; input.value = ''; input.maxLength = current.length; }
    function finish() {
      if (done) return; done = true; clearInterval(clock); input.disabled = true; form.querySelector('button').disabled = true;
      const overlay = document.createElement('div'); overlay.className = 'end-overlay'; overlay.innerHTML = `<div class="end-card"><div class="end-mark">⌁</div><h3>Lovely rhythm.</h3><p>You typed ${score} ${score === 1 ? 'word' : 'words'} and found a ${streak}-word streak.</p><button type="button">Type another round</button></div>`;
      overlay.querySelector('button').addEventListener('click', () => launchGame('type')); stage.append(overlay);
    }
    form.addEventListener('submit', event => {
      event.preventDefault(); if (done) return;
      if (input.value.trim().toLowerCase() === current) {
        score++; streak++; updateHud(0, String(score)); updateHud(2, String(streak)); feedback.textContent = 'Lovely. Here comes another.'; nextWord();
      } else { streak = 0; updateHud(2, '0'); feedback.textContent = 'Not quite. Look carefully at the little word.'; input.value = ''; input.focus(); }
    });
    clock = setInterval(() => { if (done) return; remaining--; updateHud(1, String(remaining)); if (remaining <= 0) finish(); }, 1000);
    nextWord(); cleanupGame = () => { done = true; clearInterval(clock); };
  }

  function startSeed() {
    const levels = [
      ['########', '#......#', '#..G...#', '#..B...#', '#.P....#', '#......#', '#......#', '########'],
      ['########', '#......#', '#.G....#', '#..B...#', '#....#.#', '#P.....#', '#......#', '########'],
      ['########', '#......#', '#.G....#', '#..B...#', '#....G.#', '#....B.#', '#P.....#', '########']
    ];
    let level = 0, player = null, boxes = [], goals = [], walls = new Set(), moves = 0, history = [], done = false, levelDone = false;
    makeHud([{ label: 'Level', value: '1 / 3' }, { label: 'Moves', value: '0' }, { label: 'Seeds home', value: '0' }]);
    controls.textContent = 'Move with the arrows. Push every seed onto a flower plot; you cannot pull seeds back.';
    stage.innerHTML = '<div class="seed-game"><div class="seed-board" role="grid" aria-label="Seed Shifter push puzzle. Use arrow keys or buttons to move." tabindex="0"></div><div class="maze-controls" aria-label="Move controls"><button type="button" class="maze-up" data-dir="up" aria-label="Move up">↑</button><button type="button" class="maze-left" data-dir="left" aria-label="Move left">←</button><button type="button" class="maze-down" data-dir="down" aria-label="Move down">↓</button><button type="button" class="maze-right" data-dir="right" aria-label="Move right">→</button></div><div class="seed-actions"><button class="seed-undo" type="button" disabled>Undo</button><button class="seed-reset" type="button">Reset level</button></div><p class="seed-help">Plan a few steps ahead. A corner can trap a seed.</p></div>';
    const board = stage.querySelector('.seed-board'), undoButton = stage.querySelector('.seed-undo'), resetButton = stage.querySelector('.seed-reset');
    function parseLevel() {
      const overlay = stage.querySelector('.end-overlay'); if (overlay) overlay.remove();
      player = null; boxes = []; goals = []; walls = new Set(); moves = 0; history = []; levelDone = false;
      levels[level].forEach((row, r) => row.split('').forEach((char, c) => {
        const key = `${r},${c}`;
        if (char === '#') walls.add(key);
        if (char === 'P') player = { r, c };
        if (char === 'B') boxes.push({ r, c });
        if (char === 'G') goals.push({ r, c });
      }));
      updateHud(0, `${level + 1} / ${levels.length}`); updateHud(1, '0'); updateHud(2, '0'); setMessage(''); render();
    }
    function isWall(r, c) { return r < 0 || c < 0 || r >= 8 || c >= 8 || walls.has(`${r},${c}`); }
    function same(a, b) { return a.r === b.r && a.c === b.c; }
    function isBox(r, c) { return boxes.some(box => box.r === r && box.c === c); }
    function render() {
      board.innerHTML = '';
      for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
        const cell = document.createElement('div'); cell.className = 'seed-cell';
        if (isWall(r, c)) cell.classList.add('wall');
        if (goals.some(goal => goal.r === r && goal.c === c)) cell.classList.add('goal');
        if (isBox(r, c)) cell.classList.add('box');
        if (player.r === r && player.c === c) cell.classList.add('player');
        cell.setAttribute('aria-hidden', 'true'); board.append(cell);
      }
      undoButton.disabled = !history.length || done || levelDone;
    }
    function solved() { return boxes.length === goals.length && boxes.every(box => goals.some(goal => same(box, goal))); }
    function finishLevel() {
      levelDone = true; setMessage('Every seed is home.');
      const last = level === levels.length - 1;
      const overlay = document.createElement('div'); overlay.className = 'end-overlay'; overlay.innerHTML = last ? `<div class="end-card"><div class="end-mark">✿</div><h3>Every plot planted.</h3><p>You solved all three gardens.</p><button type="button">Push more seeds</button></div>` : `<div class="end-card"><div class="end-mark">✿</div><h3>Garden ${level + 1} planted.</h3><p>The next little garden has a new path.</p><button type="button">Visit the next garden</button></div>`;
      overlay.querySelector('button').addEventListener('click', () => { if (last) launchGame('seed'); else { level++; parseLevel(); } }); stage.append(overlay);
    }
    function move(direction) {
      if (done || levelDone) return;
      const delta = { up: [-1, 0], right: [0, 1], down: [1, 0], left: [0, -1] }[direction];
      const nr = player.r + delta[0], nc = player.c + delta[1]; if (isWall(nr, nc)) return;
      const boxIndex = boxes.findIndex(box => box.r === nr && box.c === nc);
      let pushedTo = null;
      if (boxIndex >= 0) {
        const br = nr + delta[0], bc = nc + delta[1]; if (isWall(br, bc) || isBox(br, bc)) return;
        pushedTo = { r: br, c: bc };
      }
      history.push({ player: { ...player }, boxes: boxes.map(box => ({ ...box })) });
      if (boxIndex >= 0) boxes[boxIndex] = pushedTo;
      player = { r: nr, c: nc }; moves++; updateHud(1, String(moves));
      const home = boxes.filter(box => goals.some(goal => same(box, goal))).length; updateHud(2, `${home} / ${goals.length}`); render();
      if (solved()) finishLevel();
    }
    function onKey(event) {
      if (!modal.classList.contains('is-open') || activeGame !== 'seed') return;
      const dirs = { ArrowUp: 'up', ArrowRight: 'right', ArrowDown: 'down', ArrowLeft: 'left', w: 'up', d: 'right', s: 'down', a: 'left', W: 'up', D: 'right', S: 'down', A: 'left' };
      if (dirs[event.key]) { event.preventDefault(); move(dirs[event.key]); }
    }
    document.addEventListener('keydown', onKey);
    stage.querySelectorAll('[data-dir]').forEach(button => button.addEventListener('click', () => move(button.dataset.dir)));
    undoButton.addEventListener('click', () => {
      if (!history.length || levelDone) return;
      const previous = history.pop(); player = previous.player; boxes = previous.boxes; moves = Math.max(0, moves - 1); updateHud(1, String(moves));
      const home = boxes.filter(box => goals.some(goal => same(box, goal))).length; updateHud(2, `${home} / ${goals.length}`); setMessage('One step undone.'); render();
    });
    resetButton.addEventListener('click', parseLevel);
    parseLevel(); board.focus();
    cleanupGame = () => { done = true; document.removeEventListener('keydown', onKey); };
  }

  function startSwatch() {
    const palette = [
      { name: 'rose', color: '#d78678' }, { name: 'mint', color: '#79a98c' },
      { name: 'sun', color: '#e9bb71' }, { name: 'violet', color: '#958bc7' }
    ];
    let score = 0, streak = 0, lives = 3, remaining = 40, wordIndex = 0, inkIndex = 0, options = [], done = false, clock = 0;
    makeHud([{ label: 'Score', value: '0' }, { label: 'Time', value: '40' }, { label: 'Chances', value: '3' }]);
    controls.textContent = 'Choose one of the four colors. Keys 1–4 work too.';
    stage.innerHTML = '<div class="swatch-game"><p class="swatch-prompt">Pick the ink color, not the word.</p><p class="swatch-word" aria-live="polite"></p><div class="swatch-options" role="group" aria-label="Color choices"></div><p class="swatch-feedback" aria-live="polite">40 seconds · three chances.</p></div>';
    const word = stage.querySelector('.swatch-word'), optionsEl = stage.querySelector('.swatch-options'), feedback = stage.querySelector('.swatch-feedback');
    function nextCard() {
      wordIndex = Math.floor(Math.random() * palette.length); inkIndex = Math.floor(Math.random() * palette.length);
      if (wordIndex === inkIndex) inkIndex = (inkIndex + 1 + Math.floor(Math.random() * (palette.length - 1))) % palette.length;
      word.textContent = palette[wordIndex].name; word.style.color = palette[inkIndex].color;
      options = [0, 1, 2, 3];
      for (let i = options.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [options[i], options[j]] = [options[j], options[i]]; }
      optionsEl.innerHTML = '';
      options.forEach((colorIndex, i) => {
        const button = document.createElement('button'); button.type = 'button'; button.className = 'swatch-option'; button.style.background = palette[colorIndex].color; button.setAttribute('aria-label', `${i + 1}: ${palette[colorIndex].name}`); button.addEventListener('click', () => choose(colorIndex)); optionsEl.append(button);
      });
    }
    function finish() {
      if (done) return; done = true; clearInterval(clock);
      const overlay = document.createElement('div'); overlay.className = 'end-overlay'; overlay.innerHTML = `<div class="end-card"><div class="end-mark">✳</div><h3>Colors collected.</h3><p>You found ${score} ink colors, with a ${streak}-answer streak.</p><button type="button">Sprint again</button></div>`;
      overlay.querySelector('button').addEventListener('click', () => launchGame('swatch')); stage.append(overlay);
    }
    function choose(index) {
      if (done) return;
      if (index === inkIndex) { score++; streak++; updateHud(0, String(score)); feedback.textContent = 'Right on the color. Keep that focus!'; }
      else { lives--; streak = 0; updateHud(2, String(lives)); feedback.textContent = `That was ${palette[inkIndex].name}. Look at the letters themselves.`; }
      if (lives <= 0) { finish(); return; }
      nextCard();
    }
    function onKey(event) {
      if (!modal.classList.contains('is-open') || activeGame !== 'swatch' || !['1', '2', '3', '4'].includes(event.key)) return;
      event.preventDefault(); choose(options[Number(event.key) - 1]);
    }
    document.addEventListener('keydown', onKey);
    clock = setInterval(() => { if (done) return; remaining--; updateHud(1, String(remaining)); if (remaining <= 0) finish(); }, 1000);
    nextCard(); cleanupGame = () => { done = true; clearInterval(clock); document.removeEventListener('keydown', onKey); };
  }

  function startRally() {
    makeHud([{ label: 'You', value: '0' }, { label: 'Rally', value: '0' }, { label: 'Garden CPU', value: '0' }]);
    controls.textContent = 'Move with W/S, ↑/↓, or drag anywhere on the field. First to 7 points wins.';
    const canvas = document.createElement('canvas'); canvas.className = 'arcade-canvas'; canvas.width = 760; canvas.height = 430; canvas.tabIndex = 0; canvas.setAttribute('aria-label', 'Bounce Buddies paddle game. Keep the ball in play against the garden computer.'); stage.append(canvas);
    const ctx = canvas.getContext('2d'), W = canvas.width, H = canvas.height, paddle = { w: 13, h: 82 };
    const you = { x: 31, y: H / 2 }, cpu = { x: W - 44, y: H / 2 }, ball = { x: W / 2, y: H / 2, r: 9, vx: 250, vy: 95 };
    let score = 0, cpuScore = 0, rally = 0, delay = 0, remaining = 0, last = performance.now(), raf = 0, done = false, pointerMode = false, playerTarget = H / 2;
    const keys = {};
    function pointerMove(event) { const rect = canvas.getBoundingClientRect(); playerTarget = Math.max(paddle.h / 2, Math.min(H - paddle.h / 2, (event.clientY - rect.top) * H / rect.height)); pointerMode = true; }
    function keyDown(event) {
      if (!modal.classList.contains('is-open') || activeGame !== 'rally') return;
      const k = event.key.toLowerCase();
      if (['w', 's', 'arrowup', 'arrowdown'].includes(k)) { event.preventDefault(); keys[k] = true; pointerMode = false; }
    }
    function keyUp(event) { keys[event.key.toLowerCase()] = false; }
    canvas.addEventListener('pointermove', pointerMove); canvas.addEventListener('pointerdown', pointerMove);
    document.addEventListener('keydown', keyDown); document.addEventListener('keyup', keyUp);
    function serve(toward) { ball.x = W / 2; ball.y = H / 2; const angle = (Math.random() * .8 - .4); ball.vx = Math.cos(angle) * 245 * toward; ball.vy = Math.sin(angle) * 245; delay = .8; rally = 0; updateHud(1, '0'); }
    function finish() {
      if (done) return; done = true; cancelAnimationFrame(raf);
      const won = score >= 7;
      const overlay = document.createElement('div'); overlay.className = 'end-overlay'; overlay.innerHTML = `<div class="end-card"><div class="end-mark">●</div><h3>${won ? 'Lovely rally!' : 'Good game!'}</h3><p>Final score: ${score} to ${cpuScore}.</p><button type="button">Play another round</button></div>`;
      overlay.querySelector('button').addEventListener('click', () => launchGame('rally')); stage.append(overlay);
    }
    function draw() {
      const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#23324a'); bg.addColorStop(1, '#2b3c4b'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(225,237,191,.25)'; ctx.setLineDash([8, 10]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(230,239,204,.28)'; ctx.font = 'bold 37px Arial'; ctx.textAlign = 'center'; ctx.fillText(String(score), W * .32, 54); ctx.fillText(String(cpuScore), W * .68, 54);
      ctx.fillStyle = '#d7ed9a'; ctx.shadowColor = '#d7ed9a'; ctx.shadowBlur = 14; ctx.fillRect(you.x, you.y - paddle.h / 2, paddle.w, paddle.h);
      ctx.fillStyle = '#e3b995'; ctx.shadowColor = '#e3b995'; ctx.fillRect(cpu.x, cpu.y - paddle.h / 2, paddle.w, paddle.h); ctx.shadowBlur = 0;
      ctx.fillStyle = '#f1f0d8'; ctx.shadowColor = '#f1f0d8'; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    }
    function frame(now) {
      if (done || activeGame !== 'rally') return;
      const dt = Math.min(.04, (now - last) / 1000); last = now;
      if (pointerMode) you.y += (playerTarget - you.y) * Math.min(1, dt * 12);
      else { if (keys.w || keys.arrowup) you.y -= 310 * dt; if (keys.s || keys.arrowdown) you.y += 310 * dt; }
      you.y = Math.max(paddle.h / 2, Math.min(H - paddle.h / 2, you.y));
      const cpuAim = ball.vx > 0 ? ball.y + Math.sin(now / 900) * 23 : H / 2 + Math.sin(now / 1200) * 36;
      cpu.y += Math.max(-235 * dt, Math.min(235 * dt, cpuAim - cpu.y)); cpu.y = Math.max(paddle.h / 2, Math.min(H - paddle.h / 2, cpu.y));
      if (delay > 0) delay -= dt;
      else {
        ball.x += ball.vx * dt; ball.y += ball.vy * dt;
        if (ball.y < ball.r || ball.y > H - ball.r) { ball.y = Math.max(ball.r, Math.min(H - ball.r, ball.y)); ball.vy *= -1; }
        if (ball.vx < 0 && ball.x - ball.r <= you.x + paddle.w && ball.x > you.x && Math.abs(ball.y - you.y) < paddle.h / 2 + ball.r) {
          ball.x = you.x + paddle.w + ball.r; const offset = (ball.y - you.y) / (paddle.h / 2); const speed = Math.min(510, Math.hypot(ball.vx, ball.vy) * 1.035); ball.vx = Math.abs(speed * Math.cos(offset * .9)); ball.vy = speed * Math.sin(offset * .9); rally++; updateHud(1, String(rally));
        }
        if (ball.vx > 0 && ball.x + ball.r >= cpu.x && ball.x < cpu.x + paddle.w && Math.abs(ball.y - cpu.y) < paddle.h / 2 + ball.r) {
          ball.x = cpu.x - ball.r; const offset = (ball.y - cpu.y) / (paddle.h / 2); const speed = Math.min(510, Math.hypot(ball.vx, ball.vy) * 1.025); ball.vx = -Math.abs(speed * Math.cos(offset * .9)); ball.vy = speed * Math.sin(offset * .9); rally++; updateHud(1, String(rally));
        }
        if (ball.x < -ball.r) { cpuScore++; updateHud(2, String(cpuScore)); if (cpuScore >= 7) { finish(); return; } serve(1); }
        else if (ball.x > W + ball.r) { score++; updateHud(0, String(score)); if (score >= 7) { finish(); return; } serve(-1); }
      }
      draw(); raf = requestAnimationFrame(frame);
    }
    draw(); raf = requestAnimationFrame(frame);
    cleanupGame = () => { done = true; cancelAnimationFrame(raf); canvas.removeEventListener('pointermove', pointerMove); canvas.removeEventListener('pointerdown', pointerMove); document.removeEventListener('keydown', keyDown); document.removeEventListener('keyup', keyUp); };
  }

  function startSeek() {
    const side = 7, target = { r: Math.floor(Math.random() * side), c: Math.floor(Math.random() * side) };
    let attempts = 0, previousDistance = null, found = false;
    makeHud([{ label: 'Searches', value: '0' }, { label: 'Garden', value: 'Waiting' }]);
    controls.textContent = 'Search any tile. The color and hints tell you if you are getting closer.';
    stage.innerHTML = '<div class="seek-game"><p class="seek-prompt">A sunseed is hiding somewhere in this little garden.</p><div class="seek-board" role="grid" aria-label="Seven by seven garden search"></div><p class="seek-help" aria-live="polite">Tap a square to begin your search.</p></div>';
    const board = stage.querySelector('.seek-board'), help = stage.querySelector('.seek-help');
    function finish() {
      found = true; setMessage('Sunseed found!');
      const overlay = document.createElement('div'); overlay.className = 'end-overlay'; overlay.innerHTML = `<div class="end-card"><div class="end-mark">☼</div><h3>Sunseed found.</h3><p>You searched ${attempts} ${attempts === 1 ? 'square' : 'squares'}.</p><button type="button">Search again</button></div>`;
      overlay.querySelector('button').addEventListener('click', () => launchGame('seek')); stage.append(overlay);
    }
    for (let r = 0; r < side; r++) for (let c = 0; c < side; c++) {
      const cell = document.createElement('button'); cell.type = 'button'; cell.className = 'seek-cell'; cell.textContent = '·'; cell.setAttribute('aria-label', `Row ${r + 1}, column ${c + 1}, not searched`);
      cell.addEventListener('click', () => {
        if (found || cell.disabled) return;
        attempts++; updateHud(0, String(attempts)); cell.disabled = true;
        const distance = Math.abs(target.r - r) + Math.abs(target.c - c);
        if (distance === 0) { cell.classList.add('found'); cell.textContent = '☼'; cell.setAttribute('aria-label', `Row ${r + 1}, column ${c + 1}, sunseed found`); updateHud(1, 'Found'); help.textContent = 'You found the little sunseed!'; finish(); return; }
        const heat = distance <= 1 ? 'hot' : distance <= 3 ? 'warm' : distance <= 5 ? 'mild' : 'cool';
        cell.classList.add(`heat-${heat}`); cell.textContent = heat === 'hot' ? '✦' : heat === 'warm' ? '✧' : heat === 'mild' ? '·' : '×';
        cell.setAttribute('aria-label', `Row ${r + 1}, column ${c + 1}, ${heat}`);
        const change = previousDistance === null ? 'The glow is faint.' : distance < previousDistance ? 'Warmer!' : distance > previousDistance ? 'Cooler.' : 'About the same warmth.';
        const message = `${heat === 'hot' ? 'Very warm!' : heat === 'warm' ? 'Warm.' : heat === 'mild' ? 'A little warm.' : 'Cool.'} ${change}`;
        help.textContent = message; setMessage(heat === 'hot' ? 'Very close!' : heat === 'warm' ? 'Getting warm.' : 'Keep searching.');
        previousDistance = distance; updateHud(1, heat[0].toUpperCase() + heat.slice(1));
      });
      board.append(cell);
    }
    cleanupGame = () => { found = true; };
  }

  function startOdd() {
    const symbols = [
      { icon: '✿', name: 'flower' }, { icon: '✦', name: 'star' }, { icon: '❋', name: 'sunburst' },
      { icon: '♧', name: 'clover' }, { icon: '◈', name: 'crystal' }, { icon: '☾', name: 'moon' }
    ];
    let score = 0, lives = 3, remaining = 40, done = false, clock = 0;
    makeHud([{ label: 'Found', value: '0' }, { label: 'Time', value: '40' }, { label: 'Chances', value: '3' }]);
    controls.textContent = 'Find the one symbol that is different. The patch grows as you find more.';
    stage.innerHTML = '<div class="odd-game"><p class="odd-prompt">One little symbol is not like the others.</p><div class="odd-board" role="group" aria-label="Find the different symbol"></div><p class="odd-feedback" aria-live="polite">40 seconds · three chances.</p></div>';
    const board = stage.querySelector('.odd-board'), feedback = stage.querySelector('.odd-feedback');
    function finish() {
      if (done) return; done = true; clearInterval(clock);
      const overlay = document.createElement('div'); overlay.className = 'end-overlay'; overlay.innerHTML = `<div class="end-card"><div class="end-mark">✿</div><h3>Sharp eyes!</h3><p>You found ${score} ${score === 1 ? 'odd symbol' : 'odd symbols'}.</p><button type="button">Play another patch</button></div>`;
      overlay.querySelector('button').addEventListener('click', () => launchGame('odd')); stage.append(overlay);
    }
    function newPatch() {
      const size = score < 3 ? 3 : score < 7 ? 4 : 5, majority = Math.floor(Math.random() * symbols.length);
      let different = Math.floor(Math.random() * (symbols.length - 1)); if (different >= majority) different++;
      const target = Math.floor(Math.random() * size * size); board.innerHTML = ''; board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
      for (let i = 0; i < size * size; i++) {
        const symbol = i === target ? different : majority, button = document.createElement('button'); button.type = 'button'; button.className = 'odd-cell'; button.textContent = symbols[symbol].icon; button.setAttribute('aria-label', `Tile ${i + 1}, ${symbols[symbol].name}`);
        button.addEventListener('click', () => {
          if (done) return;
          if (i === target) { score++; updateHud(0, String(score)); feedback.textContent = 'Found! Ready for the next little patch.'; newPatch(); }
          else { lives--; updateHud(2, String(lives)); feedback.textContent = 'Not that one. Look closely at the whole patch.'; if (lives <= 0) finish(); }
        });
        board.append(button);
      }
    }
    clock = setInterval(() => { if (done) return; remaining--; updateHud(1, String(remaining)); if (remaining <= 0) finish(); }, 1000);
    newPatch(); cleanupGame = () => { done = true; clearInterval(clock); };
  }

  function startPetalPop() {
    const size = 7, icons = ['✿', '✦', '❋', '♥', '◈'];
    let grid = [], selected = null, score = 0, moves = 0, remaining = 60, busy = false, done = false, clock = 0, resolveTimer = 0;
    makeHud([{ label: 'Blooms', value: '0' }, { label: 'Time', value: '60' }, { label: 'Swaps', value: '0' }]);
    controls.textContent = 'Select one bloom, then a neighboring one to swap. Only swaps that make a match count.';
    stage.innerHTML = '<div class="petalpop-game"><p class="petalpop-prompt">Match three or more in a row to gather blooms.</p><div class="petalpop-board" role="grid" aria-label="Seven by seven petal match board"></div></div>';
    const board = stage.querySelector('.petalpop-board');
    function makesTriple(r, c, value, dr, dc) {
      let count = 1;
      for (const direction of [-1, 1]) { let nr = r + dr * direction, nc = c + dc * direction; while (nr >= 0 && nc >= 0 && nr < size && nc < size && grid[nr][nc] === value) { count++; nr += dr * direction; nc += dc * direction; } }
      return count >= 3;
    }
    function freshGrid() {
      grid = Array.from({ length: size }, () => Array(size).fill(null));
      for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) {
        let options = [0, 1, 2, 3, 4], value;
        do { value = options[Math.floor(Math.random() * options.length)]; } while (makesTriple(r, c, value, 0, 1) || makesTriple(r, c, value, 1, 0));
        grid[r][c] = value;
      }
    }
    function findMatches() {
      const found = new Set();
      for (let r = 0; r < size; r++) { let start = 0; for (let c = 1; c <= size; c++) { if (c < size && grid[r][c] === grid[r][start]) continue; if (c - start >= 3) for (let k = start; k < c; k++) found.add(`${r},${k}`); start = c; } }
      for (let c = 0; c < size; c++) { let start = 0; for (let r = 1; r <= size; r++) { if (r < size && grid[r][c] === grid[start][c]) continue; if (r - start >= 3) for (let k = start; k < r; k++) found.add(`${k},${c}`); start = r; } }
      return found;
    }
    function hasPossibleMove() {
      for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) for (const [dr, dc] of [[0, 1], [1, 0]]) {
        const nr = r + dr, nc = c + dc; if (nr >= size || nc >= size) continue;
        [grid[r][c], grid[nr][nc]] = [grid[nr][nc], grid[r][c]];
        const works = findMatches().size > 0;
        [grid[r][c], grid[nr][nc]] = [grid[nr][nc], grid[r][c]];
        if (works) return true;
      }
      return false;
    }
    function freshPlayableGrid() { for (let attempt = 0; attempt < 50; attempt++) { freshGrid(); if (hasPossibleMove()) return; } }
    function render(clearing = new Set()) {
      board.innerHTML = '';
      for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) {
        const index = r * size + c, button = document.createElement('button'); button.type = 'button'; button.className = `petal-cell ${selected === index ? 'selected' : ''} ${clearing.has(`${r},${c}`) ? 'clearing' : ''}`; button.dataset.type = grid[r][c]; button.textContent = icons[grid[r][c]]; button.setAttribute('aria-label', `Row ${r + 1}, column ${c + 1}, bloom ${grid[r][c] + 1}`);
        button.addEventListener('click', () => choose(r, c)); board.append(button);
      }
    }
    function finish() {
      if (done) return; done = true; clearInterval(clock); clearTimeout(resolveTimer);
      const overlay = document.createElement('div'); overlay.className = 'end-overlay'; overlay.innerHTML = `<div class="end-card"><div class="end-mark">✿</div><h3>A pocket full of petals.</h3><p>You gathered ${score} blooms in ${moves} ${moves === 1 ? 'swap' : 'swaps'}.</p><button type="button">Bloom another board</button></div>`;
      overlay.querySelector('button').addEventListener('click', () => launchGame('petalpop')); stage.append(overlay);
    }
    function resolve(matches) {
      if (done) return;
      busy = true; render(matches);
      resolveTimer = setTimeout(() => {
        matches.forEach(key => { const [r, c] = key.split(',').map(Number); grid[r][c] = null; }); score += matches.size; updateHud(0, String(score));
        for (let c = 0; c < size; c++) {
          const remainingItems = [];
          for (let r = size - 1; r >= 0; r--) if (grid[r][c] !== null) remainingItems.push(grid[r][c]);
          while (remainingItems.length < size) remainingItems.push(Math.floor(Math.random() * icons.length));
          for (let r = size - 1, i = 0; r >= 0; r--, i++) grid[r][c] = remainingItems[i];
        }
        selected = null; render();
        const cascade = findMatches(); if (cascade.size) resolve(cascade); else { busy = false; if (!hasPossibleMove()) { freshPlayableGrid(); setMessage('A fresh patch of blooms for you.'); render(); } }
      }, 190);
    }
    function choose(r, c) {
      if (done || busy) return;
      const index = r * size + c;
      if (selected === null) { selected = index; render(); return; }
      if (selected === index) { selected = null; render(); return; }
      const sr = Math.floor(selected / size), sc = selected % size;
      if (Math.abs(sr - r) + Math.abs(sc - c) !== 1) { selected = index; render(); return; }
      [grid[sr][sc], grid[r][c]] = [grid[r][c], grid[sr][sc]];
      const matches = findMatches();
      if (!matches.size) { [grid[sr][sc], grid[r][c]] = [grid[r][c], grid[sr][sc]]; selected = null; setMessage('That swap needs a three-bloom match.'); render(); return; }
      moves++; updateHud(2, String(moves)); setMessage('A chain is blooming!'); resolve(matches);
    }
    freshPlayableGrid(); render();
    clock = setInterval(() => { if (done) return; remaining--; updateHud(1, String(remaining)); if (remaining <= 0) finish(); }, 1000);
    cleanupGame = () => { done = true; clearInterval(clock); clearTimeout(resolveTimer); };
  }

  function startKnight() {
    const side = 7, start = { r: 6, c: 0 }, gate = { r: 2, c: 6 };
    const stars = new Set(['4,1', '1,5', '0,5']);
    let player = { ...start }, hops = 0, done = false;
    makeHud([{ label: 'Hops', value: '0' }, { label: 'Fireflies', value: '0 / 3' }]);
    controls.textContent = 'A knight moves two squares in one direction, then one square sideways. Tap a valid destination.';
    stage.innerHTML = '<div class="knight-game"><p class="knight-prompt">Collect all three fireflies, then hop to the glowing gate.</p><div class="knight-board" role="grid" aria-label="Seven by seven knight movement board"></div><p class="knight-help">The outlined squares are valid L-shaped hops.</p></div>';
    const board = stage.querySelector('.knight-board');
    function legal(r, c) { const dr = Math.abs(r - player.r), dc = Math.abs(c - player.c); return dr < side && dc < side && ((dr === 2 && dc === 1) || (dr === 1 && dc === 2)); }
    function win() {
      done = true; setMessage('The gate is open.');
      const overlay = document.createElement('div'); overlay.className = 'end-overlay'; overlay.innerHTML = `<div class="end-card"><div class="end-mark">♘</div><h3>Garden gate found.</h3><p>You gathered three fireflies in ${hops} ${hops === 1 ? 'hop' : 'hops'}.</p><button type="button">Explore a new garden</button></div>`;
      overlay.querySelector('button').addEventListener('click', () => launchGame('knight')); stage.append(overlay);
    }
    function render() {
      board.innerHTML = '';
      for (let r = 0; r < side; r++) for (let c = 0; c < side; c++) {
        const key = `${r},${c}`, cell = document.createElement('button'); cell.type = 'button'; cell.className = `knight-cell ${(r + c) % 2 ? 'light' : ''} ${legal(r, c) ? 'valid' : ''}`; cell.setAttribute('aria-label', `Row ${r + 1}, column ${c + 1}${key === `${player.r},${player.c}` ? ', knight' : stars.has(key) ? ', firefly' : r === gate.r && c === gate.c ? ', garden gate' : ''}`); cell.dataset.position = key;
        if (r === player.r && c === player.c) { const token = document.createElement('span'); token.className = 'knight-token'; token.textContent = '♘'; cell.append(token); }
        else if (stars.has(key)) { const token = document.createElement('span'); token.className = 'knight-goal'; token.textContent = '✦'; cell.append(token); }
        else if (r === gate.r && c === gate.c) { const token = document.createElement('span'); token.className = 'knight-goal'; token.textContent = '✿'; cell.append(token); }
        cell.addEventListener('click', () => {
          if (done) return;
          if (!legal(r, c)) { setMessage('That square is not an L-shaped hop.'); return; }
          player = { r, c }; hops++; updateHud(0, String(hops));
          if (stars.delete(key)) { updateHud(1, `${3 - stars.size} / 3`); setMessage('Firefly gathered!'); } else setMessage('A fine little hop.');
          render();
          if (r === gate.r && c === gate.c) { if (stars.size === 0) win(); else setMessage(`${stars.size} more fireflies to find.`); }
          const current = board.querySelector(`[data-position="${r},${c}"]`); if (current) current.focus();
        });
        board.append(cell);
      }
    }
    render(); cleanupGame = () => { done = true; };
  }

  function startMosslight() {
    const side = 7, mineTotal = 8, boardData = Array.from({ length: side }, () => Array.from({ length: side }, () => ({ mine: false, count: 0, revealed: false, flagged: false })));
    let minesPlaced = false, safeFound = 0, flagCount = 0, flagMode = false, done = false;
    makeHud([{ label: 'Safe patches', value: '0 / 41' }, { label: 'Flags', value: '0 / 8' }]);
    controls.textContent = 'Tap a patch to uncover it. Switch on flag mode to mark a likely thorn.';
    stage.innerHTML = '<div class="mosslight-game"><p class="mosslight-prompt">Each number tells how many thorns touch that patch.</p><div class="mosslight-board" role="grid" aria-label="Seven by seven hidden thorn field"></div><div class="mosslight-actions"><button class="mosslight-flag" type="button" aria-pressed="false">⚑ Flag mode off</button></div><p class="mosslight-help">Your first patch is always safe. Explore all 41 safe patches to win.</p></div>';
    const board = stage.querySelector('.mosslight-board'), flagButton = stage.querySelector('.mosslight-flag');
    function neighbors(r, c) { const list = []; for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) if ((dr || dc) && r + dr >= 0 && c + dc >= 0 && r + dr < side && c + dc < side) list.push([r + dr, c + dc]); return list; }
    function placeMines(safeR, safeC) {
      let count = 0;
      while (count < mineTotal) {
        const r = Math.floor(Math.random() * side), c = Math.floor(Math.random() * side);
        if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue;
        if (boardData[r][c].mine) continue;
        boardData[r][c].mine = true; count++;
      }
      for (let r = 0; r < side; r++) for (let c = 0; c < side; c++) boardData[r][c].count = neighbors(r, c).filter(([nr, nc]) => boardData[nr][nc].mine).length;
      minesPlaced = true;
    }
    function finish(won) {
      done = true;
      if (!won) for (let r = 0; r < side; r++) for (let c = 0; c < side; c++) if (boardData[r][c].mine) boardData[r][c].revealed = true;
      render();
      const overlay = document.createElement('div'); overlay.className = 'end-overlay'; overlay.innerHTML = won ? '<div class="end-card"><div class="end-mark">✦</div><h3>The garden is clear.</h3><p>You found every safe patch and avoided the thorns.</p><button type="button">Explore another patch</button></div>' : '<div class="end-card"><div class="end-mark">✹</div><h3>A thorn in the moss.</h3><p>Those little numbers are the clues for another try.</p><button type="button">Try a new garden</button></div>';
      overlay.querySelector('button').addEventListener('click', () => launchGame('mosslight')); stage.append(overlay);
    }
    function render() {
      board.innerHTML = '';
      for (let r = 0; r < side; r++) for (let c = 0; c < side; c++) {
        const data = boardData[r][c], cell = document.createElement('button'); cell.type = 'button'; cell.className = `mosslight-cell ${data.revealed ? 'revealed' : ''} ${data.flagged ? 'flagged' : ''} ${data.revealed && data.mine ? 'mine-hit' : ''}`; cell.dataset.count = data.count;
        cell.textContent = data.flagged && !data.revealed ? '⚑' : data.revealed && data.mine ? '✹' : data.revealed && data.count ? String(data.count) : '';
        cell.setAttribute('aria-label', `Row ${r + 1}, column ${c + 1}, ${data.flagged && !data.revealed ? 'flagged' : data.revealed ? data.mine ? 'thorn' : data.count ? `${data.count} nearby thorns` : 'clear' : 'covered'}`);
        cell.addEventListener('click', () => act(r, c)); cell.addEventListener('contextmenu', event => { event.preventDefault(); toggleFlag(r, c); }); board.append(cell);
      }
      flagButton.classList.toggle('active', flagMode); flagButton.setAttribute('aria-pressed', String(flagMode)); flagButton.textContent = flagMode ? '⚑ Flag mode on' : '⚑ Flag mode off'; flagButton.disabled = done;
    }
    function toggleFlag(r, c) {
      const cell = boardData[r][c]; if (done || cell.revealed) return;
      if (!cell.flagged && flagCount >= mineTotal) { setMessage('You have placed all eight flags.'); return; }
      cell.flagged = !cell.flagged; flagCount += cell.flagged ? 1 : -1; updateHud(1, `${flagCount} / ${mineTotal}`); render();
    }
    function reveal(r, c) {
      const cell = boardData[r][c]; if (done || cell.revealed || cell.flagged) return false;
      if (!minesPlaced) placeMines(r, c);
      if (cell.mine) { cell.revealed = true; finish(false); return true; }
      const stack = [[r, c]];
      while (stack.length) {
        const [nr, nc] = stack.pop(), tile = boardData[nr][nc];
        if (tile.revealed || tile.flagged || tile.mine) continue;
        tile.revealed = true; safeFound++;
        if (tile.count === 0) neighbors(nr, nc).forEach(([ar, ac]) => { if (!boardData[ar][ac].revealed && !boardData[ar][ac].flagged) stack.push([ar, ac]); });
      }
      updateHud(0, `${safeFound} / ${side * side - mineTotal}`); render();
      if (safeFound === side * side - mineTotal) finish(true);
      return true;
    }
    function act(r, c) { if (flagMode) toggleFlag(r, c); else reveal(r, c); }
    flagButton.addEventListener('click', () => { flagMode = !flagMode; render(); });
    render(); cleanupGame = () => { done = true; };
  }

  function startShut() {
    let open = [1, 2, 3, 4, 5, 6, 7, 8, 9], selected = new Set(), dice = [], total = 0, rolls = 0, done = false, rolled = false;
    makeHud([{ label: 'Petals shut', value: '0 / 9' }, { label: 'Rolls', value: '0' }, { label: 'Open sum', value: '45' }]);
    controls.textContent = 'Roll the dice, then select open petals whose numbers add up to the total.';
    stage.innerHTML = '<div class="shut-game"><p class="shut-prompt">Close every numbered petal by matching the dice total. When only 1–6 remain, roll one die.</p><div class="shut-dice" aria-live="polite"><span class="shut-die hidden">·</span><span class="shut-die hidden">·</span></div><div class="shut-tiles" role="group" aria-label="Numbered garden petals"></div><div class="shut-actions"><button class="shut-roll" type="button">Roll dice</button><button class="shut-bank secondary" type="button" disabled>Close selected</button></div><p class="shut-help" aria-live="polite">Can you close all nine?</p></div>';
    const tiles = stage.querySelector('.shut-tiles'), diceEls = [...stage.querySelectorAll('.shut-die')], rollButton = stage.querySelector('.shut-roll'), bankButton = stage.querySelector('.shut-bank'), help = stage.querySelector('.shut-help');
    function sumSelection() { return [...selected].reduce((sum, n) => sum + n, 0); }
    function canMake(target, values = open) {
      const sorted = values.slice().sort((a, b) => b - a);
      function search(index, rest) { if (rest === 0) return true; if (rest < 0 || index >= sorted.length) return false; return search(index + 1, rest - sorted[index]) || search(index + 1, rest); }
      return search(0, target);
    }
    function render() {
      tiles.innerHTML = '';
      for (let n = 1; n <= 9; n++) {
        const button = document.createElement('button'); button.type = 'button'; button.className = `shut-tile ${open.includes(n) ? '' : 'closed'} ${selected.has(n) ? 'selected' : ''}`; button.textContent = open.includes(n) ? String(n) : '·'; button.disabled = done || !rolled || !open.includes(n); button.setAttribute('aria-label', open.includes(n) ? `Petal ${n}${selected.has(n) ? ', selected' : ''}` : `Petal ${n}, closed`);
        button.addEventListener('click', () => {
          if (done || !rolled) return;
          if (selected.has(n)) selected.delete(n);
          else if (sumSelection() + n <= total) selected.add(n);
          else { help.textContent = 'That selection is larger than the dice total.'; return; }
          help.textContent = `Selected sum: ${sumSelection()} of ${total}.`; bankButton.disabled = sumSelection() !== total; render();
        });
        tiles.append(button);
      }
      diceEls.forEach((die, index) => { die.textContent = dice[index] || '·'; die.classList.toggle('hidden', !dice[index]); });
      rollButton.disabled = done || rolled; bankButton.disabled = done || !rolled || sumSelection() !== total;
    }
    function finish(won, reason) {
      if (done) return; done = true; setMessage(reason || '');
      const left = open.reduce((sum, n) => sum + n, 0);
      const overlay = document.createElement('div'); overlay.className = 'end-overlay'; overlay.innerHTML = won ? `<div class="end-card"><div class="end-mark">✿</div><h3>The garden is shut.</h3><p>You closed all nine petals in ${rolls} ${rolls === 1 ? 'roll' : 'rolls'}.</p><button type="button">Roll another garden</button></div>` : `<div class="end-card"><div class="end-mark">☼</div><h3>That is the last roll.</h3><p>${reason} · ${left} points left open.</p><button type="button">Try a new garden</button></div>`;
      overlay.querySelector('button').addEventListener('click', () => launchGame('shut')); stage.append(overlay);
    }
    rollButton.addEventListener('click', () => {
      if (done || rolled) return;
      const largest = Math.max(...open), count = largest <= 6 ? 1 : 2;
      dice = Array.from({ length: count }, () => 1 + Math.floor(Math.random() * 6)); total = dice.reduce((a, b) => a + b, 0); rolls++; rolled = true; selected.clear();
      updateHud(1, String(rolls)); help.textContent = `Make ${total} with the open petals.`; setMessage(`The dice add up to ${total}.`);
      render();
      if (!canMake(total)) finish(false, `No open petals can make ${total}`);
    });
    bankButton.addEventListener('click', () => {
      if (done || !rolled || sumSelection() !== total) return;
      open = open.filter(n => !selected.has(n)); selected.clear(); rolled = false; dice = [];
      updateHud(0, `${9 - open.length} / 9`); updateHud(2, String(open.reduce((sum, n) => sum + n, 0)));
      if (!open.length) { render(); finish(true); return; }
      help.textContent = 'Petals closed. Roll again when you are ready.'; setMessage('A tidy little sum.'); render();
    });
    render(); cleanupGame = () => { done = true; };
  }

  function startClover() {
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let current = Math.floor(Math.random() * ranks.length), streak = 0, draws = 0, done = false;
    makeHud([{ label: 'Streak', value: '0' }, { label: 'Cards seen', value: '1' }]);
    controls.textContent = 'Guess whether the next card is higher, lower, or the same. Bank your streak any time.';
    stage.innerHTML = '<div class="clover-game"><p class="clover-prompt">Aces are low. Ties count only when you choose “Same.”</p><div class="clover-current" aria-live="polite"></div><div class="clover-actions"><button type="button" data-guess="higher">Higher ↑</button><button type="button" data-guess="lower">Lower ↓</button><button type="button" data-guess="same">Same =</button><button type="button" class="secondary" id="bank-streak" disabled>Bank streak</button></div><p class="clover-feedback" aria-live="polite">How will the next card compare?</p></div>';
    const card = stage.querySelector('.clover-current'), feedback = stage.querySelector('.clover-feedback'), bank = stage.querySelector('#bank-streak');
    function render() { card.textContent = ranks[current]; bank.disabled = streak === 0 || done; }
    function finish(banked, reason = '') {
      if (done) return; done = true;
      const overlay = document.createElement('div'); overlay.className = 'end-overlay'; overlay.innerHTML = banked ? `<div class="end-card"><div class="end-mark">♧</div><h3>Streak safely banked.</h3><p>You called ${streak} ${streak === 1 ? 'card' : 'cards'} in a row.</p><button type="button">Try another climb</button></div>` : `<div class="end-card"><div class="end-mark">♧</div><h3>${reason}</h3><p>The streak was ${streak}. Take another chance?</p><button type="button">Climb again</button></div>`;
      overlay.querySelector('button').addEventListener('click', () => launchGame('clover')); stage.append(overlay);
    }
    stage.querySelectorAll('[data-guess]').forEach(button => button.addEventListener('click', () => {
      if (done) return;
      const next = Math.floor(Math.random() * ranks.length), guess = button.dataset.guess;
      const correct = guess === 'higher' ? next > current : guess === 'lower' ? next < current : next === current;
      draws++; updateHud(1, String(draws + 1)); current = next;
      if (correct) { streak++; updateHud(0, String(streak)); feedback.textContent = 'Good call. Keep climbing or bank your streak.'; render(); if (streak >= 8) finish(true); }
      else { feedback.textContent = `The next card was ${ranks[next]}. The streak slipped away.`; render(); finish(false, 'A little slip.'); }
    }));
    bank.addEventListener('click', () => finish(true));
    render(); cleanupGame = () => { done = true; };
  }
})();
