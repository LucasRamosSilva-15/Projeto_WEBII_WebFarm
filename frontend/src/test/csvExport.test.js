import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportToCsv } from '../utils/csvExport';

describe('exportToCsv', () => {
  let createdLinks = [];

  beforeEach(() => {
    createdLinks = [];
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();

    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      const el = originalCreateElement(tagName);
      if (tagName === 'a') {
        el.click = vi.fn();
        createdLinks.push(el);
      }
      return el;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('retorna false caso rows seja vazio ou indefinido', () => {
    expect(exportToCsv('teste.csv', ['ID'], [])).toBe(false);
    expect(exportToCsv('teste.csv', ['ID'], null)).toBe(false);
  });

  it('cria blob, gera link de download e aciona click', () => {
    const headers = ['ID', 'Nome', 'Valor'];
    const rows = [
      [1, 'Trator John Deere', 350000],
      [2, 'Colheitadeira', 980000]
    ];

    const result = exportToCsv('maquinas', headers, rows);

    expect(result).toBe(true);
    expect(createdLinks.length).toBe(1);
    expect(createdLinks[0].getAttribute('download')).toBe('maquinas.csv');
    expect(createdLinks[0].getAttribute('href')).toBe('blob:mock-url');
    expect(createdLinks[0].click).toHaveBeenCalledTimes(1);
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('trata aspas duplas e caracteres especiais corretamente', () => {
    const headers = ['Descrição'];
    const rows = [
      ['Talhão "Zona Norte" com soja & milho']
    ];

    const result = exportToCsv('safra.csv', headers, rows);
    expect(result).toBe(true);
    expect(createdLinks[0].getAttribute('download')).toBe('safra.csv');
  });
});
