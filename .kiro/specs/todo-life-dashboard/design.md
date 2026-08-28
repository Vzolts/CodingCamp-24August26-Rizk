# Design Document: To-Do List Life Dashboard

## Overview

A fully static client-side web app (HTML/CSS/Vanilla JS). No server, no build tools, no external dependencies. All persistence uses `localStorage`. The codebase lives in three files: `index.html`, `css/style.css`, and `js/app.js`.

Architecture follows the **Namespace Object Pattern** — each feature is a plain JS object (module) with `init()` and private methods prefixed with `_`. Modules communicate by reading/writing shared state through `StorageService` and via the native DOM event system.

---

## Architecture

### Component Diagram

```text
index.html
  css/style.css        <- single stylesheet, CSS custom properties for theming
  js/app.js            <- all JS in one file, namespace modules
    StorageService     <- localStorage wrapper
    ThemeController    <- light/dark toggle
    ClockController    <- real-time clock + date
    GreetingController <- time-based greeting + custom name
    FocusTimer         <- 25-min countdown state machine
    TaskManager        <- CRUD tasks, sort, duplicate check
    QuickLinks         <- CRUD links, URL normalization
    App.init()         <- bootstraps all modules on DOMContentLoaded
```n
### LocalStorage Keys

| Key | Type | Description |
|---|---|---|
| `tld_theme` | `'light'|'dark'` | Active theme |
| `tld_username` | `string` | Custom greeting name |
| `tld_tasks` | `Task[]` | All tasks |
| `tld_sort` | `string` | Active sort criterion |
| `tld_links` | `QuickLink[]` | All quick links |

---

## Data Models

```js
// Task
{ id: string, text: string, completed: boolean, createdAt: string } // ISO 8601

// QuickLink
{ id: string, label: string, url: string } // url always starts with http(s)://
```n
---

## Key Algorithms

### Duplicate Task Check
```js
isDuplicate(text, excludeId) {
  const n = text.trim().toLowerCase();
  return tasks.some(t => t.id !== excludeId && t.text.trim().toLowerCase() === n);
}
```n
### Sort
```js
switch (sort) {
  case 'oldest':  copy.sort((a,b) => a.createdAt.localeCompare(b.createdAt)); break;
  case 'pending': copy.sort((a,b) => a.completed - b.completed); break;
  case 'az':      copy.sort((a,b) => a.text.localeCompare(b.text)); break;
  default:        copy.sort((a,b) => b.createdAt.localeCompare(a.createdAt)); // newest
}
```n
### URL Normalization
```js
if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
```n
### Timer State Machine
```text
IDLE  --[Start]--> RUNNING --[Stop]---> PAUSED --[Start]--> RUNNING
                       |                                
                   [tick=0]                             
                       v                               
                   COMPLETE <--[Reset]-- any state --> IDLE
```n
---

## CSS Architecture

Single `style.css` using CSS Custom Properties for theming. Theme swap = one attribute change on `<html data-theme>`.

```css
:root { /* light mode defaults */ }
[data-theme='dark'] { /* dark mode overrides */ }
```n
Layout uses CSS Grid (2 columns on desktop, 1 column on mobile via media query).

---

## File Structure

```text
project-root/
  index.html
  css/
    style.css
  js/
    app.js
  .kiro/
    specs/todo-life-dashboard/
      .config.kiro
      requirements.md
      design.md
      tasks.md
    steering/
      project-conventions.md
    settings/
      mcp.json
```n