import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import dotenv from "dotenv";

// 🔹 Carrega variáveis de ambiente (.env ou Render)
dotenv.config();

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

// 🔹 Rota de comunicação com a IA (Mistral 7B)
app.post("/api/send_message", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: message,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7,
          repetition_penalty: 1.2,
        }
      }),
    });

    const data = await response.json();

    if (data?.error) {
      return res.json({ syna: "⚠️ Erro na IA: " + data.error });
    }

    // Mistral retorna texto dentro de "generated_text"
    const output = data[0]?.generated_text || "⚠️ Não consegui gerar uma resposta.";
    res.json({ syna: output });

  } catch (error) {
    console.error("❌ Erro ao conectar com a IA:", error);
    res.status(500).json({ syna: "⚠️ Ocorreu um erro ao se conectar com a Syna." });
  }
});

// 🔹 Inicia o servidor
app.listen(port, () => console.log(`🚀 Servidor rodando em http://localhost:${port}`));
