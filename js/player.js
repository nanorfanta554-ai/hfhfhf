// ============================================
// VIBE — Audio Player Controller
// ============================================

class VibePlayer {
  constructor() {
    this.isPlaying = false;
    this.currentTrackIndex = 0;
    this.progress = 35;
    this.shuffle = false;
    this.repeat = 'off';
    this.liked = true;
    this.isPlayerOpen = false;
    this.vinylMode = false;
    this.lyricsOpen = false;
    this.visualizerBars = [];
    this.visualizerRAF = null;
    this.progressInterval = null;

    // DOM Elements (will be set in init)
    this.els = {};
  }

  init() {
    // Cache DOM elements
    this.els = {
      miniPlayer: document.getElementById('mini-player'),
      fullPlayer: document.getElementById('player-fullscreen'),
      bottomNav: document.querySelector('.bottom-nav'),
      // Mini player elements
      miniCover: document.querySelector('.mini-player-cover .cover-gradient'),
      miniTitle: document.querySelector('.mini-player-title'),
      miniArtist: document.querySelector('.mini-player-artist'),
      miniPlayBtn: document.getElementById('mini-play-btn'),
      // Full player elements
      playerBg: document.querySelector('.player-bg-image'),
      playerCover: document.querySelector('.player-cover'),
      playerCoverImg: document.querySelector('.player-cover .cover-gradient'),
      playerTitle: document.querySelector('.player-track-title'),
      playerArtist: document.querySelector('.player-track-artist'),
      playerProgressFill: document.querySelector('.player-progress-fill'),
      playerProgressBar: document.querySelector('.player-progress-bar'),
      playerCurrentTime: document.getElementById('player-current-time'),
      playerDuration: document.getElementById('player-duration'),
      playerPlayBtn: document.getElementById('player-play-btn'),
      playerShuffleBtn: document.getElementById('player-shuffle-btn'),
      playerRepeatBtn: document.getElementById('player-repeat-btn'),
      playerLikeBtn: document.getElementById('player-like-btn'),
      playerPrevBtn: document.getElementById('player-prev-btn'),
      playerNextBtn: document.getElementById('player-next-btn'),
      playerCloseBtn: document.getElementById('player-close-btn'),
      playerVinylBtn: document.getElementById('player-vinyl-btn'),
      playerLyricsBtn: document.getElementById('player-lyrics-btn'),
      playerQueueBtn: document.getElementById('player-queue-btn'),
      playerEqBtn: document.getElementById('player-eq-btn'),
      lyricsOverlay: document.getElementById('lyrics-overlay'),
      lyricsCloseBtn: document.getElementById('lyrics-close-btn'),
      visualizer: document.querySelector('.player-visualizer')
    };

    this.setupEventListeners();
    this.updateUI();
    this.initVisualizer();
  }

  setupEventListeners() {
    // Mini player → open full player
    if (this.els.miniPlayer) {
      this.els.miniPlayer.addEventListener('click', (e) => {
        if (e.target.closest('.mini-player-btn')) return;
        this.openPlayer();
      });
    }

    // Mini play/pause
    if (this.els.miniPlayBtn) {
      this.els.miniPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.togglePlay();
      });
    }

    // Close full player
    if (this.els.playerCloseBtn) {
      this.els.playerCloseBtn.addEventListener('click', () => this.closePlayer());
    }

    // Full player play/pause
    if (this.els.playerPlayBtn) {
      this.els.playerPlayBtn.addEventListener('click', () => this.togglePlay());
    }

    // Next / Prev
    if (this.els.playerNextBtn) {
      this.els.playerNextBtn.addEventListener('click', () => this.nextTrack());
    }
    if (this.els.playerPrevBtn) {
      this.els.playerPrevBtn.addEventListener('click', () => this.prevTrack());
    }

    // Shuffle
    if (this.els.playerShuffleBtn) {
      this.els.playerShuffleBtn.addEventListener('click', () => this.toggleShuffle());
    }

    // Repeat
    if (this.els.playerRepeatBtn) {
      this.els.playerRepeatBtn.addEventListener('click', () => this.toggleRepeat());
    }

    // Like
    if (this.els.playerLikeBtn) {
      this.els.playerLikeBtn.addEventListener('click', () => this.toggleLike());
    }

    // Vinyl mode
    if (this.els.playerVinylBtn) {
      this.els.playerVinylBtn.addEventListener('click', () => this.toggleVinyl());
    }

    // Lyrics
    if (this.els.playerLyricsBtn) {
      this.els.playerLyricsBtn.addEventListener('click', () => this.toggleLyrics());
    }
    if (this.els.lyricsCloseBtn) {
      this.els.lyricsCloseBtn.addEventListener('click', () => this.toggleLyrics());
    }

    // Progress bar seek
    if (this.els.playerProgressBar) {
      this.els.playerProgressBar.addEventListener('click', (e) => {
        const rect = this.els.playerProgressBar.getBoundingClientRect();
        const percent = ((e.clientX - rect.left) / rect.width) * 100;
        this.seekTo(Math.max(0, Math.min(100, percent)));
      });
    }

    // Swipe down to close
    if (this.els.fullPlayer) {
      let startY = 0;
      let currentY = 0;

      this.els.fullPlayer.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
      }, { passive: true });

      this.els.fullPlayer.addEventListener('touchmove', (e) => {
        currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        if (diff > 0 && diff < 300) {
          this.els.fullPlayer.style.transform = `translateX(-50%) translateY(${diff}px)`;
          this.els.fullPlayer.style.opacity = 1 - (diff / 400);
        }
      }, { passive: true });

      this.els.fullPlayer.addEventListener('touchend', () => {
        const diff = currentY - startY;
        if (diff > 120) {
          this.closePlayer();
        } else {
          this.els.fullPlayer.style.transform = '';
          this.els.fullPlayer.style.opacity = '';
        }
      });
    }
  }

  openPlayer() {
    if (this.els.fullPlayer) {
      this.els.fullPlayer.classList.add('open');
      this.els.fullPlayer.style.transform = '';
      this.els.fullPlayer.style.opacity = '';
      this.isPlayerOpen = true;

      // Hide nav and mini player
      if (this.els.bottomNav) this.els.bottomNav.classList.add('hidden');

      document.body.style.overflow = 'hidden';
    }
  }

  closePlayer() {
    if (this.els.fullPlayer) {
      this.els.fullPlayer.classList.remove('open');
      this.els.fullPlayer.style.transform = '';
      this.els.fullPlayer.style.opacity = '';
      this.isPlayerOpen = false;

      // Show nav
      if (this.els.bottomNav) this.els.bottomNav.classList.remove('hidden');

      document.body.style.overflow = '';

      // Close lyrics if open
      if (this.lyricsOpen) this.toggleLyrics();
    }
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    this.updatePlayButton();
    this.updateVisualizer();

    if (this.isPlaying) {
      this.startProgressSimulation();
      // Vinyl animation
      if (this.vinylMode && this.els.playerCover) {
        this.els.playerCover.classList.remove('vinyl-paused');
      }
    } else {
      this.stopProgressSimulation();
      if (this.vinylMode && this.els.playerCover) {
        this.els.playerCover.classList.add('vinyl-paused');
      }
    }

    // Animate play button
    const btn = this.isPlayerOpen ? this.els.playerPlayBtn : this.els.miniPlayBtn;
    if (btn) {
      btn.classList.add('scale-bounce');
      setTimeout(() => btn.classList.remove('scale-bounce'), 350);
    }
  }

  nextTrack() {
    if (this.shuffle) {
      this.currentTrackIndex = Math.floor(Math.random() * MOCK_DATA.tracks.length);
    } else {
      this.currentTrackIndex = (this.currentTrackIndex + 1) % MOCK_DATA.tracks.length;
    }
    this.progress = 0;
    this.loadTrack();

    // Animate cover
    if (this.els.playerCover) {
      this.els.playerCover.style.animation = 'none';
      this.els.playerCover.offsetHeight;
      this.els.playerCover.style.animation = 'fadeInScale 0.5s var(--ease-spring-soft) forwards';
    }
  }

  prevTrack() {
    if (this.progress > 10) {
      this.progress = 0;
      this.updateProgress();
      return;
    }

    if (this.shuffle) {
      this.currentTrackIndex = Math.floor(Math.random() * MOCK_DATA.tracks.length);
    } else {
      this.currentTrackIndex = (this.currentTrackIndex - 1 + MOCK_DATA.tracks.length) % MOCK_DATA.tracks.length;
    }
    this.progress = 0;
    this.loadTrack();
  }

  loadTrack() {
    const track = getTrack(this.currentTrackIndex);
    this.liked = track.liked;
    this.updateUI();

    if (this.isPlaying) {
      this.startProgressSimulation();
    }

    // Show toast
    showToast(`🎵 ${track.title} — ${track.artist}`);
  }

  toggleShuffle() {
    this.shuffle = !this.shuffle;
    if (this.els.playerShuffleBtn) {
      this.els.playerShuffleBtn.classList.toggle('active', this.shuffle);
    }
    showToast(this.shuffle ? '🔀 Перемешивание включено' : '🔀 Перемешивание выключено');
  }

  toggleRepeat() {
    const modes = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(this.repeat);
    this.repeat = modes[(currentIndex + 1) % modes.length];

    if (this.els.playerRepeatBtn) {
      this.els.playerRepeatBtn.classList.toggle('active', this.repeat !== 'off');

      const svg = this.els.playerRepeatBtn.querySelector('svg');
      if (this.repeat === 'one' && svg) {
        svg.innerHTML = '<path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/><text x="12" y="15" text-anchor="middle" fill="currentColor" font-size="8" font-weight="bold" stroke="none">1</text>';
      } else if (svg) {
        svg.innerHTML = '<path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/>';
      }
    }

    const msgs = { off: '🔁 Повтор выключен', all: '🔁 Повтор плейлиста', one: '🔂 Повтор трека' };
    showToast(msgs[this.repeat]);
  }

  toggleLike() {
    this.liked = !this.liked;

    if (this.els.playerLikeBtn) {
      this.els.playerLikeBtn.classList.toggle('liked', this.liked);
      if (this.liked) {
        this.els.playerLikeBtn.classList.add('heart-beat');
        setTimeout(() => this.els.playerLikeBtn.classList.remove('heart-beat'), 600);
      }
    }

    const track = getTrack(this.currentTrackIndex);
    track.liked = this.liked;
    // Sync liked-count in library
    const likedCount = document.getElementById('liked-count');
    if (likedCount) {
      const count = MOCK_DATA.tracks.filter(t => t.liked).length;
      likedCount.textContent = `${count} треков`;
    }
    showToast(this.liked ? '❤️ Добавлено в любимые' : '💔 Удалено из любимых');
  }

  toggleVinyl() {
    this.vinylMode = !this.vinylMode;

    if (this.els.playerCover) {
      this.els.playerCover.classList.toggle('vinyl-mode', this.vinylMode);
      if (this.vinylMode) {
        this.els.playerCover.classList.add('vinyl-spinning');
        if (!this.isPlaying) {
          this.els.playerCover.classList.add('vinyl-paused');
        }
      } else {
        this.els.playerCover.classList.remove('vinyl-spinning', 'vinyl-paused');
      }
    }

    if (this.els.playerVinylBtn) {
      this.els.playerVinylBtn.classList.toggle('active', this.vinylMode);
    }

    showToast(this.vinylMode ? '💿 Режим пластинки' : '🖼 Режим обложки');
  }

  toggleLyrics() {
    this.lyricsOpen = !this.lyricsOpen;
    if (this.els.lyricsOverlay) {
      this.els.lyricsOverlay.classList.toggle('open', this.lyricsOpen);
    }
    if (this.els.playerLyricsBtn) {
      this.els.playerLyricsBtn.classList.toggle('active', this.lyricsOpen);
    }
  }

  seekTo(percent) {
    this.progress = percent;
    this.updateProgress();
  }

  // Progress simulation
  startProgressSimulation() {
    this.stopProgressSimulation();
    this.progressInterval = setInterval(() => {
      this.progress += 0.15;
      if (this.progress >= 100) {
        this.progress = 0;
        if (this.repeat === 'one') {
          this.loadTrack();
        } else {
          this.nextTrack();
        }
        return;
      }
      this.updateProgress();
    }, 100);
  }

  stopProgressSimulation() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  // UI Updates
  updateUI() {
    const track = getTrack(this.currentTrackIndex);

    // Mini player
    if (this.els.miniCover) {
      this.els.miniCover.className = `cover-gradient ${track.cover}`;
    }
    if (this.els.miniTitle) this.els.miniTitle.textContent = track.title;
    if (this.els.miniArtist) this.els.miniArtist.textContent = track.artist;

    // Full player
    if (this.els.playerBg) {
      this.els.playerBg.className = `player-bg-image cover-gradient ${track.cover}`;
    }
    if (this.els.playerCoverImg) {
      this.els.playerCoverImg.className = `cover-gradient ${track.cover}`;
    }
    if (this.els.playerTitle) this.els.playerTitle.textContent = track.title;
    if (this.els.playerArtist) this.els.playerArtist.textContent = track.artist;
    if (this.els.playerDuration) this.els.playerDuration.textContent = track.duration;

    // Like button
    if (this.els.playerLikeBtn) {
      this.els.playerLikeBtn.classList.toggle('liked', this.liked);
    }

    this.updatePlayButton();
    this.updateProgress();
  }

  updatePlayButton() {
    const playIcon = '<svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    const pauseIcon = '<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';

    if (this.els.miniPlayBtn) {
      this.els.miniPlayBtn.innerHTML = this.isPlaying ? pauseIcon : playIcon;
    }
    if (this.els.playerPlayBtn) {
      this.els.playerPlayBtn.innerHTML = this.isPlaying ? pauseIcon : playIcon;
    }

    // Update equalizer visibility
    const eqMini = document.querySelector('.eq-mini');
    if (eqMini) {
      eqMini.style.display = this.isPlaying ? 'flex' : 'none';
    }
  }

  updateProgress() {
    // Mini player progress
    if (this.els.miniPlayer) {
      this.els.miniPlayer.style.setProperty('--progress', `${this.progress}%`);
    }

    // Full player progress
    if (this.els.playerProgressFill) {
      this.els.playerProgressFill.style.width = `${this.progress}%`;
    }

    // Time display
    if (this.els.playerCurrentTime) {
      const track = getTrack(this.currentTrackIndex);
      const durationParts = track.duration.split(':');
      const totalSeconds = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
      const currentSeconds = Math.floor((this.progress / 100) * totalSeconds);
      const minutes = Math.floor(currentSeconds / 60);
      const seconds = currentSeconds % 60;
      this.els.playerCurrentTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Update active lyric line
    this.updateLyrics();
  }

  updateLyrics() {
    if (!this.lyricsOpen) return;

    const track = getTrack(this.currentTrackIndex);
    const durationParts = track.duration.split(':');
    const totalSeconds = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
    const currentSeconds = Math.floor((this.progress / 100) * totalSeconds);

    const lines = document.querySelectorAll('.lyrics-line');
    let activeIndex = 0;

    MOCK_DATA.lyrics.forEach((lyric, i) => {
      if (currentSeconds >= lyric.time) activeIndex = i;
    });

    lines.forEach((line, i) => {
      line.classList.toggle('active', i === activeIndex);
    });
  }

  // Visualizer
  initVisualizer() {
    if (!this.els.visualizer) return;

    const barCount = 24;
    this.els.visualizer.innerHTML = '';

    for (let i = 0; i < barCount; i++) {
      const bar = document.createElement('div');
      bar.className = 'player-viz-bar';
      bar.style.height = '4px';
      this.els.visualizer.appendChild(bar);
      this.visualizerBars.push(bar);
    }

    this.updateVisualizer();
  }

  updateVisualizer() {
    if (this.visualizerRAF) {
      cancelAnimationFrame(this.visualizerRAF);
    }

    if (!this.isPlaying) {
      // Set bars to minimum
      this.visualizerBars.forEach(bar => {
        bar.style.height = '4px';
        bar.style.opacity = '0.3';
      });
      return;
    }

    const animate = () => {
      this.visualizerBars.forEach((bar, i) => {
        const baseHeight = 4;
        const maxHeight = 36;
        const height = baseHeight + Math.random() * (maxHeight - baseHeight);
        const smoothHeight = baseHeight + (height - baseHeight) * (0.5 + 0.5 * Math.sin(Date.now() / (200 + i * 30) + i));
        bar.style.height = `${smoothHeight}px`;
        bar.style.opacity = '0.6';
      });

      this.visualizerRAF = requestAnimationFrame(animate);
    };

    animate();
  }

  // Play specific track
  playTrack(index) {
    this.currentTrackIndex = index;
    this.progress = 0;
    this.isPlaying = true;
    this.loadTrack();
    this.updatePlayButton();
    this.updateVisualizer();
    this.startProgressSimulation();
  }
}

// Create global player instance
const player = new VibePlayer();

// Toast notification
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.remove('show');
  toast.offsetHeight; // Force reflow
  toast.classList.add('show');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}
