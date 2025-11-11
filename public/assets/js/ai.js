// ai.js — responsável pela integração da Syna com a IA Hugging Face

async function getSynaResponse(userMessage) {
  try {
    const response = await fetch("/api/send_message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage })
    });

    if (!response.ok) throw new Error("Erro de conexão com a IA");
    const data = await response.json();
    return data.syna || "⚠️ Não consegui entender o que você quis dizer...";
  } catch (error) {
    console.error(error);
    return "⚠️ Ocorreu um erro ao se conectar com a Syna.";
  }
}
