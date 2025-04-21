import React, { createContext, useState, ReactNode, useContext } from 'react';

// ✅ Định nghĩa kiểu cho context value
type PlayerContextType = {
  currentTrack: any; // bạn có thể thay "any" bằng kiểu cụ thể nếu có (vd: Track type)
  setCurrentTrack: (track: any) => void;
};

// ✅ Tạo context với kiểu mặc định là undefined
export const Player = createContext<PlayerContextType | undefined>(undefined);

// ✅ Props cho context provider
type Props = {
  children: ReactNode;
};

export const PlayerContext = ({ children }: Props) => {
  const [currentTrack, setCurrentTrack] = useState<any>(null);

  return (
    <Player.Provider value={{ currentTrack, setCurrentTrack }}>
      {children}
    </Player.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(Player);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerContext.Provider");
  }
  return context;
};