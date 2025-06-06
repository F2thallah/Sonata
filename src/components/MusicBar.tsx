
import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2,
  Heart,
  MoreHorizontal,
  Music
} from 'lucide-react';
import { useMusicContext } from '../contexts/MusicContext';
import { useNavigate } from 'react-router-dom';
import { Slider } from '@/components/ui/slider';

const MusicBar = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    pauseMusic,
    resumeMusic,
    nextSong,
    previousSong,
    setVolume,
    seekTo,
  } = useMusicContext();

  const navigate = useNavigate();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (value: number[]) => {
    seekTo(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
  };

  const handleBarClick = () => {
    if (currentSong) {
      navigate('/now-playing');
    }
  };

  if (!currentSong) {
    return null;
  }

  return (
    <div className="h-24 bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-black/95 backdrop-blur-xl border-t border-gray-700/50 px-6 flex items-center justify-between shadow-2xl">
      {/* Song Info - Clickable */}
      <div 
        className="flex items-center space-x-4 w-1/3 cursor-pointer hover:bg-purple-500/10 p-3 rounded-xl transition-all duration-300 group"
        onClick={handleBarClick}
      >
        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300 group-hover:scale-105">
          {currentSong.coverUrl ? (
            <img 
              src={currentSong.coverUrl} 
              alt={currentSong.title}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <Music size={20} className="text-white" />
          )}
        </div>
        <div className="min-w-0">
          <h4 className="text-white text-base font-semibold truncate group-hover:text-purple-300 transition-colors">
            {currentSong.title}
          </h4>
          <p className="text-gray-400 text-sm truncate">{currentSong.artist}</p>
        </div>
        <Heart size={20} className="text-gray-400 hover:text-purple-400 transition-colors cursor-pointer opacity-0 group-hover:opacity-100" />
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center space-y-3 w-1/3">
        <div className="flex items-center space-x-6">
          <SkipBack 
            size={20} 
            className="text-gray-400 hover:text-white transition-colors cursor-pointer hover:scale-110 transform"
            onClick={previousSong}
          />
          <button
            onClick={isPlaying ? pauseMusic : resumeMusic}
            className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg hover:shadow-purple-500/25"
          >
            {isPlaying ? (
              <Pause size={20} className="text-white" />
            ) : (
              <Play size={20} className="text-white ml-0.5" />
            )}
          </button>
          <SkipForward 
            size={20} 
            className="text-gray-400 hover:text-white transition-colors cursor-pointer hover:scale-110 transform"
            onClick={nextSong}
          />
        </div>

        {/* Progress Bar */}
        <div className="flex items-center space-x-3 w-full max-w-md">
          <span className="text-xs text-gray-400 w-12 text-right">
            {formatTime(currentTime)}
          </span>
          <div className="flex-1 relative">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleProgressChange}
              className="w-full [&_.slider-track]:bg-gray-600 [&_.slider-range]:bg-gradient-to-r [&_.slider-range]:from-purple-400 [&_.slider-range]:to-pink-400 [&_.slider-thumb]:bg-white [&_.slider-thumb]:shadow-lg"
            />
          </div>
          <span className="text-xs text-gray-400 w-12">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Volume & More */}
      <div className="flex items-center space-x-4 w-1/3 justify-end">
        <MoreHorizontal size={20} className="text-gray-400 hover:text-white transition-colors cursor-pointer" />
        <Volume2 size={18} className="text-gray-400" />
        <div className="w-24">
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="[&_.slider-track]:bg-gray-600 [&_.slider-range]:bg-gradient-to-r [&_.slider-range]:from-purple-400 [&_.slider-range]:to-pink-400 [&_.slider-thumb]:bg-white [&_.slider-thumb]:shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicBar;
