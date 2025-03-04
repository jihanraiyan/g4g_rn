import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";

const challenges = [
  { id: '1', title: 'Games played', progress: 75, total: 100 },
  { id: '2', title: 'Games played', progress: 50, total: 100 },
  { id: '3', title: 'Games played', progress: 25, total: 100 },
  { id: '4', title: 'Games played', progress: 60, total: 100 },
  { id: '5', title: 'Games played', progress: 40, total: 100 },
];

export default function DailyGoals() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Activity</Text>
        <FontAwesome5 name="user-circle" size={24} color="#333" />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.progressSection}>
          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>Daily progress</Text>
            <Text style={styles.progressValue}>75%</Text>
          </View>
          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>Total progress</Text>
            <Text style={styles.progressValue}>55%</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Daily Challenges</Text>
        
        {challenges.map((challenge) => (
          <View key={challenge.id} style={styles.challengeItem}>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${challenge.progress}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {challenge.progress}/{challenge.total}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  progressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  progressCard: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#82D9C8',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  challengeItem: {
    marginBottom: 16,
  },
  challengeTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#82D9C8',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
  },
}); 