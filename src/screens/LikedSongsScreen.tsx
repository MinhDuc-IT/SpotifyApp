import React from 'react';
import TrackListScreen from '../components/TrackList';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API giả trả về dữ liệu bài hát yêu thích (bổ sung thuộc tính track)
const fetchLikedTracks = async () => {
  // Dữ liệu giả để thay thế cho API Spotify, bổ sung thuộc tính track
  const mockLikedTracks = [
    {
      track: {
        name: 'Song 1',
        preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        album: {
          images: [{ url: 'https://via.placeholder.com/150' }]
        },
        artists: [{ name: 'Artist 1' }]
      }
    },
    {
      track: {
        name: 'Song 2',
        preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        album: {
          images: [{ url: 'https://via.placeholder.com/150' }]
        },
        artists: [{ name: 'Artist 2' }]
      }
    },
    {
      track: {
        name: 'Song 3',
        preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        album: {
          images: [{ url: 'https://via.placeholder.com/150' }]
        },
        artists: [{ name: 'Artist 3' }]
      }
    },
    // Thêm dữ liệu giả nếu cần
  ];

  return mockLikedTracks;
};

const LikedSongsScreen = () => {
  return (
    <TrackListScreen
      title="Liked Songs"
      fetchTracks={fetchLikedTracks} // Gọi API giả ở đây
      totalCount={3} // Cập nhật tổng số bài hát giả
    />
  );
};

export default LikedSongsScreen;
