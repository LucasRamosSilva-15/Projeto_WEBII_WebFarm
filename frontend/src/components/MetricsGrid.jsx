import { useState, useEffect } from 'react';
import { Layers, TrendingUp, Tractor, Wrench, DollarSign, CheckCircle, Users } from 'lucide-react';
import { api } from '../services/api';

export default function MetricsGrid() {
  const [data, setData] = useState({
    animais: 0,
    maquinas: 0,
    funcionarios: 0,
    talhoes: 0,
    financeiro: {
      totalEntradas: 0,
      totalSaidas: 0,
      saldoLiquido: 0
    }
  });

  useEffect(() => {
    async function loadMetricas() {
      try {
        const res = await api.dashboard.getMetricas();
        if (res) {
          setData(res);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadMetricas();
  }, []);

  const totalAnimais = Number(data.animais || 0);
  const totalMaquinas = Number(data.maquinas || 0);
  const totalFuncionarios = Number(data.funcionarios ?? data.totalFuncionarios ?? 0);
  const saldoLiquido = Number(data.financeiro?.saldoLiquido || 0);

  const metrics = [
    {
      id: 'rebanho',
      label: 'Total do Rebanho',
      value: String(totalAnimais),
      unit: 'cabeças',
      subtext: totalAnimais > 0 ? `${totalAnimais} animais ativos no rebanho` : 'Nenhum animal cadastrado',
      icon: Layers,
      trendIcon: TrendingUp,
      iconColor: 'text-[#237a32] bg-emerald-50',
      borderLeft: 'border-l-4 border-l-[#237a32]',
      subColor: totalAnimais > 0 ? 'text-emerald-700' : 'text-slate-400'
    },
    {
      id: 'maquinas',
      label: 'Máquinas Cadastradas',
      value: String(totalMaquinas),
      unit: 'unidades',
      subtext: totalMaquinas > 0 ? `${totalMaquinas} equipamentos no pátio` : 'Nenhuma máquina cadastrada',
      icon: Tractor,
      trendIcon: Wrench,
      iconColor: 'text-slate-700 bg-slate-100',
      subColor: totalMaquinas > 0 ? 'text-amber-700' : 'text-slate-400'
    },
    {
      id: 'financeiro',
      label: 'Fluxo Financeiro',
      value: `R$ ${saldoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      unit: saldoLiquido >= 0 ? 'saldo' : 'déficit',
      subtext: (data.financeiro?.totalEntradas > 0 || data.financeiro?.totalSaidas > 0) ? 'Balanço consolidado' : 'Nenhuma movimentação lançada',
      icon: DollarSign,
      trendIcon: CheckCircle,
      iconColor: 'text-[#237a32] bg-emerald-50',
      valueColor: saldoLiquido >= 0 ? 'text-[#237a32]' : 'text-rose-600',
      unitColor: saldoLiquido >= 0 ? 'text-emerald-800' : 'text-rose-700',
      subColor: 'text-slate-500'
    },
    {
      id: 'equipe',
      label: 'Equipe em Campo',
      value: String(totalFuncionarios),
      unit: 'colaboradores',
      subtext: totalFuncionarios > 0 ? `${totalFuncionarios} colaboradores ativos` : 'Nenhum colaborador cadastrado',
      icon: Users,
      iconColor: 'text-slate-700 bg-slate-100',
      dotColor: totalFuncionarios > 0 ? 'bg-emerald-500' : 'bg-slate-300',
      subColor: totalFuncionarios > 0 ? 'text-emerald-700' : 'text-slate-400'
    }
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => {
        const Icon = m.icon;
        const TrendIcon = m.trendIcon;

        return (
          <div
            key={m.id}
            className={`bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-lg hover:-translate-y-1 hover:border-[#237a32]/35 transition-all duration-300 ease-out group relative overflow-hidden ${
              m.borderLeft || ''
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {m.label}
              </span>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-110 ${m.iconColor}`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div
              className={`text-2xl font-extrabold tracking-tight ${
                m.valueColor || 'text-slate-900'
              }`}
            >
              {m.value}{' '}
              <span
                className={`text-sm font-semibold ${
                  m.unitColor || 'text-slate-500'
                }`}
              >
                {m.unit}
              </span>
            </div>

            <div className={`mt-2.5 flex items-center gap-1.5 text-xs font-medium ${m.subColor}`}>
              {TrendIcon && <TrendIcon className="w-3.5 h-3.5 shrink-0" />}
              {m.dotColor && <span className={`w-2 h-2 rounded-full shrink-0 ${m.dotColor}`} />}
              <span>{m.subtext}</span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
