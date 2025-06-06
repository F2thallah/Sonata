
import React from 'react';
import Layout from '../components/Layout';
import { Play, Clock, TrendingUp, Music, Headphones } from 'lucide-react';
import { useMusicContext, Song } from '../contexts/MusicContext';

const mockRecentSongs: Song[] = [
  {
    id: 'recent1',
    title: 'Midnight Drive',
    artist: 'Neon Dreams',
    album: 'Night Vibes',
    duration: 234,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 'recent2',
    title: 'Electric Love',
    artist: 'Synth Wave',
    album: 'Digital Hearts',
    duration: 198,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
];

const Index = () => {
  const { playSong } = useMusicContext();

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const timeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Layout>
      <div className="p-8 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            {timeBasedGreeting()}
          </h1>
          <p className="text-gray-400 text-lg">Ready to discover your next favorite song?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl p-6 cursor-pointer hover:scale-105 transition-transform group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Music size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Liked Songs</h3>
                <p className="text-white/80 text-sm">Your favorites</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 cursor-pointer hover:scale-105 transition-transform group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Headphones size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Discover Weekly</h3>
                <p className="text-white/80 text-sm">Fresh picks for you</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-600 to-red-500 rounded-2xl p-6 cursor-pointer hover:scale-105 transition-transform group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Trending Now</h3>
                <p className="text-white/80 text-sm">What's hot today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Played */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Clock size={24} className="mr-3 text-purple-400" />
              Recently Played
            </h2>
          </div>

          {mockRecentSongs.length > 0 ? (
            <div className="space-y-3">
              {mockRecentSongs.map((song, index) => (
                <div
                  key={song.id}
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-800/50 group cursor-pointer transition-all duration-200"
                  onClick={() => playSong(song)}
                >
                  <span className="text-gray-400 w-6 text-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center relative group-hover:scale-105 transition-transform">
                    <Music size={20} className="text-white" />
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={18} className="text-white" fill="white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate text-lg">{song.title}</h3>
                    <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                  </div>
                  <div className="text-gray-400 text-sm hidden md:block">
                    {song.album}
                  </div>
                  <div className="text-gray-400 text-sm w-16 text-right">
                    {formatTime(song.duration)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Music size={32} className="text-purple-400" />
              </div>
              <p className="text-gray-400">No recent activity</p>
            </div>
          )}
        </section>

        {/* Made For You */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Made For You</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-gray-800/30 p-4 rounded-2xl hover:bg-gray-800/50 cursor-pointer transition-all duration-200 group"
              >
                <div className="w-full aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mb-4 flex items-center justify-center relative group-hover:scale-105 transition-transform">
                  <Music size={32} className="text-white" />
                  <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={24} className="text-white" fill="white" />
                  </div>
                </div>
                <h3 className="text-white font-semibold truncate mb-1">Daily Mix {i}</h3>
                <p className="text-gray-400 text-sm truncate">Your personal mix</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
