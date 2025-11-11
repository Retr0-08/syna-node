// api.js — Syna API (versão Node.js frontend)

// Essa função envia a mensagem do usuário para o backend (server.js)
async function sendToSyna(message) {
  try {
    const response = await fetch("/api/send_message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) throw new Error("Erro de conexão com a IA");

    const data = await response.json();
    return data.syna || "⚠️ Não consegui entender o que você quis dizer...";
  } catch (err) {
    console.error(err);
    return "⚠️ Ocorreu um erro ao se conectar com a Syna.";
  }
}
