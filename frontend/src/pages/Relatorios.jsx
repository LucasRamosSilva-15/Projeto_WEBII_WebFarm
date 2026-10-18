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
  List,
  RefreshCw,
  ArrowUpDown
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GraficosDesempenho from '../components/GraficosDesempenho';
import { api } from '../services/api';
import { exportToCSV, exportToJSON, exportToPrintableReport } from '../services/exportService';

export default function Relatorios({ onNavigate, onLogout, user }) {
  const [metricas, setMetricas] = useState({
    animais: 0,
    maquinas: 0,
    funcionarios: 0,
    talhoes: 0,
    financeiro: { totalEntradas: 0, totalSaidas: 0, saldoLiquido: 0 }
  });

  const [historicoLogs, setHistoricoLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModulo, setFilterModulo] = useState('todos');
  const [viewMode, setViewMode] = useState('tabela');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('novoLog');
  const [isBottomMenuOpen, setIsBottomMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc');

  const [formData, setFormData] = useState({
    modulo: 'Financeiro',
    responsavel: user?.nome || 'Administrador WebFarm',
    acao: '',
    detalhes: '',
    data: ''
  });

  const [relatorioCustom, setRelatorioCustom] = useState({
    tipo: 'DRE & Fluxo de Caixa Financeiro',
    periodo: 'Safra Atual 2024/2025',
    formato: 'PDF',
    incluirAuditoria: true
  });

  const modelosRelatorios = [
    {
      id: 1,
      titulo: 'DRE & Fluxo de Caixa Consolidado',
      modulo: 'Financeiro',
      periodo: 'Safra Atual',
      formato: 'PDF & CSV',
      tamanho: `${Math.max(1, Math.round((Number(metricas.financeiro.totalEntradas || 0) + Number(metricas.financeiro.totalSaidas || 0)) / 1000))} KB`,
      icon: TrendingUp,
      descricao: `Demonstrativo com ${metricas.financeiro.totalEntradas > 0 ? `R$ ${Number(metricas.financeiro.totalEntradas).toLocaleString('pt-BR')} em receitas` : 'fluxo de receitas e despesas'} e margem operacional.`
    },
    {
      id: 2,
      titulo: 'Inventário e Rastreabilidade do Rebanho',
      modulo: 'Pecuária',
      periodo: 'Mês Atual',
      formato: 'PDF & CSV',
      tamanho: `${Math.max(1, metricas.animais * 2)} KB`,
      icon: Layers,
      descricao: `Listagem com ${metricas.animais} ${metricas.animais === 1 ? 'animal registrado' : 'animais registrados'}, código de brinco, peso e controle zootécnico.`
    },
    {
      id: 3,
      titulo: 'Caderno de Campo & Manejo de Talhões',
      modulo: 'Safra',
      periodo: 'Safra Atual',
      formato: 'PDF & CSV',
      tamanho: `${Math.max(1, metricas.talhoes * 3)} KB`,
      icon: Wheat,
      descricao: `Acompanhamento de ${metricas.talhoes} ${metricas.talhoes === 1 ? 'talhão agrícola' : 'talhões agrícolas'} com semeadura, variedade e colheita.`
    },
    {
      id: 4,
      titulo: 'Horímetro & Manutenção Preventiva da Frota',
      modulo: 'Maquinários',
      periodo: 'Últimos 90 dias',
      formato: 'PDF & CSV',
      tamanho: `${Math.max(1, metricas.maquinas * 2)} KB`,
      icon: Truck,
      descricao: `Inventário de ${metricas.maquinas} ${metricas.maquinas === 1 ? 'máquina/veículo' : 'máquinas/veículos'}, controle de revisões e horímetro de operação.`
    },
    {
      id: 5,
      titulo: 'Folha de Equipe & Colaboradores',
      modulo: 'Equipe',
      periodo: 'Mensal',
      formato: 'PDF & CSV',
      tamanho: `${Math.max(1, metricas.funcionarios * 2)} KB`,
      icon: Users,
      descricao: `Quadro com ${metricas.funcionarios} ${metricas.funcionarios === 1 ? 'colaborador registrado' : 'colaboradores registrados'}, cargos operacionais e conformidade de RH.`
    }
  ];

  const loadHistorico = async () => {
    try {
      setLoading(true);
      const [dataLogs, dataMetricas] = await Promise.all([
        api.historico.getAll().catch(() => []),
        api.dashboard.getMetricas().catch(() => null)
      ]);

      if (Array.isArray(dataLogs)) {
        setHistoricoLogs(dataLogs);
      }
      if (dataMetricas) {
        setMetricas(dataMetricas);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistorico();
  }, []);

  const handleOpenAddLogModal = () => {
    setModalType('novoLog');
    setFormData({
      modulo: 'Financeiro',
      responsavel: user?.nome || 'Administrador WebFarm',
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
      responsavel: user?.nome || formData.responsavel || 'Administrador WebFarm',
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

  const handleDownloadModelo = async (rel, format = 'csv') => {
    try {
      let headers = [];
      let rows = [];
      const title = rel.titulo;
      const filename = `WebFarm_${rel.modulo}_${new Date().toISOString().slice(0, 10)}`;

      if (rel.id === 1) {
        const transacoes = await api.transacoes.getAll();
        headers = ['ID', 'Data', 'Tipo', 'Categoria', 'Descrição', 'Valor (R$)', 'Status', 'Comprovante'];
        rows = transacoes.map((t) => [
          t.id,
          t.data,
          String(t.tipo || '').toUpperCase(),
          t.categoria,
          t.descricao,
          Number(t.valor || 0).toFixed(2),
          t.status || 'Confirmado',
          t.comprovante || '-'
        ]);
      } else if (rel.id === 2) {
        const animais = await api.animais.getAll();
        headers = ['ID', 'Código Brinco', 'Espécie', 'Raça', 'Sexo', 'Peso (kg)', 'Status', 'Origem'];
        rows = animais.map((a) => [
          a.id,
          a.codigo_brinco,
          a.especie,
          a.raca || '-',
          a.sexo || '-',
          a.peso,
          a.status || 'Ativo',
          a.origem || 'Própria'
        ]);
      } else if (rel.id === 3) {
        const producoes = await api.producoes.getAll();
        headers = ['ID', 'Talhão / Lote', 'Cultura', 'Variedade', 'Área (ha)', 'Data Plantio', 'Estágio', 'Previsão Colheita', 'Produtividade Estimada', 'Status'];
        rows = producoes.map((p) => [
          p.id,
          p.nome,
          p.cultura,
          p.variedade || '-',
          p.areaHa || p.area_plantada || 0,
          p.dataPlantio || '-',
          p.estagio || '-',
          p.previsaoColheita || '-',
          p.produtividadeEstimada || '-',
          p.status || 'Ativo'
        ]);
      } else if (rel.id === 4) {
        const maquinas = await api.maquinas.getAll();
        headers = ['ID', 'Prefixo', 'Tipo', 'Marca', 'Modelo', 'Ano', 'Horímetro (hrs)', 'Status', 'Operador', 'Última Revisão', 'Próxima Revisão'];
        rows = maquinas.map((m) => [
          m.id,
          m.prefixo,
          m.tipo,
          m.marca || '-',
          m.modelo || '-',
          m.ano || '-',
          m.horimetro || 0,
          m.status || 'Operacional',
          m.operador || '-',
          m.ultimaRevisao || '-',
          m.proximaRevisao || '-'
        ]);
      } else if (rel.id === 5) {
        const funcionarios = await api.funcionarios.getAll();
        headers = ['ID', 'Nome', 'CPF', 'Função / Cargo', 'Telefone', 'Salário (R$)', 'Status', 'Data Admissão'];
        rows = funcionarios.map((f) => [
          f.id,
          f.nome,
          f.cpf,
          f.funcao,
          f.cell || '-',
          Number(f.salario || 0).toFixed(2),
          f.status || 'Ativo',
          f.data_admissao || '-'
        ]);
      }

      if (format === 'pdf') {
        exportToPrintableReport(
          title,
          `Relatório Setorial de ${rel.modulo} • WebFarm`,
          {
            'Propriedade': user?.fazenda || 'Minha Propriedade',
            'Total de Registros': rows.length,
            'Emitido por': user?.nome || 'Administrador WebFarm',
            'Data de Emissão': new Date().toLocaleDateString('pt-BR')
          },
          headers,
          rows
        );
      } else {
        exportToCSV(`${filename}.csv`, headers, rows);
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
          String(t.tipo || '').toUpperCase(),
          t.categoria,
          t.descricao,
          `R$ ${Number(t.valor || 0).toLocaleString('pt-BR')}`,
          t.status || 'Confirmado'
        ]);
      } else if (tipo.includes('Rebanho') || tipo.includes('Pecuária')) {
        const dados = await api.animais.getAll();
        rawData = dados;
        headers = ['Brinco', 'Espécie', 'Raça', 'Sexo', 'Peso Atual', 'Status', 'Origem'];
        rows = dados.map((a) => [
          a.codigo_brinco,
          a.especie,
          a.raca || '-',
          a.sexo || '-',
          `${a.peso} kg`,
          a.status || 'Ativo',
          a.origem || 'Própria'
        ]);
      } else if (tipo.includes('Safra') || tipo.includes('Agrícola')) {
        const dados = await api.producoes.getAll();
        rawData = dados;
        headers = ['Talhão', 'Cultura', 'Variedade', 'Área', 'Estágio', 'Previsão Colheita', 'Status'];
        rows = dados.map((p) => [
          p.nome,
          p.cultura,
          p.variedade || '-',
          `${p.areaHa || p.area_plantada || 0} ha`,
          p.estagio || '-',
          p.previsaoColheita || '-',
          p.status || 'Ativo'
        ]);
      } else if (tipo.includes('Maquinários') || tipo.includes('Frota')) {
        const dados = await api.maquinas.getAll();
        rawData = dados;
        headers = ['Prefixo', 'Equipamento', 'Marca', 'Modelo', 'Horímetro', 'Status', 'Operador'];
        rows = dados.map((m) => [
          m.prefixo,
          m.tipo,
          m.marca || '-',
          m.modelo || '-',
          `${m.horimetro || 0} hrs`,
          m.status || 'Operacional',
          m.operador || '-'
        ]);
      } else if (tipo.includes('Funcionários') || tipo.includes('Equipe')) {
        const dados = await api.funcionarios.getAll();
        rawData = dados;
        headers = ['Nome', 'CPF', 'Função', 'Telefone', 'Salário', 'Status'];
        rows = dados.map((f) => [
          f.nome,
          f.cpf,
          f.funcao,
          f.cell || '-',
          `R$ ${Number(f.salario || 0).toLocaleString('pt-BR')}`,
          f.status || 'Ativo'
        ]);
      } else {
        const [animais, transacoes, producoes, maquinas, equipe] = await Promise.all([
          api.animais.getAll().catch(() => []),
          api.transacoes.getAll().catch(() => []),
          api.producoes.getAll().catch(() => []),
          api.maquinas.getAll().catch(() => []),
          api.funcionarios.getAll().catch(() => [])
        ]);

        const totalEntradas = transacoes.filter((t) => t.tipo === 'entrada').reduce((a, b) => a + Number(b.valor || 0), 0);
        const totalSaidas = transacoes.filter((t) => t.tipo === 'saida').reduce((a, b) => a + Number(b.valor || 0), 0);
        const saldoLiquido = totalEntradas - totalSaidas;

        rawData = { animais, transacoes, producoes, maquinas, equipe };
        headers = ['Setor', 'Indicador Chave', 'Volume / Montante', 'Situação Operacional'];
        rows = [
          ['Pecuária', 'Rebanho Cadastrado', `${animais.length} animais`, 'Monitoramento ativo'],
          ['Agricultura', 'Talhões de Safra', `${producoes.length} talhões`, 'Ciclo em desenvolvimento'],
          ['Maquinários', 'Frota e Equipamentos', `${maquinas.length} unidades`, 'Disponibilidade de campo'],
          ['Recursos Humanos', 'Quadro de Colaboradores', `${equipe.length} pessoas`, 'Folha ativa'],
          ['Financeiro', 'Faturamento Acumulado', `R$ ${totalEntradas.toLocaleString('pt-BR')}`, 'Receitas conciliadas'],
          ['Financeiro', 'Custos Operacionais', `R$ ${totalSaidas.toLocaleString('pt-BR')}`, 'Despesas registradas'],
          ['Financeiro', 'Saldo Líquido', `R$ ${saldoLiquido.toLocaleString('pt-BR')}`, saldoLiquido >= 0 ? 'Superávit' : 'Déficit']
        ];
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
            'Emitido por': user?.nome || 'Administrador WebFarm',
            'Data de Emissão': new Date().toLocaleDateString('pt-BR'),
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

  const filteredLogs = historicoLogs
    .filter((log) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        (log.acao || '').toLowerCase().includes(term) ||
        (log.detalhes || '').toLowerCase().includes(term) ||
        (log.responsavel || '').toLowerCase().includes(term) ||
        (log.protocolo || '').toLowerCase().includes(term);

      const matchesModulo = filterModulo === 'todos' || log.modulo === filterModulo;
      return matchesSearch && matchesModulo;
    })
    .sort((a, b) => {
      const idA = a.id || 0;
      const idB = b.id || 0;
      return sortOrder === 'desc' ? idB - idA : idA - idB;
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
        <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} user={user} onNavigate={onNavigate} />

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

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={loadHistorico}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-xs cursor-pointer"
                title="Sincronizar dados e histórico"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#237a32]' : 'text-slate-500'}`} />
                <span className="hidden sm:inline">Atualizar</span>
              </button>

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
                  Modelos de Relatórios
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#237a32] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {modelosRelatorios.length} modelos prontos
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Disponíveis para exportação imediata em PDF e CSV
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
                {historicoLogs.length} {historicoLogs.length === 1 ? 'registro' : 'registros'}
              </div>
              <div className="mt-2 text-xs text-emerald-700 font-medium">
                Rastreabilidade ponta a ponta da fazenda
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Propriedade Monitorada
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#237a32] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight truncate">
                {user?.fazenda || 'Propriedade Ativa'}
              </div>
              <div className="mt-2 text-xs text-slate-500 font-medium">
                Padrões GTA, CAR e conformidade operacional
              </div>
            </div>
          </div>

          <GraficosDesempenho onNavigate={onNavigate} />

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

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                      <span className="text-slate-400 font-medium text-[11px] truncate">
                        {rel.periodo} • {rel.tamanho}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleDownloadModelo(rel, 'pdf')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-[#237a32] bg-slate-50 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Visualizar e Imprimir Relatório"
                        >
                          <Printer className="w-3 h-3" />
                          <span>PDF</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadModelo(rel, 'csv')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-[#237a32] hover:bg-[#185824] rounded-lg transition-colors shadow-xs cursor-pointer"
                          title="Baixar planilha CSV"
                        >
                          <Download className="w-3 h-3" />
                          <span>CSV</span>
                        </button>
                      </div>
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

              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative w-full sm:w-60">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Filtrar por ação, operador ou protocolo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-white text-xs rounded-xl border border-slate-200 outline-none focus:border-[#237a32] transition-all shadow-xs"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center bg-white border border-slate-200 p-0.5 rounded-xl flex-wrap">
                  {['todos', 'Financeiro', 'Pecuária', 'Safra', 'Maquinários', 'Equipe'].map((mod) => (
                    <button
                      key={mod}
                      type="button"
                      onClick={() => setFilterModulo(mod)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${filterModulo === mod
                        ? 'bg-[#237a32] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      {mod === 'todos' ? 'Todos' : mod}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-xs cursor-pointer"
                  title="Inverter ordem cronológica"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">{sortOrder === 'desc' ? 'Mais recentes' : 'Mais antigos'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportarHistoricoCompleto}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-xs cursor-pointer"
                  title="Exportar Registros Filtrados em CSV"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Exportar CSV</span>
                </button>

                <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setViewMode('tabela')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${viewMode === 'tabela'
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
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${viewMode === 'timeline'
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
                          <td colSpan="7" className="py-12 text-center text-slate-400">
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
                          case 'Equipe': return { dot: 'bg-purple-500 ring-purple-100', text: 'text-purple-800', bg: 'bg-purple-50 border-purple-100' };
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-backdrop-in">
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
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white font-medium"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-backdrop-in">
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
                    <option value="JSON">Dados Estruturados (JSON)</option>
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
