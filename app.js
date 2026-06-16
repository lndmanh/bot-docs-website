const TARGET_ORIGIN = 'https://nnsvn.me';
const TARGET_ROOT = '/botnoname';
const REDIRECT_DELAY_MS = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ? 80
  : 850;

function buildTargetUrl() {
  const normalizedPath = window.location.pathname.replace(/^\/+/, '');
  const slug = normalizedPath === '' || normalizedPath === 'index.html' ? '' : normalizedPath;
  const target = new URL(TARGET_ORIGIN);

  target.pathname = slug ? `${TARGET_ROOT}/${slug}` : `${TARGET_ROOT}/`;
  target.search = window.location.search;
  target.hash = window.location.hash;

  return target.toString();
}

function hydratePage(targetUrl) {
  const targetUrlNodes = document.querySelectorAll('[data-target-url]');
  const sourcePathNodes = document.querySelectorAll('[data-source-path]');
  const canonicalNodes = document.querySelectorAll('[data-canonical]');

  targetUrlNodes.forEach((node) => {
    node.textContent = targetUrl;
  });

  sourcePathNodes.forEach((node) => {
    node.textContent = window.location.pathname || '/';
  });

  canonicalNodes.forEach((node) => {
    if ('href' in node) {
      node.href = targetUrl;
    } else if (node.getAttribute) {
      node.setAttribute('content', targetUrl);
    }
  });

  document.querySelectorAll('[data-cta]').forEach((node) => {
    node.setAttribute('href', targetUrl);
  });
}

function startRedirect() {
  const targetUrl = buildTargetUrl();
  hydratePage(targetUrl);

  if (window.location.href === targetUrl) {
    return;
  }

  window.setTimeout(() => {
    window.location.replace(targetUrl);
  }, REDIRECT_DELAY_MS);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startRedirect, { once: true });
} else {
  startRedirect();
}