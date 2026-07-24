'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface Platform {
  id: number;
  x: number;
  y: number;
  width: number;
}

const GRAVITY = 1500;
const BOUNCE_VELOCITY = 620;
const MOVE_SPEED = 220;
const PLAYER_SIZE = 30;
const PLATFORM_HEIGHT = 10;
const PLATFORM_WIDTH_MIN = 90;
const PLATFORM_WIDTH_MAX = 150;
const GAP_MIN = 40;
const GAP_MAX = 70;
const METERS_PER_PX = 0.1;

export default function GameMode() {
  const [active, setActive] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [heightM, setHeightM] = useState(0);
  const [bestM, setBestM] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [platforms, setPlatforms] = useState<Platform[]>([]);

  const nextIdRef = useRef(0);
  const player = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const cameraY = useRef(0);
  const keys = useRef<Record<string, boolean>>({});
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const viewportRef = useRef({ w: 0, h: 0 });
  const platformsDataRef = useRef<Platform[]>([]);
  const gameOverRef = useRef(false);
  const lastDisplayedHeight = useRef(-1);

  const playerElRef = useRef<HTMLDivElement | null>(null);
  const worldElRef = useRef<HTMLDivElement | null>(null);
  const panelElRef = useRef<HTMLDivElement | null>(null);

  const makePlatform = useCallback((y: number, w: number): Platform => {
    const width =
      PLATFORM_WIDTH_MIN + Math.random() * (PLATFORM_WIDTH_MAX - PLATFORM_WIDTH_MIN);
    const x = Math.random() * Math.max(0, w - width);
    return { id: nextIdRef.current++, x, y, width };
  }, []);

  const resetGame = useCallback(() => {
    const w = panelElRef.current?.clientWidth || 320;
    const h = panelElRef.current?.clientHeight || 480;
    viewportRef.current = { w, h };

    const initial: Platform[] = [];
    let y = 40;
    initial.push({ id: nextIdRef.current++, x: w / 2 - 55, y, width: 110 });
    for (let i = 0; i < 60; i++) {
      y += GAP_MIN + Math.random() * (GAP_MAX - GAP_MIN);
      initial.push(makePlatform(y, w));
    }
    platformsDataRef.current = initial;
    setPlatforms(initial);

    player.current = {
      x: w / 2 - PLAYER_SIZE / 2,
      y: 40 + PLATFORM_HEIGHT,
      vx: 0,
      vy: BOUNCE_VELOCITY,
    };
    cameraY.current = 0;
    lastDisplayedHeight.current = -1;
    setHeightM(0);
    gameOverRef.current = false;
    setGameOver(false);
  }, [makePlatform]);

  const extendPlatforms = useCallback(() => {
    const list = platformsDataRef.current;
    const w = viewportRef.current.w;
    const last = list[list.length - 1];
    if (!last) return;
    if (player.current.y > last.y - 800) {
      const added: Platform[] = [];
      let y = last.y;
      for (let i = 0; i < 20; i++) {
        y += GAP_MIN + Math.random() * (GAP_MAX - GAP_MIN);
        added.push(makePlatform(y, w));
      }
      platformsDataRef.current = [...list, ...added];
      setPlatforms(platformsDataRef.current);
    }
  }, [makePlatform]);

  useEffect(() => {
    if (!active) return;

    resetGame();

    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
      if (gameOverRef.current && (e.key === ' ' || e.key === 'Enter')) {
        resetGame();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    const tick = (time: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = time;
      const dt = Math.min(0.032, (time - lastTimeRef.current) / 1000);
      lastTimeRef.current = time;

      if (!gameOverRef.current) {
        const p = player.current;
        const { w, h } = viewportRef.current;

        if (keys.current['arrowleft'] || keys.current['a']) p.vx = -MOVE_SPEED;
        else if (keys.current['arrowright'] || keys.current['d']) p.vx = MOVE_SPEED;
        else p.vx = 0;

        p.x += p.vx * dt;
        if (p.x < -PLAYER_SIZE) p.x = w;
        if (p.x > w) p.x = -PLAYER_SIZE;

        p.vy -= GRAVITY * dt;
        const prevY = p.y;
        p.y += p.vy * dt;

        if (p.vy <= 0) {
          for (const plat of platformsDataRef.current) {
            const withinX =
              p.x + PLAYER_SIZE > plat.x && p.x < plat.x + plat.width;
            const crossed = prevY >= plat.y && p.y <= plat.y;
            if (withinX && crossed) {
              p.y = plat.y;
              p.vy = BOUNCE_VELOCITY;
              break;
            }
          }
        }

        if (p.y - cameraY.current > h * 0.55) {
          cameraY.current = p.y - h * 0.55;
        }

        if (p.y - cameraY.current < -80) {
          gameOverRef.current = true;
          setGameOver(true);
          setBestM((b) => Math.max(b, Math.floor(p.y * METERS_PER_PX)));
        }

        const m = Math.max(0, Math.floor(p.y * METERS_PER_PX));
        if (m !== lastDisplayedHeight.current) {
          lastDisplayedHeight.current = m;
          setHeightM(m);
        }

        extendPlatforms();

        if (playerElRef.current) {
          playerElRef.current.style.left = `${p.x}px`;
          playerElRef.current.style.bottom = `${p.y - cameraY.current}px`;
        }
        if (worldElRef.current) {
          worldElRef.current.style.transform = `translateY(${cameraY.current}px)`;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = null;
    };
  }, [active, resetGame, extendPlatforms]);

  return (
    <>
      <div className="game-mode-toggle-wrap">
        <button
          className="game-mode-toggle"
          onClick={() => setActive((a) => !a)}
          aria-pressed={active}
        >
          <span
            className={`game-mode-dot ${active ? 'game-mode-dot-on' : ''}`}
          />
          Game Mode
        </button>
        <div className="game-mode-info">
          <button
            className="game-mode-info-btn"
            onClick={() => setShowInfo((s) => !s)}
            aria-label="Game mode info"
          >
            i
          </button>
          {showInfo && (
            <div className="game-mode-tooltip">
              Arrow keys or A / D to move. Your character bounces
              automatically — just steer between platforms and climb as
              high as you can.
            </div>
          )}
        </div>
      </div>

      {active && (
        <div className="game-mode-overlay" ref={panelElRef}>
          <div className="game-mode-height">{heightM} m</div>
          <div className="game-mode-world" ref={worldElRef}>
            {platforms.map((p) => (
              <div
                key={p.id}
                className="game-mode-platform"
                style={{ left: p.x, bottom: p.y, width: p.width }}
              />
            ))}
          </div>
          <div className="game-mode-player" ref={playerElRef}>
            <span className="game-mode-player-eye game-mode-player-eye-l" />
            <span className="game-mode-player-eye game-mode-player-eye-r" />
            <span className="game-mode-player-antenna" />
          </div>
          {gameOver && (
            <div className="game-mode-gameover">
              <p className="game-mode-gameover-title">Game over</p>
              <p className="game-mode-gameover-height">Reached {heightM} m</p>
              {bestM > 0 && (
                <p className="game-mode-gameover-best">Best: {bestM} m</p>
              )}
              <button className="game-mode-restart" onClick={resetGame}>
                Try again
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
