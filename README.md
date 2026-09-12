# Portfolio site

A single-page portfolio. Plain HTML, CSS and a little JavaScript — no build
step, no frameworks, nothing to install.

## The three files

| File | What it holds |
| --- | --- |
| `index.html` | All the words on the page |
| `styles.css` | All the colours, spacing and type |
| `script.js` | The character's moods and the footer year |

## Seeing it on your own computer

Double-click `index.html`. It opens in your browser. Edit a file, save, and
refresh the browser to see the change.

## Putting your own content in

Open `index.html` in any text editor. Everything you need to change is
ordinary text between the tags. Work top to bottom:

1. **Your name** — appears three times: the browser tab title, the top-left
   wordmark, and the big heading.
2. **The intro line** — the sentence starting "Senior product designer".
   Keep it near 25 words. The bolded part is the first thing people read.
3. **Previously at** — replace the three `Company` entries, or delete the
   whole `previously` block if it doesn't apply to you.
4. **Selected work** — three cards. Give each a real title, a two-sentence
   summary and a link. Three strong pieces beat eight weak ones.
5. **About and Contact** — replace the placeholder paragraphs and the
   email address.

## Changing the colours

Open `styles.css`. The first block, `:root`, lists every colour with a
comment saying what it does. Change a value there and it updates across the
whole page. A dark-mode version of the same list sits just below it.

## Design decisions worth keeping

- **Text contrast passes accessibility standards.** The muted grey used for
  body copy is dark enough to read comfortably. If you lighten it, check it
  against a contrast checker first.
- **Company names are text, not image files.** Screen readers and anyone
  who doesn't recognise a logo can still read them.
- **The page adapts down to phone width** and respects the visitor's
  reduced-motion and dark-mode settings.
- **Every interactive thing works with a keyboard**, with a visible focus
  ring.

## Publishing it

GitHub Pages hosts this for free. In the repository on GitHub, open
**Settings → Pages**, choose the branch, and save. A minute later the site
is live at a github.io address, and you can point your own domain at it.
