import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import CircularProgress from 'react-native-circular-progress-indicator';
import { router } from 'expo-router';

export default function DailyGoalsScreen() {
  const insets = useSafeAreaInsets();
  const [goals, setGoals] = useState({
    gamesPlayed: { current: 0, target: 5 },
    pointsEarned: { current: 0, target: 1000 },
    highScores: { current: 0, target: 3 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      router.replace('/auth');
      return;
    }
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.dailyGoals) {
          setGoals({
            gamesPlayed: {
              current: data.dailyGoals.gamesPlayed || 0,
              target: 5
            },
            pointsEarned: {
              current: data.dailyGoals.pointsEarned || 0,
              target: 1000
            },
            highScores: {
              current: data.dailyGoals.highScores || 0,
              target: 3
            }
          });
        }
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderGoalCard = (title, current, target, icon) => {
    const progress = Math.min((current / target) * 100, 100);
    
    return (
      <View style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <Text style={styles.goalTitle}>{title}</Text>
          <Text style={styles.goalIcon}>{icon}</Text>
        </View>
        <View style={styles.goalProgress}>
          <CircularProgress
            value={progress}
            radius={40}
            duration={2000}
            progressValueColor={'#2D3748'}
            maxValue={100}
            title={`${current}/${target}`}
            titleColor={'#718096'}
            titleStyle={{ fontSize: 14 }}
            activeStrokeColor={'#5BCCA6'}
            inActiveStrokeColor={'#E2E8F0'}
            inActiveStrokeOpacity={0.5}
            inActiveStrokeWidth={6}
            activeStrokeWidth={6}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Goals</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading goals...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 }
          ]}
          showsVerticalScrollIndicator={false}
        >
          {renderGoalCard(
            'Games Played',
            goals.gamesPlayed.current,
            goals.gamesPlayed.target,
            '🎮'
          )}
          {renderGoalCard(
            'Points Earned',
            goals.pointsEarned.current,
            goals.pointsEarned.target,
            '⭐'
          )}
          {renderGoalCard(
            'High Scores',
            goals.highScores.current,
            goals.highScores.target,
            '🏆'
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9F8',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#F5F9F8',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3748',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#718096',
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
  },
  goalIcon: {
    fontSize: 20,
  },
  goalProgress: {
    alignItems: 'center',
  },
}); 