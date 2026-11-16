# VYGA.EXE — The Ultimate Birthday Experience 💜🎀

> **THE WORLD'S MOST QUESTIONABLE BIRTHDAY CELEBRATION.**  
> *Too iconic to be normal. Too ARMY to be ordinary.*

## Features
- **Hero — The Birthday Incident**: Animated 3D cake with blow-out candles, floating stickers, warning badges, and confetti explosion.
- **VNN Breaking News**: Live fake newsroom ticker, field reporter quotes, editorial illustrations, and expandable investigation reports.
- **The Vyga Roast Awards**: 8 interactive trophy reveals with hover tilt and acceptance speeches.
- **The Museum of Vyga**: Drag-and-drop photo scrapbook with inline caption editing, lightbox preview modal, and `localStorage` persistence.
- **Interactive Mini Games**:
  1. *How Well Do You Know Vyga?* (5-question personality quiz)
  2. *Catch the Birthday Cake* (7-second escalating reaction challenge)
  3. *Guess the Mystery* (multi-clue riddle game with secret reward)
- **Vyga's Purple Universe (BTS / ARMY Zone)**: Borahae Galaxy trigger, Official ARMY Member of the Year award, customizable BTS playlist with official YouTube/Spotify links, 7-star OT7 secret surprise, and purple confetti.
- **Secret Birthday Vault**: Password-locked digital vault (`"birthday"` by default) with unlock animation and reward reveal.
- **Birthday Countdown**: Configurable countdown timer with automatic Birthday Day detection and test preview mode.
- **Music & Celebration Controls**: User-activated Web Audio music-box melody, SFX, volume slider, custom music link launcher, and celebration triggers.
- **Final Birthday Letter & Final Surprise**: Paper-textured handwritten letter (editable) and `"ONE LAST THING FOR YOU 💗"` full-screen celebration finale.

## Easy Customization
Open `js/config.js` to edit any personal details in one place:
- `birthdayDate`: Set `month` (1–12), `day` (1–31), or `isBirthdayToday` override.
- `secretVault.correctAnswer`: Change the vault password (default: `"birthday"`).
- `photoMuseum`: Update default captions or add your own photo URLs.
- `btsPlaylist`: Customize playlist name and official BTS links.
- `birthdayLetter`: Update paragraphs or sign-off.
- `roastAwards`, `breakingNews`, and `miniGames`: Customize jokes, clues, and quiz options.

## Running Locally
Run any static file server from the project root:

```bash
python -m http.server 4173
```

Then open `http://localhost:4173` in your browser.
