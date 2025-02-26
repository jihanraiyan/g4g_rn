import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

const BuzzWordsScreen = () => (
  <SafeAreaView style={styles.container}>
    <Text>BuzzWords Game Coming Soon!</Text>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BuzzWordsScreen; 