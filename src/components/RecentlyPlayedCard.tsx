import React from "react";
import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

// 👇 Optional: Bạn có thể định nghĩa kiểu cho props nếu muốn
interface RecentlyPlayedCardProps {
  item: {
    track: {
      name: string;
      album: {
        images: { url: string }[];
      };
    };
  };
}

const RecentlyPlayedCard: React.FC<RecentlyPlayedCardProps> = ({ item }) => {
  const navigation = useNavigation<NativeStackNavigationProp<{ Info: { item: RecentlyPlayedCardProps["item"] } }>>();

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Info", { item })
      }
      style={styles.container}
    >
      <Image
        style={styles.image}
        source={{ uri: item.track.album.images[0].url }}
      />
      <Text numberOfLines={1} style={styles.name}>
        {item?.track?.name}
      </Text>
    </Pressable>
  );
};

export default RecentlyPlayedCard;

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 5,
  },
  name: {
    fontSize: 13,
    fontWeight: "500",
    color: "white",
    marginTop: 10,
  },
});
