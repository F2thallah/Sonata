// DOM Elements
const navigationItems = document.querySelectorAll('.navigation li');
const pages = document.querySelectorAll('.page');
const themeToggle = document.getElementById('theme-toggle');
const showShortcutsBtn = document.getElementById('show-shortcuts');
const shortcutsModal = document.getElementById('shortcuts-modal');
const createPlaylistBtn = document.getElementById('create-playlist-btn');
const playlistModal = document.getElementById('playlist-modal');
const savePlaylistBtn = document.getElementById('save-playlist-btn');
const playlistNameInput = document.getElementById('playlist-name');
const modalCloseButtons = document.querySelectorAll('.close-modal');
const audioUpload = document.getElementById('audio-upload');
const expandPlayerBtn = document.querySelector('.expand-player');
const playerCard = document.getElementById('player-card');
const minimizeBtn = document.querySelector('.minimize-btn');
const addToPlaylistModal = document.getElementById('add-to-playlist-modal');
const createNewPlaylistBtn = document.getElementById('create-new-playlist-btn');

// Player controls
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const volumeBtn = document.getElementById('volume-btn');
const progressBar = document.querySelector('.progress-bar');
const progress = document.querySelector('.progress');
const currentTimeEl = document.querySelector('.current-time');
const totalTimeEl = document.querySelector('.total-time');
const volumeSlider = document.querySelector('.volume-slider');
const volumeProgress = document.querySelector('.volume-progress');

// Card player controls
const cardPlayBtn = document.getElementById('card-play-btn');
const cardPrevBtn = document.getElementById('card-prev-btn');
const cardNextBtn = document.getElementById('card-next-btn');
const cardRepeatBtn = document.getElementById('card-repeat-btn');
const cardProgressBar = document.querySelector('.card-progress-bar');
const cardProgressFill = document.querySelector('.card-progress-fill');
const progressSlider = document.querySelector('.progress-slider');
const cardCurrentTimeEl = document.querySelector('.card-current-time');
const cardTotalTimeEl = document.querySelector('.card-total-time');

// State
let currentAudio = new Audio();
let isPlaying = false;
let currentSongId = 0;
let shuffleMode = false;
let repeatMode = false;
let songs = [];
let playlists = [];
let currentPlaylistId = null;

// Volume control functions
let currentVolume = 0.8; // Default volume level
let previousVolume = 0.8; // For mute toggle
let isMuted = false;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize player
    loadSavedData();
    initializeEventListeners();
    renderSongs();
    renderPlaylists();
    setupDirectNavigation();
    setupThemeToggle();
    initVolumeControls(); // Initialize volume controls
    
    // Initialize playlist functionality
    loadSavedPlaylists();
    setupPlaylistEventListeners();
    
    // Show active page
    showActivePage();
    
    console.log('Sonata music player initialized');
});

// Load saved data from localStorage
function loadSavedData() {
    // Load songs
    const savedSongs = localStorage.getItem('sonata-songs');
    if (savedSongs) {
        songs = JSON.parse(savedSongs);
    }
    
    // Load playlists
    const savedPlaylists = localStorage.getItem('sonata-playlists');
    if (savedPlaylists) {
        playlists = JSON.parse(savedPlaylists);
    }
    
    // Load theme preference
    const savedTheme = localStorage.getItem('sonata-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
    }
    
    // Load volume preference
    const savedVolume = localStorage.getItem('sonata-volume');
    if (savedVolume) {
        const volume = parseFloat(savedVolume);
        currentAudio.volume = volume;
        volumeProgress.style.width = `${volume * 100}%`;
        
        // Initialize volume tooltip
        const volumePercent = Math.round(volume * 100);
        volumeSlider.setAttribute('data-volume', `${volumePercent}%`);
    } else {
        // Set default volume
        volumeSlider.setAttribute('data-volume', '75%');
    }
    
    // Load last played song
    const lastSong = localStorage.getItem('sonata-last-song');
    if (lastSong && songs.length > 0) {
        const songIndex = songs.findIndex(song => song.id === lastSong);
        if (songIndex !== -1) {
            currentSongId = songIndex;
            loadSong(songs[currentSongId]);
        }
    }
}

// Initialize event listeners
function initializeEventListeners() {
    // Navigation is handled by setupDirectNavigation
    
    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('sonata-theme', themeToggle.checked ? 'dark' : 'light');
        });
    }
    
    // Make sure the theme toggle in settings page works too
    const settingsThemeToggle = document.getElementById('theme-toggle');
    if (settingsThemeToggle) {
        settingsThemeToggle.checked = document.body.classList.contains('dark-mode');
        
        // Add event listener to the settings theme toggle
        settingsThemeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('sonata-theme', settingsThemeToggle.checked ? 'dark' : 'light');
            
            // Keep the main toggle in sync
            if (themeToggle) {
                themeToggle.checked = settingsThemeToggle.checked;
            }
        });
    }
    
    // Shortcuts modal
    showShortcutsBtn.addEventListener('click', () => {
        shortcutsModal.classList.add('show');
    });
    
    // Playlist modal
    createPlaylistBtn.addEventListener('click', () => {
        document.getElementById('modal-title').textContent = 'Create Playlist';
        playlistNameInput.value = '';
        playlistModal.classList.add('show');
    });
    
    savePlaylistBtn.addEventListener('click', savePlaylist);
    
    // Close modals
    modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            shortcutsModal.classList.remove('show');
            playlistModal.classList.remove('show');
        });
    });
    
    // File upload for offline songs
    audioUpload.addEventListener('change', handleAudioUpload);
    
    // Player controls
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', playPrev);
    nextBtn.addEventListener('click', playNext);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    volumeBtn.addEventListener('click', toggleMute);
    
    // Progress bar
    progressBar.addEventListener('click', seek);
    
    // Volume slider - add both mouse and touch support
    volumeSlider.addEventListener('mousedown', adjustVolume);
    volumeSlider.addEventListener('touchstart', adjustVolume);
    
    // Player card
    const showPlayerCardBtn = document.getElementById('show-player-card');
    if (showPlayerCardBtn) {
        showPlayerCardBtn.addEventListener('click', () => {
            playerCard.classList.add('show');
            
            // Make sure player card reflects current song state
            if (currentAudio.src) {
                playerCard.classList.add('has-song');
            } else {
                playerCard.classList.remove('has-song');
            }
        });
    }
    
    minimizeBtn.addEventListener('click', () => {
        playerCard.classList.remove('show');
    });
    
    // Card player controls
    cardPlayBtn.addEventListener('click', togglePlay);
    cardPrevBtn.addEventListener('click', playPrev);
    cardNextBtn.addEventListener('click', playNext);
    cardRepeatBtn.addEventListener('click', toggleRepeat);
    cardProgressBar.addEventListener('click', seekCard);
    
    // Audio events
    currentAudio.addEventListener('timeupdate', updateProgress);
    currentAudio.addEventListener('ended', handleSongEnd);
    currentAudio.addEventListener('loadedmetadata', () => {
        // Once metadata is loaded, ensure time displays and progress are properly set
        resetProgress();
        // Update total time display
        if (!isNaN(currentAudio.duration)) {
            totalTimeEl.textContent = formatTime(currentAudio.duration);
            cardTotalTimeEl.textContent = formatTime(currentAudio.duration);
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(e) {
    // Don't trigger shortcuts if user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch (e.key) {
        case ' ': // Space for play/pause
            e.preventDefault();
            togglePlay();
            break;
        case 'ArrowRight': // Right arrow for next
            playNext();
            break;
        case 'ArrowLeft': // Left arrow for previous
            playPrev();
            break;
        case 'l': // L for loop
        case 'L':
            toggleRepeat();
            break;
        case 's': // S for shuffle
        case 'S':
            toggleShuffle();
            break;
        case 'm': // M for mute
        case 'M':
            toggleMute();
            break;
        case 'ArrowUp': // Up arrow for volume up
            e.preventDefault();
            increaseVolume();
            break;
        case 'ArrowDown': // Down arrow for volume down
            e.preventDefault();
            decreaseVolume();
            break;
    }
}

// Handle audio file upload
function handleAudioUpload(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Limit to 3 files at a time
    const filesToProcess = Array.from(files).slice(0, 3);
    
    if (files.length > 3) {
        showNotification('Only the first 3 files will be processed');
    }
    
    filesToProcess.forEach(file => {
        // Create object URL for the audio file
        const audioUrl = URL.createObjectURL(file);
        
        // Create a temporary audio element to get duration
        const tempAudio = new Audio(audioUrl);
        tempAudio.addEventListener('loadedmetadata', () => {
            const newSong = {
                id: generateId(),
                title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
                artist: 'Unknown Artist',
                src: audioUrl,
                duration: tempAudio.duration,
                cover: 'placeholder-album.jpg',
                offline: true,
                fileName: file.name,
                dateAdded: new Date().toISOString()
            };
            
            // Add to songs array
            songs.push(newSong);
            saveSongs();
            renderSongs();
            
            // If this is the first song, load it
            if (songs.length === 1) {
                loadSong(newSong);
            }
        });
    });
    
    // Reset the input to allow uploading the same file again
    e.target.value = '';
}

// Generate a unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Save songs to localStorage
function saveSongs() {
    localStorage.setItem('sonata-songs', JSON.stringify(songs));
}

// Save playlists to localStorage
function savePlaylists() {
    localStorage.setItem('sonata-playlists', JSON.stringify(playlists));
}

// Create or edit playlist
function savePlaylist() {
    const name = playlistNameInput.value.trim();
    if (!name) return;
    
    let playlistId;
    
    if (currentPlaylistId) {
        // Edit existing playlist
        const playlistIndex = playlists.findIndex(p => p.id === currentPlaylistId);
        if (playlistIndex !== -1) {
            playlists[playlistIndex].name = name;
            playlistId = currentPlaylistId;
        }
    } else {
        // Create new playlist
        const newPlaylist = {
            id: generateId(),
            name: name,
            songs: [],
            dateCreated: new Date().toISOString()
        };
        playlists.push(newPlaylist);
        playlistId = newPlaylist.id;
    }
    
    // Check if we need to add a song to the playlist
    const songToAdd = playlistModal.dataset.songToAdd;
    if (songToAdd) {
        addSongToPlaylist(songToAdd, playlistId);
        playlistModal.dataset.songToAdd = ''; // Clear the data
    }
    
    savePlaylists();
    renderPlaylists();
    playlistModal.classList.remove('show');
    currentPlaylistId = null;
}

// Render songs in the UI
function renderSongs() {
    // Render offline songs
    const offlineSongsContainer = document.querySelector('.offline-songs');
    if (offlineSongsContainer) {
        offlineSongsContainer.innerHTML = '';
        
        const offlineSongs = songs.filter(song => song.offline);
        
        if (offlineSongs.length === 0) {
            offlineSongsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-music"></i>
                    <p>No offline songs yet. Upload some music to get started!</p>
                </div>
            `;
        } else {
            offlineSongs.forEach(song => {
                const songElement = document.createElement('div');
                songElement.className = 'offline-song-item';
                
                songElement.innerHTML = `
                    <div class="offline-song-info">
                        <div class="offline-song-title">${song.title}</div>
                        <div class="offline-song-artist">Unknown Artist</div>
                    </div>
                    <div class="offline-song-duration">${formatTime(song.duration)}</div>
                    <div class="offline-song-actions">
                        <button class="icon-button add-to-playlist-btn" title="Add to Playlist"><i class="fas fa-plus"></i></button>
                        <button class="icon-button delete-song-btn" title="Delete Song"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                
                // Play song on click
                songElement.addEventListener('click', (e) => {
                    // Don't play if clicked on action buttons
                    if (e.target.closest('.offline-song-actions')) {
                        return;
                    }
                    
                    const songIndex = songs.findIndex(s => s.id === song.id);
                    currentSongId = songIndex;
                    loadSong(song);
                    playSong();
                });
                
                // Add to playlist button
                const addToPlaylistBtn = songElement.querySelector('.add-to-playlist-btn');
                addToPlaylistBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent song from playing
                    showAddToPlaylistMenu(song.id);
                });
                
                // Delete button
                const deleteBtn = songElement.querySelector('.delete-song-btn');
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent song from playing
                    deleteSong(song.id);
                });
                
                offlineSongsContainer.appendChild(songElement);
            });
        }
    }
    
    // Render featured songs
    const featuredSongsContainer = document.querySelector('.songs-grid');
    if (featuredSongsContainer) {
        featuredSongsContainer.innerHTML = '';
        
        const featuredSongs = songs.slice(0, 6); // Show up to 6 songs
        
        if (featuredSongs.length === 0) {
            featuredSongsContainer.innerHTML = `
                <div class="empty-state">
                    <p>No songs available. Add some music in the Offline Downloads section!</p>
                </div>
            `;
        } else {
            featuredSongs.forEach(song => {
                const songCard = document.createElement('div');
                songCard.className = 'song-card';
                songCard.innerHTML = `
                    <img src="${song.cover}" alt="${song.title}">
                    <div class="song-title">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                `;
                songCard.addEventListener('click', () => {
                    const songIndex = songs.findIndex(s => s.id === song.id);
                    currentSongId = songIndex;
                    loadSong(song);
                    playSong();
                });
                featuredSongsContainer.appendChild(songCard);
            });
        }
    }
    
    // Render recently played
    const recentSongsContainer = document.querySelector('.songs-list');
    if (recentSongsContainer) {
        recentSongsContainer.innerHTML = '';
        
        // Sort by last played (for now using the dateAdded as a placeholder)
        const recentSongs = [...songs].sort((a, b) => 
            new Date(b.dateAdded) - new Date(a.dateAdded)
        ).slice(0, 5); // Show up to 5 songs
        
        if (recentSongs.length === 0) {
            recentSongsContainer.innerHTML = `
                <div class="empty-state">
                    <p>No recently played songs.</p>
                </div>
            `;
        } else {
            recentSongs.forEach(song => {
                const songElement = createSongListItem(song);
                recentSongsContainer.appendChild(songElement);
            });
        }
    }
}

// Create a song list item element
function createSongListItem(song) {
    const songElement = document.createElement('div');
    songElement.className = 'song-list-item';
    songElement.innerHTML = `
        <div class="song-info">
            <div class="song-title">${song.title}</div>
            <div class="song-artist">${song.artist}</div>
        </div>
        <div class="song-duration">${formatTime(song.duration)}</div>
        <div class="song-actions">
            <button class="add-to-playlist-btn"><i class="fas fa-plus"></i></button>
            <button class="delete-song-btn"><i class="fas fa-trash"></i></button>
        </div>
    `;
    
    // Add event listeners to the buttons
    songElement.querySelector('.add-to-playlist-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        showAddToPlaylistMenu(song.id);
    });
    
    songElement.querySelector('.delete-song-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteSong(song.id);
    });
    
    // Play song on click of the list item
    songElement.addEventListener('click', () => {
        const songIndex = songs.findIndex(s => s.id === song.id);
        currentSongId = songIndex;
        loadSong(song);
        playSong();
    });
    
    return songElement;
}

// Render playlists in the UI
function renderPlaylists() {
    const playlistsContainer = document.querySelector('.playlists-container');
    if (!playlistsContainer) return;
    
    playlistsContainer.innerHTML = '';
    
    if (playlists.length === 0) {
        playlistsContainer.innerHTML = `
            <div class="empty-state">
                <p>No playlists yet. Create one to get started!</p>
            </div>
        `;
        return;
    }
    
    playlists.forEach(playlist => {
        const playlistElement = document.createElement('div');
        playlistElement.className = 'playlist-card';
        playlistElement.innerHTML = `
            <div class="playlist-cover">
                <i class="fas fa-music"></i>
            </div>
            <div class="playlist-title">${playlist.name}</div>
            <div class="playlist-count">${playlist.songs.length} songs</div>
            <div class="playlist-options">
                <button class="rename-playlist-btn"><i class="fas fa-edit"></i></button>
                <button class="delete-playlist-btn"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        playlistElement.addEventListener('click', () => {
            openPlaylist(playlist.id);
        });
        
        playlistElement.querySelector('.rename-playlist-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            openEditPlaylistModal(playlist.id);
        });
        
        playlistElement.querySelector('.delete-playlist-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            deletePlaylist(playlist.id);
        });
        
        playlistsContainer.appendChild(playlistElement);
    });
}

// Open edit playlist modal
function openEditPlaylistModal(playlistId) {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;
    
    document.getElementById('modal-title').textContent = 'Rename Playlist';
    playlistNameInput.value = playlist.name;
    currentPlaylistId = playlistId;
    playlistModal.classList.add('show');
}

// Delete a playlist
function deletePlaylist(playlistId) {
    if (confirm('Are you sure you want to delete this playlist?')) {
        playlists = playlists.filter(playlist => playlist.id !== playlistId);
        savePlaylists();
        renderPlaylists();
    }
}

// Open a playlist
function openPlaylist(playlistId) {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;
    
    // Change to playlist view (to be implemented)
    // For now, we'll just log the playlist songs
    console.log('Opening playlist:', playlist.name, playlist.songs);
}

// Show add to playlist menu
function showAddToPlaylistMenu(songId) {
    const addToPlaylistModal = document.getElementById('add-to-playlist-modal');
    const playlistsList = addToPlaylistModal.querySelector('.playlists-list');
    const createNewPlaylistBtn = document.getElementById('create-new-playlist-btn');
    
    // Clear previous list
    playlistsList.innerHTML = '';
    
    // No playlists yet
    if (playlists.length === 0) {
        playlistsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-list"></i>
                <p>No playlists yet. Create one to get started!</p>
            </div>
        `;
    } else {
        // Create playlist options
        playlists.forEach(playlist => {
            const playlistOption = document.createElement('div');
            playlistOption.className = 'playlist-option';
            
            playlistOption.innerHTML = `
                <div class="playlist-option-icon">
                    <i class="fas fa-music"></i>
                </div>
                <div class="playlist-option-name">${playlist.name}</div>
            `;
            
            // Add to playlist on click
            playlistOption.addEventListener('click', () => {
                addSongToPlaylist(songId, playlist.id);
                addToPlaylistModal.classList.remove('show');
            });
            
            playlistsList.appendChild(playlistOption);
        });
    }
    
    // Store the song ID for later use
    addToPlaylistModal.dataset.songId = songId;
    
    // Create new playlist button
    createNewPlaylistBtn.addEventListener('click', () => {
        addToPlaylistModal.classList.remove('show');
        
        // Open create playlist modal
        const playlistModal = document.getElementById('playlist-modal');
        document.getElementById('modal-title').textContent = 'Create Playlist';
        const playlistNameInput = document.getElementById('playlist-name');
        playlistNameInput.value = '';
        playlistModal.classList.add('show');
        
        // Store the song ID to add after playlist creation
        playlistModal.dataset.songToAdd = songId;
    });
    
    // Show modal
    addToPlaylistModal.classList.add('show');
    
    // Handle close modal clicks
    const closeModalButtons = addToPlaylistModal.querySelectorAll('.close-modal');
    closeModalButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            addToPlaylistModal.classList.remove('show');
        });
    });
}

// Add song to playlist
function addSongToPlaylist(songId, playlistId) {
    const playlistIndex = playlists.findIndex(p => p.id === playlistId);
    if (playlistIndex === -1) return;
    
    // Check if song is already in the playlist
    if (playlists[playlistIndex].songs.includes(songId)) {
        alert('Song is already in this playlist');
        return;
    }
    
    playlists[playlistIndex].songs.push(songId);
    savePlaylists();
    
    // Find song name for better feedback
    const song = songs.find(s => s.id === songId);
    const songName = song ? song.title : 'Song';
    const playlistName = playlists[playlistIndex].name;
    
    // Show notification
    showNotification(`${songName} added to ${playlistName}`);
}

// Show notification
function showNotification(message) {
    const toast = document.getElementById('notification-toast');
    const messageEl = document.getElementById('notification-message');
    
    if (!toast || !messageEl) return;
    
    // Set message text
    messageEl.textContent = message;
    
    // Show notification
    toast.classList.add('show');
    
    // Hide after 3 seconds
    clearTimeout(window.notificationTimeout);
    window.notificationTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Delete a song
function deleteSong(songId) {
    // Find the song to get its name
    const song = songs.find(song => song.id === songId);
    if (!song) return;
    
    const songName = song.title;
    
    // Ask for confirmation
    if (confirm(`Are you sure you want to delete "${songName}"?`)) {
        // Check if this is the current playing song
        const isCurrentSong = currentAudio.src && currentAudio.src.includes(songId);
        
        // Remove from songs array
        songs = songs.filter(song => song.id !== songId);
        saveSongs();
        
        // Remove from all playlists
        playlists.forEach(playlist => {
            playlist.songs = playlist.songs.filter(id => id !== songId);
        });
        savePlaylists();
        
        // Show notification
        showNotification(`${songName} has been deleted`);
        
        // Re-render UI
        renderSongs();
        renderPlaylists();
        
        // If the current song was deleted
        if (isCurrentSong) {
            if (songs.length > 0) {
                // Play the next song if available
                if (currentSongId >= songs.length) {
                    currentSongId = 0;
                }
                loadSong(songs[currentSongId]);
                if (isPlaying) {
                    playSong();
                }
            } else {
                // No songs left, reset the player
                resetPlayer();
            }
        }
    }
}

// Reset player to default state
function resetPlayer() {
    // Stop audio
    currentAudio.pause();
    currentAudio.src = '';
    isPlaying = false;
    
    // Reset UI elements
    document.querySelector('.track-name').textContent = 'Select a song';
    document.querySelector('.artist-name').textContent = 'Artist';
    document.querySelector('.card-track-name').textContent = 'Song Name';
    document.querySelector('.card-artist-name').textContent = 'Artist Name · Album Name';
    
    // Reset buttons
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    cardPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    
    // Reset progress displays
    resetProgress();
    totalTimeEl.textContent = '0:00';
    cardTotalTimeEl.textContent = '0:00';
    
    // Remove active song styling
    const albumPreview = document.getElementById('show-player-card');
    if (albumPreview) {
        albumPreview.classList.remove('active-song');
    }
    
    // Reset player card styling
    const playerCard = document.getElementById('player-card');
    if (playerCard) {
        playerCard.classList.remove('has-song');
        // Hide player card if it was showing
        playerCard.classList.remove('show');
    }
    
    // Clear last played song
    localStorage.removeItem('sonata-last-song');
}

// Load a song
function loadSong(song) {
    if (!song) {
        resetPlayer();
        return;
    }
    
    // Set current song ID
    currentSongId = song.id;
    
    // Update audio source
    currentAudio.src = song.src;
    
    // Update now playing info in left bar
    const trackNameEl = document.querySelector('.track-name');
    const artistNameEl = document.querySelector('.artist-name');
    
    if (trackNameEl) trackNameEl.textContent = song.title;
    if (artistNameEl) artistNameEl.textContent = song.artist || 'Unknown Artist';
    
    // Update card info
    const cardTrackNameEl = document.querySelector('.card-track-name');
    const cardArtistNameEl = document.querySelector('.card-artist-name');
    
    if (cardTrackNameEl) cardTrackNameEl.textContent = song.title;
    if (cardArtistNameEl) cardArtistNameEl.textContent = `${song.artist || 'Unknown Artist'} · ${song.album || 'Unknown Album'}`;
    
    // Reset progress
    resetProgress();
    
    // Set total time if duration is already available
    if (song.duration) {
        totalTimeEl.textContent = formatTime(song.duration);
        cardTotalTimeEl.textContent = formatTime(song.duration);
    } else {
        // Otherwise it will be set by the loadedmetadata event
        totalTimeEl.textContent = '0:00';
        cardTotalTimeEl.textContent = '0:00';
    }
    
    // Save last played song
    localStorage.setItem('sonata-last-song', song.id);
    
    // Update track display in the album preview (now playing bar)
    const albumPreview = document.getElementById('show-player-card');
    if (albumPreview) {
        albumPreview.classList.add('active-song');
    }
    
    // Update player card
    const playerCard = document.getElementById('player-card');
    if (playerCard) {
        playerCard.classList.add('has-song');
    }
    
    // Update song list - highlight active song
    document.querySelectorAll('.song-item').forEach(item => {
        item.classList.remove('active-song');
        if (item.dataset.songId === song.id) {
            item.classList.add('active-song');
        }
    });
}

// Play song
function playSong() {
    currentAudio.play().catch(error => {
        console.error('Playback failed:', error);
    });
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    cardPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

// Pause song
function pauseSong() {
    currentAudio.pause();
    isPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    cardPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
}

// Toggle play/pause
function togglePlay() {
    if (!currentAudio.src) {
        // No song loaded, load the first song if available
        if (songs.length > 0) {
            loadSong(songs[0]);
        } else {
            return; // No songs available
        }
    }

    if (isPlaying) {
        currentAudio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        cardPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        currentAudio.play().catch(error => {
            console.error('Playback failed:', error);
        });
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        cardPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    
    isPlaying = !isPlaying;
}

// Play previous song
function playPrev() {
    if (songs.length === 0) return;
    
    // If the current playback time is more than 3 seconds, restart the current song
    if (currentAudio.currentTime > 3) {
        currentAudio.currentTime = 0;
        return;
    }
    
    const currentIndex = currentSongId ? songs.findIndex(song => song.id === currentSongId) : -1;
    let prevIndex = songs.length - 1; // Default to last song
    
    if (currentIndex !== -1 && currentIndex > 0) {
        prevIndex = currentIndex - 1;
    }
    
    loadSong(songs[prevIndex]);
    
    // Auto-play the previous song
    if (isPlaying) {
        currentAudio.play().catch(error => {
            console.error('Playback failed:', error);
        });
    }
}

// Play next song
function playNext() {
    if (songs.length === 0) return;
    
    const currentIndex = currentSongId ? songs.findIndex(song => song.id === currentSongId) : -1;
    let nextIndex = 0;
    
    if (currentIndex !== -1 && currentIndex < songs.length - 1) {
        nextIndex = currentIndex + 1;
    }
    
    loadSong(songs[nextIndex]);
    
    // Auto-play the next song
    if (isPlaying) {
        currentAudio.play().catch(error => {
            console.error('Playback failed:', error);
        });
    }
}

// Toggle shuffle mode
function toggleShuffle() {
    shuffleMode = !shuffleMode;
    shuffleBtn.classList.toggle('active', shuffleMode);
    
    if (shuffleMode) {
        shuffleBtn.style.color = 'var(--primary-color)';
    } else {
        shuffleBtn.style.color = '';
    }
}

// Toggle repeat mode
function toggleRepeat() {
    repeatMode = !repeatMode;
    repeatBtn.classList.toggle('active', repeatMode);
    cardRepeatBtn.classList.toggle('active', repeatMode);
    
    if (repeatMode) {
        repeatBtn.style.color = 'var(--primary-color)';
        cardRepeatBtn.style.color = '#fff';
    } else {
        repeatBtn.style.color = '';
        cardRepeatBtn.style.color = '';
    }
}

// Toggle mute
function toggleMute() {
    const volumeBtn = document.getElementById('volume-btn');
    
    if (isMuted) {
        // Unmute
        currentAudio.volume = previousVolume;
        currentVolume = previousVolume;
        isMuted = false;
        if (volumeBtn) {
            volumeBtn.innerHTML = getVolumeIcon(currentVolume);
        }
    } else {
        // Mute
        previousVolume = currentVolume;
        currentAudio.volume = 0;
        currentVolume = 0;
        isMuted = true;
        if (volumeBtn) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    }
    
    updateVolumeUI();
    
    // Show animation
    const volumeAnimation = document.createElement('div');
    volumeAnimation.className = 'volume-animation';
    volumeAnimation.innerHTML = isMuted ? 
        '<i class="fas fa-volume-mute"></i>' : 
        getVolumeIcon(currentVolume);
    document.body.appendChild(volumeAnimation);
    
    setTimeout(() => {
        volumeAnimation.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(volumeAnimation);
        }, 300);
    }, 800);
}

// Change volume from slider click
function changeVolume(e) {
    e.preventDefault();
    
    const volumeBar = document.querySelector('.volume-slider');
    const rect = volumeBar.getBoundingClientRect();
    
    // Get click position
    const x = e.type.includes('touch') ? 
        e.touches[0].clientX - rect.left : 
        e.clientX - rect.left;
    
    // Calculate volume (0 to 1)
    let volume = x / rect.width;
    
    // Ensure it's between 0 and 1
    volume = Math.max(0, Math.min(1, volume));
    
    // Update volume
    setVolume(volume);
}

// Handle volume touch events
function handleVolumeTouch(e) {
    e.preventDefault();
    
    const volumeBar = document.querySelector('.volume-slider');
    const rect = volumeBar.getBoundingClientRect();
    
    // Get touch position
    const x = e.touches[0].clientX - rect.left;
    
    // Calculate volume (0 to 1)
    let volume = x / rect.width;
    
    // Ensure it's between 0 and 1
    volume = Math.max(0, Math.min(1, volume));
    
    // Update volume
    setVolume(volume);
}

// Increase volume
function increaseVolume() {
    let newVolume = Math.min(1, currentVolume + 0.05);
    setVolume(newVolume);
}

// Decrease volume
function decreaseVolume() {
    let newVolume = Math.max(0, currentVolume - 0.05);
    setVolume(newVolume);
}

// Set volume and update UI
function setVolume(volume) {
    currentVolume = volume;
    currentAudio.volume = volume;
    isMuted = volume === 0;
    
    updateVolumeUI();
    
    // Show volume animation
    showVolumeIndicator();
}

// Update volume UI elements
function updateVolumeUI() {
    // Update volume progress bar
    const volumeProgress = document.querySelector('.volume-progress');
    if (volumeProgress) {
        volumeProgress.style.width = `${currentVolume * 100}%`;
    }
    
    // Update volume button icon
    const volumeBtn = document.getElementById('volume-btn');
    if (volumeBtn) {
        volumeBtn.innerHTML = getVolumeIcon(currentVolume);
    }
}

// Get appropriate volume icon based on level
function getVolumeIcon(volume) {
    if (volume === 0) {
        return '<i class="fas fa-volume-mute"></i>';
    } else if (volume < 0.3) {
        return '<i class="fas fa-volume-off"></i>';
    } else if (volume < 0.7) {
        return '<i class="fas fa-volume-down"></i>';
    } else {
        return '<i class="fas fa-volume-up"></i>';
    }
}

// Show temporary volume indicator
function showVolumeIndicator() {
    // Create or get existing volume indicator
    let volumeIndicator = document.querySelector('.volume-indicator');
    
    if (!volumeIndicator) {
        volumeIndicator = document.createElement('div');
        volumeIndicator.className = 'volume-indicator';
        
        const volumeLevel = document.createElement('div');
        volumeLevel.className = 'volume-level';
        
        const volumeIcon = document.createElement('div');
        volumeIcon.className = 'volume-icon';
        
        volumeIndicator.appendChild(volumeLevel);
        volumeIndicator.appendChild(volumeIcon);
        document.body.appendChild(volumeIndicator);
    }
    
    // Update volume indicator
    const volumeLevel = volumeIndicator.querySelector('.volume-level');
    volumeLevel.style.width = `${currentVolume * 100}%`;
    
    const volumeIcon = volumeIndicator.querySelector('.volume-icon');
    volumeIcon.innerHTML = getVolumeIcon(currentVolume);
    
    // Show indicator
    volumeIndicator.classList.add('show');
    
    // Hide after delay
    clearTimeout(window.volumeTimeout);
    window.volumeTimeout = setTimeout(() => {
        volumeIndicator.classList.remove('show');
    }, 1500);
}

// Adjust volume with click or drag (mouse and touch support)
function adjustVolume(e) {
    // Prevent default behavior
    e.preventDefault();
    
    const updateVolumeFromEvent = (event) => {
        // Get coordinates based on event type
        const clientX = event.type.includes('touch') 
            ? event.touches[0].clientX 
            : event.clientX;
            
        const rect = volumeSlider.getBoundingClientRect();
        const sliderWidth = rect.width;
        
        // Calculate position relative to the slider
        let clickPosition = clientX - rect.left;
        
        // Constrain to slider bounds
        clickPosition = Math.max(0, Math.min(sliderWidth, clickPosition));
        
        // Calculate volume (0 to 1)
        const volume = clickPosition / sliderWidth;
        
        // Update UI and save
        updateVolumeUI(volume);
    };
    
    // Handle initial interaction
    updateVolumeFromEvent(e);
    
    // Mouse events
    const handleMouseMove = (moveEvent) => {
        moveEvent.preventDefault();
        updateVolumeFromEvent(moveEvent);
    };
    
    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };
    
    // Touch events
    const handleTouchMove = (moveEvent) => {
        moveEvent.preventDefault();
        updateVolumeFromEvent(moveEvent);
    };
    
    const handleTouchEnd = () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        document.removeEventListener('touchcancel', handleTouchEnd);
    };
    
    // Add appropriate listeners based on event type
    if (e.type === 'mousedown' || e.type === 'click') {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    } else if (e.type === 'touchstart') {
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
        document.addEventListener('touchcancel', handleTouchEnd);
    }
}

// Seek in the audio
function seek(e) {
    const width = progressBar.clientWidth;
    const clickPosition = e.offsetX;
    const seekTime = (clickPosition / width) * currentAudio.duration;
    
    currentAudio.currentTime = seekTime;
}

// Seek in the card player
function seekCard(e) {
    const width = cardProgressBar.clientWidth;
    const clickPosition = e.offsetX;
    const seekTime = (clickPosition / width) * currentAudio.duration;
    
    // Update progress slider position
    if (progressSlider) {
        const progressPercent = (clickPosition / width) * 100;
        progressSlider.style.left = `${progressPercent}%`;
    }
    
    currentAudio.currentTime = seekTime;
}

// Update progress bar
function updateProgress() {
    if (!currentAudio.duration) return; // Prevent NaN issues
    
    const currentTime = currentAudio.currentTime;
    const duration = currentAudio.duration;
    const progressPercent = (currentTime / duration) * 100;
    
    // Update progress bar width
    progress.style.width = `${progressPercent}%`;
    cardProgressFill.style.width = `${progressPercent}%`;
    
    // Update slider position
    if (progressSlider) {
        progressSlider.style.left = `${progressPercent}%`;
    }
    
    // Update time displays
    currentTimeEl.textContent = formatTime(currentTime);
    cardCurrentTimeEl.textContent = formatTime(currentTime);
}

// Handle song end
function handleSongEnd() {
    // Automatically play next song if available
    playNext();
}

// Format time in MM:SS
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Handle context menu for songs
function showContextMenu(songId, event) {
    event.preventDefault();
    
    // Remove any existing context menu
    const existingMenu = document.querySelector('.context-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    // Create context menu
    const contextMenu = document.createElement('div');
    contextMenu.className = 'context-menu';
    
    // Menu position
    contextMenu.style.top = `${event.clientY}px`;
    contextMenu.style.left = `${event.clientX}px`;
    
    // Menu options
    const menuOptions = [
        { text: 'Play', icon: 'fa-play', action: () => playSongById(songId) },
        { text: 'Add to Playlist', icon: 'fa-list', action: () => showAddToPlaylistModal(songId) },
        { text: 'Download', icon: 'fa-download', action: () => downloadSong(songId) },
        { text: 'Delete', icon: 'fa-trash', action: () => deleteSong(songId) }
    ];
    
    // Create menu items
    menuOptions.forEach(option => {
        const menuItem = document.createElement('div');
        menuItem.className = 'context-menu-item';
        menuItem.innerHTML = `<i class="fas ${option.icon}"></i> ${option.text}`;
        menuItem.addEventListener('click', () => {
            option.action();
            contextMenu.remove();
        });
        contextMenu.appendChild(menuItem);
    });
    
    // Add to DOM
    document.body.appendChild(contextMenu);
    
    // Close menu when clicking outside
    const closeMenu = (e) => {
        if (!contextMenu.contains(e.target)) {
            contextMenu.remove();
            document.removeEventListener('click', closeMenu);
        }
    };
    
    // Add event listener after a small timeout to prevent immediate closure
    setTimeout(() => {
        document.addEventListener('click', closeMenu);
    }, 100);
}

// Setup direct page navigation click handlers
function setupDirectNavigation() {
    // Get navigation items
    const homeLink = document.querySelector('.navigation li[data-page="home"]');
    const playlistsLink = document.querySelector('.navigation li[data-page="playlists"]');
    const offlineLink = document.querySelector('.navigation li[data-page="offline"]');
    const settingsLink = document.querySelector('.navigation li[data-page="settings"]');
    
    // Get pages
    const homePage = document.getElementById('home');
    const playlistsPage = document.getElementById('playlists');
    const offlinePage = document.getElementById('offline');
    const settingsPage = document.getElementById('settings');
    
    // Add click handlers
    if (homeLink) {
        homeLink.onclick = function() {
            // Hide all pages
            homePage.style.display = 'block';
            playlistsPage.style.display = 'none';
            offlinePage.style.display = 'none';
            settingsPage.style.display = 'none';
            
            // Update active class
            homeLink.classList.add('active');
            playlistsLink.classList.remove('active');
            offlineLink.classList.remove('active');
            settingsLink.classList.remove('active');
            
            return false;
        };
    }
    
    if (playlistsLink) {
        playlistsLink.onclick = function() {
            // Hide all pages
            homePage.style.display = 'none';
            playlistsPage.style.display = 'block';
            offlinePage.style.display = 'none';
            settingsPage.style.display = 'none';
            
            // Update active class
            homeLink.classList.remove('active');
            playlistsLink.classList.add('active');
            offlineLink.classList.remove('active');
            settingsLink.classList.remove('active');
            
            return false;
        };
    }
    
    if (offlineLink) {
        offlineLink.onclick = function() {
            // Hide all pages
            homePage.style.display = 'none';
            playlistsPage.style.display = 'none';
            offlinePage.style.display = 'block';
            settingsPage.style.display = 'none';
            
            // Update active class
            homeLink.classList.remove('active');
            playlistsLink.classList.remove('active');
            offlineLink.classList.add('active');
            settingsLink.classList.remove('active');
            
            return false;
        };
    }
    
    if (settingsLink) {
        settingsLink.onclick = function() {
            // Hide all pages
            homePage.style.display = 'none';
            playlistsPage.style.display = 'none';
            offlinePage.style.display = 'none';
            settingsPage.style.display = 'block';
            
            // Update active class
            homeLink.classList.remove('active');
            playlistsLink.classList.remove('active');
            offlineLink.classList.remove('active');
            settingsLink.classList.add('active');
            
            return false;
        };
    }
}

// Show active page on load
function showActivePage() {
    // Find the active navigation item
    const activeNavItem = document.querySelector('.navigation li.active');
    if (activeNavItem) {
        const targetPage = activeNavItem.getAttribute('data-page');
        
        // Hide all pages first
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show the target page
        const pageToShow = document.getElementById(targetPage);
        if (pageToShow) {
            pageToShow.classList.add('active');
        }
    }
}

// Theme functionality
function setupThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeToggleCheckbox = document.getElementById('theme-toggle-checkbox');
    
    // Load saved theme from local storage
    const savedTheme = localStorage.getItem('sonata-theme');
    
    // Initialize theme based on saved preference
    if (savedTheme === 'dark') {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
        if (themeToggleCheckbox) {
            themeToggleCheckbox.checked = true;
        }
    } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
        if (themeToggleCheckbox) {
            themeToggleCheckbox.checked = false;
        }
    }
    
    // Add click event to theme toggle button in sidebar
    if (themeBtn) {
        themeBtn.addEventListener('click', function() {
            toggleTheme();
        });
    }
    
    // Add change event to theme toggle checkbox in settings
    if (themeToggleCheckbox) {
        themeToggleCheckbox.addEventListener('change', function() {
            toggleTheme(this.checked);
        });
    }
}

// Toggle theme function
function toggleTheme(forceDark) {
    const isDark = typeof forceDark !== 'undefined' ? forceDark : !document.body.classList.contains('dark-mode');
    const themeIcon = document.getElementById('theme-icon');
    const themeToggleCheckbox = document.getElementById('theme-toggle-checkbox');
    
    if (isDark) {
        // Switch to dark mode
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
        localStorage.setItem('sonata-theme', 'dark');
        
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
        
        if (themeToggleCheckbox) {
            themeToggleCheckbox.checked = true;
        }
    } else {
        // Switch to light mode
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
        localStorage.setItem('sonata-theme', 'light');
        
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
        
        if (themeToggleCheckbox) {
            themeToggleCheckbox.checked = false;
        }
    }
}

// Function to reset progress without depending on song duration
function resetProgress() {
    // Reset current time to 0
    if (currentAudio) {
        currentAudio.currentTime = 0;
    }
    
    // Reset progress bar and displays
    progress.style.width = '0%';
    cardProgressFill.style.width = '0%';
    if (progressSlider) {
        progressSlider.style.left = '0%';
    }
    currentTimeEl.textContent = '0:00';
    cardCurrentTimeEl.textContent = '0:00';
}

// Set progress when progress bar is clicked
function setProgress(e) {
    const progressBar = this;
    const width = progressBar.clientWidth;
    const clickX = e.offsetX;
    const duration = currentAudio.duration;
    
    if (isNaN(duration)) return;
    
    // Calculate and set the new time
    currentAudio.currentTime = (clickX / width) * duration;
    
    // Update progress immediately
    updateProgress();
}

// Initialize progress bar click handlers
document.querySelectorAll('.progress-bar').forEach(bar => {
    bar.addEventListener('click', setProgress);
});

// Card progress bar click handler
document.querySelector('.card-progress-bar').addEventListener('click', function(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = currentAudio.duration;
    
    if (isNaN(duration)) return;
    
    // Calculate and set the new time
    currentAudio.currentTime = (clickX / width) * duration;
    
    // Update progress immediately
    updateProgress();
});

// Handle responsive behavior
function handleResponsiveLayout() {
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    
    // Adjust player card size on small screens
    const playerCard = document.getElementById('player-card');
    if (playerCard) {
        if (isSmallMobile) {
            playerCard.style.maxHeight = '90vh';
            playerCard.style.overflowY = 'auto';
        } else {
            playerCard.style.maxHeight = '';
            playerCard.style.overflowY = '';
        }
    }
    
    // Hide sidebar footer on small screens in landscape mode
    const sidebarFooter = document.querySelector('.sidebar-footer');
    if (sidebarFooter) {
        if (window.innerHeight <= 480 && window.innerWidth > window.innerHeight) {
            sidebarFooter.style.display = 'none';
        } else {
            sidebarFooter.style.display = '';
        }
    }
}

// Initialize responsive behavior
window.addEventListener('load', handleResponsiveLayout);
window.addEventListener('resize', handleResponsiveLayout);

// Add touch event handling
function setupTouchEvents() {
    // Progress bar touch handling
    const progressBars = document.querySelectorAll('.progress-bar, .card-progress-bar');
    
    progressBars.forEach(bar => {
        bar.addEventListener('touchstart', function(e) {
            // Prevent scrolling while touching the progress bar
            e.preventDefault();
            
            const width = this.clientWidth;
            const rect = this.getBoundingClientRect();
            const touchX = e.touches[0].clientX - rect.left;
            const duration = currentAudio.duration;
            
            if (isNaN(duration)) return;
            
            // Calculate and set the new time
            currentAudio.currentTime = (touchX / width) * duration;
            
            // Update progress immediately
            updateProgress();
        });
        
        bar.addEventListener('touchmove', function(e) {
            e.preventDefault();
            
            const width = this.clientWidth;
            const rect = this.getBoundingClientRect();
            const touchX = e.touches[0].clientX - rect.left;
            const duration = currentAudio.duration;
            
            if (isNaN(duration)) return;
            
            // Ensure the touch position is within the bounds of the progress bar
            const boundedX = Math.max(0, Math.min(touchX, width));
            
            // Calculate and set the new time
            currentAudio.currentTime = (boundedX / width) * duration;
            
            // Update progress immediately
            updateProgress();
        });
    });
    
    // Make player controls larger on touch devices
    if ('ontouchstart' in window) {
        document.documentElement.classList.add('touch-device');
    }
}

// Initialize touch events
document.addEventListener('DOMContentLoaded', setupTouchEvents);

// Initialize volume controls
function initVolumeControls() {
    // Initialize volume controls
    let volumeBar = document.querySelector('.volume-slider');
    let volumeBtn = document.getElementById('volume-btn');
    let volumeSlider = document.querySelector('.volume-slider');
    let volumeProgress = document.querySelector('.volume-progress');
    
    // Initialize volume tooltip
    let volumePercent = Math.round(currentAudio.volume * 100);
    volumeSlider.setAttribute('data-volume', `${volumePercent}%`);
    
    // Update volume button icon
    if (volumeBtn) {
        volumeBtn.innerHTML = getVolumeIcon(currentAudio.volume);
    }
    
    // Update volume progress bar
    if (volumeProgress) {
        volumeProgress.style.width = `${currentAudio.volume * 100}%`;
    }
}

// Playlist Management Functions
function createPlaylist(name) {
    const id = 'playlist_' + Date.now();
    const playlist = {
        id: id,
        name: name,
        songs: []
    };
    
    playlists.push(playlist);
    savePlaylists();
    renderPlaylists();
    
    // Show notification
    showNotification(`Playlist "${name}" created successfully!`);
    
    return playlist;
}

function deletePlaylist(playlistId) {
    const index = playlists.findIndex(p => p.id === playlistId);
    
    if (index !== -1) {
        const playlistName = playlists[index].name;
        playlists.splice(index, 1);
        savePlaylists();
        renderPlaylists();
        
        // If we're viewing the deleted playlist, return to playlists view
        if (currentPlaylistId === playlistId) {
            currentPlaylistId = null;
            showPlaylistsPage();
        }
        
        // Show notification
        showNotification(`Playlist "${playlistName}" deleted successfully`);
    }
}

function addSongToPlaylist(songId, playlistId) {
    const playlist = playlists.find(p => p.id === playlistId);
    const song = songs.find(s => s.id === songId);
    
    if (playlist && song) {
        // Check if song is already in playlist
        if (!playlist.songs.includes(songId)) {
            playlist.songs.push(songId);
            savePlaylists();
            
            // If we're viewing this playlist, refresh the view
            if (currentPlaylistId === playlistId) {
                displayPlaylistSongs(playlistId);
            }
            
            // Show notification
            showNotification(`Added "${song.title}" to "${playlist.name}"`);
        } else {
            showNotification(`Song is already in this playlist`);
        }
    }
}

function removeSongFromPlaylist(songId, playlistId) {
    const playlist = playlists.find(p => p.id === playlistId);
    const song = songs.find(s => s.id === songId);
    
    if (playlist && song) {
        const index = playlist.songs.indexOf(songId);
        
        if (index !== -1) {
            playlist.songs.splice(index, 1);
            savePlaylists();
            
            // If we're viewing this playlist, refresh the view
            if (currentPlaylistId === playlistId) {
                displayPlaylistSongs(playlistId);
            }
            
            // Show notification
            showNotification(`Removed "${song.title}" from "${playlist.name}"`);
        }
    }
}

function showPlaylistsPage() {
    // Hide any active playlist view
    const playlistContentEl = document.getElementById('playlist-content');
    if (playlistContentEl) {
        playlistContentEl.style.display = 'none';
    }
    
    // Show playlists overview
    const playlistsContainerEl = document.querySelector('.playlists-container');
    if (playlistsContainerEl) {
        playlistsContainerEl.style.display = 'block';
    }
    
    // Update playlist header
    const playlistsHeader = document.querySelector('#playlists h2');
    if (playlistsHeader) {
        playlistsHeader.textContent = 'Playlists';
    }
    
    // Reset current playlist
    currentPlaylistId = null;
}

function showPlaylist(playlistId) {
    const playlist = playlists.find(p => p.id === playlistId);
    
    if (playlist) {
        currentPlaylistId = playlistId;
        
        // Hide playlists overview
        const playlistsContainerEl = document.querySelector('.playlists-container');
        if (playlistsContainerEl) {
            playlistsContainerEl.style.display = 'none';
        }
        
        // Update playlist header with back button
        const playlistsHeader = document.querySelector('#playlists h2');
        if (playlistsHeader) {
            playlistsHeader.innerHTML = `<i class="fas fa-arrow-left back-to-playlists"></i> ${playlist.name}`;
            
            // Add event listener to back button
            const backBtn = document.querySelector('.back-to-playlists');
            if (backBtn) {
                backBtn.addEventListener('click', showPlaylistsPage);
            }
        }
        
        // Show playlist content
        let playlistContentEl = document.getElementById('playlist-content');
        
        // Create playlist content container if it doesn't exist
        if (!playlistContentEl) {
            playlistContentEl = document.createElement('div');
            playlistContentEl.id = 'playlist-content';
            document.getElementById('playlists').appendChild(playlistContentEl);
        }
        
        playlistContentEl.style.display = 'block';
        
        // Display playlist songs
        displayPlaylistSongs(playlistId);
    }
}

function displayPlaylistSongs(playlistId) {
    const playlist = playlists.find(p => p.id === playlistId);
    const playlistContentEl = document.getElementById('playlist-content');
    
    if (playlist && playlistContentEl) {
        // Clear current content
        playlistContentEl.innerHTML = '';
        
        // Playlist info and action buttons
        const playlistHeader = document.createElement('div');
        playlistHeader.className = 'playlist-header';
        
        const playlistInfo = document.createElement('div');
        playlistInfo.className = 'playlist-info';
        playlistInfo.innerHTML = `
            <div class="playlist-icon">
                <i class="fas fa-music"></i>
            </div>
            <div class="playlist-details">
                <div class="playlist-name">${playlist.name}</div>
                <div class="playlist-song-count">${playlist.songs.length} song${playlist.songs.length !== 1 ? 's' : ''}</div>
            </div>
        `;
        
        const playlistActions = document.createElement('div');
        playlistActions.className = 'playlist-actions';
        
        const playAllBtn = document.createElement('button');
        playAllBtn.className = 'playlist-action-btn';
        playAllBtn.innerHTML = '<i class="fas fa-play"></i> Play All';
        playAllBtn.addEventListener('click', () => playPlaylist(playlist.id));
        
        const deletePlaylistBtn = document.createElement('button');
        deletePlaylistBtn.className = 'playlist-action-btn delete-btn';
        deletePlaylistBtn.innerHTML = '<i class="fas fa-trash"></i> Delete Playlist';
        deletePlaylistBtn.addEventListener('click', () => {
            if (confirm(`Are you sure you want to delete "${playlist.name}"?`)) {
                deletePlaylist(playlist.id);
            }
        });
        
        playlistActions.appendChild(playAllBtn);
        playlistActions.appendChild(deletePlaylistBtn);
        
        playlistHeader.appendChild(playlistInfo);
        playlistHeader.appendChild(playlistActions);
        
        playlistContentEl.appendChild(playlistHeader);
        
        // Create songs list
        const songsList = document.createElement('div');
        songsList.className = 'songs-list';
        
        if (playlist.songs.length === 0) {
            // Empty playlist message
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-playlist-message';
            emptyMessage.innerHTML = `
                <i class="fas fa-music"></i>
                <p>This playlist is empty. Add some songs!</p>
            `;
            songsList.appendChild(emptyMessage);
        } else {
            // Create list of songs
            playlist.songs.forEach(songId => {
                const song = songs.find(s => s.id === songId);
                if (song) {
                    const songItem = document.createElement('div');
                    songItem.className = 'song-list-item';
                    songItem.dataset.songId = song.id;
                    
                    songItem.innerHTML = `
                        <div class="song-info">
                            <div class="song-title">${song.title}</div>
                            <div class="song-artist">${song.artist || 'Unknown Artist'}</div>
                        </div>
                        <div class="song-duration">${formatTime(song.duration || 0)}</div>
                        <div class="song-actions">
                            <button class="play-song" title="Play"><i class="fas fa-play"></i></button>
                            <button class="remove-from-playlist" title="Remove from playlist"><i class="fas fa-times"></i></button>
                        </div>
                    `;
                    
                    // Add event listeners
                    songItem.querySelector('.play-song').addEventListener('click', (e) => {
                        e.stopPropagation();
                        loadSong(song);
                        playSong();
                    });
                    
                    songItem.querySelector('.remove-from-playlist').addEventListener('click', (e) => {
                        e.stopPropagation();
                        removeSongFromPlaylist(song.id, playlist.id);
                    });
                    
                    songItem.addEventListener('click', () => {
                        loadSong(song);
                        playSong();
                    });
                    
                    songsList.appendChild(songItem);
                }
            });
        }
        
        playlistContentEl.appendChild(songsList);
    }
}

// Play all songs in a playlist
function playPlaylist(playlistId) {
    const playlist = playlists.find(p => p.id === playlistId);
    
    if (playlist && playlist.songs.length > 0) {
        // Get the first song
        const firstSongId = playlist.songs[0];
        const firstSong = songs.find(s => s.id === firstSongId);
        
        if (firstSong) {
            // Load and play the first song
            loadSong(firstSong);
            playSong();
            
            // Show notification
            showNotification(`Playing playlist: ${playlist.name}`);
        }
    } else {
        showNotification('This playlist is empty');
    }
}

// Show modal for creating a new playlist
function showCreatePlaylistModal() {
    const modal = document.getElementById('playlist-modal');
    const modalTitle = document.getElementById('modal-title');
    const playlistNameInput = document.getElementById('playlist-name');
    const saveBtn = document.getElementById('save-playlist-btn');
    
    // Reset and prepare modal
    modalTitle.textContent = 'Create Playlist';
    playlistNameInput.value = '';
    
    // Show modal
    modal.style.display = 'block';
    playlistNameInput.focus();
    
    // Remove any existing event listeners
    const newSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
    
    // Add event listener for save button
    newSaveBtn.addEventListener('click', () => {
        const playlistName = playlistNameInput.value.trim();
        
        if (playlistName) {
            createPlaylist(playlistName);
            modal.style.display = 'none';
        } else {
            alert('Please enter a playlist name');
        }
    });
}

// Show modal for adding a song to a playlist
function showAddToPlaylistModal(songId) {
    const modal = document.getElementById('add-to-playlist-modal');
    const playlistsList = document.querySelector('.playlists-list');
    const createNewPlaylistBtn = document.getElementById('create-new-playlist-btn');
    
    // Clear existing playlists
    playlistsList.innerHTML = '';
    
    // Add each playlist to the list
    playlists.forEach(playlist => {
        const playlistItem = document.createElement('div');
        playlistItem.className = 'playlist-item';
        playlistItem.textContent = playlist.name;
        
        // Check if song is already in this playlist
        const isSongInPlaylist = playlist.songs.includes(songId);
        
        if (isSongInPlaylist) {
            playlistItem.classList.add('already-added');
            playlistItem.innerHTML += ' <span class="already-added-text">(Already added)</span>';
        } else {
            playlistItem.addEventListener('click', () => {
                addSongToPlaylist(songId, playlist.id);
                modal.style.display = 'none';
            });
        }
        
        playlistsList.appendChild(playlistItem);
    });
    
    // If no playlists exist yet
    if (playlists.length === 0) {
        const noPlaylistsMsg = document.createElement('div');
        noPlaylistsMsg.className = 'no-playlists-message';
        noPlaylistsMsg.textContent = 'No playlists yet. Create one!';
        playlistsList.appendChild(noPlaylistsMsg);
    }
    
    // Add event listener for create new playlist button
    const newCreateBtn = createNewPlaylistBtn.cloneNode(true);
    createNewPlaylistBtn.parentNode.replaceChild(newCreateBtn, createNewPlaylistBtn);
    
    newCreateBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        
        // Show create playlist modal
        showCreatePlaylistModal();
        
        // Store the song ID to add after creating the playlist
        localStorage.setItem('sonata-pending-song-add', songId);
    });
    
    // Show the modal
    modal.style.display = 'block';
}

// Initialize playlists from localStorage
function loadSavedPlaylists() {
    const savedPlaylists = localStorage.getItem('sonata-playlists');
    
    if (savedPlaylists) {
        try {
            playlists = JSON.parse(savedPlaylists);
        } catch (error) {
            console.error('Error loading playlists:', error);
            playlists = [];
        }
    }
}

// Save playlists to localStorage
function savePlaylists() {
    localStorage.setItem('sonata-playlists', JSON.stringify(playlists));
}

// Render playlists in the UI
function renderPlaylists() {
    const playlistsContainer = document.querySelector('.playlists-container');
    
    if (playlistsContainer) {
        // Clear existing playlists
        playlistsContainer.innerHTML = '';
        
        // Add each playlist
        playlists.forEach(playlist => {
            const playlistElement = document.createElement('div');
            playlistElement.className = 'playlist-card';
            playlistElement.dataset.playlistId = playlist.id;
            
            // Count songs in playlist
            const songCount = playlist.songs.length;
            
            playlistElement.innerHTML = `
                <div class="playlist-card-icon">
                    <i class="fas fa-music"></i>
                </div>
                <div class="playlist-card-info">
                    <div class="playlist-card-name">${playlist.name}</div>
                    <div class="playlist-card-count">${songCount} song${songCount !== 1 ? 's' : ''}</div>
                </div>
            `;
            
            // Add click event to open playlist
            playlistElement.addEventListener('click', () => {
                showPlaylist(playlist.id);
            });
            
            playlistsContainer.appendChild(playlistElement);
        });
        
        // If no playlists, show message
        if (playlists.length === 0) {
            const noPlaylistsMsg = document.createElement('div');
            noPlaylistsMsg.className = 'no-playlists-message';
            noPlaylistsMsg.innerHTML = `
                <i class="fas fa-music"></i>
                <p>No playlists yet. Create one to get started!</p>
            `;
            playlistsContainer.appendChild(noPlaylistsMsg);
        }
    }
}

// Initialize playlist event listeners
function setupPlaylistEventListeners() {
    // Create playlist button
    const createPlaylistBtn = document.getElementById('create-playlist-btn');
    if (createPlaylistBtn) {
        createPlaylistBtn.addEventListener('click', showCreatePlaylistModal);
    }
    
    // Close modal buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            // Find the parent modal and hide it
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Handle click outside modal to close
    window.addEventListener('click', function(event) {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Add song to playlist context menu action
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-playlist-action')) {
            const songId = e.target.closest('.song-list-item')?.dataset.songId;
            
            if (songId) {
                showAddToPlaylistModal(songId);
            }
        }
    });
    
    // Check for pending song add after creating a playlist
    const pendingSongAdd = localStorage.getItem('sonata-pending-song-add');
    if (pendingSongAdd && playlists.length > 0) {
        // Add the song to the most recently created playlist
        const newestPlaylist = playlists[playlists.length - 1];
        addSongToPlaylist(pendingSongAdd, newestPlaylist.id);
        
        // Clear the pending add
        localStorage.removeItem('sonata-pending-song-add');
    }
}

// Play a song by its ID
function playSongById(songId) {
    const song = songs.find(s => s.id === songId);
    if (song) {
        loadSong(song);
        playSong();
    }
} 