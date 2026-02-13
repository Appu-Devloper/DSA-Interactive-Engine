
import { GoogleGenAI } from "@google/genai";

export const getAlgorithmExplanationStream = async (
  algoName: string, 
  query: string, 
  context: { complexity: string, category: string },
  manualApiKey: string,
  onChunk: (text: string) => void
) => {
  try {
    if (!manualApiKey || manualApiKey.trim() === "") {
      onChunk("### ⚠️ API Key Required\nPlease provide your Gemini API key in the configuration panel above to enable the AI Tutor.");
      return "";
    }

    const ai = new GoogleGenAI({ apiKey: manualApiKey });
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-pro-preview',
      contents: `You are a world-class Computer Science Professor. 
      Explain ${algoName} (a ${context.category} algorithm with ${context.complexity} complexity).
      User Question: "${query}"
      
      Instructions:
      1. Use Markdown for structure: ### for headers, **bold** for key terms.
      2. Use bullet points for steps.
      3. If providing code, use triple backticks with the language name.
      4. Use analogies to explain abstract concepts.
      5. Include a "💡 Interview Tip" or "⚠️ Common Pitfall" section if relevant.
      6. For Big-O notation, use the format O(n) or O(log n).`,
      config: {
        temperature: 0.4,
        thinkingConfig: { thinkingBudget: 16000 }
      }
    });

    let fullText = "";
    for await (const chunk of responseStream) {
      const chunkText = chunk.text;
      if (chunkText) {
        fullText += chunkText;
        onChunk(fullText);
      }
    }
    return fullText;
  } catch (error: any) {
    console.error("Gemini Streaming Error:", error);
    
    if (error?.message?.includes("API_KEY_INVALID") || error?.message?.includes("403") || error?.message?.includes("invalid")) {
      onChunk("### ⚠️ Invalid API Key\nThe key provided was rejected. Please check your key in Google AI Studio and ensure billing is set up if using Pro models.");
    } else {
      onChunk("### ⚠️ Connection Error\nCould not reach the AI Professor. Please verify your API key and internet connection.");
    }
    return "";
  }
};
