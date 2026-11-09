## Context

Visitors should no longer be interrupted by an experience chooser. The normal Web Page should open immediately and remain the default experience. Switching experiences becomes optional through one **Modes** button and one **Modes** modal containing Hacker, OS, and Game modes.

## Implementation

1. **Open the Web Page by default**
   - Update `src/App.jsx` so `/` always renders the normal Web Page immediately on first visit and reload.
   - Remove startup chooser behavior and stop using a saved session choice to redirect visitors away from `/`.
   - Keep `/gameview` and `/osview` available as direct routes.

2. **Create one optional Modes modal**
   - Rework `src/Components/ViewChooser.jsx` as a Modes modal opened only from a Modes button.
   - Include these options:
     - Hacker Mode
     - Game Mode
     - OS Mode
   - Also include a normal Web Page option only when needed to return from Hacker, Game, or OS mode.
   - Selecting Hacker Mode enables the existing swarm reconstruction on `/`.
   - Selecting Game or OS uses the existing routes.
   - Selecting Web Page returns to `/` and disables Hacker Mode.
   - Preserve the existing unsupported-device message when OS Mode is selected below 1024px.

3. **Replace View terminology and centralize mode controls**
   - In `src/Portfolio.jsx`, rename the desktop `View` button and mobile `Switch View` item to `Modes`, including accessibility text and swarm metadata.
   - Remove the standalone Hacker Mode toggle from desktop and mobile navigation.
   - Move Hacker Mode state to `src/App.jsx` so the Modes modal can enable or disable it while preserving Escape and FullSwarm HUD Stop behavior.
   - Rename the Game and OS switch controls to `MODES` and have them open the same Modes modal.

4. **Clean up obsolete UI and copy**
   - Remove the unused `src/Components/HackerModeToggle.jsx` and only its toggle-specific CSS from `src/styles/index.css`.
   - Update Game loading tips and README text so they direct users to the Modes modal rather than the old navbar toggle or startup chooser.

## Verification

- Run ESLint, scheduler tests, and the Vite/PWA production build.
- Verify `/` opens Web Page mode immediately with no startup chooser, including a clean browser session and reload.
- Verify desktop and mobile navigation show one Modes button and no separate Hacker Mode control.
- Verify the optional Modes modal switches correctly among Web, Hacker, Game, and OS experiences.
- Verify Game and OS can reopen Modes and return to the default Web Page.
- Verify unsupported mobile OS selection still shows the larger-screen message.
- Verify Hacker reconstruction, Escape/Stop exits, PWA update prompts, and direct routes still work.
- Do not commit, push, or deploy unless requested separately.