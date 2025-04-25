import { Lyric } from '../types/player.d';

export const fetchLyrics = async (trackId: string): Promise<Lyric[]> => {
  try {
    const response = await fetch(`http://10.0.2.2:5063/api/song/${trackId}/lyric`);
    const data = await response.json();
    console.log(data);
    return data.map((lyric: any) => ({
      startTime: parseFloat(lyric.startTime),
      text: lyric.text
    }));
  } catch (error) {
    console.error('Failed to fetch lyrics:', error);
    return [];
  }
};