const express = require('express');
const router = express.Router();
const HistoricoController = require('../controllers/HistoricoController');

router.get('/', HistoricoController.listar);
router.post('/', HistoricoController.cadastrar);
router.delete('/:id', HistoricoController.excluir);

module.exports = router;
