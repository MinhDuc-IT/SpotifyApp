import React, {useEffect, useState, useCallback} from 'react';
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import {debounce} from 'lodash';
import SongItem from './SongItem';
import {Track} from 'react-native-track-player';
import {usePlayer} from '../contexts/PlayerContextV2';
import auth from '@react-native-firebase/auth';
import {findUserByUid} from '../sqlite/userService';
import {downloadLikeSong, downloadPlayListSong} from '../utils/index';
import {createPlayList} from '../sqlite/playListService';

import api from '../services/api';
import {useFocusEffect} from '@react-navigation/native';

import DownloadProgressModal from './DownLoad/DownloadProgressModal';
import {useActionSheet} from '../contexts/ActionSheetContext';

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
  isInPlayListScreen?: boolean;
  playlistId: string;
  onSongRemoved?: (songId: number) => void; // Callback to remove song from playlist
  isPlayList?: boolean;
}

const TrackListScreen: React.FC<Props> = ({
  title,
  tracks,
  totalCount = 0,
  onEndReached,
  isLoading,
  filterByLikedSongs,
  isInPlayListScreen,
  isPlayList,
  playlistId,
  onSongRemoved,
}) => {
  const navigation = useNavigation();
  const {play, currentTrack, isPlaying, queue, addToQueue, pause} = usePlayer();
  const {showActionSheet, setIsInPlayListScreen, setPlaylistId} = useActionSheet();
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

  // const [openActionSheet, setOpenActionSheet] = useState(false);
  // const [selectedItem, setSelectedItem] = useState<ActionItem | null>(null);

  // Nếu TrackList nhận props từ cha:
  useEffect(() => {
    setIsInPlayListScreen(isInPlayListScreen ?? false);
    console.log('playlistId:', playlistId, 'Kiểu:', typeof playlistId);
    if (playlistId) {
      setPlaylistId(playlistId); // <-- Truyền sang context
    }
    return () => {
      setIsInPlayListScreen(false);
      setPlaylistId(null); // dọn dẹp
    };
  }, [isInPlayListScreen, playlistId]);

  const { setOnSongRemoved } = useActionSheet();

  useEffect(() => {
    if (onSongRemoved) {
      setOnSongRemoved(() => onSongRemoved);  // truyền callback vào context
    }
  }, [onSongRemoved]);

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
    }, []),
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
          t.id === track.id ? {...t, isLiked: !isCurrentlyLiked} : t,
        ),
      );
    } catch (error) {
      console.error('Error while syncing like/dislike with server:', error);
    }
  };

  const Count = Array.from(searchedTracks.values()).filter(v => v).length;

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

      if (isPlayList) {
        await createPlayList(userData.id, playlistId, title);
        for (let i = 0; i < tracks.length; i++) {
          const track = tracks[i];
          const song = {
            id: track.track.id,
            name: track.track.name,
            artist: track.track.artists.map(artist => artist.name).join(', '),
            image_url: track.track.album.images[0]?.url || '',
            audio_url: track.track.preview_url || '',
          };

          await downloadPlayListSong(userData.id, playlistId, song, percent => {
            const songProgress = i * 100 + percent;
            const overallPercent = Math.floor(
              (songProgress / totalSteps) * 100,
            );
            setProgress(overallPercent);
          });

          console.log(`Saved song: ${song.name}`);
        }
      } else {
        for (let i = 0; i < tracks.length; i++) {
          const track = tracks[i];
          const song = {
            id: track.track.id,
            name: track.track.name,
            artist: track.track.artists.map(artist => artist.name).join(', '),
            image_url: track.track.album.images[0]?.url || '',
            audio_url: track.track.preview_url || '',
          };

          await downloadLikeSong(userData.id, song, percent => {
            const songProgress = i * 100 + percent;
            const overallPercent = Math.floor(
              (songProgress / totalSteps) * 100,
            );
            setProgress(overallPercent);
          });

          console.log(`Saved song: ${song.name}`);
        }
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

  const handleOpenOptions = (track: Track) => {
    const convertedItem = {
      id: track.id,
      name: track.title ?? '',
      type: 'track',
      image: track.artwork ?? '',
      audio: track.url ?? '',
    };
    showActionSheet(convertedItem);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={searchedTracks}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <SongItem
            item={item}
            onPress={handleTrackPress}
            isPlaying={item.id == currentTrack?.id}
            isLiked={likedSongs.get(item.id) || false}
            onLikePress={() => handleLikePress(item)}
            onOpenOptions={handleOpenOptions}
          />
        )}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
          <LinearGradient
            colors={['#4162fb', '#121212']}
            style={styles.headerContainer}>
            <>
              <Pressable
                onPress={() => navigation.goBack()}
                style={styles.backButton}>
                <Entypo name="chevron-thin-left" size={20} color="white" />
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

              {!filterByLikedSongs && (
                <View
                  style={{
                    alignItems: 'center',
                    marginVertical: 10,
                    paddingHorizontal: 10,
                  }}>
                  <Image
                    source={{
                      uri: currentTrack?.artwork || queue[0]?.artwork,
                    }}
                    style={{
                      width: 250,
                      height: 250,
                      marginBottom: 10,
                    }}
                    resizeMode="cover"
                  />
                </View>
              )}

              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{title}</Text>
                {totalCount > 0 && (
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
                      <Entypo name="controller-paus" size={20} color="black" />
                    ) : (
                      <Entypo name="controller-play" size={20} color="black" />
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
          </LinearGradient>
        )}
      />

      <DownloadProgressModal
        visible={showDownloadModal}
        progress={progress}
        isDownloading={isDownloading}
        onClose={() => setShowDownloadModal(false)}
      />

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 60,
    backgroundColor: '#121212',
  },
  headerContainer: {
    paddingTop: 30,
    marginBottom: 10,
  },
  backButton: {
    marginHorizontal: 10,
  },
  searchContainer: {
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#495aa8',
    paddingHorizontal: 5,
    borderRadius: 3,
  },
  searchInput: {
    fontSize: 12,
    color: 'white',
    flex: 1,
    height: 37,
    marginVertical: -5,
  },
  sortButton: {
    backgroundColor: '#495aa8',
    borderRadius: 3,
    marginLeft: 5,
    padding: 5,
  },
  sortButtonText: {
    color: 'white',
    fontSize: 12,
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

export default TrackListScreen;
