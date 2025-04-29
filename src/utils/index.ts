import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {saveLikedSong} from '../sqlite/songService';

export const downloadSong = async (
  userId: number,
  song: {
    id: number;
    name: string;
    artist: string;
    audio_url: string;
    image_url: string;
  },
) => {
  try {
    console.log('Download option selected for:', song);

    // Tải file nhạc
    const timestamp = Date.now();
    const audioFileName = `song_${song.id}_${timestamp}.mp3`;
    const audioFilePath = `${RNFS.DocumentDirectoryPath}/${audioFileName}`;

    const audioResult = await RNFS.downloadFile({
      fromUrl: song.audio_url,
      toFile: audioFilePath,
    }).promise;

    if (audioResult.statusCode !== 200) {
      console.log('Lỗi tải file nhạc:', audioResult.statusCode);
      return;
    }

    console.log('Tải nhạc thành công:', audioFilePath);

    // Tải ảnh bìa
    const imageFileName = `cover_${song.id}_${timestamp}.jpg`;
    const imageFilePath = `${RNFS.DocumentDirectoryPath}/${imageFileName}`;

    const imageResult = await RNFS.downloadFile({
      fromUrl: song.image_url,
      toFile: imageFilePath,
    }).promise;

    if (imageResult.statusCode !== 200) {
      console.log('Lỗi tải ảnh bìa:', imageResult.statusCode);
      return;
    }

    console.log('Tải ảnh bìa thành công:', imageFilePath);

    // Lưu bài hát vào SQLite
    const songToSave = {
      id: song.id,
      name: song.name,
      artist: song.artist,
      audio_url: audioFilePath, // Đường dẫn file nhạc offline
      image_url: imageFilePath, // Đường dẫn ảnh bìa offline
    };

    await saveLikedSong(userId, songToSave); // Thay `1` bằng `userId` thực tế
    console.log('Bài hát đã được lưu vào SQLite:', songToSave);

    // Lưu thông tin bài hát đã tải vào AsyncStorage (nếu cần)
    // const downloadedSongsJson = await AsyncStorage.getItem('downloadedSongs');
    // const currentSongs = downloadedSongsJson ? JSON.parse(downloadedSongsJson) : [];
    // const newSong = {
    //   id: song.id.toString(),
    //   title: song.name,
    //   artist: song.artist,
    //   audioPath: audioFilePath,
    //   imagePath: imageFilePath,
    // };
    // await AsyncStorage.setItem('downloadedSongs', JSON.stringify([...currentSongs, newSong]));

    // console.log('Bài hát đã được lưu vào AsyncStorage:', newSong);
  } catch (error) {
    console.error('Download error:', error);
  }
};
