import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ProfileSuccessScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GCash Account Linked!</Text>
      <Text style={styles.subtitle}>You can now close this tab and return to the app.</Text>
      <Link href="/homepage/profile" style={styles.link}>
         Go back to Profile
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E9F8FF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 24,
  },
  link: {
    fontSize: 16,
    color: '#1565C0',
    fontWeight: 'bold',
  },
});

export default ProfileSuccessScreen;