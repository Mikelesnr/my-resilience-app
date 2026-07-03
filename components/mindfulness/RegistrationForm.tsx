"use client";

import { UserPlus } from "lucide-react";

interface RegistrationFormProps {
  newUserName: string;
  setNewUserName: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function RegistrationForm({
  newUserName,
  setNewUserName,
  onSubmit,
}: RegistrationFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-3"
    >
      <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
        <UserPlus className="w-4 h-4 text-slate-600" /> Register a New Shared
        Profile
      </h2>
      <div className="flex flex-col sm:flex-row gap-2.5">
        <input
          type="text"
          placeholder="Enter nickname or initials..."
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          maxLength={20}
          className="flex-1 border border-slate-300 rounded-lg px-3 py-3 sm:py-2 text-sm sm:text-xs text-slate-800 placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition min-h-[44px]"
        />
        <button
          type="submit"
          className="bg-slate-800 text-white px-4 py-3 sm:py-2 rounded-lg text-sm sm:text-xs font-medium hover:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-500/20 transition shrink-0 min-h-[44px]"
        >
          Create Account
        </button>
      </div>
    </form>
  );
}
