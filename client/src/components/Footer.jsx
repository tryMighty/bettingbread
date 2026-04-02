import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer({ className = '' }) {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="absolute top-0 left-0 right-0 h-[4px] bg-[linear-gradient(90deg,transparent,var(--o,#F26419),var(--ob,#FF8540),var(--o,#F26419),transparent)] z-20 pointer-events-none"></div>
      <footer className="py-[38px] border-t border-br relative z-10 bg-bbg w-full">
        <div className="w-full max-w-[1200px] mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-end gap-2 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
            <div className="w-[16px] h-[16px] md:w-[20px] md:h-[20px] rounded-full overflow-hidden border border-orange flex-shrink-0 translate-y-[3px]">
              <img src="/bettingBread-logo.jpg" alt="BettingBread" className="w-full h-full object-cover" />
            </div>
            <div className="font-brand text-[16px] tracking-[3px] text-green-cash leading-none">BB <span className="text-orange">BREAD</span></div>
          </Link>
          <div className="text-[12px] text-green-cash opacity-60 text-center">© {new Date().getFullYear()} BB Capital · AI-Driven Champions</div>
          <div className="flex gap-[24px] font-display font-semibold text-[12px] tracking-[1px] uppercase text-green-cash opacity-80">
            <a href="#" className="hover:text-orange transition-colors">Privacy</a>
            <a href="#" className="hover:text-orange transition-colors">Terms</a>
            <a href="#" className="hover:text-orange transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
