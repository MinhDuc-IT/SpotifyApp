import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Animated,
  FlatList,
  ScrollView,
  Dimensions
} from 'react-native';
import { usePlayer } from '../contexts/PlayerContextV2';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useProgress } from 'react-native-track-player';
import { ProgressBar } from './Player/ProgressBar';
import { PlayerControls } from '../components/Player/PlayerControls';
import LinearGradient from 'react-native-linear-gradient';
import { ArtistInfoCard } from './Artist/ArtistInfoCard';
import { ArtistDiscoverCard } from './Artist/ArtistDiscoverCard';

interface Lyric {
  startTime: string;
  text: string;
}

const { width, height } = Dimensions.get('window');

const PlayerModal = () => {
  //const { state, dispatch } = usePlayer();
  const { currentTrack, isPlaying, skipToNext, pause, play, skipToPrevious, modalVisible, hideModal } = usePlayer();
  const { position, duration } = useProgress();
  //const progress = useRef(new Animated.Value(0)).current;
  const [lyricsCache, setLyricsCache] = useState<Record<string, Lyric[]>>({});
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);
  const [showLyrics, setShowLyrics] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<FlatList>(null);

  // Lyric fetching with AbortController
  useEffect(() => {
    const abortController = new AbortController();

    const fetchLyrics = async () => {
      if (!currentTrack) return;
      const trackId = currentTrack.id.toString();

      if (!lyricsCache[trackId]) {
        try {
          const resp = await fetch(
            `http://10.0.2.2:5063/api/song/${trackId}/lyric`,
            { signal: abortController.signal }
          );
          const data = await resp.json();
          setLyricsCache(prev => ({ ...prev, [trackId]: data }));
        } catch (err) {
          if (!abortController.signal.aborted) {
            console.error('Lyric fetch error:', err);
          }
        }
      }
    };

    fetchLyrics();
    return () => abortController.abort();
  }, [currentTrack]);

  // Binary search for lyric timing
  useEffect(() => {
    if (!currentTrack) return;

    const trackId = currentTrack.id.toString();
    const lyrics = lyricsCache[trackId] || [];
    if (!lyrics.length) return;

    const currentTime = position * duration;
    const timePoints = lyrics.map(l => {
      const [h, m, s] = l.startTime.split(':').map(Number);
      return h * 3600 + m * 60 + s;
    });

    // Binary search implementation
    const findLyricIndex = () => {
      let low = 0;
      let high = timePoints.length - 1;
      let result = -1;

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (timePoints[mid] <= currentTime) {
          result = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }
      return result;
    };

    const newIndex = findLyricIndex();
    setCurrentLyricIndex(newIndex);

    // Scroll to current lyric
    if (scrollRef.current && newIndex > -1) {
      scrollRef.current.scrollToIndex({
        index: newIndex,
        animated: true,
        viewPosition: 0.5
      });
    }
  }, [position, lyricsCache, currentTrack, duration]);


  // Memoized interpolations
  const frontInterpolate = useMemo(() =>
    flipAnim.interpolate({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg'],
    }),
    [flipAnim]
  );

  const backInterpolate = useMemo(() =>
    flipAnim.interpolate({
      inputRange: [0, 180],
      outputRange: ['180deg', '360deg'],
    }),
    [flipAnim]
  );

  // Progress animation
  // useEffect(() => {
  //   Animated.timing(progress, {
  //     toValue: state.progress * 100,
  //     duration: 500,
  //     useNativeDriver: false,
  //   }).start();
  // }, [state.progress]);


  const handleFlip = () => {
    Animated.spring(flipAnim, {
      toValue: showLyrics ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start(() => setShowLyrics(!showLyrics));
  };

  const currentLyrics = currentTrack
    ? lyricsCache[currentTrack.id.toString()] || []
    : [];

  const TrackInfo = React.memo(() => (
    <View
      style={styles.container}
    >
      <Image
        source={{ uri: currentTrack?.artwork }}
        style={styles.thumbnail}
      />
      <View style={styles.trackInfo}>
        <Text style={styles.title} numberOfLines={1}>
          {currentTrack?.title}
        </Text>
        <Text style={styles.artistinfo} numberOfLines={1}>
          {currentTrack?.artist}
        </Text>
      </View>
    </View>
    // <View style={styles.trackInfo}>
    //   <Text style={styles.trackTitle} numberOfLines={1}>
    //     {currentTrack?.title}
    //   </Text>
    //   <Text style={styles.artist}>
    //     {currentTrack?.artist}
    //   </Text>
    // </View>
  ));

  if (!currentTrack) return null;

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play(currentTrack);
    }
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      onRequestClose={hideModal}
    >
      <View style={styles.modalContainer}>
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.modalContent}>
            <Pressable
              style={styles.closeButton}
              onPress={hideModal}
            >
              <AntDesign name="down" size={24} color="#FFFFFF" />
            </Pressable>

            <View style={{width: width, height: height - 150}}>
            <Pressable onPress={handleFlip}>
              <Animated.View style={[
                styles.flipCard,
                {
                  transform: [
                    { rotateY: frontInterpolate },
                    { perspective: 1000 }
                  ]
                }
              ]}>
                <Image
                  source={{ uri: currentTrack?.artwork }}
                  style={styles.albumArt}
                />
                <LinearGradient
    colors={['transparent', 'rgba(0,0,0,0.7)', 'black']}
    style={StyleSheet.absoluteFillObject}
    locations={[0.5, 0.8, 1]} // Mờ dần từ nửa ảnh trở xuống
  />
              </Animated.View>

              <Animated.View style={[
                styles.flipCard,
                styles.lyricCard,
                {
                  transform: [
                    { rotateY: backInterpolate },
                    { perspective: 1000 }
                  ]
                }
              ]}>
                {currentLyrics.length > 0 ? (
                  <FlatList
                    ref={scrollRef}
                    data={currentLyrics}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item, index }) => (
                      <Text
                        style={[
                          styles.lyricLine,
                          index === currentLyricIndex && styles.activeLyric
                        ]}
                      >
                        {item.text}
                      </Text>
                    )}
                    getItemLayout={(_, index) => ({
                      length: 35,
                      offset: 35 * index,
                      index
                    })}
                    initialScrollIndex={currentLyricIndex}
                    contentContainerStyle={styles.lyricContainer}
                    showsVerticalScrollIndicator={false}
                  />
                ) : (
                  <Text style={styles.errorText}>Lyrics not available</Text>
                )}
              </Animated.View>
            </Pressable>

            <TrackInfo />
            <View style={{ paddingHorizontal: 20, position: 'absolute', bottom: 70, width: '100%' }}>
              <ProgressBar />
            </View>

            <View style={styles.controls}>
              <Pressable
                onPress={skipToPrevious}
                accessibilityLabel="Previous track"
              >
                <Ionicons name="play-skip-back" size={32} color="#FFFFFF" />
              </Pressable>

              <Pressable
                onPress={handlePlayPause}
                style={styles.playButton}
                accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Ionicons name="pause" size={30} color="black" />
                ) : (
                  <Ionicons name="play" size={30} color="black" />
                )}
              </Pressable>

              <Pressable
                onPress={skipToNext}
                accessibilityLabel="Next track"
              >
                <Ionicons name="play-skip-forward" size={32} color="#FFFFFF" />
              </Pressable>
            </View>
            </View>

            {/* <PlayerControls
              isPlaying={isPlaying}
              onPlay={handlePlayPause}
              onPause={pause}
              onNext={skipToNext}
              onPrevious={skipToPrevious}
            /> */}
            <ArtistInfoCard artistName={currentTrack?.artist ?? "Kai Dinh"} />
            <ArtistDiscoverCard artistName={currentTrack?.artist ?? "Kai Dinh"} />
          </View>

        </ScrollView>
      </View>
        <View style={{height: 35, zIndex: 0}}>

        </View>
    </Modal>
  );
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    //justifyContent: 'flex-end',
  },
  modalContent: {
    //flex: 1,
    backgroundColor: '#181818',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    //paddingTop: 40,
    alignItems: 'center',
  },
  flipCard: {
    width: width,
    height: height - 150,
    backfaceVisibility: 'hidden',
    borderRadius: 8,
    overflow: 'hidden',
  },
  albumArt: {
    width: '100%',
    height: '100%',
    //resizeMode: 'cover',
  },
  lyricCard: {
    position: 'absolute',
    backgroundColor: '#282828',
  },
  lyricContainer: {
    paddingVertical: 20,
    minHeight: 280,
    justifyContent: 'center',
  },
  lyricLine: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 8,
    paddingHorizontal: 20,
  },
  activeLyric: {
    color: '#1DB954',
    fontSize: 18,
    fontWeight: '600',
    textShadowColor: 'rgba(29, 185, 84, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  trackInfo: {
    width: '100%',
    //alignItems: 'center',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 24,
  },
  trackTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    maxWidth: '90%',
  },
  artist: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 8,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
    position: 'absolute',
    bottom: -15,
    paddingHorizontal: 20,
  },
  playButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    padding: 16,
    elevation: 5,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 16,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#404040',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1DB954',
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    color: '#a0a0a0',
    fontSize: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    zIndex: 10,
  },
  errorText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  container: {
    height: 60,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    position: 'absolute',
    bottom: 100,
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  artistinfo: {
    color: '#FFFFFF'
  }
});
export default PlayerModal;

// MusicPlayerBottomSheet.tsx
// import React, { useMemo, useRef, useEffect } from 'react';
// import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
// import BottomSheet from '@gorhom/bottom-sheet';
// import { usePlayer } from '../contexts/PlayerContextV2';

// const PlayerModal = () => {
//   const bottomSheetRef = useRef<BottomSheet>(null);
//   const { currentTrack, isPlaying, skipToNext, pause, play, skipToPrevious, modalVisible, hideModal } = usePlayer();

//   useEffect(() => {
//     if (modalVisible) {
//       bottomSheetRef.current?.expand();
//     }
//   }, [modalVisible]);

//   // Các mốc kéo: 30% (mini) và 100% (full screen)
//   const snapPoints = useMemo(() => ['30%', '100%'], []);

//   return (
//     <BottomSheet
//       ref={bottomSheetRef}
//       index={0}
//       snapPoints={snapPoints}
//       enablePanDownToClose={false}
//       backgroundStyle={{ backgroundColor: '#121212' }}
//       handleIndicatorStyle={{ backgroundColor: '#ccc' }}
//     >
//       <View style={{ flex: 1 }}>
//         <View style={{ alignItems: 'center', padding: 16 }}>
//           {/* Ảnh nền */}
//           <Image
//             source={{ uri: currentTrack?.artwork }}
//             style={{ width: 300, height: 300, borderRadius: 8 }}
//             resizeMode="cover"
//           />
//           {/* Tiêu đề bài hát */}
//           <Text style={{ color: 'white', fontSize: 20, marginTop: 12 }}>{currentTrack?.title}</Text>
//           {/* Tên nghệ sĩ */}
//           <Text style={{ color: 'gray', fontSize: 16 }}>{currentTrack?.artist}</Text>
//         </View>

//         {/* Nội dung scroll được */}
//         <ScrollView contentContainerStyle={{ padding: 16 }}>
//           <Text style={{ color: 'white', fontSize: 16 }}>
//             {/* Lyrics hoặc thông tin thêm */}
//             Đây là lời bài hát... Đây là lời bài hát... Đây là lời bài hát... Đây là lời bài hát...
//           </Text>
//         </ScrollView>

//         {/* Thanh điều khiển nhạc */}
//         <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 16 }}>
//           <TouchableOpacity>
//             <Text style={{ color: 'white' }}>⏮️</Text>
//           </TouchableOpacity>
//           <TouchableOpacity>
//             <Text style={{ color: 'white', fontSize: 30 }}>▶️</Text>
//           </TouchableOpacity>
//           <TouchableOpacity>
//             <Text style={{ color: 'white' }}>⏭️</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </BottomSheet>
//   );
// };

// export default PlayerModal;
