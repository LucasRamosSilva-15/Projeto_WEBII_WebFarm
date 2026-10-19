import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmModal from '../components/ConfirmModal';

describe('ConfirmModal', () => {
  it('nao renderiza quando isOpen e falso', () => {
    const { container } = render(
      <ConfirmModal isOpen={false} onClose={() => {}} onConfirm={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renderiza corretamente quando isOpen e verdadeiro', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={() => {}}
        title="Excluir Registro"
        message="Deseja prosseguir com a exclusão?"
        itemName="Item XPTO"
      />
    );

    expect(screen.getByText('Excluir Registro')).toBeInTheDocument();
    expect(screen.getByText('Deseja prosseguir com a exclusão?')).toBeInTheDocument();
    expect(screen.getByText('Item XPTO')).toBeInTheDocument();
    expect(screen.getByText('Sim, Excluir')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('chama onClose ao clicar em Cancelar ou no botao de fechar', () => {
    const handleClose = vi.fn();
    render(
      <ConfirmModal
        isOpen={true}
        onClose={handleClose}
        onConfirm={() => {}}
      />
    );

    fireEvent.click(screen.getByText('Cancelar'));
    expect(handleClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText('Fechar'));
    expect(handleClose).toHaveBeenCalledTimes(2);
  });

  it('chama onConfirm e onClose ao clicar no botao de confirmacao', () => {
    const handleClose = vi.fn();
    const handleConfirm = vi.fn();
    render(
      <ConfirmModal
        isOpen={true}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    );

    fireEvent.click(screen.getByText('Sim, Excluir'));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('fecha o modal ao pressionar a tecla Escape', () => {
    const handleClose = vi.fn();
    render(
      <ConfirmModal
        isOpen={true}
        onClose={handleClose}
        onConfirm={() => {}}
      />
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
