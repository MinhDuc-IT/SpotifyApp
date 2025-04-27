import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import TrackPlayer from 'react-native-track-player';

const newContent = [
  {id: '1', title: '#v-pop', image: require('../assets/images/sontung.jpg')},
  {
    id: '2',
    title: '#rock việt',
    image: require('../assets/images/sontung.jpg'),
  },
  {id: '3', title: '#dopamine', image: require('../assets/images/sontung.jpg')},
];

const downloadedSongs = [
  {
    id: '1',
    title: 'Bài Hát 1',
    path: '/storage/emulated/0/Download/baihat1.mp3',
  },
  {
    id: '2',
    title: 'Bài Hát 2',
    path: '/storage/emulated/0/Download/baihat2.mp3',
  },
];

const categories = [
  {
    id: '1',
    title: 'Nhạc',
    color: '#E42C7A',
    image: require('../assets/images/sontung.jpg'),
  },
  {
    id: '2',
    title: 'Podcasts',
    color: '#1E5C4C',
    image: require('../assets/images/sontung.jpg'),
  },
  {
    id: '3',
    title: 'Sự kiện trực tiếp',
    color: '#8B2ED3',
    image: require('../assets/images/sontung.jpg'),
  },
  {
    id: '4',
    title: 'Dành Cho Bạn',
    color: '#0D223A',
    image: require('../assets/images/sontung.jpg'),
  },
  {
    id: '5',
    title: 'Dành Cho Bạn',
    color: '#0D223A',
    image: require('../assets/images/sontung.jpg'),
  },
  {
    id: '6',
    title: 'Dành Cho Bạn',
    color: '#0D223A',
    image: require('../assets/images/sontung.jpg'),
  },
  {
    id: '7',
    title: 'Dành Cho Bạn',
    color: '#0D223A',
    image: require('../assets/images/sontung.jpg'),
  },
  {
    id: '8',
    title: 'Dành Cho Bạn',
    color: '#0D223A',
    image: require('../assets/images/sontung.jpg'),
  },
  {
    id: '9',
    title: 'Dành Cho Bạn',
    color: '#0D223A',
    image: require('../assets/images/sontung.jpg'),
  },
  {
    id: '10',
    title: 'Dành Cho Bạn',
    color: '#0D223A',
    image: require('../assets/images/sontung.jpg'),
  },
  {
    id: '11',
    title: 'Dành Cho Bạn',
    color: '#0D223A',
    image: require('../assets/images/sontung.jpg'),
  },
  {
    id: '12',
    title: 'Dành Cho Bạn',
    color: '#0D223A',
    image: require('../assets/images/sontung.jpg'),
  },
];

interface Song {
  id: string;
  title: string;
  path: string;
}

const SearchScreen = () => {
  const [scrollY] = useState(new Animated.Value(0));
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleClick = () => {
    setModalVisible(true);
  };
  
  const handlePlaySong = async (song: Song): Promise<void> => {
    await TrackPlayer.reset(); // reset player
    await TrackPlayer.add({
      id: song.id,
      url: `file://${song.path}`, // Phải thêm file:// phía trước
      title: song.title,
    });
    await TrackPlayer.play();
    setModalVisible(false);
  };

  return (
    <View style={{flex: 1}}>
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
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}
        scrollEventThrottle={16}>
        <Animated.View style={styles.header}>
          <TouchableOpacity
            onPress={() => handleClick()}
            style={styles.avatar}></TouchableOpacity>
          <Text style={styles.headerTitle}>Tìm kiếm</Text>
        </Animated.View>
        <Text style={[styles.sectionTitle, {marginTop: 70}]}>
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
          {categories.map(item => (
            <View
              key={item.id}
              style={[styles.gridItem, {backgroundColor: item.color}]}>
              <Text style={styles.gridText}>{item.title}</Text>
              <Image source={item.image} style={styles.gridImage} />
            </View>
          ))}
        </View>
      </ScrollView>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
          }}>
          <View
            style={{
              margin: 20,
              backgroundColor: 'white',
              borderRadius: 10,
              padding: 20,
            }}>
            <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 10}}>
              Danh sách đã tải
            </Text>
            {downloadedSongs.map(song => (
              <TouchableOpacity
                key={song.id}
                onPress={() => handlePlaySong(song)}
                style={{marginBottom: 10}}>
                <Text style={{fontSize: 16}}>{song.title}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{marginTop: 20}}>
              <Text style={{textAlign: 'center', color: 'red'}}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: '#555',
    marginRight: 5,
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
    marginBottom: 40,
  },
  gridItem: {
    width: '48%',
    height: 100,
    borderRadius: 8,
    marginBottom: 16,
    padding: 10,
    justifyContent: 'space-between',
  },
  gridText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  gridImage: {
    width: 40,
    height: 40,
    alignSelf: 'flex-end',
    borderRadius: 4,
  },
});
