import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { usePlayer } from '../contexts/PlayerContextV2';
import { Track } from '../types/player.d';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '../services/api';

type PlayListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'PlayList'
>;

const PlaylistScreen = () => {
  const { play, currentTrack, isPlaying, queue, addToQueue } = usePlayer();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation<PlayListScreenNavigationProp>();

  // Fetch playlist data (example)
  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        // const response = await api.get('/song', {
        //     params: {
        //         page: 1,
        //         limit: 10,
        //     }
        // });

        // const data = await response.data;

        // Replace with actual API call
        const mockData: Track[] = [
          {
            id: '3',
            title: 'Sóng gió',
            artist: 'J97',
            url: 'https://res.cloudinary.com/dswyuiiqp/raw/upload/v1745140340/spotify_audio/eag7duo4it4t60wyty7f.mp3',
            artwork: 'https://res.cloudinary.com/dswyuiiqp/image/upload/v1745140313/spotify_images/wokqiqyyhtzaks1doeac.png',
            duration: 180,
          },
          {
            id: '4',
            title: 'Đom đóm',
            artist: 'J97',
            url: 'https://res.cloudinary.com/dswyuiiqp/raw/upload/v1745142305/spotify_audio/q5xq0oxf7ukt96nrfp2m.mp3',
            artwork: 'https://res.cloudinary.com/dswyuiiqp/image/upload/v1745142297/spotify_images/vzgoiy7tuvgxnpp5heg4.jpg',
            duration: 210,
          },
        ];
        setTracks(mockData);
        await addToQueue(mockData);
      } catch (error) {
        console.error('Failed to load playlist:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylist();
  }, []);

  const handleTrackPress = async (track: Track) => {
    await play(track);
    navigation.navigate('Player');
  };

  const renderItem = ({ item }: { item: Track }) => {
    const isCurrentTrack = currentTrack?.id === item.id;
    
    return (
      <TouchableOpacity 
        style={[styles.trackItem, isCurrentTrack && styles.currentTrack]}
        onPress={() => handleTrackPress(item)}
      >
        <Image source={{ uri: item.artwork }} style={styles.albumArt} />
        
        <View style={styles.trackInfo}>
          <Text 
            style={[styles.trackTitle, isCurrentTrack && styles.currentTrackText]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text style={styles.trackArtist}>{item.artist}</Text>
        </View>

        <View style={styles.trackControls}>
          {isCurrentTrack && (
            <Icon 
              name={isPlaying ? 'pause' : 'play-arrow'} 
              size={24} 
              color={isCurrentTrack ? '#1DB954' : '#666'} 
            />
          )}
          <Text style={styles.trackDuration}>
            {new Date(item.duration * 1000).toISOString().substr(14, 5)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tracks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No songs in playlist</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  currentTrack: {
    backgroundColor: '#191919',
  },
  albumArt: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 15,
  },
  trackInfo: {
    flex: 1,
    marginRight: 10,
  },
  trackTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  currentTrackText: {
    color: '#1DB954',
  },
  trackArtist: {
    color: '#888',
    fontSize: 14,
  },
  trackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  trackDuration: {
    color: '#666',
    fontSize: 14,
    minWidth: 40,
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
});

export default PlaylistScreen;