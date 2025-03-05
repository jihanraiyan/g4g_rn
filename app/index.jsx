import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";

const games = [
  { id: '1', name: 'Bee Game', icon: 'gamepad' },
  { id: '2', name: 'Watermelon', icon: 'puzzle-piece' },
  { id: '3', name: 'Duck Game', icon: 'dove' },
  { id: '4', name: '4096', icon: 'th' },
];

export default function Index() {
  return (
    <View style={styles.container} edges={['top']}>
      {/* Header with points */}
      <View style={styles.header}>
        <Text style={styles.points}>🍚 100,567</Text>
        <TouchableOpacity style={styles.profileButton}>
          <FontAwesome5 name="user-circle" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Games section */}
      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionTitle}>Your top games</Text>
        
        <View style={styles.gamesGrid}>
          {games.map((game) => (
            <TouchableOpacity key={game.id} style={styles.gameCard}>
              <View style={styles.gameIconContainer}>
                <FontAwesome5 name={game.icon} size={40} color="#82D9C8" />
                <Text style={styles.gameName}>{game.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>All games</Text>
        <View style={styles.gamesGrid}>
          {games.map((game) => (
            <TouchableOpacity key={game.id} style={styles.gameCard}>
              <View style={styles.gameIconContainer}>
                <FontAwesome5 name={game.icon} size={40} color="#82D9C8" />
                <Text style={styles.gameName}>{game.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  points: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  gameCard: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  gameIconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  gameName: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
}); 