import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  coverUrl?: string;
  audioUrl: string;
  isLocal?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl?: string;
  songs: Song[];
  createdAt: Date;
}

interface MusicContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: Song[];
  currentPlaylist: Playlist | null;
  playlists: Playlist[];
  likedSongs: Song[];
  offlineSongs: Song[];
  playSong: (song: Song) => void;
  pauseMusic: () => void;
  resumeMusic: () => void;
  nextSong: () => void;
  previousSong: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  addToQueue: (song: Song) => void;
  createPlaylist: (name: string, description: string) => void;
  addSongToPlaylist: (playlistId: string, song: Song) => void;
  playPlaylist: (playlist: Playlist) => void;
  toggleLike: (song: Song) => void;
  isLiked: (songId: string) => boolean;
  addOfflineSong: (song: Song) => void;
  removeOfflineSong: (songId: string) => void;
  deletePlaylist: (playlistId: string) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusicContext = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicContext must be used within a MusicProvider');
  }
  return context;
};

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [offlineSongs, setOfflineSongs] = useState<Song[]>([]);
  const [audio] = useState(new Audio());

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedPlaylists = localStorage.getItem('musicPlaylists');
    const savedLikedSongs = localStorage.getItem('likedSongs');
    const savedOfflineSongs = localStorage.getItem('offlineSongs');

    if (savedPlaylists) {
      try {
        const parsedPlaylists = JSON.parse(savedPlaylists);
        setPlaylists(parsedPlaylists.map((p: Playlist) => ({
          ...p,
          createdAt: new Date(p.createdAt)
        })));
      } catch (error) {
        console.error('Error loading playlists:', error);
      }
    }

    if (savedLikedSongs) {
      try {
        setLikedSongs(JSON.parse(savedLikedSongs));
      } catch (error) {
        console.error('Error loading liked songs:', error);
      }
    }

    if (savedOfflineSongs) {
      try {
        setOfflineSongs(JSON.parse(savedOfflineSongs));
      } catch (error) {
        console.error('Error loading offline songs:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (playlists.length > 0) {
      localStorage.setItem('musicPlaylists', JSON.stringify(playlists));
    }
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
  }, [likedSongs]);

  useEffect(() => {
    localStorage.setItem('offlineSongs', JSON.stringify(offlineSongs));
  }, [offlineSongs]);

  useEffect(() => {
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => nextSong();
    const handleAudioError = (e: Event) => {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      alert('Audio playback failed. Please check the file or try another song.');
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleAudioError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleAudioError);
    };
  }, [audio]); // eslint-disable-next-line react-hooks/exhaustive-deps

  const playSong = (song: Song) => {
    console.log('Playing song:', song.title);
    setCurrentSong(song);
    audio.src = song.audioUrl;
    audio.play();
    setIsPlaying(true);
  };

  const pauseMusic = () => {
    audio.pause();
    setIsPlaying(false);
  };

  const resumeMusic = () => {
    audio.play();
    setIsPlaying(true);
  };

  const nextSong = () => {
    if (queue.length > 0) {
      const currentIndex = queue.findIndex(song => song.id === currentSong?.id);
      const nextIndex = (currentIndex + 1) % queue.length;
      playSong(queue[nextIndex]);
    }
  };

  const previousSong = () => {
    if (queue.length > 0) {
      const currentIndex = queue.findIndex(song => song.id === currentSong?.id);
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
      playSong(queue[prevIndex]);
    }
  };

  const setVolume = (newVolume: number) => {
    audio.volume = newVolume;
    setVolumeState(newVolume);
  };

  const seekTo = (time: number) => {
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const addToQueue = (song: Song) => {
    setQueue(prev => [...prev, song]);
  };

  const createPlaylist = (name: string, description: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      description,
      songs: [],
      createdAt: new Date(),
    };
    setPlaylists(prev => [...prev, newPlaylist]);
  };

  const addSongToPlaylist = (playlistId: string, song: Song) => {
    setPlaylists(prev =>
      prev.map(playlist =>
        playlist.id === playlistId
          ? { ...playlist, songs: [...playlist.songs, song] }
          : playlist
      )
    );
  };

  const deletePlaylist = (playlistId: string) => {
    setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId));
  };

  const playPlaylist = (playlist: Playlist) => {
    setCurrentPlaylist(playlist);
    setQueue(playlist.songs);
    if (playlist.songs.length > 0) {
      playSong(playlist.songs[0]);
    }
  };

  const toggleLike = (song: Song) => {
    setLikedSongs(prev => {
      const isCurrentlyLiked = prev.some(likedSong => likedSong.id === song.id);
      if (isCurrentlyLiked) {
        return prev.filter(likedSong => likedSong.id !== song.id);
      } else {
        return [...prev, song];
      }
    });
  };

  const isLiked = (songId: string) => {
    return likedSongs.some(song => song.id === songId);
  };

  const addOfflineSong = (song: Song) => {
    setOfflineSongs(prev => [...prev, song]);
  };

  const removeOfflineSong = (songId: string) => {
    setOfflineSongs(prev => {
      const updatedSongs = prev.filter(song => song.id !== songId);
      if (updatedSongs.length === 0) {
        localStorage.removeItem('offlineSongs');
      }
      return updatedSongs;
    });
  };

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        queue,
        currentPlaylist,
        playlists,
        likedSongs,
        offlineSongs,
        playSong,
        pauseMusic,
        resumeMusic,
        nextSong,
        previousSong,
        setVolume,
        seekTo,
        addToQueue,
        createPlaylist,
        addSongToPlaylist,
        playPlaylist,
        toggleLike,
        isLiked,
        addOfflineSong,
        removeOfflineSong,
        deletePlaylist,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};
