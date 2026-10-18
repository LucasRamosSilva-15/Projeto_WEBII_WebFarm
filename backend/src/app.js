const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const { Op } = require("sequelize");
const sequelize = require("./config/database");
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

function handleSequelizeError(erro, res, defaultMsg) {
    if (erro.name === 'SequelizeUniqueConstraintError') {
        const campo = erro.errors?.[0]?.path || 'valor';
        return res.status(409).json({ mensagem: `Já existe um registro com este ${campo}.`, erro: erro.message });
    }
    if (erro.name === 'SequelizeValidationError') {
        const mensagens = erro.errors?.map(e => e.message) || [erro.message];
        return res.status(400).json({ mensagem: mensagens.join(', '), erro: erro.message });
    }
    res.status(500).json({ mensagem: defaultMsg, erro: erro.message });
}

async function getActiveFazendaId(providedId) {
    if (providedId) return Number(providedId);
    const fazenda = await Fazenda.findOne({ order: [['id', 'DESC']] });
    return fazenda ? fazenda.id : null;
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

        const resultado = await sequelize.transaction(async (t) => {
            const novoProdutor = await ProdutorRural.create({
                nome: nomeFinal,
                cpf_cnpj: docFinal,
                tipo_pessoa: tipoFinal,
                email: emailFinal,
                cell: cellFinal,
                senha: hashPassword(senhaFinal),
                data_cadastro: new Date()
            }, { transaction: t });

            const novaFazenda = await Fazenda.create({
                nome: fazendaFinal,
                id_produtor: novoProdutor.id,
                data_cadastro: new Date()
            }, { transaction: t });

            await HistoricoAtividade.create({
                modulo: 'Equipe',
                acao: 'Cadastro de Produtor',
                detalhes: `Novo produtor ${novoProdutor.nome} cadastrado com a propriedade ${novaFazenda.nome}`,
                responsavel: novoProdutor.nome,
                protocolo: `WF-CAD-${Math.floor(1000 + Math.random() * 9000)}`,
                tipo_evento: 'criacao',
                data: new Date().toLocaleString('pt-BR'),
                id_fazenda: novaFazenda.id
            }, { transaction: t });

            return {
                novoProdutor,
                novaFazenda
            };
        });

        res.status(201).json({
            mensagem: "Cadastro realizado com sucesso!",
            usuario: {
                id: resultado.novoProdutor.id,
                nome: resultado.novoProdutor.nome,
                email: resultado.novoProdutor.email,
                cpf_cnpj: resultado.novoProdutor.cpf_cnpj,
                perfil: "Administrador",
                fazenda: resultado.novaFazenda.nome,
                id_fazenda: resultado.novaFazenda.id
            }
        });
    } catch (erro) {
        handleSequelizeError(erro, res, "Erro ao realizar cadastro do produtor.");
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
            },
            include: [{ model: Fazenda }]
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

        const fazenda = (produtor.Fazendas && produtor.Fazendas[0])
            ? produtor.Fazendas[0]
            : await Fazenda.findOne({ where: { id_produtor: produtor.id } });

        res.json({
            mensagem: "Login realizado com sucesso!",
            usuario: {
                id: produtor.id,
                nome: produtor.nome,
                email: produtor.email,
                cpf_cnpj: produtor.cpf_cnpj,
                perfil: "Administrador",
                fazenda: fazenda ? fazenda.nome : "Minha Propriedade",
                id_fazenda: fazenda ? fazenda.id : 1
            }
        });
    } catch (erro) {
        handleSequelizeError(erro, res, "Erro ao processar autenticação.");
    }
});

app.get("/produtores", async (req, res) => {
    try {
        const produtores = await ProdutorRural.findAll({
            include: [{ model: Fazenda }],
            order: [['id', 'DESC']]
        });
        res.json(produtores);
    } catch (erro) {
        handleSequelizeError(erro, res, "Erro ao buscar os produtores rurais.");
    }
});

app.post("/produtores", async (req, res) => {
    try {
        const novoProdutor = await ProdutorRural.create(req.body);
        res.status(201).json(novoProdutor);
    } catch (erro) {
        handleSequelizeError(erro, res, "Erro ao cadastrar o produtor rural.");
    }
});

app.get("/fazendas", async (req, res) => {
    try {
        const fazendas = await Fazenda.findAll({
            include: [{ model: ProdutorRural }],
            order: [['id', 'DESC']]
        });
        res.json(fazendas);
    } catch (erro) {
        handleSequelizeError(erro, res, "Erro ao buscar as fazendas.");
    }
});

app.post("/fazendas", async (req, res) => {
    try {
        const novaFazenda = await Fazenda.create(req.body);
        res.status(201).json(novaFazenda);
    } catch (erro) {
        handleSequelizeError(erro, res, "Erro ao cadastrar a fazenda.");
    }
});

app.get("/animais", async (req, res) => {
    try {
        const { status, especie, busca } = req.query;
        const where = {};
        if (status && status !== 'todos') {
            where.status = status;
        }
        if (especie && especie !== 'todas') {
            where.especie = especie;
        }
        if (busca) {
            where[Op.or] = [
                { codigo_brinco: { [Op.like]: `%${busca}%` } },
                { raca: { [Op.like]: `%${busca}%` } },
                { origem: { [Op.like]: `%${busca}%` } }
            ];
        }
        const animais = await Animal.findAll({
            where,
            include: [{ model: Fazenda, attributes: ['id', 'nome'] }],
            order: [['id', 'DESC']]
        });
        res.json(animais);
    } catch (erro) {
        handleSequelizeError(erro, res, "Erro ao buscar os animais.");
    }
});

app.post("/animais", async (req, res) => {
    try {
        const farmId = await getActiveFazendaId(req.body.id_fazenda);
        const payload = {
            ...req.body,
            id_fazenda: farmId
        };

        const novoAnimal = await sequelize.transaction(async (t) => {
            const animal = await Animal.create(payload, { transaction: t });
            await HistoricoAtividade.create({
                modulo: 'Pecuária',
                acao: 'Cadastro de Animal',
                detalhes: `Animal brinco ${animal.codigo_brinco} (${animal.raca || 'Bovino'}, ${animal.peso}kg) cadastrado`,
                responsavel: req.body.responsavel || 'Administrador WebFarm',
                protocolo: `WF-PEC-${Math.floor(1000 + Math.random() * 9000)}`,
                tipo_evento: 'criacao',
                data: new Date().toLocaleString('pt-BR'),
                id_fazenda: farmId
            }, { transaction: t });
            return animal;
        });

        res.status(201).json(novoAnimal);
    } catch (erro) {
        handleSequelizeError(erro, res, "Erro ao cadastrar o animal.");
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
        handleSequelizeError(erro, res, "Erro ao atualizar o animal.");
    }
});

app.delete("/animais/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const animal = await Animal.findByPk(id);
        if (!animal) {
            return res.status(404).json({ mensagem: "Animal não encontrado." });
        }
        const farmId = animal.id_fazenda || await getActiveFazendaId();
        const brinco = animal.codigo_brinco;

        await sequelize.transaction(async (t) => {
            await animal.destroy({ transaction: t });
            await HistoricoAtividade.create({
                modulo: 'Pecuária',
                acao: 'Remoção de Animal',
                detalhes: `Animal brinco ${brinco} removido do rebanho`,
                responsavel: 'Administrador WebFarm',
                protocolo: `WF-PEC-${Math.floor(1000 + Math.random() * 9000)}`,
                tipo_evento: 'remocao',
                data: new Date().toLocaleString('pt-BR'),
                id_fazenda: farmId
            }, { transaction: t });
        });

        res.json({ mensagem: "Animal removido com sucesso!" });
    } catch (erro) {
        handleSequelizeError(erro, res, "Erro ao remover o animal.");
    }
});

app.get("/funcionarios", async (req, res) => {
    try {
        const { funcao, status, busca } = req.query;
        const where = {};
        if (funcao && funcao !== 'todas') {
            where.funcao = funcao;
        }
        if (status && status !== 'todos') {
            where.status = status;
        }
        if (busca) {
            where[Op.or] = [
                { nome: { [Op.like]: `%${busca}%` } },
                { cpf: { [Op.like]: `%${busca}%` } },
                { email: { [Op.like]: `%${busca}%` } }
            ];
        }
        const funcionarios = await Funcionario.findAll({
            where,
            include: [{ model: Fazenda, attributes: ['id', 'nome'] }],
            order: [['id', 'DESC']]
        });
        res.json(funcionarios);
    } catch (erro) {
        handleSequelizeError(erro, res, "Erro ao buscar os funcionários.");
    }
});

app.post("/funcionarios", async (req, res) => {
    try {
        const farmId = await getActiveFazendaId(req.body.id_fazenda);
        const payload = {
            ...req.body,
            id_fazenda: farmId
        };

        const novoFuncionario = await sequelize.transaction(async (t) => {
            const funcionario = await Funcionario.create(payload, { transaction: t });
            await HistoricoAtividade.create({
                modulo: 'Equipe',
                acao: 'Cadastro de Funcionário',
                detalhes: `${funcionario.nome} (${funcionario.funcao}) integrado à equipe`,
                responsavel: req.body.responsavel || 'Administrador WebFarm',
                protocolo: `WF-RH-${Math.floor(1000 + Math.random() * 9000)}`,
                tipo_evento: 'criacao',
                data: new Date().toLocaleString('pt-BR'),
                id_fazenda: farmId
            }, { transaction: t });
            return funcionario;
        });

        res.status(201).json(novoFuncionario);
    } catch (erro) {
        handleSequelizeError(erro, res, "Erro ao cadastrar o funcionário.");
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
        handleSequelizeError(erro, res, "Erro ao atualizar o funcionário.");
    }
});

app.delete("/funcionarios/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const funcionario = await Funcionario.findByPk(id);
        if (!funcionario) {
            return res.status(404).json({ mensagem: "Funcionário não encontrado." });
        }
        const farmId = funcionario.id_fazenda || await getActiveFazendaId();
        const nomeFunc = funcionario.nome;

        await sequelize.transaction(async (t) => {
            await funcionario.destroy({ transaction: t });
            await HistoricoAtividade.create({
                modulo: 'Equipe',
                acao: 'Remoção de Funcionário',
                detalhes: `${nomeFunc} removido do quadro de colaboradores`,
                responsavel: 'Administrador WebFarm',
                protocolo: `WF-RH-${Math.floor(1000 + Math.random() * 9000)}`,
                tipo_evento: 'remocao',
                data: new Date().toLocaleString('pt-BR'),
                id_fazenda: farmId
            }, { transaction: t });
        });

        res.json({ mensagem: "Funcionário removido com sucesso!" });
    } catch (erro) {
        handleSequelizeError(erro, res, "Erro ao remover o funcionário.");
    }
});

app.get("/maquinarios", async (req, res) => {
    try {
        const { status, tipo, busca } = req.query;
        const where = {};
        if (status && status !== 'todos') {
            where.status = status;
        }
        if (tipo && tipo !== 'todos') {
            where.tipo = tipo;
        }
        if (busca) {
            where[Op.or] = [
                { prefixo: { [Op.like]: `%${busca}%` } },
                { marca: { [Op.like]: `%${busca}%` } },
                { modelo: { [Op.like]: `%${busca}%` } },
                { operador: { [Op.like]: `%${busca}%` } }
            ];
        }
        const maquinarios = await Maquinario.findAll({
            where,
            include: [{ model: Fazenda, attributes: ['id', 'nome'] }],
            order: [['id', 'DESC']]
        });
        res.json(maquinarios);
    } catch (erro) {
        handleSequelizeError(erro, res, "Erro ao buscar os maquinários.");
    }
});

app.post("/maquinarios", async (req, res) => {
    try {
        const farmId = await getActiveFazendaId(req.body.id_fazenda);
        const payload = {
            ...req.body,
            nome: req.body.nome || `${req.body.marca || ''} ${req.body.modelo || ''}`.trim(),
            id_fazenda: farmId
        };

        const novoMaquinario = await sequelize.transaction(async (t) => {
            const maq = await Maquinario.create(payload, { transaction: t });
            await HistoricoAtividade.create({
                modulo: 'Maquinários',
                acao: 'Cadastro de Máquina',
                detalhes: `${payload.tipo} ${payload.marca} ${payload.modelo} (${payload.prefixo}) adicionado`,
                responsavel: req.body.responsavel || 'Administrador WebFarm',
                protocolo: `WF-MAQ-${Math.floor(1000 + Math.random() * 9000)}`,
                tipo_evento: 'criacao',
                data: new Date().toLocaleString('pt-BR'),
                id_fazenda: farmId
            }, { transaction: t });
            return maq;
        });

        res.status(201).json(novoMaquinario);
    } catch (erro) {
        handleSequelizeError(erro, res, "Erro ao cadastrar o maquinário.");
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
        handleSequelizeError(erro, res, "Erro ao atualizar o maquinário.");
    }
});

app.delete("/maquinarios/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const maquinario = await Maquinario.findByPk(id);
        if (!maquinario) {
            return res.status(404).json({ mensagem: "Maquinário não encontrado." });
        }
        const farmId = maquinario.id_fazenda || await getActiveFazendaId();
        const descMaq = `${maquinario.prefixo} - ${maquinario.modelo}`;

        await sequelize.transaction(async (t) => {
            await maquinario.destroy({ transaction: t });
            await HistoricoAtividade.create({
                modulo: 'Maquinários',
                acao: 'Remoção de Máquina',
                detalhes: `Máquina ${descMaq} desmobilizada do inventário`,
                responsavel: 'Administrador WebFarm',
                protocolo: `WF-MAQ-${Math.floor(1000 + Math.random() * 9000)}`,
                tipo_evento: 'remocao',
                data: new Date().toLocaleString('pt-BR'),
                id_fazenda: farmId
            }, { transaction: t });
        });

        res.json({ mensagem: "Maquinário removido com sucesso!" });
    } catch (erro) {
        handleSequelizeError(erro, res, "Erro ao remover o maquinário.");
    }
});

app.get("/producoes", async (req, res) => {
    try {
        const { status, cultura, busca } = req.query;
        const where = {};
        if (status && status !== 'todas') {
            where.status = status;
        }
        if (cultura && cultura !== 'todas') {
            where.cultura = cultura;
        }
        if (busca) {
            where[Op.or] = [
                { nome: { [Op.like]: `%${busca}%` } },
                { cultura: { [Op.like]: `%${busca}%` } },
                { variedade: { [Op.like]: `%${busca}%` } }
            ];
        }
        const producoes = await ProducaoAgricola.findAll({
            where,
            include: [{ model: Fazenda, attributes: ['id', 'nome'] }],
            order: [['id', 'DESC']]
        });
        res.json(producoes);
    } catch (erro) {
        handleSequelizeError(erro, res, "Erro ao buscar as produções agrícolas.");
    }
});

app.post("/producoes", async (req, res) => {
    try {
        const farmId = await getActiveFazendaId(req.body.id_fazenda);
        const payload = {
            ...req.body,
            id_fazenda: farmId
        };

        const novaProducao = await sequelize.transaction(async (t) => {
            const producao = await ProducaoAgricola.create(payload, { transaction: t });
            await HistoricoAtividade.create({
                modulo: 'Safra',
                acao: 'Cadastro de Talhão / Safra',
                detalhes: `${payload.nome}: cultura ${payload.cultura} (${payload.areaHa} ha)`,
                responsavel: req.body.responsavel || 'Administrador WebFarm',
                protocolo: `WF-AGR-${Math.floor(1000 + Math.random() * 9000)}`,
                tipo_evento: 'criacao',
                data: new Date().toLocaleString('pt-BR'),
                id_fazenda: farmId
            }, { transaction: t });
            return producao;
        });

        res.status(201).json(novaProducao);
    } catch (erro) {
        handleSequelizeError(erro, res, "Erro ao cadastrar a produção agrícola.");
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
        handleSequelizeError(erro, res, "Erro ao atualizar a produção agrícola.");
    }
});

app.delete("/producoes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const producao = await ProducaoAgricola.findByPk(id);
        if (!producao) {
            return res.status(404).json({ mensagem: "Talhão/produção não encontrado." });
        }
        const farmId = producao.id_fazenda || await getActiveFazendaId();
        const nomeTalhao = producao.nome;

        await sequelize.transaction(async (t) => {
            await producao.destroy({ transaction: t });
            await HistoricoAtividade.create({
                modulo: 'Safra',
                acao: 'Remoção de Talhão',
                detalhes: `Talhão ${nomeTalhao} removido do planejamento agrícola`,
                responsavel: 'Administrador WebFarm',
                protocolo: `WF-AGR-${Math.floor(1000 + Math.random() * 9000)}`,
                tipo_evento: 'remocao',
                data: new Date().toLocaleString('pt-BR'),
                id_fazenda: farmId
            }, { transaction: t });
        });

        res.json({ mensagem: "Talhão/produção removido com sucesso!" });
    } catch (erro) {
        handleSequelizeError(erro, res, "Erro ao remover a produção agrícola.");
    }
});

app.get("/transacoes", async (req, res) => {
    try {
        const { tipo, categoria, busca } = req.query;
        const where = {};
        if (tipo && tipo !== 'todos') {
            where.tipo = tipo;
        }
        if (categoria && categoria !== 'todas') {
            where.categoria = categoria;
        }
        if (busca) {
            where[Op.or] = [
                { descricao: { [Op.like]: `%${busca}%` } },
                { categoria: { [Op.like]: `%${busca}%` } },
                { comprovante: { [Op.like]: `%${busca}%` } }
            ];
        }
        const transacoes = await TransacaoFinanceira.findAll({
            where,
            include: [{ model: Fazenda, attributes: ['id', 'nome'] }],
            order: [['id', 'DESC']]
        });
        res.json(transacoes);
    } catch (erro) {
        handleSequelizeError(erro, res, "Erro ao buscar as transações financeiras.");
    }
});

app.post("/transacoes", async (req, res) => {
    try {
        const farmId = await getActiveFazendaId(req.body.id_fazenda);
        const payload = {
            ...req.body,
            id_fazenda: farmId
        };

        const novaTransacao = await sequelize.transaction(async (t) => {
            const transacao = await TransacaoFinanceira.create(payload, { transaction: t });
            await HistoricoAtividade.create({
                modulo: 'Financeiro',
                acao: payload.tipo === 'entrada' ? 'Lançamento de Receita' : 'Lançamento de Despesa',
                detalhes: `${payload.categoria}: ${payload.descricao} (R$ ${Number(payload.valor || 0).toLocaleString('pt-BR')})`,
                responsavel: req.body.responsavel || 'Administrador WebFarm',
                protocolo: `WF-FIN-${Math.floor(1000 + Math.random() * 9000)}`,
                tipo_evento: 'criacao',
                data: new Date().toLocaleString('pt-BR'),
                id_fazenda: farmId
            }, { transaction: t });
            return transacao;
        });

        res.status(201).json(novaTransacao);
    } catch (erro) {
        handleSequelizeError(erro, res, "Erro ao cadastrar a transação.");
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
        handleSequelizeError(erro, res, "Erro ao atualizar a transação.");
    }
});

app.delete("/transacoes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const transacao = await TransacaoFinanceira.findByPk(id);
        if (!transacao) {
            return res.status(404).json({ mensagem: "Transação não encontrada." });
        }
        const farmId = transacao.id_fazenda || await getActiveFazendaId();
        const descTrans = `${transacao.categoria} - ${transacao.descricao}`;

        await sequelize.transaction(async (t) => {
            await transacao.destroy({ transaction: t });
            await HistoricoAtividade.create({
                modulo: 'Financeiro',
                acao: 'Estorno de Lançamento',
                detalhes: `Transação ${descTrans} estornada`,
                responsavel: 'Administrador WebFarm',
                protocolo: `WF-FIN-${Math.floor(1000 + Math.random() * 9000)}`,
                tipo_evento: 'remocao',
                data: new Date().toLocaleString('pt-BR'),
                id_fazenda: farmId
            }, { transaction: t });
        });

        res.json({ mensagem: "Transação removida com sucesso!" });
    } catch (erro) {
        handleSequelizeError(erro, res, "Erro ao remover a transação.");
    }
});

app.get("/dashboard/metricas", async (req, res) => {
    try {
        const [
            totalAnimais,
            totalMaquinas,
            totalFuncionarios,
            totalProducoes,
            totalEntradas,
            totalSaidas
        ] = await Promise.all([
            Animal.count(),
            Maquinario.count(),
            Funcionario.count(),
            ProducaoAgricola.count(),
            TransacaoFinanceira.sum('valor', { where: { tipo: 'entrada' } }),
            TransacaoFinanceira.sum('valor', { where: { tipo: 'saida' } })
        ]);

        const entradasNum = Number(totalEntradas || 0);
        const saidasNum = Number(totalSaidas || 0);
        const saldoLiquido = entradasNum - saidasNum;

        res.json({
            animais: totalAnimais,
            maquinas: totalMaquinas,
            funcionarios: totalFuncionarios,
            talhoes: totalProducoes,
            financeiro: {
                totalEntradas: entradasNum,
                totalSaidas: saidasNum,
                saldoLiquido
            }
        });
    } catch (erro) {
        handleSequelizeError(erro, res, "Erro ao calcular métricas do dashboard.");
    }
});

app.get("/historico", async (req, res) => {
    try {
        const { modulo, termo, limite } = req.query;
        const where = {};
        if (modulo && modulo !== 'todos') {
            where.modulo = { [Op.like]: `%${modulo}%` };
        }
        if (termo) {
            where[Op.or] = [
                { acao: { [Op.like]: `%${termo}%` } },
                { detalhes: { [Op.like]: `%${termo}%` } },
                { responsavel: { [Op.like]: `%${termo}%` } },
                { protocolo: { [Op.like]: `%${termo}%` } }
            ];
        }
        const logs = await HistoricoAtividade.findAll({
            where,
            include: [{ model: Fazenda, attributes: ['id', 'nome'] }],
            order: [['id', 'DESC']],
            ...(limite ? { limit: parseInt(limite, 10) } : {})
        });
        res.json(logs);
    } catch (erro) {
        handleSequelizeError(erro, res, "Erro ao buscar histórico de atividades.");
    }
});

app.post("/historico", async (req, res) => {
    try {
        const { modulo, acao, detalhes, responsavel, tipo_evento, data } = req.body;
        if (!modulo || !acao || !detalhes) {
            return res.status(400).json({ mensagem: "Módulo, ação e detalhes são obrigatórios." });
        }
        const farmId = await getActiveFazendaId(req.body.id_fazenda);
        const protocolo = req.body.protocolo || `WF-${modulo.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const novoLog = await HistoricoAtividade.create({
            modulo,
            acao,
            detalhes,
            responsavel: responsavel || 'Administrador WebFarm',
            protocolo,
            tipo_evento: tipo_evento || 'geral',
            data: data || new Date().toLocaleString('pt-BR'),
            id_fazenda: farmId
        });
        res.status(201).json(novoLog);
    } catch (erro) {
        handleSequelizeError(erro, res, "Erro ao registrar evento no histórico.");
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
        handleSequelizeError(erro, res, "Erro ao remover registro de histórico.");
    }
});

module.exports = app;
