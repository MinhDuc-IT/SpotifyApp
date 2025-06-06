import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {StyleSheet, Text, View, Image, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Định nghĩa kiểu dữ liệu cho props
type LikedInAlbumCardProps = {
  item: {
    // images: {url: string}[];
    // name: string;
    albumId: number;
    albumName: string;
    artistName: string;
    thumbnailUrl: string;
  };
};

const LikedInAlbumCard: React.FC<LikedInAlbumCardProps> = ({item}) => {
  const navigation =
      useNavigation<
        NativeStackNavigationProp<{LikedInAlbum: {item: LikedInAlbumCardProps['item']}}>
      >();
  //const hasImage = item.images && item.images.length > 0 && item.images[0].url;
  const hasImage = item.thumbnailUrl && item.thumbnailUrl.length > 0 && item.thumbnailUrl;

  return (
    <Pressable onPress={() => navigation.navigate('LikedInAlbum', {item})}>
      <View style={styles.card}>
      {hasImage ? (
        // <Image style={styles.image} source={{uri: item.images[0].url}} />
        <Image style={styles.image} source={{uri: item.thumbnailUrl}} />
      ) : (
        <View style={[styles.image, styles.iconContainer]}>
          <Icon name="person" size={50} color="#aaa" />
        </View>
      )}
      {/* <Text style={styles.name}>{item?.name}</Text> */}
      <Text style={styles.name}>{item?.albumName}</Text>
    </View>
    </Pressable>
    
  );
};

export default LikedInAlbumCard;

const styles = StyleSheet.create({
  card: {
    margin: 10,
    alignItems: 'center',
    paddingBottom: 50,
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 5,
    backgroundColor: '#222', // nền tối cho icon hiển thị rõ
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 13,
    fontWeight: '500',
    color: 'white',
    marginTop: 10,
    textAlign: 'center',
  },
});