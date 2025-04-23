import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Định nghĩa kiểu dữ liệu cho props
type ArtistCardProps = {
  item: {
    artistId: number;
    artistName: string;
    totalPlays: number;
    thumbnailUrl: string;
  };
};

const ArtistCard: React.FC<ArtistCardProps> = ({item}) => {
  const hasImage = item.thumbnailUrl && item.thumbnailUrl.length > 0 && item.thumbnailUrl;

  return (
    <View style={styles.card}>
      {hasImage ? (
        <Image style={styles.image} source={{uri: item.thumbnailUrl}} />
      ) : (
        <View style={[styles.image, styles.iconContainer]}>
          <Icon name="person" size={50} color="#aaa" />
        </View>
      )}
      <Text style={styles.name}>{item?.artistName}</Text>
    </View>
  );
};

export default ArtistCard;

const styles = StyleSheet.create({
  card: {
    margin: 10,
    alignItems: 'center',
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