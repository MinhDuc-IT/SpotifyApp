import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { usePlayer } from '../contexts/PlayerContextV2';
import { SpotifyTrack } from '../types/player.d'; // Using SpotifyTrack for mock data
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { Track } from 'react-native-track-player';

type PlayListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'PlayList'
>;

const PlaylistScreen = () => {
  const { play, currentTrack, isPlaying, queue, addToQueue } = usePlayer();
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]); // SpotifyTrack type for mock data
  const [trackList, setTrackList] = useState<Track[]>([]); // Track type for actions
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation<PlayListScreenNavigationProp>();

  // Fetch playlist data (example)
  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        // Replace with actual API call
        const mockData: SpotifyTrack[] = [
          {
            id: 3,
            name: 'Sóng gió',
            preview_url: 'https://res.cloudinary.com/dswyuiiqp/raw/upload/v1745140340/spotify_audio/eag7duo4it4t60wyty7f.mp3',
            album: {
              images: [
                {
                  url: 'https://res.cloudinary.com/dswyuiiqp/image/upload/v1745140313/spotify_images/wokqiqyyhtzaks1doeac.png',
                },
              ],
            },
            artists: [
              {
                name: 'J97',
              },
            ],
          },
          {
            id: 4,
            name: 'Đom đóm',
            preview_url: 'https://res.cloudinary.com/dswyuiiqp/raw/upload/v1745142305/spotify_audio/q5xq0oxf7ukt96nrfp2m.mp3',
            album: {
              images: [
                {
                  url: 'https://res.cloudinary.com/dswyuiiqp/image/upload/v1745142297/spotify_images/vzgoiy7tuvgxnpp5heg4.jpg',
                },
              ],
            },
            artists: [
              {
                name: 'J97',
              },
            ],
          },
        ];

        // Convert SpotifyTrack to Track
        const convertedTrackList: Track[] = mockData.map(item => ({
          id: String(item.id), // Convert id to string
          url: item.preview_url || '', // Use preview_url from Spotify
          title: item.name, // Use name as title
          artist: item.artists.map(artist => artist.name).join(', '), // Join artists names
          artwork: item.album.images[0]?.url || '', // Get artwork from album
          duration: 180, // Example duration, replace with real data
        }));

        setTracks(mockData); // Set the mock data state for display
        setTrackList(convertedTrackList); // Set the Track type list for actions
        await addToQueue(convertedTrackList); // Add converted tracks to the queue
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
        data={trackList} // Using the Track type list for FlatList rendering
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
