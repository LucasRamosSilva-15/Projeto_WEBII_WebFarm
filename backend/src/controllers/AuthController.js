const { Op } = require("sequelize");
const sequelize = require("../config/database");
const { ProdutorRural, Fazenda, HistoricoAtividade } = require("../models");
const { hashPassword, handleSequelizeError } = require("../utils/sequelizeHelpers");

class AuthController {
    async register(req, res) {
        try {
            const {
                nome,
                fullName,
                cpf_cnpj,
                document,
                tipo_pessoa,
                personType,
                email,
                cell,
                telefone,
                phone,
                senha,
                password,
                nome_fazenda,
                fazenda,
                farmName
            } = req.body;

            const nomeFinal = (nome || fullName || '').trim();
            const docFinal = (cpf_cnpj || document || '').trim();
            const emailFinal = (email || '').trim().toLowerCase();
            const senhaFinal = senha || password;
            const tipoFinal = tipo_pessoa || personType || 'fisica';
            const cellFinal = cell || telefone || phone || '';
            const fazendaFinal = (nome_fazenda || fazenda || farmName || `Fazenda ${nomeFinal}`).trim();

            if (!nomeFinal || !docFinal || !emailFinal || !senhaFinal) {
                return res.status(400).json({ mensagem: "Nome, documento (CPF/CNPJ), e-mail e senha são obrigatórios." });
            }

            const produtorExistente = await ProdutorRural.findOne({
                where: {
                    [Op.or]: [
                        { email: emailFinal },
                        { cpf_cnpj: docFinal }
                    ]
                }
            });

            if (produtorExistente) {
                return res.status(409).json({ mensagem: "Já existe um produtor cadastrado com este e-mail ou CPF/CNPJ." });
            }

            const resultado = await sequelize.transaction(async (t) => {
                const novoProdutor = await ProdutorRural.create({
                    nome: nomeFinal,
                    cpf_cnpj: docFinal,
                    tipo_pessoa: tipoFinal,
                    email: emailFinal,
                    cell: cellFinal,
                    senha: hashPassword(senhaFinal),
                    data_cadastro: new Date()
                }, { transaction: t });

                const novaFazenda = await Fazenda.create({
                    nome: fazendaFinal,
                    id_produtor: novoProdutor.id,
                    data_cadastro: new Date()
                }, { transaction: t });

                await HistoricoAtividade.create({
                    modulo: 'Equipe',
                    acao: 'Cadastro de Produtor',
                    detalhes: `Novo produtor ${novoProdutor.nome} cadastrado com a propriedade ${novaFazenda.nome}`,
                    responsavel: novoProdutor.nome,
                    protocolo: `WF-CAD-${Math.floor(1000 + Math.random() * 9000)}`,
                    tipo_evento: 'criacao',
                    data: new Date().toLocaleString('pt-BR'),
                    id_fazenda: novaFazenda.id
                }, { transaction: t });

                return {
                    novoProdutor,
                    novaFazenda
                };
            });

            res.status(201).json({
                mensagem: "Cadastro realizado com sucesso!",
                usuario: {
                    id: resultado.novoProdutor.id,
                    nome: resultado.novoProdutor.nome,
                    email: resultado.novoProdutor.email,
                    cpf_cnpj: resultado.novoProdutor.cpf_cnpj,
                    perfil: "Administrador",
                    fazenda: resultado.novaFazenda.nome,
                    id_fazenda: resultado.novaFazenda.id
                }
            });
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao realizar cadastro do produtor.");
        }
    }

    async login(req, res) {
        try {
            const { identificador, identifier, email, cpf_cnpj, senha, password } = req.body;
            const termo = String(identificador || identifier || email || cpf_cnpj || '').trim();
            const senhaInformada = senha || password;

            if (!termo || !senhaInformada) {
                return res.status(400).json({ mensagem: "Identificador (e-mail ou CPF/CNPJ) e senha são obrigatórios." });
            }

            const produtor = await ProdutorRural.findOne({
                where: {
                    [Op.or]: [
                        { email: termo.toLowerCase() },
                        { cpf_cnpj: termo }
                    ]
                },
                include: [{ model: Fazenda }]
            });

            if (!produtor) {
                return res.status(401).json({ mensagem: "Credenciais inválidas. Usuário não encontrado." });
            }

            const hashed = hashPassword(senhaInformada);
            const senhaCorreta = !produtor.senha || produtor.senha === senhaInformada || produtor.senha === hashed;

            if (!senhaCorreta) {
                return res.status(401).json({ mensagem: "Senha incorreta. Verifique suas credenciais." });
            }

            if (!produtor.senha) {
                await produtor.update({ senha: hashed });
            }

            const fazenda = (produtor.Fazendas && produtor.Fazendas[0])
                ? produtor.Fazendas[0]
                : await Fazenda.findOne({ where: { id_produtor: produtor.id } });

            res.json({
                mensagem: "Login realizado com sucesso!",
                usuario: {
                    id: produtor.id,
                    nome: produtor.nome,
                    email: produtor.email,
                    cpf_cnpj: produtor.cpf_cnpj,
                    perfil: "Administrador",
                    fazenda: fazenda ? fazenda.nome : "Minha Propriedade",
                    id_fazenda: fazenda ? fazenda.id : 1
                }
            });
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao processar autenticação.");
        }
    }
}

module.exports = new AuthController();
