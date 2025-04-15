import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

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
  const tabBarHeight = useBottomTabBarHeight();
  //const tabBarHeight = 0; // hot fix

  const categories = ['All', ...Array.from(new Set(libraryItems.map(item => item.category)))];

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredItems(libraryItems);
    } else {
      setFilteredItems(libraryItems.filter(item => item.category === selectedCategory));
    }
  }, [selectedCategory, libraryItems]);

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
          source={{ uri: item.imageUrl || 'https://placehold.co/67' }}
        />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
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
      </>
    );

    return (
      <View
        key={item.id}
        style={view === 'list' ? styles.itemContainer : [styles.gridItemContainer, { width: gridItemWidth }]}
      >
        {itemContent}
      </View>
    );
  };

  return (
    <View style={{ marginTop: 10, paddingLeft: 16, width: '100%'}}>
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
            <Text style={[styles.categoryText, selectedCategory === item && {fontWeight: 'bold'}]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Sort & View Toggle */}
      <View style={styles.sortAndViewContainer}>
        <View style={styles.sortContainer}>
          <TouchableOpacity>
            <MaterialCommunityIcons name="sort" color="white" size={12} />
          </TouchableOpacity>
          <Text style={styles.sortText}>Recently played</Text>
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
        contentContainerStyle={{ paddingRight: 16, paddingBottom: tabBarHeight + 50,}}
      />
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
});

export default LibraryContent;
