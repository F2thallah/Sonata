
import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import { Upload, Play, Trash2, Music, File, FolderOpen } from 'lucide-react';
import { useMusicContext, Song } from '../contexts/MusicContext';
import { Button } from '@/components/ui/button';

const Offline = () => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { playSong, currentSong, isPlaying, offlineSongs, addOfflineSong, removeOfflineSong } = useMusicContext();

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('audio/')) {
        const audioUrl = URL.createObjectURL(file);
        const newSong: Song = {
          id: Date.now().toString() + Math.random().toString(),
          title: file.name.replace(/\.[^/.]+$/, ""),
          artist: 'Local File',
          album: 'Offline Music',
          duration: 0,
          audioUrl,
          isLocal: true,
        };
        addOfflineSong(newSong);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
  };

  const deleteSong = (songId: string) => {
    removeOfflineSong(songId);
  };

  return (
    <Layout>
      <div className="p-8 min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-black">
        {/* Header */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
          <div className="relative bg-black/20 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FolderOpen size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Offline Music
                </h1>
                <p className="text-purple-200/80 text-lg">Your personal music collection</p>
              </div>
            </div>
            {offlineSongs.length > 0 && (
              <div className="flex items-center space-x-6 text-sm text-purple-200/60">
                <span>{offlineSongs.length} tracks</span>
                <span>•</span>
                <span>Stored locally</span>
              </div>
            )}
          </div>
        </div>

        {/* Upload Area */}
        <div
          className={`relative mb-8 transition-all duration-300 ${
            dragActive ? 'scale-105' : ''
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-3xl blur-xl"></div>
          <div className={`relative border-2 border-dashed rounded-3xl p-16 text-center transition-all duration-300 backdrop-blur-xl ${
            dragActive 
              ? 'border-purple-400 bg-purple-500/20 shadow-2xl shadow-purple-500/25' 
              : 'border-purple-500/30 bg-black/10 hover:border-purple-400/50 hover:bg-black/20'
          }`}>
            <div className={`transition-all duration-300 ${dragActive ? 'scale-110' : ''}`}>
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Upload size={40} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {dragActive ? 'Drop your music here' : 'Add Your Music'}
              </h3>
              <p className="text-purple-200/80 mb-6 text-lg">
                Drag & drop your audio files or browse to select
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Browse Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="audio/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <p className="text-sm text-purple-300/60 mt-6">
                Supports MP3, WAV, M4A, FLAC, OGG and more
              </p>
            </div>
          </div>
        </div>

        {/* Songs List */}
        {offlineSongs.length > 0 && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-3xl blur-xl"></div>
            <div className="relative bg-black/20 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                  <Music size={28} className="text-purple-400" />
                  <span>Your Library</span>
                </h2>
                <div className="text-purple-200/60 text-sm">
                  {offlineSongs.length} song{offlineSongs.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              <div className="space-y-3">
                {offlineSongs.map((song, index) => (
                  <div
                    key={song.id}
                    className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                      currentSong?.id === song.id 
                        ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-400/50 shadow-lg shadow-purple-500/20' 
                        : 'bg-black/10 hover:bg-black/20 border border-purple-500/20'
                    }`}
                  >
                    <div className="flex items-center p-6">
                      {/* Index & Play Button */}
                      <div className="w-12 flex items-center justify-center mr-6">
                        {currentSong?.id === song.id && isPlaying ? (
                          <div className="w-6 h-6 flex items-center justify-center">
                            <div className="flex space-x-1">
                              {[0, 1, 2].map((i) => (
                                <div
                                  key={i}
                                  className="w-1 bg-purple-400 rounded-full animate-pulse"
                                  style={{
                                    height: `${12 + (i * 4)}px`,
                                    animationDelay: `${i * 0.1}s`
                                  }}
                                ></div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <span className="text-purple-200/60 group-hover:hidden font-medium">
                            {index + 1}
                          </span>
                        )}
                        <button
                          onClick={() => playSong(song)}
                          className="hidden group-hover:flex w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full items-center justify-center hover:scale-110 transition-transform shadow-lg"
                        >
                          <Play size={16} className="text-white ml-0.5" fill="white" />
                        </button>
                      </div>

                      {/* Song Icon */}
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-6 shadow-lg">
                        <Music size={24} className="text-white" />
                      </div>

                      {/* Song Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-lg truncate mb-1">
                          {song.title}
                        </h3>
                        <p className="text-purple-200/70 text-sm truncate flex items-center">
                          <File size={14} className="mr-2" />
                          {song.artist}
                        </p>
                      </div>

                      {/* Album */}
                      <div className="hidden md:block w-48 px-4">
                        <p className="text-purple-200/60 text-sm truncate">{song.album}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => deleteSong(song.id)}
                          className="p-3 text-purple-300/60 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded-xl"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {offlineSongs.length === 0 && (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-purple-500/20">
              <Music size={64} className="text-purple-400/60" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Your library is empty</h2>
            <p className="text-purple-200/60 text-lg max-w-md mx-auto">
              Upload your favorite music files to start building your personal collection
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Offline;
