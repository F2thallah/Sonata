
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Search as SearchIcon, Play, Mic, Camera, TrendingUp, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useMusicContext, Song } from '../contexts/MusicContext';

const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 200,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    title: 'Watermelon Sugar',
    artist: 'Harry Styles',
    album: 'Fine Line',
    duration: 174,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: 203,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    id: '4',
    title: 'Good 4 U',
    artist: 'Olivia Rodrigo',
    album: 'SOUR',
    duration: 178,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
  {
    id: '5',
    title: 'Heat Waves',
    artist: 'Glass Animals',
    album: 'Dreamland',
    duration: 238,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  },
  {
    id: '6',
    title: 'Happier Than Ever',
    artist: 'Billie Eilish',
    album: 'Happier Than Ever',
    duration: 298,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  },
];

const genres = [
  { name: 'Pop', color: 'from-pink-500 to-purple-600' },
  { name: 'Rock', color: 'from-red-500 to-orange-600' },
  { name: 'Hip-Hop', color: 'from-green-500 to-teal-600' },
  { name: 'Electronic', color: 'from-blue-500 to-indigo-600' },
  { name: 'Jazz', color: 'from-amber-500 to-yellow-600' },
  { name: 'Classical', color: 'from-violet-500 to-purple-600' },
  { name: 'Country', color: 'from-orange-500 to-red-600' },
  { name: 'R&B', color: 'from-purple-500 to-pink-600' },
];

const trendingSearches = [
  'summer hits 2024',
  'chill vibes',
  'workout music',
  'study beats',
  'party playlist'
];

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const { playSong, toggleLike, isLiked, offlineSongs } = useMusicContext();

  // Combine mock songs with offline songs for search
  const allSongs = [...mockSongs, ...offlineSongs];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = allSongs.filter(
        song =>
          song.title.toLowerCase().includes(query.toLowerCase()) ||
          song.artist.toLowerCase().includes(query.toLowerCase()) ||
          song.album.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Layout>
      <div className="p-8 min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-black">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
            Search
          </h1>
          <div className="relative max-w-2xl">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
            <Input
              type="text"
              placeholder="What do you want to listen to?"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-12 pr-24 h-14 bg-black/30 backdrop-blur-xl border-purple-500/30 text-white placeholder-purple-300/60 focus:border-purple-400 focus:ring-purple-500/20 rounded-full text-lg"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <button className="p-2 hover:bg-purple-500/20 rounded-full transition-colors">
                <Mic size={18} className="text-purple-400 hover:text-white" />
              </button>
              <button className="p-2 hover:bg-purple-500/20 rounded-full transition-colors">
                <Camera size={18} className="text-purple-400 hover:text-white" />
              </button>
            </div>
          </div>
        </div>

        {searchQuery && searchResults.length > 0 ? (
          /* Search Results */
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <TrendingUp size={24} className="mr-3 text-purple-400" />
              Top Results
            </h2>
            <div className="space-y-2">
              {searchResults.map((song, index) => (
                <div
                  key={song.id}
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-black/30 backdrop-blur-sm group cursor-pointer transition-all duration-200 border border-purple-500/10"
                  onClick={() => playSong(song)}
                >
                  <span className="text-purple-300/60 w-6 text-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center relative group-hover:scale-105 transition-transform">
                    <span className="text-white text-lg">♪</span>
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={18} className="text-white" fill="white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate text-lg">{song.title}</h3>
                    <p className="text-purple-300/70 text-sm truncate">{song.artist}</p>
                  </div>
                  <div className="text-purple-300/60 text-sm hidden md:block">
                    {song.album}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(song);
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      isLiked(song.id)
                        ? 'text-pink-500 hover:text-pink-400'
                        : 'text-purple-300/60 hover:text-pink-400'
                    }`}
                  >
                    <Heart size={18} fill={isLiked(song.id) ? 'currentColor' : 'none'} />
                  </button>
                  <div className="text-purple-300/60 text-sm w-16 text-right">
                    {formatTime(song.duration)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : searchQuery && searchResults.length === 0 ? (
          /* No Results */
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-purple-500/20">
              <SearchIcon size={40} className="text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No results found</h2>
            <p className="text-purple-300/70 mb-6">Try searching for something else</p>
          </div>
        ) : (
          <>
            {/* Trending Searches */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <TrendingUp size={20} className="mr-3 text-purple-400" />
                Trending Searches
              </h2>
              <div className="flex flex-wrap gap-3">
                {trendingSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => handleSearch(search)}
                    className="px-4 py-2 bg-black/30 hover:bg-purple-500/20 rounded-full text-purple-300 hover:text-white transition-colors border border-purple-500/30 hover:border-purple-400/50 backdrop-blur-sm"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </section>

            {/* Browse Categories */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Browse all</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {genres.map((genre) => (
                  <div
                    key={genre.name}
                    className={`bg-gradient-to-br ${genre.color} p-6 rounded-2xl cursor-pointer hover:scale-105 transition-transform aspect-square flex items-end relative overflow-hidden group backdrop-blur-sm border border-white/10`}
                  >
                    <h3 className="text-white font-bold text-xl z-10">{genre.name}</h3>
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-black bg-opacity-20 rounded-full transform rotate-12 group-hover:scale-110 transition-transform"></div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Search;
