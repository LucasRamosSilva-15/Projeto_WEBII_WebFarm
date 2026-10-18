const express = require('express');
const router = express.Router();
const MaquinarioController = require('../controllers/MaquinarioController');

router.get('/', MaquinarioController.listar);
router.get('/:id', MaquinarioController.buscarPorId);
router.post('/', MaquinarioController.cadastrar);
router.put('/:id', MaquinarioController.atualizar);
router.delete('/:id', MaquinarioController.excluir);

module.exports = router;
