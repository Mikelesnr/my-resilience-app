"use client";

import { useState, useEffect, useCallback } from "react";
import { BookOpen, Save, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { db, type JournalEntry } from "@/components/db";
import { useActiveProfile } from "@/components/auth/ActiveProfileContext"; // Consistent auth hook

export default function JournalPage() {
  const { activeUser } = useActiveProfile(); // Secure user identity
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 5;

  // Load entries strictly for the authenticated user
  const loadEntries = useCallback(async () => {
    if (!activeUser?.id) {
      setEntries([]);
      return;
    }

    const data = await db.journals
      .where("userId")
      .equals(activeUser.id)
      .reverse()
      .offset(page * pageSize)
      .limit(pageSize)
      .toArray();

    setEntries(data);
  }, [activeUser, page]);

  useEffect(() => {
    let cancelled = false;

    const fetchEntries = async () => {
      if (cancelled) return;
      await loadEntries();
    };

    void fetchEntries();

    return () => {
      cancelled = true;
    };
  }, [loadEntries]);

  const saveEntry = async () => {
    if (!entry.trim() || !activeUser?.id) return;

    await db.journals.add({
      content: entry,
      date: new Date().toISOString(),
      userId: activeUser.id, // Ensure record is tied to the correct user
    });

    setEntry("");
    toast.success("Entry saved!");
    setPage(0);
    loadEntries();
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8 font-sans">
      <header>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="text-teal-600" /> Daily Appreciation
        </h1>
        <p className="text-slate-500 text-sm">
          What are you grateful for today?
        </p>
      </header>

      {!activeUser ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-400">
          Please sign in to start your gratitude journal.
        </div>
      ) : (
        <>
          <div className="space-y-4">
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="w-full h-32 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden text-sm"
              placeholder="I appreciate..."
            />
            <button
              onClick={saveEntry}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 transition flex items-center gap-2 text-sm"
            >
              <Save className="w-4 h-4" /> Save Reflection
            </button>
          </div>

          <div className="space-y-4">
            <h2 className="font-semibold text-slate-700">Recent Reflections</h2>

            {entries.length > 0 ? (
              entries.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 border border-slate-100 rounded-lg shadow-xs text-sm text-slate-600"
                >
                  <p>{item.content}</p>
                  <div className="text-[10px] text-slate-400 mt-2 font-mono">
                    {new Date(item.date).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm italic">
                No entries yet. Start by writing above!
              </p>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 text-slate-600 disabled:opacity-30 hover:bg-slate-100 rounded-full transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="text-xs font-medium text-slate-500">
                Page {page + 1}
              </span>

              <button
                disabled={entries.length < pageSize}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 text-slate-600 disabled:opacity-30 hover:bg-slate-100 rounded-full transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
