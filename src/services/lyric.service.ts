import { Lyric } from '../types/player.d';

const parseTime = (timeStr: string): number => {
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds; // Chuyển đổi thành giây
};

export const fetchLyrics = async (trackId: string): Promise<Lyric[]> => {
  try {
    const response = await fetch(`http://10.0.2.2:5063/api/song/${trackId}/lyric`);
    const data = await response.json();
    console.log(data);

    return data.map((lyric: any) => ({
      startTime: parseTime(lyric.startTime), // Sử dụng hàm parseTime để chuyển đổi startTime
      text: lyric.text
    }));
  } catch (error) {
    console.error('Failed to fetch lyrics:', error);
    return [];
  }
};
