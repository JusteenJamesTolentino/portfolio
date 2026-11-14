## Context

The Web Page contact section currently repeats contact URLs in cards and includes a “Send me a message” mailto form. The requested design removes email composition from the Web Page and replaces it with an original social-focused panel that matches the portfolio’s black, charcoal, neumorphic UI. Existing Facebook, Instagram, and email destinations will remain clickable. Game Mode’s separate Comms form will remain unchanged.

## Implementation

1. **Replace the Web contact form and raw contact cards**
   - Update `src/Portfolio.jsx` to remove the `ContactForm` import and its Web Page usage.
   - Replace the current three raw URL cards and message form with one responsive social section:
     - A large **Social Bio** panel introducing Justeen as a Computer Engineering student, full-stack engineer, and hardware/IoT builder.
     - A compact availability/status treatment that fits the existing technical portfolio language.
     - An icon-first social launchpad for Facebook, Instagram, and Email.
   - Keep visible platform labels for clarity while making the icons the main visual element.
   - Reuse the existing `contactCards` destinations and their safe external-link behavior.

2. **Match the current Web Page visual system**
   - Add narrowly scoped styles in `src/styles/index.css` for the Social Bio and social links.
   - Use pure black backgrounds, charcoal surfaces, white type, neutral borders, soft neumorphic depth, and subtle glow/hover lift.
   - Make the layout one column on mobile and an asymmetric bio/social split on desktop.
   - Avoid copying the reference design directly while preserving its useful idea of a bio paired with prominent social actions.

3. **Preserve Hacker Mode compatibility**
   - Keep the section inside the existing `SwarmRebuild` tree.
   - Use `RebuildCard` and explicit unique `data-swarm-*` metadata for bio text, platform icons, labels, and links.
   - Ensure all new content rebuilds and erases correctly without form-preservation logic.

4. **Keep Game Mode unchanged**
   - Retain `src/Components/ContactForm.jsx` because `src/game/GameShell.jsx` still uses it in the Comms panel.
   - Do not alter Game Mode’s form or its independent styles.

5. **Clean unused Web-only styles**
   - Remove `.web-contact-form` selectors from `src/styles/index.css` once the Web Page no longer renders that wrapper.
   - Leave Game Mode’s `.game-form-frame` and form styling intact.

## Verification

- Run ESLint, all 15 swarm scheduler tests, and the Vite/PWA production build.
- Verify the Web Contact section contains no “Send me a message” form or editable fields.
- Verify Facebook, Instagram, and Email icons navigate to the existing `contactCards` destinations with correct external-link protection.
- Verify the Social Bio and links are responsive on phone, tablet, and desktop with no overlap or horizontal scrolling.
- Verify normal Web Page styling, keyboard focus states, and hover states.
- Verify Hacker Mode reconstructs the new social section correctly.
- Verify Game Mode Comms still retains its existing contact form.
- Do not commit, push, or deploy unless requested separately.