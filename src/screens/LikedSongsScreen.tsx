import React, { useEffect, useState } from 'react';
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


// API giả trả về dữ liệu bài hát yêu thích (bổ sung thuộc tính track)
const fetchLikedTracks = async () => {
  try {
    const response = await api.get('/liked/liked-song');
      const data = response.data;
      console.log('liked songs:', data); // Log the profile data for debugging

      const likedSongs = data;

      // Map từ SongDto → format track
    const formattedTracks = likedSongs.map((song: LikedSong) => ({
      track: {
        name: song.title,
        preview_url: song.audioUrl,
        album: {
          images: [{ url: song.thumbnailUrl }],
        },
        artists: [{ name: song.artistName }],
      },
    }));

    return formattedTracks;
  } catch (error) {
    console.error('Error fetching liked songs:', error);
    return [];
  }
};

const LikedSongsScreen = () => {
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const tracks = await fetchLikedTracks();
      setTotalCount(tracks.length);
    };
    fetchCount();
  }, []);

  return (
    <TrackListScreen
      title="Liked Songs"
      fetchTracks={fetchLikedTracks}
      totalCount={totalCount}
    />
  );
};

export default LikedSongsScreen;