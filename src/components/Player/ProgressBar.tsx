// import React, { useState } from 'react';
// import { View, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
// import { useProgress } from 'react-native-track-player';
// import Animated, { useAnimatedStyle } from 'react-native-reanimated';
// import TrackPlayer from 'react-native-track-player';

// export const ProgressBar = () => {
//   const { position, duration } = useProgress();
//   const [width, setWidth] = useState(0);
//   const { width: windowWidth } = useWindowDimensions();

//   const progressStyle = useAnimatedStyle(() => {
//     // 'worklet';
//     return {
//       width: duration > 0 ? (position / duration) * width : 0
//     };
//   });

//   const handleSeek = async (event: any) => {
//     const { locationX } = event.nativeEvent;
//     const seekPosition = (locationX / width) * duration;
//     await TrackPlayer.seekTo(seekPosition);
//   };

//   return (
//     <Pressable onPress={handleSeek} style={{ paddingHorizontal: 20 }}>
//       <View
//         style={[styles.track, { width: windowWidth - 40 }]}
//         onLayout={e => setWidth(e.nativeEvent.layout.width)}
//       >
//         <Animated.View style={[styles.progress, progressStyle]} />
//       </View>
//     </Pressable>
//   );
// };

// const styles = StyleSheet.create({
//   track: {
//     height: 3,
//     backgroundColor: '#555',
//     borderRadius: 1.5,
//   },
//   progress: {
//     height: '100%',
//     backgroundColor: '#fff',
//     borderRadius: 1.5,
//   },
// });

import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useProgress } from 'react-native-track-player';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import TrackPlayer from 'react-native-track-player';

export const ProgressBar = () => {
  const { position, duration } = useProgress();
  const [width, setWidth] = useState(0);

  const progressStyle = useAnimatedStyle(() => ({
    width: duration > 0 ? (position / duration) * width : 0,
  }));

  const handleSeek = async (event: any) => {
    const { locationX } = event.nativeEvent;
    const seekPosition = (locationX / width) * duration;
    await TrackPlayer.seekTo(seekPosition);
  };

  return (
    <Pressable 
      onPress={handleSeek}
      style={styles.container}
      hitSlop={{ top: 10, bottom: 10, left: 0, right: 0 }}
    >
      <View
        style={styles.track}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      >
        <Animated.View style={[styles.progress, progressStyle]} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    zIndex: 20,
  },
  track: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  progress: {
    height: '100%',
    backgroundColor: '#1DB954',
  },
});
