import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ShieldCheck,
  X,
  Lock,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  Users,
  ExternalLink,
  ChevronRight,
  Scale
} from 'lucide-react';

export default function LgpdAgroModal({ isOpen, onClose, user }) {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

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

  const handleExportarDadosTitular = () => {
    setDownloading(true);

    try {
      const dadosTitular = [
        ['Campo', 'Valor Cadastrado'],
        ['Nome do Titular', user?.nome || 'Lucas Ramos Silva'],
        ['CPF / CNPJ', user?.cpf_cnpj || '111.111.111-11'],
        ['E-mail Cadastrado', user?.email || 'lucasramossme@gmail.com'],
        ['Telefone / Contato', user?.cell || '(11) 11111-1111'],
        ['Perfil de Acesso', user?.perfil || 'Administrador'],
        ['Propriedade Vinculada', user?.fazenda || 'São Carlos de Agosto'],
        ['Data do Relatório', new Date().toLocaleDateString('pt-BR')],
        ['Encarregado DPO', 'dpo@webfarm.com.br'],
        ['Base Legal Principal', 'Art. 7, V da LGPD (Execução de Contrato de Gestão Agropecuária)']
      ];

      const csvContent = '\uFEFF' + dadosTitular.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `webfarm_relatorio_lgpd_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
      }, 4000);
    } catch {
    } finally {
      setDownloading(false);
    }
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
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#237a32] uppercase tracking-wider bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300/40">
                  Lei 13.709/2018
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  Soberania do Produtor
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
                LGPD Agro • Governança & Privacidade
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Compromisso institucional com a proteção e soberania de dados do agronegócio.
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
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/90 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#237a32] text-white flex items-center justify-center shrink-0 mt-0.5">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Princípio da Soberania Agronômica</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                No WebFarm, os dados de produção agrícola, pesagem de bovinos, margens financeiras, talhões e maquinários <strong>pertencem exclusivamente ao produtor rural</strong>. Não compartilhamos, não vendemos e não monetizamos dados consolidados com revendas, tradings ou multinacionais.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Seus Direitos como Titular de Dados (Art. 18 da LGPD)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Confirmação & Acesso</span>
                  <span className="text-[11px] text-slate-500">Direito de consultar a qualquer momento todos os dados cadastrados em sua fazenda.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Portabilidade Completa</span>
                  <span className="text-[11px] text-slate-500">Exportação irrestrita de relatórios em CSV e PDF de rebanho, safra e financeiro.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Segurança & Criptografia</span>
                  <span className="text-[11px] text-slate-500">Proteção de ponta a ponta com criptografia SHA-256 e isolamento rigoroso por fazenda.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Eliminação e Retificação</span>
                  <span className="text-[11px] text-slate-500">Possibilidade de solicitar alteração, bloqueio ou expurgo definitivo de cadastros.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Exportar Relatório do Titular</span>
              <span className="text-[11px] text-slate-500">Baixe um arquivo CSV com todos os dados pessoais sob custódia do sistema.</span>
            </div>

            <button
              type="button"
              onClick={handleExportarDadosTitular}
              disabled={downloading}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold rounded-xl text-slate-700 transition-colors shadow-xs flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span>{downloading ? 'Gerando CSV...' : 'Baixar Dados (CSV)'}</span>
            </button>
          </div>

          {downloadSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 text-[#185824] border border-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Relatório de dados pessoais baixado com sucesso em conformidade com o Art. 18.</span>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Encarregado pelo Tratamento de Dados (DPO Agro)
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <p className="font-bold text-slate-800">Dra. Camila S. Andrade</p>
                <p className="text-slate-500 text-[11px]">OAB/SP 412.890 • Especialista em Direito Digital & Agronegócio</p>
              </div>
              <a
                href="mailto:dpo@webfarm.com.br"
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#237a32] font-semibold rounded-lg transition-colors border border-emerald-200/60 inline-flex items-center gap-1.5 self-start sm:self-center"
              >
                <span>dpo@webfarm.com.br</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500">
            Pressione <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono font-bold">Esc</kbd> para fechar.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#237a32] hover:bg-[#185824] text-white font-bold rounded-xl transition-all shadow-md shadow-[#237a32]/20 cursor-pointer active:scale-95"
          >
            Estou Ciente & Conforme
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
}
