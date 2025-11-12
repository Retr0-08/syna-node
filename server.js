import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

// 🔹 Inicializa o app
const app = express();
const port = process.env.PORT || 10000;

// 🔹 Ajuste para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 🔹 Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, "public")));

// 🔹 Rotas principais
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "public", "register.html")));
app.get("/chat", (req, res) => res.sendFile(path.join(__dirname, "public", "chat.html")));

// 🔹 Rota de IA usando DuckDuckGo Llama3 (gratuita e sem chave)
app.post("/api/send_message", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://duckduckgo.com/duckchat/v1/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // modelo leve e rápido
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!response.ok) throw new Error(`Erro da API: ${response.status}`);

    const data = await response.json();
    const reply = data.message || "⚠️ A IA não respondeu.";

    res.json({ syna: reply });

  } catch (error) {
    console.error("❌ Erro ao conectar com a IA:", error);
    res.status(500).json({ syna: "⚠️ Ocorreu um erro ao se conectar com a Syna." });
  }
});

// 🔹 Inicia o servidor
app.listen(port, () => console.log(`🚀 Servidor rodando em http://localhost:${port}`));
