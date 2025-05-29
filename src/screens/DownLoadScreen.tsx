import React, {useState, useEffect, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import LibraryContent from '../components/DownLoad/LibraryContent';
import Account from '../components/Account/Account';
import {getAllDownloadedSongsByUser} from '../sqlite/songService';
import {getUserPlaylistsWithSongs} from '../sqlite/playListService';
import auth from '@react-native-firebase/auth';

export type LibraryItem = {
  id: string;
  name: string;
  category: 'artist' | 'playlist' | 'album' | 'podcast' | 'song';
  author?: string;
  lastUpdate?: string;
  imageUrl?: string;
  favoriteList?: boolean;
  songs?: songs[];
};

interface songs {
  songId: number;
  title: string;
  artistName: string;
  // album: string;
  thumbnailUrl: string;
  // duration: number;
  audioUrl: string;
}

const DownLoadScreen = () => {
  const [downloadSong, setDownloadSong] = React.useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadDownloadData();
    }, []),
  );

  const loadDownloadData = async () => {
    const user = auth().currentUser;
    if (!user) {
      console.log('No user is logged in');
      return;
    }
    setLoading(true);
    try {
      const [playlists, likedSongs] = await Promise.all([
        getUserPlaylistsWithSongs(user.uid),
        getAllDownloadedSongsByUser(user.uid),
      ]);

      console.log('Fetched playlists:', playlists); // Log the fetched data

      // Map playlists
      const playlistsArray = playlists as any[]; // Cast playlists to any[]
      const mappedPlaylists: LibraryItem[] = playlistsArray.map((playlist: any) => ({
        id: `${playlist.id}`,
        name: playlist.name,
        category: 'playlist',
        imageUrl: playlist.songs[0]?.image_url,
        songs: playlist.songs.map((song: any) => ({
          songId: song.id,
          title: song.name,
          artistName: song.artist,
          thumbnailUrl: 'file://'+song.image_url,
          audioUrl: 'file://'+song.audio_url,
        })),
      }));

      // Map liked songs
      const likedData = likedSongs;

      const likedSongsItem: LibraryItem = {
        id: 'liked_songs', // ID cố định cho danh sách bài hát yêu thích
        name: 'Bài hát ưa thích',
        category: 'playlist',
        favoriteList: true,
        songs: likedData.map((song: any) => ({
          songId: song.songId,
          title: song.title,
          artistName: song.artistName,
          thumbnailUrl: song.thumbnailUrl,
          audioUrl: song.audioUrl,
        })),
      };

      // Gộp tất cả lại
      const allLibraryItems = [likedSongsItem, ...mappedPlaylists];
      setDownloadSong(allLibraryItems);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu thư viện:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Account />
          <Text style={styles.headerTitle}>Nhạc đã tải xuống</Text>
        </View>
        <LibraryContent libraryItems={downloadSong} />
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
