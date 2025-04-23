import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Image, Pressable, StyleSheet, Animated } from 'react-native';
import { usePlayer } from '../contexts/PlayerContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PlayerModal = () => {
    const { state, dispatch } = usePlayer();
    const [progress, setProgress] = useState(new Animated.Value(0)); // Khởi tạo Animated Value cho progress
    const [isSeeking, setIsSeeking] = useState(false);

    // Cập nhật progress mỗi khi tiến độ thay đổi
    useEffect(() => {
        if (!isSeeking) {
            Animated.timing(progress, {
                toValue: state.progress * 100, // Đưa giá trị về 0-100 để dễ xử lý
                duration: 1000, // Thời gian thay đổi (1s)
                useNativeDriver: false,
            }).start();
        }
    }, [state.progress, isSeeking]);

    // Khi người dùng kéo thanh tiến trình
    const handleSeek = (time: number) => {
        dispatch({ type: 'SET_PROGRESS', progress: time });
        setIsSeeking(false); // Đặt trạng thái seeking là false khi người dùng hoàn thành
    };

    const handleSlidingStart = () => {
        setIsSeeking(true); // Khi bắt đầu kéo slider
    };

    return (
        <Modal
            visible={state.modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => dispatch({ type: 'TOGGLE_MODAL' })}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Pressable
                        style={styles.closeButton}
                        onPress={() => dispatch({ type: 'TOGGLE_MODAL' })}>
                        <AntDesign name="down" size={24} color="white" />
                    </Pressable>

                    <Image
                        source={{ uri: state.currentTrack?.album.images[0]?.url }}
                        style={styles.albumArt}
                    />

                    <View style={styles.trackInfo}>
                        <Text style={styles.trackTitle}>{state.currentTrack?.name}</Text>
                        <Text style={styles.artist}>
                            {state.currentTrack?.artists[0]?.name}
                        </Text>
                    </View>

                    <View style={styles.controls}>
                        <Pressable style={styles.controlButton}
                            onPress={() => dispatch({ type: 'PREV_TRACK' })}
                        >
                            <Ionicons name="play-skip-back" size={32} color="white" />
                        </Pressable>

                        <Pressable
                            onPress={() => dispatch({ type: 'TOGGLE_PLAY' })}
                            style={styles.mainControl}>
                            {state.isPlaying ? (
                                <Ionicons name="pause" size={48} color="white" />
                            ) : (
                                <Ionicons name="play" size={48} color="white" />
                            )}
                        </Pressable>

                        <Pressable style={styles.controlButton}
                            onPress={() => dispatch({ type: 'NEXT_TRACK' })}
                        >
                            <Ionicons name="play-skip-forward" size={32} color="white" />
                        </Pressable>
                    </View>

                    {/* Thanh tiến trình phát nhạc */}
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBarBackground}>
                            <Animated.View
                                style={[
                                    styles.progressBar,
                                    {
                                        width: progress.interpolate({
                                            inputRange: [0, 100],
                                            outputRange: ['0%', '100%'],
                                        }),
                                    },
                                ]}
                            />
                        </View>
                        {/* Thời gian */}
                        <View style={styles.timeContainer}>
                            <Text style={styles.timeText}>
                                {formatTime(state.progress * state.duration)}
                            </Text>
                            <Text style={styles.timeText}>
                                {formatTime(state.duration)}
                            </Text>
                        </View>
                    </View>

                </View>
            </View>
        </Modal>
    );
};

// Helper format thời gian
const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#202020',
        padding: 20,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        alignItems: 'center',
    },
    albumArt: {
        width: 300,
        height: 300,
        borderRadius: 8,
        marginVertical: 20,
    },
    trackInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    trackTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    artist: {
        color: 'lightgray',
        fontSize: 18,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 40,
        marginBottom: 15,
    },
    mainControl: {
        padding: 20,
    },
    controlButton: {
        padding: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        padding: 10,
    },
    progressContainer: {
        width: '100%',
        marginBottom: 10,
    },
    progressBarBackground: {
        height: 4,
        backgroundColor: '#ccc',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBar: {
        height: 4,
        backgroundColor: '#1DB954',
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
        width: '100%',
    },
    timeText: {
        color: 'lightgray',
        fontSize: 14,
    },
});

export default PlayerModal;

// import React, { useEffect, useState } from 'react';
// import { Modal, View, Text, Image, Pressable, StyleSheet, Animated } from 'react-native';
// import { usePlayer } from '../contexts/PlayerContext';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { PanResponder, GestureResponderEvent, PanResponderGestureState, LayoutChangeEvent } from 'react-native';

// const PlayerModal = () => {
//     const { state, dispatch } = usePlayer();
//     const [progress, setProgress] = useState(new Animated.Value(0)); // Khởi tạo Animated Value cho progress
//     const [isSeeking, setIsSeeking] = useState(false);
//     const [barWidth, setBarWidth] = useState(0);

//     const panResponder = PanResponder.create({
//         onStartShouldSetPanResponder: () => true,
//         onPanResponderGrant: () => {
//             handleSlidingStart();
//         },
//         onPanResponderMove: (_, gestureState) => {
//             if (barWidth > 0) {
//                 const newProgress = Math.min(Math.max(gestureState.dx / barWidth, 0), 1);
//                 progress.setValue(newProgress * 100);
//             }
//         },
//         onPanResponderRelease: (_, gestureState) => {
//             const newProgress = Math.min(Math.max(gestureState.dx / barWidth, 0), 1);
//             handleSeek(newProgress);
//         },
//     });


//     // Cập nhật progress mỗi khi tiến độ thay đổi
//     useEffect(() => {
//         if (!isSeeking) {
//             Animated.timing(progress, {
//                 toValue: state.progress * 100, // Đưa giá trị về 0-100 để dễ xử lý
//                 duration: 1000, // Thời gian thay đổi (1s)
//                 useNativeDriver: false,
//             }).start();
//         }
//     }, [state.progress, isSeeking]);

//     // Khi người dùng kéo thanh tiến trình
//     const handleSeek = (time: number) => {
//         dispatch({ type: 'SET_PROGRESS', progress: time });
//         setIsSeeking(false); // Đặt trạng thái seeking là false khi người dùng hoàn thành
//     };

//     const handleSlidingStart = () => {
//         setIsSeeking(true); // Khi bắt đầu kéo slider
//     };

//     return (
//         <Modal
//             visible={state.modalVisible}
//             animationType="slide"
//             transparent={true}
//             onRequestClose={() => dispatch({ type: 'TOGGLE_MODAL' })}>
//             <View style={styles.modalContainer}>
//                 <View style={styles.modalContent}>
//                     <Pressable
//                         style={styles.closeButton}
//                         onPress={() => dispatch({ type: 'TOGGLE_MODAL' })}>
//                         <AntDesign name="down" size={24} color="white" />
//                     </Pressable>

//                     <Image
//                         source={{ uri: state.currentTrack?.album.images[0]?.url }}
//                         style={styles.albumArt}
//                     />

//                     <View style={styles.trackInfo}>
//                         <Text style={styles.trackTitle}>{state.currentTrack?.name}</Text>
//                         <Text style={styles.artist}>
//                             {state.currentTrack?.artists[0]?.name}
//                         </Text>
//                     </View>

//                     <View style={styles.controls}>
//                         <Pressable style={styles.controlButton}
//                             onPress={() => dispatch({ type: 'PREV_TRACK' })}
//                         >
//                             <Ionicons name="play-skip-back" size={32} color="white" />
//                         </Pressable>

//                         <Pressable
//                             onPress={() => dispatch({ type: 'TOGGLE_PLAY' })}
//                             style={styles.mainControl}>
//                             {state.isPlaying ? (
//                                 <Ionicons name="pause" size={48} color="white" />
//                             ) : (
//                                 <Ionicons name="play" size={48} color="white" />
//                             )}
//                         </Pressable>

//                         <Pressable style={styles.controlButton}
//                             onPress={() => dispatch({ type: 'NEXT_TRACK' })}
//                         >
//                             <Ionicons name="play-skip-forward" size={32} color="white" />
//                         </Pressable>
//                     </View>

//                     {/* Thanh tiến trình phát nhạc */}
//                     <View style={styles.progressContainer}>
//                         <View style={styles.progressBarBackground}
//                             onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
//                             {...panResponder.panHandlers}
//                         >
//                             <Animated.View
//                                 style={[
//                                     styles.progressBar,
//                                     {
//                                         width: progress.interpolate({
//                                             inputRange: [0, 100],
//                                             outputRange: ['0%', '100%'],
//                                         }),
//                                     },
//                                 ]}
//                             />
//                         </View>
//                         {/* Thời gian */}
//                         <View style={styles.timeContainer}>
//                             <Text style={styles.timeText}>
//                                 {formatTime(state.progress * state.duration)}
//                             </Text>
//                             <Text style={styles.timeText}>
//                                 {formatTime(state.duration)}
//                             </Text>
//                         </View>
//                     </View>

//                 </View>
//             </View>
//         </Modal>
//     );
// };

// // Helper format thời gian
// const formatTime = (seconds: number) => {
//     const min = Math.floor(seconds / 60);
//     const sec = Math.floor(seconds % 60);
//     return `${min}:${sec < 10 ? '0' + sec : sec}`;
// };

// const styles = StyleSheet.create({
//     modalContainer: {
//         flex: 1,
//         backgroundColor: 'rgba(0,0,0,0.8)',
//         justifyContent: 'flex-end',
//     },
//     modalContent: {
//         backgroundColor: '#202020',
//         padding: 20,
//         borderTopLeftRadius: 12,
//         borderTopRightRadius: 12,
//         alignItems: 'center',
//     },
//     albumArt: {
//         width: 300,
//         height: 300,
//         borderRadius: 8,
//         marginVertical: 20,
//     },
//     trackInfo: {
//         alignItems: 'center',
//         marginBottom: 20,
//     },
//     trackTitle: {
//         color: 'white',
//         fontSize: 24,
//         fontWeight: 'bold',
//     },
//     artist: {
//         color: 'lightgray',
//         fontSize: 18,
//     },
//     controls: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         width: '100%',
//         paddingHorizontal: 40,
//         marginBottom: 15,
//     },
//     mainControl: {
//         padding: 20,
//     },
//     controlButton: {
//         padding: 10,
//     },
//     closeButton: {
//         position: 'absolute',
//         top: 10,
//         left: 10,
//         padding: 10,
//     },
//     progressContainer: {
//         width: '100%',
//         marginBottom: 10,
//     },
//     progressBarBackground: {
//         height: 4,
//         backgroundColor: '#ccc',
//         borderRadius: 2,
//         overflow: 'hidden',
//     },
//     progressBar: {
//         height: 4,
//         backgroundColor: '#1DB954',
//     },
//     timeContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: 4,
//         width: '100%',
//     },
//     timeText: {
//         color: 'lightgray',
//         fontSize: 14,
//     },
// });

// export default PlayerModal;
