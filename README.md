# Aura Eli/Viridiangames

An original browser arcade with 31 games, made with plain HTML, CSS, and JavaScript. It has no build step, server code, external libraries, analytics, accounts, or downloads. The site runs on a regular static web host.

## The games

- **Comet Catch** — a 30-second catch-and-dodge arcade game. Move the catcher with arrow keys, A/D, mouse, or touch.
- **Signal Garden** — a relaxed memory game. Watch the lights and repeat their growing sequence. There is no timer.
- **Circuit Bloom** — a tile-turning logic puzzle. Rotate the paths to connect the seed to the flower.
- **Kite Keeper** — a breezy flying arcade game. Gather wind blooms and steer around clouds.
- **Firefly Maze** — explore a freshly generated garden maze, find three fireflies, and reach the gate.
- **Word Lanterns** — unscramble a little word with optional hints and no timer.
- **Pebble Pairs** — turn over garden keepsakes and remember where the matching pair is.
- **Cloud Shapes** — use row and column clues to reveal a small pixel picture.
- **Star Mapper** — connect numbered stars in order to trace three constellations.
- **Lily Hop** — cross a drifting stream by hopping between logs and collecting pearls.
- **Number Nook** — solve quick arithmetic puzzles before time or chances run out.
- **Patchwork Path** — slide an eight-tile patch back into number order.
- **Rune Riddle** — deduce a hidden four-symbol code from position and color clues.
- **Dewdrop Sort** — pour colors into matching bottles, with undo for the last move.
- **Pocket Putt** — aim and set the power of your shot on a tiny obstacle course.
- **Garden Type** — type a stream of nature words in a 45-second sprint.
- **Seed Shifter** — push seeds onto garden plots across three small Sokoban-style levels.
- **Swatch Sprint** — identify the ink color instead of the word in a quick reflex challenge.
- **Bounce Buddies** — rally a ball against a small computer-controlled paddle.
- **Sunbeam Seek** — search a garden using warmer and cooler clues to find a hidden seed.
- **Odd Acorn** — spot the one symbol that differs in a growing patch.
- **Petal Pop** — swap adjacent flowers to make matches and chain reactions.
- **Knight's Garden** — hop in the chess knight's L-shape to gather fireflies and find the gate.
- **Mosslight** — use adjacent-number clues to uncover safe garden patches and avoid hidden thorns.
- **Shut the Garden** — choose number tiles that add to the dice roll to close the board.
- **Clover Climber** — guess higher, lower, or same, and bank a card streak before it slips.
- **Hole Borough** — roam a large isometric city, swallow objects as you grow, and compete against four computer-controlled rival holes in classic, endless, and survival modes.
- **Cookie Kingdom** — click for cookies, buy fourteen kinds of production buildings, unlock over a hundred milestone upgrades, collect golden-cookie bonuses, and save progress in the current browser.
- **Planet Forge** — rotate a procedurally drawn planet, choose from eight worlds or a custom-named one, and leave persistent craters and fracture marks with six weapons. Add moons, zoom, undo, and reset damage.
- **Block Bloom** — drag or tap shapes onto an 8 × 8 board, clear rows and columns, use combo scoring, and play classic, timed, or hard mode. Best score and line statistics are saved in the browser.
- **Garden Chess** — play a full local match for two people sharing one device. Legal moves, check, checkmate, castling, en passant, promotion, undo, and reset are supported.

The site adapts to phones, tablets, Chromebooks, and desktop screens. It uses local system fonts and draws its illustrations in CSS or JavaScript, so it does not fetch resources from other sites. The two player experiences are local: Hole Borough uses computer rivals and Garden Chess is pass-and-play. There is no online multiplayer server. Planet Forge uses a software-rendered canvas globe with lasting surface marks and animated fragments; it is not a 3D mesh or physical planet simulation. The project does not use a proxy, VPN, alternate DNS, or other way around network rules.

## Preview it on your own computer

1. Open `index.html` in a current browser, or place the whole folder on a basic local web server.
2. Use the search box to find a game by name or mood, then select its card to play. Press **Escape** or the back button to close it.
3. In Hole Borough, choose a mode and use **WASD** to steer. In Block Bloom, drag a piece onto the board or select it and tap where it should start. In Garden Chess, both players use the same board.

No install, package manager, or account is needed to preview the files.

## Choose an approved place to publish

Ask the school's IT staff which static hosting service and web address are allowed for student or classroom projects. The school may provide its own web space. If it does, use that service and the upload instructions they provide.

GitHub Pages is included below as an example for schools that approve GitHub Pages and its `github.io` web addresses. **Do not publish there if the school blocks or disallows it.** Use the school's approved host and address instead. This project is plain static files, so it can be moved between ordinary static hosts without changing the games.

## Publish with GitHub Pages, if approved

1. Confirm with the school that GitHub Pages, the `github.com` site for managing the files, and the resulting `github.io` address are permitted on school computers. Confirm that you are allowed to publish this project publicly. GitHub Pages sites are public on the internet; with a free GitHub account, the source repository also needs to be public. Do not upload private student or school information.
2. Sign in to GitHub, create a repository for the project, and upload `index.html`, `styles.css`, `games.js`, `advanced-games.js`, and `README.md` to the repository's top level.
3. In the repository, open **Settings → Pages**. Under the build and deployment settings, choose **Deploy from a branch**, select the `main` branch and the `/ (root)` folder, then save.
4. Wait for the Pages status to show the published address. Open it on a device and network where that address is allowed, then check that all 31 games start and respond to their controls.
5. Share the published address with students only if the school permits it.

GitHub's menu labels can change. If they do, use the [current GitHub Pages instructions for publishing from a branch](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site). The project itself does not need compiling or bundling.

## Use a school-provided host

If the school provides web hosting, upload all five project files to the folder or service IT specifies. Keep `index.html`, `styles.css`, `games.js`, and `advanced-games.js` together in the same published folder. The web address should be the one issued or approved by the school. If IT provides a custom domain, follow their DNS and hosting instructions; do not change domain or network settings to work around a block.

## If the page does not open at school

Check the address with the school's IT staff. A school network may block a hosting service even when the page itself is allowed. Ask IT which approved host or domain to use, then publish the same files there. Do not use a proxy or another network workaround.

## Project files

- `index.html` — page structure and game launch dialogs
- `styles.css` — responsive visual design, game illustrations, and game layout
- `games.js` — game rules, controls, and rendering
- `advanced-games.js` — the city arena, incremental bakery, planet sandbox, block puzzle, and chess
- `README.md` — this setup and publishing guide
