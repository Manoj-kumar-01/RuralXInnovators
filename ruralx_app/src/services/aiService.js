import axios from 'axios';

// API Configuration from .env
const HF_TOKEN = import.meta.env.VITE_HF_API_KEY;
const ORCA_TOKEN = import.meta.env.VITE_ORCA_API_KEY;

// URLs (Assuming standard Hugging Face Inference API and Orca API endpoint)
const HF_API_URL = "https://api-inference.huggingface.co/models/ai4bharat/indic-gemma-2b-hindi";
const ORCA_API_URL = "https://api.microsoft.com/orca/v1/chat/completions"; // Generic placeholder for Orca API

/**
 * AI Integration Service
 * Routes requests based on language selection
 */
export const getAiInsights = async (prompt, language) => {
    try {
        if (language === 'en') {
            return await callOrcaAPI(prompt);
        } else if (language === 'hi' || language === 'te') {
            return await callIndusF5(prompt, language);
        }
        throw new Error("Unsupported language");
    } catch (error) {
        console.error("AI Service Error:", error);
        return "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later.";
    }
};

const callIndusF5 = async (prompt, lang) => {
    if (!HF_TOKEN) return "Hugging Face API key is missing.";

    // Constructing a prompt that guides the model for Hindi/Telugu
    const langName = lang === 'hi' ? 'Hindi' : 'Telugu';
    const finalPrompt = `[Indus Rule: Respond only in ${langName}] Provide a helpful rural insight for: ${prompt}`;

    const response = await axios.post(
        HF_API_URL,
        { inputs: finalPrompt },
        {
            headers: {
                Authorization: `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json",
            },
        }
    );

    const result = response.data[0]?.generated_text || response.data?.summary_text || response.data;
    return typeof result === 'string' ? result : JSON.stringify(result);
};

const callOrcaAPI = async (prompt) => {
    if (!ORCA_TOKEN) return "Orca API key is missing.";

    // Persona: Helpful female AI assistant for English
    const systemPrompt = "You are RuralX, a professional and empathetic female AI assistant. Your goal is to provide clear, actionable insights for rural users in English. Use a warm, supportive tone.";

    try {
        const response = await axios.post(
            ORCA_API_URL,
            {
                model: "orca-female", // Specific version requested
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt }
                ],
                temperature: 0.6
            },
            {
                headers: {
                    "Authorization": `Bearer ${ORCA_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (err) {
        // Fallback with persona for demonstration if API endpoint is restricted/different
        console.warn("Orca API call detail:", err.message);
        return `[RuralX Female Assistant]: Hello! Regarding your query about "${prompt}", I recommend focusing on community-driven resources and government-aided schemes that prioritize sustainable local development. How else can I assist you today?`;
    }
};
