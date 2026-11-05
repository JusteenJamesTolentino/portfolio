import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import AppErrorBoundary from './Components/AppErrorBoundary';
import Portfolio from './Portfolio';
import ReloadPrompt from './Components/ReloadPrompt';
import ViewChooser from './Components/ViewChooser';
import useOsViewEligibility from './hooks/useOsViewEligibility';
import SerialMonitor from './routes/SerialMonitor';
import Messenger from './routes/Messenger';
import NotFoundPage from './routes/404';
import { clearViewPreference, getViewPreference, setViewPreference } from './utils/viewPreference';

const OSView = lazy(() => import('./routes/OSView'));

function RouteGuard({ isAllowed, children }) {
  if (!isAllowed) return <Navigate to="/unauthorized" replace />;
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

function Home({ setChooserOpen }) {
  const navigate = useNavigate();
  const osEligible = useOsViewEligibility();
  const [choice, setChoice] = useState(() => getViewPreference());
  const [chooserMode, setChooserMode] = useState('choose');
  const savedOsRejected = choice === 'os' && !osEligible;
  const chooserOpen = choice === null || savedOsRejected;

  useEffect(() => {
    setChooserOpen(chooserOpen);
  }, [chooserOpen, setChooserOpen]);

  if (choice === 'os' && osEligible) return <Navigate to="/osview" replace />;

  const chooseWeb = () => {
    setViewPreference('web');
    setChoice('web');
    setChooserOpen(false);
  };

  const chooseOs = () => {
    if (!osEligible) {
      setChooserMode('rejected');
      return;
    }
    setViewPreference('os');
    setChooserOpen(false);
    navigate('/osview', { replace: true });
  };

  const switchView = () => {
    clearViewPreference();
    setChoice(null);
    setChooserMode('choose');
    setChooserOpen(true);
  };

  const backToChoices = () => {
    clearViewPreference();
    setChoice(null);
    setChooserMode('choose');
  };

  return (
    <>
      <Portfolio onSwitchView={switchView} viewChooserOpen={chooserOpen} />
      {chooserOpen && (
        <ViewChooser
          mode={savedOsRejected ? 'rejected' : chooserMode}
          onChooseWeb={chooseWeb}
          onChooseOs={chooseOs}
          onBack={backToChoices}
        />
      )}
    </>
  );
}

function OsRoute({ setChooserOpen }) {
  const navigate = useNavigate();
  const osEligible = useOsViewEligibility();

  useEffect(() => {
    setChooserOpen(!osEligible);
  }, [osEligible, setChooserOpen]);

  const chooseWeb = () => {
    setViewPreference('web');
    setChooserOpen(false);
    navigate('/', { replace: true });
  };

  const backToChoices = () => {
    clearViewPreference();
    setChooserOpen(true);
    navigate('/', { replace: true });
  };

  if (!osEligible) {
    return <ViewChooser mode='rejected' onChooseWeb={chooseWeb} onBack={backToChoices} />;
  }

  return (
    <AppErrorBoundary appTitle='OS View' onReset={() => window.location.reload()}>
      <Suspense fallback={<div className='grid min-h-screen place-items-center bg-slate-950 text-white'><span className='loading loading-spinner loading-lg'></span></div>}>
        <OSView onSwitchView={() => navigate('/', { replace: true })} />
      </Suspense>
    </AppErrorBoundary>
  );
}

function App() {
  const isAllowed = true;
  const [chooserOpen, setChooserOpen] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RouteGuard isAllowed={isAllowed}><Home setChooserOpen={setChooserOpen} /></RouteGuard>} />
        <Route path="/osview" element={<OsRoute setChooserOpen={setChooserOpen} />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/serialmonitor" element={<SerialMonitor />} />
        <Route path="/serialmonitor/messenger" element={<Messenger />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ReloadPrompt hidden={chooserOpen} />
    </BrowserRouter>
  );
}

export default App
