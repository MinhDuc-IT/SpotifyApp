import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Modal,
  Pressable,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import AntDesign from "react-native-vector-icons/AntDesign";

type LibraryItem = {
  id: string;
  name: string;
  category: 'artist' | 'playlist' | 'album' | 'podcast' | 'song';
  author?: string;
  lastUpdate?: string;
  imageUrl?: string;
};

type LibraryContentProps = {
  libraryItems: LibraryItem[];
};

const LibraryContent: React.FC<LibraryContentProps> = ({ libraryItems }) => {
  const [filteredItems, setFilteredItems] = useState<LibraryItem[]>(libraryItems);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState<'recent' | 'name' | 'author'>('recent');
  const [itemOptionsVisible, setItemOptionsVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [pinnedItems, setPinnedItems] = useState<LibraryItem[]>([]);

  //const tabBarHeight = useBottomTabBarHeight();
  const tabBarHeight = 170; // hot fix

  const categories = ['All', ...Array.from(new Set(libraryItems.map(item => item.category)))];

  // // 1. Khi pinnedItems thay đổi => lưu
  // useEffect(() => {
  //   AsyncStorage.setItem('pinnedItems', JSON.stringify(pinnedItems));
  // }, [pinnedItems]);

  // // 2. Khi component mount => load
  // useEffect(() => {
  //   const loadPinned = async () => {
  //     const saved = await AsyncStorage.getItem('pinnedItems');
  //     if (saved) {
  //       setPinnedItems(JSON.parse(saved));
  //     }
  //   };
  //   loadPinned();
  // }, []);

  useEffect(() => {
    console.log('itemOptionsVisible:', itemOptionsVisible);
  }, [itemOptionsVisible]);
  
  useEffect(() => {
    console.log(libraryItems);
    
    // 1. Lọc theo category
    let items = selectedCategory === 'All'
      ? [...libraryItems]
      : libraryItems.filter(item => item.category === selectedCategory);

    // 2. Sắp xếp
    switch (sortOption) {
      case "name":
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "author":
        items.sort((a, b) => (a.author || '').localeCompare(b.author || ''));
        break;
      default:
        items.sort((a, b) => (b.lastUpdate || '').localeCompare(a.lastUpdate || ''));
        break;
    }

    // 3. Đưa các item đã ghim lên đầu danh sách
    const pinned = items.filter(item => pinnedItems.some(pin => pin.id === item.id));
    const unpinned = items.filter(item => !pinnedItems.some(pin => pin.id === item.id));
    setFilteredItems([...pinned, ...unpinned]);

  }, [selectedCategory, libraryItems, sortOption, pinnedItems]);

  const screenWidth = Dimensions.get("window").width;
  const gridItemWidth = (screenWidth - 64) / 2; // 16 padding + 16 right margin per item

  const renderItem = ({ item }: { item: LibraryItem }) => {
    const itemContent = (
      <>
        <Image
          style={[
            view === 'list'
              ? styles.itemImage
              : [styles.itemImage, { width: gridItemWidth, height: gridItemWidth }],
            item.category === 'artist' && {
              borderRadius: (view === 'list' ? 60 : gridItemWidth) / 2, // Làm tròn 50%
            },
          ]}
          resizeMode="cover"
          source={{ uri: item.imageUrl ? item.imageUrl : 'https://placehold.co/600x600' }}
        />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
          <View style={{ flexDirection: 'row', }}>
            {
              pinnedItems.some(p => p.id === item.id) && (
                <AntDesign name="pushpin" size={16} color="#4CAF50" style={{ marginHorizontal: 4 }} />
              )
            }
            <Text
              style={styles.itemMeta}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.category}
              {item.author && ` · ${item.author}`}
              {item.lastUpdate && ` · ${item.lastUpdate}`}
            </Text>
          </View>
        </View>
      </>
    );

    return (
      // <View
      //   key={item.id}
      //   style={view === 'list' ? styles.itemContainer : [styles.gridItemContainer, { width: gridItemWidth }]}
      // >
      //   {itemContent}
      // </View>
      <TouchableOpacity
        key={item.id}
        onLongPress={() => {
          setSelectedItem(item);
          setItemOptionsVisible(true);
        }}
        style={view === 'list' ? styles.itemContainer : [styles.gridItemContainer, { width: gridItemWidth }]}>
        {itemContent}
      </TouchableOpacity>

    );
  };

  return (
    <View style={{ marginTop: 10, paddingLeft: 16, width: '100%' }}>
      {/* Category Filter */}
      <FlatList
        data={categories}
        horizontal
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.category, selectedCategory === item && { backgroundColor: 'green', borderWidth: 0, }]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text style={[styles.categoryText, selectedCategory === item && { fontWeight: 'bold' }]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Sort & View Toggle */}
      <View style={styles.sortAndViewContainer}>
        <View style={styles.sortContainer}>
          <TouchableOpacity onPress={() => setSortModalVisible(true)}>
            <MaterialCommunityIcons name="sort" color="white" size={12} />
          </TouchableOpacity>
          <Text style={styles.sortText} onPress={() => setSortModalVisible(true)}>
            {sortOption === 'recent' ? 'Recently played' : sortOption === 'name' ? 'Name' : 'Author'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => setView(view === 'list' ? 'grid' : 'list')}>
          <Ionicons
            name={view === 'list' ? 'grid-outline' : 'list-outline'}
            color="white"
            size={16}
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <FlatList
        data={filteredItems}
        numColumns={view === 'grid' ? 2 : 1}
        key={view} // Bắt buộc để reset layout khi đổi giữa list <-> grid
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        columnWrapperStyle={view === 'grid' ? { justifyContent: 'space-between', marginBottom: 16, paddingRight: 16 } : undefined}
        contentContainerStyle={{ paddingRight: 16, paddingBottom: tabBarHeight + 50, }}
      />

      {/* Modal */}
      <Modal
        visible={sortModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setSortModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setSortModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modelHeaderText}>Sort by</Text>
            {
              [
                { label: 'Recently played', value: 'recent' },
                { label: 'Name', value: 'name' },
                { label: 'Author', value: 'author' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.modalItem}
                  onPress={() => {
                    setSortOption(option.value as any)
                    setSortModalVisible(false);
                  }}
                >
                  <Text style={[styles.modalItemText, sortOption === option.value && { fontWeight: 'bold' }]}>
                    {option.label}
                  </Text>
                  {
                    sortOption === option.value &&
                    <Ionicons name="checkmark" size={24} color="#4CAF50" />
                  }
                </TouchableOpacity>
              ))
            }
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={itemOptionsVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setItemOptionsVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setItemOptionsVisible(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modelHeaderText}>{selectedItem?.name}</Text>

            <TouchableOpacity style={styles.modalItem}>
              <Text style={styles.modalItemText}>Nghe không quảng cáo</Text>
              <Ionicons name="volume-high-outline" size={22} color="#4CAF50" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalItem}>
              <Text style={styles.modalItemText}>Tải xuống</Text>
              <Ionicons name="download-outline" size={22} color="#4CAF50" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => {
                if (selectedItem) {
                  // Nếu đã ghim rồi thì bỏ ghim, chưa ghim thì ghim
                  setPinnedItems(prev => {
                    const isPinned = prev.some(item => item.id === selectedItem.id);
                    return isPinned
                      ? prev.filter(item => item.id !== selectedItem.id)
                      : [...prev, selectedItem];
                  });
                }
                setItemOptionsVisible(false);
              }}
            >
              <Text style={styles.modalItemText}>
                {pinnedItems.some(item => item.id === selectedItem?.id) ? 'Bỏ ghim' : 'Ghim vào đầu'}
              </Text>
              <AntDesign name="pushpin" size={22} color="#4CAF50" />
            </TouchableOpacity>

          </View>
        </Pressable>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  category: {
    paddingHorizontal: 15,
    height: 33,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: '#7F7F7F',
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 10,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  sortAndViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
    marginRight: 16,
    //marginTop: 20,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  sortText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 6,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    gap: 12,
  },
  gridItemContainer: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: '#999',
    marginBottom: 6,
  },
  itemInfo: {
    justifyContent: 'center',
  },
  itemName: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  itemMeta: {
    color: '#B3B3B3',
    fontSize: 13,
  },
  modelHeaderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    borderColor: 'gray',
    borderBottomWidth: 1,
    paddingBottom: 15
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#222',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalItem: {
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalItemText: {
    fontSize: 16,
    color: 'white',
  },
});

export default LibraryContent;
