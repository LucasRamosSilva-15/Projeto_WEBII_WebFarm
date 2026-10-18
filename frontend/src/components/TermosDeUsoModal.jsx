import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  FileText,
  X,
  CheckCircle2,
  ShieldCheck,
  Scale,
  Building,
  Server,
  Lock,
  Download
} from 'lucide-react';

export default function TermosDeUsoModal({ isOpen, onClose, onAccept }) {
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

  const handleDownloadTermos = () => {
    const textoTermos = `TERMOS DE USO E LICENCIAMENTO DA PLATAFORMA WEBFARM 2.0 ENTERPRISE
Data de Vigência: Safra 2025/2026

1. OBJETO E ESCOPO DO SERVIÇO
A plataforma WebFarm disponibiliza serviços de gestão agropecuária na nuvem e suporte de contingência local, incluindo rastreabilidade animal, gestão de maquinários agrícolas, controle financeiro e mapeamento de safras.

2. PROPRIEDADE DOS DADOS DA FAZENDA
O produtor rural titular é o detentor integral, soberano e intransferível de todos os dados inseridos na plataforma. A WebFarm não comercializa nem transfere dados consolidados a terceiros.

3. DISPONIBILIDADE E NÍVEL DE SERVIÇO (SLA)
Garantia de 99,5% de disponibilidade mensal dos serviços em nuvem, com arquitetura tolerante a falhas e persistência local via banco SQLite.

4. RESPONSABILIDADE DO USUÁRIO
O usuário se compromete a manter o sigilo de suas credenciais de acesso e cadastrar dados verídicos em consonância com as exigências sanitárias e fiscais vigentes.

5. PORTABILIDADE
O produtor tem o direito de exportar a integralidade de seus dados a qualquer momento em formatos abertos (CSV/JSON/PDF) sem ônus adicional.`;

    const blob = new Blob([textoTermos], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'webfarm_termos_de_uso.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#237a32] uppercase tracking-wider bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300/40">
                  Contrato de Adesão & Uso
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <Scale className="w-3 h-3 text-emerald-600" />
                  Vigente 2025/2026
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
                Termos de Uso • WebFarm 2.0
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Diretrizes de utilização, responsabilidades mútuas e licenciamento SaaS.
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

        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-slate-600 leading-relaxed">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-xs">
              <Building className="w-4 h-4 text-[#237a32]" />
              <span>1. Objeto e Escopo dos Serviços</span>
            </h4>
            <p>
              A WebFarm disponibiliza ao produtor rural uma plataforma em nuvem de gestão agropecuária e serviços, incluindo controle individual de rebanho bovino, apontamento de maquinários, fluxo de caixa agrícola e planejamento de safras.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-xs">
              <ShieldCheck className="w-4 h-4 text-[#237a32]" />
              <span>2. Titularidade e Soberania dos Dados</span>
            </h4>
            <p>
              Todos os lançamentos, dados biométricos de animais, margens financeiras, produtividades agrícolas (sc/ha) e históricos operacionais são de propriedade única e irrestrita do produtor contratante.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-xs">
              <Server className="w-4 h-4 text-[#237a32]" />
              <span>3. Disponibilidade Operacional e Nível de Serviço (SLA)</span>
            </h4>
            <p>
              Garantia de 99,5% de disponibilidade mensal da infraestrutura, com arquitetura de redundância e contingência offline para que o produtor mantenha seus lançamentos no campo mesmo em áreas sem conectividade.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-xs">
              <Lock className="w-4 h-4 text-[#237a32]" />
              <span>4. Segurança de Acesso e Credenciais</span>
            </h4>
            <p>
              O titular se compromete a zelar pelo sigilo de suas senhas de acesso. Todas as senhas são armazenadas com hash irreversível e o sistema conta com trilhas de auditoria para ações executadas por colaboradores.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 text-[#237a32]" />
              <span>5. Portabilidade e Rescisão Sem Custos</span>
            </h4>
            <p>
              O produtor tem o direito de exportar a integralidade de seus dados a qualquer momento em formatos universais e abertos (CSV/PDF) sem cobrança de taxas de resgate ou penalidades.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs gap-3">
          <button
            type="button"
            onClick={handleDownloadTermos}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Baixar Termos (.txt)</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 font-semibold rounded-xl text-slate-700 transition-colors shadow-xs cursor-pointer"
            >
              Fechar
            </button>

            {onAccept && (
              <button
                type="button"
                onClick={() => {
                  onAccept();
                  onClose();
                }}
                className="px-5 py-2 bg-[#237a32] hover:bg-[#185824] text-white font-bold rounded-xl transition-all shadow-md shadow-[#237a32]/20 cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Li e Aceito os Termos</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
}
