import SQLite from 'react-native-sqlite-storage';

// Mở hoặc tạo cơ sở dữ liệu
export const db = SQLite.openDatabase(
  { name: 'spotify.db', location: 'default' },
  () => console.log('Database opened successfully'),
  error => console.log(error),
);

// Hàm để tạo các bảng nếu chưa tồn tại
export const createTables = () => {
  db.transaction(tx => {
    // Tạo bảng users - Lưu thông tin người dùng
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        password TEXT,
        provider TEXT,
        firebase_id TEXT
      )
    `);

    // Tạo bảng albums - Thông tin về album
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS albums (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        image_url TEXT
      )
    `);

    // Tạo bảng songs - Thông tin về bài hát
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS songs (
        id INTEGER PRIMARY KEY,
        name TEXT,
        artist TEXT,
        image_url TEXT,
        audio_url TEXT,
        album_id INTEGER,
        FOREIGN KEY (album_id) REFERENCES albums(id)
      )
    `);

    // Tạo bảng user_album - Người dùng lưu album
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS user_album (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        album_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (album_id) REFERENCES albums(id)
      )
    `);

    // Tạo bảng playlists - Playlist của người dùng
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS playlists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        name TEXT,
        description TEXT,
        image_url TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Tạo bảng playlist_song - Bài hát trong playlist
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS playlist_song (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        playlist_id INTEGER,
        song_id INTEGER,
        FOREIGN KEY (playlist_id) REFERENCES playlists(id),
        FOREIGN KEY (song_id) REFERENCES songs(id)
      )
    `);

    // Tạo bảng likes - Người dùng like bài hát
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        song_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (song_id) REFERENCES songs(id)
      )
    `);
  });
};
