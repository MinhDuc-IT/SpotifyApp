import React, {useCallback, useEffect, useState} from 'react';
import TrackListScreen from '../components/TrackList';
import api from '../services/api';
import {useRoute, RouteProp, useFocusEffect} from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

const LIMIT = 10;


interface ArtistSong {
  songId: number;
  title: string;
  artistName: string;
  album: string;
  albumID: number;
  thumbnailUrl: string;
  duration: number;
  audioUrl: string;
}

type SongInfoRouteProp = RouteProp<RootStackParamList, 'ArtistSongs'>;

const ArtistSongsScreen: React.FC = () => {
  const route = useRoute<SongInfoRouteProp>();
  console.log('route:', route.params);

  const item = route.params.item;
  console.log('item:', item);

  const artistId = item.artistId;
  console.log('artistId:', artistId, 'Kiểu:', typeof artistId);

  const [tracks, setTracks] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchTracks = async () => {
    if (loading || page > totalPages) return;

    setLoading(true);

    try {
      const response = await api.get(`/song/by-artist/${artistId}`);
      // const response = await api.get('/album//songs');
      const data = response.data;
      console.log('song by artist:', data);

      if (data?.length) {
        // Map từ SongDto → format track
        const mappedTracks = data.map((song: ArtistSong) => ({
          track: {
            name: song.title,
            id: song.songId,
            preview_url: song.audioUrl,
            album: {
              images: [{url: song.thumbnailUrl}],
            },
            artists: [{name: song.artistName}],
          },
        }));

        setTracks(prev => [...prev, ...mappedTracks]);
        // setTotalPages(data.totalPages);
        setTotalItems(data.length);
        // setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API bài hát:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracks();
    console.log('fetchTracks:', fetchTracks);
  }, []);

  return (
    <TrackListScreen
      title="Bài hát của nghệ sĩ"
      tracks={tracks}
      //onEndReached={fetchTracks}
      totalCount={totalItems}
      isLoading={loading}
      filterByLikedSongs={false}
    />
  );
};

export default ArtistSongsScreen;
