import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import IconIonicons from "react-native-vector-icons/Ionicons";
import IconAntDesign from "react-native-vector-icons/AntDesign";
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import IconEntypo from "react-native-vector-icons/Entypo";

type Artist = {
  name: string;
};

type Track = {
  name: string;
  artists: Artist[];
};

// 👉 Dữ liệu mock cho track chính
const mockTrack = {
  name: "Mock Album",
  album: {
    uri: "spotify:album:mockalbum123",
    images: [
      {
        url: "https://via.placeholder.com/200",
      },
    ],
  },
  artists: [
    { name: "Mock Artist 1" },
    { name: "Mock Artist 2" },
  ],
};

// 👉 Dữ liệu mock cho danh sách bài hát
const mockTracks: Track[] = [
  {
    name: "Mock Song 1",
    artists: [{ name: "Artist A" }, { name: "Artist B" }],
  },
  {
    name: "Mock Song 2",
    artists: [{ name: "Artist C" }],
  },
  {
    name: "Mock Song 3",
    artists: [{ name: "Artist D" }, { name: "Artist E" }],
  },
];

const SongInfoScreen = () => {
  const navigation = useNavigation();
  const [tracks, setTracks] = useState<Track[]>([]);

  const track = mockTrack;

  useEffect(() => {
    // Gán dữ liệu giả vào state
    setTracks(mockTracks);
  }, []);

  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <ScrollView style={{ marginTop: 50 }}>
        <View style={{ flexDirection: "row", padding: 12 }}>
          <IconIonicons
            onPress={() => navigation.goBack()}
            name="arrow-back"
            size={24}
            color="white"
          />
          <View style={{ flex: 1, alignItems: "center" }}>
            <Image
              style={{ width: 200, height: 200 }}
              source={{ uri: track.album.images[0].url }}
            />
          </View>
        </View>

        <Text style={styles.songName}>{track.name}</Text>

        <View style={styles.artistsContainer}>
          {track.artists.map((artist, index) => (
            <Text key={index} style={styles.artistName}>
              {artist.name}
            </Text>
          ))}
        </View>

        <Pressable style={styles.controls}>
          <Pressable style={styles.downloadBtn}>
            <IconAntDesign name="arrowdown" size={20} color="white" />
          </Pressable>

          <View style={styles.playControls}>
            <IconMaterialCommunityIcons
              name="cross-bolnisi"
              size={24}
              color="#1DB954"
            />
            <Pressable style={styles.playBtn}>
              <IconEntypo name="controller-play" size={24} color="white" />
            </Pressable>
          </View>
        </Pressable>

        <View style={{ marginTop: 10, marginHorizontal: 12 }}>
          {tracks.map((trackItem, index) => (
            <Pressable key={index} style={styles.trackItem}>
              <View>
                <Text style={styles.trackName}>{trackItem.name}</Text>
                <View style={styles.trackArtists}>
                  {trackItem.artists.map((artist, i) => (
                    <Text key={i} style={styles.trackArtistText}>
                      {artist.name}
                    </Text>
                  ))}
                </View>
              </View>
              <IconEntypo
                name="dots-three-vertical"
                size={24}
                color="white"
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default SongInfoScreen;

const styles = StyleSheet.create({
  songName: {
    color: "white",
    marginHorizontal: 12,
    marginTop: 10,
    fontSize: 22,
    fontWeight: "bold",
  },
  artistsContainer: {
    marginHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 10,
    gap: 7,
  },
  artistName: {
    color: "#909090",
    fontSize: 13,
    fontWeight: "500",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  downloadBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#1DB954",
    justifyContent: "center",
    alignItems: "center",
  },
  playControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  playBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1DB954",
  },
  trackItem: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  trackName: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
  trackArtists: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 5,
  },
  trackArtistText: {
    fontSize: 16,
    fontWeight: "500",
    color: "gray",
  },
});