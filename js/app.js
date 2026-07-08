// ============================================
// VIBE — Main Application
// ============================================

class VibeApp {
  constructor() {
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;

    // Set theme
    document.documentElement.setAttribute('data-theme', 'dark');

    // Initialize modules
    router.init();
    player.init();
    ui.init();

    // Setup router callbacks
    router.onTabChange = (tab, prevTab) => {
      // Re-animate passport counters on profile tab
      if (tab === 'profile') {
        setTimeout(() => {
          const counters = document.querySelectorAll('.passport-stat-value');
          const values = [MOCK_DATA.user.passport.hoursListened, MOCK_DATA.user.passport.tracksPlayed];
          counters.forEach((el, i) => {
            if (values[i]) ui.animateCounter(el, values[i]);
          });
        }, 300);
      }
    };

    // Populate dynamic content
    this.populateHome();
    this.populateForYou();
    this.populateLibrary();
    this.populateProfile();
    this.populateLyrics();

    // Handle keyboard
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        player.togglePlay();
      }
      if (e.code === 'ArrowRight') player.nextTrack();
      if (e.code === 'ArrowLeft') player.prevTrack();
      if (e.code === 'Escape') {
        if (player.lyricsOpen) player.toggleLyrics();
        else if (player.isPlayerOpen) player.closePlayer();
      }
    });

    this.initialized = true;
    console.log('🎵 VIBE initialized successfully');
  }

  populateHome() {
    // Greeting
    const greetingEl = document.getElementById('home-greeting');
    if (greetingEl) {
      greetingEl.innerHTML = `${getGreeting()}, ${MOCK_DATA.user.name} <span class="wave-emoji">👋</span>`;
    }

    const dateEl = document.getElementById('home-date');
    if (dateEl) {
      dateEl.textContent = getFormattedDate();
    }

    // Continue Listening
    const continueGrid = document.getElementById('continue-grid');
    if (continueGrid) {
      continueGrid.innerHTML = MOCK_DATA.tracks.slice(0, 6).map((track, i) => `
        <div class="continue-card card-stagger" data-track-index="${i}" onclick="player.playTrack(${i})">
          <div class="continue-card-cover">
            <div class="cover-gradient ${track.cover}"></div>
          </div>
          <div class="continue-card-info">
            <div class="continue-card-title">${track.title}</div>
            <div class="continue-card-artist">${track.artist}</div>
          </div>
        </div>
      `).join('');
    }

    // New Releases
    const newReleases = document.getElementById('new-releases');
    if (newReleases) {
      newReleases.innerHTML = MOCK_DATA.albums.map(album => {
        const trackIdx = Math.max(0, MOCK_DATA.tracks.findIndex(t => t.album === album.title));
        return `
        <div class="album-card card-stagger">
          <div class="album-card-cover">
            <div class="cover-gradient ${album.cover}"></div>
            <div class="play-fab" onclick="event.stopPropagation(); player.playTrack(${trackIdx})">
              <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
          </div>
          <div class="album-card-title">${album.title}</div>
          <div class="album-card-subtitle">${album.artist}</div>
        </div>
      `;
      }).join('');
    }

    // Popular tracks
    const popularTracks = document.getElementById('popular-tracks');
    if (popularTracks) {
      popularTracks.innerHTML = MOCK_DATA.tracks.slice(0, 5).map((track, i) => `
        <div class="track-card ripple-effect" data-track-index="${i}">
          <div class="track-number">${i + 1}</div>
          <div class="track-cover">
            <div class="cover-gradient ${track.cover}"></div>
          </div>
          <div class="track-info">
            <div class="track-title">${track.title}</div>
            <div class="track-artist">${track.artist}</div>
          </div>
          <div class="track-duration">${track.duration}</div>
          <button class="icon-btn like-btn ${track.liked ? 'liked' : ''}" aria-label="Нравится">
            <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>
      `).join('');
    }

    // Recently listened artists
    const recentArtists = document.getElementById('recent-artists');
    if (recentArtists) {
      recentArtists.innerHTML = MOCK_DATA.artists.map(artist => `
        <div class="artist-circle card-stagger">
          <div class="artist-circle-img">
            <div class="cover-gradient ${artist.avatar}"></div>
          </div>
          <div class="artist-circle-name">${artist.name}</div>
        </div>
      `).join('');
    }

    // Recommended albums
    const recAlbums = document.getElementById('rec-albums');
    if (recAlbums) {
      recAlbums.innerHTML = MOCK_DATA.albums.slice(3, 8).map(album => {
        const trackIdx = Math.max(0, MOCK_DATA.tracks.findIndex(t => t.album === album.title));
        return `
        <div class="album-card card-stagger">
          <div class="album-card-cover">
            <div class="cover-gradient ${album.cover}"></div>
            <div class="play-fab" onclick="event.stopPropagation(); player.playTrack(${trackIdx})">
              <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
          </div>
          <div class="album-card-title">${album.title}</div>
          <div class="album-card-subtitle">${album.artist} · ${album.year}</div>
        </div>
      `;
      }).join('');
    }

    // Playlists
    const dayPlaylists = document.getElementById('day-playlists');
    if (dayPlaylists) {
      dayPlaylists.innerHTML = MOCK_DATA.playlists.slice(0, 4).map(pl => `
        <div class="album-card card-stagger">
          <div class="album-card-cover">
            <div class="cover-gradient ${pl.gradient}"></div>
            <div class="play-fab" onclick="event.stopPropagation(); player.playTrack(0)">
              <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
          </div>
          <div class="album-card-title">${pl.title}</div>
          <div class="album-card-subtitle">${pl.tracks} треков</div>
        </div>
      `).join('');
    }
  }

  populateForYou() {
    // Mood cards
    const moodGrid = document.getElementById('mood-grid');
    if (moodGrid) {
      moodGrid.innerHTML = MOCK_DATA.moods.map(mood => `
        <div class="mood-card card-stagger" style="background: ${mood.gradient}">
          <span class="mood-card-icon">${mood.icon}</span>
          <span class="mood-card-label">${mood.label}</span>
        </div>
      `).join('');
    }

    // Time of day
    const timeCard = document.getElementById('time-card');
    const tod = getTimeOfDay();
    if (timeCard) {
      timeCard.style.background = tod.gradient;
      timeCard.innerHTML = `
        <div class="time-card-content">
          <div class="time-card-label">${tod.label}</div>
          <div class="time-card-title">${tod.title}</div>
          <div class="time-card-desc">${tod.desc}</div>
        </div>
      `;
    }

    // Genres
    const genreBubbles = document.getElementById('genre-bubbles');
    if (genreBubbles) {
      genreBubbles.innerHTML = MOCK_DATA.genres.map(genre => `
        <div class="genre-bubble" style="background: ${genre.bg}; color: ${genre.color}; border-color: ${genre.color}30">${genre.name}</div>
      `).join('');
    }

    // Similar artists
    const simArtists = document.getElementById('sim-artists');
    if (simArtists) {
      simArtists.innerHTML = MOCK_DATA.artists.map(artist => `
        <div class="artist-circle card-stagger">
          <div class="artist-circle-img">
            <div class="cover-gradient ${artist.avatar}"></div>
          </div>
          <div class="artist-circle-name">${artist.name}</div>
        </div>
      `).join('');
    }

    // New from favorites
    const newFavs = document.getElementById('new-favs');
    if (newFavs) {
      newFavs.innerHTML = MOCK_DATA.albums.slice(0, 5).map(album => {
        const trackIdx = Math.max(0, MOCK_DATA.tracks.findIndex(t => t.album === album.title));
        return `
        <div class="album-card card-stagger">
          <div class="album-card-cover">
            <div class="cover-gradient ${album.cover}"></div>
            <div class="play-fab" onclick="event.stopPropagation(); player.playTrack(${trackIdx})">
              <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
          </div>
          <div class="album-card-title">${album.title}</div>
          <div class="album-card-subtitle">${album.artist}</div>
        </div>
      `;
      }).join('');
    }

    // AI Recommended tracks
    const aiTracks = document.getElementById('ai-tracks');
    if (aiTracks) {
      aiTracks.innerHTML = MOCK_DATA.tracks.slice(5, 10).map((track, i) => `
        <div class="track-card ripple-effect" data-track-index="${i + 5}">
          <div class="track-cover">
            <div class="cover-gradient ${track.cover}"></div>
          </div>
          <div class="track-info">
            <div class="track-title">${track.title}</div>
            <div class="track-artist">${track.artist}</div>
          </div>
          <div class="track-duration">${track.duration}</div>
          <button class="icon-btn like-btn ${track.liked ? 'liked' : ''}" aria-label="Нравится">
            <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>
      `).join('');
    }

    // Concerts
    const concertsList = document.getElementById('concerts-list');
    if (concertsList) {
      concertsList.innerHTML = MOCK_DATA.concerts.map(concert => `
        <div class="concert-card card-stagger">
          <div class="concert-date">
            <div class="concert-day">${concert.day}</div>
            <div class="concert-month">${concert.month}</div>
          </div>
          <div class="concert-info">
            <div class="concert-name">${concert.artist}</div>
            <div class="concert-venue">${concert.venue}</div>
            <div class="concert-city">📍 ${concert.city}</div>
          </div>
        </div>
      `).join('');
    }
  }

  populateLibrary() {
    // Update liked count dynamically
    const likedCount = document.getElementById('liked-count');
    if (likedCount) {
      const count = MOCK_DATA.tracks.filter(t => t.liked).length;
      likedCount.textContent = `${count} треков`;
    }

    // Playlist grid
    const playlistGrid = document.getElementById('playlist-grid');
    if (playlistGrid) {
      const playlists = MOCK_DATA.playlists.map(pl => `
        <div class="playlist-card card-stagger">
          <div class="cover-gradient ${pl.gradient}"></div>
          <div class="playlist-card-info">
            <div class="playlist-card-title">${pl.title}</div>
            <div class="playlist-card-count">${pl.tracks} треков</div>
          </div>
        </div>
      `).join('');

      const createBtn = `
        <div class="create-playlist-btn">
          <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span>Создать</span>
        </div>
      `;

      playlistGrid.innerHTML = playlists + createBtn;
    }

    // Liked tracks
    const likedTracks = document.getElementById('liked-tracks-list');
    if (likedTracks) {
      likedTracks.innerHTML = MOCK_DATA.tracks.filter(t => t.liked).map((track, i) => `
        <div class="track-card ripple-effect" data-track-index="${MOCK_DATA.tracks.indexOf(track)}">
          <div class="track-cover">
            <div class="cover-gradient ${track.cover}"></div>
          </div>
          <div class="track-info">
            <div class="track-title">${track.title}</div>
            <div class="track-artist">${track.artist}</div>
          </div>
          <div class="track-duration">${track.duration}</div>
          <button class="icon-btn like-btn liked" aria-label="Нравится">
            <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>
      `).join('');
    }
  }

  populateProfile() {
    // Passport counters will be animated when the tab is opened
    const passportHours = document.getElementById('passport-hours');
    const passportTracks = document.getElementById('passport-tracks');

    if (passportHours) passportHours.textContent = '0';
    if (passportTracks) passportTracks.textContent = '0';
  }

  populateLyrics() {
    const lyricsContent = document.getElementById('lyrics-content');
    if (lyricsContent) {
      lyricsContent.innerHTML = MOCK_DATA.lyrics.map((lyric, i) => {
        if (!lyric.text) return '<div class="lyrics-line" style="height: 24px"></div>';
        return `<div class="lyrics-line ${i === 0 ? 'active' : ''}">${lyric.text}</div>`;
      }).join('');
    }
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new VibeApp();
  app.init();

  // Re-init UI interactions after dynamic content
  setTimeout(() => {
    ui.setupRippleEffect();
    ui.setupTrackClicks();
    ui.setupLikeButtons();
    ui.setupParallaxCovers();
  }, 100);
});
