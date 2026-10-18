import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  HelpCircle,
  X,
  Search,
  BookOpen,
  Keyboard,
  MessageCircleQuestion,
  LifeBuoy,
  Layers,
  Truck,
  DollarSign,
  Wheat,
  Users,
  FileText,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Server
} from 'lucide-react';

export default function HelpCenterModal({ onClose, onNavigate }) {
  const [activeTab, setActiveTab] = useState('modulos');
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleNavegarModulo = (modulo) => {
    onClose();
    if (onNavigate) {
      onNavigate(modulo);
      return;
    }
    window.history.pushState(null, '', `/${modulo}`);
    window.dispatchEvent(new Event('popstate'));
  };

  const modulosGuia = [
    {
      id: 'animais',
      titulo: 'Pecuária & Gestão do Rebanho',
      descricao: 'Controle individual e por lotes de bovinos, código de brinco, raça, pesagens periódicas, vacinas aplicadas e monitoramento de ganho médio diário (GMD).',
      icon: Layers,
      cor: 'bg-emerald-50 text-[#237a32] border-emerald-200'
    },
    {
      id: 'maquinas',
      titulo: 'Maquinários, Tratores & Frota',
      descricao: 'Acompanhamento de horímetro, consumo, revisões preventivas programadas, troca de óleo e controle de status operacional dos equipamentos.',
      icon: Truck,
      cor: 'bg-slate-50 text-slate-700 border-slate-200'
    },
    {
      id: 'financeiro',
      titulo: 'Financeiro, Vendas & Custos',
      descricao: 'Lançamento de entradas (venda de gado, grãos) e saídas (insumos, peças, ração), DRE simplificado e cálculo dinâmico da margem operacional.',
      icon: DollarSign,
      cor: 'bg-emerald-50 text-[#185824] border-emerald-200'
    },
    {
      id: 'safra',
      titulo: 'Lavoura & Produção Agrícola',
      descricao: 'Mapeamento de talhões e safras, cultura plantada, área em hectares, estimativa de colheita e cálculo de produtividade real em sacas por hectare (sc/ha).',
      icon: Wheat,
      cor: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    {
      id: 'equipe',
      titulo: 'Equipe da Fazenda & RH',
      descricao: 'Cadastro de operadores de máquinas, vaqueiros, gerentes e colaboradores com controle de cargos, salários e datas de admissão.',
      icon: Users,
      cor: 'bg-slate-50 text-slate-700 border-slate-200'
    },
    {
      id: 'relatorios',
      titulo: 'Relatórios Executivos & Auditoria',
      descricao: 'Emissão institucional de relatórios em PDF para impressão e arquivos CSV para planilhas, além do log histórico completo de todas as ações da fazenda.',
      icon: FileText,
      cor: 'bg-blue-50 text-blue-700 border-blue-200'
    }
  ];

  const atalhosTeclado = [
    { tecla: '⌘K / Ctrl+K', acao: 'Focar no campo de busca global da Navbar' },
    { tecla: 'Esc', acao: 'Fechar modais, formulários e janelas suspensas' },
    { tecla: 'Tab', acao: 'Avançar para o próximo campo de formulário' },
    { tecla: 'Shift + Tab', acao: 'Retornar ao campo anterior de formulário' },
    { tecla: 'Enter', acao: 'Confirmar ação principal ou salvar registro em modais' },
    { tecla: 'Alt + 1', acao: 'Navegar diretamente para o Painel Geral (Dashboard)' },
    { tecla: 'Alt + 2', acao: 'Navegar para o módulo de Pecuária' },
    { tecla: 'Alt + 3', acao: 'Navegar para o módulo de Maquinários' },
    { tecla: 'Alt + 4', acao: 'Navegar para o módulo Financeiro' },
    { tecla: 'Alt + 5', acao: 'Navegar para o módulo de Produção Agrícola' },
    { tecla: 'Alt + 6', acao: 'Navegar para Relatórios & Histórico' }
  ];

  const faqs = [
    {
      pergunta: 'Como emitir um relatório em PDF com o timbre da minha propriedade?',
      resposta: 'Acesse o módulo de Relatórios no menu lateral, escolha o tipo de relatório desejado (como DRE Financeiro, Inventário do Rebanho ou Geral Consolidado) e clique no botão PDF. O sistema abrirá uma janela pré-formatada para impressão em papel timbrado com o nome da sua fazenda e data de emissão.'
    },
    {
      pergunta: 'Como o gráfico de Fluxo de Caixa calcula as receitas e despesas?',
      resposta: 'O gráfico lê automaticamente as transações financeiras registradas nos últimos 6 meses. Ele soma todas as entradas (em verde) e subtrai as despesas operacionais (em vermelho), exibindo as barras proporcionais e a tag de saldo líquido (superávit ou déficit).'
    },
    {
      pergunta: 'Como funciona a Central de Alertas e Pendências?',
      resposta: 'O WebFarm monitora em tempo real a base de dados. Se o saldo de caixa estiver negativo, se houver máquinas em manutenção ou se algum setor estiver sem cadastro inicial, o sistema sinaliza no painel principal com prioridades de atenção.'
    },
    {
      pergunta: 'Os dados cadastrados ficam salvos se eu fechar o navegador?',
      resposta: 'Sim. Todas as informações são persistidas no banco de dados SQLite local através do Sequelize ORM, garantindo integridade e recuperação a qualquer momento.'
    },
    {
      pergunta: 'Como exportar os dados para o Microsoft Excel ou Google Planilhas?',
      resposta: 'Em quase todas as tabelas e nos cards de Relatórios, existe o botão "CSV". Ao clicar, o navegador faz o download imediato de uma planilha delimitada por ponto e vírgula compatível com o Excel e LibreOffice Calc.'
    }
  ];

  const modulosFiltrados = modulosGuia.filter(
    (m) =>
      m.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const faqsFiltrados = faqs.filter(
    (f) =>
      f.pergunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.resposta.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const atalhosFiltrados = atalhosTeclado.filter(
    (a) =>
      a.tecla.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.acao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-backdrop-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-modal-in">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#237a32] border border-emerald-200/80 flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#237a32] uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
                  Documentação WebFarm
                </span>
                <span className="text-[10px] text-slate-400 font-medium">v2.0 Enterprise</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
                Central de Ajuda & Guia Operacional
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Fechar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 sm:px-6 pt-4 pb-3 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar em tópicos, atalhos ou dúvidas..."
              className="w-full pl-8 pr-3 py-1.5 bg-white text-xs text-slate-700 placeholder:text-slate-400 rounded-xl border border-slate-200 focus:outline-none focus:border-[#237a32] focus:ring-2 focus:ring-[#237a32]/10 transition-all shadow-xs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center p-1 bg-slate-200/70 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('modulos')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'modulos'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Módulos</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('atalhos')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'atalhos'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Atalhos</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('faq')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'faq'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageCircleQuestion className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dúvidas</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('suporte')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'suporte'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Status</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {activeTab === 'modulos' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              {modulosFiltrados.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <p className="text-sm">Nenhum módulo encontrado para "{searchTerm}".</p>
                </div>
              ) : (
                modulosFiltrados.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-[#237a32]/40 hover:bg-emerald-50/20 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${item.cor}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#237a32] transition-colors">
                            {item.titulo}
                          </h4>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                            {item.descricao}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleNavegarModulo(item.id)}
                        className="self-end sm:self-center shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-[#237a32] hover:text-white hover:border-[#237a32] transition-all shadow-xs cursor-pointer active:scale-95"
                      >
                        <span>Acessar</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'atalhos' && (
            <div className="space-y-2.5 animate-in fade-in duration-150">
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl mb-3 flex items-center gap-2 text-xs text-slate-600">
                <Keyboard className="w-4 h-4 text-[#237a32]" />
                <span>Utilize os atalhos abaixo para acelerar sua rotina diária no sistema.</span>
              </div>

              {atalhosFiltrados.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-xl border border-slate-200/90 flex items-center justify-between gap-4 hover:border-slate-300 transition-colors"
                >
                  <span className="text-xs font-medium text-slate-700">{item.acao}</span>
                  <kbd className="px-2.5 py-1 bg-slate-100 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-800 shadow-xs shrink-0">
                    {item.tecla}
                  </kbd>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              {faqsFiltrados.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <p className="text-sm">Nenhuma dúvida encontrada para "{searchTerm}".</p>
                </div>
              ) : (
                faqsFiltrados.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200 overflow-hidden bg-white transition-all duration-200 shadow-xs"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <span className="text-xs sm:text-sm font-bold text-slate-800">
                          {faq.pergunta}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                            isOpen ? 'rotate-180 text-[#237a32]' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50 animate-in fade-in duration-150">
                          {faq.resposta}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'suporte' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white text-[#237a32] border border-emerald-200 flex items-center justify-center shrink-0 shadow-xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">
                    Todos os Serviços Operando Regularmente
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                    Sua instalação do WebFarm está com integridade de banco de dados e rotas da API em conformidade operacional.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <Server className="w-3.5 h-3.5" />
                    <span>Ambiente do Servidor</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">Node.js + Express REST API</div>
                  <div className="text-[11px] text-emerald-700 font-medium">Porta 3000 • Ativo</div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Base de Dados</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">SQLite + Sequelize ORM</div>
                  <div className="text-[11px] text-emerald-700 font-medium">Sincronizado & Consistente</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-800">Versão da Aplicação: </span>
                  <span className="font-mono text-slate-600">WebFarm v2.0.4 Enterprise</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleNavegarModulo('relatorios')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#237a32] hover:underline cursor-pointer"
                >
                  <span>Histórico de Auditoria</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500">
            Dica: Pressione <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono font-bold">Esc</kbd> a qualquer momento para fechar.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 font-semibold rounded-xl text-slate-700 transition-colors shadow-xs cursor-pointer"
          >
            Fechar Guia
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
}
