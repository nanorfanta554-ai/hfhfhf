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
}

// Create global UI instance
const ui = new VibeUI();
