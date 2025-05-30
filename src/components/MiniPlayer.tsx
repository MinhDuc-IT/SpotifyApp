import React from 'react';
import {Pressable, View, Image, Text, StyleSheet} from 'react-native';
import {usePlayer} from '../contexts/PlayerContextV2';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ProgressBar} from './Player/ProgressBar';

const MiniPlayer = () => {
  const {showModal, currentTrack, isPlaying, play, pause} = usePlayer();

  console.log('miniplayer1');
  if (!currentTrack) return null;
  console.log('miniplayer2');

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play(currentTrack);
    }
  };

  return (
    <>
      <Pressable style={styles.container} onPress={showModal}>
        <Image source={{uri: currentTrack.artwork}} style={styles.thumbnail} />
        <View style={styles.trackInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentTrack.artist}
          </Text>
        </View>
        <Pressable
          onPress={e => {
            e.stopPropagation();
            handlePlayPause();
          }}
          style={styles.controlButton}>
          {isPlaying ? (
            <AntDesign name="pausecircle" size={24} color="white" />
          ) : (
            <AntDesign name="playcircleo" size={24} color="white" />
          )}
        </Pressable>
      </Pressable>

      {/* ProgressBar separate below MiniPlayer */}
      <View style={{top: 10}}>
        <ProgressBar showTime={false} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 2,
    left: 0,
    right: 0,
    backgroundColor: '#2c2c2c',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    zIndex: 10,
    marginHorizontal: 5,
    borderRadius: 4,
    paddingVertical: 2,
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  trackInfo: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  artist: {
    color: 'lightgray',
    fontSize: 12,
    marginTop: 2,
  },
  controlButton: {
    padding: 10,
  },
});

export default MiniPlayer;
