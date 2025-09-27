import React, { useRef, useEffect } from 'react';
import { AudioPlayerProps } from '@/types';
import './AudioPlayer.css';

/**
 * Componente reproductor de audio HTML5 nativo
 * Reproduce el audio del episodio seleccionado
 */
const AudioPlayer: React.FC<AudioPlayerProps> = ({ episode }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Resetear el reproductor cuando cambia el episodio
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [episode.audioUrl]);

  return (
    <div className="audio-player">
      <div className="audio-player__info">
        <h3 className="audio-player__title">Playing: {episode.title}</h3>
      </div>

      <div className="audio-player__controls">
        <audio
          ref={audioRef}
          controls
          preload="metadata"
          className="audio-player__element"
          lang="en"
        >
          <source src={episode.audioUrl} type="audio/mpeg" />
          <source src={episode.audioUrl} type="audio/mp4" />
          <source src={episode.audioUrl} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      </div>

      {!episode.audioUrl && (
        <div className="audio-player__no-audio">
          <p>No audio file available for this episode.</p>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
