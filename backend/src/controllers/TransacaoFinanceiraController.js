const { Op } = require("sequelize");
const sequelize = require("../config/database");
const { TransacaoFinanceira, Fazenda, HistoricoAtividade } = require("../models");
const { handleSequelizeError, getActiveFazendaId } = require("../utils/sequelizeHelpers");

class TransacaoFinanceiraController {
    async listar(req, res) {
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
    }

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const transacao = await TransacaoFinanceira.findByPk(id, {
                include: [{ model: Fazenda, attributes: ['id', 'nome'] }]
            });
            if (!transacao) {
                return res.status(404).json({ mensagem: "Transação não encontrada." });
            }
            res.json(transacao);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao buscar a transação.");
        }
    }

    async cadastrar(req, res) {
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
    }

    async atualizar(req, res) {
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
    }

    async excluir(req, res) {
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
    }
}

module.exports = new TransacaoFinanceiraController();
