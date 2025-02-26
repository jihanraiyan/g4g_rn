import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import Game1Screen from './src/screens/Game1Screen';
import Game2Screen from './src/screens/Game2Screen';
import Game4096Screen from './src/screens/Game4096Screen';
import BuzzWordsScreen from './src/screens/BuzzWordsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import DailyGoalsScreen from './src/screens/DailyGoalsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Game List Component
const GameList = ({ navigation }) => {
  const TopGameCard = ({ title, icon, onPress }) => (
    <TouchableOpacity style={styles.topGameCard} onPress={onPress}>
      <Icon name={icon} size={40} color="#000" />
      <Text style={styles.topGameTitle}>{title}</Text>
    </TouchableOpacity>
  );

  const GameCard = ({ title, description, icon, onPress }) => (
    <TouchableOpacity style={styles.gameCard} onPress={onPress}>
      <Icon name={icon} size={24} color="#000" />
      <View style={styles.gameCardContent}>
        <Text style={styles.gameCardTitle}>{title}</Text>
        <Text style={styles.gameCardDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Top Games</Text>
      <ScrollView horizontal style={styles.topGamesContainer}>
        <TopGameCard
          title="Endless Runner"
          icon="directions-run"
          onPress={() => navigation.navigate('Game1')}
        />
        <TopGameCard
          title="Puzzle Game"
          icon="extension"
          onPress={() => navigation.navigate('Game2')}
        />
        <TopGameCard
          title="4096"
          icon="grid-4x4"
          onPress={() => navigation.navigate('Game4096')}
        />
        <TopGameCard
          title="BuzzWords"
          icon="text-fields"
          onPress={() => navigation.navigate('BuzzWords')}
        />
      </ScrollView>

      <Text style={styles.sectionTitle}>All Games</Text>
      <View style={styles.allGamesContainer}>
        <GameCard
          title="Endless Runner"
          description="Run and dodge obstacles"
          icon="directions-run"
          onPress={() => navigation.navigate('Game1')}
        />
        <GameCard
          title="Puzzle Game"
          description="Test your brain"
          icon="extension"
          onPress={() => navigation.navigate('Game2')}
        />
        <GameCard
          title="4096"
          description="Merge tiles to reach 4096"
          icon="grid-4x4"
          onPress={() => navigation.navigate('Game4096')}
        />
        <GameCard
          title="BuzzWords"
          description="Find words using given letters"
          icon="text-fields"
          onPress={() => navigation.navigate('BuzzWords')}
        />
      </View>
    </ScrollView>
  );
};

// Main Navigation Stack
const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="GameList" 
      component={GameList}
      options={{
        title: 'All Games',
        headerRight: () => (
          <View style={styles.headerRight}>
            <Text style={styles.points}>1000</Text>
            <Icon name="stars" size={24} color="#000" />
          </View>
        ),
      }}
    />
    <Stack.Screen name="Game1" component={Game1Screen} />
    <Stack.Screen name="Game2" component={Game2Screen} />
    <Stack.Screen name="Game4096" component={Game4096Screen} />
    <Stack.Screen name="BuzzWords" component={BuzzWordsScreen} />
  </Stack.Navigator>
);

// App Component
const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen 
          name="Home" 
          component={HomeStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Leaderboard" 
          component={LeaderboardScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="leaderboard" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Daily Goals" 
          component={DailyGoalsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="track-changes" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="person" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  points: {
    marginRight: 5,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
  },
  topGamesContainer: {
    paddingHorizontal: 16,
  },
  topGameCard: {
    width: 120,
    height: 120,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    marginRight: 16,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topGameTitle: {
    marginTop: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  allGamesContainer: {
    padding: 16,
  },
  gameCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  gameCardContent: {
    marginLeft: 16,
  },
  gameCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameCardDescription: {
    color: '#666',
  },
});

export default App; 
