import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TextStyle,
  ViewStyle,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from 'react-native';
import React, {useState, useEffect, useContext, useRef} from 'react';
import {LinearGradient} from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Player, usePlayer} from '../PlayerContext';
import {BottomModal} from '../components/BottomModal';
import {ModalContent} from '../components/ModalContent';
import {Audio, AVPlaybackStatus} from 'expo-av';
import {debounce} from 'lodash';
import SongItem from '../components/SongItem';

type SavedTrack = {
  track: {
    name: string;
    preview_url: string | null;
    album: {
      images: {url: string}[];
    };
    artists: {name: string}[];
  };
};

const LikedSongsScreen = () => {
  const navigation = useNavigation();
  const {currentTrack, setCurrentTrack} = usePlayer();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [searchedTracks, setSearchedTracks] = useState<SavedTrack[]>([]);
  const [input, setInput] = useState<string>('');
  const [savedTracks, setSavedTracks] = useState<SavedTrack[]>([]);
  const value = useRef<number>(0);
  const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    getSavedTracks();
  }, []);

  const getSavedTracks = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('token');
      const response = await fetch(
        'https://api.spotify.com/v1/me/tracks?offset=0&limit=50',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) throw new Error('Failed to fetch tracks');

      const data = await response.json();
      setSavedTracks(data.items);
    } catch (error) {
      console.error(error);
    }
  };

  const play = async (nextTrack: SavedTrack) => {
    const preview_url = nextTrack?.track?.preview_url;
    try {
      if (currentSound) {
        await currentSound.stopAsync();
      }
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
      });
      const {sound, status} = await Audio.Sound.createAsync(
        {uri: preview_url ?? ''},
        {shouldPlay: true, isLooping: false},
        onPlaybackStatusUpdate,
      );
      setCurrentSound(sound);
      setIsPlaying((status as AVPlaybackStatus).isLoaded ?? false);
      await sound.playAsync();
    } catch (err) {
      console.error((err as Error).message);
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    if (status.isPlaying) {
      const progress = status.positionMillis / status.durationMillis;
      setProgress(progress);
      setCurrentTime(status.positionMillis);
      setTotalDuration(status.durationMillis);
    }

    if (status.didJustFinish) {
      setCurrentSound(null);
      playNextTrack();
    }
  };

  const playTrack = async () => {
    if (savedTracks.length > 0) {
      setCurrentTrack(savedTracks[0]);
      await play(savedTracks[0]);
    }
  };

  const playNextTrack = async () => {
    if (currentSound) {
      await currentSound.stopAsync();
      setCurrentSound(null);
    }
    value.current += 1;
    if (value.current < savedTracks.length) {
      const nextTrack = savedTracks[value.current];
      setCurrentTrack(nextTrack);
      await play(nextTrack);
    }
  };

  const playPreviousTrack = async () => {
    if (currentSound) {
      await currentSound.stopAsync();
      setCurrentSound(null);
    }
    value.current -= 1;
    if (value.current < savedTracks.length) {
      const nextTrack = savedTracks[value.current];
      setCurrentTrack(nextTrack);
      await play(nextTrack);
    }
  };

  const handlePlayPause = async () => {
    if (currentSound) {
      if (isPlaying) {
        await currentSound.pauseAsync();
      } else {
        await currentSound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSearch = (text: string) => {
    const filtered = savedTracks.filter(item =>
      item.track.name.toLowerCase().includes(text.toLowerCase()),
    );
    setSearchedTracks(filtered);
  };

  const debouncedSearch = debounce(handleSearch, 800);

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

  return (
    <>
      <LinearGradient colors={['#614385', '#516395']} style={{flex: 1}}>
        <ScrollView style={{flex: 1, marginTop: 50}}>
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
                backgroundColor: '#42275a',
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
                  placeholder="Find in liked songs"
                  placeholderTextColor={'white'}
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
                backgroundColor: '#42275a',
                padding: 10,
                borderRadius: 3,
                height: 38,
              }}>
              <Text style={{color: 'white'}}>Sort</Text>
            </Pressable>
          </Pressable>
          <View style={{height: 50}} />
          <View style={{marginHorizontal: 10}}>
            <Text style={{fontSize: 18, fontWeight: 'bold', color: 'white'}}>
              Liked Songs
            </Text>
            <Text style={{color: 'white', fontSize: 13, marginTop: 5}}>
              430 songs
            </Text>
          </View>
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
              <ActivityIndicator size="large" color="gray" /> // Show a loading indicator while data is being fetched
            ) : (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={searchedTracks}
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
        <Pressable
          onPress={() => setModalVisible(!modalVisible)}
          style={{
            backgroundColor: '#5072A7',
            width: '90%',
            padding: 10,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 15,
            position: 'absolute',
            borderRadius: 6,
            left: 20,
            bottom: 10,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <Image
              style={{width: 40, height: 40}}
              source={{uri: currentTrack?.track?.album?.images[0].url}}
            />
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
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <AntDesign name="heart" size={24} color="#1DB954" />
            <Pressable>
              <AntDesign name="pausecircle" size={24} color="white" />
            </Pressable>
          </View>
        </Pressable>
      )}

      <BottomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}>
        <ModalContent
          style={{height: '100%', width: '100%', backgroundColor: '#5072A7'}}>
          <View style={{height: '100%', width: '100%', marginTop: 40}}>
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
                    style={[styles.progressbar, {width: `${(progress ?? 0) * 100}%`}]}
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

export default LikedSongsScreen;

const styles = StyleSheet.create({
  progressbar: {
    height: '100%',
    backgroundColor: 'white',
  },
});
