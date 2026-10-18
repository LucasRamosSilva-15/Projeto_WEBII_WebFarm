const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const app = require('./app');
const sequelize = require('./config/database');
require('./models');

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Banco de dados sincronizado e inicializado com sucesso!');

        const server = app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });

        server.on('error', (erro) => {
            if (erro.code === 'EADDRINUSE') {
                console.error(`A porta ${PORT} já está em uso por outro processo.`);
            } else {
                console.error('Erro no servidor HTTP:', erro);
            }
        });
    } catch (erro) {
        console.error('Erro ao iniciar o servidor:', erro);
    }
}

iniciarServidor();
