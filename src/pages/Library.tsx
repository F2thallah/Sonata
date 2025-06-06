
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Grid, List, Search, Music, Play, Heart, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMusicContext } from '../contexts/MusicContext';
import CreatePlaylistModal from '../components/CreatePlaylistModal';
import { useNavigate } from 'react-router-dom';

const Library = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { playlists, createPlaylist, likedSongs, offlineSongs } = useMusicContext();
  const navigate = useNavigate();

  const handleCreatePlaylist = (name: string, description: string) => {
    createPlaylist(name, description);
  };

  const filteredPlaylists = playlists.filter(playlist =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-8 min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-black">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Your Library
            </h1>
            <p className="text-purple-300/70">Your playlists and saved music</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-xl ${viewMode === 'list' ? 'text-purple-400 bg-purple-500/20' : 'text-purple-300/60 hover:text-white hover:bg-black/30'}`}
            >
              <List size={20} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-xl ${viewMode === 'grid' ? 'text-purple-400 bg-purple-500/20' : 'text-purple-300/60 hover:text-white hover:bg-black/30'}`}
            >
              <Grid size={20} />
            </Button>
          </div>
        </div>

        {/* Search and Create */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={16} />
            <Input
              type="text"
              placeholder="Search in Your Library"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder-purple-300/60 focus:border-purple-400 focus:ring-purple-500/20 rounded-xl backdrop-blur-sm"
            />
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl px-6"
          >
            Create Playlist
          </Button>
        </div>

        {/* Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div 
            className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 rounded-2xl cursor-pointer hover:scale-105 transition-transform group backdrop-blur-sm border border-white/10"
            onClick={() => navigate('/liked-songs')}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Heart size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Liked Songs</h3>
                <p className="text-white/80 text-sm">{likedSongs.length} liked songs</p>
              </div>
            </div>
          </div>
          <div 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-2xl cursor-pointer hover:scale-105 transition-transform group backdrop-blur-sm border border-white/10"
            onClick={() => navigate('/offline')}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Download size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Offline Music</h3>
                <p className="text-white/80 text-sm">{offlineSongs.length} offline songs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Playlists */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Playlists</h2>
            <span className="text-purple-300/60 text-sm">{filteredPlaylists.length} playlists</span>
          </div>
          
          {filteredPlaylists.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6' : 'space-y-3'}>
              {filteredPlaylists.map((playlist) => (
                <div
                  key={playlist.id}
                  className={`${
                    viewMode === 'grid'
                      ? 'bg-black/20 p-4 rounded-2xl hover:bg-black/30 cursor-pointer transition-all duration-200 group backdrop-blur-sm border border-purple-500/20'
                      : 'flex items-center space-x-4 p-4 rounded-xl hover:bg-black/30 cursor-pointer transition-all duration-200 group backdrop-blur-sm border border-purple-500/10'
                  }`}
                  onClick={() => navigate(`/playlist/${playlist.id}`)}
                >
                  <div className={`${viewMode === 'grid' ? 'w-full aspect-square mb-4' : 'w-14 h-14'} bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center relative group-hover:scale-105 transition-transform`}>
                    <Music size={viewMode === 'grid' ? 32 : 20} className="text-white" />
                    <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={viewMode === 'grid' ? 24 : 16} className="text-white" fill="white" />
                    </div>
                  </div>
                  <div className={viewMode === 'grid' ? '' : 'flex-1 min-w-0'}>
                    <h3 className="text-white font-semibold truncate text-lg">{playlist.name}</h3>
                    <p className="text-purple-300/70 text-sm truncate mb-1">
                      {playlist.description || 'No description'}
                    </p>
                    <p className="text-purple-300/50 text-xs">
                      {playlist.songs.length} songs
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-purple-500/20">
                <Music size={40} className="text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No playlists yet</h3>
              <p className="text-purple-300/70 mb-6 max-w-md mx-auto">
                Create your first playlist to start organizing your music collection
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-full"
              >
                Create Playlist
              </Button>
            </div>
          )}
        </section>
      </div>

      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreatePlaylist}
      />
    </Layout>
  );
};

export default Library;
