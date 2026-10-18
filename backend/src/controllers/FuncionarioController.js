const { Op } = require("sequelize");
const sequelize = require("../config/database");
const { Funcionario, Fazenda, HistoricoAtividade } = require("../models");
const { handleSequelizeError, getActiveFazendaId } = require("../utils/sequelizeHelpers");

class FuncionarioController {
    async listar(req, res) {
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
    }

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const funcionario = await Funcionario.findByPk(id, {
                include: [{ model: Fazenda, attributes: ['id', 'nome'] }]
            });
            if (!funcionario) {
                return res.status(404).json({ mensagem: "Funcionário não encontrado." });
            }
            res.json(funcionario);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao buscar o funcionário.");
        }
    }

    async cadastrar(req, res) {
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
    }

    async atualizar(req, res) {
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
    }

    async excluir(req, res) {
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
    }
}

module.exports = new FuncionarioController();
