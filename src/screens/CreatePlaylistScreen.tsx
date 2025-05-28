import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLibrary } from '../contexts/LibraryContext';
import { useNavigation } from '@react-navigation/native';
import { LibraryItem } from '../screens/LibraryScreen';
import api from '../services/api';

const CreatePlaylistScreen = () => {
  const [name, setName] = useState('Danh sách phát thứ 3 của tôi');
  const { addLibraryItem } = useLibrary();
  const navigation = useNavigation();

  // const createPlaylist = async (name: string) => {
  //   try {
  //     const response = await api.post('/playlist/create', { name });
  //     console.log('Playlist created:', response.data);
  //   } catch (error) {
  //     console.error('Error creating playlist:', error);
  //   }
  // }

  // const handleCreate = () => {
  //   createPlaylist(name);

  //   const newItem: LibraryItem = {
  //     id: Date.now().toString(),
  //     name,
  //     category: 'playlist',
  //     author: 'You',
  //     lastUpdate: new Date().toISOString().split('T')[0],
  //   };
  //   addLibraryItem(newItem);
  //   navigation.goBack();
  // };

  const createPlaylist = async (name: string) => {
    try {
      const response = await api.post('/playlist/create', { name });
      console.log('Playlist created:', response.data);
      return response.data; // Trả về dữ liệu vừa tạo
    } catch (error) {
      console.error('Error creating playlist:', error);
      throw error; // ném lỗi để handleCreate xử lý
    }
  };

  const handleCreate = async () => {
    try {
      const playlist = await createPlaylist(name);

      const newItem: LibraryItem = {
        id: playlist.playlistID.toString(), // hoặc playlist.id tùy theo backend
        name: playlist.playlistName,
        category: 'playlist',
        author: 'You',
        lastUpdate: new Date(playlist.createdDate).toISOString().split('T')[0],
      };

      addLibraryItem(newItem);
      navigation.goBack();
    } catch (error) {
      console.error('Không thể tạo playlist:', error);
      // Có thể hiển thị Toast hoặc Alert ở đây nếu muốn
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đặt tên cho danh sách phát của bạn</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>Huỷ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
          <Text style={styles.createText}>Tạo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e', // nền tối
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#1db954',
    color: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 4,
    fontSize: 16,
    fontWeight: 'bold',
    width: '100%',
    marginBottom: 40,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 30,
    paddingHorizontal: 32,
    paddingVertical: 12,
    marginRight: 10,
  },
  createButton: {
    backgroundColor: '#1db954',
    borderRadius: 30,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  cancelText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  createText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CreatePlaylistScreen;
