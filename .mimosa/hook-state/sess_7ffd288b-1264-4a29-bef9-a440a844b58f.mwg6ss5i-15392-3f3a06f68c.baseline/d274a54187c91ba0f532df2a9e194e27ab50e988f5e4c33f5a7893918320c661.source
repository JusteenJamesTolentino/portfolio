import { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import AppErrorBoundary from './Components/AppErrorBoundary';
import Portfolio from './Portfolio';
import ReloadPrompt from './Components/ReloadPrompt';
import ViewChooser from './Components/ViewChooser';
import useOsViewEligibility from './hooks/useOsViewEligibility';
import SerialMonitor from './routes/SerialMonitor';
import Messenger from './routes/Messenger';
import NotFoundPage from './routes/404';

const OSView = lazy(() => import('./routes/OSView'));
const GameView = lazy(() => import('./routes/GameView'));

function RouteGuard({ isAllowed, children }) {
  if (!isAllowed) return <Navigate to='/unauthorized' replace />;
  return children;
}

function Unauthorized() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-base-200'>
      <div className='card bg-base-100 shadow-md'>
        <div className='card-body text-center'>
          <h1 className='card-title justify-center'>Unauthorized</h1>
          <p>You do not have permission to view this page.</p>
        </div>
      </div>
    </div>
  );
}

function Home({ hackerMode, modesOpen, onHackerModeChange, onOpenModes }) {
  return (
    <Portfolio
      hackerMode={hackerMode}
      viewChooserOpen={modesOpen}
      onHackerModeChange={onHackerModeChange}
      onSwitchView={onOpenModes}
    />
  );
}

function GameRoute({ onOpenModes }) {
  return (
    <AppErrorBoundary appTitle='Game Mode' onReset={() => window.location.reload()}>
      <Suspense fallback={<div className='grid min-h-screen place-items-center bg-black text-fuchsia-300'><span className='loading loading-spinner loading-lg'></span></div>}>
        <GameView onSwitchView={onOpenModes} />
      </Suspense>
    </AppErrorBoundary>
  );
}

function OsRoute({ onOpenModes }) {
  return (
    <AppErrorBoundary appTitle='OS Mode' onReset={() => window.location.reload()}>
      <Suspense fallback={<div className='grid min-h-screen place-items-center bg-slate-950 text-white'><span className='loading loading-spinner loading-lg'></span></div>}>
        <OSView onSwitchView={onOpenModes} />
      </Suspense>
    </AppErrorBoundary>
  );
}

function AppRoutes() {
  const isAllowed = true;
  const navigate = useNavigate();
  const osEligible = useOsViewEligibility();
  const [modesOpen, setModesOpen] = useState(false);
  const [chooserMode, setChooserMode] = useState('choose');
  const [hackerMode, setHackerMode] = useState(false);

  const openModes = () => {
    setChooserMode('choose');
    setModesOpen(true);
  };

  const closeModes = () => {
    setModesOpen(false);
    setChooserMode('choose');
  };

  const chooseWeb = () => {
    setHackerMode(false);
    closeModes();
    navigate('/', { replace: true });
  };

  const chooseHacker = () => {
    setHackerMode(true);
    closeModes();
    navigate('/', { replace: true });
  };

  const chooseGame = () => {
    setHackerMode(false);
    closeModes();
    navigate('/gameview');
  };

  const chooseOs = () => {
    if (!osEligible) {
      setChooserMode('rejected');
      return;
    }
    setHackerMode(false);
    closeModes();
    navigate('/osview');
  };

  const activeMode = location.pathname === '/gameview'
    ? 'game'
    : location.pathname === '/osview'
      ? 'os'
      : hackerMode
        ? 'hacker'
        : 'web';

  return (
    <>
      <Routes>
        <Route path='/' element={<RouteGuard isAllowed={isAllowed}><Home hackerMode={hackerMode} modesOpen={modesOpen} onHackerModeChange={setHackerMode} onOpenModes={openModes} /></RouteGuard>} />
        <Route path='/osview' element={osEligible ? <OsRoute onOpenModes={openModes} /> : <Navigate to='/' replace />} />
        <Route path='/gameview' element={<GameRoute onOpenModes={openModes} />} />
        <Route path='/unauthorized' element={<Unauthorized />} />
        <Route path='/serialmonitor' element={<SerialMonitor />} />
        <Route path='/serialmonitor/messenger' element={<Messenger />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>

      {modesOpen && (
        <ViewChooser
          mode={chooserMode}
          activeMode={activeMode}
          onChooseWeb={chooseWeb}
          onChooseHacker={chooseHacker}
          onChooseGame={chooseGame}
          onChooseOs={chooseOs}
          onBack={() => setChooserMode('choose')}
          onClose={closeModes}
        />
      )}

      <ReloadPrompt hidden={modesOpen} />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
