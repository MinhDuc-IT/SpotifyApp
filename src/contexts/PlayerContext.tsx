// import React, { createContext, useContext, useReducer } from 'react';
// import { ReactNode } from 'react';

// interface PlayerProviderProps {
//   children: ReactNode;
// }

// type Track = {
//   id: string;
//   name: string;
//   preview_url: string;
//   artists: { name: string }[];
//   album: { images: { url: string }[] };
// };

// type PlayerState = {
//   currentTrack: Track | null;
//   isPlaying: boolean;
//   progress: number;
//   duration: number;
//   isVisible: boolean;
//   modalVisible: boolean;
// };

// type Action =
//   | { type: 'PLAY'; track: Track }
//   | { type: 'TOGGLE_PLAY' }
//   | { type: 'SET_PROGRESS'; progress: number }
//   | { type: 'SET_DURATION'; duration: number }
//   | { type: 'TOGGLE_MODAL' };

// const initialState: PlayerState = {
//   currentTrack: null,
//   isPlaying: false,
//   progress: 0,
//   duration: 0,
//   isVisible: false,
//   modalVisible: false,
// };

// const playerReducer = (state: PlayerState, action: Action): PlayerState => {
//   switch (action.type) {
//     case 'PLAY':
//       return {
//         ...state,
//         currentTrack: action.track,
//         isPlaying: true,
//         isVisible: true,
//       };
//     case 'TOGGLE_PLAY':
//       return { ...state, isPlaying: !state.isPlaying };
//     case 'SET_PROGRESS':
//       return { ...state, progress: action.progress };
//     case 'SET_DURATION':
//       return { ...state, duration: action.duration };
//     case 'TOGGLE_MODAL':
//       return { ...state, modalVisible: !state.modalVisible };
//     default:
//       return state;
//   }
// };

// const PlayerContext = createContext<{
//   state: PlayerState;
//   dispatch: React.Dispatch<Action>;
// }>({
//   state: initialState,
//   dispatch: () => null,
// });

// export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
//   const [state, dispatch] = useReducer(playerReducer, initialState);

//   return (
//     <PlayerContext.Provider value={{ state, dispatch }}>
//       {children}
//     </PlayerContext.Provider>
//   );
// };

// export const usePlayer = () => useContext(PlayerContext);

// contexts/PlayerContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ReactNode } from 'react';

interface PlayerProviderProps {
  children: ReactNode;
}

type Track = {
  id: number;
  name: string;
  preview_url: string | null;
  album: { images: { url: string }[] };
  artists: { name: string }[];
};

type PlayerState = {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  modalVisible: boolean;
  queue: Track[];
  currentIndex: number;
};

type Action = 
  | { type: 'PLAY'; track: Track }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'SET_PROGRESS'; progress: number }
  | { type: 'SET_DURATION'; duration: number }
  | { type: 'TOGGLE_MODAL' }
  | { type: 'SET_QUEUE'; queue: Track[] }
  | { type: 'NEXT_TRACK' }
  | { type: 'PREV_TRACK' }
  | { type: 'SET_CURRENT_TRACK'; track: Track };

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  progress: 0,
  duration: 0,
  modalVisible: false,
  queue: [],
  currentIndex: -1,
};

const playerReducer = (state: PlayerState, action: Action): PlayerState => {
  switch (action.type) {
    case 'SET_CURRENT_TRACK':
      console.log('Setting current track:', action.track);
      return {
        ...state,
        currentTrack: action.track,
        isPlaying: true,
        currentIndex: state.queue.findIndex(t => t.id === action.track.id),
      };
    case 'PLAY':
      return {
        ...state,
        currentTrack: action.track,
        isPlaying: true,
        currentIndex: state.queue.findIndex(t => t.id === action.track.id),
      };
    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: !state.isPlaying };
    case 'SET_PROGRESS':
      return { ...state, progress: action.progress };
    case 'SET_DURATION':
      return { ...state, duration: action.duration };
    case 'TOGGLE_MODAL':
      return { ...state, modalVisible: !state.modalVisible };
    case 'SET_QUEUE':
      return { ...state, queue: action.queue };
    case 'NEXT_TRACK':
      return {
        ...state,
        currentIndex: Math.min(state.currentIndex + 1, state.queue.length - 1),
        currentTrack: state.queue[Math.min(state.currentIndex + 1, state.queue.length - 1)],
        progress: 0,
      };
    case 'PREV_TRACK':
      return {
        ...state,
        currentIndex: Math.max(state.currentIndex - 1, 0),
        currentTrack: state.queue[Math.max(state.currentIndex - 1, 0)],
        progress: 0,
      };
    default:
      return state;
  }
};

const PlayerContext = createContext<{
  state: PlayerState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(playerReducer, initialState);

  return (
    <PlayerContext.Provider value={{ state, dispatch }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);