import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const games = [
  {
    id: 'bee',
    title: 'Bee Game',
    icon: 'bug',
    color: '#FBD38D',
    enabled: false,
  },
  {
    id: 'watermelon',
    title: 'Watermelon',
    icon: 'apple-alt',
    color: '#F687B3',
    enabled: false,
  },
  {
    id: 'watermelon2',
    title: 'Watermelon 2',
    icon: 'apple-alt',
    color: '#FC8181',
    enabled: false,
  },
  {
    id: '4096',
    title: '4096',
    icon: 'th',
    color: '#4FD1C5',
    route: '/games/4096',
    enabled: true,
  },
  {
    id: 'bee2',
    title: 'Bee Game 2',
    icon: 'bug',
    color: '#F6AD55',
    enabled: false,
  },
  {
    id: 'snake',
    title: 'Snake',
    icon: 'wave-square',
    color: '#68D391',
    enabled: false,
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [topGames, setTopGames] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    if (!auth.currentUser) return;

    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        
        // Sort games based on user's activity and get top 2
        const sortedGames = [...games].sort((a, b) => {
          const aPlayed = data.gamesPlayed?.[a.id] || 0;
          const bPlayed = data.gamesPlayed?.[b.id] || 0;
          return bPlayed - aPlayed;
        });
        
        // Only show enabled games or games user has played before
        const topEnabled = sortedGames.filter(game => 
          game.enabled || (data.gamesPlayed?.[game.id] || 0) > 0
        ).slice(0, 2);

        // If we don't have 2 games, add the first enabled game not already included
        if (topEnabled.length < 2) {
          const enabledGames = games.filter(game => 
            game.enabled && !topEnabled.find(g => g.id === game.id)
          );
          setTopGames([...topEnabled, ...enabledGames].slice(0, 2));
        } else {
          setTopGames(topEnabled);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleGamePress = (game) => {
    if (game.enabled && game.route) {
      router.push(game.route);
    }
  };

  const renderGameCard = (game, isFeatured = false) => (
    <TouchableOpacity
      key={game.id}
      style={[
        isFeatured ? styles.featuredGame : styles.gameCard,
        !game.enabled && styles.disabledGame,
        { backgroundColor: game.color }
      ]}
      onPress={() => handleGamePress(game)}
      disabled={!game.enabled}
    >
      <FontAwesome5 
        name={game.icon} 
        size={isFeatured ? 40 : 32} 
        color="#FFFFFF" 
        style={styles.gameIcon}
      />
      <Text style={styles.gameTitle}>{game.title}</Text>
      {!game.enabled && (
        <View style={styles.comingSoonBadge}>
          <Text style={styles.comingSoonText}>Coming Soon</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.riceContainer}>
          <Text style={styles.riceCount}>🍚 {userData?.points?.toLocaleString() || 0}</Text>
          <Text style={styles.riceLabel}>rice count</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <FontAwesome5 name="user-circle" size={24} color="#4A5568" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Your top games</Text>
        <View style={styles.featuredGames}>
          {topGames.map(game => renderGameCard(game, true))}
        </View>

        <Text style={styles.sectionTitle}>All games</Text>
        <View style={styles.gameGrid}>
          {games.map(game => renderGameCard(game))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9F8',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F9F8',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  riceContainer: {
    flexDirection: 'column',
  },
  riceCount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  riceLabel: {
    fontSize: 12,
    color: '#718096',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 16,
  },
  featuredGames: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  featuredGame: {
    flex: 1,
    aspectRatio: 1.5,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gameGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingBottom: 24,
  },
  gameCard: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gameIcon: {
    marginBottom: 12,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  disabledGame: {
    opacity: 0.7,
  },
  comingSoonBadge: {
    position: 'absolute',
    bottom: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  comingSoonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
}); 