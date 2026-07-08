// ============================================
// VIBE — Mock Data
// ============================================

const MOCK_DATA = {
  // Current User
  user: {
    name: 'Алексей',
    handle: '@alexey_vibe',
    avatar: 'artist-1',
    subscription: {
      plan: 'VIBE Premium',
      expires: '15 августа 2026',
      active: true
    },
    stats: {
      playlists: 24,
      followers: 156,
      following: 89
    },
    passport: {
      hoursListened: 847,
      tracksPlayed: 12463,
      topGenre: 'Electronic'
    }
  },

  // Tracks
  tracks: [
    { id: 1, title: 'Midnight Drive', artist: 'Neon Pulse', album: 'Synthetic Horizons', duration: '3:42', cover: 'cover-3', liked: true },
    { id: 2, title: 'Whispers in Rain', artist: 'Luna Shade', album: 'Dreamscape', duration: '4:15', cover: 'cover-2', liked: false },
    { id: 3, title: 'Gravity Falls', artist: 'ASTRA', album: 'Stellar', duration: '3:28', cover: 'cover-7', liked: true },
    { id: 4, title: 'Lost in Tokyo', artist: 'Kai Horizon', album: 'Neon Nights', duration: '5:01', cover: 'cover-1', liked: false },
    { id: 5, title: 'Северное сияние', artist: 'Дыхание', album: 'Полярная ночь', duration: '4:33', cover: 'cover-12', liked: true },
    { id: 6, title: 'Crystal Echoes', artist: 'Crystal Waves', album: 'Transparent', duration: '3:56', cover: 'cover-10', liked: false },
    { id: 7, title: 'Raw Energy', artist: 'VOLT', album: 'Charged', duration: '2:58', cover: 'cover-9', liked: true },
    { id: 8, title: 'Golden Hour', artist: 'Sunset Collective', album: 'Warm Tones', duration: '4:47', cover: 'cover-8', liked: false },
    { id: 9, title: 'Deep Blue', artist: 'Marina Del', album: 'Oceanic', duration: '3:35', cover: 'cover-2', liked: true },
    { id: 10, title: 'Электрические сны', artist: 'Спектр', album: 'Неон', duration: '4:22', cover: 'cover-11', liked: false },
    { id: 11, title: 'Stellar Drift', artist: 'Cosmonaut', album: 'Zero Gravity', duration: '5:18', cover: 'cover-4', liked: true },
    { id: 12, title: 'Фиолетовый закат', artist: 'Аврора', album: 'Краски', duration: '3:49', cover: 'cover-5', liked: false },
    { id: 13, title: 'Neon Cathedral', artist: 'Blade Runner', album: 'Cyberpunk', duration: '4:05', cover: 'cover-1', liked: true },
    { id: 14, title: 'Sakura Dreams', artist: 'Yuki', album: 'Tokyo Twilight', duration: '3:22', cover: 'cover-6', liked: false },
    { id: 15, title: 'Pulse', artist: 'VOID', album: 'Binary', duration: '3:11', cover: 'cover-3', liked: true }
  ],

  // Albums
  albums: [
    { id: 1, title: 'Synthetic Horizons', artist: 'Neon Pulse', year: 2026, cover: 'cover-3', tracks: 12 },
    { id: 2, title: 'Dreamscape', artist: 'Luna Shade', year: 2026, cover: 'cover-2', tracks: 10 },
    { id: 3, title: 'Stellar', artist: 'ASTRA', year: 2025, cover: 'cover-7', tracks: 14 },
    { id: 4, title: 'Neon Nights', artist: 'Kai Horizon', year: 2026, cover: 'cover-1', tracks: 8 },
    { id: 5, title: 'Полярная ночь', artist: 'Дыхание', year: 2026, cover: 'cover-12', tracks: 11 },
    { id: 6, title: 'Transparent', artist: 'Crystal Waves', year: 2025, cover: 'cover-10', tracks: 9 },
    { id: 7, title: 'Charged', artist: 'VOLT', year: 2026, cover: 'cover-9', tracks: 13 },
    { id: 8, title: 'Warm Tones', artist: 'Sunset Collective', year: 2025, cover: 'cover-8', tracks: 7 }
  ],

  // Artists
  artists: [
    { id: 1, name: 'Neon Pulse', avatar: 'artist-1', genre: 'Synthwave', followers: '1.2M' },
    { id: 2, name: 'Luna Shade', avatar: 'artist-2', genre: 'Dream Pop', followers: '845K' },
    { id: 3, name: 'ASTRA', avatar: 'artist-3', genre: 'Electronic', followers: '2.1M' },
    { id: 4, name: 'Дыхание', avatar: 'artist-4', genre: 'Indie', followers: '567K' },
    { id: 5, name: 'Kai Horizon', avatar: 'artist-5', genre: 'Lo-fi', followers: '1.8M' },
    { id: 6, name: 'VOLT', avatar: 'artist-6', genre: 'Hip-Hop', followers: '3.4M' }
  ],

  // Playlists
  playlists: [
    { id: 1, title: 'Ночной драйв', tracks: 42, cover: 'cover-1', gradient: 'cover-1' },
    { id: 2, title: 'Фокус и работа', tracks: 68, cover: 'cover-4', gradient: 'cover-4' },
    { id: 3, title: 'Закатные вибрации', tracks: 35, cover: 'cover-8', gradient: 'cover-8' },
    { id: 4, title: 'Электронное утро', tracks: 51, cover: 'cover-3', gradient: 'cover-3' },
    { id: 5, title: 'Спокойствие', tracks: 29, cover: 'cover-6', gradient: 'cover-6' },
    { id: 6, title: 'Любимые хиты', tracks: 124, cover: 'cover-5', gradient: 'cover-5' }
  ],

  // Moods
  moods: [
    { id: 1, label: 'Энергия', icon: '⚡', gradient: 'linear-gradient(135deg, #DC2626 0%, #F97316 100%)' },
    { id: 2, label: 'Спокойствие', icon: '🌊', gradient: 'linear-gradient(135deg, #0369A1 0%, #06B6D4 100%)' },
    { id: 3, label: 'Фокус', icon: '🎯', gradient: 'linear-gradient(135deg, #4338CA 0%, #7C3AED 100%)' },
    { id: 4, label: 'Грусть', icon: '🌙', gradient: 'linear-gradient(135deg, #1E293B 0%, #475569 100%)' },
    { id: 5, label: 'Романтика', icon: '💜', gradient: 'linear-gradient(135deg, #BE185D 0%, #EC4899 100%)' },
    { id: 6, label: 'Вечеринка', icon: '🎉', gradient: 'linear-gradient(135deg, #D97706 0%, #FBBF24 100%)' }
  ],

  // Genres
  genres: [
    { name: 'Electronic', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.15)' },
    { name: 'Lo-fi', color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.15)' },
    { name: 'Synthwave', color: '#EC4899', bg: 'rgba(236, 72, 153, 0.15)' },
    { name: 'Indie', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' },
    { name: 'Hip-Hop', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' },
    { name: 'Dream Pop', color: '#A78BFA', bg: 'rgba(167, 139, 250, 0.15)' },
    { name: 'Ambient', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' },
    { name: 'Jazz', color: '#D97706', bg: 'rgba(217, 119, 6, 0.15)' },
    { name: 'Rock', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)' },
    { name: 'R&B', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.15)' }
  ],

  // Concerts
  concerts: [
    { id: 1, artist: 'ASTRA', venue: 'Adrenaline Stadium', city: 'Москва', day: 18, month: 'Июл' },
    { id: 2, artist: 'Neon Pulse', venue: 'A2 Green Concert', city: 'Санкт-Петербург', day: 25, month: 'Июл' },
    { id: 3, artist: 'VOLT', venue: 'VTB Arena', city: 'Москва', day: 3, month: 'Авг' }
  ],

  // Lyrics (for demo)
  lyrics: [
    { time: 0, text: 'Огни ночного города' },
    { time: 4, text: 'Мерцают в темноте' },
    { time: 8, text: 'Я еду по пустым дорогам' },
    { time: 12, text: 'Навстречу тишине' },
    { time: 18, text: '' },
    { time: 20, text: 'Неоновые отражения' },
    { time: 24, text: 'Скользят по мокрому стеклу' },
    { time: 28, text: 'И музыка — моё спасение' },
    { time: 32, text: 'В ночную темноту' },
    { time: 38, text: '' },
    { time: 40, text: 'Midnight drive, midnight drive' },
    { time: 44, text: 'Потерянный в огнях' },
    { time: 48, text: 'Midnight drive, midnight drive' },
    { time: 52, text: 'Сквозь тысячи зеркал' },
    { time: 58, text: '' },
    { time: 60, text: 'Бассы пронзают тишину' },
    { time: 64, text: 'Синтезатор поёт мечту' },
    { time: 68, text: 'И каждый поворот дороги' },
    { time: 72, text: 'Ведёт меня к утру' }
  ],

  // Now Playing (initial state)
  nowPlaying: {
    trackIndex: 0,
    isPlaying: false,
    progress: 35,
    currentTime: '1:18',
    duration: '3:42',
    shuffle: false,
    repeat: 'off', // off, all, one
    volume: 80,
    quality: 'Высокое (320 kbps)',
    liked: true
  }
};

// Helper function to get track by index
function getTrack(index) {
  return MOCK_DATA.tracks[index] || MOCK_DATA.tracks[0];
}

// Get current playing track
function getCurrentTrack() {
  return getTrack(MOCK_DATA.nowPlaying.trackIndex);
}

// Get greeting based on time of day
function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Доброе утро';
  if (hour >= 12 && hour < 17) return 'Добрый день';
  if (hour >= 17 && hour < 22) return 'Добрый вечер';
  return 'Доброй ночи';
}

// Get time of day label
function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { label: 'Утреннее', title: 'Энергичное утро', desc: 'Бодрящие треки для хорошего начала дня', gradient: 'linear-gradient(135deg, #F59E0B 0%, #F97316 50%, #EF4444 100%)' };
  if (hour >= 12 && hour < 17) return { label: 'Дневное', title: 'Дневной ритм', desc: 'Фоновая музыка для продуктивности', gradient: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 50%, #10B981 100%)' };
  if (hour >= 17 && hour < 22) return { label: 'Вечернее', title: 'Вечерний Chill', desc: 'Расслабляющие мелодии для вечера', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #3B82F6 100%)' };
  return { label: 'Ночное', title: 'Ночной драйв', desc: 'Глубокие треки для ночных часов', gradient: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4C1D95 100%)' };
}

// Format date
function getFormattedDate() {
  const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const now = new Date();
  return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
}
