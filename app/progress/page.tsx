"use client";

import { useEffect, useState } from "react";
import { db, type WellnessLog } from "@/components/db";
import { useActiveProfile } from "@/components/auth/ActiveProfileContext";
import { BarChart, CheckCircle } from "lucide-react";

export default function ProgressPage() {
  const { activeUser } = useActiveProfile(); // Use the global identity
  const [history, setHistory] = useState<WellnessLog[]>([]);

  // Fetch history strictly for the currently signed-in profile
  useEffect(() => {
    if (!activeUser?.id) return;

    let cancelled = false;

    db.history
      .where("userId")
      .equals(activeUser.id)
      .reverse()
      .toArray()
      .then((results) => {
        if (!cancelled) setHistory(results);
      });

    return () => {
      cancelled = true;
    };
  }, [activeUser?.id]);

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <BarChart className="text-amber-600" /> Health Analytics
        </h1>
        <p className="text-slate-600 text-xs mt-1">
          Review the historical data trends from your completed stress control
          sessions.
        </p>
      </div>

      {!activeUser ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-400">
          Please sign in to view your personal progress logs.
        </div>
      ) : (
        <>
          {/* Dashboard Summary Block */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Sessions for {activeUser.name}
            </span>
            <span className="text-xl font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">
              {history.length}
            </span>
          </div>

          {/* Logs Stack */}
          <div className="space-y-3">
            {history.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-400">
                You haven&#39;t recorded any session metrics yet.
              </div>
            ) : (
              history.map((log) => (
                <div
                  key={log.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <span className="text-slate-400 font-medium block">
                      {log.date}
                    </span>
                    <p className="text-slate-700 font-medium flex items-center gap-1 truncate">
                      <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />{" "}
                      <span className="truncate">{log.notes}</span>
                    </p>
                  </div>
                  <div className="text-right border-l border-slate-100 pl-4 shrink-0">
                    <span className="text-slate-400 block mb-0.5">
                      Stress Shift
                    </span>
                    <span className="font-bold text-slate-700">
                      <span className="text-rose-600">{log.stressBefore}</span>{" "}
                      → <span className="text-teal-600">{log.stressAfter}</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
