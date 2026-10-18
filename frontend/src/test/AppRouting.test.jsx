import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

describe('Roteamento de Rotas Inválidas (404) no App', () => {
  beforeEach(() => {
    localStorage.clear();
    window.location.hash = '';
    window.history.replaceState(null, '', '/');
  });

  it('deve renderizar a página 404 quando o caminho da URL for inválido', async () => {
    window.history.replaceState(null, '', '/rota-totalmente-desconhecida');

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
      expect(screen.getByText(/Erro 404 • Talhão Não Mapeado/i)).toBeInTheDocument();
    });
  });

  it('deve renderizar a página 404 quando a hash da URL for desconhecida', async () => {
    window.location.hash = '#/pagina-inexistente-123';

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    });
  });

  it('deve permitir navegar da página 404 para o login quando visitante', async () => {
    window.location.hash = '#/rota-errada';

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    });

    const loginButton = screen.getByText('Ir para a Página de Login');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Informe suas credenciais para gerenciar sua fazenda/i)).toBeInTheDocument();
    });
  });

  it('deve renderizar o dashboard e rota 404 adequadamente quando autenticado', async () => {
    const authSession = {
      id: 1,
      nome: 'Produtor Teste',
      email: 'produtor@webfarm.com',
      tipo: 'admin',
      fazenda: 'Fazenda Modelo'
    };
    localStorage.setItem('webfarm_auth_session', JSON.stringify(authSession));

    window.history.replaceState(null, '', '/talhao-fantasma');

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
      expect(screen.getByText('Fazenda Modelo')).toBeInTheDocument();
    });

    const homeButton = screen.getByText('Voltar ao Painel Geral');
    fireEvent.click(homeButton);

    await waitFor(() => {
      expect(screen.getByText(/Painel Central de Operações/i)).toBeInTheDocument();
    });
  });
});
