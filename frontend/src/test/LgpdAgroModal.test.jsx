import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LgpdAgroModal from '../components/LgpdAgroModal';

describe('Componente LgpdAgroModal', () => {
  const mockUser = {
    nome: 'Lucas Ramos Silva',
    cpf_cnpj: '111.111.111-11',
    email: 'lucasramossme@gmail.com',
    fazenda: 'São Carlos de Agosto'
  };

  it('não deve renderizar quando isOpen for false', () => {
    const { container } = render(<LgpdAgroModal isOpen={false} onClose={vi.fn()} user={mockUser} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('deve exibir o princípio de soberania agronômica e Lei 13.709/2018', () => {
    render(<LgpdAgroModal isOpen={true} onClose={vi.fn()} user={mockUser} />);
    expect(screen.getByText(/LGPD Agro • Governança & Privacidade/i)).toBeInTheDocument();
    expect(screen.getByText(/Princípio da Soberania Agronômica/i)).toBeInTheDocument();
  });

  it('deve listar os direitos do produtor segundo o Art. 18 da LGPD', () => {
    render(<LgpdAgroModal isOpen={true} onClose={vi.fn()} user={mockUser} />);
    expect(screen.getByText('Confirmação & Acesso')).toBeInTheDocument();
    expect(screen.getByText('Portabilidade Completa')).toBeInTheDocument();
    expect(screen.getByText('Segurança & Criptografia')).toBeInTheDocument();
    expect(screen.getByText('Eliminação e Retificação')).toBeInTheDocument();
  });

  it('deve exibir o contato do encarregado de dados DPO Agro', () => {
    render(<LgpdAgroModal isOpen={true} onClose={vi.fn()} user={mockUser} />);
    expect(screen.getByText(/Dra. Camila S. Andrade/i)).toBeInTheDocument();
    expect(screen.getByText('dpo@webfarm.com.br')).toBeInTheDocument();
  });

  it('deve acionar exportação de relatório ao clicar em Baixar Dados (CSV)', () => {
    render(<LgpdAgroModal isOpen={true} onClose={vi.fn()} user={mockUser} />);
    const botaoDownload = screen.getByText(/Baixar Dados \(CSV\)/i);
    fireEvent.click(botaoDownload);
    expect(screen.getByText(/Relatório de dados pessoais baixado com sucesso/i)).toBeInTheDocument();
  });

  it('deve chamar onClose ao clicar em Estou Ciente & Conforme', () => {
    const handleClose = vi.fn();
    render(<LgpdAgroModal isOpen={true} onClose={handleClose} user={mockUser} />);
    fireEvent.click(screen.getByText('Estou Ciente & Conforme'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
