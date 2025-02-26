import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

const Game2Screen = () => (
  <SafeAreaView style={styles.container}>
    <Text>Puzzle Game Coming Soon!</Text>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Game2Screen; 