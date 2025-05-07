import React, { createContext, useContext, useState, ReactNode } from 'react';
import ActionSheet from '../components/ActionSheet';

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

  const showActionSheet = (itemData: ActionSheetItem) => {
    setItem(itemData);
    setVisible(true);
  };

  const hideActionSheet = () => {
    setVisible(false);
  };

  return (
    <ActionSheetContext.Provider value={{ showActionSheet, hideActionSheet }}>
      {children}
      <ActionSheet
        isVisible={visible}
        onClose={hideActionSheet}
        selectedItem={item || null}
        onOptionSelect={(option) => {
          // handle option here if needed
          hideActionSheet();
        }}
      />
    </ActionSheetContext.Provider>
  );
};
