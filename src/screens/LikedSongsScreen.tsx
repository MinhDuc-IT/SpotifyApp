import React, { useCallback, useEffect, useState } from 'react';
import TrackListScreen from '../components/TrackList';
import api from '../services/api';

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
      const response = await api.get("/song", {
        params: {
          page,
          limit: LIMIT,
        },
      });
      const data = response.data;

      if (data?.items?.length) {
        const mappedTracks = data.items.map((song: any) => ({
          track: {
            id: song.songID,
            name: song.songName,
            preview_url: song.audio,
            album: {
              images: [{ url: song.image }],
            },
            artists: [{ name: song.artist || 'Unknown Artist' }],
          },
        }));

        setTracks((prev) => [...prev, ...mappedTracks]);
        setTotalPages(data.totalPages);
        setTotalItems(data.totalItems);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API bài hát:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, totalPages]);

  useEffect(() => {
    fetchTracks();
  }, []);

  return (
    <TrackListScreen
      title="Liked Songs"
      tracks={tracks}
      onEndReached={fetchTracks}
      totalCount={totalItems}
      isLoading={loading}
    />
  );
};

export default LikedSongsScreen;