import { useState, useEffect } from 'react';
import {
  Layers,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Filter,
  MoreVertical,
  ChevronDown,
  ArrowUpDown,
  Download
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ConfirmModal from '../components/ConfirmModal';
import { api } from '../services/api';
import { exportToCSV } from '../services/exportService';
import { showToast } from '../utils/toast';

export default function Animais({ onNavigate, onLogout, user }) {
  const [animais, setAnimais] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [isBottomMenuOpen, setIsBottomMenuOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    codigo_brinco: '',
    especie: 'Bovino',
    raca: '',
    sexo: 'Macho',
    peso: '',
    status: 'Saudável',
    origem: 'Nascido na Fazenda'
  });

  const loadAnimais = async () => {
    try {
      const data = await api.animais.getAll();
      if (Array.isArray(data)) {
        setAnimais(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAnimais();
  }, []);

  const handleOpenAddModal = () => {
    setEditingAnimal(null);
    setFormData({
      codigo_brinco: '',
      especie: 'Bovino',
      raca: '',
      sexo: 'Macho',
      peso: '',
      status: 'Saudável',
      origem: 'Nascido na Fazenda'
    });
    setIsModalOpen(true);
    setIsBottomMenuOpen(false);
  };

  const handleOpenEditModal = (animal) => {
    setEditingAnimal(animal);
    setFormData({
      codigo_brinco: animal.codigo_brinco,
      especie: animal.especie,
      raca: animal.raca,
      sexo: animal.sexo,
      peso: animal.peso,
      status: animal.status,
      origem: animal.origem
    });
    setIsModalOpen(true);
    setIsBottomMenuOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.animais.delete(deleteTarget.id);
      setAnimais((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      showToast('Animal removido com sucesso!', 'success');
    } catch (err) {
      showToast('Erro ao excluir animal: ' + err.message, 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleSaveAnimal = async (e) => {
    e.preventDefault();

    if (!formData.codigo_brinco.trim()) {
      showToast('O código do brinco é obrigatório.', 'warning');
      return;
    }

    const payload = {
      ...formData,
      peso: Number(formData.peso) || 0
    };

    try {
      if (editingAnimal) {
        const updated = await api.animais.update(editingAnimal.id, payload);
        setAnimais((prev) =>
          prev.map((a) => (a.id === editingAnimal.id ? { ...a, ...updated } : a))
        );
        showToast('Animal atualizado com sucesso!', 'success');
      } else {
        const created = await api.animais.create(payload);
        setAnimais((prev) => [created, ...prev]);
        showToast('Animal cadastrado com sucesso!', 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast('Erro ao salvar animal: ' + err.message, 'error');
    }
  };

  const handleExportarAnimais = () => {
    if (!filteredAnimais.length) {
      showToast('Nenhum animal para exportar.', 'warning');
      return;
    }
    const headers = ['ID', 'Código Brinco', 'Espécie', 'Raça', 'Sexo', 'Peso (kg)', 'Status', 'Origem'];
    const rows = filteredAnimais.map((a) => [
      a.id,
      a.codigo_brinco,
      a.especie,
      a.raca,
      a.sexo,
      a.peso,
      a.status,
      a.origem
    ]);
    exportToCSV('WebFarm_Inventario_Animais.csv', headers, rows);
    showToast(`Exportação de ${filteredAnimais.length} animais concluída!`, 'success');
  };

  const filteredAnimais = animais.filter((animal) => {
    const matchesSearch =
      animal.codigo_brinco.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.raca.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'todos' || animal.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-[#f8fafc] text-slate-800 selection:bg-[#237a32]/20 selection:text-[#185824] min-h-screen flex antialiased">
      <Sidebar
        activeModule="animais"
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
                  Módulo de Pecuária
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Gerenciamento de Animais
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Controle individual por brinco, rastreabilidade, peso e status do rebanho.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#237a32] hover:bg-[#185824] rounded-xl shadow-sm shadow-[#237a32]/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Animal</span>
            </button>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por brinco ou raça..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 text-xs rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 outline-none focus:border-[#237a32] cursor-pointer"
              >
                <option value="todos">Todos</option>
                <option value="Saudável">Saudável</option>
                <option value="Prenha">Prenha</option>
                <option value="Em Tratamento">Em Tratamento</option>
              </select>

              <button
                type="button"
                onClick={handleExportarAnimais}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                title="Exportar Rebanho em CSV"
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
                    <th className="py-3.5 px-5">Código / Brinco</th>
                    <th className="py-3.5 px-5">Espécie & Raça</th>
                    <th className="py-3.5 px-5">Sexo</th>
                    <th className="py-3.5 px-5">Peso Atual</th>
                    <th className="py-3.5 px-5">Origem</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredAnimais.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-400">
                        Nenhum animal encontrado com os filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    filteredAnimais.map((animal) => (
                      <tr key={animal.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-5 font-bold text-slate-800 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-[#237a32] border border-emerald-100 font-mono text-xs">
                            <Layers className="w-3.5 h-3.5" />
                            {animal.codigo_brinco}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-slate-700 font-medium">
                          {animal.especie} • {animal.raca}
                        </td>
                        <td className="py-3.5 px-5 text-slate-600">
                          {animal.sexo}
                        </td>
                        <td className="py-3.5 px-5 font-semibold text-slate-800">
                          {animal.peso} kg
                        </td>
                        <td className="py-3.5 px-5 text-slate-500">
                          {animal.origem}
                        </td>
                        <td className="py-3.5 px-5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                              animal.status === 'Saudável'
                                ? 'bg-emerald-50 text-emerald-700'
                                : animal.status === 'Prenha'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {animal.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(animal)}
                              className="p-1.5 text-slate-400 hover:text-[#237a32] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="Editar Animal"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(animal)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Remover Animal"
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
              <span>Total listado: {filteredAnimais.length} animais</span>
              <span>Propriedade: {user?.fazenda || 'Minha Propriedade'}</span>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        {isBottomMenuOpen && (
          <div className="mb-3 bg-white border border-slate-200/90 shadow-xl rounded-2xl p-2 w-52 space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-[#237a32] rounded-xl transition-colors cursor-pointer text-left"
            >
              <Plus className="w-4 h-4 text-[#237a32]" />
              <span>Adicionar Animal</span>
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
              <ArrowUpDown className="w-4 h-4 text-slate-500" />
              <span>Limpar Filtros</span>
            </button>
            <button
              type="button"
              onClick={() => {
                handleExportarAnimais();
                setIsBottomMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer text-left"
            >
              <MoreVertical className="w-4 h-4 text-slate-500" />
              <span>Relatório do Rebanho</span>
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsBottomMenuOpen(!isBottomMenuOpen)}
          className="flex items-center gap-2 py-3 px-5 rounded-full bg-[#237a32] hover:bg-[#185824] text-white font-semibold text-xs shadow-lg shadow-[#237a32]/30 active:scale-95 transition-all cursor-pointer"
        >
          <Layers className="w-4 h-4" />
          <span>Opções de Pecuária</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isBottomMenuOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-backdrop-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingAnimal ? 'Editar Dados do Animal' : 'Cadastrar Novo Animal'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAnimal} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Código do Brinco *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: BR-405"
                  value={formData.codigo_brinco}
                  onChange={(e) => setFormData({ ...formData, codigo_brinco: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Espécie</label>
                  <select
                    value={formData.especie}
                    onChange={(e) => setFormData({ ...formData, especie: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                  >
                    <option value="Bovino">Bovino</option>
                    <option value="Suíno">Suíno</option>
                    <option value="Equino">Equino</option>
                    <option value="Ovino">Ovino</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Raça</label>
                  <input
                    type="text"
                    placeholder="ex: Nelore"
                    value={formData.raca}
                    onChange={(e) => setFormData({ ...formData, raca: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sexo</label>
                  <select
                    value={formData.sexo}
                    onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                  >
                    <option value="Macho">Macho</option>
                    <option value="Fêmea">Fêmea</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    placeholder="ex: 450"
                    value={formData.peso}
                    onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                  >
                    <option value="Saudável">Saudável</option>
                    <option value="Prenha">Prenha</option>
                    <option value="Em Tratamento">Em Tratamento</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Origem</label>
                  <select
                    value={formData.origem}
                    onChange={(e) => setFormData({ ...formData, origem: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                  >
                    <option value="Nascido na Fazenda">Nascido na Fazenda</option>
                    <option value="Comprado">Comprado</option>
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
                  <span>{editingAnimal ? 'Salvar Alterações' : 'Cadastrar Animal'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Remover Animal"
        message="Tem certeza que deseja remover este animal do rebanho?"
        itemName={deleteTarget ? `${deleteTarget.codigo_brinco} (${deleteTarget.especie} - ${deleteTarget.raca})` : ''}
        confirmText="Sim, Excluir"
      />
    </div>
  );
}
