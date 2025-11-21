import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    console.log("🔵 API HIT");

    const formData = await req.formData();
    const nickname = formData.get("nickname") || "";
    const text = formData.get("text") || "";
    const file = formData.get("file");

    console.log("🟣 FormData received.");
    console.log("🟢 Chat text:", text ? "Yes" : "No text");
    console.log("🟢 File:", file ? "Received" : "No file");

    let imageBase64 = null;

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      imageBase64 = buffer.toString("base64");
      console.log("🟢 Image converted to base64");
    }

    console.log("🔵 Loading Gemini…");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
    });

    // ⭐ FINAL GEN-Z PERSONALITY PROMPT ⭐
    const prompt = `
You are a chat/emotional analysis expert BUT your personality is full chaotic Gen-Z bestie.

Tone rules:
- Funny, dramatic, unserious but RIGHT
- Sass but not rude
- Emojis everywhere 😭🔥💀😌💅
- Short punchy sentences
- No long paragraphs
- NEVER formal
- NEVER robotic
- Sound like a chaotic Gen-Z friend giving advice
- MUST feel human, fun, relatable

NO ### headings.  
NO "as an AI".  
NO apologies.  

Your structure MUST ALWAYS be:

Vibe check:
(one or two lines, dramatic Gen-Z commentary)

What’s really going on:
(explain hidden meaning in funny Gen-Z tone)

Flags:
(red + green flags but in chaotic Gen-Z style)

Comeback options:
(3 short replies the user can send, funny or cute)

Now analyze this chat in that exact energy:

Nickname: ${nickname || "None"}
Chat Text: ${text || "None"}

Use the screenshot if provided.
`;

    console.log("🟡 Sending to Gemini…");

    const result = await model.generateContent([
      { text: prompt },
      imageBase64
        ? {
            inlineData: {
              data: imageBase64,
              mimeType: file.type,
            },
          }
        : null,
    ]);

    console.log("🟢 Gemini response received!");

    const responseText = result.response.text();

    return NextResponse.json(
      {
        success: true,
        analysis: responseText,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ GEMINI ERROR:", err);
    return NextResponse.json(
      { error: "Failed to analyze. Please try again." },
      { status: 500 }
    );
  }
}
