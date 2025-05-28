import React, {createContext, useContext, useState} from 'react';
import {LibraryItem} from '../screens/LibraryScreen';

type LibraryContextType = {
  libraryItems: LibraryItem[];
  addLibraryItem: (item: LibraryItem) => void;
  removeLibraryItem: (id: string) => void;
};

const LibraryContext = createContext<LibraryContextType>({
  libraryItems: [],
  addLibraryItem: () => {},
  removeLibraryItem: () => {},
});

export const LibraryProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([
    {
      id: '1',
      name: 'Chill Hits',
      category: 'playlist',
      author: 'Spotify',
      lastUpdate: '2025-04-10',
    },
    {
      id: '2',
      name: 'Ed Sheeran',
      category: 'artist',
    },
    {
      id: '3',
      name: '÷ (Deluxe)',
      category: 'album',
    },
    {
      id: '4',
      name: 'The Joe Rogan Experience',
      category: 'podcast',
    },
    {
      id: '5',
      name: 'Perfect',
      category: 'song',
      author: 'Ed Sheeran',
    },
    {
      id: '6',
      name: 'Workout Mix 2025',
      category: 'playlist',
      author: 'ABC',
      lastUpdate: '2025-04-13',
    },
    {
      id: '7',
      name: 'Taylor Swift',
      category: 'artist',
    },
    {
      id: '8',
      name: 'Anti-Hero',
      category: 'song',
      author: 'Taylor Swift',
    },
  ]);

  const addLibraryItem = (item: LibraryItem) => {
    setLibraryItems(prev => [...prev, item]);
  };

  const removeLibraryItem = (id: string) => {
    setLibraryItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <LibraryContext.Provider value={{libraryItems, addLibraryItem, removeLibraryItem}}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => useContext(LibraryContext);
