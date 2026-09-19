# Design rules for this project

## Never make it look like AI slop

Ashita's standing instruction. The individual patterns below are not always
wrong, but the *combination* is what makes an interface look generated, and
anything on this list needs a real reason before it goes in.

**Colour and surface**
- Purple / blue / pink gradient heroes. Gradient buttons. Animated gradient text.
- Blurred gradient blobs behind content. Abstract 3D blobs, floating spheres,
  liquid chrome.
- Glassmorphism: frosted cards, heavy transparency, glowing borders.
- Neon borders, glow-on-hover with no functional reason.
- Rainbow status colours used decoratively (purple = AI, pink = insight).
  Colour must encode information, not mood.

**Shape and layout**
- Pill-shaped everything — buttons, cards, tabs, inputs, badges.
- Excessively rounded cards (24–32px) with every fact isolated in its own
  floating card. Card inside card inside card.
- Infinite whitespace: beautiful in a screenshot, useless in use.
- Typography turned up to 11 — 64–96px headlines, giant numbers, tiny labels.
- Oversized icon + title + description cards in a 3- or 4-up row.
- Sidebar + "Good morning 👋" + four metric cards + sparklines + insights card
  + activity feed. The generated-SaaS-dashboard layout.

**Content and ornament**
- Sparkle icons (✨) for AI actions. Emoji in professional interfaces
  (🚀 🤖 💡 ⚡).
- Decorative mini charts and sparklines with no axis or context. Fake activity
  feeds. Fake team members and AI-generated avatars. Robot illustrations.
- Fake terminal decoration (`> initializing_agent...`).
- Oversized metrics with tiny labels and no information density.
- "Powered by AI" / "NEW AI" / "SMART" badges. Magic Edit, Magic Write,
  Magic anything. Copilot bolted onto every noun.
- Random bold words mid-sentence.
- AI confidence meters ("98% confident") with no explanation of the number.
- Generic "AI Insight" panels: lightbulb, vague sentence, no evidence.
- Generic onboarding carousels (Discover / Create / Collaborate / Grow).
- Empty states with a giant illustration and an inspirational line.

**Interaction**
- Excessive micro-animation: everything fades, slides and scales; loading
  states for trivial actions. Dribbble prototype, not software.
- Turning every surface into a chat box. Search → chat, settings → chat,
  forms → chat. A floating glowing assistant orb bottom-right.
- Generic AI chat input: big rounded rectangle, "Ask anything…", sparkle icon,
  prompt-suggestion chips underneath ("Summarize this", "Make it better").
- Agent orchestration diagrams (Planner → Researcher → Executor) with glowing
  arrows — more impressive than useful.
- Lucide-style line icons sprinkled one per card, chosen for decoration.

## What to do instead

- Strong information hierarchy and purposeful density.
- Few decorative elements; restrained, consistent radii.
- Animation only where it carries meaning.
- Real data, not decorative charts.
- Plain terminology instead of "magic" and "AI-powered".
- Deliberate typography. Fewer cards, fewer gradients.
- Icons used semantically or not at all.
- A visual identity specific to this subject.

**The test:** if you could swap the company name, change the accent colour, and
sell the same screen to 500 other startups, it is slop. Start again.

---

# Second list: where slop shows up

The first four groups are tells of AI-generated interfaces. The last is slop in
how AI features get added to products.

**Visual styling**
- Purple-to-blue or indigo-to-pink gradients on hero text, buttons and
  backgrounds, with no connection to the brand.
- Glassmorphism cards with backdrop blur floating over blurry gradient orbs.
- Inter or a system sans everywhere, at a single weight, with no typographic
  hierarchy beyond size.
- Uniform rounded-2xl corners on every element, from buttons to modals to
  avatars.
- Soft glows, neon borders and drop shadows stacked on the same component.
- Dark mode with near-black backgrounds and low-contrast grey text that fails
  WCAG.
- Emoji or generic Lucide icons as section markers in place of real visual
  language.

**Layout**
- The default landing stack: centered hero, three feature cards, logo strip,
  testimonials, pricing tiers, FAQ accordion, footer.
- Everything centered, including long paragraphs that should be left-aligned.
- Three-column card grids where each card has an icon, a bold two-word title
  and one vague sentence.
- Bento grids for content with no reason to be tiled.
- Identical vertical spacing between every section, so nothing groups and
  nothing breathes.
- Dashboards full of stat cards showing "+12.5%" trends that answer no real
  question.

**Copy and content**
- Headlines like "Unlock the power of…", "Supercharge your workflow",
  "Seamless, intuitive, powerful."
- Placeholder names and data that look real but are generic (Sarah Chen,
  Acme Corp, $12,345).
- Fake testimonials and invented metrics ("Trusted by 10,000+ teams").
- Feature descriptions that restate the title in more words.
- Button labels like "Get Started" everywhere, regardless of the action.

**Components and interaction**
- Hover effects on non-interactive elements — cards that lift but don't link.
- Scroll-triggered fade-ups on every section.
- Toasts, badges and "New" pills used decoratively.
- Tabs, toggles and dropdowns with no defined empty, loading, error or edge
  states.
- Forms that look complete but lack validation, helper text or accessible
  labels.
- Components that look consistent but come from no real system, so padding and
  sizes drift between screens.

**AI feature slop in products**
- The sparkle icon as the universal "AI lives here" signifier.
- A chat panel bolted onto a workflow better served by inline assistance.
- "Ask AI anything" empty states with no guidance on what the system can do.
- Streaming text animations as theatre, even for short deterministic output.
- Confident outputs with no sources, confidence cues or path to verify.
- "Summarize" and "Improve with AI" buttons everywhere, with no job to be done.
- Missing undo, diff or review steps before AI changes are applied.

The common thread is surface polish without decisions behind it. Everything
looks finished, but nothing reflects a specific user, constraint or brand.

---

# Writing rules

## No metaphors. Plain English.

Ashita's standing instruction, and it applies to every word on the site:
headlines, body copy, captions, button labels, alt text.

- Say the thing literally. No figures of speech, no imagery, no analogies.
- Avoid: "stood between", "the room", "burn them out", "the experts were the
  product", "a way in", "tension", "think of it as", "under the reader's thumb".
- Prefer the ordinary word: problem, not tension. Cost, not price tag. Limit,
  not ceiling. People did not interact, not "nobody spoke into the void".
- Short sentences. Concrete nouns. Ordinary verbs.
- Do not write a sentence for rhythm. If a clause carries no information,
  delete it.
- Copy should sound like someone explaining their work to a colleague, not
  like a brand voice.

Quotes attributed to a real person are left as written.
