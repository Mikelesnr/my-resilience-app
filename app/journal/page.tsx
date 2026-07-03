"use client";

import { useState, useEffect } from "react";
import { BookOpen, Save, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { db } from "@/components/db"; // Assuming this is your existing DB

export default function JournalPage() {
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const all = await db.history.toArray(); // Adjust based on your schema
    setEntries(all.reverse());
  };

  const saveEntry = async () => {
    if (!entry.trim()) return;
    await db.history.add({
      content: entry,
      date: new Date().toISOString(),
      type: "gratitude",
    });
    setEntry("");
    toast.success("Entry saved!");
    loadEntries();
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="text-teal-600" /> Daily Appreciation
        </h1>
        <p className="text-slate-500 text-sm">
          What are you grateful for today?
        </p>
      </header>

      <div className="space-y-4">
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          className="w-full h-32 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden"
          placeholder="I appreciate..."
        />
        <button
          onClick={saveEntry}
          className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 transition flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save Reflection
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-slate-700">Recent Reflections</h2>
        {entries.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 border border-slate-100 rounded-lg shadow-xs text-sm text-slate-600"
          >
            {item.content}
            <div className="text-[10px] text-slate-400 mt-2">
              {new Date(item.date).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
