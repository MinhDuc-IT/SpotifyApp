import React, { useCallback, useEffect, useState } from 'react';
import TrackListScreen from '../components/TrackList';
import api from '../services/api';

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
      const response = await api.get('/liked/liked-song');
      const data = response.data;
      console.log('Kết quả tìm kiếm:', data);

      if (data?.length) {

        // Map từ SongDto → format track
    const mappedTracks = data.map((song: LikedSong) => ({
      track: {
        name: song.title,
        id: song.songId,
        preview_url: song.audioUrl,
        album: {
          images: [{ url: song.thumbnailUrl }],
        },
        artists: [{ name: song.artistName }],
      },
    }));

        setTracks((prev) => [...prev, ...mappedTracks]);
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
      title="Liked Songs"
      tracks={tracks}
      //onEndReached={fetchTracks}
      totalCount={totalItems}
      isLoading={loading}
    />
  );
};

export default LikedSongsScreen;