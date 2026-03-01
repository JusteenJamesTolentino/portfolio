import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Portfolio from './Portfolio';
import NotFoundPage from './routes/404';

function RouteGuard({ isAllowed, children }) {
  if (!isAllowed) {
    return <Navigate to="/unauthorized" replace />;
  }

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

function App() {
  const isAllowed = true;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
            <RouteGuard isAllowed={isAllowed}>
              <Portfolio />
            </RouteGuard>
          }/>

          
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
