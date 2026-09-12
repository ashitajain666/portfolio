/* Small touches only. The page works fine with JavaScript switched off. */

// Keep the copyright year current without anyone editing the file.
document.querySelectorAll('[data-year]').forEach(function (el) {
  el.textContent = String(new Date().getFullYear());
});

/* ------------------------------------------------------------
   The character's moods.
   Each entry sets the mouth shape and the caption underneath.
   Add your own — the button just walks through this list.
   ------------------------------------------------------------ */
var MOODS = [
  { caption: 'Say hello',            mouth: 'M96 118c8 8 20 8 28 0' },
  { caption: 'Thinking it over',     mouth: 'M96 120h28' },
  { caption: 'Mid&#8209;deadline',   mouth: 'M96 124c8-9 20-9 28 0' },
  { caption: 'Shipped it',           mouth: 'M92 114c10 14 26 14 36 0' },
  { caption: 'Ready for coffee',     mouth: 'M100 120c4 6 12 6 16 0' }
];

var art = document.querySelector('[data-companion]');
var button = document.querySelector('[data-companion-button]');
var caption = document.querySelector('[data-companion-name]');

if (art && button && caption) {
  var mouth = art.querySelector('.companion__mouth');
  var eyes = art.querySelector('.companion__eyes');
  var index = 0;

  button.addEventListener('click', function () {
    index = (index + 1) % MOODS.length;
    var mood = MOODS[index];

    mouth.setAttribute('d', mood.mouth);
    caption.innerHTML = mood.caption;

    // A quick blink, unless the visitor prefers less movement.
    var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!still) {
      eyes.style.transition = 'transform 0.12s ease';
      eyes.style.transformOrigin = '110px 92px';
      eyes.style.transform = 'scaleY(0.1)';
      window.setTimeout(function () { eyes.style.transform = 'scaleY(1)'; }, 120);
    }
  });
}
