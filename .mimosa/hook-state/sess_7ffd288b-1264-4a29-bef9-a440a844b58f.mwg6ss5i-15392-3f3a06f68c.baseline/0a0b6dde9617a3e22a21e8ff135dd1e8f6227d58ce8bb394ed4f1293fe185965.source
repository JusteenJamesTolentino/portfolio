import { useEffect, useRef, useState } from 'react';
import AboutApp from './apps/AboutApp';
import BrowserApp from './apps/BrowserApp';
import ContactApp from './apps/ContactApp';
import ProjectsApp from './apps/ProjectsApp';
import ServicesApp from './apps/ServicesApp';
import SettingsApp from './apps/SettingsApp';
import SkillsApp from './apps/SkillsApp';
import TerminalApp from './apps/TerminalApp';
import ToolsApp from './apps/ToolsApp';
import { OS_APPS } from './config/osApps';
import { WALLPAPERS, getWallpaper } from './config/wallpapers';
import useWindowManager from './hooks/useWindowManager';
import AnimatedBackground from './shell/AnimatedBackground';
import DesktopIcons from './shell/DesktopIcons';
import OSWindow from './shell/OSWindow';
import StartMenu from './shell/StartMenu';
import Taskbar from './shell/Taskbar';
import AppErrorBoundary from '../Components/AppErrorBoundary';

function OSDesktop({ onSwitchView }) {
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [wallpaperId, setWallpaperId] = useState('aurora');
  const [browserRequest, setBrowserRequest] = useState(null);
  const [animSpeed, setAnimSpeed] = useState(1);
  const [animDensity, setAnimDensity] = useState(1);
  const browserRequestId = useRef(0);
  const manager = useWindowManager();
  const wallpaper = getWallpaper(wallpaperId);
  const initialThemeColor = useRef(null);

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return undefined;
    if (initialThemeColor.current === null) initialThemeColor.current = meta.content;
    meta.content = wallpaper.palette.themeColor;
    return () => {
      if (initialThemeColor.current !== null) meta.content = initialThemeColor.current;
    };
  }, [wallpaper]);

  useEffect(() => {
    const close = event => { if (event.key === 'Escape') setStartMenuOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);

  const switchView = () => {
    setStartMenuOpen(false);
    onSwitchView();
  };

  const openBrowser = url => {
    browserRequestId.current += 1;
    setBrowserRequest({ id: browserRequestId.current, url: url ?? null });
    manager.openWindow('browser');
  };

  const renderApp = id => {
    const common = { openApp: manager.openWindow, openBrowser, switchView };
    const apps = {
      about: <AboutApp {...common} />,
      projects: <ProjectsApp />,
      skills: <SkillsApp />,
      services: <ServicesApp />,
      tools: <ToolsApp openBrowser={openBrowser} />,
      browser: <BrowserApp navigationRequest={browserRequest} />,
      contact: <ContactApp openBrowser={openBrowser} />,
      terminal: <TerminalApp {...common} />,
      settings: <SettingsApp wallpaperId={wallpaperId} setWallpaperId={setWallpaperId} animSpeed={animSpeed} setAnimSpeed={setAnimSpeed} animDensity={animDensity} setAnimDensity={setAnimDensity} resetLayout={manager.resetLayout} />,
    };
    return apps[id];
  };

  const taskbarAppClick = id => {
    const window = manager.state.windows[id];
    if (!window.open || window.minimized) manager.openWindow(id);
    else if (manager.state.activeId === id) manager.minimizeWindow(id);
    else manager.focusWindow(id);
  };

  const cycleWallpaper = () => {
    const index = WALLPAPERS.findIndex(item => item.id === wallpaperId);
    setWallpaperId(WALLPAPERS[(index + 1) % WALLPAPERS.length].id);
  };

  return (
    <main
      className={`fixed inset-0 overflow-hidden font-sans ${wallpaper.type === 'canvas' ? 'bg-slate-950' : wallpaper.className ?? 'bg-slate-950'}`}
      style={{ '--os-accent': wallpaper.palette.accent, '--os-accent-soft': wallpaper.palette.accentSoft }}
      onPointerDown={() => setStartMenuOpen(false)}
    >
      {wallpaper.type === 'canvas' && <AnimatedBackground wallpaperId={wallpaper.id} speed={animSpeed} density={animDensity} />}
      <div aria-hidden='true' className='absolute inset-0 bg-black/20' />
      <DesktopIcons apps={OS_APPS} onOpen={manager.openWindow} />
      <div className='absolute inset-0 bottom-14 z-10 overflow-hidden pointer-events-none'>
        {OS_APPS.map(app => {
          const window = manager.state.windows[app.id];
          if (!window.open) return null;
          return (
            <div key={app.id} className={window.minimized ? 'hidden' : 'contents'}>
              <OSWindow
                app={app}
                windowState={window}
                active={manager.state.activeId === app.id}
                onFocus={() => manager.focusWindow(app.id)}
                onClose={() => manager.closeWindow(app.id)}
                onMinimize={() => manager.minimizeWindow(app.id)}
                onMaximize={() => manager.toggleMaximize(app.id)}
                onMove={(x, y) => manager.moveWindow(app.id, x, y)}
              >
                <AppErrorBoundary key={`${app.id}-${window.open}`} appTitle={app.title} onReset={() => manager.closeWindow(app.id)}>
                  {renderApp(app.id)}
                </AppErrorBoundary>
              </OSWindow>
            </div>
          );
        })}
      </div>
      {startMenuOpen && <StartMenu apps={OS_APPS} onOpen={id => { manager.openWindow(id); setStartMenuOpen(false); }} onSwitchView={switchView} />}
      <Taskbar
        apps={OS_APPS}
        windows={manager.state.windows}
        activeId={manager.state.activeId}
        startMenuOpen={startMenuOpen}
        wallpaperName={wallpaper.name}
        onToggleStart={() => setStartMenuOpen(open => !open)}
        onAppClick={taskbarAppClick}
        onCycleWallpaper={cycleWallpaper}
      />
    </main>
  );
}

export default OSDesktop;
