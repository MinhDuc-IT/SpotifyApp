import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
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
import SongItem from '../DownLoad/SongItem';
import {Track} from 'react-native-track-player';
import {usePlayer} from '../../contexts/PlayerContextV2';
import { useFocusEffect } from '@react-navigation/native';

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
  tracks: SavedTrack[];
  onEndReached?: () => void;
  totalCount: number;
  isLoading?: boolean;
}

const TrackListScreen: React.FC<Props> = ({
  tracks,
  totalCount = 0,
  onEndReached,
  isLoading,
}) => {
  const navigation = useNavigation();
  const {play, currentTrack, isPlaying, queue, addToQueue} = usePlayer();
  const [trackList, setTrackList] = useState<Track[]>([]);
  const [searchedTracks, setSearchedTracks] = useState<Track[]>([]);
  const [input, setInput] = useState('');
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [currentSort, setCurrentSort] = useState<string>('title');
  const [isShuffle, setIsShuffle] = useState<boolean>(false);

  console.log("tracks:", tracks)

  useFocusEffect(
    useCallback(() => {
      const fetchPlaylist = async () => {
        try {
          const convertedTrackList: Track[] = tracks.map(item => ({
            id: String(item.track.id),
            url: item.track.preview_url || '',
            title: item.track.name,
            artist: item.track.artists.map(artist => artist.name).join(', '),
            artwork: item.track.album.images[0]?.url || '',
            duration: 180,
          }));
  
          setTrackList(convertedTrackList);
          await addToQueue(convertedTrackList);
          setSearchedTracks(convertedTrackList);
        } catch (error) {
          console.error('Failed to load playlist:', error);
        }
      };
  
      fetchPlaylist();
  
      // Optional: return cleanup function if needed
      return () => {
        // Cleanup logic if any
      };
    }, [tracks])
  );
  
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
    setSortModalVisible(false);
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
          />
        )}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <LinearGradient
            colors={['#4162fb', '#121212']}
            style={styles.headerContainer}>
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
                    <AntDesign name="search1" size={16} color="white" />
                    <TextInput
                      value={input}
                      onChangeText={text => {
                        setInput(text);
                        handleSearch(text);
                      }}
                      placeholder="Tìm trong mục Bài hát đã thích"
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

              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Bài hát ưa thích</Text>
                {totalCount > 0 && (
                  <Text style={styles.countText}>{totalCount} bài hát</Text>
                )}
              </View>

              <View style={styles.playHeader}>
                <Pressable style={styles.downloadButton}>
                  <AntDesign name="arrowdown" size={16} color="white" />
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
                      if (searchedTracks.length > 0) play(searchedTracks[0]);
                    }}
                    style={styles.playButton}>
                    {isPlaying ? (
                      <Entypo name="controller-paus" size={24} color="black" />
                    ) : (
                      <Entypo name="controller-play" size={24} color="black" />
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
        }
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
    marginVertical: 15,
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
    marginBottom: 10,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  countText: {
    color: 'white',
    fontSize: 12,
    marginTop: 2,
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
    borderRadius: 15,
    backgroundColor: '#1DB954',
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
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1DB954',
  },
  listContent: {
    paddingBottom: 100,
    backgroundColor: '#121212',
    minHeight: '100%',
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
