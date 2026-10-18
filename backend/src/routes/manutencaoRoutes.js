const express = require('express');
const router = express.Router();
const ManutencaoController = require('../controllers/ManutencaoController');

router.get('/', ManutencaoController.listar);
router.get('/:id', ManutencaoController.buscarPorId);
router.post('/', ManutencaoController.cadastrar);
router.put('/:id', ManutencaoController.atualizar);
router.delete('/:id', ManutencaoController.excluir);

module.exports = router;