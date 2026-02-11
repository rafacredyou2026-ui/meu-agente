import express from "express";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.get("/", (req, res) => {
  res.send("Agente online 🚀");
});

app.post("/agente", async (req, res) => {
  const { mensagem } = req.body;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: mensagem }]
  });

  const resposta = response.choices[0].message.content;

  await supabase.from("conversas").insert([
    { pergunta: mensagem, resposta }
  ]);

  res.json({ resposta });
});

app.listen(process.env.PORT || 3000);
