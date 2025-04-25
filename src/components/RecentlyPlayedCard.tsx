import React from 'react';
import {StyleSheet, Text, View, Pressable, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

interface RecentlyPlayedCardProps {
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

const RecentlyPlayedCard: React.FC<RecentlyPlayedCardProps> = ({item}) => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<{Info: {item: RecentlyPlayedCardProps['item']}}>
    >();

  //const hasImage = item.track.album.images && item.track.album.images.length > 0 && item.track.album.images[0].url;

  const hasImage =
    item.thumbnailUrl && item.thumbnailUrl.length > 0 && item.thumbnailUrl;

  return (
    <Pressable
      onPress={() => navigation.navigate('Info', {item})}
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

export default RecentlyPlayedCard;

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
    fontSize: 13,
    fontWeight: '500',
    color: 'white',
    marginTop: 10,
    textAlign: 'center',
  },
});
