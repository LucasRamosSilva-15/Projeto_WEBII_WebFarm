import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import ToastContainer from '../components/ToastContainer';
import { showToast } from '../utils/toast';

describe('ToastContainer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('nao renderiza nada inicialmente se nao houver toasts', () => {
    const { container } = render(<ToastContainer />);
    expect(container.firstChild).toBeNull();
  });

  it('exibe notificacao quando showToast e disparado', () => {
    render(<ToastContainer />);

    act(() => {
      showToast('Operação realizada com sucesso', 'success', 'Tudo Certo');
    });

    expect(screen.getByText('Tudo Certo')).toBeInTheDocument();
    expect(screen.getByText('Operação realizada com sucesso')).toBeInTheDocument();
  });

  it('renderiza tipos error, warning e info com titulos padrao', () => {
    render(<ToastContainer />);

    act(() => {
      showToast('Falha na conexão', 'error');
      showToast('Atenção aos dados', 'warning');
      showToast('Informação geral', 'info');
    });

    expect(screen.getByText('Falha na conexão')).toBeInTheDocument();
    expect(screen.getByText('Atenção aos dados')).toBeInTheDocument();
    expect(screen.getByText('Informação geral')).toBeInTheDocument();
    expect(screen.getByText('Atenção')).toBeInTheDocument();
    expect(screen.getByText('Aviso')).toBeInTheDocument();
    expect(screen.getByText('Informação')).toBeInTheDocument();
  });

  it('remove toast manualmente ao clicar no botao fechar', () => {
    render(<ToastContainer />);

    act(() => {
      showToast('Mensagem de teste', 'info');
    });

    expect(screen.getByText('Mensagem de teste')).toBeInTheDocument();

    const closeBtn = screen.getByLabelText('Fechar notificação');
    fireEvent.click(closeBtn);

    expect(screen.queryByText('Mensagem de teste')).toBeNull();
  });

  it('remove toast automaticamente apos 4 segundos', () => {
    render(<ToastContainer />);

    act(() => {
      showToast('Toast temporario', 'success');
    });

    expect(screen.getByText('Toast temporario')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(4100);
    });

    expect(screen.queryByText('Toast temporario')).toBeNull();
  });
});
