import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FarmProfileModal from '../components/FarmProfileModal';

describe('Componente FarmProfileModal', () => {
  const mockUser = {
    id: 1,
    nome: 'Lucas Ramos Silva',
    cpf_cnpj: '111.111.111-11',
    email: 'lucasramossme@gmail.com',
    fazenda: 'São Carlos de Agosto'
  };

  it('não deve renderizar quando isOpen for false', () => {
    const { container } = render(<FarmProfileModal isOpen={false} onClose={vi.fn()} user={mockUser} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('deve renderizar o cabeçalho e indicadores da propriedade ativa', () => {
    render(<FarmProfileModal isOpen={true} onClose={vi.fn()} user={mockUser} />);
    expect(screen.getByText(/Propriedade Rural Ativa/i)).toBeInTheDocument();
    expect(screen.getByText('Área Total')).toBeInTheDocument();
    expect(screen.getByText('Rebanho')).toBeInTheDocument();
    expect(screen.getByText('Frota Ativa')).toBeInTheDocument();
    expect(screen.getByText('Talhões')).toBeInTheDocument();
  });

  it('deve alternar para a aba de Uso do Solo & CAR', () => {
    render(<FarmProfileModal isOpen={true} onClose={vi.fn()} user={mockUser} />);
    fireEvent.click(screen.getByText(/Uso do Solo & CAR/i));
    expect(screen.getByText(/Cadastro Ambiental Rural \(CAR\) Regularizado/i)).toBeInTheDocument();
    expect(screen.getByText(/Distribuição do Uso do Solo/i)).toBeInTheDocument();
    expect(screen.getByText(/Lavoura Agrícola/i)).toBeInTheDocument();
  });

  it('deve alternar para a aba de Minhas Propriedades', () => {
    render(<FarmProfileModal isOpen={true} onClose={vi.fn()} user={mockUser} />);
    fireEvent.click(screen.getByText(/Minhas Propriedades/i));
    expect(screen.getByText('Propriedades Vinculadas')).toBeInTheDocument();
    expect(screen.getByText('Nova Propriedade')).toBeInTheDocument();
  });

  it('deve permitir alterar o campo nome da fazenda no formulário', () => {
    render(<FarmProfileModal isOpen={true} onClose={vi.fn()} user={mockUser} />);
    const inputNome = screen.getByPlaceholderText(/Ex: Fazenda Santa Maria, São Carlos de Agosto/i);
    fireEvent.change(inputNome, { target: { value: 'Fazenda Rio Verde' } });
    expect(inputNome.value).toBe('Fazenda Rio Verde');
  });

  it('deve chamar onClose ao pressionar Escape', () => {
    const handleClose = vi.fn();
    render(<FarmProfileModal isOpen={true} onClose={handleClose} user={mockUser} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
