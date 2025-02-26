import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

const ProfileScreen = () => (
  <SafeAreaView style={styles.container}>
    <Text>Profile Coming Soon!</Text>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen; 