import RNFS from 'react-native-fs';
import {saveLikedSong, isSongDownloaded} from '../sqlite/songService';

export const downloadSong = async (
  userId: number,
  song: {
    id: number;
    name: string;
    artist: string;
    audio_url: string;
    image_url: string;
  },
  onProgress: (percent: number) => void,
) => {
  try {

    const alreadyDownloaded = await isSongDownloaded(song.id, userId);
    if (alreadyDownloaded) {
      console.log('Bài hát đã được tải:', song.name);
      onProgress(100);
      return;
    }

    const timestamp = Date.now();
    const audioFileName = `song_${song.id}_${timestamp}.mp3`;
    const audioFilePath = `${RNFS.DocumentDirectoryPath}/${audioFileName}`;

    // ===== TẢI FILE NHẠC CÓ TIẾN TRÌNH =====
    const audioDownload = RNFS.downloadFile({
      fromUrl: song.audio_url,
      toFile: audioFilePath,
      progressDivider: 1,
      progress: res => {
        const percent = Math.round((res.bytesWritten / res.contentLength) * 50);
        onProgress(percent);
      },
    });

    const audioResult = await audioDownload.promise;

    if (audioResult.statusCode !== 200) {
      console.log('Lỗi tải file nhạc:', audioResult.statusCode);
      return;
    }

    console.log('Tải nhạc thành công:', audioFilePath);

    // ===== TẢI FILE ẢNH CÓ TIẾN TRÌNH =====
    const imageFileName = `cover_${song.id}_${timestamp}.jpg`;
    const imageFilePath = `${RNFS.DocumentDirectoryPath}/${imageFileName}`;

    const imageDownload = RNFS.downloadFile({
      fromUrl: song.image_url,
      toFile: imageFilePath,
      progressDivider: 1,
      progress: res => {
        const percent =
          50 + Math.round((res.bytesWritten / res.contentLength) * 50);
        onProgress(percent);
      },
    });

    const imageResult = await imageDownload.promise;

    if (imageResult.statusCode !== 200) {
      console.log('Lỗi tải ảnh bìa:', imageResult.statusCode);
      return;
    }

    console.log('Tải ảnh bìa thành công:', imageFilePath);

    // ===== LƯU SQLITE =====
    const songToSave = {
      id: song.id,
      name: song.name,
      artist: song.artist,
      audio_url: audioFilePath,
      image_url: imageFilePath,
    };

    await saveLikedSong(userId, songToSave);
    console.log('Bài hát đã được lưu vào SQLite:', songToSave);

    onProgress(100);
  } catch (error) {
    console.error('Download error:', error);
    onProgress(0);
  }
};
