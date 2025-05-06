import React, {useState} from 'react';
import {StyleSheet, Text, View, Pressable, Image} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
//import { usePlayer } from "../contexts/PlayerContext";
import {Track} from 'react-native-track-player';
import Ionicons from 'react-native-vector-icons/Ionicons';

type SavedTrack = {
  track: {
    id: number;
    name: string;
    preview_url: string | null;
    album: {images: {url: string}[]};
    artists: {name: string}[];
  };
};

type SongItemProps = {
  item: Track;
  onPress: (item: any) => void;
  isPlaying: boolean;
  isLiked: boolean; // Add this line to accept isLiked prop
  onLikePress: () => void; // Add this line to accept onLikePress prop
  onOpenOptions: (item: Track) => void;
};

const SongItem: React.FC<SongItemProps> = ({
  item,
  onPress,
  isPlaying,
  isLiked,
  onLikePress,
  onOpenOptions,
}) => {
  const handlePress = () => {
    onPress(item);
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <Image style={styles.image} source={{uri: item.artwork}} />
      <View style={styles.textContainer}>
        <Text
          numberOfLines={1}
          style={isPlaying ? styles.textPlaying : styles.text}>
          {item.title}
        </Text>
        <Text style={styles.artistText}>{item.artist}</Text>
      </View>
      <View style={styles.iconsContainer}>
        {/* <AntDesign name="checkcircle" size={24} color="#1fd662" /> */}
        <Pressable onPress={onLikePress}>
          {isLiked ? (
            <AntDesign name="checkcircle" size={24} color="#1fd662" />
          ) : (
            <Ionicons name="add-circle-outline" size={24} color="#C0C0C0" />
          )}
        </Pressable>
        <Pressable onPress={() => onOpenOptions(item)}>
          {/* <Ionicons name="ellipsis-horizontal" size={24} color="#C0C0C0" /> */}
          <Entypo name="dots-three-vertical" size={24} color="#C0C0C0" />
        </Pressable>
        {/* <Entypo name="dots-three-vertical" size={24} color="#C0C0C0" /> */}
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
    fontSize: 15,
    color: '#22dc71',
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
