import React from "react";
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const HeaderLibrary = () => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Image
          //source={require("../assets/avatar-placeholder.png")} // Hoặc sử dụng avatar thật
          source={{ uri: "https://placehold.co/35" }}
          style={styles.avatar}
        />
        <Text style={styles.title}>Your Library</Text>
      </View>

      <TouchableOpacity>
        <Ionicons name="add" color="white" size={26} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    //backgroundColor: "#000", // Nếu cần nền đen
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 10,
    backgroundColor: "#333", // Placeholder nếu chưa có hình
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default HeaderLibrary;
