"use client";
import React, { useRef, useEffect } from 'react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

const ReproductorGlobal = () => {
  const {
    currentTrack,
    isPlaying,
    playNext,
    playPrev,
    pause,
    resume,
    setVolume,
    volume,
  } = useAudioPlayer();
  const audioRef = useRef<HTMLAudioElement>(null);

  // Reproducir automáticamente al cambiar de pista
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.load(); // Forzar recarga del audio
      if (isPlaying) {
        audioRef.current.play();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack]);

  // Play/Pause control
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Volumen
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  if (!currentTrack) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(90deg, #181818 60%, #282828 100%)',
      color: '#fff',
      padding: 12,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      boxShadow: '0 -2px 16px rgba(0,0,0,0.3)'
    }}>
      {currentTrack.urlImagen && (
        <img src={currentTrack.urlImagen} alt={currentTrack.titulo} style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #0006' }} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 18, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentTrack.titulo}</div>
        <div style={{ color: '#aaa', fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentTrack.autor}</div>
      </div>
      <button onClick={playPrev} title="Anterior" style={{ fontSize: 22, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>⏮️</button>
      {isPlaying ? (
        <button onClick={pause} title="Pausar" style={{ fontSize: 22, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>⏸️</button>
      ) : (
        <button onClick={resume} title="Reproducir" style={{ fontSize: 22, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>▶️</button>
      )}
      <button onClick={playNext} title="Siguiente" style={{ fontSize: 22, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>⏭️</button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={e => setVolume(Number(e.target.value))}
        style={{ width: 100, marginLeft: 16 }}
        title="Volumen"
      />
      <audio
        ref={audioRef}
        src={currentTrack.urlAudio}
        onEnded={playNext}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ReproductorGlobal; 