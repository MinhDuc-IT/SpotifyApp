// import React from 'react';
// import TrackListScreen from '../components/TrackList';

// // API giả trả về dữ liệu bài hát yêu thích (bổ sung thuộc tính track)
// const fetchLikedTracks = async () => {
//   // Dữ liệu giả để thay thế cho API Spotify, bổ sung thuộc tính track
//   const mockLikedTracks = [
//     {
//       track: {
//         name: 'Song 1',
//         preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
//         album: {
//           images: [{ url: 'https://cdn.pixabay.com/photo/2012/04/01/12/48/record-23281_1280.png' }]
//         },
//         artists: [{ name: 'Artist 1' }]
//       }
//     },
//     {
//       track: {
//         name: 'Song 2',
//         preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
//         album: {
//           images: [{ url: 'https://cdn.pixabay.com/photo/2012/04/01/12/48/record-23281_1280.png' }]
//         },
//         artists: [{ name: 'Artist 2' }]
//       }
//     },
//     {
//       track: {
//         name: 'Song 3',
//         preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
//         album: {
//           images: [{ url: 'https://cdn.pixabay.com/photo/2012/04/01/12/48/record-23281_1280.png' }]
//         },
//         artists: [{ name: 'Artist 3' }]
//       }
//     },
//     // Thêm dữ liệu giả nếu cần
//   ];

//   return mockLikedTracks;
// };

// const LikedSongsScreen = () => {
//   return (
//     <TrackListScreen
//       title="Liked Songs"
//       fetchTracks={fetchLikedTracks} // Gọi API giả ở đây
//       totalCount={3} // Cập nhật tổng số bài hát giả
//     />
//   );
// };

// export default LikedSongsScreen;

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