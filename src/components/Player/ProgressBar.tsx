// import React, { useState } from 'react';
// import { View, Pressable, StyleSheet } from 'react-native';
// import { useProgress } from 'react-native-track-player';
// import Animated, { useAnimatedStyle } from 'react-native-reanimated';
// import TrackPlayer from 'react-native-track-player';

// export const ProgressBar = () => {
//   const { position, duration } = useProgress();
//   const [width, setWidth] = useState(0);

//   const progressStyle = useAnimatedStyle(() => ({
//     width: duration > 0 ? (position / duration) * width : 0,
//   }));

//   const handleSeek = async (event: any) => {
//     const { locationX } = event.nativeEvent;
//     const seekPosition = (locationX / width) * duration;
//     await TrackPlayer.seekTo(seekPosition);
//   };

//   return (
//     <Pressable 
//       onPress={handleSeek}
//       style={styles.container}
//       hitSlop={{ top: 10, bottom: 10, left: 0, right: 0 }}
//     >
//       <View
//         style={styles.track}
//         onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
//       >
//         <Animated.View style={[styles.progress, progressStyle]} />
//       </View>
//     </Pressable>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     // position: 'absolute',
//     // bottom: 0,
//     // left: 0,
//     // right: 0,
//     height: 4,
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     zIndex: 20,
//   },
//   track: {
//     height: '100%',
//     backgroundColor: 'rgba(255,255,255,0.2)',
//   },
//   progress: {
//     height: '100%',
//     backgroundColor: '#1DB954',
//   },
// });

// import React, { useState } from 'react';
// import { View, Pressable, Text, StyleSheet } from 'react-native';
// import { useProgress } from 'react-native-track-player';
// import Animated, { useAnimatedStyle } from 'react-native-reanimated';
// import TrackPlayer from 'react-native-track-player';

// interface ProgressBarProps {
//   showTime?: boolean;
// }

// export const ProgressBar: React.FC<ProgressBarProps> = ({ showTime = true }) => {
//   const { position, duration } = useProgress();
//   const [width, setWidth] = useState(0);

//   const progressStyle = useAnimatedStyle(() => ({
//     width: duration > 0 ? (position / duration) * width : 0,
//   }));

//   const handleSeek = async (event: any) => {
//     const { locationX } = event.nativeEvent;
//     const seekPosition = (locationX / width) * duration;
//     await TrackPlayer.seekTo(seekPosition);
//   };

//   const formatTime = (time: number) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
//   };

//   return (
//     <View style={styles.wrapper}>
//       {showTime && (
//         <Text style={styles.timeText}>{formatTime(position)}</Text>
//       )}
      
//       <Pressable 
//         onPress={handleSeek}
//         style={styles.container}
//         hitSlop={{ top: 10, bottom: 10, left: 0, right: 0 }}
//       >
//         <View
//           style={styles.track}
//           onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
//         >
//           <Animated.View style={[styles.progress, progressStyle]} />
//         </View>
//       </Pressable>

//       {showTime && (
//         <Text style={styles.timeText}>{formatTime(duration)}</Text>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   wrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: '100%',
//     //paddingHorizontal: 10,
//   },
//   container: {
//     flex: 1,
//     height: 4,
//     //marginHorizontal: 8,
//   },
//   track: {
//     height: '100%',
//     backgroundColor: 'gray',
//     borderRadius: 2,
//   },
//   progress: {
//     height: '100%',
//     backgroundColor: 'white',
//     borderRadius: 2,
//     //width: '100%'
//     zIndex: 50,
//   },
//   timeText: {
//     color: 'white',
//     fontSize: 12,
//     width: 40,
//     textAlign: 'center',
//   },
// });

import React, { useState } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useProgress } from 'react-native-track-player';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import TrackPlayer from 'react-native-track-player';

interface ProgressBarProps {
  showTime?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ showTime = true }) => {
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

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.wrapper}>
      {/* Progress bar */}
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

      {/* Time display */}
      {showTime && (
        <View style={styles.timeWrapper}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    height: 4,
    backgroundColor: 'transparent',
  },
  track: {
    height: '100%',
    backgroundColor: 'gray',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  timeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    //paddingHorizontal: 10,
    marginTop: 4, // cách progress 1 chút
  },
  timeText: {
    color: 'white',
    fontSize: 12,
  },
});
