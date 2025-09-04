import { GoogleGenAI, Modality } from "@google/genai";
import { AspectRatio } from "../types";

// Assume API_KEY is set in the environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

export const generateImage = async (
  prompt: string, 
  aspectRatio: AspectRatio,
  numberOfImages: number
): Promise<string[]> => {
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        // FIX: The `generateImages` method expects a `prompt` property, not `contents`.
        prompt: prompt,
        config: {
          numberOfImages: numberOfImages,
          outputMimeType: 'image/jpeg',
          aspectRatio: aspectRatio,
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages.map(img => img.image.imageBytes);
    } else {
      throw new Error("No image was generated. The response may have been blocked.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image. Please check your prompt or API key.");
  }
};

export interface EditImageResult {
    imageB64: string | null;
    text: string | null;
}

export const editImage = async (prompt: string, image: { data: string; mimeType: string }): Promise<EditImageResult> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: image.data,
                            mimeType: image.mimeType,
                        },
                    },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const result: EditImageResult = { imageB64: null, text: null };

        if (response.candidates && response.candidates.length > 0) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    result.imageB64 = part.inlineData.data;
                } else if (part.text) {
                    result.text = part.text;
                }
            }
        }
        
        if (!result.imageB64 && !result.text) {
             throw new Error("A edição não produziu uma imagem ou texto. Tente uma solicitação diferente.");
        }

        return result;

    } catch (error) {
        console.error("Error editing image:", error);
        throw new Error("Falha ao editar a imagem. Verifique sua solicitação ou chave de API.");
    }
}