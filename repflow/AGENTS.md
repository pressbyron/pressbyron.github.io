# AGENTS.md

## Project overview

Repflow is a static, installable workout application designed for GitHub Pages. It has no build step, package manager, server-side code, or framework.

The application lets users:

- Organize workout routines inside expandable training programs.
- Import workout routines as JSON and store the library locally in the browser.
- Run rep-based and time-based exercises.
- Run a YouTube follow-along video as an entire routine.
- Move through timed rest periods between sets.
- See workout progress and the next set at all times.
- Copy an AI prompt that generates compatible routine JSON.
- Install the site as a PWA, including on the iOS home screen.

## Important files

- `index.html`: Application markup, views, dialogs, metadata, and CDN references.
- `styles.css`: Complete responsive visual system and animations.
- `app.js`: Program/routine storage, migration, validation, UI rendering, workout state machine, timers, sounds, wake lock, and installation flow.
- `manifest.webmanifest`: PWA metadata and icon declarations.
- `sw.js`: Offline application-shell cache.
- `assets/`: PWA, favicon, and Apple touch icons.
- `README.md`: User-facing local development and deployment instructions.

SortableJS `1.15.7` is loaded from jsDelivr for touch-friendly exercise ordering in the visual builder. The rest of the builder must remain usable if that CDN script is unavailable; only drag reordering may degrade.

## Development constraints

- Keep the project directly deployable to GitHub Pages.
- Do not introduce a required build step or server runtime.
- Do not add npm dependencies unless the project direction explicitly changes.
- Browser dependencies should be loaded from a CDN.
- Keep local URLs relative so project pages work below a repository subpath.
- PWA icons and application files remain local because they must be available to the manifest and offline cache.
- Do not rely on API keys, secrets, or environment variables in client-side code.
- User programs and routines must remain private to their browser unless an explicit synchronization feature is added.

## Program and routine schema

Programs are internal library groups with this shape:

```json
{
  "id": "week-1-12",
  "title": "Week 1–12",
  "description": "Program summary",
  "routines": []
}
```

The user-facing JSON importer accepts individual routines, not a program wrapper. Exercise routines use this structure:

```json
{
  "title": "Routine name",
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

YouTube routines use this alternative structure:

```json
{
  "title": "Follow-Along Mobility",
  "description": "A guided mobility session.",
  "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

Schema rules:

- An exercise routine requires a non-empty `title` and at least one exercise.
- A YouTube routine requires a valid YouTube `youtubeUrl` and must not contain `exercises`.
- Exercise and YouTube routine shapes are mutually exclusive.
- Every exercise requires a non-empty `title` and positive integer `sets`.
- Every exercise must contain exactly one of `reps` or `durationSeconds`.
- `reps`, `durationSeconds`, and `restSeconds` must be positive whole numbers.
- Exercise-level `restSeconds` overrides the routine default.
- Descriptions are optional strings.

If the schema changes, update all of the following together:

1. `validateRoutine()` in `app.js`.
2. `normalizeRoutine()` in `app.js`.
3. `EXAMPLE_PROGRAM` in `app.js`.
4. `AI_PROMPT` in `app.js`.
5. The schema example in `README.md`.
6. This document.

## Visual routine builder

The visual builder and JSON importer both produce the same routine object and pass it through `validateRoutine()` and `normalizeRoutine()`. `editingRoutineId` distinguishes create from edit. Editing must preserve the existing routine ID and `lastCompletedAt` timestamp.

Exercise editor rows are read in their current DOM order when saved. SortableJS reorders those DOM nodes using `.drag-handle`; do not maintain a second order array that can drift from the visible sequence. The builder supports:

- Exercise and YouTube routine types.
- Routine title and optional description.
- Routine-level default rest.
- Exercise title, sets, repetitions or duration, optional cue, and optional rest override.
- Adding, removing, and reordering exercises.

## Workout state machine

The active workout is held in the `workout` object in `app.js`.

YouTube routines use the separate `videoSession` state. Render the iframe directly before loading the YouTube IFrame API so playback is not gated by the API script in iOS standalone mode. The API attaches to that existing iframe, and `YT.PlayerState.ENDED` must call `completeVideoProgram()`. If the event API cannot load, retain playback and expose the manual finish fallback. Destroy the player or iframe when the video completes or the user exits so audio and playback cannot continue in the background.

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

The hierarchical program library is stored in `localStorage` under:

```text
repflow-library-v2
```

The old flat `repflow-programs-v1` array is a read-only migration source. Its entries are converted into routines inside the **Week 1–12** program without losing IDs or completion history.

`dedupeRoutines()` runs during migration and every library load. Video routines are identified by YouTube video ID; exercise routines are identified by normalized title. Keep the first routine ID and preserve the newest `lastCompletedAt` value when merging duplicates.

The internal optional `lastCompletedAt` ISO timestamp is persisted with each routine and displayed as relative calendar days. A set-based routine earns completion once completed sets reach at least 90% of total sets. A video earns completion once the IFrame API reports playback at or beyond 90% of its duration; an ended or explicitly manually finished video also earns completion.

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

- A program expands to show its routines.
- A rep-based routine can complete all sets.
- A timed exercise can start, pause, resume, and finish.
- A rest timer can pause and skip.
- A YouTube URL imports successfully and its ended event reaches the finish screen.
- The next-up card is correct across exercise boundaries.
- Progress reaches the finish screen without an extra or missing set.
- Valid JSON imports successfully and invalid JSON shows a helpful error.
- Stored programs, routines, and completion dates survive a reload.
- The layout remains usable at phone width.
- Every file listed in `APP_SHELL` exists.

## Deployment

The deployable artifact is the repository root. Push the static files and configure GitHub Pages to deploy from the selected branch at `/ (root)`. No compilation step is required.
