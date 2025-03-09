# Tabs Directory

This directory contains all the main screens of the app that are accessible via the bottom tab navigation.

## Files

### `_layout.jsx`
Configures the tab navigation appearance and behavior:
- Tab bar style and colors
- Screen transitions
- Tab icons and labels
- Header configurations

### `index.jsx`
Home screen / main game selection screen:
- Featured games section
- All games grid
- Points display
- Dynamic game cards with status

### `leaderboard.jsx`
Global leaderboard screen:
- Top players list
- User rankings
- Points display
- Rank badges (gold, silver, bronze)

### `daily-goals.jsx`
Daily challenges and progress tracking:
- Progress circles
- Daily challenges list
- Points rewards
- Progress tracking

### `profile.jsx`
User profile and settings:
- User info
- Game statistics
- Settings menu
- Sign out option

## Navigation

The tab navigation is automatically handled by Expo Router. Files in this directory become screens accessible from the bottom tab bar. The order of tabs is defined in `_layout.jsx`. 