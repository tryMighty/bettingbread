import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import PriceTicker from '../components/PriceTicker';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { usePageTitle } from '../hooks/usePageTitle';

class Particle {
  constructor(w, h) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 0.18;
    this.vy = (Math.random() - 0.5) * 0.18;
    this.r = Math.random() * 1.2 + 0.4;
    this.isOrange = Math.random() < 0.35;
  }
  update(w, h) {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > w) this.vx *= -1;
    if (this.y < 0 || this.y > h) this.vy *= -1;
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.isOrange ? 'rgba(242, 100, 25, 0.55)' : 'rgba(45, 84, 38, 0.45)';
    ctx.fill();
  }
}

export default function Home() {
  usePageTitle('Home');
  const canvasRef = useRef(null);

  const { user, loading, signIn, isProcessing } = useAuth();
  const navigate = useNavigate();
  const [purchasingTier, setPurchasingTier] = useState(null);

  const handlePurchase = async (tier) => {
    if (!user) {
      signIn();
      return;
    }

    setPurchasingTier(tier);
    try {
      const { data } = await api.post('/api/payment/create-checkout', { tier: tier.toLowerCase().replace(' ', '_') });
      if (data.url) window.location.assign(data.url);
    } catch (err) {
      console.error('Purchase Error:', err);
      alert('Failed to initiate checkout. Please try again.');
      setPurchasingTier(null);
    }
  };

  const handleSignIn = () => {
    signIn();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], flashes = [];
    let animationFrameId;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 110; i++) particles.push(new Particle(W, H));

    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            const a = (1 - d / 120) * 0.18;
            const isO = particles[i].isOrange || particles[j].isOrange;
            ctx.strokeStyle = isO ? `rgba(242, 100, 25, ${a})` : `rgba(45, 84, 38, ${a * 1.4})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const spawnFlash = () => {
      if (Math.random() < 0.006) {
        flashes.push({
          x: Math.random() * W, y: Math.random() * H,
          r: 0, maxR: 60 + Math.random() * 80,
          a: 1, speed: 1.8 + Math.random() * 2
        });
      }
    };

    const drawFlashes = () => {
      flashes = flashes.filter(f => {
        f.r += f.speed;
        f.a -= 0.025;
        if (f.a <= 0) return false;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(242, 100, 25, ${f.a * 0.35})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        return true;
      });
    };

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      drawLines();
      particles.forEach(p => { p.update(W, H); p.draw(ctx); });
      spawnFlash();
      drawFlashes();
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative bg-bbg text-tx font-body min-h-screen break-words overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-55"></canvas>
      <div className="fixed inset-0 z-[9998] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.035) 3px, rgba(0,0,0,0.035) 4px)' }}></div>


      {/* LIVE CRYPTO TICKER */}
      <div className="fixed top-0 left-0 right-0 z-[10000] h-[46px] bg-bbg-surface border-b border-br flex items-center overflow-hidden w-full">
        <PriceTicker />
      </div>

      {/* NAV */}
      <nav className="fixed top-[46px] left-0 right-0 z-50 flex items-center justify-center h-20 md:h-[96px] bg-[#050804]/94 backdrop-blur-xl border-b border-br w-full">
        <div className="w-full max-w-[1200px] mx-auto px-6 md:px-8 flex items-center justify-between">
          <a href="#" className="flex items-end gap-2.5 hover:opacity-90 transition-opacity">
            <div className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] md:w-[26px] md:h-[26px] rounded-full overflow-hidden border border-orange flex-shrink-0 translate-y-[3px] sm:translate-y-[2px]">
              <img src="/bettingBread-logo.jpg" alt="BettingBread" className="w-full h-full object-cover" />
            </div>
            <span className="font-brand text-[13px] sm:text-[15px] md:text-[18px] tracking-[2px] text-green-cash whitespace-nowrap leading-none">
              BETTING <span className="text-orange">BREAD</span>
            </span>
          </a>
          <ul className="hidden md:flex flex-1 justify-center gap-10 lg:gap-16 list-none items-center">
            <li><a href="#community" className="font-display font-bold text-[15px] md:text-[16px] tracking-[3px] uppercase text-green-cash hover:text-orange transition-colors whitespace-nowrap">Community</a></li>
            <li><a href="#features" className="font-display font-bold text-[15px] md:text-[16px] tracking-[3px] uppercase text-green-cash hover:text-orange transition-colors whitespace-nowrap">Features</a></li>
            <li><a href="#pricing" className="font-display font-bold text-[15px] md:text-[16px] tracking-[3px] uppercase text-green-cash hover:text-orange transition-colors whitespace-nowrap">Pricing</a></li>
          </ul>
          <button
            onClick={user ? () => navigate('/dashboard') : handleSignIn}
            disabled={loading || isProcessing}
            className="font-display font-black text-[13px] tracking-[2px] uppercase text-white bg-orange hover:bg-orange-hot transition-transform hover:-translate-y-px px-7 py-3 clip-path-btn whitespace-nowrap flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {(loading || isProcessing) ? (
              <>
                <LoadingSpinner size={14} />
                <span>{isProcessing ? 'SIGNING IN...' : 'LOADING...'}</span>
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 127.14 96.36" fill="currentColor">
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.2,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                </svg>
                <span>{user ? 'Dashboard' : 'Sign In'}</span>
              </>
            )}
          </button>
        </div>
      </nav>

      <main className="relative z-10 w-full">
        {/* HERO */}
        <section className="relative pt-[100px] md:pt-[160px] pb-8 md:pb-12 overflow-hidden flex flex-col">
          {/* MOBILE VIEW HERO MODIFICATIONS */}
          <style>{`
            @media (max-width: 768px) {
              /* Turn the main grid into a flex column format */
              main > section:first-of-type > div.grid {
                display: flex !important;
                flex-direction: column !important;
              }
              
              /* Un-nest text elements to allow re-ordering amongst the image */
              main > section:first-of-type > div.grid > div:nth-child(5) {
                display: contents !important;
              }
              
              /* 1. Subheading */
              main > section:first-of-type > div.grid > div:nth-child(5) > *:nth-child(1) {
                order: 1 !important;
                margin-top: 1.5rem !important;
              }
              /* 2. Heading */
              main > section:first-of-type > div.grid > div:nth-child(5) > *:nth-child(2) {
                order: 2 !important;
              }
              /* 3. Paragraph */
              main > section:first-of-type > div.grid > div:nth-child(5) > *:nth-child(3) {
                order: 3 !important;
                margin-bottom: 0 !important;
              }
              /* 4. Mascot Image */
              main > section:first-of-type > div.grid > div:nth-child(6) {
                order: 4 !important;
                margin-top: 1rem !important;
              }
              /* 5. Button Wrapper */
              main > section:first-of-type > div.grid > div:nth-child(5) > *:nth-child(4) {
                order: 5 !important;
                margin-top: 1.5rem !important;
                margin-bottom: 2rem !important;
                width: 100% !important;
                display: flex !important;
                justify-content: center !important;
              }
              
              /* Button itself */
              main > section:first-of-type > div.grid > div:nth-child(5) > *:nth-child(4) > a {
                width: fit-content !important;
                max-width: none !important;
                display: inline-block !important;
              }
            }
          `}</style>
          <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 items-center my-auto py-6 md:py-8">
            {/* HUD Brackets */}
            <div className="absolute top-[36px] md:top-0 left-6 md:left-8 w-5 h-5 md:w-8 md:h-8 border-t-[3px] border-l-[3px] border-orange z-10"></div>
            <div className="absolute top-[36px] md:top-0 right-6 md:right-8 w-5 h-5 md:w-8 md:h-8 border-t-[3px] border-r-[3px] border-orange z-10"></div>
            <div className="absolute bottom-0 left-6 md:left-8 w-5 h-5 md:w-8 md:h-8 border-b-[3px] border-l-[3px] border-orange z-10"></div>
            <div className="absolute bottom-0 right-6 md:right-8 w-5 h-5 md:w-8 md:h-8 border-b-[3px] border-r-[3px] border-orange z-10"></div>

            <div className="relative z-20 mt-6 md:mt-0 flex flex-col items-center text-center pr-0 md:pr-8">
              <div className="flex items-center justify-center gap-3 font-display font-bold text-[10px] tracking-[5px] uppercase text-orange mb-4 animate-fade-up">
                <span className="hidden md:block w-6 h-0.5 bg-orange"></span> AI-Driven Sports Intelligence <span className="hidden md:block w-6 h-0.5 bg-orange"></span>
              </div>

              <h1 className="font-brand text-[clamp(28px,4vw,64px)] leading-[1.05] tracking-[4px] text-green-cash mb-[16px] animate-fade-up animation-delay-100 break-words max-w-[600px] mx-auto">
                THE<br className="hidden md:block" />
                <span className="text-orange drop-shadow-[0_0_20px_rgba(242,100,25,0.6)]"> AI-DRIVEN</span><br className="hidden md:block" />
                <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(242,100,25,0.6)' }}> CHAMPIONS</span>
              </h1>

              <p className="font-body text-[13px] md:text-[15px] text-green-cash max-w-[400px] mb-8 leading-[1.6] animate-fade-up animation-delay-200 mx-auto">
                Professional-grade betting and sports trading strategies for TG, X, Discord and Reddit communities.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-up animation-delay-300 w-full">
                <a href="#pricing" className="font-display font-black text-[14px] md:text-[16px] tracking-[3px] uppercase text-white bg-orange hover:bg-orange-hot transition-transform px-12 md:px-16 py-[16px] md:py-[20px] clip-path-btn hover:-translate-y-1 shadow-[0_0_30px_rgba(242,100,25,0.5)] text-center w-full max-w-[300px]">Join Now</a>
              </div>
            </div>

            <div className="relative z-20 flex items-center justify-center w-full mt-6 md:mt-0 animate-fade-up animation-delay-300">
              <div className="relative flex items-center justify-center w-full max-w-[240px] md:max-w-[420px]">
                <img src="/bb-transparent-background.png" alt="Mascot" className="w-full h-auto z-[3] drop-shadow-[0_20px_60px_rgba(242,100,25,0.3)] drop-shadow-[0_0_120px_rgba(45,84,38,0.2)] animate-mascot-enter-bob opacity-0" style={{ animationFillMode: 'forwards' }} />
                <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[240px] h-[60px] bg-[radial-gradient(ellipse,rgba(242,100,25,0.35)_0%,transparent_70%)] blur-[15px] z-[2] animate-glow-breathe"></div>

                {/* Particles */}
                <div className="absolute font-display font-black text-[11px] md:text-sm text-green-cash opacity-0 z-[4] pointer-events-none animate-cpfly" style={{ left: '0%', top: '35%' }}>+$840</div>
                <div className="absolute font-display font-black text-[10px] md:text-xs text-green-cash opacity-0 z-[4] pointer-events-none animate-cpfly" style={{ left: '-10%', top: '22%', animationDelay: '0.7s' }}>WIN</div>
                <div className="absolute font-display font-black text-[11px] md:text-sm text-green-cash opacity-0 z-[4] pointer-events-none animate-cpfly" style={{ left: '5%', top: '48%', animationDelay: '1.4s' }}>$1,200</div>
                <div className="absolute font-display font-black text-[11px] md:text-sm text-green-cash opacity-0 z-[4] pointer-events-none animate-cpfly" style={{ right: '-5%', top: '28%', animationDelay: '0.35s' }}>+ROI</div>
                <div className="absolute font-display font-black text-[10px] md:text-xs text-green-cash opacity-0 z-[4] pointer-events-none animate-cpfly" style={{ right: '5%', top: '52%', animationDelay: '1.1s' }}>$$$</div>
                <div className="absolute font-display font-black text-[10px] md:text-[11px] text-green-cash opacity-0 z-[4] pointer-events-none animate-cpfly" style={{ left: '-5%', top: '12%', animationDelay: '2s' }}>FIRE🔥</div>
              </div>
            </div>
          </div>
        </section>



        {/* STATS */}
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-8 border-b border-br">
          <div className="grid grid-cols-2 md:grid-cols-4 border-l border-br">
            {[
              { n: '150+', l: 'Verified Plays Monthly' },
              { n: '74%', l: 'Win Rate \u00B7 Last 30 Days' },
              { n: '24/7', l: 'Live Coverage' },
              { n: '∞', l: 'Sports Covered' },
            ].map((s, i) => (
              <div key={i} className="py-8 md:py-12 px-4 sm:px-6 md:px-8 lg:px-[32px] border-r border-br hover:bg-bbg-surface group transition-colors relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-orange scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-[450ms]"></div>
                <div className="font-brand text-[32px] sm:text-[40px] lg:text-[56px] tracking-[1px] text-orange mb-2 leading-none whitespace-nowrap truncate">{s.n}</div>
                <div className="font-display font-semibold text-[8px] sm:text-[9px] lg:text-[11px] tracking-[1px] lg:tracking-[2px] uppercase text-green-cash whitespace-nowrap truncate">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-br-mid to-transparent relative z-10"></div>

        {/* FEATURES */}
        <section id="features" className="relative py-[80px] md:py-[100px] bg-bbg-2 z-10 w-full">
          <div className="absolute top-1/2 right-[-60px] -translate-y-1/2 font-brand text-[240px] tracking-[10px] text-orange/[0.018] pointer-events-none uppercase">ALPHA</div>

          <div className="w-full max-w-[1200px] mx-auto px-6 md:px-8 relative z-10">
            <div className="font-display font-bold text-[10px] tracking-[5px] uppercase text-orange mb-3.5 flex items-center gap-3.5">
              What We Offer <span className="w-10 h-0.5 bg-orange-dim"></span>
            </div>
            <h2 className="font-brand text-[clamp(32px,5vw,72px)] leading-[1] tracking-[2px] text-green-cash mb-4 break-words">
              ENGINEERED FOR <em className="not-italic text-orange drop-shadow-[0_0_50px_rgba(242,100,25,0.4)]">ALPHA</em>
            </h2>
            <p className="text-green-cash opacity-80 text-[16px] md:text-[18px] max-w-[600px] mb-[60px] leading-[1.7]">
              Every edge we can find, distilled into signals you can act on — in real time.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 border border-br">
              {[
                { t: 'Sharp Analytics', d: 'ML models trained on millions of outcomes. We surface patterns human eyes miss.', w: '◈' },
                { t: 'Direct Insights', d: 'No fluff. Concise, actionable alerts pushed directly to your community channel.', w: '⬡' },
                { t: 'AI Trading', d: 'Automated signals with real-time odds tracking, line movement detection, and value ID.', w: '▲' },
                { t: 'Community Access', d: 'Join a collective of serious bettors. Share plays, debate lines, build your edge.', w: '◎' },
                { t: 'Fantasy Sports', d: 'Projections, lineup builds, waiver wire targets — dominate your season-long leagues.', w: '◆' },
                { t: '24/7 Support', d: 'Our team monitors markets round the clock. Clarity and help — any hour of the day.', w: '●' },
              ].map((f, i) => (
                <div key={i} className="p-[38px] px-[34px] border-r border-b border-br relative group hover:bg-bbg-surface transition-colors overflow-hidden bg-bbg-2">
                  <div className="absolute top-0 left-0 w-[3px] h-0 bg-orange group-hover:h-full transition-all duration-[350ms]"></div>
                  <div className="font-brand text-[13px] tracking-[2px] text-orange-dim mb-[18px]">0{i + 1}</div>
                  <div className="font-display font-black text-[22px] tracking-[1px] text-green-cash uppercase mb-2.5">{f.t}</div>
                  <p className="text-green-cash opacity-80 text-[14px] leading-[1.7]">{f.d}</p>
                  <div className="absolute -bottom-5 right-3.5 font-brand text-[110px] text-green/[0.07] group-hover:text-orange/[0.05] transition-colors select-none leading-none">{f.w}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <div className="h-px bg-gradient-to-r from-transparent via-br-mid to-transparent relative z-10"></div>

        {/* TIERS */}
        <section id="pricing" className="relative py-[80px] md:py-[100px] bg-bbg z-10 w-full">
          <div className="absolute top-0 right-0 w-[260px] h-full pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 18px, rgba(45,84,38,0.035) 18px, rgba(45,84,38,0.035) 19px)' }}></div>

          <div className="w-full max-w-[1200px] mx-auto px-6 md:px-8 relative z-10 text-center md:text-left">
            <div className="font-display font-bold text-[10px] tracking-[5px] uppercase text-orange mb-3.5 flex items-center justify-center md:justify-start gap-3.5">
              Membership <span className="w-10 h-0.5 bg-orange-dim"></span>
            </div>
            <h2 className="font-brand text-[clamp(40px,6vw,80px)] leading-[0.9] tracking-[2px] text-green-cash mb-4">
              CHOOSE<br className="md:hidden" /> YOUR <em className="not-italic text-orange drop-shadow-[0_0_50px_rgba(242,100,25,0.4)]">TIER</em>
            </h2>
            <p className="text-green-cash opacity-80 text-[16px] md:text-[18px] max-w-[500px] mx-auto md:mx-0 mb-[60px]">
              Start lean. Scale when you're printing money.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">
              {[
                { n: 'Weekly', p: '10', f: 'per week \u00B7 cancel anytime', hot: false },
                { n: 'Pro Monthly', p: '99', f: 'per month \u00B7 best value', hot: true },
                { n: 'Lifetime', p: '299', f: 'one-time \u00B7 everything forever', hot: false },
              ].map((t, i) => (
                <div key={i} className={`p-[38px] px-[30px] relative overflow-hidden transition-all duration-[250ms] hover:-translate-y-2 border ${t.hot ? 'bg-bbg-surface2 border-orange-dim' : 'bg-bbg-surface border-br hover:border-br-mid'}`}>
                  {t.hot && (
                    <>
                      <div className="absolute top-0 left-0 w-full text-center font-display font-black text-[9px] tracking-[5px] text-white bg-orange py-[7px] uppercase">◆ TOP PICK ◆</div>
                      <div className="absolute bottom-0 right-0 w-0 h-0 border-solid border-b-[70px] border-r-[70px] border-b-transparent border-r-orange/[0.12]"></div>
                    </>
                  )}
                  <div className={`font-display font-bold text-[11px] tracking-[4px] text-green-cash uppercase ${t.hot ? 'mt-[26px] mb-3' : 'mb-3'}`}>{t.n}</div>
                  <div className="font-brand text-[88px] tracking-[1px] leading-none text-orange flex items-start mb-0">
                    <span className="text-orange-dim text-[32px] mt-3 mr-1">$</span>{t.p}
                  </div>
                  <div className="text-[12px] text-green-cash opacity-60 pb-[22px] border-b border-br my-2 mb-[26px]">{t.f}</div>
                  <ul className="flex flex-col gap-[11px] mb-[28px]">
                    {['Access to Models', 'Community Discord', 'Live Alerts', t.hot ? '1-on-1 Coaching' : 'Basic Support'].map((feat, j) => (
                      <li key={j} className="text-[13px] text-green-cash flex items-center gap-[10px]">
                        <span className="w-4 h-[2px] bg-orange shrink-0"></span> {feat}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handlePurchase(t.n)}
                    disabled={purchasingTier !== null || isProcessing}
                    className={`w-full flex items-center justify-center gap-2 text-center font-display font-black text-[11px] tracking-[3px] uppercase transition-colors p-[13px] clip-path-lbl disabled:opacity-70 disabled:cursor-not-allowed ${t.hot ? 'bg-orange text-white border border-orange hover:bg-orange-hot' : 'border border-br-mid text-green-cash hover:text-orange hover:border-orange'}`}
                  >
                    {purchasingTier === t.n ? (
                      <>
                        <LoadingSpinner size={14} className="text-white" />
                        <span>PROCESSING...</span>
                      </>
                    ) : (
                      <span>Select {t.n}</span>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FOOTER */}
        <section id="community" className="relative py-[100px] md:py-[148px] text-center bg-bbg overflow-hidden z-10 flex flex-col items-center justify-center w-full">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(242,100,25,0.08)_0%,rgba(45,84,38,0.04)_40%,transparent_70%)] pointer-events-none z-0"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(242,100,25,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(242,100,25,0.04)_1px,transparent_1px)] bg-[size:72px_72px] pointer-events-none z-0"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[52%] font-brand text-[clamp(120px,26vw,380px)] tracking-[16px] text-green/[0.055] pointer-events-none uppercase whitespace-nowrap leading-none hidden md:block">BB</div>

          <div className="relative z-10 max-w-[1100px] w-full px-4 md:px-8">
            <div className="font-display font-bold text-[11px] tracking-[6px] text-orange-dim uppercase mb-[22px]">The mission is simple</div>
            <h2 className="font-brand text-[clamp(28px,5.5vw,90px)] leading-[1] text-green-cash mb-[22px] tracking-[4px] break-words">
              READY TO GET THAT <em className="not-italic text-orange drop-shadow-[0_0_100px_rgba(242,100,25,0.55)]">BREAD?</em>
            </h2>
            <p className="text-green-cash text-[16px] md:text-[18px] max-w-[480px] mb-[52px] mx-auto leading-[1.65]">
              An AI-Driven Betting Strategy will guide you through the markets — every single day.
            </p>
            <button
              onClick={user ? () => navigate('/dashboard') : handleSignIn}
              disabled={loading || isProcessing}
              className="inline-flex items-center justify-center gap-3 font-display font-black text-[14px] tracking-[3px] uppercase text-white bg-orange hover:bg-orange-hot transition-transform hover:-translate-y-[2px] px-[56px] py-[17px] clip-path-lbl disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {(loading || isProcessing) ? (
                <>
                  <LoadingSpinner size={16} />
                  <span>{isProcessing ? 'SIGNING IN...' : 'LOADING...'}</span>
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 127.14 96.36" fill="currentColor">
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.2,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                  </svg>
                  <span>{user ? 'Go to Dashboard' : 'Sign In Now'}</span>
                </>
              )}
            </button>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}