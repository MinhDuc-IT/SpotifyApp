// export interface Track {
//     id: string;
//     url: string;
//     title: string;
//     artist: string;
//     artwork: string;
//     duration: number;
//   }
export interface SpotifyTrack {
  id: number;
  name: string;
  preview_url: string | null;
  album: { images: { url: string }[] };
  artists: { name: string }[];
};
export interface Lyric {
  startTime: number; // Đổi thành number để dễ xử lý
  text: string;
}