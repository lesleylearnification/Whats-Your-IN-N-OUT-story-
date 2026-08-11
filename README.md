# What's Your IN-N-OUT Story? — V3 Polished Playable Prototype

**Tagline:** Hit the road back to something good.

## What changed from V1

V2 is rebuilt around exploration rather than a linear questionnaire.

- Playable car avatar
- WASD + Arrow Key driving
- Touch driving controls
- Smooth acceleration, deceleration, steering direction, dust feedback
- Nonlinear explorable road-trip map
- Large environmental destinations instead of a five-step menu
- Dynamic road-trip narrator at the top of the screen
- Historical/cultural discoveries written as discoveries, not marketing prompts
- Five hidden Fan Finds separate from major discoveries
- Growing Road Bag of moments and memories
- Final postcard editor
- Drag/reposition postcard elements
- Custom story title
- Local PNG export
- Native browser Share support where available
- Responsive desktop, tablet, and mobile layouts

## Game goal

Create an amazing visual of your custom In-N-Out story, give it a title, and share it.

## Learning objective

The player will create a unique In-N-Out story that expresses what being an In-N-Out fan means to them.

## Archetypal structure

- Player: Explorer
- World: Innocent
- Treasure: nostalgia, memories, history, fan culture
- Final artifact: Creator expression through the postcard

## Core loop

DRIVE → SPOT → EXPLORE → DISCOVER → REMEMBER → COLLECT → CREATE → SHARE

## Run locally

Open `index.html` in a modern browser.

For the most reliable PNG export and share behavior, run a local server:

```bash
python -m http.server 8000
```

Then open:

`http://localhost:8000`

## GitHub Pages

Upload the contents of this folder to the root of a GitHub repository and enable GitHub Pages from the main branch/root.

## Prototype note

This is an independent portfolio prototype inspired by In-N-Out's public brand history and fan culture. It is not affiliated with or endorsed by In-N-Out Burger. The V2 illustration system uses locally created vector art rather than depending on external runtime assets, so the prototype remains portable and stable on GitHub Pages.

## V3 changes
- Top-down car avatar, so rotation reads correctly in every direction.
- Contact-driven landmarks: drive into a destination to trigger it.
- Contact-driven hidden Fan Finds.
- Five small In-N-Out roadside stops with funny facts.
- Richer California travel-poster visual treatment.
- Postcard palette adjusted to match the main game.
- Approved visual references included for future iteration.


## V4 fixes
- The approved polished scenic art is now the actual playable map backdrop rather than a separate reference.
- The final postcard uses the same visual world as the main game.
- WASD and arrow-key movement is completely disabled whenever an input, textarea, select, or contenteditable field has focus.
- Entering a writing field clears movement velocity so the car cannot drift while the player types.
- Opening discovery, Fan Find, and postcard dialogs pauses driving.
- PNG export now uses the polished postcard scenic base.
