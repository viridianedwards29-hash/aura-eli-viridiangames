# Aura Eli/Viridiangames

Thirty-nine browser games: 32 original mini-games plus seven complete games from their original creators, bundled locally for this site. The arcade has no build step, server code, accounts, or runtime dependency on another game website. Game source and license notices are kept in the `games/` folders.

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
- **Meme Machine** — fire eighteen funny sound pads: six locally bundled CC0 voice clips and twelve original browser-synthesized effects. Sound starts off and only plays when enabled.

### Self-hosted original games

- **2048** — the official game by Gabriele Cirulli. Slide and merge equal number tiles. MIT license. [Original source](https://github.com/gabrielecirulli/2048).
- **Hextris** — the original fast-paced hexagonal block puzzle by Logan Engstrom, Garrett Finucane, Noah Moroze, and Michael Yang. GPL-3.0. [Original source](https://github.com/Hextris/hextris).
- **A Dark Room** — the minimalist survival adventure by Doublespeak Games. MPL-2.0. Background music is disabled in this arcade edition. [Original source](https://github.com/doublespeakgames/adarkroom).
- **Particle Clicker** — CERN Webfest’s science-themed idle game. MIT license; required libraries are included locally. [Original source](https://github.com/particle-clicker/particle-clicker).
- **Green Mahjong** — Daniel and Karin Beck’s solitaire Mahjong. GPLv3 code and original attribution are included. Its artwork is CC-BY-NC, so keep this free of ads and commercial use. [Original source](https://github.com/danbeck/green-mahjong).
- **Chrome Dino** — the original Chromium T-Rex runner, extracted and packaged by wayou. BSD-3-Clause. [Original source](https://github.com/wayou/t-rex-runner).
- **Solitaire** — a local collection of Klondike, FreeCell, and Spider by Braden. MIT. [Original source](https://github.com/megahertzok/solitaire).
- **Sound clips** — six silly recorded effects by EZduzziteh, released under CC0 and stored in `games/soundboard/sfx/`. See [SOUNDS-CREDITS.md](games/soundboard/SOUNDS-CREDITS.md).

These seven cards open local folders on this same site; play does not send you to another game website. The soundboard audio is also stored locally. Source credit and license notices are included with each project; Green Mahjong's artwork requires noncommercial use.

The site adapts to phones, tablets, Chromebooks, and desktop screens. The seven added games use included images, scripts, stylesheets, audio, and required libraries instead of remote game hosts or CDNs. Chrome Dino and the Solitaire collection are the original games, not imitations. The two player experiences are local: Hole Borough uses computer rivals and Garden Chess is pass-and-play. There is no online multiplayer server. Planet Forge uses a software-rendered canvas globe with lasting surface marks and animated fragments; it is not a 3D mesh or physical planet simulation. The project does not use a proxy, VPN, alternate DNS, or other way around network rules.

## Preview it on your own computer

1. For a local preview, serve the whole folder with a basic local web server. Some imported games load their own local data files and do not work by opening `index.html` as a `file://` page.
2. Use the search box to find a game by name or mood. The original arcade cards open inside the page; the seven bundled titles open their game folder in a new tab on the same site.
3. In Hole Borough, choose a mode and use **WASD** to steer. In Block Bloom, drag a piece onto the board or select it and tap where it should start. In Garden Chess, both players use the same board.

No install, package manager, or account is needed to preview the files.

## Choose an approved place to publish

Ask the school's IT staff which static hosting service and web address are allowed for student or classroom projects. The school may provide its own web space. If it does, use that service and the upload instructions they provide.

GitHub Pages is included below as an example for schools that approve GitHub Pages and its `github.io` web addresses. **Do not publish there if the school blocks or disallows it.** Use the school's approved host and address instead. This project is plain static files, so it can be moved between ordinary static hosts without changing the games.

## Publish with GitHub Pages, if approved

1. Confirm with the school that GitHub Pages, the `github.com` site for managing the files, and the resulting `github.io` address are permitted on school computers. Confirm that you are allowed to publish this project publicly. GitHub Pages sites are public on the internet; with a free GitHub account, the source repository also needs to be public. Do not upload private student or school information.
2. For this project's existing GitHub Pages setup, upload the refreshed arcade ZIP to the same repository. The existing Pages workflow unpacks that ZIP and republishes the site at its current address. Wait for the latest **Actions → Publish arcade site to GitHub Pages** run to finish successfully.
3. For a new repository instead, upload all project files, preserving the `games/` folder structure, then follow GitHub's current Pages instructions to publish the static files.
4. Open the published address on a device and network where it is allowed, then check that all 39 cards appear and the games you want to use open correctly.
5. Share the published address with students only if the school permits it.

GitHub's menu labels can change. If they do, use the [current GitHub Pages instructions for publishing from a branch](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site). The project itself does not need compiling or bundling.

## Use a school-provided host

If the school provides web hosting, upload the complete project while preserving its folders. Keep `index.html`, `styles.css`, `games.js`, and `advanced-games.js` together at the published root, with every file inside `games/` in its matching subfolder. The web address should be the one issued or approved by the school. If IT provides a custom domain, follow their DNS and hosting instructions; do not change domain or network settings to work around a block.

## If the page does not open at school

Check the address with the school's IT staff. A school network may block a hosting service even when the page itself is allowed. Ask IT which approved host or domain to use, then publish the same files there. Do not use a proxy or another network workaround.

## Project files

- `index.html` — page structure and game launch dialogs
- `styles.css` — responsive visual design, game illustrations, and game layout
- `games.js` — game rules, controls, and rendering
- `advanced-games.js` — the city arena, incremental bakery, planet sandbox, block puzzle, and chess
- `games/` — the seven locally bundled games, the soundboard clips and their CC0 source credit, with required assets and license notices
- `README.md` — this setup and publishing guide
