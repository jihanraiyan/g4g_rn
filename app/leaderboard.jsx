import { StyleSheet, Text, View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";

const leaderboardData = [
  { id: '1', name: 'Name', points: '1,000,000', rank: '#1' },
  { id: '2', name: 'Name', points: '1,000,000', rank: '#2' },
  { id: '3', name: 'Name', points: '1,000,000', rank: '#3' },
  { id: '4', name: 'Name', points: '1,000,000', rank: '#4' },
  { id: '5', name: 'Name', points: '1,000,000', rank: '#5' },
  { id: '6', name: 'Name', points: '1,000,000', rank: '#6' },
  { id: '7', name: 'Name', points: '1,000,000', rank: '#7' },
];

export default function Leaderboard() {
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