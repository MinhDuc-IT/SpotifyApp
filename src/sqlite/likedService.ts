import { db } from './database';

export const linkSongToLiked = (userId: number, songId: number): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      // Kiểm tra xem bài hát đã có trong danh sách yêu thích chưa
      tx.executeSql(
        `SELECT id FROM likes WHERE user_id = ? AND song_id = ?`,
        [userId, songId],
        (txObj, resultSet) => {
          if (resultSet.rows.length > 0) {
            resolve(); // Bài hát đã được yêu thích rồi
          } else {
            // Nếu chưa có, thêm vào bảng likes
            tx.executeSql(
              `INSERT INTO likes (user_id, song_id) VALUES (?, ?)`,
              [userId, songId],
              () => resolve(),
              (_, error) => {
                console.error('Lỗi khi thêm vào bảng likes:', error);
                reject(error);
                return false;
              },
            );
          }
        },
        (_, error) => {
          console.error('Lỗi khi kiểm tra bảng likes:', error);
          reject(error);
          return false;
        },
      );
    });
  });
};
