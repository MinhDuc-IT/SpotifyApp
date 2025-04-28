import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import { usePlayer } from '../contexts/PlayerContextV2';
import { ProgressBar } from '../components/Player/ProgressBar';
import { PlayerControls } from '../components/Player/PlayerControls';
import { LyricView } from '../components/Player/LyricView';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const PlayerScreen = () => {
  const { currentTrack, lyrics, currentLyricIndex, play, pause, isPlaying, skipToNext, skipToPrevious } = usePlayer();
  const navigation = useNavigation();

  const handlePlay = () => {
    console.log("handlePlay" + currentTrack);
    if (currentTrack) {
      play(currentTrack);
    }
  };

  return (
    <View style={styles.container}>
        {/* Thêm nút back */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <Image 
        source={{ uri: currentTrack?.artwork }} 
        style={styles.albumArt} 
      />
      
      <LyricView 
        lyrics={lyrics} 
        currentIndex={currentLyricIndex} 
      />

      <View style={styles.trackInfo}>
        <Text style={styles.title}>{currentTrack?.title}</Text>
        <Text style={styles.artist}>{currentTrack?.artist}</Text>
      </View>

      <ProgressBar />
      
      <PlayerControls 
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={pause}
        onNext={skipToNext}
        onPrevious={skipToPrevious}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  albumArt: {
    width: 300,
    height: 300,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 20,
  },
  trackInfo: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  artist: {
    color: '#888',
    fontSize: 18,
    marginTop: 8,
  },
});