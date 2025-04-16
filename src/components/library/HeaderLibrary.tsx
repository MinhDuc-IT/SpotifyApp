import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const HeaderLibrary = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Image
          source={{ uri: "https://placehold.co/35" }}
          style={styles.avatar}
        />
        <Text style={styles.title}>Your Library</Text>
      </View>

      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Ionicons name="add" color="white" size={26} />
      </TouchableOpacity>

      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>Tạo mới</Text>

            <TouchableOpacity style={styles.modalItem}>
              <Ionicons name="list" size={24} color="#4CAF50" style={styles.modalIcon} />
              <View>
                <Text style={styles.modalTitle}>Danh sách phát</Text>
                <Text style={styles.modalDescription}>
                  Tạo danh sách phát gồm bài hát hoặc tệp
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalItem}>
              <MaterialCommunityIcons name="account-music" size={24} color="#4CAF50" style={styles.modalIcon} />
              <View>
                <Text style={styles.modalTitle}>Giai điệu chung</Text>
                <Text style={styles.modalDescription}>
                  Kết hợp các gu âm nhạc trong một danh sách phát chia sẻ cùng bạn bè
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
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
    backgroundColor: "#333",
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "#222",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalHeader: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#444",
    paddingBottom: 10,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  modalIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  modalTitle: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  modalDescription: {
    color: "#aaa",
    fontSize: 13,
    marginTop: 2,
    maxWidth: SCREEN_WIDTH - 100,
  },
});

export default HeaderLibrary;
