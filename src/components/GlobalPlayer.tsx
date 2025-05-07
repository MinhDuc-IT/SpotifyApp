// components/GlobalPlayer.tsx
import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import Video, {VideoRef} from 'react-native-video';
// import { usePlayer } from '../contexts/PlayerContext';
import MiniPlayer from './MiniPlayer';
import PlayerModal from './PlayerModal';
import {usePlayer} from '../contexts/PlayerContextV2';

const GlobalPlayer = () => {
  //const { state, dispatch } = usePlayer();
  //const videoRef = useRef<VideoRef>(null);
  const {modalVisible} = usePlayer();

  // useEffect(() => {
  //   if (videoRef.current) {
  //     state.isPlaying ? videoRef.current.resume() : videoRef.current.pause();
  //   }
  // }, [state.isPlaying]);

  // const handleProgress = (data: { currentTime: number }) => {
  //   const progress = data.currentTime / (state.duration || 1);
  //   dispatch({ type: 'SET_PROGRESS', progress });
  // };

  // const handleLoad = (data: { duration: number }) => {
  //   dispatch({ type: 'SET_DURATION', duration: data.duration });
  // };

  // const handleEnd = () => {
  //   dispatch({ type: 'NEXT_TRACK' });
  // };

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 70,
        left: 0,
        right: 0,
        // zIndex: 10,
        //backgroundColor: '#fff', // hoặc gradient
        padding: 10,
        //borderTopWidth: 1,
        borderColor: '#ddd',
      }}>
      {/* {state.currentTrack?.preview_url && (
        <Video
          ref={videoRef}
          //source={{ uri: state.currentTrack.preview_url }}
          source={{ uri: `http://10.0.2.2:5063/api/song/${state.currentTrack.id}/stream` }}
          paused={!state.isPlaying}
          onProgress={handleProgress}
          onLoad={handleLoad}
          onEnd={handleEnd}
          //audioOnly={true}
          style={styles.audioElement}
          ignoreSilentSwitch="ignore"
        />
      )} */}

      <MiniPlayer />
      {modalVisible && (
        <ScrollView >
          <PlayerModal />
        </ScrollView>
      )}

      {/* <ScrollView>
        <PlayerModal />
      </ScrollView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  audioElement: {
    width: 0,
    height: 0,
  },
});

export default GlobalPlayer;
