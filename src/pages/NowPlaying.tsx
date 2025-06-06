
import React from 'react';
import { 
  ChevronDown,
  MoreHorizontal,
  Heart,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  Music
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMusicContext } from '../contexts/MusicContext';
import { Slider } from '@/components/ui/slider';

const NowPlaying = () => {
  const navigate = useNavigate();
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

  if (!currentSong) {
    navigate('/');
    return null;
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col text-white relative overflow-hidden">


      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6 backdrop-blur-sm">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110"
        >
          <ChevronDown size={24} />
        </button>
        <div className="text-center">
          <p className="text-sm text-purple-200 font-medium">Now Playing</p>
          <p className="text-xs text-gray-400">from {currentSong.album}</p>
        </div>
        <button className="p-3 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110">
          <MoreHorizontal size={24} />
        </button>
      </div>

      {/* Album Art */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-8">
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl scale-110"></div>
          
          {/* Main album art container */}
          <div className="relative w-80 h-80 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl shadow-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
            {currentSong.coverUrl ? (
              <img 
                src={currentSong.coverUrl} 
                alt={currentSong.title}
                className="w-full h-full object-cover rounded-3xl"
              />
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Music size={40} className="text-white" />
                </div>
                <p className="text-gray-400 text-sm">Audio File</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Song Info */}
      <div className="relative z-10 px-8 mb-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
            {currentSong.title}
          </h1>
          <p className="text-xl text-gray-300">{currentSong.artist}</p>
        </div>
        <div className="flex items-center justify-between">
          <Heart size={28} className="text-gray-400 hover:text-purple-400 transition-colors cursor-pointer hover:scale-110 transform" />
          <div className="text-gray-400 text-sm">
            {currentSong.isLocal ? '📁 Local File' : '🎵 Streaming'}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="relative z-10 px-8 mb-6">
        <div className="mb-3">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleProgressChange}
            className="[&_.slider-track]:bg-gray-600 [&_.slider-range]:bg-gradient-to-r [&_.slider-range]:from-purple-400 [&_.slider-range]:to-pink-400 [&_.slider-thumb]:bg-white [&_.slider-thumb]:shadow-lg [&_.slider-thumb]:w-4 [&_.slider-thumb]:h-4"
          />
        </div>
        <div className="flex justify-between text-sm text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 px-8 mb-8">
        <div className="flex items-center justify-center space-x-8 mb-8">
          <Shuffle size={24} className="text-gray-400 hover:text-white transition-colors cursor-pointer hover:scale-110 transform" />
          <button
            onClick={previousSong}
            className="text-white hover:scale-110 transition-transform cursor-pointer"
          >
            <SkipBack size={32} />
          </button>
          <button
            onClick={isPlaying ? pauseMusic : resumeMusic}
            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-2xl hover:shadow-purple-500/25"
          >
            {isPlaying ? (
              <Pause size={28} className="text-white" />
            ) : (
              <Play size={28} className="text-white ml-1" />
            )}
          </button>
          <button
            onClick={nextSong}
            className="text-white hover:scale-110 transition-transform cursor-pointer"
          >
            <SkipForward size={32} />
          </button>
          <Repeat size={24} className="text-gray-400 hover:text-white transition-colors cursor-pointer hover:scale-110 transform" />
        </div>

        {/* Volume */}
        <div className="flex items-center justify-center space-x-4 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <Volume2 size={20} className="text-gray-400" />
          <div className="w-32">
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
    </div>
  );
};

export default NowPlaying;
