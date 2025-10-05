// api/generate-image.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// Carregar variáveis de ambiente
dotenv.config();

// Inicializar a API do Google com a chave
const genAI = new GoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY, // A chave deve ser configurada na Vercel
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { prompt } = req.body;

      // Criando a chamada para a API do Google AI (com o modelo de imagem)
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-preview-image-generation",
      });

      // Gerar a imagem com base no prompt
      const result = await model.generateContent([
        { text: prompt }
      ]);

      const imgBase64 = result.response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if (!imgBase64) {
        return res.status(500).json({ error: "Erro ao gerar a imagem" });
      }

      res.status(200).json({ base64: imgBase64 });
    } catch (error) {
      console.error("Erro ao gerar imagem", error);
      res.status(500).json({ error: error.message || "Erro interno do servidor" });
    }
  } else {
    res.status(405).json({ error: "Método não permitido" });
  }
}
