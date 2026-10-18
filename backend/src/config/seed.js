const {
  ProdutorRural,
  Fazenda,
  Animal,
  Funcionario,
  Maquinario,
  ProducaoAgricola,
  TransacaoFinanceira,
  HistoricoAtividade
} = require('../models');

async function seedDatabase() {
  try {
    const produtorExistente = await ProdutorRural.findOne();
    if (!produtorExistente) {
      const produtor = await ProdutorRural.create({
        nome: 'Lucas Ramos',
        cpf_cnpj: '123.456.789-00',
        email: 'produtor@fazenda.com.br',
        cell: '(66) 99887-6655',
        senha: '123456'
      });

      const fazenda = await Fazenda.create({
        nome: 'Fazenda Santa Maria',
        localizacao: 'Mato Grosso',
        area_total: 850,
        id_produtor: produtor.id
      });

      await Animal.bulkCreate([
        {
          codigo_brinco: 'BR-101',
          especie: 'Bovino',
          raca: 'Nelore',
          sexo: 'Macho',
          peso: 480,
          status: 'Saudável',
          origem: 'Nascido na Fazenda',
          id_fazenda: fazenda.id
        },
        {
          codigo_brinco: 'BR-102',
          especie: 'Bovino',
          raca: 'Angus',
          sexo: 'Fêmea',
          peso: 510,
          status: 'Prenha',
          origem: 'Aquisição Externa',
          id_fazenda: fazenda.id
        },
        {
          codigo_brinco: 'BR-103',
          especie: 'Bovino',
          raca: 'Nelore',
          sexo: 'Fêmea',
          peso: 460,
          status: 'Saudável',
          origem: 'Nascido na Fazenda',
          id_fazenda: fazenda.id
        },
        {
          codigo_brinco: 'BR-104',
          especie: 'Bovino',
          raca: 'Girolando',
          sexo: 'Fêmea',
          peso: 495,
          status: 'Em Tratamento',
          origem: 'Aquisição Externa',
          id_fazenda: fazenda.id
        },
        {
          codigo_brinco: 'BR-105',
          especie: 'Bovino',
          raca: 'Brahman',
          sexo: 'Macho',
          peso: 540,
          status: 'Saudável',
          origem: 'Nascido na Fazenda',
          id_fazenda: fazenda.id
        }
      ]);

      await Funcionario.bulkCreate([
        {
          nome: 'Carlos Eduardo',
          cpf: '111.222.333-44',
          funcao: 'Operador de Máquinas',
          salario: 3800.00,
          cell: '(66) 99911-2233',
          email: 'carlos.eduardo@fazenda.com.br',
          status: 'Ativo',
          id_fazenda: fazenda.id
        },
        {
          nome: 'Marcos Silva',
          cpf: '222.333.444-55',
          funcao: 'Vaqueiro Líder',
          salario: 3500.00,
          cell: '(66) 99922-3344',
          email: 'marcos.silva@fazenda.com.br',
          status: 'Ativo',
          id_fazenda: fazenda.id
        },
        {
          nome: 'José Roberto',
          cpf: '333.444.555-66',
          funcao: 'Operador de Colheitadeira',
          salario: 4200.00,
          cell: '(66) 99933-4455',
          email: 'jose.roberto@fazenda.com.br',
          status: 'Ativo',
          id_fazenda: fazenda.id
        },
        {
          nome: 'Antônio Silva',
          cpf: '444.555.666-77',
          funcao: 'Serviços Gerais / Tratorista',
          salario: 2900.00,
          cell: '(66) 99944-5566',
          email: 'antonio.silva@fazenda.com.br',
          status: 'Ativo',
          id_fazenda: fazenda.id
        }
      ]);

      await Maquinario.bulkCreate([
        {
          nome: 'Trator John Deere 8400R',
          prefixo: 'TR-01',
          tipo: 'Trator',
          marca: 'John Deere',
          modelo: '8400R (400 cv)',
          ano: '2022',
          horimetro: 3820,
          status: 'Operando',
          operador: 'Carlos Eduardo',
          ultimaRevisao: '10/09/2025',
          proximaRevisao: '4.000 hrs',
          id_fazenda: fazenda.id
        },
        {
          nome: 'Colheitadeira New Holland CR 9.90',
          prefixo: 'COL-01',
          tipo: 'Colheitadeira',
          marca: 'New Holland',
          modelo: 'CR 9.90 Duplo Rotor',
          ano: '2021',
          horimetro: 2150,
          status: 'Operando',
          operador: 'José Roberto',
          ultimaRevisao: '05/08/2025',
          proximaRevisao: '2.500 hrs',
          id_fazenda: fazenda.id
        },
        {
          nome: 'Pulverizador Jacto Uniport',
          prefixo: 'PUL-01',
          tipo: 'Pulverizador',
          marca: 'Jacto',
          modelo: 'Uniport 3030 (3.000L)',
          ano: '2023',
          horimetro: 1420,
          status: 'Manutenção',
          operador: 'Marcos Vinícius',
          ultimaRevisao: '15/10/2025',
          proximaRevisao: 'Troca de Bicos & Filtros',
          id_fazenda: fazenda.id
        },
        {
          nome: 'Trator Massey Ferguson',
          prefixo: 'TR-02',
          tipo: 'Trator',
          marca: 'Massey Ferguson',
          modelo: 'MF 7719 Dyna-6',
          ano: '2020',
          horimetro: 4980,
          status: 'Operando',
          operador: 'Antônio Silva',
          ultimaRevisao: '12/07/2025',
          proximaRevisao: '5.200 hrs',
          id_fazenda: fazenda.id
        }
      ]);

      await ProducaoAgricola.bulkCreate([
        {
          nome: 'Talhão 01 - Chapadão Norte',
          cultura: 'Soja',
          variedade: 'TMG 2375 IPRO',
          areaHa: 240,
          dataPlantio: '15/10/2024',
          estagio: 'Enchimento de Grãos (R5.2)',
          previsaoColheita: '18/02/2025',
          produtividadeEstimada: '72 sc/ha',
          status: 'Em Desenvolvimento',
          id_fazenda: fazenda.id
        },
        {
          nome: 'Talhão 02 - Sede Velha',
          cultura: 'Milho',
          variedade: 'Pioneer P3707 VYHR',
          areaHa: 180,
          dataPlantio: '02/11/2024',
          estagio: 'Floração / Pendoamento (VT)',
          previsaoColheita: '25/03/2025',
          produtividadeEstimada: '135 sc/ha',
          status: 'Em Desenvolvimento',
          id_fazenda: fazenda.id
        },
        {
          nome: 'Talhão 03 - Várzea Baixa',
          cultura: 'Soja',
          variedade: 'Brasmax Desafio 8473',
          areaHa: 150,
          dataPlantio: '20/09/2024',
          estagio: 'Maturação Fisiológica (R8)',
          previsaoColheita: '22/01/2025',
          produtividadeEstimada: '68 sc/ha',
          status: 'Pronto para Colheita',
          id_fazenda: fazenda.id
        },
        {
          nome: 'Talhão 04 - Piquete Sul',
          cultura: 'Pastagem',
          variedade: 'Brachiaria Brizantha (Marandu)',
          areaHa: 200,
          dataPlantio: '10/01/2023',
          estagio: 'Pasto Formado / Rotação',
          previsaoColheita: 'Manejo Pecuário',
          produtividadeEstimada: 'Alta Capacidade',
          status: 'Manejo Ativo',
          id_fazenda: fazenda.id
        }
      ]);

      await TransacaoFinanceira.bulkCreate([
        {
          tipo: 'entrada',
          categoria: 'Venda de Gado',
          descricao: 'Comercialização de 20 novilhos Nelore (Lote 04)',
          valor: 82000,
          data: '24/10/2025',
          status: 'Recebido',
          comprovante: 'NFP-e #104',
          id_fazenda: fazenda.id
        },
        {
          tipo: 'saida',
          categoria: 'Ração & Nutrição',
          descricao: 'Compra de 150 sacas de ração farelada para confinamento',
          valor: 14500,
          data: '23/10/2025',
          status: 'Pago',
          comprovante: 'NF #8841',
          id_fazenda: fazenda.id
        },
        {
          tipo: 'entrada',
          categoria: 'Venda de Leite',
          descricao: 'Fornecimento quinzenal de leite para laticínio (12.400L)',
          valor: 34800,
          data: '20/10/2025',
          status: 'Recebido',
          comprovante: 'Recibo #902',
          id_fazenda: fazenda.id
        },
        {
          tipo: 'saida',
          categoria: 'Medicamentos & Vacinas',
          descricao: 'Lote de vacinas contra febre aftosa e vermífugos',
          valor: 6200,
          data: '18/10/2025',
          status: 'Pago',
          comprovante: 'NF #4012',
          id_fazenda: fazenda.id
        },
        {
          tipo: 'saida',
          categoria: 'Combustível & Manutenção',
          descricao: 'Óleo diesel S10 para colheitadeiras e tratores (2.000L)',
          valor: 12800,
          data: '15/10/2025',
          status: 'Pago',
          comprovante: 'NF #5519',
          id_fazenda: fazenda.id
        },
        {
          tipo: 'entrada',
          categoria: 'Venda de Grãos',
          descricao: 'Entrega de safra de milho safrinha (300 sacas)',
          valor: 26000,
          data: '12/10/2025',
          status: 'Recebido',
          comprovante: 'NFP-e #098',
          id_fazenda: fazenda.id
        }
      ]);
    }

    const historicoExistente = await HistoricoAtividade.findOne();
    if (!historicoExistente) {
      await HistoricoAtividade.bulkCreate([
        {
          modulo: 'Financeiro',
          responsavel: 'Rodrigo Alencar Lima',
          acao: 'Lançamento de Venda de Gado',
          detalhes: 'Comercialização de 20 novilhos Nelore (Lote 04) - R$ 82.000,00',
          protocolo: 'WF-FIN-9912',
          tipo_evento: 'criacao',
          data: '24/10/2025 16:42',
          id_fazenda: 1
        },
        {
          modulo: 'Maquinários',
          responsavel: 'Carlos Eduardo',
          acao: 'Atualização de Horímetro',
          detalhes: 'Trator John Deere 8400R (TR-01) alcançou 3.820 horas trabalhadas',
          protocolo: 'WF-MAQ-4820',
          tipo_evento: 'atualizacao',
          data: '24/10/2025 14:15',
          id_fazenda: 1
        },
        {
          modulo: 'Pecuária',
          responsavel: 'Marcos Silva',
          acao: 'Vacinação em Lote',
          detalhes: 'Aplicação de vacina contra febre aftosa em 85 cabeças do Lote 02',
          protocolo: 'WF-PEC-1033',
          tipo_evento: 'auditoria',
          data: '23/10/2025 11:30',
          id_fazenda: 1
        },
        {
          modulo: 'Safra',
          responsavel: 'Rodrigo Alencar Lima',
          acao: 'Registro de Fenologia',
          detalhes: 'Talhão 01 - Chapadão Norte atingiu estágio R5.2 (Enchimento de Grãos)',
          protocolo: 'WF-AGR-0711',
          tipo_evento: 'atualizacao',
          data: '22/10/2025 09:20',
          id_fazenda: 1
        },
        {
          modulo: 'Equipe',
          responsavel: 'Rodrigo Alencar Lima',
          acao: 'Cadastro de Funcionário',
          detalhes: 'Admissão do operador tratorista Marcos Vinícius na fazenda',
          protocolo: 'WF-RH-0245',
          tipo_evento: 'criacao',
          data: '20/10/2025 17:05',
          id_fazenda: 1
        },
        {
          modulo: 'Financeiro',
          responsavel: 'Rodrigo Alencar Lima',
          acao: 'Lançamento de Despesa',
          detalhes: 'Aquisição de ração para confinamento - NF #8841 (R$ 14.500,00)',
          protocolo: 'WF-FIN-9854',
          tipo_evento: 'criacao',
          data: '18/10/2025 15:50',
          id_fazenda: 1
        }
      ]);
    }
  } catch (error) {
    console.error('Erro ao executar seed:', error);
  }
}

module.exports = seedDatabase;
