import {db} from './database';

export const createPlayList = async (
  userId: number,
  playListId: string,
  playListName: string,
  playListImage: string = 'test',
  description: string = 'test',
) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      // Bước 1: Kiểm tra xem playlist đã tồn tại chưa
      tx.executeSql(
        `SELECT id FROM playlists WHERE id = ?`,
        [playListId],
        (txObj, resultSet) => {
          if (resultSet.rows.length > 0) {
            console.log('Playlist đã tồn tại, không chèn thêm: ');
            resolve(); // Playlist đã tồn tại, không chèn nữa
          } else {
            // Bước 2: Chèn nếu chưa có
            console.log(
              'data: ',
              playListId,
              userId,
              playListName,
              description,
              playListImage,
            );
            tx.executeSql(
              `INSERT INTO playlists (id, user_id, name, description, image_url)
               VALUES (?, ?, ?, ?, ?)`,
              [playListId, userId, playListName, description, playListImage],
              () => {
                console.log('Playlist đã được tạo.');
                resolve();
              },
              (_, error) => {
                console.log('INSERT bị lỗi!');
                console.log('Đối số lỗi đầy đủ:', _);
                console.log('Lỗi cụ thể:', error);
                try {
                  console.log('Lỗi JSON:', JSON.stringify(error));
                } catch (e) {
                  console.log('Không thể stringify lỗi:', e);
                }
                reject(error);
                return false;
              },
            );
          }
        },
        (_, error) => {
          console.error('Lỗi khi kiểm tra playlist:', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

export const linkSongToPlaylist = (playlistId: string, songId: number) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT id FROM playlist_song WHERE playlist_id = ? AND song_id = ?`,
        [playlistId, songId],
        (txObj, resultSet) => {
          if (resultSet.rows.length > 0) {
            resolve(); // đã liên kết rồi
          } else {
            tx.executeSql(
              `INSERT INTO playlist_song (playlist_id, song_id) VALUES (?, ?)`,
              [playlistId, songId],
              () => resolve(),
              (_, error) => {
                console.error('Lỗi khi liên kết bài hát với playlist:', error);
                reject(error);
                return false;
              },
            );
          }
        },
        (_, error) => {
          console.error('Lỗi khi kiểm tra playlist_song:', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

export const getUserPlaylistsWithSongs = async (firebaseId: string) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT
          p.id AS playlist_id,
          p.name AS playlist_name,
          p.description,
          p.image_url AS playlist_image,
          s.id AS song_id,
          s.name AS song_name,
          s.artist,
          s.image_url AS song_image,
          s.audio_url
        FROM playlists p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN playlist_song ps ON p.id = ps.playlist_id
        LEFT JOIN songs s ON ps.song_id = s.id
        WHERE u.firebase_id = ?
        ORDER BY p.id, s.id;
        `,
        [firebaseId],
        (_, { rows }) => {
          const playlistsMap = new Map();

          for (let i = 0; i < rows.length; i++) {
            const row = rows.item(i);
            if (!playlistsMap.has(row.playlist_id)) {
              playlistsMap.set(row.playlist_id, {
                id: row.playlist_id,
                name: row.playlist_name,
                description: row.description,
                image_url: row.playlist_image,
                songs: []
              });
            }

            if (row.song_id) {
              playlistsMap.get(row.playlist_id).songs.push({
                id: row.song_id,
                name: row.song_name,
                artist: row.artist,
                image_url: row.song_image,
                audio_url: row.audio_url
              });
            }
          }

          resolve(Array.from(playlistsMap.values()));
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const getPlaylistsByFirebaseId = async (firebaseId: string) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT p.id, p.name, p.description, p.image_url
         FROM users u
         JOIN playlists p ON u.id = p.user_id
         WHERE u.firebase_id = ?`,
        [firebaseId],
        (_, { rows }) => {
          const playlists = [];
          for (let i = 0; i < rows.length; i++) {
            playlists.push(rows.item(i));
          }
          resolve(playlists);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};
