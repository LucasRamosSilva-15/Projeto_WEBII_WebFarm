import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Filter,
  Phone,
  DollarSign,
  ChevronDown,
  ArrowUpDown,
  MoreVertical
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { api } from '../services/api';

export default function Funcionarios({ onNavigate, onLogout, user }) {
  const [funcionarios, setFuncionarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFuncao, setFilterFuncao] = useState('todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState(null);
  const [isBottomMenuOpen, setIsBottomMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    funcao: 'Vaqueiro Líder',
    cell: '',
    salario: '',
    status: 'Ativo',
    data_admissao: ''
  });

  const loadFuncionarios = async () => {
    try {
      const data = await api.funcionarios.getAll();
      if (Array.isArray(data)) {
        setFuncionarios(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadFuncionarios();
  }, []);

  const handleOpenAddModal = () => {
    setEditingFuncionario(null);
    setFormData({
      nome: '',
      cpf: '',
      funcao: 'Vaqueiro Líder',
      cell: '',
      salario: '',
      status: 'Ativo',
      data_admissao: new Date().toLocaleDateString('pt-BR')
    });
    setIsModalOpen(true);
    setIsBottomMenuOpen(false);
  };

  const handleOpenEditModal = (funcionario) => {
    setEditingFuncionario(funcionario);
    setFormData({
      nome: funcionario.nome,
      cpf: funcionario.cpf,
      funcao: funcionario.funcao,
      cell: funcionario.cell,
      salario: funcionario.salario,
      status: funcionario.status,
      data_admissao: funcionario.data_admissao
    });
    setIsModalOpen(true);
    setIsBottomMenuOpen(false);
  };

  const handleDeleteFuncionario = async (id) => {
    if (confirm('Tem certeza que deseja remover este funcionário da equipe?')) {
      try {
        await api.funcionarios.delete(id);
        setFuncionarios((prev) => prev.filter((f) => f.id !== id));
      } catch (err) {
        alert('Erro ao excluir funcionário: ' + err.message);
      }
    }
  };

  const handleSaveFuncionario = async (e) => {
    e.preventDefault();

    if (!formData.nome.trim() || !formData.cpf.trim()) {
      alert('Nome e CPF são campos obrigatórios.');
      return;
    }

    const payload = {
      ...formData,
      salario: Number(formData.salario) || 0
    };

    try {
      if (editingFuncionario) {
        const updated = await api.funcionarios.update(editingFuncionario.id, payload);
        setFuncionarios((prev) =>
          prev.map((f) => (f.id === editingFuncionario.id ? { ...f, ...updated } : f))
        );
      } else {
        const created = await api.funcionarios.create(payload);
        setFuncionarios((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Erro ao salvar funcionário: ' + err.message);
    }
  };

  const filteredFuncionarios = funcionarios.filter((func) => {
    const matchesSearch =
      func.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      func.funcao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      func.cpf.includes(searchTerm);
    const matchesFilter = filterFuncao === 'todas' || func.funcao === filterFuncao;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-[#f8fafc] text-slate-800 selection:bg-[#237a32]/20 selection:text-[#185824] min-h-screen flex antialiased">
      <Sidebar
        activeModule="equipe"
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
                  Recursos Humanos & Campo
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Gerenciamento de Funcionários
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Cadastro de operadores, vaqueiros, técnicos e controle salarial da fazenda.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#237a32] hover:bg-[#185824] rounded-xl shadow-sm shadow-[#237a32]/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Funcionário</span>
            </button>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por nome, função ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 text-xs rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">Função:</span>
              <select
                value={filterFuncao}
                onChange={(e) => setFilterFuncao(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 outline-none focus:border-[#237a32] cursor-pointer"
              >
                <option value="todas">Todas as Funções</option>
                <option value="Vaqueiro Líder">Vaqueiro Líder</option>
                <option value="Mecânico de Máquinas">Mecânico de Máquinas</option>
                <option value="Agrônomo Residente">Agrônomo Residente</option>
                <option value="Operador de Trator">Operador de Trator</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-5">Colaborador</th>
                    <th className="py-3.5 px-5">CPF</th>
                    <th className="py-3.5 px-5">Função</th>
                    <th className="py-3.5 px-5">Contato</th>
                    <th className="py-3.5 px-5">Salário</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredFuncionarios.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-400">
                        Nenhum funcionário encontrado com os filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    filteredFuncionarios.map((func) => (
                      <tr key={func.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-5 font-bold text-slate-800 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-slate-100 text-[#237a32] font-bold text-xs flex items-center justify-center border border-slate-200">
                              {func.nome.charAt(0)}
                            </div>
                            <div>
                              <p className="leading-tight">{func.nome}</p>
                              <span className="text-[10px] text-slate-400 font-normal">
                                Desde {func.data_admissao}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-slate-600 font-mono text-[11px]">
                          {func.cpf}
                        </td>
                        <td className="py-3.5 px-5 text-slate-700 font-medium">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                            {func.funcao}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-slate-600 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{func.cell}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 font-semibold text-emerald-800">
                          R$ {Number(func.salario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                              func.status === 'Ativo'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {func.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(func)}
                              className="p-1.5 text-slate-400 hover:text-[#237a32] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="Editar Funcionário"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteFuncionario(func.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Remover Funcionário"
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
              <span>Total na equipe: {filteredFuncionarios.length} pessoas</span>
              <span>Folha operacional ativa</span>
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
              <span>Adicionar Funcionário</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setFilterFuncao('todas');
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
                alert(`Exportando folha e dados de ${funcionarios.length} colaboradores...`);
                setIsBottomMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer text-left"
            >
              <MoreVertical className="w-4 h-4 text-slate-500" />
              <span>Relatório de Equipe</span>
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsBottomMenuOpen(!isBottomMenuOpen)}
          className="flex items-center gap-2 py-3 px-5 rounded-full bg-[#237a32] hover:bg-[#185824] text-white font-semibold text-xs shadow-lg shadow-[#237a32]/30 active:scale-95 transition-all cursor-pointer"
        >
          <Users className="w-4 h-4" />
          <span>Opções de Equipe</span>
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
                {editingFuncionario ? 'Editar Dados do Funcionário' : 'Novo Colaborador'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFuncionario} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Carlos Oliveira"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CPF *</label>
                  <input
                    type="text"
                    required
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Celular / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="(65) 90000-0000"
                    value={formData.cell}
                    onChange={(e) => setFormData({ ...formData, cell: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Função / Cargo</label>
                <select
                  value={formData.funcao}
                  onChange={(e) => setFormData({ ...formData, funcao: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#237a32] focus:bg-white"
                >
                  <option value="Vaqueiro Líder">Vaqueiro Líder</option>
                  <option value="Mecânico de Máquinas">Mecânico de Máquinas</option>
                  <option value="Agrônomo Residente">Agrônomo Residente</option>
                  <option value="Operador de Trator">Operador de Trator</option>
                  <option value="Gerente Operacional">Gerente Operacional</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Salário (R$)</label>
                  <input
                    type="number"
                    placeholder="ex: 3500"
                    value={formData.salario}
                    onChange={(e) => setFormData({ ...formData, salario: e.target.value })}
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
                    <option value="Ativo">Ativo</option>
                    <option value="Férias">Férias</option>
                    <option value="Afastado">Afastado</option>
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
                  <span>{editingFuncionario ? 'Salvar Alterações' : 'Cadastrar Colaborador'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
