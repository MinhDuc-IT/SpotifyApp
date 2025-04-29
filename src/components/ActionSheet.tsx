import React, {useEffect, useRef, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';

interface ActionSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onOptionSelect: (option: string) => void;
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
  selectedItem,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  const handleDownLoad = async () => {
    console.log('Download option selected for:', selectedItem);
    try {
      const timestamp = Date.now();
      const fileName = `song_${selectedItem?.id}_${timestamp}.mp3`;
      const localFilePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      const result = await RNFS.downloadFile({
        fromUrl: selectedItem?.audio || '',
        toFile: localFilePath,
      }).promise;

      if (result.statusCode === 200) {
        console.log('Tải thành công:', localFilePath);
        // Thêm bài hát mới vào danh sách đã tải
        // Lấy danh sách bài hát đã tải từ AsyncStorage
        const downloadedSongsJson = await AsyncStorage.getItem(
          'downloadedSongs',
        );
        const currentSongs = downloadedSongsJson
          ? JSON.parse(downloadedSongsJson)
          : [];
        const newSong = {
          id: selectedItem?.id.toString(),
          title: selectedItem?.name || 'Bài hát không tên',
          path: localFilePath,
        };
        await AsyncStorage.setItem(
          'downloadedSongs',
          JSON.stringify([...currentSongs, newSong]),
        );
      } else {
        console.log('Lỗi tải file:', result.statusCode);
      }
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={['60%', '95%']}
      backgroundStyle={{backgroundColor: '#1f1f1f'}}
      handleIndicatorStyle={{
        backgroundColor: '#666666',
      }}
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
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
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleDownLoad()}>
          <Text style={styles.optionIcon}>
            <Icon name="download" size={16} color="#fff" />
          </Text>
          <Text style={styles.optionText}>Tải nhạc xuống</Text>
        </TouchableOpacity>
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
          onPress={() => onOptionSelect('test')}>
          <Text style={styles.optionIcon}>
            <Icon name="plus" size={16} color="#fff" />
          </Text>
          <Text style={styles.optionText}>Thêm vào danh sách phát</Text>
        </TouchableOpacity>
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
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: '#1f1f1f',
    flex: 1,
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
});

export default ActionSheet;
