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
  ScrollView
} from 'react-native';
import { usePlayer } from '../contexts/PlayerContextV2';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useProgress } from 'react-native-track-player';
import { ProgressBar } from './Player/ProgressBar';
import { PlayerControls } from '../components/Player/PlayerControls';

interface Lyric {
  startTime: string;
  text: string;
}

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
    <View style={styles.trackInfo}>
      <Text style={styles.trackTitle} numberOfLines={1}>
        {currentTrack?.title}
      </Text>
      <Text style={styles.artist}>
        {currentTrack?.artist}
      </Text>
    </View>
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
                  source={{ uri: currentTrack?.artwork }}
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
            <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
              <ProgressBar />
            </View>

            <View style={styles.controls}>
              <Pressable
                onPress={skipToPrevious}
                accessibilityLabel="Previous track"
              >
                <Ionicons name="play-skip-back" size={32} color="white" />
              </Pressable>

              <Pressable
                onPress={handlePlayPause}
                style={styles.playButton}
                accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Ionicons name="pause" size={48} color="white" />
                ) : (
                  <Ionicons name="play" size={48} color="white" />
                )}
              </Pressable>

              <Pressable
                onPress={skipToNext}
                accessibilityLabel="Next track"
              >
                <Ionicons name="play-skip-forward" size={32} color="white" />
              </Pressable>
            </View>
            <PlayerControls
              isPlaying={isPlaying}
              onPlay={handlePlayPause}
              onPause={pause}
              onNext={skipToNext}
              onPrevious={skipToPrevious}
            />
            <Image
              source={{ uri: currentTrack.artwork }}
              style={{ width: 200, height: 200, marginVertical: 10 }} // Ví dụ
            /><Image
              source={{ uri: currentTrack.artwork }}
              style={{ width: 200, height: 200, marginVertical: 10 }} // Ví dụ
            /><Image
              source={{ uri: currentTrack.artwork }}
              style={{ width: 200, height: 200, marginVertical: 10 }} // Ví dụ
            />
          </View>

        </ScrollView>
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
