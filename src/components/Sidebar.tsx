import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Library, Plus, Heart, Download, Music } from 'lucide-react';
import { useMusicContext } from '../contexts/MusicContext';
import CreatePlaylistModal from './CreatePlaylistModal';

const Sidebar = () => {
  const location = useLocation();
  const { playlists, createPlaylist } = useMusicContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Library, label: 'Your Library', path: '/library' },
  ];

  const handleCreatePlaylist = (name: string, description: string) => {
    createPlaylist(name, description);
  };

  return (
    <>
      <div className="w-80 bg-gradient-to-b from-gray-900 via-gray-900 to-black p-6 flex flex-col border-r border-gray-800/50">
        <div className="mb-8">
          <div className="flex flex-col items-start space-y-1 mb-2">
            <div className="flex items-center space-x-3">
              <Music size={18} className="text-white" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Sonata
              </h1>
            </div>
            <p className="text-gray-400 text-sm">Your Music, Your Way</p>
          </div>
        </div>
        
        <nav className="space-y-1 mb-8">
          {navItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                location.pathname === path
                  ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white border border-purple-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Icon size={22} className="group-hover:scale-110 transition-transform" />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Quick Access */}
        <div className="space-y-1 mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 text-gray-300 hover:text-white hover:bg-gray-800/50 w-full group"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus size={14} className="text-white" />
            </div>
            <span className="font-medium">Create Playlist</span>
          </button>

          <Link
            to="/liked-songs"
            className="flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 text-gray-300 hover:text-white hover:bg-gray-800/50 group"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform">
              <Heart size={14} className="text-white" />
            </div>
            <span className="font-medium">Liked Songs</span>
          </Link>

          <Link
            to="/offline"
            className="flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 text-gray-300 hover:text-white hover:bg-gray-800/50 group"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform">
              <Download size={14} className="text-white" />
            </div>
            <span className="font-medium">Offline Music</span>
          </Link>
        </div>

        {/* Playlists */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-4 px-4">
            <h3 className="text-gray-400 text-sm font-semibold">YOUR PLAYLISTS</h3>
            <span className="text-gray-500 text-xs">{playlists.length}</span>
          </div>
          <div className="space-y-1">
            {playlists.map((playlist) => (
              <Link
                key={playlist.id}
                to={`/playlist/${playlist.id}`}
                className="block px-4 py-2 text-gray-300 hover:text-white transition-colors truncate rounded-lg hover:bg-gray-800/30 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Music size={16} className="text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{playlist.name}</p>
                    <p className="text-xs text-gray-500">{playlist.songs.length} songs</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreatePlaylist}
      />
    </>
  );
};

export default Sidebar;
