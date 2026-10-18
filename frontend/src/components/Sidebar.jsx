import { useState, useEffect } from 'react';
import {
  MapPin,
  ChevronsUpDown,
  LayoutDashboard,
  Layers,
  Truck,
  TrendingUp,
  Users,
  Wheat,
  FileText,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import FarmProfileModal from './FarmProfileModal';

export default function Sidebar({ activeModule = 'dashboard', onSelectModule, onLogout, user }) {
  const [isFarmProfileOpen, setIsFarmProfileOpen] = useState(false);
  const [currentFarmName, setCurrentFarmName] = useState(user?.fazenda || 'São Carlos de Agosto');

  useEffect(() => {
    if (user?.fazenda) {
      setCurrentFarmName(user.fazenda);
    }
    const handleFarmChange = (e) => {
      if (e.detail?.nome) {
        setCurrentFarmName(e.detail.nome);
      }
    };
    window.addEventListener('webfarm:farm-updated', handleFarmChange);
    return () => window.removeEventListener('webfarm:farm-updated', handleFarmChange);
  }, [user?.fazenda]);
  const initials = user?.nome
    ? user.nome.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'WF';
  const userName = user?.nome || 'Produtor Rural';
  const userRole = user?.perfil || 'Administrador';
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Painel Principal',
      icon: LayoutDashboard,
      highlight: true
    },
    {
      id: 'animais',
      label: 'Animais & Rebanho',
      icon: Layers
    },
    {
      id: 'maquinas',
      label: 'Maquinários & Veículos',
      icon: Truck
    },
    {
      id: 'financeiro',
      label: 'Financeiro & Vendas',
      icon: TrendingUp
    },
    {
      id: 'equipe',
      label: 'Funcionários & Equipe',
      icon: Users
    },
    {
      id: 'safra',
      label: 'Produção Agrícola',
      icon: Wheat
    },
    {
      id: 'relatorios',
      label: 'Relatórios & Histórico',
      icon: FileText
    }
  ];

  return (
    <aside className="w-[268px] min-h-screen shrink-0 bg-[#0b2411] text-slate-200 flex flex-col justify-between border-r border-emerald-950/60 sticky top-0 h-screen z-30 shadow-xl shadow-black/15 select-none">
      <div className="flex flex-col flex-1 overflow-y-auto px-4 pt-5 pb-3">
        <div className="flex items-center gap-3 px-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-white backdrop-blur-md border border-white/20 overflow-hidden flex items-center justify-center shadow-md shadow-black/25 p-0.5 shrink-0">
            <img
              src="/images/logo_webFarm_1.svg"
              alt="Logo WebFarm"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-white leading-none">
                WebFarm
              </span>
              <span className="text-[10px] font-semibold tracking-wider px-1.5 py-0.5 rounded-md bg-[#237a32] text-white/95 uppercase border border-white/10 leading-none">
                2.0
              </span>
            </div>
            <span className="text-[10px] text-emerald-200/60 font-medium tracking-wide mt-1">
              Gestão Agropecuária e Serviços
            </span>
          </div>
        </div>

        <div className="mb-6 px-1">
          <label className="text-[10px] font-semibold tracking-wider uppercase text-emerald-300/50 block mb-1.5 px-1">
            Propriedade Ativa
          </label>
          <button
            type="button"
            onClick={() => setIsFarmProfileOpen(true)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 transition-all duration-200 text-left group cursor-pointer active:scale-95"
            title="Ver e Gerenciar Perfil da Fazenda"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#237a32]/40 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white group-hover:text-emerald-200 transition-colors truncate">
                  {currentFarmName}
                </p>
                <p className="text-[10px] text-emerald-200/60 truncate">
                  {user?.email || 'Propriedade Ativa'}
                </p>
              </div>
            </div>
            <ChevronsUpDown className="w-3.5 h-3.5 text-emerald-200/50 group-hover:text-white shrink-0 ml-1" />
          </button>
        </div>

        <nav className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300/40 px-3 pb-1">
            Módulos do Sistema
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectModule && onSelectModule(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs tracking-wide transition-all duration-200 text-left cursor-pointer active:scale-[0.98] ${isActive
                  ? 'bg-gradient-to-r from-[#237a32]/35 to-transparent text-white border-l-4 border-[#237a32] font-semibold shadow-sm translate-x-0.5'
                  : 'text-emerald-100/75 hover:text-white hover:bg-white/[0.08] hover:translate-x-1 font-medium group'
                  }`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform duration-200 ${isActive
                    ? 'text-emerald-300 scale-105'
                    : 'text-emerald-300/60 group-hover:text-emerald-300 group-hover:scale-110'
                    }`}
                />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold py-0.5 px-1.5 rounded-md ${isActive
                      ? 'bg-[#237a32] text-white'
                      : 'bg-white/10 text-emerald-200'
                      }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-6 p-3 rounded-xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 text-[11px] text-emerald-200/70">
          <div className="flex items-center gap-1.5 text-emerald-300 font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ambiente Seguro</span>
          </div>
          <p className="text-[10px] text-emerald-100/60 leading-relaxed">
            Sincronização em tempo real ativa com armazenamento em nuvem.
          </p>
        </div>
      </div>

      <div className="p-3 border-t border-emerald-950/80 bg-black/20">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.04] border border-white/5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#237a32] to-emerald-400 p-[1.5px]">
                <div className="w-full h-full rounded-full bg-[#185824] flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0b2411] rounded-full" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white leading-tight truncate">
                {userName}
              </p>
              <span className="inline-block mt-0.5 px-1.5 py-0.2 bg-emerald-400/20 text-emerald-300 text-[9px] font-medium rounded border border-emerald-400/30">
                {userRole}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            title="Sair do sistema"
            className="p-1.5 text-emerald-200/50 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <FarmProfileModal
        isOpen={isFarmProfileOpen}
        onClose={() => setIsFarmProfileOpen(false)}
        user={user}
        onFarmUpdate={(novaFazenda) => setCurrentFarmName(novaFazenda.nome)}
      />
    </aside>
  );
}
