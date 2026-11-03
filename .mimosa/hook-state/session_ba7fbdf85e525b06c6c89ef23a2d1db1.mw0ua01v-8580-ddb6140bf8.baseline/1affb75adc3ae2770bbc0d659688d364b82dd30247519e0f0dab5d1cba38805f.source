import { Component } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error(`OS app "${this.props.appTitle}" failed:`, error, info);
  }

  reset = () => {
    this.setState({ error: null });
    this.props.onReset?.();
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div role='alert' className='grid h-full min-h-52 place-items-center rounded-xl border border-red-400/20 bg-red-400/5 p-6 text-center'>
        <div>
          <span className='mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-400/10 text-red-300'>
            <AlertTriangle className='h-6 w-6' />
          </span>
          <h2 className='mt-4 text-sm font-bold'>{this.props.appTitle} stopped unexpectedly</h2>
          <p className='mt-2 max-w-sm text-xs leading-relaxed text-white/55'>
            The desktop is still running. Reset this application to try again.
          </p>
          <button type='button' className='btn btn-outline btn-sm mt-4 border-white/20' onClick={this.reset}>
            <RotateCcw className='h-4 w-4' /> Reset app
          </button>
        </div>
      </div>
    );
  }
}

export default AppErrorBoundary;
