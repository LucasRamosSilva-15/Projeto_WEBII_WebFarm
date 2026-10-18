const { ProdutorRural, Fazenda } = require("../models");
const { handleSequelizeError } = require("../utils/sequelizeHelpers");

class ProdutorRuralController {
    async listar(req, res) {
        try {
            const produtores = await ProdutorRural.findAll({
                include: [{ model: Fazenda }],
                order: [['id', 'DESC']]
            });
            res.json(produtores);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao buscar os produtores rurais.");
        }
    }

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const produtor = await ProdutorRural.findByPk(id, {
                include: [{ model: Fazenda }]
            });
            if (!produtor) {
                return res.status(404).json({ mensagem: "Produtor não encontrado." });
            }
            res.json(produtor);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao buscar o produtor.");
        }
    }

    async cadastrar(req, res) {
        try {
            const novoProdutor = await ProdutorRural.create(req.body);
            res.status(201).json(novoProdutor);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao cadastrar o produtor rural.");
        }
    }

    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const produtor = await ProdutorRural.findByPk(id);
            if (!produtor) {
                return res.status(404).json({ mensagem: "Produtor não encontrado." });
            }
            await produtor.update(req.body);
            res.json(produtor);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao atualizar o produtor rural.");
        }
    }

    async excluir(req, res) {
        try {
            const { id } = req.params;
            const produtor = await ProdutorRural.findByPk(id);
            if (!produtor) {
                return res.status(404).json({ mensagem: "Produtor não encontrado." });
            }
            await produtor.destroy();
            res.json({ mensagem: "Produtor removido com sucesso!" });
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao remover o produtor rural.");
        }
    }
}

module.exports = new ProdutorRuralController();