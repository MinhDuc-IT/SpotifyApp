import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AuthContext from '../contexts/AuthContext';
import auth from '@react-native-firebase/auth';
import {StackNavigationProp} from '@react-navigation/stack';
import api from '../services/api';
import {RootStackParamList} from '../types/navigation';
import {useNavigation} from '@react-navigation/native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const {user, roles} = useContext(AuthContext);
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/home');
        setData(response.data.message);
      } catch (error) {
        Alert.alert('Error', 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        const gguser = await GoogleSignin.getCurrentUser();

        if (gguser) {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
        }

        await auth().signOut();
      } else {
        Alert.alert(
          'No user logged in',
          'There is no user currently logged in.',
        );
        navigation.navigate('Start');
      }
    } catch (error) {
      Alert.alert('Logout Error', 'Failed to sign out');
      console.error(error);
    }
  };

  const handlePress = () => {
    navigation.navigate('Search');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {user?.email}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4a90e2" />
      ) : (
        <Text style={styles.dataText}>{data}</Text>
      )}

      <View style={styles.buttonContainer}>
        {roles.includes('Admin') && (
          <Button
            title="Admin Dashboard"
            onPress={() => navigation.navigate('Admin')}
            color="#4a90e2"
          />
        )}

        <Button title="Logout" onPress={handleLogout} color="#ff3b30" />
        <Button
          title="Go to Search"
          onPress={() => handlePress()}
          color="#4a90e2"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 30,
  },
  dataText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    gap: 15,
  },
});

export default HomeScreen;
