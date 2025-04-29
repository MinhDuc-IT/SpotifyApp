import React from 'react';
import {StyleSheet, Text, View, Pressable, Image} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
//import { usePlayer } from "../contexts/PlayerContext";
import {Track} from 'react-native-track-player';

// Định nghĩa kiểu dữ liệu cho props
// type SongItemProps = {
//   item: {
//     track: {
//       id: number;
//       name: string;
//       preview_url: string | null;
//       album: { images: { url: string }[] };
//       artists: { name: string }[];
//     };
//   };
//   onPress: (item: any) => void;
//   isPlaying: boolean;
// };
type SongItemProps = {
  item: Track;
  onPress: (item: any) => void;
  isPlaying: boolean;
};

const SongItem: React.FC<SongItemProps> = ({item, onPress, isPlaying}) => {
  // const { state, dispatch } = usePlayer();
  // console.log(item);
  const handlePress = () => {
    // const track = item.track;
    // const convertedTrack: Track = {
    //   id: String(track.id), // Convert id to string
    //   url: track.preview_url || '', // Use preview_url from Spotify
    //   title: track.name, // Use name as title
    //   artist: track.artists.map(artist => artist.name).join(', '), // Join artists names
    //   artwork: track.album.images[0]?.url || '', // Get artwork from album
    //   duration: 180, // Example duration, replace with real data
    // };
    // onPress(convertedTrack);
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
        <AntDesign name="checkcircle" size={24} color="#1fd662" />
        <Entypo name="dots-three-vertical" size={24} color="#C0C0C0" />
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
    fontWeight: "bold",
    fontSize: 15,
    color: "#22dc71",
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
