const express = require('express');
const router = express.Router();
const FazendaController = require('../controllers/FazendaController');

router.get('/', FazendaController.listar);
router.get('/:id', FazendaController.buscarPorId);
router.post('/', FazendaController.cadastrar);
router.put('/:id', FazendaController.atualizar);
router.delete('/:id', FazendaController.excluir);

module.exports = router;