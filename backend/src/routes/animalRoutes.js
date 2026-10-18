const express = require('express');
const router = express.Router();
const AnimalController = require('../controllers/AnimalController');

router.get('/', AnimalController.listar);
router.get('/:id', AnimalController.buscarPorId);
router.post('/', AnimalController.cadastrar);
router.put('/:id', AnimalController.atualizar);
router.delete('/:id', AnimalController.excluir);

module.exports = router;