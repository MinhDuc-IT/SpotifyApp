import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

// Định nghĩa kiểu dữ liệu cho props
type ArtistCardProps = {
  item: {
    images: { url: string }[]; // mảng chứa các đối tượng có thuộc tính 'url'
    name: string;
  };
};

const ArtistCard: React.FC<ArtistCardProps> = ({ item }) => {
  return (
    <View style={styles.card}>
      <Image
        style={styles.image}
        source={{ uri: item.images[0].url }}
      />
      <Text style={styles.name}>{item?.name}</Text>
    </View>
  );
};

export default ArtistCard;

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 5,
  },
  name: {
    fontSize: 13,
    fontWeight: '500',
    color: 'white',
    marginTop: 10,
  },
});
