import React, {useEffect, useState, useCallback, use} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Image,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import {debounce} from 'lodash';
import SongItem from './SongItem';
import {Track} from 'react-native-track-player';
import {usePlayer} from '../contexts/PlayerContextV2';
import auth from '@react-native-firebase/auth';
import {findUserByUid} from '../sqlite/userService';
import {downloadSong} from '../utils/index';

import api from '../services/api';
import { useFocusEffect } from '@react-navigation/native';

import DownloadProgressModal from './DownLoad/DownloadProgressModal';


type SavedTrack = {
  track: {
    id: number;
    name: string;
    preview_url: string | null;
    album: {images: {url: string}[]};
    artists: {name: string}[];
  };
};

interface Props {
  title: string;
  tracks: SavedTrack[];
  onEndReached?: () => void;
  totalCount: number;
  isLoading?: boolean;
  filterByLikedSongs?: boolean;
}

interface LikedSong {
  songId: string;
}

const TrackListScreen: React.FC<Props> = ({
  title,
  tracks,
  totalCount = 0,
  onEndReached,
  isLoading,
  filterByLikedSongs,
}) => {
  const navigation = useNavigation();
  const {play, currentTrack, isPlaying, queue, addToQueue, pause} = usePlayer();

  const [trackList, setTrackList] = useState<Track[]>([]);
  const [searchedTracks, setSearchedTracks] = useState<Track[]>([]);
  const [input, setInput] = useState('');
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [currentSort, setCurrentSort] = useState<string>('title');
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const [likedSongs, setLikedSongs] = useState<Map<string, boolean>>(new Map());

  useEffect(() => {
    if (filterByLikedSongs) {
      const updatedTracks = trackList.filter(track => likedSongs.get(track.id));
      setSearchedTracks(updatedTracks);
    }
  }, [likedSongs, trackList, filterByLikedSongs]);
  

  const likedTracks = searchedTracks.filter(track => likedSongs.get(track.id));

  

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        // Convert SavedTrack to Track
        const convertedTrackList: Track[] = tracks.map(item => ({
          id: String(item.track.id), // Convert id to string
          url: item.track.preview_url || '', // Use preview_url from Spotify
          title: item.track.name, // Use name as title
          artist: item.track.artists.map(artist => artist.name).join(', '), // Join artists names
          artwork: item.track.album.images[0]?.url || '', // Get artwork from album
          duration: 180, // Example duration, replace with real data
        }));

        //setTracks(mockData); // Set the mock data state for display
        setTrackList(convertedTrackList); // Set the Track type list for actions
        await addToQueue(convertedTrackList); // Add converted tracks to the queue
        setSearchedTracks(convertedTrackList);
      } catch (error) {
        console.error('Failed to load playlist:', error);
      }
    };

    fetchPlaylist();
    console.log('Liked songs:', likedSongs);
  }, [tracks]);

  useEffect(() => {
    
    const fetchLikedSongs = async () => {
      try {
        const response = await api.get('/liked/liked-song-ids');
        const likedIds = response.data;
        console.log('likedIds:', likedIds);

        if (likedIds?.length) {

          const likedMap = new Map<string, boolean>();
      likedIds.forEach((id: number | string) => {
        likedMap.set(String(id), true);
      });

          setLikedSongs(likedMap);
          console.log('likedMap:', likedMap);
        }
      } catch (error) {
        console.error('Error fetching liked songs:', error);
      }
    };

    fetchLikedSongs();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchLikedSongs = async () => {
        try {
          const response = await api.get('/liked/liked-song-ids');
          const likedIds = response.data;
          const likedMap = new Map<string, boolean>();
          likedIds.forEach((id: number | string) => {
            likedMap.set(String(id), true);
          });
          setLikedSongs(likedMap);
          console.log('likedMap updated in focus:', likedMap);
        } catch (error) {
          console.error('Error fetching liked songs:', error);
        }
      };
  
      fetchLikedSongs();
    }, [])
  );
  

  const displayTracks = searchedTracks.map(track => ({
    ...track,
    isLiked: likedSongs.get(String(track.id)) === true,
  }));

  const handleTrackPress = async (track: Track) => {
    await play(track);
  };

  const handleSearch = useCallback(
    debounce((text: string) => {
      if (text.trim() === '') {
        setSearchedTracks(trackList);
        return;
      }
      const filtered = trackList.filter(track =>
        track.title?.toLowerCase().includes(text.toLowerCase()),
      );
      setSearchedTracks(filtered);
    }, 300),
    [trackList],
  );

  const handleShuffle = async () => {
    const shuffled = [...trackList].sort(() => Math.random() - 0.5);
    await addToQueue(shuffled);
    if (shuffled.length > 0) {
      await play(shuffled[0]);
    }
    setIsShuffle(!isShuffle);
  };

  const handleSort = (type: 'title' | 'artist') => {
    const sorted = [...searchedTracks].sort((a, b) =>
      (a[type] ?? '').localeCompare(b[type] ?? ''),
    );
    setSearchedTracks(sorted);
    console.log('Sorted tracks:', sorted);
    setSortModalVisible(false);
  };


  const handleLikePress = async (track: Track) => {
    const isCurrentlyLiked = likedSongs.get(track.id) || false;
  
    try {
      if (isCurrentlyLiked) {
        // Nếu đang thích, gọi API để bỏ thích
        await api.delete(`/liked/dislike/${track.id}`);
      } else {
        // Nếu chưa thích, gọi API để thích
        await api.post(`/liked/like/${track.id}`);
      }
  
      // Cập nhật lại state sau khi server xử lý thành công
      setLikedSongs(prev => {
        const updated = new Map(prev);
        updated.set(track.id, !isCurrentlyLiked);
        return updated;
      });

      // Cập nhật lại searchedTracks để trigger render lại giao diện
    setSearchedTracks(prev =>
      prev.map(t =>
        t.id === track.id ? { ...t, isLiked: !isCurrentlyLiked } : t
      )
    );
  
    } catch (error) {
      console.error("Error while syncing like/dislike with server:", error);
    }
  };
  
  const Count = Array.from(searchedTracks.values()).filter(v => v).length;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };


  const handleDownload = async () => {
    const user = auth().currentUser;
    if (!user) {
      console.log('No user is logged in');
      return;
    }
    setShowDownloadModal(true);
    setIsDownloading(true);
    setProgress(0);

    try {
      const userData = await findUserByUid(user.uid);
      if (!userData) {
        console.log('User not found in SQLite');
        setIsDownloading(false);
        return;
      }

      let totalSteps = tracks.length * 100;

      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        const song = {
          id: track.track.id,
          name: track.track.name,
          artist: track.track.artists.map(artist => artist.name).join(', '),
          image_url: track.track.album.images[0]?.url || '',
          audio_url: track.track.preview_url || '',
        };

        await downloadSong(userData.id, song, percent => {
          const songProgress = i * 100 + percent;
          const overallPercent = Math.floor((songProgress / totalSteps) * 100);
          setProgress(overallPercent);
        });

        console.log(`Saved song: ${song.name}`);
      }

      console.log('All liked songs have been saved.');
    } catch (error) {
      console.error('Error saving liked songs:', error);
    }

    setIsDownloading(false);
    setTimeout(() => {
      setShowDownloadModal(false);
    }, 1000);
  };

  

  return (
    <LinearGradient
      colors={['#2a41a9', '#121212']}
      locations={[0, 0.5]}
      style={styles.container}>
      <FlatList
        data={searchedTracks }
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <SongItem
            item={item}
            onPress={handleTrackPress}
            isPlaying={item.id == currentTrack?.id}
            isLiked={likedSongs.get(item.id) || false}
            onLikePress={() => handleLikePress(item)}
          />
        )}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
          <>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>

            <View style={styles.searchContainer}>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}>
                <View style={styles.searchInputContainer}>
                  <AntDesign name="search1" size={20} color="white" />
                  <TextInput
                    value={input}
                    onChangeText={text => {
                      setInput(text);
                      handleSearch(text);
                    }}
                    placeholder="Tìm trong danh sách"
                    placeholderTextColor="lightgrey"
                    style={styles.searchInput}
                  />
                </View>
              </KeyboardAvoidingView>
              <Pressable
                onPress={() => setSortModalVisible(true)}
                style={styles.sortButton}>
                <Text style={styles.sortButtonText}>Sắp xếp</Text>
              </Pressable>
            </View>

            <View
              style={{
                alignItems: 'center',
                marginVertical: 15,
                paddingHorizontal: 10,
              }}>
              {/* Ảnh ở giữa */}
              <Image
                source={{
                  uri: currentTrack?.artwork || queue[0]?.artwork,
                }}
                style={{
                  width: 250,
                  height: 250,
                  borderRadius: 10,
                  marginBottom: 10,
                }}
                resizeMode="cover"
              />

              {/* Tên bài hát */}
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#fff',
                  textAlign: 'center',
                  marginBottom: 4,
                }}>
                Song: {currentTrack?.title || queue[0]?.title}
              </Text>

              {/* Tên ca sĩ */}
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 16,
                  color: '#ccc',
                  textAlign: 'center',
                }}>
                Artist: {currentTrack?.artist || queue[0]?.artist}
              </Text>
            </View>

            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>{title}</Text>
              {totalCount > 0 && (
                //<Text style={styles.countText}>{totalCount} bài hát</Text>
                <Text style={styles.countText}>({Count}) bài hát</Text>
              )}
            </View>

            <View style={styles.playHeader}>
              <Pressable
                style={styles.downloadButton}
                onPress={() => handleDownload()}>
                <AntDesign name="arrowdown" size={20} color="white" />
              </Pressable>
              <View style={styles.playControls}>
                <Pressable onPress={handleShuffle}>
                  <MaterialCommunityIcons
                    name="cross-bolnisi"
                    size={24}
                    color={isShuffle ? '#1DB954' : '#ffffff'}
                  />
                </Pressable>
                <Pressable
                  onPress={() => {
                    if (isPlaying) {
                      pause();
                    } else {
                      if (currentTrack) {
                        play(currentTrack);
                      } else if (searchedTracks.length > 0) {
                        play(searchedTracks[0]);
                      }
                    }
                  }}
                  style={styles.playButton}>
                  {isPlaying ? (
                    <Entypo name="controller-paus" size={20} color="white" />
                  ) : (
                    <Entypo name="controller-play" size={20} color="white" />
                  )}
                </Pressable>
              </View>
            </View>

            {isLoading && (
              <ActivityIndicator
                size="large"
                color="gray"
                style={{marginVertical: 20}}
              />
            )}
          </>
        )}
      />

      <DownloadProgressModal
        visible={showDownloadModal}
        progress={progress}
        isDownloading={isDownloading}
        onClose={() => setShowDownloadModal(false)}
      />

      {/* Modal sắp xếp */}
      <Modal
        visible={sortModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSortModalVisible(false)}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setSortModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.headerText}>Sắp xếp theo</Text>
            {[
              {label: 'Tiêu đề', value: 'title'},
              {label: 'Nghệ sĩ', value: 'artist'},
            ].map(option => (
              <TouchableOpacity
                key={option.value}
                style={styles.option}
                onPress={() => {
                  setCurrentSort(option.value);
                  handleSort(option.value == 'title' ? 'title' : 'artist');
                }}>
                <Text style={styles.optionText}>{option.label}</Text>
                {currentSort === option.value && (
                  <Text style={styles.checkmark}>✔️</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 60, // Space for mini player
    paddingTop: 50,
    backgroundColor: '#121212',
  },
  scrollView: {
    marginTop: 50,
  },
  backButton: {
    marginHorizontal: 10,
  },
  searchContainer: {
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 9,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#3a4889',
    padding: 9,
    flex: 1,
    borderRadius: 3,
    height: 38,
  },
  searchInput: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
    width: '100%',
    height: 37,
  },
  sortButton: {
    marginHorizontal: 10,
    backgroundColor: '#3a4889',
    padding: 10,
    borderRadius: 3,
    height: 38,
  },
  sortButtonText: {
    color: 'white',
  },
  titleContainer: {
    marginHorizontal: 10,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  countText: {
    color: 'white',
    fontSize: 13,
    marginTop: 5,
  },
  playHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  downloadButton: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: '#1fd662',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1fd662',
  },
  listContent: {
    paddingBottom: 100,
  },
  // modalContent: {
  //   height: '100%',
  //   width: '100%',
  //   backgroundColor: '#5072A7',
  // },
  modalInner: {
    height: '100%',
    width: '100%',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  modalBody: {
    padding: 10,
  },
  albumArt: {
    width: '100%',
    height: 330,
    borderRadius: 4,
    marginTop: 20,
  },
  songInfoContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  songTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  artistName: {
    color: '#D3D3D3',
    marginTop: 4,
  },
  modalProgressContainer: {
    marginTop: 20,
  },
  modalProgressBar: {
    width: '100%',
    height: 3,
    backgroundColor: 'gray',
    borderRadius: 5,
    position: 'relative',
  },
  modalProgressCircle: {
    position: 'absolute',
    top: -5,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  timeContainer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 15,
    color: '#D3D3D3',
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  progressFill: {
    height: 3,
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 5,
  },
  playButtonBig: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#121212',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 30,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  optionText: {
    fontSize: 16,
    color: 'white',
  },
  checkmark: {
    fontSize: 18,
    color: 'green',
  },
});

// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   ActivityIndicator,
//   StyleSheet,
//   FlatList,
//   Image,
//   Modal,
//   Pressable,
//   Text,
//   TextInput,
//   View,
//   TouchableOpacity,
//   Dimensions,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { useNavigation } from '@react-navigation/native';
// import { debounce } from 'lodash';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Entypo from 'react-native-vector-icons/Entypo';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { usePlayer } from '../contexts/PlayerContextV2';
// import SongItem from '../components/SongItem';
// import { Track } from 'react-native-track-player';

// const { width } = Dimensions.get('window');
// type SavedTrack = {
//   track: {
//     id: number;
//     name: string;
//     preview_url: string | null;
//     album: { images: { url: string }[] };
//     artists: { name: string }[];
//   };
// };

// interface Props {
//   title: string;
//   tracks: SavedTrack[];
//   onEndReached?: () => void;
//   totalCount: number;
//   isLoading?: boolean;
// }

// const TrackListScreen: React.FC<Props> = ({
//   title,
//   tracks,
//   totalCount = 0,
//   onEndReached,
//   isLoading,
// }) => {
//   const navigation = useNavigation();
//   const { play, currentTrack, isPlaying, queue, addToQueue } = usePlayer();

//   const [trackList, setTrackList] = useState<Track[]>([]);
//   const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
//   const [input, setInput] = useState('');
//   const [sortModalVisible, setSortModalVisible] = useState(false);

//   useEffect(() => {
//     const initialize = async () => {
//       const converted = tracks.map(item => ({
//         id: String(item.track.id),
//         url: item.track.preview_url || '',
//         title: item.track.name,
//         artist: item.track.artists.map(a => a.name).join(', '),
//         artwork: item.track.album.images[0]?.url || '',
//         duration: 180,
//       }));

//       setTrackList(converted);
//       setFilteredTracks(converted);
//       await addToQueue(converted);
//     };

//     initialize();
//   }, [tracks, addToQueue]);

//   const handleTrackPress = async (track: Track) => {
//     await play(track);
//   };

//   const handleSearch = useCallback(
//     debounce((text: string) => {
//       if (text.trim() === '') {
//         setFilteredTracks(trackList);
//         return;
//       }
//       const filtered = trackList.filter(track =>
//         track.name.toLowerCase().includes(text.toLowerCase())
//       );
//       setFilteredTracks(filtered);
//     }, 300),
//     [trackList]
//   );

//   const handleShuffle = async () => {
//     const shuffled = [...trackList].sort(() => Math.random() - 0.5);
//     await addToQueue(shuffled);
//     if (shuffled.length > 0) {
//       await play(shuffled[0]);
//     }
//   };

//   const handleSort = (type: 'title' | 'artist') => {
//     const sorted = [...filteredTracks].sort((a, b) =>
//       (a[type] ?? '').localeCompare(b[type] ?? '')
//     );
//     setFilteredTracks(sorted);
//     setSortModalVisible(false);
//   };

//   const renderHeader = () => (
//     <>
//       <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
//         <Ionicons name="arrow-back" size={24} color="white" />
//       </Pressable>

//       <View style={styles.searchContainer}>
//         <View style={styles.searchInputContainer}>
//           <AntDesign name="search1" size={20} color="white" />
//           <TextInput
//             value={input}
//             onChangeText={text => {
//               setInput(text);
//               handleSearch(text);
//             }}
//             placeholder="Tìm trong danh sách"
//             placeholderTextColor="lightgrey"
//             style={styles.searchInput}
//           />
//         </View>
//         <Pressable onPress={() => setSortModalVisible(true)} style={styles.sortButton}>
//           <Text style={styles.sortButtonText}>Sắp xếp</Text>
//         </Pressable>
//       </View>

//       <View style={styles.currentTrackInfo}>
//         <Image
//           source={{ uri: currentTrack?.artwork || queue[0]?.artwork }}
//           style={styles.artwork}
//           resizeMode="cover"
//         />
//         <Text numberOfLines={1} style={styles.songTitle}>
//           Song: {currentTrack?.title || queue[0]?.title}
//         </Text>
//         <Text numberOfLines={1} style={styles.songArtist}>
//           Artist: {currentTrack?.artist || queue[0]?.artist}
//         </Text>
//       </View>

//       <View style={styles.titleContainer}>
//         <Text style={styles.titleText}>{title}</Text>
//         {totalCount > 0 && (
//           <Text style={styles.countText}>{totalCount} bài hát</Text>
//         )}
//       </View>

//       <View style={styles.playHeader}>
//         <Pressable style={styles.downloadButton}>
//           <AntDesign name="arrowdown" size={20} color="white" />
//         </Pressable>
//         <View style={styles.playControls}>
//           <Pressable onPress={handleShuffle}>
//             <MaterialCommunityIcons name="cross-bolnisi" size={24} color="#1DB954" />
//           </Pressable>
//           <Pressable
//             onPress={() => {
//               if (filteredTracks.length > 0) play(filteredTracks[0]);
//             }}
//             style={styles.playButton}
//           >
//             <Entypo name="controller-play" size={24} color="white" />
//           </Pressable>
//         </View>
//       </View>

//       {isLoading && (
//         <ActivityIndicator size="large" color="gray" style={{ marginVertical: 20 }} />
//       )}
//     </>
//   );

//   return (
//     <LinearGradient colors={['#614385', '#516395']} style={styles.container}>
//       <FlatList
//         data={filteredTracks}
//         keyExtractor={item => item.id}
//         renderItem={({ item }) => (
//           <SongItem
//             item={item}
//             onPress={handleTrackPress}
//             isPlaying={item.id === currentTrack?.id}
//           />
//         )}
//         onEndReached={onEndReached}
//         onEndReachedThreshold={0.5}
//         contentContainerStyle={styles.listContent}
//         ListHeaderComponent={renderHeader}
//       />

//       {/* Modal sắp xếp */}
//       <Modal
//         visible={sortModalVisible}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setSortModalVisible(false)}
//       >
//         <TouchableOpacity style={styles.modalOverlay} onPress={() => setSortModalVisible(false)}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Sắp xếp theo</Text>
//             <Pressable onPress={() => handleSort('title')} style={styles.modalOption}>
//               <Text style={styles.modalOptionText}>Tên bài hát</Text>
//             </Pressable>
//             <Pressable onPress={() => handleSort('artist')} style={styles.modalOption}>
//               <Text style={styles.modalOptionText}>Nghệ sĩ</Text>
//             </Pressable>
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 12,
//     paddingTop: 50,
//   },
//   backButton: {
//     position: 'absolute',
//     top: 50,
//     left: 20,
//     zIndex: 10,
//   },
//   searchContainer: {
//     marginTop: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   searchInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#3D3D3D',
//     borderRadius: 20,
//     paddingHorizontal: 10,
//     flex: 1,
//     height: 40,
//   },
//   searchInput: {
//     flex: 1,
//     marginLeft: 8,
//     color: 'white',
//     fontSize: 16,
//   },
//   sortButton: {
//     backgroundColor: '#3D3D3D',
//     borderRadius: 20,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//   },
//   sortButtonText: {
//     color: 'white',
//     fontSize: 14,
//   },
//   currentTrackInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 20,
//     gap: 12,
//   },
//   artwork: {
//     width: 60,
//     height: 60,
//     borderRadius: 8,
//     backgroundColor: '#555',
//   },
//   songTitle: {
//     flex: 1,
//     fontSize: 16,
//     fontWeight: '600',
//     color: 'white',
//   },
//   songArtist: {
//     flex: 1,
//     fontSize: 14,
//     color: 'lightgrey',
//   },
//   titleContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   titleText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   countText: {
//     marginTop: 4,
//     fontSize: 14,
//     color: 'lightgrey',
//   },
//   playHeader: {
//     marginTop: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   downloadButton: {
//     backgroundColor: '#1DB954',
//     padding: 8,
//     borderRadius: 50,
//   },
//   playControls: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 20,
//   },
//   playButton: {
//     backgroundColor: '#1DB954',
//     padding: 12,
//     borderRadius: 50,
//   },
//   listContent: {
//     paddingBottom: 80,
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: '#2C2C2C',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   modalOption: {
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#444',
//   },
//   modalOptionText: {
//     fontSize: 16,
//     color: 'white',
//     textAlign: 'center',
//   },
// });

export default TrackListScreen;
