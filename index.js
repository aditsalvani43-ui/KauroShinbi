// pages/index.js
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);

  const send = async () => {
    if (!input.trim()) return;
    const userText = input;
    setChat(prev => [...prev, { role: "user", text: userText }]);
    setInput("");

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText })
      });
      const j = await r.json();
      if (r.ok) {
        setChat(prev => [...prev, { role: "assistant", text: j.reply }]);
      } else {
        setChat(prev => [
          ...prev,
          { role: "assistant", text: "Error: " + j.error }
        ]);
      }
    } catch (e) {
      setChat(prev => [
        ...prev,
        { role: "assistant", text: "Network error: " + e.message }
      ]);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>AI Chat (OpenAI + Vercel)</h1>
      <div style={{ border: "1px solid #ddd", padding: 12, minHeight: 300 }}>
        {chat.map((m, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <strong>{m.role === "user" ? "You" : "Assistant"}:</strong>
            <div style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Tanya sesuatu..."
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={send} style={{ padding: "8px 12px" }}>Kirim</button>
      </div>
    </div>
  );
  }
