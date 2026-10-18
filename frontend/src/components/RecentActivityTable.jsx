import { useState, useEffect } from 'react';
import {
  Clock,
  Download,
  Layers,
  DollarSign,
  Wrench,
  Wheat,
  Check,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';

const DEFAULT_ACTIVITIES = [
  {
    id: 1,
    moduleType: 'pecuaria',
    time: 'Hoje, 09:30',
    badge: 'Animal #BR-402',
    badgeStyle: 'bg-emerald-50 text-[#237a32] border border-emerald-100',
    icon: Layers,
    description: 'Vacinação contra Febre Aftosa e pesagem de lote (445 kg) concluída',
    user: 'Carlos (Vaqueiro)',
    userInitial: 'C',
    userInitialBg: 'bg-slate-200 text-slate-700',
    status: 'Concluído',
    statusStyle: 'text-emerald-700 bg-emerald-50',
    isToday: true
  },
  {
    id: 2,
    moduleType: 'financeiro',
    time: 'Ontem, 16:15',
    badge: 'Venda #104',
    badgeStyle: 'bg-emerald-50 text-emerald-800 border border-emerald-100',
    icon: DollarSign,
    description: 'Comercialização de 20 novilhos registrada e NFP-e emitida com sucesso',
    user: 'Lucas (Admin)',
    userInitial: 'L',
    userInitialBg: 'bg-[#237a32] text-white',
    status: 'Faturado',
    statusStyle: 'text-emerald-700 bg-emerald-50',
    isToday: false
  },
  {
    id: 3,
    moduleType: 'maquinas',
    time: 'Ontem, 11:40',
    badge: 'Trator JD-7200',
    badgeStyle: 'bg-amber-50 text-amber-800 border border-amber-100',
    icon: Wrench,
    description: 'Troca preventiva de filtros e lubrificação programada de horímetro (2.450h)',
    user: 'Marcos (Mecânico)',
    userInitial: 'M',
    userInitialBg: 'bg-slate-200 text-slate-700',
    status: 'Em andamento',
    statusStyle: 'text-amber-700 bg-amber-50',
    statusIcon: Clock,
    isToday: false
  },
  {
    id: 4,
    moduleType: 'safra',
    time: '24/10, 08:00',
    badge: 'Talhão Norte #02',
    badgeStyle: 'bg-emerald-50 text-[#237a32] border border-emerald-100',
    icon: Wheat,
    description: 'Aplicação de adubação foliar e monitoramento de umidade do solo',
    user: 'Rodrigo (Agrônomo)',
    userInitial: 'R',
    userInitialBg: 'bg-slate-200 text-slate-700',
    status: 'Concluído',
    statusStyle: 'text-emerald-700 bg-emerald-50',
    isToday: false
  }
];

function getModuleIcon(modulo) {
  switch (modulo) {
    case 'pecuaria':
      return Layers;
    case 'financeiro':
      return DollarSign;
    case 'maquinas':
      return Wrench;
    case 'safra':
      return Wheat;
    default:
      return Layers;
  }
}

function getBadgeStyle(modulo) {
  switch (modulo) {
    case 'pecuaria':
      return 'bg-emerald-50 text-[#237a32] border border-emerald-100';
    case 'financeiro':
      return 'bg-blue-50 text-blue-700 border border-blue-100';
    case 'maquinas':
      return 'bg-amber-50 text-amber-700 border border-amber-100';
    case 'safra':
      return 'bg-lime-50 text-lime-800 border border-lime-100';
    default:
      return 'bg-slate-50 text-slate-700 border border-slate-200';
  }
}

function getStatusStyle(status) {
  const st = String(status || '').toLowerCase();
  if (st.includes('conclu') || st.includes('sucesso') || st.includes('fatur')) {
    return 'text-emerald-700 bg-emerald-50';
  }
  if (st.includes('andamento') || st.includes('pendent')) {
    return 'text-amber-700 bg-amber-50';
  }
  if (st.includes('cancel') || st.includes('erro') || st.includes('remov')) {
    return 'text-rose-700 bg-rose-50';
  }
  return 'text-slate-700 bg-slate-100';
}

function formatRelativeTime(dateString) {
  if (!dateString) return 'Recentemente';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  const now = new Date();
  const isSameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  const timePart = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  if (isSameDay) {
    return `Hoje, ${timePart}`;
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();
  if (isYesterday) {
    return `Ontem, ${timePart}`;
  }
  return `${date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}, ${timePart}`;
}

export default function RecentActivityTable() {
  const [filterModule, setFilterModule] = useState('todos');
  const [activities, setActivities] = useState(DEFAULT_ACTIVITIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadActivities() {
      try {
        const response = await api.historico.getAll({ limite: 10 });
        if (!active) return;
        const list = Array.isArray(response) ? response : response?.dados || [];
        if (list.length > 0) {
          const mapped = list.map((item) => {
            const user = item.responsavel || 'Operador';
            const userInitial = user.charAt(0).toUpperCase();
            const relTime = formatRelativeTime(item.dataHora || item.createdAt);
            const rawMod = (item.modulo || 'geral')
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '');
            const normalizedMod = rawMod.includes('pec')
              ? 'pecuaria'
              : rawMod.includes('maq')
              ? 'maquinas'
              : rawMod.includes('fin')
              ? 'financeiro'
              : rawMod.includes('saf') || rawMod.includes('lav')
              ? 'safra'
              : rawMod;
            return {
              id: item.id,
              moduleType: normalizedMod,
              time: item.data || relTime,
              badge: item.acao || item.titulo || item.tipo || 'Atividade',
              badgeStyle: getBadgeStyle(normalizedMod),
              icon: getModuleIcon(normalizedMod),
              description: item.detalhes || item.descricao || item.acao,
              user,
              userInitial,
              userInitialBg:
                userInitial === 'L' || userInitial === 'A' || userInitial === 'R'
                  ? 'bg-[#237a32] text-white'
                  : 'bg-slate-200 text-slate-700',
              status: item.tipo_evento === 'criacao' ? 'Criado' : item.tipo_evento === 'remocao' ? 'Removido' : item.status || 'Concluído',
              statusStyle: getStatusStyle(item.status || item.tipo_evento),
              statusIcon: String(item.status || '').toLowerCase().includes('andamento')
                ? Clock
                : Check,
              isToday: (item.data || '').includes('Hoje') || relTime.startsWith('Hoje')
            };
          });
          setActivities(mapped);
        }
      } catch (err) {
        setActivities(DEFAULT_ACTIVITIES);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadActivities();
    return () => {
      active = false;
    };
  }, []);

  const filtered =
    filterModule === 'todos'
      ? activities
      : activities.filter((a) => a.moduleType === filterModule);

  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#237a32]" />
            <span>Atividades e Movimentações Recentes</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Histórico auditável de lançamentos de campo, maquinário e financeiro.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-slate-400">Filtrar por:</span>
          <select
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 outline-none focus:border-[#237a32] cursor-pointer"
          >
            <option value="todos">Todos os Módulos</option>
            <option value="pecuaria">Pecuária</option>
            <option value="maquinas">Maquinários</option>
            <option value="financeiro">Financeiro</option>
            <option value="safra">Lavoura / Safra</option>
          </select>
          <button
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
            title="Exportar dados CSV/PDF"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-5">Data / Hora</th>
              <th className="py-3 px-5">Módulo</th>
              <th className="py-3 px-5">Descrição da Atividade</th>
              <th className="py-3 px-5">Responsável</th>
              <th className="py-3 px-5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filtered.map((item) => {
              const Icon = item.icon;
              const StatusIcon = item.statusIcon || Check;

              return (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5 font-medium text-slate-700 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.isToday ? 'bg-[#237a32]' : 'bg-slate-300'
                        }`}
                      />
                      <span>{item.time}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-semibold text-[11px] ${item.badgeStyle}`}
                    >
                      <Icon className="w-3 h-3" />
                      {item.badge}
                    </span>
                  </td>

                  <td className="py-3.5 px-5 text-slate-800 font-medium">
                    {item.description}
                  </td>

                  <td className="py-3.5 px-5 text-slate-600 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${item.userInitialBg}`}
                      >
                        {item.userInitial}
                      </div>
                      <span>{item.user}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${item.statusStyle}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {item.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="py-3 px-5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Mostrando {filtered.length} lançamentos registrados</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 cursor-not-allowed"
            disabled
          >
            Anterior
          </button>
          <button
            type="button"
            className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Próxima
          </button>
        </div>
      </div>
    </section>
  );
}
