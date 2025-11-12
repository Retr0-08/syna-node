import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import dotenv from "dotenv";

// 🔹 Carrega variáveis de ambiente (.env ou Render)
dotenv.config();

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

// ✅ Nova rota de IA (Groq + Llama 3.3 70B Versatile)
app.post("/api/send_message", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Você é a Syna, uma IA empática e curiosa que fala com o usuário de forma natural e gentil." },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro da API:", data);
      throw new Error(data.error?.message || "Erro desconhecido na Groq API");
    }

    const reply = data.choices?.[0]?.message?.content || "⚠️ Não consegui gerar uma resposta.";
    res.json({ syna: reply });

  } catch (error) {
    console.error("❌ Erro ao conectar com a IA:", error);
    res.status(500).json({ syna: "⚠️ Ocorreu um erro ao se conectar com a Syna." });
  }
});

// Inicia o servidor
app.listen(port, () => console.log(`🚀 Servidor rodando em http://localhost:${port}`));
