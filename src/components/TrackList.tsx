import React, {useEffect, useRef, useState} from 'react';
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

import {usePlayer} from '../PlayerContext';
import SongItem from './SongItem';
import {BottomModal} from './BottomModal';
import {ModalContent} from './ModalContent';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// const defaultFetchTracks = async () => {
//   return []; // Trả về mảng rỗng khi không có dữ liệu
// };

type SavedTrack = {
  track: {
    name: string;
    preview_url: string | null;
    album: {images: {url: string}[]};
    artists: {name: string}[];
  };
};

type Props = {
  title: string;
  fetchTracks: () => Promise<SavedTrack[]>;
  totalCount?: number;
};

const TrackListScreen: React.FC<Props> = ({title, fetchTracks, totalCount}) => {
  const navigation = useNavigation();
  const {currentTrack, setCurrentTrack} = usePlayer();
  const [savedTracks, setSavedTracks] = useState<SavedTrack[]>([]);
  const [searchedTracks, setSearchedTracks] = useState<SavedTrack[]>([]);
  const [input, setInput] = useState('');

  const [isPlaying, setIsPlaying] = useState(false);
  const value = useRef(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await fetchTracks();
    setSavedTracks(data);
    setSearchedTracks(data);
  };

  const play = async (nextTrack: SavedTrack) => {
    const preview_url = nextTrack.track.preview_url;
    // try {
    //   if (currentSound) await currentSound.stopAsync();
    //   const {sound, status} = await Audio.Sound.createAsync(
    //     {uri: preview_url ?? ''},
    //     {shouldPlay: true},
    //     onPlaybackStatusUpdate,
    //   );
    //   setCurrentSound(sound);
    setCurrentTrack(nextTrack);
    //   await sound.playAsync();
    // } catch (err) {
    //   console.error('Play error:', err);
    // }
  };

  //   const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
  //     if (!status.isLoaded) return;
  //     if (status.didJustFinish) {
  //       setCurrentSound(null);
  //       playNextTrack();
  //     }
  //   };

  const playNextTrack = async () => {
    if (value.current < savedTracks.length - 1) {
      value.current++;
      const nextTrack = savedTracks[value.current];
      await play(nextTrack);
    }
  };

  //   const playTrack = async () => {
  //     if (savedTracks.length > 0) {
  //       await play(savedTracks[0]);
  //     }
  //   };

  const handleSearch = (text: string) => {
    const filtered = savedTracks.filter(item =>
      item.track.name.toLowerCase().includes(text.toLowerCase()),
    );
    setSearchedTracks(filtered);
  };

  const debouncedSearch = debounce(handleSearch, 500);

  const handleInputChange = (text: string) => {
    setInput(text);
    debouncedSearch(text);
  };

  useEffect(() => {
    if (savedTracks.length > 0) {
      handleSearch(input);
    }
  }, [savedTracks]);

  const circleSize = 12;

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const playTrack = async () => {
    if (savedTracks.length > 0) {
      setCurrentTrack(savedTracks[0]);
      await play(savedTracks[0]);
    }
  };

  const playPreviousTrack = async () => {
    // if (currentSound) {
    //   await currentSound.stopAsync();
    //   setCurrentSound(null);
    // }
    // value.current -= 1;
    if (value.current > 0) {
      value.current--;
      const prevTrack = savedTracks[value.current];
      setCurrentTrack(prevTrack);
      await play(prevTrack);
    }
  };

  const handlePlayPause = async () => {
    // if (currentSound) {
    //   if (isPlaying) {
    //     await currentSound.pauseAsync();
    //   } else {
    //     await currentSound.playAsync();
    //   }
    //   setIsPlaying(!isPlaying);
    // }
  };

  return (
    <>
      {/* <LinearGradient colors={['#614385', '#516395']} style={{flex: 1}}> */}
      <LinearGradient colors={['#040306', '#131624']} style={{flex: 1}}>
        <ScrollView style={{marginTop: 50}}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={{marginHorizontal: 10}}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>

          <Pressable
            style={{
              marginHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 9,
            }}>
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                backgroundColor: '#444444',
                padding: 9,
                flex: 1,
                borderRadius: 3,
                height: 38,
              }}>
              <AntDesign name="search1" size={20} color="white" />
              <View>
                <TextInput
                  value={input}
                  onChangeText={text => handleInputChange(text)}
                  placeholder="Find in song list"
                  placeholderTextColor={'lightgrey'}
                  style={{
                    fontSize: 12,
                    fontWeight: '500',
                    color: 'white',
                    width: '100%',
                    height: 37,
                  }}
                />
              </View>
            </Pressable>
            <Pressable
              style={{
                marginHorizontal: 10,
                backgroundColor: '#444444',
                padding: 10,
                borderRadius: 3,
                height: 38,
              }}>
              <Text style={{color: 'white'}}>Sort</Text>
            </Pressable>
          </Pressable>

          {/* Song Image */}
          {currentTrack?.track?.album?.images?.[0]?.url ? (
            <View style={{alignItems: 'center', marginVertical: 15}}>
            <Image
              source={{uri: currentTrack.track.album.images[0].url}}
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
              source={{uri: savedTracks[0]?.track?.album?.images?.[0]?.url}}
              style={{
                width: 200,
                height: 200,
                borderRadius: 10,
              }}
              resizeMode="cover"
            />
          </View>
          )}

          <View style={{marginHorizontal: 10}}>
            <Text style={{fontSize: 18, fontWeight: 'bold', color: 'white'}}>
              {title}
            </Text>
            {totalCount && (
              <Text style={{color: 'white', fontSize: 13, marginTop: 5}}>
                {totalCount} songs
              </Text>
            )}
          </View>

          {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            padding: 10,
          }}>
          <Pressable
            style={{backgroundColor: '#1DB954', borderRadius: 30, padding: 10}}>
            <Entypo name="controller-play" size={24} color="white" />
          </Pressable>
        </View> */}

          <Pressable>
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: 10,
              }}>
              <Pressable
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: '#1DB954',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <AntDesign name="arrowdown" size={20} color="white" />
              </Pressable>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <MaterialCommunityIcons
                  name="cross-bolnisi"
                  size={24}
                  color="#1DB954"
                />
                <Pressable
                  onPress={playTrack}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#1DB954',
                  }}>
                  <Entypo name="controller-play" size={24} color="white" />
                </Pressable>
              </View>
            </Pressable>

            {searchedTracks.length === 0 ? (
              <ActivityIndicator size="large" color="gray" />
            ) : (
              <FlatList
                data={searchedTracks}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({item}) => (
                  <SongItem
                    item={item}
                    onPress={play}
                    isPlaying={item === currentTrack}
                  />
                )}
              />
            )}
          </Pressable>
        </ScrollView>
      </LinearGradient>

      {currentTrack && (
        <View>
          <Pressable
            onPress={() => setModalVisible(!modalVisible)}
            style={{
              // backgroundColor: '#5072A7',
              backgroundColor: '#040306',
              width: '90%',
              padding: 10,
              marginLeft: 'auto',
              marginRight: 'auto',
              marginBottom: 15,
              position: 'absolute',
              borderRadius: 6,
              left: 20,
              bottom: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 10,
              }}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                {/* <Image
                style={{width: 40, height: 40}}
                source={{uri: currentTrack?.track?.album?.images[0].url}}
              /> */}
                {currentTrack?.track?.album?.images?.[0]?.url ? (
                  <Image
                    style={{width: 40, height: 40}}
                    source={{uri: currentTrack.track.album.images[0].url}}
                  />
                ) : (
                  <Ionicons name="person-circle" size={40} color="white" />
                )}

                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 13,
                    width: 220,
                    color: 'white',
                    fontWeight: 'bold',
                  }}>
                  {currentTrack?.track?.name} .{' '}
                  {currentTrack?.track?.artists[0].name}
                </Text>
              </View>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <AntDesign name="heart" size={24} color="#1DB954" />
                <Pressable>
                  <AntDesign name="pausecircle" size={24} color="white" />
                </Pressable>
              </View>
            </View>

            <View
              style={{
                width: '100%',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 7,
                height: 3,
                backgroundColor: 'gray',
                borderRadius: 5,
              }}>
              {/* Thanh tiến độ hoàn thành */}
              <View
                style={[
                  styles.progressbar,
                  {width: `${(progress ?? 0) * 100}%`},
                ]}
              />
              {/* Vòng tròn di chuyển trên thanh tiến độ */}
              <View
                style={[
                  {
                    position: 'absolute',
                    top: -1,
                    width: circleSize / 2,
                    height: circleSize / 2,
                    borderRadius: 5,
                    backgroundColor: 'white',
                  },
                  {
                    left: `${(progress ?? 0) * 100}%`,
                    marginLeft: -circleSize / 2,
                  },
                ]}
              />
            </View>
          </Pressable>
        </View>
      )}

      <BottomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}>
        <ModalContent
          style={{height: '100%', width: '100%', backgroundColor: '#5072A7'}}>
          <View
            style={{
              height: '100%',
              width: '100%',
              marginTop: 40,
              paddingLeft: 20,
              paddingRight: 20,
            }}>
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <AntDesign
                onPress={() => setModalVisible(!modalVisible)}
                name="down"
                size={24}
                color="white"
              />
              <Text style={{fontSize: 14, fontWeight: 'bold', color: 'white'}}>
                {currentTrack?.track?.name}
              </Text>
              <Entypo name="dots-three-vertical" size={24} color="white" />
            </Pressable>
            <View style={{height: 70}} />
            <View style={{padding: 10}}>
              <Image
                style={{width: '100%', height: 330, borderRadius: 4}}
                source={{uri: currentTrack?.track?.album?.images[0].url}}
              />
              <View
                style={{
                  marginTop: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text
                    style={{fontSize: 18, fontWeight: 'bold', color: 'white'}}>
                    {currentTrack?.track?.name}
                  </Text>
                  <Text style={{color: '#D3D3D3', marginTop: 4}}>
                    {currentTrack?.track?.artists[0].name}
                  </Text>
                </View>
                <AntDesign name="heart" size={24} color="#1DB954" />
              </View>
              <View style={{marginTop: 10}}>
                <View
                  style={{
                    width: '100%',
                    marginTop: 10,
                    height: 3,
                    backgroundColor: 'gray',
                    borderRadius: 5,
                  }}>
                  <View
                    style={[
                      styles.progressbar,
                      {width: `${(progress ?? 0) * 100}%`},
                    ]}
                  />
                  <View
                    style={[
                      {
                        position: 'absolute',
                        top: -5,
                        width: circleSize,
                        height: circleSize,
                        borderRadius: circleSize / 2,
                        backgroundColor: 'white',
                      },
                      {
                        left: `${(progress ?? 0) * 100}%`,
                        marginLeft: -circleSize / 2,
                      },
                    ]}
                  />
                </View>
                <View
                  style={{
                    marginTop: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{fontSize: 15, color: '#D3D3D3'}}>
                    {formatTime(currentTime)}
                  </Text>
                  <Text style={{fontSize: 15, color: '#D3D3D3'}}>
                    {formatTime(totalDuration)}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 17,
                }}>
                <Pressable>
                  <FontAwesome name="arrows" size={30} color="#03C03C" />
                </Pressable>
                <Pressable onPress={playPreviousTrack}>
                  <Ionicons name="play-skip-back" size={30} color="white" />
                </Pressable>
                <Pressable onPress={handlePlayPause}>
                  {isPlaying ? (
                    <AntDesign name="pausecircle" size={60} color="white" />
                  ) : (
                    <Pressable
                      onPress={handlePlayPause}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Entypo name="controller-play" size={26} color="black" />
                    </Pressable>
                  )}
                </Pressable>
                <Pressable onPress={playNextTrack}>
                  <Ionicons name="play-skip-forward" size={30} color="white" />
                </Pressable>
                <Pressable>
                  <Feather name="repeat" size={30} color="#03C03C" />
                </Pressable>
              </View>
            </View>
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default TrackListScreen;

const styles = StyleSheet.create({
  progressbar: {
    height: '100%',
    backgroundColor: 'white',
  },
});
