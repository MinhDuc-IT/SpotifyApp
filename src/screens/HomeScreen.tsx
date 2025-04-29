import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  Pressable,
  FlatList,
  ListRenderItemInfo,
  TouchableOpacity,
} from 'react-native';
import AuthContext from '../contexts/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../types/navigation';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AntDesign from 'react-native-vector-icons/AntDesign';
import ArtistCard from '../components/ArtistCard';
import RecentlyPlayedCard from '../components/RecentlyPlayedCard';

import api from '../services/api';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

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

// interface RecentlyPlayedItem {
//   track: {
//     name: string;
//     album: {
//       images: SpotifyImage[];
//     };
//   };
// }

// interface Artist {
//   id: string;
//   name: string;
//   images: SpotifyImage[];
// }

interface RecentlyPlayedItem {
  songId: number;
  title: string;
  artistName: string;
  album: string;
  albumID: number;
  thumbnailUrl: string;
  duration: string;
  audioUrl: string;
}

interface Artist {
  artistId: number;
  artistName: string;
  totalPlays: number;
  thumbnailUrl: string;
}

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const { user, roles } = useContext(AuthContext);
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [userProfile, setUserProfile] = useState<SpotifyUser | null>(null);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [recentlyplayed, setRecentlyPlayed] = useState<RecentlyPlayedItem[]>(
    [],
  );

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

  useEffect(() => {
    getTopItems();
  }, []);

  const getTopItems = async () => {
    try {
      const response = await api.get('/history/top-artists');
      const data = response.data;
      console.log('Top artist:', data); // Log the profile data for debugging

      setTopArtists(data);
    } catch (err: any) {
      console.log('Error fetching top artists:', err.message);
    }
  };

  useEffect(() => {
    getRecentlyPlayedSongs();
  }, []);

  const getRecentlyPlayedSongs = async () => {
    try {
      const response = await api.get('/history/listening-history');
      const data = response.data;
      console.log('Recent data:', data); // Log the profile data for debugging

      //const data = await response.json();
      const tracks = data;
      console.log('Recently played tracks:', tracks); // Log the recently played tracks for debugging
      setRecentlyPlayed(tracks);
    } catch (err: any) {
      console.log('Error fetching recently played:', err.message);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    console.log('Fetching profile...'); // Log to check if the function is called
    try {
      const response = await api.get('/user/profile');
      const data = response.data;
      console.log('Profile data:', data); // Log the profile data for debugging

      const user: SpotifyUser = {
        images: data.avatar ? [{ url: data.avatar }] : [],
        name: data.fullName ? { name: data.email } : undefined,
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

  const renderItem = ({ item }: ListRenderItemInfo<RecentlyPlayedItem>) => (
    <Pressable
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginVertical: 8,
        backgroundColor: '#282828',
        borderRadius: 4,
        elevation: 3,
      }}>
      <Image
        style={{ height: 55, width: 55 }}
        //source={{uri: item.track.album.images[0].url}}
        source={{ uri: item.thumbnailUrl }}
      />
      <View style={{ flex: 1, marginHorizontal: 8, justifyContent: 'center' }}>
        <Text
          numberOfLines={2}
          style={{
            fontSize: 13,
            fontWeight: 'bold',
            color: 'white',
            width: 105,
          }}>
          {/* {item.track.name} */}
          {item.artistName}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <ScrollView style={styles.wrapper}>
      <View>
        <View style={styles.header}>
          <TouchableOpacity style={styles.avatarWrapper} onPress={() => navigation.openDrawer()}>
            {userProfile?.images ? (
              // <Image
              //   style={styles.avatar}
              //   source={
              //     require('../assets/images/sontung.jpg') || {
              //     uri: userProfile.images[0].url,
              //   }
              //   }
              // />
              <Image
                style={styles.avatar}
                source={{ uri: userProfile.images[0].url }}
              />
            ) : (
              <Ionicons name="person-circle" size={40} color="white" />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          <Pressable style={styles.filterButton}>
            <Text style={styles.filterText}>Music</Text>
          </Pressable>
          <Pressable style={styles.filterButton}>
            <Text style={styles.filterText}>Podcasts & Shows</Text>
          </Pressable>
        </View>

        <View style={styles.cardRow}>
          <Pressable
            onPress={() => navigation.navigate('Liked')}
            style={styles.card}>
            <LinearGradient colors={['#33006F', '#FFFFFF']}>
              <Pressable style={styles.cardIcon}>
                <AntDesign name="heart" size={24} color="white" />
              </Pressable>
            </LinearGradient>
            <Text style={styles.cardText}>Liked Songs</Text>
          </Pressable>

          <View style={styles.card}>
            <Image
              style={{ width: 55, height: 55 }}
              source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
            />
            <View>
              <Text style={styles.cardText}>Hiphop Tamhiza</Text>
            </View>
          </View>
        </View>
      </View>

      <FlatList
        data={recentlyplayed}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        //numColumns={2}
        horizontal={true}
      //columnWrapperStyle={{justifyContent: 'space-between'}}
      />

      <Text style={styles.sectionTitle}>Your Top Artists</Text>
      {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {topArtists.map((item, index) => (
            <ArtistCard item={item} key={index} />
          ))}
        </ScrollView> */}

      <FlatList
        data={topArtists}
        keyExtractor={(item, index) => index.toString()} // hoặc dùng item.id nếu có id
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <ArtistCard item={item} />}
      />

      <Text style={styles.sectionTitle}>Recently Played</Text>
      <FlatList
        data={recentlyplayed}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <RecentlyPlayedCard item={item} key={index} />
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'space-between',
  },
  avatarWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  greeting: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  filterRow: {
    marginHorizontal: 12,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  filterButton: {
    backgroundColor: '#282828',
    padding: 10,
    borderRadius: 30,
  },
  filterText: {
    fontSize: 15,
    color: 'white',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  card: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 8,
    backgroundColor: '#202020',
    borderRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 19,
    fontWeight: 'bold',
    marginHorizontal: 10,
    marginTop: 10,
  },
});

export default HomeScreen;
