import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NotFound from '../pages/NotFound';

describe('Página NotFound (Erro 404)', () => {
  const mockUser = {
    nome: 'Produtor Rural Silva',
    fazenda: 'Fazenda Santa Maria',
    email: 'produtor@webfarm.com.br'
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('deve renderizar o título de erro 404 e badge de talhão não mapeado', () => {
    render(<NotFound onNavigate={vi.fn()} user={mockUser} />);

    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    expect(screen.getByText(/Erro 404 • Talhão Não Mapeado/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: /Coordenada ou Rota Não Encontrada/i })).toBeInTheDocument();
  });

  it('deve exibir o nome da fazenda quando o usuário estiver autenticado', () => {
    render(<NotFound onNavigate={vi.fn()} user={mockUser} />);
    expect(screen.getByText('Fazenda Santa Maria')).toBeInTheDocument();
  });

  it('deve exibir botão de login quando o usuário for visitante não autenticado', () => {
    render(<NotFound onNavigate={vi.fn()} user={null} />);
    expect(screen.getByText('Entrar no Sistema')).toBeInTheDocument();
    expect(screen.getByText('Ir para a Página de Login')).toBeInTheDocument();
  });

  it('deve chamar onNavigate com dashboard ao clicar em voltar ao painel se logado', () => {
    const onNavigateMock = vi.fn();
    render(<NotFound onNavigate={onNavigateMock} user={mockUser} />);

    const homeButton = screen.getByText('Voltar ao Painel Geral');
    fireEvent.click(homeButton);

    expect(onNavigateMock).toHaveBeenCalledWith('dashboard');
  });

  it('deve chamar onNavigate com login ao clicar no botão inicial se visitante', () => {
    const onNavigateMock = vi.fn();
    render(<NotFound onNavigate={onNavigateMock} user={null} />);

    const loginButton = screen.getByText('Ir para a Página de Login');
    fireEvent.click(loginButton);

    expect(onNavigateMock).toHaveBeenCalledWith('login');
  });

  it('deve navegar para o módulo selecionado da lista quando autenticado', () => {
    const onNavigateMock = vi.fn();
    render(<NotFound onNavigate={onNavigateMock} user={mockUser} />);

    const pecuariaCard = screen.getByText('Pecuária & Rebanho');
    fireEvent.click(pecuariaCard);

    expect(onNavigateMock).toHaveBeenCalledWith('animais');
  });

  it('deve redirecionar para login ao clicar em um módulo da lista quando não autenticado', () => {
    const onNavigateMock = vi.fn();
    render(<NotFound onNavigate={onNavigateMock} user={null} />);

    const maquinasCard = screen.getByText('Maquinários & Frotas');
    fireEvent.click(maquinasCard);

    expect(onNavigateMock).toHaveBeenCalledWith('login');
  });

  it('deve acionar window.history.back ao clicar em Voltar à Página Anterior', () => {
    const historyBackSpy = vi.spyOn(window.history, 'back').mockImplementation(() => {});
    Object.defineProperty(window.history, 'length', { value: 3, configurable: true });

    render(<NotFound onNavigate={vi.fn()} user={mockUser} />);

    const backButton = screen.getByText('Voltar à Página Anterior');
    fireEvent.click(backButton);

    expect(historyBackSpy).toHaveBeenCalled();
  });

  it('deve renderizar a imagem da logo oficial do WebFarm com logo_webFarm_1.svg', () => {
    render(<NotFound onNavigate={vi.fn()} user={mockUser} />);
    const logoImg = screen.getByAltText('Logo WebFarm');
    expect(logoImg).toBeInTheDocument();
    expect(logoImg).toHaveAttribute('src', '/images/logo_webFarm_1.svg');
  });
});
