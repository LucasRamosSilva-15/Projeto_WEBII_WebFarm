import { useState, useEffect } from 'react';
import {
  FileText,
  History,
  Download,
  Search,
  Filter,
  Calendar,
  Printer,
  Plus,
  Check,
  X,
  ChevronDown,
  ShieldCheck,
  Layers,
  Truck,
  TrendingUp,
  Users,
  Wheat,
  Clock,
  Trash2,
  FileSpreadsheet,
  Activity,
  List
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GraficosDesempenho from '../components/GraficosDesempenho';
import { api } from '../services/api';
import { exportToCSV, exportToJSON, exportToPrintableReport } from '../services/exportService';

export default function Relatorios({ onNavigate, onLogout, user }) {
  const [modelosRelatorios] = useState([
    {
      id: 1,
      titulo: 'DRE & Fluxo de Caixa Consolidado',
      modulo: 'Financeiro',
      periodo: 'Safra Atual 24/25',
      formato: 'PDF & XLSX',
      tamanho: '2.4 MB',
      icon: TrendingUp,
      descricao: 'Demonstrativo de resultado com entradas de comercialização, compras de insumos e margem operacional.'
    },
    {
      id: 2,
      titulo: 'Inventário e Rastreabilidade do Rebanho',
      modulo: 'Pecuária',
      periodo: 'Outubro / 2025',
      formato: 'PDF',
      tamanho: '1.8 MB',
      icon: Layers,
      descricao: 'Listagem de 1.240 animais com código de brinco, curva de peso, vacinas e lotes de corte/leite.'
    },
    {
      id: 3,
      titulo: 'Caderno de Campo & Manejo de Talhões',
      modulo: 'Safra',
      periodo: 'Ciclo 2024/2025',
      formato: 'PDF & XLSX',
      tamanho: '3.1 MB',
      icon: Wheat,
      descricao: 'Histórico de semeadura, desenvolvimento vegetativo, dessecação e produtividade estimada por talhão.'
    },
    {
      id: 4,
      titulo: 'Horímetro & Manutenção Preventiva da Frota',
      modulo: 'Maquinários',
      periodo: 'Últimos 90 dias',
      formato: 'PDF',
      tamanho: '1.2 MB',
      icon: Truck,
      descricao: 'Quadro geral de tratores e colheitadeiras, controle de troca de óleo, revisões e custos com diesel.'
    },
    {
      id: 5,
      titulo: 'Folha de Equipe & Diárias Rurais',
      modulo: 'Equipe',
      periodo: 'Mensal',
      formato: 'XLSX',
      tamanho: '850 KB',
      icon: Users,
      descricao: 'Relação de operadores, vaqueiros, diárias de campo, atestados e controle de permissões no sistema.'
    }
  ]);

  const [historicoLogs, setHistoricoLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModulo, setFilterModulo] = useState('todos');
  const [viewMode, setViewMode] = useState('tabela');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('novoLog');
  const [isBottomMenuOpen, setIsBottomMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    modulo: 'Financeiro',
    responsavel: 'Lucas Ramos',
    acao: '',
    detalhes: '',
    data: ''
  });

  const [relatorioCustom, setRelatorioCustom] = useState({
    tipo: 'Financeiro & Fluxo de Caixa',
    periodo: 'Safra Atual 2024/2025',
    formato: 'PDF',
    incluirAuditoria: true
  });

  const totalRelatoriosEmitidos = modelosRelatorios.length + 23;
  const totalLogs = historicoLogs.length;

  const loadHistorico = async () => {
    try {
      const data = await api.historico.getAll();
      if (Array.isArray(data)) {
        setHistoricoLogs(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadHistorico();
  }, []);

  const handleOpenAddLogModal = () => {
    setModalType('novoLog');
    setFormData({
      modulo: 'Financeiro',
      responsavel: user?.nome || 'Lucas Ramos',
      acao: '',
      detalhes: '',
      data: new Date().toLocaleString('pt-BR')
    });
    setIsModalOpen(true);
    setIsBottomMenuOpen(false);
  };

  const handleOpenGenerateReportModal = () => {
    setModalType('gerarRelatorio');
    setIsModalOpen(true);
    setIsBottomMenuOpen(false);
  };

  const handleDeleteLog = async (id) => {
    if (confirm('Deseja realmente remover este registro de histórico?')) {
      try {
        await api.historico.delete(id);
        setHistoricoLogs((prev) => prev.filter((log) => log.id !== id));
      } catch (err) {
        alert('Erro ao excluir registro: ' + err.message);
      }
    }
  };

  const handleSaveLog = async (e) => {
    e.preventDefault();

    if (!formData.acao.trim() || !formData.detalhes.trim()) {
      alert('Ação e detalhes são obrigatórios.');
      return;
    }

    const payload = {
      ...formData,
      responsavel: user?.name || formData.responsavel || 'Administrador WebFarm',
      data: formData.data || new Date().toLocaleString('pt-BR'),
      protocolo: `WF-${formData.modulo.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
    };

    try {
      const criado = await api.historico.create(payload);
      setHistoricoLogs((prev) => [criado, ...prev]);
      setIsModalOpen(false);
    } catch (err) {
      alert('Erro ao registrar histórico: ' + err.message);
    }
  };

  const handleDownloadModelo = async (rel) => {
    try {
      if (rel.id === 1) {
        const transacoes = await api.transacoes.getAll();
        const headers = ['ID', 'Data', 'Tipo', 'Categoria', 'Descrição', 'Valor (R$)', 'Status', 'Comprovante'];
        const rows = transacoes.map((t) => [
          t.id,
          t.data,
          t.tipo.toUpperCase(),
          t.categoria,
          t.descricao,
          Number(t.valor || 0).toFixed(2),
          t.status,
          t.comprovante || '-'
        ]);
        exportToCSV('WebFarm_DRE_Fluxo_Caixa.csv', headers, rows);
      } else if (rel.id === 2) {
        const animais = await api.animais.getAll();
        const headers = ['ID', 'Código Brinco', 'Espécie', 'Raça', 'Sexo', 'Peso (kg)', 'Status', 'Origem'];
        const rows = animais.map((a) => [
          a.id,
          a.codigo_brinco,
          a.especie,
          a.raca,
          a.sexo,
          a.peso,
          a.status,
          a.origem
        ]);
        exportToCSV('WebFarm_Inventario_Rebanho.csv', headers, rows);
      } else if (rel.id === 3) {
        const producoes = await api.producoes.getAll();
        const headers = ['ID', 'Talhão / Lote', 'Cultura', 'Variedade', 'Área (ha)', 'Data Plantio', 'Estágio', 'Previsão Colheita', 'Produtividade Estimada', 'Status'];
        const rows = producoes.map((p) => [
          p.id,
          p.nome,
          p.cultura,
          p.variedade || '-',
          p.areaHa,
          p.dataPlantio,
          p.estagio,
          p.previsaoColheita || '-',
          p.produtividadeEstimada || '-',
          p.status
        ]);
        exportToCSV('WebFarm_Caderno_Campo_Safra.csv', headers, rows);
      } else if (rel.id === 4) {
        const maquinas = await api.maquinas.getAll();
        const headers = ['ID', 'Prefixo', 'Tipo', 'Marca', 'Modelo', 'Ano', 'Horímetro (hrs)', 'Status', 'Operador', 'Última Revisão', 'Próxima Revisão'];
        const rows = maquinas.map((m) => [
          m.id,
          m.prefixo,
          m.tipo,
          m.marca,
          m.modelo,
          m.ano,
          m.horimetro,
          m.status,
          m.operador || '-',
          m.ultimaRevisao || '-',
          m.proximaRevisao || '-'
        ]);
        exportToCSV('WebFarm_Frota_Maquinarios.csv', headers, rows);
      } else if (rel.id === 5) {
        const funcionarios = await api.funcionarios.getAll();
        const headers = ['ID', 'Nome', 'CPF', 'Função / Cargo', 'Telefone', 'Salário (R$)', 'Status', 'Data Admissão'];
        const rows = funcionarios.map((f) => [
          f.id,
          f.nome,
          f.cpf,
          f.funcao,
          f.cell,
          Number(f.salario || 0).toFixed(2),
          f.status,
          f.data_admissao
        ]);
        exportToCSV('WebFarm_Folha_Equipe_Rural.csv', headers, rows);
      } else {
        const headers = ['Data', 'Módulo', 'Ação Realizada', 'Detalhes', 'Responsável', 'Protocolo'];
        const rows = historicoLogs.map((l) => [
          l.data,
          l.modulo,
          l.acao,
          l.detalhes,
          l.responsavel,
          l.protocolo
        ]);
        exportToCSV('WebFarm_Auditoria_Logs.csv', headers, rows);
      }
    } catch (err) {
      alert('Erro ao exportar dados: ' + err.message);
    }
  };

  const handleGenerateReportSubmit = async (e) => {
    e.preventDefault();
    const formato = relatorioCustom.formato || 'PDF';
    const tipo = relatorioCustom.tipo;
    const periodo = relatorioCustom.periodo;

    try {
      let title = tipo;
      let headers = [];
      let rows = [];
      let rawData = [];

      if (tipo.includes('Financeiro')) {
        const dados = await api.transacoes.getAll();
        rawData = dados;
        headers = ['Data', 'Tipo', 'Categoria', 'Descrição', 'Valor (R$)', 'Status'];
        rows = dados.map((t) => [
          t.data,
          t.tipo.toUpperCase(),
          t.categoria,
          t.descricao,
          `R$ ${Number(t.valor || 0).toLocaleString('pt-BR')}`,
          t.status
        ]);
      } else if (tipo.includes('Rebanho') || tipo.includes('Pecuária')) {
        const dados = await api.animais.getAll();
        rawData = dados;
        headers = ['Brinco', 'Espécie', 'Raça', 'Sexo', 'Peso Atual', 'Status', 'Origem'];
        rows = dados.map((a) => [
          a.codigo_brinco,
          a.especie,
          a.raca,
          a.sexo,
          `${a.peso} kg`,
          a.status,
          a.origem
        ]);
      } else if (tipo.includes('Safra') || tipo.includes('Agrícola')) {
        const dados = await api.producoes.getAll();
        rawData = dados;
        headers = ['Talhão', 'Cultura', 'Variedade', 'Área', 'Estágio', 'Previsão Colheita', 'Status'];
        rows = dados.map((p) => [
          p.nome,
          p.cultura,
          p.variedade || '-',
          `${p.areaHa} ha`,
          p.estagio,
          p.previsaoColheita || '-',
          p.status
        ]);
      } else if (tipo.includes('Maquinários') || tipo.includes('Frota')) {
        const dados = await api.maquinas.getAll();
        rawData = dados;
        headers = ['Prefixo', 'Equipamento', 'Marca', 'Modelo', 'Horímetro', 'Status', 'Operador'];
        rows = dados.map((m) => [
          m.prefixo,
          m.tipo,
          m.marca,
          m.modelo,
          `${m.horimetro} hrs`,
          m.status,
          m.operador || '-'
        ]);
      } else {
        rawData = historicoLogs;
        headers = ['Data', 'Módulo', 'Ação', 'Detalhes', 'Responsável', 'Protocolo'];
        rows = historicoLogs.map((l) => [
          l.data,
          l.modulo,
          l.acao,
          l.detalhes,
          l.responsavel,
          l.protocolo
        ]);
      }

      const fileName = `WebFarm_${tipo.replace(/[^a-zA-Z0-9]/g, '_')}_${periodo.replace(/[^a-zA-Z0-9]/g, '_')}`;

      if (formato === 'CSV' || formato === 'XLSX') {
        exportToCSV(`${fileName}.csv`, headers, rows);
      } else if (formato === 'JSON') {
        exportToJSON(`${fileName}.json`, rawData);
      } else {
        exportToPrintableReport(
          title,
          `Período de Referência: ${periodo}`,
          {
            'Propriedade': user?.fazenda || 'Minha Propriedade',
            'Total de Registros': rows.length,
            'Emitido por': user?.nome || user?.name || 'Administrador WebFarm',
            'Status': 'Validado & Conciliado'
          },
          headers,
          rows
        );
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Erro ao gerar relatório: ' + err.message);
    }
  };

  const handleExportarHistoricoCompleto = () => {
    const headers = ['Data', 'Módulo', 'Ação', 'Detalhes', 'Responsável', 'Protocolo'];
    const rows = filteredLogs.map((l) => [
      l.data,
      l.modulo,
      l.acao,
      l.detalhes,
      l.responsavel,
      l.protocolo
    ]);
    exportToCSV('WebFarm_Historico_Auditoria_Completo.csv', headers, rows);
  };

  const filteredLogs = historicoLogs.filter((log) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      log.acao.toLowerCase().includes(term) ||
      log.detalhes.toLowerCase().includes(term) ||
      log.responsavel.toLowerCase().includes(term) ||
      log.protocolo.toLowerCase().includes(term);

    const matchesModulo = filterModulo === 'todos' || log.modulo === filterModulo;
    return matchesSearch && matchesModulo;
  });

  return (
    <div className="bg-[#f8fafc] text-slate-800 selection:bg-[#237a32]/20 selection:text-[#185824] min-h-screen flex antialiased">
      <Sidebar
        activeModule="relatorios"
        onSelectModule={onNavigate}
        onLogout={onLogout}
        user={user}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} user={user} />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8 pb-24">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#237a32]" />
                <span className="text-xs font-bold text-[#237a32] uppercase tracking-wider">
                  Módulo de Inteligência & Auditoria
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Relatórios & Histórico Operacional
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Emissão de demonstrativos gerenciais, histórico cronológico de atividades e rastreabilidade total.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenAddLogModal}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4 text-slate-500" />
                <span>Registrar Evento</span>
              </button>
              <button
                type="button"
                onClick={handleOpenGenerateReportModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#237a32] hover:bg-[#185824] rounded-xl shadow-sm shadow-[#237a32]/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Gerar Relatório</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs relative overflow-hidden border-l-4 border-l-[#237a32]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Relatórios Consolidados
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#237a32] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {totalRelatoriosEmitidos} emitidos
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Disponíveis para exportação em PDF e planilhas
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Eventos Auditados
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-[#237a32] tracking-tight">
                1.482 registros
              </div>
              <div className="mt-2 text-xs text-emerald-700 font-medium">
                Rastreabilidade ponta a ponta da fazenda
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Conformidade & Auditoria
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#237a32] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                100% Em Dia
              </div>
              <div className="mt-2 text-xs text-slate-500 font-medium">
                Padrões GTA, CAR e boas práticas agronômicas
              </div>
            </div>
          </div>

          <GraficosDesempenho />

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Modelos de Relatórios Prontos para Download
                </h3>
                <p className="text-xs text-slate-500">
                  Extratos estruturados com dados atualizados em tempo real de cada setor.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modelosRelatorios.map((rel) => {
                const Icon = rel.icon;
                return (
                  <div
                    key={rel.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-[#237a32]/50 hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-[#237a32] border border-emerald-100">
                          {rel.modulo}
                        </span>
                        <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-[#237a32] group-hover:text-white transition-colors flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#237a32] transition-colors leading-snug">
                        {rel.titulo}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                        {rel.descricao}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium text-[11px]">
                        {rel.periodo} • {rel.tamanho}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDownloadModelo(rel)}
                        className="inline-flex items-center gap-1.5 font-bold text-[#237a32] hover:text-[#185824] cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Baixar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Histórico & Linha do Tempo de Atividades
                </h3>
                <p className="text-xs text-slate-500">
                  Rastreabilidade completa de todas as operações cadastradas na propriedade.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Filtrar por ação, operador ou protocolo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-white text-xs rounded-xl border border-slate-200 outline-none focus:border-[#237a32] transition-all shadow-xs"
                  />
                </div>

                <div className="flex items-center bg-white border border-slate-200 p-0.5 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setFilterModulo('todos')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${filterModulo === 'todos'
                      ? 'bg-[#237a32] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    Todos
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterModulo('Financeiro')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${filterModulo === 'Financeiro'
                      ? 'bg-[#237a32] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    Financeiro
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterModulo('Pecuária')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${filterModulo === 'Pecuária'
                      ? 'bg-[#237a32] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    Gado
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterModulo('Safra')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${filterModulo === 'Safra'
                      ? 'bg-[#237a32] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    Safra
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleExportarHistoricoCompleto}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-xs cursor-pointer"
                  title="Exportar Registros em CSV"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Exportar CSV</span>
                </button>

                <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setViewMode('tabela')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                      viewMode === 'tabela'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <List className="w-3 h-3" />
                    <span>Tabela</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('timeline')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                      viewMode === 'timeline'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Activity className="w-3 h-3" />
                    <span>Linha do Tempo</span>
                  </button>
                </div>
              </div>
            </div>

            {viewMode === 'tabela' ? (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        <th className="py-3.5 px-5">Data & Hora</th>
                        <th className="py-3.5 px-5">Módulo</th>
                        <th className="py-3.5 px-5">Operação Realizada</th>
                        <th className="py-3.5 px-5">Descrição / Detalhes</th>
                        <th className="py-3.5 px-5">Responsável</th>
                        <th className="py-3.5 px-5 font-mono">Protocolo</th>
                        <th className="py-3.5 px-5 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredLogs.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-8 text-center text-slate-400">
                            Nenhum registro de atividade encontrado para os filtros selecionados.
                          </td>
                        </tr>
                      ) : (
                        filteredLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3.5 px-5 text-slate-600 whitespace-nowrap font-medium">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span>{log.data}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-5 whitespace-nowrap">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md font-semibold text-[11px] bg-emerald-50 text-[#237a32] border border-emerald-100">
                                {log.modulo}
                              </span>
                            </td>
                            <td className="py-3.5 px-5 font-bold text-slate-900 whitespace-nowrap">
                              {log.acao}
                            </td>
                            <td className="py-3.5 px-5 text-slate-700 max-w-md">
                              {log.detalhes}
                            </td>
                            <td className="py-3.5 px-5 font-medium text-slate-700 whitespace-nowrap">
                              {log.responsavel}
                            </td>
                            <td className="py-3.5 px-5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                              {log.protocolo}
                            </td>
                            <td className="py-3.5 px-5 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => handleDeleteLog(log.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Remover Log"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="py-3 px-5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{filteredLogs.length} atividades auditadas exibidas</span>
                  <span>{user?.fazenda || 'Minha Propriedade'} • Segurança Ativa</span>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
                {filteredLogs.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    Nenhum registro de atividade encontrado na linha do tempo.
                  </div>
                ) : (
                  <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {filteredLogs.map((log) => {
                      const getModuleTheme = (mod) => {
                        switch (mod) {
                          case 'Financeiro': return { dot: 'bg-emerald-500 ring-emerald-100', text: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100' };
                          case 'Pecuária': return { dot: 'bg-green-600 ring-green-100', text: 'text-green-800', bg: 'bg-green-50 border-green-100' };
                          case 'Safra': return { dot: 'bg-amber-500 ring-amber-100', text: 'text-amber-800', bg: 'bg-amber-50 border-amber-100' };
                          case 'Maquinários': return { dot: 'bg-blue-500 ring-blue-100', text: 'text-blue-800', bg: 'bg-blue-50 border-blue-100' };
                          default: return { dot: 'bg-slate-500 ring-slate-100', text: 'text-slate-700', bg: 'bg-slate-50 border-slate-200' };
                        }
                      };
                      const theme = getModuleTheme(log.modulo);

                      return (
                        <div key={log.id} className="relative group">
                          <div className={`absolute -left-[29px] top-1.5 w-4 h-4 rounded-full ${theme.dot} ring-4 transition-transform group-hover:scale-125`} />
                          <div className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 rounded-xl p-4 transition-all">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${theme.bg} ${theme.text}`}>
                                  {log.modulo}
                                </span>
                                <h4 className="text-sm font-bold text-slate-900">{log.acao}</h4>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{log.data}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteLog(log.id)}
                                  className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                                  title="Remover Registro"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <p className="text-xs text-slate-700 leading-relaxed mb-3">{log.detalhes}</p>

                            <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-200/60 text-slate-500">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-slate-300" />
                                <span>Operador: <strong className="text-slate-700 font-semibold">{log.responsavel}</strong></span>
                              </div>
                              <span className="font-mono text-slate-400">{log.protocolo}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </section>
        </main>

        <Footer />
      </div>

      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        {isBottomMenuOpen && (
          <div className="mb-3 bg-white border border-slate-200/90 shadow-xl rounded-2xl p-2 w-56 space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <button
              type="button"
              onClick={handleOpenGenerateReportModal}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-[#237a32] rounded-xl transition-colors cursor-pointer text-left"
            >
              <FileText className="w-4 h-4 text-[#237a32]" />
              <span>Emitir Novo Relatório</span>
            </button>
            <button
              type="button"
              onClick={handleOpenAddLogModal}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-[#237a32] rounded-xl transition-colors cursor-pointer text-left"
            >
              <Plus className="w-4 h-4 text-[#237a32]" />
              <span>Registrar Evento no Histórico</span>
            </button>
            <button
              type="button"
              onClick={() => {
                handleExportarHistoricoCompleto();
                setIsBottomMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer text-left"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Exportar Histórico Completo</span>
            </button>
            <button
              type="button"
              onClick={() => {
                window.print();
                setIsBottomMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer text-left"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Imprimir Relatório</span>
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsBottomMenuOpen(!isBottomMenuOpen)}
          className="flex items-center gap-2 py-3 px-5 rounded-full bg-[#237a32] hover:bg-[#185824] text-white font-semibold text-xs shadow-lg shadow-[#237a32]/30 active:scale-95 transition-all cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>Opções de Relatórios</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${isBottomMenuOpen ? 'rotate-180' : ''
              }`}
          />
        </button>
      </div>

      {isModalOpen && modalType === 'novoLog' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Registrar Atividade no Histórico
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLog} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Módulo do Sistema</label>
                  <select
                    value={formData.modulo}
                    onChange={(e) => setFormData({ ...formData, modulo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                  >
                    <option value="Financeiro">Financeiro</option>
                    <option value="Pecuária">Pecuária / Animais</option>
                    <option value="Maquinários">Maquinários & Frota</option>
                    <option value="Safra">Safra / Lavoura</option>
                    <option value="Equipe">Funcionários / RH</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Responsável</label>
                  <input
                    type="text"
                    required
                    value={formData.responsavel}
                    onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Título da Operação / Evento *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Pulverização no Talhão 02, Compra de Peças"
                  value={formData.acao}
                  onChange={(e) => setFormData({ ...formData, acao: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Detalhamento da Atividade *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Descreva as especificações técnicas, quantidades, valores ou notas fiscais envolvidas..."
                  value={formData.detalhes}
                  onChange={(e) => setFormData({ ...formData, detalhes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#237a32] hover:bg-[#185824] text-white rounded-xl shadow-xs transition-colors cursor-pointer font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Salvar Registro</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && modalType === 'gerarRelatorio' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Emitir Relatório Personalizado
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGenerateReportSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tipo de Relatório
                </label>
                <select
                  value={relatorioCustom.tipo}
                  onChange={(e) => setRelatorioCustom({ ...relatorioCustom, tipo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                >
                  <option value="DRE & Fluxo de Caixa Financeiro">DRE & Fluxo de Caixa Financeiro</option>
                  <option value="Inventário & Rastreabilidade do Rebanho">Inventário & Rastreabilidade do Rebanho</option>
                  <option value="Mapeamento & Produtividade de Safras">Mapeamento & Produtividade de Safras</option>
                  <option value="Frota, Horímetros & Manutenção de Veículos">Frota, Horímetros & Manutenção de Veículos</option>
                  <option value="Quadro de Funcionários & Custos de Equipe">Quadro de Funcionários & Custos de Equipe</option>
                  <option value="Relatório Geral Consolidado da Fazenda">Relatório Geral Consolidado da Fazenda</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Período Abrangido
                </label>
                <select
                  value={relatorioCustom.periodo}
                  onChange={(e) => setRelatorioCustom({ ...relatorioCustom, periodo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                >
                  <option value="Safra Atual 2024/2025">Safra Atual 2024/2025</option>
                  <option value="Últimos 30 dias">Últimos 30 dias</option>
                  <option value="Últimos 90 dias">Últimos 90 dias</option>
                  <option value="Ano Vigente (2025)">Ano Vigente (2025)</option>
                  <option value="Histórico Completo">Histórico Completo</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Formato do Arquivo</label>
                  <select
                    value={relatorioCustom.formato}
                    onChange={(e) => setRelatorioCustom({ ...relatorioCustom, formato: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white font-semibold"
                  >
                    <option value="PDF">Documento PDF</option>
                    <option value="XLSX">Planilha Excel (XLSX)</option>
                    <option value="CSV">Dados Brutos (CSV)</option>
                  </select>
                </div>

                <div className="flex items-end pb-1.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={relatorioCustom.incluirAuditoria}
                      onChange={(e) =>
                        setRelatorioCustom({
                          ...relatorioCustom,
                          incluirAuditoria: e.target.checked
                        })
                      }
                      className="rounded text-[#237a32] focus:ring-[#237a32] h-4 w-4"
                    />
                    <span className="text-slate-700 font-medium">Incluir Logs</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#237a32] hover:bg-[#185824] text-white rounded-xl shadow-xs transition-colors cursor-pointer font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Gerar e Baixar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
