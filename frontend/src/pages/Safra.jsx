import { useState, useEffect } from 'react';
import {
  Wheat,
  Sprout,
  Calendar,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  Check,
  ChevronDown,
  Download,
  Layers,
  MapPin,
  Activity
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { api } from '../services/api';
import { exportToCSV } from '../services/exportService';

export default function Safra({ onNavigate, onLogout, user }) {
  const [talhoes, setTalhoes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCultura, setFilterCultura] = useState('todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTalhao, setEditingTalhao] = useState(null);
  const [isBottomMenuOpen, setIsBottomMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    cultura: 'Soja',
    variedade: '',
    areaHa: '',
    dataPlantio: '',
    estagio: 'Desenvolvimento Vegetativo',
    previsaoColheita: '',
    produtividadeEstimada: '',
    status: 'Em Desenvolvimento'
  });

  const loadTalhoes = async () => {
    try {
      const data = await api.producoes.getAll();
      if (Array.isArray(data)) {
        setTalhoes(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadTalhoes();
  }, []);

  const areaTotal = talhoes.reduce((acc, curr) => acc + (Number(curr.areaHa) || 0), 0);
  const talhoesAtivos = talhoes.length;
  const prontosColheita = talhoes.filter((t) => t.status === 'Pronto para Colheita').length;

  const handleOpenAddModal = () => {
    setEditingTalhao(null);
    setFormData({
      nome: `Talhão 0${talhoes.length + 1}`,
      cultura: 'Soja',
      variedade: '',
      areaHa: '',
      dataPlantio: new Date().toLocaleDateString('pt-BR'),
      estagio: 'Desenvolvimento Vegetativo',
      previsaoColheita: '',
      produtividadeEstimada: '',
      status: 'Em Desenvolvimento'
    });
    setIsModalOpen(true);
    setIsBottomMenuOpen(false);
  };

  const handleOpenEditModal = (t) => {
    setEditingTalhao(t);
    setFormData({
      nome: t.nome,
      cultura: t.cultura,
      variedade: t.variedade,
      areaHa: t.areaHa,
      dataPlantio: t.dataPlantio,
      estagio: t.estagio,
      previsaoColheita: t.previsaoColheita,
      produtividadeEstimada: t.produtividadeEstimada,
      status: t.status
    });
    setIsModalOpen(true);
    setIsBottomMenuOpen(false);
  };

  const handleDeleteTalhao = async (id) => {
    if (confirm('Tem certeza que deseja excluir o registro deste talhão/safra?')) {
      try {
        await api.producoes.delete(id);
        setTalhoes((prev) => prev.filter((t) => t.id !== id));
      } catch (err) {
        alert('Erro ao excluir talhão: ' + err.message);
      }
    }
  };

  const handleSaveTalhao = async (e) => {
    e.preventDefault();

    if (!formData.nome.trim() || !formData.cultura.trim() || !formData.areaHa) {
      alert('Identificador do talhão, cultura e área são obrigatórios.');
      return;
    }

    const payload = {
      ...formData,
      areaHa: Number(formData.areaHa) || 0
    };

    try {
      if (editingTalhao) {
        const updated = await api.producoes.update(editingTalhao.id, payload);
        setTalhoes((prev) =>
          prev.map((t) => (t.id === editingTalhao.id ? { ...t, ...updated } : t))
        );
      } else {
        const created = await api.producoes.create(payload);
        setTalhoes((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Erro ao salvar talhão: ' + err.message);
    }
  };

  const handleExportarSafra = () => {
    const headers = ['ID', 'Talhão / Lote', 'Cultura', 'Variedade', 'Área (ha)', 'Data Plantio', 'Estágio', 'Previsão Colheita', 'Produtividade Estimada', 'Status'];
    const rows = filteredTalhoes.map((t) => [
      t.id,
      t.nome,
      t.cultura,
      t.variedade || '-',
      t.areaHa,
      t.dataPlantio,
      t.estagio,
      t.previsaoColheita || '-',
      t.produtividadeEstimada || '-',
      t.status
    ]);
    exportToCSV('WebFarm_Caderno_Campo_Safra.csv', headers, rows);
  };

  const filteredTalhoes = talhoes.filter((t) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      t.nome.toLowerCase().includes(term) ||
      t.cultura.toLowerCase().includes(term) ||
      t.variedade.toLowerCase().includes(term) ||
      t.estagio.toLowerCase().includes(term);

    const matchesCultura = filterCultura === 'todas' || t.cultura === filterCultura;
    return matchesSearch && matchesCultura;
  });

  return (
    <div className="bg-[#f8fafc] text-slate-800 selection:bg-[#237a32]/20 selection:text-[#185824] min-h-screen flex antialiased">
      <Sidebar
        activeModule="safra"
        onSelectModule={onNavigate}
        onLogout={onLogout}
        user={user}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} user={user} onNavigate={onNavigate} />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 pb-24">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#237a32]" />
                <span className="text-xs font-bold text-[#237a32] uppercase tracking-wider">
                  Módulo Agrícola
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Produção Agrícola & Lavouras
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitoramento de talhões, estimativa de colheita, manejo fitossanitário e rotação de culturas.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  alert('Gerando mapa agronômico e planejamento de dessecação...');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <Activity className="w-4 h-4 text-slate-500" />
                <span>Manejo de Safra</span>
              </button>
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#237a32] hover:bg-[#185824] rounded-xl shadow-sm shadow-[#237a32]/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Talhão</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs relative overflow-hidden border-l-4 border-l-[#237a32]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Área Total Cultivada
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#237a32] flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {areaTotal.toLocaleString('pt-BR')} hectares
              </div>
              <div className="mt-2 text-xs text-slate-500">
                100% da área produtiva mapeada e monitorada
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Talhões Ativos
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Sprout className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-[#237a32] tracking-tight">
                {talhoesAtivos} parcelas
              </div>
              <div className="mt-2 text-xs text-emerald-700 font-medium">
                Soja, milho safrinha e pastagens
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Prontos para Colheita
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Wheat className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {prontosColheita} talhões
              </div>
              <div className="mt-2 text-xs text-slate-500 font-medium">
                Ponto ideal de umidade para colheitadeiras
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por talhão, cultura, semente ou estágio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 text-xs rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFilterCultura('todas')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    filterCultura === 'todas'
                      ? 'bg-white text-slate-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Todas
                </button>
                <button
                  type="button"
                  onClick={() => setFilterCultura('Soja')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    filterCultura === 'Soja'
                      ? 'bg-white text-[#237a32] shadow-xs'
                      : 'text-slate-600 hover:text-[#237a32]'
                  }`}
                >
                  Soja
                </button>
                <button
                  type="button"
                  onClick={() => setFilterCultura('Milho')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    filterCultura === 'Milho'
                      ? 'bg-white text-amber-700 shadow-xs'
                      : 'text-slate-600 hover:text-amber-700'
                  }`}
                >
                  Milho
                </button>
                <button
                  type="button"
                  onClick={() => setFilterCultura('Pastagem')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    filterCultura === 'Pastagem'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-emerald-700'
                  }`}
                >
                  Pastos
                </button>
              </div>

              <button
                type="button"
                onClick={handleExportarSafra}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                title="Exportar Dados da Safra em CSV"
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
                    <th className="py-3.5 px-5">Talhão</th>
                    <th className="py-3.5 px-5">Cultura & Variedade</th>
                    <th className="py-3.5 px-5">Área (ha)</th>
                    <th className="py-3.5 px-5">Plantio</th>
                    <th className="py-3.5 px-5">Estágio / Fenologia</th>
                    <th className="py-3.5 px-5">Previsão Colheita</th>
                    <th className="py-3.5 px-5">Produtividade Est.</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredTalhoes.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="py-8 text-center text-slate-400">
                        Nenhum talhão encontrado com os critérios de busca selecionados.
                      </td>
                    </tr>
                  ) : (
                    filteredTalhoes.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-5 font-semibold text-slate-900 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-[#237a32] shrink-0" />
                            <span>{t.nome}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5">
                          <div className="font-semibold text-slate-900">{t.cultura}</div>
                          <div className="text-[11px] text-slate-500">{t.variedade || '-'}</div>
                        </td>
                        <td className="py-3.5 px-5 whitespace-nowrap font-medium text-slate-700">
                          {t.areaHa} ha
                        </td>
                        <td className="py-3.5 px-5 whitespace-nowrap text-slate-600 font-medium">
                          {t.dataPlantio}
                        </td>
                        <td className="py-3.5 px-5 text-slate-700 font-medium">
                          {t.estagio}
                        </td>
                        <td className="py-3.5 px-5 whitespace-nowrap text-slate-600">
                          {t.previsaoColheita}
                        </td>
                        <td className="py-3.5 px-5 whitespace-nowrap font-bold text-[#237a32]">
                          {t.produtividadeEstimada || '-'}
                        </td>
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              t.status === 'Pronto para Colheita'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : t.status === 'Em Desenvolvimento'
                                ? 'bg-emerald-50 text-[#237a32] border border-emerald-100'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                t.status === 'Pronto para Colheita'
                                  ? 'bg-amber-500 animate-pulse'
                                  : t.status === 'Em Desenvolvimento'
                                  ? 'bg-[#237a32]'
                                  : 'bg-slate-400'
                              }`}
                            />
                            {t.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(t)}
                              className="p-1.5 text-slate-400 hover:text-[#237a32] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="Editar Talhão"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteTalhao(t.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Remover Talhão"
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
              <span>{filteredTalhoes.length} talhões listados</span>
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
              <span>Novo Talhão / Plantio</span>
            </button>
            <button
              type="button"
              onClick={() => {
                alert('Abertura de registro de pulverização e defensivos agrícolas...');
                setIsBottomMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-[#237a32] rounded-xl transition-colors cursor-pointer text-left"
            >
              <Activity className="w-4 h-4 text-[#237a32]" />
              <span>Registrar Aplicação</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setFilterCultura('todas');
                setSearchTerm('');
                setIsBottomMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer text-left"
            >
              <Filter className="w-4 h-4 text-slate-500" />
              <span>Ver Todos os Talhões</span>
            </button>
            <button
              type="button"
              onClick={() => {
                handleExportarSafra();
                setIsBottomMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer text-left"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Exportar Mapa da Safra (CSV)</span>
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsBottomMenuOpen(!isBottomMenuOpen)}
          className="flex items-center gap-2 py-3 px-5 rounded-full bg-[#237a32] hover:bg-[#185824] text-white font-semibold text-xs shadow-lg shadow-[#237a32]/30 active:scale-95 transition-all cursor-pointer"
        >
          <Wheat className="w-4 h-4" />
          <span>Opções da Lavoura</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isBottomMenuOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-backdrop-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingTalhao ? 'Editar Dados do Talhão' : 'Cadastrar Novo Talhão / Cultura'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTalhao} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Identificador / Nome do Talhão *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Talhão 06 - Pasto das Pedras"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cultura Principal *</label>
                  <select
                    value={formData.cultura}
                    onChange={(e) => setFormData({ ...formData, cultura: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white font-medium"
                  >
                    <option value="Soja">Soja</option>
                    <option value="Milho">Milho Safrinha / Safra</option>
                    <option value="Pastagem">Pastagem / Braquiária</option>
                    <option value="Sorgo">Sorgo Granífero</option>
                    <option value="Algodão">Algodão</option>
                    <option value="Trigo">Trigo</option>
                    <option value="Café">Café</option>
                    <option value="Outra">Outra Cultura</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Área (Hectares) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="ex: 120"
                    value={formData.areaHa}
                    onChange={(e) => setFormData({ ...formData, areaHa: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Variedade / Híbrido da Semente
                </label>
                <input
                  type="text"
                  placeholder="ex: Brasmax Desafio 8473, Pioneer P3707"
                  value={formData.variedade}
                  onChange={(e) => setFormData({ ...formData, variedade: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Data do Plantio</label>
                  <input
                    type="text"
                    placeholder="DD/MM/AAAA"
                    value={formData.dataPlantio}
                    onChange={(e) => setFormData({ ...formData, dataPlantio: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Previsão da Colheita</label>
                  <input
                    type="text"
                    placeholder="DD/MM/AAAA"
                    value={formData.previsaoColheita}
                    onChange={(e) => setFormData({ ...formData, previsaoColheita: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Estágio Fenológico Atual
                </label>
                <input
                  type="text"
                  placeholder="ex: V4 (Vegetativo), R1 (Floração), R5 (Enchimento)"
                  value={formData.estagio}
                  onChange={(e) => setFormData({ ...formData, estagio: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Produtividade Estimada
                  </label>
                  <input
                    type="text"
                    placeholder="ex: 70 sc/ha"
                    value={formData.produtividadeEstimada}
                    onChange={(e) => setFormData({ ...formData, produtividadeEstimada: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status da Parcela</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                  >
                    <option value="Em Desenvolvimento">Em Desenvolvimento</option>
                    <option value="Pronto para Colheita">Pronto para Colheita</option>
                    <option value="Colheita em Andamento">Colheita em Andamento</option>
                    <option value="Manejo Ativo">Manejo Ativo</option>
                    <option value="Em Pousio / Preparo">Em Pousio / Preparo</option>
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
                  <span>{editingTalhao ? 'Salvar Alterações' : 'Cadastrar Talhão'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
