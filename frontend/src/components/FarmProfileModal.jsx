import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  MapPin,
  X,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Layers,
  Truck,
  Users,
  Wheat,
  Edit3,
  Save,
  Plus,
  ArrowRight,
  TrendingUp,
  FileCheck,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export default function FarmProfileModal({ isOpen, onClose, user, onFarmUpdate }) {
  const [activeTab, setActiveTab] = useState('geral');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [fazendas, setFazendas] = useState([]);
  const [fazendaAtual, setFazendaAtual] = useState(null);
  const [metricas, setMetricas] = useState(null);

  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    area_hectares: '',
    tipo_producao: '',
    car_numero: 'MT-5107909-6C2A.98B1.43E0',
    nirf: '4.821.905-3',
    inscricao_estadual: '13.489.102-8'
  });

  const [showNovoForm, setShowNovoForm] = useState(false);
  const [novoFormData, setNovoFormData] = useState({
    nome: '',
    endereco: '',
    area_hectares: '',
    tipo_producao: 'Agricultura & Pecuária Mista'
  });

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const carregarDados = async () => {
      setLoading(true);
      try {
        const [listaFazendas, resMetricas] = await Promise.all([
          api.fazendas.getAll().catch(() => []),
          api.dashboard.getMetricas().catch(() => null)
        ]);

        if (!isMounted) return;

        const lista = Array.isArray(listaFazendas) ? listaFazendas : [];
        setFazendas(lista);
        if (resMetricas) setMetricas(resMetricas);

        const nomeSalvo = user?.fazenda || (lista.length > 0 ? lista[0].nome : 'Minha Propriedade');
        let ativa = lista.find(
          (f) => f.nome?.toLowerCase() === nomeSalvo?.toLowerCase()
        );

        if (!ativa && lista.length > 0) {
          ativa = lista[0];
        }

        if (ativa) {
          try {
            const detalhe = await api.fazendas.getById(ativa.id);
            if (isMounted && detalhe) {
              ativa = detalhe;
            }
          } catch {}
        }

        if (ativa) {
          setFazendaAtual(ativa);
          setFormData({
            nome: ativa.nome || '',
            endereco: ativa.endereco || 'Rodovia MT-242, Km 15 - Zona Rural',
            area_hectares: ativa.area_hectares ? String(ativa.area_hectares) : '1250',
            tipo_producao: ativa.tipo_producao || 'Agricultura de Precisão (Soja/Milho) e Pecuária de Corte',
            car_numero: 'MT-5107909-6C2A.98B1.43E0',
            nirf: '4.821.905-3',
            inscricao_estadual: '13.489.102-8'
          });
        } else {
          setFormData({
            nome: user?.fazenda || 'São Carlos de Agosto',
            endereco: 'Rodovia MT-242, Km 15 - Zona Rural',
            area_hectares: '1250',
            tipo_producao: 'Agricultura de Precisão (Soja/Milho) e Pecuária de Corte',
            car_numero: 'MT-5107909-6C2A.98B1.43E0',
            nirf: '4.821.905-3',
            inscricao_estadual: '13.489.102-8'
          });
        }
      } catch {
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    carregarDados();

    return () => {
      isMounted = false;
    };
  }, [isOpen, user]);

  const showFeedbackMessage = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => {
      setFeedback(null);
    }, 3800);
  };

  const handleSalvarPerfil = async (e) => {
    if (e) e.preventDefault();
    if (!formData.nome.trim()) {
      showFeedbackMessage('error', 'O nome da fazenda é obrigatório.');
      return;
    }

    setSaving(true);
    try {
      let fazendaSalva = null;
      if (fazendaAtual?.id) {
        fazendaSalva = await api.fazendas.update(fazendaAtual.id, {
          nome: formData.nome.trim(),
          endereco: formData.endereco?.trim() || null,
          area_hectares: formData.area_hectares ? parseFloat(formData.area_hectares) : null,
          tipo_producao: formData.tipo_producao?.trim() || null
        });
      } else {
        fazendaSalva = await api.fazendas.create({
          nome: formData.nome.trim(),
          endereco: formData.endereco?.trim() || null,
          area_hectares: formData.area_hectares ? parseFloat(formData.area_hectares) : null,
          tipo_producao: formData.tipo_producao?.trim() || null,
          id_produtor: user?.id || 1
        });
      }

      setFazendaAtual(fazendaSalva);
      setFazendas((prev) =>
        prev.map((f) => (f.id === fazendaSalva.id ? fazendaSalva : f))
      );

      const dadosParaEvento = {
        ...fazendaSalva,
        nome: formData.nome.trim()
      };

      try {
        const stored = localStorage.getItem('webfarm_auth_session');
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.fazenda = formData.nome.trim();
          localStorage.setItem('webfarm_auth_session', JSON.stringify(parsed));
        }
      } catch {}

      window.dispatchEvent(
        new CustomEvent('webfarm:farm-updated', { detail: dadosParaEvento })
      );

      if (onFarmUpdate) {
        onFarmUpdate(dadosParaEvento);
      }

      showFeedbackMessage('success', 'Perfil da fazenda atualizado com sucesso!');
    } catch (err) {
      showFeedbackMessage('error', err.message || 'Falha ao salvar as alterações da fazenda.');
    } finally {
      setSaving(false);
    }
  };

  const handleSelecionarFazendaAtiva = async (fazenda) => {
    try {
      setFazendaAtual(fazenda);
      setFormData({
        nome: fazenda.nome || '',
        endereco: fazenda.endereco || 'Rodovia MT-242, Km 15 - Zona Rural',
        area_hectares: fazenda.area_hectares ? String(fazenda.area_hectares) : '1250',
        tipo_producao: fazenda.tipo_producao || 'Agricultura de Precisão (Soja/Milho) e Pecuária de Corte',
        car_numero: 'MT-5107909-6C2A.98B1.43E0',
        nirf: '4.821.905-3',
        inscricao_estadual: '13.489.102-8'
      });

      try {
        const stored = localStorage.getItem('webfarm_auth_session');
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.fazenda = fazenda.nome;
          localStorage.setItem('webfarm_auth_session', JSON.stringify(parsed));
        }
      } catch {}

      window.dispatchEvent(
        new CustomEvent('webfarm:farm-updated', { detail: fazenda })
      );

      if (onFarmUpdate) {
        onFarmUpdate(fazenda);
      }

      showFeedbackMessage('success', `Propriedade ativa alterada para "${fazenda.nome}".`);
    } catch {
      showFeedbackMessage('error', 'Falha ao alternar propriedade ativa.');
    }
  };

  const handleCriarNovaFazenda = async (e) => {
    e.preventDefault();
    if (!novoFormData.nome.trim()) {
      showFeedbackMessage('error', 'Nome da nova propriedade é obrigatório.');
      return;
    }

    setSaving(true);
    try {
      const nova = await api.fazendas.create({
        nome: novoFormData.nome.trim(),
        endereco: novoFormData.endereco?.trim() || null,
        area_hectares: novoFormData.area_hectares ? parseFloat(novoFormData.area_hectares) : 0,
        tipo_producao: novoFormData.tipo_producao?.trim() || 'Mista',
        id_produtor: user?.id || 1,
        data_cadastro: new Date().toISOString().split('T')[0]
      });

      setFazendas((prev) => [nova, ...prev]);
      setShowNovoForm(false);
      setNovoFormData({
        nome: '',
        endereco: '',
        area_hectares: '',
        tipo_producao: 'Agricultura & Pecuária Mista'
      });

      await handleSelecionarFazendaAtiva(nova);
      showFeedbackMessage('success', 'Nova propriedade cadastrada e ativada com sucesso!');
    } catch (err) {
      showFeedbackMessage('error', err.message || 'Erro ao cadastrar nova propriedade.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const totalAnimais = fazendaAtual?.Animals?.length ?? (metricas?.animais?.total || 1);
  const totalMaquinas = fazendaAtual?.Maquinarios?.length ?? (metricas?.maquinas?.total || 1);
  const totalColaboradores = fazendaAtual?.Funcionarios?.length ?? (metricas?.funcionarios?.total || 0);
  const totalTalhoes = fazendaAtual?.ProducaoAgricolas?.length ?? (metricas?.safras?.talhoesAtivos || 0);
  const areaTotal = parseFloat(formData.area_hectares) || 1250;

  const areaLavoura = Math.round(areaTotal * 0.65);
  const areaPastagem = Math.round(areaTotal * 0.15);
  const areaReserva = Math.round(areaTotal * 0.20);

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-backdrop-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-modal-in">
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-gradient-to-r from-emerald-50/70 via-white to-emerald-50/30">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#0b2411] text-emerald-400 border border-emerald-800/40 flex items-center justify-center shadow-md shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#237a32] uppercase tracking-wider bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300/40">
                  Propriedade Rural Ativa
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Operacional
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
                <span>{formData.nome || 'Minha Fazenda'}</span>
              </h2>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#237a32] shrink-0" />
                <span>{formData.endereco || 'Endereço não cadastrado'}</span>
              </p>
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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 bg-slate-50 border-b border-slate-100">
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#237a32] flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">Área Total</span>
              <span className="text-sm font-bold text-slate-800 truncate block">
                {areaTotal.toLocaleString('pt-BR')} <span className="text-[11px] font-normal text-slate-500">ha</span>
              </span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#237a32] flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">Rebanho</span>
              <span className="text-sm font-bold text-slate-800 truncate block">
                {totalAnimais} <span className="text-[11px] font-normal text-slate-500">cabeças</span>
              </span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">Frota Ativa</span>
              <span className="text-sm font-bold text-slate-800 truncate block">
                {totalMaquinas} <span className="text-[11px] font-normal text-slate-500">máquinas</span>
              </span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Wheat className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">Talhões</span>
              <span className="text-sm font-bold text-slate-800 truncate block">
                {totalTalhoes} <span className="text-[11px] font-normal text-slate-500">áreas</span>
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 pt-3 border-b border-slate-200 bg-white flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('geral')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'geral'
                ? 'border-[#237a32] text-[#237a32]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Dados & Cadastro</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('solo')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'solo'
                ? 'border-[#237a32] text-[#237a32]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Uso do Solo & CAR</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('propriedades')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'propriedades'
                ? 'border-[#237a32] text-[#237a32]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Minhas Propriedades</span>
            {fazendas.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold">
                {fazendas.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {feedback && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-[#185824] border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          {activeTab === 'geral' && (
            <form onSubmit={handleSalvarPerfil} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Nome Oficial da Propriedade *
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                    placeholder="Ex: Fazenda Santa Maria, São Carlos de Agosto"
                    className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#237a32] focus:ring-2 focus:ring-[#237a32]/10 transition-all shadow-xs font-medium"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Localização / Endereço Completo
                  </label>
                  <input
                    type="text"
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    placeholder="Ex: Rodovia MT-242, Km 15 - Zona Rural - Sorriso/MT"
                    className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#237a32] focus:ring-2 focus:ring-[#237a32]/10 transition-all shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Área Total (Hectares)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.area_hectares}
                      onChange={(e) => setFormData({ ...formData, area_hectares: e.target.value })}
                      placeholder="1250"
                      className="w-full pl-3.5 pr-10 py-2.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#237a32] focus:ring-2 focus:ring-[#237a32]/10 transition-all shadow-xs"
                    />
                    <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-slate-400 font-semibold pointer-events-none">
                      ha
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Atividade Produtiva Principal
                  </label>
                  <select
                    value={formData.tipo_producao}
                    onChange={(e) => setFormData({ ...formData, tipo_producao: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#237a32] focus:ring-2 focus:ring-[#237a32]/10 transition-all shadow-xs cursor-pointer"
                  >
                    <option value="Agricultura de Precisão (Soja/Milho) e Pecuária de Corte">Agricultura & Pecuária (Mista)</option>
                    <option value="Lavoura de Grãos (Soja, Milho e Algodão)">Exclusiva Lavoura de Grãos</option>
                    <option value="Pecuária de Corte e Confinamento Bovino">Pecuária de Corte & Confinamento</option>
                    <option value="Pecuária Leiteira Intensiva">Pecuária Leiteira</option>
                    <option value="Fruticultura e Horticultura Irrigada">Fruticultura & Irrigação</option>
                    <option value="Silvicultura e Reflorestamento">Silvicultura</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-3">
                  Informações Fiscais & Responsável
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-medium block">Produtor Rural Titular</span>
                    <span className="text-xs font-bold text-slate-800 block mt-0.5 truncate">
                      {user?.nome || 'Lucas Ramos Silva'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {user?.cpf_cnpj || '111.111.111-11'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-medium block">Inscrição Estadual</span>
                    <span className="text-xs font-bold text-slate-800 font-mono block mt-0.5">
                      {formData.inscricao_estadual}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium">Regular / Ativa</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-medium block">Código NIRF (Receita)</span>
                    <span className="text-xs font-bold text-slate-800 font-mono block mt-0.5">
                      {formData.nirf}
                    </span>
                    <span className="text-[10px] text-slate-500">Imóvel Rural Cadastrado</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-[#237a32] hover:bg-[#185824] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#237a32]/20 flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Gravando Alterações...' : 'Salvar Alterações da Fazenda'}</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'solo' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#237a32] text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Cadastro Ambiental Rural (CAR) Regularizado</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Protocolo: <span className="font-mono font-bold text-slate-800">{formData.car_numero}</span>
                  </p>
                  <p className="text-[11px] text-[#237a32] font-semibold mt-1">
                    ✓ Imóvel 100% em conformidade com o Código Florestal Brasileiro (Lei 12.651).
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Distribuição do Uso do Solo</span>
                  <span className="text-xs text-slate-500">{areaTotal.toLocaleString('pt-BR')} ha mapeados</span>
                </div>

                <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-slate-100 p-0.5 gap-0.5 border border-slate-200">
                  <div style={{ width: '65%' }} className="h-full bg-emerald-600 rounded-l-full" title="Lavoura (65%)" />
                  <div style={{ width: '15%' }} className="h-full bg-amber-500" title="Pastagens (15%)" />
                  <div style={{ width: '20%' }} className="h-full bg-emerald-900 rounded-r-full" title="Reserva Legal & APP (20%)" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0" />
                      <span className="text-xs font-semibold text-slate-800">Lavoura Agrícola</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 mt-1">{areaLavoura.toLocaleString('pt-BR')} ha</p>
                    <p className="text-[10px] text-slate-400">65% da área total</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                      <span className="text-xs font-semibold text-slate-800">Pastagens Formadas</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 mt-1">{areaPastagem.toLocaleString('pt-BR')} ha</p>
                    <p className="text-[10px] text-slate-400">15% da área total</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-900 shrink-0" />
                      <span className="text-xs font-semibold text-slate-800">Reserva Legal & APP</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 mt-1">{areaReserva.toLocaleString('pt-BR')} ha</p>
                    <p className="text-[10px] text-slate-400">20% preservação permanente</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Capacidade de Suporte Animal</span>
                  <span className="text-[11px] text-slate-500">Taxa de lotação recomendada: 1,8 UA/ha em pastejo rotacionado</span>
                </div>
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold text-emerald-700 shadow-xs">
                  Alta Eficiência
                </span>
              </div>
            </div>
          )}

          {activeTab === 'propriedades' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Propriedades Vinculadas</h4>
                  <p className="text-[11px] text-slate-500">Alterne entre fazendas ou cadastre uma nova filial/retiro.</p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowNovoForm(!showNovoForm)}
                  className="px-3 py-1.5 bg-[#237a32] hover:bg-[#185824] text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showNovoForm ? 'Cancelar' : 'Nova Propriedade'}</span>
                </button>
              </div>

              {showNovoForm && (
                <form onSubmit={handleCriarNovaFazenda} className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3 animate-in fade-in duration-200">
                  <span className="text-xs font-bold text-[#185824] block">Cadastrar Nova Propriedade Rural</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Nome da Fazenda / Retiro *"
                        value={novoFormData.nome}
                        onChange={(e) => setNovoFormData({ ...novoFormData, nome: e.target.value })}
                        required
                        className="w-full px-3 py-2 bg-white text-xs text-slate-800 border border-slate-200 rounded-xl focus:outline-none focus:border-[#237a32]"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Município / Localização"
                        value={novoFormData.endereco}
                        onChange={(e) => setNovoFormData({ ...novoFormData, endereco: e.target.value })}
                        className="w-full px-3 py-2 bg-white text-xs text-slate-800 border border-slate-200 rounded-xl focus:outline-none focus:border-[#237a32]"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Área Total (Hectares)"
                        value={novoFormData.area_hectares}
                        onChange={(e) => setNovoFormData({ ...novoFormData, area_hectares: e.target.value })}
                        className="w-full px-3 py-2 bg-white text-xs text-slate-800 border border-slate-200 rounded-xl focus:outline-none focus:border-[#237a32]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowNovoForm(false)}
                      className="px-3 py-1.5 bg-white border border-slate-200 text-xs text-slate-600 rounded-xl"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-1.5 bg-[#237a32] text-white text-xs font-bold rounded-xl"
                    >
                      {saving ? 'Cadastrando...' : 'Confirmar Cadastro'}
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2.5">
                {fazendas.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
                    Nenhuma outra propriedade registrada.
                  </div>
                ) : (
                  fazendas.map((f) => {
                    const isAtiva =
                      f.id === fazendaAtual?.id ||
                      f.nome?.toLowerCase() === formData.nome?.toLowerCase();

                    return (
                      <div
                        key={f.id}
                        className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          isAtiva
                            ? 'bg-emerald-50/60 border-emerald-300 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              isAtiva
                                ? 'bg-[#237a32] text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-800 truncate">
                                {f.nome}
                              </span>
                              {isAtiva && (
                                <span className="text-[10px] font-bold text-[#237a32] bg-emerald-100 px-2 py-0.2 rounded-full">
                                  Ativa
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 block truncate">
                              {f.endereco || 'Endereço não cadastrado'} • {f.area_hectares || '1250'} ha
                            </span>
                          </div>
                        </div>

                        {!isAtiva ? (
                          <button
                            type="button"
                            onClick={() => handleSelecionarFazendaAtiva(f)}
                            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors shadow-xs cursor-pointer shrink-0"
                          >
                            Definir como Ativa
                          </button>
                        ) : (
                          <span className="text-[11px] font-semibold text-emerald-700 px-2.5 py-1 bg-emerald-100/70 rounded-lg">
                            Em Operação
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500">
            Pressione <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono font-bold">Esc</kbd> para sair do perfil.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 font-semibold rounded-xl text-slate-700 transition-colors shadow-xs cursor-pointer"
          >
            Fechar Painel
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
}
