/* app.js - Life Dashboard */

const StorageService = {
  isAvailable() { try { localStorage.setItem('__t','1'); localStorage.removeItem('__t'); return true; } catch { return false; } },
  get(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return { ok: true }; } catch(e) { return { ok: false, error: e.message }; } },
  remove(key) { try { localStorage.removeItem(key); } catch {} }
};

const ThemeController = {
  _current: 'light',
  init() {
    this._current = StorageService.get('tld_theme') || 'light';
    this._apply(this._current);
    document.getElementById('theme-btn').addEventListener('click', () => this._toggle());
  },
  _apply(theme) {
    this._current = theme;
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('theme-btn');
    btn.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    StorageService.set('tld_theme', theme);
  },
  _toggle() { this._apply(this._current === 'dark' ? 'light' : 'dark'); }
};

const ClockController = {
  init() { this._tick(); setInterval(() => this._tick(), 1000); },
  _tick() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2,'0');
    const mm = String(now.getMinutes()).padStart(2,'0');
    const ss = String(now.getSeconds()).padStart(2,'0');
    document.getElementById('clock').textContent = hh + ':' + mm + ':' + ss;
    document.getElementById('date-display').textContent = now.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
    GreetingController.updateGreeting(now.getHours());
  }
};

const GreetingController = {
  _name: '',
  init() {
    this._name = StorageService.get('tld_username') || '';
    document.getElementById('edit-name-btn').addEventListener('click', () => this._enterEdit());
    document.getElementById('save-name-btn').addEventListener('click', () => this._saveName());
    document.getElementById('cancel-name-btn').addEventListener('click', () => this._cancelEdit());
    document.getElementById('name-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this._saveName();
      if (e.key === 'Escape') this._cancelEdit();
    });
  },
  updateGreeting(hour) {
    let g;
    if (hour < 12) g = 'Good Morning';
    else if (hour < 15) g = 'Good Afternoon';
    else if (hour < 18) g = 'Good Evening';
    else g = 'Good Night';
    const name = this._name.trim();
    document.getElementById('greeting-text').textContent = name ? g + ', ' + name + '!' : g + '!';
  },
  _enterEdit() {
    document.getElementById('name-input').value = this._name;
    document.getElementById('name-edit-row').classList.remove('hidden');
    document.getElementById('name-input').focus();
  },
  _saveName() {
    const val = document.getElementById('name-input').value.trim().slice(0,50);
    this._name = val;
    StorageService.set('tld_username', val);
    this._cancelEdit();
    this.updateGreeting(new Date().getHours());
  },
  _cancelEdit() { document.getElementById('name-edit-row').classList.add('hidden'); }
};

const FocusTimer = {
  _secondsLeft: 1500, _isRunning: false, _intervalId: null,
  init() {
    this._render(); this._updateBtns();
    document.getElementById('btn-start').addEventListener('click', () => this._start());
    document.getElementById('btn-stop').addEventListener('click', () => this._stop());
    document.getElementById('btn-reset').addEventListener('click', () => this._reset());
  },
  _fmt(s) { return String(Math.floor(s/60)).padStart(2,'0') + ':' + String(s%60).padStart(2,'0'); },
  _render() { document.getElementById('timer-display').textContent = this._fmt(this._secondsLeft); },
  _start() {
    if (this._isRunning) return;
    this._isRunning = true;
    this._intervalId = setInterval(() => this._tick(), 1000);
    this._updateBtns();
  },
  _stop() {
    if (!this._isRunning) return;
    clearInterval(this._intervalId); this._isRunning = false; this._updateBtns();
  },
  _reset() {
    clearInterval(this._intervalId);
    this._secondsLeft = 1500; this._isRunning = false; this._intervalId = null;
    this._render(); this._updateBtns();
    document.getElementById('timer-done').classList.add('hidden');
  },
  _tick() {
    this._secondsLeft--;
    this._render();
    if (this._secondsLeft <= 0) {
      clearInterval(this._intervalId); this._isRunning = false;
      this._updateBtns(); this._notify();
    }
  },
  _notify() {
    const el = document.getElementById('timer-done');
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 5000);
  },
  _updateBtns() {
    document.getElementById('btn-start').disabled = this._isRunning;
    document.getElementById('btn-stop').disabled  = !this._isRunning;
  }
};

const TaskManager = {
  _tasks: [], _sort: 'newest',
  init() {
    this._tasks = StorageService.get('tld_tasks') || [];
    this._sort  = StorageService.get('tld_sort')  || 'newest';
    document.getElementById('sort-select').value = this._sort;
    document.getElementById('btn-add-task').addEventListener('click', () => this._add());
    document.getElementById('task-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') this._add(); });
    document.getElementById('sort-select').addEventListener('change', (e) => {
      this._sort = e.target.value; StorageService.set('tld_sort', this._sort); this._render();
    });
    this._render();
  },
  _genId() { return (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2); },
  _isDuplicate(text, excludeId) {
    const n = text.trim().toLowerCase();
    return this._tasks.some(t => t.id !== excludeId && t.text.trim().toLowerCase() === n);
  },
  _showError(msg) {
    const el = document.getElementById('task-error');
    el.textContent = msg; el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 3000);
  },
  _add() {
    const input = document.getElementById('task-input');
    const text = input.value.trim();
    if (!text) { this._showError('Task cannot be empty.'); return; }
    if (this._isDuplicate(text)) { this._showError('This task already exists.'); return; }
    this._tasks.push({ id: this._genId(), text, completed: false, createdAt: new Date().toISOString() });
    this._save(); input.value = ''; this._render();
  },
  _delete(id) { this._tasks = this._tasks.filter(t => t.id !== id); this._save(); this._render(); },
  _toggle(id) {
    const t = this._tasks.find(t => t.id === id);
    if (t) { t.completed = !t.completed; this._save(); this._render(); }
  },
  _startEdit(id, li) {
    const t = this._tasks.find(t => t.id === id); if (!t) return;
    const span = li.querySelector('.task-text');
    const inp = document.createElement('input');
    inp.type = 'text'; inp.value = t.text; inp.className = 'task-edit-input'; inp.maxLength = 200;
    span.replaceWith(inp); inp.focus();
    const finish = () => {
      const val = inp.value.trim();
      if (val && val.toLowerCase() !== t.text.trim().toLowerCase() && this._isDuplicate(val, id)) {
        this._showError('Duplicate task name.'); inp.focus(); return;
      }
      if (val) { t.text = val; this._save(); }
      this._render();
    };
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') finish(); if (e.key === 'Escape') this._render(); });
    inp.addEventListener('blur', finish);
  },
  _sorted() {
    const copy = [...this._tasks];
    switch (this._sort) {
      case 'oldest':  return copy.sort((a,b) => a.createdAt.localeCompare(b.createdAt));
      case 'pending': return copy.sort((a,b) => a.completed - b.completed);
      case 'az':      return copy.sort((a,b) => a.text.localeCompare(b.text));
      default:        return copy.sort((a,b) => b.createdAt.localeCompare(a.createdAt));
    }
  },
  _render() {
    const list = document.getElementById('task-list');
    const empty = document.getElementById('task-empty');
    list.innerHTML = '';
    const sorted = this._sorted();
    if (sorted.length === 0) { empty.classList.remove('hidden'); }
    else { empty.classList.add('hidden'); sorted.forEach(t => list.appendChild(this._makeItem(t))); }
    const pending = this._tasks.filter(t => !t.completed).length;
    document.getElementById('task-count').textContent = pending + (pending === 1 ? ' task left' : ' tasks left');
  },
  _makeItem(t) {
    const li = document.createElement('li');
    li.className = 'task-item'; li.dataset.id = t.id;
    const cb = document.createElement('input');
    cb.type = 'checkbox'; cb.className = 'task-checkbox'; cb.checked = t.completed;
    cb.setAttribute('aria-label', 'Mark done: ' + t.text);
    cb.addEventListener('change', () => this._toggle(t.id));
    const span = document.createElement('span');
    span.className = 'task-text' + (t.completed ? ' done' : '');
    span.textContent = t.text; span.title = 'Click to edit';
    span.addEventListener('click', () => this._startEdit(t.id, li));
    const grp = document.createElement('div');
    grp.className = 'task-btn-group';
    const del = document.createElement('button');
    del.className = 'btn btn-danger btn-sm'; del.textContent = 'Delete';
    del.setAttribute('aria-label', 'Delete: ' + t.text);
    del.addEventListener('click', () => this._delete(t.id));
    grp.appendChild(del); li.appendChild(cb); li.appendChild(span); li.appendChild(grp);
    return li;
  },
  _save() { StorageService.set('tld_tasks', this._tasks); }
};

const QuickLinks = {
  _links: [],
  init() {
    this._links = StorageService.get('tld_links') || [];
    document.getElementById('btn-add-link').addEventListener('click', () => this._add());
    document.getElementById('link-url').addEventListener('keydown', (e) => { if (e.key === 'Enter') this._add(); });
    this._render();
  },
  _genId() { return (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2); },
  _normalize(url) { url = url.trim(); if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url; return url; },
  _showError(msg) {
    const el = document.getElementById('link-error');
    el.textContent = msg; el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 3000);
  },
  _add() {
    const label = document.getElementById('link-name').value.trim();
    const rawUrl = document.getElementById('link-url').value.trim();
    if (!label) { this._showError('Please enter a link name.'); return; }
    if (label.length > 100) { this._showError('Name too long (max 100).'); return; }
    if (!rawUrl) { this._showError('Please enter a URL.'); return; }
    if (this._links.length >= 50) { this._showError('Maximum 50 links reached.'); return; }
    const url = this._normalize(rawUrl);
    this._links.push({ id: this._genId(), label, url });
    StorageService.set('tld_links', this._links);
    document.getElementById('link-name').value = '';
    document.getElementById('link-url').value = '';
    this._render();
  },
  _delete(id) { this._links = this._links.filter(l => l.id !== id); StorageService.set('tld_links', this._links); this._render(); },
  _render() {
    const container = document.getElementById('links-container');
    const empty = document.getElementById('links-empty');
    container.innerHTML = '';
    if (this._links.length === 0) { empty.classList.remove('hidden'); container.appendChild(empty); return; }
    empty.classList.add('hidden');
    this._links.forEach(l => {
      const chip = document.createElement('a');
      chip.className = 'link-chip'; chip.href = l.url; chip.target = '_blank'; chip.rel = 'noopener noreferrer';
      const lbl = l.label.length > 30 ? l.label.slice(0,30) + '...' : l.label;
      chip.appendChild(document.createTextNode(lbl));
      const del = document.createElement('button');
      del.className = 'link-chip-del'; del.textContent = 'x';
      del.setAttribute('aria-label', 'Delete link: ' + l.label);
      del.addEventListener('click', (e) => { e.preventDefault(); this._delete(l.id); });
      chip.appendChild(del); container.appendChild(chip);
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ThemeController.init();
  ClockController.init();
  GreetingController.init();
  FocusTimer.init();
  TaskManager.init();
  QuickLinks.init();
});
