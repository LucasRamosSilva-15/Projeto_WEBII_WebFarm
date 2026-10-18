const express = require('express');
const router = express.Router();
const ProducaoAgricolaController = require('../controllers/ProducaoAgricolaController');

router.get('/', ProducaoAgricolaController.listar);
router.get('/:id', ProducaoAgricolaController.buscarPorId);
router.post('/', ProducaoAgricolaController.cadastrar);
router.put('/:id', ProducaoAgricolaController.atualizar);
router.delete('/:id', ProducaoAgricolaController.excluir);

module.exports = router;