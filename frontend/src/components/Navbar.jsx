import { useState } from 'react';
import { Search, HelpCircle } from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import HelpCenterModal from './HelpCenterModal';

export default function Navbar({ searchTerm = '', onSearchChange, user, onNavigate }) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const firstName = user?.nome ? user.nome.split(' ')[0] : 'Produtor';

  return (
    <header className="h-16 px-6 lg:px-8 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div>
          <h1 className="text-sm font-semibold text-slate-800 tracking-tight flex items-center gap-2">
            <span>Olá, {firstName}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-normal text-xs">
              Quinta-feira, safra 2025/2026
            </span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block w-72 lg:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Buscar brinco, operador, trator ou NF..."
            className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 hover:bg-white text-xs text-slate-700 placeholder:text-slate-400 rounded-lg border border-slate-200 focus:outline-none focus:border-[#237a32] focus:ring-2 focus:ring-[#237a32]/10 transition-all shadow-xs"
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
            <kbd className="text-[10px] text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-mono">
              ⌘K
            </kbd>
          </div>
        </div>

        <div className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-[#f7fbf8] border border-emerald-200 text-xs font-medium text-[#215f2d]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#237a32]" />
          </span>
          <span className="text-[11px] font-semibold">
            Ambiente Conectado • Servidores OK
          </span>
        </div>

        <NotificationCenter onNavigate={onNavigate} user={user} />

        <button
          type="button"
          onClick={() => setIsHelpOpen(true)}
          className="p-2 text-slate-400 hover:text-[#237a32] hover:bg-emerald-50 rounded-xl transition-all duration-200 cursor-pointer active:scale-95"
          title="Ajuda & Documentação"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {isHelpOpen && (
        <HelpCenterModal onClose={() => setIsHelpOpen(false)} onNavigate={onNavigate} />
      )}
    </header>
  );
}
