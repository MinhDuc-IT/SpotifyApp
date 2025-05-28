import React, {useCallback, useEffect, useState} from 'react';
import TrackListScreen from '../components/TrackList';
import api from '../services/api';
import {useFocusEffect, useRoute} from '@react-navigation/native';

type PlayListItem = {
  id: string;
  name: string;
  category: 'artist' | 'playlist' | 'album' | 'podcast' | 'song';
  author?: string;
  lastUpdate?: string;
  imageUrl?: string;
  isLiked?: boolean;
  songs?: Song[];
};

interface Song {
  songId: number;
  title: string;
  artistName: string;
  album: string;
  thumbnailUrl: string;
  duration: number;
  audioUrl: string;
}

const PlayListScreen = () => {
  const [tracks, setTracks] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const route = useRoute();
  const {playListItem} = route.params as {playListItem?: PlayListItem};

  console.log('playListItem:', playListItem);

  useEffect(() => {
    if (playListItem?.songs?.length) {
      const mappedTracks = playListItem.songs.map((song: Song) => ({
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
      setTotalItems(playListItem.songs.length);
    }
  }, [playListItem]);

  const fetchTracks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/playlist/getAllPlayList');
      const data = response.data[0]?.songs || [];

      if (data.length) {
        const mappedTracks = data.map((song: any) => ({
          track: {
            name: song.songName,
            id: song.songID,
            preview_url: song.audio,
            album: {
              images: [{url: song.image}],
            },
            artists: [{name: 'hvduc'}],
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
      if (!playListItem?.songs?.length) {
        console.log('Fetching tracks from API...');
        fetchTracks();
      }
    }, [playListItem]),
  );

  const handleSongRemoved = (songId: number) => {
    setTracks(prev => prev.filter(item => item.track.id !== songId));
    setTotalItems(prev => prev - 1);
  };

  return (
    <TrackListScreen
      title={playListItem?.name || 'Default Playlist Name'}
      tracks={tracks}
      totalCount={totalItems}
      isLoading={loading}
      isInPlayListScreen={true}
      playlistId={playListItem?.id}
      onSongRemoved={handleSongRemoved}
    />
  );
};

export default PlayListScreen;
