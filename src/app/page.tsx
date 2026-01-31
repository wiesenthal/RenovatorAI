"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !prompt) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/renovate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate renovation");
      }

      setResult(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[100dvh] bg-gradient-to-b from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">RenovatorAI</h1>
        <p className="text-slate-400 text-center mb-8">
          Upload a photo of your space and describe your dream renovation
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              image
                ? "border-green-500 bg-green-500/10"
                : "border-slate-600 hover:border-slate-500 hover:bg-slate-800/50"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            {image ? (
              <div className="relative w-full aspect-video">
                <Image
                  src={image}
                  alt="Uploaded space"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="py-8">
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-slate-400">Click to upload an image of your space</p>
              </div>
            )}
          </div>

          {/* Prompt Input */}
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium mb-2">
              Describe your renovation
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Modern minimalist kitchen with white marble countertops and gold fixtures"
              className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none h-24"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!image || !prompt || loading}
            className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Generating...
              </span>
            ) : (
              "Generate Renovation"
            )}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-500/20 border border-red-500 text-red-200">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Your Renovated Space</h2>
            <div className="relative w-full aspect-video rounded-xl overflow-hidden">
              <Image
                src={result}
                alt="Renovated space"
                fill
                className="object-contain"
              />
            </div>
            <a
              href={result}
              download="renovation.png"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block py-2 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              Download Image
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
