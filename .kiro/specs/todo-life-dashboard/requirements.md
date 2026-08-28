# Requirements Document

## Introduction

To-Do List Life Dashboard is a static web application (HTML/CSS/Vanilla JS) that acts as a personal productivity dashboard. It displays real-time time and date, a Pomodoro-style focus timer, a task list, and quick links to favourite websites. All data is stored client-side using the browser's LocalStorage API. The UI uses a purple-to-blue gradient background with white card widgets and supports light/dark mode.

---

## Glossary

- **Dashboard**: The main application interface showing all widgets simultaneously.
- **Focus_Timer**: A 25-minute countdown widget for Pomodoro-style focus sessions.
- **Task_Manager**: Widget for managing tasks — add, edit, complete, delete.
- **Quick_Links**: Widget showing clickable buttons linking to favourite websites.
- **LocalStorage**: Browser client-side storage API used for all data persistence.
- **Theme_Controller**: Component managing light/dark mode switching.
- **Greeting_Controller**: Component managing time-based greeting and custom username.

---

## Requirements

---

### Requirement 1: Technology Stack

**User Story:** As a developer, I want the project to use only HTML, CSS, and Vanilla JavaScript so that it is lightweight and runs without a build step.

#### Acceptance Criteria

1. THE Dashboard SHALL be built using only HTML, CSS, and Vanilla JavaScript without any third-party frameworks or libraries.
2. THE Dashboard SHALL have exactly one CSS file located inside the `css/` folder.
3. THE Dashboard SHALL have exactly one JavaScript file located inside the `js/` folder.
4. THE Dashboard SHALL run directly in a modern browser by opening the HTML file without a backend server.
5. THE Dashboard SHALL work as a standalone web page or as a browser extension without code modification.

---

### Requirement 2: Browser Compatibility

**User Story:** As a user, I want the app to work in all major modern browsers.

#### Acceptance Criteria

1. THE Dashboard SHALL function fully in the latest 3 stable versions of Chrome.
2. THE Dashboard SHALL function fully in the latest 3 stable versions of Firefox.
3. THE Dashboard SHALL function fully in the latest 3 stable versions of Microsoft Edge.
4. THE Dashboard SHALL function fully in the latest 3 stable versions of Safari.
5. IF the browser does not support LocalStorage, THEN THE Dashboard SHALL show a warning message.

---

### Requirement 3: LocalStorage Data Persistence

**User Story:** As a user, I want my data saved automatically so it persists across page reloads.

#### Acceptance Criteria

1. THE Dashboard SHALL store all data (tasks, links, username, theme, sort preference) in LocalStorage.
2. WHEN the page loads, THE Dashboard SHALL restore all previously saved data from LocalStorage.
3. WHEN the user makes any change, THE Dashboard SHALL update LocalStorage immediately.

---

### Requirement 4: Header — Clock, Date, Greeting

**User Story:** As a user, I want to see the current time, date, and a contextual greeting on the dashboard.

#### Acceptance Criteria

1. THE Header SHALL display the current time in HH:MM:SS format, updated every second.
2. THE Header SHALL display the current date including weekday, day, month, and year.
3. WHEN the hour is 0–11, THE Greeting_Controller SHALL display `Good Morning`.
4. WHEN the hour is 12–14, THE Greeting_Controller SHALL display `Good Afternoon`.
5. WHEN the hour is 15–17, THE Greeting_Controller SHALL display `Good Evening`.
6. WHEN the hour is 18–23, THE Greeting_Controller SHALL display `Good Night`.
7. WHERE a username is set, THE Greeting_Controller SHALL append the name (e.g. `Good Morning, Rizky!`).
8. WHERE no username is set, THE Greeting_Controller SHALL display the greeting without a name.

---

### Requirement 5: Custom Name in Greeting

**User Story:** As a user, I want to set my name so the greeting feels personal.

#### Acceptance Criteria

1. THE Dashboard SHALL provide a mechanism for the user to enter or change their name.
2. WHEN the user saves a name, THE greeting SHALL immediately update to include the name.
3. THE name SHALL be saved in LocalStorage and restored on page reload.
4. IF the name field is cleared and saved, THE greeting SHALL display without a name.
5. IF the name exceeds 50 characters, THE Dashboard SHALL limit input to 50 characters.

---

### Requirement 6: Focus Timer

**User Story:** As a user, I want a 25-minute countdown timer for focused work sessions.

#### Acceptance Criteria

1. THE Focus_Timer SHALL display a countdown in MM:SS format starting at 25:00.
2. WHEN the user clicks Start, THE Focus_Timer SHALL begin counting down.
3. WHILE running, THE Focus_Timer SHALL update the display every second.
4. WHEN the user clicks Stop, THE Focus_Timer SHALL pause and retain the remaining time.
5. WHEN the user clicks Reset, THE Focus_Timer SHALL stop and return to 25:00.
6. WHEN the countdown reaches 00:00, THE Focus_Timer SHALL stop automatically and notify the user.
7. WHILE running, the Start button SHALL be disabled. WHILE stopped, the Stop button SHALL be disabled.

---

### Requirement 7: Task Manager

**User Story:** As a user, I want to add, edit, complete, and delete tasks to manage my work.

#### Acceptance Criteria

1. THE Task_Manager SHALL provide a text input and Add button for adding tasks.
2. WHEN the user submits a task (button or Enter), THE Task_Manager SHALL add it to the list.
3. IF the input is empty or whitespace-only, THE Task_Manager SHALL reject it with an error message.
4. IF the task text already exists (case-insensitive), THE Task_Manager SHALL reject it as a duplicate.
5. WHEN the user clicks a task text, THE Task_Manager SHALL enter edit mode for that task.
6. WHEN the user saves an edit (Enter or blur), THE Task_Manager SHALL update the task text.
7. WHEN the user clicks the checkbox, THE Task_Manager SHALL toggle the task's completed status.
8. WHILE a task is completed, its text SHALL be displayed with strikethrough decoration.
9. WHEN the user clicks Delete, THE Task_Manager SHALL permanently remove that task.
10. THE Task_Manager SHALL show a count of remaining (incomplete) tasks.
11. ALL task changes SHALL be saved to LocalStorage automatically.

---

### Requirement 8: Sort Tasks

**User Story:** As a user, I want to sort my task list to prioritise what I see.

#### Acceptance Criteria

1. THE Task_Manager SHALL offer sort options: Newest first, Oldest first, Pending first, A–Z.
2. WHEN the user selects a sort option, THE list SHALL immediately reorder.
3. THE selected sort preference SHALL be saved in LocalStorage and restored on reload.

---

### Requirement 9: Quick Links

**User Story:** As a user, I want to save and open favourite website links directly from the dashboard.

#### Acceptance Criteria

1. THE Quick_Links SHALL display saved links as clickable buttons/chips.
2. THE Quick_Links SHALL provide inputs for a link name and URL, plus an Add Link button.
3. WHEN the user adds a valid link, THE Quick_Links SHALL add it to the list.
4. IF the URL has no scheme, THE Quick_Links SHALL automatically prepend `https://`.
5. IF the name or URL is empty, THE Quick_Links SHALL reject the entry with an error message.
6. WHEN the user clicks a link, it SHALL open in a new browser tab.
7. THE Quick_Links SHALL provide a delete button on each link.
8. ALL link changes SHALL be saved to LocalStorage automatically.

---

### Requirement 10: Light/Dark Mode

**User Story:** As a user, I want to switch between light and dark mode to suit my preference.

#### Acceptance Criteria

1. THE Theme_Controller SHALL provide a toggle button to switch between light and dark mode.
2. WHEN toggled, THE entire UI SHALL update instantly without a page reload.
3. THE selected theme SHALL be saved in LocalStorage and restored on page reload.
4. THE default theme SHALL be light mode.

---

### Requirement 11: Performance and UI Quality

**User Story:** As a user, I want the app to load fast and respond instantly to interactions.

#### Acceptance Criteria

1. THE Dashboard SHALL load and be usable in under 3 seconds.
2. WHEN the user interacts with any element, THE Dashboard SHALL respond in under 100ms.
3. THE Dashboard SHALL NOT depend on any external network assets, enabling offline use.
4. THE Dashboard SHALL display informative empty states when task or link lists are empty.
