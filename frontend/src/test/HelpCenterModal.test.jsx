import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HelpCenterModal from '../components/HelpCenterModal';

describe('Componente HelpCenterModal', () => {
  it('deve renderizar o título da Central de Ajuda', () => {
    render(<HelpCenterModal onClose={vi.fn()} />);
    expect(screen.getByText('Central de Ajuda & Guia Operacional')).toBeInTheDocument();
    expect(screen.getByText('Documentação WebFarm')).toBeInTheDocument();
  });

  it('deve renderizar as abas de navegação interna', () => {
    render(<HelpCenterModal onClose={vi.fn()} />);
    expect(screen.getByText('Módulos')).toBeInTheDocument();
    expect(screen.getByText('Atalhos')).toBeInTheDocument();
    expect(screen.getByText('Dúvidas')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('deve alternar para a aba de atalhos e exibir os comandos', () => {
    render(<HelpCenterModal onClose={vi.fn()} />);
    fireEvent.click(screen.getByText('Atalhos'));
    expect(screen.getByText('⌘K / Ctrl+K')).toBeInTheDocument();
    expect(screen.getByText('Alt + 1')).toBeInTheDocument();
  });

  it('deve alternar para a aba de dúvidas e expandir uma pergunta frequente', () => {
    render(<HelpCenterModal onClose={vi.fn()} />);
    fireEvent.click(screen.getByText('Dúvidas'));
    const pergunta = screen.getByText(/Como emitir um relatório em PDF/i);
    fireEvent.click(pergunta);
    expect(screen.getByText(/Acesse o módulo de Relatórios no menu lateral/i)).toBeInTheDocument();
  });

  it('deve alternar para a aba de status e exibir serviços online', () => {
    render(<HelpCenterModal onClose={vi.fn()} />);
    fireEvent.click(screen.getByText('Status'));
    expect(screen.getByText(/Node\.js \+ Express REST API/i)).toBeInTheDocument();
    expect(screen.getByText('Base de Dados')).toBeInTheDocument();
  });

  it('deve filtrar os módulos ao digitar no campo de pesquisa', () => {
    render(<HelpCenterModal onClose={vi.fn()} />);
    const input = screen.getByPlaceholderText(/Pesquisar em tópicos, atalhos ou dúvidas.../i);
    fireEvent.change(input, { target: { value: 'Pecuária' } });
    expect(screen.getByText(/Pecuária & Gestão do Rebanho/i)).toBeInTheDocument();
  });

  it('deve chamar onClose ao pressionar a tecla Escape', () => {
    const handleClose = vi.fn();
    render(<HelpCenterModal onClose={handleClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onNavigate e fechar ao clicar no botão Acessar', () => {
    const handleClose = vi.fn();
    const handleNavigate = vi.fn();
    render(<HelpCenterModal onClose={handleClose} onNavigate={handleNavigate} />);
    const botoesAcessar = screen.getAllByText(/Acessar/i);
    fireEvent.click(botoesAcessar[0]);
    expect(handleNavigate).toHaveBeenCalledWith('animais');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
