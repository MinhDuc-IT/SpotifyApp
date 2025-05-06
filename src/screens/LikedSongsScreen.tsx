import React, {useCallback, useEffect, useState} from 'react';
import TrackListScreen from '../components/TrackList';
import api from '../services/api';
import { useFocusEffect } from '@react-navigation/native';

interface LikedSong {
  songId: number;
  title: string;
  artistName: string;
  album: string;
  thumbnailUrl: string;
  duration: number;
  audioUrl: string;
}

const LIMIT = 10;

const LikedSongsScreen = () => {
  const [tracks, setTracks] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchTracks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/liked/liked-song');
      const data = response.data;
  
      if (data?.length) {
        const mappedTracks = data.map((song: LikedSong) => ({
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
  
        setTracks(mappedTracks);
        setTotalItems(data.length);
      } else {
        setTracks([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API bài hát:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTracks();
    }, [])
  );
  
  return (
    <TrackListScreen
      title="Bài hát ưa thích"
      tracks={tracks}
      //onEndReached={fetchTracks}
      totalCount={totalItems}
      isLoading={loading}
      filterByLikedSongs={true}
    />
  );
};

export default LikedSongsScreen;
