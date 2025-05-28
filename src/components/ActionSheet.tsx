import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import api from '../services/api';

interface ActionSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onOptionSelect: (option: string) => void;
  isInPlayListScreen: boolean;
  playlistId: string | null;
  onSongRemoved?: (songId: number) => void; // Callback khi xóa bài hát khỏi playlist
  selectedItem: {
    id: number;
    name: string;
    type: string;
    image: string;
    audio: string;
  } | null;
}

const ActionSheet: React.FC<ActionSheetProps> = ({
  isVisible,
  onClose,
  onOptionSelect,
  isInPlayListScreen,
  playlistId, // ID của playlist hiện tại nếu có
  selectedItem,
  onSongRemoved, // Callback để xử lý khi bài hát bị xóa khỏi playlist
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [searchText, setSearchText] = useState('');

  const filteredPlaylists = playlists.filter(pl =>
    pl.playlistName.toLowerCase().includes(searchText.toLowerCase()),
  );

  console.log('playlistsid:', playlistId);

  const createAndAddToPlaylist = async () => {
    try {
      // 1. Gửi request tạo playlist mới
      const createRes = await api.post('/playlist/create', {
        name: selectedItem?.name,
      });

      const newPlaylistId = createRes.data.playlistID;

      // 2. Gửi request thêm bài hát vào playlist mới
      await api.post('/playlist/add-song', {
        playlistId: newPlaylistId,
        songId: selectedItem?.id,
      });

      setShowPlaylistModal(false);
      onClose();
    } catch (err) {
      console.error('Lỗi tạo playlist hoặc thêm bài hát:', err);
    }
  };

  useEffect(() => {
    if (isVisible) {
      console.log('BottomSheet is visible');
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  // const handleDownLoad = async () => {
  //   console.log('Download option selected for:', selectedItem);
  //   try {
  //     const timestamp = Date.now();
  //     const fileName = `song_${selectedItem?.id}_${timestamp}.mp3`;
  //     const localFilePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

  //     const result = await RNFS.downloadFile({
  //       fromUrl: selectedItem?.audio || '',
  //       toFile: localFilePath,
  //     }).promise;

  //     if (result.statusCode === 200) {
  //       console.log('Tải thành công:', localFilePath);
  //       // Thêm bài hát mới vào danh sách đã tải
  //       // Lấy danh sách bài hát đã tải từ AsyncStorage
  //       const downloadedSongsJson = await AsyncStorage.getItem(
  //         'downloadedSongs',
  //       );
  //       const currentSongs = downloadedSongsJson
  //         ? JSON.parse(downloadedSongsJson)
  //         : [];
  //       const newSong = {
  //         id: selectedItem?.id.toString(),
  //         title: selectedItem?.name || 'Bài hát không tên',
  //         path: localFilePath,
  //       };
  //       await AsyncStorage.setItem(
  //         'downloadedSongs',
  //         JSON.stringify([...currentSongs, newSong]),
  //       );
  //     } else {
  //       console.log('Lỗi tải file:', result.statusCode);
  //     }
  //   } catch (error) {
  //     console.error('Download error:', error);
  //   }
  // };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={['60%', '95%']}
      style={{zIndex: 9999}}
      backgroundStyle={{
        backgroundColor: '#1f1f1f',
        // zIndex: 1000, // Đặt zIndex cao
        // elevation: 10,
      }}
      handleIndicatorStyle={{
        backgroundColor: '#666666',
      }}
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          // style={{ zIndex: 999 }}
        />
      )}
      enablePanDownToClose
      onClose={onClose}>
      <BottomSheetView style={styles.sheetContainer}>
        <View style={styles.header}>
          <Image
            source={
              selectedItem?.image
                ? {uri: selectedItem?.image}
                : require('../assets/images/sontung.jpg')
            }
            style={styles.thumbnail}
          />
          <View style={styles.songInfo}>
            <Text style={styles.songTitle}>{selectedItem?.name}</Text>
            <Text style={styles.songType}>Bài hát</Text>
          </View>
        </View>
        {/* <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleDownLoad()}>
          <Text style={styles.optionIcon}>
            <Icon name="download" size={16} color="#fff" />
          </Text>
          <Text style={styles.optionText}>Tải nhạc xuống</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => onOptionSelect('test')}>
          <Text style={styles.optionIcon}>
            <Icon name="diamond" size={16} color="#fff" />
          </Text>
          <Text style={styles.optionText}>Nghe nhạc không quảng cáo</Text>
          <Text style={styles.premium}>Premium</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={async () => {
            // Giả sử bạn có API fetch playlists
            try {
              const response = await api.get('/playlist/getAllPlayList');
              const data = response.data;
              setPlaylists(data);
              console.log('Fetched playlists:', data);
              setShowPlaylistModal(true);
            } catch (err) {
              console.error('Lỗi tải playlist:', err);
            }
          }}>
          <Text style={styles.optionIcon}>
            <Icon name="plus" size={16} color="#fff" />
          </Text>
          <Text style={styles.optionText}>Thêm vào danh sách phát</Text>
        </TouchableOpacity>

        {isInPlayListScreen && (
          <TouchableOpacity
            style={styles.optionButton}
            onPress={async () => {
              // Giả sử bạn có API fetch playlists
              try {
                console.log('Gửi request xóa bài hát:', {
                  playlistId,
                  songId: selectedItem?.id,
                });
                const numericPlaylistId = playlistId?.replace('playlist_', '');
                console.log('numericPlaylistId:', numericPlaylistId);
                // Gửi API xóa bài hát khỏi danh sách phát
                await api.post('/playlist/remove-song', {
                  PlaylistID: Number(numericPlaylistId), // bạn cần truyền đúng ID playlist hiện tại
                  SongID: selectedItem?.id, // hoặc track.id nếu bạn đang xử lý bài hát đó
                });

                // Cập nhật giao diện nếu cần
                if (onSongRemoved) {
                  onSongRemoved(Number(numericPlaylistId)); // ✅ gọi callback để cập nhật UI
                }
                //onOptionSelect('test'); // Gọi hàm onOptionSelect để xử lý logic khác nếu cần
                onClose(); // Đóng bottom sheet sau khi xóa

                console.log('Thành công', 'Đã xóa bài hát khỏi danh sách phát');
              } catch (err) {
                console.error('Lỗi khi xóa bài hát khỏi danh sách phát:', err);
              }
            }}>
            <Text style={styles.optionIcon}>
              <Icon name="remove" size={16} color="#fff" />
            </Text>
            <Text style={styles.optionText}>Xóa khỏi danh sách phát này</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => onOptionSelect('test')}>
          <Text style={styles.optionIcon}>
            <Icon name="minus" size={16} color="#fff" />
          </Text>
          <Text style={styles.optionText}>Ẩn bài hát</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => onOptionSelect('test')}>
          <Text style={styles.optionIcon}>
            <Icon name="share" size={16} color="#fff" />
          </Text>
          <Text style={styles.optionText}>Chia sẻ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => onOptionSelect('test')}>
          <Text style={styles.optionIcon}>
            <Icon name="microphone" size={16} color="#fff" />
          </Text>
          <Text style={styles.optionText}>Truy cập radio</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => onOptionSelect('test')}>
          <Text style={styles.optionIcon}>
            <Icon name="podcast" size={16} color="#fff" />
          </Text>
          <Text style={styles.optionText}>Chuyển đến album</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => onOptionSelect('test')}>
          <Text style={styles.optionIcon}>
            <Icon name="user" size={16} color="#fff" />
          </Text>
          <Text style={styles.optionText}>Chuyển đến nghệ sĩ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => onOptionSelect('test')}>
          <Text style={styles.optionIcon}>
            <Icon name="ticket" size={16} color="#fff" />
          </Text>
          <Text style={styles.optionText}>
            Chuyển đến buổi biểu diễn của nghệ sĩ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => onOptionSelect('test')}>
          <Text style={styles.optionIcon}>
            <Icon name="music" size={16} color="#fff" />
          </Text>
          <Text style={styles.optionText}>
            Xem thông tin ghi công của bài hát
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => onOptionSelect('test')}>
          <Text style={styles.optionIcon}>
            <Icon name="code" size={16} color="#fff" />
          </Text>
          <Text style={styles.optionText}>Hiển thị mã Spotify</Text>
        </TouchableOpacity>
      </BottomSheetView>

      {showPlaylistModal && (
        // <Modal
        //   animationType="fade"
        //   transparent={true}
        //   visible={showPlaylistModal}
        //   onRequestClose={() => setShowPlaylistModal(false)}>
        //   <View style={styles.modalOverlay}>
        //     <View style={styles.modalContent}>
        //       <Text style={styles.modalTitle}>Chọn danh sách phát</Text>
        //       {playlists.map(pl => (
        //         <TouchableOpacity
        //           key={pl.playlistID}
        //           style={styles.modalItem}
        //           onPress={async () => {
        //             try {
        //               console.log('playlistID:', pl.playlistID);
        //               console.log('songID:', selectedItem?.id);
        //               await api.post('/playlist/add-song', {
        //                 PlaylistID: pl.playlistID, // Tên thuộc tính phải khớp với DTO bên backend
        //                 SongID: selectedItem?.id,
        //               });

        //               setShowPlaylistModal(false);
        //               onClose(); // đóng bottom sheet
        //             } catch (err) {
        //               console.error('Lỗi thêm bài hát:', err);
        //             }
        //           }}>
        //           <Text style={styles.modalItemText}>{pl.playlistName}</Text>
        //         </TouchableOpacity>
        //       ))}
        //       <TouchableOpacity onPress={() => setShowPlaylistModal(false)}>
        //         <Text style={styles.modalCancel}>Hủy</Text>
        //       </TouchableOpacity>
        //     </View>
        //   </View>
        // </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={showPlaylistModal}
          onRequestClose={() => setShowPlaylistModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Chọn danh sách phát</Text>

              {/* Ô tìm kiếm */}
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm playlist..."
                placeholderTextColor="#999"
                value={searchText}
                onChangeText={setSearchText}
              />

              {/* Danh sách playlist đã lọc */}
              <ScrollView>
                {filteredPlaylists.map(pl => (
                  <TouchableOpacity
                    key={pl.playlistID}
                    style={styles.modalItem}
                    onPress={async () => {
                      try {
                        await api.post('/playlist/add-song', {
                          playlistId: pl.playlistID,
                          songId: selectedItem?.id,
                        });
                        setShowPlaylistModal(false);
                        onClose();
                      } catch (err) {
                        console.error('Lỗi thêm bài hát:', err);
                      }
                    }}>
                    <Text style={styles.modalItemText}>{pl.playlistName}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Tạo playlist mới */}
              <TouchableOpacity
                style={styles.createButton}
                onPress={createAndAddToPlaylist}>
                <Text style={styles.modalCreateText}>
                  + Tạo playlist mới từ bài hát này
                </Text>
              </TouchableOpacity>

              {/* Nút hủy */}
              <TouchableOpacity onPress={() => setShowPlaylistModal(false)}>
                <Text style={styles.modalCancel}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: '#1f1f1f',
    flex: 1,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 10,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginBottom: 10,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    color: '#fff',
    fontSize: 15,
  },
  songType: {
    color: '#888',
    fontSize: 13,
  },
  premium: {
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 12,
    marginLeft: 'auto',
    backgroundColor: '#323232',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  optionIcon: {
    width: 20,
  },
  optionText: {
    color: '#fff',
    fontSize: 15,
    marginLeft: 10,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1f1f1f',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomColor: '#444',
    borderBottomWidth: 1,
  },
  modalItemText: {
    color: '#fff',
    fontSize: 16,
  },
  modalCancel: {
    marginTop: 10,
    color: 'red',
    textAlign: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    color: '#000',
  },

  createButton: {
    marginTop: 10,
    backgroundColor: '#1DB954',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  modalCreateText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ActionSheet;
