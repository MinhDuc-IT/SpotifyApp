import React from "react";
import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { usePlayer } from "../contexts/PlayerContext";

// Định nghĩa kiểu dữ liệu cho props
type SongItemProps = {
  item: {
    track: {
      id: number;
      name: string;
      preview_url: string | null;
      album: { images: { url: string }[] };
      artists: { name: string }[];
    };
  };
  onPress: (item: any) => void;
  isPlaying: boolean;
};

const SongItem: React.FC<SongItemProps> = ({ item, onPress, isPlaying }) => {
  const { state, dispatch } = usePlayer();

  const handlePress = () => {
    const track = item.track;
    if (track && track.id && track.preview_url) {
      dispatch({ type: 'SET_CURRENT_TRACK', track });
    }
    onPress(item);
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <Image style={styles.image} source={{ uri: item?.track?.album?.images[0].url }} />
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={isPlaying ? styles.textPlaying : styles.text}>
          {item?.track?.name}
        </Text>
        <Text style={styles.artistText}>{item?.track?.artists[0].name}</Text>
      </View>
      <View style={styles.iconsContainer}>
        <AntDesign name="heart" size={24} color="#1DB954" />
        <Entypo name="dots-three-vertical" size={24} color="#C0C0C0" />
      </View>
    </Pressable>
  );
};

export default SongItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "bold",
    fontSize: 14,
    color: "white",
  },
  textPlaying: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#3FFF00",
  },
  artistText: {
    marginTop: 4,
    color: "#989898",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginHorizontal: 10,
  },
});
