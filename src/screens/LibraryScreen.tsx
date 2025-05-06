import React, {useCallback, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import HeaderLibrary from '../components/library/HeaderLibrary';
import LibraryContent from '../components/library/LibraryContent';
import {useLibrary} from '../contexts/LibraryContext';
import {useFocusEffect} from '@react-navigation/native';
import {getAllLibraryItems} from '../services/libraryService';
import api from '../services/api';

export type LibraryItem = {
  id: string;
  name: string;
  category: 'artist' | 'playlist' | 'album' | 'podcast' | 'song';
  author?: string;
  lastUpdate?: string;
  imageUrl?: string;
  isLiked?: boolean;
  songs?: songs[];
};

interface songs {
  songId: number;
  title: string;
  artistName: string;
  album: string;
  thumbnailUrl: string;
  duration: number;
  audioUrl: string;
}

const LibraryScreen = () => {
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(false);
  // const {libraryItems} = useLibrary();

  useFocusEffect(
    useCallback(() => {
      loadLibraryData();
    }, []),
  );

  const loadLibraryData = async () => {
    setLoading(true);
    try {
      const [playlists, likedSongs, followedArtistsResponse] =
        await Promise.all([
          getAllLibraryItems(),
          api.get('/liked/liked-song'),
          api.get('/artist/getArtistByUser'), // gọi API mới
        ]);

        console.log('Fetched playlists:', playlists); // Log the fetched data

      // Map playlists
      const mappedPlaylists: LibraryItem[] = playlists.map((playlist: any) => ({
        id: `playlist_${playlist.playlistID}`,
        name: playlist.playlistName,
        category: 'playlist',
        imageUrl: playlist.songs[0]?.image,
        songs: playlist.songs.map((song: any) => ({
          songId: song.songID,
          title: song.songName,
          artistName: song.artistName,
          album: song.albumName,
          thumbnailUrl: song.image,
          duration: song.duration,
          audioUrl: song.audio,
        })),
      }));

      // Map liked songs
      const likedData = likedSongs.data;

      const likedSongsItem: LibraryItem = {
        id: 'liked_songs', // ID cố định cho danh sách bài hát yêu thích
        name: 'Bài hát ưa thích',
        category: 'playlist',
        isLiked: true,
        songs: likedData.map((song: any) => ({
          songId: song.songId,
          title: song.title,
          artistName: song.artistName,
          album: song.album,
          thumbnailUrl: song.thumbnailUrl,
          duration: song.duration,
          audioUrl: song.audioUrl,
        })),
      };
      // Map followed artists
      const followedArtists = followedArtistsResponse.data;
      const mappedArtists: LibraryItem[] = followedArtists.map(
        (artist: any) => ({
          id: `artist_${artist.artistID}`,
          name: artist.artistName,
          category: 'artist',
          imageUrl: artist.image,
        }),
      );

      // Gộp tất cả lại
      const allLibraryItems = [
        likedSongsItem,
        ...mappedArtists,
        ...mappedPlaylists,
      ];
      setLibraryItems(allLibraryItems);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu thư viện:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <HeaderLibrary />
        <LibraryContent libraryItems={libraryItems} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    marginVertical: 20,
    borderWidth: 1,
    height: '100%',
  },
});

export default LibraryScreen;
