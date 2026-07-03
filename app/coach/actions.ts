"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize using the server-only environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateReframing(userMsg: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5" });

    const systemPrompt = `You are a warm wellness coach in an educational health app. 
Help the user reframe the following negative thought into a balanced view. 
Limit the response to 3 clear sentences max. Avoid professional medical jargon. 
User thought: "${userMsg}"`;

    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();

    return { success: true, text: responseText };
  } catch (error) {
    console.error("Gemini Server Action Error:", error);
    return { success: false, error: "Could not reach service context." };
  }
}
