import React, {useCallback, useEffect, useState} from 'react';
import TrackListScreen from './TrackList';
import {getDownloadedLikedSongsByUser} from '../../sqlite/songService';
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';

interface LikedSong {
  id: number;
  name: string;
  artist: string;
  album: string;
  image_url: string;
  duration: number;
  audio_url: string;
}

const LikedSongsDownload = () => {
  const [tracks, setTracks] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchTracks = useCallback(async () => {
    if (loading ) return;
    setLoading(true);
    try {
      const user = auth().currentUser;
      if (!user) {
        console.log('No user is logged in');
        return;
      }
  
      const response = await getDownloadedLikedSongsByUser(user.uid);
      const data = response;
      console.log('Kết quả tìm kiếm:', data);
  
      if (data?.length) {
        const mappedTracks = data.map((song: LikedSong) => ({
          track: {
            name: song.name,
            id: song.id,
            preview_url: 'file://'+song.audio_url,
            album: {
              images: [{url: 'file://'+song.image_url}],
            },
            artists: [{name: song.artist}],
          },
        }));

        setTracks(prev => [...prev, ...mappedTracks]);
        setTotalItems(data.length);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API bài hát:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useFocusEffect(
    useCallback(() => {
      fetchTracks();
  
      return () => {
        // Nếu cần cleanup gì đó, đặt ở đây. Không thì return void cũng được.
      };
    }, [fetchTracks])
  );
  

  return (
    <TrackListScreen
      tracks={tracks}
      //onEndReached={fetchTracks}
      totalCount={totalItems}
      isLoading={loading}
    />
  );
};

export default LikedSongsDownload;
