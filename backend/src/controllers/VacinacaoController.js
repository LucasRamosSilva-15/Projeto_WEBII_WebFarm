const { VacinacaoAnimal, Animal } = require("../models");
const { handleSequelizeError } = require("../utils/sequelizeHelpers");

class VacinacaoController {
    async listar(req, res) {
        try {
            const vacinacoes = await VacinacaoAnimal.findAll({
                include: [{ model: Animal }],
                order: [['id', 'DESC']]
            });
            res.json(vacinacoes);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao buscar vacinações.");
        }
    }

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const vacinacao = await VacinacaoAnimal.findByPk(id, {
                include: [{ model: Animal }]
            });
            if (!vacinacao) {
                return res.status(404).json({ mensagem: "Vacinação não encontrada." });
            }
            res.json(vacinacao);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao buscar vacinação.");
        }
    }

    async cadastrar(req, res) {
        try {
            const novaVacinacao = await VacinacaoAnimal.create(req.body);
            res.status(201).json(novaVacinacao);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao cadastrar vacinação.");
        }
    }

    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const vacinacao = await VacinacaoAnimal.findByPk(id);
            if (!vacinacao) {
                return res.status(404).json({ mensagem: "Vacinação não encontrada." });
            }
            await vacinacao.update(req.body);
            res.json(vacinacao);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao atualizar vacinação.");
        }
    }

    async excluir(req, res) {
        try {
            const { id } = req.params;
            const vacinacao = await VacinacaoAnimal.findByPk(id);
            if (!vacinacao) {
                return res.status(404).json({ mensagem: "Vacinação não encontrada." });
            }
            await vacinacao.destroy();
            res.json({ mensagem: "Vacinação removida com sucesso!" });
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao remover vacinação.");
        }
    }
}

module.exports = new VacinacaoController();
