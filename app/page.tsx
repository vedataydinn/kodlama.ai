"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<"word" | "sentence" | "story" | null>(null);

  const handleGenerate = async (selectedType: "word" | "sentence" | "story") => {
    try {
      setLoading(true);
      setError(null);
      setType(selectedType);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input, type: selectedType }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Bir hata oluştu");
      }

      if (data.result) {
        setResult(data.result);
      } else {
        throw new Error("Beklenmeyen API yanıtı");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Bir hata oluştu. Lütfen tekrar deneyin.");
      setResult("");
    } finally {
      setLoading(false);
    }
  };

  const getTypeDescription = () => {
    switch (type) {
      case "word":
        return "Oluşturulan kelimeyi şifre veya hatırlatıcı olarak kullanabilirsiniz.";
      case "sentence":
        return "Bu cümle, ana fikri hatırlamanıza yardımcı olacak şekilde tasarlandı.";
      case "story":
        return "Bu mini hikaye, içeriği akılda kalıcı bir şekilde hatırlamanızı sağlayacak.";
      default:
        return "";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">
            Hafıza Asistanı
          </h1>
          <p className="text-gray-600">
            Metninizi hatırlamanıza yardımcı olacak akılda kalıcı içerikler oluşturun
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
          <div className="space-y-2">
            <label htmlFor="input" className="block text-sm font-medium text-gray-700">
              Hatırlamak İstediğiniz Metin
            </label>
            <textarea
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Metninizi buraya yazın..."
              className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => handleGenerate("word")}
              disabled={loading || !input}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
            >
              Kelime
            </button>
            <button
              onClick={() => handleGenerate("sentence")}
              disabled={loading || !input}
              className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
            >
              Cümle
            </button>
            <button
              onClick={() => handleGenerate("story")}
              disabled={loading || !input}
              className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors duration-200"
            >
              Hikaye
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center p-4 bg-white rounded-lg shadow-md">
            <div className="animate-pulse text-gray-600">
              İçerik oluşturuluyor...
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {result && !loading && !error && (
          <div className="bg-white p-6 rounded-xl shadow-lg space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">
              Hatırlatıcı İçerik
            </h2>
            <p className="text-sm text-gray-600">
              {getTypeDescription()}
            </p>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{result}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
