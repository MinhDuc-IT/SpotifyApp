// import React, { useEffect, useState } from 'react';
// import { Modal, View, Text, Image, Pressable, StyleSheet, Animated } from 'react-native';
// import { usePlayer } from '../contexts/PlayerContext';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// const PlayerModal = () => {
//     const { state, dispatch } = usePlayer();
//     const [progress, setProgress] = useState(new Animated.Value(0)); // Khởi tạo Animated Value cho progress
//     const [isSeeking, setIsSeeking] = useState(false);

//     // Cập nhật progress mỗi khi tiến độ thay đổi
//     useEffect(() => {
//         if (!isSeeking) {
//             Animated.timing(progress, {
//                 toValue: state.progress * 100, // Đưa giá trị về 0-100 để dễ xử lý
//                 duration: 1000, // Thời gian thay đổi (1s)
//                 useNativeDriver: false,
//             }).start();
//         }
//     }, [state.progress, isSeeking]);

//     // Khi người dùng kéo thanh tiến trình
//     const handleSeek = (time: number) => {
//         dispatch({ type: 'SET_PROGRESS', progress: time });
//         setIsSeeking(false); // Đặt trạng thái seeking là false khi người dùng hoàn thành
//     };

//     const handleSlidingStart = () => {
//         setIsSeeking(true); // Khi bắt đầu kéo slider
//     };

//     return (
//         <Modal
//             visible={state.modalVisible}
//             animationType="slide"
//             transparent={true}
//             onRequestClose={() => dispatch({ type: 'TOGGLE_MODAL' })}>
//             <View style={styles.modalContainer}>
//                 <View style={styles.modalContent}>
//                     <Pressable
//                         style={styles.closeButton}
//                         onPress={() => dispatch({ type: 'TOGGLE_MODAL' })}>
//                         <AntDesign name="down" size={24} color="white" />
//                     </Pressable>

//                     <Image
//                         source={{ uri: state.currentTrack?.album.images[0]?.url }}
//                         style={styles.albumArt}
//                     />

//                     <View style={styles.trackInfo}>
//                         <Text style={styles.trackTitle}>{state.currentTrack?.name}</Text>
//                         <Text style={styles.artist}>
//                             {state.currentTrack?.artists[0]?.name}
//                         </Text>
//                     </View>

//                     <View style={styles.controls}>
//                         <Pressable style={styles.controlButton}
//                             onPress={() => dispatch({ type: 'PREV_TRACK' })}
//                         >
//                             <Ionicons name="play-skip-back" size={32} color="white" />
//                         </Pressable>

//                         <Pressable
//                             onPress={() => dispatch({ type: 'TOGGLE_PLAY' })}
//                             style={styles.mainControl}>
//                             {state.isPlaying ? (
//                                 <Ionicons name="pause" size={48} color="white" />
//                             ) : (
//                                 <Ionicons name="play" size={48} color="white" />
//                             )}
//                         </Pressable>

//                         <Pressable style={styles.controlButton}
//                             onPress={() => dispatch({ type: 'NEXT_TRACK' })}
//                         >
//                             <Ionicons name="play-skip-forward" size={32} color="white" />
//                         </Pressable>
//                     </View>

//                     {/* Thanh tiến trình phát nhạc */}
//                     <View style={styles.progressContainer}>
//                         <View style={styles.progressBarBackground}>
//                             <Animated.View
//                                 style={[
//                                     styles.progressBar,
//                                     {
//                                         width: progress.interpolate({
//                                             inputRange: [0, 100],
//                                             outputRange: ['0%', '100%'],
//                                         }),
//                                     },
//                                 ]}
//                             />
//                         </View>
//                         {/* Thời gian */}
//                         <View style={styles.timeContainer}>
//                             <Text style={styles.timeText}>
//                                 {formatTime(state.progress * state.duration)}
//                             </Text>
//                             <Text style={styles.timeText}>
//                                 {formatTime(state.duration)}
//                             </Text>
//                         </View>
//                     </View>

//                 </View>
//             </View>
//         </Modal>
//     );
// };

// // Helper format thời gian
// const formatTime = (seconds: number) => {
//     const min = Math.floor(seconds / 60);
//     const sec = Math.floor(seconds % 60);
//     return `${min}:${sec < 10 ? '0' + sec : sec}`;
// };

// const styles = StyleSheet.create({
//     modalContainer: {
//         flex: 1,
//         backgroundColor: 'rgba(0,0,0,0.8)',
//         justifyContent: 'flex-end',
        
//     },
//     modalContent: {
//         backgroundColor: '#202020',
//         padding: 20,
//         borderTopLeftRadius: 12,
//         borderTopRightRadius: 12,
//         alignItems: 'center',
//         height: '100%',
//         width: '100%',
//     },
//     albumArt: {
//         width: 300,
//         height: 300,
//         borderRadius: 8,
//         marginVertical: 20,
//     },
//     trackInfo: {
//         alignItems: 'center',
//         marginBottom: 20,
//     },
//     trackTitle: {
//         color: 'white',
//         fontSize: 24,
//         fontWeight: 'bold',
//     },
//     artist: {
//         color: 'lightgray',
//         fontSize: 18,
//     },
//     controls: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         width: '100%',
//         paddingHorizontal: 40,
//         marginBottom: 15,
//     },
//     mainControl: {
//         padding: 20,
//     },
//     controlButton: {
//         padding: 10,
//     },
//     closeButton: {
//         position: 'absolute',
//         top: 10,
//         left: 10,
//         padding: 10,
//     },
//     progressContainer: {
//         width: '100%',
//         marginBottom: 10,
//     },
//     progressBarBackground: {
//         height: 4,
//         backgroundColor: '#ccc',
//         borderRadius: 2,
//         overflow: 'hidden',
//     },
//     progressBar: {
//         height: 4,
//         backgroundColor: '#1DB954',
//     },
//     timeContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: 4,
//         width: '100%',
//     },
//     timeText: {
//         color: 'lightgray',
//         fontSize: 14,
//     },
// });

// export default PlayerModal;



import React, { useEffect, useMemo, useRef, useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  Image, 
  Pressable, 
  StyleSheet, 
  Animated, 
  FlatList
} from 'react-native';
import { usePlayer } from '../contexts/PlayerContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Lyric {
  startTime: string;
  text: string;
}

const PlayerModal = () => {
  const { state, dispatch } = usePlayer();
  const progress = useRef(new Animated.Value(0)).current;
  const [lyricsCache, setLyricsCache] = useState<Record<string, Lyric[]>>({});
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);
  const [showLyrics, setShowLyrics] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<FlatList>(null);

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
  useEffect(() => {
    Animated.timing(progress, {
      toValue: state.progress * 100,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [state.progress]);

  // Lyric fetching with AbortController
  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchLyrics = async () => {
      if (!state.currentTrack) return;
      const trackId = state.currentTrack.id.toString();
      
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
  }, [state.currentTrack]);

  // Binary search for lyric timing
  useEffect(() => {
    if (!state.currentTrack || !state.duration) return;
    
    const trackId = state.currentTrack.id.toString();
    const lyrics = lyricsCache[trackId] || [];
    if (!lyrics.length) return;

    const currentTime = state.progress * state.duration;
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
  }, [state.progress, lyricsCache, state.currentTrack, state.duration]);

  const handleFlip = () => {
    Animated.spring(flipAnim, {
      toValue: showLyrics ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start(() => setShowLyrics(!showLyrics));
  };

  const currentLyrics = state.currentTrack
    ? lyricsCache[state.currentTrack.id.toString()] || []
    : [];

  const TrackInfo = React.memo(() => (
    <View style={styles.trackInfo}>
      <Text style={styles.trackTitle} numberOfLines={1}>
        {state.currentTrack?.name}
      </Text>
      <Text style={styles.artist}>
        {state.currentTrack?.artists[0]?.name}
      </Text>
    </View>
  ));

  return (
    <Modal
      visible={state.modalVisible}
      transparent
      onRequestClose={() => dispatch({ type: 'TOGGLE_MODAL' })}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Pressable
            style={styles.closeButton}
            onPress={() => dispatch({ type: 'TOGGLE_MODAL' })}
          >
            <AntDesign name="down" size={24} color="white" />
          </Pressable>

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
                source={{ uri: state.currentTrack?.album.images[0]?.url }}
                style={styles.albumArt}
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

          <View style={styles.controls}>
            <Pressable 
              onPress={() => dispatch({ type: 'PREV_TRACK' })}
              accessibilityLabel="Previous track"
            >
              <Ionicons name="play-skip-back" size={32} color="white" />
            </Pressable>
            
            <Pressable 
              onPress={() => dispatch({ type: 'TOGGLE_PLAY' })}
              style={styles.playButton}
              accessibilityLabel={state.isPlaying ? 'Pause' : 'Play'}
            >
              {state.isPlaying ? (
                <Ionicons name="pause" size={48} color="white" />
              ) : (
                <Ionicons name="play" size={48} color="white" />
              )}
            </Pressable>
            
            <Pressable 
              onPress={() => dispatch({ type: 'NEXT_TRACK' })}
              accessibilityLabel="Next track"
            >
              <Ionicons name="play-skip-forward" size={32} color="white" />
            </Pressable>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  { width: progress.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%']
                  })}
                ]}
              />
            </View>
            <View style={styles.timeLabels}>
              <Text style={styles.timeText}>
                {formatTime(state.progress * state.duration)}
              </Text>
              <Text style={styles.timeText}>
                {formatTime(state.duration)}
              </Text>
            </View>
          </View>
        </View>
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
    flex: 1,
    backgroundColor: '#181818',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  flipCard: {
    width: 280,
    height: 280,
    backfaceVisibility: 'hidden',
    borderRadius: 8,
    overflow: 'hidden',
  },
  albumArt: {
    width: '100%',
    height: '100%',
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
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  trackTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    maxWidth: '90%',
  },
  artist: {
    color: '#b3b3b3',
    fontSize: 16,
    marginTop: 8,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 24,
  },
  playButton: {
    backgroundColor: '#1DB954',
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
  },
  errorText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
});
export default PlayerModal;