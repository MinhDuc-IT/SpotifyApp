// // components/GlobalPlayer.tsx
// import React, { useEffect, useRef } from 'react';
// import { View, StyleSheet, Image, Pressable, Text } from 'react-native';
// import Video, { VideoRef } from 'react-native-video';
// import { usePlayer } from '../contexts/PlayerContext';
// import PlayerControls from './PlayerControls';
// import PlayerModal from './PlayerModal';
// import AntDesign from 'react-native-vector-icons/AntDesign';

// const GlobalPlayer = () => {
//   const { state, dispatch } = usePlayer();
//   const videoRef = useRef<VideoRef>(null);

//   useEffect(() => {
//     if (videoRef.current) {
//       state.isPlaying ? videoRef.current.resume() : videoRef.current.pause();
//     }
//   }, [state.isPlaying]);

//   const handleProgress = (data: { currentTime: number }) => {
//     dispatch({
//       type: 'SET_PROGRESS',
//       progress: data.currentTime / state.duration,
//     });
//   };

//   const handleLoad = (data: { duration: number }) => {
//     dispatch({ type: 'SET_DURATION', duration: data.duration });
//   };

//   return (
//     <>
//       {state.currentTrack?.preview_url && (
//         <Video
//           ref={videoRef}
//           source={{ uri: state.currentTrack.preview_url }}
//           paused={!state.isPlaying}
//           onProgress={handleProgress}
//           onLoad={handleLoad}
//           onEnd={() => dispatch({ type: 'TOGGLE_PLAY' })}
//           //audioOnly={true}
//           style={styles.audioElement}
//           ignoreSilentSwitch="ignore"
//           onError={(error) => console.error('Video error:', error)}
//         />
//       )}

//       {state.currentTrack && (
//         <View style={styles.miniPlayer}>
//           <Image
//             source={{ uri: state.currentTrack.album.images[0]?.url }}
//             style={styles.thumbnail}
//           />
//           <View style={styles.trackInfo}>
//             <Text style={styles.title} numberOfLines={1}>
//               {state.currentTrack.name}
//             </Text>
//             <Text style={styles.artist} numberOfLines={1}>
//               {state.currentTrack.artists[0]?.name}
//             </Text>
//           </View>
//           <Pressable
//             onPress={() => dispatch({ type: 'TOGGLE_PLAY' })}
//             style={styles.controlButton}>
//             {state.isPlaying ? (
//               <AntDesign name="pausecircle" size={24} color="white" />
//             ) : (
//               <AntDesign name="playcircleo" size={24} color="white" />
//             )}
//           </Pressable>
//           <Pressable
//             onPress={() => dispatch({ type: 'TOGGLE_MODAL' })}
//             style={styles.expandButton}>
//             <AntDesign name="up" size={20} color="white" />
//           </Pressable>
//         </View>
//       )}

//       <PlayerModal />
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   audioElement: {
//     width: 0,
//     height: 0,
//   },
//   miniPlayer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 60,
//     backgroundColor: '#2c2c2c',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//   },
//   thumbnail: {
//     width: 40,
//     height: 40,
//     borderRadius: 4,
//   },
//   trackInfo: {
//     flex: 1,
//     marginLeft: 10,
//   },
//   title: {
//     color: 'white',
//     fontSize: 14,
//   },
//   artist: {
//     color: 'lightgray',
//     fontSize: 12,
//   },
//   controlButton: {
//     padding: 10,
//   },
//   expandButton: {
//     padding: 10,
//   },
// });

// export default GlobalPlayer;

// components/GlobalPlayer.tsx
import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import { usePlayer } from '../contexts/PlayerContext';
import MiniPlayer from './MiniPlayer';
import PlayerModal from './PlayerModal';

const GlobalPlayer = () => {
  const { state, dispatch } = usePlayer();
  const videoRef = useRef<VideoRef>(null);

  useEffect(() => {
    if (videoRef.current) {
      state.isPlaying ? videoRef.current.resume() : videoRef.current.pause();
    }
  }, [state.isPlaying]);

  const handleProgress = (data: { currentTime: number }) => {
    const progress = data.currentTime / (state.duration || 1);
    dispatch({ type: 'SET_PROGRESS', progress });
  };

  const handleLoad = (data: { duration: number }) => {
    dispatch({ type: 'SET_DURATION', duration: data.duration });
  };

  const handleEnd = () => {
    dispatch({ type: 'NEXT_TRACK' });
  };

  return (
    <View
    style={{
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        zIndex: 999,
        //backgroundColor: '#fff', // hoặc gradient
        padding: 10,
        //borderTopWidth: 1,
        borderColor: '#ddd',
      }}
    >
      {state.currentTrack?.preview_url && (
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
      )}

      <MiniPlayer />
      <PlayerModal />
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