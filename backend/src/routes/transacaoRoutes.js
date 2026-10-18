const express = require('express');
const router = express.Router();
const TransacaoFinanceiraController = require('../controllers/TransacaoFinanceiraController');

router.get('/', TransacaoFinanceiraController.listar);
router.get('/:id', TransacaoFinanceiraController.buscarPorId);
router.post('/', TransacaoFinanceiraController.cadastrar);
router.put('/:id', TransacaoFinanceiraController.atualizar);
router.delete('/:id', TransacaoFinanceiraController.excluir);

module.exports = router;
