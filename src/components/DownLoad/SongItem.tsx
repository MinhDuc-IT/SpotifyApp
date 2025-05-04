import React from 'react';
import {StyleSheet, Text, View, Pressable, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Track} from 'react-native-track-player';

type SongItemProps = {
  item: Track;
  onPress: (item: any) => void;
  isPlaying: boolean;
};

const SongItem: React.FC<SongItemProps> = ({item, onPress, isPlaying}) => {
  const handlePress = () => {
    onPress(item);
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <Image style={styles.image} source={{uri: `file://${item.artwork}`}} />
      <View style={styles.textContainer}>
        <Text
          numberOfLines={1}
          style={isPlaying ? styles.textPlaying : styles.text}>
          {item.title}
        </Text>
        <Text style={styles.artistText}>{item.artist}</Text>
      </View>
      <View style={styles.iconsContainer}>
        <Icon name="ellipsis-horizontal" size={16} color="#888" />
      </View>
    </Pressable>
  );
};

export default SongItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 14,
    color: 'white',
  },
  textPlaying: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#3FFF00',
  },
  artistText: {
    marginTop: 4,
    color: '#989898',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginHorizontal: 10,
  },
});
