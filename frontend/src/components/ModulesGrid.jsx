import { useEffect, useState } from 'react';
import {
  Layers,
  Truck,
  TrendingUp,
  Users,
  Wheat,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  X,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';

export default function ModulesGrid({ onNavigateModule }) {
  const [metricas, setMetricas] = useState({
    animais: 0,
    maquinas: 0,
    funcionarios: 0,
    talhoes: 0,
    financeiro: { totalEntradas: 0, totalSaidas: 0, saldoLiquido: 0 }
  });
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [metricasRes, animaisRes, maquinasRes] = await Promise.all([
        api.dashboard.getMetricas().catch(() => null),
        api.animais.getAll().catch(() => []),
        api.maquinas.getAll().catch(() => [])
      ]);

      const metricasCarregadas = metricasRes || {
        animais: Array.isArray(animaisRes) ? animaisRes.length : 0,
        maquinas: Array.isArray(maquinasRes) ? maquinasRes.length : 0,
        funcionarios: 0,
        talhoes: 0,
        financeiro: { totalEntradas: 0, totalSaidas: 0, saldoLiquido: 0 }
      };

      setMetricas(metricasCarregadas);

      const listaAlertas = [];
      const saldo = metricasCarregadas.financeiro?.saldoLiquido || 0;
      if (saldo < 0) {
        listaAlertas.push({
          id: 'fin_negativo',
          modulo: 'financeiro',
          titulo: 'Fluxo de Caixa em Déficit',
          descricao: `Saldo operacional acumulado está negativo em R$ ${Math.abs(saldo).toLocaleString('pt-BR')}.`,
          severidade: 'critico',
          acaoTexto: 'Ir para Financeiro'
        });
      }

      if (Array.isArray(maquinasRes)) {
        const maquinasManutencao = maquinasRes.filter((m) => {
          const st = String(m.status || '').toLowerCase();
          return st.includes('manuten') || st.includes('revis') || st.includes('quebr');
        });
        if (maquinasManutencao.length > 0) {
          listaAlertas.push({
            id: 'maq_manut',
            modulo: 'maquinas',
            titulo: 'Equipamentos em Manutenção',
            descricao: `${maquinasManutencao.length} máquina(s) com status de revisão ou reparo operacional.`,
            severidade: 'medio',
            acaoTexto: 'Ver Maquinários'
          });
        }
      }

      if (Array.isArray(animaisRes)) {
        const animaisAtencao = animaisRes.filter((a) => {
          const st = String(a.status || '').toLowerCase();
          return st.includes('trat') || st.includes('quarent') || st.includes('enferm') || st.includes('isol');
        });
        if (animaisAtencao.length > 0) {
          listaAlertas.push({
            id: 'ani_tratamento',
            modulo: 'animais',
            titulo: 'Animais em Tratamento Veterinário',
            descricao: `${animaisAtencao.length} cabeça(s) em quarentena ou sob cuidados médicos.`,
            severidade: 'medio',
            acaoTexto: 'Ver Rebanho'
          });
        }
      }

      if (metricasCarregadas.animais === 0) {
        listaAlertas.push({
          id: 'ani_zerado',
          modulo: 'animais',
          titulo: 'Rebanho Bovino Não Iniciado',
          descricao: 'Nenhum animal cadastrado no sistema para rastreamento e controle zootécnico.',
          severidade: 'baixo',
          acaoTexto: 'Cadastrar Animal'
        });
      }

      if (metricasCarregadas.talhoes === 0) {
        listaAlertas.push({
          id: 'safra_zerada',
          modulo: 'safra',
          titulo: 'Talhões Sem Cultivo Cadastrado',
          descricao: 'Nenhum lote agrícola registrado para estimativas de produtividade e colheita.',
          severidade: 'baixo',
          acaoTexto: 'Cadastrar Talhão'
        });
      }

      if (metricasCarregadas.funcionarios === 0) {
        listaAlertas.push({
          id: 'func_zerado',
          modulo: 'equipe',
          titulo: 'Equipe da Fazenda Não Registrada',
          descricao: 'Cadastre os operadores e colaboradores para controle de quadro de pessoal.',
          severidade: 'baixo',
          acaoTexto: 'Cadastrar Equipe'
        });
      }

      setAlertas(listaAlertas);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleClickAlerta = () => {
    setModalAberto(true);
  };

  const handleResolverAlerta = (moduloAlvo) => {
    setModalAberto(false);
    if (onNavigateModule) {
      onNavigateModule(moduloAlvo);
    }
  };

  const temAlertasCriticos = alertas.some((a) => a.severidade === 'critico');

  const modules = [
    {
      id: 'animais',
      tag: 'PECUÁRIA',
      tagStyle: 'text-[#237a32] bg-[#237a32]/10',
      title: 'Cadastro e Rastreabilidade',
      description: metricas.animais > 0
        ? `Acompanhamento individual de ${metricas.animais} bovinos com código de brinco, vacinas e pesagens.`
        : 'Controle por código de brinco, pesagens periódicas, vacinas e lotes de corte/leite.',
      footerInfo: `${metricas.animais} ${metricas.animais === 1 ? 'animal cadastrado' : 'animais cadastrados'}`,
      actionText: 'Acessar',
      icon: Layers,
      iconBox: 'bg-[#237a32]/10 text-[#237a32]'
    },
    {
      id: 'maquinas',
      tag: 'FROTA & EQUIPAMENTOS',
      tagStyle: 'text-slate-700 bg-slate-100',
      title: 'Tratores e Implementos',
      description: metricas.maquinas > 0
        ? `Monitoramento de horímetro, manutenções e revisões de ${metricas.maquinas} máquinas ativas.`
        : 'Acompanhamento de horímetro, trocas de óleo e revisões programadas de maquinários.',
      footerInfo: `${metricas.maquinas} ${metricas.maquinas === 1 ? 'unidade registrada' : 'unidades registradas'}`,
      actionText: 'Gerenciar',
      icon: Truck,
      iconBox: 'bg-slate-100 text-slate-700'
    },
    {
      id: 'financeiro',
      tag: 'FLUXO DE CAIXA',
      tagStyle: 'text-emerald-800 bg-emerald-100/60',
      title: 'Vendas e Aquisições',
      description: (metricas.financeiro.totalEntradas > 0 || metricas.financeiro.totalSaidas > 0)
        ? `Faturamento de R$ ${metricas.financeiro.totalEntradas.toLocaleString('pt-BR')} e R$ ${metricas.financeiro.totalSaidas.toLocaleString('pt-BR')} em custos.`
        : 'Registro simplificado de entradas comerciais e compras de insumos/ração.',
      footerInfo: `Saldo: ${metricas.financeiro.saldoLiquido >= 0 ? '+' : ''}R$ ${metricas.financeiro.saldoLiquido.toLocaleString('pt-BR')}`,
      actionText: 'Extrato',
      icon: TrendingUp,
      iconBox: 'bg-emerald-50 text-[#237a32]'
    },
    {
      id: 'equipe',
      tag: 'RECURSOS HUMANOS',
      tagStyle: 'text-slate-700 bg-slate-100',
      title: 'Equipe da Propriedade',
      description: metricas.funcionarios > 0
        ? `Organização de ${metricas.funcionarios} operadores, vaqueiros e permissões de acesso.`
        : 'Organização dos operadores de máquinas, vaqueiros e permissões de acesso.',
      footerInfo: `${metricas.funcionarios} ${metricas.funcionarios === 1 ? 'funcionário cadastrado' : 'funcionários cadastrados'}`,
      actionText: 'Visualizar',
      icon: Users,
      iconBox: 'bg-slate-100 text-slate-700'
    },
    {
      id: 'safra',
      tag: 'LAVOURA & PASTAGEM',
      tagStyle: 'text-amber-800 bg-amber-50',
      title: 'Áreas Plantadas e Colheita',
      description: metricas.talhoes > 0
        ? `Mapeamento de ${metricas.talhoes} talhões agrícolas com previsão e produtividade calculada.`
        : 'Mapeamento de talhões, culturas de milho/soja e cálculo de produtividade por hectare.',
      footerInfo: `${metricas.talhoes} ${metricas.talhoes === 1 ? 'talhão em plantio ativo' : 'talhões em plantio ativo'}`,
      actionText: 'Talhões',
      icon: Wheat,
      iconBox: 'bg-amber-50/80 text-amber-700'
    },
    {
      id: 'alertas',
      tag: temAlertasCriticos ? 'ATENÇÃO NECESSÁRIA' : (alertas.length > 0 ? 'PENDÊNCIAS ATIVAS' : 'SISTEMA EM DIA'),
      tagStyle: temAlertasCriticos
        ? 'text-rose-700 bg-rose-50 border border-rose-200'
        : (alertas.length > 0
          ? 'text-amber-800 bg-amber-50 border border-amber-200'
          : 'text-[#237a32] bg-[#237a32]/15 border border-[#237a32]/20'),
      hasPulse: alertas.length > 0,
      isSpecial: true,
      title: 'Alertas do Sistema',
      description: alertas.length > 0
        ? `${alertas[0].descricao} ${alertas.length > 1 ? `E mais ${alertas.length - 1} pendência(s) registrada(s).` : ''}`
        : 'Todas as operações agropecuárias, manutenções e balanços financeiros estão operando normalmente.',
      footerInfo: alertas.length > 0
        ? `${alertas.length} ${alertas.length === 1 ? 'pendência detectada' : 'pendências detectadas'}`
        : 'Nenhuma pendência crítica',
      actionText: alertas.length > 0 ? 'Revisar pendências' : 'Abrir central',
      icon: AlertCircle,
      iconBox: temAlertasCriticos
        ? 'bg-rose-100 text-rose-700'
        : (alertas.length > 0 ? 'bg-amber-100 text-amber-700' : 'bg-[#237a32]/10 text-[#237a32]')
    }
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#237a32]" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Ações e Módulos Centrais
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={carregarDados}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#237a32] transition-colors cursor-pointer"
            title="Atualizar dados dos módulos"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#237a32]' : ''}`} />
            <span className="hidden sm:inline">Atualizar</span>
          </button>
          <span className="text-xs text-slate-500">6 áreas integradas via MER</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {modules.map((item) => {
          const Icon = item.icon;

          if (item.isSpecial) {
            return (
              <div
                key={item.id}
                onClick={handleClickAlerta}
                className={`rounded-2xl p-6 border-2 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between group relative overflow-hidden cursor-pointer active:scale-[0.99] ${
                  temAlertasCriticos
                    ? 'bg-gradient-to-br from-rose-50/40 to-white border-rose-300 hover:border-rose-400'
                    : 'bg-gradient-to-br from-[#f7fbf8] to-white border-[#237a32]/40 hover:border-[#237a32]'
                }`}
              >
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#237a32]/5 rounded-full pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md flex items-center gap-1.5 ${item.tagStyle}`}
                    >
                      {item.hasPulse && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                            temAlertasCriticos ? 'bg-rose-600' : 'bg-[#237a32]'
                          }`}
                        />
                      )}
                      {item.tag}
                    </span>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${item.iconBox}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-[#237a32] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-200/60 flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold ${
                      temAlertasCriticos ? 'text-rose-700' : 'text-[#215f2d]'
                    }`}
                  >
                    {item.footerInfo}
                  </span>
                  <span className="text-xs font-bold text-[#237a32] group-hover:translate-x-1.5 transition-transform duration-200 inline-flex items-center gap-1">
                    <span>{item.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={item.id}
              onClick={() => onNavigateModule && onNavigateModule(item.id)}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:border-[#237a32]/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between group cursor-pointer active:scale-[0.99]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${item.tagStyle}`}
                  >
                    {item.tag}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-[#237a32] group-hover:text-white transition-all duration-300 ease-out ${item.iconBox}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-[#237a32] transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{item.footerInfo}</span>
                <span className="text-xs font-bold text-[#237a32] group-hover:translate-x-1.5 transition-transform duration-200 inline-flex items-center gap-1">
                  <span>{item.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {modalAberto && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-backdrop-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-modal-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Central de Alertas & Pendências
                  </h3>
                  <p className="text-xs text-slate-500">
                    Diagnóstico operacional em tempo real da propriedade
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {alertas.length === 0 ? (
                <div className="py-8 text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#237a32] flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">Tudo em conformidade!</h4>
                  <p className="text-xs text-slate-500 max-w-xs mt-1">
                    Não existem pendências críticas registradas no momento. Todos os setores estão operando normalmente.
                  </p>
                </div>
              ) : (
                alertas.map((alerta) => (
                  <div
                    key={alerta.id}
                    className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 transition-colors ${
                      alerta.severidade === 'critico'
                        ? 'bg-rose-50/60 border-rose-200'
                        : (alerta.severidade === 'medio'
                          ? 'bg-amber-50/60 border-amber-200'
                          : 'bg-slate-50 border-slate-200')
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                            alerta.severidade === 'critico'
                              ? 'bg-rose-100 text-rose-700'
                              : (alerta.severidade === 'medio'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-200 text-slate-700')
                          }`}
                        >
                          {alerta.severidade === 'critico' ? 'Crítico' : (alerta.severidade === 'medio' ? 'Atenção' : 'Aviso')}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">{alerta.titulo}</h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{alerta.descricao}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleResolverAlerta(alerta.modulo)}
                      className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-[#237a32] hover:text-white hover:border-[#237a32] transition-colors shadow-xs cursor-pointer"
                    >
                      <span>{alerta.acaoTexto}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleResolverAlerta('relatorios')}
                className="text-xs font-semibold text-[#237a32] hover:underline cursor-pointer"
              >
                Ver Relatórios Gerais da Fazenda
              </button>
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
