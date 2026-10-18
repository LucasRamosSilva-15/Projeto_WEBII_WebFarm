const { Op } = require("sequelize");
const sequelize = require("../config/database");
const { ProducaoAgricola, Fazenda, HistoricoAtividade } = require("../models");
const { handleSequelizeError, getActiveFazendaId } = require("../utils/sequelizeHelpers");

class ProducaoAgricolaController {
    async listar(req, res) {
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
    }

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const producao = await ProducaoAgricola.findByPk(id, {
                include: [{ model: Fazenda, attributes: ['id', 'nome'] }]
            });
            if (!producao) {
                return res.status(404).json({ mensagem: "Talhão/produção não encontrado." });
            }
            res.json(producao);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao buscar o talhão/produção.");
        }
    }

    async cadastrar(req, res) {
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
    }

    async atualizar(req, res) {
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
    }

    async excluir(req, res) {
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
    }
}

module.exports = new ProducaoAgricolaController();