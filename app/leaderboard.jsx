import { StyleSheet, Text, View, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Create a query to get top 100 users sorted by points
    const q = query(
      collection(db, "users"),
      orderBy("points", "desc"),
      limit(100)
    );

    // Set up real-time listener for leaderboard updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = [];
      snapshot.forEach((doc) => {
        const userData = doc.data();
        users.push({
          id: doc.id,
          name: userData.name || "Anonymous",
          points: userData.points.toLocaleString() || "0",
          rank: `#${users.length + 1}`
        });
      });
      setLeaderboardData(users);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching leaderboard:", error);
      setLoading(false);
    });

    // Cleanup: Remove the listener when component unmounts
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#82D9C8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.points}>🍚 100,567</Text>
        <FontAwesome5 name="user-circle" size={24} color="#333" />
      </View>

      <Text style={styles.title}>Leaderboard</Text>

      <FlatList
        data={leaderboardData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.leaderboardItem}>
            <View style={styles.rankContainer}>
              <Text style={styles.rank}>{item.rank}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userPoints}>🍚 {item.points}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  points: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    color: '#333',
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#82D9C8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rank: {
    color: '#fff',
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  userPoints: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
}); 