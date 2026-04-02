import { useAuth } from '../contexts/AuthContext';

export default function TopNav() {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 w-full z-40 bg-[#131313] shadow-[0_0_40px_rgba(247,157,0,0.05)] border-none">
      <div className="flex justify-between items-center h-16 px-6 w-full ml-64 max-w-[calc(100%-16rem)] bg-[#201F1F]">
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#E5E2E1]/40">search</span>
            <input className="bg-[#0E0E0E] border-none rounded-lg pl-10 pr-4 py-2 text-sm w-80 focus:ring-1 focus:ring-[#F79D00]/40 placeholder:text-[#E5E2E1]/20 font-body" placeholder="Search members or transactions..." type="text"/>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 border-r border-white/5 pr-6">
            <button className="text-[#E5E2E1]/60 hover:text-[#40E56C] transition-all relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#F79D00] rounded-full border-2 border-[#201F1F]"></span>
            </button>
            <button className="text-[#E5E2E1]/60 hover:text-[#40E56C] transition-all">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-bold text-[#F79D00] font-headline uppercase tracking-tighter">
                {user?.user_metadata?.full_name || 'GUEST'}
              </p>
              <p className="text-[10px] text-[#E5E2E1]/40 font-label">
                {user ? 'VERIFIED_USER' : 'NOT_LOGGED_IN'}
              </p>
            </div>
            <img 
              alt="User Avatar" 
              className="w-10 h-10 rounded-full border border-[#F79D00]/20" 
              src={user?.user_metadata?.avatar_url || 'https://cdn.discordapp.com/embed/avatars/0.png'}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
