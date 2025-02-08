import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY as string;

if (!apiKey) {
  throw new Error("GOOGLE_API_KEY is not defined in environment variables");
}

console.log("API Key length:", apiKey.length);
console.log("API Key starts with:", apiKey.substring(0, 10));

const genAI = new GoogleGenerativeAI(apiKey);

export async function generateMemorableContent(
  input: string,
  type: "word" | "sentence" | "story"
) {
  try {
    console.log("Initializing Gemini model with API key:", apiKey.slice(0, 5) + "...");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let prompt = "";
    switch (type) {
      case "word":
        prompt = `Verilen metinden yola çıkarak akılda kalıcı, şifre benzeri, kolay hatırlanabilir TEK BİR KELİME oluştur.
        Bu kelime, verilen metni hatırlatacak ve mnemonic (hafıza tekniği) görevi görecek şekilde olmalı.
        Sadece kelimeyi döndür, başka açıklama yapma.
        Girdi: ${input}`;
        break;
      case "sentence":
        prompt = `Verilen metinden yola çıkarak akılda kalıcı, özlü ve anlamlı bir hatırlatma cümlesi oluştur.
        Bu cümle:
        - Verilen metnin ana fikrini içermeli
        - Kolay hatırlanabilir olmalı
        - Mümkünse kafiyeli veya ritimli olmalı
        - En fazla 10-15 kelime olmalı
        Sadece cümleyi döndür, başka açıklama yapma.
        Girdi: ${input}`;
        break;
      case "story":
        prompt = `Verilen metinden yola çıkarak mini bir hatırlatıcı hikaye oluştur.
        Bu hikaye:
        - En fazla 3 cümle olmalı
        - Akılda kalıcı ve çarpıcı olmalı
        - Ana fikri korumalı
        - Görsel detaylar içermeli
        - Duygusal bağ kurmalı
        Sadece hikayeyi döndür, başka açıklama yapma.
        Girdi: ${input}`;
        break;
    }

    console.log("Sending prompt to Gemini:", prompt);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Received response from Gemini:", text);
    
    return text;
  } catch (error) {
    console.error("Error in generateMemorableContent:", error);
    throw error;
  }
}
