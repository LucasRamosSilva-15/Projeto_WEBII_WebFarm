import { useState, useEffect } from 'react';
import {
  Truck,
  Wrench,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  Check,
  ChevronDown,
  Download,
  Fuel,
  Gauge
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { api } from '../services/api';
import { exportToCSV } from '../services/exportService';

export default function Maquinas({ onNavigate, onLogout, user }) {
  const [maquinas, setMaquinas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaquina, setEditingMaquina] = useState(null);
  const [isBottomMenuOpen, setIsBottomMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    prefixo: '',
    tipo: 'Trator',
    marca: '',
    modelo: '',
    ano: new Date().getFullYear().toString(),
    horimetro: '',
    status: 'Operando',
    operador: '',
    ultimaRevisao: '',
    proximaRevisao: ''
  });

  const loadMaquinas = async () => {
    try {
      const data = await api.maquinas.getAll();
      if (Array.isArray(data)) {
        setMaquinas(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadMaquinas();
  }, []);

  const totalAtivas = maquinas.length;
  const emOperacao = maquinas.filter((m) => m.status === 'Operando').length;
  const emManutencao = maquinas.filter((m) => m.status === 'Manutenção').length;

  const handleOpenAddModal = () => {
    setEditingMaquina(null);
    setFormData({
      prefixo: `TR-0${maquinas.length + 1}`,
      tipo: 'Trator',
      marca: '',
      modelo: '',
      ano: new Date().getFullYear().toString(),
      horimetro: '',
      status: 'Operando',
      operador: '',
      ultimaRevisao: new Date().toLocaleDateString('pt-BR'),
      proximaRevisao: ''
    });
    setIsModalOpen(true);
    setIsBottomMenuOpen(false);
  };

  const handleOpenEditModal = (maq) => {
    setEditingMaquina(maq);
    setFormData({
      prefixo: maq.prefixo,
      tipo: maq.tipo,
      marca: maq.marca,
      modelo: maq.modelo,
      ano: maq.ano,
      horimetro: maq.horimetro,
      status: maq.status,
      operador: maq.operador,
      ultimaRevisao: maq.ultimaRevisao,
      proximaRevisao: maq.proximaRevisao
    });
    setIsModalOpen(true);
    setIsBottomMenuOpen(false);
  };

  const handleDeleteMaquina = async (id) => {
    if (confirm('Deseja realmente remover esta máquina/veículo do cadastro?')) {
      try {
        await api.maquinas.delete(id);
        setMaquinas((prev) => prev.filter((m) => m.id !== id));
      } catch (err) {
        alert('Erro ao excluir máquina: ' + err.message);
      }
    }
  };

  const handleSaveMaquina = async (e) => {
    e.preventDefault();

    if (!formData.prefixo.trim() || !formData.modelo.trim() || !formData.marca.trim()) {
      alert('Prefixo, marca e modelo são obrigatórios.');
      return;
    }

    const payload = {
      ...formData,
      horimetro: Number(formData.horimetro) || 0
    };

    try {
      if (editingMaquina) {
        const updated = await api.maquinas.update(editingMaquina.id, payload);
        setMaquinas((prev) =>
          prev.map((m) => (m.id === editingMaquina.id ? { ...m, ...updated } : m))
        );
      } else {
        const created = await api.maquinas.create(payload);
        setMaquinas((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Erro ao salvar máquina: ' + err.message);
    }
  };

  const handleExportarMaquinas = () => {
    const headers = ['ID', 'Prefixo', 'Tipo', 'Marca', 'Modelo', 'Ano', 'Horímetro (hrs)', 'Status', 'Operador', 'Última Revisão', 'Próxima Revisão'];
    const rows = filteredMaquinas.map((m) => [
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
    exportToCSV('WebFarm_Inventario_Maquinas.csv', headers, rows);
  };

  const filteredMaquinas = maquinas.filter((maq) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      maq.prefixo.toLowerCase().includes(term) ||
      maq.modelo.toLowerCase().includes(term) ||
      maq.marca.toLowerCase().includes(term) ||
      maq.operador.toLowerCase().includes(term) ||
      maq.tipo.toLowerCase().includes(term);

    const matchesStatus = filterStatus === 'todos' || maq.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-[#f8fafc] text-slate-800 selection:bg-[#237a32]/20 selection:text-[#185824] min-h-screen flex antialiased">
      <Sidebar
        activeModule="maquinas"
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
                  Frota & Implementos
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Maquinários & Veículos
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Controle de horímetro, manutenções preventivas, trocas de óleo e operadores.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  alert(`Gerando relatório de manutenção preventiva de toda a frota...`);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <Wrench className="w-4 h-4 text-slate-500" />
                <span>Revisões</span>
              </button>
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#237a32] hover:bg-[#185824] rounded-xl shadow-sm shadow-[#237a32]/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Máquina</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs relative overflow-hidden border-l-4 border-l-[#237a32]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Total de Unidades
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#237a32] flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {totalAtivas} veículos
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Tratores, colheitadeiras, pulverizadores e utilitários
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Em Operação de Campo
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-[#237a32] tracking-tight">
                {emOperacao} ativos
              </div>
              <div className="mt-2 text-xs text-emerald-700 font-medium">
                Disponibilidade da frota em alta
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Em Manutenção / Oficina
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {emManutencao} na oficina
              </div>
              <div className="mt-2 text-xs text-slate-500 font-medium">
                Preventivas e substituição de peças
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por prefixo, modelo, marca ou operador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 text-xs rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFilterStatus('todos')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    filterStatus === 'todos'
                      ? 'bg-white text-slate-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('Operando')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    filterStatus === 'Operando'
                      ? 'bg-white text-[#237a32] shadow-xs'
                      : 'text-slate-600 hover:text-[#237a32]'
                  }`}
                >
                  Operando
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('Manutenção')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    filterStatus === 'Manutenção'
                      ? 'bg-white text-amber-700 shadow-xs'
                      : 'text-slate-600 hover:text-amber-700'
                  }`}
                >
                  Manutenção
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('Parado')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    filterStatus === 'Parado'
                      ? 'bg-white text-slate-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Parados
                </button>
              </div>

              <button
                type="button"
                onClick={handleExportarMaquinas}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                title="Exportar Frota em CSV"
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
                    <th className="py-3.5 px-5">Prefixo & Tipo</th>
                    <th className="py-3.5 px-5">Marca & Modelo</th>
                    <th className="py-3.5 px-5">Ano</th>
                    <th className="py-3.5 px-5">Uso (Horas / Km)</th>
                    <th className="py-3.5 px-5">Operador Principal</th>
                    <th className="py-3.5 px-5">Próxima Revisão</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredMaquinas.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-8 text-center text-slate-400">
                        Nenhuma máquina ou veículo encontrado com os filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    filteredMaquinas.map((maq) => (
                      <tr key={maq.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md font-mono text-[11px] border border-slate-200">
                              {maq.prefixo}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {maq.tipo}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5">
                          <div className="font-semibold text-slate-900">{maq.modelo}</div>
                          <div className="text-[11px] text-slate-500">{maq.marca}</div>
                        </td>
                        <td className="py-3.5 px-5 text-slate-600 font-medium">
                          {maq.ano}
                        </td>
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                            <Gauge className="w-3.5 h-3.5 text-[#237a32]" />
                            <span>
                              {maq.tipo === 'Caminhonete'
                                ? `${maq.horimetro.toLocaleString('pt-BR')} km`
                                : `${maq.horimetro.toLocaleString('pt-BR')} hrs`}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-slate-700 font-medium">
                          {maq.operador || '-'}
                        </td>
                        <td className="py-3.5 px-5 text-slate-600 text-[11px]">
                          {maq.proximaRevisao || 'Em dia'}
                        </td>
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              maq.status === 'Operando'
                                ? 'bg-emerald-50 text-[#237a32] border border-emerald-100'
                                : maq.status === 'Manutenção'
                                ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                maq.status === 'Operando'
                                  ? 'bg-[#237a32]'
                                  : maq.status === 'Manutenção'
                                  ? 'bg-amber-500'
                                  : 'bg-slate-400'
                              }`}
                            />
                            {maq.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(maq)}
                              className="p-1.5 text-slate-400 hover:text-[#237a32] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="Editar Máquina"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMaquina(maq.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Remover Máquina"
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
              <span>{filteredMaquinas.length} máquinas/veículos listados</span>
              <span>Propriedade: {user?.fazenda || 'Minha Propriedade'}</span>
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
              onClick={handleOpenAddModal}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-[#237a32] rounded-xl transition-colors cursor-pointer text-left"
            >
              <Plus className="w-4 h-4 text-[#237a32]" />
              <span>Novo Maquinário</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setFilterStatus('Manutenção');
                setIsBottomMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl transition-colors cursor-pointer text-left"
            >
              <Wrench className="w-4 h-4 text-amber-600" />
              <span>Ver em Manutenção</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setFilterStatus('todos');
                setSearchTerm('');
                setIsBottomMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer text-left"
            >
              <Filter className="w-4 h-4 text-slate-500" />
              <span>Ver Toda a Frota</span>
            </button>
            <button
              type="button"
              onClick={() => {
                handleExportarMaquinas();
                setIsBottomMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer text-left"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Exportar Ficha da Frota (CSV)</span>
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsBottomMenuOpen(!isBottomMenuOpen)}
          className="flex items-center gap-2 py-3 px-5 rounded-full bg-[#237a32] hover:bg-[#185824] text-white font-semibold text-xs shadow-lg shadow-[#237a32]/30 active:scale-95 transition-all cursor-pointer"
        >
          <Truck className="w-4 h-4" />
          <span>Opções da Frota</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isBottomMenuOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingMaquina ? 'Editar Maquinário / Veículo' : 'Cadastrar Novo Maquinário'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMaquina} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Prefixo / Placa *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: TR-03"
                    value={formData.prefixo}
                    onChange={(e) => setFormData({ ...formData, prefixo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipo de Veículo</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                  >
                    <option value="Trator">Trator de Pneu</option>
                    <option value="Colheitadeira">Colheitadeira de Grãos</option>
                    <option value="Pulverizador">Pulverizador Autopropelido</option>
                    <option value="Caminhonete">Caminhonete / Utilitário</option>
                    <option value="Caminhão">Caminhão Boiadeiro/Graneleiro</option>
                    <option value="Plantadeira">Plantadeira / Semeadeira</option>
                    <option value="Implemento">Grade / Subsolador</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Marca / Fabricante *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: John Deere, Valtra"
                    value={formData.marca}
                    onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Modelo & Potência *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: 7215J (215 cv)"
                    value={formData.modelo}
                    onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ano de Fabricação</label>
                  <input
                    type="text"
                    placeholder="2023"
                    value={formData.ano}
                    onChange={(e) => setFormData({ ...formData, ano: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Horímetro / Km Atual</label>
                  <input
                    type="number"
                    placeholder="ex: 3200"
                    value={formData.horimetro}
                    onChange={(e) => setFormData({ ...formData, horimetro: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Operador Responsável</label>
                <input
                  type="text"
                  placeholder="Nome do operador ou vaqueiro"
                  value={formData.operador}
                  onChange={(e) => setFormData({ ...formData, operador: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Última Revisão</label>
                  <input
                    type="text"
                    placeholder="DD/MM/AAAA"
                    value={formData.ultimaRevisao}
                    onChange={(e) => setFormData({ ...formData, ultimaRevisao: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Operacional</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                  >
                    <option value="Operando">Operando em Campo</option>
                    <option value="Manutenção">Em Manutenção / Oficina</option>
                    <option value="Parado">Parado no Galpão</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Próxima Revisão Prevista</label>
                <input
                  type="text"
                  placeholder="ex: 4.000 hrs ou 15/12/2025"
                  value={formData.proximaRevisao}
                  onChange={(e) => setFormData({ ...formData, proximaRevisao: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
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
                  <span>{editingMaquina ? 'Salvar Alterações' : 'Cadastrar Máquina'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
