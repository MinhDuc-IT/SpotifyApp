import axios from './api';

type SearchItem = {
  id: number;
  name: string;
  type: string;
  image: string;
  audio: String;
};

export const getSearchResults = async (keyword: string, page: number = 1, limit: number = 10) => {
  try {
    const response = await axios.get(`/song/search`, {
      params: {
        keyword,
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching search results:', error);
    throw error;
  }
};

export const getAllSearches = async () => {
  try {
    const response = await axios.get('/search');
    return response.data;
  } catch (error) {
    console.error('Error fetching search history:', error);
    throw error;
  }
};

export const createSearchHistory = async (item: SearchItem) => {
  try {
    const response = await axios.post('/search/create', item);
    return response.data;
  } catch (error) {
    console.error('Error fetching search history:', error);
    throw error;
  }
};

export const deleteSearchHistory = async (id: number, type: string) => {
  try {
    const response = await axios.delete(`/search/one`, {
      data: {id, type},
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting search history:', error);
    throw error;
  }
};

export const deleteAllSearchHistory = async () => {
  try {
    const response = await axios.delete(`/search/all`);
    return response.data;
  } catch (error) {
    console.error('Error deleting search history:', error);
    throw error;
  }
};
