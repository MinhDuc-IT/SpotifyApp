export interface Track {
    id: string;
    url: string;
    title: string;
    artist: string;
    artwork: string;
    duration: number;
  }
  
  export interface Lyric {
    startTime: number; // Đổi thành number để dễ xử lý
    text: string;
  }