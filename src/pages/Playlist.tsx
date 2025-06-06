
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { Play, Clock, MoreHorizontal, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMusicContext, Song } from '../contexts/MusicContext';

// Mock songs that can be added to playlists
const availableSongs: Song[] = [
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
];

const Playlist = () => {
  const { id } = useParams<{ id: string }>();
  const { playlists, playSong, playPlaylist, addSongToPlaylist, offlineSongs } = useMusicContext();
  const [showAddSongs, setShowAddSongs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const playlist = playlists.find(p => p.id === id);

  // Combine available songs with offline songs
  const allAvailableSongs = [...availableSongs, ...offlineSongs];

  const filteredSongs = allAvailableSongs.filter(song =>
    !playlist?.songs.some(playlistSong => playlistSong.id === song.id) &&
    (song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     song.artist.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!playlist) {
    return (
      <Layout>
        <div className="p-8 bg-gradient-to-br from-slate-950 via-purple-950 to-black min-h-screen">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-white mb-2">Playlist not found</h2>
            <p className="text-purple-300/70">The playlist you're looking for doesn't exist.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const totalDuration = playlist.songs.reduce((acc, song) => acc + song.duration, 0);
  const totalMinutes = Math.floor(totalDuration / 60);

  const handleAddSong = (song: Song) => {
    if (playlist) {
      addSongToPlaylist(playlist.id, song);
    }
  };

  return (
    <Layout>
      <div className="p-8 bg-gradient-to-br from-slate-950 via-purple-950 to-black min-h-screen">
        {/* Playlist Header */}
        <div className="flex items-end space-x-6 mb-8">
          <div className="w-64 h-64 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/10">
            <span className="text-6xl">🎵</span>
          </div>
          <div className="flex-1">
            <p className="text-purple-300/70 text-sm font-medium uppercase tracking-wide mb-2">
              Playlist
            </p>
            <h1 className="text-6xl font-bold text-white mb-4">{playlist.name}</h1>
            <p className="text-purple-300/70 mb-4">{playlist.description}</p>
            <div className="flex items-center text-sm text-purple-300/70">
              <span className="font-medium text-white">Your Library</span>
              <span className="mx-1">•</span>
              <span>{playlist.songs.length} songs</span>
              <span className="mx-1">•</span>
              <span>{totalMinutes} min</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-6 mb-8">
          <Button
            onClick={() => playPlaylist(playlist)}
            className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-105 rounded-full flex items-center justify-center transition-all"
            disabled={playlist.songs.length === 0}
          >
            <Play size={24} className="text-white ml-1" fill="white" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-purple-300/70 hover:text-white"
            onClick={() => setShowAddSongs(!showAddSongs)}
          >
            <Plus size={24} className="mr-2" />
            Add Songs
          </Button>
          <Button variant="ghost" size="sm" className="text-purple-300/70 hover:text-white">
            <MoreHorizontal size={24} />
          </Button>
        </div>

        {/* Add Songs Section */}
        {showAddSongs && (
          <div className="mb-8 bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold text-white mb-4">Add Songs to Playlist</h3>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={16} />
              <Input
                type="text"
                placeholder="Search for songs to add..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder-purple-300/60 focus:border-purple-400 focus:ring-purple-500/20 rounded-xl"
              />
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filteredSongs.map((song) => (
                <div
                  key={song.id}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-black/30 group cursor-pointer transition-all"
                  onClick={() => handleAddSong(song)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
                    <span className="text-xs text-white">♪</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">{song.title}</h4>
                    <p className="text-purple-300/70 text-sm truncate">{song.artist}</p>
                  </div>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Songs List */}
        {playlist.songs.length > 0 ? (
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
            {playlist.songs.map((song, index) => (
              <div
                key={song.id}
                className="grid grid-cols-12 gap-4 px-4 py-2 hover:bg-black/30 rounded-lg group cursor-pointer transition-all"
                onClick={() => playSong(song)}
              >
                <div className="col-span-1 flex items-center">
                  <span className="text-purple-300/70 group-hover:hidden">
                    {index + 1}
                  </span>
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
                <div className="col-span-1 flex items-center justify-end">
                  <span className="text-purple-300/70 text-sm">
                    {formatTime(song.duration)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-bold text-white mb-2">This playlist is empty</h3>
            <p className="text-purple-300/70 mb-4">Add some songs to get started</p>
            <Button 
              onClick={() => setShowAddSongs(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Plus size={16} className="mr-2" />
              Add Songs
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Playlist;
