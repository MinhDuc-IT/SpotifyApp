import RNFS from 'react-native-fs';
import {saveLikedSong, isSongDownloaded, saveSongToSQLite} from '../sqlite/songService';
import {linkSongToPlaylist} from '../sqlite/playListService';
import {linkSongToLiked} from '../sqlite/likedService';

export const downloadLikeSong = async (
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

    const alreadyDownloaded = await isSongDownloaded(song.id);
    if (alreadyDownloaded) {
      console.log('Bài hát đã được tải:', song.name);
      await linkSongToLiked(userId, song.id);
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

    // ===== LƯU DỮ LIỆU VÀ LIÊN KẾT =====
    await saveSongToSQLite(song.id, song.name, song.artist, imageFilePath, audioFilePath);
    await linkSongToLiked(userId, song.id);

    onProgress(100);
  } catch (error) {
    console.error('Download error:', error);
    onProgress(0);
  }
};

export const downloadPlayListSong = async (
  userId: number,
  playlistId: string,
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
    const alreadyDownloaded = await isSongDownloaded(song.id);
    if (alreadyDownloaded) {
      console.log('Bài hát đã được tải:', song.name);
      await linkSongToPlaylist(playlistId, song.id);
      onProgress(100);
      return;
    }

    const timestamp = Date.now();
    const audioFileName = `song_${song.id}_${timestamp}.mp3`;
    const audioFilePath = `${RNFS.DocumentDirectoryPath}/${audioFileName}`;

    // ===== TẢI FILE NHẠC =====
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

    // ===== TẢI ẢNH BÌA =====
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

    // ===== LƯU DỮ LIỆU VÀ LIÊN KẾT =====
    await saveSongToSQLite(song.id, song.name, song.artist, imageFilePath, audioFilePath);
    await linkSongToPlaylist(playlistId, song.id);

    console.log('Hoàn tất tải và lưu bài hát:', song.name);
    onProgress(100);
  } catch (error) {
    console.error('Download error:', error);
    onProgress(0);
  }
};
