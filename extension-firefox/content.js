// ---- Route detection ----
const POST_RE = /^\/[^/]+\/user\/\d+\/post\/\d+(?:\/|$)/;
const isPostUrl = (path = location.pathname) => POST_RE.test(path);

// Track current URL to detect SPA route changes
let lastHref = location.href;
let observing = false;

// ---- Image expansion ----
function expandImage(img) {
  if (!isPostUrl()) return;
  if (img.dataset.expandedThumb === '1') return;

  const raw = img.getAttribute('data-src') || img.getAttribute('src');
  if (!raw) return;

  try {
    const url = new URL(raw, window.location.origin);
    if (!/\/thumbnail\//.test(url.pathname)) return;

    url.pathname = url.pathname.replace('/thumbnail', '');
    url.host = url.host.replace(/^img\./, '');
    url.protocol = 'https:';

    const fullUrl = url.toString();
    img.src = fullUrl;
    img.setAttribute('data-src', fullUrl);
    img.loading = 'eager';
    img.dataset.expandedThumb = '1';
  } catch (_) { /* ignore */ }
}

function expandAll() {
  if (!isPostUrl()) return;
  const selector = 'img[src*="/thumbnail/"], img[data-src*="/thumbnail/"]';
  document.querySelectorAll(selector).forEach(expandImage);
}

// ---- Observer ----
const observer = new MutationObserver((mutations) => {
  if (!isPostUrl()) return;
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType !== 1) continue;
      if (node.tagName === 'IMG') expandImage(node);
      else if (node.querySelectorAll) {
        node.querySelectorAll('img[src*="/thumbnail/"], img[data-src*="/thumbnail/"]').forEach(expandImage);
      }
    }
  }
});

// ---- Route-change handler ----
function handleRouteChange() {
  const onPost = isPostUrl();
  if (onPost) {
    expandAll();
    if (!observing) {
      observer.observe(document.body, { childList: true, subtree: true });
      observing = true;
    }
  } else if (observing) {
    observer.disconnect();
    observing = false;
  }
}

// ---- URL polling every 100 ms ----
setInterval(() => {
  if (location.href !== lastHref) {
    lastHref = location.href;
    handleRouteChange();
  }
}, 1);

// Initial run
handleRouteChange();