import React, {useCallback, useEffect, useState} from 'react';
import TrackListScreen from '../components/DownLoad/TrackList';
import api from '../services/api';
import {getDownloadedLikedSongsByUser} from '../sqlite/songService';
import auth from '@react-native-firebase/auth';

interface LikedSong {
  id: number;
  name: string;
  artist: string;
  album: string;
  image_url: string;
  duration: number;
  audio_url: string;
}

const LIMIT = 10;

const LikedSongsDownload = () => {
  const [tracks, setTracks] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchTracks = useCallback(async () => {
    if (loading || page > totalPages) return;

    setLoading(true);

    try {
      // const response = await api.get("/song", {
      //   params: {
      //     page,
      //     limit: LIMIT,
      //   },
      // });
      const user = auth().currentUser;
      if (!user) {
        console.log('No user is logged in');
        return;
      }
      const response = await getDownloadedLikedSongsByUser(user.uid);
      const data = response;
      console.log('Kết quả tìm kiếm:', data);

      if (data?.length) {
        // Map từ SongDto → format track
        const mappedTracks = data.map((song: LikedSong) => ({
          track: {
            name: song.name,
            id: song.id,
            preview_url: song.audio_url,
            album: {
              images: [{url: song.image_url}],
            },
            artists: [{name: song.artist}],
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
  }, [loading]);

  useEffect(() => {
    fetchTracks();
  }, []);

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
