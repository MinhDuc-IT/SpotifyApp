import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  FlatList,
  ListRenderItemInfo,
} from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import axios from "axios";
import ArtistCard from "../components/ArtistCard";
import RecentlyPlayedCard from "../components/RecentlyPlayedCard";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

// 👇 Định nghĩa type nếu bạn dùng React Navigation Stack
type RootStackParamList = {
  Home: undefined;
  Liked: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

// 👇 Định nghĩa đơn giản cho dữ liệu từ Spotify (tuỳ bạn chi tiết hoá thêm)
interface SpotifyImage {
  url: string;
}
interface SpotifyUser {
  images?: SpotifyImage[];
}

interface RecentlyPlayedItem {
  track: {
    name: string;
    album: {
      images: SpotifyImage[];
    };
  };
}

interface Artist {
  id: string;
  name: string;
  images: SpotifyImage[];
}

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [userProfile, setUserProfile] = useState<SpotifyUser | null>(null);
  const [recentlyplayed, setRecentlyPlayed] = useState<RecentlyPlayedItem[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);

  const greetingMessage = () => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) return "Good Morning";
    if (currentTime < 16) return "Good Afternoon";
    return "Good Evening";
  };

  const message = greetingMessage();

  const getProfile = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setUserProfile(data);
      return data;
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const getRecentlyPlayedSongs = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    try {
      const response = await axios.get("https://api.spotify.com/v1/me/player/recently-played?limit=4", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const tracks = response.data.items;
      setRecentlyPlayed(tracks);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getRecentlyPlayedSongs();
  }, []);

  const getTopItems = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("token");
      if (!accessToken) {
        console.log("Access token not found");
        return;
      }
      const response = await axios.get("https://api.spotify.com/v1/me/top/artists", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setTopArtists(response.data.items);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getTopItems();
  }, []);

  const renderItem = ({ item }: ListRenderItemInfo<RecentlyPlayedItem>) => (
    <Pressable
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 10,
        marginVertical: 8,
        backgroundColor: "#282828",
        borderRadius: 4,
        elevation: 3,
      }}
    >
      <Image
        style={{ height: 55, width: 55 }}
        source={{ uri: item.track.album.images[0].url }}
      />
      <View style={{ flex: 1, marginHorizontal: 8, justifyContent: "center" }}>
        <Text
          numberOfLines={2}
          style={{ fontSize: 13, fontWeight: "bold", color: "white" }}
        >
          {item.track.name}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <ScrollView style={{ marginTop: 50 }}>
        <View>
          <View style={styles.header}>
            <View style={styles.avatarWrapper}>
              {userProfile?.images?.length ? (
                <Image
                  style={styles.avatar}
                  source={{ uri: userProfile.images[0].url }}
                />
              ) : (
                <Ionicons name="person-circle" size={40} color="white" />
              )}
            </View>
            <Text style={styles.greeting}>{message || "No message"}</Text>
            <MaterialCommunityIcons
              name="lightning-bolt-outline"
              size={24}
              color="white"
            />
          </View>

          <View style={styles.filterRow}>
            <Pressable style={styles.filterButton}>
              <Text style={styles.filterText}>Music</Text>
            </Pressable>
            <Pressable style={styles.filterButton}>
              <Text style={styles.filterText}>Podcasts & Shows</Text>
            </Pressable>
          </View>

          <View style={styles.cardRow}>
            <Pressable
              onPress={() => navigation.navigate("Liked")}
              style={styles.card}
            >
              <LinearGradient colors={["#33006F", "#FFFFFF"]}>
                <Pressable style={styles.cardIcon}>
                  <AntDesign name="heart" size={24} color="white" />
                </Pressable>
              </LinearGradient>
              <Text style={styles.cardText}>Liked Songs</Text>
            </Pressable>

            <View style={styles.card}>
              <Image
                style={{ width: 55, height: 55 }}
                source={{ uri: "https://i.pravatar.cc/100" }}
              />
              <View>
                <Text style={styles.cardText}>Hiphop Tamhiza</Text>
              </View>
            </View>
          </View>
        </View>

        <FlatList
          data={recentlyplayed}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
        />

        <Text style={styles.sectionTitle}>Your Top Artists</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {topArtists.map((item, index) => (
            <ArtistCard item={item} key={index} />
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Recently Played</Text>
        <FlatList
          data={recentlyplayed}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RecentlyPlayedCard item={item} key={index} />
          )}
        />
      </ScrollView>
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    justifyContent: "space-between",
  },
  avatarWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "cover",
  },
  greeting: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  filterRow: {
    marginHorizontal: 12,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  filterButton: {
    backgroundColor: "#282828",
    padding: 10,
    borderRadius: 30,
  },
  filterText: {
    fontSize: 15,
    color: "white",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  card: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 8,
    backgroundColor: "#202020",
    borderRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    width: 55,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    color: "white",
    fontSize: 13,
    fontWeight: "bold",
  },
  sectionTitle: {
    color: "white",
    fontSize: 19,
    fontWeight: "bold",
    marginHorizontal: 10,
    marginTop: 10,
  },
});
