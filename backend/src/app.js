const express = require("express");
const cors = require("cors");
const {
    Animal,
    Fazenda,
    Fornecedor,
    Funcionario,
    Manutencao,
    Maquinario,
    ProducaoAgricola,
    ProdutorRural,
    Veiculo,
    VacinacaoAnimal,
    TransacaoFinanceira,
    HistoricoAtividade
} = require("./models");

const crypto = require("crypto");
const { Op } = require("sequelize");

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL;
app.use(cors({
    origin: FRONTEND_URL ? [FRONTEND_URL, 'http://localhost:5173'] : '*'
}));
app.use(express.json());

function hashPassword(password) {
    if (!password) return '';
    return crypto.createHash('sha256').update(String(password)).digest('hex');
}

app.post("/auth/register", async (req, res) => {
    try {
        const {
            nome,
            fullName,
            cpf_cnpj,
            document,
            tipo_pessoa,
            personType,
            email,
            cell,
            telefone,
            phone,
            senha,
            password,
            nome_fazenda,
            fazenda,
            farmName
        } = req.body;

        const nomeFinal = (nome || fullName || '').trim();
        const docFinal = (cpf_cnpj || document || '').trim();
        const emailFinal = (email || '').trim().toLowerCase();
        const senhaFinal = senha || password;
        const tipoFinal = tipo_pessoa || personType || 'fisica';
        const cellFinal = cell || telefone || phone || '';
        const fazendaFinal = (nome_fazenda || fazenda || farmName || `Fazenda ${nomeFinal}`).trim();

        if (!nomeFinal || !docFinal || !emailFinal || !senhaFinal) {
            return res.status(400).json({ mensagem: "Nome, documento (CPF/CNPJ), e-mail e senha são obrigatórios." });
        }

        const produtorExistente = await ProdutorRural.findOne({
            where: {
                [Op.or]: [
                    { email: emailFinal },
                    { cpf_cnpj: docFinal }
                ]
            }
        });

        if (produtorExistente) {
            return res.status(409).json({ mensagem: "Já existe um produtor cadastrado com este e-mail ou CPF/CNPJ." });
        }

        const novoProdutor = await ProdutorRural.create({
            nome: nomeFinal,
            cpf_cnpj: docFinal,
            tipo_pessoa: tipoFinal,
            email: emailFinal,
            cell: cellFinal,
            senha: hashPassword(senhaFinal),
            data_cadastro: new Date()
        });

        const novaFazenda = await Fazenda.create({
            nome: fazendaFinal,
            id_produtor: novoProdutor.id,
            data_cadastro: new Date()
        });

        await HistoricoAtividade.create({
            modulo: 'Equipe',
            acao: 'Cadastro de Produtor',
            detalhes: `Novo produtor ${novoProdutor.nome} cadastrado com a propriedade ${novaFazenda.nome}`,
            responsavel: novoProdutor.nome,
            protocolo: `WF-CAD-${Math.floor(1000 + Math.random() * 9000)}`,
            tipo_evento: 'criacao',
            data: new Date().toLocaleString('pt-BR'),
            id_fazenda: novaFazenda.id
        }).catch(() => {});

        res.status(201).json({
            mensagem: "Cadastro realizado com sucesso!",
            usuario: {
                id: novoProdutor.id,
                nome: novoProdutor.nome,
                email: novoProdutor.email,
                cpf_cnpj: novoProdutor.cpf_cnpj,
                perfil: "Administrador",
                fazenda: novaFazenda.nome,
                id_fazenda: novaFazenda.id
            }
        });
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao realizar cadastro do produtor.", erro: erro.message });
    }
});

app.post("/auth/login", async (req, res) => {
    try {
        const { identificador, identifier, email, cpf_cnpj, senha, password } = req.body;
        const termo = String(identificador || identifier || email || cpf_cnpj || '').trim();
        const senhaInformada = senha || password;

        if (!termo || !senhaInformada) {
            return res.status(400).json({ mensagem: "Identificador (e-mail ou CPF/CNPJ) e senha são obrigatórios." });
        }

        const produtor = await ProdutorRural.findOne({
            where: {
                [Op.or]: [
                    { email: termo.toLowerCase() },
                    { cpf_cnpj: termo }
                ]
            }
        });

        if (!produtor) {
            return res.status(401).json({ mensagem: "Credenciais inválidas. Usuário não encontrado." });
        }

        const hashed = hashPassword(senhaInformada);
        const senhaCorreta = !produtor.senha || produtor.senha === senhaInformada || produtor.senha === hashed;

        if (!senhaCorreta) {
            return res.status(401).json({ mensagem: "Senha incorreta. Verifique suas credenciais." });
        }

        if (!produtor.senha) {
            await produtor.update({ senha: hashed });
        }

        const fazenda = await Fazenda.findOne({
            where: { id_produtor: produtor.id }
        });

        res.json({
            mensagem: "Login realizado com sucesso!",
            usuario: {
                id: produtor.id,
                nome: produtor.nome,
                email: produtor.email,
                cpf_cnpj: produtor.cpf_cnpj,
                perfil: "Administrador",
                fazenda: fazenda ? fazenda.nome : "Fazenda Principal",
                id_fazenda: fazenda ? fazenda.id : 1
            }
        });
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao processar autenticação.", erro: erro.message });
    }
});

app.get("/produtores", async (req, res) => {
    try {
        const produtores = await ProdutorRural.findAll();
        res.json(produtores);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao buscar os produtores rurais.", erro: erro.message });
    }
});

app.post("/produtores", async (req, res) => {
    try {
        const novoProdutor = await ProdutorRural.create(req.body);
        res.status(201).json(novoProdutor);
    } catch (erro) {
        res.status(400).json({ mensagem: "Erro ao cadastrar o produtor rural.", erro: erro.message });
    }
});

app.get("/fazendas", async (req, res) => {
    try {
        const fazendas = await Fazenda.findAll();
        res.json(fazendas);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao buscar as fazendas.", erro: erro.message });
    }
});

app.post("/fazendas", async (req, res) => {
    try {
        const novaFazenda = await Fazenda.create(req.body);
        res.status(201).json(novaFazenda);
    } catch (erro) {
        res.status(400).json({ mensagem: "Erro ao cadastrar a fazenda.", erro: erro.message });
    }
});

app.get("/animais", async (req, res) => {
    try {
        const animais = await Animal.findAll({ order: [['id', 'DESC']] });
        res.json(animais);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao buscar os animais.", erro: erro.message });
    }
});

app.post("/animais", async (req, res) => {
    try {
        const payload = {
            ...req.body,
            id_fazenda: req.body.id_fazenda || 1
        };
        const novoAnimal = await Animal.create(payload);
        await HistoricoAtividade.create({
            modulo: 'Pecuária',
            acao: 'Cadastro de Animal',
            detalhes: `Animal brinco ${novoAnimal.codigo_brinco} (${novoAnimal.raca || 'Bovino'}, ${novoAnimal.peso}kg) cadastrado`,
            responsavel: 'Administrador WebFarm',
            protocolo: `WF-PEC-${Math.floor(1000 + Math.random() * 9000)}`,
            tipo_evento: 'criacao',
            data: new Date().toLocaleString('pt-BR'),
            id_fazenda: 1
        }).catch(() => {});
        res.status(201).json(novoAnimal);
    } catch (erro) {
        res.status(400).json({ mensagem: "Erro ao cadastrar o animal.", erro: erro.message });
    }
});

app.put("/animais/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const animal = await Animal.findByPk(id);
        if (!animal) {
            return res.status(404).json({ mensagem: "Animal não encontrado." });
        }
        await animal.update(req.body);
        res.json(animal);
    } catch (erro) {
        res.status(400).json({ mensagem: "Erro ao atualizar o animal.", erro: erro.message });
    }
});

app.delete("/animais/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const animal = await Animal.findByPk(id);
        if (!animal) {
            return res.status(404).json({ mensagem: "Animal não encontrado." });
        }
        const brinco = animal.codigo_brinco;
        await animal.destroy();
        await HistoricoAtividade.create({
            modulo: 'Pecuária',
            acao: 'Remoção de Animal',
            detalhes: `Animal brinco ${brinco} removido do rebanho`,
            responsavel: 'Administrador WebFarm',
            protocolo: `WF-PEC-${Math.floor(1000 + Math.random() * 9000)}`,
            tipo_evento: 'remocao',
            data: new Date().toLocaleString('pt-BR'),
            id_fazenda: 1
        }).catch(() => {});
        res.json({ mensagem: "Animal removido com sucesso!" });
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao remover o animal.", erro: erro.message });
    }
});

app.get("/funcionarios", async (req, res) => {
    try {
        const funcionarios = await Funcionario.findAll({ order: [['id', 'DESC']] });
        res.json(funcionarios);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao buscar os funcionários.", erro: erro.message });
    }
});

app.post("/funcionarios", async (req, res) => {
    try {
        const payload = {
            ...req.body,
            id_fazenda: req.body.id_fazenda || 1
        };
        const novoFuncionario = await Funcionario.create(payload);
        await HistoricoAtividade.create({
            modulo: 'Equipe',
            acao: 'Cadastro de Funcionário',
            detalhes: `${novoFuncionario.nome} (${novoFuncionario.funcao}) integrado à equipe`,
            responsavel: 'Administrador WebFarm',
            protocolo: `WF-RH-${Math.floor(1000 + Math.random() * 9000)}`,
            tipo_evento: 'criacao',
            data: new Date().toLocaleString('pt-BR'),
            id_fazenda: 1
        }).catch(() => {});
        res.status(201).json(novoFuncionario);
    } catch (erro) {
        res.status(400).json({ mensagem: "Erro ao cadastrar o funcionário.", erro: erro.message });
    }
});

app.put("/funcionarios/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const funcionario = await Funcionario.findByPk(id);
        if (!funcionario) {
            return res.status(404).json({ mensagem: "Funcionário não encontrado." });
        }
        await funcionario.update(req.body);
        res.json(funcionario);
    } catch (erro) {
        res.status(400).json({ mensagem: "Erro ao atualizar o funcionário.", erro: erro.message });
    }
});

app.delete("/funcionarios/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const funcionario = await Funcionario.findByPk(id);
        if (!funcionario) {
            return res.status(404).json({ mensagem: "Funcionário não encontrado." });
        }
        const nomeFunc = funcionario.nome;
        await funcionario.destroy();
        await HistoricoAtividade.create({
            modulo: 'Equipe',
            acao: 'Remoção de Funcionário',
            detalhes: `${nomeFunc} removido do quadro de colaboradores`,
            responsavel: 'Administrador WebFarm',
            protocolo: `WF-RH-${Math.floor(1000 + Math.random() * 9000)}`,
            tipo_evento: 'remocao',
            data: new Date().toLocaleString('pt-BR'),
            id_fazenda: 1
        }).catch(() => {});
        res.json({ mensagem: "Funcionário removido com sucesso!" });
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao remover o funcionário.", erro: erro.message });
    }
});

app.get("/maquinarios", async (req, res) => {
    try {
        const maquinarios = await Maquinario.findAll({ order: [['id', 'DESC']] });
        res.json(maquinarios);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao buscar os maquinários.", erro: erro.message });
    }
});

app.post("/maquinarios", async (req, res) => {
    try {
        const payload = {
            ...req.body,
            nome: req.body.nome || `${req.body.marca || ''} ${req.body.modelo || ''}`.trim(),
            id_fazenda: req.body.id_fazenda || 1
        };
        const novoMaquinario = await Maquinario.create(payload);
        await HistoricoAtividade.create({
            modulo: 'Maquinários',
            acao: 'Cadastro de Máquina',
            detalhes: `${payload.tipo} ${payload.marca} ${payload.modelo} (${payload.prefixo}) adicionado`,
            responsavel: 'Administrador WebFarm',
            protocolo: `WF-MAQ-${Math.floor(1000 + Math.random() * 9000)}`,
            tipo_evento: 'criacao',
            data: new Date().toLocaleString('pt-BR'),
            id_fazenda: 1
        }).catch(() => {});
        res.status(201).json(novoMaquinario);
    } catch (erro) {
        res.status(400).json({ mensagem: "Erro ao cadastrar o maquinário.", erro: erro.message });
    }
});

app.put("/maquinarios/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const maquinario = await Maquinario.findByPk(id);
        if (!maquinario) {
            return res.status(404).json({ mensagem: "Maquinário não encontrado." });
        }
        await maquinario.update(req.body);
        res.json(maquinario);
    } catch (erro) {
        res.status(400).json({ mensagem: "Erro ao atualizar o maquinário.", erro: erro.message });
    }
});

app.delete("/maquinarios/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const maquinario = await Maquinario.findByPk(id);
        if (!maquinario) {
            return res.status(404).json({ mensagem: "Maquinário não encontrado." });
        }
        const descMaq = `${maquinario.prefixo} - ${maquinario.modelo}`;
        await maquinario.destroy();
        await HistoricoAtividade.create({
            modulo: 'Maquinários',
            acao: 'Remoção de Máquina',
            detalhes: `Máquina ${descMaq} desmobilizada do inventário`,
            responsavel: 'Administrador WebFarm',
            protocolo: `WF-MAQ-${Math.floor(1000 + Math.random() * 9000)}`,
            tipo_evento: 'remocao',
            data: new Date().toLocaleString('pt-BR'),
            id_fazenda: 1
        }).catch(() => {});
        res.json({ mensagem: "Maquinário removido com sucesso!" });
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao remover o maquinário.", erro: erro.message });
    }
});

app.get("/producoes", async (req, res) => {
    try {
        const producoes = await ProducaoAgricola.findAll({ order: [['id', 'DESC']] });
        res.json(producoes);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao buscar as produções agrícolas.", erro: erro.message });
    }
});

app.post("/producoes", async (req, res) => {
    try {
        const payload = {
            ...req.body,
            id_fazenda: req.body.id_fazenda || 1
        };
        const novaProducao = await ProducaoAgricola.create(payload);
        await HistoricoAtividade.create({
            modulo: 'Safra',
            acao: 'Cadastro de Talhão / Safra',
            detalhes: `${payload.nome}: cultura ${payload.cultura} (${payload.areaHa} ha)`,
            responsavel: 'Administrador WebFarm',
            protocolo: `WF-AGR-${Math.floor(1000 + Math.random() * 9000)}`,
            tipo_evento: 'criacao',
            data: new Date().toLocaleString('pt-BR'),
            id_fazenda: 1
        }).catch(() => {});
        res.status(201).json(novaProducao);
    } catch (erro) {
        res.status(400).json({ mensagem: "Erro ao cadastrar a produção agrícola.", erro: erro.message });
    }
});

app.put("/producoes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const producao = await ProducaoAgricola.findByPk(id);
        if (!producao) {
            return res.status(404).json({ mensagem: "Talhão/produção não encontrado." });
        }
        await producao.update(req.body);
        res.json(producao);
    } catch (erro) {
        res.status(400).json({ mensagem: "Erro ao atualizar a produção agrícola.", erro: erro.message });
    }
});

app.delete("/producoes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const producao = await ProducaoAgricola.findByPk(id);
        if (!producao) {
            return res.status(404).json({ mensagem: "Talhão/produção não encontrado." });
        }
        const nomeTalhao = producao.nome;
        await producao.destroy();
        await HistoricoAtividade.create({
            modulo: 'Safra',
            acao: 'Remoção de Talhão',
            detalhes: `Talhão ${nomeTalhao} removido do planejamento agrícola`,
            responsavel: 'Administrador WebFarm',
            protocolo: `WF-AGR-${Math.floor(1000 + Math.random() * 9000)}`,
            tipo_evento: 'remocao',
            data: new Date().toLocaleString('pt-BR'),
            id_fazenda: 1
        }).catch(() => {});
        res.json({ mensagem: "Talhão/produção removido com sucesso!" });
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao remover a produção agrícola.", erro: erro.message });
    }
});

app.get("/transacoes", async (req, res) => {
    try {
        const transacoes = await TransacaoFinanceira.findAll({ order: [['id', 'DESC']] });
        res.json(transacoes);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao buscar as transações financeiras.", erro: erro.message });
    }
});

app.post("/transacoes", async (req, res) => {
    try {
        const payload = {
            ...req.body,
            id_fazenda: req.body.id_fazenda || 1
        };
        const novaTransacao = await TransacaoFinanceira.create(payload);
        await HistoricoAtividade.create({
            modulo: 'Financeiro',
            acao: payload.tipo === 'entrada' ? 'Lançamento de Receita' : 'Lançamento de Despesa',
            detalhes: `${payload.categoria}: ${payload.descricao} (R$ ${Number(payload.valor || 0).toLocaleString('pt-BR')})`,
            responsavel: 'Administrador WebFarm',
            protocolo: `WF-FIN-${Math.floor(1000 + Math.random() * 9000)}`,
            tipo_evento: 'criacao',
            data: new Date().toLocaleString('pt-BR'),
            id_fazenda: 1
        }).catch(() => {});
        res.status(201).json(novaTransacao);
    } catch (erro) {
        res.status(400).json({ mensagem: "Erro ao cadastrar a transação.", erro: erro.message });
    }
});

app.put("/transacoes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const transacao = await TransacaoFinanceira.findByPk(id);
        if (!transacao) {
            return res.status(404).json({ mensagem: "Transação não encontrada." });
        }
        await transacao.update(req.body);
        res.json(transacao);
    } catch (erro) {
        res.status(400).json({ mensagem: "Erro ao atualizar a transação.", erro: erro.message });
    }
});

app.delete("/transacoes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const transacao = await TransacaoFinanceira.findByPk(id);
        if (!transacao) {
            return res.status(404).json({ mensagem: "Transação não encontrada." });
        }
        const descTrans = `${transacao.categoria} - ${transacao.descricao}`;
        await transacao.destroy();
        await HistoricoAtividade.create({
            modulo: 'Financeiro',
            acao: 'Estorno de Lançamento',
            detalhes: `Transação ${descTrans} estornada`,
            responsavel: 'Administrador WebFarm',
            protocolo: `WF-FIN-${Math.floor(1000 + Math.random() * 9000)}`,
            tipo_evento: 'remocao',
            data: new Date().toLocaleString('pt-BR'),
            id_fazenda: 1
        }).catch(() => {});
        res.json({ mensagem: "Transação removida com sucesso!" });
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao remover a transação.", erro: erro.message });
    }
});

app.get("/dashboard/metricas", async (req, res) => {
    try {
        const totalAnimais = await Animal.count();
        const totalMaquinas = await Maquinario.count();
        const totalFuncionarios = await Funcionario.count();
        const totalProducoes = await ProducaoAgricola.count();
        
        const transacoes = await TransacaoFinanceira.findAll();
        const totalEntradas = transacoes
            .filter((t) => t.tipo === 'entrada')
            .reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
        const totalSaidas = transacoes
            .filter((t) => t.tipo === 'saida')
            .reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
        const saldoLiquido = totalEntradas - totalSaidas;

        res.json({
            animais: totalAnimais,
            maquinas: totalMaquinas,
            funcionarios: totalFuncionarios,
            talhoes: totalProducoes,
            financeiro: {
                totalEntradas,
                totalSaidas,
                saldoLiquido
            }
        });
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao calcular métricas do dashboard.", erro: erro.message });
    }
});

app.get("/historico", async (req, res) => {
    try {
        const { modulo, termo, limite } = req.query;
        const options = {
            order: [['id', 'DESC']]
        };
        if (limite) {
            options.limit = parseInt(limite, 10);
        }
        const logs = await HistoricoAtividade.findAll(options);
        let resultado = logs;
        if (modulo && modulo !== 'todos') {
            resultado = resultado.filter((l) => l.modulo.toLowerCase() === modulo.toLowerCase());
        }
        if (termo) {
            const t = termo.toLowerCase();
            resultado = resultado.filter((l) =>
                (l.acao && l.acao.toLowerCase().includes(t)) ||
                (l.detalhes && l.detalhes.toLowerCase().includes(t)) ||
                (l.responsavel && l.responsavel.toLowerCase().includes(t)) ||
                (l.protocolo && l.protocolo.toLowerCase().includes(t))
            );
        }
        res.json(resultado);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao buscar histórico de atividades.", erro: erro.message });
    }
});

app.post("/historico", async (req, res) => {
    try {
        const { modulo, acao, detalhes, responsavel, tipo_evento, data } = req.body;
        if (!modulo || !acao || !detalhes) {
            return res.status(400).json({ mensagem: "Módulo, ação e detalhes são obrigatórios." });
        }
        const protocolo = req.body.protocolo || `WF-${modulo.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const novoLog = await HistoricoAtividade.create({
            modulo,
            acao,
            detalhes,
            responsavel: responsavel || 'Administrador WebFarm',
            protocolo,
            tipo_evento: tipo_evento || 'geral',
            data: data || new Date().toLocaleString('pt-BR'),
            id_fazenda: 1
        });
        res.status(201).json(novoLog);
    } catch (erro) {
        res.status(400).json({ mensagem: "Erro ao registrar evento no histórico.", erro: erro.message });
    }
});

app.delete("/historico/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const log = await HistoricoAtividade.findByPk(id);
        if (!log) {
            return res.status(404).json({ mensagem: "Registro de histórico não encontrado." });
        }
        await log.destroy();
        res.json({ mensagem: "Registro removido com sucesso!" });
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao remover registro de histórico.", erro: erro.message });
    }
});

module.exports = app;
