import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// 🔹 Ajuste para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 🔹 Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, "public")));

// 🔹 Rotas principais
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "chat.html"));
});

// 🔹 API de teste
app.post("/api/message", (req, res) => {
  const { message } = req.body;
  res.json({ syna: `Você disse: ${message}` });
});

// 🔹 Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
