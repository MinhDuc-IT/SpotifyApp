import api from "./api";

export const addListeningHistory = async (songId: number, deviceInfo: string | null) => {
  try {
    const payload = { songId, deviceInfo };
    console.log('[addListeningHistory] Input payload:', payload);

    const response = await api.post('/history/add', payload);

    console.log('[addListeningHistory] API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('[addListeningHistory] Failed to log listening history:', error);
    throw error;
  }
};
