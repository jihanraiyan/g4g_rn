import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Link } from 'expo-router';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeUserData } from './utils/firebase';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);

  const handleAuth = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (isSignUp) {
      if (!username) {
        setError('Please choose a username');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await initializeUserData(userCredential.user, username);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      router.replace('/');
    } catch (error) {
      console.error('Auth error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{isSignUp ? 'Sign Up' : 'Welcome'}</Text>
        {isSignUp && <Text style={styles.subtitle}>Make a difference.</Text>}
        
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Enter your email"
            />
          </View>

          {isSignUp && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                placeholder="Choose a username"
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Enter your password"
            />
          </View>

          {isSignUp && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="Confirm your password"
              />
            </View>
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {loading ? (
            <ActivityIndicator size="large" color="#5BCCA6" />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleAuth}>
              <Text style={styles.buttonText}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.switchAuth}
            onPress={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setUsername('');
              setPassword('');
              setConfirmPassword('');
            }}
          >
            <Text style={styles.switchText}>
              {isSignUp ? 'Have an account? ' : "Don't have an account? "}
              <Text style={styles.switchLink}>
                {isSignUp ? 'Login' : 'Sign Up'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9F8',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 32,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A5568',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2D3748',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  error: {
    color: '#E53E3E',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#5BCCA6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  switchAuth: {
    alignItems: 'center',
    marginTop: 16,
  },
  switchText: {
    fontSize: 14,
    color: '#718096',
  },
  switchLink: {
    color: '#5BCCA6',
    fontWeight: '600',
  },
}); 