const express = require('express');
const router = express.Router();
const ProdutorRuralController = require('../controllers/ProdutorRuralController');

router.get('/', ProdutorRuralController.listar);
router.get('/:id', ProdutorRuralController.buscarPorId);
router.post('/', ProdutorRuralController.cadastrar);
router.put('/:id', ProdutorRuralController.atualizar);
router.delete('/:id', ProdutorRuralController.excluir);

module.exports = router;