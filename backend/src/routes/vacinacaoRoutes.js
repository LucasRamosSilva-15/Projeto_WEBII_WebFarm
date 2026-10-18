const express = require('express');
const router = express.Router();
const VacinacaoController = require('../controllers/VacinacaoController');

router.get('/', VacinacaoController.listar);
router.get('/:id', VacinacaoController.buscarPorId);
router.post('/', VacinacaoController.cadastrar);
router.put('/:id', VacinacaoController.atualizar);
router.delete('/:id', VacinacaoController.excluir);

module.exports = router;
