// ============================================
// VIBE — SPA Router
// ============================================

class VibeRouter {
  constructor() {
    this.currentTab = 'home';
    this.screens = {};
    this.navItems = {};
    this.onTabChange = null;
    this.history = ['home'];
  }

  init() {
    // Cache DOM elements
    document.querySelectorAll('.screen').forEach(screen => {
      const id = screen.id.replace('screen-', '');
      this.screens[id] = screen;
    });

    document.querySelectorAll('.nav-item').forEach(item => {
      const tab = item.dataset.tab;
      this.navItems[tab] = item;

      item.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigate(tab);
      });
    });

    // Set initial active
    this.setActive('home', false);
  }

  navigate(tab) {
    if (tab === this.currentTab) {
      // Scroll to top if same tab
      const screen = this.screens[tab];
      if (screen) {
        screen.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    this.setActive(tab, true);
  }

  setActive(tab, animate = true) {
    const prevTab = this.currentTab;

    // Deactivate current screen and nav
    Object.values(this.screens).forEach(s => s.classList.remove('active'));
    Object.values(this.navItems).forEach(n => n.classList.remove('active'));

    // Activate new screen and nav
    if (this.screens[tab]) {
      this.screens[tab].classList.add('active');

      if (animate) {
        // Add stagger animation to cards
        const cards = this.screens[tab].querySelectorAll('.card-stagger');
        cards.forEach((card, i) => {
          card.style.animation = 'none';
          card.offsetHeight; // Force reflow
          card.style.animation = '';
        });
      }
    }

    if (this.navItems[tab]) {
      this.navItems[tab].classList.add('active');

      if (animate) {
        // Tab switch animation
        const icon = this.navItems[tab].querySelector('svg');
        if (icon) {
          icon.style.animation = 'none';
          icon.offsetHeight;
          icon.style.animation = 'tabPulse 0.4s var(--ease-spring) forwards';
        }
      }
    }

    this.currentTab = tab;

    // Track history
    if (this.history[this.history.length - 1] !== tab) {
      this.history.push(tab);
      if (this.history.length > 20) this.history.shift();
    }

    // Callback
    if (this.onTabChange) {
      this.onTabChange(tab, prevTab);
    }
  }

  goBack() {
    if (this.history.length > 1) {
      this.history.pop();
      const prevTab = this.history[this.history.length - 1];
      this.setActive(prevTab, true);
      return true;
    }
    return false;
  }
}

// Create global router instance
const router = new VibeRouter();
