import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import ActionSheet from '../components/ActionSheet';
import {
  getSearchResults,
  createSearchHistory,
  getAllSearches,
  deleteSearchHistory,
  deleteAllSearchHistory,
} from '../services/searchService';

type SearchItem = {
  id: number;
  name: string;
  type: string;
  image: string;
  audio: string;
};

const SearchDetailScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [searches, setSearches] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [openActionSheet, setOpenActionSheet] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SearchItem | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchSearchHistory();
  }, []);

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
    const response = await getSearchResults(keyword, 1, 10);
    setSearches(response.items);
  };

  const fetchSearchHistory = async () => {
    try {
      const response = await getAllSearches();
      setSearchHistory(response);
    } catch (error) {
      console.error('Error fetching search history:', error);
    }
  };

  const handleDeleteItem = async (id: number, type: string) => {
    await deleteSearchHistory(id, type);
    fetchSearchHistory();
  };

  const handleOpenActionSheet = (item: SearchItem) => {
    setSelectedItem(item);
    setOpenActionSheet(true);
  };

  const handleClearAll = async () => {
    await deleteAllSearchHistory();
    fetchSearchHistory();
  };

  const handleCancel = () => {
    setSearchText('');
    navigation.goBack();
  };

  const handleClose = () => {
    setSearchText('');
  };

  const updateSearchHistory = async (item: SearchItem) => {
    await createSearchHistory(item);
    fetchSearchHistory();
  };

  const handleOptionSelect = (option: string) => {
    console.log('Tùy chọn đã chọn:', option);
    setOpenActionSheet(false); // Đóng ActionSheet sau khi chọn
  };

  const renderItem = ({item}: {item: SearchItem}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => updateSearchHistory(item)}>
      <Image
        source={
          item.image
            ? {uri: item.image}
            : require('../assets/images/sontung.jpg')
        }
        style={item.type === 'Song' ? styles.avatar : styles.avatarArtist}
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>
          {item.name}{' '}
          {item.type === 'Artist' && (
            <MaterialCommunityIcons
              name="check-decagram"
              size={10}
              color="skyblue"
            />
          )}
        </Text>
        <Text style={styles.type}>
          {item.type === 'Artist' ? 'Nghệ sĩ' : 'Bài hát'}
        </Text>
      </View>
      {!searchText ? (
        <TouchableOpacity onPress={() => handleDeleteItem(item.id, item.type)}>
          <Icon name="close" size={16} color="#888" />
        </TouchableOpacity>
      ) : (
        item.type == 'Song' && (
          <TouchableOpacity onPress={() => handleOpenActionSheet(item)}>
            <Icon name="ellipsis-horizontal" size={16} color="#888" />
          </TouchableOpacity>
        )
      )}
    </TouchableOpacity>
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
      <View style={styles.contentContainer}>
        {searchText || searchHistory.length !== 0 ? (
          <>
            {searchHistory.length !== 0 && !searchText && (
              <Text style={styles.recentTitle}>Nội dung tìm kiếm gần đây</Text>
            )}
            <FlatList
              data={searchText ? searches : searchHistory}
              keyExtractor={item => item.id + ''}
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
          </>
        ) : (
          <View style={styles.preview}>
            <Text style={styles.preTitle}>Phát nội dung bạn thích</Text>
            <Text style={styles.preContent}>
              Tìm kiếm nghệ sĩ, bài hát, podcast, v.v.
            </Text>
          </View>
        )}
      </View>
      <ActionSheet
        isVisible={openActionSheet}
        onClose={() => setOpenActionSheet(false)}
        onOptionSelect={handleOptionSelect}
        selectedItem={selectedItem}
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
  contentContainer: {
    flex: 1,
  },
  recentTitle: {
    color: '#fff',
    marginTop: 8,
    marginLeft: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
  preview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  preContent: {
    marginTop: 5,
    fontSize: 11,
    color: 'white',
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
  avatarArtist: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
