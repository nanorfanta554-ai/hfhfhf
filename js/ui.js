// ============================================
// VIBE — UI Interactions
// ============================================

class VibeUI {
  constructor() {
    this.scrollPositions = {};
  }

  init() {
    this.setupRippleEffect();
    this.setupTrackClicks();
    this.setupToggleSwitches();
    this.setupLikeButtons();
    this.setupPullToRefresh();
    this.setupParallaxCovers();
    this.setupScrollEffects();
    this.setupDetailModalClose();
    this.setupGlobalDelegatedClicks();
  }

  // Ripple effect on click
  setupRippleEffect() {
    document.querySelectorAll('.ripple-effect').forEach(el => {
      el.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  // Track card clicks → play that track
  setupTrackClicks() {
    document.querySelectorAll('.track-card').forEach(card => {
      card.addEventListener('click', () => {
        const index = parseInt(card.dataset.trackIndex);
        if (!isNaN(index)) {
          // Remove playing state from all tracks
          document.querySelectorAll('.track-card.playing').forEach(c => c.classList.remove('playing'));
          card.classList.add('playing');
          player.playTrack(index);
        }
      });
    });
  }

  // Toggle switches
  setupToggleSwitches() {
    document.querySelectorAll('.toggle').forEach(toggle => {
      toggle.addEventListener('click', function() {
        this.classList.toggle('active');
        // Spring animation
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
          this.style.transform = 'scale(1)';
        }, 150);
      });
    });
  }

  // Like buttons (outside player)
  setupLikeButtons() {
    document.querySelectorAll('.like-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('liked');
        if (this.classList.contains('liked')) {
          this.classList.add('heart-beat');
          setTimeout(() => this.classList.remove('heart-beat'), 600);
          showToast('❤️ Добавлено в любимые');
        } else {
          showToast('💔 Удалено из любимых');
        }
      });
    });
  }

  // Pull to refresh simulation
  setupPullToRefresh() {
    document.querySelectorAll('.screen').forEach(screen => {
      let startY = 0;
      let pulling = false;

      screen.addEventListener('touchstart', (e) => {
        if (screen.scrollTop === 0) {
          startY = e.touches[0].clientY;
          pulling = true;
        }
      }, { passive: true });

      screen.addEventListener('touchmove', (e) => {
        if (!pulling) return;
        const diff = e.touches[0].clientY - startY;
        if (diff > 0 && diff < 100) {
          screen.style.transform = `translateY(${diff * 0.4}px)`;
        }
      }, { passive: true });

      screen.addEventListener('touchend', () => {
        if (pulling) {
          screen.style.transition = 'transform 0.3s var(--ease-spring)';
          screen.style.transform = '';
          setTimeout(() => {
            screen.style.transition = '';
          }, 300);
          pulling = false;
        }
      });
    });
  }

  // Parallax on album covers
  setupParallaxCovers() {
    const covers = document.querySelectorAll('.album-card');
    covers.forEach(cover => {
      cover.addEventListener('mousemove', (e) => {
        const rect = cover.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const img = cover.querySelector('.album-card-cover');
        if (img) {
          img.style.transform = `perspective(500px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
        }
      });

      cover.addEventListener('mouseleave', () => {
        const img = cover.querySelector('.album-card-cover');
        if (img) {
          img.style.transform = '';
          img.style.transition = 'transform 0.5s var(--ease-spring-soft)';
          setTimeout(() => { img.style.transition = ''; }, 500);
        }
      });
    });
  }

  // Scroll effects (header fade, etc.)
  setupScrollEffects() {
    document.querySelectorAll('.screen').forEach(screen => {
      screen.addEventListener('scroll', () => {
        const scrollY = screen.scrollTop;
        // Store scroll position
        this.scrollPositions[screen.id] = scrollY;

        // Fade hero on scroll
        const hero = screen.querySelector('.home-hero, .foryou-header, .library-header');
        if (hero) {
          const opacity = Math.max(0, 1 - scrollY / 200);
          hero.style.opacity = opacity;
          hero.style.transform = `translateY(${-scrollY * 0.3}px)`;
        }
      }, { passive: true });
    });
  }

  // Animate counter numbers
  animateCounter(element, target, duration = 1500) {
    const start = 0;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * eased);

      element.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }

  // Show section with stagger animation
  revealSection(sectionEl) {
    const cards = sectionEl.querySelectorAll('.card-stagger');
    cards.forEach((card, i) => {
      card.style.animationDelay = `${i * 60}ms`;
    });
  }

  // ── Generic Detail Modal ─────────────────
  // Used by album cards, library categories and settings rows —
  // all of which previously had no click handler at all.
  openDetailModal(html) {
    const modal = document.getElementById('detail-modal');
    const body = document.getElementById('detail-modal-body');
    if (!modal || !body) return;
    body.innerHTML = html;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  closeDetailModal() {
    const modal = document.getElementById('detail-modal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  setupDetailModalClose() {
    const modal = document.getElementById('detail-modal');
    const closeBtn = document.getElementById('detail-modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeDetailModal());
    }
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeDetailModal();
      });
    }
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') this.closeDetailModal();
    });
  }

  // Single delegated listener catches clicks on album cards, library
  // categories and settings rows — including ones rendered by JS later,
  // so nothing needs to be re-bound after populateHome()/populateForYou().
  setupGlobalDelegatedClicks() {
    document.addEventListener('click', (e) => {
      // Play button inside an album card — play, don't open the modal
      const playFab = e.target.closest('.play-fab');
      if (playFab) return; // has its own onclick with stopPropagation

      // Album / playlist card → open detail modal
      const albumCard = e.target.closest('.album-card');
      if (albumCard) {
        this.openAlbumDetail(albumCard);
        return;
      }

      // Library category (skip "Любимые треки", it already has its own onclick)
      const libCat = e.target.closest('.lib-category');
      if (libCat && !libCat.hasAttribute('onclick')) {
        this.openLibraryCategory(libCat);
        return;
      }

      // Settings row that navigates somewhere (has a chevron) —
      // pure toggle rows are handled separately and shouldn't open a modal
      const settingRow = e.target.closest('.setting-row');
      if (settingRow && settingRow.querySelector('.chevron-right') && !e.target.closest('.toggle')) {
        this.openSettingDetail(settingRow);
        return;
      }
    });
  }

  openAlbumDetail(card) {
    const title = card.querySelector('.album-card-title')?.textContent.trim() || 'Альбом';
    const subtitle = card.querySelector('.album-card-subtitle')?.textContent.trim() || '';
    const coverEl = card.querySelector('.cover-gradient');
    const coverClass = coverEl ? [...coverEl.classList].find(c => c.startsWith('cover-')) : 'cover-1';

    // Show the real tracklist when we can match it by album name
    const matchingTracks = MOCK_DATA.tracks.filter(t => t.album === title);

    const tracksHtml = matchingTracks.length ? matchingTracks.map(t => {
      const idx = MOCK_DATA.tracks.indexOf(t);
      return `
        <div class="detail-list-item" onclick="player.playTrack(${idx}); ui.closeDetailModal()">
          <div class="cover-gradient ${t.cover}" style="width:40px;height:40px;border-radius:var(--radius-sm);flex-shrink:0"></div>
          <div style="flex:1;min-width:0">
            <div class="truncate" style="font-weight:var(--weight-medium)">${t.title}</div>
            <div class="truncate text-sm text-secondary">${t.artist}</div>
          </div>
          <div class="text-sm text-tertiary">${t.duration}</div>
        </div>
      `;
    }).join('') : `<p class="text-sm text-secondary">Треки скоро появятся</p>`;

    this.openDetailModal(`
      <div style="display:flex;gap:var(--space-4);align-items:center;margin-bottom:var(--space-5)">
        <div class="cover-gradient ${coverClass}" style="width:80px;height:80px;border-radius:var(--radius-lg);flex-shrink:0"></div>
        <div style="min-width:0">
          <h2 class="truncate" style="font-size:var(--text-xl);font-weight:var(--weight-bold)">${title}</h2>
          <p class="truncate text-sm text-secondary">${subtitle}</p>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:var(--space-2)">${tracksHtml}</div>
    `);
  }

  openLibraryCategory(libCat) {
    const label = libCat.querySelector('.lib-label')?.textContent.trim() || '';

    const dataMap = {
      'Плейлисты': { items: MOCK_DATA.playlists, render: pl => ({ title: pl.title, subtitle: `${pl.tracks} треков`, cover: pl.cover }) },
      'Альбомы': { items: MOCK_DATA.albums, render: al => ({ title: al.title, subtitle: `${al.artist} · ${al.year}`, cover: al.cover }) },
      'Исполнители': { items: MOCK_DATA.artists, render: ar => ({ title: ar.name, subtitle: `${ar.genre} · ${ar.followers} подписчиков`, cover: ar.avatar }) }
    };

    const config = dataMap[label];
    if (!config) {
      // No mock data backs this section yet — be honest instead of faking content
      showToast(`«${label}» — раздел в разработке`);
      return;
    }

    const listHtml = config.items.map(item => {
      const { title, subtitle, cover } = config.render(item);
      const safeTitle = title.replace(/'/g, "\\'");
      return `
        <div class="detail-list-item" onclick="showToast('▶️ Открываем «${safeTitle}»'); ui.closeDetailModal()">
          <div class="cover-gradient ${cover}" style="width:48px;height:48px;border-radius:var(--radius-md);flex-shrink:0"></div>
          <div style="flex:1;min-width:0">
            <div class="truncate" style="font-weight:var(--weight-semibold)">${title}</div>
            <div class="truncate text-sm text-secondary">${subtitle}</div>
          </div>
        </div>
      `;
    }).join('');

    this.openDetailModal(`
      <h2 style="font-size:var(--text-xl);font-weight:var(--weight-bold);margin-bottom:var(--space-4)">${label}</h2>
      <div style="display:flex;flex-direction:column;gap:var(--space-3)">${listHtml}</div>
    `);
  }

  openSettingDetail(row) {
    const label = row.querySelector('.setting-label')?.textContent.trim() || 'Настройка';
    const sublabel = row.querySelector('.setting-sublabel')?.textContent.trim() || '';

    this.openDetailModal(`
      <h2 style="font-size:var(--text-xl);font-weight:var(--weight-bold);margin-bottom:var(--space-2)">${label}</h2>
      <p class="text-secondary" style="margin-bottom:var(--space-5)">${sublabel}</p>
      <p class="text-sm text-tertiary">Этот раздел появится в одном из следующих обновлений VIBE ✨</p>
    `);
  }
}

// Create global UI instance
const ui = new VibeUI();
