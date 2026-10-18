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

const { swaggerUi, swaggerDocs } = require("./config/swagger");

const app = express();

const rawFrontendUrl = process.env.FRONTEND_URL || '';
const configuredOrigins = rawFrontendUrl
  .split(',')
  .map((u) => u.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  ...configuredOrigins
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/+$/, '');
    if (
      allowedOrigins.includes(cleanOrigin) ||
      cleanOrigin.endsWith('.vercel.app') ||
      cleanOrigin.endsWith('.onrender.com') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
    customSiteTitle: "WebFarm 2.0 API Docs"
}));
app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerDocs);
});

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
