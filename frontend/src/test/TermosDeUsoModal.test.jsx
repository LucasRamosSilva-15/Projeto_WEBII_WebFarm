import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TermosDeUsoModal from '../components/TermosDeUsoModal';

describe('Componente TermosDeUsoModal', () => {
  it('não deve renderizar quando isOpen for false', () => {
    const { container } = render(<TermosDeUsoModal isOpen={false} onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('deve exibir o cabeçalho dos Termos de Uso', () => {
    render(<TermosDeUsoModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Termos de Uso • WebFarm 2.0')).toBeInTheDocument();
    expect(screen.getByText('Contrato de Adesão & Uso')).toBeInTheDocument();
  });

  it('deve listar as cláusulas essenciais do contrato', () => {
    render(<TermosDeUsoModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(/1. Objeto e Escopo dos Serviços/i)).toBeInTheDocument();
    expect(screen.getByText(/2. Titularidade e Soberania dos Dados/i)).toBeInTheDocument();
    expect(screen.getByText(/3. Disponibilidade Operacional e Nível de Serviço \(SLA\)/i)).toBeInTheDocument();
    expect(screen.getByText(/4. Segurança de Acesso e Credenciais/i)).toBeInTheDocument();
    expect(screen.getByText(/5. Portabilidade e Rescisão Sem Custos/i)).toBeInTheDocument();
  });

  it('deve acionar onAccept e fechar ao clicar em Li e Aceito os Termos', () => {
    const handleAccept = vi.fn();
    const handleClose = vi.fn();
    render(<TermosDeUsoModal isOpen={true} onClose={handleClose} onAccept={handleAccept} />);
    
    const botaoAceitar = screen.getByText('Li e Aceito os Termos');
    fireEvent.click(botaoAceitar);

    expect(handleAccept).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('deve fechar com a tecla Escape', () => {
    const handleClose = vi.fn();
    render(<TermosDeUsoModal isOpen={true} onClose={handleClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
