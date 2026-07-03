"use client";

import { useState } from "react";
import { type LocalUser } from "@/components/db";
import { hashPassword } from "@/components/auth/crypto";
import { Lock, CheckCircle, X } from "lucide-react";
import toast from "react-hot-toast";

interface ProfileGateFormProps {
  pendingUser: LocalUser;
  onUnlockSuccess: (unlockedUser: LocalUser) => void;
  onCancel: () => void;
}

export function ProfileGateForm({
  pendingUser,
  onUnlockSuccess,
  onCancel,
}: ProfileGateFormProps) {
  const [passwordInput, setPasswordInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
      // Re-hash credentials against the unique profile salt in Dexie
      const { hash } = await hashPassword(passwordInput, pendingUser.salt);

      if (hash === pendingUser.passwordHash) {
        onUnlockSuccess(pendingUser);
        toast.success(`Welcome back, ${pendingUser.name}!`);
      } else {
        toast.error("Incorrect profile password.");
      }
    } catch {
      toast.error("Hardware cryptographic processing failure.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <form
      onSubmit={handleUnlockSubmit}
      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md w-full max-w-sm space-y-4 relative"
    >
      <button
        type="button"
        onClick={onCancel}
        className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg transition"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="text-center space-y-1">
        <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-2 text-teal-600">
          <Lock className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Verify Identity</h3>
        <p className="text-slate-500 text-xs">
          Enter credentials to unlock workspace for{" "}
          <span className="font-bold text-teal-600">@{pendingUser.name}</span>
        </p>
      </div>

      <input
        type="password"
        required
        disabled={isVerifying}
        placeholder="••••••••"
        value={passwordInput}
        onChange={(e) => setPasswordInput(e.target.value)}
        className="w-full border border-slate-300 rounded-xl px-3 py-3 text-center text-sm font-bold tracking-widest text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 min-h-[44px]"
      />

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold transition min-h-[44px]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isVerifying}
          className="flex-1 bg-slate-800 text-white hover:bg-slate-900 rounded-xl text-xs font-semibold transition min-h-[44px] flex items-center justify-center gap-1"
        >
          {isVerifying ? (
            "Verifying..."
          ) : (
            <>
              <CheckCircle className="w-3.5 h-3.5" /> Unlock
            </>
          )}
        </button>
      </div>
    </form>
  );
}
