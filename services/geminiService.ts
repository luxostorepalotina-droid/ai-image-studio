
import { GoogleGenAI, Modality } from "@google/genai";
import type { EditFunction } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImageFromText = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
        throw new Error("Nenhuma imagem foi gerada.");
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Falha ao gerar imagem. Verifique o console para detalhes.");
    }
};

const getEditPrompt = (userPrompt: string, func: EditFunction): string => {
    switch(func) {
        case 'add-remove':
            return userPrompt || 'Adicione ou remova elementos conforme solicitado na imagem.';
        case 'retouch':
            return `Faça um retoque profissional na imagem, melhorando a qualidade e aplicando as seguintes edições: ${userPrompt}`;
        case 'style':
            return `Aplique um novo estilo à imagem com base na seguinte descrição: ${userPrompt}`;
        case 'compose':
            return `Una as duas imagens de forma criativa e coesa, seguindo esta instrução: ${userPrompt}`;
        default:
            return userPrompt;
    }
}

export const editImageWithAI = async (
    prompt: string,
    func: EditFunction,
    image1Base64: string,
    image1Mime: string,
    image2Base64?: string,
    image2Mime?: string
): Promise<string> => {
    try {
        const fullPrompt = getEditPrompt(prompt, func);
        
        const parts: any[] = [
            { inlineData: { data: image1Base64, mimeType: image1Mime } },
        ];

        if (image2Base64 && image2Mime) {
            parts.push({ inlineData: { data: image2Base64, mimeType: image2Mime } });
        }
        
        parts.push({ text: fullPrompt });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);

        if (imagePart && imagePart.inlineData) {
            const mimeType = imagePart.inlineData.mimeType || 'image/png';
            return `data:${mimeType};base64,${imagePart.inlineData.data}`;
        }

        const textPart = response.candidates?.[0]?.content?.parts.find(p => p.text);
        if (textPart?.text) {
             throw new Error(`A IA respondeu com texto em vez de uma imagem: "${textPart.text}"`);
        }

        throw new Error("Não foi possível editar a imagem.");

    } catch (error) {
        console.error("Error editing image:", error);
        throw new Error(error instanceof Error ? error.message : "Falha ao editar a imagem. Verifique o console.");
    }
};
