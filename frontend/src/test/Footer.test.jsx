import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Footer from '../components/Footer';

describe('Componente Footer', () => {
  const mockUser = {
    nome: 'Lucas Ramos Silva',
    cpf_cnpj: '111.111.111-11',
    email: 'lucasramossme@gmail.com'
  };

  it('deve renderizar copyright institucional e versão', () => {
    render(<Footer user={mockUser} />);
    expect(screen.getByText(/WebFarm Software Agrícola Ltda/i)).toBeInTheDocument();
    expect(screen.getByText(/Versão 2.4.0/i)).toBeInTheDocument();
  });

  it('deve exibir os botões de suporte, privacidade e backup', () => {
    render(<Footer user={mockUser} />);
    expect(screen.getByText('Suporte ao Produtor')).toBeInTheDocument();
    expect(screen.getByText('LGPD Agro')).toBeInTheDocument();
    expect(screen.getByText('Backup Nuvem OK')).toBeInTheDocument();
  });

  it('deve abrir o modal de suporte ao clicar em Suporte ao Produtor', () => {
    render(<Footer user={mockUser} />);
    fireEvent.click(screen.getByText('Suporte ao Produtor'));
    expect(screen.getByText(/Suporte Técnico ao Produtor Rural/i)).toBeInTheDocument();
  });

  it('deve abrir o modal de LGPD Agro ao clicar em LGPD Agro', () => {
    render(<Footer user={mockUser} />);
    fireEvent.click(screen.getByText('LGPD Agro'));
    expect(screen.getByText(/LGPD Agro • Governança & Privacidade/i)).toBeInTheDocument();
  });

  it('deve abrir o modal de status de backup ao clicar em Backup Nuvem OK', () => {
    render(<Footer user={mockUser} />);
    fireEvent.click(screen.getByText('Backup Nuvem OK'));
    expect(screen.getByText(/Backup em Nuvem & Armazenamento/i)).toBeInTheDocument();
  });
});
