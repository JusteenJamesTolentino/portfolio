import { useEffect } from 'react';
import GameShell from '../game/GameShell';
import '../styles/game.css';

function GameView({ onSwitchView }) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'JusteenDev // GAME';
    return () => { document.title = previousTitle; };
  }, []);

  return <GameShell onSwitchView={onSwitchView} />;
}

export default GameView;
