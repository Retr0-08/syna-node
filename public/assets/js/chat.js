const sendBtn = document.getElementById("send-btn");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerHTML = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", async () => {
  const text = input.value.trim();
  if (text === "") return;

  addMessage(text, "user");
  input.value = "";

  // Mensagem temporária
  addMessage("💫 Estou processando sua mensagem...", "bot");

  // 🔹 Integração com IA
  const reply = await getSynaResponse(text);

  // Substitui mensagem temporária pela resposta real
  const loadingMsg = chatBox.querySelector(".message.bot:last-child");
  if (loadingMsg) loadingMsg.remove();

  addMessage(reply, "bot");
});

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendBtn.click();
});
