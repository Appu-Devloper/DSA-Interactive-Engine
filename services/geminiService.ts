import { GoogleGenAI } from "@google/genai";

const MODEL_CANDIDATES = [
  "gemini-3-flash-preview",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];

const buildPrompt = (
  algoName: string,
  query: string,
  context: { complexity: string; category: string }
) => `You are a world-class Computer Science Professor.
Explain ${algoName} (a ${context.category} algorithm with ${context.complexity} complexity).
User Question: "${query}"

Instructions:
1. Use Markdown for structure: ### for headers, **bold** for key terms.
2. Use bullet points for steps.
3. If providing code, use triple backticks with the language name.
4. Use analogies to explain abstract concepts.
5. Include an "Interview Tip" or "Common Pitfall" section when relevant.
6. For Big-O notation, use the format O(n) or O(log n).`;

const toErrorText = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    const maybeMessage = (error as { message?: unknown }).message;
    if (typeof maybeMessage === "string") return maybeMessage;
  }
  return String(error);
};

const isInvalidKeyError = (errorText: string): boolean =>
  /API_KEY_INVALID|invalid api key|permission denied|forbidden|403/i.test(errorText);

const isQuotaOrRateLimitError = (errorText: string): boolean =>
  /429|RESOURCE_EXHAUSTED|quota exceeded|rate.?limit/i.test(errorText);

export const getAlgorithmExplanationStream = async (
  algoName: string,
  query: string,
  context: { complexity: string; category: string },
  manualApiKey: string,
  onChunk: (text: string) => void
) => {
  try {
    if (!manualApiKey || manualApiKey.trim() === "") {
      onChunk("### API Key Required\nPlease provide your Gemini API key in the configuration panel above to enable the AI Tutor.");
      return "";
    }

    const ai = new GoogleGenAI({ apiKey: manualApiKey });
    const prompt = buildPrompt(algoName, query, context);
    let lastError: unknown = null;

    for (let i = 0; i < MODEL_CANDIDATES.length; i++) {
      const model = MODEL_CANDIDATES[i];
      try {
        const responseStream = await ai.models.generateContentStream({
          model,
          contents: prompt,
          config: {
            temperature: 0.4,
          },
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
      } catch (modelError) {
        lastError = modelError;
        const errorText = toErrorText(modelError);
        const isInvalidKey = isInvalidKeyError(errorText);
        const canTryNextModel = i < MODEL_CANDIDATES.length - 1 && !isInvalidKey;

        if (!canTryNextModel) {
          break;
        }
      }
    }

    throw lastError ?? new Error("Unknown Gemini streaming failure");
  } catch (error: unknown) {
    console.error("Gemini Streaming Error:", error);

    const errorText = toErrorText(error);
    if (isInvalidKeyError(errorText)) {
      onChunk("### Invalid API Key\nThe key provided was rejected. Please verify it in Google AI Studio.");
    } else if (isQuotaOrRateLimitError(errorText)) {
      onChunk("### Quota Limit Reached\nYour Gemini quota is exhausted or rate-limited. Wait and retry, or use a key/project with available quota.");
    } else {
      onChunk("### Connection Error\nCould not reach the AI Tutor. Please verify your API key and internet connection.");
    }
    return "";
  }
};
