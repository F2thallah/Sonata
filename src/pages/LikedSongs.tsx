
import React from 'react';
import Layout from '../components/Layout';
import { Heart, Play, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMusicContext } from '../contexts/MusicContext';

const LikedSongs = () => {
  const { likedSongs, playSong, toggleLike, currentSong, isPlaying } = useMusicContext();

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const playAllLikedSongs = () => {
    if (likedSongs.length > 0) {
      playSong(likedSongs[0]);
    }
  };

  return (
    <Layout>
      <div className="p-8 min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-black">
        {/* Header */}
        <div className="flex items-end space-x-6 mb-8">
          <div className="w-60 h-60 bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/10">
            <Heart size={80} className="text-white" fill="white" />
          </div>
          <div>
            <p className="text-purple-300/70 text-sm font-medium uppercase tracking-wide mb-2">
              Playlist
            </p>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Liked Songs
            </h1>
            <p className="text-purple-300/70 mb-4">Your favorite tracks in one place</p>
            <div className="flex items-center text-sm text-purple-300/70">
              <span className="font-medium text-white">Your Library</span>
              <span className="mx-1">•</span>
              <span>{likedSongs.length} songs</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-6 mb-8">
          <Button
            onClick={playAllLikedSongs}
            className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-105 rounded-full flex items-center justify-center transition-all disabled:opacity-50"
            disabled={likedSongs.length === 0}
          >
            <Play size={24} className="text-white ml-1" fill="white" />
          </Button>
        </div>

        {/* Songs List */}
        {likedSongs.length > 0 ? (
          <div className="space-y-1">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-purple-300/70 text-sm font-medium border-b border-purple-500/30">
              <div className="col-span-1">#</div>
              <div className="col-span-5">TITLE</div>
              <div className="col-span-3">ALBUM</div>
              <div className="col-span-2">DATE ADDED</div>
              <div className="col-span-1 flex justify-end">
                <Clock size={16} />
              </div>
            </div>

            {/* Songs */}
            {likedSongs.map((song, index) => (
              <div
                key={song.id}
                className={`grid grid-cols-12 gap-4 px-4 py-2 hover:bg-black/30 rounded-lg group cursor-pointer transition-all duration-200 ${
                  currentSong?.id === song.id ? 'bg-purple-500/20' : ''
                }`}
                onClick={() => playSong(song)}
              >
                <div className="col-span-1 flex items-center">
                  {currentSong?.id === song.id && isPlaying ? (
                    <div className="w-4 h-4 flex items-center justify-center">
                      <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-0.5 bg-purple-400 rounded-full animate-pulse"
                            style={{
                              height: `${8 + (i * 2)}px`,
                              animationDelay: `${i * 0.1}s`
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <span className="text-purple-300/70 group-hover:hidden">
                      {index + 1}
                    </span>
                  )}
                  <Play 
                    size={16} 
                    className="text-white hidden group-hover:block" 
                    fill="white" 
                  />
                </div>
                <div className="col-span-5 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
                    <span className="text-xs text-white">♪</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white font-medium truncate">{song.title}</h3>
                    <p className="text-purple-300/70 text-sm truncate">{song.artist}</p>
                  </div>
                </div>
                <div className="col-span-3 flex items-center">
                  <span className="text-purple-300/70 text-sm truncate">{song.album}</span>
                </div>
                <div className="col-span-2 flex items-center">
                  <span className="text-purple-300/70 text-sm">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="col-span-1 flex items-center justify-end space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(song);
                    }}
                    className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Heart size={16} className="text-pink-500 hover:text-pink-400" fill="currentColor" />
                  </button>
                  <span className="text-purple-300/70 text-sm">
                    {formatTime(song.duration)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-purple-500/20">
              <Heart size={64} className="text-purple-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Songs you like will appear here</h2>
            <p className="text-purple-300/70 text-lg max-w-md mx-auto mb-8">
              Save songs by tapping the heart icon. Start exploring and discover your new favorites!
            </p>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-semibold"
              onClick={() => window.location.href = '/search'}
            >
              Find Music
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LikedSongs;
