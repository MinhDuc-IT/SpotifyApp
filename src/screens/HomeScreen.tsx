import React, {useContext, useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  Pressable,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import AuthContext from '../contexts/AuthContext';
import {StackNavigationProp} from '@react-navigation/stack';

import {RootStackParamList} from '../types/navigation';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import {ScrollView} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AntDesign from 'react-native-vector-icons/AntDesign';
import ArtistCard from '../components/ArtistCard';
import RecentlyPlayedCard from '../components/RecentlyPlayedCard';
import {useFocusEffect} from '@react-navigation/native';
import Account from '../components/Account/Account';
import {likedSong} from '../assets';

import api from '../services/api';
import MostPlayedCard from '../components/MostPlayedCard';
import LikedInAlbumCard from '../components/LikedInAlbumCard';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

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

interface LikedInAlbum {
  albumId: number;
  albumName: string;
  artistName: string;
  thumbnailUrl: string;
}

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const {user, roles} = useContext(AuthContext);
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<RecentlyPlayedItem[]>(
    [],
  );
  const [mostPlayed, setMostPlayed] = useState<RecentlyPlayedItem[]>([]);
  const [likedInAlbums, setlikedInAlbums] = useState<LikedInAlbum[]>([]);

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
    getRecentlyPlayedSongs();
  }, []);

  // Gọi lại khi quay lại màn hình
  useFocusEffect(
    useCallback(() => {
      getTopItems();
      getRecentlyPlayedSongs();
      getMostItems();
      getLikedInAlbums();
    }, []),
  );

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

  const getMostItems = async () => {
    try {
      const response = await api.get('/song/top-played');
      const data = response.data;
      console.log('most play:', data); // Log the profile data for debugging

      setMostPlayed(data);
    } catch (err: any) {
      console.log('Error fetching most play:', err.message);
    }
  };

  const getLikedInAlbums = async () => {
    try {
      const response = await api.get('/album/liked-in-albums');
      const data = response.data;
      console.log('liked in album:', data); // Log the profile data for debugging

      setlikedInAlbums(data);
    } catch (err: any) {
      console.log('Error fetching liked in album:', err.message);
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

  const renderItem = ({item}: ListRenderItemInfo<RecentlyPlayedItem>) => (
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
        style={{height: 55, width: 55}}
        //source={{uri: item.track.album.images[0].url}}
        source={{uri: item.thumbnailUrl}}
      />
      <View style={{flex: 1, marginHorizontal: 8, justifyContent: 'center'}}>
        <Text
          numberOfLines={2}
          style={{
            fontSize: 13,
            fontWeight: 'bold',
            color: 'white',
            width: 89,
          }}>
          {/* {item.track.name} */}
          {item.artistName}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <>
      <View style={styles.header}>
        <Account />
        <View style={styles.filterRow}>
          <Pressable style={styles.filterButton}>
            <Text style={styles.filterText}>Tất cả</Text>
          </Pressable>
          <Pressable style={styles.filterButton}>
            <Text style={styles.filterText}>Nhạc</Text>
          </Pressable>
          <Pressable style={styles.filterButton}>
            <Text style={styles.filterText}>Podcasts</Text>
          </Pressable>
        </View>
      </View>
      <ScrollView
        style={styles.wrapper}
        contentContainerStyle={{paddingBottom: 70}}>
        <View style={styles.cardRow}>
          <Pressable
            onPress={() => navigation.navigate('Liked')}
            style={styles.card}>
            <Image source={likedSong} style={styles.avatarLiked} />
            <Text style={styles.cardText}>Liked Songs</Text>
          </Pressable>

          <View style={styles.card}>
            <Image
              style={{width: 55, height: 55}}
              source={{uri: 'https://i.pravatar.cc/150?img=12'}}
            />
            <View>
              <Text style={styles.cardText}>Hiphop Tamhiza</Text>
            </View>
          </View>
        </View>

        <FlatList
          data={recentlyPlayed}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          //numColumns={2}
          horizontal={true}
          //columnWrapperStyle={{justifyContent: 'space-between'}}
        />

        <Text style={styles.sectionTitle}>Bài hát thịnh hành</Text>
        <FlatList
          data={mostPlayed}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({item, index}) => (
            <MostPlayedCard item={item} key={index} />
          )}
        />

        <Text style={styles.sectionTitle}>Top nghệ sĩ</Text>
        {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {topArtists.map((item, index) => (
              <ArtistCard item={item} key={index} />
            ))}
          </ScrollView> */}

        <FlatList
          data={topArtists}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => <ArtistCard item={item} />}
        />

        <Text style={styles.sectionTitle}>Đã phát gần đây</Text>
        <FlatList
          data={recentlyPlayed}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({item, index}) => (
            <RecentlyPlayedCard item={item} key={index} />
          )}
        />

        <Text style={styles.sectionTitle}>Album có bài hát bạn thích</Text>
        <FlatList
          data={likedInAlbums}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => <LikedInAlbumCard item={item} />}
        />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#000',
    paddingTop: 65,
    flex: 1,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    position: 'absolute',
    paddingTop: 30,
    paddingBottom: 6,
    zIndex: 10,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
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
  filterRow: {
    display: 'flex',
    marginHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterButton: {
    backgroundColor: '#282828',
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 30,
  },
  filterText: {
    fontSize: 12,
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
  avatarLiked: {
    width: 55,
    height: 55,
    borderRadius: 4,
    resizeMode: 'cover',
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
