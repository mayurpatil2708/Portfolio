'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const DoodleJump = dynamic(() => import('./DoodleJump'), { ssr: false });

export default function GameWidget() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('game-mode', on);
    if (!on) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOn(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('game-mode');
    };
  }, [on]);

  return (
    <>
      <div className="game-toggle-wrap">
        <button
          className={`game-toggle${on ? ' game-toggle-on' : ''}`}
          onClick={() => setOn(!on)}
          aria-pressed={on}
          aria-label={on ? 'Exit game mode' : 'Enter game mode'}
        >
          <span className="game-toggle-dot" aria-hidden="true"></span>
          GAME MODE
        </button>
        <span
          className="game-info"
          title="Doodle Jump! Steer with ← → or A/D (hold the left/right half of the screen on touch). Land on platforms to bounce higher, grab springs for a boost, and climb to unlock dev ranks. Esc exits."
          tabIndex={0}
          role="note"
          aria-label="Game instructions: steer with arrow keys or by holding the left or right half of the screen. Climb platforms to unlock dev ranks. Escape exits."
        >
          i
        </span>
      </div>
      {on && <DoodleJump />}
    </>
  );
}
