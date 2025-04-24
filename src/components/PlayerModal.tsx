import React, { useEffect, useState, useRef } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  Image, 
  Pressable, 
  StyleSheet, 
  Animated, 
  ScrollView 
} from 'react-native';
import { usePlayer } from '../contexts/PlayerContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import axios from '../'

interface Lyric {
  startTime: string;
  text: string;
}

const PlayerModal = () => {
  const { state, dispatch } = usePlayer();
  const [progress] = useState(new Animated.Value(0));
  const [lyricsCache, setLyricsCache] = useState<Record<string, Lyric[]>>({});
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);
  const [showLyrics, setShowLyrics] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  // Animation interpolations
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  // Progress animation
  useEffect(() => {
    Animated.timing(progress, {
      toValue: state.progress * 100,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [state.progress]);

  // Lyric handling
  useEffect(() => {
    const fetchLyrics = async () => {
      if (!state.currentTrack) return;
      const trackId = state.currentTrack.id.toString();
      
      if (!lyricsCache[trackId]) {
        try {
          const resp = await fetch(`http://10.0.2.2:5063/api/song/${trackId}/lyric`);
          const data = await resp.json();
          setLyricsCache(prev => ({ ...prev, [trackId]: data }));
        } catch (err) {
          console.error('Lyric fetch error:', err);
        }
      }
    };
    
    fetchLyrics();
  }, [state.currentTrack]);

  // Lyric timing logic
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

    const newIndex = timePoints.reduce((acc, t, i) => 
      t <= currentTime ? i : acc, 0
    );
    
    setCurrentLyricIndex(newIndex);
    scrollRef.current?.scrollTo({
      y: newIndex * 35,
      animated: true
    });
  }, [state.progress, lyricsCache, state.currentTrack, state.duration]);

  // Flip animation handler
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
            {/* Album Art Front */}
            <Animated.View style={[
              styles.flipCard, 
              { transform: [{ rotateY: frontInterpolate }] }
            ]}>
              <Image
                source={{ uri: state.currentTrack?.album.images[0]?.url }}
                style={styles.albumArt}
              />
            </Animated.View>

            {/* Lyrics Back */}
            <Animated.View style={[
              styles.flipCard, 
              styles.lyricCard,
              { transform: [{ rotateY: backInterpolate }] }
            ]}>
              <ScrollView
                ref={scrollRef}
                contentContainerStyle={styles.lyricContainer}
                showsVerticalScrollIndicator={false}
              >
                {currentLyrics.map((lyric, i) => (
                  <Text
                    key={i}
                    style={[
                      styles.lyricLine,
                      i === currentLyricIndex && styles.activeLyric
                    ]}
                  >
                    {lyric.text}
                  </Text>
                ))}
              </ScrollView>
            </Animated.View>
          </Pressable>

          {/* Track Info */}
          <View style={styles.trackInfo}>
            <Text style={styles.trackTitle} numberOfLines={1}>
              {state.currentTrack?.name}
            </Text>
            <Text style={styles.artist}>
              {state.currentTrack?.artists[0]?.name}
            </Text>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <Pressable onPress={() => dispatch({ type: 'PREV_TRACK' })}>
              <Ionicons name="play-skip-back" size={32} color="white" />
            </Pressable>
            
            <Pressable 
              onPress={() => dispatch({ type: 'TOGGLE_PLAY' })}
              style={styles.playButton}
            >
              {state.isPlaying ? (
                <Ionicons name="pause" size={48} color="white" />
              ) : (
                <Ionicons name="play" size={48} color="white" />
              )}
            </Pressable>
            
            <Pressable onPress={() => dispatch({ type: 'NEXT_TRACK' })}>
              <Ionicons name="play-skip-forward" size={32} color="white" />
            </Pressable>
          </View>

          {/* Progress Bar */}
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
    justifyContent: 'flex-end',
  },
  modalContent: {
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
});

export default PlayerModal;