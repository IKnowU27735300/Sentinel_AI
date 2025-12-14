import { GoogleGenAI } from "@google/genai";
import { AgentConfiguration } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateAgentAdvice = async (
  prompt: string,
  currentConfig: AgentConfiguration
): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please check your environment variables.";
  }

  const systemInstruction = `
    You are 'Sentinel', an expert DevOps AI assistant for configuring a Server Maintenance Agent.
    
    Your goal is to help the user configure their maintenance windows, services, and security rules.
    
    Current User Configuration Context:
    ${JSON.stringify(currentConfig, null, 2)}
    
    Guidelines:
    1. Be concise and technical but accessible.
    2. If the user asks about schedule, analyze the current window.
    3. If asked about security, recommend least-privilege principles.
    4. Provide YAML snippets if asked for configuration files.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error trying to process your request. Please check the console.";
  }
};