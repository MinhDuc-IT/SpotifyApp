// components/MiniPlayer.tsx
import React from 'react';
import { Pressable, View, Image, Text, StyleSheet } from 'react-native';
import { usePlayer } from '../contexts/PlayerContext';
import AntDesign from 'react-native-vector-icons/AntDesign';

const MiniPlayer = () => {
  const { state, dispatch } = usePlayer();

  if (!state.currentTrack) return null;

  return (
    <Pressable 
      style={styles.container}
      onPress={() => dispatch({ type: 'TOGGLE_MODAL' })}
    >
      <Image
        source={{ uri: state.currentTrack.album.images[0]?.url }}
        style={styles.thumbnail}
      />
      <View style={styles.trackInfo}>
        <Text style={styles.title} numberOfLines={1}>
          {state.currentTrack.name}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {state.currentTrack.artists[0]?.name}
        </Text>
      </View>
      <Pressable
        onPress={() => dispatch({ type: 'TOGGLE_PLAY' })}
        style={styles.controlButton}
      >
        {state.isPlaying ? (
          <AntDesign name="pausecircle" size={24} color="white" />
        ) : (
          <AntDesign name="playcircleo" size={24} color="white" />
        )}
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#2c2c2c',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
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
  },
  artist: {
    color: 'lightgray',
    fontSize: 12,
  },
  controlButton: {
    padding: 10,
  },
});

export default MiniPlayer;