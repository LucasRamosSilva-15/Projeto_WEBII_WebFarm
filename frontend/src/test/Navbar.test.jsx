import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../components/Navbar';

describe('Componente Navbar', () => {
  const mockUser = {
    nome: 'Lucas Ramos Silva',
    email: 'lucasramossme@gmail.com',
    fazenda: 'São Carlos de Agosto'
  };

  it('deve renderizar a saudação com o primeiro nome do usuário', () => {
    render(<Navbar user={mockUser} />);
    expect(screen.getByText(/Olá, Lucas/i)).toBeInTheDocument();
  });

  it('deve renderizar saudação padrão quando usuário não for informado', () => {
    render(<Navbar />);
    expect(screen.getByText(/Olá, Produtor/i)).toBeInTheDocument();
  });

  it('deve exibir a safra atual no cabeçalho', () => {
    render(<Navbar user={mockUser} />);
    expect(screen.getByText(/safra 2025\/2026/i)).toBeInTheDocument();
  });

  it('deve disparar evento de busca ao digitar no input', () => {
    const handleSearch = vi.fn();
    render(<Navbar searchTerm="" onSearchChange={handleSearch} user={mockUser} />);
    const input = screen.getByPlaceholderText(/Buscar brinco, operador, trator ou NF.../i);
    fireEvent.change(input, { target: { value: 'BR-408' } });
    expect(handleSearch).toHaveBeenCalledWith('BR-408');
  });

  it('deve exibir o atalho de teclado ⌘K no campo de busca', () => {
    render(<Navbar user={mockUser} />);
    expect(screen.getByText('⌘K')).toBeInTheDocument();
  });

  it('deve exibir o indicador de status operacional online', () => {
    render(<Navbar user={mockUser} />);
    expect(screen.getByText(/Ambiente Conectado/i)).toBeInTheDocument();
  });

  it('deve abrir o modal de ajuda ao clicar no ícone de HelpCircle', () => {
    render(<Navbar user={mockUser} />);
    const botaoAjuda = screen.getByTitle(/Ajuda & Documentação/i);
    fireEvent.click(botaoAjuda);
    expect(screen.getByText(/Central de Ajuda & Guia Operacional/i)).toBeInTheDocument();
  });
});
