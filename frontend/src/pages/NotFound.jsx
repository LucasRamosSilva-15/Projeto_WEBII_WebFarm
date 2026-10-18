import { useState, useEffect } from 'react';
import { 
  MapPinOff, 
  Home, 
  ArrowLeft, 
  Sprout, 
  Tractor, 
  Users, 
  DollarSign, 
  Wheat, 
  BarChart3, 
  HelpCircle,
  LogIn,
  Search
} from 'lucide-react';

export default function NotFound({ onNavigate, user }) {
  const [requestedPath, setRequestedPath] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const full = (window.location.pathname || '') + (window.location.hash || '');
      setRequestedPath(full || '/rota-invalida');
    }
  }, []);

  const handleGoHome = () => {
    if (onNavigate) {
      onNavigate(user ? 'dashboard' : 'login');
    }
  };

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else if (onNavigate) {
      onNavigate(user ? 'dashboard' : 'login');
    }
  };

  const handleNavigateModule = (target) => {
    if (onNavigate) {
      if (user) {
        onNavigate(target);
      } else {
        onNavigate('login');
      }
    }
  };

  const modules = [
    { id: 'dashboard', label: 'Painel Central', icon: Home, desc: 'Visão consolidada da propriedade' },
    { id: 'animais', label: 'Pecuária & Rebanho', icon: Sprout, desc: 'Gestão de lotes, pesagens e vacinas' },
    { id: 'maquinas', label: 'Maquinários & Frotas', icon: Tractor, desc: 'Tratores, manutenções e horímetros' },
    { id: 'equipe', label: 'Equipe do Campo', icon: Users, desc: 'Colaboradores e registros de jornada' },
    { id: 'financeiro', label: 'Gestão Financeira', icon: DollarSign, desc: 'Fluxo de caixa, receitas e despesas' },
    { id: 'safra', label: 'Safras & Lavouras', icon: Wheat, desc: 'Talhões, plantio e colheitas' },
    { id: 'relatorios', label: 'Relatórios & BI', icon: BarChart3, desc: 'Métricas analíticas e exportações' }
  ];

  return (
    <div data-testid="not-found-page" className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col antialiased selection:bg-[#237a32]/20 selection:text-[#185824]">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            onClick={handleGoHome}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shadow-xs p-0.5 group-hover:scale-105 transition-transform">
              <img
                src="/images/logo_webFarm_1.svg"
                alt="Logo WebFarm"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 group-hover:text-[#237a32] transition-colors">
                WebFarm
              </span>
              <span className="ml-1 text-[10px] font-semibold tracking-wider text-slate-600 uppercase bg-slate-100 px-1.5 py-0.5 rounded-full border border-slate-200">
                2.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200/80 rounded-lg text-xs font-medium text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{user.fazenda || 'Fazenda Conectada'}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('login')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                <span>Entrar no Sistema</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14 flex flex-col justify-center">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold tracking-wide uppercase mb-6">
              <MapPinOff className="w-3.5 h-3.5 text-amber-600" />
              <span>Erro 404 • Talhão Não Mapeado</span>
            </div>

            <div className="mb-4 select-none">
              <div className="text-7xl sm:text-9xl font-black text-slate-900 tracking-tighter">
                4<span className="text-[#237a32]">0</span>4
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Coordenada ou Rota Não Encontrada
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl mb-6">
              A rota solicitada não corresponde a nenhum módulo operacional, documento ou talhão registrado na fazenda.
            </p>

            <div className="w-full max-w-md bg-slate-50 border border-slate-200 rounded-xl p-3 mb-8 flex items-center justify-between text-xs font-mono text-slate-600">
              <div className="flex items-center gap-2 truncate">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-400">Rota tentada:</span>
                <span className="font-semibold text-slate-800 truncate">{requestedPath || '/rota-invalida'}</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded shrink-0">
                Inexistente
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto mb-10">
              <button
                type="button"
                onClick={handleGoHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#237a32] hover:bg-[#185824] text-white font-semibold text-sm shadow-xs shadow-[#237a32]/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>{user ? 'Voltar ao Painel Geral' : 'Ir para a Página de Login'}</span>
              </button>

              <button
                type="button"
                onClick={handleGoBack}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-slate-500" />
                <span>Voltar à Página Anterior</span>
              </button>
            </div>

            <div className="w-full border-t border-slate-100 pt-8">
              <div className="text-left mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold text-[#237a32] uppercase tracking-wider">
                    Módulos Ativos do Sistema
                  </h2>
                  <p className="text-xs text-slate-500">
                    Selecione um dos módulos abaixo para continuar seu trabalho na fazenda:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {modules.map((mod) => {
                  const Icon = mod.icon;
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => handleNavigateModule(mod.id)}
                      className="p-3.5 rounded-xl border border-slate-200/80 hover:border-[#237a32]/50 hover:bg-emerald-50/30 transition-all text-left flex items-start gap-3 group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-[#237a32] group-hover:text-white text-slate-600 flex items-center justify-center shrink-0 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-800 group-hover:text-[#237a32] transition-colors truncate">
                          {mod.label}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {mod.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 px-2">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Dúvidas na navegação? Consulte a Central de Ajuda ou o Suporte ao Produtor.</span>
          </div>
          <div>
            <span>WebFarm Agro 2.0 • Todos os direitos reservados.</span>
          </div>
        </div>
      </main>
    </div>
  );
}
