// Smooth scrolling for the whole site.
// Mouse-wheel steps glide to a stop instead of jumping; in-page links glide to
// their target. Trackpads, touch and keyboard already move smoothly and are left
// to the browser, as is anyone who prefers less motion.
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const de = document.documentElement;
  const max = () => de.scrollHeight - innerHeight;
  let target = scrollY, cur = scrollY, raf = 0, mine = false;

  const step = () => {
    cur += (target - cur) * 0.12;
    if (Math.abs(target - cur) < 0.5) cur = target;
    mine = true;
    scrollTo({ top: cur, behavior: 'instant' });
    raf = cur !== target ? requestAnimationFrame(step) : 0;
  };
  const glideTo = y => {
    if (!raf) target = cur = scrollY;
    target = Math.max(0, Math.min(max(), y));
    if (!raf) raf = requestAnimationFrame(step);
  };

  // a scrollable box under the pointer (a table, a code panel) keeps its own scrolling
  const scrollsItself = (el, dy) => {
    for (; el && el !== document.body && el !== de; el = el.parentElement) {
      const oy = getComputedStyle(el).overflowY;
      if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight + 1) {
        if (dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) return true;
      }
    }
    return false;
  };

  if (!reduced && matchMedia('(pointer: fine)').matches) {
    addEventListener('wheel', e => {
      if (e.ctrlKey || e.defaultPrevented || max() <= 0) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      // a trackpad already glides: small, frequent steps are left alone
      if (e.deltaMode === 0 && Math.abs(e.deltaY) < 40) { if (!raf) target = cur = scrollY; return; }
      if (e.target.closest && e.target.closest('.gatewrap, [data-native-scroll]')) return;
      if (scrollsItself(e.target, e.deltaY)) return;
      e.preventDefault();
      if (!raf) target = cur = scrollY;
      glideTo(target + e.deltaY * (e.deltaMode === 1 ? 36 : e.deltaMode === 2 ? innerHeight : 1));
    }, { passive: false });
  }

  addEventListener('scroll', () => {
    if (mine) { mine = false; return; }
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    target = cur = scrollY;
  }, { passive: true });

  if (!reduced) de.style.scrollBehavior = 'smooth';
})();
