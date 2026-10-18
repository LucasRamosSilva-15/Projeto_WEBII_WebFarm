import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BackupStatusModal from '../components/BackupStatusModal';

describe('Componente BackupStatusModal', () => {
  it('não deve renderizar quando isOpen for false', () => {
    const { container } = render(<BackupStatusModal isOpen={false} onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('deve exibir status do banco SQLite e retenção de snapshots', () => {
    render(<BackupStatusModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Backup em Nuvem & Armazenamento')).toBeInTheDocument();
    expect(screen.getByText('Banco de Dados SQLite Local')).toBeInTheDocument();
    expect(screen.getByText(/Snapshots diários \(30 dias\)/i)).toBeInTheDocument();
    expect(screen.getByText('AES-256 bits')).toBeInTheDocument();
  });

  it('deve executar backup imediato ao clicar no botão', async () => {
    render(<BackupStatusModal isOpen={true} onClose={vi.fn()} />);
    const botaoBackup = screen.getByText('Executar Backup Agora');
    fireEvent.click(botaoBackup);

    await waitFor(() => {
      expect(screen.getByText(/Snapshot gerado e sincronizado com a nuvem/i)).toBeInTheDocument();
    }, { timeout: 2500 });
  });

  it('deve chamar onClose ao pressionar Escape', () => {
    const handleClose = vi.fn();
    render(<BackupStatusModal isOpen={true} onClose={handleClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
