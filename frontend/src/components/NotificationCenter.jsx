import { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  DollarSign,
  Truck,
  Layers,
  Wheat,
  Users,
  ShieldCheck,
  Clock,
  ExternalLink,
  X
} from 'lucide-react';
import { api } from '../services/api';

export default function NotificationCenter({ onNavigate, user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('todas');
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(() => {
    try {
      const stored = localStorage.getItem('webfarm_read_notifications');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const containerRef = useRef(null);

  const carregarNotificacoes = async () => {
    try {
      const [historicoRes, metricasRes] = await Promise.all([
        api.historico.getAll({ limite: 12 }).catch(() => []),
        api.dashboard.getMetricas().catch(() => null)
      ]);

      const listaHistorico = Array.isArray(historicoRes)
        ? historicoRes
        : (historicoRes?.dados || []);

      const geradas = [];

      if (metricasRes) {
        const saldo = metricasRes.financeiro?.saldoLiquido || 0;
        if (saldo < 0) {
          geradas.push({
            id: 'sys_saldo_negativo',
            titulo: 'Atenção ao Caixa',
            mensagem: `Saldo financeiro consolidado está negativo em R$ ${Math.abs(saldo).toLocaleString('pt-BR')}.`,
            modulo: 'financeiro',
            tipo: 'aviso',
            dataHora: 'Agora',
            prioridade: 1
          });
        }

        geradas.push({
          id: 'sys_conexao_servidor',
          titulo: 'Servidores Sincronizados',
          mensagem: 'Banco de dados da fazenda conectado com sucesso em nuvem.',
          modulo: 'sistema',
          tipo: 'sucesso',
          dataHora: 'Hoje',
          prioridade: 2
        });
      }

      listaHistorico.forEach((item) => {
        const rawMod = String(item.modulo || 'sistema').toLowerCase();
        let moduloAlvo = 'relatorios';
        let tipo = 'info';

        if (rawMod.includes('fin')) {
          moduloAlvo = 'financeiro';
          tipo = 'sucesso';
        } else if (rawMod.includes('pec') || rawMod.includes('anim')) {
          moduloAlvo = 'animais';
          tipo = 'info';
        } else if (rawMod.includes('maq') || rawMod.includes('frot')) {
          moduloAlvo = 'maquinas';
          tipo = 'aviso';
        } else if (rawMod.includes('saf') || rawMod.includes('prod') || rawMod.includes('lav')) {
          moduloAlvo = 'safra';
          tipo = 'sucesso';
        } else if (rawMod.includes('equ') || rawMod.includes('func')) {
          moduloAlvo = 'equipe';
          tipo = 'info';
        }

        geradas.push({
          id: `hist_${item.id}`,
          titulo: item.acao || item.titulo || 'Atividade Operacional',
          mensagem: item.detalhes || item.descricao || `Registro efetuado por ${item.responsavel || 'Operador'}.`,
          modulo: moduloAlvo,
          tipo,
          dataHora: item.data || 'Recentemente',
          responsavel: item.responsavel,
          prioridade: 3
        });
      });

      setNotifications(geradas);
    } catch {
      setNotifications([
        {
          id: 'sys_boas_vindas',
          titulo: 'Bem-vindo ao WebFarm',
          mensagem: 'Ambiente operacional carregado e pronto para monitoramento.',
          modulo: 'dashboard',
          tipo: 'sucesso',
          dataHora: 'Agora'
        }
      ]);
    }
  };

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const salvarLidas = (novasLidas) => {
    setReadIds(novasLidas);
    try {
      localStorage.setItem('webfarm_read_notifications', JSON.stringify(novasLidas));
    } catch {}
  };

  const handleMarcarComoLida = (id, e) => {
    if (e) e.stopPropagation();
    if (!readIds.includes(id)) {
      salvarLidas([...readIds, id]);
    }
  };

  const handleMarcarTodasComoLidas = () => {
    const todosIds = notifications.map((n) => n.id);
    salvarLidas(Array.from(new Set([...readIds, ...todosIds])));
  };

  const handleLimparLidas = () => {
    setNotifications((prev) => prev.filter((n) => !readIds.includes(n.id)));
  };

  const handleRemoverNotificacao = (id, e) => {
    if (e) e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    handleMarcarComoLida(id);
  };

  const handleNavegar = (moduloAlvo, notifId) => {
    handleMarcarComoLida(notifId);
    setIsOpen(false);

    if (onNavigate) {
      onNavigate(moduloAlvo);
      return;
    }

    if (moduloAlvo) {
      window.history.pushState(null, '', `/${moduloAlvo}`);
      window.dispatchEvent(new Event('popstate'));
    }
  };

  const unreadNotifications = notifications.filter((n) => !readIds.includes(n.id));
  const unreadCount = unreadNotifications.length;

  const listaExibida = activeTab === 'naoLidas'
    ? unreadNotifications
    : notifications;

  const getModuleIcon = (modulo) => {
    switch (modulo) {
      case 'financeiro':
        return <DollarSign className="w-3.5 h-3.5" />;
      case 'animais':
        return <Layers className="w-3.5 h-3.5" />;
      case 'maquinas':
        return <Truck className="w-3.5 h-3.5" />;
      case 'safra':
        return <Wheat className="w-3.5 h-3.5" />;
      case 'equipe':
        return <Users className="w-3.5 h-3.5" />;
      default:
        return <ShieldCheck className="w-3.5 h-3.5" />;
    }
  };

  const getIconContainerStyle = (modulo, tipo) => {
    if (tipo === 'aviso') return 'bg-rose-100 text-rose-700';
    switch (modulo) {
      case 'financeiro':
        return 'bg-emerald-100 text-[#185824]';
      case 'animais':
        return 'bg-emerald-100 text-[#237a32]';
      case 'maquinas':
        return 'bg-amber-100 text-amber-800';
      case 'safra':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'equipe':
        return 'bg-slate-100 text-slate-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200 cursor-pointer bell-hover active:scale-95 group"
        title="Central de Notificações"
      >
        <Bell className="w-4 h-4 bell-icon transition-colors" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#237a32] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-notification-badge">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-notification-popover">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Notificações</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#185824] text-[10px] font-bold">
                  {unreadCount} nova{unreadCount > 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarcarTodasComoLidas}
                  className="flex items-center gap-1 text-[11px] font-semibold text-[#237a32] hover:text-[#185824] px-2 py-1 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                  title="Marcar todas como lidas"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Lidas</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 px-4 pt-2.5 pb-2 bg-slate-50/70 border-b border-slate-100 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('todas')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'todas'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Todas ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('naoLidas')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'naoLidas'
                  ? 'bg-white text-[#185824] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Não lidas</span>
              {unreadCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#237a32] text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-100/80">
            {listaExibida.length === 0 ? (
              <div className="py-10 px-4 text-center flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
                  <Check className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-xs font-bold text-slate-800">Tudo limpo por aqui</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {activeTab === 'naoLidas'
                    ? 'Você leu todas as notificações recentes.'
                    : 'Nenhuma notificação registrada no momento.'}
                </p>
              </div>
            ) : (
              listaExibida.map((item) => {
                const isRead = readIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => handleNavegar(item.modulo, item.id)}
                    className={`p-3.5 flex items-start gap-3 transition-all duration-150 cursor-pointer group animate-notification-item ${
                      isRead
                        ? 'bg-white hover:bg-slate-50/80 opacity-75 hover:opacity-100'
                        : 'bg-emerald-50/30 hover:bg-emerald-50/60'
                    }`}
                  >
                    <div className="mt-0.5 relative shrink-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${getIconContainerStyle(
                          item.modulo,
                          item.tipo
                        )}`}
                      >
                        {getModuleIcon(item.modulo)}
                      </div>
                      {!isRead && (
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#237a32] ring-2 ring-white animate-pulse" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4
                          className={`text-xs font-bold truncate ${
                            isRead ? 'text-slate-800' : 'text-slate-900 group-hover:text-[#237a32]'
                          }`}
                        >
                          {item.titulo}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{item.dataHora}</span>
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed line-clamp-2">
                        {item.mensagem}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#237a32] group-hover:underline">
                          <span>Acessar módulo</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </span>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!isRead && (
                            <button
                              type="button"
                              onClick={(e) => handleMarcarComoLida(item.id, e)}
                              className="p-1 text-slate-400 hover:text-[#237a32] rounded hover:bg-white transition-colors cursor-pointer"
                              title="Marcar como lida"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => handleRemoverNotificacao(item.id, e)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-white transition-colors cursor-pointer"
                            title="Remover"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => handleNavegar('relatorios', null)}
              className="text-[11px] font-semibold text-[#237a32] hover:text-[#185824] hover:underline cursor-pointer"
            >
              Ver Histórico Completo de Auditoria
            </button>

            {readIds.length > 0 && (
              <button
                type="button"
                onClick={handleLimparLidas}
                className="text-[11px] text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Limpar lidas
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
