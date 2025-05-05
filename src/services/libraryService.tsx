import axios from './api'

export const getAllLibraryItems = async () => {
    try {
        const response = await axios.get('/playlist/getAllPlayList');
        return response.data;
    } catch (error) {
        console.error('Error fetching library items:', error);
        throw error;
    }
}