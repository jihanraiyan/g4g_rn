# Utils Directory

This directory contains utility functions and helper code that is shared across different parts of the app.

## Files

### `firebase.js`
Firebase-related utility functions:

#### User Data Management
- `initializeUserData(user)`: Creates initial user data in Firestore
- `updateGameStats(userId, score)`: Updates game statistics after each game
- `updateDailyGoal(userId, goalId, progress)`: Updates progress on daily challenges

#### Data Structure
```javascript
users/{userId}/
  - uid: string
  - email: string
  - displayName: string
  - photoURL: string
  - createdAt: timestamp
  - points: number
  - gamesPlayed: number
  - highScore: number
  - totalPoints: number
  - dailyGoals: {
      '1': { completed: boolean, progress: number },
      '2': { completed: boolean, progress: number },
      '3': { completed: boolean, progress: number },
      '4': { completed: boolean, progress: number }
    }
  - lastGamePlayed: timestamp
```

## Usage

Import utility functions where needed:
```javascript
import { initializeUserData, updateGameStats, updateDailyGoal } from '../utils/firebase';
```

These utilities handle complex operations and maintain consistency across the app. They should be used instead of directly manipulating data to ensure proper data management and validation. 