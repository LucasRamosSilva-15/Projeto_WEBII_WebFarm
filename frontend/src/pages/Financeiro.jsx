import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  Check,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  Wallet
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { api } from '../services/api';
import { exportToCSV } from '../services/exportService';

export default function Financeiro({ onNavigate, onLogout, user }) {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovimentacao, setEditingMovimentacao] = useState(null);
  const [isBottomMenuOpen, setIsBottomMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    tipo: 'entrada',
    categoria: 'Venda de Gado',
    descricao: '',
    valor: '',
    data: '',
    status: 'Recebido',
    comprovante: ''
  });

  const loadMovimentacoes = async () => {
    try {
      const data = await api.transacoes.getAll();
      if (Array.isArray(data)) {
        setMovimentacoes(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadMovimentacoes();
  }, []);

  const totalEntradas = movimentacoes
    .filter((m) => m.tipo === 'entrada')
    .reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);

  const totalSaidas = movimentacoes
    .filter((m) => m.tipo === 'saida')
    .reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);

  const saldoLiquido = totalEntradas - totalSaidas;

  const handleOpenAddModal = (tipoInicial = 'entrada') => {
    setEditingMovimentacao(null);
    setFormData({
      tipo: tipoInicial,
      categoria: tipoInicial === 'entrada' ? 'Venda de Gado' : 'Ração & Nutrição',
      descricao: '',
      valor: '',
      data: new Date().toLocaleDateString('pt-BR'),
      status: tipoInicial === 'entrada' ? 'Recebido' : 'Pago',
      comprovante: ''
    });
    setIsModalOpen(true);
    setIsBottomMenuOpen(false);
  };

  const handleOpenEditModal = (mov) => {
    setEditingMovimentacao(mov);
    setFormData({
      tipo: mov.tipo,
      categoria: mov.categoria,
      descricao: mov.descricao,
      valor: mov.valor,
      data: mov.data,
      status: mov.status,
      comprovante: mov.comprovante || ''
    });
    setIsModalOpen(true);
    setIsBottomMenuOpen(false);
  };

  const handleDeleteMovimentacao = async (id) => {
    if (confirm('Tem certeza que deseja remover este lançamento financeiro?')) {
      try {
        await api.transacoes.delete(id);
        setMovimentacoes((prev) => prev.filter((m) => m.id !== id));
      } catch (err) {
        alert('Erro ao excluir transação: ' + err.message);
      }
    }
  };

  const handleSaveMovimentacao = async (e) => {
    e.preventDefault();

    if (!formData.descricao.trim() || !formData.valor) {
      alert('Descrição e valor são obrigatórios.');
      return;
    }

    const payload = {
      ...formData,
      valor: Number(formData.valor) || 0
    };

    try {
      if (editingMovimentacao) {
        const updated = await api.transacoes.update(editingMovimentacao.id, payload);
        setMovimentacoes((prev) =>
          prev.map((m) => (m.id === editingMovimentacao.id ? { ...m, ...updated } : m))
        );
      } else {
        const created = await api.transacoes.create(payload);
        setMovimentacoes((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Erro ao salvar movimentação: ' + err.message);
    }
  };

  const handleExportarExtrato = () => {
    const headers = ['ID', 'Data', 'Tipo', 'Categoria', 'Descrição', 'Valor (R$)', 'Status', 'Comprovante'];
    const rows = filteredMovimentacoes.map((m) => [
      m.id,
      m.data,
      m.tipo.toUpperCase(),
      m.categoria,
      m.descricao,
      Number(m.valor || 0).toFixed(2),
      m.status,
      m.comprovante || '-'
    ]);
    exportToCSV('WebFarm_Extrato_Financeiro.csv', headers, rows);
  };

  const filteredMovimentacoes = movimentacoes.filter((mov) => {
    const matchesSearch =
      mov.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mov.comprovante && mov.comprovante.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTipo = filterTipo === 'todos' || mov.tipo === filterTipo;
    return matchesSearch && matchesTipo;
  });

  return (
    <div className="bg-[#f8fafc] text-slate-800 selection:bg-[#237a32]/20 selection:text-[#185824] min-h-screen flex antialiased">
      <Sidebar
        activeModule="financeiro"
        onSelectModule={onNavigate}
        onLogout={onLogout}
        user={user}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} user={user} />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 pb-24">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#237a32]" />
                <span className="text-xs font-bold text-[#237a32] uppercase tracking-wider">
                  Módulo Financeiro
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Financeiro & Vendas
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Controle de fluxo de caixa, comercialização de gado/leite e aquisição de insumos.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenAddModal('saida')}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 rounded-xl transition-all cursor-pointer"
              >
                <ArrowDownRight className="w-4 h-4 text-rose-600" />
                <span>Nova Despesa</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenAddModal('entrada')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#237a32] hover:bg-[#185824] rounded-xl shadow-sm shadow-[#237a32]/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Venda</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs relative overflow-hidden border-l-4 border-l-[#237a32]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Saldo Líquido em Caixa
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#237a32] flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-[#237a32] tracking-tight">
                R$ {saldoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Resultado operacional da safra atual
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Total Entradas (Vendas)
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                R$ {totalEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="mt-2 text-xs text-emerald-700 font-medium">
                Gado, leite e colheita comercializada
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Total Saídas (Despesas)
                </span>
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                  <ArrowDownRight className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                R$ {totalSaidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="mt-2 text-xs text-slate-500 font-medium">
                Insumos, ração, diesel e veterinária
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por descrição, categoria ou NF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 text-xs rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFilterTipo('todos')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    filterTipo === 'todos'
                      ? 'bg-white text-slate-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTipo('entrada')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    filterTipo === 'entrada'
                      ? 'bg-white text-[#237a32] shadow-xs'
                      : 'text-slate-600 hover:text-[#237a32]'
                  }`}
                >
                  Entradas
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTipo('saida')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    filterTipo === 'saida'
                      ? 'bg-white text-rose-700 shadow-xs'
                      : 'text-slate-600 hover:text-rose-700'
                  }`}
                >
                  Saídas
                </button>
              </div>

              <button
                type="button"
                onClick={handleExportarExtrato}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                title="Exportar Extrato em CSV"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-5">Data</th>
                    <th className="py-3.5 px-5">Tipo & Categoria</th>
                    <th className="py-3.5 px-5">Descrição da Operação</th>
                    <th className="py-3.5 px-5">Documento / NF</th>
                    <th className="py-3.5 px-5 text-right">Valor (R$)</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredMovimentacoes.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-400">
                        Nenhuma movimentação financeira encontrada com os filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    filteredMovimentacoes.map((mov) => (
                      <tr key={mov.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-5 font-medium text-slate-600 whitespace-nowrap">
                          {mov.data}
                        </td>
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-semibold text-[11px] ${
                              mov.tipo === 'entrada'
                                ? 'bg-emerald-50 text-[#237a32] border border-emerald-100'
                                : 'bg-rose-50 text-rose-700 border border-rose-100'
                            }`}
                          >
                            {mov.tipo === 'entrada' ? (
                              <ArrowUpRight className="w-3 h-3" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3" />
                            )}
                            {mov.categoria}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-slate-800 font-medium max-w-md">
                          {mov.descricao}
                        </td>
                        <td className="py-3.5 px-5 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                          {mov.comprovante || '-'}
                        </td>
                        <td
                          className={`py-3.5 px-5 text-right font-bold whitespace-nowrap ${
                            mov.tipo === 'entrada' ? 'text-[#237a32]' : 'text-rose-600'
                          }`}
                        >
                          {mov.tipo === 'entrada' ? '+ ' : '- '}
                          R$ {mov.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                            {mov.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(mov)}
                              className="p-1.5 text-slate-400 hover:text-[#237a32] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="Editar Lançamento"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMovimentacao(mov.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Remover Lançamento"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="py-3 px-5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{filteredMovimentacoes.length} lançamentos exibidos</span>
              <span>Propriedade: Fazenda Santa Maria</span>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        {isBottomMenuOpen && (
          <div className="mb-3 bg-white border border-slate-200/90 shadow-xl rounded-2xl p-2 w-56 space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <button
              type="button"
              onClick={() => handleOpenAddModal('entrada')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-[#237a32] rounded-xl transition-colors cursor-pointer text-left"
            >
              <ArrowUpRight className="w-4 h-4 text-[#237a32]" />
              <span>Lançar Venda (Entrada)</span>
            </button>
            <button
              type="button"
              onClick={() => handleOpenAddModal('saida')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-700 rounded-xl transition-colors cursor-pointer text-left"
            >
              <ArrowDownRight className="w-4 h-4 text-rose-600" />
              <span>Lançar Despesa (Saída)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setFilterTipo('todos');
                setSearchTerm('');
                setIsBottomMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer text-left"
            >
              <Filter className="w-4 h-4 text-slate-500" />
              <span>Ver Todos os Lançamentos</span>
            </button>
            <button
              type="button"
              onClick={() => {
                handleExportarExtrato();
                setIsBottomMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer text-left"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Exportar DRE Agrícola (CSV)</span>
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsBottomMenuOpen(!isBottomMenuOpen)}
          className="flex items-center gap-2 py-3 px-5 rounded-full bg-[#237a32] hover:bg-[#185824] text-white font-semibold text-xs shadow-lg shadow-[#237a32]/30 active:scale-95 transition-all cursor-pointer"
        >
          <TrendingUp className="w-4 h-4" />
          <span>Opções Financeiras</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isBottomMenuOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingMovimentacao
                  ? 'Editar Movimentação'
                  : formData.tipo === 'entrada'
                  ? 'Lançar Nova Venda (Entrada)'
                  : 'Lançar Nova Despesa (Saída)'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMovimentacao} className="space-y-3.5 text-xs">
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      tipo: 'entrada',
                      categoria: 'Venda de Gado',
                      status: 'Recebido'
                    })
                  }
                  className={`flex-1 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    formData.tipo === 'entrada'
                      ? 'bg-white text-[#237a32] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Entrada (Venda)</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      tipo: 'saida',
                      categoria: 'Ração & Nutrição',
                      status: 'Pago'
                    })
                  }
                  className={`flex-1 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    formData.tipo === 'saida'
                      ? 'bg-white text-rose-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  <span>Saída (Despesa)</span>
                </button>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Categoria da Operação
                </label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                >
                  {formData.tipo === 'entrada' ? (
                    <>
                      <option value="Venda de Gado">Venda de Gado (Corte / Cria)</option>
                      <option value="Venda de Leite">Venda de Leite</option>
                      <option value="Venda de Grãos">Venda de Grãos (Milho, Soja)</option>
                      <option value="Serviços Rurais">Serviços / Aluguel de Pasto</option>
                      <option value="Outras Entradas">Outras Entradas</option>
                    </>
                  ) : (
                    <>
                      <option value="Ração & Nutrição">Ração, Silagem & Nutrição</option>
                      <option value="Medicamentos & Vacinas">Medicamentos Veterinários & Vacinas</option>
                      <option value="Combustível & Manutenção">Combustível (Diesel) & Oficina</option>
                      <option value="Sementes & Fertilizantes">Sementes & Adubação</option>
                      <option value="Folha de Pagamento">Salários & Diárias de Campo</option>
                      <option value="Outras Despesas">Outras Despesas Operacionais</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Descrição Detalhada *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Venda de 15 bezerros desmamados"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Valor (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0,00"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Data</label>
                  <input
                    type="text"
                    placeholder="DD/MM/AAAA"
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Documento / NFP-e
                  </label>
                  <input
                    type="text"
                    placeholder="ex: NFP-e #105"
                    value={formData.comprovante}
                    onChange={(e) => setFormData({ ...formData, comprovante: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                  >
                    <option value="Recebido">Recebido</option>
                    <option value="Pago">Pago</option>
                    <option value="Pendente">Pendente</option>
                  </select>
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
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingMovimentacao ? 'Salvar Alterações' : 'Concluir Lançamento'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
