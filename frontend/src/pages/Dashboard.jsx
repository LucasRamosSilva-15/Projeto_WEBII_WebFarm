import { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import MetricsGrid from '../components/MetricsGrid';
import ModulesGrid from '../components/ModulesGrid';
import RecentActivityTable from '../components/RecentActivityTable';
import GraficosDesempenho from '../components/GraficosDesempenho';
import Footer from '../components/Footer';

export default function Dashboard({ onNavigate, onLogout, user }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectModule = (moduleId) => {
    if (onNavigate) {
      onNavigate(moduleId);
    }
  };

  return (
    <div className="bg-[#f8fafc] text-slate-800 selection:bg-[#237a32]/20 selection:text-[#185824] min-h-screen flex antialiased">
      <Sidebar
        activeModule="dashboard"
        onSelectModule={handleSelectModule}
        onLogout={onLogout}
        user={user}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          user={user}
        />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#237a32] uppercase tracking-wider">
                Visão Consolidada
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Painel Central de Operações
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Indicadores chave de pecuária, lavoura, maquinários e saúde financeira.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Safra Atual 24/25</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('animais')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#237a32] hover:bg-[#185824] rounded-lg shadow-xs shadow-[#237a32]/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Novo Registro</span>
              </button>
            </div>
          </div>

          <MetricsGrid />

          <GraficosDesempenho onNavigate={onNavigate} />

          <ModulesGrid onNavigateModule={handleSelectModule} />

          <RecentActivityTable />
        </main>

        <Footer />
      </div>
    </div>
  );
}
