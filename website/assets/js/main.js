/* ============================================================
   Voodoo Hut AV & Broadcast — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     NAV: sticky scroll state + hamburger mobile menu
  ---------------------------------------------------------- */
  const nav = document.getElementById('main-nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      hamburger.innerHTML = open ? '&#10005;' : '&#9776;';
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        hamburger.innerHTML = '&#9776;';
      });
    });
  }

  /* ----------------------------------------------------------
     RADIO PLAYER (persistent bottom bar)
  ---------------------------------------------------------- */
  const streamUrl = 'https://radio.voodoo-hut.com:8000/stream'; // AzuraCast Icecast

  const playBtn    = document.getElementById('radio-play');
  const volumeSlider = document.getElementById('radio-volume');
  const nowPlaying = document.getElementById('now-playing');
  const liveDot    = document.querySelector('#radio-player .live-dot');

  let audio        = null;
  let playing      = false;

  function createAudio() {
    if (audio) return;
    audio = new Audio();
    audio.preload = 'none';
    audio.volume  = volumeSlider ? parseFloat(volumeSlider.value) : 0.8;

    audio.addEventListener('playing', () => {
      playing = true;
      updatePlayBtn();
      if (liveDot) liveDot.style.display = 'inline-block';
    });

    audio.addEventListener('pause', () => {
      playing = false;
      updatePlayBtn();
    });

    audio.addEventListener('error', () => {
      playing = false;
      updatePlayBtn();
      if (nowPlaying) nowPlaying.textContent = 'Stream unavailable';
    });
  }

  function updatePlayBtn() {
    if (!playBtn) return;
    playBtn.innerHTML = playing
      ? '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
      : '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>';
    playBtn.setAttribute('aria-label', playing ? 'Pause radio' : 'Play radio');
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      createAudio();
      if (playing) {
        audio.pause();
        audio.src = '';
      } else {
        audio.src = streamUrl + '?nocache=' + Date.now();
        audio.play().catch(() => {
          if (nowPlaying) nowPlaying.textContent = 'Tap again to play';
        });
      }
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', () => {
      if (audio) audio.volume = parseFloat(volumeSlider.value);
    });
  }

  /* AzuraCast "Now Playing" API */
  function fetchNowPlaying() {
    const apiBase = 'https://radio.voodoo-hut.com/api/nowplaying/1';
    fetch(apiBase)
      .then(r => r.json())
      .then(data => {
        const song = data?.now_playing?.song;
        if (song && nowPlaying) {
          const title  = song.title  || '';
          const artist = song.artist || '';
          nowPlaying.textContent = artist && title
            ? `${artist} — ${title}`
            : (title || artist || 'Voodoo Hut Radio');
        }
      })
      .catch(() => {}); // silently fail if server not up yet
  }

  fetchNowPlaying();
  setInterval(fetchNowPlaying, 30000);

  /* ----------------------------------------------------------
     MENU TABS
  ---------------------------------------------------------- */
  const menuTabs    = document.querySelectorAll('.menu-tab');
  const menuPanels  = document.querySelectorAll('.menu-panel');

  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      menuTabs.forEach(t => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', t === tab);
      });

      menuPanels.forEach(panel => {
        const isTarget = panel.id === target;
        panel.classList.toggle('active', isTarget);
        panel.setAttribute('aria-hidden', !isTarget);
      });
    });
  });

  /* ----------------------------------------------------------
     FADE-IN SCROLL REVEAL
  ---------------------------------------------------------- */
  const fadeEls = document.querySelectorAll('.fade-in');

  if (fadeEls.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    fadeEls.forEach(el => observer.observe(el));
  }

  /* ----------------------------------------------------------
     EVENTS: "Load More" button (simple show/hide approach)
  ---------------------------------------------------------- */
  const loadMoreBtn = document.getElementById('load-more-events');
  const hiddenCards = document.querySelectorAll('.event-card.hidden');
  let shown = false;

  if (loadMoreBtn && hiddenCards.length) {
    loadMoreBtn.addEventListener('click', () => {
      if (!shown) {
        hiddenCards.forEach(c => c.classList.remove('hidden'));
        loadMoreBtn.textContent = 'Show Less';
      } else {
        hiddenCards.forEach(c => c.classList.add('hidden'));
        loadMoreBtn.textContent = 'Load More Events';
      }
      shown = !shown;
    });
  }

  /* ----------------------------------------------------------
     CONTACT FORM: topic-aware placeholder swap
  ---------------------------------------------------------- */
  const topicSelect = document.getElementById('contact-topic');
  const messageArea = document.getElementById('contact-message');

  const placeholders = {
    general:    'Tell us what\'s on your mind...',
    reservation:'Date, time, party size, any special requests?',
    billing:    'Describe the issue and include your visit date...',
    booking:    'Tell us about your act — genre, social links, availability...',
    sponsorship:'What kind of partnership are you envisioning?',
    advertising:'Tell us about your brand and target audience...',
    press:      'Publication name, story angle, and your deadline...',
    feedback:   'We read every message. What can we do better?',
  };

  if (topicSelect && messageArea) {
    topicSelect.addEventListener('change', () => {
      const key = topicSelect.value;
      messageArea.placeholder = placeholders[key] || placeholders.general;
    });
  }

  /* ----------------------------------------------------------
     LIVE STREAM: detect offline iframes (YouTube/Twitch)
  ---------------------------------------------------------- */
  // Placeholder — real implementation would ping the channel API.
  // For now, wire up click-to-expand on stream wrappers.
  document.querySelectorAll('.stream-card').forEach(card => {
    const iframe = card.querySelector('iframe');
    const offline = card.querySelector('.stream-offline');
    if (!iframe && offline) {
      offline.style.display = 'flex';
    }
  });

  /* ----------------------------------------------------------
     SMOOTH SCROLL for anchor links
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = (nav ? nav.offsetHeight : 72) + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ----------------------------------------------------------
     ACTIVE NAV LINK highlight
  ---------------------------------------------------------- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkPage = href.split('/').pop();
    if (linkPage === currentPath) {
      link.classList.add('active');
    }
  });

})();
