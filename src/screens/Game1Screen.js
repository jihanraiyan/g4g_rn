import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

const Game1Screen = () => (
  <SafeAreaView style={styles.container}>
    <Text>Endless Runner Game Coming Soon!</Text>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Game1Screen; 