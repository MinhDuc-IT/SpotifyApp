// import React, {useEffect, useRef, useState} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   ScrollView,
//   ActivityIndicator,
//   Image,
//   FlatList,
//   StyleSheet,
// } from 'react-native';
// import {LinearGradient} from 'react-native-linear-gradient';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Entypo from 'react-native-vector-icons/Entypo';

// import {useNavigation} from '@react-navigation/native';
// import {debounce} from 'lodash';

// import {usePlayer} from '../PlayerContext';
// import SongItem from './SongItem';
// import {BottomModal} from './BottomModal';
// import {ModalContent} from './ModalContent';
// import Feather from 'react-native-vector-icons/Feather';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';

// type SavedTrack = {
//   track: {
//     name: string;
//     preview_url: string | null;
//     album: {images: {url: string}[]};
//     artists: {name: string}[];
//   };
// };

// interface Props {
//   title: string;
//   tracks: any[];
//   onEndReached?: () => void;
//   totalCount: number;
//   isLoading?: boolean;
// }

// const TrackListScreen: React.FC<Props> = ({title, tracks, totalCount, onEndReached, isLoading}) => {
//   const navigation = useNavigation();
//   const {currentTrack, setCurrentTrack} = usePlayer();
//   const [savedTracks, setSavedTracks] = useState<SavedTrack[]>([]);
//   const [searchedTracks, setSearchedTracks] = useState<SavedTrack[]>([]);
//   const [input, setInput] = useState('');

//   const [isPlaying, setIsPlaying] = useState(false);
//   const value = useRef(0);
//   const [modalVisible, setModalVisible] = useState<boolean>(false);
//   const [progress, setProgress] = useState<number | null>(null);
//   const [currentTime, setCurrentTime] = useState<number>(0);
//   const [totalDuration, setTotalDuration] = useState<number>(0);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     //const data = await fetchTracks();
//     setSavedTracks(tracks);
//     setSearchedTracks(tracks);
//   };

//   const play = async (nextTrack: SavedTrack) => {
//     const preview_url = nextTrack.track.preview_url;
//     // try {
//     //   if (currentSound) await currentSound.stopAsync();
//     //   const {sound, status} = await Audio.Sound.createAsync(
//     //     {uri: preview_url ?? ''},
//     //     {shouldPlay: true},
//     //     onPlaybackStatusUpdate,
//     //   );
//     //   setCurrentSound(sound);
//     setCurrentTrack(nextTrack);
//     //   await sound.playAsync();
//     // } catch (err) {
//     //   console.error('Play error:', err);
//     // }
//   };

//   //   const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
//   //     if (!status.isLoaded) return;
//   //     if (status.didJustFinish) {
//   //       setCurrentSound(null);
//   //       playNextTrack();
//   //     }
//   //   };

//   const playNextTrack = async () => {
//     if (value.current < savedTracks.length - 1) {
//       value.current++;
//       const nextTrack = savedTracks[value.current];
//       await play(nextTrack);
//     }
//   };

//   //   const playTrack = async () => {
//   //     if (savedTracks.length > 0) {
//   //       await play(savedTracks[0]);
//   //     }
//   //   };

//   const handleSearch = (text: string) => {
//     const filtered = savedTracks.filter(item =>
//       item.track.name.toLowerCase().includes(text.toLowerCase()),
//     );
//     setSearchedTracks(filtered);
//   };

//   const debouncedSearch = debounce(handleSearch, 500);

//   const handleInputChange = (text: string) => {
//     setInput(text);
//     debouncedSearch(text);
//   };

//   useEffect(() => {
//     if (savedTracks.length > 0) {
//       handleSearch(input);
//     }
//   }, [savedTracks]);

//   const circleSize = 12;

//   const formatTime = (time: number): string => {
//     const minutes = Math.floor(time / 60000);
//     const seconds = Math.floor((time % 60000) / 1000);
//     return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
//   };

//   const playTrack = async () => {
//     if (savedTracks.length > 0) {
//       setCurrentTrack(savedTracks[0]);
//       await play(savedTracks[0]);
//     }
//   };

//   const playPreviousTrack = async () => {
//     // if (currentSound) {
//     //   await currentSound.stopAsync();
//     //   setCurrentSound(null);
//     // }
//     // value.current -= 1;
//     if (value.current > 0) {
//       value.current--;
//       const prevTrack = savedTracks[value.current];
//       setCurrentTrack(prevTrack);
//       await play(prevTrack);
//     }
//   };

//   const handlePlayPause = async () => {
//     // if (currentSound) {
//     //   if (isPlaying) {
//     //     await currentSound.pauseAsync();
//     //   } else {
//     //     await currentSound.playAsync();
//     //   }
//     //   setIsPlaying(!isPlaying);
//     // }
//   };

//   return (
//     <>
//       <LinearGradient colors={['#614385', '#516395']} style={{flex: 1}}>
//         <ScrollView style={{marginTop: 50}}>
//           <Pressable
//             onPress={() => navigation.goBack()}
//             style={{marginHorizontal: 10}}>
//             <Ionicons name="arrow-back" size={24} color="white" />
//           </Pressable>

//           <Pressable
//             style={{
//               marginHorizontal: 10,
//               flexDirection: 'row',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               marginTop: 9,
//             }}>
//             <Pressable
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 gap: 10,
//                 backgroundColor: '#42275a',
//                 padding: 9,
//                 flex: 1,
//                 borderRadius: 3,
//                 height: 38,
//               }}>
//               <AntDesign name="search1" size={20} color="white" />
//               <View>
//                 <TextInput
//                   value={input}
//                   onChangeText={text => handleInputChange(text)}
//                   placeholder="Find in liked songs"
//                   placeholderTextColor={'lightgrey'}
//                   style={{
//                     fontSize: 12,
//                     fontWeight: '500',
//                     color: 'white',
//                     width: '100%',
//                     height: 37,
//                   }}
//                 />
//               </View>
//             </Pressable>
//             <Pressable
//               style={{
//                 marginHorizontal: 10,
//                 backgroundColor: '#42275a',
//                 padding: 10,
//                 borderRadius: 3,
//                 height: 38,
//               }}>
//               <Text style={{color: 'white'}}>Sort</Text>
//             </Pressable>
//           </Pressable>

//           <View style={{marginHorizontal: 10}}>
//             <Text style={{fontSize: 18, fontWeight: 'bold', color: 'white'}}>
//               {title}
//             </Text>
//             {totalCount && (
//               <Text style={{color: 'white', fontSize: 13, marginTop: 5}}>
//                 {totalCount} songs
//               </Text>
//             )}
//           </View>

//           {/* <View
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'flex-end',
//             padding: 10,
//           }}>
//           <Pressable
//             style={{backgroundColor: '#1DB954', borderRadius: 30, padding: 10}}>
//             <Entypo name="controller-play" size={24} color="white" />
//           </Pressable>
//         </View> */}

//           <Pressable>
//             <Pressable
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//                 marginHorizontal: 10,
//               }}>
//               <Pressable
//                 style={{
//                   width: 30,
//                   height: 30,
//                   borderRadius: 15,
//                   backgroundColor: '#1DB954',
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                 }}>
//                 <AntDesign name="arrowdown" size={20} color="white" />
//               </Pressable>
//               <View
//                 style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
//                 <MaterialCommunityIcons
//                   name="cross-bolnisi"
//                   size={24}
//                   color="#1DB954"
//                 />
//                 <Pressable
//                   onPress={playTrack}
//                   style={{
//                     width: 60,
//                     height: 60,
//                     borderRadius: 30,
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     backgroundColor: '#1DB954',
//                   }}>
//                   <Entypo name="controller-play" size={24} color="white" />
//                 </Pressable>
//               </View>
//             </Pressable>

//             {searchedTracks.length === 0 ? (
//               <ActivityIndicator size="large" color="gray" />
//             ) : (
//               <FlatList
//                 data={searchedTracks}
//                 keyExtractor={(_, index) => index.toString()}
//                 renderItem={({item}) => (
//                   <SongItem
//                     item={item}
//                     onPress={play}
//                     isPlaying={item === currentTrack}
//                   />
//                 )}
//                 onEndReached={onEndReached}
//                 onEndReachedThreshold={0.5}
//               />
//             )}
//           </Pressable>
//         </ScrollView>
//       </LinearGradient>

//       {currentTrack && (
//         <View>
//           <Pressable
//             onPress={() => setModalVisible(!modalVisible)}
//             style={{
//               backgroundColor: '#5072A7',
//               width: '90%',
//               padding: 10,
//               marginLeft: 'auto',
//               marginRight: 'auto',
//               marginBottom: 15,
//               position: 'absolute',
//               borderRadius: 6,
//               left: 20,
//               bottom: 10,
//             }}>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 gap: 10,
//               }}>
//               <View
//                 style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
//                 {/* <Image
//                 style={{width: 40, height: 40}}
//                 source={{uri: currentTrack?.track?.album?.images[0].url}}
//               /> */}
//                 {currentTrack?.track?.album?.images?.[0]?.url ? (
//                   <Image
//                     style={{width: 40, height: 40}}
//                     source={{uri: currentTrack.track.album.images[0].url}}
//                   />
//                 ) : (
//                   <Ionicons name="person-circle" size={40} color="white" />
//                 )}

//                 <Text
//                   numberOfLines={1}
//                   style={{
//                     fontSize: 13,
//                     width: 220,
//                     color: 'white',
//                     fontWeight: 'bold',
//                   }}>
//                   {currentTrack?.track?.name} .{' '}
//                   {currentTrack?.track?.artists[0].name}
//                 </Text>
//               </View>
//               <View
//                 style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
//                 <AntDesign name="heart" size={24} color="#1DB954" />
//                 <Pressable>
//                   <AntDesign name="pausecircle" size={24} color="white" />
//                 </Pressable>
//               </View>
//             </View>

//             <View
//               style={{
//                 width: '100%',
//                 marginLeft: 'auto',
//                 marginRight: 'auto',
//                 marginTop: 7,
//                 height: 3,
//                 backgroundColor: 'gray',
//                 borderRadius: 5,
//               }}>
//               {/* Thanh tiến độ hoàn thành */}
//               <View
//                 style={[
//                   styles.progressbar,
//                   {width: `${(progress ?? 0) * 100}%`},
//                 ]}
//               />
//               {/* Vòng tròn di chuyển trên thanh tiến độ */}
//               <View
//                 style={[
//                   {
//                     position: 'absolute',
//                     top: -1,
//                     width: circleSize / 2,
//                     height: circleSize / 2,
//                     borderRadius: 5,
//                     backgroundColor: 'white',
//                   },
//                   {
//                     left: `${(progress ?? 0) * 100}%`,
//                     marginLeft: -circleSize / 2,
//                   },
//                 ]}
//               />
//             </View>
//           </Pressable>
//         </View>
//       )}

//       <BottomModal
//         visible={modalVisible}
//         onClose={() => setModalVisible(false)}>
//         <ModalContent
//           style={{height: '100%', width: '100%', backgroundColor: '#5072A7'}}>
//           <View
//             style={{
//               height: '100%',
//               width: '100%',
//               marginTop: 40,
//               paddingLeft: 20,
//               paddingRight: 20,
//             }}>
//             <Pressable
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//               }}>
//               <AntDesign
//                 onPress={() => setModalVisible(!modalVisible)}
//                 name="down"
//                 size={24}
//                 color="white"
//               />
//               <Text style={{fontSize: 14, fontWeight: 'bold', color: 'white'}}>
//                 {currentTrack?.track?.name}
//               </Text>
//               <Entypo name="dots-three-vertical" size={24} color="white" />
//             </Pressable>
//             <View style={{height: 70}} />
//             <View style={{padding: 10}}>
//               <Image
//                 style={{width: '100%', height: 330, borderRadius: 4}}
//                 source={{uri: currentTrack?.track?.album?.images[0].url}}
//               />
//               <View
//                 style={{
//                   marginTop: 20,
//                   flexDirection: 'row',
//                   justifyContent: 'space-between',
//                 }}>
//                 <View>
//                   <Text
//                     style={{fontSize: 18, fontWeight: 'bold', color: 'white'}}>
//                     {currentTrack?.track?.name}
//                   </Text>
//                   <Text style={{color: '#D3D3D3', marginTop: 4}}>
//                     {currentTrack?.track?.artists[0].name}
//                   </Text>
//                 </View>
//                 <AntDesign name="heart" size={24} color="#1DB954" />
//               </View>
//               <View style={{marginTop: 10}}>
//                 <View
//                   style={{
//                     width: '100%',
//                     marginTop: 10,
//                     height: 3,
//                     backgroundColor: 'gray',
//                     borderRadius: 5,
//                   }}>
//                   <View
//                     style={[
//                       styles.progressbar,
//                       {width: `${(progress ?? 0) * 100}%`},
//                     ]}
//                   />
//                   <View
//                     style={[
//                       {
//                         position: 'absolute',
//                         top: -5,
//                         width: circleSize,
//                         height: circleSize,
//                         borderRadius: circleSize / 2,
//                         backgroundColor: 'white',
//                       },
//                       {
//                         left: `${(progress ?? 0) * 100}%`,
//                         marginLeft: -circleSize / 2,
//                       },
//                     ]}
//                   />
//                 </View>
//                 <View
//                   style={{
//                     marginTop: 12,
//                     flexDirection: 'row',
//                     alignItems: 'center',
//                     justifyContent: 'space-between',
//                   }}>
//                   <Text style={{fontSize: 15, color: '#D3D3D3'}}>
//                     {formatTime(currentTime)}
//                   </Text>
//                   <Text style={{fontSize: 15, color: '#D3D3D3'}}>
//                     {formatTime(totalDuration)}
//                   </Text>
//                 </View>
//               </View>
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                   justifyContent: 'space-between',
//                   marginTop: 17,
//                 }}>
//                 <Pressable>
//                   <FontAwesome name="arrows" size={30} color="#03C03C" />
//                 </Pressable>
//                 <Pressable onPress={playPreviousTrack}>
//                   <Ionicons name="play-skip-back" size={30} color="white" />
//                 </Pressable>
//                 <Pressable onPress={handlePlayPause}>
//                   {isPlaying ? (
//                     <AntDesign name="pausecircle" size={60} color="white" />
//                   ) : (
//                     <Pressable
//                       onPress={handlePlayPause}
//                       style={{
//                         width: 60,
//                         height: 60,
//                         borderRadius: 30,
//                         backgroundColor: 'white',
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                       }}>
//                       <Entypo name="controller-play" size={26} color="black" />
//                     </Pressable>
//                   )}
//                 </Pressable>
//                 <Pressable onPress={playNextTrack}>
//                   <Ionicons name="play-skip-forward" size={30} color="white" />
//                 </Pressable>
//                 <Pressable>
//                   <Feather name="repeat" size={30} color="#03C03C" />
//                 </Pressable>
//               </View>
//             </View>
//           </View>
//         </ModalContent>
//       </BottomModal>
//     </>
//   );
// };

// export default TrackListScreen;

// const styles = StyleSheet.create({
//   progressbar: {
//     height: '100%',
//     backgroundColor: 'white',
//   },
// });

// import React, { useEffect, useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   ScrollView,
//   ActivityIndicator,
//   Image,
//   FlatList,
//   StyleSheet,
// } from 'react-native';
// import { LinearGradient } from 'react-native-linear-gradient';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Entypo from 'react-native-vector-icons/Entypo';
// import { useNavigation } from '@react-navigation/native';
// import { debounce } from 'lodash';
// import { usePlayer } from '../PlayerContext';
// import SongItem from './SongItem';
// import { BottomModal } from './BottomModal';
// import { ModalContent } from './ModalContent';
// import Feather from 'react-native-vector-icons/Feather';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Video, { VideoRef } from 'react-native-video';
// import MusicPlayer from './MusicPlayer';

// type SavedTrack = {
//   track: {
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
//   totalCount,
//   onEndReached,
//   isLoading,
// }) => {
//   const navigation = useNavigation();
//   const { currentTrack, setCurrentTrack } = usePlayer();
//   const [savedTracks, setSavedTracks] = useState<SavedTrack[]>([]);
//   const [searchedTracks, setSearchedTracks] = useState<SavedTrack[]>([]);
//   const [input, setInput] = useState('');

//   const [isPlaying, setIsPlaying] = useState(false);
//   const value = useRef(0);
//   const [modalVisible, setModalVisible] = useState<boolean>(false);
//   const [progress, setProgress] = useState<number | null>(null);
//   const [currentTime, setCurrentTime] = useState<number>(0);
//   const [totalDuration, setTotalDuration] = useState<number>(5.5);
//   const videoRef = useRef<VideoRef>(null);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     console.log(tracks);
//     setSavedTracks(tracks);
//     setSearchedTracks(tracks);
//     console.log(savedTracks);
//     console.log(searchedTracks);
//   };

//   const play = async (nextTrack: SavedTrack) => {
//     setCurrentTrack(nextTrack);
//   };

//   const playNextTrack = async () => {
//     if (value.current < savedTracks.length - 1) {
//       value.current++;
//       const nextTrack = savedTracks[value.current];
//       await play(nextTrack);
//     }
//   };

//   const handleSearch = (text: string) => {
//     const filtered = savedTracks.filter(item =>
//       item.track.name.toLowerCase().includes(text.toLowerCase()),
//     );
//     setSearchedTracks(filtered);
//   };

//   const debouncedSearch = debounce(handleSearch, 500);

//   const handleInputChange = (text: string) => {
//     setInput(text);
//     debouncedSearch(text);
//   };

//   useEffect(() => {
//     if (savedTracks.length > 0) {
//       handleSearch(input);
//     }
//   }, [savedTracks]);

//   const circleSize = 12;

//   const formatTime = (time: number): string => {
//     const minutes = Math.floor(time / 60000);
//     const seconds = Math.floor((time % 60000) / 1000);
//     return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
//   };

//   const playTrack = async () => {
//     if (savedTracks.length > 0) {
//       setCurrentTrack(savedTracks[0]);
//       await play(savedTracks[0]);
//     }
//   };

//   const playPreviousTrack = async () => {
//     if (value.current > 0) {
//       value.current--;
//       const prevTrack = savedTracks[value.current];
//       setCurrentTrack(prevTrack);
//       await play(prevTrack);
//     }
//   };

//   const handlePlayPause = () => {
//     setIsPlaying(!isPlaying);
//   };

//   const handleProgress = (data: { currentTime: number }) => {
//     setCurrentTime(data.currentTime);
//     setProgress(data.currentTime / totalDuration);
//   };

//   const handleLoad = (data: { duration: number }) => {
//     setTotalDuration(data.duration);
//   };

//   return (
//     <>
//       <LinearGradient colors={['#614385', '#516395']} style={styles.container}>
//         <ScrollView style={styles.scrollView}>
//           <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
//             <Ionicons name="arrow-back" size={24} color="white" />
//           </Pressable>

//           <Pressable style={styles.searchContainer}>
//             <Pressable style={styles.searchInputContainer}>
//               <AntDesign name="search1" size={20} color="white" />
//               <TextInput
//                 value={input}
//                 onChangeText={handleInputChange}
//                 placeholder="Find in liked songs"
//                 placeholderTextColor="lightgrey"
//                 style={styles.searchInput}
//               />
//             </Pressable>
//             <Pressable style={styles.sortButton}>
//               <Text style={styles.sortButtonText}>Sort</Text>
//             </Pressable>
//           </Pressable>

//           <View style={styles.titleContainer}>
//             <Text style={styles.titleText}>{title}</Text>
//             {totalCount > 0 && (
//               <Text style={styles.countText}>{totalCount} songs</Text>
//             )}
//           </View>

//           <Pressable>
//             <Pressable style={styles.playHeader}>
//               <Pressable style={styles.downloadButton}>
//                 <AntDesign name="arrowdown" size={20} color="white" />
//               </Pressable>
//               <View style={styles.playControls}>
//                 <MaterialCommunityIcons
//                   name="cross-bolnisi"
//                   size={24}
//                   color="#1DB954"
//                 />
//                 <Pressable onPress={playTrack} style={styles.playButton}>
//                   <Entypo name="controller-play" size={24} color="white" />
//                 </Pressable>
//               </View>
//             </Pressable>

//             {searchedTracks.length === 0 ? (
//               <ActivityIndicator size="large" color="gray" />
//             ) : (
//               <FlatList
//                 data={searchedTracks}
//                 keyExtractor={(_, index) => index.toString()}
//                 renderItem={({ item }) => (
//                   <SongItem
//                     item={item}
//                     onPress={play}
//                     isPlaying={item === currentTrack}
//                   />
//                 )}
//                 contentContainerStyle={styles.listContent}
//                 onEndReached={onEndReached}
//                 onEndReachedThreshold={0.5}
//               />
//             )}
//           </Pressable>
//         </ScrollView>
//       </LinearGradient>

//       {currentTrack && (
//         <Pressable
//           onPress={() => setModalVisible(!modalVisible)}
//           style={styles.currentTrackContainer}>
//           <View style={styles.trackInfoContainer}>
//             <View style={styles.trackImageContainer}>
//               {currentTrack.track.album.images?.[0]?.url ? (
//                 <Image
//                   style={styles.trackImage}
//                   source={{ uri: currentTrack.track.album.images[0].url }}
//                 />
//               ) : (
//                 <Ionicons name="person-circle" size={40} color="white" />
//               )}
//               <Text numberOfLines={1} style={styles.trackTitle}>
//                 {currentTrack.track.name} · {currentTrack.track.artists[0].name}
//               </Text>
//             </View>
//             <View style={styles.trackControls}>
//               <AntDesign name="heart" size={24} color="#1DB954" />
//               <Pressable>
//                 <AntDesign name="pausecircle" size={24} color="white" />
//               </Pressable>
//             </View>
//           </View>

//           <View style={styles.progressContainer}>
//             <View
//               style={[
//                 styles.progressFill,
//                 { width: `${(progress ?? 0) * 100}%` },
//               ]}
//             />
//             <View
//               style={[
//                 styles.progressCircle,
//                 { left: `${(progress ?? 0) * 100}%` },
//               ]}
//             />
//           </View>
//         </Pressable>
//       )}

//       <BottomModal
//         visible={modalVisible}
//         onClose={() => setModalVisible(false)}>
//         <ModalContent style={styles.modalContent}>
//           <View style={styles.modalInner}>
//             <Pressable style={styles.modalHeader}>
//               <AntDesign
//                 onPress={() => setModalVisible(false)}
//                 name="down"
//                 size={24}
//                 color="white"
//               />
//               <Text style={styles.modalTitle}>{currentTrack?.track.name}</Text>
//               <Entypo name="dots-three-vertical" size={24} color="white" />
//             </Pressable>

//             <View style={styles.spacer} />

//             <View style={styles.modalBody}>
//               <Image
//                 style={styles.albumArt}
//                 source={{ uri: currentTrack?.track.album.images[0].url }}
//               />

//               <View style={styles.songInfoContainer}>
//                 <View>
//                   <Text style={styles.songTitle}>{currentTrack?.track.name}</Text>
//                   <Text style={styles.artistName}>
//                     {currentTrack?.track.artists[0].name}
//                   </Text>
//                 </View>
//                 <AntDesign name="heart" size={24} color="#1DB954" />
//               </View>

//               <View style={styles.modalProgressContainer}>
//                 <View style={styles.modalProgressBar}>
//                   <View
//                     style={[
//                       styles.progressFill,
//                       { width: `${(progress ?? 0) * 100}%` },
//                     ]}
//                   />
//                   <View
//                     style={[
//                       styles.modalProgressCircle,
//                       { left: `${(progress ?? 0) * 100}%` },
//                     ]}
//                   />
//                 </View>
//                 <View style={styles.timeContainer}>
//                   <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
//                   <Text style={styles.timeText}>{formatTime(totalDuration)}</Text>
//                 </View>
//               </View>

//               <View style={styles.playerControls}>
//                 <Pressable>
//                   <FontAwesome name="arrows" size={30} color="#03C03C" />
//                 </Pressable>
//                 <Pressable onPress={playPreviousTrack}>
//                   <Ionicons name="play-skip-back" size={30} color="white" />
//                 </Pressable>
//                 <Pressable onPress={handlePlayPause}>
//                   {isPlaying ? (
//                     <AntDesign name="pausecircle" size={60} color="white" />
//                   ) : (
//                     <Pressable style={styles.playButtonBig}>
//                       <Entypo name="controller-play" size={26} color="black" />
//                     </Pressable>
//                   )}
//                 </Pressable>
//                 <Pressable onPress={playNextTrack}>
//                   <Ionicons name="play-skip-forward" size={30} color="white" />
//                 </Pressable>
//                 <Pressable>
//                   <Feather name="repeat" size={30} color="#03C03C" />
//                 </Pressable>
//               </View>

//               <MusicPlayer
//               song={currentTrack?.track}
//               isOffline={false}
//               onProgress={handleProgress}
//               onLoad={handleLoad}
//               isPlaying={isPlaying}
//             />
//             </View>
//           </View>
//         </ModalContent>
//       </BottomModal>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollView: {
//     marginTop: 50,
//   },
//   backButton: {
//     marginHorizontal: 10,
//   },
//   searchContainer: {
//     marginHorizontal: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginTop: 9,
//   },
//   searchInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//     backgroundColor: '#42275a',
//     padding: 9,
//     flex: 1,
//     borderRadius: 3,
//     height: 38,
//   },
//   searchInput: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: 'white',
//     width: '100%',
//     height: 37,
//   },
//   sortButton: {
//     marginHorizontal: 10,
//     backgroundColor: '#42275a',
//     padding: 10,
//     borderRadius: 3,
//     height: 38,
//   },
//   sortButtonText: {
//     color: 'white',
//   },
//   titleContainer: {
//     marginHorizontal: 10,
//   },
//   titleText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   countText: {
//     color: 'white',
//     fontSize: 13,
//     marginTop: 5,
//   },
//   playHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginHorizontal: 10,
//   },
//   downloadButton: {
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: '#1DB954',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   playControls: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   playButton: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#1DB954',
//   },
//   listContent: {
//     paddingBottom: 100,
//   },
//   currentTrackContainer: {
//     backgroundColor: '#5072A7',
//     width: '90%',
//     padding: 10,
//     marginLeft: 'auto',
//     marginRight: 'auto',
//     marginBottom: 15,
//     position: 'absolute',
//     borderRadius: 6,
//     left: 20,
//     bottom: 10,
//   },
//   trackInfoContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     gap: 10,
//   },
//   trackImageContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   trackImage: {
//     width: 40,
//     height: 40,
//   },
//   trackTitle: {
//     fontSize: 13,
//     width: 220,
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   trackControls: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   progressContainer: {
//     width: '100%',
//     marginLeft: 'auto',
//     marginRight: 'auto',
//     marginTop: 7,
//     height: 3,
//     backgroundColor: 'gray',
//     borderRadius: 5,
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: 'white',
//   },
//   progressCircle: {
//     position: 'absolute',
//     top: -1,
//     width: 6,
//     height: 6,
//     borderRadius: 5,
//     backgroundColor: 'white',
//     marginLeft: -6,
//   },
//   modalContent: {
//     height: '100%',
//     width: '100%',
//     backgroundColor: '#5072A7',
//   },
//   modalInner: {
//     height: '100%',
//     width: '100%',
//     marginTop: 40,
//     paddingHorizontal: 20,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   modalTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   spacer: {
//     height: 70,
//   },
//   modalBody: {
//     padding: 10,
//   },
//   albumArt: {
//     width: '100%',
//     height: 330,
//     borderRadius: 4,
//   },
//   songInfoContainer: {
//     marginTop: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   songTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   artistName: {
//     color: '#D3D3D3',
//     marginTop: 4,
//   },
//   modalProgressContainer: {
//     marginTop: 10,
//   },
//   modalProgressBar: {
//     width: '100%',
//     marginTop: 10,
//     height: 3,
//     backgroundColor: 'gray',
//     borderRadius: 5,
//   },
//   modalProgressCircle: {
//     position: 'absolute',
//     top: -5,
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: 'white',
//     marginLeft: -6,
//   },
//   timeContainer: {
//     marginTop: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   timeText: {
//     fontSize: 15,
//     color: '#D3D3D3',
//   },
//   playerControls: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginTop: 17,
//   },
//   playButtonBig: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: 'white',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   // video: {
//   //   width: 0,
//   //   height: 0,
//   // },
// });

// export default TrackListScreen;


import React, { useEffect, useRef, useState } from 'react';
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
import { LinearGradient } from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { debounce } from 'lodash';
import { usePlayer } from '../PlayerContext';
import SongItem from './SongItem';
import { BottomModal } from './BottomModal';
import { ModalContent } from './ModalContent';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Video, { VideoRef } from 'react-native-video';

// Định nghĩa kiểu dữ liệu cho track nhạc
type SavedTrack = {
  track: {
    id: number,
    name: string;
    preview_url: string | null;
    album: { images: { url: string }[] };
    artists: { name: string }[];
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
  totalCount,
  onEndReached,
  isLoading,
}) => {
  const navigation = useNavigation();
  const { currentTrack, setCurrentTrack } = usePlayer();

  // State quản lý dữ liệu và UI
  const [savedTracks, setSavedTracks] = useState<SavedTrack[]>([]);
  const [searchedTracks, setSearchedTracks] = useState<SavedTrack[]>([]);
  const [input, setInput] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // State quản lý phát nhạc
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(5.6);
  const currentTrackIndex = useRef(0);
  const videoRef = useRef<VideoRef>(null);

  // Khởi tạo danh sách bài hát
  useEffect(() => {
    setSavedTracks(tracks);
    setSearchedTracks(tracks);
  }, [tracks]);

  // Thêm useEffect để đồng bộ trạng thái phát nhạc
  useEffect(() => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.resume() : videoRef.current.pause();
    }
  }, [isPlaying]);

  // Xử lý phát bài hát
  const play = async (track: SavedTrack) => {
    const index = savedTracks.findIndex(t => t === track);
    if (index !== -1) {
      currentTrackIndex.current = index;
    }
    if (track === currentTrack) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  // Chuyển bài tiếp theo
  const playNextTrack = () => {
    if (currentTrackIndex.current < savedTracks.length - 1) {
      currentTrackIndex.current++;
      const nextTrack = savedTracks[currentTrackIndex.current];
      play(nextTrack);
    }
  };

  // Chuyển bài trước
  const playPreviousTrack = () => {
    if (currentTrackIndex.current > 0) {
      currentTrackIndex.current--;
      const prevTrack = savedTracks[currentTrackIndex.current];
      play(prevTrack);
    }
  };

  // Tìm kiếm bài hát với debounce
  const handleSearch = debounce((text: string) => {
    const filtered = savedTracks.filter(item =>
      item.track.name.toLowerCase().includes(text.toLowerCase())
    );
    setSearchedTracks(filtered);
  }, 500);

  // Định dạng thời gian
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Xử lý thay đổi tiến trình phát
  const handleProgress = (data: { currentTime: number }) => {
    setCurrentTime(data.currentTime);
    setProgress(data.currentTime / totalDuration);
  };

  // Xử lý khi load xong audio
  const handleLoad = (data: { duration: number }) => {
    setTotalDuration(data.duration);
  };

  // Xử lý khi kết thúc bài hát
  const handleEnd = () => {
    playNextTrack();
  };

  return (
    <>
      {/* Màn hình chính */}
      <LinearGradient colors={['#614385', '#516395']} style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {/* Nút quay lại */}
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>

          {/* Thanh tìm kiếm */}
          <Pressable style={styles.searchContainer}>
            <Pressable style={styles.searchInputContainer}>
              <AntDesign name="search1" size={20} color="white" />
              <TextInput
                value={input}
                onChangeText={(text) => {
                  setInput(text);
                  handleSearch(text);
                }}
                placeholder="Tìm trong bài hát đã thích"
                placeholderTextColor="lightgrey"
                style={styles.searchInput}
              />
            </Pressable>
            <Pressable style={styles.sortButton}>
              <Text style={styles.sortButtonText}>Sắp xếp</Text>
            </Pressable>
          </Pressable>

          {/* Tiêu đề và số lượng */}
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{title}</Text>
            {totalCount > 0 && (
              <Text style={styles.countText}>{totalCount} bài hát</Text>
            )}
          </View>

          {/* Nút điều khiển phát nhạc */}
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
                onPress={() => play(savedTracks[0])}
                style={styles.playButton}
              >
                <Entypo name="controller-play" size={24} color="white" />
              </Pressable>
            </View>
          </Pressable>

          {/* Danh sách bài hát */}
          {isLoading ? (
            <ActivityIndicator size="large" color="gray" />
          ) : (
            <FlatList
              data={searchedTracks}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <SongItem
                  item={item}
                  onPress={play}
                  isPlaying={item === currentTrack}
                />
              )}
              onEndReached={onEndReached}
              onEndReachedThreshold={0.5}
              contentContainerStyle={styles.listContent}
            />
          )}
        </ScrollView>
      </LinearGradient>

      {/* Component Video ẩn để phát audio */}
      {currentTrack?.track.preview_url && (
        <Video
          ref={videoRef}
          //source={{ uri: currentTrack.track.preview_url }}
          source={{ uri: `http://10.0.2.2:5063/api/song/${currentTrack.track.id}/stream` }}
          paused={!isPlaying}
          onProgress={handleProgress}
          onLoad={handleLoad}
          onEnd={handleEnd}
          //audioOnly={true}
          style={styles.video}
          ignoreSilentSwitch="ignore"
          onError={(e) => console.log('Lỗi phát nhạc:', e.error)}
        />
      )}

      {/* Thanh điều khiển nhạc dưới cùng */}
      {currentTrack && (
        <Pressable
          onPress={() => setModalVisible(true)}
          style={styles.currentTrackContainer}
        >
          <View style={styles.trackInfoContainer}>
            <View style={styles.trackImageContainer}>
              {currentTrack.track.album.images?.[0]?.url ? (
                <Image
                  style={styles.trackImage}
                  source={{ uri: currentTrack.track.album.images[0].url }}
                />
              ) : (
                <Ionicons name="person-circle" size={40} color="white" />
              )}
              <Text numberOfLines={1} style={styles.trackTitle}>
                {currentTrack.track.name} · {currentTrack.track.artists[0].name}
              </Text>
            </View>
            <View style={styles.trackControls}>
              <AntDesign name="heart" size={24} color="#1DB954" />
              <Pressable onPress={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? (
                  <AntDesign name="pausecircle" size={24} color="white" />
                ) : (
                  <AntDesign name="playcircleo" size={24} color="white" />
                )}
              </Pressable>
            </View>
          </View>

          {/* Thanh tiến trình */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            <View
              style={[
                styles.progressCircle,
                { left: `${progress * 100}%` },
              ]}
            />
          </View>
        </Pressable>
      )}

      {/* Modal điều khiển phát nhạc */}
      <BottomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <ModalContent style={styles.modalContent}>
          <View style={styles.modalInner}>
            {/* Header modal */}
            <Pressable style={styles.modalHeader}>
              <AntDesign
                onPress={() => setModalVisible(false)}
                name="down"
                size={24}
                color="white"
              />
              <Text style={styles.modalTitle}>{currentTrack?.track.name}</Text>
              <Entypo name="dots-three-vertical" size={24} color="white" />
            </Pressable>

            {/* Nội dung chính */}
            <View style={styles.modalBody}>
              {/* Ảnh album */}
              <Image
                style={styles.albumArt}
                source={{ uri: currentTrack?.track.album.images[0]?.url }}
              />

              {/* Thông tin bài hát */}
              <View style={styles.songInfoContainer}>
                <View>
                  <Text style={styles.songTitle}>{currentTrack?.track.name}</Text>
                  <Text style={styles.artistName}>
                    {currentTrack?.track.artists[0].name}
                  </Text>
                </View>
                <AntDesign name="heart" size={24} color="#1DB954" />
              </View>

              {/* Thanh tiến trình */}
              <View style={styles.modalProgressContainer}>
                <View style={styles.modalProgressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${progress * 100}%` },
                    ]}
                  />
                  <View
                    style={[
                      styles.modalProgressCircle,
                      { left: `${progress * 100}%` },
                    ]}
                  />
                </View>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                  <Text style={styles.timeText}>{formatTime(totalDuration)}</Text>
                </View>
              </View>

              {/* Các nút điều khiển */}
              <View style={styles.playerControls}>
                <Pressable>
                  <FontAwesome name="arrows" size={30} color="#03C03C" />
                </Pressable>
                <Pressable onPress={playPreviousTrack}>
                  <Ionicons name="play-skip-back" size={30} color="white" />
                </Pressable>
                <Pressable onPress={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? (
                    <AntDesign name="pausecircle" size={60} color="white" />
                  ) : (
                    <Pressable style={styles.playButtonBig}>
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

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  currentTrackContainer: {
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
  },
  trackInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  trackImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  trackImage: {
    width: 40,
    height: 40,
  },
  trackTitle: {
    fontSize: 13,
    width: 150,
    color: 'white',
    fontWeight: 'bold',
    //borderWidth: 1,
  },
  trackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    //borderWidth: 1
  },
  progressContainer: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 7,
    height: 3,
    backgroundColor: 'gray',
    borderRadius: 5,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  progressCircle: {
    position: 'absolute',
    top: -4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
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
    //marginTop: 30,
  },
  playButtonBig: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: 0,
    height: 0,
    position: 'absolute',
  },
});

export default TrackListScreen;