import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../components/Sidebar';

describe('Componente Sidebar', () => {
  const mockUser = {
    nome: 'Lucas Ramos Silva',
    email: 'lucasramossme@gmail.com',
    fazenda: 'Fazenda Santa Maria',
    perfil: 'Administrador'
  };

  it('deve renderizar a marca WebFarm e versão', () => {
    render(<Sidebar user={mockUser} />);
    expect(screen.getByText('WebFarm')).toBeInTheDocument();
    expect(screen.getByText('2.0')).toBeInTheDocument();
  });

  it('deve listar os módulos principais do sistema', () => {
    render(<Sidebar user={mockUser} />);
    expect(screen.getByText('Painel Principal')).toBeInTheDocument();
    expect(screen.getByText('Animais & Rebanho')).toBeInTheDocument();
    expect(screen.getByText('Maquinários & Veículos')).toBeInTheDocument();
    expect(screen.getByText('Financeiro & Vendas')).toBeInTheDocument();
    expect(screen.getByText('Funcionários & Equipe')).toBeInTheDocument();
    expect(screen.getByText('Produção Agrícola')).toBeInTheDocument();
    expect(screen.getByText('Relatórios & Histórico')).toBeInTheDocument();
  });

  it('deve chamar onSelectModule ao clicar em um módulo do menu', () => {
    const handleSelect = vi.fn();
    render(<Sidebar user={mockUser} onSelectModule={handleSelect} />);
    fireEvent.click(screen.getByText('Animais & Rebanho'));
    expect(handleSelect).toHaveBeenCalledWith('animais');
  });

  it('deve exibir o nome da propriedade ativa', () => {
    render(<Sidebar user={mockUser} />);
    expect(screen.getByText('Fazenda Santa Maria')).toBeInTheDocument();
  });

  it('deve abrir o modal de perfil da fazenda ao clicar no card da propriedade', () => {
    render(<Sidebar user={mockUser} />);
    const botaoFazenda = screen.getByTitle(/Ver e Gerenciar Perfil da Fazenda/i);
    fireEvent.click(botaoFazenda);
    expect(screen.getByText(/Propriedade Rural Ativa/i)).toBeInTheDocument();
  });

  it('deve exibir as iniciais do produtor no rodapé da barra lateral', () => {
    render(<Sidebar user={mockUser} />);
    expect(screen.getByText('LR')).toBeInTheDocument();
    expect(screen.getByText('Lucas Ramos Silva')).toBeInTheDocument();
  });

  it('deve disparar onLogout ao clicar no botão de sair', () => {
    const handleLogout = vi.fn();
    render(<Sidebar user={mockUser} onLogout={handleLogout} />);
    const botaoSair = screen.getByTitle(/Sair do sistema/i);
    fireEvent.click(botaoSair);
    expect(handleLogout).toHaveBeenCalledTimes(1);
  });
});
