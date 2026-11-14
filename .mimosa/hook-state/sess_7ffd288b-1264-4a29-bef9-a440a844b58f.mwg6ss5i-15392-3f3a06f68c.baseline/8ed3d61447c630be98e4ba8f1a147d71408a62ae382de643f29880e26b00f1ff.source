import { ArrowLeft, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <main className='not-found-page'>
      <div className='not-found-grid' aria-hidden='true' />
      <div className='not-found-scanlines' aria-hidden='true' />

      <section className='not-found-content' aria-labelledby='not-found-title'>
        <p className='not-found-code'>ERROR // ROUTE_NOT_FOUND</p>
        <h1 id='not-found-title' className='not-found-glitch' data-text='404'>404</h1>
        <div className='not-found-divider' aria-hidden='true'>
          <span />
          <span />
          <span />
        </div>
        <h2 className='not-found-heading'>PAGE LOST IN THE GRID</h2>
        <p className='not-found-copy'>
          The route you requested does not exist or has moved outside the system.
          Return to the portfolio and continue exploring.
        </p>
        <Link to='/' className='not-found-home'>
          <Home className='h-5 w-5' aria-hidden='true' />
          Return to Web Page Mode
          <ArrowLeft className='h-4 w-4 rotate-180' aria-hidden='true' />
        </Link>
      </section>

      <p className='not-found-status' aria-hidden='true'>JUSTEENDEV.SYS // SIGNAL LOST</p>
    </main>
  );
}

export default NotFoundPage;
