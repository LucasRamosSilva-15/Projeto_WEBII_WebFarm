const { Op } = require("sequelize");
const sequelize = require("../config/database");
const { Maquinario, Fazenda, Manutencao, HistoricoAtividade } = require("../models");
const { handleSequelizeError, getActiveFazendaId } = require("../utils/sequelizeHelpers");

class MaquinarioController {
    async listar(req, res) {
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
                include: [
                    { model: Fazenda, attributes: ['id', 'nome'] },
                    { model: Manutencao }
                ],
                order: [['id', 'DESC']]
            });
            res.json(maquinarios);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao buscar os maquinários.");
        }
    }

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const maquinario = await Maquinario.findByPk(id, {
                include: [
                    { model: Fazenda, attributes: ['id', 'nome'] },
                    { model: Manutencao }
                ]
            });
            if (!maquinario) {
                return res.status(404).json({ mensagem: "Maquinário não encontrado." });
            }
            res.json(maquinario);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao buscar o maquinário.");
        }
    }

    async cadastrar(req, res) {
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
    }

    async atualizar(req, res) {
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
    }

    async excluir(req, res) {
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
    }
}

module.exports = new MaquinarioController();