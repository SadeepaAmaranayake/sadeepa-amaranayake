import { useEffect, useRef } from 'react';

function hexToRgb(hex) {
  const value = hex.replace('#', '');
  const parsed = Number.parseInt(value.length === 3 ? value.split('').map((item) => item + item).join('') : value, 16);
  return { r: (parsed >> 16) & 255, g: (parsed >> 8) & 255, b: parsed & 255 };
}

export default function MagicRings({
  color = '#55c4f7',
  colorTwo = '#63bdf1',
  ringCount = 6,
  speed = 1,
  attenuation = 10,
  lineThickness = 2,
  baseRadius = 0.35,
  radiusStep = 0.1,
  scaleRate = 0.1,
  opacity = 1,
  blur = 0,
  noiseAmount = 0.1,
  rotation = 0,
  ringGap = 1.5,
  fadeIn = 0.7,
  fadeOut = 0.5,
  followMouse = false,
  mouseInfluence = 0.2,
  hoverScale = 1.2,
  parallax = 0.05,
  clickBurst = false,
  className = '',
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const first = hexToRgb(color);
    const second = hexToRgb(colorTwo);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: 0, y: 0, active: false, burst: 0 };
    let frame;
    let startedAt = performance.now();
    let width = 0;
    let height = 0;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const updatePointer = (event) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - bounds.left) / bounds.width - 0.5;
      pointer.y = (event.clientY - bounds.top) / bounds.height - 0.5;
      pointer.active = true;
    };

    const draw = (now) => {
      const elapsed = reduceMotion ? 1 : (now - startedAt) / 1000;
      const entrance = Math.min(1, elapsed / Math.max(fadeIn, 0.01));
      const breathing = 1 + Math.sin(elapsed * speed * 0.75) * scaleRate * 0.2;
      const pointerScale = pointer.active && followMouse ? 1 + (hoverScale - 1) * 0.35 : 1;
      const burstScale = 1 + pointer.burst * 0.24;
      pointer.burst *= 0.92;
      context.clearRect(0, 0, width, height);
      context.save();
      context.globalCompositeOperation = 'screen';
      context.lineCap = 'round';
      context.lineJoin = 'round';

      const smallest = Math.min(width, height);
      const centerX = width * 0.68 + (followMouse ? pointer.x * width * parallax : 0);
      const centerY = height * 0.44 + (followMouse ? pointer.y * height * parallax : 0);
      const base = smallest * baseRadius;
      const gradient = context.createLinearGradient(centerX - base, centerY - base, centerX + base, centerY + base);
      gradient.addColorStop(0, `rgba(${first.r}, ${first.g}, ${first.b}, ${opacity})`);
      gradient.addColorStop(1, `rgba(${second.r}, ${second.g}, ${second.b}, ${opacity})`);

      for (let ring = ringCount - 1; ring >= 0; ring -= 1) {
        const progress = ringCount === 1 ? 0 : ring / (ringCount - 1);
        const radius = base * (1 + ring * radiusStep * ringGap) * breathing * pointerScale * burstScale;
        const ringAlpha = entrance * opacity * (1 - progress * fadeOut) * 0.82;
        const points = 150;
        context.beginPath();

        for (let point = 0; point <= points; point += 1) {
          const angle = (point / points) * Math.PI * 2 + rotation + elapsed * speed * (0.035 + ring * 0.006);
          const waveA = Math.sin(angle * 3 + elapsed * speed + ring * 1.7);
          const waveB = Math.sin(angle * 7 - elapsed * speed * 0.7 + ring * 0.8);
          const distortion = 1 + (waveA * 0.65 + waveB * 0.35) * noiseAmount * (attenuation / 10);
          const x = centerX + Math.cos(angle) * radius * distortion;
          const y = centerY + Math.sin(angle) * radius * 0.56 * distortion;
          if (point === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }

        context.closePath();
        context.globalAlpha = Math.max(0, ringAlpha);
        context.strokeStyle = gradient;
        context.lineWidth = lineThickness * (1 - progress * 0.28);
        context.shadowColor = ring % 2 === 0 ? color : colorTwo;
        context.shadowBlur = blur + 14;
        context.stroke();
      }

      context.restore();
      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };

    const onLeave = () => { pointer.active = false; };
    const onClick = () => { if (clickBurst) pointer.burst = 1; };
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    observer?.observe(canvas);
    if (!observer) window.addEventListener('resize', resize);
    if (followMouse) {
      window.addEventListener('pointermove', updatePointer, { passive: true });
      window.addEventListener('pointerleave', onLeave);
    }
    if (clickBurst) window.addEventListener('pointerdown', onClick);
    resize();
    draw(startedAt + (reduceMotion ? 1000 : 0));

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', updatePointer);
      window.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('pointerdown', onClick);
    };
  }, [attenuation, baseRadius, blur, clickBurst, color, colorTwo, fadeIn, fadeOut, followMouse, hoverScale, lineThickness, mouseInfluence, noiseAmount, opacity, parallax, radiusStep, ringCount, ringGap, rotation, scaleRate, speed]);

  return <canvas ref={canvasRef} className={`magic-rings-canvas ${className}`} aria-hidden="true" />;
}
