## Context

Redesign **Web Page View only** so the Hero also contains the About content and technology stack shown in the reference image. Remove the separate About section, add a seamless left-to-right icon marquee, and use neumorphic styling in Normal mode. Preserve Hacker Mode, OS View, PWA behavior, and the viewport build/erase system.

## Implementation

1. **Merge About into Hero**
   - Update `src/Portfolio.jsx` so the Hero contains:
     - Existing intro/typewriter and quote
     - JusteenDev logo
     - Current bio and freelance copy from `portfolioProfile`
     - Moving technology icon strip at the bottom
   - Remove the separate About section.
   - Keep `min-h-screen`/`min-h-dvh` while allowing the merged Hero to grow naturally on short screens.
   - Change navbar About links from `#about` to `#home`, the merged Hero anchor.
   - Renumber Contact from section 05 to 04.

2. **Add accurate technology icons**
   - Reuse the installed `react-icons` package:
     - React: `SiReact`
     - Node.js: `SiNodedotjs`
     - Firebase: `SiFirebase`
     - Tailwind CSS: `SiTailwindcss`
     - JavaScript: `SiJavascript`
     - Python: `SiPython`
     - C++: `SiCplusplus`
     - C: `SiC`
     - Java: `FaJava`
   - Use a styled `C#` monogram tile instead of a misleading .NET or Sharp logo.
   - Keep technology strings in `portfolioProfile.js` unchanged so OS View is unaffected.

3. **Create a left-to-right marquee**
   - Add a Web-only `TechStackMarquee` component with two identical sets for a seamless loop.
   - Animate from left to right, pause on hover/focus, and hide the duplicate from assistive technology.
   - Under reduced motion, stop animation, hide the duplicate, and present a centered, wrapping list.
   - Keep the strip noninteractive unless links are intentionally added later.

4. **Preserve Full Swarm grouping**
   - Keep the Hero section as a structural surface.
   - Use distinct rebuild groups for Hero intro, moved About content, and the technology strip so a tall combined Hero does not erase/build as one oversized block.
   - Keep unique explicit public `data-swarm-text` and image/control IDs.
   - In Hacker Mode, stop the marquee and capture only the primary icon set; keep the duplicate hidden to avoid doubled tasks and moving measurements.
   - No scheduler or scene redesign is needed.

5. **Add Normal-only neumorphism**
   - Define Web normal-mode tokens and styles under `.web-portfolio[data-hacker-mode="off"]` only.
   - Apply raised surfaces and soft dual shadows to cards, navbar, buttons, contact form, and technology tiles.
   - Use inset shadows for inputs and pressed controls, while preserving accessible focus rings.
   - Keep Hacker Mode’s existing green grid and reconstruction styling unchanged.
   - Do not leak styles into OS View or Serial/Messenger routes.

6. **Documentation and verification**
   - Update README feature and Hacker Mode descriptions for the merged Hero/About and moving icon rail.
   - Run scheduler tests, lint, PWA build, and whitespace checks.
   - Verify desktop/mobile/short-landscape layout, `#home` navigation, seamless left-to-right movement, hover/focus pause, reduced motion, and no horizontal page overflow.
   - Verify Normal neumorphism and unchanged Hacker/OS appearance.
   - Verify Full Swarm rebuild/erase groups, Replay, Go Live, contact draft preservation, and normal card culling.
   - Do not commit, push, or deploy.