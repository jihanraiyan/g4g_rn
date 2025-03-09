# Games Directory

This directory contains all the individual game components and their related logic.

## Current Games

### `Game4096.jsx`
A 2048-style sliding tile game:
- Gesture-based controls
- Score tracking
- Game state management
- Local storage for game progress
- Firebase integration for high scores

## Adding New Games

When adding a new game:

1. Create a new component file (e.g., `GameName.jsx`)
2. Add the game to the games list in `app/(tabs)/index.jsx`
3. Create a route file in `app/games/` if needed
4. Implement these key features:
   - Score tracking
   - Firebase integration
   - Daily goals support
   - Progress saving

## Game Component Template

```javascript
import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { updateGameStats } from '../utils/firebase';

export default function GameComponent() {
  // Game state
  const [score, setScore] = useState(0);
  
  // Game logic
  const handleGameOver = async () => {
    if (auth.currentUser) {
      await updateGameStats(auth.currentUser.uid, score);
    }
  };

  return (
    <View style={styles.container}>
      {/* Game UI */}
    </View>
  );
}
``` 