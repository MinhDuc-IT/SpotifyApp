import {db} from './database';

// /**
//  * Kiểm tra xem user đã tồn tại trong SQLite, nếu chưa thì tạo mới.
//  * @param firebaseId ID của user từ Firebase.
//  * @param name Tên của user.
//  * @param email Email của user.
//  */
export const checkAndCreateUser = async (
  firebaseId: string,
  name: string,
  email: string,
) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      // Kiểm tra xem user đã tồn tại chưa
      tx.executeSql(
        `SELECT * FROM users WHERE firebase_id = ?`,
        [firebaseId],
        (_, result) => {
          if (result.rows.length === 0) {
            // Nếu không tồn tại, tạo user mới
            tx.executeSql(
              `INSERT INTO users (name, email, firebase_id) VALUES (?, ?, ?)`,
              [name, email, firebaseId],
              () => resolve(),
              (_, error) => {
                console.error('Error inserting user:', error);
                reject(error);
                return false;
              },
            );
          } else {
            resolve(); // User đã tồn tại
          }
        },
        (_, error) => {
          console.error('Error checking user:', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

export const findUserByUid = async (uid: string): Promise<any | null> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM users WHERE firebase_id = ?`,
        [uid],
        (_, result) => {
          if (result.rows.length > 0) {
            resolve(result.rows.item(0)); // Trả về user đầu tiên tìm thấy
          } else {
            resolve(null); // Không tìm thấy user
          }
        },
        (_, error) => {
          console.error('Error finding user by UID:', error);
          reject(error);
          return false;
        },
      );
    });
  });
};