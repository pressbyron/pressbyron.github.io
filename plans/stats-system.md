// Tracking stats in constants or boxData
// We need to add totalIncome to each box in boxData, and logic to track it in game.js.

// 1. Update boxData in constants.js
// { ..., totalIncome: 0, bestJump: 0 }

// 2. Add trackIncome() in game.js to update income stats on every jump
// 3. Create stats-modal in index.html (or reuse existing)
// 4. Create renderStats(idx) in ui.js
