import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NotificationCenter from '../components/NotificationCenter';

describe('Componente NotificationCenter', () => {
  const mockUser = {
    nome: 'Lucas Ramos Silva',
    email: 'lucasramossme@gmail.com'
  };

  it('deve renderizar o botão de notificações', () => {
    render(<NotificationCenter user={mockUser} />);
    expect(screen.getByTitle(/Central de Notificações/i)).toBeInTheDocument();
  });

  it('deve abrir o painel suspenso ao clicar no sino', async () => {
    render(<NotificationCenter user={mockUser} />);
    const botaoSino = screen.getByTitle(/Central de Notificações/i);
    fireEvent.click(botaoSino);

    await waitFor(() => {
      expect(screen.getByText('Notificações')).toBeInTheDocument();
      expect(screen.getByText(/Todas/i)).toBeInTheDocument();
      expect(screen.getByText(/Não lidas/i)).toBeInTheDocument();
    });
  });

  it('deve alternar entre as abas Todas e Não lidas', async () => {
    render(<NotificationCenter user={mockUser} />);
    fireEvent.click(screen.getByTitle(/Central de Notificações/i));

    await waitFor(() => {
      expect(screen.getByText(/Não lidas/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Não lidas/i));
    expect(screen.getByText(/Não lidas/i)).toBeInTheDocument();
  });

  it('deve permitir marcar todas as notificações como lidas', async () => {
    render(<NotificationCenter user={mockUser} />);
    fireEvent.click(screen.getByTitle(/Central de Notificações/i));

    await waitFor(() => {
      expect(screen.getByTitle(/Marcar todas como lidas/i)).toBeInTheDocument();
    });

    const botaoMarcar = screen.getByTitle(/Marcar todas como lidas/i);
    fireEvent.click(botaoMarcar);

    await waitFor(() => {
      expect(screen.queryByTitle(/Marcar todas como lidas/i)).not.toBeInTheDocument();
    });
  });
});
