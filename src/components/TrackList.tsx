import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import {debounce} from 'lodash';
import {usePlayer} from '../contexts/PlayerContext';
import SongItem from './SongItem';
import {BottomModal} from './BottomModal';
import {ModalContent} from './ModalContent';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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
}

const TrackListScreen: React.FC<Props> = ({
  title,
  tracks,
  totalCount = 0,
  onEndReached,
  isLoading,
}) => {
  const navigation = useNavigation();
  const {state, dispatch} = usePlayer();
  const [searchedTracks, setSearchedTracks] = useState<SavedTrack[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const formattedTracks = tracks.map(t => t.track);
    dispatch({type: 'SET_QUEUE', queue: formattedTracks});
    setSearchedTracks(tracks);
  }, [tracks]);

  const play = (track: SavedTrack) => {
    dispatch({type: 'PLAY', track: track.track});
  };

  const handleSearch = debounce((text: string) => {
    const filtered = tracks.filter(item =>
      item.track.name.toLowerCase().includes(text.toLowerCase()),
    );
    setSearchedTracks(filtered);
  }, 500);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <LinearGradient colors={['#614385', '#516395']} style={styles.container}>
      {/* <ScrollView style={styles.scrollView}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>

        <Pressable style={styles.searchContainer}>
          <Pressable style={styles.searchInputContainer}>
            <AntDesign name="search1" size={20} color="white" />
            <TextInput
              value={input}
              onChangeText={(text) => {
                setInput(text);
                handleSearch(text);
              }}
              placeholder="Tìm trong danh sách"
              placeholderTextColor="lightgrey"
              style={styles.searchInput}
            />
          </Pressable>
          <Pressable style={styles.sortButton}>
            <Text style={styles.sortButtonText}>Sắp xếp</Text>
          </Pressable>
        </Pressable>

        {state.currentTrack?.album?.images?.[0]?.url ? (
            <View style={{alignItems: 'center', marginVertical: 15}}>
            <Image
              source={{uri: state.currentTrack?.album.images[0].url}}
              style={{
                width: 200,
                height: 200,
                borderRadius: 10,
              }}
              resizeMode="cover"
            />
          </View>
          ) : (
            <View style={{alignItems: 'center', marginVertical: 15}}>
            <Image
              source={{uri: state.queue[0]?.album?.images?.[0]?.url}}
              style={{
                width: 200,
                height: 200,
                borderRadius: 10,
              }}
              resizeMode="cover"
            />
          </View>
          )}

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{title}</Text>
          {totalCount > 0 && (
            <Text style={styles.countText}>{totalCount} bài hát</Text>
          )}
        </View>

        <Pressable style={styles.playHeader}>
          <Pressable style={styles.downloadButton}>
            <AntDesign name="arrowdown" size={20} color="white" />
          </Pressable>
          <View style={styles.playControls}>
            <MaterialCommunityIcons
              name="cross-bolnisi"
              size={24}
              color="#1DB954"
            />
            <Pressable 
              onPress={() => tracks[0] && play(tracks[0])} 
              style={styles.playButton}
            >
              <Entypo name="controller-play" size={24} color="white" />
            </Pressable>
          </View>
        </Pressable>

        {isLoading ? (
          <ActivityIndicator size="large" color="gray" />
        ) : (
          <FlatList
            data={searchedTracks}
            keyExtractor={(item) => item.track.id.toString()}
            renderItem={({ item }) => (
              <SongItem
                item={item}
                onPress={play}
                isPlaying={item.track.id === state.currentTrack?.id}
              />
            )}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            contentContainerStyle={styles.listContent}
          />
        )}
      </ScrollView> */}

      {/* <FlatList
        data={searchedTracks}
        keyExtractor={item => item.track.id.toString()}
        renderItem={({item}) => (
          <SongItem
            item={item}
            onPress={play}
            isPlaying={item.track.id === state.currentTrack?.id}
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

            <Pressable style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <AntDesign name="search1" size={20} color="white" />
                <TextInput
                  value={input}
                  onChangeText={text => {
                    setInput(text);
                    handleSearch(text);
                  }}
                  placeholder="Tìm trong bài hát đã thích"
                  placeholderTextColor="lightgrey"
                  style={styles.searchInput}
                />
              </View>
              <Pressable style={styles.sortButton}>
                <Text style={styles.sortButtonText}>Sắp xếp</Text>
              </Pressable>
            </Pressable>

            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>{title}</Text>
              {totalCount > 0 && (
                <Text style={styles.countText}>{totalCount} bài hát</Text>
              )}
            </View>

            <Pressable style={styles.playHeader}>
              <Pressable style={styles.downloadButton}>
                <AntDesign name="arrowdown" size={20} color="white" />
              </Pressable>
              <View style={styles.playControls}>
                <MaterialCommunityIcons
                  name="cross-bolnisi"
                  size={24}
                  color="#1DB954"
                />
                <Pressable
                  onPress={() => tracks[0] && play(tracks[0])}
                  style={styles.playButton}>
                  <Entypo name="controller-play" size={24} color="white" />
                </Pressable>
              </View>
            </Pressable>

            {isLoading && (
              <ActivityIndicator
                size="large"
                color="gray"
                style={{margin: 20}}
              />
            )}
          </>
        )}
      /> */}

      <FlatList
        data={searchedTracks}
        keyExtractor={item => item.track.id.toString()}
        renderItem={({item}) => (
          <SongItem
            item={item}
            onPress={play}
            isPlaying={item.track.id === state.currentTrack?.id}
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
              <Pressable style={styles.sortButton}>
                <Text style={styles.sortButtonText}>Sắp xếp</Text>
              </Pressable>
            </View>

            {/* <View style={{alignItems: 'center', marginVertical: 15}}>
              <Image
                source={{
                  uri:
                    state.currentTrack?.album.images?.[0]?.url ||
                    state.queue[0]?.album.images?.[0]?.url,
                }}
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 10,
                }}
                resizeMode="cover"
              />
            </View> */}

            <View
              style={{
                alignItems: 'center',
                marginVertical: 15,
                paddingHorizontal: 10,
              }}>
              {/* Ảnh ở giữa */}
              <Image
                source={{
                  uri:
                    state.currentTrack?.album.images?.[0]?.url ||
                    state.queue[0]?.album.images?.[0]?.url,
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
                Song: {state.currentTrack?.name || state.queue[0]?.name}
              </Text>

              {/* Tên ca sĩ */}
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 16,
                  color: '#ccc',
                  textAlign: 'center',
                }}>
                Artist: {state.currentTrack?.artists?.[0]?.name ||
                  state.queue[0]?.artists?.[0]?.name}
              </Text>
            </View>

            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>{title}</Text>
              {totalCount > 0 && (
                <Text style={styles.countText}>{totalCount} bài hát</Text>
              )}
            </View>

            <View style={styles.playHeader}>
              <Pressable style={styles.downloadButton}>
                <AntDesign name="arrowdown" size={20} color="white" />
              </Pressable>
              <View style={styles.playControls}>
                <MaterialCommunityIcons
                  name="cross-bolnisi"
                  size={24}
                  color="#1DB954"
                />
                <Pressable
                  onPress={() => tracks[0] && play(tracks[0])}
                  style={styles.playButton}>
                  <Entypo name="controller-play" size={24} color="white" />
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

      {/* <BottomModal
        visible={state.modalVisible}
        onClose={() => dispatch({ type: 'TOGGLE_MODAL' })}
      >
        <ModalContent style={styles.modalContent}>
          <View style={styles.modalInner}>
            <Pressable 
              style={styles.modalHeader}
              onPress={() => dispatch({ type: 'TOGGLE_MODAL' })}
            >
              <AntDesign name="down" size={24} color="white" />
              <Text style={styles.modalTitle}>{state.currentTrack?.name}</Text>
              <Entypo name="dots-three-vertical" size={24} color="white" />
            </Pressable>

            <View style={styles.modalBody}>
              <Image
                style={styles.albumArt}
                source={{ uri: state.currentTrack?.album.images[0]?.url }}
              />

              <View style={styles.songInfoContainer}>
                <View>
                  <Text style={styles.songTitle}>{state.currentTrack?.name}</Text>
                  <Text style={styles.artistName}>
                    {state.currentTrack?.artists[0]?.name}
                  </Text>
                </View>
                <AntDesign name="heart" size={24} color="#1DB954" />
              </View>

              <View style={styles.modalProgressContainer}>
                <View style={styles.modalProgressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${state.progress * 100}%` },
                    ]}
                  />
                  <View
                    style={[
                      styles.modalProgressCircle,
                      { left: `${state.progress * 100}%` },
                    ]}
                  />
                </View>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>
                    {formatTime(state.progress * state.duration)}
                  </Text>
                  <Text style={styles.timeText}>
                    {formatTime(state.duration)}
                  </Text>
                </View>
              </View>

              <View style={styles.playerControls}>
                <Pressable>
                  <FontAwesome name="arrows" size={30} color="#03C03C" />
                </Pressable>
                <Pressable onPress={() => dispatch({ type: 'PREV_TRACK' })}>
                  <Ionicons name="play-skip-back" size={30} color="white" />
                </Pressable>
                <Pressable onPress={() => dispatch({ type: 'TOGGLE_PLAY' })}>
                  {state.isPlaying ? (
                    <AntDesign name="pausecircle" size={60} color="white" />
                  ) : (
                    <Pressable style={styles.playButtonBig}>
                      <Entypo name="controller-play" size={26} color="black" />
                    </Pressable>
                  )}
                </Pressable>
                <Pressable onPress={() => dispatch({ type: 'NEXT_TRACK' })}>
                  <Ionicons name="play-skip-forward" size={30} color="white" />
                </Pressable>
                <Pressable>
                  <Feather name="repeat" size={30} color="#03C03C" />
                </Pressable>
              </View>
            </View>
          </View>
        </ModalContent>
      </BottomModal> */}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 60, // Space for mini player
    paddingTop: 50,
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
    backgroundColor: '#42275a',
    padding: 9,
    flex: 1,
    borderRadius: 3,
    height: 38,
  },
  searchInput: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
    width: '100%',
    height: 37,
  },
  sortButton: {
    marginHorizontal: 10,
    backgroundColor: '#42275a',
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
    width: 30,
    height: 30,
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
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1DB954',
  },
  listContent: {
    paddingBottom: 100,
  },
  modalContent: {
    height: '100%',
    width: '100%',
    backgroundColor: '#5072A7',
  },
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
});

export default TrackListScreen;
