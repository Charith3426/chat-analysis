"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function AnalysisPage() {
  const searchParams = useSearchParams();
  const result = searchParams.get("result") || "No analysis available.";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f7ff] to-[#ece9ff] p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white/60 backdrop-blur-xl rounded-3xl shadow-lg border border-white/40 p-6"
      >
        <h1 className="text-3xl font-extrabold text-center text-[#4b3cbf] mb-4">
          Your AI Chat Analysis
        </h1>

        {/* ANALYSIS BOX */}
        <div className="p-4 rounded-xl border border-[#d4cfff] bg-white/70 text-[#4b3cbf] whitespace-pre-line leading-relaxed">
          {result}
        </div>

      </motion.div>
    </div>
  );
}
