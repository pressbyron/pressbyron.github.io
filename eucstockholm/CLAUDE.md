# EUC Stockholm – CLAUDE.md

Static event/booking page for EUC Stockholm, a team-building business running
electric unicycle experiences for companies in the Stockholm area.

## Stack

Pure static HTML/CSS/JS — no framework, no build step, no Node.
Deploy by pointing GitHub Pages at the repo root.

## Files

| File | Purpose |
|---|---|
| `index.html` | Single-page site, all sections in Swedish |
| `style.css` | All styling; CSS custom properties at the top of `:root` |
| `script.js` | Sticky nav, mobile menu, scroll animations, contact form |

## Common tasks

### Change the contact email

One place in `script.js`:
```js
const CONTACT_EMAIL = 'peter.jaaskelainen@gmail.com';
```
Update to the new address (e.g. `info@eucstockholm.com`) when ready.
There is also a matching `href` on the visible email link in `index.html`
inside `<div class="kontakt__info">` — update that too.

### Add gallery photos

In `index.html`, find the `<!-- GALLERY NOTE -->` comment inside `#galleri`.
Replace each `.gallery__item--placeholder` div with:
```html
<div class="gallery__item">
  <img src="photos/event1.jpg" alt="Deltagare på elhjul" loading="lazy" />
</div>
```
Put images in a `photos/` folder at the repo root. The CSS handles
object-fit and hover zoom automatically.

### Update the venue address

Search for `Älvsjö` in `index.html` — it appears in the hero badges,
the included-section checklist, the FAQ, and the contact info block.

### Change pricing

Search for `1 250` in `index.html` to find the price display.
The total range `7 500–9 000 kr` is just below it and should be
updated manually to match any new per-person price × group size.

## Business details

- **Price:** 1 250 SEK/person
- **Group size:** 4–6 people
- **Duration:** 2.5 hours
- **Included:** protective gear, soda & snacks, instructor
- **Location:** south of Stockholm (Älvsjö area) — TBD
- **Language:** Swedish throughout
- **Liability:** participants sign a waiver on arrival; brief disclaimer
  appears in the FAQ and below the contact form submit button
