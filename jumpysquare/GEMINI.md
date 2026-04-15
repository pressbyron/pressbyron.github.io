# Gemini CLI Project Rules - Box Synergy Idle

This file contains foundational mandates for Gemini CLI when working on this project. These instructions take absolute precedence.

## Token Efficiency & Context Management
- **Surgical Edits:** Always use `replace` for file modifications. Never rewrite entire files unless they are new or extremely small (< 50 lines).
- **Split Files:** The project is split into `index.html`, `style.css`, and `game.js`. Only read the file(s) relevant to the current task.
- **Dry Responses:** Do not provide summaries, explanations of changes, or "I have finished" messages unless explicitly asked. Focus on intent before acting and validation after acting.
- **Minimize `read_file`:** Use `grep_search` to find specific code blocks. If you must read a file, use `start_line` and `end_line` to target the necessary section.

## Engineering Standards
- **Frameworks:** Vanilla HTML5, CSS3, and JavaScript only. No external libraries except for Google Fonts (via CDN).
- **Styling:** Use CSS variables defined in `:root`. Maintain the "Deep Dark Blue" aesthetic and tactile UI feel.
- **Persistence:** All game state must be saved to `localStorage` via the `saveGame` function.
- **Performance:** Keep the `gameLoop` efficient. Use `requestAnimationFrame`.
- **Naming:** Follow the existing `camelCase` for JavaScript and `kebab-case` for CSS classes.

## Workflow
1. **Research:** Target specific functions or CSS rules.
2. **Strategy:** State the planned change in one sentence.
3. **Execution:** Apply surgical `replace` calls.
4. **Validation:** Ensure no syntax errors and that the game still runs.