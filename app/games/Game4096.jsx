import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import { auth, db } from '../../firebaseConfig';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { updateGameStats, updateDailyGoal } from '../utils/firebase';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const STORAGE_KEY = '4096-game';
const windowWidth = Dimensions.get('window').width;
const GRID_SIZE = 4;
const CELL_COUNT = GRID_SIZE * GRID_SIZE;
const GRID_PADDING = 10;

const Game4096 = () => {
  const [board, setBoard] = useState(Array(CELL_COUNT).fill(0));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [animating, setAnimating] = useState(false);

  const tileColors = {
    2: '#eee4da',
    4: '#ede0c8',
    8: '#f2b179',
    16: '#f59563',
    32: '#f67c5f',
    64: '#f65e3b',
    128: '#edcf72',
    256: '#edcc61',
    512: '#edc850',
    1024: '#edc53f',
    2048: '#edc22e',
    4096: '#3c3a32',
  };

  useEffect(() => {
    loadGame();
  }, []);

  const loadGame = async () => {
    try {
      const savedGame = await AsyncStorage.getItem(STORAGE_KEY + '-' + auth.currentUser?.uid);
      if (savedGame) {
        const { board: savedBoard, currentScore, bestScore } = JSON.parse(savedGame);
        setBoard(savedBoard);
        setScore(currentScore);
        setHighScore(bestScore);
      } else {
        initializeGame();
      }
    } catch (error) {
      console.error('Error loading game:', error);
      initializeGame();
    }
  };

  const initializeGame = () => {
    const newBoard = Array(CELL_COUNT).fill(0);
    addNewTile(addNewTile(newBoard));
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
  };

  const addNewTile = (gameBoard) => {
    const emptyCells = gameBoard.reduce((acc, cell, index) => {
      if (cell === 0) acc.push(index);
      return acc;
    }, []);

    if (emptyCells.length > 0) {
      const newValue = Math.random() < 0.9 ? 2 : 4;
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      gameBoard[randomCell] = newValue;
    }
    return gameBoard;
  };

  const moveLeft = (gameBoard) => {
    let newScore = score;
    let moved = false;
    const newBoard = [];

    for (let row = 0; row < GRID_SIZE; row++) {
      const currentRow = gameBoard.slice(row * GRID_SIZE, (row + 1) * GRID_SIZE);
      const filteredRow = currentRow.filter(cell => cell !== 0);
      
      // Merge tiles
      for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] *= 2;
          newScore += filteredRow[i];
          filteredRow[i + 1] = 0;
          moved = true;
        }
      }

      // Remove zeros and pad with zeros
      const mergedRow = filteredRow.filter(val => val !== 0);
      while (mergedRow.length < GRID_SIZE) {
        mergedRow.push(0);
      }

      // Check if anything moved
      for (let i = 0; i < GRID_SIZE; i++) {
        if (currentRow[i] !== mergedRow[i]) {
          moved = true;
        }
        newBoard.push(mergedRow[i]);
      }
    }

    return { newBoard, newScore, moved };
  };

  const moveRight = (gameBoard) => {
    const reversed = [...gameBoard];
    for (let row = 0; row < GRID_SIZE; row++) {
      const start = row * GRID_SIZE;
      const end = start + GRID_SIZE;
      const currentRow = reversed.slice(start, end);
      currentRow.reverse();
      reversed.splice(start, GRID_SIZE, ...currentRow);
    }
    
    const { newBoard, newScore, moved } = moveLeft(reversed);
    
    for (let row = 0; row < GRID_SIZE; row++) {
      const start = row * GRID_SIZE;
      const end = start + GRID_SIZE;
      const currentRow = newBoard.slice(start, end);
      currentRow.reverse();
      newBoard.splice(start, GRID_SIZE, ...currentRow);
    }
    
    return { newBoard, newScore, moved };
  };

  const moveUp = (gameBoard) => {
    const rotated = Array(CELL_COUNT).fill(0);
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        rotated[i * GRID_SIZE + j] = gameBoard[j * GRID_SIZE + i];
      }
    }
    
    const { newBoard, newScore, moved } = moveLeft(rotated);
    
    const result = Array(CELL_COUNT).fill(0);
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        result[j * GRID_SIZE + i] = newBoard[i * GRID_SIZE + j];
      }
    }
    
    return { newBoard: result, newScore, moved };
  };

  const moveDown = (gameBoard) => {
    const rotated = Array(CELL_COUNT).fill(0);
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        rotated[i * GRID_SIZE + j] = gameBoard[j * GRID_SIZE + i];
      }
    }
    
    const { newBoard, newScore, moved } = moveRight(rotated);
    
    const result = Array(CELL_COUNT).fill(0);
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        result[j * GRID_SIZE + i] = newBoard[i * GRID_SIZE + j];
      }
    }
    
    return { newBoard: result, newScore, moved };
  };

  const move = (direction) => {
    if (gameOver || animating) return;

    setAnimating(true);
    
    // Configure animation
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    let result;
    switch (direction) {
      case 'left':
        result = moveLeft([...board]);
        break;
      case 'right':
        result = moveRight([...board]);
        break;
      case 'up':
        result = moveUp([...board]);
        break;
      case 'down':
        result = moveDown([...board]);
        break;
      default:
        setAnimating(false);
        return;
    }

    const { newBoard, newScore, moved } = result;
    
    if (moved) {
      addNewTile(newBoard);
      setBoard(newBoard);
      setScore(newScore);
      if (newScore > highScore) {
        setHighScore(newScore);
      }
      
      if (!canMove(newBoard)) {
        handleGameOver();
      }
    }
    
    setTimeout(() => {
      setAnimating(false);
    }, 150);
  };

  const canMove = (gameBoard) => {
    if (gameBoard.includes(0)) return true;

    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const current = gameBoard[i * GRID_SIZE + j];
        if (j < GRID_SIZE - 1 && current === gameBoard[i * GRID_SIZE + j + 1]) return true;
        if (i < GRID_SIZE - 1 && current === gameBoard[(i + 1) * GRID_SIZE + j]) return true;
      }
    }
    return false;
  };

  const handleGameOver = async () => {
    setGameOver(true);
    
    // Save final game state
    await saveGame();
    
    // Update user stats
    if (auth.currentUser) {
      await updateGameStats(
        auth.currentUser.uid,
        '4096',
        score,
        board
      );
    }

    Alert.alert(
      'Game Over!',
      `Final Score: ${score}\nBest Score: ${Math.max(score, highScore)}`,
      [
        {
          text: 'Play Again',
          onPress: () => {
            initializeGame();
          },
        },
      ]
    );
  };

  const saveGame = async () => {
    try {
      const gameState = {
        board,
        currentScore: score,
        bestScore: Math.max(score, highScore),
      };
      await AsyncStorage.setItem(STORAGE_KEY + '-' + auth.currentUser?.uid, JSON.stringify(gameState));
    } catch (error) {
      console.error('Error saving game:', error);
    }
  };

  const gesture = Gesture.Pan()
    .runOnJS(true)
    .onEnd((e) => {
      if (animating) return;
      
      const { translationX, translationY } = e;
      const absX = Math.abs(translationX);
      const absY = Math.abs(translationY);
      const minSwipeDistance = 20;

      if (absX > absY && absX > minSwipeDistance) {
        move(translationX > 0 ? 'right' : 'left');
      } else if (absY > absX && absY > minSwipeDistance) {
        move(translationY > 0 ? 'down' : 'up');
      }
    });

  const renderTile = (value, index) => {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const fontSize = value >= 1000 ? 20 : value >= 100 ? 24 : 32;

    return (
      <View
        key={`${row}-${col}`}
        style={[
          styles.tile,
          {
            backgroundColor: value ? tileColors[value] || '#3c3a32' : '#ccc0b3',
          },
        ]}
      >
        {value > 0 && (
          <Text
            style={[
              styles.tileText,
              {
                fontSize,
                color: value <= 4 ? '#776e65' : '#f9f6f2',
              },
            ]}
          >
            {value}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>2048</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <Text style={styles.scoreText}>Best: {highScore}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={initializeGame}>
          <FontAwesome5 name="redo" size={24} color="#f9f6f2" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={saveGame}>
          <FontAwesome5 name="save" size={24} color="#f9f6f2" />
        </TouchableOpacity>
      </View>

      <GestureDetector gesture={gesture}>
        <View style={styles.grid}>
          {board.map((value, index) => renderTile(value, index))}
        </View>
      </GestureDetector>
    </SafeAreaView>
  );
};

export default Game4096;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf8ef',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#776e65',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 16,
    color: '#776e65',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#8f7a66',
    padding: 10,
    borderRadius: 5,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    width: windowWidth - 40,
    height: windowWidth - 40,
    backgroundColor: '#bbada0',
    borderRadius: 6,
    padding: GRID_PADDING,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tile: {
    width: (windowWidth - 40 - GRID_PADDING * 2) / 4 - GRID_PADDING,
    height: (windowWidth - 40 - GRID_PADDING * 2) / 4 - GRID_PADDING,
    margin: GRID_PADDING / 2,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc0b3',
  },
  tileText: {
    fontWeight: 'bold',
  },
}); 