/**
 * Shared site chrome: mobile navigation, the active nav link and the footer
 * year. The header and footer markup itself lives in each page so the site
 * keeps its navigation and source notes even if scripts are unavailable.
 */

export function initNav() {
  const root = document.documentElement;
  root.classList.add('js');

  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');

  if (toggle && nav) {
    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };

    toggle.addEventListener('click', () => {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', (event) => {
      if (event.target instanceof Element && event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) setOpen(false);
    });
  }

  const page = window.location.pathname.split('/').pop() || 'index.html';
  for (const link of document.querySelectorAll('.site-nav a')) {
    if (link.getAttribute('href') === page) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  }

  const year = document.getElementById('footer-year');
  if (year) year.textContent = String(new Date().getFullYear());
}
