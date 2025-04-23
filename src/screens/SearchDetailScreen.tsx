import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from '../services/api';

type SearchItem = {
  songID: number;
  name: string;
  type: string;
  songName: string;
  image: string;
};

const initialSearches: SearchItem[] = [
  {
    songID: 1,
    name: 'FKA twigs',
    type: 'Artist',
    songName: 'Cellophane',
    image: '',
  },
  {
    songID: 2,
    name: 'Hozier',
    type: 'Artist',
    songName: 'Take Me to Church',
    image: '',
  },
  {songID: 3, name: 'Grimes', type: 'Artist', songName: 'Oblivion', image: ''},
  {
    songID: 4,
    name: '1(Remastered)',
    type: 'Album - The Beatles',
    songName: 'Hey Jude',
    image: '',
  },
  {
    songID: 5,
    name: 'HAYES',
    type: 'Artist',
    songName: 'I Wanna Be Your Girlfriend',
    image: '',
  },
  {
    songID: 6,
    name: 'Led Zeppelin',
    type: 'Artist',
    songName: 'Stairway to Heaven',
    image: '',
  },
];

const SearchDetailScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [searches, setSearches] = useState([]);
  const [searchHistory, setSearchHistory] =
    useState<SearchItem[]>(initialSearches);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    if (searchText.trim() !== '') {
      debounceTimeout.current = setTimeout(() => {
        fetchSearchResults(searchText);
      }, 500); // đợi 500ms sau khi người dùng dừng gõ
    } else {
      setSearches([]); // clear nếu không có gì
    }

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [searchText]);

  const fetchSearchResults = async (keyword: string) => {
    try {
      const response = await axios.get(`/song/search`, {
        params: {
          keyword,
          page: 1,
          limit: 10,
        },
      });
      console.log('Kết quả tìm kiếm:', response.data.items);
      setSearches(response.data.items);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm bài hát:', error);
    }
  };

  const handleDeleteItem = (id: number) => {
    // setSearches(prev => prev.filter(item => item.id !== id));
  };

  const handleClearAll = () => {
    setSearches([]);
  };

  const handleCancel = () => {
    setSearchText('');
    navigation.goBack();
  };

  const handleClose = () => {
    setSearchText('');
  };

  const renderItem = ({item}: {item: SearchItem}) => (
    <View style={styles.itemContainer}>
      <Image
        source={
          item.image
            ? {uri: item.image}
            : require('../assets/images/sontung.jpg')
        }
        style={styles.avatar}
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.songName}</Text>
        <Text style={styles.type}>Bài hát</Text>
      </View>
      {!searchText ? (
        <TouchableOpacity onPress={() => handleDeleteItem(item.songID)}>
          <Icon name="close" size={16} color="#888" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => handleDeleteItem(item.songID)}>
          <Icon name="ellipsis-horizontal" size={16} color="#888" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.search_container}>
        <View style={styles.searchBar}>
          <Icon
            name="search"
            size={16}
            color="#fff"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Bạn muốn nghe gì?"
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText}
          />

          {searchText && (
            <Icon
              name="close-outline"
              size={16}
              color="#fff"
              style={styles.closeIcon}
              onPress={() => handleClose()}
            />
          )}
        </View>
        <TouchableOpacity onPress={() => handleCancel()}>
          <Text style={styles.cancelText}>Hủy</Text>
        </TouchableOpacity>
      </View>

      {!searchText && (
        <Text style={styles.recentTitle}>Nội dung tìm kiếm gần đây</Text>
      )}

      <FlatList
        data={searchText ? searches : searchHistory}
        keyExtractor={item => item.songID + ''}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListFooterComponent={
          searchHistory.length > 0 && !searchText ? (
            <TouchableOpacity
              onPress={handleClearAll}
              style={styles.clearAllButton}>
              <Text style={styles.clearAllText}>
                Xóa nội dung tìm kiếm gần đây
              </Text>
            </TouchableOpacity>
          ) : null
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
  search_container: {
    paddingTop: 25,
    paddingBottom: 10,
    backgroundColor: '#222',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 5,
    paddingHorizontal: 8,
    height: 25,
    flex: 1,
  },
  searchIcon: {
    marginRight: 4,
  },
  closeIcon: {
    position: 'absolute',
    right: 8,
  },
  input: {
    color: '#fff',
    fontSize: 14,
    marginVertical: -8,
    flex: 1,
  },
  cancelText: {
    color: '#fff',
    marginLeft: 12,
    fontSize: 12,
  },
  recentTitle: {
    color: '#fff',
    marginTop: 8,
    marginLeft: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    color: '#fff',
    fontSize: 14,
  },
  type: {
    color: '#888',
    fontSize: 13,
  },
  clearAllButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
    width: '60%',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderColor: '#fff',
    borderWidth: 1,
  },
  clearAllText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default SearchDetailScreen;
