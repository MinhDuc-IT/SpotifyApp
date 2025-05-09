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

const { width, height } = Dimensions.get('window');

const PlayerModal = () => {
  const { currentTrack, isPlaying, skipToNext, pause, play, skipToPrevious, modalVisible, hideModal, lyrics, currentLyricIndex } = usePlayer();
  const { position, duration } = useProgress();
  const [showLyrics, setShowLyrics] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

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

  const handleFlip = () => {
    Animated.spring(flipAnim, {
      toValue: showLyrics ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start(() => setShowLyrics(!showLyrics));
  };

  useEffect(() => {
    if (scrollRef.current && currentLyricIndex >= 0 && lyrics.length > 0) {
      const itemHeight = 35; // Chiều cao mỗi dòng
      const offset = itemHeight * currentLyricIndex; // Vị trí cuộn đến
      const screenHeight = height - 350;
      const middleOffset = offset - screenHeight / 2 + itemHeight / 2; // Đảm bảo lyric nằm ở giữa

      setTimeout(() => {
        scrollRef.current?.scrollTo({
          y: middleOffset, // Cuộn đến vị trí giữa
          animated: true,
        });
      }, 50);
    }
  }, [currentLyricIndex, lyrics]);

  const TrackInfo = React.memo(() => (
    <View style={styles.container}>
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
    <Modal visible={modalVisible} transparent onRequestClose={hideModal}>
      <View style={styles.modalContainer}>
        <FlatList
          style={{ flex: 1 }}
          data={[1]}
          keyExtractor={(item) => item.toString()}
          renderItem={() => (
            <View style={styles.modalContent}>
              <Pressable style={styles.closeButton} onPress={hideModal}>
                <AntDesign name="down" size={24} color="#FFFFFF" />
              </Pressable>

              <View style={{ width: width, height: height - 150 }}>
                <Pressable onPress={handleFlip}>
                  <Animated.View
                    style={[
                      styles.flipCard,
                      {
                        transform: [{ rotateY: frontInterpolate }, { perspective: 1000 }],
                      },
                    ]}
                  >
                    <Image source={{ uri: currentTrack?.artwork }} style={styles.albumArt} />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.7)', 'black']}
                      style={StyleSheet.absoluteFillObject}
                      locations={[0.5, 0.8, 1]} // Mờ dần từ nửa ảnh trở xuống
                    />
                  </Animated.View>

                  <Animated.View
                    style={[
                      styles.flipCard,
                      styles.lyricCard,
                      {
                        transform: [{ rotateY: backInterpolate }, { perspective: 1000 }],
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,9)', 'black']}
                      style={StyleSheet.absoluteFillObject}
                      locations={[0.5, 0.8, 1]} // Mờ dần từ nửa ảnh trở xuống
                    />
                    {lyrics.length > 0 ? (
                      <ScrollView
                        ref={scrollRef}
                        contentContainerStyle={styles.lyricContainer}
                        showsVerticalScrollIndicator={false}
                      >
                        {lyrics.map((item, index) => (
                          <Text
                            key={index}
                            style={[
                              styles.lyricLine,
                              index === currentLyricIndex && styles.activeLyric,
                            ]}
                          >
                            {item.text}
                          </Text>
                        ))}
                      </ScrollView>
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
                  <Pressable onPress={skipToPrevious} accessibilityLabel="Previous track">
                    <Ionicons name="play-skip-back" size={32} color="#FFFFFF" />
                  </Pressable>

                  <Pressable onPress={handlePlayPause} style={styles.playButton} accessibilityLabel={isPlaying ? 'Pause' : 'Play'}>
                    {isPlaying ? (
                      <Ionicons name="pause" size={30} color="black" />
                    ) : (
                      <Ionicons name="play" size={30} color="black" />
                    )}
                  </Pressable>

                  <Pressable onPress={skipToNext} accessibilityLabel="Next track">
                    <Ionicons name="play-skip-forward" size={32} color="#FFFFFF" />
                  </Pressable>
                </View>
              </View>
              <ArtistInfoCard artistName={currentTrack?.artist ?? 'Kai Dinh'} />
              <ArtistDiscoverCard artistName={currentTrack?.artist ?? 'Kai Dinh'} />
            </View>
          )}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    // borderWidth: 1,
    // borderColor: 'red',
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
    paddingBottom: 200,
  },
  lyricLine: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 8,
    paddingHorizontal: 20,
  },
  activeLyric: {
    //color: '#1DB954',
    fontSize: 18,
    fontWeight: '600',
    textShadowColor: 'rgba(29, 185, 84, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    transform: [{ scale: 1.1 }], // Thêm hiệu ứng phóng to nhẹ
    color: '#FFFFFF', // Đổi màu chữ thành trắng khi đang được highlight
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
