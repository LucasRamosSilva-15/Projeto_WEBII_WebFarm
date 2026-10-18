const { Veiculo, Fazenda, Manutencao } = require("../models");
const { handleSequelizeError, getActiveFazendaId } = require("../utils/sequelizeHelpers");

class VeiculoController {
    async listar(req, res) {
        try {
            const veiculos = await Veiculo.findAll({
                include: [
                    { model: Fazenda, attributes: ['id', 'nome'] },
                    { model: Manutencao }
                ],
                order: [['id', 'DESC']]
            });
            res.json(veiculos);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao buscar veículos.");
        }
    }

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const veiculo = await Veiculo.findByPk(id, {
                include: [
                    { model: Fazenda, attributes: ['id', 'nome'] },
                    { model: Manutencao }
                ]
            });
            if (!veiculo) {
                return res.status(404).json({ mensagem: "Veículo não encontrado." });
            }
            res.json(veiculo);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao buscar veículo.");
        }
    }

    async cadastrar(req, res) {
        try {
            const farmId = await getActiveFazendaId(req.body.id_fazenda);
            const veiculo = await Veiculo.create({
                ...req.body,
                id_fazenda: farmId
            });
            res.status(201).json(veiculo);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao cadastrar veículo.");
        }
    }

    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const veiculo = await Veiculo.findByPk(id);
            if (!veiculo) {
                return res.status(404).json({ mensagem: "Veículo não encontrado." });
            }
            await veiculo.update(req.body);
            res.json(veiculo);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao atualizar veículo.");
        }
    }

    async excluir(req, res) {
        try {
            const { id } = req.params;
            const veiculo = await Veiculo.findByPk(id);
            if (!veiculo) {
                return res.status(404).json({ mensagem: "Veículo não encontrado." });
            }
            await veiculo.destroy();
            res.json({ mensagem: "Veículo removido com sucesso!" });
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao remover veículo.");
        }
    }
}

module.exports = new VeiculoController();
