import { useState, useEffect } from 'react';
import ProducerSupportModal from './ProducerSupportModal';
import LgpdAgroModal from './LgpdAgroModal';
import BackupStatusModal from './BackupStatusModal';

export default function Footer({ user: propUser }) {
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isLgpdOpen, setIsLgpdOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  const [activeUser, setActiveUser] = useState(() => {
    if (propUser) return propUser;
    try {
      const stored = localStorage.getItem('webfarm_auth_session');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (propUser) {
      setActiveUser(propUser);
    }
  }, [propUser]);

  return (
    <>
      <footer className="mt-auto px-8 py-4 border-t border-slate-200 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 WebFarm Software Agrícola Ltda. • Versão 2.4.0 (Enterprise)</p>
        <div className="flex items-center gap-4 text-slate-500">
          <button
            type="button"
            onClick={() => setIsSupportOpen(true)}
            className="hover:text-[#237a32] transition-colors cursor-pointer active:scale-95"
            title="Abrir Central de Atendimento e Plantão Agronômico"
          >
            Suporte ao Produtor
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setIsLgpdOpen(true)}
            className="hover:text-[#237a32] transition-colors cursor-pointer active:scale-95"
            title="Termos de Privacidade e Soberania de Dados Agropecuários"
          >
            LGPD Agro
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setIsBackupOpen(true)}
            className="hover:text-[#237a32] transition-colors cursor-pointer active:scale-95 flex items-center gap-1.5"
            title="Verificar Integridade e Snapshot em Nuvem"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Backup Nuvem OK</span>
          </button>
        </div>
      </footer>

      <ProducerSupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

      <LgpdAgroModal
        isOpen={isLgpdOpen}
        onClose={() => setIsLgpdOpen(false)}
        user={activeUser}
      />

      <BackupStatusModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
      />
    </>
  );
}
