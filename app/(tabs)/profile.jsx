import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [userData, setUserData] = useState({
    displayName: '',
    points: 0,
    gamesPlayed: 0,
    highScores: 0
  });
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState('-');

  useEffect(() => {
    if (!auth.currentUser) {
      router.replace('/auth');
      return;
    }
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        console.log('Profile user data:', data); // Debug log
        setUserData({
          displayName: data.displayName || 'Anonymous User',
          points: data.points || 0,
          gamesPlayed: data.gamesPlayed || 0,
          highScores: Object.keys(data.highScores || {}).length || 0
        });
        setUserRank(data.userRank || '-');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.replace('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const renderStatCard = (title, value, icon) => (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{typeof value === 'number' ? value.toLocaleString() : value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const renderSettingItem = (icon, title, onPress) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={() => {
        if (onPress) {
          onPress();
        } else {
          Alert.alert('Coming Soon', 'This feature will be available soon!');
        }
      }}
    >
      <FontAwesome5 name={icon} size={20} color="#718096" />
      <Text style={styles.settingText}>{title}</Text>
      <FontAwesome5 name="chevron-right" size={16} color="#CBD5E0" />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 }
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {userData.displayName[0].toUpperCase()}
              </Text>
            </View>
            <Text style={styles.username}>{userData.displayName}</Text>
            <Text style={styles.email}>{auth.currentUser?.email}</Text>
          </View>

          <View style={styles.statsContainer}>
            {renderStatCard('Rice Count', userData.points, '🍚')}
            {renderStatCard('Games Played', userData.gamesPlayed, '🎮')}
            {renderStatCard('Impact Rank', userRank || '-', '👑')}
          </View>

          <View style={styles.settingsContainer}>
            <Text style={styles.sectionTitle}>Settings</Text>
            {renderSettingItem('user-edit', 'Edit Profile')}
            {renderSettingItem('bell', 'Notifications')}
            {renderSettingItem('shield-alt', 'Privacy')}
            {renderSettingItem('question-circle', 'Help & Support')}
          </View>

          <TouchableOpacity 
            style={styles.donateButton}
            onPress={() => Alert.alert('Coming Soon', 'Donation feature will be available soon!')}
          >
            <Text style={styles.donateButtonText}>Donate Now</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9F8',
  },
  header: {
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
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
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#5BCCA6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#718096',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#718096',
  },
  settingsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  settingText: {
    flex: 1,
    fontSize: 14,
    color: '#2D3748',
    marginLeft: 12,
  },
  donateButton: {
    backgroundColor: '#5BCCA6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  donateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  signOutButton: {
    backgroundColor: '#FED7D7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E53E3E',
  },
}); 