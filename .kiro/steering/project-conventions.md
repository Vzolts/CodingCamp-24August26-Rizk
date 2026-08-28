---
inclusion: auto
---

# Project Conventions: Life Dashboard

## Tech Stack

- HTML5, CSS3, Vanilla JavaScript (ES2020+)
- No frameworks, no libraries, no build tools
- Browser LocalStorage for all persistence

## File Structure Rules

- Exactly ONE CSS file: `css/style.css`  
- Exactly ONE JS file: `js/app.js`  
- Entry point: `index.html` at project root

## Coding Style

- Use **namespace object pattern** for modules (e.g. `const ThemeController = { init() {}, _private() {} }`)
- Private methods prefixed with `_`  
- All LocalStorage keys prefixed with `tld_`  
- No `var` — use `const` and `let` only
- Arrow functions for callbacks
- `crypto.randomUUID()` for IDs (with `Date.now().toString(36)` fallback)

## CSS Conventions

- Theme variables defined as CSS Custom Properties in `:root` (light) and `[data-theme='dark']` (dark)
- Layout: CSS Grid for main 2-column layout, Flexbox for card internals
- Responsive breakpoint: `700px` — switch to single column
- BEM-light naming: `.card`, `.card-title`, `.task-item`, `.link-chip`, etc.

## Features Checklist

- [x] Real-time clock (HH:MM:SS) and date
- [x] Time-based greeting (Morning/Afternoon/Evening/Night)
- [x] Custom name in greeting (LocalStorage)
- [x] Light/Dark mode toggle (LocalStorage)
- [x] Focus Timer 25 min — Start/Stop/Reset
- [x] Tasks — Add, Edit (inline), Complete, Delete
- [x] Duplicate task prevention (case-insensitive)
- [x] Sort tasks (Newest, Oldest, Pending first, A-Z)
- [x] Quick Links — Add, Open (new tab), Delete
- [x] All data persisted in LocalStorage
