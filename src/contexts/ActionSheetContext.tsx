import React, { createContext, useContext, useState, ReactNode } from 'react';
import ActionSheet from '../components/ActionSheet';
import { useRoute } from '@react-navigation/native';

export type ActionSheetItem = {
    id: number;
    name: string;
    type: string;
    image: string;
    audio: string;
};

type ActionSheetContextType = {
  showActionSheet: (item: ActionSheetItem) => void;
  hideActionSheet: () => void;
  isInPlayListScreen: boolean;
  setIsInPlayListScreen: (value: boolean) => void;
  playlistId: string | null;
  setPlaylistId: (id: string | null) => void;
  onSongRemoved?: (songId: number) => void;
  setOnSongRemoved: (cb: ((id: number) => void) | undefined) => void;
};

const ActionSheetContext = createContext<ActionSheetContextType | undefined>(undefined);

export const useActionSheet = () => {
  const context = useContext(ActionSheetContext);
  if (!context) {
    throw new Error('useActionSheet must be used within an ActionSheetProvider');
  }
  return context;
};

type ActionSheetProviderProps = {
  children: ReactNode;
};

export const ActionSheetProvider = ({ children }: ActionSheetProviderProps) => {
  const [visible, setVisible] = useState(false);
  const [item, setItem] = useState<ActionSheetItem | undefined>(undefined);

  const [isInPlayListScreen, setIsInPlayListScreen] = useState(false);
  const [playlistId, setPlaylistId] = useState<string | null>(null);
  console.log('playlistId:', playlistId);
  const [onSongRemoved, setOnSongRemoved] = useState<((id: number) => void) | undefined>();

  const showActionSheet = (itemData: ActionSheetItem) => {
    setItem(itemData);
    setVisible(true);
  };

  const hideActionSheet = () => {
    setVisible(false);
  };

  return (
    <ActionSheetContext.Provider value={{ showActionSheet, hideActionSheet, isInPlayListScreen, setIsInPlayListScreen, playlistId, setPlaylistId, onSongRemoved, setOnSongRemoved }}>
      {children}
      <ActionSheet
        isVisible={visible}
        onClose={hideActionSheet}
        selectedItem={item || null}
        isInPlayListScreen={isInPlayListScreen} // <-- truyền prop này xuống ActionSheet để hiển thị thêm option
        playlistId={playlistId}
        onSongRemoved={onSongRemoved} // <-- truyền callback để xử lý khi bài hát bị xóa
        onOptionSelect={(option) => {
          // handle option here if needed
          hideActionSheet();
        }}
      />
    </ActionSheetContext.Provider>
  );
};
