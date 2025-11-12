import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "public", "register.html")));
app.get("/chat", (req, res) => res.sendFile(path.join(__dirname, "public", "chat.html")));

app.post("/api/send_message", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
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
          },
        }),
      }
    );

    // 🔹 Verifica se o retorno é válido
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("⚠️ Resposta inválida da Hugging Face:", text);
      return res.json({
        syna: "⚠️ Ocorreu um erro inesperado ao processar a resposta da IA.",
      });
    }

    // 🔹 Trata possíveis erros do modelo
    if (data.error) {
      return res.json({ syna: "⚠️ Erro na IA: " + data.error });
    }

    // 🔹 Novo formato do router.huggingface.co pode variar, então tratamos ambos
    const output =
      data.generated_text ||
      data[0]?.generated_text ||
      data.output_text ||
      "⚠️ Não consegui gerar uma resposta.";

    res.json({ syna: output });
  } catch (error) {
    console.error("❌ Erro ao conectar com a IA:", error);
    res.status(500).json({
      syna: "⚠️ Ocorreu um erro ao se conectar com a Syna.",
    });
  }
});

app.listen(port, () =>
  console.log(`🚀 Servidor rodando em http://localhost:${port}`)
);
