# Implementation Plan: To-Do List Life Dashboard

## Overview

All tasks implemented in three files: `index.html`, `css/style.css`, `js/app.js`. No build tools, no test setup required.

---

## Tasks

- [x] 1. Project scaffold
  - Created `index.html`, `css/style.css`, `js/app.js`  
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. CSS — Custom properties and layout
  - CSS custom properties for light and dark theme
  - CSS Grid 2-column layout with responsive single column at 700px
  - Card styles, button styles, input styles, typography
  - _Requirements: 1.1, 10.1, 10.2_

- [x] 3. HTML structure
  - Header with clock, date, greeting, name edit UI, theme toggle
  - Focus Timer card (left column)
  - Quick Links card (left column)
  - Tasks card (right column, full height)
  - _Requirements: 4.1, 4.2, 6.1, 7.1, 9.1_

- [x] 4. StorageService module
  - `isAvailable()`, `get()`, `set()`, `remove()`  
  - Handles JSON parse errors and QuotaExceededError gracefully
  - All keys prefixed with `tld_`  
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 5. ThemeController module
  - Toggle light/dark via `data-theme` attribute on `<html>`  
  - Persists to `tld_theme` in LocalStorage
  - Default: light mode
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 6. ClockController module
  - Updates clock (HH:MM:SS) and date every second via `setInterval`  
  - Calls `GreetingController.updateGreeting()` on each tick
  - _Requirements: 4.1, 4.2_

- [x] 7. GreetingController module
  - Time-based greeting (Good Morning/Afternoon/Evening/Night)
  - Inline name editing with Save/Cancel, max 50 chars
  - Name persisted to `tld_username`  
  - _Requirements: 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 8. FocusTimer module
  - 25-minute countdown (1500 seconds), Start/Stop/Reset
  - `setInterval`-based tick, auto-stop at 00:00
  - Visual notification on completion (auto-hides after 5s)
  - Disabled button states enforced
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [x] 9. TaskManager module — CRUD
  - Add task (Enter or button), empty/whitespace rejection with error
  - Case-insensitive duplicate prevention
  - Click task text to enter inline edit mode
  - Checkbox to toggle complete (strikethrough when done)
  - Delete button per task
  - Task count display
  - Persisted to `tld_tasks`  
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10, 7.11_

- [x] 10. TaskManager module — Sort
  - Sort dropdown: Newest first, Oldest first, Pending first, A-Z
  - Sort applied on render without mutating source array
  - Preference persisted to `tld_sort`  
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 11. QuickLinks module
  - Add link with name + URL, auto-prepend https://
  - Validation: empty name or URL rejected with error
  - Links rendered as chips, open in new tab (noopener)
  - Delete button per link chip
  - Persisted to `tld_links`  
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8_

- [x] 12. App.init() wiring
  - Initialises all modules on `DOMContentLoaded` in correct dependency order
  - _Requirements: 1.4_

---

## Notes

- All tasks are complete. Open `index.html` directly in any modern browser.
- No test setup required per NFR-1.
- `crypto.randomUUID()` used for IDs with fallback for older browsers.
