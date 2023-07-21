// components/AudioPlayer.tsx

import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/AudioPlayer.module.css';

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const audioEl = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setPlaying(!prevValue);
    if (!prevValue) {
      audioEl.current?.play();
    } else {
      audioEl.current?.pause();
    }
  };

  const onLoadedData = () => {
    setProgress(audioEl.current?.currentTime || 0);
  };

  const onTimeUpdate = () => {
    setProgress(audioEl.current?.currentTime || 0);
  };

  const onVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(e.target.valueAsNumber);
    audioEl.current!.volume = volume;
  };

  const onProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(e.target.valueAsNumber);
    audioEl.current!.currentTime = progress;
  };

  useEffect(() => {
    audioEl.current!.volume = volume;
  }, []);

  return (
    <div className={styles.player}>
      <audio
        ref={audioEl}
        src={src}
        onLoadedData={onLoadedData}
        onTimeUpdate={onTimeUpdate}
      />
      <button className={styles.playButton} onClick={togglePlayPause}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <input
        className={styles.slider}
        type="range"
        min="0"
        max={audioEl.current?.duration || 0}
        value={progress}
        onChange={onProgressChange}
      />
      <input
        className={styles.slider}
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={onVolumeChange}
      />
    </div>
  );
}

export default AudioPlayer;
