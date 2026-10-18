const { Op } = require("sequelize");
const sequelize = require("../config/database");
const { Animal, Fazenda, VacinacaoAnimal, HistoricoAtividade } = require("../models");
const { handleSequelizeError, getActiveFazendaId } = require("../utils/sequelizeHelpers");

class AnimalController {
    async listar(req, res) {
        try {
            const { status, especie, busca } = req.query;
            const where = {};
            if (status && status !== 'todos') {
                where.status = status;
            }
            if (especie && especie !== 'todas') {
                where.especie = especie;
            }
            if (busca) {
                where[Op.or] = [
                    { codigo_brinco: { [Op.like]: `%${busca}%` } },
                    { raca: { [Op.like]: `%${busca}%` } },
                    { origem: { [Op.like]: `%${busca}%` } }
                ];
            }
            const animais = await Animal.findAll({
                where,
                include: [
                    { model: Fazenda, attributes: ['id', 'nome'] },
                    { model: VacinacaoAnimal }
                ],
                order: [['id', 'DESC']]
            });
            res.json(animais);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao buscar os animais.");
        }
    }

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const animal = await Animal.findByPk(id, {
                include: [
                    { model: Fazenda, attributes: ['id', 'nome'] },
                    { model: VacinacaoAnimal }
                ]
            });
            if (!animal) {
                return res.status(404).json({ mensagem: "Animal não encontrado." });
            }
            res.json(animal);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao buscar animal.");
        }
    }

    async cadastrar(req, res) {
        try {
            const farmId = await getActiveFazendaId(req.body.id_fazenda);
            const payload = {
                ...req.body,
                id_fazenda: farmId
            };

            const novoAnimal = await sequelize.transaction(async (t) => {
                const animal = await Animal.create(payload, { transaction: t });
                await HistoricoAtividade.create({
                    modulo: 'Pecuária',
                    acao: 'Cadastro de Animal',
                    detalhes: `Animal brinco ${animal.codigo_brinco} (${animal.raca || 'Bovino'}, ${animal.peso}kg) cadastrado`,
                    responsavel: req.body.responsavel || 'Administrador WebFarm',
                    protocolo: `WF-PEC-${Math.floor(1000 + Math.random() * 9000)}`,
                    tipo_evento: 'criacao',
                    data: new Date().toLocaleString('pt-BR'),
                    id_fazenda: farmId
                }, { transaction: t });
                return animal;
            });

            res.status(201).json(novoAnimal);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao cadastrar o animal.");
        }
    }

    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const animal = await Animal.findByPk(id);
            if (!animal) {
                return res.status(404).json({ mensagem: "Animal não encontrado." });
            }
            await animal.update(req.body);
            res.json(animal);
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao atualizar o animal.");
        }
    }

    async excluir(req, res) {
        try {
            const { id } = req.params;
            const animal = await Animal.findByPk(id);
            if (!animal) {
                return res.status(404).json({ mensagem: "Animal não encontrado." });
            }
            const farmId = animal.id_fazenda || await getActiveFazendaId();
            const brinco = animal.codigo_brinco;

            await sequelize.transaction(async (t) => {
                await animal.destroy({ transaction: t });
                await HistoricoAtividade.create({
                    modulo: 'Pecuária',
                    acao: 'Remoção de Animal',
                    detalhes: `Animal brinco ${brinco} removido do rebanho`,
                    responsavel: 'Administrador WebFarm',
                    protocolo: `WF-PEC-${Math.floor(1000 + Math.random() * 9000)}`,
                    tipo_evento: 'remocao',
                    data: new Date().toLocaleString('pt-BR'),
                    id_fazenda: farmId
                }, { transaction: t });
            });

            res.json({ mensagem: "Animal removido com sucesso!" });
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao remover o animal.");
        }
    }
}

module.exports = new AnimalController();
