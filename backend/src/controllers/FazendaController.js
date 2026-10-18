const { Fazenda, ProdutorRural, Animal, Funcionario, Maquinario, ProducaoAgricola } = require("../models");
const { handleSequelizeError } = require("../utils/sequelizeHelpers");

class FazendaController {
    async listar(req, res) {
        try {
            const fazendas = await Fazenda.findAll({
                include: [{ model: ProdutorRural }],
                order: [['id', 'DESC']]
            });
            res.json(fazendas);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao buscar as fazendas.");
        }
    }

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const fazenda = await Fazenda.findByPk(id, {
                include: [
                    { model: ProdutorRural },
                    { model: Animal },
                    { model: Funcionario },
                    { model: Maquinario },
                    { model: ProducaoAgricola }
                ]
            });
            if (!fazenda) {
                return res.status(404).json({ mensagem: "Fazenda não encontrada." });
            }
            res.json(fazenda);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao buscar a fazenda.");
        }
    }

    async cadastrar(req, res) {
        try {
            const novaFazenda = await Fazenda.create(req.body);
            res.status(201).json(novaFazenda);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao cadastrar a fazenda.");
        }
    }

    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const fazenda = await Fazenda.findByPk(id);
            if (!fazenda) {
                return res.status(404).json({ mensagem: "Fazenda não encontrada." });
            }
            await fazenda.update(req.body);
            res.json(fazenda);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao atualizar a fazenda.");
        }
    }

    async excluir(req, res) {
        try {
            const { id } = req.params;
            const fazenda = await Fazenda.findByPk(id);
            if (!fazenda) {
                return res.status(404).json({ mensagem: "Fazenda não encontrada." });
            }
            await fazenda.destroy();
            res.json({ mensagem: "Fazenda removida com sucesso!" });
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao remover a fazenda.");
        }
    }
}

module.exports = new FazendaController();