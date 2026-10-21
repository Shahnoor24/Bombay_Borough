(() => {
  const loader = document.querySelector('.page-loader');
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const year = document.querySelector('#year');
  const toast = document.querySelector('.toast');
  if (year) year.textContent = new Date().getFullYear();

  window.addEventListener('load', () => {
    window.setTimeout(() => loader?.classList.add('done'), 350);
  });

  const closeMenu = () => {
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Open navigation menu');
    mobileNav?.classList.remove('open');
    document.body.classList.remove('menu-open');
  };
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    mobileNav?.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  });
  mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 35);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const revealEls = document.querySelectorAll('.reveal, .image-reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  const tabs = document.querySelectorAll('.menu-tab');
  const panels = document.querySelectorAll('.menu-panel');
  const activateTab = key => {
    tabs.forEach(tab => {
      const active = tab.dataset.tab === key;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    panels.forEach(panel => {
      const active = panel.dataset.panel === key;
      panel.hidden = !active;
      panel.classList.toggle('active', active);
    });
  };
  tabs.forEach(tab => tab.addEventListener('click', () => activateTab(tab.dataset.tab)));
  document.querySelectorAll('[data-menu-tab]').forEach(link => link.addEventListener('click', () => activateTab(link.dataset.menuTab)));

  // Gentle pointer parallax on desktop only; disabled for reduced-motion users.
  const hero = document.querySelector('.hero');
  const heroImage = document.querySelector('.hero-image');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (hero && heroImage && !reduceMotion && window.matchMedia('(pointer:fine)').matches) {
    hero.addEventListener('pointermove', event => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      heroImage.style.transform = `scale(1.025) translate(${x * -8}px, ${y * -6}px)`;
    });
    hero.addEventListener('pointerleave', () => heroImage.style.transform = '');
  }

  // Friendly feedback for any future non-implemented placeholder action.
  const showToast = message => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 2800);
  };
  document.querySelectorAll('a[href="#reserve"]').forEach(link => {
    link.addEventListener('click', () => {
      // Reservation links lead to the real restaurant contact method; no fake booking is created.
    });
  });

  // Ensure menu tab keyboard operation remains natural.
  tabs.forEach((tab, index) => {
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[next].focus();
      activateTab(tabs[next].dataset.tab);
    });
  });
})();
