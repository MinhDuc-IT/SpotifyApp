import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "react-native-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";

// Type định nghĩa user profile (dựa theo API Spotify trả về)
type UserProfile = {
  display_name: string;
  email: string;
  images: { url: string }[];
};

// Type định nghĩa playlist
type PlaylistItem = {
  id: string;
  name: string;
  images: { url: string }[];
};

const ProfileScreen = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);

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
    } catch (error: any) {
      console.log("error my friend", error.message);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    const getPlaylists = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("token");
        const response = await axios.get("https://api.spotify.com/v1/me/playlists", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setPlaylists(response.data.items);
      } catch (error: any) {
        console.error("Error retrieving playlists:", error.message);
      }
    };

    getPlaylists();
  }, []);

  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <ScrollView style={{ marginTop: 50 }}>
        <View style={{ padding: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            {userProfile?.images && userProfile.images.length > 0 ? (
              <Image
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  resizeMode: "cover",
                }}
                source={{
                  uri: userProfile.images[0].url,
                }}
              />
            ) : (
              <Ionicons name="person-circle" size={40} color="white" />
            )}

            <View>
              <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
                {userProfile?.display_name}
              </Text>
              <Text style={{ color: "gray", fontSize: 16, fontWeight: "bold" }}>
                {userProfile?.email}
              </Text>
            </View>
          </View>
        </View>

        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "500",
            marginHorizontal: 12,
          }}
        >
          Your Playlists
        </Text>

        <View style={{ padding: 15 }}>
          {playlists.map((item, index) => (
            <View
              key={item.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginVertical: 10,
              }}
            >
              <Image
                source={{
                  uri:
                    item?.images?.[0]?.url ||
                    "https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg?auto=compress&cs=tinysrgb&w=800",
                }}
                style={{ width: 50, height: 50, borderRadius: 4 }}
              />
              <View>
                <Text style={{ color: "white" }}>{item.name}</Text>
                <Text style={{ color: "white", marginTop: 7 }}>0 followers</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default ProfileScreen;
