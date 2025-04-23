// components/PlayerControls.tsx
import React from 'react';
import { View, Pressable, Text, StyleSheet, Image } from 'react-native';
import { usePlayer } from '../contexts/PlayerContext';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface PlayerControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onOpenModal: () => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({ isPlaying, onTogglePlay, onOpenModal }) => {
  const { state } = usePlayer();

  return (
    <Pressable style={styles.container} onPress={onOpenModal}>
      <Image
        source={{ uri: state.currentTrack?.album.images[0]?.url }}
        style={styles.thumbnail}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{state.currentTrack?.name}</Text>
        <Text style={styles.artist}>{state.currentTrack?.artists[0]?.name}</Text>
      </View>
      <Pressable onPress={onTogglePlay}>
        {isPlaying ? (
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
        flexDirection: 'row',
        backgroundColor: '#1e1e1e',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    thumbnail: {
        width: 50,
        height: 50,
        borderRadius: 5,
    },
    infoContainer: {
        flex: 1,
        marginHorizontal: 10,
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
    },
    artist: {
        color: '#ccc',
        fontSize: 12,
    },
});

export default PlayerControls;