const { Animal, Maquinario, Funcionario, ProducaoAgricola, TransacaoFinanceira } = require("../models");
const { handleSequelizeError } = require("../utils/sequelizeHelpers");

class DashboardController {
    async obterMetricas(req, res) {
        try {
            const [
                totalAnimais,
                totalMaquinas,
                totalFuncionarios,
                totalProducoes,
                totalEntradas,
                totalSaidas
            ] = await Promise.all([
                Animal.count(),
                Maquinario.count(),
                Funcionario.count(),
                ProducaoAgricola.count(),
                TransacaoFinanceira.sum('valor', { where: { tipo: 'entrada' } }),
                TransacaoFinanceira.sum('valor', { where: { tipo: 'saida' } })
            ]);

            const entradasNum = Number(totalEntradas || 0);
            const saidasNum = Number(totalSaidas || 0);
            const saldoLiquido = entradasNum - saidasNum;

            res.json({
                animais: totalAnimais,
                maquinas: totalMaquinas,
                funcionarios: totalFuncionarios,
                talhoes: totalProducoes,
                financeiro: {
                    totalEntradas: entradasNum,
                    totalSaidas: saidasNum,
                    saldoLiquido
                }
            });
        } catch (erro) {
            handleSequelizeError(erro, res, "Erro ao calcular métricas do dashboard.");
        }
    }
}

module.exports = new DashboardController();
