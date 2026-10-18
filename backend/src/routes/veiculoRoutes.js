const express = require('express');
const router = express.Router();
const VeiculoController = require('../controllers/VeiculoController');

router.get('/', VeiculoController.listar);
router.get('/:id', VeiculoController.buscarPorId);
router.post('/', VeiculoController.cadastrar);
router.put('/:id', VeiculoController.atualizar);
router.delete('/:id', VeiculoController.excluir);

module.exports = router;