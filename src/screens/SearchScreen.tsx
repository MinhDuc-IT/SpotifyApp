import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type SearchItem = {
  id: string;
  name: string;
  type: string;
};

const initialSearches: SearchItem[] = [
  {id: '1', name: 'FKA twigs', type: 'Artist'},
  {id: '2', name: 'Hozier', type: 'Artist'},
  {id: '3', name: 'Grimes', type: 'Artist'},
  {id: '4', name: '1(Remastered)', type: 'Album - The Beatles'},
  {id: '5', name: 'HAYES', type: 'Artist'},
  {id: '6', name: 'Led Zeppelin', type: 'Artist'},
];

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [searches, setSearches] = useState<SearchItem[]>(initialSearches);

  const handleDeleteItem = (id: string) => {
    setSearches(prev => prev.filter(item => item.id !== id));
  };

  const handleClearAll = () => {
    setSearches([]);
  };

  const renderItem = ({item}: {item: SearchItem}) => (
    <View style={styles.itemContainer}>
      <Image source={require('../assets/images/sontung.jpg')} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.type}>{item.type}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
        <Icon name="close" size={16} color="#888" />
      </TouchableOpacity>
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
            onSubmitEditing={() => {
              if (searchText.trim() !== '') {
                alert(`Bạn đã tìm kiếm: ${searchText}`);
              } else {
                alert('Vui lòng nhập nội dung tìm kiếm!');
              }
            }}
          />
        </View>
        <TouchableOpacity onPress={() => setSearchText('')}>
          <Text style={styles.cancelText}>Hủy</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.recentTitle}>Nội dung tìm kiếm gần đây</Text>

      <FlatList
        data={searches}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListFooterComponent={
          searches.length > 0 ? (
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

export default SearchScreen;
