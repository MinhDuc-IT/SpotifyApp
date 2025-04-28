import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
};

export const PlayerControls = ({ isPlaying, onPlay, onPause, onNext, onPrevious }: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPrevious}>
        <Icon name="skip-previous" size={40} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity onPress={isPlaying ? onPause : onPlay}>
        <Icon 
          name={isPlaying ? "pause-circle-filled" : "play-circle-filled"} 
          size={60} 
          color="#fff" 
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={onNext}>
        <Icon name="skip-next" size={40} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginVertical: 20,
  },
});