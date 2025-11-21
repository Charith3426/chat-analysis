"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Page() {
  const [start, setStart] = useState(false);
  const [nickname, setNickname] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!text && !file) {
      setMessage("Please paste text or upload a screenshot.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const form = new FormData();
      form.append("nickname", nickname);
      form.append("text", text);
      if (file) form.append("file", file);

      const res = await fetch("/api/submit", {
        method: "POST",
        body: form,
      });

      const j = await res.json();

      if (res.ok) {
        window.location.href = `/analysis?result=${encodeURIComponent(j.analysis)}`;
      } else {
        setMessage(j.error || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f7ff] to-[#ece9ff] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/60 backdrop-blur-xl rounded-3xl shadow-lg border border-white/40 p-6"
      >
        {/* TITLE */}
        <h1 className="text-3xl font-extrabold text-center mb-2 text-[#4b3cbf]">
          AI Chat Analysis
        </h1>

        {/* FUNNY WELCOME LINE */}
        {!start && (
          <p className="text-center text-sm text-[#6b5cd4] mb-6">
            Upload your chats… I promise I won’t judge. <br />
            (Okay maybe a little.)
          </p>
        )}

        {/* CONTINUE BUTTON */}
        {!start ? (
          <button
            onClick={() => setStart(true)}
            className="w-full bg-[#6b5cd4] hover:bg-[#5a4ac0] text-white py-3 rounded-xl text-lg"
          >
            Continue
          </button>
        ) : (
          // FORM SECTION
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Nickname */}
            <div>
              <label className="text-sm font-semibold text-[#4b3cbf]">
                Nickname (optional)
              </label>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full p-3 border rounded-xl border-[#d4cfff] text-[#4b3cbf] placeholder-[#b9a8ff] focus:ring-2 focus:ring-[#6b5cd4]/40 mt-2"
                placeholder="e.g. A"
              />
            </div>

            {/* Chat Text */}
            <div>
              <label className="text-sm font-semibold text-[#4b3cbf]">
                Paste Chat Text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-3 border rounded-xl border-[#d4cfff] text-[#4b3cbf] placeholder-[#b9a8ff] focus:ring-2 focus:ring-[#6b5cd4]/40 mt-2 min-h-[120px]"
                placeholder="Paste chat here..."
              />
            </div>

            {/* Custom Upload Button */}
            <div>
              <label className="text-sm font-semibold text-[#4b3cbf]">
                Upload Screenshot
              </label>

              <label
                htmlFor="fileUpload"
                className="mt-3 flex items-center justify-center w-full bg-[#6b5cd4] hover:bg-[#5a4ac0] text-white py-3 rounded-xl text-sm cursor-pointer transition"
              >
                {file ? "Change File" : "Choose File"}
              </label>

              <input
                id="fileUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />

              {file && (
                <p className="text-xs text-[#4b3cbf] mt-2 text-center">
                  Selected: {file.name}
                </p>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#48c78e] hover:bg-[#3fb27e] text-white py-3 rounded-xl text-lg"
            >
              {loading ? "Analyzing..." : "Submit for Analysis"}
            </button>
          </form>
        )}

        {message && (
          <p className="mt-4 text-center text-sm text-[#4b3cbf]">{message}</p>
        )}
      </motion.div>
    </div>
  );
}
