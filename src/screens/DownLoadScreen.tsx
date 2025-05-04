import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import HeaderLibrary from '../components/library/HeaderLibrary';
import LibraryContent from '../components/DownLoad/LibraryContent';
import {useLibrary} from '../contexts/LibraryContext';
import Account from '../components/Account/Account';
import {getAllDownloadedSongsByUser} from '../sqlite/songService';
import auth from '@react-native-firebase/auth';

export type LibraryItem = {
  id: string;
  name: string;
  category: 'artist' | 'playlist' | 'album' | 'podcast' | 'song';
  author?: string;
  lastUpdate?: string;
  imageUrl?: string;
  favoriteList?: boolean;
};

const DownLoadScreen = () => {
  const {libraryItems} = useLibrary();
  const [likeSong, setLikeSong] = React.useState<LibraryItem[]>([]);

  useEffect(() => {
    const fetchDownloadedSongs = async () => {
      const user = auth().currentUser;
      if (!user) {
        console.log('No user is logged in');
        return;
      }
      console.log('Current user:', user.uid);
      try {
        const downloadedSongs = await getAllDownloadedSongsByUser(user.uid); // Replace with actual firebaseId
        setLikeSong([
          {
            id: downloadedSongs[0]?.song_id,
            name: 'Bài hát ưa thích',
            category: 'playlist',
            favoriteList: true,
          },
        ]);
        console.log('Downloaded songs:', downloadedSongs);
      } catch (error) {
        console.error('Error fetching downloaded songs:', error);
      }
    };

    fetchDownloadedSongs();
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Account />
          <Text style={styles.headerTitle}>Nhạc đã tải xuống</Text>
        </View>
        <LibraryContent libraryItems={likeSong} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    borderWidth: 1,
    height: '100%',
    color: 'white',
    paddingHorizontal: 16,
  },
  header: {
    marginVertical: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
  },
});

export default DownLoadScreen;
