// pages/api/chat.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Ambil dari env (.env.local atau Vercel)
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const userMessage = req.body?.message;
  if (!userMessage) return res.status(400).json({ error: "message required" });

  try {
    // Jawab tepat + candaan ringan
    const systemInstruction = `You are a helpful assistant. Answer the user's question directly and exactly as asked. After your direct answer, add one short, light joke.`;

    // Model: bisa ganti "gpt-5-nano" kalau akunmu support
    const response = await client.responses.create({
      model: "gpt-5-nano",
      input: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userMessage }
      ]
    });

    res.status(200).json({ reply: response.output_text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
          }
