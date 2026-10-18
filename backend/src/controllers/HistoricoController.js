const { Op } = require("sequelize");
const { HistoricoAtividade, Fazenda } = require("../models");
const { handleSequelizeError, getActiveFazendaId } = require("../utils/sequelizeHelpers");

class HistoricoController {
    async listar(req, res) {
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
    }

    async cadastrar(req, res) {
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
    }

    async excluir(req, res) {
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
    }
}

module.exports = new HistoricoController();
