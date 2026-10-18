const swaggerUi = require('swagger-ui-express');

const swaggerDocs = {
  openapi: '3.0.0',
  info: {
    title: 'WebFarm 2.0 API - Gestão Agropecuária e Serviços',
    version: '2.4.0',
    description: 'Documentação OpenAPI / Swagger completa de todos os módulos e endpoints RESTful da plataforma WebFarm 2.0 Enterprise.',
    contact: {
      name: 'Suporte Técnico WebFarm',
      email: 'suporte@webfarm.com.br',
      url: 'https://webfarm.com.br'
    },
    license: {
      name: 'Proprietária - WebFarm Software Agrícola Ltda',
      url: 'https://webfarm.com.br/termos'
    }
  },
  servers: [
    {
      url: 'https://webfarm-backend-x47z.onrender.com',
      description: 'Servidor de Produção (Render)'
    },
    {
      url: 'http://localhost:3000',
      description: 'Servidor de Desenvolvimento Local'
    }
  ],
  tags: [
    { name: 'Autenticação', description: 'Registro e login de produtores rurais' },
    { name: 'Dashboard', description: 'Métricas consolidadas operacionais e financeiras' },
    { name: 'Pecuária', description: 'Controle de rebanho, brinco e dados zootécnicos' },
    { name: 'Maquinários', description: 'Gestão de tratores, horímetro e frota agrícola' },
    { name: 'Produção Agrícola', description: 'Mapeamento de safras, talhões e produtividade' },
    { name: 'Financeiro', description: 'Receitas, despesas operacionais e fluxo de caixa' },
    { name: 'Funcionários', description: 'Equipe de campo, cargos e remunerações' },
    { name: 'Fazendas', description: 'Propriedades rurais, localização, CAR e área' },
    { name: 'Produtores', description: 'Cadastro e dados de contato do produtor' },
    { name: 'Histórico', description: 'Trilhas de auditoria e registro de atividades' },
    { name: 'Fornecedores', description: 'Insumos, peças, sementes e nutrição animal' },
    { name: 'Veículos', description: 'Frota utilitária e veículos de apoio' },
    { name: 'Manutenções', description: 'Preventivas, corretivas e trocas de óleo' },
    { name: 'Vacinações', description: 'Calendário sanitário e controle de doses do rebanho' }
  ],
  paths: {
    '/auth/register': {
      post: {
        tags: ['Autenticação'],
        summary: 'Registrar novo produtor rural e fazenda',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nome', 'cpf_cnpj', 'email', 'senha'],
                properties: {
                  nome: { type: 'string', example: 'Lucas Ramos Silva' },
                  cpf_cnpj: { type: 'string', example: '111.111.111-11' },
                  tipo_pessoa: { type: 'string', enum: ['fisica', 'juridica'], example: 'fisica' },
                  email: { type: 'string', example: 'lucasramossme@gmail.com' },
                  senha: { type: 'string', example: '123456' },
                  cell: { type: 'string', example: '(11) 11111-1111' },
                  nome_fazenda: { type: 'string', example: 'São Carlos de Agosto' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Produtor e fazenda cadastrados com sucesso' },
          400: { description: 'Dados inválidos ou duplicados' }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Autenticação'],
        summary: 'Autenticar produtor rural por E-mail ou CPF/CNPJ',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['identificador', 'senha'],
                properties: {
                  identificador: { type: 'string', example: 'lucasramossme@gmail.com' },
                  senha: { type: 'string', example: '123456' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Autenticação realizada com sucesso' },
          401: { description: 'Credenciais incorretas' }
        }
      }
    },
    '/dashboard/metricas': {
      get: {
        tags: ['Dashboard'],
        summary: 'Obter indicadores consolidados da fazenda em tempo real',
        responses: {
          200: {
            description: 'Métricas agregadas de rebanho, frota, safra e financeiro',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    animais: { type: 'object', properties: { total: { type: 'integer' } } },
                    maquinas: { type: 'object', properties: { total: { type: 'integer' } } },
                    funcionarios: { type: 'object', properties: { total: { type: 'integer' } } },
                    safras: { type: 'object', properties: { talhoesAtivos: { type: 'integer' } } },
                    financeiro: {
                      type: 'object',
                      properties: {
                        receitas: { type: 'number' },
                        despesas: { type: 'number' },
                        saldoLiquido: { type: 'number' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/animais': {
      get: {
        tags: ['Pecuária'],
        summary: 'Listar todos os animais cadastrados',
        responses: {
          200: { description: 'Lista de animais retornada com sucesso' }
        }
      },
      post: {
        tags: ['Pecuária'],
        summary: 'Cadastrar novo animal no rebanho',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['codigo_brinco', 'raca', 'sexo', 'peso'],
                properties: {
                  codigo_brinco: { type: 'string', example: 'BR-409' },
                  especie: { type: 'string', example: 'Bovino' },
                  raca: { type: 'string', example: 'Nelore' },
                  sexo: { type: 'string', enum: ['Macho', 'Fêmea'], example: 'Macho' },
                  peso: { type: 'number', example: 480 },
                  status: { type: 'string', example: 'Saudável' },
                  origem: { type: 'string', example: 'Nascido na Fazenda' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Animal cadastrado com sucesso' }
        }
      }
    },
    '/animais/{id}': {
      get: {
        tags: ['Pecuária'],
        summary: 'Buscar animal por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Animal encontrado' },
          404: { description: 'Animal não encontrado' }
        }
      },
      put: {
        tags: ['Pecuária'],
        summary: 'Atualizar dados zootécnicos do animal',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  peso: { type: 'number', example: 510 },
                  status: { type: 'string', example: 'Em Engorda' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Animal atualizado com sucesso' },
          404: { description: 'Animal não encontrado' }
        }
      },
      delete: {
        tags: ['Pecuária'],
        summary: 'Excluir animal do rebanho',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Animal excluído com sucesso' },
          404: { description: 'Animal não encontrado' }
        }
      }
    },
    '/maquinarios': {
      get: {
        tags: ['Maquinários'],
        summary: 'Listar equipamentos, tratores e implementos',
        responses: { 200: { description: 'Lista de maquinários retornada' } }
      },
      post: {
        tags: ['Maquinários'],
        summary: 'Cadastrar nova máquina ou trator',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nome', 'tipo'],
                properties: {
                  nome: { type: 'string', example: 'Trator John Deere 6190M' },
                  prefixo: { type: 'string', example: 'TR-02' },
                  tipo: { type: 'string', example: 'Trator de Pneu' },
                  marca: { type: 'string', example: 'John Deere' },
                  modelo: { type: 'string', example: '6190M' },
                  ano: { type: 'string', example: '2024' },
                  horimetro: { type: 'number', example: 120 },
                  status: { type: 'string', example: 'Operando' },
                  operador: { type: 'string', example: 'Carlos Mendes' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Máquina cadastrada com sucesso' } }
      }
    },
    '/maquinarios/{id}': {
      get: {
        tags: ['Maquinários'],
        summary: 'Buscar maquinário por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Máquina encontrada' }, 404: { description: 'Não encontrada' } }
      },
      put: {
        tags: ['Maquinários'],
        summary: 'Atualizar dados de maquinário',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Máquina atualizada' } }
      },
      delete: {
        tags: ['Maquinários'],
        summary: 'Excluir maquinário',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Máquina removida' } }
      }
    },
    '/producoes': {
      get: {
        tags: ['Produção Agrícola'],
        summary: 'Listar talhões e safras ativas',
        responses: { 200: { description: 'Lista de produções retornada' } }
      },
      post: {
        tags: ['Produção Agrícola'],
        summary: 'Cadastrar novo talhão de safra',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nome_talhao', 'cultura', 'area_hectares'],
                properties: {
                  nome_talhao: { type: 'string', example: 'Talhão 04 - Sede' },
                  cultura: { type: 'string', example: 'Soja' },
                  variedade: { type: 'string', example: 'TMG 7062 IPRO' },
                  area_hectares: { type: 'number', example: 140 },
                  safra: { type: 'string', example: '2025/2026' },
                  status: { type: 'string', example: 'Desenvolvimento Vegetativo' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Talhão cadastrado com sucesso' } }
      }
    },
    '/producoes/{id}': {
      get: {
        tags: ['Produção Agrícola'],
        summary: 'Buscar talhão agrícola por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Talhão encontrado' } }
      },
      put: {
        tags: ['Produção Agrícola'],
        summary: 'Atualizar dados do talhão agrícola',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Talhão atualizado' } }
      },
      delete: {
        tags: ['Produção Agrícola'],
        summary: 'Excluir talhão agrícola',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Talhão excluído' } }
      }
    },
    '/transacoes': {
      get: {
        tags: ['Financeiro'],
        summary: 'Listar transações financeiras (receitas e despesas)',
        parameters: [
          { name: 'tipo', in: 'query', schema: { type: 'string', enum: ['entrada', 'saida'] } }
        ],
        responses: { 200: { description: 'Transações listadas com sucesso' } }
      },
      post: {
        tags: ['Financeiro'],
        summary: 'Cadastrar nova transação financeira',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['tipo', 'valor', 'descricao', 'categoria', 'data'],
                properties: {
                  tipo: { type: 'string', enum: ['entrada', 'saida'], example: 'entrada' },
                  valor: { type: 'number', example: 45000 },
                  descricao: { type: 'string', example: 'Venda de 18 cabeças de garrotes Nelore' },
                  categoria: { type: 'string', example: 'Venda de Animais' },
                  data: { type: 'string', format: 'date', example: '2026-10-18' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Transação registrada com sucesso' } }
      }
    },
    '/transacoes/{id}': {
      get: {
        tags: ['Financeiro'],
        summary: 'Buscar transação por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Transação encontrada' } }
      },
      put: {
        tags: ['Financeiro'],
        summary: 'Atualizar transação financeira',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Transação atualizada' } }
      },
      delete: {
        tags: ['Financeiro'],
        summary: 'Excluir transação financeira',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Transação excluída' } }
      }
    },
    '/funcionarios': {
      get: {
        tags: ['Funcionários'],
        summary: 'Listar colaboradores da fazenda',
        responses: { 200: { description: 'Lista de funcionários' } }
      },
      post: {
        tags: ['Funcionários'],
        summary: 'Cadastrar colaborador na equipe',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nome', 'cargo'],
                properties: {
                  nome: { type: 'string', example: 'Marcos Vinicius' },
                  cargo: { type: 'string', example: 'Operador de Pulverizador' },
                  salario: { type: 'number', example: 3800 },
                  telefone: { type: 'string', example: '(66) 99824-7100' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Funcionário cadastrado' } }
      }
    },
    '/funcionarios/{id}': {
      get: {
        tags: ['Funcionários'],
        summary: 'Buscar funcionário por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Funcionário encontrado' } }
      },
      put: {
        tags: ['Funcionários'],
        summary: 'Atualizar dados de funcionário',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Funcionário atualizado' } }
      },
      delete: {
        tags: ['Funcionários'],
        summary: 'Excluir funcionário',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Funcionário excluído' } }
      }
    },
    '/fazendas': {
      get: {
        tags: ['Fazendas'],
        summary: 'Listar propriedades rurais cadastradas',
        responses: { 200: { description: 'Lista de fazendas retornada' } }
      },
      post: {
        tags: ['Fazendas'],
        summary: 'Cadastrar nova fazenda ou retiro',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nome'],
                properties: {
                  nome: { type: 'string', example: 'Fazenda Rio Bonito' },
                  endereco: { type: 'string', example: 'Rodovia MT-242, Km 45' },
                  area_hectares: { type: 'number', example: 850 },
                  tipo_producao: { type: 'string', example: 'Lavoura de Soja e Milho' },
                  id_produtor: { type: 'integer', example: 1 }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Fazenda cadastrada com sucesso' } }
      }
    },
    '/fazendas/{id}': {
      get: {
        tags: ['Fazendas'],
        summary: 'Buscar fazenda por ID com associações completas',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Dados da fazenda com animais e máquinas' } }
      },
      put: {
        tags: ['Fazendas'],
        summary: 'Atualizar dados cadastrais da fazenda',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Fazenda atualizada com sucesso' } }
      },
      delete: {
        tags: ['Fazendas'],
        summary: 'Excluir fazenda',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Fazenda removida' } }
      }
    },
    '/produtores': {
      get: {
        tags: ['Produtores'],
        summary: 'Listar todos os produtores rurais cadastrados',
        responses: { 200: { description: 'Lista de produtores retornada com sucesso' } }
      },
      post: {
        tags: ['Produtores'],
        summary: 'Cadastrar novo produtor rural',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nome', 'cpf_cnpj'],
                properties: {
                  nome: { type: 'string', example: 'Lucas Ramos Silva' },
                  cpf_cnpj: { type: 'string', example: '111.111.111-11' },
                  tipo_pessoa: { type: 'string', enum: ['fisica', 'juridica'], example: 'fisica' },
                  email: { type: 'string', example: 'lucasramossme@gmail.com' },
                  senha: { type: 'string', example: '123456' },
                  cell: { type: 'string', example: '(11) 11111-1111' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Produtor rural cadastrado com sucesso' } }
      }
    },
    '/produtores/{id}': {
      get: {
        tags: ['Produtores'],
        summary: 'Buscar produtor rural por ID com fazendas associadas',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Produtor rural encontrado' },
          404: { description: 'Produtor não encontrado' }
        }
      },
      put: {
        tags: ['Produtores'],
        summary: 'Atualizar dados cadastrais do produtor rural',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nome: { type: 'string', example: 'Lucas Ramos Silva' },
                  cell: { type: 'string', example: '(11) 99999-9999' },
                  email: { type: 'string', example: 'lucas@webfarm.com' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Produtor rural atualizado com sucesso' },
          404: { description: 'Produtor não encontrado' }
        }
      },
      delete: {
        tags: ['Produtores'],
        summary: 'Excluir cadastro do produtor rural',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Produtor rural excluído com sucesso' },
          404: { description: 'Produtor não encontrado' }
        }
      }
    },
    '/historico': {
      get: {
        tags: ['Histórico'],
        summary: 'Listar registros de auditoria e atividades da fazenda',
        parameters: [
          { name: 'modulo', in: 'query', schema: { type: 'string' } },
          { name: 'busca', in: 'query', schema: { type: 'string' } },
          { name: 'limite', in: 'query', schema: { type: 'integer' } }
        ],
        responses: { 200: { description: 'Histórico retornado' } }
      },
      post: {
        tags: ['Histórico'],
        summary: 'Registrar nova atividade no histórico',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['modulo', 'acao'],
                properties: {
                  modulo: { type: 'string', example: 'Pecuária' },
                  acao: { type: 'string', example: 'Pesagem de Lote 01' },
                  detalhes: { type: 'string', example: 'Peso médio atingido: 450kg' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Atividade registrada com sucesso' } }
      }
    },
    '/fornecedores': {
      get: {
        tags: ['Fornecedores'],
        summary: 'Listar fornecedores de insumos e peças',
        responses: { 200: { description: 'Lista de fornecedores' } }
      },
      post: {
        tags: ['Fornecedores'],
        summary: 'Cadastrar novo fornecedor',
        responses: { 201: { description: 'Fornecedor cadastrado' } }
      }
    },
    '/veiculos': {
      get: {
        tags: ['Veículos'],
        summary: 'Listar veículos utilitários e caminhonetes da fazenda',
        responses: { 200: { description: 'Lista de veículos' } }
      },
      post: {
        tags: ['Veículos'],
        summary: 'Cadastrar veículo utilitário',
        responses: { 201: { description: 'Veículo cadastrado' } }
      }
    },
    '/manutencoes': {
      get: {
        tags: ['Manutenções'],
        summary: 'Listar manutenções de veículos e maquinários',
        responses: { 200: { description: 'Lista de manutenções' } }
      },
      post: {
        tags: ['Manutenções'],
        summary: 'Registrar manutenção ou revisão',
        responses: { 201: { description: 'Manutenção registrada' } }
      }
    },
    '/vacinacoes': {
      get: {
        tags: ['Vacinações'],
        summary: 'Listar vacinações aplicadas no rebanho',
        responses: { 200: { description: 'Lista de vacinações' } }
      },
      post: {
        tags: ['Vacinações'],
        summary: 'Registrar vacinação zootécnica de animal',
        responses: { 201: { description: 'Vacinação registrada' } }
      }
    }
  }
};

module.exports = {
  swaggerUi,
  swaggerDocs
};
