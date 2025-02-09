"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<"word" | "sentence" | "story" | null>(null);
  const [particles, setParticles] = useState<{ id: number, x: number, size: number, delay: number }[]>([]);

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 20 + 5,
      delay: Math.random() * 10
    }));
    setParticles(newParticles);
  }, []);

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
        return "Oluşturulan hikaye, hafızanızı destekleyecek detayları içerir.";
      default:
        return "";
    }
  };

  const buttonTypes = [
    { type: "word", label: "Kelime", color: "bg-blue-500", hoverColor: "hover:bg-blue-600" },
    { type: "sentence", label: "Cümle", color: "bg-green-500", hoverColor: "hover:bg-green-600" },
    { type: "story", label: "Hikaye", color: "bg-purple-500", hoverColor: "hover:bg-purple-600" }
  ];

  return (
    <>
      <div className="bg-animation"></div>
      <div className="floating-particles">
        {particles.map((particle) => (
          <div 
            key={particle.id} 
            className="particle" 
            style={{
              left: `${particle.x}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
      </div>
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl bg-white/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-12 hover-3d gradient-border transform transition-all duration-300 hover:scale-105"
        >
          <motion.h1 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 tracking-tight"
          >
            Hafıza Destek Uygulaması
          </motion.h1>

          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hafızanızda tutmak istediğiniz içeriği buraya yazın..."
                className="w-full pl-12 pr-5 py-4 bg-white/70 border-2 border-blue-300 rounded-2xl focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:shadow-xl resize-y min-h-[200px] text-lg placeholder-blue-400 font-medium tracking-wide"
              />
              <div className="absolute bottom-3 right-3 text-sm text-gray-500">
                {input.length} / 500 karakter
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center space-x-6 mb-8">
            {buttonTypes.map(({ type: buttonType, label, color, hoverColor }) => (
              <motion.button
                key={buttonType}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleGenerate(buttonType as "word" | "sentence" | "story")}
                disabled={!input || loading}
                className={`
                  px-8 py-4 rounded-2xl text-white font-bold uppercase tracking-wider
                  transition-all duration-300 transform shadow-lg
                  ${color} ${hoverColor}
                  ${loading ? "opacity-50 cursor-not-allowed" : "hover:shadow-2xl"}
                  pulse-animation
                `}
              >
                {label}
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-gray-700 mb-6 text-lg font-semibold animate-pulse"
              >
                İçerik oluşturuluyor...
              </motion.div>
            )}

            {error && (
              <motion.div 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                className="bg-red-100/60 border border-red-300 text-red-800 px-6 py-4 rounded-2xl mb-6 text-center"
              >
                {error}
              </motion.div>
            )}

            {result && (
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                className="bg-green-100/60 border border-green-300 text-green-900 px-6 py-4 rounded-2xl text-center"
              >
                <p className="mb-3 text-xl font-semibold">{result}</p>
                {type && (
                  <p className="text-sm italic text-gray-600">
                    {getTypeDescription()}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
