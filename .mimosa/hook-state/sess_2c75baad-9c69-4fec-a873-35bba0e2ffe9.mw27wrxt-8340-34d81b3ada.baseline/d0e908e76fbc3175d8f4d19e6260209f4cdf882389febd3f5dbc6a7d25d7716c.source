import { useEffect } from 'react';
import OSDesktop from '../os/OSDesktop';

function OSView({ onSwitchView }) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'JusteenDev OS';
    return () => { document.title = previousTitle; };
  }, []);

  return <OSDesktop onSwitchView={onSwitchView} />;
}

export default OSView;
