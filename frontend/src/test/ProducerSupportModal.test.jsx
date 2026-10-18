import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProducerSupportModal from '../components/ProducerSupportModal';

describe('Componente ProducerSupportModal', () => {
  it('não deve renderizar quando isOpen for false', () => {
    const { container } = render(<ProducerSupportModal isOpen={false} onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('deve exibir canais de atendimento e contatos', () => {
    render(<ProducerSupportModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Suporte Técnico ao Produtor Rural')).toBeInTheDocument();
    expect(screen.getByText('WhatsApp Plantão')).toBeInTheDocument();
    expect(screen.getByText('0800 720 9000')).toBeInTheDocument();
    expect(screen.getByText('suporte@webfarm.com.br')).toBeInTheDocument();
  });

  it('deve exibir formulário de abertura de chamado', () => {
    render(<ProducerSupportModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Abrir Chamado Operacional')).toBeInTheDocument();
    expect(screen.getByText('Módulo do Sistema')).toBeInTheDocument();
    expect(screen.getByText('Nível de Urgência')).toBeInTheDocument();
  });

  it('deve registrar chamado e gerar protocolo ao preencher mensagem', async () => {
    render(<ProducerSupportModal isOpen={true} onClose={vi.fn()} />);
    const textarea = screen.getByPlaceholderText(/Explique o que aconteceu, código do brinco\/trator/i);
    fireEvent.change(textarea, { target: { value: 'Balança de pesagem não está enviando dados de peso.' } });
    
    const botaoEnviar = screen.getByText('Registrar Chamado');
    fireEvent.click(botaoEnviar);

    await waitFor(() => {
      expect(screen.getByText(/Chamado (registrado|enviado) com sucesso/i)).toBeInTheDocument();
    });
  });

  it('deve fechar modal com tecla Escape', () => {
    const handleClose = vi.fn();
    render(<ProducerSupportModal isOpen={true} onClose={handleClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
