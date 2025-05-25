import React from 'react';
import {StyleSheet, Text, View, Pressable, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

interface MostPlayedCardProps {
  item: {
    // track: {
    //   name: string;
    //   album: {
    //     images: { url: string }[];
    //   };
    // };
    songId: number;
    title: string;
    artistName: string;
    album: string;
    albumID: number;
    thumbnailUrl: string;
    duration: string;
    audioUrl: string;
  };
}

const MostPlayedCard: React.FC<MostPlayedCardProps> = ({item}) => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<{MostPlayed: {item: MostPlayedCardProps['item']}}>
    >();

  //const hasImage = item.track.album.images && item.track.album.images.length > 0 && item.track.album.images[0].url;

  const hasImage =
    item.thumbnailUrl && item.thumbnailUrl.length > 0 && item.thumbnailUrl;

  return (
    <Pressable
      onPress={() => navigation.navigate('MostPlayed', {item})}
      style={styles.container}>
      {hasImage ? (
        <Image
          style={styles.image}
          //source={{ uri: item.track.album.images[0].url }}
          source={{uri: item.thumbnailUrl}}
        />
      ) : (
        <View style={[styles.image, styles.iconContainer]}>
          <Icon name="musical-notes" size={50} color="#aaa" />
        </View>
      )}
      <Text numberOfLines={1} style={styles.name}>
        {/* {item?.track?.name} */}
        {item?.title}
      </Text>
    </Pressable>
  );
};

export default MostPlayedCard;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    alignItems: 'center',
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 5,
    backgroundColor: '#222',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    width: 130,
    fontSize: 13,
    fontWeight: '500',
    color: 'white',
    marginTop: 10,
    textAlign: 'center',
  },
});
