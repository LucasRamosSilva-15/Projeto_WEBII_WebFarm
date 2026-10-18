const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/DashboardController');

router.get('/metricas', DashboardController.obterMetricas);

module.exports = router;
