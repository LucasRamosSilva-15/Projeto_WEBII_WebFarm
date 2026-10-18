const crypto = require("crypto");
const { Fazenda } = require("../models");

function hashPassword(password) {
    if (!password) return '';
    return crypto.createHash('sha256').update(String(password)).digest('hex');
}

function handleSequelizeError(erro, res, defaultMsg) {
    if (erro.name === 'SequelizeUniqueConstraintError') {
        const campo = erro.errors?.[0]?.path || 'valor';
        return res.status(409).json({ mensagem: `Já existe um registro com este ${campo}.`, erro: erro.message });
    }
    if (erro.name === 'SequelizeValidationError') {
        const mensagens = erro.errors?.map(e => e.message) || [erro.message];
        return res.status(400).json({ mensagem: mensagens.join(', '), erro: erro.message });
    }
    res.status(500).json({ mensagem: defaultMsg, erro: erro.message });
}

async function getActiveFazendaId(providedId) {
    if (providedId) return Number(providedId);
    const fazenda = await Fazenda.findOne({ order: [['id', 'DESC']] });
    return fazenda ? fazenda.id : null;
}

module.exports = {
    hashPassword,
    handleSequelizeError,
    getActiveFazendaId
};
