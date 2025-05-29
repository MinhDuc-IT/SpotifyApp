import {db} from './database';

export const saveLikedSong = async (
  userId: number,
  song: {
    id: number;
    name: string;
    artist: string;
    image_url: string;
    audio_url: string;
    album_id?: number;
  },
) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      // Lưu bài hát vào bảng `songs`
      tx.executeSql(
        `INSERT OR IGNORE INTO songs (id, name, artist, image_url, audio_url, album_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          song.id,
          song.name,
          song.artist,
          song.image_url,
          song.audio_url,
          song.album_id || null,
        ],
        () => {
          // Liên kết bài hát với người dùng trong bảng `likes`
          tx.executeSql(
            `INSERT INTO likes (user_id, song_id) VALUES (?, ?)`,
            [userId, song.id],
            () => resolve(),
            (_, error) => {
              console.error('Error inserting into likes:', error);
              reject(error);
              return false;
            },
          );
        },
        (_, error) => {
          console.error('Error inserting into songs:', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

export const savePlayListSong = async (
  userId: number,
  song: {
    id: number;
    name: string;
    artist: string;
    image_url: string;
    audio_url: string;
    album_id?: number;
  },
) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      // Lưu bài hát vào bảng `songs`
      tx.executeSql(
        `INSERT OR IGNORE INTO songs (id, name, artist, image_url, audio_url, album_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          song.id,
          song.name,
          song.artist,
          song.image_url,
          song.audio_url,
          song.album_id || null,
        ],
        () => {
          // Liên kết bài hát với người dùng trong bảng `likes`
          tx.executeSql(
            `INSERT INTO likes (user_id, song_id) VALUES (?, ?)`,
            [userId, song.id],
            () => resolve(),
            (_, error) => {
              console.error('Error inserting into likes:', error);
              reject(error);
              return false;
            },
          );
        },
        (_, error) => {
          console.error('Error inserting into songs:', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

export const getDownloadedLikedSongsByUser = async (firebaseId: string) => {
  return new Promise<any[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT songs.id, songs.name, songs.audio_url, songs.image_url, songs.artist
           FROM songs
           INNER JOIN likes ON songs.id = likes.song_id
           INNER JOIN users ON likes.user_id = users.id
           WHERE users.firebase_id = ?`,
        [firebaseId],
        (_, result) => {
          const songs = [];
          for (let i = 0; i < result.rows.length; i++) {
            songs.push(result.rows.item(i));
          }
          resolve(songs);
        },
        (_, error) => {
          console.error('Error fetching downloaded songs:', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

export const deleteLikedSongsByUser = async (firebaseId: string) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      // Xóa các bài hát đã thích của người dùng trong bảng `likes`
      tx.executeSql(
        `DELETE FROM songs
           WHERE id IN (
             SELECT song_id FROM likes
             WHERE user_id IN (
               SELECT id FROM users WHERE firebase_id = ?
             )
           )`,
        [firebaseId],
        () => {
          console.log('Deleted songs for user:', firebaseId);

          // Xóa các liên kết trong bảng `likes`
          tx.executeSql(
            `DELETE FROM likes
               WHERE user_id IN (
                 SELECT id FROM users WHERE firebase_id = ?
               )`,
            [firebaseId],
            () => {
              console.log('Deleted liked songs for user:', firebaseId);
              resolve();
            },
            (_, error) => {
              console.error('Error deleting from likes:', error);
              reject(error);
              return false;
            },
          );
        },
        (_, error) => {
          console.error('Error deleting from songs:', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

export const getAllDownloadedSongsByUser = async (firebaseId: string) => {
  return new Promise<any[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
        SELECT DISTINCT
          songs.id AS song_id,
          songs.name AS song_name,
          songs.artist AS song_artist,
          songs.image_url AS song_image_url,
          songs.audio_url AS song_audio_url
        FROM songs
        LEFT JOIN likes ON songs.id = likes.song_id
        LEFT JOIN users ON likes.user_id = users.id
        WHERE users.firebase_id = ?
        `,
        [firebaseId],
        (_, result) => {
          const songs = [];
          for (let i = 0; i < result.rows.length; i++) {
            songs.push(result.rows.item(i));
          }
          resolve(songs);
        },
        (_, error) => {
          console.error('Error fetching downloaded songs:', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

// export const isSongDownloaded = async (
//   songId: number,
//   userId: number,
// ): Promise<boolean> => {
//   return new Promise((resolve, reject) => {
//     db.transaction(tx => {
//       tx.executeSql(
//         'SELECT id FROM likes WHERE song_id = ? AND user_id = ?',
//         [songId, userId],
//         (_, result) => {
//           resolve(result.rows.length > 0);
//         },
//         (_, error) => {
//           reject(error);
//           return false;
//         },
//       );
//     });
//   });
// };

export const isSongDownloaded = async (
  songId: number,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT id FROM songs WHERE id = ?',
        [songId],
        (_, result) => {
          resolve(result.rows.length > 0);
        },
        (_, error) => {
          reject(error);
          return false;
        },
      );
    });
  });
};

export const saveSongToSQLite = (
  id: number,
  name: string,
  artist: string,
  image_url: string,
  audio_url: string,
) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT OR IGNORE INTO songs (id, name, artist, image_url, audio_url, album_id)
         VALUES (?, ?, ?, ?, ?, NULL)`,
        [id, name, artist, image_url, audio_url],
        () => resolve(),
        (_, error) => {
          console.error('Lỗi khi lưu bài hát vào SQLite:', error);
          reject(error);
          return false;
        },
      );
    });
  });
};
