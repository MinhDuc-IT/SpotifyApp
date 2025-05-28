import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Account from '../components/Account/Account';
import api from '../services/api';
import TrackListScreen from '../components/TrackList';

const newContent = [
  { id: '1', title: '#v-pop', image: require('../assets/images/sontung.jpg') },
  {
    id: '2',
    title: '#rock việt',
    image: require('../assets/images/sontung.jpg'),
  },
  { id: '3', title: '#dopamine', image: require('../assets/images/sontung.jpg') },
];

interface Genre {
  genreId: number;
  genreName: string | null;
  color: string;
  image: any;
  songs?: null;
}

interface LikedSong {
  songId: number;
  title: string;
  artistName: string;
  album: string;
  thumbnailUrl: string;
  duration: number;
  audioUrl: string;
}

const COLORS = [
  "#E13300",
  "#1DB954",
  "#AF2896",
  "#8D67AB",
  "#148A08",
  "#509BF5",
  "#148A08",
  "#E91429",
  "#D84000",
  "#8D67AB",
  "#E91429",
  "#509BF5",
  "#E91429",
  "#8D67AB",
  "#1DB954",
  "#158A08",
  "#509BF5",
  "#AF2896",
  "#8D67AB",
  "#509BF5",
  "#148A08",
  "#509BF5",
  "#D84000",
  "#509BF5",
  "#E91429",
  "#8D67AB",
  "#509BF5",
  "#D84000",
  "#E13300",
  "#E91429",
  "#1DB954",
  "#8D67AB",
  "#8D67AB",
  "#AF2896",
  "#AF2896",
  "#E91429",
  "#509BF5",
  "#AF2896",
  "#AF2896",
  "#8D67AB",
  "#E91429",
  "#509BF5",
  "#509BF5",
  "#E13300",
  "#E91429",
  "#509BF5",
  "#8D67AB",
  "#AF2896",
  "#E91429",
  "#509BF5",
  "#148A08",
  "#D84000",
  "#1DB954",
  "#509BF5",
  "#D84000",
  "#AF2896",
  "#509BF5",
  "#D84000",
  "#8D67AB",
  "#E13300",
  "#158A08",
  "#D84000",
  "#E91429",
  "#148A08",
  "#AF2896"
];

let availableColors: string[] = [...COLORS];

const getRandomColor = () => {
  if (availableColors.length === 0) {
    availableColors = [...COLORS];
  }
  const idx = Math.floor(Math.random() * availableColors.length);
  const color = availableColors[idx];
  availableColors.splice(idx, 1);
  return color;
};

const SearchScreen = () => {
  const [scrollY] = useState(new Animated.Value(0));
  const navigation = useNavigation();
  const [genres, setGenres] = useState<Array<Genre & { color: string }>>([]);
  const [selectedGenre, setSelectedGenre] = useState<{ title: string, tracks: any[], totalCount: number } | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      setSelectedGenre(null);
    }, [])
  );

  useEffect(() => {
    const fetchGenres = async () => {
      const response = await api.get('/genres');
      setGenres(response.data.map((genre: Genre) => ({
        ...genre,
        color: getRandomColor(),
      })));
    };

    fetchGenres();
  }, []);

  const handleGenrePress = async (id: number) => {
    try {
      const res = await api.get(`/genres/${id}`);
      const data = res.data;

      const tracks = data.songs
        ? data.songs.map((song: LikedSong) => ({
          track: {
            name: song.title,
            id: song.songId,
            preview_url: song.audioUrl,
            album: {
              images: [{ url: song.thumbnailUrl }],
            },
            artists: [{ name: song.artistName }],
          },
        }))
        : [];

      setSelectedGenre({
        title: data.genreName || 'Bài hát ưa thích',
        tracks,
        totalCount: tracks.length,
      });
    } catch {
      Alert.alert('Lỗi', 'Không thể tải danh sách bài hát');
    }
  };

  if (selectedGenre) {
    if (selectedGenre.totalCount > 0) {
      return (
        <TrackListScreen
          title={selectedGenre.title}
          tracks={selectedGenre.tracks}
          totalCount={selectedGenre.totalCount}
          isLoading={false}
          filterByLikedSongs={false}
        />
      );
    } else {
      Alert.alert('Thông báo', 'Thể loại này chưa có bài hát!');
      setSelectedGenre(null);
      return null;
    }
  }

  return (
    <View style={{ flex: 1, }}>
      <Animated.View
        style={[
          styles.searchContainer,
          {
            position: 'absolute',
            top: scrollY.interpolate({
              inputRange: [0, 65],
              outputRange: [65, 0],
              extrapolate: 'clamp',
            }),
            left: 0,
            right: 0,
            zIndex: 100,
          },
        ]}>
        <TouchableOpacity
          style={styles.searchBox}
          onPress={() => {
            navigation.navigate('SearchDetail');
          }}>
          <Icon name="search" size={24} color="#000" />
          <Text style={styles.fakePlaceholder}>Bạn muốn nghe gì?</Text>
        </TouchableOpacity>
      </Animated.View>
      <ScrollView
        style={styles.container}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}>
        <Animated.View style={styles.header}>
          <Account />
          <Text style={styles.headerTitle}>Tìm kiếm</Text>
        </Animated.View>
        <Text style={[styles.sectionTitle, { marginTop: 70 }]}>
          Khám phá nội dung mới mẻ
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalList}>
          {newContent.map(item => (
            <TouchableOpacity key={item.id} style={styles.newContentItem}>
              <Image source={item.image} style={styles.newImage} />
              <Text style={styles.hashText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Browse All */}
        <Text style={styles.sectionTitle}>Duyệt tìm tất cả</Text>
        <View style={styles.grid}>
          {genres.map(item => (
            <TouchableOpacity
              onPress={() => handleGenrePress(item.genreId)}
              key={item.genreId}
              style={[styles.gridItem, { backgroundColor: item.color }]}>
              <Text style={styles.gridText}>{item.genreName}</Text>
              <Image
                source={
                  item.image
                    ? { uri: item.image }
                    : require('../assets/images/sontung.jpg')
                }
                style={styles.gridImage}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    height: 40,
  },
  fakePlaceholder: {
    color: '#000',
    marginLeft: 8,
    flex: 1,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 13,
    marginVertical: 16,
    fontWeight: '600',
  },
  horizontalList: {
    flexDirection: 'row',
  },
  newContentItem: {
    marginRight: 12,
    alignItems: 'center',
    position: 'relative',
  },
  newImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  hashText: {
    color: '#fff',
    marginTop: 6,
    fontSize: 12,
    position: 'absolute',
    bottom: 8,
    left: 8,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 100,
  },
  gridItem: {
    width: '48%',
    height: 100,
    borderRadius: 8,
    marginBottom: 16,
    padding: 10,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  gridText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  gridImage: {
    position: 'absolute',
    bottom: 5,
    right: -10,
    width: 60,
    height: 60,
    transform: [{ rotate: '15deg' }],
    borderRadius: 4,
  },
});
