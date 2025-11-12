import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

const app = express();
const port = process.env.PORT || 10000;

// Ajuste para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rotas principais
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "public", "register.html")));
app.get("/chat", (req, res) => res.sendFile(path.join(__dirname, "public", "chat.html")));

// ✅ Nova rota de IA – formato compatível com DuckDuckGo
app.post("/api/send_message", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://duckduckgo.com/duckchat/v1/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0",
      },
      body: new URLSearchParams({
        model: "gpt-4o-mini",
        messages: JSON.stringify([{ role: "user", content: message }]),
      }),
    });

    const data = await response.text();

    // A API retorna texto puro, não JSON
    if (!data) {
      throw new Error("Sem resposta da IA");
    }

    res.json({ syna: data });

  } catch (error) {
    console.error("❌ Erro ao conectar com a IA:", error);
    res.status(500).json({ syna: "⚠️ Ocorreu um erro ao se conectar com a Syna." });
  }
});

// Inicia o servidor
app.listen(port, () => console.log(`🚀 Servidor rodando em http://localhost:${port}`));
