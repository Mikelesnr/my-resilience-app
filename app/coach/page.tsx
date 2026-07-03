"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MessageSquare, Smile } from "lucide-react";

interface MsgProps {
  sender: "user" | "coach";
  text: string;
}

export default function CoachPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<MsgProps[]>([
    {
      sender: "coach",
      text: "Hello! Welcome to the Cognitive Reframing module. Let's work together to look at frustrating thoughts from a balanced perspective.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setLoading(true);

    try {
      // Using the exact environment variable that worked for you originally
      const genAI = new GoogleGenerativeAI(
        process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
      );

      // Using the 2.5 model endpoint that fixed the 404 error
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const systemPrompt = `You are a warm wellness coach in an educational health app. 
Help the user reframe the following negative thought into a balanced view. 
Limit the response to 3 clear sentences max. Avoid professional medical jargon. 
User thought: "${userMsg}"`;

      const result = await model.generateContent(systemPrompt);

      setMessages((prev) => [
        ...prev,
        { sender: "coach", text: result.response.text() },
      ]);
      toast.success("New perspective generated!");
    } catch (err) {
      console.error(err);
      toast.error("Could not reach service context.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto font-sans">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-[family-name:var(--font-serif)] font-bold text-slate-800 flex items-center gap-2">
          <Smile className="text-purple-600 w-7 h-7" /> Guided Emotional Coach
        </h1>
        <p className="text-slate-600 text-xs mt-1 font-sans">
          Practice reframing regular stressful thoughts interactively.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-xs h-[360px] flex flex-col overflow-hidden">
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 text-xs font-sans">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 ${
                  m.sender === "user"
                    ? "bg-purple-700 text-white"
                    : "bg-white text-slate-800 border border-slate-200"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <form
          onSubmit={sendMessage}
          className="p-2 border-t border-slate-200 bg-white flex gap-2 font-sans"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              loading ? "Coach is thinking..." : "Type a stressful thought..."
            }
            disabled={loading}
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 bg-white focus:outline-hidden focus:border-purple-600 disabled:bg-slate-100"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-slate-900 transition flex items-center gap-1 disabled:bg-slate-400"
          >
            <MessageSquare className="w-3.5 h-3.5" />{" "}
            {loading ? "Thinking..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
