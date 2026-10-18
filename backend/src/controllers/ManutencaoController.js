const { Manutencao, Maquinario, Veiculo } = require("../models");
const { handleSequelizeError } = require("../utils/sequelizeHelpers");

class ManutencaoController {
    async listar(req, res) {
        try {
            const manutencoes = await Manutencao.findAll({
                include: [
                    { model: Maquinario },
                    { model: Veiculo }
                ],
                order: [['id', 'DESC']]
            });
            res.json(manutencoes);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao buscar manutenções.");
        }
    }

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const manutencao = await Manutencao.findByPk(id, {
                include: [
                    { model: Maquinario },
                    { model: Veiculo }
                ]
            });
            if (!manutencao) {
                return res.status(404).json({ mensagem: "Manutenção não encontrada." });
            }
            res.json(manutencao);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao buscar manutenção.");
        }
    }

    async cadastrar(req, res) {
        try {
            const novaManutencao = await Manutencao.create(req.body);
            res.status(201).json(novaManutencao);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao cadastrar manutenção.");
        }
    }

    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const manutencao = await Manutencao.findByPk(id);
            if (!manutencao) {
                return res.status(404).json({ mensagem: "Manutenção não encontrada." });
            }
            await manutencao.update(req.body);
            res.json(manutencao);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao atualizar manutenção.");
        }
    }

    async excluir(req, res) {
        try {
            const { id } = req.params;
            const manutencao = await Manutencao.findByPk(id);
            if (!manutencao) {
                return res.status(404).json({ mensagem: "Manutenção não encontrada." });
            }
            await manutencao.destroy();
            res.json({ mensagem: "Manutenção removida com sucesso!" });
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao remover manutenção.");
        }
    }
}

module.exports = new ManutencaoController();