# App Directory Structure

This directory contains the main application code. Here's what each folder and file does:

## Folders

### `(tabs)/`
Special Expo Router directory for tab-based navigation. Files in this directory automatically become tabs in the app.
- `index.jsx` - Home screen with game grid
- `leaderboard.jsx` - Leaderboard screen showing top players
- `daily-goals.jsx` - Daily challenges and progress
- `profile.jsx` - User profile and settings
- `_layout.jsx` - Tab navigation configuration

### `games/`
Contains individual game components and logic.
- `Game4096.jsx` - The 2048-style game component
- Future games will be added here

### `utils/`
Helper functions and shared utilities.
- `firebase.js` - Firebase-related functions (user data, scores, etc.)

## Root Files

### `auth.jsx`
Authentication screen for login/signup. This is outside the tabs because it's shown before the main app interface.

### `firebaseConfig.js`
Firebase configuration and initialization.

## Navigation Structure

```
App
├── Auth Screen (if not logged in)
└── Tab Navigation
    ├── Home
    ├── Leaderboard
    ├── Daily Goals
    └── Profile
``` 