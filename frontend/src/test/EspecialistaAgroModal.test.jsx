import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EspecialistaAgroModal from '../components/EspecialistaAgroModal';

describe('Componente EspecialistaAgroModal', () => {
  it('não deve renderizar quando isOpen for false', () => {
    const { container } = render(<EspecialistaAgroModal isOpen={false} onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('deve exibir os canais diretos de contato com especialistas', () => {
    render(<EspecialistaAgroModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Fale com um Especialista Agro')).toBeInTheDocument();
    expect(screen.getByText('WhatsApp Direto')).toBeInTheDocument();
    expect(screen.getByText('0800 Gratuito')).toBeInTheDocument();
    expect(screen.getByText('Consultoria Técnica')).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro se tentar enviar formulário vazio', () => {
    render(<EspecialistaAgroModal isOpen={true} onClose={vi.fn()} />);
    const form = screen.getByText('Solicitar Atendimento Agronômico').closest('form');
    fireEvent.submit(form);
    expect(screen.getByText(/Por favor, informe seu nome e telefone\/WhatsApp/i)).toBeInTheDocument();
  });

  it('deve enviar formulário e exibir mensagem de sucesso', async () => {
    render(<EspecialistaAgroModal isOpen={true} onClose={vi.fn()} />);
    const inputNome = screen.getByPlaceholderText(/Ex: João Silveira/i);
    const inputTelefone = screen.getByPlaceholderText(/\(00\) 00000-0000/i);

    fireEvent.change(inputNome, { target: { value: 'Mateus Oliveira' } });
    fireEvent.change(inputTelefone, { target: { value: '(66) 99824-7100' } });

    const form = screen.getByText('Solicitar Atendimento Agronômico').closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/Solicitação enviada com sucesso!/i)).toBeInTheDocument();
    });
  });

  it('deve fechar com a tecla Escape', () => {
    const handleClose = vi.fn();
    render(<EspecialistaAgroModal isOpen={true} onClose={handleClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
