// Pawchive Image Expander
// Swaps post thumbnails for the full-resolution files they link to.
// Runs only on individual post pages, never on creator profiles or search results.

(() => {
  'use strict';

  // /<service>/user/<creator>/post/<post>  (optionally /revision/<id>)
  const POST_PATH = /^\/[^/]+\/user\/[^/]+\/post\/[^/]+(?:\/revision\/[^/]+)?\/?$/;

  // Thumbnails on a post page are wrapped in a link to the original file.
  const THUMB_SELECTOR = 'a.fileThumb img, a.image-link img';

  const EXPANDED = 'pieExpanded'; // -> data-pie-expanded
  const STYLE_ID = 'pie-style';

  const isPostPage = () => POST_PATH.test(location.pathname);

  function fullSizeUrl(img) {
    const link = img.closest('a[href]');
    if (!link) return null;
    try {
      const url = new URL(link.getAttribute('href'), location.href);
      if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
      // Only follow links that actually point at a stored file.
      if (!/\/data\//.test(url.pathname)) return null;
      return url.href;
    } catch {
      return null;
    }
  }

  function expand(img) {
    if (img.dataset[EXPANDED]) return;

    const full = fullSizeUrl(img);
    if (!full) return;

    const thumb = img.currentSrc || img.getAttribute('src') || '';
    img.dataset[EXPANDED] = '1';

    // If the full file fails to load, put the thumbnail back.
    img.addEventListener('error', function revert() {
      img.removeEventListener('error', revert);
      if (thumb && img.src !== thumb) {
        img.dataset[EXPANDED] = 'failed';
        img.src = thumb;
      }
    });

    img.loading = 'eager';
    img.decoding = 'async';
    img.removeAttribute('srcset');
    img.setAttribute('data-src', full); // keep the site's lazy loader from reverting it
    img.src = full;
  }

  function expandWithin(root) {
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    if (root.matches(THUMB_SELECTOR)) expand(root);
    root.querySelectorAll(THUMB_SELECTOR).forEach(expand);
  }

  function addStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = 'img[data-pie-expanded="1"]{max-width:100%;height:auto;}';
    (document.head || document.documentElement).appendChild(style);
  }

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) m.addedNodes.forEach(expandWithin);
  });
  let observing = false;

  function update() {
    if (isPostPage()) {
      addStyle();
      expandWithin(document.body);
      if (!observing) {
        observer.observe(document.body, { childList: true, subtree: true });
        observing = true;
      }
    } else if (observing) {
      observer.disconnect();
      observing = false;
    }
  }

  // Pages are normally full loads, but also handle in-page navigation.
  let lastPath = location.pathname;
  const checkRoute = () => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      update();
    }
  };
  window.addEventListener('popstate', checkRoute);
  setInterval(checkRoute, 500);

  update();
})();
