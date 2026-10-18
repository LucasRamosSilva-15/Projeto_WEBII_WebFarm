const express = require('express');
const router = express.Router();
const FornecedorController = require('../controllers/FornecedorController');

router.get('/', FornecedorController.listar);
router.get('/:id', FornecedorController.buscarPorId);
router.post('/', FornecedorController.cadastrar);
router.put('/:id', FornecedorController.atualizar);
router.delete('/:id', FornecedorController.excluir);

module.exports = router;