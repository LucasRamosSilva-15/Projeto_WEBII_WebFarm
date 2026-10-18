const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const animalRoutes = require("./routes/animalRoutes");
const funcionarioRoutes = require("./routes/funcionarioRoutes");
const maquinarioRoutes = require("./routes/maquinarioRoutes");
const producaoAgricolaRoutes = require("./routes/producaoAgricolaRoutes");
const transacaoRoutes = require("./routes/transacaoRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const historicoRoutes = require("./routes/historicoRoutes");
const fazendaRoutes = require("./routes/fazendaRoutes");
const produtorRuralRoutes = require("./routes/produtorRuralRoutes");
const fornecedorRoutes = require("./routes/fornecedorRoutes");
const veiculoRoutes = require("./routes/veiculoRoutes");
const manutencaoRoutes = require("./routes/manutencaoRoutes");
const vacinacaoRoutes = require("./routes/vacinacaoRoutes");

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL;
app.use(cors({
    origin: FRONTEND_URL ? [FRONTEND_URL, 'http://localhost:5173'] : '*'
}));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/animais", animalRoutes);
app.use("/funcionarios", funcionarioRoutes);
app.use("/maquinarios", maquinarioRoutes);
app.use("/producoes", producaoAgricolaRoutes);
app.use("/transacoes", transacaoRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/historico", historicoRoutes);
app.use("/fazendas", fazendaRoutes);
app.use("/produtores", produtorRuralRoutes);
app.use("/fornecedores", fornecedorRoutes);
app.use("/veiculos", veiculoRoutes);
app.use("/manutencoes", manutencaoRoutes);
app.use("/vacinacoes", vacinacaoRoutes);

module.exports = app;
