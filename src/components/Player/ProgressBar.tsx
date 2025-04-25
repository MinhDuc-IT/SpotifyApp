import React, { useState } from 'react';
import { View, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useProgress } from 'react-native-track-player';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import TrackPlayer from 'react-native-track-player';

export const ProgressBar = () => {
  const { position, duration } = useProgress();
  const [width, setWidth] = useState(0);
  const { width: windowWidth } = useWindowDimensions();

  const progressStyle = useAnimatedStyle(() => {
    // 'worklet';
    return {
      width: duration > 0 ? (position / duration) * width : 0
    };
  });

  const handleSeek = async (event: any) => {
    const { locationX } = event.nativeEvent;
    const seekPosition = (locationX / width) * duration;
    await TrackPlayer.seekTo(seekPosition);
  };

  return (
    <Pressable onPress={handleSeek} style={{ paddingHorizontal: 20 }}>
      <View
        style={[styles.track, { width: windowWidth - 40 }]}
        onLayout={e => setWidth(e.nativeEvent.layout.width)}
      >
        <Animated.View style={[styles.progress, progressStyle]} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 3,
    backgroundColor: '#555',
    borderRadius: 1.5,
  },
  progress: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 1.5,
  },
});

// import React, { useState, useEffect, useRef } from 'react';
// import { View, Pressable, StyleSheet, useWindowDimensions, Animated, Easing } from 'react-native';
// import { useProgress } from 'react-native-track-player';
// import TrackPlayer from 'react-native-track-player';

// export const ProgressBar = () => {
//   const { position, duration } = useProgress();
//   const [width, setWidth] = useState(0);
//   const { width: windowWidth } = useWindowDimensions();

//   // Animated value chạy theo position
//   const progressAnim = useRef(new Animated.Value(0)).current;

//   // Khi position hoặc width thay đổi, cập nhật Animated.Value
//   useEffect(() => {
//     if (duration > 0 && width > 0) {
//       const toValue = (position / duration) * width;
//       Animated.timing(progressAnim, {
//         toValue,
//         duration: 100,          // chạy mượt trong 100ms
//         easing: Easing.linear,
//         useNativeDriver: false, // width không hỗ trợ native driver
//       }).start();
//     }
//   }, [position, duration, width]);

//   const handleSeek = async (e) => {
//     const { locationX } = e.nativeEvent;
//     const seekPosition = (locationX / width) * duration;
//     console.log('Seek to', seekPosition);
//     await TrackPlayer.seekTo(seekPosition);
//   };  

//   return (
//     <Pressable onPress={handleSeek} style={{ paddingHorizontal: 20 }}>
//       <View
//         style={[styles.track, { width: windowWidth - 40 }]}
//         onLayout={e => setWidth(e.nativeEvent.layout.width)}
//       >
//         <Animated.View
//           style={[
//             styles.progress,
//             { width: progressAnim }
//           ]}
//         />
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
