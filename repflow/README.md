# Repflow

A static, installable workout runner built for GitHub Pages. There is no build step and no package installation.

## Run locally

Serve this directory over HTTP, for example:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish on GitHub Pages

1. Push these files to a GitHub repository.
2. Open **Settings → Pages** in the repository.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the branch and `/ (root)`, then save.

GitHub Pages supplies HTTPS, which enables installation and the offline service worker. On iPhone, open the published page in Safari, tap **Share**, then **Add to Home Screen**.

## Programs and routine JSON

Programs organize multiple routines. The default **Week 1–12** program contains the three bundled routines and expands from the homepage.

The JSON importer adds a routine to that program. Each exercise uses either `reps` or `durationSeconds`:

```json
{
  "title": "Core Express",
  "description": "A short core session.",
  "restSeconds": 30,
  "exercises": [
    {
      "title": "Dead bug",
      "sets": 3,
      "reps": 10,
      "description": "Reps are per side. Keep the lower back down."
    },
    {
      "title": "Forearm plank",
      "sets": 3,
      "durationSeconds": 40,
      "restSeconds": 45
    }
  ]
}
```

The **Ask AI** tab in the app contains a complete, copyable prompt for generating compatible JSON.

The **Visual builder** tab can create routines without JSON. It supports exercise and YouTube routines, routine-level default rest, per-exercise rest overrides, rep- or timer-based exercises, and drag-and-drop exercise ordering. Use the pencil button on any routine card to edit it with the same builder.

A YouTube follow-along video can also be saved as a routine:

```json
{
  "title": "Follow-Along Mobility",
  "description": "A guided mobility session.",
  "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

YouTube routines open in a responsive embedded player. The routine finishes automatically when the video reaches its ended state.
An internet connection is required to load and play YouTube content.
