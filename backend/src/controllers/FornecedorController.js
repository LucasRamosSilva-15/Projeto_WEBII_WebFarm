const { Fornecedor, Fazenda } = require("../models");
const { handleSequelizeError, getActiveFazendaId } = require("../utils/sequelizeHelpers");

class FornecedorController {
    async listar(req, res) {
        try {
            const fornecedores = await Fornecedor.findAll({
                include: [{ model: Fazenda, attributes: ['id', 'nome'] }],
                order: [['id', 'DESC']]
            });
            res.json(fornecedores);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao buscar fornecedores.");
        }
    }

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const fornecedor = await Fornecedor.findByPk(id, {
                include: [{ model: Fazenda, attributes: ['id', 'nome'] }]
            });
            if (!fornecedor) {
                return res.status(404).json({ mensagem: "Fornecedor não encontrado." });
            }
            res.json(fornecedor);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao buscar fornecedor.");
        }
    }

    async cadastrar(req, res) {
        try {
            const farmId = await getActiveFazendaId(req.body.id_fazenda);
            const fornecedor = await Fornecedor.create({
                ...req.body,
                id_fazenda: farmId
            });
            res.status(201).json(fornecedor);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao cadastrar fornecedor.");
        }
    }

    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const fornecedor = await Fornecedor.findByPk(id);
            if (!fornecedor) {
                return res.status(404).json({ mensagem: "Fornecedor não encontrado." });
            }
            await fornecedor.update(req.body);
            res.json(fornecedor);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao atualizar fornecedor.");
        }
    }

    async excluir(req, res) {
        try {
            const { id } = req.params;
            const fornecedor = await Fornecedor.findByPk(id);
            if (!fornecedor) {
                return res.status(404).json({ mensagem: "Fornecedor não encontrado." });
            }
            await fornecedor.destroy();
            res.json({ mensagem: "Fornecedor removido com sucesso!" });
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao remover fornecedor.");
        }
    }
}

module.exports = new FornecedorController();