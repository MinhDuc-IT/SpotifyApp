import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import TrackPlayer, { State, Event, useTrackPlayerEvents, Track } from 'react-native-track-player';
import { fetchLyrics } from '../services/lyric.service';
import { Lyric } from '../types/player.d';
import { getQueue } from 'react-native-track-player/lib/src/trackPlayer';

type PlayerState = {
  isPlaying: boolean;
  currentTrack: Track | null;
  queue: Track[];
  lyrics: Lyric[];
  currentLyricIndex: number;
  modalVisible: boolean;
};

type PlayerActions = {
  play: (track?: Track) => Promise<void>;
  pause: () => Promise<void>;
  skipToNext: () => Promise<void>;
  skipToPrevious: () => Promise<void>;
  addToQueue: (tracks: Track[]) => Promise<number | void>;
  seekTo: (position: number) => Promise<void>;
  showModal: () => void;
  hideModal: () => void;
};

const PlayerContext = createContext<PlayerState & PlayerActions>(null!);

const playerReducer = (state: PlayerState, action: any): PlayerState => {
  switch (action.type) {
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'SET_TRACK':
      return { ...state, currentTrack: action.payload };
    case 'SET_QUEUE':
      return { ...state, queue: action.payload };
    case 'SET_LYRICS':
      return { ...state, lyrics: action.payload };
    case 'SET_LYRIC_INDEX':
      return { ...state, currentLyricIndex: action.payload };
    case 'SET_MODAL_VISIBLE':
      return { ...state, modalVisible: action.payload };
    default:
      return state;
  }
};

export const PlayerProviderV2 = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(playerReducer, {
    isPlaying: false,
    currentTrack: null,
    queue: [],
    lyrics: [],
    currentLyricIndex: -1,
    modalVisible: false,
  });

  // Xử lý lyrics
  const updateLyrics = useCallback(async (trackId: string) => {
    try {
      const lyrics = await fetchLyrics(trackId);
      dispatch({ type: 'SET_LYRICS', payload: lyrics });
    } catch (error) {
      console.error('Error loading lyrics:', error);
    }
  }, []);

  // Xử lý sync lyrics
  useEffect(() => {
    const interval = setInterval(async () => {
      if (state.isPlaying && state.currentTrack) {
        const position = await TrackPlayer.getPosition();
        const currentIndex = state.lyrics.findIndex(
          (lyric, index) =>
            lyric.startTime <= position &&
            (state.lyrics[index + 1]?.startTime > position || index === state.lyrics.length - 1)
        );
        if (currentIndex !== state.currentLyricIndex) {
          dispatch({ type: 'SET_LYRIC_INDEX', payload: currentIndex });
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [state.isPlaying, state.currentTrack, state.lyrics, state.currentLyricIndex]);

  useTrackPlayerEvents([Event.PlaybackTrackChanged, Event.PlaybackState], async (event) => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      dispatch({ type: 'SET_TRACK', payload: track });
      if (track?.id) updateLyrics(track.id);
    }
    if (event.type === Event.PlaybackState) {
      dispatch({ type: 'SET_PLAYING', payload: event.state === State.Playing });
    }
  });

  const actions: PlayerActions = {
    // play: async (track) => {
    //   // Nếu track mới khác với track hiện tại → reset và add lại
    //   if (track && track.id !== state.currentTrack?.id) {
    //     await TrackPlayer.reset();
    //     await TrackPlayer.add(track);
    //     dispatch({ type: 'SET_TRACK', payload: track });
    //     if (track.id) updateLyrics(track.id);
    //   }

    //   // Nếu đang paused → chỉ play tiếp
    //   await TrackPlayer.play();
    //   dispatch({ type: 'SET_PLAYING', payload: true });
    // },
    play: async (track) => {
      console.log("play" + track);
      if (track) {
        if (track && track.id !== state.currentTrack?.id) {
          const currentQueue = await TrackPlayer.getQueue();
          const trackIndex = currentQueue.findIndex(t => t.id === track.id);

          if (trackIndex === -1) {
            await TrackPlayer.reset();
            await TrackPlayer.add(track);
          } else {
            await TrackPlayer.skip(trackIndex);
          }
        }

      }

      // Luôn đảm bảo cập nhật queue sau mọi thay đổi
      const updatedQueue = await TrackPlayer.getQueue();
      dispatch({ type: 'SET_QUEUE', payload: updatedQueue });

      await TrackPlayer.play();
      dispatch({ type: 'SET_PLAYING', payload: true });
    },
    pause: async () => {
      await TrackPlayer.pause();
      dispatch({ type: 'SET_PLAYING', payload: false });
    },
    skipToNext: async () => {
      console.log("next");
      console.log(TrackPlayer.getQueue());
      await TrackPlayer.skipToNext()
    },
    skipToPrevious: async () => {
      console.log("previous");
      console.log(TrackPlayer.getQueue());
      await TrackPlayer.skipToPrevious()
    },
    addToQueue: async (tracks) => {
      console.log('queue' + tracks);
      await TrackPlayer.add(tracks);
      dispatch({ type: 'SET_QUEUE', payload: [...state.queue, ...tracks] }); // cập nhật state.queue
    },
    seekTo: async (position) => await TrackPlayer.seekTo(position),
    showModal: () => dispatch({ type: 'SET_MODAL_VISIBLE', payload: true }),
    hideModal: () => dispatch({ type: 'SET_MODAL_VISIBLE', payload: false }),

  };

  return (
    <PlayerContext.Provider value={{ ...state, ...actions }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);