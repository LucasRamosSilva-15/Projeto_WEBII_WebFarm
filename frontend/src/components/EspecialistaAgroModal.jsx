import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Headphones,
  X,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Send
} from 'lucide-react';

export default function EspecialistaAgroModal({ isOpen, onClose }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [atividade, setAtividade] = useState('mista');
  const [area, setArea] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome.trim() || !telefone.trim()) {
      setErro('Por favor, informe seu nome e telefone/WhatsApp de contato.');
      return;
    }

    setEnviando(true);
    setErro('');

    setTimeout(() => {
      setEnviando(false);
      setSucesso(true);
      setNome('');
      setTelefone('');
      setArea('');
    }, 800);
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-backdrop-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-modal-in">
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-gradient-to-r from-emerald-50/70 via-white to-emerald-50/30">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#237a32] border border-emerald-200 flex items-center justify-center shadow-xs shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#237a32] uppercase tracking-wider bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300/40">
                  Consultoria Especializada
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Demonstração Guiada
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
                Fale com um Especialista Agro
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tire dúvidas de implantação, integrações de balança ou agende uma apresentação.
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

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href="https://wa.me/5566998247100?text=Olá,%20gostaria%20de%20falar%20com%20um%20especialista%20do%20WebFarm"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 hover:border-emerald-300 transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-600 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="mt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#237a32] block">WhatsApp Direto</span>
                <span className="text-xs font-bold text-slate-800 block mt-0.5">(66) 99824-7100</span>
                <span className="text-[10px] text-slate-500">Engenheiros de plantão</span>
              </div>
            </a>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <div className="mt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">0800 Gratuito</span>
                <span className="text-xs font-bold text-slate-800 block mt-0.5">0800 720 9000</span>
                <span className="text-[10px] text-slate-500">Seg a Sex das 07h às 19h</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <div className="mt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">Consultoria Técnica</span>
                <span className="text-xs font-bold text-slate-800 block mt-0.5 truncate">especialistas@webfarm.com</span>
                <span className="text-[10px] text-slate-500">Projetos corporativos</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50/60 border border-slate-200/80 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900">Solicitar Demonstração Personalizada</h3>
              <p className="text-[11px] text-slate-500">Nossa equipe agronômica entrará em contato para apresentar a plataforma.</p>
            </div>

            {sucesso && (
              <div className="p-3.5 rounded-xl bg-emerald-50 text-[#185824] border border-emerald-200 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-150">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Solicitação enviada com sucesso! Um especialista agro ligará para você em até 30 minutos úteis.</span>
              </div>
            )}

            {erro && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{erro}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Seu Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    placeholder="Ex: João Silveira"
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#237a32] shadow-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Telefone / WhatsApp com DDD *
                  </label>
                  <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    required
                    placeholder="(00) 00000-0000"
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#237a32] shadow-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Atividade Principal da Propriedade
                  </label>
                  <select
                    value={atividade}
                    onChange={(e) => setAtividade(e.target.value)}
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#237a32] shadow-xs cursor-pointer"
                  >
                    <option value="mista">Agricultura & Pecuária Mista</option>
                    <option value="graos">Lavoura de Grãos (Soja/Milho/Algodão)</option>
                    <option value="corte">Pecuária de Corte & Confinamento</option>
                    <option value="leite">Pecuária Leiteira Intensiva</option>
                    <option value="outra">Outras Atividades Agropecuárias</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Área Estimada (Hectares)
                  </label>
                  <input
                    type="number"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="Ex: 500"
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#237a32] shadow-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={enviando}
                  className="px-5 py-2.5 bg-[#237a32] hover:bg-[#185824] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#237a32]/20 flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{enviando ? 'Enviando...' : 'Solicitar Atendimento Agronômico'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500">Pressione Esc para fechar</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-200 font-semibold rounded-xl text-slate-700 transition-colors shadow-xs cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
}
