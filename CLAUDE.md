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
