const app = require('./app');
const sequelize = require('./config/database');
const seedDatabase = require('./config/seed');
require('./models');

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        await seedDatabase();
        console.log('Banco de dados sincronizado e inicializado com sucesso!');

        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });
    } catch (erro) {
        console.error('Erro ao iniciar o servidor:', erro);
    }
}

iniciarServidor();
