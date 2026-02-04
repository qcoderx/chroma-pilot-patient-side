import React, { useEffect, useRef, useMemo } from 'react';

interface DNAHelixProps {
  progress?: number; // 0-100, changes color based on progress
  moduleColor?: 'primary' | 'bond-blue' | 'amber'; // Current module color
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

const DNAHelix: React.FC<DNAHelixProps> = ({
  progress = 0,
  moduleColor = 'primary',
  intensity = 'medium',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);

  // Color configurations
  const colors = useMemo(() => ({
    primary: { r: 54, g: 226, b: 123 },    // Green
    'bond-blue': { r: 0, g: 194, b: 255 }, // Blue
    amber: { r: 245, g: 158, b: 11 },      // Amber
  }), []);

  // Intensity settings
  const intensitySettings = useMemo(() => ({
    low: { particleCount: 20, opacity: 0.3, glowSize: 4 },
    medium: { particleCount: 35, opacity: 0.5, glowSize: 6 },
    high: { particleCount: 50, opacity: 0.7, glowSize: 8 },
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const settings = intensitySettings[intensity];
    const baseColor = colors[moduleColor];

    // Calculate color interpolation based on progress
    const getProgressColor = (offset: number = 0) => {
      const p = Math.min(100, Math.max(0, progress + offset));

      // Transition through colors based on progress
      // 0-33%: Green, 34-66%: Blue, 67-100%: Amber
      let r, g, b;

      if (p < 33) {
        // Green phase
        r = colors.primary.r;
        g = colors.primary.g;
        b = colors.primary.b;
      } else if (p < 66) {
        // Transition to blue
        const t = (p - 33) / 33;
        r = Math.round(colors.primary.r + (colors['bond-blue'].r - colors.primary.r) * t);
        g = Math.round(colors.primary.g + (colors['bond-blue'].g - colors.primary.g) * t);
        b = Math.round(colors.primary.b + (colors['bond-blue'].b - colors.primary.b) * t);
      } else {
        // Transition to amber
        const t = (p - 66) / 34;
        r = Math.round(colors['bond-blue'].r + (colors.amber.r - colors['bond-blue'].r) * t);
        g = Math.round(colors['bond-blue'].g + (colors.amber.g - colors['bond-blue'].g) * t);
        b = Math.round(colors['bond-blue'].b + (colors.amber.b - colors['bond-blue'].b) * t);
      }

      return { r, g, b };
    };

    // Animation loop
    const animate = () => {
      timeRef.current += 0.02;
      const time = timeRef.current;

      const width = canvas.getBoundingClientRect().width;
      const height = canvas.getBoundingClientRect().height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // DNA helix parameters
      const amplitude = width * 0.35; // How wide the helix is
      const frequency = 0.015; // How tight the coils are
      const verticalSpacing = height / settings.particleCount;

      // Draw DNA strands
      for (let i = 0; i < settings.particleCount; i++) {
        const y = i * verticalSpacing;
        const phase = time + i * frequency * 50;

        // Calculate 3D-like positions for both strands
        const x1 = width / 2 + Math.sin(phase) * amplitude;
        const x2 = width / 2 + Math.sin(phase + Math.PI) * amplitude;

        // Calculate depth (z) for 3D effect
        const z1 = Math.cos(phase);
        const z2 = Math.cos(phase + Math.PI);

        // Size based on depth
        const size1 = 3 + z1 * 2;
        const size2 = 3 + z2 * 2;

        // Opacity based on depth
        const opacity1 = (settings.opacity * 0.5) + (z1 + 1) * 0.25 * settings.opacity;
        const opacity2 = (settings.opacity * 0.5) + (z2 + 1) * 0.25 * settings.opacity;

        // Get colors with slight variation
        const color1 = getProgressColor(i * 0.5 - settings.particleCount * 0.25);
        const color2 = getProgressColor(i * 0.5 - settings.particleCount * 0.25 + 5);

        // Draw first strand particle
        ctx.beginPath();
        ctx.arc(x1, y, size1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color1.r}, ${color1.g}, ${color1.b}, ${opacity1})`;
        ctx.fill();

        // Glow for first strand
        ctx.beginPath();
        ctx.arc(x1, y, size1 + settings.glowSize, 0, Math.PI * 2);
        const gradient1 = ctx.createRadialGradient(x1, y, size1, x1, y, size1 + settings.glowSize);
        gradient1.addColorStop(0, `rgba(${color1.r}, ${color1.g}, ${color1.b}, ${opacity1 * 0.5})`);
        gradient1.addColorStop(1, `rgba(${color1.r}, ${color1.g}, ${color1.b}, 0)`);
        ctx.fillStyle = gradient1;
        ctx.fill();

        // Draw second strand particle
        ctx.beginPath();
        ctx.arc(x2, y, size2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color2.r}, ${color2.g}, ${color2.b}, ${opacity2})`;
        ctx.fill();

        // Glow for second strand
        ctx.beginPath();
        ctx.arc(x2, y, size2 + settings.glowSize, 0, Math.PI * 2);
        const gradient2 = ctx.createRadialGradient(x2, y, size2, x2, y, size2 + settings.glowSize);
        gradient2.addColorStop(0, `rgba(${color2.r}, ${color2.g}, ${color2.b}, ${opacity2 * 0.5})`);
        gradient2.addColorStop(1, `rgba(${color2.r}, ${color2.g}, ${color2.b}, 0)`);
        ctx.fillStyle = gradient2;
        ctx.fill();

        // Draw connecting line (base pair) every few particles
        if (i % 3 === 0) {
          // Only draw when particles are roughly aligned (in front)
          const avgZ = (z1 + z2) / 2;
          if (avgZ > -0.3) {
            ctx.beginPath();
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
            const lineOpacity = (avgZ + 1) * 0.15 * settings.opacity;
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineOpacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Add floating particles around the helix
      for (let i = 0; i < 8; i++) {
        const angle = time * 0.5 + i * (Math.PI / 4);
        const radius = 20 + Math.sin(time * 2 + i) * 10;
        const x = width / 2 + Math.cos(angle) * radius;
        const y = height / 2 + Math.sin(angle * 2) * (height * 0.3);

        const color = getProgressColor(i * 10);

        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${settings.opacity * 0.6})`;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [progress, moduleColor, intensity, colors, intensitySettings]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ touchAction: 'none' }}
    />
  );
};

export default DNAHelix;
