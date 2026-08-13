# AGENTS.md

## Project overview

Repflow is a static, installable workout application designed for GitHub Pages. It has no build step, package manager, server-side code, or framework.

The application lets users:

- Import workout programs as JSON.
- Store programs locally in the browser.
- Run rep-based and time-based exercises.
- Run a YouTube follow-along video as an entire program.
- Move through timed rest periods between sets.
- See workout progress and the next set at all times.
- Copy an AI prompt that generates compatible program JSON.
- Install the site as a PWA, including on the iOS home screen.

## Important files

- `index.html`: Application markup, views, dialogs, metadata, and CDN references.
- `styles.css`: Complete responsive visual system and animations.
- `app.js`: Program storage, validation, UI rendering, workout state machine, timers, sounds, wake lock, and installation flow.
- `manifest.webmanifest`: PWA metadata and icon declarations.
- `sw.js`: Offline application-shell cache.
- `assets/`: PWA, favicon, and Apple touch icons.
- `README.md`: User-facing local development and deployment instructions.

## Development constraints

- Keep the project directly deployable to GitHub Pages.
- Do not introduce a required build step or server runtime.
- Do not add npm dependencies unless the project direction explicitly changes.
- Browser dependencies should be loaded from a CDN.
- Keep local URLs relative so project pages work below a repository subpath.
- PWA icons and application files remain local because they must be available to the manifest and offline cache.
- Do not rely on API keys, secrets, or environment variables in client-side code.
- User programs must remain private to their browser unless an explicit synchronization feature is added.

## Program JSON schema

Exercise programs use this structure:

```json
{
  "title": "Program name",
  "description": "Optional summary",
  "restSeconds": 30,
  "exercises": [
    {
      "title": "Push ups",
      "sets": 3,
      "reps": 12,
      "description": "Optional form cue",
      "restSeconds": 40
    },
    {
      "title": "Forearm plank",
      "sets": 3,
      "durationSeconds": 45
    }
  ]
}
```

YouTube programs use this alternative structure:

```json
{
  "title": "Follow-Along Mobility",
  "description": "A guided mobility session.",
  "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

Schema rules:

- An exercise program requires a non-empty `title` and at least one exercise.
- A YouTube program requires a valid YouTube `youtubeUrl` and must not contain `exercises`.
- Exercise and YouTube program shapes are mutually exclusive.
- Every exercise requires a non-empty `title` and positive integer `sets`.
- Every exercise must contain exactly one of `reps` or `durationSeconds`.
- `reps`, `durationSeconds`, and `restSeconds` must be positive whole numbers.
- Exercise-level `restSeconds` overrides the program default.
- Descriptions are optional strings.

If the schema changes, update all of the following together:

1. `validateProgram()` in `app.js`.
2. `normalizeProgram()` in `app.js`.
3. `EXAMPLE_PROGRAM` in `app.js`.
4. `AI_PROMPT` in `app.js`.
5. The schema example in `README.md`.
6. This document.

## Workout state machine

The active workout is held in the `workout` object in `app.js`.

YouTube programs use the separate `videoSession` state. Render the iframe directly before loading the YouTube IFrame API so playback is not gated by the API script in iOS standalone mode. The API attaches to that existing iframe, and `YT.PlayerState.ENDED` must call `completeVideoProgram()`. If the event API cannot load, retain playback and expose the manual finish fallback. Destroy the player or iframe when the video completes or the user exits so audio and playback cannot continue in the background.

The two main phases are:

- `work`: Shows repetitions or runs an exercise timer.
- `rest`: Runs automatically after a completed set when another set remains.

The standard transition is:

```text
work set → rest timer → next work set → … → finish view
```

Important behavior to preserve:

- Rep sets advance when the user presses **Complete set**.
- Timed sets advance automatically when their timer reaches zero.
- Rest timers begin automatically and can be paused or skipped.
- Exercise and rest timers play one short cue at 5, 4, 3, 2, and 1 seconds, then a longer cue at zero unless muted.
- `lastBeepSecond` prevents the interval loop from playing the same countdown cue more than once.
- Every timed exercise set enters a fixed three-second `setup` phase before its work timer begins. Pausing and resuming the work timer must not repeat setup; `workTimerStarted` tracks that distinction.
- `nextTarget` identifies the set that follows the current rest phase.
- “Next up” must remain populated during both work and rest.
- Progress represents completed sets, not merely the current exercise index.
- Starting or ending a workout should acquire or release the screen wake lock when supported.
- Every active interval must be cleared before leaving or changing timer phases.

## UI conventions

- Use semantic HTML and preserve accessible labels on icon-only controls.
- Insert user-provided content using `textContent`; do not inject unsanitized JSON values with `innerHTML`.
- Keep touch targets at least approximately 44 × 44 pixels.
- Respect `prefers-reduced-motion`.
- Test narrow mobile layouts as the primary workout experience is phone-oriented.
- Preserve safe-area handling for installed iOS devices.
- Use the existing color, spacing, typography, and animation tokens in `styles.css` before adding new ones.

## Persistence

Programs are stored in `localStorage` under:

```text
repflow-programs-v1
```

Changing the stored representation should include a migration or a new versioned key. Do not silently make existing stored programs unreadable.

## PWA and offline behavior

- GitHub Pages provides the HTTPS context required for service workers and installation.
- Keep `start_url` and `scope` relative in `manifest.webmanifest`.
- Add new essential local files to `APP_SHELL` in `sw.js`.
- Increment `CACHE_NAME` in `sw.js` when cached production assets change materially.
- Do not place cross-origin CDN resources in the required `cache.addAll()` list; a CDN failure must not prevent service-worker installation.
- Do not intercept cross-origin requests in the service worker. YouTube playback and CDN resources require the network and should retain their native error behavior.
- The app should remain functional if CDN fonts or icons are unavailable, even if the presentation is less polished.

## Verification

Run these checks after changing JavaScript, the manifest, or cached assets:

```sh
node --check app.js
node --check sw.js
python3 -m json.tool manifest.webmanifest >/dev/null
```

Serve the repository instead of opening `index.html` directly when testing PWA behavior:

```sh
python3 -m http.server 8000
```

Before handing off a change, verify at minimum:

- A rep-based program can complete all sets.
- A timed exercise can start, pause, resume, and finish.
- A rest timer can pause and skip.
- A YouTube URL imports successfully and its ended event reaches the finish screen.
- The next-up card is correct across exercise boundaries.
- Progress reaches the finish screen without an extra or missing set.
- Valid JSON imports successfully and invalid JSON shows a helpful error.
- Stored programs survive a reload.
- The layout remains usable at phone width.
- Every file listed in `APP_SHELL` exists.

## Deployment

The deployable artifact is the repository root. Push the static files and configure GitHub Pages to deploy from the selected branch at `/ (root)`. No compilation step is required.
