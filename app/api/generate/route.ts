import { NextRequest } from "next/server";
import { generateMemorableContent } from "@/app/lib/gemini";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    const body = await req.json();
    console.log("Received request body:", body);

    const { input, type } = body;

    if (!input || !type) {
      console.log("Missing required fields:", { input, type });
      return new Response(
        JSON.stringify({ error: "Metin ve tür alanları gereklidir" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    console.log("Calling Gemini API with:", { input, type });
    const result = await generateMemorableContent(input, type);
    console.log("Gemini API response:", result);

    return new Response(
      JSON.stringify({ result }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Detailed error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Bir hata oluştu: " + (error instanceof Error ? error.message : "Bilinmeyen hata") 
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}