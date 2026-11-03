## Context

The blank OS page has one confirmed primary cause in `src/os/apps/TerminalApp.jsx`: its history-scroll effect implicitly returns the result of `scrollIntoView()`. In browsers where that method returns a Promise, React stores the Promise as an effect cleanup and later tries to call it when a command changes history or when Terminal closes. That throws during React’s commit phase and can unmount the entire application because there is no error boundary.

A second compatibility issue affects Browser-related terminal commands: `crypto.randomUUID()` can be unavailable in some browser/WebView contexts and currently throws without recovery.

## Fix

1. **Correct Terminal scrolling**
   - Replace the expression-bodied effect with a block-bodied effect that explicitly returns nothing.
   - Use a scroll-container ref with `scrollTop = scrollHeight`, following the proven pattern already used by `SerialMonitor.jsx`.
   - This prevents cleanup errors and avoids scrolling ancestor windows unexpectedly.

2. **Remove the fragile random UUID dependency**
   - Replace `crypto.randomUUID()` in `src/os/OSDesktop.jsx` with a `useRef` incrementing request ID.
   - Browser launch requests only need a changing identifier, not cryptographic randomness.

3. **Contain future app failures**
   - Add a reusable React error boundary around each OS app window.
   - If an individual app throws, keep the desktop, taskbar, and other windows alive and show a compact recovery panel inside the affected window.
   - Recovery will close/reopen or reset the failed app rather than blanking the entire page.
   - Add a route-level fallback around lazy OS View loading so stale/missing PWA chunks provide a reload action instead of an empty root.

4. **Regression verification**
   - Run `npm run lint` and `npm run build`.
   - In production preview, verify Terminal remains visible and the OS does not blank after:
     - `help`
     - `whoami`
     - unknown command
     - `clear`
     - `browser`
     - `browse https://example.com`
     - `serial`
     - `messenger`
     - closing Terminal
     - reopening Terminal
     - minimizing/restoring Terminal
   - Verify other windows and the taskbar stay interactive after Terminal closes.
   - Verify Browser commands still open/focus the Browser window.
   - Verify the PWA build still generates its service worker and lazy OS chunk without warnings.

## Main files

- Modify `src/os/apps/TerminalApp.jsx`
- Modify `src/os/OSDesktop.jsx`
- Add `src/Components/AppErrorBoundary.jsx` or an OS-specific equivalent
- Modify `src/App.jsx` / OS window rendering to use the error boundaries