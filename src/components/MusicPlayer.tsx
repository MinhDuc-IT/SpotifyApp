import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import api from '../services/api';  // API để lấy dữ liệu bài hát

type MusicPlayerProps = {
  song: any;
  isOffline: boolean | null;
  onProgress: (data: { currentTime: number }) => void;
  onLoad: (data: { duration: number }) => void;
  isPlaying: boolean;
};

const MusicPlayer = ({ song, isOffline, onProgress, onLoad, isPlaying }: MusicPlayerProps) => {
    console.log(song);
  const videoRef = useRef<VideoRef>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);

  // Handle khi tiến độ phát nhạc thay đổi
  const handleProgress = (data: { currentTime: number }) => {
    setCurrentTime(data.currentTime);
    onProgress(data);
  };

  // Handle khi nhạc được tải
  const handleLoad = (data: { duration: number }) => {
    setDuration(data.duration);
    onLoad(data);
  };

  // Lấy nguồn nhạc, có thể là từ API hoặc file offline
  const getAudioSource = () => {
    if (isOffline) {
      return { uri: `file://${song.filePath}` };  // Dùng đường dẫn file nếu offline
    }
    return { uri: `https://localhost:7231/api/song/${song.preview_url}/stream` };  // API stream nhạc từ server
  };

  useEffect(() => {
    setLoading(true);
    setCurrentTime(0);
    setDuration(0);
  }, [song]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{song.title}</Text>
      <Text style={styles.artist}>{song.artist}</Text>

      <Video
        ref={videoRef}
        source={getAudioSource()}
        paused={!isPlaying}  // Đặt paused nếu không phát nhạc
        onProgress={handleProgress}
        onLoad={handleLoad}
        onEnd={() => console.log('Song Ended')}
        style={styles.video}
        resizeMode="contain"
        ignoreSilentSwitch="obey"
      />

      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
};

// Hàm định dạng thời gian
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white', marginVertical: 10 },
  artist: { fontSize: 18, color: '#666', marginBottom: 30 },
  video: { width: 0, height: 0 },  // Ẩn video vì chỉ phát âm thanh
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  timeText: { color: '#fff', fontSize: 14 },
});

export default MusicPlayer;
