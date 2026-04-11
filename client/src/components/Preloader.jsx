import React, { useEffect, useRef } from 'react';

/**
 * A professional, high-fidelity HUD-style preloader.
 * Replaces the Bread emoji loader with a sleek brand-consistent animation.
 */
export default function Preloader({ message = "Initializing Neural Link", subtext = "Establishing Secure Connection" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 1.5 + 0.5,
      color: Math.random() > 0.7 ? '#F26419' : '#2D5426'
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.15;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 150) {
            ctx.strokeStyle = '#F26419';
            ctx.globalAlpha = (1 - dist / 150) * 0.05;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-bbg overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Core HUD Element */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border border-orange/10 border-t-orange animate-[spin_3s_linear_infinite]"></div>
          {/* Middle Ring */}
          <div className="absolute inset-3 md:inset-4 rounded-full border border-green-cash/10 border-b-green-cash animate-[spin_2s_linear_infinite_reverse]"></div>
          {/* Inner Logo/Icon */}
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border border-orange/20 p-1 bg-bbg-surface/80 backdrop-blur-sm shadow-[0_0_20px_rgba(242,100,25,0.15)]">
             <img src="/bettingBread-logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-full opacity-80" />
          </div>
        </div>

        {/* Text HUD */}
        <div className="text-center animate-fade-up">
          <h2 className="font-brand text-xl md:text-3xl text-tx tracking-[0.2em] md:tracking-[0.4em] uppercase mb-4 drop-shadow-[0_0_10px_rgba(229,226,225,0.2)] whitespace-nowrap">
            {message}
          </h2>
          <div className="flex items-center justify-center gap-3">
             <span className="h-px w-8 bg-gradient-to-r from-transparent to-orange/40"></span>
             <p className="text-tx/50 font-display text-[10px] uppercase tracking-[6px] font-bold">
               {subtext}
             </p>
             <span className="h-px w-8 bg-gradient-to-l from-transparent to-orange/40"></span>
          </div>
        </div>
      </div>

      {/* Ambient Scanning Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden h-full w-full">
         <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-orange/10 to-transparent absolute top-0 left-0 animate-[scan_4s_ease-in-out_infinite]"></div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100vh); opacity: 0; }
          40% { opacity: 0.5; }
          60% { opacity: 0.5; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
