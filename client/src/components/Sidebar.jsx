export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 z-50 flex flex-col py-8 px-4 border-r border-[#F79D00]/10 bg-gradient-to-r from-[#131313] to-[#0E0E0E]">
      <div className="mb-10 px-4">
        <div className="flex items-center gap-3">
          <img alt="BB Mascot Admin" className="w-10 h-10 rounded-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_JYh3idJA2oDiwDsThsAVQxUc_3_0o36Aysa_ZPv-RRsYmtJOhOvDD83-D1JBjUXMOZMQaQ7UBL_PPjWjLGkNshit2AnRXvb7wa_BlkB65ufmlacfBVqhqGfCYvVJhQ7Jyw4h1sOh-zbszuEJx80wgYRw7wqM8xYIEToOkudD_n4fTUSIEqlN-fYB-ZEI-u_0J1F2nPIi2GhgF7BEBX39BoJMeObe4h2oUkTIe-7Jt2Q7lTMl13Z5HzUC4jZzVQ4IiJAclK6LX2k"/>
          <div>
            <h1 className="text-[#40E56C] font-black italic font-headline tracking-tighter">BB COMMAND</h1>
            <p className="font-['Space_Grotesk'] uppercase tracking-widest text-[10px] text-[#E5E2E1]/40">High-Octane Ops</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 space-y-2">
        <a className="flex items-center gap-3 px-4 py-3 bg-[#201F1F] text-[#F79D00] border-l-4 border-[#F79D00] shadow-[0_0_15px_rgba(247,157,0,0.2)] transition-all duration-200 ease-in-out group" href="#">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Overview</span>
        </a>
        <a className="flex items-center gap-3 px-4 py-3 text-[#E5E2E1]/40 hover:text-[#E5E2E1] hover:bg-[#131313] transition-all duration-200 ease-in-out group" href="#">
          <span className="material-symbols-outlined">group</span>
          <span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Members</span>
        </a>
        <a className="flex items-center gap-3 px-4 py-3 text-[#E5E2E1]/40 hover:text-[#E5E2E1] hover:bg-[#131313] transition-all duration-200 ease-in-out group" href="#">
          <span className="material-symbols-outlined">payments</span>
          <span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Revenue</span>
        </a>
        <a className="flex items-center gap-3 px-4 py-3 text-[#E5E2E1]/40 hover:text-[#E5E2E1] hover:bg-[#131313] transition-all duration-200 ease-in-out group" href="#">
          <span className="material-symbols-outlined">history</span>
          <span className="font-['Space_Grotesk'] uppercase tracking-widest text-xs">Activity Logs</span>
        </a>
      </nav>

      <div className="mt-auto space-y-4 px-4">
        <button className="w-full honey-gradient text-on-primary font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(247,157,0,0.3)] transition-all active:scale-95">
          <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
          <span className="font-['Space_Grotesk'] uppercase tracking-widest text-[10px]">Withdraw Profits</span>
        </button>
        <div className="pt-6 border-t border-white/5 space-y-2">
          <a className="flex items-center gap-3 text-[#E5E2E1]/30 hover:text-[#F79D00] transition-colors" href="#">
            <span className="material-symbols-outlined text-sm">help</span>
            <span className="font-['Space_Grotesk'] uppercase tracking-widest text-[10px]">Support</span>
          </a>
          <a className="flex items-center gap-3 text-[#E5E2E1]/30 hover:text-[#F79D00] transition-colors" href="#">
            <span className="material-symbols-outlined text-sm">dns</span>
            <span className="font-['Space_Grotesk'] uppercase tracking-widest text-[10px]">System Status</span>
          </a>
        </div>
      </div>
    </aside>
  )
}
