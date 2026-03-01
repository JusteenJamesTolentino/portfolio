import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-base-200'>
      <div className='card bg-base-100 shadow-md w-full max-w-md'>
        <div className='card-body text-center'>
          <h1 className='card-title justify-center text-3xl'>404</h1>
          <p>Page not found.</p>
          <div className='card-actions justify-center mt-2'>
            <Link to='/' className='btn btn-primary'>
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
