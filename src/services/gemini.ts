/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { ScannedItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeItem(base64Image: string, mimeType: string): Promise<ScannedItem> {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          {
            text: "Analyze this image of a household item that might be thrown away. Identify the item name, its primary material, and its apparent condition. Then, suggest 5-8 creative upcycling projects for this specific item. For each project, provide a title, a brief description, difficulty rating (Easy, Medium, Hard), a list of additional materials needed, and step-by-step DIY instructions. Estimate the time required for each project."
          },
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          material: { type: Type.STRING },
          condition: { type: Type.STRING },
          suggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: "A unique slug-like ID" },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
                materialsNeeded: { type: Type.ARRAY, items: { type: Type.STRING } },
                steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                estimatedTime: { type: Type.STRING }
              },
              required: ["id", "title", "description", "difficulty", "materialsNeeded", "steps", "estimatedTime"]
            }
          }
        },
        required: ["name", "material", "condition", "suggestions"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to analyze item");
  }

  return JSON.parse(response.text) as ScannedItem;
}
