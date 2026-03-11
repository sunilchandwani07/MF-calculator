import { GoogleGenAI } from "@google/genai";

async function main() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: 'A professional, modern, and eye-catching logo for a wealth management company named "Vibrant Wealth Management". The logo should feature a stylized "V" or a symbol representing growth and prosperity (like a rising graph or a leaf). Use a vibrant color palette with emerald green and gold. Minimalist design, white background, high resolution.',
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
      },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      console.log("LOGO_BASE64_START");
      console.log(part.inlineData.data);
      console.log("LOGO_BASE64_END");
    }
  }
}

main();
