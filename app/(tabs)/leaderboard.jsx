import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { auth, db } from '../../firebaseConfig';
import { collection, query, orderBy, limit, getDocs, aggregateQuerySnapshotEqual } from 'firebase/firestore';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const RankBadge = ({ rank }) => {
  let badgeColor = '#A0AEC0';  // Default color for ranks > 3
  if (rank === 1) badgeColor = '#FFD700';  // Gold
  else if (rank === 2) badgeColor = '#C0C0C0';  // Silver
  else if (rank === 3) badgeColor = '#CD7F32';  // Bronze

  return (
    <View style={[styles.rankBadge, { backgroundColor: badgeColor }]}>
      <Text style={styles.rankText}>#{rank}</Text>
    </View>
  );
};

export default function LeaderboardScreen() {
  const insets = useSafeAreaInsets();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);
  const [totalRice, setTotalRice] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) {
      router.replace('/auth');
      return;
    }
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      // Get total rice count
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      let total = 0;
      snapshot.forEach(doc => {
        total += doc.data().points || 0;
      });
      setTotalRice(total);

      // Get top 20 users
      const q = query(
        collection(db, 'users'),
        orderBy('points', 'desc'),
        limit(20)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc, index) => {
        const userData = doc.data();
        return {
          id: doc.id,
          rank: index + 1,
          displayName: userData.displayName || 'Anonymous User',
          points: userData.points || 0,
        };
      });
      setLeaderboard(data);

      // Find current user's rank
      if (auth.currentUser) {
        const userIndex = data.findIndex(user => user.id === auth.currentUser.uid);
        if (userIndex !== -1) {
          setUserRank(userIndex + 1);
        }
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.leaderboardItem}>
      <View style={styles.userInfo}>
        <RankBadge rank={item.rank} />
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {(item.displayName && item.displayName[0]?.toUpperCase()) || '?'}
          </Text>
        </View>
        <Text style={styles.username}>{item.displayName}</Text>
      </View>
      <View style={styles.riceContainer}>
        <Text style={styles.riceCount}>🍚 {item.points?.toLocaleString()}</Text>
        
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Rice Leaderboard</Text>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading leaderboard...</Text>
        </View>
      ) : (
        <FlatList
          data={leaderboard}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 20 }
          ]}
          ListHeaderComponent={
            <View style={styles.headerContent}>
              <View style={styles.totalImpact}>
                <Text style={styles.totalRiceCount}>{totalRice.toLocaleString()}</Text>
                <Text style={styles.totalRiceLabel}>Top Rice Count</Text>
              </View>
              {userRank && (
                <View style={styles.userRankContainer}>
                  <FontAwesome5 name="crown" size={16} color="#5BCCA6" />
                  <Text style={styles.userRankText}>#{userRank}</Text>
                </View>
              )}
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  userRankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userRankText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
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
  listContent: {
    padding: 16,
  },
  leaderboardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#5BCCA6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  username: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
  },
  riceContainer: {
    alignItems: 'flex-end',
  },
  riceCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5BCCA6',
  },
  riceLabel: {
    fontSize: 12,
    color: '#718096',
  },
  headerContent: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalImpact: {
    alignItems: 'center',
    marginBottom: 12,
  },
  totalRiceCount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#5BCCA6',
    marginBottom: 4,
  },
  totalRiceLabel: {
    fontSize: 14,
    color: '#718096',
  },
}); 