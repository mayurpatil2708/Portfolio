'use client';

import { useEffect, useRef, useState } from 'react';

/* Physics constants — logical CSS pixels, tuned for 60fps fixed steps */
const STEP_MS = 1000 / 60;
const GRAVITY = 0.42;
const JUMP_V = -11.5;
const SPRING_V = -19;
const MOVE_ACC = 0.55;
const FRICTION = 0.92;
const MAX_VX = 5.6;
const PW = 64; // platform size
const PH = 5;
const DW = 30; // jumper bounds
const DH = 36;

const MILESTONES: Array<[number, string]> = [
  [100, 'Intern'],
  [300, 'Junior Dev'],
  [600, 'Mid-Level Dev'],
  [1000, 'Senior Dev'],
  [1500, 'Staff Engineer'],
  [2200, 'Principal Engineer'],
  [3000, '10x Doodler'],
];

const BEST_KEY = 'doodle-jump-best';

/* Pixel-art jumper: 1 body, 2 eye, 3 accent (antenna + mouth) */
const SPRITE = [
  '....33....',
  '....3.....',
  '..111111..',
  '.11111111.',
  '1112211221',
  '1112211221',
  '1111111111',
  '.11133111.',
  '.11111111.',
  '..111111..',
  '..11..11..',
  '.111..111.',
];
const PIXEL = 3;

type Phase = 'ready' | 'playing' | 'paused' | 'over';

interface Platform {
  x: number;
  y: number;
  type: 'static' | 'moving' | 'breakable';
  vx: number;
  spring: number; // x offset of spring on platform, -1 = none
  springT: number;
  broken: boolean;
  fallV: number;
  rot: number;
}

interface Theme {
  accent: string;
  moving: string;
  breakable: string;
  spring: string;
  body: string;
  eye: string;
}

interface GameState {
  w: number;
  h: number;
  x: number;
  y: number;
  prevY: number;
  vx: number;
  vy: number;
  facing: 1 | -1;
  squash: number;
  camY: number;
  startY: number;
  alt: number;
  nextMilestone: number;
  platforms: Platform[];
  topY: number;
  keys: { left: boolean; right: boolean };
  pointers: Map<number, 'left' | 'right'>;
  idleBaseY: number;
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function readTheme(): Theme {
  const light = document.body.classList.contains('light-mode');
  const accent =
    getComputedStyle(document.body).getPropertyValue('--accent-color').trim() ||
    '#007BFF';
  return {
    accent,
    moving: '#10b981',
    breakable: light ? 'rgba(0, 0, 0, 0.38)' : 'rgba(255, 255, 255, 0.38)',
    spring: '#f59e0b',
    body: light ? '#33373d' : '#eef1f6',
    eye: light ? '#f5f1eb' : '#15181d',
  };
}

function buildSprite(theme: Theme): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = SPRITE[0].length * PIXEL;
  c.height = SPRITE.length * PIXEL;
  const sctx = c.getContext('2d')!;
  SPRITE.forEach((row, ry) => {
    [...row].forEach((cell, rx) => {
      if (cell === '.') return;
      sctx.fillStyle =
        cell === '1' ? theme.body : cell === '2' ? theme.eye : theme.accent;
      sctx.fillRect(rx * PIXEL, ry * PIXEL, PIXEL, PIXEL);
    });
  });
  return c;
}

function makePlatform(x: number, y: number, alt: number): Platform {
  const movingP = alt > 250 ? Math.min(0.35, 0.06 + (alt - 250) / 2500) : 0;
  const type: Platform['type'] = Math.random() < movingP ? 'moving' : 'static';
  const p: Platform = {
    x,
    y,
    type,
    vx:
      type === 'moving'
        ? (Math.random() < 0.5 ? -1 : 1) * rand(0.8, 1.6 + Math.min(1, alt / 3000))
        : 0,
    spring: -1,
    springT: 0,
    broken: false,
    fallV: 0,
    rot: 0,
  };
  if (type === 'static' && Math.random() < (alt > 120 ? 0.07 : 0.03)) {
    p.spring = rand(8, PW - 24);
  }
  return p;
}

/* One band of platforms spread across the full viewport width.
   Higher up, slots start staying empty so landings demand real steering. */
function spawnBand(g: GameState, y: number, alt: number) {
  const count = Math.max(1, Math.round(g.w / 380));
  const slot = g.w / count;
  const skipP = Math.min(0.45, alt / 2200);
  const keep = Math.floor(rand(0, count)); // one slot is always populated
  for (let i = 0; i < count; i++) {
    if (i !== keep && Math.random() < skipP) continue;
    const x = i * slot + rand(slot * 0.08, slot * 0.92 - PW);
    g.platforms.push(makePlatform(x, y, alt));
  }
  if (alt > 150 && Math.random() < Math.min(0.3, (alt / 1500) * 0.3)) {
    g.platforms.push({
      x: rand(0, g.w - PW),
      y: y + rand(20, 40),
      type: 'breakable',
      vx: 0,
      spring: -1,
      springT: 0,
      broken: false,
      fallV: 0,
      rot: 0,
    });
  }
}

function initRun(g: GameState) {
  g.platforms = [];
  // starting floor: a row of platforms along the bottom, like the inspiration
  const floorY = g.h - 64;
  for (let x = 12; x < g.w - PW; x += 96) {
    g.platforms.push({
      x,
      y: floorY,
      type: 'static',
      vx: 0,
      spring: -1,
      springT: 0,
      broken: false,
      fallV: 0,
      rot: 0,
    });
  }
  let y = floorY;
  while (y > -160) {
    y -= rand(50, 84);
    spawnBand(g, y, 0);
  }
  g.topY = y;
  g.x = Math.min(g.w * 0.18, 200) + PW / 2;
  g.y = floorY - DH / 2;
  g.prevY = g.y;
  g.vx = 0;
  g.vy = 0;
  g.facing = 1;
  g.squash = 0;
  g.camY = 0;
  g.startY = g.y;
  g.alt = 0;
  g.nextMilestone = 0;
  g.idleBaseY = g.y;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawPlatform(
  ctx: CanvasRenderingContext2D,
  p: Platform,
  camY: number,
  theme: Theme
) {
  const sy = p.y - camY;
  ctx.save();
  ctx.translate(p.x + PW / 2, sy + PH / 2);
  if (p.rot) ctx.rotate(p.rot);
  const color =
    p.type === 'moving'
      ? theme.moving
      : p.type === 'breakable'
        ? theme.breakable
        : theme.accent;
  ctx.shadowColor = color;
  ctx.shadowBlur = 6;
  ctx.fillStyle = color;
  if (p.type === 'breakable' && !p.broken) {
    // cracked: two halves with a gap
    roundRect(ctx, -PW / 2, -PH / 2, PW / 2 - 3, PH, 3);
    ctx.fill();
    roundRect(ctx, 3, -PH / 2, PW / 2 - 3, PH, 3);
    ctx.fill();
  } else {
    roundRect(ctx, -PW / 2, -PH / 2, PW, PH, 3);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
  // dotted underline, like the inspiration
  ctx.globalAlpha = 0.35;
  for (let dx = -PW / 2 + 2; dx < PW / 2 - 2; dx += 7) {
    ctx.fillRect(dx, PH / 2 + 4, 2.5, 2.5);
  }
  ctx.globalAlpha = 1;
  if (p.spring >= 0) {
    const ext = p.springT > 0 ? 11 : 6;
    const sx = -PW / 2 + p.spring;
    ctx.strokeStyle = theme.spring;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sx + 7, -PH / 2);
    ctx.lineTo(sx + 7, -PH / 2 - ext);
    ctx.stroke();
    ctx.fillStyle = theme.spring;
    ctx.beginPath();
    ctx.arc(sx + 7, -PH / 2 - ext - 3, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawJumper(
  ctx: CanvasRenderingContext2D,
  g: GameState,
  sprite: HTMLCanvasElement
) {
  const draw = (x: number) => {
    const sy = g.y - g.camY;
    ctx.save();
    ctx.translate(x, sy);
    const squashY = 1 - g.squash * 0.018;
    const squashX = 1 + g.squash * 0.012;
    ctx.scale(g.facing * squashX, squashY);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
    ctx.restore();
  };
  draw(g.x);
  // mirror across the seam while wrapping so the jumper never half-vanishes
  if (g.x < DW) draw(g.x + g.w);
  if (g.x > g.w - DW) draw(g.x - g.w);
}

export default function DoodleJump() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const gameRef = useRef<GameState>({
    w: 1200,
    h: 800,
    x: 0,
    y: 0,
    prevY: 0,
    vx: 0,
    vy: 0,
    facing: 1,
    squash: 0,
    camY: 0,
    startY: 0,
    alt: 0,
    nextMilestone: 0,
    platforms: [],
    topY: 0,
    keys: { left: false, right: false },
    pointers: new Map(),
    idleBaseY: 0,
  });
  const phaseRef = useRef<Phase>('ready');
  const themeRef = useRef<Theme | null>(null);
  const spriteRef = useRef<HTMLCanvasElement | null>(null);
  const bestRef = useRef(0);
  const dprRef = useRef(1);

  const [phase, setPhase] = useState<Phase>('ready');
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);
  const [milestone, setMilestone] = useState<{ id: number; text: string } | null>(null);
  const [coarse, setCoarse] = useState(false);

  const changePhase = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  const milestoneRef = useRef<(text: string) => void>(() => {});
  const endRunRef = useRef<(finalScore: number) => void>(() => {});
  useEffect(() => {
    milestoneRef.current = (text: string) => setMilestone({ id: Date.now(), text });
    endRunRef.current = (finalScore: number) => {
      setScore(finalScore);
      const newBest = finalScore > bestRef.current;
      setIsNewBest(newBest);
      if (newBest) {
        bestRef.current = finalScore;
        setBest(finalScore);
        try {
          localStorage.setItem(BEST_KEY, String(finalScore));
        } catch {
          /* storage unavailable */
        }
      }
      setMilestone(null);
      changePhase('over');
    };
  });

  const begin = () => {
    const g = gameRef.current;
    if (phaseRef.current === 'over') initRun(g);
    g.vy = JUMP_V;
    setIsNewBest(false);
    changePhase('playing');
  };

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const g = gameRef.current;

    try {
      const saved = parseInt(localStorage.getItem(BEST_KEY) || '0', 10);
      if (saved > 0) {
        bestRef.current = saved;
        setBest(saved);
      }
    } catch {
      /* storage unavailable */
    }
    setCoarse(window.matchMedia('(pointer: coarse)').matches);

    const applyTheme = () => {
      themeRef.current = readTheme();
      spriteRef.current = buildSprite(themeRef.current);
    };
    applyTheme();
    // follow the site's dark/light toggle live
    const mo = new MutationObserver(applyTheme);
    mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;
      g.w = rect.width;
      g.h = rect.height;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      if (phaseRef.current === 'ready') initRun(g);
    };
    resize();
    initRun(g);
    const ro = new ResizeObserver(resize);
    ro.observe(stage);

    let lastShownScore = -1;

    const update = () => {
      if (phaseRef.current === 'ready') {
        // idle hop in place until the player moves
        g.prevY = g.y;
        g.vy += GRAVITY;
        g.y += g.vy;
        if (g.y >= g.idleBaseY && g.vy > 0) {
          g.y = g.idleBaseY;
          g.vy = JUMP_V * 0.45;
          g.squash = 8;
        }
        if (g.squash > 0) g.squash--;
        return;
      }
      if (phaseRef.current !== 'playing') return;

      const leftHeld =
        g.keys.left || [...g.pointers.values()].some((s) => s === 'left');
      const rightHeld =
        g.keys.right || [...g.pointers.values()].some((s) => s === 'right');

      if (leftHeld) g.vx -= MOVE_ACC;
      if (rightHeld) g.vx += MOVE_ACC;
      g.vx *= FRICTION;
      g.vx = Math.max(-MAX_VX, Math.min(MAX_VX, g.vx));
      if (g.vx > 0.3) g.facing = 1;
      else if (g.vx < -0.3) g.facing = -1;
      g.x += g.vx;
      if (g.x < -DW / 2) g.x = g.w + DW / 2;
      if (g.x > g.w + DW / 2) g.x = -DW / 2;

      g.prevY = g.y;
      g.vy += GRAVITY;
      g.y += g.vy;
      if (g.squash > 0) g.squash--;

      for (const p of g.platforms) {
        if (p.type === 'moving' && !p.broken) {
          p.x += p.vx;
          if (p.x < 0) {
            p.x = 0;
            p.vx = Math.abs(p.vx);
          }
          if (p.x > g.w - PW) {
            p.x = g.w - PW;
            p.vx = -Math.abs(p.vx);
          }
        }
        if (p.broken) {
          p.fallV += GRAVITY * 0.6;
          p.y += p.fallV;
          p.rot += 0.04;
        }
        if (p.springT > 0) p.springT--;
      }

      // landing (one-way, only while falling)
      if (g.vy > 0) {
        const prevBottom = g.prevY + DH / 2;
        const bottom = g.y + DH / 2;
        for (const p of g.platforms) {
          if (p.broken) continue;
          if (
            bottom >= p.y &&
            prevBottom <= p.y + PH + 4 &&
            g.x + DW * 0.4 > p.x &&
            g.x - DW * 0.4 < p.x + PW
          ) {
            if (p.type === 'breakable') {
              p.broken = true;
              p.fallV = 1.5;
              continue;
            }
            g.y = p.y - DH / 2;
            const onSpring =
              p.spring >= 0 &&
              g.x > p.x + p.spring - 6 &&
              g.x < p.x + p.spring + 20;
            g.vy = onSpring ? SPRING_V : JUMP_V;
            if (onSpring) p.springT = 14;
            g.squash = 8;
            break;
          }
        }
      }

      // camera follows upward only
      if (g.y < g.camY + g.h * 0.42) g.camY = g.y - g.h * 0.42;

      // altitude + milestones
      g.alt = Math.max(g.alt, (g.startY - g.y) / 10);
      const m = MILESTONES[g.nextMilestone];
      if (m && g.alt >= m[0]) {
        milestoneRef.current(m[1]);
        g.nextMilestone++;
      }

      // generate above, cull below — gaps creep toward max jump height (~157px)
      while (g.topY > g.camY - 90) {
        const maxGap = 78 + Math.min(70, (g.alt / 1500) * 70);
        const minGap = 48 + Math.min(40, (g.alt / 1200) * 40);
        g.topY -= rand(minGap, maxGap);
        spawnBand(g, g.topY, g.alt);
      }
      g.platforms = g.platforms.filter((p) => p.y - g.camY < g.h + 80);

      // fell off the bottom
      if (g.y - g.camY > g.h + 50) {
        endRunRef.current(Math.floor(g.alt));
      }
    };

    const draw = () => {
      const dpr = dprRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, g.w, g.h);
      const theme = themeRef.current;
      const sprite = spriteRef.current;
      if (!theme || !sprite) return;
      for (const p of g.platforms) drawPlatform(ctx, p, g.camY, theme);
      drawJumper(ctx, g, sprite);
      // HUD score lives in the DOM; update it only when it changes
      const s = Math.floor(g.alt);
      if (s !== lastShownScore && scoreRef.current) {
        scoreRef.current.textContent = `${s} m`;
        lastShownScore = s;
      }
    };

    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const frame = (now: number) => {
      acc += now - last;
      last = now;
      if (acc > 100) acc = 100;
      while (acc >= STEP_MS) {
        update();
        acc -= STEP_MS;
      }
      draw();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const startFromInput = () => {
      if (phaseRef.current === 'ready' || phaseRef.current === 'over') {
        if (phaseRef.current === 'over') initRun(g);
        g.vy = JUMP_V;
        setIsNewBest(false);
        phaseRef.current = 'playing';
        setPhase('playing');
        return true;
      }
      if (phaseRef.current === 'paused') {
        phaseRef.current = 'playing';
        setPhase('playing');
        return true;
      }
      return false;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
        e.preventDefault();
      }
      const left = e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A';
      const right = e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D';
      if (left || right || e.key === ' ' || e.key === 'Enter') startFromInput();
      if (left) g.keys.left = true;
      if (right) g.keys.right = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') g.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') g.keys.right = false;
    };
    const onPointerEnd = (e: PointerEvent) => {
      g.pointers.delete(e.pointerId);
    };
    const onVisibility = () => {
      if (document.hidden && phaseRef.current === 'playing') {
        phaseRef.current = 'paused';
        setPhase('paused');
        g.keys.left = false;
        g.keys.right = false;
        g.pointers.clear();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('pointerup', onPointerEnd);
    window.addEventListener('pointercancel', onPointerEnd);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('pointerup', onPointerEnd);
      window.removeEventListener('pointercancel', onPointerEnd);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const onStagePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gameRef.current;
    if (phaseRef.current === 'ready' || phaseRef.current === 'over' || phaseRef.current === 'paused') {
      begin();
      return;
    }
    const side = e.clientX < g.w / 2 ? 'left' : 'right';
    g.pointers.set(e.pointerId, side);
  };

  const rankFor = (s: number) => {
    let rank = 'Code Newbie';
    for (const [m, title] of MILESTONES) {
      if (s >= m) rank = title;
    }
    return rank;
  };

  const moveHint = coarse
    ? 'tap to jump · hold left / right side to steer'
    : 'press ← → or A / D to start steering · esc to exit';

  return (
    <div
      ref={stageRef}
      className="gm-stage"
      onPointerDown={onStagePointerDown}
      onContextMenu={(e) => e.preventDefault()}
    >
      <canvas ref={canvasRef} className="gm-canvas" aria-label="Doodle Jump playfield" />
      <div className="gm-hud" aria-live="off">
        <span ref={scoreRef} className="gm-hud-score">0 m</span>
        {best > 0 && <span className="gm-hud-best">best {best} m</span>}
      </div>
      {milestone && (
        <div className="gm-toast" key={milestone.id}>
          ✦ {milestone.text} ✦
        </div>
      )}
      {phase === 'ready' && <div className="gm-hint">{moveHint}</div>}
      {phase === 'paused' && (
        <div className="gm-card">
          <p className="gm-card-title">paused</p>
          <p className="gm-card-line">press any key or tap to resume</p>
        </div>
      )}
      {phase === 'over' && (
        <div className="gm-card">
          <p className="gm-card-title">game over</p>
          <p className="gm-card-score">{score} m</p>
          {isNewBest ? (
            <p className="gm-card-newbest">★ new best ★</p>
          ) : (
            <p className="gm-card-line">best {best} m</p>
          )}
          <p className="gm-card-line">
            rank: <strong>{rankFor(score)}</strong>
          </p>
          <p className="gm-card-line gm-card-retry">
            {coarse ? 'tap anywhere to retry' : 'space / tap to retry · esc to exit'}
          </p>
        </div>
      )}
    </div>
  );
}
