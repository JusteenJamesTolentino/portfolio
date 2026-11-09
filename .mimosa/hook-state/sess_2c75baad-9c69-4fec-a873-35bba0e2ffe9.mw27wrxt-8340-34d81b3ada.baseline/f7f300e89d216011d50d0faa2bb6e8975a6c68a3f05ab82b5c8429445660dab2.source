import { useEffect, useRef } from 'react';

// Canvas live-wallpaper engine. Every effect body is block-bodied and returns
// only its cleanup, so no browser API return value can ever become a React
// destroy function (the class of bug that once blanked the Terminal).
function AnimatedBackground({ wallpaperId, speed = 1, density = 1 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let frameId;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      build();
    };
    window.addEventListener('resize', resize);

    const random = (min, max) => min + Math.random() * (max - min);

    // ---- shared scene state -------------------------------------------------
    let particles = [];
    let stars = [];
    let petals = [];
    let bokeh = [];
    let skyGradient = null;
    let step = 0;
    let gridOffset = 0;

    const build = () => {
      if (wallpaperId === 'particles') {
        particles = Array.from({ length: Math.floor(60 * density) }, () => ({
          x: random(0, width),
          y: random(0, height),
          vx: random(-0.6, 0.6) * speed * 1.2,
          vy: random(-0.6, 0.6) * speed * 1.2,
          radius: random(1, 3),
        }));
      } else if (wallpaperId === 'starfield') {
        stars = Array.from({ length: Math.floor(250 * density) }, () => ({
          x: random(-0.5, 0.5) * width,
          y: random(-0.5, 0.5) * height,
          z: random(0, width),
        }));
      } else if (wallpaperId === 'sakura') {
        skyGradient = ctx.createLinearGradient(0, 0, 0, height);
        skyGradient.addColorStop(0, '#2b1b3d');
        skyGradient.addColorStop(0.45, '#6d3a6e');
        skyGradient.addColorStop(0.75, '#c76b8f');
        skyGradient.addColorStop(1, '#f2b8a0');
        const petalColors = ['#f6a8c5', '#f9c1d9', '#ee8fb9', '#fbc4e0'];
        petals = Array.from({ length: Math.floor(70 * density) }, () => ({
          x: random(0, width),
          y: random(-height, height),
          size: random(4, 9),
          vy: random(0.4, 1.1) * speed,
          sway: random(20, 60),
          swaySpeed: random(0.4, 1.1),
          phase: random(0, Math.PI * 2),
          rotation: random(0, Math.PI * 2),
          rotationSpeed: random(-0.02, 0.02) * speed,
          color: petalColors[Math.floor(random(0, petalColors.length))],
        }));
        bokeh = Array.from({ length: Math.floor(14 * density) }, () => ({
          x: random(0, width),
          y: random(0, height),
          radius: random(6, 18),
          vy: random(-0.15, -0.4) * speed,
          alpha: random(0.08, 0.22),
        }));
      }
    };
    build();

    let matrixDrops = null;
    const drawMatrix = () => {
      if (!matrixDrops || matrixDrops.length !== Math.floor(width / 14)) {
        matrixDrops = Array(Math.floor(width / 14)).fill(1);
      }
      const fontSize = 14;
      ctx.fillStyle = 'rgba(10, 15, 30, 0.15)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px monospace`;
      const chars = '0123456789ABCDEFJAVASCRIPTREACTNODEJSTYPESCRIPT';
      matrixDrops.forEach((drop, index) => {
        const text = chars.charAt(Math.floor(random(0, chars.length)));
        ctx.fillStyle = Math.random() > 0.85 ? '#e2e8f0' : '#10b981';
        ctx.fillText(text, index * fontSize, drop * fontSize);
        if (drop * fontSize > height && Math.random() > 0.975) matrixDrops[index] = 0;
        matrixDrops[index] = drop + speed * 0.8;
      });
    };

    const drawParticles = () => {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i += 1) {
        const point = particles[i];
        point.x += point.vx;
        point.y += point.vy;
        if (point.x < 0 || point.x > width) point.vx *= -1;
        if (point.y < 0 || point.y > height) point.vy *= -1;
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();
        for (let j = i + 1; j < particles.length; j += 1) {
          const other = particles[j];
          const distance = Math.hypot(point.x - other.x, point.y - other.y);
          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.25 * (1 - distance / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    };

    const drawStarfield = () => {
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);
      const centerX = width / 2;
      const centerY = height / 2;
      for (let i = 0; i < stars.length; i += 1) {
        const star = stars[i];
        star.z -= 2 * speed;
        if (star.z <= 0) {
          star.z = width;
          star.x = random(-0.5, 0.5) * width;
          star.y = random(-0.5, 0.5) * height;
        }
        const scale = 128 / star.z;
        const px = star.x * scale + centerX;
        const py = star.y * scale + centerY;
        if (px >= 0 && px < width && py >= 0 && py < height) {
          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.1, (1 - star.z / width) * 2.5), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(224, 231, 255, ${1 - star.z / width})`;
          ctx.fill();
        }
      }
    };

    const drawFluid = () => {
      step += 0.01 * speed;
      ctx.fillStyle = '#0b0f19';
      ctx.fillRect(0, 0, width, height);
      const firstX = width / 2 + Math.sin(step) * (width / 3);
      const firstY = height / 2 + Math.cos(step * 0.7) * (height / 3);
      const secondX = width / 2 + Math.cos(step * 0.8) * (width / 3);
      const secondY = height / 2 + Math.sin(step * 1.1) * (height / 3);
      const first = ctx.createRadialGradient(firstX, firstY, 10, firstX, firstY, width * 0.5);
      first.addColorStop(0, 'rgba(124, 58, 237, 0.4)');
      first.addColorStop(1, 'rgba(124, 58, 237, 0)');
      const second = ctx.createRadialGradient(secondX, secondY, 10, secondX, secondY, width * 0.5);
      second.addColorStop(0, 'rgba(14, 165, 233, 0.4)');
      second.addColorStop(1, 'rgba(14, 165, 233, 0)');
      ctx.fillStyle = first;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = second;
      ctx.fillRect(0, 0, width, height);
    };

    const drawGrid = () => {
      gridOffset = (gridOffset + 1.2 * speed) % 40;
      ctx.fillStyle = '#090514';
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.2)';
      ctx.lineWidth = 1;
      const horizon = height * 0.55;
      for (let x = -width; x <= width * 2; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, height);
        ctx.lineTo(width / 2 + (x - width / 2) * 0.1, horizon);
        ctx.stroke();
      }
      for (let y = horizon; y <= height; y += 20) {
        const lineY = y + (gridOffset * (y - horizon)) / horizon;
        if (lineY <= height) {
          ctx.beginPath();
          ctx.moveTo(0, lineY);
          ctx.lineTo(width, lineY);
          ctx.stroke();
        }
      }
      const sun = ctx.createRadialGradient(width / 2, horizon, 5, width / 2, horizon, 140);
      sun.addColorStop(0, 'rgba(244, 114, 182, 0.5)');
      sun.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = sun;
      ctx.fillRect(0, 0, width, height);
    };

    const drawPetal = petal => {
      ctx.save();
      ctx.translate(petal.x, petal.y);
      ctx.rotate(petal.rotation);
      ctx.beginPath();
      ctx.ellipse(0, 0, petal.size, petal.size * 0.55, 0, 0, Math.PI * 2);
      ctx.fillStyle = petal.color;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.restore();
      ctx.globalAlpha = 1;
    };

    const drawSakura = () => {
      step += 0.008 * speed;
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);

      const moon = ctx.createRadialGradient(width * 0.78, height * 0.18, 5, width * 0.78, height * 0.18, 170);
      moon.addColorStop(0, 'rgba(255, 238, 220, 0.9)');
      moon.addColorStop(1, 'rgba(255, 238, 220, 0)');
      ctx.fillStyle = moon;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < bokeh.length; i += 1) {
        const light = bokeh[i];
        light.y += light.vy;
        if (light.y + light.radius < 0) light.y = height + light.radius;
        ctx.beginPath();
        ctx.arc(light.x, light.y, light.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 224, 238, ${light.alpha})`;
        ctx.fill();
      }

      for (let i = 0; i < petals.length; i += 1) {
        const petal = petals[i];
        petal.y += petal.vy;
        petal.rotation += petal.rotationSpeed;
        const swayX = Math.sin(step * petal.swaySpeed * 6 + petal.phase) * petal.sway * 0.12;
        if (petal.y - petal.size > height) {
          petal.y = -petal.size;
          petal.x = random(0, width);
        }
        drawPetal({ ...petal, x: petal.x + swayX });
      }
    };

    const drawFrame = () => {
      if (wallpaperId === 'matrix') drawMatrix();
      else if (wallpaperId === 'particles') drawParticles();
      else if (wallpaperId === 'starfield') drawStarfield();
      else if (wallpaperId === 'fluid') drawFluid();
      else if (wallpaperId === 'grid') drawGrid();
      else if (wallpaperId === 'sakura') drawSakura();
      frameId = requestAnimationFrame(drawFrame);
    };

    drawFrame();

    return () => {
      window.removeEventListener('resize', resize);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [wallpaperId, speed, density]);

  return <canvas ref={canvasRef} aria-hidden='true' className='pointer-events-none absolute inset-0 z-0 h-full w-full' />;
}

export default AnimatedBackground;
