import { auth, db } from '../../firebaseConfig';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export const initializeUserData = async (user, username = null) => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    // Create initial user data
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: username || 'Anonymous User',
      photoURL: user.photoURL || null,
      createdAt: serverTimestamp(),
      points: 0,
      gamesPlayed: 0,
      totalPoints: 0,
      games: {
        '4096': {
          highScore: 0,
          bestGrid: null,
          gamesPlayed: 0,
          totalScore: 0
        }
      },
      dailyGoals: {
        gamesPlayed: 0,
        pointsEarned: 0,
        highScores: 0
      },
      lastGamePlayed: null,
    });
  }
};

export const updateGameStats = async (userId, gameId, score, gameState = null) => {
  if (!userId) return;

  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const userData = userDoc.data();
    const gameStats = userData.games?.[gameId] || {
      highScore: 0,
      bestGrid: null,
      gamesPlayed: 0,
      totalScore: 0
    };

    const updates = {
      gamesPlayed: (userData.gamesPlayed || 0) + 1,
      points: (userData.points || 0) + score,
      totalPoints: (userData.totalPoints || 0) + score,
      lastGamePlayed: serverTimestamp(),
      [`games.${gameId}`]: {
        highScore: Math.max(gameStats.highScore, score),
        bestGrid: score > gameStats.highScore ? gameState : gameStats.bestGrid,
        gamesPlayed: gameStats.gamesPlayed + 1,
        totalScore: gameStats.totalScore + score
      }
    };

    // Update daily goals
    if (userData.dailyGoals) {
      updates.dailyGoals = {
        gamesPlayed: (userData.dailyGoals.gamesPlayed || 0) + 1,
        pointsEarned: (userData.dailyGoals.pointsEarned || 0) + score,
        highScores: score > gameStats.highScore ? 
          (userData.dailyGoals.highScores || 0) + 1 : 
          (userData.dailyGoals.highScores || 0)
      };
    }

    await updateDoc(userRef, updates);
  }
};

export const updateDailyGoal = async (userId, goalId, progress) => {
  if (!userId) return;

  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const userData = userDoc.data();
    const dailyGoals = userData.dailyGoals || {};
    const currentGoal = dailyGoals[goalId] || { completed: false, progress: 0 };
    
    // Update goal progress
    const newProgress = currentGoal.progress + progress;
    const goalData = DAILY_GOALS.find(g => g.id === goalId);
    const completed = newProgress >= goalData.requirement;

    // If newly completed, add points
    if (completed && !currentGoal.completed) {
      await updateDoc(userRef, {
        totalPoints: (userData.totalPoints || 0) + goalData.points,
        [`dailyGoals.${goalId}`]: {
          completed,
          progress: newProgress,
        },
      });
    } else {
      await updateDoc(userRef, {
        [`dailyGoals.${goalId}`]: {
          completed,
          progress: newProgress,
        },
      });
    }
  }
}; 