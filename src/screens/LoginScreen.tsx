// src/screens/LoginScreen.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { authorize } from 'react-native-app-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { spotifyAuthConfig } from '../config/authConfig';
import { LinearGradient } from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from '../config/types';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('token');
      const expiration = await AsyncStorage.getItem('expirationDate');

      if (token && expiration && Date.now() < parseInt(expiration)) {
        navigation.replace('Main');
      }
    };

    checkLogin();
  }, []);

  const handleLogin = async () => {
    try {
      const result = await authorize(spotifyAuthConfig);

      await AsyncStorage.setItem('token', result.accessToken);
      await AsyncStorage.setItem(
        'expirationDate',
        new Date(result.accessTokenExpirationDate).getTime().toString()
      );

      navigation.replace('Main');
    } catch (error) {
      console.error('Spotify login error:', error);
      Alert.alert('Login failed', 'Could not authenticate with Spotify');
    }
  };

  return (
    <LinearGradient colors={['#040306', '#131624']} style={{ flex: 1 }}>
      <SafeAreaView>
        <View style={{ height: 80 }} />
        <Entypo style={{ textAlign: 'center' }} name="spotify" size={80} color="white" />
        <Text style={styles.header}>Millions of Songs Free on Spotify!</Text>

        <View style={{ height: 80 }} />
        <Pressable style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Sign in with Spotify</Text>
        </Pressable>

        <Pressable style={styles.altButton}>
          <MaterialIcons name="phone-android" size={24} color="white" />
          <Text style={styles.altButtonText}>Continue with phone number</Text>
        </Pressable>

        <Pressable style={styles.altButton}>
          <AntDesign name="google" size={24} color="red" />
          <Text style={styles.altButtonText}>Continue with Google</Text>
        </Pressable>

        <Pressable style={styles.altButton}>
          <Entypo name="facebook" size={24} color="blue" />
          <Text style={styles.altButtonText}>Continue with Facebook</Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
  },
  loginButton: {
    backgroundColor: '#1DB954',
    padding: 10,
    width: 300,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    alignSelf: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  altButton: {
    backgroundColor: '#131624',
    padding: 10,
    width: 300,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 0.8,
    marginVertical: 10,
  },
  altButtonText: {
    fontWeight: '500',
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },
});

export default LoginScreen;
