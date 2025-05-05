import React, {useState, useEffect} from 'react';
import {StyleSheet, Dimensions, Image, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import axios from '../../services/api';
import auth from '@react-native-firebase/auth';

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

interface SpotifyImage {
  url: string;
}

interface SpotifyName {
  name: string;
}

interface SpotifyUser {
  images?: SpotifyImage[];
  name?: SpotifyName;
}

const Account = () => {
  const navigation = useNavigation<NavigationProps>();
  const [userProfile, setUserProfile] = useState<SpotifyUser | null>(null);
  const avatar = auth().currentUser?.photoURL || null;

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    console.log('Fetching profile...'); // Log to check if the function is called
    try {
      const response = await axios.get('/user/profile');
      const data = response.data;
      console.log('Profile data:', data); // Log the profile data for debugging

      const user: SpotifyUser = {
        images: data.avatar ? [{url: data.avatar}] : [],
        name: data.fullName ? {name: data.email} : undefined,
      };

      console.log('User object:', user); // Log the user object for debugging
      if (userProfile?.images?.[0]?.url?.includes('default-avatar.png')) {
        user.images = undefined;
      }

      setUserProfile(user);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  return (
    <TouchableOpacity
      style={styles.avatarWrapper}
      onPress={() => navigation.openDrawer()}>
      {userProfile?.images ? (
        <Image
          style={styles.avatar}
          source={{
            uri: avatar ? avatar : userProfile.images[0].url,
          }}
        />
      ) : (
        <Ionicons name="person-circle" size={40} color="white" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avatarWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
    resizeMode: 'cover',
  },
});

export default Account;
