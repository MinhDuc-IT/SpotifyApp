import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Modal,
} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabNavigator from '../components/BottomTabNavigator';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  getDownloadedLikedSongsByUser,
  deleteLikedSongsByUser,
} from '../sqlite/songService';
import {getUserPlaylistsWithSongs, getPlaylistsByFirebaseId} from '../sqlite/playListService';
import TrackPlayer from 'react-native-track-player';
import {useNavigation} from '@react-navigation/native';

const Drawer = createDrawerNavigator();

interface Song {
  id: string;
  name: string;
  audio_url: string;
}

const CustomDrawerContent = (props: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [downloadedSongs, setDownloadedSongs] = useState<Song[]>([]);
  const navigation = useNavigation();

  const userProfile = auth().currentUser;

  useEffect(() => {
    const loadDownloadedSongs = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          console.log('Fetching downloaded songs for user:', user.uid);
          const songs = await getDownloadedLikedSongsByUser(user.uid);
          // const songs = await getPlaylistsByFirebaseId(user.uid);
          console.log('Downloaded songs from SQLite:', songs);
          // setDownloadedSongs(songs);
        } else {
          console.log('No user is logged in');
        }
      } catch (error) {
        console.error('Error loading downloaded songs:', error);
      }
    };

    loadDownloadedSongs();
  }, []);

  const handlePlaySong = async (song: Song): Promise<void> => {
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: song.id,
      url: `file://${song.audio_url}`,
      title: song.name,
    });
    await TrackPlayer.play();
    setModalVisible(false);
  };

  const handleDeleteSong = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        console.log('Clearing downloaded songs for user:', user.uid);
        await deleteLikedSongsByUser(user.uid);
        console.log('All liked songs have been deleted for user:', user.uid);
      } else {
        console.log('No user is logged in');
      }
    } catch (error) {
      console.error('Error clearing downloaded songs:', error);
    }
  };

  const handleSettings = () => {
    Alert.alert('Cài đặt', 'Bạn đã nhấn vào nút Cài đặt');
  };

  const handleOpenDownloadOld = () => {
    setModalVisible(true);
  };

  const handleOpenDownload = () => {
    navigation.navigate('DownLoad');
  }

  const openProfile = () => {
    props.navigation.navigate('Profile');
  }

  const handleLogout = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        const gguser = await GoogleSignin.getCurrentUser();

        if (gguser) {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
        }

        await auth().signOut();
      } else {
        Alert.alert(
          'No user logged in',
          'There is no user currently logged in.',
        );
        props.navigation.navigate('Start');
      }
    } catch (error) {
      Alert.alert('Logout Error', 'Failed to sign out');
      console.error(error);
    }
  };

  return (
    <View style={styles.drawerContainer}>
      <TouchableOpacity style={styles.profile} onPress={openProfile}>
        {userProfile?.photoURL ?
          (<Image
            source={{ uri: userProfile?.photoURL }}
            style={styles.profileImage}
          />)
          : (<Image
            source={require('../assets/images/sontung.jpg')}
            style={styles.profileImage}
          />)
        }
        {userProfile?.displayName ?
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{userProfile?.displayName}</Text>
            <Text style={styles.description}>Xem hồ sơ</Text>
          </View>
          : <View style={styles.profileInfo}>
            <Text style={styles.name}>Đức Hoàng</Text>
            <Text style={styles.description}>Xem hồ sơ</Text>
          </View>
        }
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerButton} onPress={handleSettings}>
        <MaterialCommunityIcons name="plus" size={24} color="white" />
        <Text style={styles.drawerButtonText}>Thêm tài khoản</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerButton} onPress={handleSettings}>
        <MaterialCommunityIcons
          name="lightning-bolt-outline"
          size={24}
          color="white"
        />
        <Text style={styles.drawerButtonText}>Nội dung mới</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerButton} onPress={handleSettings}>
        <MaterialCommunityIcons name="history" size={24} color="white" />
        <Text style={styles.drawerButtonText}>Gần đây</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerButton}
        onPress={handleOpenDownloadOld}>
        <MaterialCommunityIcons name="download" size={24} color="white" />
        <Text style={styles.drawerButtonText}>Bài hát đã tải cũ</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerButton}
        onPress={handleOpenDownload}>
        <MaterialCommunityIcons name="download" size={24} color="white" />
        <Text style={styles.drawerButtonText}>Bài hát đã tải</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerButton} onPress={handleSettings}>
        <MaterialCommunityIcons name="cog-outline" size={24} color="white" />
        <Text style={styles.drawerButtonText}>Cài đặt và quyền riêng tư</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerButton} onPress={handleLogout}>
        <MaterialCommunityIcons name="logout" size={24} color="white" />
        <Text style={styles.drawerButtonText}>Đăng xuất</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
          }}>
          <View
            style={{
              margin: 20,
              backgroundColor: 'white',
              borderRadius: 10,
              padding: 20,
            }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
              Danh sách đã tải
            </Text>
            {downloadedSongs.map(song => (
              <TouchableOpacity
                key={song.id}
                onPress={() => handlePlaySong(song)}
                style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 16 }}>{song.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{ marginTop: 20 }}>
              <Text style={{ textAlign: 'center', color: 'red' }}>Đóng</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: 20 }}
              onPress={() => handleDeleteSong()}>
              <Text style={{ textAlign: 'center', color: 'red' }}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#1f1f1f',
          width: 300,
        },
        headerShown: false,
        drawerType: 'slide',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#888',
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={BottomTabNavigator} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    padding: 16,
  },
  profile: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 20,
    borderBottomColor: '#444',
    borderBottomWidth: 1,
    marginHorizontal: -16,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 16,
  },
  profileInfo: {},
  name: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  description: {
    color: 'white',
  },
  drawerHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  drawerButton: {
    marginVertical: 10,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  drawerButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default DrawerNavigator;
