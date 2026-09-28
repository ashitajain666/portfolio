// Only case restored from the back/forward cache still needs correcting; the
// head script handles a normal load before anything paints.
addEventListener('pageshow', e => { if (e.persisted && !location.hash) scrollTo(0, 0); });

// Shared case-study behaviour: reading progress, scroll-spy rail, reveal on scroll,
// and a generic "play when visible" hook for each page's own animated figures.
// ---- where the reader actually is ----
// The artifact host renders this page in a frame expanded to the full document
// height. That document never scrolls: scrollY stays 0 and position:sticky /
// fixed pin to a viewport as tall as the page, so the rail and nav would sit at
// the top and slide away. IntersectionObserver still knows what the reader can
// see (it clips against the top-level viewport, cross-origin included), so a
// full-height probe reports the visible band and everything is driven from that.
const view = (() => {
  const listeners = [];
  const docH = () => document.documentElement.scrollHeight;
  let top = 0, height = innerHeight;

  // A ladder of 200px blocks down the page. A single full-height probe will not
  // do: its visible ratio never changes while the page scrolls, so the observer
  // never fires again. Blocks shorter than the viewport enter and leave, and
  // their partial ratios report the visible band to within a couple of pixels.
  const H = 200;
  const vis = new Map();
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const i = +e.target.dataset.i;
      if (!e.isIntersecting || !e.intersectionRect.height) { vis.delete(i); return; }
      const base = i * H - e.boundingClientRect.top;
      vis.set(i, [base + e.intersectionRect.top, base + e.intersectionRect.bottom]);
    });
    if (!vis.size) return;
    const bands = [...vis.values()];
    const t = Math.min(...bands.map(v => v[0]));
    const b = Math.max(...bands.map(v => v[1]));
    top = Math.max(0, t);
    height = Math.max(1, b - t);
    listeners.forEach(f => f(top, height));
  }, { threshold: Array.from({ length: 101 }, (_, i) => i / 100) });

  let blocks = [];
  const build = () => {
    const want = Math.ceil(docH() / H);
    while (blocks.length > want) { const d = blocks.pop(); io.unobserve(d); d.remove(); }
    while (blocks.length < want) {
      const i = blocks.length;
      const d = document.createElement('div');
      d.setAttribute('aria-hidden', 'true');
      d.dataset.i = i;
      d.style.cssText = 'position:absolute;left:0;width:1px;visibility:hidden;pointer-events:none;top:' + (i * H) + 'px;height:' + H + 'px';
      document.body.appendChild(d);
      io.observe(d);
      blocks.push(d);
    }
  };
  build();
  addEventListener('resize', build);
  addEventListener('load', build);

  return { on(f) { listeners.push(f); f(top, height); } };
})();

// The rail rides at the middle of the screen. When the host frame is expanded to
// the full page height nothing is really scrolling in here, so sticky cannot do
// it — place the rail against the visible band the observer reports instead.
(() => {
  const rail = document.querySelector('.rail');
  const frame = document.querySelector('.frame');
  if (!rail || !frame) return;

  let home = 0;
  const measure = () => {
    const had = rail.style.transform;
    rail.style.transform = 'none';
    home = rail.getBoundingClientRect().top + scrollY;
    rail.style.transform = had;
  };
  measure();
  addEventListener('load', measure);
  addEventListener('resize', measure);

  view.on((top, height) => {
    const framed = innerHeight >= document.documentElement.scrollHeight - 4;
    document.documentElement.classList.toggle('framed', framed);
    if (!framed) { rail.style.transform = ''; return; }
    const middle = top + (height - rail.offsetHeight) / 2;
    const floor = frame.getBoundingClientRect().top + scrollY + 28;
    const ceil = frame.getBoundingClientRect().bottom + scrollY - rail.offsetHeight - 28;
    rail.style.transform = 'translateY(' + (Math.min(Math.max(middle, floor), ceil) - home) + 'px)';
  });
})();

// The rail sits at the middle of the screen and crosses the dark impact band, so
// it inverts to white for exactly the stretch where that band is behind it. This
// has to be measured, not observed: in a framed page an IntersectionObserver's
// rootMargin is a share of the frame (the whole page), not of what you can see.
(() => {
  const bands = [...document.querySelectorAll('.band')];
  if (!bands.length) return;
  view.on((top, height) => {
    const middle = top + height / 2;
    const over = bands.some(b => {
      const r = b.getBoundingClientRect();
      const bt = r.top + scrollY;
      return middle >= bt && middle <= bt + r.height;
    });
    document.documentElement.classList.toggle('on-dark', over);
  });
})();

// A deck that deals itself as you scroll. Each card's travel is tied to how far
// the deck has come up the screen, so the stack builds under the reader's thumb
// rather than on a timer. Scroll position comes from the same visible-band
// tracker the rail uses — the host frame never scrolls, so scrollY is useless.
(() => {
  const decks = [...document.querySelectorAll('[data-deck]')];
  if (!decks.length) return;
  const soft = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const groups = decks.map(d => ({ d, cards: [...d.children] }));
  const land = (c, t) => {
    c.style.opacity = t;
    c.style.transform = t >= 1 ? '' : 'translateY(' + ((1 - t) * 150).toFixed(1) + '%)';
  };
  if (soft) { groups.forEach(g => g.cards.forEach(c => land(c, 1))); return; }

  const clamp = v => Math.max(0, Math.min(1, v));
  const ease = t => 1 - Math.pow(1 - t, 3);

  view.on((top, height) => {
    groups.forEach(g => {
      const deckTop = g.d.getBoundingClientRect().top + scrollY;
      // 0 while the deck is still low on the screen, 1 once it has risen past the middle
      const p = clamp((top + height * 0.95 - deckTop) / (height * 0.9));
      g.cards.forEach((c, i) => land(c, ease(clamp((p - i * 0.17) / 0.34))));
    });
  });
})();

// Explorations. Two modes, both driven by native scroll so nothing lags:
// default: the phones scroll with the page and the pinned text swaps.
// data-expl="phone": the text scrolls and one pinned phone swaps its screen.
// Pinning is done by JS because sticky is inert inside the host frame.
(() => {
  const exs = [...document.querySelectorAll('[data-expl]')];
  if (!exs.length) return;
  const soft = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const narrow = matchMedia('(max-width: 760px)').matches;
  if (soft || narrow) return; // static fallback from CSS
  exs.forEach(ex => {
    const phoneMode = ex.dataset.expl === 'phone';
    const steps = [...ex.querySelectorAll('[data-step]')];
    const screens = phoneMode ? [...ex.querySelectorAll('.exscreen')] : [];
    const pinned = phoneMode ? ex.querySelector('.exph') : ex.querySelector('.exsteps');
    const wrap = phoneMode ? ex.querySelector('.exphwrap') : ex.querySelector('.extxtwrap');
    const markers = phoneMode ? steps : [...ex.querySelectorAll('.exph')];
    ex.classList.add('live', phoneMode ? 'pinphone' : 'pintext');

    let cur = -1;
    const setIdx = i => {
      if (i === cur) return;
      cur = i;
      steps.forEach((el, j) => el.classList.toggle('on', j === i));
      screens.forEach((el, j) => el.classList.toggle('on', j === i));
    };
    setIdx(0);

    let target = 0, y = 0, raf = 0;
    const settle = () => {
      y += (target - y) * 0.24;
      if (Math.abs(target - y) < 0.5) y = target;
      pinned.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
      if (y !== target) raf = requestAnimationFrame(settle); else raf = 0;
    };

    view.on((top, height) => {
      const wrapTop = wrap.getBoundingClientRect().top + scrollY;
      const travel = Math.max(0, wrap.offsetHeight - pinned.offsetHeight);
      target = Math.min(Math.max(top + (height - pinned.offsetHeight) / 2 - wrapTop, 0), travel);
      if (!raf) raf = requestAnimationFrame(settle);

      const middle = top + height / 2;
      let best = 0, bd = Infinity;
      markers.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const c = r.top + scrollY + r.height / 2 - (phoneMode ? 0 : 0);
        const d = Math.abs(c - middle);
        if (d < bd) { bd = d; best = i; }
      });
      setIdx(best);
    });
  });
})();

// Anchor navigation cannot scroll an ancestor frame on its own; scrollIntoView can.
document.querySelectorAll('.rail a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const target = document.querySelector(a.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  history.replaceState(null, '', a.getAttribute('href'));
}));

(() => {
  const soft = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- reading progress ----
  const bar = document.querySelector('.progress');
  if (bar) {
    view.on((top, height) => {
      const max = document.documentElement.scrollHeight - height;
      bar.style.setProperty('--p', max > 0 ? Math.min(1, top / max) : 0);
    });
  }

  // ---- rail scroll-spy ----
  const links = [...document.querySelectorAll('.rail a')];
  const sections = links
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  if (sections.length) {
    const docTop = el => el.getBoundingClientRect().top + scrollY;
    view.on((top, height) => {
      let active = 0;
      sections.forEach((s, i) => { if (docTop(s) <= top + height * 0.32) active = i; });
      links.forEach((a, i) => a.classList.toggle('on', i === active));
    });
  }

  // ---- reveal on scroll ----
  const rises = document.querySelectorAll('.rise');
  if (soft) {
    rises.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        obs.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    rises.forEach(el => io.observe(el));
  }

  // ---- run a figure's own animation once it is on screen ----
  const plays = document.querySelectorAll('[data-play]');
  if (plays.length) {
    if (soft) {
      plays.forEach(el => el.classList.add('play'));
    } else {
      const io2 = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          e.target.classList.add('play');
          obs.unobserve(e.target);
        });
      }, { threshold: 0.35 });
      plays.forEach(el => io2.observe(el));
    }
  }

  // ---- count-up on stat tiles ----
  document.querySelectorAll('.stat .n[data-to]').forEach(el => {
    const to = parseFloat(el.dataset.to);
    const suffix = el.dataset.suffix || '';
    const dp = (el.dataset.to.split('.')[1] || '').length;
    if (soft) { el.textContent = to.toFixed(dp) + suffix; return; }
    el.textContent = (0).toFixed(dp) + suffix;
    new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        const t0 = performance.now(), dur = 1100;
        const step = now => {
          const k = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - k, 3);
          el.textContent = (to * eased).toFixed(dp) + suffix;
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 }).observe(el);
  });
})();

// ================= interactive figures =================
(() => {
  const soft = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- lightbox: any .zoom link opens in-page, click to zoom at the pointer ----
  const zooms = [...document.querySelectorAll('a.zoom')];
  if (zooms.length) {
    const lb = document.createElement('div');
    lb.className = 'lb'; lb.hidden = true;
    lb.innerHTML = '<span class="hint">click to zoom &middot; esc to close</span><button class="x" aria-label="Close">&times;</button><div class="frame2"><img alt=""></div><div class="cap"></div>';
    document.body.appendChild(lb);
    const frame = lb.querySelector('.frame2'), img = lb.querySelector('img'), cap = lb.querySelector('.cap');
    let last = null;
    const close = () => { lb.classList.remove('in'); setTimeout(() => { lb.hidden = true; frame.classList.remove('zoomed'); document.body.style.overflow = ''; last && last.focus({ preventScroll: true }); }, soft ? 0 : 220); };
    zooms.forEach(a => a.addEventListener('click', e => {
      e.preventDefault(); last = a;
      const src = a.getAttribute('href'), im = a.querySelector('img');
      img.src = src; img.alt = im ? im.alt : '';
      const fc = a.closest('figure')?.querySelector('figcaption');
      cap.textContent = fc ? fc.textContent : '';
      lb.hidden = false; document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => lb.classList.add('in'));
      lb.querySelector('.x').focus({ preventScroll: true });
    }));
    frame.addEventListener('click', e => {
      const r = frame.getBoundingClientRect();
      img.style.setProperty('--ox', ((e.clientX - r.left) / r.width * 100) + '%');
      img.style.setProperty('--oy', ((e.clientY - r.top) / r.height * 100) + '%');
      frame.classList.toggle('zoomed');
    });
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    lb.querySelector('.x').addEventListener('click', close);
    addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) close(); });
  }

  // ---- compare slider ----
  document.querySelectorAll('.compare').forEach(c => {
    const range = c.querySelector('input[type=range]');
    const set = v => c.style.setProperty('--x', v + '%');
    set(range.value);
    range.addEventListener('input', () => set(range.value));
    // gentle nudge the first time it scrolls into view, so the affordance is obvious
    if (!soft) {
      new IntersectionObserver((es, obs) => es.forEach(e => {
        if (!e.isIntersecting) return; obs.unobserve(c);
        const t0 = performance.now();
        const step = now => {
          const k = Math.min(1, (now - t0) / 1400);
          const v = 50 + Math.sin(k * Math.PI * 2) * 14 * (1 - k);
          range.value = v; set(v);
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }), { threshold: 0.5 }).observe(c);
    }
  });

  // ---- hotspots ----
  document.querySelectorAll('.hot').forEach(h => {
    const pins = [...h.querySelectorAll('.pin')];
    const tips = [...h.querySelectorAll('.tip')];
    tips.forEach((t, i) => { const p = pins[i]; if (!p) return; t.style.setProperty('--x', p.style.getPropertyValue('--x')); t.style.setProperty('--y', p.style.getPropertyValue('--y')); });
    const show = i => {
      pins.forEach((p, j) => p.classList.toggle('open', j === i));
      tips.forEach((t, j) => t.classList.toggle('show', j === i));
    };
    pins.forEach((p, i) => {
      p.addEventListener('click', e => { e.preventDefault(); show(i); });
      p.addEventListener('mouseenter', () => show(i));
      p.addEventListener('focus', () => show(i));
    });
    h.addEventListener('mouseleave', () => show(-1));
    h.querySelector('img').addEventListener('click', () => show(-1));
    // open the first pin once, when the figure arrives, so people know they're clickable
    new IntersectionObserver((es, obs) => es.forEach(e => {
      if (!e.isIntersecting) return; obs.unobserve(h);
      setTimeout(() => { if (!pins.some(p => p.classList.contains('open'))) { show(0); setTimeout(() => { if (!h.matches(':hover')) show(-1); }, 2600); } }, 700);
    }), { threshold: 0.5 }).observe(h);
  });

  // ---- tabs ----
  document.querySelectorAll('.tabs').forEach(t => {
    const btns = [...t.querySelectorAll('.bar button')];
    const panes = [...t.querySelectorAll('.pane')];
    const go = i => {
      btns.forEach((b, j) => b.setAttribute('aria-selected', j === i));
      panes.forEach((p, j) => p.classList.toggle('on', j === i));
    };
    btns.forEach((b, i) => b.addEventListener('click', () => go(i)));
    go(0);
  });
})();
