import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Contenido } from '../types/content';

interface AudioPlayerContextProps {
  currentTrack: Contenido | null;
  playlist: Contenido[];
  isPlaying: boolean;
  playTrack: (track: Contenido, playlist?: Contenido[]) => void;
  playPlaylist: (playlist: Contenido[], startIndex?: number) => void;
  pause: () => void;
  resume: () => void;
  playNext: () => void;
  playPrev: () => void;
  setVolume: (volume: number) => void;
  volume: number;
}

const AudioPlayerContext = createContext<AudioPlayerContextProps | undefined>(undefined);

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Contenido | null>(null);
  const [playlist, setPlaylist] = useState<Contenido[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const playTrack = (track: Contenido, newPlaylist?: Contenido[]) => {
    if (newPlaylist) {
      setPlaylist(newPlaylist);
      setCurrentIndex(newPlaylist.findIndex(t => t.id === track.id));
    } else if (playlist.length > 0) {
      setCurrentIndex(playlist.findIndex(t => t.id === track.id));
    } else {
      setPlaylist([track]);
      setCurrentIndex(0);
    }
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const playPlaylist = (newPlaylist: Contenido[], startIndex: number = 0) => {
    setPlaylist(newPlaylist);
    setCurrentIndex(startIndex);
    setCurrentTrack(newPlaylist[startIndex]);
    setIsPlaying(true);
  };

  const pause = () => setIsPlaying(false);
  const resume = () => setIsPlaying(true);

  const playNext = () => {
    if (playlist.length === 0) return;
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIndex);
    setCurrentTrack(playlist[nextIndex]);
    setIsPlaying(true);
  };

  const playPrev = () => {
    if (playlist.length === 0) return;
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentIndex(prevIndex);
    setCurrentTrack(playlist[prevIndex]);
    setIsPlaying(true);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        playlist,
        isPlaying,
        playTrack,
        playPlaylist,
        pause,
        resume,
        playNext,
        playPrev,
        setVolume,
        volume,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer debe usarse dentro de AudioPlayerProvider');
  }
  return context;
}; 